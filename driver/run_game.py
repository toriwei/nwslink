import time
import game_utils
from setup_game import Game
from handle_guess import Guess
from driver import is_valid_player

IS_RANDOM_GAME = True
REVEAL_ANSWER = False
REQUIRE_VALID_PLAYER = True

class GameRunner:
  def __init__(self, IS_RANDOM_GAME):
    self.IS_RANDOM_GAME = IS_RANDOM_GAME

    self.game = Game(IS_RANDOM_GAME= self.IS_RANDOM_GAME)
    self.game.setup_game(IS_RANDOM_GAME)
    self.guess_handler = None
    self.players_progress = self.game.set_players_progress(self.game.players.copy())
    self.mystery_players_progress = [row[3] for row in self.players_progress]
    target_connection = {'team': self.game.mystery_team[0], 'season': self.game.mystery_team[1]}
    self.mystery_connections_progress = self.game.set_connections_progress(self.game.connections, target_connection)
    self.player_guessed_list = [False] * 4

  def run_game(self):
    if not IS_RANDOM_GAME:
      game_utils.print_setup(
        players=self.game.players, 
        connections=self.game.connections, 
        mystery_team=self.game.mystery_team, 
        connections_set=self.game.connections_set,
        mystery_players=self.game.mystery_players
      )

    print("\nWELCOME TO THE GAME")
    
    while True:
      print(self.game.get_grid(self.players_progress, self.mystery_connections_progress))

      row = self.get_row()

      if row == "":
          print("Ending game.")
          break
    
      if REVEAL_ANSWER == True:
        print(f"correct name: {self.game.mystery_players[row]}")
        print(f"row: {row + 1}")

      if self.player_guessed_list[row] == True:
        print("You have already guessed this player!")
        time.sleep(1)
      else:
        self.run_guess_loop(row)         
        if all(self.player_guessed_list):
          print("Completed Game!")
          return

  def run_guess_loop(self, row):
    print("Enter your guess or press enter to return to row selection.")
    while True:
      guess = input().upper()

      if guess == "":
        break

      print("")

      if REQUIRE_VALID_PLAYER == False or is_valid_player(guess):
        self.process_guess(guess, row)        

        if self.is_correct_guess(row):
          break
      else:
        print("Not a valid NWSL player. Guess again.")

  def is_correct_guess(self, row):
    if "_" not in self.mystery_players_progress[row]:
      self.player_guessed_list[row] = True
      print("Correctly gussed mystery player!")
      time.sleep(1)
      return True
     
  def process_guess(self, guess, row):
    self.guess_handler = Guess(
      self.game,
      self.game.mystery_players[row],
      self.mystery_players_progress[row],
      guess
    )

    guess_result = self.guess_handler.handle_guess()

    self.mystery_players_progress[row] = guess_result['mystery_players_progress']
    self.players_progress[row][3] = self.mystery_players_progress[row]

    self.display_guess_result(guess_result)

    print(guess_result["mystery_players_progress"])
    print("")
    return self.mystery_players_progress

  def get_row(self):  
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

  # def set_players_progress(self, players):
  #   for i in range(0, 4):
  #     players[i][3] = self.game.get_underscored_name(self.game.mystery_players[i])
  #   return players
  
  def display_guess_result(self, guess_result):
    print(guess_result["shared_letters"])

    aligned_guess = ' '.join(guess_result["aligned_guess"].replace("!", ' '))
    if guess_result["leftovers"]:
      aligned_guess += '   ' + ' '.join(guess_result["leftovers"])
    print(aligned_guess)
    return


if __name__ == "__main__":
  game_runner = GameRunner(IS_RANDOM_GAME)
  game_runner.run_game()