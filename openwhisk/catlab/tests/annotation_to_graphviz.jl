module TestAnnotationToGraphviz
using Base.Test

include("../src/annotation_to_graphviz.jl")

function has_graphviz(result)
  result["mimetype"] == "text/vnd.graphviz" && haskey(result, "data")
end

@test has_graphviz(main(Dict(
  "_id" => "annotation/python/sklearn/fit"
)))
@test has_graphviz(main(Dict(
  "language" => "python",
  "package" => "sklearn",
  "id" => "fit"
)))

@test has_graphviz(main(Dict(
  "_id" => "annotation/python/sklearn/fit-predict-clustering"
)))

end
