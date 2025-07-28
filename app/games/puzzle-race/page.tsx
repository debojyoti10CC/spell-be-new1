"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Puzzle, RotateCcw } from "lucide-react"
import GameLayout from "@/components/game-layout"
import { useRouter } from "next/navigation"

const puzzleImages = [
  { emoji: "🌈", name: "Rainbow", pieces: ["🔴", "🟠", "🟡", "🟢", "🔵", "🟣"] },
  { emoji: "🏠", name: "House", pieces: ["🟫", "🔺", "🟨", "🚪", "🪟", "🌳"] },
  { emoji: "🚗", name: "Car", pieces: ["🔵", "⚫", "⚫", "🟨", "🪟", "🚪"] },
  { emoji: "🌸", name: "Flower", pieces: ["🌸", "🟢", "🟫", "☀️", "💧", "🦋"] },
  { emoji: "🎂", name: "Cake", pieces: ["🟤", "🟨", "🍓", "🕯️", "🎈", "🎉"] },
]

const shuffleArray = (array: string[]) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function PuzzleRaceGame() {
  const [currentPuzzle, setCurrentPuzzle] = useState(0)
  const [puzzlePieces, setPuzzlePieces] = useState<string[]>([])
  const [userArrangement, setUserArrangement] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(900)
  const [gameComplete, setGameComplete] = useState(false)
  const [draggedPiece, setDraggedPiece] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    initializePuzzle()
  }, [currentPuzzle])

  useEffect(() => {
    if (timeLeft > 0 && !gameComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      handleGameComplete()
    }
  }, [timeLeft, gameComplete])

  const initializePuzzle = () => {
    const puzzle = puzzleImages[currentPuzzle % puzzleImages.length]
    const shuffled = shuffleArray(puzzle.pieces)
    setPuzzlePieces(shuffled)
    setUserArrangement(new Array(puzzle.pieces.length).fill(""))
  }

  const handleDragStart = (piece: string) => {
    setDraggedPiece(piece)
  }

  const handleDrop = (index: number) => {
    if (draggedPiece) {
      const newArrangement = [...userArrangement]
      newArrangement[index] = draggedPiece
      setUserArrangement(newArrangement)

      // Remove piece from available pieces
      const newPieces = puzzlePieces.filter((p) => p !== draggedPiece)
      setPuzzlePieces(newPieces)
      setDraggedPiece(null)
    }
  }

  const handlePieceClick = (piece: string) => {
    const emptyIndex = userArrangement.findIndex((p) => p === "")
    if (emptyIndex !== -1) {
      const newArrangement = [...userArrangement]
      newArrangement[emptyIndex] = piece
      setUserArrangement(newArrangement)

      const newPieces = puzzlePieces.filter((p) => p !== piece)
      setPuzzlePieces(newPieces)
    }
  }

  const removePiece = (index: number) => {
    const piece = userArrangement[index]
    if (piece) {
      const newArrangement = [...userArrangement]
      newArrangement[index] = ""
      setUserArrangement(newArrangement)
      setPuzzlePieces([...puzzlePieces, piece])
    }
  }

  const resetPuzzle = () => {
    initializePuzzle()
  }

  const checkSolution = () => {
    const puzzle = puzzleImages[currentPuzzle % puzzleImages.length]
    const isCorrect = userArrangement.every((piece, index) => piece === puzzle.pieces[index])

    setShowResult(true)

    if (isCorrect) {
      setScore(score + 5)
    } else {
      setScore(Math.max(0, score - 2))
    }

    setTimeout(() => {
      if (currentPuzzle < 19) {
        setCurrentPuzzle(currentPuzzle + 1)
        setShowResult(false)
      } else {
        handleGameComplete()
      }
    }, 2000)
  }

  const handleGameComplete = () => {
    setGameComplete(true)
    const currentProgress = Number.parseInt(localStorage.getItem("gameProgress") || "0")
    if (currentProgress === 5) {
      localStorage.setItem("gameProgress", "6")
    }
  }

  const instructions = [
    "Look at the target image shown at the top",
    "Drag and drop puzzle pieces to recreate the image",
    "You can also click pieces to place them in order",
    "Click on placed pieces to remove them",
    "Arrange all pieces correctly to complete the puzzle",
  ]

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-md"
        >
          <div className="text-6xl mb-4">🧩</div>
          <h2 className="text-3xl font-bold text-orange-600 mb-4">Puzzle Master!</h2>
          <div className="text-6xl font-bold text-yellow-500 mb-4">{score}</div>
          <p className="text-gray-600 mb-6">Excellent! You've solved all the puzzles!</p>
          <Button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            Back to Home
          </Button>
        </motion.div>
      </div>
    )
  }

  const puzzle = puzzleImages[currentPuzzle % puzzleImages.length]

  return (
    <GameLayout
      gameTitle="Puzzle Race"
      gameIcon={<Puzzle className="text-orange-500" size={32} />}
      instructions={instructions}
      onGameComplete={handleGameComplete}
      currentQuestion={currentPuzzle + 1}
      totalQuestions={20}
      score={score}
      timeLeft={timeLeft}
    >
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPuzzle}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mb-8 shadow-2xl border-4 border-orange-400">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="text-8xl mb-4">🧩</div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Recreate the {puzzle.name}!</h2>

                  {/* Target Image */}
                  <div className="bg-orange-100 rounded-2xl p-6 mb-6">
                    <h3 className="text-lg font-bold mb-4 text-orange-700">Target:</h3>
                    <div className="text-8xl">{puzzle.emoji}</div>
                    <p className="text-orange-600 font-medium mt-2">{puzzle.name}</p>
                  </div>
                </div>

                {/* User Puzzle Area */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-700">Your Puzzle:</h3>
                    <Button
                      onClick={resetPuzzle}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <RotateCcw size={16} />
                      Reset
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 bg-gray-100 rounded-lg p-6 mb-6">
                    {userArrangement.map((piece, index) => (
                      <div
                        key={index}
                        className="aspect-square bg-white border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-4xl cursor-pointer hover:border-orange-400 transition-colors"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDrop(index)}
                        onClick={() => piece && removePiece(index)}
                      >
                        {piece || <span className="text-gray-400 text-sm">Drop</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Available Pieces */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-center mb-4 text-gray-700">Available Pieces:</h3>
                  <div className="flex flex-wrap justify-center gap-4">
                    {puzzlePieces.map((piece, index) => (
                      <motion.div
                        key={`${piece}-${index}`}
                        className="w-16 h-16 bg-white border-2 border-orange-300 rounded-lg flex items-center justify-center text-3xl cursor-pointer hover:border-orange-500 hover:scale-110 transition-all shadow-lg"
                        draggable
                        onDragStart={() => handleDragStart(piece)}
                        onClick={() => handlePieceClick(piece)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {piece}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Check Solution Button */}
                {!showResult && puzzlePieces.length === 0 && (
                  <div className="text-center">
                    <Button
                      onClick={checkSolution}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-xl"
                    >
                      Check Puzzle! 🧩
                    </Button>
                  </div>
                )}

                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    {userArrangement.every((piece, index) => piece === puzzle.pieces[index]) ? (
                      <div className="text-green-600 font-bold text-2xl">🎉 Perfect! +5 points</div>
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
