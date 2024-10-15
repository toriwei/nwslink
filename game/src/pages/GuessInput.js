import InputMessage from './InputMessage'
import SpacedLetters from './SpacedLetters'
// to do: divs to line up guess team name and progress team name (and same w/ season)
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
      <div>
        <div className='flex flex-col space-x-2'>
          <div className='flex flex-row flex-1'>
            <div className='flex-1 text-right'>
              <span className='pr-4'>Shared Letters:</span>
            </div>
            <div className='flex-1'>{getFormattedSharedLetters()}</div>
          </div>
          <div className='flex flex-row flex-1 '>
            <div className='flex-1 text-right'>
              <span className='pr-4'>Your Guess:</span>
            </div>
            <div className='flex-1'>
              {guess && <SpacedLetters parts={guess} />}
            </div>
          </div>
          <div className='flex flex-row flex-1'>
            <div className='flex-1 text-right'>
              <span className='pr-4'>Progress:</span>
            </div>
            <div className='flex-1'>{getFormattedProgress()}</div>
          </div>
          <div className='flex flex-row flex-1 mt-2'>
            <div className='flex-1 text-right'>
              <label htmlFor='guess' className='pr-4'>
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
                      className='border border-black rounded-md w-96'
                      name='guess'
                      id='guess'
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
                        message={'Great job! You completed the game!'}
                        isError={false}
                      />
                    )}
                    {guess && showCorrect && !gameComplete && (
                      <InputMessage
                        message={'Complete! Press enter to return.'}
                        isError={false}
                      />
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className='flex w-full relative '>
        <div className='absolute left-0 right-0 flex flex-row mt-8 space-x-2'>
          <div className='flex-1 text-right'>
            <span className='pr-4'>Guess Log:</span>
          </div>
          <div className='flex-1 flex flex-col w-full'>
            <div className='max-w-96 h-16 max-h-36 overflow-auto border resize-y border border-black rounded-md'>
              {guessLog.length > 0 && getFormattedGuessLog(guessLog)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
