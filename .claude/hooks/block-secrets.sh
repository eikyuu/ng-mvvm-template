#!/bin/bash
INPUT=$(cat)
CMD=$(echo "$INPUT" | jq -r '.tool_input.command // empty')
if echo "$CMD" | grep -qEi '(AKIA|sk-|ghp_|password=)'; then
    echo "BLOCKED: Potential secret in command" >&2
    exit 2
fi