var Picture = function(args) {
  this.init(args);
};
Picture.prototype = {
  init: function(args) {
    this.name = args.name || '';
    this.path = args.path || '';
    this.thumbnailPath = args.thumbnailPath || '';
    this.ctime = args.ctime || 0;
    this.mtime = args.mtime || 0;
  }
};
module.exports = Picture;