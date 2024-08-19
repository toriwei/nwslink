from setup_game import Game

def main():
    game = Game()
    game.setup_game()

    players = game.players
    connections = game.connections
    mystery_team = game.mystery_team
    connections_set = game.connections_set

    # Do something with the data
    print("Players Grid:")
    for row in players:
        print(row)

    print("\nConnections:")
    for connection in connections:
        print(connection)

    print("\nMystery Team:")
    print(mystery_team)

    print("\nConnections Set:")
    for connection_set in connections_set:
        print(connection_set)

if __name__ == "__main__":
    main()
