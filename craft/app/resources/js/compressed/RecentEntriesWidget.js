/*
 Copyright (c) 2014, Pixel & Tonic, Inc.
 @license   http://buildwithcraft.com/license Craft License Agreement
 @link      http://buildwithcraft.com
*/
(function(c){Craft.RecentEntriesWidget=Garnish.Base.extend({params:null,$widget:null,$body:null,$container:null,$tbody:null,hasEntries:null,init:function(a,b){this.params=b;this.$widget=c("#widget"+a);this.$body=this.$widget.find(".body:first");this.$container=this.$widget.find(".recententries-container:first");this.$tbody=this.$container.find("tbody:first");this.hasEntries=!!this.$tbody.length;Craft.RecentEntriesWidget.instances.push(this)},addEntry:function(a){this.$container.css("margin-top",0);
var b=this.$container.height();if(!this.hasEntries){var d=c('<table class="data fullwidth"/>').prependTo(this.$container);this.$tbody=c("<tbody/>").appendTo(d)}this.$tbody.prepend('<tr><td><a href="'+a.url+'">'+a.title+'</a> <span class="light">'+a.postDate+(Craft.edition>=Craft.Client?" "+Craft.t("by {author}",{author:a.username}):"")+"</span></td></tr>");a=this.$container.height()-b;this.$container.css("margin-top",-a);a={"margin-top":0};this.hasEntries||(a["margin-bottom"]=-b,this.hasEntries=!0);
this.$container.animate(a)}},{instances:[]})})(jQuery);

//# sourceMappingURL=RecentEntriesWidget.min.map
