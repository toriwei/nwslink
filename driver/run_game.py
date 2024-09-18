import time
import game_utils
from setup_game import Game
from handle_guess import Guess
from driver import is_valid_player, is_valid_team_name

IS_RANDOM_GAME = True
REVEAL_ANSWER = False
REQUIRE_VALID_GUESS = True
PRINT_SETUP = False

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
    """Runs the main game loop.
    
    Handles displaying game grid, prompting user for guesses, and displaying results.
    """

    if PRINT_SETUP:
      game_utils.print_setup(
        players=self.game.players, 
        connections=self.game.connections, 
        mystery_team=self.game.mystery_team, 
        connections_set=self.game.connections_set,
        mystery_players=self.game.mystery_players
      )

    print("\nWELCOME TO NWSLINK")
    
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
          print(self.game.get_grid(self.players_progress, self.mystery_connections_progress))
          return
  
  def run_guess_loop(self, row, is_player_guess):
    """
    Handles the loop for making guesses.

    If REQUIRED_VALID_GUESS is True, checks if guess is a valid player/team.

    Args:
      row (int): The number where the guess is being made (0-based index).
      is_player_guess (bool): Indicates if the guess is for a player (True) or a link (False).
    """
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

      if is_player_guess:
        if REQUIRE_VALID_GUESS and not is_valid_player(guess):
            print("Not a valid NWSL player. Guess again.")
            print(f"{self.mystery_players_progress[row]}\n")
        else:
            self.process_guess(guess, row, is_player_guess)
            if self.is_correct_guess(row, is_player_guess):
              break
      else:
          if ' ' not in guess:
            print("Not a valid link format. The format is [team_name] [year].")
            print(f"{self.mystery_connections_progress[row]}\n")
          elif REQUIRE_VALID_GUESS and not is_valid_team_name(' '.join(guess.split(' ')[:-1])):
              print("Not a valid NWSL team. Guess again.")
              print(f"{self.mystery_connections_progress[row]}\n")
          else:
              self.process_guess(guess, row, is_player_guess)
              if self.is_correct_guess(row, is_player_guess):
                break

  def is_correct_guess(self, row, is_player_guess):
    """Checks if the player's guess is correct."""
    answer = self.mystery_players_progress[row] if is_player_guess else self.mystery_connections_progress[row]
    guessed_list = self.player_guessed_list if is_player_guess else self.connections_guessed_list
    is_correct = "_" not in answer
    if is_correct:
      guessed_list[row] = True
      print("Correct!")
      time.sleep(1)
      return True
     
  def process_guess(self, guess, row, is_player_guess):
    """Processes the player's guess and updates game progress.

    Args:
      guess (str): The player's guess (either a player name or a team/season connection).
      row (int): The row number where the guess is being made.
      is_player_guess (bool): Indicatesif the guess is for a player (True) or a connection (False).
    """
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
    """
    Prompts the user to select a valid row to guess.

    Returns:
      tuple: ((int), (bool)): The selected row and flag indicating a player guess
    """
    while True:
      row = input("Enter a number to make a guess.\nPLAYERS:   1-4\nROW LINKS: 5-8\nCOL LINK:  9\n\n")
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
    """Prints the shared letters and aligned guess to show progress on a player guess.

    Args:
      guess_result (dict): Shared letters, aligned guess, and leftover letters
    """
    print(guess_result["shared_letters"])

    aligned_guess = ' '.join(guess_result["aligned_guess"].replace("!", ' '))
    if guess_result["leftovers"]:
      aligned_guess += '   ' + ' '.join(guess_result["leftovers"])
    print(aligned_guess)
    return
  
  def display_connection_guess_result(self, guess_result):
    """Prints the shared letters and aligned guess to show progress on a link guess.

    Args:
      guess_result (dict): Shared letters, aligned guess, and leftover letters
    """
    print(f'{guess_result["shared_letters"]["team"]} {guess_result["shared_letters"]["season"]}')

    aligned_guess = ' '.join(guess_result["aligned_guess"].replace("!", ' '))
    guess_parts = aligned_guess.split('   ')

    if guess_result["leftovers"]["team"]:
      leftovers =  ' '.join(guess_result["leftovers"]["team"]) + '   '
      guess_parts.insert(len(guess_parts) - 1, leftovers)
      aligned_guess = '   '.join(guess_parts)
    print(aligned_guess)
    return
  
if __name__ == "__main__":
  game_runner = GameRunner(IS_RANDOM_GAME)
  game_runner.run_game()