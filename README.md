# Progress Tracker

## Requirements

```bash
node >= 16
```

## Setup

```bash
# install dependencies
npm install

# symlink into the path, e.g.
cd ~/bin && ln -s $HOME/lib/ptracker/dist/index.js ptracker

# check installation
ptracker --help
```

## Available Commands

```bash
# list projects
ptracker ls

# add a project update
ptracker update <project-name> <value>

# create a new project
ptracker add <project-name> <target-value>

# mark a project as inactive
ptracker archive <project-name>
```
