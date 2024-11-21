export default function Grid({ players, connections }) {
  if (
    !players ||
    players.length === 0 ||
    !connections ||
    connections.length === 0
  ) {
    return <div>Loading...</div>
  }
  return (
    <div className='py-4 overflow-x-auto max-w-screen'>
      <table className='mx-auto w-full border-separate border-spacing-x-1 border-spacing-y-2'>
        <tbody className=''>
          <tr key={`row-label-top`} className='row-label-top'>
            <td colSpan={3} className='lg:w-1/2' />
            <td className='font-bold px-4'>MYSTERY PLAYERS</td>
            <td className='font-bold px-4'>ROW LINKS</td>
          </tr>
          {Array.from({ length: 4 }, (_, i) => (
            <tr key={`game-row-${i}`} className={`game-row-${i}`}>
              {/* known players */}
              <td colSpan={3} className='border border-black rounded-md'>
                <div className='flex justify-between px-1 space-x-2'>
                  {players[i].slice(0, 3).map((player, j) => (
                    <div
                      key={`player-${i}-${j}`}
                      className={`player-${i}-${j} px-2 w-1/3`}
                    >
                      <span
                        className={`player-span-${i}-${j} flex flex-wrap space-x-1 lg:space-x-2`}
                      >
                        {player.split(' ').map((part, k) => (
                          <span
                            key={`player-${i}-${j}-${k}`}
                            className='first:ml-1 lg:first:ml-2'
                          >
                            {part}
                          </span>
                        ))}
                      </span>
                    </div>
                  ))}
                </div>
              </td>
              {/* mystery player*/}
              <td
                key={`player-${i}-3`}
                className={`player-${i}-3 border border-black rounded-md px-2 lg:px-4`}
              >
                <span
                  key={`player-span-${i}-3`}
                  className={`player-span-${i}-3  space-x-6 lg:space-x-8`}
                >
                  <span
                    key={`label-player-${i}-3`}
                    className={`label-player-${i}-3 -mr-4`}
                  >
                    {`[${i + 1}]`}
                  </span>
                  {players[i][3].split(' ').map((part, k) => (
                    <span
                      key={`player-letter-${i}-3-${k}`}
                      className='space-x-1.5 lg:space-x-2'
                    >
                      {part.split('').map((letter, l) => (
                        <span key={l}>{letter}</span>
                      ))}
                    </span>
                  ))}
                </span>
              </td>

              {/* link */}
              <td className='border border-black rounded-md px-2 lg:px-4'>
                <span
                  key={`link-${i}`}
                  className={`link-${i}  space-x-6 lg:space-x-8`}
                >
                  <span
                    key={`label-link-${i}`}
                    className={`label-link-${i} -mr-4`}
                  >
                    {`[${i + 5}]`}
                  </span>
                  {connections[i].split(' ').map((part, j) => (
                    <span
                      key={`link-span${i}-${j}`}
                      className={`link-span-${i}-${j} space-x-1.5 lg:space-x-2`}
                    >
                      {part.split('').map((letter, k) => (
                        <span key={`link-letter-${i}-${j}-${k}`}>{letter}</span>
                      ))}
                    </span>
                  ))}
                </span>
              </td>
            </tr>
          ))}
          <tr key={`row-label-mid`} className={`row-label-mid`}>
            <td colSpan={3} />
            <td className='font-bold pt-4 px-4'>COLUMN LINK</td>
          </tr>
          <tr key={`row-mystery-link`} className='row-mystery-link'>
            <td colSpan={3} className='' />
            <td className='border border-black rounded-md px-2 lg:px-4'>
              <span key={`col-link`} className=' space-x-6 lg:space-x-8'>
                <span key={`col-link-label`} className='-mr-4'>
                  {'[9]'}
                </span>
                {connections[4].split(' ').map((part, j) => (
                  <span
                    key={`col-link-4-${j}`}
                    className='space-x-1.5 lg:space-x-2'
                  >
                    {part.split('').map((letter, k) => (
                      <span key={`col-link-4-${j}-${k}`}>{letter}</span>
                    ))}
                  </span>
                ))}
              </span>
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
