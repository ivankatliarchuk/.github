SHELL := /bin/bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules

CI_RENOVATE_IMAGE := renovate/renovate:32.103.3-slim
RENOVATE_REPOSITORIES := $(shell cat ./renovate/repositories.json | jq -r '. | join(",")')
RENOVATE_DRY_RUN := false
LOG_LEVEL := debug

help:
	@printf "Usage: make [target] [VARIABLE=value]\nTargets:\n"
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

hooks: ## Setup pre commit.
	@pre-commit install
	@pre-commit gc

validate: ## Validate files with pre-commit hooks
	@pre-commit run --all-files

deps: ## Run renovate locally
	docker run --rm -it \
	-w /tmp \
	-v ${PWD}/renovate/config.js:/ren/renovate-config.js \
	-v ${PWD}/renovate/.cache:/ren/cache \
	--user ubuntu:121 \
	-e RENOVATE_CONFIG_FILE=/ren/renovate-config.js \
	-e RENOVATE_REPOSITORIES=$(RENOVATE_REPOSITORIES) \
	-e RENOVATE_REGEX_MANAGERS=$(RENOVATE_REGEX_MANAGERS) \
	-e RENOVATE_CACHE_DIR=/ren/cache \
	-e RENOVATE_TOKEN \
	-e RENOVATE_DOCKER_HUB_PASSWORD \
	-e LOG_LEVEL=$(LOG_LEVEL) \
	-e RENOVATE_DRY_RUN=$(RENOVATE_DRY_RUN) \
	${CI_RENOVATE_IMAGE}
