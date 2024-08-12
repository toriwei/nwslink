import soccerdata as sd # type: ignore
import numpy as np # type: ignore

# SCRAPE

# note: 2020 was Challenge Cup (COVID protocol). No data listed for that season
# however, 2021 season games were listed as being under 2020 season
season_range = np.arange(13, 25)
season_range = season_range[season_range != 21]

nwsl = sd.FBref('USA-National Women\'s Soccer League', season_range)

df = (
    nwsl.read_player_season_stats()
    .reset_index()[['player', 'season', 'team', 'nation']]
)

df['season'] = df['season'].replace('2020', '2021')

# PREPROCESS

# :Player Nodes
# get data for every NWSL player and their nationality
player_df = df[['player', 'nation']].drop_duplicates().reset_index(drop=True)
player_df['player_id'] = range(0, len(player_df))

player_df.rename(columns={'player': 'name', 'index':'player_id'}, inplace=True)
player_df = player_df[['player_id', 'name', 'nation']]

player_df.to_csv('players.csv', sep='*', header=False, index=False)

# :Team Nodes
team_df = df[['team']].drop_duplicates().reset_index(drop=True)
team_df['team_id'] = range(0, len(team_df))
team_df = team_df[['team_id', 'team']]

team_df.to_csv('teams.csv', sep='*', header=False, index=False)


# :PLAYED_FOR Edges
played_for_df = df[['player', 'season', 'team']].copy()
played_for_df.rename(columns={'player': 'player_name', 'team': 'team_name', 'season': 'season'}, inplace=True)

played_for_df = played_for_df.merge(player_df[['name', 'player_id']], left_on='player_name', right_on='name', how='left')
played_for_df = played_for_df.merge(team_df[['team', 'team_id']], left_on='team_name', right_on='team', how='left')

played_for_df = played_for_df.groupby(['player_id', 'team_id'])['season'].apply(list).reset_index()
played_for_df.rename(columns={'season':'seasons'}, inplace=True)

played_for_df.to_csv('played_for.csv', header=False, index=False, sep='*')
# Read the CSV file as a text file
with open('played_for.csv', 'r') as file:
    content = file.read()

# Replace double quotes with an empty string
content = content.replace('"', '')

# Write the modified content back to the CSV file
with open('played_for.csv', 'w') as file:
    file.write(content)


# :PLAYED_WITH Edges
played_with_df = df.merge(df, on=['team', 'season'])
played_with_df = played_with_df[played_with_df['player_x'] != played_with_df['player_y']]
played_with_df = played_with_df.merge(team_df[['team', 'team_id']], left_on='team', right_on='team', how='left')

played_with_df = played_with_df[['player_x', 'team', 'team_id', 'season', 'player_y']]
played_with_df.rename(columns={'player_x': 'player1_name', 'season': 'season', 'player_y': 'player2_name'}, inplace=True)

played_with_df = played_with_df.merge(player_df[['name', 'player_id']], left_on='player1_name', right_on='name', how='left')
played_with_df = played_with_df.merge(player_df[['name', 'player_id']], left_on='player2_name', right_on='name', how='left', suffixes=('_1', '_2'))

played_with_df = played_with_df.groupby(['player_id_1', 'player_id_2', 'team'])['season'].apply(list).reset_index()

played_with_df.rename(columns={'season':'seasons'}, inplace=True)

played_with_df.to_csv('played_with.csv', sep='*', header=False, index=False)
# Read the CSV file as a text file
with open('played_with.csv', 'r') as file:
    content = file.read()

# Replace double quotes with an empty string
content = content.replace('"', '')

# Write the modified content back to the CSV file
with open('played_with.csv', 'w') as file:
    file.write(content)

