#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

sudo install -d -o root -g root -m 0755 /usr/local/lib/competence-admin

sudo install -o root -g root -m 0755 \
  "${PROJECT_ROOT}/tools/setup_environment.sh" \
  /usr/local/lib/competence-admin/setup_environment.sh

sudo install -o root -g root -m 0755 \
  "${PROJECT_ROOT}/devops/host/competence-admin-runner" \
  /usr/local/sbin/competence-admin-runner

sudo install -o root -g root -m 0440 \
  "${PROJECT_ROOT}/devops/host/jenkins-competence-admin" \
  /etc/sudoers.d/jenkins-competence-admin

sudo visudo -cf /etc/sudoers.d/jenkins-competence-admin