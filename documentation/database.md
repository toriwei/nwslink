# Neo4j Database Setup

This page documents my process of creating the Neo4j databases for NWSLink.

I chose Neo4j because the graph database model can easily link players with teammates and players with clubs. I had also previously used Neo4j during my Database Systems [course](https://dondi.lmu.build/archive/) in school.

I first created a self-managed server before moving to AuraDB so it could be 'always-on' for the web app game. Both have browser-based querying and visualization tools. It uses Cypher, a SQL-like query language.

## Prerequisites/Loading the Dataset

### Install SoccerData

```
python3 -m pip install soccerdata
```

See SoccerData's [GitHub repo](https://github.com/probberechts/soccerdata) or [Quickstart guide](https://soccerdata.readthedocs.io/en/latest/intro.html) for more info.

### Download and Preprocess the Data

This uses `pandas` and `numpy` packages.

```
python3 preprocess.py
```

## Setting Up Neo4j (Self-Managed)

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

I preferred this setup because it provided simple project organization. It made the respective processes for deleting and exporting data easy, since I knew I was modifying only relevant data.

```
- database-work
  - neo4j
    - conf
    - data
    - logs
    - run
  - nwslink
```

### Import to Neo4j

Initialize a Neo4j database

```
NEO4J_CONF=<absolute path to conf directory> neo4j console
```

Import data

```
NEO4J_CONF=<absolute path to conf directory> neo4j-admin database import full --nodes=Player="player_header.csv,players.csv" --nodes=Team="team_header.csv,teams.csv" --relationships=PLAYED_FOR="played_for_header.csv,played_for.csv" --relationships=PLAYED_WITH="played_with_header.csv,played_with.csv" --id-type=STRING --delimiter "*"
```

Re-run start command to set log-in. Should be accessible at http://localhost:7474/.

```
NEO4J_CONF=<absolute path to conf directory> neo4j console
```

## Converting to AuraDB

In the designated neo4j directory, create a `dumps` folder for the self-managed data.

Then, navigate to the neo4j installation folder and go to the bin.

Run this command to export the data to the newly created `dumps` folder.

```
export NEO4J_CONF=<absolute path to conf directory> ./neo4j-admin database dump neo4j --to-path=<absolute path to dumps directory>
```

Create an instance on the [AuraDB console](https://console.neo4j.io/?product=aura-db&_gl=1*1mq3cz6*_ga*MjA4NzQ0MDI0OC4xNzIyOTc4Mzkw*_ga_DZP8Z65KK4*MTczMjIxNDkxMy44LjEuMTczMjIxNjQyOS4wLjAuMA..*_gcl_aw*R0NMLjE3MzIyMTY0MjcuQ2owS0NRaUEwZnU1QmhEUUFSSXNBTVhVQk9Mem0td0VCaVNFakV0Vlp3eERKOXhhWUozZ1BMRUVBRTRlbmRjd0xrZjBKelNZTjlIbGFqTWFBcFVBRUFMd193Y0I.*_gcl_au*MTE3MjE3MDc3OS4xNzMxMzQ3NDIw*_ga_DL38Q8KGQC*MTczMjIxNDkxMy40MS4xLjE3MzIyMTY0MjkuMC4wLjA.) and upload the dump file.

See the Neo4j [guide](https://neo4j.com/docs/aura/tutorials/migration/) for more migration information.

### Using AuraDB

After setup is complete, update `driver.py` to call the AuraDB database.

```
db = GraphDatabase.driver(os.getenv('DB_URL'), auth=(db_user, os.getenv('DB_PASSWORD')))
```

Environment variables:

```
DB_PASSWORD=<password given during AuraDB setup>
DB_URL=neo4j+ssc://<Instance ID>.databases.neo4j.io
```

## Using the Driver

Documentation and setup for the driver can be found on the [Neo4j site](https://neo4j.com/docs/api/python-driver/current/).

With the self-managed database, files can be run with:

```
DB_URL=neo4j://localhost DB_PASSWORD=<password> python3 <file_name> <args>
```

With the AuraDB version, files can be run with just:

```
python3 <file_name> <args>
```
