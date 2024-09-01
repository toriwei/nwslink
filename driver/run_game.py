import time
import game_utils
from setup_game import Game
from handle_guess import Guess
PROD = False

class GameRunner:
  def __init__(self, PROD):
    self.PROD = PROD

    self.game = Game(PROD= self.PROD)
    self.game.setup_game(PROD)
    self.guess_handler = None
    self.players_progress = self.set_players_progress(self.game.players.copy())
    self.mystery_players_progress = [row[3] for row in self.players_progress]
    self.player_guessed_list = [False] * 4

  def run_game(self):
    if not PROD:
      game_utils.print_setup(
        players=self.game.players, 
        connections=self.game.connections, 
        mystery_team=self.game.mystery_team, 
        connections_set=self.game.connections_set
      )

    print("\nWELCOME TO THE GAME")
    
    while True:
      print(self.game.get_grid(self.players_progress))

      row_selection = self.get_row_selection()

      if row_selection == "":
          print("Ending game.")
          break
    
      if PROD == False:
        print(f"correct name: {self.game.mystery_players[row_selection]}")
        print(f"row: {row_selection + 1}")

      if self.player_guessed_list[row_selection] == True:
        print("You have already guessed this player!")
        time.sleep(1)
      else:
        self.run_guess_loop(row_selection)         
        if all(self.player_guessed_list):
          print("Completed Game!")
          return

  def run_guess_loop(self, row_selection):
    print("Enter your guess or press enter to return to row selection.")
    while True:
      guess = input().upper()
      
      if guess == "":
        break

      print("")
      self.process_guess(guess, row_selection)

      if self.is_correct_guess(row_selection):
        break

  def is_correct_guess(self, row_selection):
    if "_" not in self.mystery_players_progress[row_selection]:
      self.player_guessed_list[row_selection] = True
      print("Correctly gussed mystery player!")
      time.sleep(1)
      return True
     
  def process_guess(self, guess, row):
    # TO DO: test if valid guess
    self.guess_handler = Guess(
      self.game,
      row,
      guess,
      self.mystery_players_progress,
      self.players_progress
    )

    guess_result = self.guess_handler.handle_guess()

    self.mystery_players_progress = guess_result['updated_guesses']
    self.players_progress = guess_result['updated_players']
    print(guess_result["shared_letters"])
    print(guess_result["updated_guesses"][row])
    print("")
    return self.mystery_players_progress

  def get_row_selection(self):  
    while True:
      row = input("Enter a row number (1 to 4) to guess a player.\n")
      if row == "end":
          return ""
      try:
        row = int(row)
        if 1 <= row <= 4:
            return row - 1
        else:
            print("Invalid input. Please enter a number from 1 to 4.\n")
      except ValueError:
          print("Invalid input. Please enter a valid number.\n")
            
  def get_guess():
      # TO DO query database to make user guess an actual player
      # make queries and guesses non-sensitive to special characters
      return
  
  def set_players_progress(self, players):
    for i in range(0, 4):
      players[i][3] = self.game.get_underscored_name(self.game.mystery_players[i])
    return players     


if __name__ == "__main__":
  game_runner = GameRunner(PROD)
  game_runner.run_game()