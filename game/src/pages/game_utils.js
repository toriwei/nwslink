const PLAYERS = [
  ['Clare Polkinghorne', 'Kendall Johnson', 'Michelle Betos', 'Kate Del Fava'],
  ['Raquel Rodríguez', 'Emily Menges', 'Simone Charley', 'Yazmeen Ryan'],
  ['Cari Roccaro', 'Kendall Fletcher', 'Lynn Williams', 'Taylor Smith'],
  ['Emily van Egmond', 'Toni Pressley', 'Ashlyn Harris', 'Kristen Edmonds'],
].map((row) => row.map((player) => player.toUpperCase()))

const CONNECTIONS = [
  'SKY BLUE 2015',
  'THORNS 2021',
  'COURAGE 2021',
  'PRIDE 2019',
  'GOTHAM 2023',
]

const MYSTERY_TEAM = { team: 'Gotham', season: '2023' }

const MYSTERY_PLAYERS = PLAYERS.map((row) => row[3].toUpperCase())

const CONNECTIONS_SET = new Set([
  { team: 'Sky Blue', season: '2015' },
  { team: 'Thorns', season: '2021' },
  { team: 'Courage', season: '2021' },
  { team: 'Pride', season: '2019' },
  { team: 'Gotham', season: '2023' },
])

export { PLAYERS, CONNECTIONS, MYSTERY_TEAM, MYSTERY_PLAYERS, CONNECTIONS_SET }
