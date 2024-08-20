import random
from collections import namedtuple
from driver import get_random_player, get_random_played_for, get_random_teammate

class Game:
  def __init__(self): 
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
    self.grid_str = ""

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

  def setup_game(self):
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
      # print(mystery_player_name)
      # print(connection)

      # get and set remaining players
      for j in range(3):
        teammate = self.get_unique_teammate(connection.team, connection.season) 
        self.players[i][j] = teammate['p'].get('name')
        self.players[i][j]
    
  def get_grid(self, players):
    column_width = max(len(player) for row in players for player in row[:3]) + 2
    fourth_column_width = max(len(row[3]) for row in players) + 2

    separator = "+--" + "+--".join(["-" * column_width] * 3 + ["-" * fourth_column_width]) + "+"

    self.grid_str += separator
    for row in players:
        self.grid_str += "\n|" + "|".join(f"  {player:<{column_width}}" for player in row[:3]) + f"|  {row[3]:<{fourth_column_width}}|"
        self.grid_str += "\n" + separator
    return self.grid_str
  
  def get_underscored_name(self, player):
    return " ".join("_" if char != " " else "  " for char in player)


if __name__ == "__main__":
    game = Game()
    game.setup_game()