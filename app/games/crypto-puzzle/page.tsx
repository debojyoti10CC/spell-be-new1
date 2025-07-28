"use client"

import { useState, useEffect } from "react"
import { GameLayout } from "@/components/game-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface CryptoPuzzle {
  id: number
  name: string
  type: "hash" | "blockchain" | "mining" | "wallet" | "smart-contract"
  description: string
  puzzle: string
  answer: string
  hint: string
  difficulty: number
  explanation: string
}

const CRYPTO_PUZZLES: CryptoPuzzle[] = [
  {
    id: 1,
    name: "Hash Function Basics",
    type: "hash",
    description: "Understanding cryptographic hash functions",
    puzzle:
      "If SHA-256('hello') = 2cf24dba4f21d4288094e9b9b6e313c4496e93c0b8e4c5b4c0b3e6c8a9b2c3d4, what property ensures that changing 'hello' to 'Hello' produces a completely different hash?",
    answer: "avalanche effect",
    hint: "This property means small input changes cause large output changes",
    difficulty: 1,
    explanation:
      "The avalanche effect ensures that even tiny changes in input produce drastically different hash outputs, making hashes unpredictable and secure.",
  },
  {
    id: 2,
    name: "Blockchain Structure",
    type: "blockchain",
    description: "Understanding how blocks are linked together",
    puzzle:
      "In a blockchain, each block contains the hash of the previous block. If Block 3 has hash 'ABC123' and Block 4 contains 'ABC123' in its header, what happens if someone tries to change data in Block 3?",
    answer: "chain breaks",
    hint: "Think about what happens to Block 3's hash when its data changes",
    difficulty: 2,
    explanation:
      "Changing Block 3's data would change its hash from 'ABC123' to something else, breaking the link to Block 4 and making the tampering detectable.",
  },
  {
    id: 3,
    name: "Mining Difficulty",
    type: "mining",
    description: "Understanding proof-of-work mining",
    puzzle:
      "A miner needs to find a nonce that makes the block hash start with '0000'. If the current hash is 'A1B2C3D4...', what must the miner do?",
    answer: "increment nonce",
    hint: "Miners try different values until they find the right one",
    difficulty: 3,
    explanation:
      "Miners increment the nonce value and recalculate the hash repeatedly until they find a hash that meets the difficulty requirement (starts with required zeros).",
  },
  {
    id: 4,
    name: "Wallet Security",
    type: "wallet",
    description: "Understanding cryptocurrency wallet security",
    puzzle:
      "Alice has a private key: 5KJvsngHeMpm884wtkJNzQGaCErckhHJBGFsvd3VyK5qMZXj3hS. She derives a public key and then an address. If she loses her private key but remembers her address, can she recover her funds?",
    answer: "no",
    hint: "Think about the relationship between private keys and fund control",
    difficulty: 4,
    explanation:
      "Without the private key, Alice cannot sign transactions to spend her funds. The address alone is not sufficient - the private key is required to prove ownership and authorize transactions.",
  },
  {
    id: 5,
    name: "Smart Contract Logic",
    type: "smart-contract",
    description: "Understanding smart contract execution",
    puzzle:
      "A smart contract has this condition: 'if (balance >= 100 && timestamp > deadline) { transfer(amount); }'. The balance is 150, amount is 50, but the deadline hasn't passed. What happens?",
    answer: "no transfer",
    hint: "Both conditions must be true for the transfer to execute",
    difficulty: 5,
    explanation:
      "The transfer won't execute because although balance >= 100 is true, timestamp > deadline is false. In smart contracts, ALL conditions in an AND statement must be true.",
  },
]

export default function CryptoPuzzleGame() {
  const [currentPuzzle, setCurrentPuzzle] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(450) // 7.5 minutes
  const [gameStarted, setGameStarted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [answered, setAnswered] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameOver) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
      return () => clearInterval(timer)
    }
  }, [gameStarted, timeLeft, gameOver])

  const startGame = () => {
    setGameStarted(true)
    setCurrentPuzzle(0)
    setScore(0)
    setTimeLeft(450)
    setUserAnswer("")
    setShowHint(false)
    setShowExplanation(false)
    setAnswered(false)
    setGameOver(false)
    setAttempts(0)
  }

  const submitAnswer = () => {
    const puzzle = CRYPTO_PUZZLES[currentPuzzle]
    const isCorrect = userAnswer.toLowerCase().trim() === puzzle.answer.toLowerCase()

    setAttempts((prev) => prev + 1)

    if (isCorrect) {
      const basePoints = puzzle.difficulty * 100
      const attemptPenalty = attempts * 10
      const hintPenalty = showHint ? 25 : 0
      const finalPoints = Math.max(basePoints - attemptPenalty - hintPenalty, 25)

      setScore((prev) => prev + finalPoints)
      setAnswered(true)
      setShowExplanation(true)
    } else {
      if (attempts >= 2) {
        setAnswered(true)
        setShowExplanation(true)
      } else {
        alert(`Incorrect. ${3 - attempts - 1} attempts remaining.`)
      }
    }
  }

  const nextPuzzle = () => {
    if (currentPuzzle < CRYPTO_PUZZLES.length - 1) {
      setCurrentPuzzle((prev) => prev + 1)
      setUserAnswer("")
      setShowHint(false)
      setShowExplanation(false)
      setAnswered(false)
      setAttempts(0)
    } else {
      setGameOver(true)
      // Update progress in localStorage
      const progress = JSON.parse(localStorage.getItem("gameProgress") || "{}")
      progress[18] = { completed: true, score, timestamp: Date.now() }
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
      case "hash":
        return "bg-blue-100 text-blue-800"
      case "blockchain":
        return "bg-green-100 text-green-800"
      case "mining":
        return "bg-yellow-100 text-yellow-800"
      case "wallet":
        return "bg-purple-100 text-purple-800"
      case "smart-contract":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!gameStarted) {
    return (
      <GameLayout
        title="Crypto Puzzle"
        level={18}
        onStart={startGame}
        description="Master cryptocurrency and blockchain technology concepts"
      >
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Crypto Puzzle Challenge</h2>
          <p className="text-gray-600">Solve puzzles about blockchain, cryptocurrency, and cryptography</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-bold">Blockchain Technology</h3>
                <p className="text-sm text-gray-600">Understand distributed ledgers</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-bold">Cryptography</h3>
                <p className="text-sm text-gray-600">Hash functions and security</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-bold">Smart Contracts</h3>
                <p className="text-sm text-gray-600">Programmable money logic</p>
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
        title="Crypto Puzzle"
        level={18}
        onStart={startGame}
        description="Master cryptocurrency and blockchain technology concepts"
      >
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Crypto Master!</h2>
          <p className="text-xl">Final Score: {score}</p>
          <p className="text-gray-600">You've mastered the fundamentals of cryptocurrency and blockchain!</p>
          <Button onClick={startGame} size="lg">
            Solve Again
          </Button>
        </div>
      </GameLayout>
    )
  }

  const puzzle = CRYPTO_PUZZLES[currentPuzzle]

  return (
    <GameLayout
      title="Crypto Puzzle"
      level={18}
      onStart={startGame}
      description="Master cryptocurrency and blockchain technology concepts"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Game Header */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Badge variant="outline">
              Puzzle {currentPuzzle + 1}/{CRYPTO_PUZZLES.length}
            </Badge>
            <Badge variant="outline">Score: {score}</Badge>
            <Badge variant={timeLeft < 60 ? "destructive" : "outline"}>Time: {formatTime(timeLeft)}</Badge>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">Attempts: {attempts}/3</Badge>
            <Badge className={getTypeColor(puzzle.type)}>{puzzle.type.replace("-", " ").toUpperCase()}</Badge>
          </div>
        </div>

        {/* Puzzle Card */}
        <Card>
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold">{puzzle.name}</h3>
              <Badge variant="outline">Difficulty: {puzzle.difficulty}/5</Badge>
            </div>

            <p className="text-gray-600 mb-6">{puzzle.description}</p>

            <div className="p-6 bg-blue-50 rounded-lg mb-6">
              <h4 className="font-bold text-blue-800 mb-3">Puzzle:</h4>
              <p className="text-blue-700 leading-relaxed">{puzzle.puzzle}</p>
            </div>

            {showHint && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
                <h4 className="font-bold text-yellow-800 mb-2">Hint:</h4>
                <p className="text-yellow-700">{puzzle.hint}</p>
              </div>
            )}

            {/* Answer Input */}
            {!answered && (
              <div className="space-y-4">
                <h4 className="font-bold">Your Answer:</h4>
                <Input
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Enter your answer..."
                  className="text-lg"
                  onKeyPress={(e) => e.key === "Enter" && submitAnswer()}
                />
                <div className="flex gap-4">
                  <Button onClick={submitAnswer} disabled={!userAnswer.trim()} size="lg">
                    Submit Answer
                  </Button>
                  <Button variant="outline" onClick={() => setShowHint(true)} disabled={showHint} size="lg">
                    Show Hint (-25 points)
                  </Button>
                </div>
              </div>
            )}

            {/* Explanation */}
            {showExplanation && (
              <div className="mt-6 p-6 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Badge
                    variant={
                      userAnswer.toLowerCase().trim() === puzzle.answer.toLowerCase() ? "default" : "destructive"
                    }
                  >
                    {userAnswer.toLowerCase().trim() === puzzle.answer.toLowerCase() ? "Correct!" : "Incorrect"}
                  </Badge>
                  <span className="font-bold">Correct Answer: {puzzle.answer}</span>
                </div>
                <p className="text-gray-700 mb-4">{puzzle.explanation}</p>
                <Button onClick={nextPuzzle} size="lg">
                  {currentPuzzle < CRYPTO_PUZZLES.length - 1 ? "Next Puzzle" : "Finish"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Crypto Concepts Reference */}
        <Card>
          <CardContent className="p-4">
            <h4 className="font-bold mb-2">Crypto Concepts:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Hash Functions:</strong> One-way cryptographic functions
              </div>
              <div>
                <strong>Blockchain:</strong> Immutable chain of blocks
              </div>
              <div>
                <strong>Mining:</strong> Proof-of-work consensus mechanism
              </div>
              <div>
                <strong>Wallets:</strong> Private/public key pairs
              </div>
              <div>
                <strong>Smart Contracts:</strong> Self-executing code
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  )
}
