export default function StatsModal({
  closeStatsModal,
  stats,
  showGameCompleteMessage,
}) {
  return (
    <div className='fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-75'>
      <div className='relative flex flex-col w-1/2 h-3/4 p-4 bg-white rounded-lg text-center'>
        <button className='text-right' onClick={closeStatsModal}>
          <span className='bg-[#0036FF] hover:bg-[#001E60] text-white  rounded px-2'>
            &times;
          </span>
        </button>
        <div className='modal-header text-center mb-4'>
          <h2 className='text-3xl font-bold '>
            {showGameCompleteMessage ? 'GAME COMPLETE!' : 'STATS'}
          </h2>
        </div>

        <div className='modal-content flex flex-col justify-center'>
          {showGameCompleteMessage && (
            <div className='flex flex-1 flex-col mb-8'>
              <span className='font-bold text-5xl'>{stats.currentScore}</span>
              <span className='text-md'>SCORE</span>
            </div>
          )}
          <div className='flex'>
            <div className='flex flex-1 flex-col'>
              <span className='font-bold text-3xl'>{stats.gamesCompleted}</span>
              <span className='text-xs'>GAMES PLAYED</span>
            </div>
            <div className='flex flex-1 flex-col'>
              <span className='font-bold text-3xl'>
                {stats.bestScore || '-'}
              </span>
              <span className='text-xs'>BEST SCORE</span>
            </div>
            <div className='flex flex-1 flex-col'>
              <span className='font-bold text-3xl'>
                {Math.ceil(stats.averageScore) || '-'}
              </span>
              <span className='text-xs'>AVERAGE SCORE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
