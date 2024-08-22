class Guess:
  def __init__(self, game, row, guess, mystery_players_progress):
    self.game = game
    self.row = row
    self.guess = guess
    self.correct_name = self.game.mystery_players[row]
    self.underscore_name = self.game.get_underscored_name(self.correct_name)
    self.updated_guesses = mystery_players_progress

  def handle_guess(self):
    # print("\nHANDLE GUESS")
    # print(f"guess: {self.guess}")
    # print(f"correct_name: {self.correct_name}")
    # print("==================\n")

    if self.guess == self.correct_name:
      # TO DO: handle_correct_guess
      return True
    
    else:
      aligned_guess_dict = self.align_guess(self.guess, self.correct_name)
      aligned_guess = aligned_guess_dict["aligned_guess"]
      leftovers = aligned_guess_dict["leftover_letters"]

      return self.handle_incorrect_guess(aligned_guess, leftovers,)
    
  def handle_incorrect_guess(self, aligned_guess, leftovers):
    correct_letters = []
    underscore_build = []
    for i, char in enumerate(self.correct_name):
      if aligned_guess[i] == char:
        underscore_build.append(char)
      else:
          underscore_build.append("_")
          if char in aligned_guess and char not in correct_letters:
              correct_letters.append(char)
    
    if len(leftovers) > 0:
      for char in leftovers:
        if char in self.correct_name and char not in correct_letters:
          correct_letters.append(char)

    correct_letters = sorted(correct_letters)

    underscore_progress = self.update_underscore_progress(underscore_build)
    print(f"correct letters, wrong spot")
    print(correct_letters)
    print(self.updated_guesses)
    return {"shared_letters": correct_letters, "updated_guesses": self.updated_guesses}

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
    existing_underscore = self.updated_guesses[self.row]
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
    build = ''.join([char + ' ' if char.isalnum() or char == '_' else char for char in build])
    build = build[:-1]


    self.updated_guesses[self.row] = build

    print("Result:")
    print(f"{build}")
    print("")

    return build

  # return array of underscore representation of mystery players
  def get_mystery_players_progress(self, mystery_players):
    underscore_mystery_players = []
    for player in mystery_players:
      print(player)
      print(self.game.get_underscored_name(player))
      underscore_mystery_players.append(self.game.get_underscored_name(player))
    return underscore_mystery_players