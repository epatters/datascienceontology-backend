import "mocha";
import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";

import action from "../../src/actions/dot_to_cytoscape";


function readTestData(name: string): string {
  const fullname = path.join(__dirname, "../data", name);
  return fs.readFileSync(fullname).toString();
}

function readTestJSON(name: string): any {
  return JSON.parse(readTestData(name));
}


describe("dot_to_cytoscape action", () => {
  it("simple graph from dot guide (Fig 1): dot output", () => {
    const dot = readTestJSON("simple.dot.json");
    const actual = action({data: dot}).data;
    const target = readTestJSON("simple.cytoscape.json");
    assert.deepEqual(actual, target);
  });
  
  it("simple graph from dot guide (Fig 1): xdot output", () => {
    const xdot = readTestJSON("simple.xdot.json");
    const actual = action({data: xdot}).data;
    const target = readTestJSON("simple.cytoscape.json");
    assert.deepEqual(actual, target);
  });
  
  it("wiring diagram from Catlab", () => {
    const dot = readTestJSON("wiring.dot.json");
    const actual = action({data: dot}).data;
    const target = readTestJSON("wiring.cytoscape.json");
    assert.deepEqual(actual, target);
  });
})
