#!/usr/bin/env bash
set -euo pipefail

show_help() {
    echo "Usage: $0 [option]"
    echo
    echo "Options:"
    echo "  -h, --help       Show this help message and exit."
    echo "  -s, --start      Start the Django development server."
    echo
}

start_django_server() {
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    # shellcheck disable=SC1091
    source "${SCRIPT_DIR}/helper/project_paths.sh"

    ensure_backend_root
    ensure_manage_py
    ensure_backend_venv

    echo "Starting Django development server on 0.0.0.0:8080..."
    (
        cd "${BACKEND_ROOT}"
        nohup "${BACKEND_PYTHON}" "${MANAGE_PY}" runserver 0.0.0.0:8080 > "${PROJECT_ROOT}/nohup.out" 2>&1 &
    )
}

if [[ "$#" -eq 0 ]]; then
    show_help
    exit 1
fi

case "$1" in
    -h|--help)
        show_help
        ;;
    -s|--start)
        start_django_server
        ;;
    *)
        echo "Invalid option: $1"
        show_help
        exit 1
        ;;
esac