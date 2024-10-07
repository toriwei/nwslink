import React, { useState, useEffect } from 'react'
import Header from './Header'
import StatsModal from './StatsModal'
import GameRunner from './GameRunner'

export default function Home() {
  const [showStatsModal, setShowStatsModal] = useState(false)
  const [stats, setStats] = useState({
    bestScore: undefined,
    gamesCompleted: 0,
    cumulativeScore: undefined,
    averageScore: undefined,
  })

  const openStatsModal = () => setShowStatsModal(true)
  const closeStatsModal = () => setShowStatsModal(false)

  const updateStats = (newScore) => {
    console.log(newScore)
    setStats((prev) => {
      const bestScore =
        typeof prev.bestScore === 'number' ? prev.bestScore : Number(newScore)
      const gamesCompleted =
        typeof prev.gamesCompleted === 'number' ? prev.gamesCompleted : 0
      const cumulativeScore =
        typeof prev.cumulativeScore === 'number' ? prev.cumulativeScore : 0

      const updatedStats = {
        bestScore: newScore < bestScore ? newScore : bestScore,
        gamesCompleted: gamesCompleted + 1,
        cumulativeScore: cumulativeScore + newScore,
        averageScore: Math.ceil(
          (cumulativeScore + newScore) / (gamesCompleted + 1)
        ),
      }

      localStorage.setItem('stats', JSON.stringify(updatedStats))
      return updatedStats
    })
  }

  useEffect(() => {
    const storedStats = localStorage.getItem('stats')
    if (storedStats) {
      setStats(JSON.parse(storedStats))
    }
  }, [])

  return (
    <div className='font-mono w-screen px-12 mt-8'>
      <Header openStatsModal={openStatsModal} />
      {showStatsModal && (
        <StatsModal closeStatsModal={closeStatsModal} stats={stats} />
      )}
      <GameRunner stats={stats} updateStats={updateStats} />
    </div>
  )
}
