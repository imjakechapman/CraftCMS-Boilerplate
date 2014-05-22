/*
 Copyright (c) 2014, Pixel & Tonic, Inc.
 @license   http://buildwithcraft.com/license Craft License Agreement
 @link      http://buildwithcraft.com
*/
(function(b){new (Garnish.Base.extend({$clearAllBtn:null,$table:null,tracesModal:null,$tracesModalBody:null,init:function(){this.$clearAllBtn=b("#clearall");this.$table=b("#deprecationerrors");this.$noLogsMessage=b("#nologs");this.addListener(this.$clearAllBtn,"click","clearAllLogs");this.addListener(this.$table.find(".viewtraces"),"click","viewLogTraces");this.addListener(this.$table.find(".delete"),"click","deleteLog")},clearAllLogs:function(){Craft.postActionRequest("utils/deleteAllDeprecationErrors");
this.onClearAll()},viewLogTraces:function(a){if(this.tracesModal)this.tracesModal.$container.addClass("loading"),this.$tracesModalBody.empty(),this.tracesModal.show();else{var c=b('<div id="traces" class="modal loading"/>').appendTo(Garnish.$bod);this.$tracesModalBody=b('<div class="body"/>').appendTo(c);this.tracesModal=new Garnish.Modal(c,{resizable:!0})}a={logId:b(a.currentTarget).closest("tr").data("id")};Craft.postActionRequest("utils/getDeprecationErrorTracesModal",a,b.proxy(function(a,b){this.tracesModal.$container.removeClass("loading");
"success"==b&&this.$tracesModalBody.html(a)},this))},deleteLog:function(a){a=b(a.currentTarget).closest("tr");var c={logId:a.data("id")};Craft.postActionRequest("utils/deleteDeprecationError",c);if(a.siblings().length)a.remove();else this.onClearAll()},onClearAll:function(){this.$clearAllBtn.parent().remove();this.$table.remove();this.$noLogsMessage.removeClass("hidden")}}))})(jQuery);

//# sourceMappingURL=deprecator.min.map
