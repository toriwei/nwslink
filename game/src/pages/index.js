import React, { useState, useEffect } from 'react'
import Header from './Header'
import StatsModal from './StatsModal'
import InfoModal from './InfoModal'
import GameRunner from './GameRunner'
import { IBM_Plex_Mono } from 'next/font/google'

const ibm_Plex_Mono = IBM_Plex_Mono({
  weight: '400',
  subsets: ['latin'],
})

export default function Home() {
  const [gameKey, setGameKey] = useState(0)
  const [showStatsModal, setShowStatsModal] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showGameCompleteMessage, setShowGameCompleteMessage] = useState(false)
  const [stats, setStats] = useState({
    bestScore: undefined,
    gamesCompleted: 0,
    currentScore: undefined,
    totalScore: undefined,
    averageScore: undefined,
    totalPlayerGuesses: undefined,
    totalLinkGuesses: undefined,
    averagePlayerGuesses: undefined,
    averageLinkGuesses: undefined,
  })

  const resetGame = () => {
    setGameKey((prevKey) => prevKey + 1)
    setShowStatsModal(false)
    localStorage.removeItem('currentGame')
  }

  const openStatsModal = () => setShowStatsModal(true)
  const closeStatsModal = () => setShowStatsModal(false)

  const openInfoModal = () => setShowInfoModal(true)
  const closeInfoModal = () => setShowInfoModal(false)

  const updateStats = (newScore, newPlayerGuesses, newLinkGuesses) => {
    setShowGameCompleteMessage(true)
    setStats((prev) => {
      const bestScore = prev.bestScore ?? Number(newScore)
      const gamesCompleted = prev.gamesCompleted ?? 0
      const totalScore = prev.totalScore ?? 0
      const currentScore = Number(newScore)
      const totalPlayerGuesses = prev.totalPlayerGuesses ?? 0
      const totalLinkGuesses = prev.totalLinkGuesses ?? 0

      const updatedStats = {
        bestScore: Math.min(newScore, bestScore),
        gamesCompleted: gamesCompleted + 1,
        totalScore: totalScore + newScore,
        currentScore: currentScore,
        averageScore: Math.ceil((totalScore + newScore) / (gamesCompleted + 1)),
        currentPlayerGuesses: newPlayerGuesses,
        totalPlayerGuesses: totalPlayerGuesses + newPlayerGuesses,
        averagePlayerGuesses: Math.ceil(
          (totalPlayerGuesses + newPlayerGuesses) / (gamesCompleted + 1)
        ),
        currentLinkGuesses: newLinkGuesses,
        totalLinkGuesses: totalLinkGuesses + newLinkGuesses,
        averageLinkGuesses: Math.ceil(
          (totalLinkGuesses + newLinkGuesses) / (gamesCompleted + 1)
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
    } else {
      openInfoModal() // opens the info modal for first-time players
    }
  }, [])

  return (
    <div
      className={`${ibm_Plex_Mono.className} w-screen h-screen px-8 lg:px-12 pt-8 text-xs md:text-sm lg:text-base`}
    >
      <Header openStatsModal={openStatsModal} openInfoModal={openInfoModal} />
      {showStatsModal && (
        <StatsModal
          closeStatsModal={closeStatsModal}
          stats={stats}
          showGameCompleteMessage={showGameCompleteMessage}
          resetGame={resetGame}
        />
      )}
      {showInfoModal && <InfoModal closeInfoModal={closeInfoModal} />}
      <GameRunner
        key={gameKey}
        stats={stats}
        updateStats={updateStats}
        openStatsModal={openStatsModal}
      />
    </div>
  )
}
