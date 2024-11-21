# NWSLink

Welcome to NWSLink, a project that explores the club and teammate histories of players in the National Women's Soccer League (NWSLink). It's also a guessing game! Play it at: https://nwslink.vercel.app/

This README is a general overview of this project's components.

Further Documentation:

- [dataset.md](/documentation/dataset.md): data collection and processing
- [database.md](/documentation/database.md): Neo4j setup process
- [guide.md](/documentation/guide.md): examples of database queries

## Tech Stack

- **Backend**
  - Database: Neo4j, Cypher
  - Processing: pandas, python
  - API: Flask (hosted on Render)
  - Hosting: Neo4j AuraDB
- **Frontend**
  - Framework: Next.js, JavaScript
  - Styling: Tailwind CSS
  - Hosting: Vercel

## Database

The database can be used to explore how players are connected through clubs and/or teammates and how rosters change over time.

**Examples:**

Teammates of Christen Press, sorted by club
![christen press teammates graph](/example-images/find-teammates.png)

Teams that the 2017 Boston Breakers roster played for in 2018 (Boston disbanded after their 2017 season)
![boston breakers dispersal graph](/example-images/dispersal.png)

Visit [guide.md](/documentation/guide.md) for more examples and their respective queries.

## Driver

The [driver](./driver/) folder contains the data access layer to run queries from the command line.

## Game

The guessing game challenges users to identify players and their playing histories with teammates and clubs.

### Terminal

Example:

![game](/example-images/game.png)

Run with `python3 run_game.py`.

### Web App

Example:

![game](/example-images/webapp-game.png)

Play at https://nwslink.vercel.app/

## Future Goals

- **Code Organization**: All components (the database system, API, games) are all in this repo. To improve modularity, I would separate the database/API from the game and any future apps that I create.
- **Web App Guessing Game**:
  - Include on-screen keyboard for increased accessibility
  - Implement filters to select a team for the Column Link, so users can guess players of of a club they are familiar with
  - Change setup/loading spinner to progress bar to provide more info to user
  - Create 'share' functionality to publish game results to social media or text
- **Public Queries**: Currently, the Neo4j database is private but can be queried through the API. I would like to create a web app that lets users visualize queried results.
