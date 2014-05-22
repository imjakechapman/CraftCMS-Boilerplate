/*
 Copyright (c) 2014, Pixel & Tonic, Inc.
 @license   http://buildwithcraft.com/license Craft License Agreement
 @link      http://buildwithcraft.com
*/
(function(e){Craft.QuickPostWidget=Garnish.Base.extend({params:null,initFields:null,$widget:null,$form:null,$formClone:null,$spinner:null,$errorList:null,loading:!1,init:function(c,a,f){this.params=a;this.initFields=f;this.$widget=e("#widget"+c);this.$form=this.$widget.find("form:first");this.$spinner=this.$form.find(".spinner");this.$formClone=this.$form.clone();this.initForm()},initForm:function(){this.addListener(this.$form,"submit","onSubmit");this.initFields()},onSubmit:function(c){c.preventDefault();
this.loading||(this.loading=!0,this.$spinner.removeClass("hidden"),c=Garnish.getPostData(this.$form),c=e.extend({enabled:1},c,this.params),Craft.postActionRequest("entries/saveEntry",c,e.proxy(function(a,c){this.loading=!1;this.$spinner.addClass("hidden");this.$errorList&&this.$errorList.children().remove();if("success"==c)if(a.success){Craft.cp.displayNotice(Craft.t("Entry saved."));var b=this.$formClone.clone();this.$form.replaceWith(b);this.$form=b;this.initForm();if("undefined"!=typeof Craft.RecentEntriesWidget)for(b=
0;b<Craft.RecentEntriesWidget.instances.length;b++){var d=Craft.RecentEntriesWidget.instances[b];d.params.sectionId&&d.params.sectionId!=this.params.sectionId||d.addEntry({url:a.cpEditUrl,title:a.title,postDate:a.postDate,username:a.author.username})}}else if(Craft.cp.displayError(Craft.t("Couldn\u2019t save entry.")),a.errors)for(d in this.$errorList||(this.$errorList=e('<ul class="errors"/>').insertAfter(this.$form)),a.errors)for(b=0;b<a.errors[d].length;b++)e("<li>"+a.errors[d][b]+"</li>").appendTo(this.$errorList)},
this)))}})})(jQuery);

//# sourceMappingURL=QuickPostWidget.min.map
