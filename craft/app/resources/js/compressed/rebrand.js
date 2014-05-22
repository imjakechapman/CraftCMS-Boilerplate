/*
 Copyright (c) 2014, Pixel & Tonic, Inc.
 @license   http://buildwithcraft.com/license Craft License Agreement
 @link      http://buildwithcraft.com
*/
(function(b){function d(a){"undefined"!=typeof a.html&&(b(".cp-logo").replaceWith(a.html),e())}function e(){c.uploadButton=b(".logo-controls .upload-logo");c.deleteButton=b(".logo-controls .delete-logo");new Craft.ImageUpload(c)}var c={modalClass:"logo-modal",uploadAction:"rebrand/uploadLogo",deleteMessage:Craft.t("Are you sure you want to delete the logo?"),deleteAction:"rebrand/deleteLogo",cropAction:"rebrand/cropLogo",areaToolOptions:{aspectRatio:"",initialRectangle:{mode:"auto"}},onImageSave:function(a){d(a)},
onImageDelete:function(a){d(a)}};e()})(jQuery);

//# sourceMappingURL=rebrand.min.map
