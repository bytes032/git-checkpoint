unalias gc 2>/dev/null

gc() {
  if [ $# -eq 0 ]; then
    command gc
    return $?
  fi

  case "$1" in
    clone|switch)
      local out
      out="$(command gc "$@")" || return $?
      if [ -n "$out" ]; then
        cd "$out" || return $?
        if command git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
          if command git remote get-url origin >/dev/null 2>&1; then
            command git pull --ff-only >/dev/null 2>&1 || {
              echo "gc: git pull failed (non-fast-forward or offline)" >&2
            }
          fi
        fi
        printf '%s\n' "$out"
      fi
      ;;
    *)
      command gc "$@"
      ;;
  esac
}
