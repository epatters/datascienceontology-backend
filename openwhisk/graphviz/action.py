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

FORMATS = [
    "dot",
    "gv",
    "xdot",
    "json",
    "json0",
    "dot_json",
    "dot_json0",
    "svg",
]


"""  Wrap Graphviz with a JSON API: a simple OpenWhisk docker action.
"""
def main(argv):
    # Parse JSON and action parameters.
    params = json.loads(argv[1])
    data, prog, fmt = params["data"], params["prog"], params["format"]
    assert prog in PROGRAMS
    assert fmt in FORMATS
    
    # Run Graphviz!
    ran = subprocess.run([prog, "-T"+fmt], input=data, encoding="utf-8",
                         stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    # Build the response and print to stdout.
    if ran.returncode == 0:
        data = json.loads(ran.stdout) if "json" in fmt else ran.stdout
        result = {
            "success": True,
            "data": data,
            "format": fmt,
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
