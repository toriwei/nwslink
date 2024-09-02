class Guess:
  def __init__(self, game, row, guess, mystery_players_progress):
    self.game = game
    self.row = row
    self.guess = guess
    self.mystery_players_progress = mystery_players_progress
    self.correct_name = self.game.mystery_players[row]
    self.underscore_name = self.game.get_underscored_name(self.correct_name)

  def handle_guess(self):
    aligned_guess_dict = self.align_guess(self.guess, self.correct_name)
    aligned_guess = aligned_guess_dict["aligned_guess"]
    leftovers = aligned_guess_dict["leftover_letters"]

    shared_letters, underscore_build = self.compare_guess(aligned_guess, leftovers)

    self.mystery_players_progress[self.row] = self.update_underscore_progress(underscore_build)
    return {"shared_letters": shared_letters, "mystery_players_progress": self.mystery_players_progress}

  def compare_guess(self, aligned_guess, leftovers):
    shared_letters = []
    underscore_build = []
    for i, char in enumerate(self.correct_name):
      if aligned_guess[i] == char:
        underscore_build.append(char)
      else:
          underscore_build.append("_")
          if char in aligned_guess and char not in shared_letters:
              shared_letters.append(char)
      
      if len(leftovers) > 0:
        for char in leftovers:
          if char in self.correct_name and char not in shared_letters:
            shared_letters.append(char)

    return sorted(shared_letters), underscore_build

  
  def align_guess(self, guess, correct_name):
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

  def update_underscore_progress(self, new_underscore):
    existing_underscore = self.mystery_players_progress[self.row]
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