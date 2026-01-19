# git-checkpoint

Lightweight checkpointing for local git repos. Create full copies or fast local clones, then switch between checkpoints with a symlink.

## Install

```
mkdir -p /home/node/bin
ln -s /home/node/git-checkpoint/bin/gc /home/node/bin/gc
ln -s /home/node/git-checkpoint/bin/gc /home/node/bin/gc-clone
```

## Shell Integration (auto-cd)

To automatically `cd` into a checkpoint after `gc clone` or `gc use`,
source the shell helper:

```
source /home/node/git-checkpoint/shell/gc.sh
```

Add that line to `~/.zshrc` or `~/.bashrc` to make it permanent.

## Quickstart

```
gc clone fafo
gc list fafo
gc use fafo 2
gc current fafo
cd /home/node/checkpoints/fafo/current
```

By default, checkpoints go to:

```
/home/node/checkpoints/<repo>/<repo>-N
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
gc clone --dest /home/node/checkpoints fafo
```

### gc list

```
gc list <repo>
```

Lists available checkpoints for a repo.

### gc use

```
gc use <repo> <name-or-number>
```

Updates the `current` symlink to point at the selected checkpoint.

Example:

```
gc use fafo 2
cd /home/node/checkpoints/fafo/current
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
- `gc use <repo> <name-or-number>`
- `gc current <repo>`
- `gc path <repo> <name-or-number>`
- `gc latest <repo>`

## Notes

- Default clone mode is a full copy (tracked + untracked + ignored).
- Use `gc clone --clone` for a local git clone of tracked files only.

## Config

- `GC_ROOT`: override the default checkpoint root (defaults to `/home/node/checkpoints`).
