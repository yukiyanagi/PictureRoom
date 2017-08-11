var PictureRoom = PictureRoom || {};
PictureRoom.IndexPage = function () {
    this.init();
};
PictureRoom.IndexPage.prototype = {
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
        this.$thumbnailArea = $('.js-thumbnailArea');
        this.$thumbnailTempalte = this.$thumbnailArea.children('li').detach();

        this.$thumbnailArea.html('');
        this.$loadBtn = $('.js-loadBtn');
        this.loadCount = 16;
        this.max = this.loadCount;
        this.min = 0;
    },
    bindEvent: function () {
        this.$loadBtn.on('click', $.proxy(this.loadMore, this));
    },
    loadThumbnails: function() {
        var createThumbnail = this.createThumbnail.bind(this);
        $.ajax({
            url: 'api/file?min=' + this.min + '&max=' + this.max,
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
    loadMore: function(e) {
        if (e) e.preventDefault();
        this.min += this.loadCount;
        this.max += this.loadCount;
        this.loadThumbnails();
    },
    createThumbnail: function(pictures) {
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
$(function () {
    new PictureRoom.IndexPage();
    new PictureRoom.ImageDisplay({
        selectorDisplayTrigger: '.js-thumbnailArea > li',
        selectorImage: 'img'
    });
});