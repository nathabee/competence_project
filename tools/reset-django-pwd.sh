#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "${SCRIPT_DIR}/helper/project_paths.sh"

if [[ -f "${PROJECT_ENV_FILE}" ]]; then
    echo "Reset to value:"
    grep '^DEFAULT_USER_PASSWORD=' "${PROJECT_ENV_FILE}" || true
fi

run_manage_py shell <<'PYCODE'
from django.conf import settings
from competence.models import CustomUser

users = ['jacques', 'jakob', 'jakez', 'james', 'nathaprof', 'nathachef']

for username in users:
    u = CustomUser.objects.get(username=username)
    u.set_password(settings.DEFAULT_USER_PASSWORD)
    u.save()
    print('reset:', username)
PYCODE