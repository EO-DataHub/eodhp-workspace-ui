npm ?= npm
bucket ?= s3://static-web-artefacts-eodh/static-apps/workspace-ui
version ?= $(shell jq -r .version package.json)

.SILENT:
MAKEFLAGS += --no-print-directory

.PHONY: init
init:
	$(npm) install

.PHONY: run-dev
run-dev:
	export VITE_WORKSPACE_LOCAL=true && $(npm) run dev

.PHONY: build
build:
	$(npm) run build

.PHONY: push
push:
	aws s3 sync dist $(bucket)/$(version) --delete \
	  $(if $(dev),--cache-control no-cache,--cache-control max-age=31536000) \
	  $(if $(profile), --profile $(profile),)

.PHONY: publish
publish: build push 