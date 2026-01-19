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
        printf '%s\n' "$out"
      fi
      ;;
    *)
      command gc "$@"
      ;;
  esac
}
