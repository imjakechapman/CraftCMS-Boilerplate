/*
 Copyright (c) 2014, Pixel & Tonic, Inc.
 @license   http://buildwithcraft.com/license Craft License Agreement
 @link      http://buildwithcraft.com
*/
(function(b){Craft.EntryTypeSwitcher=Garnish.Base.extend({$form:null,$typeSelect:null,$spinner:null,$fields:null,init:function(){this.$form=b("#entry-form");this.$typeSelect=b("#entryType");this.$spinner=b('<div class="spinner hidden" style="position: absolute; margin-'+Craft.left+': 2px;"/>').insertAfter(this.$typeSelect.parent());this.$fields=b("#fields");this.addListener(this.$typeSelect,"change","onTypeChange")},onTypeChange:function(e){this.$spinner.removeClass("hidden");Craft.postActionRequest("entries/switchEntryType",
this.$form.serialize(),b.proxy(function(c,d){this.$spinner.addClass("hidden");if("success"==d){var a=this.$fields.data("pane");a.deselectTab();this.$fields.html(c.paneHtml);a.destroy();this.$fields.pane();Craft.initUiElements(this.$fields);a="";c.headHtml&&(a+=c.headHtml);c.footHtml&&(a+=c.footHtml);a&&b(a).appendTo(Garnish.$bod);"undefined"!=typeof slugGenerator&&slugGenerator.setNewSource("#title");Garnish.$win.trigger("resize")}},this))}})})(jQuery);

//# sourceMappingURL=EntryTypeSwitcher.min.map
