import InputMessage from './InputMessage'
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
}) {
  const getFormattedSharedLetters = (letters) => {
    const parts = letters.map((part) => `[${part.join('')}]`)
    return parts.map((part, i) => (
      <span key={i} className='space-x-2'>
        {part.split('').map((char, j) => (
          <span key={j}>{char}</span>
        ))}
      </span>
    ))
  }

  const getFormattedProgress = (progress) => {
    const parts = (progress = progress.split(' '))
    return parts.map((part, i) => (
      <span key={i} className='space-x-2'>
        {part.split('').map((char, j) => (
          <span key={j}>{char}</span>
        ))}
      </span>
    ))
  }

  return (
    <div className='flex flex-col'>
      <div className='flex flex-row flex-1'>
        <div className='flex-1 text-right mr-4'>Shared Letters: </div>
        <div className='flex-1 space-x-8'>
          {isPlayerGuess
            ? getFormattedSharedLetters(
                gameProgress.mysteryPlayersSharedLetters[row]
              )
            : getFormattedSharedLetters(
                gameProgress.mysteryConnectionsSharedLetters[row]
              )}
        </div>
      </div>
      <div className='flex flex-row flex-1 '>
        <div className='flex-1 text-right mr-4'>Your Guess: </div>
        <div className='flex-1 space-x-8'>
          {guess &&
            guess.map((part, i) => (
              <span key={i} className='space-x-2'>
                {part.split('').map((char, j) => (
                  <span key={j} className=''>
                    {char}
                  </span>
                ))}
              </span>
            ))}
        </div>
      </div>
      <div className='flex flex-row flex-1'>
        <div className='flex-1 text-right mr-4'>Progress: </div>
        <div className='flex-1 space-x-8'>
          {isPlayerGuess
            ? getFormattedProgress(gameProgress.mysteryPlayersProgress[row])
            : getFormattedProgress(
                gameProgress.mysteryConnectionsProgress[row]
              )}
        </div>
      </div>
      <div className='flex flex-row flex-1'>
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
  )
}
