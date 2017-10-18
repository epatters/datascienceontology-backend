module TestExpressionToGraphviz
using Base.Test

include("../src/sexpr_to_graphviz.jl")

function has_graphviz(result)
  result["mimetype"] == "text/vnd.graphviz" && haskey(result, "data")
end

@test has_graphviz(main(Dict(
  "expression" => ["Hom", "f", ["otimes", ["Ob", "A"], ["Ob", "B"]], ["Ob", "C"]]
)))
@test has_graphviz(main(Dict(
  "expression" => ["id", ["Ob", "A"]]
)))

@test has_graphviz(main(Dict(
  # annotation/python/sklearn/fit-predict-clustering
  "expression" =>
    [ "compose",
      [ "Hom", 
        "fit",
        [ "otimes", "clustering-model", "data" ],
        "clustering-model",
      ],
      [ "pair",
        [ "id", "clustering-model" ],
        "clustering-model-clusters",
      ],
    ]
)))

end
