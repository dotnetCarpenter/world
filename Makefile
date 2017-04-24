define readDeps
$(shell node -p "Object.$1(require('./bower.json').dependencies).join(' ')")
endef

define findDep
$(shell node -p '"$(shell bower list --paths)".match(/(bower_components[\w/\.]+)/g, "").join(" ")')
endef


DEPS_SOURCE := $(call readDeps,values)
DEPS_NAMES := $(call readDeps,keys)

.phony: write

write:
#	@echo ${DEPS_SOURCE}
	@echo ${DEPS_NAMES}
	@echo $(call findDep)


