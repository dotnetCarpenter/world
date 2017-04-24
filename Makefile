define findDep
$(shell node -p 'try{"$(shell bower list --paths)".match(/(bower_components[\w/\.]+)/g, "").join(" ")}catch(e){""}')
endef


ifeq ($(strip $(call findDep)),)
bower install --production
endif

SOURCE := $(call findDep)
BOWER_FILES := $(notdir ${SOURCE})
BOWER_DIRS := $(dir ${SOURCE})
TARGET_FOLDER = js/lib
TARGETS := $(addprefix ${TARGET_FOLDER}/, ${BOWER_FILES})
#vpath %.js ${BOWER_DIRS}


all: ${TARGETS}

${TARGET_FOLDER}/%.js: %.js | ${TARGET_FOLDER}
	cp -p $< $@

${TARGET_FOLDER}:
	mkdir -p $@


.phony: debug

debug:
	@echo ${SOURCE}
	@echo ${BOWER_FILES}
	@echo ${BOWER_DIRS}


#cp -vf $< $@
#@echo $@ $% $< $? $^ $+ $| "\n******************"
