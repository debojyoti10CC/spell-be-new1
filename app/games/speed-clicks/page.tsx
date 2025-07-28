"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, Timer } from "lucide-react"
import GameLayout from "@/components/game-layout"
import { useRouter } from "next/navigation"

const shapes = [
  { name: "Circle", emoji: "🔵", color: "bg-blue-400" },
  { name: "Square", emoji: "🟨", color: "bg-yellow-400" },
  { name: "Triangle", emoji: "🔺", color: "bg-red-400" },
  { name: "Star", emoji: "⭐", color: "bg-yellow-300" },
  { name: "Heart", emoji: "❤️", color: "bg-red-300" },
  { name: "Diamond", emoji: "💎", color: "bg-blue-300" },
]

const generateRound = () => {
  const targetShape = shapes[Math.floor(Math.random() * shapes.length)]
  const gridSize = 16 // 4x4 grid
  const targetCount = Math.floor(Math.random() * 4) + 3 // 3-6 targets

  const grid = new Array(gridSize).fill(null).map(() => {
    return Math.random() < 0.3 ? targetShape : shapes[Math.floor(Math.random() * shapes.length)]
  })

  // Ensure we have at least the minimum target count
  for (let i = 0; i < targetCount; i++) {
    const randomIndex = Math.floor(Math.random() * gridSize)
    grid[randomIndex] = targetShape
  }

  return { targetShape, grid, targetCount: grid.filter((shape) => shape?.name === targetShape.name).length }
}

export default function SpeedClicksGame() {
  const [currentRound, setCurrentRound] = useState(0)
  const [gameData, setGameData] = useState(generateRound())
  const [clickedShapes, setClickedShapes] = useState<boolean[]>(new Array(16).fill(false))
  const [score, setScore] = useState(0)
  const [roundTimeLeft, setRoundTimeLeft] = useState(10) // 10 seconds per round
  const [timeLeft, setTimeLeft] = useState(900)
  const [gameComplete, setGameComplete] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (timeLeft > 0 && !gameComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      handleGameComplete()
    }
  }, [timeLeft, gameComplete])

  useEffect(() => {
    if (roundTimeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setRoundTimeLeft(roundTimeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (roundTimeLeft === 0) {
      checkResults()
    }
  }, [roundTimeLeft, showResult])

  const handleShapeClick = (index: number) => {
    if (clickedShapes[index] || showResult) return

    const newClickedShapes = [...clickedShapes]
    newClickedShapes[index] = true
    setClickedShapes(newClickedShapes)

    // Check if all targets are found
    const targetIndices = gameData.grid
      .map((shape, i) => (shape?.name === gameData.targetShape.name ? i : -1))
      .filter((i) => i !== -1)

    const allTargetsFound = targetIndices.every((i) => newClickedShapes[i])

    if (allTargetsFound) {
      checkResults()
    }
  }

  const checkResults = () => {
    setShowResult(true)

    const targetIndices = gameData.grid
      .map((shape, i) => (shape?.name === gameData.targetShape.name ? i : -1))
      .filter((i) => i !== -1)

    const correctClicks = targetIndices.filter((i) => clickedShapes[i]).length
    const incorrectClicks = clickedShapes.filter((clicked, i) => clicked && !targetIndices.includes(i)).length

    const roundScore = correctClicks * 2 - incorrectClicks
    setScore(score + Math.max(0, roundScore))

    setTimeout(() => {
      if (currentRound < 19) {
        setCurrentRound(currentRound + 1)
        setGameData(generateRound())
        setClickedShapes(new Array(16).fill(false))
        setRoundTimeLeft(10)
        setShowResult(false)
      } else {
        handleGameComplete()
      }
    }, 2000)
  }

  const handleGameComplete = () => {
    setGameComplete(true)
    const currentProgress = Number.parseInt(localStorage.getItem("gameProgress") || "0")
    if (currentProgress === 7) {
      localStorage.setItem("gameProgress", "8")
    }
  }

  const instructions = [
    "Look at the target shape shown at the top",
    "Click on all matching shapes in the grid as fast as you can",
    "You have 10 seconds per round",
    "Correct clicks give +2 points, wrong clicks -1 point",
    "Find all targets quickly to maximize your score",
  ]

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-md"
        >
          <div className="text-6xl mb-4">⚡</div>
          <h2 className="text-3xl font-bold text-yellow-600 mb-4">Speed Master!</h2>
          <div className="text-6xl font-bold text-yellow-500 mb-4">{score}</div>
          <p className="text-gray-600 mb-6">Lightning fast! You've completed all the speed challenges!</p>
          <Button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
          >
            Back to Home
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <GameLayout
      gameTitle="Speed Clicks"
      gameIcon={<Zap className="text-yellow-500" size={32} />}
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
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-8 shadow-2xl border-4 border-yellow-400">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="text-8xl mb-4">⚡</div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Find all the {gameData.targetShape.name}s!</h2>

                  {/* Target Shape and Timer */}
                  <div className="flex justify-center items-center gap-8 mb-6">
                    <div className="bg-yellow-100 rounded-2xl p-6">
                      <h3 className="text-lg font-bold mb-2 text-yellow-700">Target:</h3>
                      <div className="text-6xl">{gameData.targetShape.emoji}</div>
                      <p className="text-yellow-600 font-medium mt-2">{gameData.targetShape.name}</p>
                    </div>

                    <div className="bg-red-100 rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Timer className="text-red-600" size={20} />
                        <span className="text-lg font-bold text-red-700">Time Left:</span>
                      </div>
                      <div className="text-4xl font-bold text-red-600">{roundTimeLeft}s</div>
                    </div>
                  </div>
                </div>

                {/* Game Grid */}
                <div className="grid grid-cols-4 gap-3 max-w-md mx-auto mb-8">
                  {gameData.grid.map((shape, index) => (
                    <motion.div
                      key={index}
                      onClick={() => handleShapeClick(index)}
                      className={`aspect-square rounded-lg border-2 flex items-center justify-center text-4xl cursor-pointer transition-all duration-200 ${
                        clickedShapes[index]
                          ? shape?.name === gameData.targetShape.name
                            ? "bg-green-200 border-green-500"
                            : "bg-red-200 border-red-500"
                          : "bg-white border-gray-300 hover:border-yellow-400 hover:scale-105"
                      }`}
                      whileHover={{ scale: clickedShapes[index] ? 1 : 1.05 }}
                      whileTap={{ scale: clickedShapes[index] ? 1 : 0.95 }}
                    >
                      {shape?.emoji || "❓"}
                    </motion.div>
                  ))}
                </div>

                {/* Progress Info */}
                <div className="text-center mb-6">
                  <p className="text-lg text-gray-600">
                    Found:{" "}
                    {
                      clickedShapes.filter(
                        (clicked, i) => clicked && gameData.grid[i]?.name === gameData.targetShape.name,
                      ).length
                    }{" "}
                    / {gameData.targetCount} {gameData.targetShape.name}s
                  </p>
                </div>

                {showResult && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                    <div className="bg-blue-100 rounded-xl p-6">
                      <div className="text-2xl font-bold text-blue-600 mb-2">Round Complete!</div>
                      <div className="text-lg text-blue-700">
                        Correct:{" "}
                        {
                          clickedShapes.filter(
                            (clicked, i) => clicked && gameData.grid[i]?.name === gameData.targetShape.name,
                          ).length
                        }{" "}
                        (+
                        {clickedShapes.filter(
                          (clicked, i) => clicked && gameData.grid[i]?.name === gameData.targetShape.name,
                        ).length * 2}{" "}
                        points)
                      </div>
                      <div className="text-lg text-blue-700">
                        Wrong:{" "}
                        {
                          clickedShapes.filter(
                            (clicked, i) => clicked && gameData.grid[i]?.name !== gameData.targetShape.name,
                          ).length
                        }{" "}
                        (-
                        {
                          clickedShapes.filter(
                            (clicked, i) => clicked && gameData.grid[i]?.name !== gameData.targetShape.name,
                          ).length
                        }{" "}
                        points)
                      </div>
                    </div>
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
