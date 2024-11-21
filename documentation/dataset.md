## Dataset

I used [SoccerData](https://github.com/probberechts/soccerdata) to collect NWSL data from [FBref](https://fbref.com/en/). It returns data as `pandas` dataframes (Python).

### Content

This dataset contains NWSL club history for all players that received minutes during any official season up to the latest update to the database (Nov 2024).

Players who did not play any minutes in a season will not have that season listed. Players who never played any minutes in any season are not included in the database at all.

The database also does not include data from the 2020 season, as it was played as the NWSL Challenge Cup and NWSL Fall Series due to COVID-19 protocols. According to FBref, "Stats for the Challenge Cup and Fall Series are not counted toward league stats, per league determination."
