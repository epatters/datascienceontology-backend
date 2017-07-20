#!/usr/bin/env python 

import json
import subprocess
import sys

PROGRAMS = [
    "dot",
    "neato",
    "sfdp"
    "fdp",
    "twopi",
    "circo",
]

MIMETYPES = {
    "dot" : "text/vnd.graphviz",
    "gv" : "text/vnd.graphviz",
    "xdot" : "text/vnd.graphviz",
    "json" : "application/json",
    "json0" : "application/json",
    "dot_json" : "application/json",
    "dot_json0": "application/json",
    "jpg" : "image/jpeg",
    "jpeg" : "image/jpeg",
    "png" : "image/png",
    "svg" : "image/svg+xml",
}


"""  Wrap Graphviz with a JSON API: a simple OpenWhisk docker action.
"""
def main(argv):
    # Parse JSON and action parameters.
    params = json.loads(argv[1])
    graph, prog, fmt = params["graph"], params["prog"], params["format"]
    assert prog in PROGRAMS
    assert fmt in MIMETYPES
    
    # Run Graphviz!
    ran = subprocess.run([prog, "-T"+fmt], input=graph, encoding="utf-8",
                         stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    # Build the response and print to stdout.
    if ran.returncode == 0:
        result = {
            "success": True,
            "data": ran.stdout,
            "format": fmt,
            "mimetype": MIMETYPES[fmt],
        }
    else:
        result = {
            "success": False,
            "stdout": ran.stdout,
            "stderr": ran.stderr,
        }
    json.dump(result, sys.stdout)
    

if __name__ == '__main__':
    main(sys.argv)
