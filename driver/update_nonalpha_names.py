from unidecode import unidecode
from nwsl_driver import get_nonalpha_names, update_player_names


try:
    nonalpha_names = get_nonalpha_names()

    updates = [
        {
            "player_id": player.get("player_id"),
            "current_name": player.get("name"),
            "updated_name": (unidecode(player.get("name"))),
        }
        for player in nonalpha_names
    ]

    for update in updates:
        print(update)

    result = update_player_names(updates)
    print(result)

except ValueError:
    print("Sorry, something went wrong. Please ensure that the information is correct")
