from collections import namedtuple

Connection = namedtuple('Connection', ['team', 'season'])

def get_underscored_name( player):
  return " ".join("_" if char != " " else "  " for char in player)

def get_mystery_players_progress(mystery_players):
  underscore_mystery_players = []
  for player in mystery_players:
    underscore_mystery_players.append(get_underscored_name(player))
  return underscore_mystery_players


players = [
  ['Danielle Colaprico', 'Rachel Hill', 'Bianca St Georges', 'Arin Wright'],
  ['Allysha Chapman', "Heather O'Reilly", 'Abby Dahlkemper', 'Abby Erceg'],
  ['Aubrey Kingsbury', 'Bayley Feist', 'Dorian Bailey', 'Jordan Baggett'],
  ['Christine Nairn', 'Alanna Kennedy', 'Toni Pressley', 'Carson Pickett'],
]
connections = [
  {'team': 'Red Stars', 'season': '2022'},
  {'team': 'Courage', 'season': '2018'},
  {'team': 'Spirit', 'season': '2023'},
  {'team': 'Pride', 'season': '2018'}
]

mystery_team = Connection(team='Louisville', season='2024')

mystery_players = ["Arin Wright", "Abby Erceg", "Jordan Baggett", "Carson Pickett"]

guess_progress = get_mystery_players_progress(mystery_players)

def get_dynamic_grid(players, guess_progress):
  dynamic_grid = []
  for i, row in enumerate(players):
    row_arr = []
    for j, player in enumerate(row):
      if j != 3:
        row_arr.append(player)
      else:
        row_arr.append(guess_progress[i])
    dynamic_grid.append(row_arr)
  return dynamic_grid

dynamic_grid = get_dynamic_grid(players, guess_progress)
for row in dynamic_grid:
  print(row)

