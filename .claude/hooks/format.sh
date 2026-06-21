#!/usr/bin/env bash
#
# Hook PostToolUse — reformate avec Prettier le fichier que Claude vient d'éditer.
# Déclenché après chaque Edit/Write (filtrage du tool fait par le matcher du settings.json).

set -euo pipefail

# Claude Code envoie le contexte de l'événement en JSON sur l'entrée standard (stdin).
input=$(cat)

# On extrait le chemin du fichier touché. "// empty" évite une erreur si le champ est absent.
file_path=$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty')

# Garde-fous : on sort proprement (exit 0 = rien à signaler) si rien à formater.
[[ -z "$file_path" ]] && exit 0
[[ "$file_path" =~ \.(ts|html|scss|json)$ ]] || exit 0

# On ne reformate QUE le fichier concerné, pas tout le projet : c'est plus rapide.
npx prettier --write "$file_path"