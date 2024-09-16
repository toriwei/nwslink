import time
import game_utils
from setup_game import Game
from handle_guess import Guess
from driver import is_valid_player

IS_RANDOM_GAME = False
REVEAL_ANSWER = True
REQUIRE_VALID_PLAYER = True
PRINT_SETUP = True

class GameRunner:
  def __init__(self, IS_RANDOM_GAME):
    self.IS_RANDOM_GAME = IS_RANDOM_GAME

    self.game = Game(IS_RANDOM_GAME= self.IS_RANDOM_GAME)
    self.game.setup_game(IS_RANDOM_GAME)
    self.guess_handler = None
    self.players_progress = self.game.set_players_progress(self.game.players.copy())
    self.mystery_players_progress = [row[3] for row in self.players_progress]
    self.connections_str = [f"{connection['team'].upper()} {connection['season']}" for connection in self.game.connections]
    self.mystery_connections_progress = self.game.set_connections_progress(self.connections_str)
    self.player_guessed_list = [False] * 4
    self.connections_guessed_list = [False] * 5

  def run_game(self):
    if PRINT_SETUP:
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

      row, is_player_guess = self.get_row()

      if row == "":
          print("Ending game.")
          break
    
      if REVEAL_ANSWER == True:
        print(f"correct: {self.game.mystery_players[row] if is_player_guess else self.connections_str[row]}")

      already_answered = self.player_guessed_list[row] if is_player_guess else self.connections_guessed_list[row]
      if already_answered:
        print("This guess is already complete!")
        time.sleep(1)
      else:
        self.run_guess_loop(row, is_player_guess)
        if all(self.player_guessed_list) and all(self.connections_guessed_list):
          print("Completed Game!")
          return
  
  def run_guess_loop(self, row, is_player_guess):
    print("\nEnter your guess or press enter to return to row selection.")
    if is_player_guess:
      print(f"{self.mystery_players_progress[row]}\n")
    else:
      print(f"{self.mystery_connections_progress[row]}\n")
    while True:
      guess = input().upper()

      if guess == "":
        break

      print("")

      if is_player_guess and (REQUIRE_VALID_PLAYER and not is_valid_player(guess)):
        print("Not a valid NWSL player. Guess again.")
      else:
        self.process_guess(guess, row, is_player_guess)
        if self.is_correct_guess(row, is_player_guess):
          break

  def is_correct_guess(self, row, is_player_guess):
    answer = self.mystery_players_progress[row] if is_player_guess else self.mystery_connections_progress[row]
    is_correct = "_" not in answer
    if is_correct:
      self.player_guessed_list[row] = True
      print("Correctly gussed mystery player!")
      time.sleep(1)
      return True
     
  def process_guess(self, guess, row, is_player_guess):
    answer = self.game.mystery_players[row] if is_player_guess else self.connections_str[row]
    progress = self.mystery_players_progress[row] if is_player_guess else self.mystery_connections_progress[row]
    self.guess_handler = Guess(
      self.game,
      answer,
      progress,
      guess,
      is_player_guess
    )

    guess_result = self.guess_handler.handle_guess()

    if is_player_guess:
      self.mystery_players_progress[row] = guess_result['progress']
      self.players_progress[row][3] = self.mystery_players_progress[row]

      self.display_guess_result(guess_result)

      print(guess_result["progress"])
      print("")
    else:
      self.mystery_connections_progress[row] = guess_result['progress']
      self.display_connection_guess_result(guess_result)

      print(guess_result["progress"])
      print("")
      return

  def get_row(self):
    while True:
      row = input("Enter a number to make a guess.\nPLAYER:   1-4\nROW LINK: 5-8\nCOL LINK: 9\n\n")
      if row == "end":
          return ""
      try:
        row = int(row)
        if 1 <= row <= 4:
          return row - 1, True
        elif 5 <= row <= 9:
          return row - 5, False
        else:
            print("Invalid input. Please enter a number from 1 to 9.\n")
      except ValueError:
          print("Invalid input. Please enter a valid number.\n")
  
  def display_guess_result(self, guess_result):
    print(guess_result["shared_letters"])

    aligned_guess = ' '.join(guess_result["aligned_guess"].replace("!", ' '))
    if guess_result["leftovers"]:
      aligned_guess += '   ' + ' '.join(guess_result["leftovers"])
    print(aligned_guess)
    return
  
  def display_connection_guess_result(self, guess_result):
    print(guess_result["shared_letters"])

    aligned_guess = ' '.join(guess_result["aligned_guess"].replace("!", ' '))

    guess_parts = aligned_guess.split('   ')
    team = guess_parts[:-1][-1]
    season = guess_parts[-1]

    if guess_result["leftovers"]["team"]:
      team += '   ' + ' '.join(guess_result["leftovers"]["team"])
    aligned_guess = team + '   ' + season
    print(aligned_guess)
    return
  

if __name__ == "__main__":
  game_runner = GameRunner(IS_RANDOM_GAME)
  game_runner.run_game()