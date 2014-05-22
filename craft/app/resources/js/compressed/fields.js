/*
 Copyright (c) 2014, Pixel & Tonic, Inc.
 @license   http://buildwithcraft.com/license Craft License Agreement
 @link      http://buildwithcraft.com
*/
(function(b){var e=Garnish.Base.extend({$groups:null,$selectedGroup:null,init:function(){this.$groups=b("#groups");this.$selectedGroup=this.$groups.find("a.sel:first");this.addListener(b("#newgroupbtn"),"activate","addNewGroup");var a=b("#groupsettingsbtn");a.length&&(a.data("menubtn").settings.onOptionSelect=b.proxy(function(a){switch(b(a).data("action")){case "rename":this.renameSelectedGroup();break;case "delete":this.deleteSelectedGroup()}},this))},addNewGroup:function(){var a=this.promptForGroupName("");
a&&Craft.postActionRequest("fields/saveGroup",{name:a},b.proxy(function(a,d){if("success"==d)if(a.success)location.href=Craft.getUrl("settings/fields/"+a.group.id);else if(a.errors){var b=this.flattenErrors(a.errors);alert(Craft.t("Could not create the group:")+"\n\n"+b.join("\n"))}else Craft.cp.displayError()},this))},renameSelectedGroup:function(){var a=this.$selectedGroup.text(),c=this.promptForGroupName(a);c&&c!=a&&(a={id:this.$selectedGroup.data("id"),name:c},Craft.postActionRequest("fields/saveGroup",
a,b.proxy(function(a,b){if("success"==b)if(a.success)this.$selectedGroup.text(a.group.name),Craft.cp.displayNotice(Craft.t("Group renamed."));else if(a.errors){var c=this.flattenErrors(a.errors);alert(Craft.t("Could not rename the group:")+"\n\n"+c.join("\n"))}else Craft.cp.displayError()},this)))},promptForGroupName:function(a){return prompt(Craft.t("What do you want to name your group?"),a)},deleteSelectedGroup:function(){if(confirm(Craft.t("Are you sure you want to delete this group and all its fields?"))){var a=
{id:this.$selectedGroup.data("id")};Craft.postActionRequest("fields/deleteGroup",a,b.proxy(function(a,b){"success"==b&&(a.success?location.href=Craft.getUrl("settings/fields"):Craft.cp.displayError())},this))}},flattenErrors:function(a){var b=[],d;for(d in a)b=b.concat(response.errors[d]);return b}});Garnish.$doc.ready(function(){Craft.FieldsAdmin=new e})})(jQuery);

//# sourceMappingURL=fields.min.map
