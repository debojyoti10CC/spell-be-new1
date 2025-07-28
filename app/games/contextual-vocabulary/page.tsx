"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, CheckCircle, XCircle } from "lucide-react"
import GameLayout from "@/components/game-layout"
import { useRouter } from "next/navigation"

interface VocabularyQuestion {
  id: number
  word: string
  context: string
  definition: string
  options: string[]
  correct: number
  difficulty: "intermediate" | "advanced" | "expert"
  category: "academic" | "scientific" | "business" | "literary"
  synonyms: string[]
  antonyms: string[]
  usage: string
}

const VOCABULARY_QUESTIONS: VocabularyQuestion[] = [
  {
    id: 1,
    word: "ubiquitous",
    context:
      "In the digital age, smartphones have become ubiquitous, fundamentally altering how we communicate and access information.",
    definition: "Present, appearing, or found everywhere; omnipresent",
    options: ["Rare and valuable", "Present everywhere", "Technologically advanced", "Difficult to use"],
    correct: 1,
    difficulty: "intermediate",
    category: "academic",
    synonyms: ["omnipresent", "pervasive", "widespread", "universal"],
    antonyms: ["rare", "scarce", "limited", "absent"],
    usage: "The ubiquitous nature of social media has transformed modern communication patterns.",
  },
  {
    id: 2,
    word: "paradigm",
    context:
      "The discovery of quantum mechanics represented a fundamental paradigm shift in our understanding of physics, challenging classical Newtonian concepts.",
    definition: "A typical example or pattern of something; a model or framework",
    options: ["A scientific experiment", "A model or framework", "A mathematical equation", "A research method"],
    correct: 1,
    difficulty: "advanced",
    category: "academic",
    synonyms: ["model", "framework", "archetype", "prototype"],
    antonyms: ["anomaly", "exception", "deviation", "irregularity"],
    usage: "The new educational paradigm emphasizes collaborative learning over traditional lecture-based instruction.",
  },
  {
    id: 3,
    word: "ameliorate",
    context:
      "Government policies aimed to ameliorate the economic disparities between urban and rural communities through targeted investment programs.",
    definition: "To make something better; to improve a situation",
    options: ["To make worse", "To improve", "To analyze", "To eliminate"],
    correct: 1,
    difficulty: "advanced",
    category: "academic",
    synonyms: ["improve", "enhance", "better", "upgrade"],
    antonyms: ["worsen", "deteriorate", "aggravate", "exacerbate"],
    usage: "The new medication helped ameliorate the patient's chronic pain symptoms significantly.",
  },
  {
    id: 4,
    word: "ephemeral",
    context:
      "The beauty of cherry blossoms is particularly poignant because of their ephemeral nature, lasting only a few weeks each spring.",
    definition: "Lasting for a very short time; transitory",
    options: ["Permanent and lasting", "Very short-lived", "Extremely beautiful", "Seasonally recurring"],
    correct: 1,
    difficulty: "expert",
    category: "literary",
    synonyms: ["transient", "fleeting", "temporary", "momentary"],
    antonyms: ["permanent", "enduring", "lasting", "eternal"],
    usage: "Social media trends are often ephemeral, gaining popularity quickly but fading just as fast.",
  },
  {
    id: 5,
    word: "juxtaposition",
    context:
      "The artist's work creates a striking juxtaposition between modern urban landscapes and traditional rural imagery, highlighting societal contrasts.",
    definition: "The fact of two things being seen or placed close together with contrasting effect",
    options: ["Combination of elements", "Placement for contrast", "Artistic technique", "Visual similarity"],
    correct: 1,
    difficulty: "expert",
    category: "academic",
    synonyms: ["contrast", "comparison", "opposition", "antithesis"],
    antonyms: ["similarity", "harmony", "uniformity", "consistency"],
    usage: "The juxtaposition of wealth and poverty in the city center was particularly striking to visitors.",
  },
  {
    id: 6,
    word: "proliferate",
    context:
      "With the advent of the internet, online learning platforms began to proliferate, offering diverse educational opportunities to global audiences.",
    definition: "To increase rapidly in numbers; multiply",
    options: ["To decrease gradually", "To increase rapidly", "To remain stable", "To improve quality"],
    correct: 1,
    difficulty: "intermediate",
    category: "academic",
    synonyms: ["multiply", "spread", "expand", "flourish"],
    antonyms: ["diminish", "decrease", "decline", "reduce"],
    usage: "Renewable energy technologies have proliferated as environmental concerns have grown.",
  },
  {
    id: 7,
    word: "catalyst",
    context:
      "The economic crisis served as a catalyst for widespread social reform, accelerating changes that had been developing slowly for decades.",
    definition: "A person or thing that precipitates an event or change",
    options: ["A preventive measure", "Something that causes change", "A stabilizing force", "A research tool"],
    correct: 1,
    difficulty: "advanced",
    category: "scientific",
    synonyms: ["trigger", "stimulus", "agent", "facilitator"],
    antonyms: ["inhibitor", "deterrent", "obstacle", "barrier"],
    usage: "The new CEO became a catalyst for innovation within the traditionally conservative company.",
  },
  {
    id: 8,
    word: "dichotomy",
    context:
      "Modern society faces a fundamental dichotomy between the desire for privacy and the convenience of digital connectivity and data sharing.",
    definition: "A division or contrast between two things that are opposed or entirely different",
    options: ["A balanced relationship", "A sharp division", "A gradual transition", "A complex system"],
    correct: 1,
    difficulty: "expert",
    category: "academic",
    synonyms: ["division", "split", "contrast", "opposition"],
    antonyms: ["unity", "harmony", "agreement", "synthesis"],
    usage:
      "There's often a dichotomy between what politicians promise during campaigns and what they deliver in office.",
  },
  {
    id: 9,
    word: "empirical",
    context:
      "The researcher's conclusions were based on empirical evidence gathered through systematic observation and experimentation over several years.",
    definition: "Based on, concerned with, or verifiable by observation or experience rather than theory",
    options: ["Based on theory", "Based on observation", "Based on opinion", "Based on tradition"],
    correct: 1,
    difficulty: "advanced",
    category: "scientific",
    synonyms: ["observational", "experimental", "factual", "evidence-based"],
    antonyms: ["theoretical", "speculative", "hypothetical", "abstract"],
    usage: "Medical treatments must be supported by empirical data before they can be approved for public use.",
  },
  {
    id: 10,
    word: "synthesis",
    context:
      "The professor's lecture provided a brilliant synthesis of various philosophical traditions, creating a coherent framework for understanding ethics.",
    definition: "The combination of ideas to form a theory or system",
    options: [
      "The analysis of parts",
      "The combination of ideas",
      "The criticism of theories",
      "The rejection of concepts",
    ],
    correct: 1,
    difficulty: "advanced",
    category: "academic",
    synonyms: ["combination", "integration", "fusion", "amalgamation"],
    antonyms: ["analysis", "separation", "division", "decomposition"],
    usage: "The research paper presented a synthesis of findings from multiple studies on climate change.",
  },
]

export default function ContextualVocabularyGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [userDefinition, setUserDefinition] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(1800) // 30 minutes
  const [gameComplete, setGameComplete] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (timeLeft > 0 && !gameComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      handleGameComplete()
    }
  }, [timeLeft, gameComplete])

  const handleAnswerSubmit = () => {
    const question = VOCABULARY_QUESTIONS[currentQuestion]
    const isCorrect = selectedAnswer === question.correct

    setShowResult(true)

    if (isCorrect) {
      const basePoints = getDifficultyPoints(question.difficulty)
      const categoryBonus = getCategoryBonus(question.category)
      setScore(score + basePoints + categoryBonus)
    }

    setTimeout(() => {
      if (currentQuestion < VOCABULARY_QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        resetQuestion()
      } else {
        handleGameComplete()
      }
    }, 3000)
  }

  const resetQuestion = () => {
    setSelectedAnswer(null)
    setUserDefinition("")
    setShowResult(false)
    setShowHint(false)
  }

  const getDifficultyPoints = (difficulty: string) => {
    switch (difficulty) {
      case "intermediate":
        return 15
      case "advanced":
        return 25
      case "expert":
        return 35
      default:
        return 15
    }
  }

  const getCategoryBonus = (category: string) => {
    switch (category) {
      case "academic":
        return 5
      case "scientific":
        return 8
      case "business":
        return 6
      case "literary":
        return 10
      default:
        return 0
    }
  }

  const handleGameComplete = () => {
    setGameComplete(true)
    const currentProgress = Number.parseInt(localStorage.getItem("gameProgress") || "0")
    if (currentProgress === 6) {
      localStorage.setItem("gameProgress", "7")
    }
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "academic":
        return "bg-blue-100 text-blue-800"
      case "scientific":
        return "bg-purple-100 text-purple-800"
      case "business":
        return "bg-orange-100 text-orange-800"
      case "literary":
        return "bg-pink-100 text-pink-800"
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
          <h2 className="text-3xl font-bold text-purple-600 mb-4">Vocabulary Master!</h2>
          <div className="text-6xl font-bold text-yellow-500 mb-4">{score}</div>
          <p className="text-gray-600 mb-6">Excellent! You've mastered contextual vocabulary!</p>
          <Button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
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
      gameTitle="Contextual Vocabulary"
      gameIcon={<BookOpen className="text-purple-500" size={32} />}
      instructions={[
        "Read the context sentence carefully to understand word usage",
        "Choose the correct definition based on the context",
        "Pay attention to word difficulty and category",
        "Use hints if needed, but they reduce your score",
        "Master academic, scientific, business, and literary vocabulary",
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
            <Card className="mb-8 shadow-2xl border-4 border-purple-400">
              <CardContent className="p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-2">
                    <Badge className={getDifficultyColor(question.difficulty)}>
                      {question.difficulty.toUpperCase()}
                    </Badge>
                    <Badge className={getCategoryColor(question.category)}>{question.category.toUpperCase()}</Badge>
                  </div>
                  <Badge variant="outline">
                    Question {currentQuestion + 1} of {VOCABULARY_QUESTIONS.length}
                  </Badge>
                </div>

                {/* Word and Context */}
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold text-purple-600 mb-4">{question.word}</h2>
                  <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
                    <h3 className="font-bold text-purple-800 mb-3">Context:</h3>
                    <p className="text-purple-900 text-lg leading-relaxed italic">"{question.context}"</p>
                  </div>
                </div>

                {/* Question */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800">What does "{question.word}" mean in this context?</h3>
                </div>

                {/* Answer Options */}
                <div className="grid grid-cols-1 gap-4 mb-6">
                  {question.options.map((option, index) => {
                    let buttonClass = "p-4 text-left rounded-lg border-2 cursor-pointer transition-all duration-300 "

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
                        selectedAnswer === index
                          ? "bg-purple-100 border-purple-500 text-purple-700"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-purple-50 hover:border-purple-400"
                    }

                    return (
                      <motion.div
                        key={index}
                        onClick={() => !showResult && setSelectedAnswer(index)}
                        className={buttonClass}
                        whileHover={{ scale: showResult ? 1 : 1.02 }}
                        whileTap={{ scale: showResult ? 1 : 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="px-3 py-1">
                            {String.fromCharCode(65 + index)}
                          </Badge>
                          <span className="flex-1">{option}</span>
                          {showResult && index === question.correct && (
                            <CheckCircle className="text-green-500" size={20} />
                          )}
                          {showResult && index === selectedAnswer && index !== question.correct && (
                            <XCircle className="text-red-500" size={20} />
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Hint Button */}
                {!showResult && !showHint && (
                  <div className="text-center mb-6">
                    <Button
                      variant="outline"
                      onClick={() => setShowHint(true)}
                      className="text-orange-600 border-orange-300 hover:bg-orange-50"
                    >
                      💡 Show Hint (-5 points)
                    </Button>
                  </div>
                )}

                {/* Hint */}
                {showHint && !showResult && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg"
                  >
                    <h4 className="font-bold text-orange-800 mb-2">💡 Hint:</h4>
                    <div className="text-orange-700 space-y-2">
                      <p>
                        <strong>Synonyms:</strong> {question.synonyms.join(", ")}
                      </p>
                      <p>
                        <strong>Usage:</strong> {question.usage}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Submit Button */}
                {!showResult && (
                  <div className="text-center">
                    <Button
                      onClick={handleAnswerSubmit}
                      disabled={selectedAnswer === null}
                      size="lg"
                      className="bg-purple-500 hover:bg-purple-600 px-8 py-4"
                    >
                      Submit Answer
                    </Button>
                  </div>
                )}

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
                        <div className="text-green-700 mb-4">
                          +{getDifficultyPoints(question.difficulty)} base points +{" "}
                          {getCategoryBonus(question.category)} category bonus
                          {showHint && " - 5 hint penalty"}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-red-600 font-bold text-2xl mb-2">❌ Incorrect</div>
                        <div className="text-red-700 mb-4">Correct answer: {question.options[question.correct]}</div>
                      </div>
                    )}

                    {/* Detailed Information */}
                    <div className="bg-blue-50 p-4 rounded-lg text-left">
                      <h4 className="font-bold text-blue-800 mb-3">📖 Word Details:</h4>
                      <div className="text-blue-700 space-y-2 text-sm">
                        <p>
                          <strong>Definition:</strong> {question.definition}
                        </p>
                        <p>
                          <strong>Synonyms:</strong> {question.synonyms.join(", ")}
                        </p>
                        <p>
                          <strong>Antonyms:</strong> {question.antonyms.join(", ")}
                        </p>
                        <p>
                          <strong>Usage Example:</strong> {question.usage}
                        </p>
                      </div>
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
