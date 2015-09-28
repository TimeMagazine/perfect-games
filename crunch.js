var fs = require("fs"),
	walk = require('fs-walk'),
	args = require('minimist')(process.argv.slice(2)),
	LineByLineReader = require('line-by-line');



// NOT efficient
function get_all_games() {
	if (!args._[0]) {
		console.log("Please enter the directory to the game files as the first argument");
		return;
	}
	var dir = [];

	// change this dire
	walk.walkSync(args._[0], function(basedir, filename, stat) {
		if (filename.split(".")[1] == "EVN" || filename.split(".")[1] == "EVA") {
			dir.push(basedir + "/" + filename);
		}
	});

	var all_games = [];
	dir.forEach(function(filename, count) {
		crunch_team(filename, function(games) {
			all_games = all_games.concat(games);
			delete games;
			if (count = dir.length) {
				fs.writeFile("crunched/all.json", JSON.stringify(all_games, null, 2));
			}
		});
	});


	// documentation: http://www.retrosheet.org/datause.txt

	function crunch_team(filename, callback) {
		//var rl = readline(filename),
		var rl = new LineByLineReader(filename),
			games = [],
			game,
			home_streak,
			away_streak,
			distribution = {};

		rl.on("line", function(line) {
			var data = line.split(",");
			if (data[0] === "id") { // new game
				//console.log(game);
				if (game) { games.push(game); }
				game = {
					id: data[1],
					info: {},
					starters: {}
				};
				home_streak = true;
				away_streak = true;
			}

			if (data[0] === "info" && (data[1] == "visteam" || data[1] == "hometeam" || data[1] == "date")) {
				game.info[data[1]] = data[2];
			}

			if (data[0] === "start" && data[5] === '1') { // if starting pitcher
				if (data[3] === '0') {
					game.starters.away = [ data[1], data[2], 0 ]; // player ID, name, consecutive outs from start of game
				} else {
					game.starters.home = [ data[1], data[2], 0 ]; // player ID, name, consecutive outs from start of game
				}
			}

			if (data[0] === "play" && data[6] != "NP") {
				var out = /[K0-9]/.test(data[6][0]) ? "out" : "not out";
				if (out == "not out") {
					if (data[2] == "0") { // if hit was by away team
						home_streak = false;
					} else {
						away_streak = false;
					}
				}
				if (home_streak && out == "out" && data[2] == 1) {
					game.starters.home[2] += 1;
				} else if (away_streak && out && data[2] == 0) {
					game.starters.away[2] += 1;
				}
			}

			if (home_streak && data[0] === "sub" && data[5] == "1" && data[3] == "1") { // pitcher was pulled
				console.log("Home pitcher was pulled in middle of perfect game", game.id, data);
				home_streak = false;
			}

			if (away_streak && data[0] === "sub" && data[5] == "1" && data[3] == "0") { // pitcher was pulled
				console.log("Away pitcher was pulled in middle of perfect game", game.id, data);
				away_streak = false;
			}
		});

		rl.on("end", function() {
			console.log(filename);
			//fs.writeFile("crunched/" + filename.split(".")[0] + ".json", JSON.stringify(games, null, 2));
			callback(games);
		});
	}
}

get_all_games();
