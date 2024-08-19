guess = "Christen Press"
correct_name = "Claire Emslie"
underscore_name = "_ _ _ _ _ _ _ _  _ _ _ _ _"
print(f"GUESS\n{guess}")
print(f"KEY\n{correct_name}")
print(f"UNDERSCORE\n{underscore_name}")

print("\nUPDATED")
underscore_set = underscore_name.strip(" ").split()
print(underscore_set)

def align_guess(guess, correct_name):
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
  return (aligned_guess, leftover)

aligned_guess_set = align_guess(guess, correct_name)
aligned_guess = aligned_guess_set[0]
leftovers = aligned_guess_set[1]
print(aligned_guess)
print(f"Leftover: '{leftovers}'")
print("")

def handle_guess(correct_name, aligned_guess, leftovers):
  correct_letters = []
  underscore_build = []
  for i, char in enumerate(correct_name):
    if aligned_guess[i] == "!":
      break
    elif aligned_guess[i] == char:
      underscore_build.append(char)
    else:
        underscore_build.append("_")
        if char in aligned_guess and char not in correct_letters:
            correct_letters.append(char)
  
  if len(leftovers) > 0:
    for char in leftovers:
      if char in correct_name and char not in correct_letters:
        correct_letters.append(char)
  print(f"Build: {underscore_build}")
  updated_underscore = " ".join(underscore_build)
  print(f"Correct Letters: {correct_letters}")
  print(f"Updated Underscore: {updated_underscore}")

print(leftovers)
handle_guess(correct_name, aligned_guess, leftovers)