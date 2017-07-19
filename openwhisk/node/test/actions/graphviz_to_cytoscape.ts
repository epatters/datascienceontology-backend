import "mocha";
import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";

import action from "../../src/actions/graphviz_to_cytoscape";


function readTestData(name: string): string {
  const fullname = path.join(__dirname, "../data", name);
  return fs.readFileSync(fullname).toString();
}

function readTestJSON(name: string): any {
  return JSON.parse(readTestData(name));
}


describe("graphviz_to_cytoscape action", () => {
  it("simple graph from the dot guide (Figure 1)", () => {
    const dot = readTestJSON("simple.dot.json");
    const actual = action({dot: dot}).cytoscape;
    const target = readTestJSON("simple.cytoscape.json");
    assert.deepEqual(actual, target);
  });
})
