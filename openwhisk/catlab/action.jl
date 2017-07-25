#!/usr/bin/env julia
import JSON

using Catlab.Doctrine
import Catlab.Diagram: Graphviz
using Catlab.Diagram: Wiring, GraphvizWiring


function expression_to_graphviz()::Graphviz.Graph
  # XXX: Hard-code an expression for now!
  A, B, C = Ob(FreeCartesianCategory, :A, :B, :C)
  f, g, h = Hom(:f, A, B), Hom(:g, B, C), Hom(:h, A, C)
  expr = otimes(compose(f, g), h)
  to_graphviz(to_wiring_diagram(expr))
end


function main(args::Vector{String})
  # Parse JSON and action parameters.
  params = JSON.parse(args[1])
  action = params["action"]
  
  # Run action!
  result = if action == "expression_to_graphviz"
    graph = expression_to_graphviz()
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
