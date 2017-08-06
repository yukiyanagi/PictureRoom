var Picture = function(args) {
  this.args = args;
  this.init();
};
Picture.prototype = {
  init: function() {
    this.name = this.args.name || '';
    this.path = this.args.path || '';
    this.thumbnailPath = this.args.thumbnailPath || '';
  }
};
module.exports = Picture;