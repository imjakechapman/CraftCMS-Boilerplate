/*
 Copyright (c) 2014, Pixel & Tonic, Inc.
 @license   http://buildwithcraft.com/license Craft License Agreement
 @link      http://buildwithcraft.com
*/
(function(b){Craft.GetHelpWidget=Garnish.Base.extend({widgetId:0,loading:!1,$widget:null,$message:null,$fromEmail:null,$attachLogs:null,$attachDbBackup:null,$attachAdditionalFile:null,$sendBtn:null,$spinner:null,$error:null,$errorList:null,$iframe:null,init:function(a){this.widgetId=a;this.$widget=b("#widget"+a);this.$message=this.$widget.find(".message:first");this.$fromEmail=this.$widget.find(".fromEmail:first");this.$attachLogs=this.$widget.find(".attachLogs:first");this.$attachDbBackup=this.$widget.find(".attachDbBackup:first");
this.$attachAdditionalFile=this.$widget.find(".attachAdditionalFile:first");this.$sendBtn=this.$widget.find(".submit:first");this.$spinner=this.$widget.find(".buttons .spinner");this.$error=this.$widget.find(".error:first");this.$form=this.$widget.find("form:first");this.$form.prepend('<input type="hidden" name="widgetId" value="'+this.widgetId+'" />');this.addListener(this.$sendBtn,"activate","sendMessage");"undefined"==typeof Craft.widgets&&(Craft.widgets={});Craft.widgets[this.widgetId]=this},
sendMessage:function(){var a="iframeWidget"+this.widgetId;this.loading||(this.$iframe||(this.$iframe=b('<iframe id="'+a+'" name="'+a+'" style="display: none" />').insertAfter(this.$form)),this.loading=!0,this.$sendBtn.addClass("active"),this.$spinner.removeClass("hidden"),this.$form.attr("target",a),this.$form.attr("action",Craft.getActionUrl("dashboard/sendSupportRequest")),this.$form.submit())},parseResponse:function(a){this.loading=!1;this.$sendBtn.removeClass("active");this.$spinner.addClass("hidden");
this.$errorList&&this.$errorList.children().remove();if(a.errors){this.$errorList||(this.$errorList=b('<ul class="errors"/>').insertAfter(this.$form));for(var d in a.errors)for(var c=0;c<a.errors[d].length;c++)b("<li>"+a.errors[d][c]+"</li>").appendTo(this.$errorList)}a.success&&(Craft.cp.displayNotice(Craft.t("Message sent successfully.")),this.$message.val(""),this.$attachAdditionalFile.val(""));this.$iframe.html("")}})})(jQuery);

//# sourceMappingURL=GetHelpWidget.min.map
