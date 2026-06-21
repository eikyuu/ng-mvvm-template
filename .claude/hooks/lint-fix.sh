#!/usr/bin/env bash
#
# Hook Stop — lance le lint avec auto-correction une seule fois, quand Claude a fini de répondre.

set -euo pipefail

# Une seule passe de lint:fix sur le projet (et non une par fichier édité).
npm run lint:fix