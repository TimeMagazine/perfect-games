var fs = require("fs");

function get_distribution() {
	var games = require("./crunched/all.json");
	var distribution = Array.apply(null, Array(28)).map(Number.prototype.valueOf,0);

	games.forEach(function(game) {
		var home = game.starters.home[2],
			away = game.starters.away[2];

		distribution[home] += 1;
		distribution[away] += 1;
	});

	distribution = distribution.map(function(d, i) { return [i, d]; });

	// cumulative
	distribution[distribution.length-1].push(distribution[distribution.length-1][1]);
	for (var c = distribution.length - 2; c >= 0; c -= 1) {
		distribution[c].push(distribution[c][1] + distribution[c+1][2]);
	}

	var total = distribution[0][2];

	distribution.forEach(function(d) {
		d.push(100 * d[2] / total);
	});

	fs.writeFile("crunched/distribution.json", JSON.stringify(distribution, null, 2));
}

get_distribution();