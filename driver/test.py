import unittest
from setup_game import Game
from handle_guess import Guess
from run_game import GameRunner
from game_utils import PLAYERS

def create_test_game(IS_RANDOM_GAME=False):
  game = Game(IS_RANDOM_GAME)
  game.setup_game(IS_RANDOM_GAME)
  return game

class TestCompareGuess(unittest.TestCase):
  def setUp(self):
    self.players = PLAYERS

  def test_remove_duplicate_shared_letters_1(self):
    self.game = create_test_game()
    self.game_runner = GameRunner(False)

    correct_name = "MCCALL ZERBONI"
    guess = "MELEANA SHIM"
    progress = self.game.get_underscored_name(correct_name)
    guess_handler = Guess(self.game, correct_name, progress, guess, is_player_guess=True)
    result = guess_handler.handle_guess()

    self.assertEqual([['A', 'L'], ['E', 'I', 'N']], result["shared_letters"])
    self.assertEqual("M _ _ _ _ _   _ _ _ _ _ _ _", result["progress"])

    guess = "SARAH GORDEN"
    progress = result["progress"]
    guess_handler = Guess(self.game, correct_name, progress, guess, is_player_guess=True)
    result = guess_handler.handle_guess()

    self.assertEqual([[], ['E', 'N', 'O', 'R']], result["shared_letters"])
    self.assertEqual("M _ _ A _ _   _ _ _ _ _ _ _", result["progress"])

    guess = "NADIA NADIM"
    progress = result["progress"]
    guess_handler = Guess(self.game, correct_name, progress, guess, is_player_guess=True)
    result = guess_handler.handle_guess()

    self.assertEqual([[], ['I', 'N']], result["shared_letters"])
    self.assertEqual("M _ _ A _ _   _ _ _ _ _ _ _", result["progress"])

  def test_remove_duplicate_shared_letters_2(self):
    self.game = create_test_game()
    self.game_runner = GameRunner(False)

    correct_name = "HALEY KOPMEYER"
    guess = "JANINE BECKIE"
    progress = "H A L _ Y   _ O P _ E _ _ _"
    guess_handler = Guess(self.game, correct_name, progress, guess, is_player_guess=True)
    result = guess_handler.handle_guess()

    self.assertEqual([['E'], ['K']], result["shared_letters"])
    self.assertEqual("H A L _ Y   _ O P _ E _ E _", result["progress"])

  def test_grid_string_1(self):
    self.game = create_test_game(True)
    self.game_runner = GameRunner(True)

    try:
        self.game.get_grid(self.game_runner.players_progress, self.game_runner.mystery_connections_progress)
    except Exception as e:
        self.fail(f"get_grid raised an exception: {e}")

  def test_grid_string_2(self):
    self.game = create_test_game(IS_RANDOM_GAME=False)
    self.game_runner = GameRunner(IS_RANDOM_GAME=False)

    try:
        self.game.get_grid(self.game_runner.players_progress, self.game_runner.mystery_connections_progress)
    except Exception as e:
        self.fail(f"get_grid raised an exception: {e}")
        
  def test_connection_check_1(self):
     self.game = create_test_game(False)
     self.game_runner = GameRunner(False)

     answer = "SKY BLUE 2015"
     guess = "COURAGE 2021"
     progress = "_ _ _   _ _ _ _   _ _ _ _"

     guess_handler = Guess(self.game, answer, progress, guess, is_player_guess=False)

     result = guess_handler.handle_guess()
     self.assertEqual({'team': [[], ['U']], 'season': [['1']]}, result["shared_letters"])
     self.assertEqual("_ _ _   _ _ _ E   2 0 _ _", result["progress"])

  def test_connection_check_2(self):
    self.game = create_test_game(False)
    self.game_runner = GameRunner(False)

    answer = "THORNS 2021"
    guess = "COURAGE 2021"
    progress = "_ _ _ _ _ _   _ _ _ _"

    guess_handler = Guess(self.game, answer, progress, guess, is_player_guess=False)

    result = guess_handler.handle_guess()
    self.assertEqual({'team': [['O']], 'season': [[]]}, result["shared_letters"])
    self.assertEqual("_ _ _ R _ _   2 0 2 1", result["progress"])

  def test_setup_1(self):
    self.game = create_test_game(IS_RANDOM_GAME=True)
    self.game_runner = GameRunner(IS_RANDOM_GAME=True)

if __name__ == "__main__":
    unittest.main()