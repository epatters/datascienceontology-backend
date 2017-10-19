using Base.Test

@testset "annotation_to_graphviz" begin
  include("annotation_to_graphviz.jl")
end

@testset "morphism_to_graphviz" begin
  include("morphism_to_graphviz.jl")
end
