"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Music, Play, Pause } from "lucide-react"
import GameLayout from "@/components/game-layout"
import { useRouter } from "next/navigation"

const sounds = [
  { name: "Dog", emoji: "🐶", sound: "Woof!" },
  { name: "Cat", emoji: "🐱", sound: "Meow!" },
  { name: "Cow", emoji: "🐄", sound: "Moo!" },
  { name: "Duck", emoji: "🦆", sound: "Quack!" },
  { name: "Lion", emoji: "🦁", sound: "Roar!" },
  { name: "Sheep", emoji: "🐑", sound: "Baa!" },
  { name: "Pig", emoji: "🐷", sound: "Oink!" },
  { name: "Horse", emoji: "🐴", sound: "Neigh!" },
]

const generateRound = () => {
  const shuffled = [...sounds].sort(() => Math.random() - 0.5)
  const target = shuffled[0]
  const options = shuffled.slice(0, 4)
  return { target, options: options.sort(() => Math.random() - 0.5) }
}

export default function SoundMatchGame() {
  const [currentRound, setCurrentRound] = useState(0)
  const [gameData, setGameData] = useState(generateRound())
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(900)
  const [gameComplete, setGameComplete] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (timeLeft > 0 && !gameComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      handleGameComplete()
    }
  }, [timeLeft, gameComplete])

  const playSound = (sound: string) => {
    setIsPlaying(true)
    // Simulate sound playing
    setTimeout(() => setIsPlaying(false), 1000)

    // In a real implementation, you would play actual audio here
    // For now, we'll show the sound text
    alert(`🔊 ${sound}`)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return

    setSelectedAnswer(answerIndex)
    setShowResult(true)

    const isCorrect = gameData.options[answerIndex].name === gameData.target.name
    if (isCorrect) {
      setScore(score + 5)
    } else {
      setScore(Math.max(0, score - 2))
    }

    setTimeout(() => {
      if (currentRound < 19) {
        setCurrentRound(currentRound + 1)
        setGameData(generateRound())
        setSelectedAnswer(null)
        setShowResult(false)
      } else {
        handleGameComplete()
      }
    }, 2000)
  }

  const handleGameComplete = () => {
    setGameComplete(true)
    const currentProgress = Number.parseInt(localStorage.getItem("gameProgress") || "0")
    if (currentProgress === 4) {
      localStorage.setItem("gameProgress", "5")
    }
  }

  const instructions = [
    "Listen to the animal sound by clicking the play button",
    "Look at the four animal options below",
    "Click on the animal that makes that sound",
    "Match the sound to the correct animal to score points",
    "Complete all 20 rounds to finish the game",
  ]

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-md"
        >
          <div className="text-6xl mb-4">🎵</div>
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Sound Master!</h2>
          <div className="text-6xl font-bold text-yellow-500 mb-4">{score}</div>
          <p className="text-gray-600 mb-6">Amazing! You've mastered all the animal sounds!</p>
          <Button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            Back to Home
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <GameLayout
      gameTitle="Sound Match"
      gameIcon={<Music className="text-blue-500" size={32} />}
      instructions={instructions}
      onGameComplete={handleGameComplete}
      currentQuestion={currentRound + 1}
      totalQuestions={20}
      score={score}
      timeLeft={timeLeft}
    >
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRound}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mb-8 shadow-2xl border-4 border-blue-400">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="text-8xl mb-4">🎵</div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">Listen to the Sound!</h2>

                  {/* Sound Player */}
                  <div className="bg-blue-100 rounded-3xl p-8 mb-8">
                    <div className="text-6xl mb-4">{gameData.target.emoji}</div>
                    <Button
                      onClick={() => playSound(gameData.target.sound)}
                      disabled={isPlaying}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-xl rounded-full"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="mr-2" size={24} />
                          Playing...
                        </>
                      ) : (
                        <>
                          <Play className="mr-2" size={24} />
                          Play Sound 🔊
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-center mb-6 text-gray-700">Which animal makes this sound?</h3>

                {/* Answer Options */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {gameData.options.map((option, index) => {
                    let buttonClass = "p-6 rounded-xl border-4 transition-all duration-300 text-center "

                    if (showResult) {
                      if (option.name === gameData.target.name) {
                        buttonClass += "bg-green-100 border-green-500 text-green-700"
                      } else if (index === selectedAnswer) {
                        buttonClass += "bg-red-100 border-red-500 text-red-700"
                      } else {
                        buttonClass += "bg-gray-100 border-gray-300 text-gray-500"
                      }
                    } else {
                      buttonClass +=
                        "bg-white border-blue-300 text-gray-700 hover:bg-blue-50 hover:border-blue-500 hover:scale-105 cursor-pointer"
                    }

                    return (
                      <motion.div
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className={buttonClass}
                        whileHover={{ scale: selectedAnswer === null ? 1.05 : 1 }}
                        whileTap={{ scale: selectedAnswer === null ? 0.95 : 1 }}
                      >
                        <div className="text-4xl mb-2">{option.emoji}</div>
                        <div className="font-bold text-lg">{option.name}</div>
                      </motion.div>
                    )
                  })}
                </div>

                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 text-center"
                  >
                    {gameData.options[selectedAnswer!]?.name === gameData.target.name ? (
                      <div className="text-green-600 font-bold text-2xl">🎉 Correct! +5 points</div>
                    ) : (
                      <div className="text-red-600 font-bold text-2xl">
                        😔 Wrong! The answer was {gameData.target.name}. -2 points
                      </div>
                    )}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </GameLayout>
  )
}
