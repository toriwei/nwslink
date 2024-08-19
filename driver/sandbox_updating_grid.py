str1 = "C _ T _"
str2 = "_ A _ _"

def update_underscore_progress(existing_underscore, new_underscore):
  build = ""
  for char1, char2 in zip(existing_underscore, new_underscore):
    if char1 != " ":
      build += char1
    elif char2 != " ":
        build += char2
    elif char1 == " ":
      build += " "
    else:
        build += "_"
  return build

print(update_underscore_progress(str1, str2))