.PHONY: dev test

NODE_MODULE_DIR := $(realpath node_modules)
NODE_BIN_DIR    := $(realpath $(NODE_MODULE_DIR)/.bin)

JEST_CMD := $(realpath $(NODE_BIN_DIR)/jest)


# ===========
# = TARGETS =
# ===========

dev:
	@$(JEST_CMD) --watchAll --rootDir=$(realpath lib)

test:
	@$(JEST_CMD) --coverage

