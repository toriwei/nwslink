import os

from neo4j import GraphDatabase


# This is for convenience since the `neo4j` user is known to be created by default.
# We do still let an environment variable override it if needed.
db_user = os.environ['DB_USER'] if os.environ.get('DB_USER') else 'neo4j'

# The Neo4j documentation calls this object `driver` but the name `db` is used here
# to provide an analogy across various DAL examples.
db = GraphDatabase.driver(os.environ['DB_URL'], auth=(db_user, os.environ['DB_PASSWORD']))

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
    WITH p ORDER BY rand() LIMIT 1
    RETURN p
    """
    )
    return result.single()
  
def get_random_season(player= None, team= None):
  with db.session() as session:
    result = session.run(
    """
    MATCH (p:Player)-[f:PLAYED_FOR]->(t:Team)
    WHERE (p.name = $player OR $player IS NULL)
    AND (t.team <> $team OR $team IS NULL)
    WITH t, f ORDER BY rand() LIMIT 1
    RETURN *
    """,
    player= player,
    team= team,
    )
    return result.single()
  
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
      WITH p ORDER BY rand() LIMIT 1
      RETURN p
      """,
      team=team,
      season=season
    )
    return result.single()