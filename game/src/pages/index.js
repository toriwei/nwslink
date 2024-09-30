import React from 'react'
import GameRunner from './GameRunner'

export default function Home() {
  return (
    <div className='font-mono w-full mt-8'>
      <h1 className='text-center'>NWSLink</h1>
      <GameRunner />
    </div>
  )
}
