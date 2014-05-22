/*
 Copyright (c) 2014, Pixel & Tonic, Inc.
 @license   http://buildwithcraft.com/license Craft License Agreement
 @link      http://buildwithcraft.com
*/
(function(b){Craft.UpdatesWidget=Garnish.Base.extend({$widget:null,$body:null,$btn:null,checking:!1,init:function(a,c){this.$widget=b("#widget"+a);this.$body=this.$widget.find(".body:first");this.initBtn();c||(this.lookLikeWereChecking(),Craft.cp.on("checkForUpdates",b.proxy(function(a){this.showUpdateInfo(a.updateInfo)},this)))},initBtn:function(){this.$btn=this.$body.find(".btn:first");this.addListener(this.$btn,"click",b.proxy(this,"checkForUpdates"))},lookLikeWereChecking:function(){this.checking=
!0;this.$widget.addClass("loading");this.$btn.addClass("disabled")},dontLookLikeWereChecking:function(){this.checking=!1;this.$widget.removeClass("loading")},checkForUpdates:function(a){this.checking||(this.lookLikeWereChecking(),Craft.postActionRequest("app/checkForUpdates",{forceRefresh:!0},b.proxy(this,"showUpdateInfo")))},showUpdateInfo:function(a){this.dontLookLikeWereChecking();if(a.total){var b=1==a.total?Craft.t("One update available!"):Craft.t("{total} updates available!",{total:a.total});
this.$body.html('<p class="centeralign">'+b+' <a class="go" href="'+Craft.getUrl("updates")+'">'+Craft.t("Go to Updates")+"</a></p>")}else this.$body.html('<p class="centeralign">'+Craft.t("Congrats! You\u2019re up-to-date.")+'</p><p class="centeralign"><a class="btn" data-icon="refresh">'+Craft.t("Check again")+"</a></p>"),this.initBtn();Craft.cp.displayUpdateInfo(a)}})})(jQuery);

//# sourceMappingURL=UpdatesWidget.min.map
