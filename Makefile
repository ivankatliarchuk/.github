SHELL := /bin/bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules

export DRY_RUN ?= true
renovate ?= renovate/renovate:23.100.5-slim

help:
	@printf "Usage: make [target] [VARIABLE=value]\nTargets:\n"
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

hooks: ## Setup pre commit.
	@pre-commit install
	@pre-commit gc
	@pre-commit autoupdate

validate: ## Validate files with pre-commit hooks
	@pre-commit run --all-files

set-token: ## Set tokens for local development
	@envchain --set vars RENOVATE_TOKEN

globals:
	$(eval export $(shell envchain vars env | grep RENOVATE_TOKEN || echo "No RENOVATE_TOKEN env vars for renovate"))

renovate: globals
renovate: ## Run renovate
	@docker run --rm -it \
	-v ${PWD}/.github/renovate/renovate-config.js:/github-action/renovate-config.js -w /tmp \
	--user ubuntu:121 \
	-e RENOVATE_CONFIG_FILE=/github-action/renovate-config.js \
	-e RENOVATE_TOKEN \
    -e DRY_RUN \
	${renovate}

