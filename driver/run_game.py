from setup_game import Game

def main():
    game = Game()
    game.setup_game()

    TESTING = True

    if not TESTING:
      players = game.players
      connections = game.connections
      mystery_team = game.mystery_team
      connections_set = game.connections_set
      initial_grid = game.get_grid(players)
    else:
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
      mystery_team = game.Connection(team='Louisville', season='2024')

      connections_set = {
        game.Connection(team='Red Stars', season='2022'),
        game.Connection(team='Pride', season='2018'),
        game.Connection(team='Louisville', season='2024'),
        game.Connection(team='Courage', season='2018'),
        game.Connection(team='Spirit', season='2023')
      }
      initial_grid = game.get_grid(players)

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

    print("\nWELCOME TO THE GAME")
    print(initial_grid)
    
    while True:
      row_selection = get_row_selection()

      if row_selection is None:
          print("Ending game.")
          break
    
      correct_name = players[row_selection][3]
      # instead of going to game, create a new grid that updates.
      underscore_name = game.get_underscored_name(correct_name)
      print(f"answer: {correct_name}")
      print(f"row: {row_selection + 1}")
      print(underscore_name)

      while True:
        guess = input("Enter your guess or press enter to return to row selection.\n")
        print(underscore_name)
        print("")
        guess = get_guess()

        if guess == "":
           print("back")
           break

        if guess is None:
          print("Ending game.")
          break

        guess_result = handle_guess(guess, correct_name, underscore_name)
        # TO DO: handle correct guess
        underscore_name = guess_result.updated_underscore
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
    if guess == "end":
        return None
    return guess
         
def handle_guess(guess, correct_name, underscore_name):
  if guess == correct_name:
     # TO DO: handle_correct_guess
     return True
  
  else:
     aligned_guess_dict = align_guess(guess, correct_name)
     aligned_guess = aligned_guess_dict["aligned_guess"]
     leftovers = aligned_guess_dict["leftover_letters"]
     return handle_incorrect_guess(correct_name, aligned_guess, leftovers, underscore_name)
  

def handle_incorrect_guess(correct_name, aligned_guess, leftovers, underscore_name):
  correct_letters = []
  underscore_build = []
  for i, char in enumerate(correct_name):
    if aligned_guess[i] == "!":
      break
    elif aligned_guess[i] == char:
      underscore_build.append(char)
    else:
        underscore_build.append("_")
        if char in aligned_guess and char not in correct_letters:
            correct_letters.append(char)
  
  if len(leftovers) > 0:
    for char in leftovers:
      if char in correct_name and char not in correct_letters:
        correct_letters.append(char)
  updated_underscore = " ".join(underscore_build)
  print(f"Correct Letters: {correct_letters}")
  print(f"Updated Underscore: {updated_underscore}")
  underscore_progress = update_underscore_progress(underscore_name, updated_underscore)
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
def update_underscore_progress(existing_underscore, new_underscore):
  build = ""
  for char1, char2 in zip(existing_underscore, new_underscore):
    if char1 != " ":
      build += char1
    elif char2 != " ":
      build += char2
    elif char1 == " ":
      build += " "
    else:
      build += "_"
  return build

if __name__ == "__main__":
    main()
