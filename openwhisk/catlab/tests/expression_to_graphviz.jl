module TestExpressionToGraphviz
using Base.Test

include("../src/expression_to_graphviz.jl")

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
    ["compose",
      ["Hom", "fit", ["otimes", ["Ob", "clustering-model"], ["Ob", "data"]], ["Ob", "clustering-model"]],
      ["pair",
        ["id", ["Ob", "clustering-model"]],
        ["Hom", "clustering-model-clusters", ["Ob", "clustering-model"], ["Ob", "vector"]]]]
)))

end
