"use client"

import { useState, useEffect } from "react"
import { GameLayout } from "@/components/game-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface LogicPuzzle {
  id: number
  clues: string[]
  grid: string[][]
  solution: number[][]
  difficulty: "medium" | "hard" | "expert"
}

const LOGIC_PUZZLES: LogicPuzzle[] = [
  {
    id: 1,
    clues: [
      "Red is not in position 1 or 3",
      "Blue is immediately left of Green",
      "Yellow is in an odd position",
      "Green is not adjacent to Red",
    ],
    grid: [["?", "?", "?", "?"]],
    solution: [[2, 1, 3, 0]], // Yellow, Blue, Green, Red
    difficulty: "medium",
  },
  {
    id: 2,
    clues: [
      "Person A lives in house 2 or 4",
      "The red house is between blue and green",
      "Person B doesn't live in house 1",
      "Green house is not at the end",
    ],
    grid: [
      ["?", "?", "?", "?"],
      ["?", "?", "?", "?"],
    ],
    solution: [
      [1, 0, 2, 3],
      [3, 1, 0, 2],
    ], // Houses and People
    difficulty: "hard",
  },
]

export default function MasterLogicGame() {
  const [currentPuzzle, setCurrentPuzzle] = useState(0)
  const [userSolution, setUserSolution] = useState<number[][]>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [gameStarted, setGameStarted] = useState(false)
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [availableOptions] = useState(["Red", "Blue", "Green", "Yellow"])

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
      return () => clearInterval(timer)
    }
  }, [gameStarted, timeLeft])

  const startGame = () => {
    setGameStarted(true)
    setCurrentPuzzle(0)
    setScore(0)
    setTimeLeft(300)
    initializeSolution()
  }

  const initializeSolution = () => {
    const puzzle = LOGIC_PUZZLES[currentPuzzle]
    setUserSolution(puzzle.grid.map((row) => row.map(() => -1)))
  }

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col })
  }

  const handleOptionSelect = (optionIndex: number) => {
    if (!selectedCell) return

    const newSolution = [...userSolution]
    newSolution[selectedCell.row][selectedCell.col] = optionIndex
    setUserSolution(newSolution)
    setSelectedCell(null)
  }

  const checkSolution = () => {
    const puzzle = LOGIC_PUZZLES[currentPuzzle]
    const isCorrect = JSON.stringify(userSolution) === JSON.stringify(puzzle.solution)

    if (isCorrect) {
      setScore((prev) => prev + (puzzle.difficulty === "expert" ? 300 : puzzle.difficulty === "hard" ? 200 : 100))
      if (currentPuzzle < LOGIC_PUZZLES.length - 1) {
        setCurrentPuzzle((prev) => prev + 1)
        initializeSolution()
      } else {
        alert(`Congratulations! Final Score: ${score + 100}`)
      }
    } else {
      alert("Incorrect solution. Try again!")
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!gameStarted) {
    return (
      <GameLayout
        title="Master Logic"
        level={10}
        onStart={startGame}
        description="Solve complex logic puzzles using deductive reasoning"
      >
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Master Logic Challenge</h2>
          <p className="text-gray-600">Use clues to solve logical deduction puzzles</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-bold">Deductive Reasoning</h3>
                <p className="text-sm text-gray-600">Use logical clues to find solutions</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-bold">Multiple Puzzles</h3>
                <p className="text-sm text-gray-600">Increasing difficulty levels</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-bold">Time Challenge</h3>
                <p className="text-sm text-gray-600">5 minutes to solve all puzzles</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </GameLayout>
    )
  }

  const puzzle = LOGIC_PUZZLES[currentPuzzle]

  return (
    <GameLayout
      title="Master Logic"
      level={10}
      onStart={startGame}
      description="Solve complex logic puzzles using deductive reasoning"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Game Header */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Badge variant="outline">
              Puzzle {currentPuzzle + 1}/{LOGIC_PUZZLES.length}
            </Badge>
            <Badge variant="outline">Score: {score}</Badge>
            <Badge variant={timeLeft < 60 ? "destructive" : "outline"}>Time: {formatTime(timeLeft)}</Badge>
          </div>
          <Badge variant="secondary">{puzzle.difficulty.toUpperCase()}</Badge>
        </div>

        {/* Clues */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4">Clues:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {puzzle.clues.map((clue, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge variant="outline">{index + 1}</Badge>
                  <span className="text-sm">{clue}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Logic Grid */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4">Logic Grid:</h3>
            <div className="space-y-4">
              {userSolution.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-2 justify-center">
                  {row.map((cell, colIndex) => (
                    <Button
                      key={colIndex}
                      variant={selectedCell?.row === rowIndex && selectedCell?.col === colIndex ? "default" : "outline"}
                      className="w-20 h-20 text-sm"
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                    >
                      {cell >= 0 ? availableOptions[cell] : "?"}
                    </Button>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Options */}
        {selectedCell && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">Select Option:</h3>
              <div className="flex gap-2 justify-center">
                {availableOptions.map((option, index) => (
                  <Button key={index} variant="outline" onClick={() => handleOptionSelect(index)} className="w-20">
                    {option}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Button onClick={checkSolution} size="lg">
            Check Solution
          </Button>
          <Button variant="outline" onClick={initializeSolution} size="lg">
            Reset Grid
          </Button>
        </div>
      </div>
    </GameLayout>
  )
}
