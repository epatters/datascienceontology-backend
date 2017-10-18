using Base.Test

@testset "annotation_to_graphviz" begin
  include("annotation_to_graphviz.jl")
end

@testset "sexpr_to_graphviz" begin
  include("sexpr_to_graphviz.jl")
end
