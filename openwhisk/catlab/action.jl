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


function main(args::Vector{String})
  # Parse JSON and action parameters.
  params = isempty(args) ? Dict() : JSON.parse(args[1])
  if !(isa(params, Dict) && haskey(params, "action"))
    JSON.print(Dict(
      "success" => false,
      "error" => "Must supply a Julia action",
    ))
    return
  end
  action = params["action"]
  
  # Run action!
  result = if action == "expression_to_graphviz"
    graph = expression_to_graphviz(
      params["expression"];
      labels = get(params, "labels", false),
      xlabel = get(params, "xlabel", false),
    )
    dot = sprint(Graphviz.pprint, graph)
    Dict(
      "success" => true,
      "data" => dot,
      "mimetype" => "text/vnd.graphviz",
    )
  else
    Dict(
      "success" => false,
      "error" => "Unknown Julia action: $action",
    )
  end
  
  # Print result JSON to stdout.
  JSON.print(result)
end

main(ARGS)
