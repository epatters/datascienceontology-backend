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
  if !(isa(params, Dict) && haskey(params, "expression"))
    JSON.print(Dict("error" => "Must supply an S-expression"))
    return
  end
  sexpr = params["expression"]
  
  # Run the action!
  graph = expression_to_graphviz(sexpr;
    labels = get(params, "labels", false),
    xlabel = get(params, "xlabel", false),
  )
  dot = sprint(Graphviz.pprint, graph)
  result = Dict(
    "data" => dot,
    "mimetype" => "text/vnd.graphviz",
  )
  
  # Print result JSON to stdout.
  JSON.print(result)
end

main(ARGS)
