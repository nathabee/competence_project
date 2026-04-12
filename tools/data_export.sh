#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "${SCRIPT_DIR}/helper/project_paths.sh"

OUTPUT_DIR="${BACKEND_ROOT}/script_db"
mkdir -p "${OUTPUT_DIR}"

run_manage_py dumpdata auth.group --indent 4 > "${OUTPUT_DIR}/groups.json"
run_manage_py dumpdata auth.permission --indent 4 > "${OUTPUT_DIR}/permissions.json"
run_manage_py dumpdata auth.user --indent 4 > "${OUTPUT_DIR}/users.json"