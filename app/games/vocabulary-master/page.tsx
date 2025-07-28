"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen } from "lucide-react"
import GameLayout from "@/components/game-layout"
import { useRouter } from "next/navigation"

interface VocabularyQuestion {
  id: number
  word: string
  definition: string
  options: string[]
  correct: number
  context: string
  difficulty: "intermediate" | "advanced" | "expert"
}

const VOCABULARY_QUESTIONS: VocabularyQuestion[] = [
  {
    id: 1,
    word: "Ubiquitous",
    definition: "Present, appearing, or found everywhere",
    options: ["Rare and precious", "Present everywhere", "Difficult to understand", "Ancient and historical"],
    correct: 1,
    context: "Smartphones have become ubiquitous in modern society, with nearly everyone owning one.",
    difficulty: "intermediate",
  },
  {
    id: 2,
    word: "Ephemeral",
    definition: "Lasting for a very short time",
    options: ["Permanent and lasting", "Temporary and brief", "Complex and detailed", "Simple and clear"],
    correct: 1,
    context: "The beauty of cherry blossoms is ephemeral, lasting only a few weeks each spring.",
    difficulty: "advanced",
  },
  {
    id: 3,
    word: "Pragmatic",
    definition: "Dealing with things sensibly and realistically",
    options: [
      "Idealistic and dreamy",
      "Practical and realistic",
      "Emotional and sensitive",
      "Theoretical and abstract",
    ],
    correct: 1,
    context: "The CEO took a pragmatic approach to the budget crisis, focusing on immediate solutions.",
    difficulty: "intermediate",
  },
  {
    id: 4,
    word: "Meticulous",
    definition: "Showing great attention to detail; very careful and precise",
    options: ["Careless and sloppy", "Quick and efficient", "Careful and precise", "Loud and obvious"],
    correct: 2,
    context: "The scientist was meticulous in recording every detail of the experiment.",
    difficulty: "advanced",
  },
  {
    id: 5,
    word: "Ambiguous",
    definition: "Open to more than one interpretation; having a double meaning",
    options: ["Clear and obvious", "Unclear and confusing", "Loud and noticeable", "Fast and efficient"],
    correct: 1,
    context: "The politician's ambiguous statement left voters uncertain about his true position.",
    difficulty: "intermediate",
  },
  {
    id: 6,
    word: "Resilient",
    definition: "Able to withstand or recover quickly from difficult conditions",
    options: ["Weak and fragile", "Strong and adaptable", "Slow and steady", "Bright and colorful"],
    correct: 1,
    context: "Children are remarkably resilient and can adapt to new environments quickly.",
    difficulty: "intermediate",
  },
  {
    id: 7,
    word: "Eloquent",
    definition: "Fluent or persuasive in speaking or writing",
    options: ["Silent and quiet", "Fluent and persuasive", "Confused and unclear", "Simple and basic"],
    correct: 1,
    context: "The lawyer's eloquent closing argument convinced the jury of his client's innocence.",
    difficulty: "advanced",
  },
  {
    id: 8,
    word: "Inevitable",
    definition: "Certain to happen; unavoidable",
    options: ["Possible but unlikely", "Certain to happen", "Easy to prevent", "Difficult to understand"],
    correct: 1,
    context: "Climate change experts warn that rising sea levels are inevitable without immediate action.",
    difficulty: "intermediate",
  },
  {
    id: 9,
    word: "Paradox",
    definition: "A seemingly absurd or contradictory statement that may reveal a deeper truth",
    options: ["A simple explanation", "A contradictory statement", "A false accusation", "A clear instruction"],
    correct: 1,
    context: "It's a paradox that the more choices we have, the harder it becomes to make a decision.",
    difficulty: "expert",
  },
  {
    id: 10,
    word: "Catalyst",
    definition: "A person or thing that precipitates an event or change",
    options: [
      "Something that prevents change",
      "Something that causes change",
      "Something that records change",
      "Something that ignores change",
    ],
    correct: 1,
    context: "The new CEO became a catalyst for innovation within the traditional company.",
    difficulty: "advanced",
  },
  {
    id: 11,
    word: "Synthesis",
    definition: "The combination of ideas to form a theory or system",
    options: ["Breaking things apart", "Combining ideas together", "Copying existing work", "Ignoring all evidence"],
    correct: 1,
    context: "The research paper presented a synthesis of various theories about human behavior.",
    difficulty: "expert",
  },
  {
    id: 12,
    word: "Paradigm",
    definition: "A typical example or pattern of something; a model",
    options: ["A rare exception", "A typical model", "A false statement", "A hidden secret"],
    correct: 1,
    context: "The internet created a new paradigm for how people communicate and share information.",
    difficulty: "expert",
  },
  {
    id: 13,
    word: "Intrinsic",
    definition: "Belonging naturally; essential",
    options: ["Added from outside", "Naturally belonging", "Temporarily present", "Artificially created"],
    correct: 1,
    context: "Curiosity is intrinsic to human nature and drives our desire to learn.",
    difficulty: "advanced",
  },
  {
    id: 14,
    word: "Comprehensive",
    definition: "Complete and including everything that is necessary",
    options: ["Partial and incomplete", "Complete and thorough", "Quick and simple", "Expensive and costly"],
    correct: 1,
    context: "The university offers a comprehensive program covering all aspects of environmental science.",
    difficulty: "intermediate",
  },
  {
    id: 15,
    word: "Substantiate",
    definition: "Provide evidence to support or prove the truth of",
    options: ["Prove with evidence", "Deny completely", "Ignore entirely", "Question repeatedly"],
    correct: 0,
    context: "The researcher needed more data to substantiate her groundbreaking claims.",
    difficulty: "advanced",
  },
  {
    id: 16,
    word: "Conundrum",
    definition: "A confusing and difficult problem or question",
    options: ["An easy solution", "A difficult problem", "A clear answer", "A simple task"],
    correct: 1,
    context: "The ethical conundrum of artificial intelligence poses challenges for modern society.",
    difficulty: "expert",
  },
  {
    id: 17,
    word: "Proliferate",
    definition: "Increase rapidly in numbers; multiply",
    options: ["Decrease slowly", "Increase rapidly", "Stay the same", "Disappear completely"],
    correct: 1,
    context: "Social media platforms continue to proliferate as new ones emerge regularly.",
    difficulty: "advanced",
  },
  {
    id: 18,
    word: "Juxtapose",
    definition: "Place or deal with close together for contrasting effect",
    options: ["Separate completely", "Place side by side", "Hide carefully", "Destroy entirely"],
    correct: 1,
    context: "The artist chose to juxtapose modern and classical elements in her sculpture.",
    difficulty: "expert",
  },
  {
    id: 19,
    word: "Empirical",
    definition: "Based on, concerned with, or verifiable by observation or experience",
    options: ["Based on theory only", "Based on observation", "Based on imagination", "Based on tradition"],
    correct: 1,
    context: "The medical treatment was approved only after extensive empirical research proved its effectiveness.",
    difficulty: "expert",
  },
  {
    id: 20,
    word: "Dichotomy",
    definition: "A division or contrast between two things that are represented as being opposed",
    options: ["A perfect agreement", "A sharp division", "A gradual change", "A random occurrence"],
    correct: 1,
    context: "There's often a dichotomy between what politicians promise and what they actually deliver.",
    difficulty: "expert",
  },
]

export default function VocabularyMasterGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(1200) // 20 minutes
  const [gameComplete, setGameComplete] = useState(false)
  const [streak, setStreak] = useState(0)
  const [showContext, setShowContext] = useState(false)
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

    const isCorrect = answerIndex === VOCABULARY_QUESTIONS[currentQuestion].correct
    if (isCorrect) {
      const basePoints = getDifficultyPoints(VOCABULARY_QUESTIONS[currentQuestion].difficulty)
      const streakBonus = streak * 5
      setScore(score + basePoints + streakBonus)
      setStreak(streak + 1)
    } else {
      setStreak(0)
    }

    setTimeout(() => {
      if (currentQuestion < VOCABULARY_QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowResult(false)
        setShowContext(false)
      } else {
        handleGameComplete()
      }
    }, 3000)
  }

  const getDifficultyPoints = (difficulty: string) => {
    switch (difficulty) {
      case "intermediate":
        return 10
      case "advanced":
        return 15
      case "expert":
        return 20
      default:
        return 10
    }
  }

  const handleGameComplete = () => {
    setGameComplete(true)
    const currentProgress = Number.parseInt(localStorage.getItem("gameProgress") || "0")
    if (currentProgress === 0) {
      localStorage.setItem("gameProgress", "1")
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "intermediate":
        return "bg-green-100 text-green-800"
      case "advanced":
        return "bg-yellow-100 text-yellow-800"
      case "expert":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-md"
        >
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Vocabulary Master!</h2>
          <div className="text-6xl font-bold text-yellow-500 mb-4">{score}</div>
          <p className="text-gray-600 mb-6">Excellent! You've mastered advanced vocabulary!</p>
          <Button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            Back to Home
          </Button>
        </motion.div>
      </div>
    )
  }

  const question = VOCABULARY_QUESTIONS[currentQuestion]

  return (
    <GameLayout
      gameTitle="Vocabulary Master"
      gameIcon={<BookOpen className="text-blue-500" size={32} />}
      instructions={[
        "Read each vocabulary word and its context carefully",
        "Choose the correct definition from the options",
        "Higher difficulty words give more points",
        "Build streaks for bonus points",
        "Complete all 20 questions to master vocabulary",
      ]}
      onGameComplete={handleGameComplete}
      currentQuestion={currentQuestion + 1}
      totalQuestions={VOCABULARY_QUESTIONS.length}
      score={score}
      timeLeft={timeLeft}
    >
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mb-8 shadow-2xl border-4 border-blue-400">
              <CardContent className="p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty.toUpperCase()}</Badge>
                  <div className="flex gap-2">
                    <Badge variant="outline">Streak: {streak}</Badge>
                    <Badge variant="outline">Time: {formatTime(timeLeft)}</Badge>
                  </div>
                </div>

                {/* Word and Definition */}
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold text-gray-800 mb-4">{question.word}</h2>
                  <p className="text-lg text-gray-600 italic mb-4">What does this word mean?</p>
                </div>

                {/* Context Button */}
                <div className="text-center mb-6">
                  <Button variant="outline" onClick={() => setShowContext(!showContext)} className="mb-4">
                    {showContext ? "Hide" : "Show"} Context Example
                  </Button>

                  {showContext && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="p-4 bg-blue-50 rounded-lg"
                    >
                      <p className="text-blue-800 italic">"{question.context}"</p>
                    </motion.div>
                  )}
                </div>

                {/* Answer Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {question.options.map((option, index) => {
                    let buttonClass =
                      "p-6 text-lg font-semibold rounded-xl border-2 transition-all duration-300 text-left "

                    if (showResult) {
                      if (index === question.correct) {
                        buttonClass += "bg-green-100 border-green-500 text-green-700"
                      } else if (index === selectedAnswer) {
                        buttonClass += "bg-red-100 border-red-500 text-red-700"
                      } else {
                        buttonClass += "bg-gray-100 border-gray-300 text-gray-500"
                      }
                    } else {
                      buttonClass +=
                        "bg-white border-blue-300 text-gray-700 hover:bg-blue-50 hover:border-blue-500 hover:scale-105 cursor-pointer"
                    }

                    return (
                      <motion.div
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className={buttonClass}
                        whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
                        whileTap={{ scale: selectedAnswer === null ? 0.98 : 1 }}
                      >
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-lg px-3 py-1">
                            {String.fromCharCode(65 + index)}
                          </Badge>
                          <span>{option}</span>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Result */}
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center p-6 bg-gray-50 rounded-lg"
                  >
                    {selectedAnswer === question.correct ? (
                      <div>
                        <div className="text-green-600 font-bold text-2xl mb-2">🎉 Correct!</div>
                        <div className="text-green-700">
                          +{getDifficultyPoints(question.difficulty)} points
                          {streak > 0 && <span> + {streak * 5} streak bonus</span>}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-red-600 font-bold text-2xl mb-2">❌ Incorrect</div>
                        <div className="text-red-700">Correct answer: {question.options[question.correct]}</div>
                      </div>
                    )}
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-blue-800 font-medium">Definition:</p>
                      <p className="text-blue-700">{question.definition}</p>
                    </div>
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
