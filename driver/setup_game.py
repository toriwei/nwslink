import random
import game_utils
from collections import namedtuple
from unidecode import unidecode
from driver import get_random_player, get_random_played_for, get_random_teammate

class Game:
  def __init__(self, IS_RANDOM_GAME): 
    self.IS_RANDOM_GAME = IS_RANDOM_GAME

    self.players = [
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
    ]

    self.connections = [
      {"team": "", "season": ""},
      {"team": "", "season": ""},
      {"team": "", "season": ""},
      {"team": "", "season": ""},
    ]

    self.mystery_players = ["", "", "", ""]
    self.players_set = set()

    self.connections_set = set()
    self.mystery_team = None
    self.Connection = namedtuple('Connection', ['team', 'season'])

  def get_unique_teammate(self, team=None, season=None):
    while True:
      player = get_random_teammate(team, season)
      player_name = player['p'].get('name')
      if player_name not in self.players_set:
        self.players_set.add(player_name)
        return player
      
  def get_unique_season(self, player, team=None):
    while True:
      connection = get_random_played_for(player, team)
      team = connection['t'].get('team')
      season = self.get_random_season(connection['f'].get('seasons'))
      connection_tuple = self.Connection(team, season)
      if connection_tuple not in self.connections_set:
        self.connections_set.add(connection_tuple)
        return connection_tuple

  def get_random_season(self, seasons):
    cleaned_str = seasons.replace('[', "").replace(']', "").replace("\'", "").split(", ")
    return random.choice(cleaned_str)

  def setup_game(self, IS_RANDOM_GAME):
    if IS_RANDOM_GAME:
      for i in range(4):
        if i == 0:
          # get initial mystery player
          mystery_player = get_random_player()
          mystery_team_record = get_random_played_for(mystery_player['p'].get('name'))
          mystery_seasons = mystery_team_record['f'].get('seasons')
          
          # get and set mystery team
          self.mystery_team = self.Connection(
            mystery_team_record['t'].get('team'), 
            self.get_random_season(mystery_seasons))
          self.connections_set.add(self.mystery_team)
          self.connections.append({'team': self.mystery_team[0], 'season': self.mystery_team[1]})

        else:
          # get remaining mystery players
          mystery_player = self.get_unique_teammate(self.mystery_team.team, self.mystery_team.season)

        # set mystery player
        mystery_player_name = mystery_player['p'].get('name') 
        self.mystery_players[i] = mystery_player_name    
        self.players[i][3] = mystery_player_name
        self.players_set.add(mystery_player_name)

        # get secondary connection
        connection = self.get_unique_season(mystery_player_name, self.mystery_team.team)
        self.connections[i]['team'] = connection.team
        self.connections[i]['season'] = connection.season

        # get and set remaining players
        for j in range(3):
          teammate = self.get_unique_teammate(connection.team, connection.season) 
          self.players[i][j] = teammate['p'].get('name')
          self.players[i][j]

      self.players = [[player.upper() for player in row] for row in self.players]
      self.mystery_players = [player.upper() for player in self.mystery_players]
      
    else:
      self.players = game_utils.PLAYERS
      self.connections = game_utils.CONNECTIONS
      self.mystery_team = game_utils.MYSTERY_TEAM
      self.mystery_players = game_utils.MYSTERY_PLAYERS
      self.connections_set = game_utils.CONNECTIONS_SET
    
  def get_grid(self, players, mystery_connections_progress):
    row_connections = mystery_connections_progress[:-1]
    col_connection = mystery_connections_progress[-1]

    player_col_width = max(len(player) for row in players for player in row[:3]) + 2  # padding
    mystery_player_col_width = max(max(len(row[3]) for row in players), max(len(col_connection), len("COLUMN CONNECTION"))) + 2
    mystery_connection_col_width = max(len(connection) for connection in row_connections) + 2

    col_connection_str = f"{col_connection:<{mystery_connection_col_width}}"

    separator = "+--" + "+--".join(["-" * player_col_width] * 3 + ["-" * mystery_player_col_width] + ["-" * mystery_connection_col_width]) + "+"
    label_space = "".join(f"  {' ':<{player_col_width}}" for _ in range(3)) + "   "

    grid_str = label_space + f"{'   MYSTERY PLAYERS':<{mystery_player_col_width + 4}}" + f"{'  ROW CONNECTIONS':<{mystery_connection_col_width + 2}}\n"
    grid_str += separator

    for i, row in enumerate(players):
        grid_str += "\n|" + "|".join(f"  {player:<{player_col_width}}" for player in row[:3]) + f"|  {row[3]:<{mystery_player_col_width}}"

        connection = row_connections[i]
        grid_str += f"|  {connection:<{mystery_connection_col_width}}|"
        grid_str += "\n" + separator

    grid_str += "\n\n" + label_space + f"{'   COLUMN CONNECTION':<{player_col_width + 2}}"
    grid_str += "\n" + label_space + "+--" + "+--".join(["-" * mystery_player_col_width]) + "+"
    grid_str += "\n" + label_space + "|" + f"  {col_connection_str:<{mystery_player_col_width}}|"
    grid_str += "\n" + label_space + "+--" + "+--".join(["-" * mystery_player_col_width]) + "+"

    return grid_str
  
  def get_underscored_name(self, player):
    return " ".join("_" if char != " " else "  " for char in player)

  def set_players_progress(self, players):
    for i in range(0, 4):
      players[i][3] = self.get_underscored_name(self.mystery_players[i])
    return players
  
  def set_connections_progress(self, connections):
    def underscore_connection(connection):
        team, season = connection.rsplit(' ', 1)
        
        underscored_connection = f"{self.get_underscored_name(team)}   {self.get_underscored_name(season)}"
        return underscored_connection

    connections_progress = [underscore_connection(connection) for connection in connections]
    return connections_progress