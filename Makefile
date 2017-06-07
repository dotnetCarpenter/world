# https://www.gnu.org/software/make/manual/html_node/Automatic-Variables.html

source_dir = bower_components/svg.panzoom.js/dist/

source := $(wildcard $(source_dir)*)
target := $(patsubst $(source_dir)%,js/lib/%,$(source))

all: $(source_dir) $(target)
.phony: clean debug

$(source_dir):
	bower install

%.js : | $(source_dir)
	@cp -v $(source_dir)$(notdir $@) $@

clean:
	@$(RM) -fv $(target)

debug:
	@echo $(source)
	@echo "target: "
	@echo $(target)
