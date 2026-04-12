#!/usr/bin/env bash

PROJECT_ROOT="${PROJECT_ROOT:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
BACKEND_ROOT="${BACKEND_ROOT:-${PROJECT_ROOT}/backend}"
VENV_PATH="${VENV_PATH:-${BACKEND_ROOT}/venv}"
MANAGE_PY="${MANAGE_PY:-${BACKEND_ROOT}/manage.py}"
BACKEND_PYTHON="${BACKEND_PYTHON:-${VENV_PATH}/bin/python}"
PROJECT_ENV_FILE="${PROJECT_ENV_FILE:-${PROJECT_ROOT}/.env}"

ensure_project_root() {
    [[ -d "${PROJECT_ROOT}" ]] || {
        echo "ERROR: Project root not found: ${PROJECT_ROOT}" >&2
        return 1
    }
}

ensure_backend_root() {
    [[ -d "${BACKEND_ROOT}" ]] || {
        echo "ERROR: Backend root not found: ${BACKEND_ROOT}" >&2
        return 1
    }
}

ensure_manage_py() {
    [[ -f "${MANAGE_PY}" ]] || {
        echo "ERROR: manage.py not found: ${MANAGE_PY}" >&2
        return 1
    }
}

ensure_backend_venv() {
    [[ -x "${BACKEND_PYTHON}" ]] || {
        echo "ERROR: Backend Python executable not found: ${BACKEND_PYTHON}" >&2
        return 1
    }
}

run_manage_py() {
    ensure_project_root || return 1
    ensure_backend_root || return 1
    ensure_manage_py || return 1
    ensure_backend_venv || return 1

    (
        cd "${BACKEND_ROOT}"
        "${BACKEND_PYTHON}" "${MANAGE_PY}" "$@"
    )
}