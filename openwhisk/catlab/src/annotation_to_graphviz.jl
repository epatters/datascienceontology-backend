#!/usr/bin/env julia
import JSON

using Catlab
import Catlab.Diagram: Graphviz
using Catlab.Diagram: Wiring, GraphvizWiring
using OpenDiscCore


""" Convert morphism annotation in data science ontology to Graphviz graph.
"""
function annotation_to_graphviz(id; kw...)::Graphviz.Graph
  db = OntologyDB()
  note = load_annotation(db, id)::HomAnnotation
  to_graphviz(to_wiring_diagram(note.definition); kw...)
end


function parse_graphviz_attrs(attrs::Associative)::Graphviz.Attributes
  Graphviz.Attributes(Symbol(k) => string(v) for (k,v) in attrs)
end

function main(params::Dict)
  id = if haskey(params, "_id")
    params["_id"]
  elseif all(haskey(params, k) for k in ("language", "package", "id"))
    AnnotationID(params["language"], params["package"], params["id"])
  else
    return Dict("error" => "Must supply annotation ID")
  end
  
  graph = annotation_to_graphviz(id;
    labels = get(params, "labels", false),
    xlabel = get(params, "xlabel", false),
    graph_attrs = parse_graphviz_attrs(get(params, "graph_attrs", Dict())),
    node_attrs = parse_graphviz_attrs(get(params, "node_attrs", Dict())),
    edge_attrs = parse_graphviz_attrs(get(params, "edge_attrs", Dict()))
  )
  dot = sprint(Graphviz.pprint, graph)
  return Dict(
    "data" => dot,
    "mimetype" => "text/vnd.graphviz",
  )
end

if current_module() == Main
  const PARAMS = JSON.parse(isempty(ARGS) ? "{}" : ARGS[1])
  JSON.print(main(PARAMS))
end
