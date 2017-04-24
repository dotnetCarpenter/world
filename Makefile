define readDeps
$(shell node -p "Object.$1(require('./bower.json').dependencies)")
endef


DEPS_SOURCE := $(call readDeps,values)
DEPS_NAMES := $(call readDeps,keys)

.phony: write

write:
	@echo ${DEPS_SOURCE}
	@echo ${DEPS_NAMES}

