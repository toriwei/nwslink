import random
from collections import namedtuple
from driver import get_random_player, get_random_season, get_random_teammate

try:

  players = [
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
  ]

  connections = [
    {"team": "", "season": ""},
    {"team": "", "season": ""},
    {"team": "", "season": ""},
    {"team": "", "season": ""},
  ]

  mystery_players = ["", "", "", ""]
  used_players = set()

  Connection = namedtuple('Connection', ['team', 'season'])
  connections_set = set()
  mystery_team = None


  def get_unique_teammate(team=None, season=None):
    while True:
      player = get_random_teammate(team, season)
      player_name = player['p'].get('name')
      if player_name not in used_players:
        used_players.add(player_name)
        return player
      
  def get_unique_season(player, team=None):
    while True:
      connection = get_random_season(player, team)
      team = connection['t'].get('team')
      season = clean_random_season(connection['f'].get('seasons'))
      connection_tuple = Connection(team, season)
      if connection_tuple not in connections_set:
        connections_set.add(connection_tuple)
        return connection_tuple
  
  def clean_random_season(seasons):
    cleaned_str = seasons.replace('[', "").replace(']', "").replace("\'", "").split(", ")
    return random.choice(cleaned_str)

  for i in range(4):
    # get mystery player
    if i == 0:
      mystery_player = get_random_player()

      # set mystery team
      mystery_team_info = get_random_season(mystery_player['p'].get('name'))

      mystery_season = clean_random_season(mystery_team_info['f'].get('seasons'))
      mystery_team = Connection(mystery_team_info['t'].get('team'), mystery_season)
      connections_set.add(mystery_team)


    else:
      mystery_player = get_unique_teammate(mystery_team.team, mystery_team.season)

    # set mystery player
    mystery_player_name = mystery_player['p'].get('name') 
    mystery_players[i] = mystery_player_name
    
    # set overall players with mystery player
    players[i][3] = mystery_player_name
    used_players.add(mystery_player_name)

    # get mystery player's secondary connection

    print(mystery_player_name)
    connection = get_unique_season(mystery_player_name, mystery_team.team)
    connections[i]['team'] = connection.team
    connections[i]['sesaon'] = connection.season
    print(connection)

    for j in range(3):
      teammate = get_unique_teammate(connection.team, connection.season) 
      players[i][j] = teammate['p'].get('name')
      players[i][j]

  print("Players Grid:")
  for row in players:
      print(row)

  print("\nConnections:")
  for connection in connections:
      print(connection)

  print("\nMystery Team:")
  print(mystery_team)

  print("\nConnections Set:")
  for connection_set in connections_set:
      print(connection_set)


except ValueError:
  print(f'Sorry, something went wrong. Please ensure that the information is correct')