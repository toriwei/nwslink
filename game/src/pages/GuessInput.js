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
  if (guess === undefined) {
    return
  }
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
      <div className='' key={i}>
        <SpacedLetters parts={player} />
      </div>
    ))
  }

  return (
    <div>
      <div className='results flex flex-col whitespace-nowrap w-full'>
        <div className='flex justify-center items-end'>
          <div className='flex flex-col flex-1 items-end space-y-1'>
            <span className='pr-4'>Shared Letters:</span>
            <span className='pr-4'>Your Guess:</span>
            <span className='pr-4'>Progress:</span>
            <span className='pr-4 h-[22px]lg:h-[26px]'>
              <label htmlFor='guess'>
                Enter guess <span>[{gridRow}]</span>:
              </label>
            </span>
          </div>
          <div className='flex flex-col flex-1 items-start space-y-1'>
            <span className='px-1'>{getFormattedSharedLetters()}</span>
            <span className='flex-1 px-1'>
              {guess ? <SpacedLetters parts={guess} /> : <span>&nbsp;</span>}
            </span>
            <span className='px-1'>{getFormattedProgress()}</span>
            <span>
              <form onSubmit={handleGuess}>
                <div className='flex flex-row'>
                  <div className='flex flex-col relative'>
                    <input
                      autoFocus
                      type='text'
                      className='border border-black focus:outline-nwslElectricBlue rounded-md w-32 sm:w-64 md:w-82 lg:w-96 px-1'
                      name='guess'
                      id='guess'
                      autoComplete='off'
                      onKeyDown={(e) => {
                        if (showCorrect && e.key !== 'Enter') {
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
                  <button
                    type='submit'
                    className='flex ml-4 px-4 rounded-md bg-nwslElectricBlue hover:bg-nwslNavy text-white'
                  >
                    Enter
                  </button>
                </div>
              </form>
            </span>
          </div>
        </div>
      </div>
      <div className='guess-log relative flex w-full h-full whitespace-nowrap '>
        <div className='absolute left-0 right-0 flex flex-row mt-8'>
          <div className='flex-1 text-right'>
            <span className='pr-4'>Guess Log:</span>
          </div>
          <div className='flex-1'>
            <div className='resize-y w-32 sm:w-64 md:w-82 lg:w-96 min-h-8 h-16 max-h-24 lg:max-h-36 overflow-auto border border-black rounded-md px-1'>
              {guessLog.length > 0 && getFormattedGuessLog(guessLog)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
