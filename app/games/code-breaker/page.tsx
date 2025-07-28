"use client"

import { useState, useEffect } from "react"
import { GameLayout } from "@/components/game-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface CodePattern {
  code: string
  hints: string[]
  difficulty: number
}

const CODE_PATTERNS: CodePattern[] = [
  {
    code: "ALPHA",
    hints: ["First letter of Greek alphabet", "Leader of a pack", "Version 1.0"],
    difficulty: 1,
  },
  {
    code: "BINARY",
    hints: ["Base 2 number system", "0 and 1", "Computer language"],
    difficulty: 2,
  },
  {
    code: "CIPHER",
    hints: ["Secret code", "Encryption method", "Hidden message"],
    difficulty: 3,
  },
  {
    code: "DECODE",
    hints: ["Reverse of encode", "Crack the code", "Reveal hidden meaning"],
    difficulty: 4,
  },
  {
    code: "ENIGMA",
    hints: ["WWII encryption machine", "Mystery", "German code device"],
    difficulty: 5,
  },
]

export default function CodeBreakerGame() {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [userInput, setUserInput] = useState("")
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(240) // 4 minutes
  const [gameStarted, setGameStarted] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [maxAttempts] = useState(3)
  const [showHint, setShowHint] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameOver) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
      return () => clearInterval(timer)
    }
  }, [gameStarted, timeLeft, gameOver])

  const startGame = () => {
    setGameStarted(true)
    setCurrentLevel(0)
    setScore(0)
    setTimeLeft(240)
    setAttempts(0)
    setShowHint(0)
    setUserInput("")
    setGameOver(false)
  }

  const submitCode = () => {
    const currentPattern = CODE_PATTERNS[currentLevel]

    if (userInput.toUpperCase() === currentPattern.code) {
      // Correct answer
      const bonusPoints = Math.max(100 - attempts * 20 - showHint * 10, 20)
      setScore((prev) => prev + bonusPoints)

      if (currentLevel < CODE_PATTERNS.length - 1) {
        setCurrentLevel((prev) => prev + 1)
        setUserInput("")
        setAttempts(0)
        setShowHint(0)
      } else {
        setGameOver(true)
        // Update progress in localStorage
        const progress = JSON.parse(localStorage.getItem("gameProgress") || "{}")
        progress[11] = { completed: true, score, timestamp: Date.now() }
        localStorage.setItem("gameProgress", JSON.stringify(progress))
      }
    } else {
      setAttempts((prev) => prev + 1)
      if (attempts + 1 >= maxAttempts) {
        setGameOver(true)
      }
    }
  }

  const getHint = () => {
    if (showHint < CODE_PATTERNS[currentLevel].hints.length) {
      setShowHint((prev) => prev + 1)
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
        title="Code Breaker"
        level={11}
        onStart={startGame}
        description="Crack encrypted codes using cryptographic clues"
      >
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Code Breaker Challenge</h2>
          <p className="text-gray-600">Decrypt secret codes using hints and logic</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-bold">Cryptography</h3>
                <p className="text-sm text-gray-600">Learn code-breaking techniques</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-bold">Progressive Difficulty</h3>
                <p className="text-sm text-gray-600">5 levels of increasing complexity</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-bold">Hint System</h3>
                <p className="text-sm text-gray-600">Get clues when stuck</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </GameLayout>
    )
  }

  if (gameOver) {
    return (
      <GameLayout
        title="Code Breaker"
        level={11}
        onStart={startGame}
        description="Crack encrypted codes using cryptographic clues"
      >
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Game Over!</h2>
          <p className="text-xl">Final Score: {score}</p>
          <p className="text-gray-600">
            {currentLevel === CODE_PATTERNS.length - 1
              ? "Congratulations! You cracked all codes!"
              : "Better luck next time!"}
          </p>
          <Button onClick={startGame} size="lg">
            Play Again
          </Button>
        </div>
      </GameLayout>
    )
  }

  const currentPattern = CODE_PATTERNS[currentLevel]

  return (
    <GameLayout
      title="Code Breaker"
      level={11}
      onStart={startGame}
      description="Crack encrypted codes using cryptographic clues"
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Game Header */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Badge variant="outline">
              Level {currentLevel + 1}/{CODE_PATTERNS.length}
            </Badge>
            <Badge variant="outline">Score: {score}</Badge>
            <Badge variant={timeLeft < 60 ? "destructive" : "outline"}>Time: {formatTime(timeLeft)}</Badge>
          </div>
          <Badge variant="secondary">
            Attempts: {attempts}/{maxAttempts}
          </Badge>
        </div>

        {/* Code Display */}
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-bold mb-4">Encrypted Code:</h3>
            <div className="text-4xl font-mono tracking-widest bg-gray-100 p-4 rounded-lg">
              {"*".repeat(currentPattern.code.length)}
            </div>
            <p className="text-sm text-gray-600 mt-2">{currentPattern.code.length} characters</p>
          </CardContent>
        </Card>

        {/* Hints */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Hints:</h3>
              <Button variant="outline" onClick={getHint} disabled={showHint >= currentPattern.hints.length}>
                Get Hint ({showHint}/{currentPattern.hints.length})
              </Button>
            </div>
            <div className="space-y-2">
              {currentPattern.hints.slice(0, showHint).map((hint, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge variant="outline">{index + 1}</Badge>
                  <span>{hint}</span>
                </div>
              ))}
              {showHint === 0 && <p className="text-gray-500 italic">Click "Get Hint" for clues</p>}
            </div>
          </CardContent>
        </Card>

        {/* Input */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4">Enter Code:</h3>
            <div className="flex gap-4">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value.toUpperCase())}
                placeholder="Enter your answer..."
                className="text-lg font-mono"
                maxLength={currentPattern.code.length}
                onKeyPress={(e) => e.key === "Enter" && submitCode()}
              />
              <Button onClick={submitCode} size="lg">
                Submit
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-2">Remaining attempts: {maxAttempts - attempts}</p>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  )
}
