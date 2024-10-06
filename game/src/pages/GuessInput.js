import InputMessage from './InputMessage'
import SpacedLetters from './SpacedLetters'

export default function GuessInput({
  isPlayerGuess,
  gameProgress,
  row,
  guess,
  gridRow,
  handleGuess,
  showCorrect,
  inputError,
  gameComplete,
  guessLog,
}) {
  const getFormattedSharedLetters = () => {
    const letters = isPlayerGuess
      ? gameProgress.mysteryPlayersSharedLetters[row]
      : gameProgress.mysteryConnectionsSharedLetters[row]
    const parts = letters.map((part) => `[${part.join('')}]`)
    return <SpacedLetters parts={parts} />
  }

  const getFormattedProgress = () => {
    const progress = isPlayerGuess
      ? gameProgress.mysteryPlayersProgress[row]
      : gameProgress.mysteryConnectionsProgress[row]
    const parts = progress.split(' ')
    return <SpacedLetters parts={parts} />
  }

  const getFormattedGuessLog = (guessLog) => {
    return guessLog.map((player, i) => (
      <div key={i}>
        <SpacedLetters parts={player} />
      </div>
    ))
  }

  return (
    <div>
      <div className='flex flex-col'>
        <div className='flex flex-row flex-1'>
          <div className='flex-1 text-right mr-4'>Shared Letters:</div>
          <div className='flex-1'>{getFormattedSharedLetters()}</div>
        </div>
        <div className='flex flex-row flex-1 '>
          <div className='flex-1 text-right mr-4'>Your Guess: </div>
          <div className='flex-1'>
            {guess && <SpacedLetters parts={guess} />}
          </div>
        </div>
        <div className='flex flex-row flex-1'>
          <div className='flex-1 text-right mr-4'>Progress:</div>
          <div className='flex-1'>{getFormattedProgress()}</div>
        </div>
        <div className='flex flex-row flex-1 mt-2'>
          <div className='flex-1 text-right mr-4'>
            <label>
              Enter your guess <span>[{gridRow}]</span>:
            </label>
          </div>
          <div className='flex-1'>
            <form onSubmit={handleGuess}>
              <div className='flex'>
                <div className='flex flex-col relative'>
                  <input
                    autoFocus
                    type='text'
                    className='border'
                    name='guess'
                    autoComplete='off'
                    onKeyDown={(e) => {
                      if (showCorrect && e.keyCode !== 13) {
                        e.preventDefault()
                      }
                    }}
                    disabled={gameComplete}
                  />
                  {inputError && (
                    <InputMessage message={inputError} isError={true} />
                  )}
                  {gameComplete && (
                    <InputMessage
                      message={'Correct! You completed the game!'}
                      isError={false}
                    />
                  )}
                  {guess && showCorrect && !gameComplete && (
                    <InputMessage
                      message={'Correct! Press enter to return.'}
                      isError={false}
                    />
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className='absolute flex w-full mt-4'>
        <div className='flex-1 text-right mr-4'>Guess Log:</div>
        <div className='flex-1 flex flex-col max-h-16 overflow-y-scroll'>
          <div className='max-w-96 overflow-x-scroll border'>
            {guessLog.length > 0 && getFormattedGuessLog(guessLog)}
          </div>
        </div>
      </div>
    </div>
  )
}
