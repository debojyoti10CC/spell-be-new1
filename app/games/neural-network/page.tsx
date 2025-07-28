"use client"

import { useState, useEffect } from "react"
import { GameLayout } from "@/components/game-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"

interface Neuron {
  id: string
  x: number
  y: number
  value: number
  bias: number
  layer: number
}

interface Connection {
  from: string
  to: string
  weight: number
}

interface TrainingData {
  inputs: number[]
  expectedOutput: number
  description: string
}

const TRAINING_DATASETS: TrainingData[] = [
  { inputs: [0, 0], expectedOutput: 0, description: "AND Gate: 0 AND 0 = 0" },
  { inputs: [0, 1], expectedOutput: 0, description: "AND Gate: 0 AND 1 = 0" },
  { inputs: [1, 0], expectedOutput: 0, description: "AND Gate: 1 AND 0 = 0" },
  { inputs: [1, 1], expectedOutput: 1, description: "AND Gate: 1 AND 1 = 1" },
]

export default function NeuralNetworkGame() {
  const [neurons, setNeurons] = useState<Neuron[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [currentTraining, setCurrentTraining] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(360) // 6 minutes
  const [gameStarted, setGameStarted] = useState(false)
  const [learningRate, setLearningRate] = useState([0.1])
  const [epochs, setEpochs] = useState(0)
  const [networkOutput, setNetworkOutput] = useState(0)
  const [isTraining, setIsTraining] = useState(false)

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
      return () => clearInterval(timer)
    }
  }, [gameStarted, timeLeft])

  const startGame = () => {
    setGameStarted(true)
    setScore(0)
    setTimeLeft(360)
    setEpochs(0)
    setCurrentTraining(0)
    initializeNetwork()
  }

  const initializeNetwork = () => {
    // Create a simple 2-2-1 network (2 inputs, 2 hidden, 1 output)
    const newNeurons: Neuron[] = [
      // Input layer
      { id: "i1", x: 100, y: 150, value: 0, bias: 0, layer: 0 },
      { id: "i2", x: 100, y: 250, value: 0, bias: 0, layer: 0 },
      // Hidden layer
      { id: "h1", x: 250, y: 150, value: 0, bias: Math.random() - 0.5, layer: 1 },
      { id: "h2", x: 250, y: 250, value: 0, bias: Math.random() - 0.5, layer: 1 },
      // Output layer
      { id: "o1", x: 400, y: 200, value: 0, bias: Math.random() - 0.5, layer: 2 },
    ]

    const newConnections: Connection[] = [
      { from: "i1", to: "h1", weight: Math.random() - 0.5 },
      { from: "i1", to: "h2", weight: Math.random() - 0.5 },
      { from: "i2", to: "h1", weight: Math.random() - 0.5 },
      { from: "i2", to: "h2", weight: Math.random() - 0.5 },
      { from: "h1", to: "o1", weight: Math.random() - 0.5 },
      { from: "h2", to: "o1", weight: Math.random() - 0.5 },
    ]

    setNeurons(newNeurons)
    setConnections(newConnections)
  }

  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x))

  const forwardPass = (inputs: number[]) => {
    const newNeurons = [...neurons]

    // Set input values
    newNeurons[0].value = inputs[0]
    newNeurons[1].value = inputs[1]

    // Calculate hidden layer
    const h1Input = connections[0].weight * inputs[0] + connections[2].weight * inputs[1] + newNeurons[2].bias
    const h2Input = connections[1].weight * inputs[0] + connections[3].weight * inputs[1] + newNeurons[3].bias

    newNeurons[2].value = sigmoid(h1Input)
    newNeurons[3].value = sigmoid(h2Input)

    // Calculate output layer
    const outputInput =
      connections[4].weight * newNeurons[2].value + connections[5].weight * newNeurons[3].value + newNeurons[4].bias
    newNeurons[4].value = sigmoid(outputInput)

    setNeurons(newNeurons)
    setNetworkOutput(newNeurons[4].value)
    return newNeurons[4].value
  }

  const trainNetwork = () => {
    setIsTraining(true)
    const trainingData = TRAINING_DATASETS[currentTraining]

    // Forward pass
    const output = forwardPass(trainingData.inputs)

    // Calculate error
    const error = trainingData.expectedOutput - output
    const accuracy = 1 - Math.abs(error)

    // Simple backpropagation (simplified for game)
    const newConnections = connections.map((conn) => ({
      ...conn,
      weight: conn.weight + learningRate[0] * error * 0.1 * (Math.random() - 0.5),
    }))

    setConnections(newConnections)
    setEpochs((prev) => prev + 1)

    // Score based on accuracy
    if (accuracy > 0.9) {
      setScore((prev) => prev + 10)
    } else if (accuracy > 0.7) {
      setScore((prev) => prev + 5)
    }

    setTimeout(() => setIsTraining(false), 500)
  }

  const testNetwork = () => {
    const results = TRAINING_DATASETS.map((data) => {
      const output = forwardPass(data.inputs)
      const error = Math.abs(data.expectedOutput - output)
      return { ...data, output, error, accuracy: 1 - error }
    })

    const avgAccuracy = results.reduce((sum, r) => sum + r.accuracy, 0) / results.length

    if (avgAccuracy > 0.8) {
      setScore((prev) => prev + 100)
      alert(`Network trained successfully! Average accuracy: ${(avgAccuracy * 100).toFixed(1)}%`)

      // Update progress in localStorage
      const progress = JSON.parse(localStorage.getItem("gameProgress") || "{}")
      progress[13] = { completed: true, score: score + 100, timestamp: Date.now() }
      localStorage.setItem("gameProgress", JSON.stringify(progress))
    } else {
      alert(`Network needs more training. Average accuracy: ${(avgAccuracy * 100).toFixed(1)}%`)
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
        title="Neural Network"
        level={13}
        onStart={startGame}
        description="Build and train a neural network to learn patterns"
      >
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Neural Network Builder</h2>
          <p className="text-gray-600">Train a neural network to learn the AND gate function</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-bold">Network Architecture</h3>
                <p className="text-sm text-gray-600">2 inputs, 2 hidden, 1 output</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-bold">Backpropagation</h3>
                <p className="text-sm text-gray-600">Learn through training examples</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-bold">Pattern Recognition</h3>
                <p className="text-sm text-gray-600">Master the AND logic gate</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </GameLayout>
    )
  }

  const currentData = TRAINING_DATASETS[currentTraining]

  return (
    <GameLayout
      title="Neural Network"
      level={13}
      onStart={startGame}
      description="Build and train a neural network to learn patterns"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Game Header */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Badge variant="outline">Score: {score}</Badge>
            <Badge variant="outline">Epochs: {epochs}</Badge>
            <Badge variant={timeLeft < 60 ? "destructive" : "outline"}>Time: {formatTime(timeLeft)}</Badge>
          </div>
          <Badge variant="secondary" className={isTraining ? "animate-pulse" : ""}>
            {isTraining ? "Training..." : "Ready"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Network Visualization */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">Neural Network</h3>
              <div className="relative h-80 bg-gray-50 rounded-lg overflow-hidden">
                <svg width="100%" height="100%" className="absolute inset-0">
                  {/* Draw connections */}
                  {connections.map((conn, index) => {
                    const fromNeuron = neurons.find((n) => n.id === conn.from)
                    const toNeuron = neurons.find((n) => n.id === conn.to)
                    if (!fromNeuron || !toNeuron) return null

                    const opacity = Math.abs(conn.weight)
                    const color = conn.weight > 0 ? "blue" : "red"

                    return (
                      <line
                        key={index}
                        x1={fromNeuron.x}
                        y1={fromNeuron.y}
                        x2={toNeuron.x}
                        y2={toNeuron.y}
                        stroke={color}
                        strokeWidth={Math.max(1, opacity * 3)}
                        opacity={0.6}
                      />
                    )
                  })}

                  {/* Draw neurons */}
                  {neurons.map((neuron) => (
                    <g key={neuron.id}>
                      <circle
                        cx={neuron.x}
                        cy={neuron.y}
                        r={20}
                        fill={`hsl(${neuron.value * 120}, 70%, 50%)`}
                        stroke="#333"
                        strokeWidth={2}
                      />
                      <text x={neuron.x} y={neuron.y + 5} textAnchor="middle" className="text-xs font-bold fill-white">
                        {neuron.value.toFixed(2)}
                      </text>
                    </g>
                  ))}
                </svg>

                {/* Layer labels */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-between px-4 text-xs text-gray-600">
                  <span>Input</span>
                  <span>Hidden</span>
                  <span>Output</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Training Controls */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-bold">Training Controls</h3>

              {/* Current Training Data */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-bold mb-2">Current Training Example:</h4>
                <p className="text-sm">{currentData.description}</p>
                <div className="flex gap-4 mt-2">
                  <span>Inputs: [{currentData.inputs.join(", ")}]</span>
                  <span>Expected: {currentData.expectedOutput}</span>
                  <span>Output: {networkOutput.toFixed(3)}</span>
                </div>
              </div>

              {/* Learning Rate */}
              <div>
                <label className="block text-sm font-medium mb-2">Learning Rate: {learningRate[0]}</label>
                <Slider
                  value={learningRate}
                  onValueChange={setLearningRate}
                  min={0.01}
                  max={1}
                  step={0.01}
                  className="w-full"
                />
              </div>

              {/* Training Controls */}
              <div className="flex gap-2">
                <Button onClick={trainNetwork} disabled={isTraining} className="flex-1">
                  Train Step
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentTraining((prev) => (prev + 1) % TRAINING_DATASETS.length)}
                  className="flex-1"
                >
                  Next Example
                </Button>
              </div>

              <Button onClick={testNetwork} variant="secondary" className="w-full">
                Test Network
              </Button>

              {/* Network Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-2 bg-gray-50 rounded">
                  <div className="font-bold">Connections</div>
                  <div>{connections.length}</div>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <div className="font-bold">Parameters</div>
                  <div>{connections.length + neurons.filter((n) => n.layer > 0).length}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Training Data Overview */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4">AND Gate Truth Table</h3>
            <div className="grid grid-cols-4 gap-4">
              {TRAINING_DATASETS.map((data, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-2 cursor-pointer ${
                    index === currentTraining ? "border-blue-500 bg-blue-50" : "border-gray-200"
                  }`}
                  onClick={() => setCurrentTraining(index)}
                >
                  <div className="text-center">
                    <div className="font-mono text-sm">
                      {data.inputs[0]} ∧ {data.inputs[1]} = {data.expectedOutput}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  )
}
