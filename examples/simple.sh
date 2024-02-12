#! /usr/bin/env bin

tsxPath="$(pwd)/node_modules/.bin/tsx"
mainFile="$(pwd)/src/index.ts"
configsFile="$(pwd)/examples/configs.json"

# "$tsxPath" "$mainFile"
# "$tsxPath" "$mainFile" -s "$configsFile"
# "$tsxPath" "$mainFile" -u
# "$tsxPath" "$mainFile" -p
# "$tsxPath" "$mainFile" -pg
"$tsxPath" "$mainFile" -or
# "$tsxPath" "$mainFile" -oc

# "$tsxPath" "$mainFile" -h
# "$tsxPath" "$mainFile" -V

