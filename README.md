# NWSLink

NWSLink explores the club and teammate history of players in the National Women's Soccer League through Neo4j. This project uses [SoccerData](https://github.com/probberechts/soccerdata) to collect data from [FBref](https://fbref.com/en/).

## About the Dataset

### Schema

![schema](schema.png)

### Content

This dataset contains NWSL club history data for all players that received minutes during all official seasons up to the latest update to the database (Aug 2024). Therefore, players who did not play any minutes in a season will not have that season listed. Players who never played any minutes in any season are not included in the database at all. The database also does not include data from the 2020 season, as it was played as the NWSL Challenge Cup and NWSL Fall Series due to COVID-19 protocols. According to FBref, "Stats for the Challenge Cup and Fall Series are not counted toward league stats, per league determination."

## Setting Up Neo4j

```
brew install --cask neo4j
```

It can also be downloaded on [their website](https://neo4j.com/deployment-center/) under `Graph Database Self-Managed` (community version). The website has options to work with the database through desktop and cloud environments as well.

### Create Directories

1. Create a designated Neo4j folder with the following directories: `conf`, `data`, `logs`, `run`
2. Find the `neo4j.conf` file from the installation and copy it into the new conf folder.
3. Copy the following into the new `neo4j.conf` file:

```
server.directories.data=</absolute/path/to/created/data/folder>
server.directories.logs=</absolute/path/to/created/logs/folder>
server.directories.run=</absolute/path/to/created/run/folder>
server.config.strict_validation.enabled=false
```

If the database needs to be reset/reconfigured, delete the contents of the created `data`, `log`, and `run` folders.

## Loading the Dataset

This uses `pandas` and `numpy` packages.

### Install SoccerData

```
python3 -m pip install soccerdata
```

See SoccerData's [GitHub repo](https://github.com/probberechts/soccerdata) or [Quickstart guide](https://soccerdata.readthedocs.io/en/latest/intro.html) for more info.

### Download and Preprocess the Data

```
python3 preprocess.py
```

### Import to Neo4j

Initialize a Neo4j database

```
NEO4J_CONF=<absolute path to conf directory> neo4j console
```

Import data

```
NEO4J_CONF=<absolute path to conf directory> neo4j-admin database import full --nodes=Player="player_header.csv,players.csv" --nodes=Team="team_header.csv,teams.csv" --relationships=PLAYED_FOR="played_for_header.csv,played_for.csv" --relationships=PLAYED_WITH="played_with_header.csv,played_with.csv" --id-type=STRING --delimiter "\*"
```

Neo4j server ready for use. Re-run start command to set log-in and start using.

```
NEO4J_CONF=<absolute path to conf directory> neo4j console
```

## Uses

This database can be used to explore how players are connected through clubs and/or teammates and how rosters change over time.

**Examples:**

Teammates of Christen Press, sorted by club
![asdf](/example-images/find-teammates.png)

Teams that the 2017 Boston Breakers roster played for in 2018 (Boston disbanded after their 2017 season)
![asdf](/example-images/dispersal.png)

Visit [guide.md](/guide.md) for more examples and their respective queries.

## Driver

The [driver](./driver/) folder contains the data access layer (dal) to run the Python driver from the command line. Documentation and setup for the driver can be found on the [Neo4j site](https://neo4j.com/docs/api/python-driver/current/).

Programs can be run with the following command (password is the same as the one created for the Neo4j broswer):

```
DB_URL=neo4j://localhost DB_PASSWORD=<password> python3 <file_name> <args>
```

## Game

NWSLink (The Game) uses the driver to generate a group of random teammates. Using other clubs and teammates each player has played with and for, the user must guess the mystery teammates and team connections.

Example game:
![game](/example-images/game.png)

It is a text-based terminal game and can be run with the command:

```
DB_URL=neo4j://localhost DB_PASSWORD=<password> python3 <file_name> run_game.py
```
