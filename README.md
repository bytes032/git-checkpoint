# git-checkpoint

Lightweight checkpointing for local git repos. Create full copies or fast local clones, then switch between checkpoints with a symlink.

## Install

```
mkdir -p /home/node/bin
ln -s /home/node/git-checkpoint/bin/gc /home/node/bin/gc
ln -s /home/node/git-checkpoint/bin/gc /home/node/bin/gc-clone
```

## Usage

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

- `gc clone <repo-path-or-name> [target-dir]`
- `gc list <repo>`
- `gc use <repo> <name-or-number>`
- `gc current <repo>`
- `gc path <repo> <name-or-number>`
- `gc latest <repo>`

## Notes

- Default clone mode is a full copy (tracked + untracked + ignored).
- Use `gc clone --clone` for a local git clone of tracked files only.
