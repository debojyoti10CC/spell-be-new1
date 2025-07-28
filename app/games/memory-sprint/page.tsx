"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Brain } from "lucide-react"
import GameLayout from "@/components/game-layout"
import { useRouter } from "next/navigation"

const emojis = [
  "🐶",
  "🐱",
  "🐭",
  "🐹",
  "🐰",
  "🦊",
  "🐻",
  "🐼",
  "🐨",
  "🐯",
  "🦁",
  "🐸",
  "🐵",
  "🐔",
  "🐧",
  "🐦",
  "🦋",
  "🐝",
  "🐞",
  "🦄",
]

export default function MemorySprintGame() {
  const [cards, setCards] = useState<Array<{ id: number; emoji: string; isFlipped: boolean; isMatched: boolean }>>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [matches, setMatches] = useState(0)
  const [timeLeft, setTimeLeft] = useState(900)
  const [gameComplete, setGameComplete] = useState(false)
  const router = useRouter()

  useEffect(() => {
    initializeGame()
  }, [])

  useEffect(() => {
    if (timeLeft > 0 && !gameComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      handleGameComplete()
    }
  }, [timeLeft, gameComplete])

  useEffect(() => {
    if (matches === 10) {
      // 20 cards = 10 pairs
      handleGameComplete()
    }
  }, [matches])

  const initializeGame = () => {
    const selectedEmojis = emojis.slice(0, 10)
    const gameCards = [...selectedEmojis, ...selectedEmojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }))
    setCards(gameCards)
  }

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2) return
    if (cards[cardId].isFlipped || cards[cardId].isMatched) return

    const newCards = [...cards]
    newCards[cardId].isFlipped = true
    setCards(newCards)

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    if (newFlippedCards.length === 2) {
      const [first, second] = newFlippedCards
      if (cards[first].emoji === cards[second].emoji) {
        // Match found
        setTimeout(() => {
          const matchedCards = [...cards]
          matchedCards[first].isMatched = true
          matchedCards[second].isMatched = true
          setCards(matchedCards)
          setMatches(matches + 1)
          setScore(score + 5)
          setFlippedCards([])
        }, 1000)
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...cards]
          resetCards[first].isFlipped = false
          resetCards[second].isFlipped = false
          setCards(resetCards)
          setScore(Math.max(0, score - 2))
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  const handleGameComplete = () => {
    setGameComplete(true)
    const currentProgress = Number.parseInt(localStorage.getItem("gameProgress") || "0")
    if (currentProgress === 1) {
      localStorage.setItem("gameProgress", "2")
    }
  }

  const instructions = [
    "Click on cards to flip them and reveal the emoji",
    "Find matching pairs of emojis",
    "Remember where each emoji is located",
    "Match all 10 pairs to complete the game",
    "Correct matches give +5 points, wrong attempts -2 points",
  ]

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-md"
        >
          <div className="text-6xl mb-4">🧠</div>
          <h2 className="text-3xl font-bold text-purple-600 mb-4">Memory Master!</h2>
          <div className="text-6xl font-bold text-yellow-500 mb-4">{score}</div>
          <p className="text-gray-600 mb-6">Amazing memory skills! You found all the matching pairs!</p>
          <Button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            Back to Home
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <GameLayout
      gameTitle="Memory Sprint"
      gameIcon={<Brain className="text-purple-500" size={32} />}
      instructions={instructions}
      onGameComplete={handleGameComplete}
      currentQuestion={matches}
      totalQuestions={10}
      score={score}
      timeLeft={timeLeft}
    >
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-4 md:grid-cols-5 gap-4">
          {cards.map((card) => (
            <motion.div
              key={card.id}
              whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
              whileTap={{ scale: card.isMatched ? 1 : 0.95 }}
            >
              <Card
                className={`aspect-square cursor-pointer transition-all duration-300 ${
                  card.isMatched
                    ? "bg-green-200 border-green-400"
                    : card.isFlipped
                      ? "bg-blue-200 border-blue-400"
                      : "bg-purple-200 border-purple-400 hover:bg-purple-300"
                }`}
                onClick={() => handleCardClick(card.id)}
              >
                <CardContent className="p-0 h-full flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {card.isFlipped || card.isMatched ? (
                      <motion.div
                        key="emoji"
                        initial={{ rotateY: -90 }}
                        animate={{ rotateY: 0 }}
                        exit={{ rotateY: 90 }}
                        transition={{ duration: 0.3 }}
                        className="text-4xl"
                      >
                        {card.emoji}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="back"
                        initial={{ rotateY: -90 }}
                        animate={{ rotateY: 0 }}
                        exit={{ rotateY: 90 }}
                        transition={{ duration: 0.3 }}
                        className="text-4xl"
                      >
                        ❓
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <div className="text-2xl font-bold text-purple-600">Matches Found: {matches}/10</div>
        </div>
      </div>
    </GameLayout>
  )
}
