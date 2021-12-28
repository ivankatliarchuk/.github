SHELL := /bin/bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules

export DRY_RUN ?= true
CI_RENOVATE_IMAGE ?= renovate/renovate:31.10.0
export RENOVATE_TOKEN ?= $(shell envchain vars env | grep RENOVATE_TOKEN | tr "=" " " |  awk '{print $$2}')
export DOCKER_HUB_PASSWORD ?= $(shell envchain vars env | grep DOCKER_HUB_PASSWORD | tr "=" " " |  awk '{print $$2}')

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

renovate: ## Run renovate
	@docker run --rm -it \
	-v ${PWD}/.github/renovate/renovate-config.js:/github-action/renovate-config.js -w /tmp \
	-v ${PWD}/.github/renovate/.cache:/github-action/cache \
	--user ubuntu:121 \
	-e RENOVATE_CONFIG_FILE=/github-action/renovate-config.js \
	-e RENOVATE_CACHE_DIR=/github-action/cache \
	-e RENOVATE_TOKEN \
	-e DOCKER_HUB_PASSWORD \
  -e DRY_RUN \
	-e LOG_LEVEL=info \
	${CI_RENOVATE_IMAGE}
