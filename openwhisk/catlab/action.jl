#!/usr/bin/env julia
import JSON

using Catlab: Doctrine, Syntax
import Catlab.Diagram: Graphviz
using Catlab.Diagram: Wiring, GraphvizWiring


function expression_to_graphviz(sexpr::String)::Graphviz.Graph
  expr = parse_json(FreeCartesianCategory, JSON.parse(sexpr))
  to_graphviz(to_wiring_diagram(expr))
end


function main(args::Vector{String})
  # Parse JSON and action parameters.
  params = JSON.parse(args[1])
  action = params["action"]
  
  # Run action!
  result = if action == "expression_to_graphviz"
    graph = expression_to_graphviz(params["expression"])
    dot = sprint(Graphviz.pprint, graph)
    Dict(
      "success" => true,
      "data" => dot,
      "mimetype" => "text/vnd.graphviz",
    )
  else
    Dict(
      "success" => false,
      "error" => "Unknown subaction: $action",
    )
  end
  
  # Print result JSON to stdout.
  JSON.print(result)
end

main(ARGS)
