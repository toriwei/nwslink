import os
import random
from dotenv import load_dotenv

from neo4j import GraphDatabase

load_dotenv()

# This is for convenience since the `neo4j` user is known to be created by default.
# We do still let an environment variable override it if needed.
db_user = 'neo4j'

# The Neo4j documentation calls this object `driver` but the name `db` is used here
# to provide an analogy across various DAL examples.
db = GraphDatabase.driver(os.getenv('DB_URL'), auth=(db_user, os.getenv('DB_PASSWORD')))

def get_teammates(player):
  with db.session() as session:
    result = session.run(
      """
      MATCH (p:Player {name: $player})-[f:PLAYED_FOR]->(t:Team)<-[a:PLAYED_FOR]-(m:Player)-[:PLAYED_WITH]->(p)
      RETURN m.name AS name, t.team AS team
      ORDER BY team ASC, name ASC
      """,
      player=player
    )
    return [record for record in result]
  
def get_shortest_path(player_1, player_2):
  with db.session() as session:
    result = session.run(
      """
      MATCH (a:Player),(b:Player)
      WHERE a.name=$player_1 AND b.name=$player_2
      MATCH p = shortestPath((a)-[*]-(b))
      RETURN p
      """,
      player_1=player_1,
      player_2=player_2
    )
    return result.single()

def get_random_player():
  with db.session() as session:
    result = session.run(
      """
      MATCH (p:Player)-[f:PLAYED_FOR]->(t:Team)
      WITH p, COUNT(t) AS num_teams
      WHERE num_teams > 1
      RETURN p
      """
    )
    players = [record['p'] for record in result]    
    return random.choice(players) if players else None
  
def get_random_played_for(player=None, team=None):
  with db.session() as session:
    result = session.run(
      """
      MATCH (p:Player)-[f:PLAYED_FOR]->(t:Team)
      WHERE (p.name = $player OR $player IS NULL)
      AND (t.team <> $team OR $team IS NULL)
      RETURN t, f
      """,
      player= player,
      team= team,
    )

    teams = [record for record in result]
    return random.choice(teams) if teams else None
  
def get_random_teammate(team, season):
  with db.session() as session:
    result = session.run(
      """
      MATCH (p:Player)-[f:PLAYED_FOR]->(t:Team)
      WHERE (t.team = $team) 
        AND (f.seasons CONTAINS $season)
      WITH p
      MATCH (p:Player)-[f:PLAYED_FOR]->(t:Team)
      WITH p, COUNT(t) AS num_teams
      WHERE num_teams > 1
      RETURN p
      """,
      team=team,
      season=season
    )
    players = [record['p'] for record in result]
    return random.choice(players) if players else None
  
def get_nonalpha_names():
  with db.session() as session:
    result = session.run(
      """
      MATCH (p:Player)
      WHERE p.name =~ '.*[^a-zA-Z\s].*'
      RETURN p.player_id AS player_id, p.name AS name
      """
    )
    return [record for record in result]
  
def update_player_names(updates):
  with db.session() as session:
    result = session.run(
      """
      UNWIND $updates AS update
      MATCH (p:Player {player_id: update.player_id})
      SET p.name = update.updated_name
      RETURN p
      """,
      updates=updates
    )
    return [record for record in result]
  
def is_valid_player(name):
  with db.session() as session:
    result = session.run(
      """
      MATCH (p:Player)
      WHERE toUpper(p.name)=$name
      RETURN p
      """,
      name=name
    )
    return [record for record in result]
  
def is_valid_team_name(team):
  with db.session() as session:
    result = session.run(
      """
      MATCH (t:Team)
      WHERE toUpper(t.team)=$team
      RETURN t
      """,
      team=team
    )
    return result.single()