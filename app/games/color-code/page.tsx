"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Palette, RotateCcw } from "lucide-react"
import GameLayout from "@/components/game-layout"
import { useRouter } from "next/navigation"

const colors = [
  { name: "Red", value: "#EF4444", code: "red" },
  { name: "Blue", value: "#3B82F6", code: "blue" },
  { name: "Green", value: "#10B981", code: "green" },
  { name: "Yellow", value: "#F59E0B", code: "yellow" },
  { name: "Purple", value: "#8B5CF6", code: "purple" },
  { name: "Orange", value: "#F97316", code: "orange" },
  { name: "Pink", value: "#EC4899", code: "pink" },
  { name: "Teal", value: "#14B8A6", code: "teal" },
]

const generatePattern = () => {
  const patternLength = Math.floor(Math.random() * 3) + 4 // 4-6 colors
  const pattern = []
  for (let i = 0; i < patternLength; i++) {
    pattern.push(colors[Math.floor(Math.random() * colors.length)])
  }
  return pattern
}

export default function ColorCodeGame() {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [targetPattern, setTargetPattern] = useState(generatePattern())
  const [userPattern, setUserPattern] = useState<typeof colors>([])
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(900)
  const [gameComplete, setGameComplete] = useState(false)
  const [draggedColor, setDraggedColor] = useState<(typeof colors)[0] | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (timeLeft > 0 && !gameComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      handleGameComplete()
    }
  }, [timeLeft, gameComplete])

  const handleDragStart = (color: (typeof colors)[0]) => {
    setDraggedColor(color)
  }

  const handleDrop = (index: number) => {
    if (draggedColor) {
      const newPattern = [...userPattern]
      newPattern[index] = draggedColor
      setUserPattern(newPattern)
      setDraggedColor(null)
    }
  }

  const handleColorClick = (color: (typeof colors)[0]) => {
    if (userPattern.length < targetPattern.length) {
      setUserPattern([...userPattern, color])
    }
  }

  const removeColor = (index: number) => {
    const newPattern = userPattern.filter((_, i) => i !== index)
    setUserPattern(newPattern)
  }

  const checkPattern = () => {
    if (userPattern.length !== targetPattern.length) return

    const isCorrect = userPattern.every((color, index) => color.code === targetPattern[index].code)

    setShowResult(true)

    if (isCorrect) {
      setScore(score + 5)
    } else {
      setScore(Math.max(0, score - 2))
    }

    setTimeout(() => {
      if (currentLevel < 19) {
        setCurrentLevel(currentLevel + 1)
        setTargetPattern(generatePattern())
        setUserPattern([])
        setShowResult(false)
      } else {
        handleGameComplete()
      }
    }, 2000)
  }

  const resetPattern = () => {
    setUserPattern([])
  }

  const handleGameComplete = () => {
    setGameComplete(true)
    const currentProgress = Number.parseInt(localStorage.getItem("gameProgress") || "0")
    if (currentProgress === 3) {
      localStorage.setItem("gameProgress", "4")
    }
  }

  const instructions = [
    "Look at the target color pattern shown at the top",
    "Drag and drop colors to match the pattern exactly",
    "You can also click colors to add them in sequence",
    "Click on placed colors to remove them",
    "Match the pattern perfectly to score points",
  ]

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-md"
        >
          <div className="text-6xl mb-4">🎨</div>
          <h2 className="text-3xl font-bold text-pink-600 mb-4">Color Master!</h2>
          <div className="text-6xl font-bold text-yellow-500 mb-4">{score}</div>
          <p className="text-gray-600 mb-6">Fantastic! You've mastered all the color patterns!</p>
          <Button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
          >
            Back to Home
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <GameLayout
      gameTitle="Color Code"
      gameIcon={<Palette className="text-pink-500" size={32} />}
      instructions={instructions}
      onGameComplete={handleGameComplete}
      currentQuestion={currentLevel + 1}
      totalQuestions={20}
      score={score}
      timeLeft={timeLeft}
    >
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentLevel}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mb-8 shadow-2xl border-4 border-pink-400">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">🎨</div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Match the Color Pattern!</h2>
                </div>

                {/* Target Pattern */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-center mb-4 text-gray-700">Target Pattern:</h3>
                  <div className="flex justify-center gap-2 mb-4">
                    {targetPattern.map((color, index) => (
                      <motion.div
                        key={index}
                        className="w-16 h-16 rounded-lg shadow-lg border-4 border-white"
                        style={{ backgroundColor: color.value }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.1,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatDelay: 2,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* User Pattern Area */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-700">Your Pattern:</h3>
                    <Button
                      onClick={resetPattern}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <RotateCcw size={16} />
                      Reset
                    </Button>
                  </div>

                  <div className="flex justify-center gap-2 mb-4 min-h-[80px] bg-gray-100 rounded-lg p-4 border-2 border-dashed border-gray-300">
                    {Array.from({ length: targetPattern.length }, (_, index) => (
                      <div
                        key={index}
                        className="w-16 h-16 rounded-lg border-2 border-gray-400 bg-white flex items-center justify-center cursor-pointer hover:border-pink-400 transition-colors"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDrop(index)}
                        onClick={() => userPattern[index] && removeColor(index)}
                        style={{
                          backgroundColor: userPattern[index]?.value || "white",
                        }}
                      >
                        {!userPattern[index] && <span className="text-gray-400 text-sm">Drop</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Color Palette */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-center mb-4 text-gray-700">Color Palette:</h3>
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-4 justify-center">
                    {colors.map((color, index) => (
                      <motion.div
                        key={index}
                        className="w-12 h-12 rounded-lg shadow-lg border-2 border-white cursor-pointer hover:scale-110 transition-transform"
                        style={{ backgroundColor: color.value }}
                        draggable
                        onDragStart={() => handleDragStart(color)}
                        onClick={() => handleColorClick(color)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                {!showResult && (
                  <div className="text-center">
                    <Button
                      onClick={checkPattern}
                      disabled={userPattern.length !== targetPattern.length}
                      className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 text-xl"
                    >
                      Check Pattern! 🎨
                    </Button>
                  </div>
                )}

                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    {userPattern.every((color, index) => color.code === targetPattern[index].code) ? (
                      <div className="text-green-600 font-bold text-2xl">🎉 Perfect Match! +5 points</div>
                    ) : (
                      <div className="text-red-600 font-bold text-2xl">😔 Not quite right! -2 points</div>
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
