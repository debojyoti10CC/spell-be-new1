"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { HelpCircle, CheckCircle, XCircle } from "lucide-react"
import GameLayout from "@/components/game-layout"
import { useRouter } from "next/navigation"

const questions = [
  {
    question: "What color do you get when you mix red and yellow?",
    options: ["Purple", "Orange", "Green", "Blue"],
    correct: 1,
    image: "🎨",
  },
  {
    question: "How many legs does a spider have?",
    options: ["6", "8", "10", "4"],
    correct: 1,
    image: "🕷️",
  },
  {
    question: "What is the largest planet in our solar system?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    correct: 2,
    image: "🪐",
  },
  {
    question: "Which animal is known as the 'King of the Jungle'?",
    options: ["Tiger", "Lion", "Elephant", "Bear"],
    correct: 1,
    image: "🦁",
  },
  {
    question: "How many days are there in a week?",
    options: ["5", "6", "7", "8"],
    correct: 2,
    image: "📅",
  },
  {
    question: "What do bees make?",
    options: ["Milk", "Honey", "Butter", "Cheese"],
    correct: 1,
    image: "🐝",
  },
  {
    question: "Which season comes after winter?",
    options: ["Summer", "Fall", "Spring", "Autumn"],
    correct: 2,
    image: "🌸",
  },
  {
    question: "What is 5 + 3?",
    options: ["7", "8", "9", "10"],
    correct: 1,
    image: "🔢",
  },
  {
    question: "Which fruit is yellow and curved?",
    options: ["Apple", "Banana", "Orange", "Grape"],
    correct: 1,
    image: "🍌",
  },
  {
    question: "What sound does a cow make?",
    options: ["Woof", "Meow", "Moo", "Chirp"],
    correct: 2,
    image: "🐄",
  },
  {
    question: "How many wheels does a bicycle have?",
    options: ["1", "2", "3", "4"],
    correct: 1,
    image: "🚲",
  },
  {
    question: "What do you use to brush your teeth?",
    options: ["Spoon", "Fork", "Toothbrush", "Comb"],
    correct: 2,
    image: "🦷",
  },
  {
    question: "Which bird cannot fly?",
    options: ["Eagle", "Penguin", "Sparrow", "Parrot"],
    correct: 1,
    image: "🐧",
  },
  {
    question: "What is the opposite of hot?",
    options: ["Warm", "Cool", "Cold", "Freezing"],
    correct: 2,
    image: "🧊",
  },
  {
    question: "How many fingers do you have on one hand?",
    options: ["4", "5", "6", "3"],
    correct: 1,
    image: "✋",
  },
  {
    question: "What do you wear on your feet?",
    options: ["Hat", "Gloves", "Shoes", "Scarf"],
    correct: 2,
    image: "👟",
  },
  {
    question: "Which meal do you eat in the morning?",
    options: ["Lunch", "Dinner", "Breakfast", "Snack"],
    correct: 2,
    image: "🍳",
  },
  {
    question: "What color is the sun?",
    options: ["Blue", "Yellow", "Red", "Green"],
    correct: 1,
    image: "☀️",
  },
  {
    question: "How many eyes do you have?",
    options: ["1", "2", "3", "4"],
    correct: 1,
    image: "👀",
  },
  {
    question: "What do fish live in?",
    options: ["Trees", "Water", "Air", "Sand"],
    correct: 1,
    image: "🐠",
  },
]

export default function QuizBlitzGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(900) // 15 minutes
  const [gameComplete, setGameComplete] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (timeLeft > 0 && !gameComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      handleGameComplete()
    }
  }, [timeLeft, gameComplete])

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return

    setSelectedAnswer(answerIndex)
    setShowResult(true)

    const isCorrect = answerIndex === questions[currentQuestion].correct
    if (isCorrect) {
      setScore(score + 5)
    } else {
      setScore(Math.max(0, score - 2))
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      } else {
        handleGameComplete()
      }
    }, 2000)
  }

  const handleGameComplete = () => {
    setGameComplete(true)
    // Save progress
    const currentProgress = Number.parseInt(localStorage.getItem("gameProgress") || "0")
    if (currentProgress === 8) {
      // Quiz Blitz is level 9 (index 8)
      localStorage.setItem("gameProgress", "9")
    }
  }

  const instructions = [
    "Read each question carefully and select the best answer",
    "You have 15 minutes to complete all 20 questions",
    "Correct answers give you +5 points, wrong answers -2 points",
    "You can only select one answer per question",
    "Camera monitoring is active throughout the game",
  ]

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-md"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-purple-600 mb-4">Quiz Complete!</h2>
          <div className="text-6xl font-bold text-yellow-500 mb-4">{score}</div>
          <p className="text-gray-600 mb-6">Great job! You've completed the Quiz Blitz challenge!</p>
          <div className="flex gap-4">
            <Button
              onClick={() => router.push("/")}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Back to Home
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <GameLayout
      gameTitle="Quiz Blitz"
      gameIcon={<HelpCircle className="text-teal-500" size={32} />}
      instructions={instructions}
      onGameComplete={handleGameComplete}
      currentQuestion={currentQuestion + 1}
      totalQuestions={questions.length}
      score={score}
      timeLeft={timeLeft}
    >
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-8 shadow-2xl border-4 border-white">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="text-8xl mb-4">{questions[currentQuestion].image}</div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    {questions[currentQuestion].question}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {questions[currentQuestion].options.map((option, index) => {
                    let buttonClass = "p-6 text-lg font-semibold rounded-xl border-2 transition-all duration-300 "

                    if (showResult) {
                      if (index === questions[currentQuestion].correct) {
                        buttonClass += "bg-green-100 border-green-500 text-green-700"
                      } else if (index === selectedAnswer) {
                        buttonClass += "bg-red-100 border-red-500 text-red-700"
                      } else {
                        buttonClass += "bg-gray-100 border-gray-300 text-gray-500"
                      }
                    } else {
                      buttonClass +=
                        "bg-white border-purple-300 text-gray-700 hover:bg-purple-50 hover:border-purple-500 hover:scale-105"
                    }

                    return (
                      <motion.button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={selectedAnswer !== null}
                        className={buttonClass}
                        whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
                        whileTap={{ scale: selectedAnswer === null ? 0.98 : 1 }}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {showResult && index === questions[currentQuestion].correct && (
                            <CheckCircle className="text-green-500" size={24} />
                          )}
                          {showResult && index === selectedAnswer && index !== questions[currentQuestion].correct && (
                            <XCircle className="text-red-500" size={24} />
                          )}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>

                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 text-center"
                  >
                    {selectedAnswer === questions[currentQuestion].correct ? (
                      <div className="text-green-600 font-bold text-xl">🎉 Correct! +5 points</div>
                    ) : (
                      <div className="text-red-600 font-bold text-xl">😔 Wrong! -2 points</div>
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
