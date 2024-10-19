export default function InfoModal({ closeInfoModal }) {
  return (
    <div className='fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-75 text-sm'>
      <div className='relative flex flex-col w-4/5 md:w-1/2 h-3/4 p-4 pb-12 bg-white rounded-lg text-center'>
        <button className='text-right' onClick={closeInfoModal}>
          <span className='bg-[#EE1B4B] hover:bg-[#CB333B] text-white text-xl rounded px-3 pb-[1px]'>
            &times;
          </span>
        </button>
        <div className='modal-header text-center mb-2'>
          <h2 className='text-3xl font-bold '>INFO</h2>
        </div>
        <div className='modal-content overflow-y-scroll flex flex-col w-full px-4 md:px-8 pb-4 text-left space-y-6'>
          <div>
            <h3 className='text-xl font-bold'>HOW TO PLAY</h3>
            <div className='space-y-4'>
              <p>
                Guess National Women's Soccer League (NWSL) players and clubs to
                complete the board.
              </p>
              <ul className='list-disc pl-4 space-y-2'>
                <li>Select a tile number [1]-[9] to make a guess</li>
                <li>
                  MYSTERY PLAYERS [1]-[4] played together at the club in COLUMN
                  LINK [9]
                </li>
                <li>
                  Each MYSTERY PLAYER has teammates from another club in ROW
                  LINK [5]-[8]
                </li>
              </ul>
            </div>
          </div>
          <div>
            <h3 className='text-xl font-bold'>FORMAT</h3>
            <div className='space-y-4'>
              <ul className='list-disc pl-4 space-y-2'>
                <li>
                  MYSTERY PLAYER: full name of a NWSL player with a regular
                  season cap
                </li>
                <li>LINK: club name and season (formatted as YYYY)</li>
                <li className='list-none'>
                  Note: Data synced up to August 12, 2024. Excludes 2020 data as
                  that season was replaced by the Challenge Cup.
                </li>
              </ul>
            </div>
          </div>
          <div>
            <h3 className='font-bold text-xl '>EXAMPLES</h3>
            <div className='overflow-x-scroll'>
              <div className='flex flex-col space-y-2 '>
                <span>'SARAH GORDEN' for answer 'SIMONE CHARLEY'</span>
                <div className='flex flex-col whitespace-nowrap space-y-2 pl-4 text-xs'>
                  <div className='flex space-x-4'>
                    <div className='flex flex-col items-end'>
                      <span>Shared Letters:</span>
                      <span>Your Guess:</span>
                      <span>Progress:</span>
                    </div>
                    <div className='flex flex-col items-start'>
                      <span>[E N O] [A E H R]</span>
                      <div className='space-x-4'>
                        <span>S A R A H G</span>

                        <span>O R D E N</span>
                        <span></span>
                      </div>
                      <div className='space-x-4'>
                        <span>S _ _ _ _ _</span>
                        <span>_ _ _ _ _ _ _</span>
                      </div>
                    </div>
                    <div className='flex flex-col items-start'>
                      <span>Letters in answer but wrong spot</span>
                      <span>Your guess adjusted to answer's spacing</span>
                      <span>Letters in the correct spot</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex flex-col space-y-2 mt-4'>
                <span>'THORNS 2019 for answer 'ANGEL CITY 2022'</span>
                <div className='flex flex-col whitespace-nowrap space-y-2 pl-4 text-xs'>
                  <div className='flex space-x-4'>
                    <div className='flex flex-col items-end'>
                      <span>Shared Letters:</span>
                      <span>Your Guess:</span>
                      <span>Progress:</span>
                    </div>
                    <div className='flex flex-col items-start'>
                      <span>[] [T] [2]</span>
                      <div className='space-x-4'>
                        <span>T H O R N</span>
                        <span>S</span>
                        <span>2 0 2 2</span>
                      </div>
                      <div className='space-x-4'>
                        <span>_ _ _ _ _</span>
                        <span>_ _ _ _</span>
                        <span>2 0 _ _</span>
                      </div>
                    </div>
                    <div className='flex flex-col items-start'>
                      <span>Letters in answer but wrong spot</span>
                      <span>Your guess adjusted to answer's spacing</span>
                      <span>Letters in the correct spot</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className='text-xl font-bold'>BUILT BY</h3>
            <a
              className='text-[#EE1B4B] hover:text-[#CB333B]'
              href='https://toriwei.github.io/'
              target='_blank'
            >
              Tori
            </a>
            , a software engineer who likes soccer, data, and design.
          </div>
        </div>
      </div>
    </div>
  )
}
