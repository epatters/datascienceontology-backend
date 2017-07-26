import "mocha";
import * as assert from "assert";

import { MorphismConcept } from "../src/interfaces/concept";
import { morphismToExpr } from "../src/syntax";


describe("convert concept definition to s-expression", () => {
  it("simple morphism", () => {
    const morphism: MorphismConcept = {
      id: "read-tabular-file",
      kind: "morphism",
      name: "read table from file",
      domain: [
        { object: "file" }
      ],
      codomain: [
        { object: "table"}
      ]
    };
    assert.deepEqual(morphismToExpr(morphism),
      ["Hom",
        "read-tabular-file",
        ["Ob", "file"],
        ["Ob", "table"]]
    );
  });
  
  it("morphism with compound domain", () => {
    const morphism: MorphismConcept = {
      id: "predict",
      kind: "morphism",
      name: "make predictions",
      domain: [
        { object: "supervised-model" },
        { object: "data" }
      ],
      codomain: [
        { object: "data"}
      ]
    };
    assert.deepEqual(morphismToExpr(morphism),
      ["Hom",
        "predict",
        ["otimes", ["Ob", "supervised-model"], ["Ob", "data"]],
        ["Ob", "data"]]
    );
  });
});
