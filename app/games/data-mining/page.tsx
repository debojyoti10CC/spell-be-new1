"use client"

import { useState, useEffect } from "react"
import { GameLayout } from "@/components/game-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DataPoint {
  id: number
  name: string
  age: number
  income: number
  education: string
  purchased: boolean
}

interface MiningTask {
  id: number
  name: string
  description: string
  data: DataPoint[]
  question: string
  correctAnswer: string | number
  type: "classification" | "clustering" | "association" | "regression"
  difficulty: number
}

const SAMPLE_DATA: DataPoint[] = [
  { id: 1, name: "Alice", age: 25, income: 50000, education: "Bachelor", purchased: true },
  { id: 2, name: "Bob", age: 35, income: 75000, education: "Master", purchased: true },
  { id: 3, name: "Carol", age: 22, income: 30000, education: "High School", purchased: false },
  { id: 4, name: "David", age: 45, income: 90000, education: "PhD", purchased: true },
  { id: 5, name: "Eve", age: 28, income: 55000, education: "Bachelor", purchased: true },
  { id: 6, name: "Frank", age: 19, income: 25000, education: "High School", purchased: false },
  { id: 7, name: "Grace", age: 32, income: 65000, education: "Master", purchased: true },
  { id: 8, name: "Henry", age: 55, income: 40000, education: "Bachelor", purchased: false },
]

const MINING_TASKS: MiningTask[] = [
  {
    id: 1,
    name: "Purchase Prediction",
    description: "Analyze customer data to predict purchase behavior",
    data: SAMPLE_DATA,
    question: "What percentage of customers with Bachelor's degree made a purchase?",
    correctAnswer: 67,
    type: "classification",
    difficulty: 1,
  },
  {
    id: 2,
    name: "Income Clustering",
    description: "Group customers by income levels",
    data: SAMPLE_DATA,
    question: "How many customers have income above $60,000?",
    correctAnswer: 3,
    type: "clustering",
    difficulty: 2,
  },
  {
    id: 3,
    name: "Age-Income Correlation",
    description: "Find relationship between age and income",
    data: SAMPLE_DATA,
    question: "What is the average age of customers who purchased? (round to nearest integer)",
    correctAnswer: 33,
    type: "regression",
    difficulty: 3,
  },
]

export default function DataMiningGame() {
  const [currentTask, setCurrentTask] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(480) // 8 minutes
  const [gameStarted, setGameStarted] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState("")
  const [filteredData, setFilteredData] = useState<DataPoint[]>([])
  const [analysisResults, setAnalysisResults] = useState<any>({})
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameOver) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
      return () => clearInterval(timer)
    }
  }, [gameStarted, timeLeft, gameOver])

  useEffect(() => {
    if (gameStarted) {
      const task = MINING_TASKS[currentTask]
      setFilteredData(task.data)
      performAnalysis(task.data)
    }
  }, [currentTask, gameStarted])

  const startGame = () => {
    setGameStarted(true)
    setCurrentTask(0)
    setScore(0)
    setTimeLeft(480)
    setUserAnswer("")
    setSelectedFilter("")
    setGameOver(false)
  }

  const performAnalysis = (data: DataPoint[]) => {
    const results = {
      totalCustomers: data.length,
      purchaseRate: ((data.filter((d) => d.purchased).length / data.length) * 100).toFixed(1),
      avgAge: (data.reduce((sum, d) => sum + d.age, 0) / data.length).toFixed(1),
      avgIncome: (data.reduce((sum, d) => sum + d.income, 0) / data.length).toFixed(0),
      educationBreakdown: {
        "High School": data.filter((d) => d.education === "High School").length,
        Bachelor: data.filter((d) => d.education === "Bachelor").length,
        Master: data.filter((d) => d.education === "Master").length,
        PhD: data.filter((d) => d.education === "PhD").length,
      },
      purchasedCustomers: data.filter((d) => d.purchased),
      highIncomeCustomers: data.filter((d) => d.income > 60000).length,
    }
    setAnalysisResults(results)
  }

  const applyFilter = () => {
    const task = MINING_TASKS[currentTask]
    let filtered = [...task.data]

    switch (selectedFilter) {
      case "purchased":
        filtered = filtered.filter((d) => d.purchased)
        break
      case "not-purchased":
        filtered = filtered.filter((d) => !d.purchased)
        break
      case "high-income":
        filtered = filtered.filter((d) => d.income > 60000)
        break
      case "bachelor":
        filtered = filtered.filter((d) => d.education === "Bachelor")
        break
      case "young":
        filtered = filtered.filter((d) => d.age < 30)
        break
      default:
        filtered = task.data
    }

    setFilteredData(filtered)
    performAnalysis(filtered)
  }

  const submitAnswer = () => {
    const task = MINING_TASKS[currentTask]
    const userNum = Number.parseFloat(userAnswer)
    const correctNum =
      typeof task.correctAnswer === "number" ? task.correctAnswer : Number.parseFloat(task.correctAnswer)

    const isCorrect = Math.abs(userNum - correctNum) <= 1 // Allow 1 unit tolerance

    if (isCorrect) {
      const points = task.difficulty * 100
      setScore((prev) => prev + points)

      if (currentTask < MINING_TASKS.length - 1) {
        setTimeout(() => {
          setCurrentTask((prev) => prev + 1)
          setUserAnswer("")
          setSelectedFilter("")
        }, 2000)
        alert(`Correct! +${points} points`)
      } else {
        setGameOver(true)
        // Update progress in localStorage
        const progress = JSON.parse(localStorage.getItem("gameProgress") || "{}")
        progress[16] = { completed: true, score: score + points, timestamp: Date.now() }
        localStorage.setItem("gameProgress", JSON.stringify(progress))
        alert(`Data mining mastered! Final Score: ${score + points}`)
      }
    } else {
      alert(`Incorrect. The answer was ${task.correctAnswer}. Try the next challenge!`)
      if (currentTask < MINING_TASKS.length - 1) {
        setCurrentTask((prev) => prev + 1)
        setUserAnswer("")
        setSelectedFilter("")
      } else {
        setGameOver(true)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getTaskColor = (type: string) => {
    switch (type) {
      case "classification":
        return "bg-blue-100 text-blue-800"
      case "clustering":
        return "bg-green-100 text-green-800"
      case "association":
        return "bg-purple-100 text-purple-800"
      case "regression":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!gameStarted) {
    return (
      <GameLayout
        title="Data Mining"
        level={16}
        onStart={startGame}
        description="Extract insights from customer data using data mining techniques"
      >
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Data Mining Challenge</h2>
          <p className="text-gray-600">Discover patterns and insights in customer datasets</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-bold">Pattern Recognition</h3>
                <p className="text-sm text-gray-600">Find hidden patterns in data</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-bold">Statistical Analysis</h3>
                <p className="text-sm text-gray-600">Calculate meaningful metrics</p>
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
        title="Data Mining"
        level={16}
        onStart={startGame}
        description="Extract insights from customer data using data mining techniques"
      >
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Data Scientist!</h2>
          <p className="text-xl">Final Score: {score}</p>
          <p className="text-gray-600">You've mastered the art of data mining!</p>
          <Button onClick={startGame} size="lg">
            Mine Again
          </Button>
        </div>
      </GameLayout>
    )
  }

  const task = MINING_TASKS[currentTask]

  return (
    <GameLayout
      title="Data Mining"
      level={16}
      onStart={startGame}
      description="Extract insights from customer data using data mining techniques"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Game Header */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Badge variant="outline">
              Task {currentTask + 1}/{MINING_TASKS.length}
            </Badge>
            <Badge variant="outline">Score: {score}</Badge>
            <Badge variant={timeLeft < 60 ? "destructive" : "outline"}>Time: {formatTime(timeLeft)}</Badge>
          </div>
          <Badge className={getTaskColor(task.type)}>{task.type.toUpperCase()}</Badge>
        </div>

        {/* Task Description */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-2">{task.name}</h3>
            <p className="text-gray-600 mb-4">{task.description}</p>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-bold text-blue-800 mb-2">Question:</h4>
              <p className="text-blue-700">{task.question}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Data Table */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold">Customer Data</h4>
                <Badge variant="outline">{filteredData.length} records</Badge>
              </div>

              {/* Filter Controls */}
              <div className="flex gap-2 mb-4">
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Apply filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    <SelectItem value="purchased">Purchased Only</SelectItem>
                    <SelectItem value="not-purchased">Not Purchased</SelectItem>
                    <SelectItem value="high-income">High Income (&gt;$60k)</SelectItem>
                    <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                    <SelectItem value="young">Young (&lt;30)</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={applyFilter} variant="outline">
                  Apply
                </Button>
              </div>

              {/* Data Table */}
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="p-2 text-left">Name</th>
                      <th className="p-2 text-left">Age</th>
                      <th className="p-2 text-left">Income</th>
                      <th className="p-2 text-left">Education</th>
                      <th className="p-2 text-left">Purchased</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((customer) => (
                      <tr key={customer.id} className="border-b">
                        <td className="p-2">{customer.name}</td>
                        <td className="p-2">{customer.age}</td>
                        <td className="p-2">${customer.income.toLocaleString()}</td>
                        <td className="p-2">{customer.education}</td>
                        <td className="p-2">
                          <Badge variant={customer.purchased ? "default" : "secondary"}>
                            {customer.purchased ? "Yes" : "No"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Panel */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h4 className="font-bold">Data Analysis</h4>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-600">Total Customers</div>
                  <div className="text-xl font-bold text-blue-800">{analysisResults.totalCustomers}</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-600">Purchase Rate</div>
                  <div className="text-xl font-bold text-green-800">{analysisResults.purchaseRate}%</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-sm text-purple-600">Avg Age</div>
                  <div className="text-xl font-bold text-purple-800">{analysisResults.avgAge}</div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="text-sm text-orange-600">Avg Income</div>
                  <div className="text-xl font-bold text-orange-800">${analysisResults.avgIncome}</div>
                </div>
              </div>

              {/* Education Breakdown */}
              <div>
                <h5 className="font-bold mb-2">Education Breakdown:</h5>
                <div className="space-y-1">
                  {Object.entries(analysisResults.educationBreakdown || {}).map(([edu, count]) => (
                    <div key={edu} className="flex justify-between text-sm">
                      <span>{edu}:</span>
                      <span className="font-bold">{count as number}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Answer Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Your Answer:</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Enter your answer..."
                    className="flex-1"
                  />
                  <Button onClick={submitAnswer} disabled={!userAnswer}>
                    Submit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Mining Techniques Reference */}
        <Card>
          <CardContent className="p-4">
            <h4 className="font-bold mb-2">Data Mining Techniques:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Classification:</strong> Predict categories (purchase/no purchase)
              </div>
              <div>
                <strong>Clustering:</strong> Group similar customers together
              </div>
              <div>
                <strong>Association:</strong> Find relationships between variables
              </div>
              <div>
                <strong>Regression:</strong> Predict numerical values
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  )
}
