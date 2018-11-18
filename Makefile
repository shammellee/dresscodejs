.PHONY: test

NODE_MODULE_DIR := $(realpath node_modules)
NODE_BIN_DIR    := $(realpath $(NODE_MODULE_DIR)/.bin)

JEST_CMD := $(realpath $(NODE_BIN_DIR)/jest)

test:
	@$(JEST_CMD)

