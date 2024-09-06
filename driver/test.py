import unittest
from setup_game import Game
from handle_guess import Guess
from game_utils import *

def create_test_game():
  game = Game(IS_RANDOM_GAME=False)
  game.setup_game(IS_RANDOM_GAME=False)
  return game

class TestCompareGuess(unittest.TestCase):
  def setUp(self):
     self.game = create_test_game()

  def print_result(self, correct_name, guess, progress, result):
     print(f"Correct: {correct_name}\nGuess: {guess}\nProgress: {progress}\nResult after guess:")
     for k, v in result.items():
        print(f" {k}, {v}")
     

  def test_remove_duplicate_shared_letters_1(self):
    """Check compare_guess removes previously correct letter when previous guess did not contain that letter"""
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
    """Check compare_guess removes letter upon correctly guessing the last instance of that letter"""
    correct_name = "HALEY KOPMEYER"
    guess = "JANINE BECKIE"
    progress = "H A L _ Y   _ O P _ E _ _ _"
    guess_handler = Guess(self.game, correct_name, progress, guess)
    result = guess_handler.handle_guess()

    self.assertEqual([['E'], ['K']], result["shared_letters"])
    self.assertEqual("H A L _ Y   _ O P _ E _ E _", result["mystery_players_progress"])

if __name__ == "__main__":
    unittest.main()