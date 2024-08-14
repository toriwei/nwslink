import os

from neo4j import GraphDatabase


# This is for convenience since the `neo4j` user is known to be created by default.
# We do still let an environment variable override it if needed.
db_user = os.environ['DB_USER'] if os.environ.get('DB_USER') else 'neo4j'

# The Neo4j documentation calls this object `driver` but the name `db` is used here
# to provide an analogy across various DAL examples.
db = GraphDatabase.driver(os.environ['DB_URL'], auth=(db_user, os.environ['DB_PASSWORD']))
print(db.session)
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