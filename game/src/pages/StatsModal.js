import Modal from './Modal'

export default function StatsModal({
  closeStatsModal,
  stats,
  showGameCompleteMessage,
  resetGame,
}) {
  return (
    <Modal
      closeModal={closeStatsModal}
      title={showGameCompleteMessage ? 'GAME COMPLETE!' : 'STATS'}
      color={'nwslElectricBlue'}
      secondaryColor={'nwslNavy'}
    >
      {showGameCompleteMessage && (
        <div className='flex flex-1 flex-col text-center'>
          <span className='font-bold text-5xl'>{stats.currentScore}</span>
          <span>SCORE</span>
        </div>
      )}
      {showGameCompleteMessage && (
        <div className='flex flex-1 flex-col'>
          <h3 className='font-bold text-xl mb-2'>THIS GAME:</h3>
          <div className='flex'>
            <div className='flex flex-1 flex-col'>
              <span className='font-bold text-3xl'>
                {stats.currentPlayerGuesses}
              </span>
              <span className='text-sm'>PLAYER GUESSES</span>
            </div>
            <div className='flex flex-1 flex-col'>
              <span className='font-bold text-3xl'>
                {stats.currentLinkGuesses}
              </span>
              <span className='text-sm'>LINK GUESSES</span>
            </div>
            <div className='flex flex-1'></div>
          </div>
        </div>
      )}
      <div className='flex flex-col h-full'>
        <h3 className='font-bold text-xl mb-2'>ALL TIME:</h3>
        <div className='flex flex-col space-y-2'>
          <div className='flex space-x-4'>
            <div className='flex flex-1 flex-col'>
              <span className='font-bold text-3xl'>{stats.gamesCompleted}</span>
              <span className='text-sm'>GAMES PLAYED</span>
            </div>
            <div className='flex flex-1 flex-col'>
              <span className='font-bold text-3xl'>
                {stats.bestScore || '-'}
              </span>
              <span className='text-sm'>BEST SCORE</span>
            </div>
            <div className='flex flex-1 flex-col'>
              <span className='font-bold text-3xl'>
                {Math.ceil(stats.averageScore) || '-'}
              </span>
              <span className='text-sm'>AVERAGE SCORE</span>
            </div>
          </div>
          <div className='flex space-x-4'>
            <div className='flex flex-1 flex-col'>
              <span className='font-bold text-3xl'>
                {stats.averagePlayerGuesses || '-'}
              </span>
              <span className='text-sm'>AVG. PLAYER GUESSES</span>
            </div>
            <div className='flex flex-1 flex-col'>
              <span className='font-bold text-3xl'>
                {stats.averageLinkGuesses || '-'}
              </span>
              <span className='text-sm'>AVG. LINK GUESSES</span>
            </div>
            <div className='flex flex-1'></div>
          </div>
        </div>
        <div className='mt-auto mx-auto pt-4'>
          <button
            className='bg-nwslElectricBlue hover:bg-nwslNavy text-white px-4 py-2 text-xs sm:text-sm rounded font-bold'
            onClick={() => {
              resetGame()
              closeStatsModal()
            }}
          >
            NEW GAME
          </button>
        </div>
      </div>
    </Modal>
  )
}
