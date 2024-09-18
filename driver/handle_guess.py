from itertools import chain

class Guess:
  def __init__(self, game, answer, progress, guess, is_player_guess):
    self.game = game
    self.answer = answer
    self.progress = progress
    self.guess = guess
    self.is_player_guess = is_player_guess

  def handle_guess(self):
    """Processes the user's guess and updates progress.

    Returns:
        dict: Contains shared letters, updated progress, aligned guess, and leftover letters.
    """
    if self.is_player_guess:
      aligned_guess_dict = self.align_guess(self.guess, self.answer)
      aligned_guess = aligned_guess_dict["aligned_guess"]
      leftovers = aligned_guess_dict["leftover_letters"]

      shared_letters = self.compare_guess(aligned_guess, leftovers, self.answer)
    else:
      answer_team, answer_season = self.answer.rsplit(' ', 1)
      guess_team, guess_season = self.guess.rsplit(' ', 1)

      aligned_team_guess_dict = self.align_guess(guess_team, answer_team)
      aligned_team_guess = aligned_team_guess_dict["aligned_guess"]
      leftovers_team = aligned_team_guess_dict["leftover_letters"]
      shared_letters_team = self.compare_guess(aligned_team_guess, leftovers_team, answer_team, True)

      aligned_season_guess_dict = self.align_guess(guess_season, answer_season)
      aligned_season_guess = aligned_season_guess_dict["aligned_guess"]
      leftovers_season = aligned_season_guess_dict["leftover_letters"]
      shared_letters_season = self.compare_guess(aligned_season_guess, leftovers_season, answer_season, False)      

      aligned_guess = f"{aligned_team_guess} {aligned_season_guess}"
      shared_letters = {
        "team": shared_letters_team,
        "season": shared_letters_season
      }

      leftovers = {"team": leftovers_team, "season": leftovers_season} # might be easier as list?

    return {"shared_letters": shared_letters, "progress": self.progress, "aligned_guess": aligned_guess, "leftovers": leftovers}

  def compare_guess(self, aligned_guess, leftovers, answer, is_team=False):
    """Compares the aligned guess with the correct answer and updates the progress.

    Args:
        aligned_guess (str): The guess aligned to the spacing of the answer.
        leftovers (str): Extra letters if the guess is longer than the answer.
        answer (str): The correct answer.
        is_team (bool, optional): Whether the guess is for a team or not.

    Returns:
        shared_letters (list): A list of lists containing shared letters for
          each part of the player name or team and season of the link
    """
    answer_parts = answer.split()
    aligned_guess_parts = aligned_guess.split()
    shared_letters = [[] for _ in answer.split()]
    underscore_build = [[] for _ in answer.split()]
    for i, answer_part in enumerate(answer_parts):
      for j, char in enumerate(answer_part):
        if aligned_guess_parts[i][j] == char:
          underscore_build[i].append(char)
        else:
            underscore_build[i].append("_")
            if (char in aligned_guess or char in leftovers) and char not in shared_letters[i]:
                shared_letters[i].append(char)
      underscore_build[i].append(' ')  
      shared_letters[i] = sorted(shared_letters[i])

    underscore_build = list(chain.from_iterable(underscore_build))[:-1]

    if self.is_player_guess:
      self.progress = self.update_underscore_progress(underscore_build, is_team=is_team)
    else:
      split_progress = self.progress.split('   ')
      if is_team:
        team_progress = self.update_underscore_progress(underscore_build, is_team=True)
        split_progress[:-1] = team_progress.split('   ')
      else:
        split_progress[-1] = self.update_underscore_progress(underscore_build, is_team=False)
      self.progress = "   ".join(split_progress)

    progress_parts = self.progress.split("   ")

    for i, shared_letter_part in enumerate(shared_letters):
      for j, char in enumerate(shared_letter_part[:]):
        count_from_underscore = progress_parts[i].count(char)
        count_from_answer = answer_parts[i].count(char)
        if count_from_underscore >= count_from_answer:
          shared_letter_part.remove(char)

    shared_letters = [sorted(letters) for letters in shared_letters]
    return shared_letters
  
  def align_guess(self, guess, answer):
    """Aligns the user's guess with the correct answer's spacing.

    Args:
        guess (str): The user's guess.
        answer (str): The correct answer.

    Returns:
        dict: Contains the aligned guess and any leftover letters.
    """
    leftover = ""
    guess_no_spaces = guess.replace(" ", "")
    answer_no_spaces = answer.replace(" ", "")

    if len(guess_no_spaces) > len(answer_no_spaces):
      leftover = guess_no_spaces[len(answer_no_spaces):]  

    aligned_guess = ""
    guess_index = 0

    for char in answer:
      if char == " ":
        aligned_guess += " "
      else:
        if guess_index < len(guess_no_spaces):
          aligned_guess += guess_no_spaces[guess_index]
          guess_index += 1
        else:
          aligned_guess += "!"
    return {"aligned_guess": aligned_guess, "leftover_letters": leftover.replace(" ", "")}

  def update_underscore_progress(self, new_underscore, is_team=False):
    """Updates the progress string, replacing underscores with correctly guessed letters.

    Args:
        new_underscore (str): The new progress string with underscores and correctly guessed letters.
        is_team (bool, optional): Whether the guess is for a team.

    Returns:
        str: The updated progress string.
    """
    if self.is_player_guess:
      existing_underscore = self.progress
    else: 
      split_progress = self.progress.split('   ')
      if is_team:
        existing_underscore = '   '.join(split_progress[:-1])
      else:
        existing_underscore = split_progress[-1]
  
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
    build = ''.join([char + ' ' if char.isalnum() or char in valid_chars else char for char in build])
    build = build[:-1]
    return build