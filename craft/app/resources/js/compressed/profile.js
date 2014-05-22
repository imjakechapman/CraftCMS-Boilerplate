/*
 Copyright (c) 2014, Pixel & Tonic, Inc.
 @license   http://buildwithcraft.com/license Craft License Agreement
 @link      http://buildwithcraft.com
*/
(function(b){function d(a){"undefined"!=typeof a.html&&(b(".user-photo").replaceWith(a.html),a=b(".user-photo>.current-photo").css("background-image").replace(/^url\(/,"").replace(/\)$/,""),b("#account-menu").find("img").attr("src",a),e())}function e(){c.uploadButton=b(".user-photo-controls .upload-photo");c.deleteButton=b(".user-photo-controls .delete-photo");new Craft.ImageUpload(c)}var c={postParameters:{userId:b(".user-photo").attr("data-user")},modalClass:"profile-image-modal",uploadAction:"users/uploadUserPhoto",
deleteMessage:Craft.t("Are you sure you want to delete this photo?"),deleteAction:"users/deleteUserPhoto",cropAction:"users/cropUserPhoto",areaToolOptions:{aspectRatio:"1:1",initialRectangle:{mode:"auto"}},onImageSave:function(a){d(a)},onImageDelete:function(a){d(a)}};b("input[name=userId]").val()&&e()})(jQuery);

//# sourceMappingURL=profile.min.map
