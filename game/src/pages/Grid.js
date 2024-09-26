import { useState, useEffect, useRef } from 'react'

export default function Grid({ players, connections }) {
  console.log(connections)
  return (
    <div>
      <table className='border table-auto'>
        <thead></thead>
        <tbody className='border'>
          {players.map((row, i) => (
            <tr>
              {row.map((player) => (
                <td>
                  <span className='space-x-8'>
                    {player.split('   ').map((part) => (
                      <span>{part}</span>
                    ))}
                  </span>
                </td>
              ))}
              <td>
                <span className='space-x-8'>
                  {connections[i].split('   ').map((part) => (
                    <span>{part}</span>
                  ))}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
