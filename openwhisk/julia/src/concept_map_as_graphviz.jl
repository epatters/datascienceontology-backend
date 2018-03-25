#!/usr/bin/env julia
import JSON
using LightGraphs, MetaGraphs

using Catlab
import Catlab.Diagram: Graphviz
using OpenDiscCore


""" Visualize concepts as "concept map" or "mind map" using GraphViz.
"""
function concept_map()::MetaDiGraph
  # Load concept documents from database.
  db = OntologyDB()
  docs = OntologyDBs.CouchDB.find(db, Dict(
    "schema" => "concept",
  ))
  OntologyDBs.load_documents(db, docs)
  docs = Dict(doc["id"] => doc for doc in docs)

  # Create graphs for concept map and subobject relations.
  g = MetaDiGraph()
  set_props!(g, Dict(
    :graph => Dict(
      :fontname => "helvetica",
    ),
    :node => Dict(
      :fontname => "helvetica",
      :shape => "box",
      :style => "rounded",
      :width => "0",
      :height => "0",
    ),
    :edge => Dict(
      :fontname => "helvetica",
      :arrowsize => "0.75",
    ),
  ))
  g_subobjects = subobjects(concepts(db))

  # Add node for object generators.
  for ob in generators(concepts(db), Monocl.Ob)
    name = first(ob)
    add_vertex!(g, Dict(
      :id => name,
      :label => docs[name]["name"],
    ))
  end
  set_indexing_prop!(g, :id)

  # Add edges for subobject generators.
  for subob in generators(concepts(db), Monocl.SubOb)
    dom_v, codom_v = g[first(dom(subob)),:id], g[first(codom(subob)),:id]
    add_multi_edge!(g, dom_v, codom_v, Dict(
      :xlabel => "is",
    ))
  end

  # Add edges for morphism generators with simple domain and codomain.
  primitive_types = concepts(db, ["array", "scalar"])
  for hom in generators(concepts(db), Monocl.Hom)
    if !(head(dom(hom)) == :generator && head(codom(hom)) == :generator)
      continue
    end

    # Handle primitive types in codomain specially: create new node for each
    # occurrence, rather than linking back to original node.
    # This heuristic significantly improves the layout of the graph.
    dom_v, codom_v = g[first(dom(hom)),:id], g[first(codom(hom)),:id]
    if any(is_subobject(g_subobjects, codom(hom), ob) for ob in primitive_types)
      name = first(codom(hom))
      add_vertex!(g, Dict(
        :label => docs[name]["name"],
      ))
      codom_v = nv(g)
    end

    name = first(hom)
    add_multi_edge!(g, dom_v, codom_v, Dict(
      :id => name,
      :xlabel => docs[name]["name"]
    ))
  end
  return g
end

function add_multi_edge!(g::MetaDiGraph, u::Int, v::Int, data::Dict=Dict())
  if has_edge(g, u, v)
    push!(get_prop(g, u, v, :edges), data)
  else
    add_edge!(g, u, v, :edges, [data])
  end
end


""" Compute all (explicit and implicit) subojects as directed graph.

TODO: This computer algebra belongs somewhere else, possibly in Catlab.
"""
function subobjects(concepts::Presentation)::MetaDiGraph
  # Encode (explicit) subobject relations as directed graph.
  g = MetaDiGraph()
  for ob in generators(concepts, Monocl.Ob)
    add_vertex!(g, :name, first(ob))
  end
  set_indexing_prop!(g, :name)
  for subob in generators(concepts, Monocl.SubOb)
    add_edge!(g, g[first(dom(subob)),:name], g[first(codom(subob)),:name])
  end

  # Compute reflexive, transitive closure to obtain all subobject relations.
  g_trans = MetaDiGraph(transitiveclosure(g.graph))
  for v in vertices(g)
    add_edge!(g_trans, v, v) # add self loops
    set_prop!(g_trans, v, :name, get_prop(g, v, :name))
  end
  set_indexing_prop!(g_trans, :name)
  return g_trans
end

function is_subobject(g::MetaDiGraph,
                      ob1::Monocl.Ob{:generator}, ob2::Monocl.Ob{:generator})
  has_edge(g, g[first(ob1),:name], g[first(ob2),:name])
end


function main(params::Dict)::Dict
  graphviz = Graphviz.to_graphviz(concept_map(); multigraph=true)
  return Dict(
    "graph" => sprint(Graphviz.pprint, graphviz),
    "prog" => "neato",
  )
end

if current_module() == Main
  const PARAMS = JSON.parse(isempty(ARGS) ? "{}" : ARGS[1])
  JSON.print(main(PARAMS))
end
