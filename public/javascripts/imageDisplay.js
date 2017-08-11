var PictureRoom = PictureRoom || {};
PictureRoom.ImageDisplay = function(args) {
  this.args = args;
  this.init();
};
PictureRoom.ImageDisplay.prototype = {
  MARGIN: 30,
  HEADER_HEIGHT: 50,
  INTERVAL: 300,
  init: function() {
    this.setParameter();
    this.bindEvent();
  },
  setParameter: function() {
    this.$window = $(window);
    this.$body = $('html, body');
    this.$displayContainer = $('.js-imageDisplayContainer');
    this.$display = $('.js-imageDisplay');
    this.$prevBtn = $('.js-prevBtn');
    this.$nextBtn = $('.js-nextBtn');
    this.$closeBtn = $('.js-closeBtn');

    this.selectorDisplayTrigger = this.args.selectorDisplayTrigger;
    this.selectorImage = this.args.selectorImage;

    this.windowWidth = (window.innerWidth || document.documentElement.clientWidth || 0);
    this.windowHeight = (window.innerHeight || document.documentElement.clientHeight || 0);
  },
  bindEvent: function() {
    this.$window.on('resize', $.proxy(this.resizeWindow, this));
    this.$prevBtn.on('click', $.proxy(this.movePrev, this));
    this.$nextBtn.on('click', $.proxy(this.moveNext, this));
    this.$closeBtn.on('click', $.proxy(this.closeImageDisplay, this));
    
    this.$body.on('click', this.selectorDisplayTrigger, $.proxy(this.displayImage, this));

    this.currentIndex = 0;

    this.timer = undefined;
  },
  resizeWindow: function() {
    if (this.timer !== undefined) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout( $.proxy(function(){
      this.windowWidth = (window.innerWidth || document.documentElement.clientWidth || 0);
      this.windowHeight = (window.innerHeight || document.documentElement.clientHeight || 0);
      if (this.$displayContainer.outerWidth() > 0) {
        this.displayImage();
      }
      this.timer = undefined;
    }, this), this.INTERVAL);
  },
  displayImage: function(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    var size = this.windowWidth > this.windowHeight ? this.windowHeight : this.windowWidth;
    size -= this.MARGIN;
    this.$displayContainer.width(size);
      clearTimeout(this.timer);
      this.$displayContainer.height(size - this.HEADER_HEIGHT);
    if (!e) return;
    var imageURL = $(e.currentTarget).find(this.selectorImage).attr('src').replace('/thumbnails/', '/uploads/');
    this.$display.css('background-image', 'url("' + imageURL + '")');
    this.currentIndex = $(this.selectorDisplayTrigger).index($(e.currentTarget));
  },
  movePrev: function(e) {
    e.preventDefault();
    if (--this.currentIndex < 0) {
      this.currentIndex = $(this.selectorDisplayTrigger).length - 1;
    }
    var $image = $(this.selectorDisplayTrigger).eq(this.currentIndex).find(this.selectorImage);
    var imageURL = $image.attr('src').replace('/thumbnails/', '/uploads/');
    this.$display.css('background-image', 'url("' + imageURL + '")');
  },
  moveNext: function(e) {
    e.preventDefault();
    if (++this.currentIndex >= $(this.selectorDisplayTrigger).length) {
      this.currentIndex = 0;
    }
    var $image = $(this.selectorDisplayTrigger).eq(this.currentIndex).find(this.selectorImage);
    var imageURL = $image.attr('src').replace('/thumbnails/', '/uploads/');
    this.$display.css('background-image', 'url("' + imageURL + '")');
  },
  closeImageDisplay: function(e) {
    e.preventDefault();
    this.$displayContainer.width(0);
    this.$displayContainer.height(0);
  }
};