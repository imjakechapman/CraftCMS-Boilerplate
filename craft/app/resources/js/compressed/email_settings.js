/*
 Copyright (c) 2014, Pixel & Tonic, Inc.
 @license   http://buildwithcraft.com/license Craft License Agreement
 @link      http://buildwithcraft.com
*/
(function(a){var c=Garnish.Base.extend({$form:null,$protocolField:null,$protocolSelect:null,$hiddenFields:null,$testBtn:null,$testSpinner:null,$protocolSettingsPane:null,$protocolSettingsPaneHead:null,$protocolSettingsPaneBody:null,protocol:null,init:function(){this.$form=a("#settings-form");this.$protocolField=a("#protocol-field");this.$protocolSelect=a("#protocol");this.$hiddenFields=a("#hidden-fields");this.$testBtn=a("#test");this.$testSpinner=a("#test-spinner");this._onEmailTypeChange();this.addListener(this.$protocolSelect,
"change","_onEmailTypeChange");this.addListener(this.$testBtn,"activate","sendTestEmail")},getField:function(b){return a("#"+c.protocolFields[this.protocol][b]+"-field")},_onEmailTypeChange:function(){if(this.protocol&&this.protocol in c.protocolFields)for(var b=0;b<c.protocolFields[this.protocol].length;b++)this.getField(b).appendTo(this.$hiddenFields);this.protocol=this.$protocolSelect.val();if(this.protocol in c.protocolFields)for(var b=this.$protocolField,a=0;a<c.protocolFields[this.protocol].length;a++){var d=
this.getField(a);d.insertAfter(b);b=d}},sendTestEmail:function(){if(!this.$testBtn.hasClass("sel")){this.$testBtn.addClass("sel");this.$testSpinner.removeClass("hidden");var b=Garnish.getPostData(this.$form);delete b.action;Craft.postActionRequest("systemSettings/testEmailSettings",b,a.proxy(function(a,b){this.$testBtn.removeClass("sel");this.$testSpinner.addClass("hidden");"success"==b&&(a.success?Craft.cp.displayNotice(Craft.t("Email sent successfully! Check your inbox.")):Craft.cp.displayError(a.error))},
this))}}},{protocolFields:{smtp:"host port smtpKeepAlive smtpAuth smtpAuthCredentials smtpSecureTransportType timeout".split(" "),pop:["username","password","host","port","timeout"],gmail:["username","password"]}});Craft.emailSettingsForm=new c})(jQuery);

//# sourceMappingURL=email_settings.min.map
