#! /usr/bin/env bin

# REMMEMBER: if it does not work, chmod +x ./examples/simple.sh

tsxPath="$(pwd)/node_modules/.bin/tsx"
mainFile="$(pwd)/src/index.ts"
configsFile="$(pwd)/examples/configs.jsonc"

"$tsxPath" "$mainFile"
# "$tsxPath" "$mainFile" -s "$configsFile"
# "$tsxPath" "$mainFile" -u
# "$tsxPath" "$mainFile" -p
# "$tsxPath" "$mainFile" -pg
# "$tsxPath" "$mainFile" -or
# "$tsxPath" "$mainFile" -oc
# "$tsxPath" "$mainFile" -uc

# "$tsxPath" "$mainFile" -h
# "$tsxPath" "$mainFile" -V

