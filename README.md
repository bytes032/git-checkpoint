# git-checkpoint

Lightweight checkpointing for local git repos. Create full copies or fast local clones, then switch between checkpoints with a symlink.

## Install

```
mkdir -p ~/bin
ln -s ~/git-checkpoint/bin/ch ~/bin/ch
ln -s ~/git-checkpoint/bin/ch ~/bin/ch-clone
```

Install dependencies:

```
npm install
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

To automatically `cd` into a checkpoint after `ch clone` or `ch switch`,
source the shell helper:

```
source ~/git-checkpoint/shell/ch.sh
```

Add that line to `~/.zshrc` or `~/.bashrc` to make it permanent.
If you use oh-my-zsh, it may define a `ch` git alias; the helper will
`unalias ch` so the CLI can take over.
The helper also runs `git pull --ff-only` after switching, when a remote
named `origin` exists.
When you run `ch delete`, the helper will `cd` you back to `~`.

## Quickstart

```
ch clone fafo
ch list fafo
ch switch fafo 2
ch switch
ch delete
ch clean fafo --days 90
ch current fafo
cd ~/projects/checkpoints/fafo/current
```

By default, checkpoints go to:

```
~/projects/checkpoints/<repo>/<repo>-N
```

Set `GC_ROOT` to change the base directory:

```
export GC_ROOT=~/projects/checkpoints
```

## Commands

### ch clone

```
ch clone <repo-path-or-name> [target-dir]
ch clone --copy <repo-path-or-name> [target-dir]
ch clone --clone <repo-path-or-name> [target-dir]
ch clone --no-pull-source <repo-path-or-name> [target-dir]
ch clone --dest <dir> <repo-path-or-name> [target-dir]
ch clone --prefix <name> <repo-path-or-name>
```

Creates a checkpoint of a local repo.

- Default mode is `--copy`, which copies everything (tracked + untracked + ignored).
- Use `--clone` for a fast local `git clone` (tracked files only).
- By default, `ch clone` runs `git pull --ff-only` in the source repo before creating the checkpoint (best-effort). Use `--no-pull-source` to disable.
- If `target-dir` is omitted, a numbered folder is created under the repo’s checkpoint directory.

Examples:

```
ch clone fafo
ch clone --clone fafo
ch clone --prefix work fafo
ch clone --dest ~/projects/checkpoints fafo
```

### ch list

```
ch list <repo>
```

Lists available checkpoints for a repo.

### ch switch

```
ch switch <repo> <name-or-number>
ch switch <repo>
ch switch
```

Updates the `current` symlink to point at the selected checkpoint.
If you run `ch switch <repo>` with no name, it opens an interactive
picker (via `inquirer`) showing last activity.
If you run `ch switch` with no repo, it first lets you pick a repo, then a checkpoint.
Press Esc to cancel the picker.

Example:

```
ch switch fafo 2
cd ~/projects/checkpoints/fafo/current
```

### ch clean

```
ch clean <repo> [--days <n>] [--dry-run]
```

Removes checkpoints that have **not** changed in the last `<n>` days (default 90).
Uses an index file (`.gc-index.json`) to track creation time and current directory
mtime for change detection.

Example:

```
ch clean fafo --days 90
ch clean fafo --days 90 --dry-run
```

### ch current

```
ch current <repo>
```

Prints the current checkpoint path (via the `current` symlink).

### ch delete

```
ch delete
ch delete <repo> <name-or-number>
```

Removes a checkpoint directory.

- With no arguments, it deletes the checkpoint that contains your current working directory.
- With `<repo> <name-or-number>`, it deletes that checkpoint directly.

### ch path

```
ch path <repo> <name-or-number>
```

Prints the full path to a checkpoint.

### ch latest

```
ch latest <repo>
```

Prints the most recent checkpoint path.

- `ch clone <repo-path-or-name> [target-dir]`
- `ch list <repo>`
- `ch switch <repo> <name-or-number>`
- `ch clean <repo> [--days <n>] [--dry-run]`
- `ch current <repo>`
- `ch delete`
- `ch delete <repo> <name-or-number>`
- `ch path <repo> <name-or-number>`
- `ch latest <repo>`

## Notes

- Default clone mode is a full copy (tracked + untracked + ignored).
- Use `ch clone --clone` for a local git clone of tracked files only.
- Copy mode uses `rsync` for speed and progress output when available.
- Set `GC_RSYNC_PROGRESS=1` to force `--progress` on older `rsync` versions.
- If `rsync` isn’t available, use `ch clone --clone`.

## Config

- `GC_ROOT`: override the default checkpoint root (defaults to `~/projects/checkpoints`).
