/*
 Copyright (c) 2014, Pixel & Tonic, Inc.
 @license   http://buildwithcraft.com/license Craft License Agreement
 @link      http://buildwithcraft.com
*/
(function(a){new (Garnish.Base.extend({$lockBtns:null,$currentPasswordInput:null,$spinner:null,modal:null,init:function(){this.$lockBtns=a(".btn.lock");this.addListener(this.$lockBtns,"click","showCurrentPasswordForm")},showCurrentPasswordForm:function(){if(this.modal)this.modal.show();else{var c=a('<form id="verifypasswordmodal" class="modal fitted"/>').appendTo(Garnish.$bod),b=a('<div class="body"><p>'+Craft.t("Please enter your current password.")+"</p></div>").appendTo(c),e=a('<div class="passwordwrapper"/>').appendTo(b),
b=a('<div class="buttons right"/>').appendTo(b),d=a('<div class="btn">'+Craft.t("Cancel")+"</div>").appendTo(b);a('<input type="submit" class="btn submit" value="'+Craft.t("Continue")+'" />').appendTo(b);this.$currentPasswordInput=a('<input type="password" class="text password fullwidth"/>').appendTo(e);this.$spinner=a('<div class="spinner hidden"/>').appendTo(b);this.modal=new Garnish.Modal(c);new Craft.PasswordInput(this.$currentPasswordInput,{onToggleInput:a.proxy(function(a){this.$currentPasswordInput=
a},this)});this.addListener(d,"click",function(){this.modal.hide()});this.addListener(c,"submit","submitCurrentPassword")}Garnish.isMobileBrowser(!0)||setTimeout(a.proxy(function(){this.$currentPasswordInput.focus()},this),100)},submitCurrentPassword:function(c){c.preventDefault();var b=this.$currentPasswordInput.val();b&&(this.$spinner.removeClass("hidden"),Craft.postActionRequest("users/verifyPassword",{password:b},a.proxy(function(c,d){this.$spinner.addClass("hidden");"success"==d&&(c.success?
(a('<input type="hidden" name="password" value="'+b+'"/>').appendTo("#userform"),a("#email, #newPassword").removeClass("disabled").removeAttr("disabled"),this.$lockBtns.remove(),this.modal.hide()):Garnish.shake(this.modal.$container))},this)))}}))})(jQuery);

//# sourceMappingURL=account.min.map
