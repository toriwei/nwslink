from setup_game import Game
from handle_guess import Guess
PROD = False

class GameRunner:
  def __init__(self, PROD):
    self.PROD = PROD

    self.game = Game(PROD= self.PROD)
    self.game.setup_game(PROD)
    self.guess_handler = None
    self.players_progress = self.set_players_progress()
    self.mystery_players_progress = self.set_mystery_players_progress()


  def run_game(self):
    self.print_setup()

    
    grid = self.game.get_grid(self.players_progress)

    print("\nWELCOME TO THE GAME")
    print(grid)
    
    while True:
      row_selection = self.get_row_selection()

      if row_selection is None:
          print("Ending game.")
          break
    
      correct_name = self.game.mystery_players[row_selection]

      print(f"correct name: {correct_name}")
      print(f"row: {row_selection + 1}")

      while True:
        guess = input("Enter your guess or press enter to return to row selection.\n")
        guess = guess.upper()
        print("")

        if guess == "":
           print("back")
           break

        if guess is None:
          print("Ending game.")
          break

        self.process_guess(guess, row_selection)


  def process_guess(self, guess, row):
    # TO DO: test if valid guess
    self.guess_handler = Guess(
      self.game,
      row,
      guess,
      self.mystery_players_progress
    )

    self.mystery_players_progress = self.guess_handler.handle_guess()

  def get_row_selection(self):  
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
      return
  
  def set_players_progress(self):
    players = self.game.players.copy()
    for i in range(0, 4):
      players[i][3] = self.game.get_underscored_name(self.game.mystery_players[i])
    return players
  
  def set_mystery_players_progress(self):
    underscore_names = []
    for i in range(0, 4):
      underscore_names.append(self.game.get_underscored_name(self.game.mystery_players[i]))
    return underscore_names

  def print_setup(self):
    print("Players Grid:")
    for row in self.game.players:
        print(row)

    print("\nConnections:")
    for connection in self.game.connections:
        print(connection)

    print("\nMystery Team:")
    print(self.game.mystery_team)

    print("\nConnections Set:")
    for connection_set in self.game.connections_set:
        print(connection_set)


if __name__ == "__main__":
  game_runner = GameRunner(PROD)
  game_runner.run_game()