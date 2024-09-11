from collections import namedtuple
from unidecode import unidecode

Connection = namedtuple('Connection', ['team', 'season'])

PLAYERS = [
  ['Clare Polkinghorne', 'Kendall Johnson', 'Michelle Betos', 'Sinead Farrelly'],
  ['Raquel Rodríguez', 'Emily Menges', 'Simone Charley', 'Yazmeen Ryan'],
  ['Cari Roccaro', 'Kendall Fletcher', 'Lynn Williams', 'Taylor Smith'],
  ['Emily van Egmond', 'Toni Pressley', 'Ashlyn Harris', 'Kristen Edmonds']
]

PLAYERS = [[unidecode(player.upper()) for player in row] for row in PLAYERS]

CONNECTIONS = [
  {'team': 'Thorns', 'season': '2015'},
  {'team': 'Thorns', 'season': '2021'},
  {'team': 'Courage', 'season': '2021'},
  {'team': 'Pride', 'season': '2019'},
  {'team': 'Gotham', 'season': '2023'}
]

MYSTERY_TEAM = Connection(team='Gotham', season='2023')

MYSTERY_PLAYERS = [row[3] for row in PLAYERS]

MYSTERY_PLAYERS = [unidecode(player.upper()) for player in MYSTERY_PLAYERS]

CONNECTIONS_SET = {
  Connection(team='Courage', season='2021'),
  Connection(team='Gotham', season='2023'),
  Connection(team='Thorns', season='2015'),
  Connection(team='Thorns', season='2021'),
  Connection(team='Pride', season='2019')
}

def print_setup(players, connections, mystery_team, connections_set, mystery_players):
  elements = {
      "Players Grid": players,
      "Connections": connections,
      "Mystery Team": [mystery_team],
      "Connections Set": connections_set,
      "Mystery Players": mystery_players
  }

  for title, values in elements.items():
      print(f"\n{title}:")
      for item in values:
          print(item)
