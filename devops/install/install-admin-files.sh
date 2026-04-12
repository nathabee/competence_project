#!/usr/bin/env bash
set -euo pipefail

sudo install -o root -g root -m 0755 \
  devops/host/competence-admin-runner \
  /usr/local/sbin/competence-admin-runner

sudo install -o root -g root -m 0440 \
  devops/host/jenkins-competence-admin \
  /etc/sudoers.d/jenkins-competence-admin

sudo visudo -cf /etc/sudoers.d/jenkins-competence-admin