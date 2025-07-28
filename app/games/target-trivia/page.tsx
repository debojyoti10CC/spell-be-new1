"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Target, Crosshair } from "lucide-react"
import GameLayout from "@/components/game-layout"
import { useRouter } from "next/navigation"

const questions = [
  {
    question: "What is the capital of France?",
    balloons: [
      { text: "London", correct: false, color: "bg-red-400" },
      { text: "Paris", correct: true, color: "bg-green-400" },
      { text: "Berlin", correct: false, color: "bg-blue-400" },
      { text: "Madrid", correct: false, color: "bg-yellow-400" },
    ],
  },
  {
    question: "How many continents are there?",
    balloons: [
      { text: "5", correct: false, color: "bg-purple-400" },
      { text: "6", correct: false, color: "bg-pink-400" },
      { text: "7", correct: true, color: "bg-green-400" },
      { text: "8", correct: false, color: "bg-orange-400" },
    ],
  },
  {
    question: "What is the largest ocean?",
    balloons: [
      { text: "Atlantic", correct: false, color: "bg-blue-400" },
      { text: "Pacific", correct: true, color: "bg-green-400" },
      { text: "Indian", correct: false, color: "bg-teal-400" },
      { text: "Arctic", correct: false, color: "bg-cyan-400" },
    ],
  },
  {
    question: "Which planet is closest to the Sun?",
    balloons: [
      { text: "Venus", correct: false, color: "bg-yellow-400" },
      { text: "Earth", correct: false, color: "bg-blue-400" },
      { text: "Mercury", correct: true, color: "bg-green-400" },
      { text: "Mars", correct: false, color: "bg-red-400" },
    ],
  },
  {
    question: "What do pandas mainly eat?",
    balloons: [
      { text: "Fish", correct: false, color: "bg-blue-400" },
      { text: "Bamboo", correct: true, color: "bg-green-400" },
      { text: "Meat", correct: false, color: "bg-red-400" },
      { text: "Fruits", correct: false, color: "bg-orange-400" },
    ],
  },
  {
    question: "How many sides does a triangle have?",
    balloons: [
      { text: "2", correct: false, color: "bg-red-400" },
      { text: "3", correct: true, color: "bg-green-400" },
      { text: "4", correct: false, color: "bg-blue-400" },
      { text: "5", correct: false, color: "bg-purple-400" },
    ],
  },
  {
    question: "What is the fastest land animal?",
    balloons: [
      { text: "Lion", correct: false, color: "bg-yellow-400" },
      { text: "Horse", correct: false, color: "bg-brown-400" },
      { text: "Cheetah", correct: true, color: "bg-green-400" },
      { text: "Tiger", correct: false, color: "bg-orange-400" },
    ],
  },
  {
    question: "Which season comes after spring?",
    balloons: [
      { text: "Winter", correct: false, color: "bg-blue-400" },
      { text: "Summer", correct: true, color: "bg-green-400" },
      { text: "Fall", correct: false, color: "bg-orange-400" },
      { text: "Autumn", correct: false, color: "bg-red-400" },
    ],
  },
  {
    question: "What is 10 + 5?",
    balloons: [
      { text: "12", correct: false, color: "bg-red-400" },
      { text: "15", correct: true, color: "bg-green-400" },
      { text: "18", correct: false, color: "bg-blue-400" },
      { text: "20", correct: false, color: "bg-purple-400" },
    ],
  },
  {
    question: "Which bird can't fly?",
    balloons: [
      { text: "Eagle", correct: false, color: "bg-brown-400" },
      { text: "Penguin", correct: true, color: "bg-green-400" },
      { text: "Sparrow", correct: false, color: "bg-gray-400" },
      { text: "Owl", correct: false, color: "bg-yellow-400" },
    ],
  },
  {
    question: "What color do you get mixing red and blue?",
    balloons: [
      { text: "Green", correct: false, color: "bg-green-400" },
      { text: "Purple", correct: true, color: "bg-purple-400" },
      { text: "Orange", correct: false, color: "bg-orange-400" },
      { text: "Yellow", correct: false, color: "bg-yellow-400" },
    ],
  },
  {
    question: "How many days are in a year?",
    balloons: [
      { text: "360", correct: false, color: "bg-red-400" },
      { text: "365", correct: true, color: "bg-green-400" },
      { text: "370", correct: false, color: "bg-blue-400" },
      { text: "350", correct: false, color: "bg-purple-400" },
    ],
  },
  {
    question: "What is the smallest planet?",
    balloons: [
      { text: "Mars", correct: false, color: "bg-red-400" },
      { text: "Venus", correct: false, color: "bg-yellow-400" },
      { text: "Mercury", correct: true, color: "bg-green-400" },
      { text: "Earth", correct: false, color: "bg-blue-400" },
    ],
  },
  {
    question: "Which animal is known for its trunk?",
    balloons: [
      { text: "Rhino", correct: false, color: "bg-gray-400" },
      { text: "Elephant", correct: true, color: "bg-green-400" },
      { text: "Hippo", correct: false, color: "bg-purple-400" },
      { text: "Giraffe", correct: false, color: "bg-yellow-400" },
    ],
  },
  {
    question: "What do bees collect from flowers?",
    balloons: [
      { text: "Water", correct: false, color: "bg-blue-400" },
      { text: "Nectar", correct: true, color: "bg-green-400" },
      { text: "Leaves", correct: false, color: "bg-green-300" },
      { text: "Seeds", correct: false, color: "bg-brown-400" },
    ],
  },
  {
    question: "How many legs does an insect have?",
    balloons: [
      { text: "4", correct: false, color: "bg-red-400" },
      { text: "6", correct: true, color: "bg-green-400" },
      { text: "8", correct: false, color: "bg-blue-400" },
      { text: "10", correct: false, color: "bg-purple-400" },
    ],
  },
  {
    question: "What is the main ingredient in bread?",
    balloons: [
      { text: "Rice", correct: false, color: "bg-white" },
      { text: "Flour", correct: true, color: "bg-green-400" },
      { text: "Sugar", correct: false, color: "bg-pink-400" },
      { text: "Salt", correct: false, color: "bg-gray-400" },
    ],
  },
  {
    question: "Which shape has no corners?",
    balloons: [
      { text: "Square", correct: false, color: "bg-red-400" },
      { text: "Triangle", correct: false, color: "bg-blue-400" },
      { text: "Circle", correct: true, color: "bg-green-400" },
      { text: "Rectangle", correct: false, color: "bg-purple-400" },
    ],
  },
  {
    question: "What do caterpillars turn into?",
    balloons: [
      { text: "Birds", correct: false, color: "bg-blue-400" },
      { text: "Butterflies", correct: true, color: "bg-green-400" },
      { text: "Bees", correct: false, color: "bg-yellow-400" },
      { text: "Spiders", correct: false, color: "bg-black" },
    ],
  },
  {
    question: "Which meal do you eat in the evening?",
    balloons: [
      { text: "Breakfast", correct: false, color: "bg-yellow-400" },
      { text: "Lunch", correct: false, color: "bg-orange-400" },
      { text: "Dinner", correct: true, color: "bg-green-400" },
      { text: "Snack", correct: false, color: "bg-purple-400" },
    ],
  },
]

export default function TargetTriviaGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedBalloon, setSelectedBalloon] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(900)
  const [gameComplete, setGameComplete] = useState(false)
  const [crosshairPosition, setCrosshairPosition] = useState({ x: 50, y: 50 })
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
    // Move crosshair randomly
    const interval = setInterval(() => {
      setCrosshairPosition({
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 20,
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleBalloonClick = (balloonIndex: number) => {
    if (selectedBalloon !== null) return

    setSelectedBalloon(balloonIndex)
    setShowResult(true)

    const isCorrect = questions[currentQuestion].balloons[balloonIndex].correct
    if (isCorrect) {
      setScore(score + 5)
    } else {
      setScore(Math.max(0, score - 2))
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedBalloon(null)
        setShowResult(false)
      } else {
        handleGameComplete()
      }
    }, 2000)
  }

  const handleGameComplete = () => {
    setGameComplete(true)
    const currentProgress = Number.parseInt(localStorage.getItem("gameProgress") || "0")
    if (currentProgress === 0) {
      localStorage.setItem("gameProgress", "1")
    }
  }

  const instructions = [
    "Read the question and aim at the correct balloon",
    "Click on the balloon with the right answer",
    "Hit the target to score points!",
    "Correct shots give +5 points, wrong shots -2 points",
    "Complete all 20 questions to finish the game",
  ]

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-md"
        >
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-3xl font-bold text-red-600 mb-4">Target Master!</h2>
          <div className="text-6xl font-bold text-yellow-500 mb-4">{score}</div>
          <p className="text-gray-600 mb-6">Excellent shooting! You've completed all the target challenges!</p>
          <Button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
          >
            Back to Home
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <GameLayout
      gameTitle="Target Trivia"
      gameIcon={<Target className="text-red-500" size={32} />}
      instructions={instructions}
      onGameComplete={handleGameComplete}
      currentQuestion={currentQuestion + 1}
      totalQuestions={questions.length}
      score={score}
      timeLeft={timeLeft}
    >
      <div className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mb-8 shadow-2xl border-4 border-red-400 bg-gradient-to-br from-sky-100 to-blue-200">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">🎯</div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    {questions[currentQuestion].question}
                  </h2>
                  <p className="text-lg text-gray-600">Aim and shoot at the correct balloon!</p>
                </div>

                {/* Target Area */}
                <div className="relative bg-gradient-to-b from-sky-300 to-green-300 rounded-3xl p-8 min-h-[400px] overflow-hidden">
                  {/* Floating Balloons */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-full">
                    {questions[currentQuestion].balloons.map((balloon, index) => {
                      let balloonClass = `relative cursor-pointer transition-all duration-300 transform hover:scale-110 ${balloon.color} rounded-full p-6 text-white font-bold text-center shadow-lg border-4 border-white`

                      if (showResult) {
                        if (balloon.correct) {
                          balloonClass += " ring-4 ring-green-400 animate-pulse"
                        } else if (index === selectedBalloon) {
                          balloonClass += " ring-4 ring-red-400"
                        }
                      }

                      return (
                        <motion.div
                          key={index}
                          className={balloonClass}
                          onClick={() => handleBalloonClick(index)}
                          animate={{
                            y: [0, -20, 0],
                            rotate: [0, 5, -5, 0],
                          }}
                          transition={{
                            duration: 3 + index * 0.5,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                          whileHover={{ scale: selectedBalloon === null ? 1.1 : 1 }}
                          whileTap={{ scale: selectedBalloon === null ? 0.95 : 1 }}
                        >
                          <div className="text-lg md:text-xl">{balloon.text}</div>
                          {/* Balloon String */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 h-16 bg-gray-600"></div>
                        </motion.div>
                      )
                    })}
                  </div>

                  {/* Crosshair */}
                  <motion.div
                    className="absolute pointer-events-none"
                    animate={{
                      left: `${crosshairPosition.x}%`,
                      top: `${crosshairPosition.y}%`,
                    }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  >
                    <Crosshair className="text-red-600" size={32} />
                  </motion.div>

                  {/* Clouds */}
                  <div className="absolute top-4 left-4 text-4xl opacity-70">☁️</div>
                  <div className="absolute top-8 right-8 text-3xl opacity-70">☁️</div>
                  <div className="absolute bottom-16 left-8 text-5xl opacity-70">☁️</div>
                </div>

                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 text-center"
                  >
                    {questions[currentQuestion].balloons[selectedBalloon!]?.correct ? (
                      <div className="text-green-600 font-bold text-2xl">🎯 Perfect Shot! +5 points</div>
                    ) : (
                      <div className="text-red-600 font-bold text-2xl">💥 Missed! -2 points</div>
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
