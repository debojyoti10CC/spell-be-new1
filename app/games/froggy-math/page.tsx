"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FishIcon as Frog } from "lucide-react"
import GameLayout from "@/components/game-layout"
import { useRouter } from "next/navigation"

interface MathQuestion {
  question: string
  answer: number
  options?: number[]
  type: "input" | "multiple"
}

const generateQuestions = (): MathQuestion[] => {
  const questions: MathQuestion[] = []

  // Addition questions
  for (let i = 0; i < 5; i++) {
    const a = Math.floor(Math.random() * 20) + 1
    const b = Math.floor(Math.random() * 20) + 1
    questions.push({
      question: `${a} + ${b} = ?`,
      answer: a + b,
      type: "input",
    })
  }

  // Subtraction questions
  for (let i = 0; i < 5; i++) {
    const a = Math.floor(Math.random() * 30) + 10
    const b = Math.floor(Math.random() * a) + 1
    questions.push({
      question: `${a} - ${b} = ?`,
      answer: a - b,
      type: "input",
    })
  }

  // Multiplication questions
  for (let i = 0; i < 5; i++) {
    const a = Math.floor(Math.random() * 10) + 1
    const b = Math.floor(Math.random() * 10) + 1
    const answer = a * b
    const wrongAnswers = [
      answer + Math.floor(Math.random() * 10) + 1,
      answer - Math.floor(Math.random() * 10) - 1,
      answer + Math.floor(Math.random() * 20) + 5,
    ]
      .filter((x) => x > 0 && x !== answer)
      .slice(0, 3)

    questions.push({
      question: `${a} × ${b} = ?`,
      answer,
      options: [answer, ...wrongAnswers].sort(() => Math.random() - 0.5),
      type: "multiple",
    })
  }

  // Division questions
  for (let i = 0; i < 5; i++) {
    const b = Math.floor(Math.random() * 9) + 2
    const answer = Math.floor(Math.random() * 10) + 1
    const a = b * answer
    questions.push({
      question: `${a} ÷ ${b} = ?`,
      answer,
      type: "input",
    })
  }

  return questions.sort(() => Math.random() - 0.5)
}

export default function FroggyMathGame() {
  const [questions] = useState<MathQuestion[]>(generateQuestions())
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [timeLeft, setTimeLeft] = useState(900)
  const [gameComplete, setGameComplete] = useState(false)
  const [frogPosition, setFrogPosition] = useState(0)
  const router = useRouter()

  useEffect(() => {
    if (timeLeft > 0 && !gameComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      handleGameComplete()
    }
  }, [timeLeft, gameComplete])

  const handleSubmit = () => {
    const question = questions[currentQuestion]
    let answer: number

    if (question.type === "input") {
      answer = Number.parseInt(userAnswer)
    } else {
      answer = selectedOption || 0
    }

    const correct = answer === question.answer
    setIsCorrect(correct)
    setShowResult(true)

    if (correct) {
      setScore(score + 5)
      setFrogPosition(frogPosition + 1)
    } else {
      setScore(Math.max(0, score - 2))
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setUserAnswer("")
        setSelectedOption(null)
        setShowResult(false)
      } else {
        handleGameComplete()
      }
    }, 2000)
  }

  const handleGameComplete = () => {
    setGameComplete(true)
    const currentProgress = Number.parseInt(localStorage.getItem("gameProgress") || "0")
    if (currentProgress === 2) {
      localStorage.setItem("gameProgress", "3")
    }
  }

  const instructions = [
    "Help the frog cross the pond by solving math problems",
    "Each correct answer moves the frog forward",
    "You have 20 math questions to solve",
    "Some questions need typed answers, others are multiple choice",
    "Correct answers give +5 points, wrong answers -2 points",
  ]

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-md"
        >
          <div className="text-6xl mb-4">🐸</div>
          <h2 className="text-3xl font-bold text-green-600 mb-4">Frog Made It!</h2>
          <div className="text-6xl font-bold text-yellow-500 mb-4">{score}</div>
          <p className="text-gray-600 mb-6">Great math skills! The frog successfully crossed the pond!</p>
          <Button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
          >
            Back to Home
          </Button>
        </motion.div>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <GameLayout
      gameTitle="Froggy Math"
      gameIcon={<Frog className="text-green-500" size={32} />}
      instructions={instructions}
      onGameComplete={handleGameComplete}
      currentQuestion={currentQuestion + 1}
      totalQuestions={questions.length}
      score={score}
      timeLeft={timeLeft}
    >
      <div className="max-w-4xl mx-auto">
        {/* Pond Scene */}
        <div className="mb-8 bg-blue-300 rounded-3xl p-8 relative overflow-hidden">
          <div className="flex justify-between items-end h-32">
            {/* Lily pads */}
            {Array.from({ length: 21 }, (_, i) => (
              <motion.div
                key={i}
                className={`w-12 h-12 rounded-full ${
                  i <= frogPosition ? "bg-green-400" : "bg-green-200"
                } flex items-center justify-center`}
                animate={{
                  scale: i === frogPosition ? [1, 1.2, 1] : 1,
                }}
                transition={{
                  duration: 0.5,
                  repeat: i === frogPosition ? Number.POSITIVE_INFINITY : 0,
                }}
              >
                {i === frogPosition && (
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                    className="text-2xl"
                  >
                    🐸
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-4 text-blue-800 font-bold">Frog Progress: {frogPosition}/20</div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <Card className="shadow-2xl border-4 border-green-400">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="text-8xl mb-4">🔢</div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">{question.question}</h2>
                </div>

                {question.type === "input" ? (
                  <div className="max-w-md mx-auto">
                    <Input
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Enter your answer"
                      className="text-2xl text-center py-4 mb-6"
                      disabled={showResult}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
                    {question.options?.map((option, index) => (
                      <Button
                        key={index}
                        onClick={() => setSelectedOption(option)}
                        disabled={showResult}
                        variant={selectedOption === option ? "default" : "outline"}
                        className="text-xl py-4"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                )}

                {!showResult && (
                  <div className="text-center">
                    <Button
                      onClick={handleSubmit}
                      disabled={question.type === "input" ? !userAnswer.trim() : selectedOption === null}
                      className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-xl"
                    >
                      Help Frog Jump! 🐸
                    </Button>
                  </div>
                )}

                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    {isCorrect ? (
                      <div className="text-green-600 font-bold text-2xl">
                        🎉 Correct! The frog jumps forward! +5 points
                      </div>
                    ) : (
                      <div className="text-red-600 font-bold text-2xl">
                        😔 Wrong! The answer was {question.answer}. -2 points
                      </div>
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
