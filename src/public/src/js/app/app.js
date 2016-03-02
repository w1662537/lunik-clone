$.when(
  $.getScript('src/js/app/format.js'),
  $.getScript('src/js/pnotif/pnotif.js'),
  $.getScript('src/js/storage.js'),
  $.getScript('src/js/app/mediainfo.js'),
  $.getScript('src/js/jquery/jquery-ui.min.js'),
  $.getScript('src/js/jquery/jquery-ui.touch-punch.min.js'),
  $.getScript('src/js/app/directory.js'),
  $.getScript('src/js/app/torrent.js'),
  $.getScript('src/js/app/top-menu.js'),
  $.getScript('src/js/jquery/jquery.tablesorter.min.js'),
  $.getScript('src/js/app/list.js'),
  $.getScript('src/js/app/searchtorrent.js'),
  $.getScript('src/js/pnotif/pnotif.js'),
  $.getScript('src/js/app/left-menu.js'),
  $.getScript('src/js/app/mediainfo.js'),
  $.getScript('src/js/app/searchtorrent.js'),
  $.getScript('src/js/storage.js'),
  $.getScript('src/js/popup/popup.js')
).then(function(){
  var LeftMenu = new _LeftMenu()
  var MediaInfo = new _MediaInfo()
  var SearchTorrent = new _SearchTorrent()
})