"use client"

import { useState, useEffect } from "react"
import { GameLayout } from "@/components/game-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AlgorithmChallenge {
  id: number
  name: string
  description: string
  array: number[]
  correctSteps: string[]
  algorithm: "bubble" | "selection" | "insertion" | "merge" | "quick"
  difficulty: number
}

const ALGORITHM_CHALLENGES: AlgorithmChallenge[] = [
  {
    id: 1,
    name: "Bubble Sort Basics",
    description: "Sort [3, 1, 4, 2] using bubble sort",
    array: [3, 1, 4, 2],
    correctSteps: [
      "Compare 3,1 → Swap",
      "Compare 3,4 → No swap",
      "Compare 4,2 → Swap",
      "Compare 1,3 → No swap",
      "Compare 3,2 → Swap",
      "Compare 1,2 → No swap",
    ],
    algorithm: "bubble",
    difficulty: 1,
  },
  {
    id: 2,
    name: "Selection Sort Challenge",
    description: "Sort [5, 2, 8, 1] using selection sort",
    array: [5, 2, 8, 1],
    correctSteps: ["Find min: 1", "Swap 5↔1", "Find min: 2", "Already in place", "Find min: 5", "Swap 8↔5"],
    algorithm: "selection",
    difficulty: 2,
  },
  {
    id: 3,
    name: "Insertion Sort Master",
    description: "Sort [4, 3, 2, 1] using insertion sort",
    array: [4, 3, 2, 1],
    correctSteps: ["Insert 3: shift 4", "Insert 2: shift 4,3", "Insert 1: shift 4,3,2"],
    algorithm: "insertion",
    difficulty: 3,
  },
]

export default function AlgorithmRaceGame() {
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [currentArray, setCurrentArray] = useState<number[]>([])
  const [userSteps, setUserSteps] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [gameStarted, setGameStarted] = useState(false)
  const [selectedAction, setSelectedAction] = useState("")
  const [selectedIndices, setSelectedIndices] = useState<number[]>([])
  const [gameOver, setGameOver] = useState(false)
  const [visualizationSpeed, setVisualizationSpeed] = useState(1000)

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameOver) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
      return () => clearInterval(timer)
    }
  }, [gameStarted, timeLeft, gameOver])

  const startGame = () => {
    setGameStarted(true)
    setCurrentChallenge(0)
    setScore(0)
    setTimeLeft(300)
    resetChallenge()
    setGameOver(false)
  }

  const resetChallenge = () => {
    const challenge = ALGORITHM_CHALLENGES[currentChallenge]
    setCurrentArray([...challenge.array])
    setUserSteps([])
    setCurrentStep(0)
    setSelectedAction("")
    setSelectedIndices([])
  }

  const handleArrayClick = (index: number) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter((i) => i !== index))
    } else if (selectedIndices.length < 2) {
      setSelectedIndices([...selectedIndices, index])
    }
  }

  const executeStep = () => {
    const challenge = ALGORITHM_CHALLENGES[currentChallenge]

    if (selectedAction === "swap" && selectedIndices.length === 2) {
      const newArray = [...currentArray]
      const [i, j] = selectedIndices
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
      setCurrentArray(newArray)

      const stepDescription = `Swap ${currentArray[i]}↔${currentArray[j]}`
      setUserSteps([...userSteps, stepDescription])

      // Check if step is correct
      if (currentStep < challenge.correctSteps.length) {
        const isCorrect = challenge.correctSteps[currentStep].toLowerCase().includes("swap")
        if (isCorrect) {
          setScore((prev) => prev + 20)
        }
      }

      setCurrentStep((prev) => prev + 1)
      setSelectedIndices([])
      setSelectedAction("")
    } else if (selectedAction === "compare" && selectedIndices.length === 2) {
      const [i, j] = selectedIndices
      const stepDescription = `Compare ${currentArray[i]},${currentArray[j]}`
      setUserSteps([...userSteps, stepDescription])

      if (currentStep < challenge.correctSteps.length) {
        const isCorrect = challenge.correctSteps[currentStep].toLowerCase().includes("compare")
        if (isCorrect) {
          setScore((prev) => prev + 10)
        }
      }

      setCurrentStep((prev) => prev + 1)
      setSelectedIndices([])
      setSelectedAction("")
    }
  }

  const checkSolution = () => {
    const challenge = ALGORITHM_CHALLENGES[currentChallenge]
    const sortedArray = [...challenge.array].sort((a, b) => a - b)
    const isArraySorted = JSON.stringify(currentArray) === JSON.stringify(sortedArray)

    if (isArraySorted) {
      const bonusPoints = challenge.difficulty * 50
      setScore((prev) => prev + bonusPoints)

      if (currentChallenge < ALGORITHM_CHALLENGES.length - 1) {
        setTimeout(() => {
          setCurrentChallenge((prev) => prev + 1)
          resetChallenge()
        }, 2000)
        alert(`Correct! Array sorted! +${bonusPoints} bonus points`)
      } else {
        setGameOver(true)
        // Update progress in localStorage
        const progress = JSON.parse(localStorage.getItem("gameProgress") || "{}")
        progress[15] = { completed: true, score: score + bonusPoints, timestamp: Date.now() }
        localStorage.setItem("gameProgress", JSON.stringify(progress))
        alert(`All algorithms mastered! Final Score: ${score + bonusPoints}`)
      }
    } else {
      alert("Array not fully sorted yet. Continue sorting!")
    }
  }

  const autoSort = () => {
    const challenge = ALGORITHM_CHALLENGES[currentChallenge]
    const array = [...currentArray]

    // Simple bubble sort visualization
    for (let i = 0; i < array.length - 1; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
        if (array[j] > array[j + 1]) {
          ;[array[j], array[j + 1]] = [array[j + 1], array[j]]
        }
      }
    }

    setCurrentArray(array)
    setScore((prev) => prev + 30) // Bonus for using auto-sort
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getAlgorithmColor = (algorithm: string) => {
    switch (algorithm) {
      case "bubble":
        return "bg-blue-100 text-blue-800"
      case "selection":
        return "bg-green-100 text-green-800"
      case "insertion":
        return "bg-purple-100 text-purple-800"
      case "merge":
        return "bg-orange-100 text-orange-800"
      case "quick":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!gameStarted) {
    return (
      <GameLayout
        title="Algorithm Race"
        level={15}
        onStart={startGame}
        description="Master sorting algorithms through interactive visualization"
      >
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Algorithm Race</h2>
          <p className="text-gray-600">Learn and implement classic sorting algorithms</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-bold">Interactive Sorting</h3>
                <p className="text-sm text-gray-600">Step through algorithms manually</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-bold">Algorithm Visualization</h3>
                <p className="text-sm text-gray-600">See how sorting works</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-bold">Performance Analysis</h3>
                <p className="text-sm text-gray-600">Compare algorithm efficiency</p>
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
        title="Algorithm Race"
        level={15}
        onStart={startGame}
        description="Master sorting algorithms through interactive visualization"
      >
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Algorithm Master!</h2>
          <p className="text-xl">Final Score: {score}</p>
          <p className="text-gray-600">You've mastered the art of sorting algorithms!</p>
          <Button onClick={startGame} size="lg">
            Race Again
          </Button>
        </div>
      </GameLayout>
    )
  }

  const challenge = ALGORITHM_CHALLENGES[currentChallenge]

  return (
    <GameLayout
      title="Algorithm Race"
      level={15}
      onStart={startGame}
      description="Master sorting algorithms through interactive visualization"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Game Header */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Badge variant="outline">
              Challenge {currentChallenge + 1}/{ALGORITHM_CHALLENGES.length}
            </Badge>
            <Badge variant="outline">Score: {score}</Badge>
            <Badge variant={timeLeft < 60 ? "destructive" : "outline"}>Time: {formatTime(timeLeft)}</Badge>
          </div>
          <Badge className={getAlgorithmColor(challenge.algorithm)}>{challenge.algorithm.toUpperCase()} SORT</Badge>
        </div>

        {/* Challenge Description */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-2">{challenge.name}</h3>
            <p className="text-gray-600 mb-4">{challenge.description}</p>
            <Badge variant="outline">Difficulty: {challenge.difficulty}/3</Badge>
          </CardContent>
        </Card>

        {/* Array Visualization */}
        <Card>
          <CardContent className="p-6">
            <h4 className="font-bold mb-4">Current Array:</h4>
            <div className="flex justify-center gap-2 mb-6">
              {currentArray.map((value, index) => (
                <div
                  key={index}
                  onClick={() => handleArrayClick(index)}
                  className={`
                    w-16 h-16 flex items-center justify-center text-xl font-bold rounded-lg cursor-pointer border-2 transition-all
                    ${
                      selectedIndices.includes(index)
                        ? "border-blue-500 bg-blue-100 scale-110"
                        : "border-gray-300 bg-white hover:border-gray-400"
                    }
                  `}
                >
                  {value}
                </div>
              ))}
            </div>

            {/* Array as bars for better visualization */}
            <div className="flex justify-center items-end gap-2 h-32">
              {currentArray.map((value, index) => (
                <div
                  key={index}
                  className={`
                    w-12 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg cursor-pointer transition-all
                    ${selectedIndices.includes(index) ? "ring-4 ring-blue-300" : ""}
                  `}
                  style={{ height: `${(value / Math.max(...currentArray)) * 100}px` }}
                  onClick={() => handleArrayClick(index)}
                >
                  <div className="text-white text-xs text-center mt-1">{value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h4 className="font-bold mb-4">Algorithm Controls:</h4>
              <div className="space-y-4">
                <Select value={selectedAction} onValueChange={setSelectedAction}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compare">Compare Elements</SelectItem>
                    <SelectItem value="swap">Swap Elements</SelectItem>
                    <SelectItem value="find-min">Find Minimum</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Button
                    onClick={executeStep}
                    disabled={!selectedAction || selectedIndices.length !== 2}
                    className="flex-1"
                  >
                    Execute Step
                  </Button>
                  <Button variant="outline" onClick={autoSort} className="flex-1 bg-transparent">
                    Auto Sort
                  </Button>
                </div>

                <Button onClick={checkSolution} variant="secondary" className="w-full">
                  Check Solution
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h4 className="font-bold mb-4">Step History:</h4>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {userSteps.map((step, index) => (
                  <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                    <Badge variant="outline" className="mr-2">
                      {index + 1}
                    </Badge>
                    {step}
                  </div>
                ))}
                {userSteps.length === 0 && <p className="text-gray-500 italic">No steps taken yet</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Algorithm Reference */}
        <Card>
          <CardContent className="p-4">
            <h4 className="font-bold mb-2">Algorithm Reference:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong>Bubble Sort:</strong> Compare adjacent elements, swap if needed
              </div>
              <div>
                <strong>Selection Sort:</strong> Find minimum, place at beginning
              </div>
              <div>
                <strong>Insertion Sort:</strong> Insert each element in correct position
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  )
}
