var WebTorrent = require('webtorrent');
var client = new WebTorrent();

var fs = require('fs');

var theTorrent;
process.on('message', function(data) {
	switch(data.type){
		case 'download':
			log('CHILD start: '+data.torrent);
			client.add(data.torrent, {path: __dirname+"/public/downloads/"}, function (torrent) {
				theTorrent = torrent;
				// Got torrent metadata!
				log("Start torrent: "+torrent.name);

				var timeout = new Date().getTime();
				torrent.on('download', function (chunkSize) {
					var currentTime = new Date().getTime();
					if((currentTime - timeout) > 1000){
						process.send({'type':"info", 'torrent': listTorrents()});
						timeout = currentTime;
					}
				});

				torrent.on('done', function(){
			  			log("Finish torrent: "+torrent.name);
			  			process.send({'type':"finish",'hash':torrent.infoHash});
			  			torrent.destroy();
				});
			});	
			break;

		case 'info':
			process.send({'type':"info", 'torrent': listTorrents()});
			break;

		case 'remove':
			log("Removing torrent: "+theTorrent.name);
			process.send({'type':"finish",'hash':theTorrent.infoHash});
			theTorrent.destroy();
			break;
	}
});

function listTorrents(){
	var t = {};
	client.torrents.forEach(function (torrent){
		if(!torrent.client.destroyed){
			t.name = torrent.name;
			t.size = torrent.length;
			if(torrent.swarm){
				t.hash = torrent.infoHash;
				t.sdown = torrent.swarm.downloadSpeed();
				t.sup = torrent.swarm.uploadSpeed();
				t.down = torrent.swarm.downloaded;
				t.up = torrent.swarm.uploaded;
				t.progress = torrent.progress;
				t.timeRemaining = torrent.timeRemaining;
			}
		}
	});

	return t;
}

function log(text){
	console.log(text);
	fs.appendFile("log.txt", text+"\n", 'utf8', function(err){
		if(err) throw err;
	});
}