/*
 Copyright (c) 2014, Pixel & Tonic, Inc.
 @license   http://buildwithcraft.com/license Craft License Agreement
 @link      http://buildwithcraft.com
*/
(function(b){Craft.Updater=Garnish.Base.extend({$graphic:null,$status:null,$errorDetails:null,data:null,init:function(a,d){this.$graphic=b("#graphic");this.$status=b("#status");a?(this.data={handle:a,manualUpdate:d},this.postActionRequest("update/prepare")):this.showError(Craft.t("Unable to determine what to update."))},updateStatus:function(a){this.$status.html(a)},showError:function(a){this.updateStatus(a);this.$graphic.addClass("error")},postActionRequest:function(a){Craft.postActionRequest(a,
{data:this.data},b.proxy(function(a,c,b){if("success"==c&&a.alive)this.onSuccessResponse(a);else this.onErrorResponse(b)},this),{complete:b.noop})},onSuccessResponse:function(a){a.data&&(this.data=a.data);a.errorDetails&&(this.$errorDetails=a.errorDetails);a.nextStatus&&this.updateStatus(a.nextStatus);a.nextAction&&this.postActionRequest(a.nextAction);if(a.finished){var b=!1;a.rollBack&&(b=!0);this.onFinish(a.returnUrl,b)}},onErrorResponse:function(a){this.$graphic.addClass("error");a=Craft.t("An error has occurred.  Please contact {email} and be sure to include the error message.",
{email:'<a href="mailto:support@buildwithcraft.com?subject=Craft+Update+Failure">support@buildwithcraft.com</a>'})+"<br /><p>"+a.statusText+"</p><br /><p>"+a.responseText+"</p>";this.updateStatus(a)},onFinish:function(a,b){if(this.$errorDetails){this.$graphic.addClass("error");var c=Craft.t("Craft was unable to install this update :(")+"<br /><p>",c=b?c+(Craft.t("The site has been restored to the state it was in before the attempted update.")+"</p><br /><p>"):c+(Craft.t("No files have been updated and the database has not been touched.")+
"</p><br /><p>"),c=c+(this.$errorDetails+"</p>");this.updateStatus(c)}else this.updateStatus(Craft.t("All done!")),this.$graphic.addClass("success"),setTimeout(function(){window.location=a?Craft.getUrl(a):Craft.getUrl("dashboard")},500)}})})(jQuery);

//# sourceMappingURL=update.min.map
