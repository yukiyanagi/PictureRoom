$(function () {
    var PictureStudio = PictureStudio || {};
    PictureStudio.IndexPage = function () {
        this.init();
    };
    PictureStudio.IndexPage.prototype = {
        CLASS: {
            dragged: 'pictureDrop__area--isDragged',
            disabled: 'isDisabled'
        },
        init: function () {
            this.setParameter();
            this.bindEvent();
            this.loadThumbnails();
        },
        setParameter: function () {
            this.$pictureDropArea = $('.js-pictureDropArea');
            this.$uploadForm = $('.js-uploadForm');
            this.$pictureName = $('.js-pictureName');
            this.$uploadButton = $('.js-uploadButton');
            this.$submitForm = $('.js-submitForm');
            this.$thumbnailArea = $('.js-thumbnailArea');
            this.$thumbnailTempalte = this.$thumbnailArea.children('li').detach();

            this.nameDefault = this.$pictureName.text();
        },
        bindEvent: function () {
            this.$pictureDropArea.on('dragover', $.proxy(this.draggedPictureArea, this));
            this.$pictureDropArea.on('dragleave', $.proxy(this.leavePictureArea, this));
            this.$pictureDropArea.on('click', $.proxy(this.clickDropArea, this));
            this.$uploadForm.on('change', $.proxy(this.selectFile, this));
            this.$submitForm.on('submit', $.proxy(this.uploadFile, this));
        },
        draggedPictureArea: function (e) {
            e.preventDefault();
            this.$pictureDropArea.addClass(this.CLASS.dragged);
        },
        leavePictureArea: function (e) {
            e.preventDefault();
            this.$pictureDropArea.removeClass(this.CLASS.dragged);
        },
        clickDropArea: function (e) {
            e.preventDefault();
            this.$uploadForm.trigger('click');
        },
        dropPictureArea: function (e) {
            e.preventDefault();
            this.leavePictureArea(e);
        },
        selectFile: function (e) {
            this.$uploadButton.removeClass(this.CLASS.disabled);
            this.$uploadButton.prop('disabled', false);
            if (this.$uploadForm.get(0).files === undefined) return;
            var file = this.$uploadForm.get(0).files[0];
            this.$pictureName.text(file.name);
            var reader = new FileReader();
            var $pictureDropArea = this.$pictureDropArea;
            reader.onload = function () {
                $pictureDropArea.css('background-image', 'url(' + reader.result + ')');
            };
            reader.readAsDataURL(file);
        },
        uploadFile: function(e) {
            e.preventDefault();
            var formData = new FormData(this.$submitForm.get(0));
            var loadThumbnails = this.loadThumbnails.bind(this);
            this.afterUpload();
            $.ajax({
                url: '',
                type: 'POST',
                data: formData,
                dataType: 'html',
                cache: false,
                processData: false,
                contentType: false,
                timeout: 10000
            }).done(function(data){
                if (JSON.parse(data).result) {
                } else {
                    console.log('upload failed...');
                }
                loadThumbnails();
            }).fail(function(XMLHttpRequest, textStatus, errorThrown){
                console.log(textStatus);
                console.log('upload failed...');
            });
        },
        afterUpload: function() {
            this.$pictureDropArea.css('background-image', '');
            this.$pictureName.text(this.nameDefault);
            this.$uploadButton.prop('disabled', true);
            this.$uploadButton.addClass(this.CLASS.disabled);
        },
        loadThumbnails: function() {
            var createThumbnail = this.createThumbnail.bind(this);
            $.ajax({
                url: 'api/file?limit=8',
                type: 'GET',
                cache: false,
                processData: false,
                contentType: false,
                timeout: 10000
            }).done(function(data){
                if (data.result) {
                    createThumbnail(data.pictures);
                } else {
                    console.log('upload failed...');
                }
            }).fail(function(XMLHttpRequest, textStatus, errorThrown){
                console.log(textStatus);
                console.log('upload failed...');
            });
        },
        createThumbnail: function(pictures) {
            this.$thumbnailArea.html('');
            var fragment = document.createDocumentFragment();
            for(var i in pictures) {
                var $template = this.$thumbnailTempalte.clone();
                $template.children('.js-thumbnailImage').attr('src', pictures[i].thumbnailPath);
                $template.children('.js-thumbnailTitle').text(pictures[i].name);
                $template.get(0).dataset.name = pictures[i].name;
                fragment.appendChild($template.get(0));
            }
            this.$thumbnailArea.get(0).appendChild(fragment);
        }
    };
    new PictureStudio.IndexPage();
});