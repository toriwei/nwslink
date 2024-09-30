export default function Grid({ players, connections }) {
  return (
    <div className='pt-4'>
      <table className='mx-auto'>
        <tbody className=''>
          <tr key={`row-label-top`} className='row-label-top'>
            <td colSpan={3} />
            <td className='font-bold px-4'>MYSTERY PLAYERS</td>
            <td className='font-bold px-4'>ROW LINKS</td>
          </tr>
          {players.map((row, i) => (
            <tr key={`game-row-${i}`} className={`game-row-${i} border`}>
              {row.map((player, j) => (
                <td
                  key={`player-${i}-${j}`}
                  className={`player-${i}-${j} border px-4`}
                >
                  <span
                    key={`player-span-${i}-${j}`}
                    className={`player-span-${i}-${j} space-x-8`}
                  >
                    {j == 3 ? (
                      <span
                        key={`label-player-${i}-${j}`}
                        className={`label-player-${i}-${j} -mr-4`}
                      >
                        {`[${i + 1}]`}
                      </span>
                    ) : (
                      ''
                    )}
                    {player.split(' ').map((part, k) =>
                      j < 3 ? (
                        <span key={`player-${i}-${j}-${k}`}>{part}</span>
                      ) : (
                        <span
                          key={`player-letter-${i}-${j}-${k}`}
                          className='space-x-2'
                        >
                          {part.split('').map((letter, l) => (
                            <span key={l}>{letter}</span>
                          ))}
                        </span>
                      )
                    )}
                  </span>
                </td>
              ))}
              <td className='border px-4'>
                <span key={`link-${i}`} className={`link-${i} space-x-8`}>
                  <span
                    key={`label-link-${i}`}
                    className='label-link-${i} -mr-4'
                  >{`[${i + 5}]`}</span>
                  {connections[i].split(' ').map((part, j) => (
                    <span
                      key={`link-span${i}-${j}`}
                      className={`link-span-${i}-${j} space-x-2`}
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
            <td colSpan={3} />
            <td className='border px-4'>
              <span key={`col-link`} className='space-x-8'>
                <span key={`col-link-label`} className='-mr-4'>
                  {'[9]'}
                </span>
                {connections[4].split(' ').map((part, j) => (
                  <span key={`col-link-4-${j}`} className='space-x-2'>
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
