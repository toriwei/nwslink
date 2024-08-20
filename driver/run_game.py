from setup_game import Game
from handle_guess import Guess
testing = True

def main():
    game = Game()
    game.setup_game()

    players = game.players
    connections = game.connections
    mystery_team = game.mystery_team
    mystery_players = game.mystery_players
    connections_set = game.connections_set

    updated_guesses = get_mystery_players_progress(game, mystery_players)
    players_dynamic = get_dynamic_players_array(players, updated_guesses)
    initial_grid = game.get_grid(players_dynamic)

    if testing:
       print_setup(players, connections, mystery_team, connections_set, players_dynamic)

    print("\nWELCOME TO THE GAME")
    print(initial_grid)
    
    while True:
      row_selection = get_row_selection()

      if row_selection is None:
          print("Ending game.")
          break
    
      correct_name = mystery_players[row_selection]
      current_progress = updated_guesses[row_selection]
      print(f"correct name: {correct_name}")
      print(f"underscore name: {current_progress}")

      print(f"row: {row_selection + 1}")
      print(current_progress)

      while True:
        guess = input("Enter your guess or press enter to return to row selection.\n")
        print(current_progress)
        print("")
        # guess = get_guess()

        if guess == "":
           print("back")
           break

        if guess is None:
          print("Ending game.")
          break

        guess_result = handle_guess(guess, correct_name, current_progress, updated_guesses, row_selection)
        # TO DO: handle correct guess
        # underscore_name = guess_result.updated_underscore
        # do string formatting/printing results here

def get_row_selection():  
  while True:
    row = input("Enter a row number (1 to 4) to guess a player.\n")
    if row == "end":
        return None
    try:
      if int(row) in range(1, 5):
          return int(row) - 1
      else:
          print("Invalid input. Please enter a number from 1 to 4.\n")
    except ValueError:
        print("Invalid input. Please enter a valid number.\n")
          
def get_guess():
    # TO DO query database to make user guess an actual player
    # make queries and guesses non-sensitive to special characters
    # if guess == "end":
    #     return None
    # return guess
    return
         
def handle_guess(guess, correct_name, underscore_name, updated_guesses, row):
  # guess, correct_name, current_progress, updated_guesses, row_selection
  print("\nHANDLE GUESS")
  print(f"guess: {guess}")
  print(f"correct_name: {correct_name}")
  print(f"underscore_name: {underscore_name}")
  print(f"updated_guesses: {updated_guesses}")
  print(f"row: {row}")
  print("==================\n")

  if guess == correct_name:
     # TO DO: handle_correct_guess
     return True
  
  else:
    aligned_guess_dict = align_guess(guess, correct_name)
    aligned_guess = aligned_guess_dict["aligned_guess"]
    leftovers = aligned_guess_dict["leftover_letters"]
    print(aligned_guess_dict)

    return handle_incorrect_guess(correct_name, aligned_guess, leftovers, underscore_name, updated_guesses, row)
  
# guess, correct_name, current_progress, updated_guesses, row_selection
def handle_incorrect_guess(correct_name, aligned_guess, leftovers, underscore_name, updated_guesses, row):
  print("\nBEFORE HANDLE INCORRECT GUESS")
  print(f"correct_name: {correct_name}")
  print(f"aligned_guess: {aligned_guess}")
  print(f"leftovers: {leftovers}")
  print(f"underscore_name: {underscore_name}")
  print(f"updated_guesses: {updated_guesses}")
  print(f"row: {row}")
  print("==================\n")
  correct_letters = []
  underscore_build = []
  for i, char in enumerate(correct_name):
    # if aligned_guess[i] == "!":
    #   break
    if aligned_guess[i] == char:
      underscore_build.append(char)
    else:
        underscore_build.append("_")
        if char in aligned_guess and char not in correct_letters:
            correct_letters.append(char)
  
  if len(leftovers) > 0:
    for char in leftovers:
      if char in correct_name and char not in correct_letters:
        correct_letters.append(char)
  print(f"underscore_build: {underscore_build}")

  # updated_underscore = updated_guesses[row]
  print(f"Correct Letters: {correct_letters}")
  print(f"Updated Underscore: {underscore_build}")
  underscore_progress = update_underscore_progress(updated_guesses[row], underscore_build, updated_guesses, row)
  print("\nAFTER HANDLE INCORRECT GUESS")
  print(f"correct_name: {correct_name}")
  print(f"aligned_guess: {aligned_guess}")
  print(f"leftovers: {leftovers}")
  print(f"underscore_name: {underscore_name}")
  print(f"updated_guesses: {updated_guesses}")
  print(f"row: {row}")
  print("==================\n")
  return {"shared_letters": correct_letters, "updated_underscore": underscore_progress}

def align_guess(guess, correct_name):
  leftover = ""
  if len(guess) > len(correct_name):
    difference = len(guess) - len(correct_name)
    leftover = str(guess[len(guess) - difference:])

  guess_no_spaces = guess.replace(" ", "")
  aligned_guess = ""
  guess_index = 0

  for char in correct_name:
    if char == " ":
      aligned_guess += " "
    else:
      if guess_index < len(guess_no_spaces):
        aligned_guess += guess_no_spaces[guess_index]
        guess_index += 1
      else:
        aligned_guess += "!"
  return {"aligned_guess": aligned_guess, "leftover_letters": leftover}

# TO DO: check 
def update_underscore_progress(existing_underscore, new_underscore, updated_guesses, row):
  result = []

  i = 0
  while i < len(existing_underscore):
      print(existing_underscore[i])
      if existing_underscore[i] != " ":
          result.append(existing_underscore[i])
      elif existing_underscore[i] == " " and i < len(existing_underscore) - 1 and existing_underscore[i + 1] == " ":
          result.append(" ")
          i += 2  # each space is made of 3 spaces, need to skip
      i += 1
  existing_underscore = result
  print('BEFORE UPDATING UNDERSCORE PROGRESS')
  print(f"existing_underscore: {existing_underscore}")
  print(f"new_underscore: {new_underscore}")
  print(f"updated_guesses: {updated_guesses}")
  build =  ""
  for char1, char2 in zip(existing_underscore, new_underscore):
    if char1 == " ":
       build+= "  "
    elif char1 != " " and char1 != "_":
      build += char1
    elif char2 != " " and char2 != "_":
      build += char2
    else:
      build += "_"
  build = ''.join([char + ' ' if char.isalnum() or char == '_' else char for char in build])
  print(f"build: {build}")

  existing_underscore = ''.join(build)
  updated_guesses[row] = build
  print('AFTER UPDATING UNDERSCORE PROGRESS')
  print(f"existing_underscore: {existing_underscore}")
  print(f"new_underscore: {new_underscore}")
  print(f"updated_guesses: {updated_guesses}")
  return build

# Return array of underscore representation of mystery players
def get_mystery_players_progress(game, mystery_players):
  underscore_mystery_players = []
  for player in mystery_players:
    print(player)
    print(game.get_underscored_name(player))
    underscore_mystery_players.append(game.get_underscored_name(player))
  print("result")
  print(underscore_mystery_players)
  return underscore_mystery_players

def get_dynamic_players_array(players, updated_guesses):
  dynamic_grid = []
  for i, row in enumerate(players):
    row_arr = []
    for j, player in enumerate(row):
      if j != 3:
        row_arr.append(player)
      else:
        row_arr.append(updated_guesses[i])
    dynamic_grid.append(row_arr)
  return dynamic_grid

def print_setup(players, connections, mystery_team, connections_set, players_dynamic):
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

  print("\nDynamic Players Grid")
  for row in players_dynamic:
      print(row)

if __name__ == "__main__":
    main()
