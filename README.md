# How Long Do Perfect Games Last

## Step 1

Download and unzip the [play-by-play files](http://www.retrosheet.org/game.htm) from Retrosheet for any and all seasons you're interesting in and unzip them.

## Step 2

Clone this repo:

	git clone https://github.com/TimeMagazine/perfect-games.git && cd perfect-games
	npm install

Crunch through those files calculating consecutive outs from the first batter for each pitcher in each game:

	node crunch.js /path/to/retrosheet/data

The script will recursively walk through whatever directory you feed it, looking for files with an extension of `.EVA` or `.EVN`, so don't worry if different seasons are in different files

## Step 3

The previous step outputs a large file called `all.json` with info for each game like so:

	  {
	    "id": "FLO201005290",
	    "info": {
	      "visteam": "PHI",
	      "hometeam": "FLO",
	      "date": "2010/05/29"
	    },
	    "starters": {
	      "away": [
	        "hallr001",
	        "\"Roy Halladay\"",
	        27
	      ],
	      "home": [
	        "johnj009",
	        "\"Josh Johnson\"",
	        1
	      ]
	    }
	  }

Do condense this down to a distribution of consecutive outs, just run:

	node index.js distribute