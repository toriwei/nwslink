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
    guess_handler = Guess(self.game, correct_name, progress, guess)
    result = guess_handler.handle_guess()

    self.assertEqual([['A', 'L'], ['E', 'I', 'N']], result["shared_letters"])
    self.assertEqual("M _ _ _ _ _   _ _ _ _ _ _ _", result["mystery_players_progress"])

    guess = "SARAH GORDEN"
    progress = result["mystery_players_progress"]
    guess_handler = Guess(self.game, correct_name, progress, guess)
    result = guess_handler.handle_guess()

    self.assertEqual([[], ['E', 'N', 'O', 'R']], result["shared_letters"])
    self.assertEqual("M _ _ A _ _   _ _ _ _ _ _ _", result["mystery_players_progress"])

    guess = "NADIA NADIM"
    progress = result["mystery_players_progress"]
    guess_handler = Guess(self.game, correct_name, progress, guess)
    result = guess_handler.handle_guess()

    self.assertEqual([[], ['I', 'N']], result["shared_letters"])
    self.assertEqual("M _ _ A _ _   _ _ _ _ _ _ _", result["mystery_players_progress"])

  def test_remove_duplicate_shared_letters_2(self):
    self.game = create_test_game()
    self.game_runner = GameRunner(False)

    correct_name = "HALEY KOPMEYER"
    guess = "JANINE BECKIE"
    progress = "H A L _ Y   _ O P _ E _ _ _"
    guess_handler = Guess(self.game, correct_name, progress, guess)
    result = guess_handler.handle_guess()

    self.assertEqual([['E'], ['K']], result["shared_letters"])
    self.assertEqual("H A L _ Y   _ O P _ E _ E _", result["mystery_players_progress"])

  def test_grid_string(self):
    self.game = create_test_game(True)
    self.game_runner = GameRunner(True)

    try:
        self.game.get_grid(self.game_runner.players_progress, self.game_runner.mystery_connections_progress)
    except Exception as e:
        self.fail(f"get_grid raised an exception: {e}")


if __name__ == "__main__":
    unittest.main()