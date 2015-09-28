var fs = require("fs");

function filter() {
	var games = require("./crunched/all.json");

	var logs = {};

	for (var c = 12; c <= 27; c += 1) {
		logs[c] = [];
	}

	console.log(logs);

	games.forEach(function(game) {
		var home = game.starters.home[2],
			away = game.starters.away[2];

		if (home >= 12) {
			logs[home].push(game);
		} 

		if (away >= 12 && away != home) {
			console.log(away);
			logs[away].push(game);
		}
	});

	fs.writeFile("crunched/logs.json", JSON.stringify(logs, null, 2));
}

filter();