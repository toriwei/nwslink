import sys
from dal import get_teammates

if len(sys.argv) != 2:
  print('Usage get_teammates.py <player>')
  exit(1)

player = sys.argv[1]

try:
  result = get_teammates(player)

  if len(result) == 0:
    print(f'There are no teammates of {player}.')
    exit(0)
  print(f"Getting list of teammtes of {player}")
  for teammate in result:
    print(f"{teammate.get('name')}, {teammate.get('team')}")
except ValueError:
  print(f'Sorry, something went wrong. Please ensure that the information is correct')