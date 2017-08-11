#!/usr/bin/env julia
import JSON

using Catlab
import Catlab.Diagram: Graphviz
using Catlab.Diagram: Wiring, GraphvizWiring
using OpenDiscCore


function expression_to_graphviz(sexpr; kw...)::Graphviz.Graph
  expr = parse_json(Monocl, sexpr)
  to_graphviz(to_wiring_diagram(expr); kw...)
end


function main(params::Dict)
  if !haskey(params, "expression")
    return Dict("error" => "Must supply an S-expression")
  end
    
  graph = expression_to_graphviz(
    params["expression"];
    labels = get(params, "labels", false),
    xlabel = get(params, "xlabel", false),
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
