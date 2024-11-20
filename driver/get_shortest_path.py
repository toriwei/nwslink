import sys
from nwsl_driver import get_shortest_path

if len(sys.argv) != 3:
  print('Usage get_shortest_path.py <player_1> <player_2>')
  exit(1)

player_1 = sys.argv[1]
player_2 = sys.argv[2]


try:
  result = get_shortest_path(player_1, player_2)
  nodes = result['p'].nodes

  if (result) == 0:
    print(f'There are no shared connections between {player_1} and {player_2}.')
    exit(0)

  print(f'Getting the shortest path between {player_1} and {player_2}')
  paths = ""
  start_node = result['p'].start_node
  paths += start_node.get('name')
  for relationship in result['p'].relationships:
    connection = " --" + " ".join(list(relationship._properties.values())) + "-- "
    paths += connection
    for node in relationship.nodes:
      if start_node.element_id != node.element_id:
        if "Player" in node.labels:
          paths += node.get('name')
        elif "Team" in node.labels:
         paths += node.get('team')
        start_node = node
        break

  print(paths)

except ValueError:
  print(f'Sorry, something went wrong. Please ensure that the information is correct')