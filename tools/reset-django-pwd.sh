#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${PROJECT_DIR}"

echo "Reset to value:"
grep '^DEFAULT_USER_PASSWORD=' ./.env || true

# shellcheck disable=SC1091
source venv/bin/activate

python manage.py shell -c "
from django.conf import settings
from competence.models import CustomUser

users = ['jacques', 'jakob', 'jakez', 'james', 'nathaprof', 'nathachef']

for username in users:
    u = CustomUser.objects.get(username=username)
    u.set_password(settings.DEFAULT_USER_PASSWORD)
    u.save()
    print('reset:', username)
"

deactivate