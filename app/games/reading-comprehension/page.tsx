"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText } from "lucide-react"
import GameLayout from "@/components/game-layout"
import { useRouter } from "next/navigation"

interface ReadingPassage {
  id: number
  title: string
  passage: string
  questions: {
    question: string
    options: string[]
    correct: number
    type: "main-idea" | "detail" | "inference" | "vocabulary"
  }[]
  difficulty: "intermediate" | "advanced" | "expert"
  topic: string
}

const READING_PASSAGES: ReadingPassage[] = [
  {
    id: 1,
    title: "The Impact of Artificial Intelligence on Modern Education",
    topic: "Technology & Education",
    difficulty: "intermediate",
    passage: `Artificial Intelligence (AI) is revolutionizing the educational landscape in unprecedented ways. Traditional classroom settings are being transformed through adaptive learning platforms that personalize instruction based on individual student needs. These systems analyze learning patterns, identify knowledge gaps, and adjust content delivery accordingly.

Machine learning algorithms can now predict which students are at risk of falling behind, enabling educators to intervene proactively. Furthermore, AI-powered tutoring systems provide 24/7 support, offering explanations and practice problems tailored to each learner's pace and style.

However, the integration of AI in education raises important questions about data privacy, the role of human teachers, and the potential for increased educational inequality. While AI can democratize access to quality education, it also requires significant technological infrastructure that may not be available in all communities.

The future of education will likely involve a hybrid model where AI enhances rather than replaces human instruction, creating more efficient and effective learning environments for students worldwide.`,
    questions: [
      {
        question: "What is the main idea of this passage?",
        options: [
          "AI will completely replace human teachers",
          "AI is transforming education with both benefits and challenges",
          "Traditional education is superior to AI-based learning",
          "AI technology is too expensive for schools",
        ],
        correct: 1,
        type: "main-idea",
      },
      {
        question: "According to the passage, how do adaptive learning platforms work?",
        options: [
          "They replace all textbooks with digital content",
          "They analyze learning patterns and adjust content delivery",
          "They only work with advanced students",
          "They eliminate the need for homework",
        ],
        correct: 1,
        type: "detail",
      },
      {
        question: "What can be inferred about the future of education from this passage?",
        options: [
          "Human teachers will become obsolete",
          "AI will only be used in wealthy schools",
          "A combination of AI and human instruction will be most effective",
          "Traditional methods will completely disappear",
        ],
        correct: 2,
        type: "inference",
      },
    ],
  },
  {
    id: 2,
    title: "Climate Change and Urban Planning",
    topic: "Environment & Urban Development",
    difficulty: "advanced",
    passage: `Urban planners worldwide are grappling with the multifaceted challenges posed by climate change. Rising sea levels, increased frequency of extreme weather events, and shifting precipitation patterns necessitate a fundamental reimagining of city design and infrastructure.

The concept of "resilient cities" has emerged as a paradigm for sustainable urban development. These cities incorporate green infrastructure, such as permeable pavements and urban forests, to mitigate flooding and reduce the urban heat island effect. Additionally, they prioritize renewable energy sources and implement comprehensive waste management systems.

Copenhagen serves as an exemplary model, having committed to becoming carbon-neutral by 2025. The city has invested heavily in cycling infrastructure, district heating systems, and green roofs. Such initiatives not only address environmental concerns but also enhance quality of life for residents.

However, the transition to climate-resilient urban planning requires substantial financial investment and political will. Developing nations, in particular, face the dual challenge of rapid urbanization and limited resources, making sustainable development more complex to achieve.`,
    questions: [
      {
        question: "What does the term 'resilient cities' refer to in this context?",
        options: [
          "Cities that can withstand economic downturns",
          "Cities designed to adapt to and mitigate climate change effects",
          "Cities with strong military defenses",
          "Cities that resist technological change",
        ],
        correct: 1,
        type: "vocabulary",
      },
      {
        question: "Which specific example does the passage provide of successful climate-resilient planning?",
        options: [
          "Tokyo's earthquake preparedness",
          "New York's subway system",
          "Copenhagen's carbon-neutral commitment",
          "London's financial district",
        ],
        correct: 2,
        type: "detail",
      },
      {
        question: "What challenge do developing nations face according to the passage?",
        options: [
          "Lack of interest in environmental issues",
          "Too much available land for development",
          "Rapid urbanization combined with limited resources",
          "Excessive government regulation",
        ],
        correct: 2,
        type: "detail",
      },
    ],
  },
  {
    id: 3,
    title: "The Psychology of Decision-Making in Consumer Behavior",
    topic: "Psychology & Economics",
    difficulty: "expert",
    passage: `Consumer decision-making is a complex psychological process influenced by cognitive biases, emotional responses, and social factors. The traditional economic model assumes rational actors who make decisions based solely on utility maximization, but behavioral economics has revealed the limitations of this assumption.

Cognitive biases such as anchoring, where individuals rely heavily on the first piece of information encountered, significantly impact purchasing decisions. The availability heuristic leads consumers to overestimate the likelihood of events that are easily recalled, often due to recent media exposure or personal experience.

Social proof, the tendency to follow others' behavior when uncertain, plays a crucial role in consumer choices. This phenomenon is amplified in the digital age through online reviews, social media influence, and algorithmic recommendations that create echo chambers of consumer preferences.

Furthermore, the paradox of choice suggests that while some options are beneficial, too many choices can lead to decision paralysis and decreased satisfaction. Companies have learned to exploit these psychological tendencies through strategic marketing techniques, including limited-time offers that create artificial scarcity and social media campaigns that leverage peer influence.

Understanding these mechanisms is essential for both consumers seeking to make informed decisions and policymakers working to protect consumer welfare in an increasingly complex marketplace.`,
    questions: [
      {
        question: "What is the main argument against the traditional economic model of consumer behavior?",
        options: [
          "Consumers always make rational decisions",
          "Economic factors are the only influence on purchasing",
          "Psychological factors significantly influence decision-making",
          "Social media has no impact on consumer choices",
        ],
        correct: 2,
        type: "main-idea",
      },
      {
        question: "What does 'anchoring' refer to in the context of consumer psychology?",
        options: [
          "Securing products to prevent theft",
          "Relying heavily on the first piece of information encountered",
          "Comparing prices across multiple stores",
          "Making decisions based on brand loyalty",
        ],
        correct: 1,
        type: "vocabulary",
      },
      {
        question: "What can be inferred about the 'paradox of choice'?",
        options: [
          "More choices always lead to better decisions",
          "Consumers prefer to have no choices at all",
          "An optimal number of choices exists for consumer satisfaction",
          "Choice has no impact on consumer behavior",
        ],
        correct: 2,
        type: "inference",
      },
    ],
  },
]

export default function ReadingComprehensionGame() {
  const [currentPassage, setCurrentPassage] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(1800) // 30 minutes
  const [gameComplete, setGameComplete] = useState(false)
  const [showPassage, setShowPassage] = useState(true)
  const [readingTime, setReadingTime] = useState(0)
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
    if (showPassage) {
      const timer = setInterval(() => setReadingTime((prev) => prev + 1), 1000)
      return () => clearInterval(timer)
    }
  }, [showPassage])

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return

    setSelectedAnswer(answerIndex)
    setShowResult(true)

    const passage = READING_PASSAGES[currentPassage]
    const question = passage.questions[currentQuestion]
    const isCorrect = answerIndex === question.correct

    if (isCorrect) {
      const basePoints = getDifficultyPoints(passage.difficulty)
      const questionTypeBonus = getQuestionTypeBonus(question.type)
      setScore(score + basePoints + questionTypeBonus)
    }

    setTimeout(() => {
      if (currentQuestion < passage.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      } else if (currentPassage < READING_PASSAGES.length - 1) {
        setCurrentPassage(currentPassage + 1)
        setCurrentQuestion(0)
        setSelectedAnswer(null)
        setShowResult(false)
        setShowPassage(true)
        setReadingTime(0)
      } else {
        handleGameComplete()
      }
    }, 3000)
  }

  const getDifficultyPoints = (difficulty: string) => {
    switch (difficulty) {
      case "intermediate":
        return 15
      case "advanced":
        return 20
      case "expert":
        return 25
      default:
        return 15
    }
  }

  const getQuestionTypeBonus = (type: string) => {
    switch (type) {
      case "main-idea":
        return 5
      case "inference":
        return 10
      case "vocabulary":
        return 7
      case "detail":
        return 3
      default:
        return 0
    }
  }

  const handleGameComplete = () => {
    setGameComplete(true)
    const currentProgress = Number.parseInt(localStorage.getItem("gameProgress") || "0")
    if (currentProgress === 1) {
      localStorage.setItem("gameProgress", "2")
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

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case "main-idea":
        return "bg-blue-100 text-blue-800"
      case "detail":
        return "bg-green-100 text-green-800"
      case "inference":
        return "bg-purple-100 text-purple-800"
      case "vocabulary":
        return "bg-orange-100 text-orange-800"
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
          <div className="text-6xl mb-4">📖</div>
          <h2 className="text-3xl font-bold text-green-600 mb-4">Reading Master!</h2>
          <div className="text-6xl font-bold text-yellow-500 mb-4">{score}</div>
          <p className="text-gray-600 mb-6">Outstanding! You've mastered reading comprehension!</p>
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

  const passage = READING_PASSAGES[currentPassage]
  const question = passage.questions[currentQuestion]

  if (showPassage) {
    return (
      <GameLayout
        gameTitle="Reading Comprehension"
        gameIcon={<FileText className="text-green-500" size={32} />}
        instructions={[
          "Read each passage carefully and thoroughly",
          "Take your time to understand the main ideas and details",
          "Answer questions about main ideas, details, inferences, and vocabulary",
          "Higher difficulty passages give more points",
          "Complete all passages to master reading comprehension",
        ]}
        onGameComplete={handleGameComplete}
        currentQuestion={currentPassage + 1}
        totalQuestions={READING_PASSAGES.length}
        score={score}
        timeLeft={timeLeft}
      >
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8 shadow-2xl border-4 border-green-400">
            <CardContent className="p-8">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                  <Badge className={getDifficultyColor(passage.difficulty)}>{passage.difficulty.toUpperCase()}</Badge>
                  <Badge variant="outline">{passage.topic}</Badge>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">Reading Time: {formatTime(readingTime)}</Badge>
                  <Badge variant="outline">Time Left: {formatTime(timeLeft)}</Badge>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">{passage.title}</h2>

              {/* Passage */}
              <div className="prose prose-lg max-w-none mb-8">
                <div className="bg-gray-50 p-6 rounded-lg leading-relaxed text-gray-800">
                  {passage.passage.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Continue Button */}
              <div className="text-center">
                <Button
                  onClick={() => setShowPassage(false)}
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-4"
                >
                  Continue to Questions ({passage.questions.length} questions)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </GameLayout>
    )
  }

  return (
    <GameLayout
      gameTitle="Reading Comprehension"
      gameIcon={<FileText className="text-green-500" size={32} />}
      instructions={[
        "Answer questions based on the passage you just read",
        "Choose the best answer from the options provided",
        "Different question types give different bonus points",
        "You can refer back to the passage if needed",
      ]}
      onGameComplete={handleGameComplete}
      currentQuestion={`${currentPassage + 1}.${currentQuestion + 1}`}
      totalQuestions={`${READING_PASSAGES.length} passages`}
      score={score}
      timeLeft={timeLeft}
    >
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentPassage}-${currentQuestion}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mb-8 shadow-2xl border-4 border-green-400">
              <CardContent className="p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-2">
                    <Badge className={getQuestionTypeColor(question.type)}>
                      {question.type.replace("-", " ").toUpperCase()}
                    </Badge>
                    <Badge variant="outline">
                      Question {currentQuestion + 1} of {passage.questions.length}
                    </Badge>
                  </div>
                  <Button variant="outline" onClick={() => setShowPassage(true)} size="sm">
                    Review Passage
                  </Button>
                </div>

                {/* Question */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{question.question}</h3>
                </div>

                {/* Answer Options */}
                <div className="grid grid-cols-1 gap-4 mb-6">
                  {question.options.map((option, index) => {
                    let buttonClass =
                      "p-6 text-lg font-medium rounded-xl border-2 transition-all duration-300 text-left "

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
                        "bg-white border-green-300 text-gray-700 hover:bg-green-50 hover:border-green-500 hover:scale-105 cursor-pointer"
                    }

                    return (
                      <motion.div
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className={buttonClass}
                        whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
                        whileTap={{ scale: selectedAnswer === null ? 0.98 : 1 }}
                      >
                        <div className="flex items-start gap-4">
                          <Badge variant="outline" className="text-lg px-3 py-1 mt-1">
                            {String.fromCharCode(65 + index)}
                          </Badge>
                          <span className="flex-1">{option}</span>
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
                          +{getDifficultyPoints(passage.difficulty)} base points + {getQuestionTypeBonus(question.type)}{" "}
                          type bonus
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-red-600 font-bold text-2xl mb-2">❌ Incorrect</div>
                        <div className="text-red-700">Correct answer: {question.options[question.correct]}</div>
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
