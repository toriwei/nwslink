import { useState, useEffect, useRef } from 'react'
import Game from './Game'
import Grid from './Grid'
import Guess from './Guess'
import RowInput from './RowInput'
import GuessInput from './GuessInput'
import axios from 'axios'

export default function GameRunner({ updateStats, openStatsModal }) {
  const IS_RANDOM_GAME = false
  const [gameProgress, setGameProgress] = useState({
    game: null,
    playersProgress: [],
    mysteryPlayersProgress: [],
    mysteryPlayersSharedLetters: [],
    mysteryConnectionsProgress: [],
    mysteryConnectionsSharedLetters: [],
    playerGuessedList: [false, false, false, false],
    connectionsGuessedList: [false, false, false, false, false],
  })
  const hasRun = useRef(false)
  const [row, setRow] = useState(undefined)
  const [gridRow, setGridRow] = useState(undefined)
  const [isPlayerGuess, setIsPlayerGuess] = useState(undefined)
  const [inputError, setInputError] = useState('')
  const [guess, setGuess] = useState('')
  const [showCorrect, setShowCorrect] = useState(false)
  const [gameComplete, setGameComplete] = useState(undefined)
  const [guessLog, setGuessLog] = useState(
    Array.from({ length: 9 }).map(() => [])
  )
  const [guessCount, setGuessCount] = useState(0)
  const [playerGuessCount, setPlayerGuessCount] = useState(0)
  const [linkGuessCount, setLinkGuessCount] = useState(0)

  const increasePlayerGuessCount = () =>
    setPlayerGuessCount(playerGuessCount + 1)
  const increaseLinkGuessCount = () => setLinkGuessCount(linkGuessCount + 1)

  const handleRowSubmit = (e) => {
    e.preventDefault()

    const rowSelection = parseInt(e.target.elements.row.value)

    if (isNaN(rowSelection) || rowSelection < 1 || rowSelection > 9) {
      setInputError('Must be 1-9')
      e.target.elements.row.value = ''
      return
    }

    setInputError('')
    setGridRow(rowSelection)

    const isPlayerRow = rowSelection <= 4
    const rowIndex = isPlayerRow ? rowSelection - 1 : rowSelection - 5
    const isRowComplete = isPlayerRow
      ? gameProgress.playerGuessedList[rowIndex]
      : gameProgress.connectionsGuessedList[rowIndex]

    if (isRowComplete) {
      setInputError('Already complete!')
    } else {
      setRow(rowIndex)
      setIsPlayerGuess(isPlayerRow)
    }

    e.target.elements.row.value = ''
  }

  const handleGuess = async (e) => {
    e.preventDefault()
    setShowCorrect(false)
    setInputError('')

    const guessInput = e.target.elements.guess.value.trim().toUpperCase()
    if (guessInput === '') {
      setRow(undefined)
      setGuess('')
      return
    }

    if (isPlayerGuess) {
      if (!(await isValidPlayer(guessInput))) {
        e.target.elements.guess.value = ''
        setInputError('Not a valid NWSL player.')
        return
      }
    }

    if (!isPlayerGuess) {
      if (!isValidConnectionFormat(guessInput)) {
        e.target.elements.guess.value = ''
        return
      }

      if (!(await checkValidTeamName(guessInput))) {
        e.target.elements.guess.value = ''
        return
      }
    }

    const guessConfig = isPlayerGuess
      ? {
          answer: gameProgress.game.mysteryPlayers[row],
          progress: gameProgress.mysteryPlayersProgress[row],
          sharedLetters: gameProgress.mysteryPlayersSharedLetters[row],
          sharedLettersKey: 'mysteryPlayersSharedLetters',
          progressKey: 'mysteryPlayersProgress',
          guessedListKey: 'playerGuessedList',
        }
      : {
          answer: gameProgress.game.connections[row],
          progress: gameProgress.mysteryConnectionsProgress[row],
          sharedLetters: gameProgress.mysteryConnectionsSharedLetters[row],
          sharedLettersKey: 'mysteryConnectionsSharedLetters',
          progressKey: 'mysteryConnectionsProgress',
          guessedListKey: 'connectionsGuessedList',
        }

    const guessObj = new Guess(
      guessConfig.answer,
      guessConfig.progress,
      guessConfig.sharedLetters,
      guessInput,
      isPlayerGuess
    )

    console.log(guessObj)
    let result = guessObj.handleGuess()
    console.log(result)

    setGameProgress((prev) => ({
      ...prev,
      [guessConfig.sharedLettersKey]: prev[guessConfig.sharedLettersKey].map(
        (part, i) => (i === row ? result.sharedLetters : part)
      ),
      [guessConfig.progressKey]: prev[guessConfig.progressKey].map((part, i) =>
        i === row ? result.progress : part
      ),
      playersProgress: isPlayerGuess
        ? prev.playersProgress.map((gridRow, i) =>
            i === row
              ? gridRow.map((player, j) => (j === 3 ? result.progress : player))
              : gridRow
          )
        : prev.playersProgress,
      mysteryConnectionsProgress: isPlayerGuess
        ? prev.mysteryConnectionsProgress
        : prev.mysteryConnectionsProgress.map((connection, i) =>
            i === row ? result.progress : connection
          ),
      [guessConfig.guessedListKey]: prev[guessConfig.guessedListKey].map(
        (guessed, i) => (i === row ? !result.progress.includes('_') : guessed)
      ),
    }))

    setGuess(getFormattedGuess(result))
    setGuessCount((prev) => prev + 1)

    if (isPlayerGuess) {
      increasePlayerGuessCount()
    } else {
      increaseLinkGuessCount()
    }

    if (!result.progress.includes('_')) {
      setShowCorrect(true)
    }

    e.target.elements.guess.value = ''
    return
  }

  const isValidConnectionFormat = (guessInput) => {
    const lastFourDigits = guessInput
      .substring(guessInput.length - 5, guessInput.length)
      .trim()
    if (guessInput.length > 0 && !/^\d{4}$/.test(lastFourDigits)) {
      setInputError('Must include 4-digit year')
      return false
    }

    const season = parseInt(lastFourDigits, 10)
    if (season < 2013 || season > 2024 || season === 2020) {
      setInputError('Season must be between 2013 and 2024, excluding 2020')
      return false
    }
    return true
  }

  const checkValidTeamName = async (guessInput) => {
    const team = guessInput.substring(0, guessInput.length - 4).trim()
    const isValid = await isValidTeamName(team)
    if (!isValid) {
      setInputError('Must be a valid team name.')
    }
    return isValid
  }

  const getFormattedGuess = (result) => {
    let guessBuild = result.alignedGuess.replace(/!/g, '').split(' ')

    if (isPlayerGuess) {
      let leftovers = result.leftovers.length > 0 ? result.leftovers : []
      if (leftovers.length > 0) {
        guessBuild = guessBuild.concat(leftovers)
      }
    } else if (result.leftovers.length > 0) {
      guessBuild = [
        ...guessBuild.slice(0, guessBuild.length - 1),
        result.leftovers,
        guessBuild.slice(guessBuild.length - 1)[0],
      ]
    }
    setGuessLog((prev) =>
      prev.map((arr, index) =>
        index === gridRow - 1 ? [guessBuild, ...arr] : arr
      )
    )
    return guessBuild
  }

  // API CALL METHODS
  const isValidPlayer = async (name) => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/is_valid_player', {
        params: {
          name: name,
        },
      })
      console.log(res.data)
      return res.data.is_valid_player
    } catch (e) {
      console.log(e)
      throw new Error('Failed to search player name')
    }
  }

  const isValidTeamName = async (team) => {
    console.log(team)
    try {
      const res = await axios.get('http://127.0.0.1:5000/is_valid_team_name', {
        params: {
          team: team,
        },
      })
      console.log(res.data)
      return res.data.is_valid_team_name
    } catch (e) {
      console.log(e)
      throw new Error('Failed to search player name')
    }
  }

  useEffect(() => {
    async function initializeGame() {
      const game = new Game(IS_RANDOM_GAME)
      await game.setupGame()

      let playersProgress = game.setPlayersProgress(
        game.players.map((row) => [...row])
      )
      let mysteryPlayersProgress = playersProgress.map((row) => row[3])
      let mysteryConnectionsProgress = game.setConnectionsProgress(
        game.connections
      )
      let playerGuessedList = [false, false, false, false]
      let connectionsGuessedList = [false, false, false, false, false]

      let mysteryPlayersSharedLetters = [[], [], [], []]
      let mysteryConnectionsSharedLetters = [[], [], [], [], []]

      setGameProgress({
        game,
        playersProgress,
        mysteryPlayersProgress,
        mysteryPlayersSharedLetters,
        mysteryConnectionsProgress,
        mysteryConnectionsSharedLetters,
        playerGuessedList,
        connectionsGuessedList,
      })
    }
    if (!hasRun.current) {
      initializeGame()
      hasRun.current = true
    }
  }, [])

  useEffect(() => {
    if (
      !gameProgress.playerGuessedList.includes(false) &&
      !gameProgress.connectionsGuessedList.includes(false)
    ) {
      setGameComplete(true)
      updateStats(guessCount, playerGuessCount, linkGuessCount)
      openStatsModal(true)
    }
  }, [gameProgress.playerGuessedList, gameProgress.connectionsGuessedList])

  return (
    <div className='h-5/6'>
      {gameProgress.playersProgress.length > 0 &&
      gameProgress.mysteryConnectionsProgress.length > 0 ? (
        <Grid
          players={gameProgress.playersProgress}
          connections={gameProgress.mysteryConnectionsProgress}
        />
      ) : (
        <div className='w-full text-center pt-4'>
          <p>Building Game... Creating Links... Warming Up...</p>
        </div>
      )}
      <div className='min-h-36 content-end'>
        {row === undefined ? (
          <RowInput handleRowSubmit={handleRowSubmit} inputError={inputError} />
        ) : (
          <GuessInput
            isPlayerGuess={isPlayerGuess}
            gameProgress={gameProgress}
            row={row}
            guess={guess}
            gridRow={gridRow}
            handleGuess={handleGuess}
            showCorrect={showCorrect}
            inputError={inputError}
            gameComplete={gameComplete}
            guessLog={guessLog[gridRow - 1]}
          />
        )}
      </div>
      <div className='flex flex-row mt-48'>
        <div className='flex-1 text-right'>
          <span className='pr-4'>Guesses:</span>
        </div>
        <div className='flex-1'>{guessCount}</div>
      </div>
    </div>
  )
}
