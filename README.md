# git-checkpoint

Lightweight checkpointing for local git repos. Create full copies or fast local clones, then switch between checkpoints with a symlink.

## Install

```
mkdir -p ~/bin
ln -s ~/git-checkpoint/bin/gc ~/bin/gc
ln -s ~/git-checkpoint/bin/gc ~/bin/gc-clone
```

Or install via npm:

```
npm install -g ~/git-checkpoint
```

From GitHub:

```
npm install -g git+https://github.com/bytes032/git-checkpoint.git
```

## Shell Integration (auto-cd)

To automatically `cd` into a checkpoint after `gc clone` or `gc switch`,
source the shell helper:

```
source ~/git-checkpoint/shell/gc.sh
```

Add that line to `~/.zshrc` or `~/.bashrc` to make it permanent.
If you use oh-my-zsh, it may define a `gc` git alias; the helper will
`unalias gc` so the CLI can take over.

## Quickstart

```
gc clone fafo
gc list fafo
gc switch fafo 2
gc clean fafo --days 90
gc current fafo
cd ~/checkpoints/fafo/current
```

By default, checkpoints go to:

```
~/checkpoints/<repo>/<repo>-N
```

Set `GC_ROOT` to change the base directory.

## Commands

### gc clone

```
gc clone <repo-path-or-name> [target-dir]
gc clone --copy <repo-path-or-name> [target-dir]
gc clone --clone <repo-path-or-name> [target-dir]
gc clone --dest <dir> <repo-path-or-name> [target-dir]
gc clone --prefix <name> <repo-path-or-name>
```

Creates a checkpoint of a local repo.

- Default mode is `--copy`, which copies everything (tracked + untracked + ignored).
- Use `--clone` for a fast local `git clone` (tracked files only).
- If `target-dir` is omitted, a numbered folder is created under the repo’s checkpoint directory.

Examples:

```
gc clone fafo
gc clone --clone fafo
gc clone --prefix work fafo
gc clone --dest ~/checkpoints fafo
```

### gc list

```
gc list <repo>
```

Lists available checkpoints for a repo.

### gc switch

```
gc switch <repo> <name-or-number>
```

Updates the `current` symlink to point at the selected checkpoint.

Example:

```
gc switch fafo 2
cd ~/checkpoints/fafo/current
```

### gc clean

```
gc clean <repo> [--days <n>] [--dry-run]
```

Removes checkpoints that have **not** changed in the last `<n>` days (default 90).
Uses an index file (`.gc-index.json`) to track creation time and current directory
mtime for change detection.

Example:

```
gc clean fafo --days 90
gc clean fafo --days 90 --dry-run
```

### gc current

```
gc current <repo>
```

Prints the current checkpoint path (via the `current` symlink).

### gc path

```
gc path <repo> <name-or-number>
```

Prints the full path to a checkpoint.

### gc latest

```
gc latest <repo>
```

Prints the most recent checkpoint path.

- `gc clone <repo-path-or-name> [target-dir]`
- `gc list <repo>`
- `gc switch <repo> <name-or-number>`
- `gc clean <repo> [--days <n>] [--dry-run]`
- `gc current <repo>`
- `gc path <repo> <name-or-number>`
- `gc latest <repo>`

## Notes

- Default clone mode is a full copy (tracked + untracked + ignored).
- Use `gc clone --clone` for a local git clone of tracked files only.
- Copy mode uses `rsync` for speed and progress output.
- If `rsync` isn’t available, use `gc clone --clone`.

## Config

- `GC_ROOT`: override the default checkpoint root (defaults to `~/checkpoints`).
