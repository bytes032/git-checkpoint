gc() {
  if [ $# -eq 0 ]; then
    command gc
    return $?
  fi

  case "$1" in
    clone|use)
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
