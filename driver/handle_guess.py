from itertools import chain

class Guess:
  def __init__(self, game, correct_name, mystery_players_progress, guess):
    self.game = game
    self.correct_name = correct_name
    self.mystery_players_progress = mystery_players_progress
    self.guess = guess

  def handle_guess(self):
    aligned_guess_dict = self.align_guess(self.guess, self.correct_name)
    aligned_guess = aligned_guess_dict["aligned_guess"]
    leftovers = aligned_guess_dict["leftover_letters"]

    shared_letters = self.compare_guess(aligned_guess, leftovers)

    return {"shared_letters": shared_letters, "mystery_players_progress": self.mystery_players_progress, "aligned_guess": aligned_guess, "leftovers": leftovers}

  def compare_guess(self, aligned_guess, leftovers):
    correct_name_parts = self.correct_name.split()
    aligned_guess_parts = aligned_guess.split()
    shared_letters = [[] for _ in self.correct_name.split()]
    underscore_build = [[] for _ in self.correct_name.split()]
    for i, correct_name_part in enumerate(correct_name_parts):
      for j, char in enumerate(correct_name_part):
        if aligned_guess_parts[i][j] == char:
          underscore_build[i].append(char)
        else:
            underscore_build[i].append("_")
            if (char in aligned_guess or char in leftovers) and char not in shared_letters[i]:
                shared_letters[i].append(char)
      underscore_build[i].append(' ')  
      shared_letters[i] = sorted(shared_letters[i])

    underscore_build = list(chain.from_iterable(underscore_build))[:-1]
    self.mystery_players_progress = self.update_underscore_progress(underscore_build)

    progress_parts = self.mystery_players_progress.split("   ")

    for i, shared_letter_part in enumerate(shared_letters):
      for j, char in enumerate(shared_letter_part[:]):
        count_from_underscore = progress_parts[i].count(char)
        count_from_correct_name = correct_name_parts[i].count(char)
        if count_from_underscore >= count_from_correct_name:
          shared_letter_part.remove(char)

    shared_letters = [sorted(letters) for letters in shared_letters]
    return shared_letters
  
  def align_guess(self, guess, correct_name):
    leftover = ""
    guess_no_spaces = guess.replace(" ", "")
    correct_name_no_spaces = correct_name.replace(" ", "")

    if len(guess_no_spaces) > len(correct_name_no_spaces):
      leftover = guess_no_spaces[len(correct_name_no_spaces):]  

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
    return {"aligned_guess": aligned_guess, "leftover_letters": leftover.replace(" ", "")}

  def update_underscore_progress(self, new_underscore):
    existing_underscore = self.mystery_players_progress
    result = []

    i = 0
    while i < len(existing_underscore):
        if existing_underscore[i] != " ":
            result.append(existing_underscore[i])
        elif existing_underscore[i] == " " and i < len(existing_underscore) - 1 and existing_underscore[i + 1] == " ":
            result.append(" ")
            i += 2  # each space is made of 3 spaces, need to skip
        i += 1
    existing_underscore = result

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

    valid_chars = {'_', "'", '-'}
    build = ''.join([char + ' ' if char.isalpha() or char in valid_chars else char for char in build])[:-1]

    return build