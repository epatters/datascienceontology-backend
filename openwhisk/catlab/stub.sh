#!/bin/bash

echo \
'This is a stub action that should be replaced with user code (e.g., script or compatible binary).
The input to the action is received as an argument from the command line.
Actions may log to stdout or stderr. By convention, the last line of output must
be a stringified JSON object which represents the result of the action.'

julia_version=`julia -v`
echo "{\"response\": \"${julia_version}\"}"
