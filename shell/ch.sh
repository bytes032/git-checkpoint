unalias ch 2>/dev/null

ch() {
  if [ $# -eq 0 ]; then
    command ch
    return $?
  fi

  case "$1" in
    clone)
      local out
      out="$(command ch "$@")" || return $?
      if [ -n "$out" ]; then
        cd "$out" || return $?
        if command git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
          if command git remote get-url origin >/dev/null 2>&1; then
            command git pull --ff-only >/dev/null 2>&1 || {
              echo "ch: git pull failed (non-fast-forward or offline)" >&2
            }
          fi
        fi
        printf '%s\n' "$out"
      fi
      ;;
    switch)
      command ch "$@"
      local rc=$?
      if [ $rc -ne 0 ]; then
        return $rc
      fi
      local repo="$2"
      local out
      if [ -n "$repo" ]; then
        out="$(command ch current "$repo" 2>/dev/null)" || return 0
      else
        local root="${GC_ROOT:-$HOME/projects/checkpoints}"
        if [ -f "$root/.gc-last-switch" ]; then
          out="$(cat "$root/.gc-last-switch")"
        fi
      fi
      if [ -n "$out" ]; then
        cd "$out" || return $?
        if command git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
          if command git remote get-url origin >/dev/null 2>&1; then
            command git pull --ff-only >/dev/null 2>&1 || {
              echo "ch: git pull failed (non-fast-forward or offline)" >&2
            }
          fi
        fi
        printf '%s\n' "$out"
      fi
      ;;
    delete)
      command ch "$@"
      local rc=$?
      if [ $rc -ne 0 ]; then
        return $rc
      fi
      cd "$HOME" || return $?
      ;;
    *)
      command ch "$@"
      ;;
  esac
}
