import React from 'react'
import Modal from './Modal'

export default function InfoModal({ closeInfoModal }) {
  const SpacedExample = React.memo(({ str }) => (
    <div className='space-x-4'>
      {str.split(' ').map((part) => (
        <span key={part} className='space-x-2'>
          {part.split('').map((char, j) => (
            <span key={j}>{char}</span>
          ))}
        </span>
      ))}
    </div>
  ))
  SpacedExample.displayName = 'SpacedExample'

  const Example = ({
    guess,
    answer,
    sharedLetters,
    guessSpacing,
    progress,
  }) => (
    <div className='flex flex-col space-y-2 mt-4 pb-2'>
      <span>{`'${guess}' for answer '${answer}'`}</span>
      <div className='flex flex-col whitespace-nowrap space-y-2 pl-4 text-xs'>
        <div className='flex space-x-4'>
          <div className='flex flex-col items-end'>
            <span>Shared Letters:</span>
            <span>Your Guess:</span>
            <span>Progress:</span>
          </div>
          <div className='flex flex-col items-start'>
            <SpacedExample str={sharedLetters} />
            <SpacedExample str={guessSpacing} />
            <SpacedExample str={progress} />
          </div>
          <div className='flex flex-col items-start'>
            <span>Letters in answer but wrong spot</span>
            <span>Your guess adjusted to answer&#39;s spacing</span>
            <span>Letters in the correct spot</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <Modal
      closeModal={closeInfoModal}
      title={'INFO'}
      color={'nwslRed'}
      secondaryColor={'nwslDeepRed'}
    >
      <div>
        <h3 className='text-xl font-bold'>HOW TO PLAY</h3>
        <div className='space-y-4'>
          <p>
            Guess National Women&#39;s Soccer League (NWSL) players and clubs to
            complete the board.
          </p>
          <ul className='list-disc pl-4 space-y-2'>
            <li>Select a tile [1]-[9] and press Enter.</li>
            <li>Make a guess or press Enter to return to tile selection.</li>
            <li>
              MYSTERY PLAYERS [1]-[4] played together at the club in COLUMN LINK
              [9]
            </li>
            <li>
              Each MYSTERY PLAYER has teammates from another club in ROW LINK
              [5]-[8]
            </li>
          </ul>
        </div>
      </div>
      <div>
        <h3 className='text-xl font-bold'>FORMAT</h3>
        <div className='space-y-4'>
          <ul className='list-disc pl-4 space-y-2'>
            <li>MYSTERY PLAYER: full name of a NWSL player</li>
            <li>LINK: club name and season (formatted as YYYY)</li>
            <li className='list-none'>
              Notes: Player must have at least one cap to be listed under a
              club&#39;s season. Data synced up to November 14, 2024. Excludes
              2020 data as that season was replaced by the Challenge Cup.
            </li>
          </ul>
        </div>
      </div>
      <div>
        <h3 className='font-bold text-xl '>EXAMPLES</h3>
        <div className='overflow-x-scroll'>
          <Example
            guess='ALEX LOERA'
            answer='ALI RILEY'
            sharedLetters='[] [LR]'
            guessSpacing='ALE XLOER A'
            progress='AL_ ___E_'
          />
          <Example
            guess='CURRENT 2022'
            answer='ANGEL CITY 2024'
            sharedLetters='[EN] [CT] []'
            guessSpacing='CURRE NT 2022'
            progress='_____ ____ 202_'
          />
        </div>
      </div>
      <div>
        <h3 className='text-xl font-bold'>BUILT BY</h3>
        <a
          className='text-nwslRed hover:text-nwslDeepRed'
          href='https://toriwei.github.io/'
          target='_blank'
        >
          Tori
        </a>
        , a recent CS grad and soccer enthusiast. Check out the code{' '}
        <a
          className='text-nwslRed hover:text-nwslDeepRed'
          href='https://github.com/toriwei/nwslink'
          target='_blank'
        >
          here
        </a>
        .
      </div>
    </Modal>
  )
}
