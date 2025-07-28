"use client"

import { useState, useEffect } from "react"
import { GameLayout } from "@/components/game-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface QuantumProblem {
  id: number
  question: string
  type: "probability" | "superposition" | "entanglement" | "measurement"
  answer: number
  explanation: string
  difficulty: number
}

const QUANTUM_PROBLEMS: QuantumProblem[] = [
  {
    id: 1,
    question:
      "A quantum bit (qubit) in superposition has equal probability of being 0 or 1. What is the probability of measuring 0? (Enter as decimal)",
    type: "probability",
    answer: 0.5,
    explanation: "In equal superposition, P(0) = P(1) = 0.5",
    difficulty: 1,
  },
  {
    id: 2,
    question: "If a qubit has amplitude √(3/4) for |0⟩ and √(1/4) for |1⟩, what is the probability of measuring 1?",
    type: "superposition",
    answer: 0.25,
    explanation: "Probability = |amplitude|² = (√(1/4))² = 1/4 = 0.25",
    difficulty: 2,
  },
  {
    id: 3,
    question:
      "Two entangled qubits are in the Bell state |00⟩ + |11⟩. If the first qubit measures 0, what's the probability the second is 0?",
    type: "entanglement",
    answer: 1,
    explanation: "In this Bell state, measuring 0 on first qubit guarantees 0 on second",
    difficulty: 3,
  },
  {
    id: 4,
    question: "A quantum system has 8 equally likely states. What is the minimum number of qubits needed?",
    type: "measurement",
    answer: 3,
    explanation: "2³ = 8 states, so 3 qubits are needed",
    difficulty: 2,
  },
  {
    id: 5,
    question: "If |ψ⟩ = (1/√5)|0⟩ + (2/√5)|1⟩, what is P(measuring 1)? (Round to 2 decimal places)",
    type: "superposition",
    answer: 0.8,
    explanation: "P(1) = |2/√5|² = 4/5 = 0.8",
    difficulty: 4,
  },
]

export default function QuantumMathGame() {
  const [currentProblem, setCurrentProblem] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [gameStarted, setGameStarted] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [answered, setAnswered] = useState(false)
  const [streak, setStreak] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameOver) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
      return () => clearInterval(timer)
    }
  }, [gameStarted, timeLeft, gameOver])

  const startGame = () => {
    setGameStarted(true)
    setCurrentProblem(0)
    setScore(0)
    setTimeLeft(300)
    setUserAnswer("")
    setShowExplanation(false)
    setAnswered(false)
    setStreak(0)
    setGameOver(false)
  }

  const submitAnswer = () => {
    const problem = QUANTUM_PROBLEMS[currentProblem]
    const userNum = Number.parseFloat(userAnswer)
    const isCorrect = Math.abs(userNum - problem.answer) < 0.01 // Allow small rounding errors

    if (isCorrect) {
      const points = problem.difficulty * 50 + streak * 10
      setScore((prev) => prev + points)
      setStreak((prev) => prev + 1)
    } else {
      setStreak(0)
    }

    setAnswered(true)
    setShowExplanation(true)
  }

  const nextProblem = () => {
    if (currentProblem < QUANTUM_PROBLEMS.length - 1) {
      setCurrentProblem((prev) => prev + 1)
      setUserAnswer("")
      setShowExplanation(false)
      setAnswered(false)
    } else {
      setGameOver(true)
      // Update progress in localStorage
      const progress = JSON.parse(localStorage.getItem("gameProgress") || "{}")
      progress[12] = { completed: true, score, timestamp: Date.now() }
      localStorage.setItem("gameProgress", JSON.stringify(progress))
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "probability":
        return "bg-blue-100 text-blue-800"
      case "superposition":
        return "bg-purple-100 text-purple-800"
      case "entanglement":
        return "bg-green-100 text-green-800"
      case "measurement":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!gameStarted) {
    return (
      <GameLayout
        title="Quantum Math"
        level={12}
        onStart={startGame}
        description="Solve quantum mechanics probability problems"
      >
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Quantum Mathematics</h2>
          <p className="text-gray-600">Master quantum probability and superposition calculations</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-bold">Quantum Concepts</h3>
                <p className="text-sm text-gray-600">Probability, superposition, entanglement</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-bold">Mathematical Precision</h3>
                <p className="text-sm text-gray-600">Exact calculations required</p>
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
        title="Quantum Math"
        level={12}
        onStart={startGame}
        description="Solve quantum mechanics probability problems"
      >
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Quantum Mastery Complete!</h2>
          <p className="text-xl">Final Score: {score}</p>
          <p className="text-gray-600">You've mastered quantum mathematics!</p>
          <Button onClick={startGame} size="lg">
            Play Again
          </Button>
        </div>
      </GameLayout>
    )
  }

  const problem = QUANTUM_PROBLEMS[currentProblem]

  return (
    <GameLayout
      title="Quantum Math"
      level={12}
      onStart={startGame}
      description="Solve quantum mechanics probability problems"
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Game Header */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Badge variant="outline">
              Problem {currentProblem + 1}/{QUANTUM_PROBLEMS.length}
            </Badge>
            <Badge variant="outline">Score: {score}</Badge>
            <Badge variant={timeLeft < 60 ? "destructive" : "outline"}>Time: {formatTime(timeLeft)}</Badge>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">Streak: {streak}</Badge>
            <Badge className={getTypeColor(problem.type)}>{problem.type.toUpperCase()}</Badge>
          </div>
        </div>

        {/* Problem */}
        <Card>
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold">Quantum Problem:</h3>
              <Badge variant="outline">Difficulty: {problem.difficulty}/5</Badge>
            </div>
            <p className="text-lg mb-6 leading-relaxed">{problem.question}</p>

            {!answered && (
              <div className="flex gap-4">
                <Input
                  type="number"
                  step="0.01"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Enter your answer..."
                  className="text-lg"
                  onKeyPress={(e) => e.key === "Enter" && submitAnswer()}
                />
                <Button onClick={submitAnswer} size="lg" disabled={!userAnswer}>
                  Submit
                </Button>
              </div>
            )}

            {showExplanation && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant={
                      Math.abs(Number.parseFloat(userAnswer) - problem.answer) < 0.01 ? "default" : "destructive"
                    }
                  >
                    {Math.abs(Number.parseFloat(userAnswer) - problem.answer) < 0.01 ? "Correct!" : "Incorrect"}
                  </Badge>
                  <span className="font-bold">Answer: {problem.answer}</span>
                </div>
                <p className="text-sm text-gray-700">{problem.explanation}</p>
                <Button onClick={nextProblem} className="mt-4">
                  {currentProblem < QUANTUM_PROBLEMS.length - 1 ? "Next Problem" : "Finish"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quantum Formulas Reference */}
        <Card>
          <CardContent className="p-4">
            <h4 className="font-bold mb-2">Quick Reference:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>• Probability = |amplitude|²</div>
              <div>• n qubits = 2ⁿ states</div>
              <div>• Normalization: Σ|aᵢ|² = 1</div>
              <div>• Bell states: entangled pairs</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  )
}
