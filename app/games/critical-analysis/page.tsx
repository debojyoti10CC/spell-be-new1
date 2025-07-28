"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Brain } from "lucide-react"
import GameLayout from "@/components/game-layout"
import { useRouter } from "next/navigation"

interface AnalysisTask {
  id: number
  title: string
  type: "argument-evaluation" | "fallacy-identification" | "evidence-assessment" | "bias-detection"
  passage: string
  question: string
  options?: string[]
  correctAnswer: string | number
  explanation: string
  difficulty: "intermediate" | "advanced" | "expert"
}

const ANALYSIS_TASKS: AnalysisTask[] = [
  {
    id: 1,
    title: "Evaluating Logical Arguments",
    type: "argument-evaluation",
    difficulty: "intermediate",
    passage: `The government should ban all social media platforms because they are harmful to society. Studies show that social media use is linked to depression and anxiety among teenagers. Furthermore, social media spreads misinformation rapidly, leading to public confusion about important issues like health and politics. Additionally, these platforms collect personal data without users' full understanding, violating privacy rights. Therefore, a complete ban is the only solution to protect citizens from these dangers.`,
    question: "What is the primary weakness in this argument's reasoning?",
    options: [
      "The argument lacks sufficient evidence to support its claims",
      "The conclusion is too extreme compared to the problems identified",
      "The argument ignores potential benefits of social media",
      "All of the above represent significant weaknesses",
    ],
    correctAnswer: 3,
    explanation:
      "The argument suffers from multiple logical flaws: it presents limited evidence, proposes an extreme solution (complete ban) that doesn't match the severity of problems identified, and completely ignores any potential benefits or alternative solutions.",
  },
  {
    id: 2,
    title: "Identifying Logical Fallacies",
    type: "fallacy-identification",
    difficulty: "advanced",
    passage: `"Professor Johnson argues that we should increase funding for renewable energy research. However, Professor Johnson drives a gas-guzzling SUV and lives in a mansion that consumes enormous amounts of electricity. How can we trust someone who doesn't practice what they preaches? Clearly, his argument for renewable energy funding is invalid because of his hypocritical lifestyle choices."`,
    question: "Which logical fallacy is primarily demonstrated in this passage?",
    options: ["Straw man fallacy", "Ad hominem fallacy", "False dilemma", "Appeal to authority"],
    correctAnswer: 1,
    explanation:
      "This is a classic ad hominem fallacy, where the argument attacks Professor Johnson's personal character and lifestyle rather than addressing the merits of his argument about renewable energy funding. The validity of an argument should be judged on its evidence and reasoning, not on the personal characteristics of the person making it.",
  },
  {
    id: 3,
    title: "Assessing Evidence Quality",
    type: "evidence-assessment",
    difficulty: "expert",
    passage: `A recent study claims that listening to classical music increases IQ scores by 15 points. The research was conducted by Dr. Smith, who surveyed 50 college students. Half the students listened to Mozart for 30 minutes daily for two weeks, while the other half listened to no music. The Mozart group showed improved performance on spatial reasoning tests. The study was funded by the Classical Music Foundation and published in the Journal of Musical Intelligence, a publication owned by the same foundation.`,
    question: "What are the most significant methodological concerns with this study?",
    correctAnswer:
      "The study has multiple serious flaws: extremely small sample size (50 students), potential funding bias from the Classical Music Foundation, publication in a journal owned by the same foundation creating conflict of interest, lack of proper control group (silence vs. other music types), and overgeneralization from spatial reasoning to overall IQ.",
    explanation:
      "This study demonstrates several critical research flaws that undermine its credibility: inadequate sample size, clear conflicts of interest in funding and publication, poor experimental design with an inappropriate control group, and unjustified extrapolation from limited cognitive measures to broad IQ claims.",
  },
  {
    id: 4,
    title: "Detecting Cognitive Bias",
    type: "bias-detection",
    difficulty: "expert",
    passage: `"I've been investing in cryptocurrency for three years, and I've made substantial profits. Last month alone, I earned $5,000 from Bitcoin trading. My friend Sarah also made $2,000 in just two weeks. Another colleague, Mike, doubled his investment in Ethereum. Based on these experiences, I'm confident that cryptocurrency is a guaranteed way to make money. Anyone who doesn't invest in crypto is missing out on easy profits. The few people I know who lost money simply didn't understand the market properly or invested at the wrong time."`,
    question: "Which cognitive biases are most evident in this reasoning?",
    options: [
      "Confirmation bias and survivorship bias",
      "Availability heuristic and overconfidence bias",
      "Anchoring bias and loss aversion",
      "Both A and B demonstrate significant bias",
    ],
    correctAnswer: 3,
    explanation:
      "This passage demonstrates multiple cognitive biases: confirmation bias (focusing only on success stories), survivorship bias (ignoring those who lost money), availability heuristic (using easily recalled examples), and overconfidence bias (claiming guaranteed profits). The speaker dismisses losses as user error rather than market risk.",
  },
]

export default function CriticalAnalysisGame() {
  const [currentTask, setCurrentTask] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(1800) // 30 minutes
  const [gameComplete, setGameComplete] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [answered, setAnswered] = useState(false)
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
    const task = ANALYSIS_TASKS[currentTask]
    let isCorrect = false

    if (task.options) {
      isCorrect = selectedOption === task.correctAnswer
    } else {
      // For open-ended questions, check if key concepts are mentioned
      const answer = userAnswer.toLowerCase()
      const correctAnswer = task.correctAnswer.toString().toLowerCase()
      isCorrect =
        answer.includes("sample size") ||
        answer.includes("bias") ||
        answer.includes("conflict of interest") ||
        answer.includes("control group")
    }

    setAnswered(true)
    setShowResult(true)

    if (isCorrect) {
      const points = getDifficultyPoints(task.difficulty)
      setScore(score + points)
    }

    setTimeout(() => {
      if (currentTask < ANALYSIS_TASKS.length - 1) {
        setCurrentTask(currentTask + 1)
        setUserAnswer("")
        setSelectedOption(null)
        setShowResult(false)
        setAnswered(false)
      } else {
        handleGameComplete()
      }
    }, 4000)
  }

  const getDifficultyPoints = (difficulty: string) => {
    switch (difficulty) {
      case "intermediate":
        return 25
      case "advanced":
        return 35
      case "expert":
        return 50
      default:
        return 25
    }
  }

  const handleGameComplete = () => {
    setGameComplete(true)
    const currentProgress = Number.parseInt(localStorage.getItem("gameProgress") || "0")
    if (currentProgress === 4) {
      localStorage.setItem("gameProgress", "5")
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
          <div className="text-6xl mb-4">🧠</div>
          <h2 className="text-3xl font-bold text-orange-600 mb-4">Critical Thinker!</h2>
          <div className="text-6xl font-bold text-yellow-500 mb-4">{score}</div>
          <p className="text-gray-600 mb-6">Excellent! You've mastered critical analysis skills!</p>
          <Button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            Back to Home
          </Button>
        </motion.div>
      </div>
    )
  }

  const task = ANALYSIS_TASKS[currentTask]

  return (
    <GameLayout
      gameTitle="Critical Analysis"
      gameIcon={<Brain className="text-orange-500" size={32} />}
      instructions={[
        "Read each passage carefully and analyze the reasoning",
        "Identify logical fallacies, biases, and weak arguments",
        "Evaluate the quality of evidence presented",
        "Provide thoughtful analysis of the text's strengths and weaknesses",
        "Think critically about assumptions and conclusions",
      ]}
      onGameComplete={handleGameComplete}
      currentQuestion={currentTask + 1}
      totalQuestions={ANALYSIS_TASKS.length}
      score={score}
      timeLeft={timeLeft}
    >
      <div className="max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTask}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mb-8 shadow-2xl border-4 border-orange-400">
              <CardContent className="p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-2">
                    <Badge className={getDifficultyColor(task.difficulty)}>{task.difficulty.toUpperCase()}</Badge>
                    <Badge variant="outline">{task.type.replace("-", " ").toUpperCase()}</Badge>
                  </div>
                  <Badge variant="outline">Time: {formatTime(timeLeft)}</Badge>
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">{task.title}</h2>

                {/* Passage */}
                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                  <h3 className="font-bold text-gray-800 mb-4">Passage to Analyze:</h3>
                  <p className="text-gray-700 leading-relaxed italic">"{task.passage}"</p>
                </div>

                {/* Question */}
                <div className="bg-blue-50 p-6 rounded-lg mb-8">
                  <h3 className="font-bold text-blue-800 mb-3">Analysis Question:</h3>
                  <p className="text-blue-700 text-lg">{task.question}</p>
                </div>

                {/* Answer Section */}
                {!answered && (
                  <div className="mb-6">
                    {task.options ? (
                      <div className="grid grid-cols-1 gap-4">
                        {task.options.map((option, index) => (
                          <motion.div
                            key={index}
                            onClick={() => setSelectedOption(index)}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                              selectedOption === index
                                ? "border-orange-500 bg-orange-50"
                                : "border-gray-300 hover:border-orange-400 hover:bg-orange-50"
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-start gap-3">
                              <Badge variant="outline" className="mt-1">
                                {String.fromCharCode(65 + index)}
                              </Badge>
                              <span className="text-gray-700">{option}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-bold text-gray-800 mb-3">Your Analysis:</h4>
                        <Textarea
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          placeholder="Provide a detailed critical analysis addressing the question above..."
                          className="min-h-32 text-base leading-relaxed"
                        />
                        <p className="text-sm text-gray-600 mt-2">
                          Minimum 100 words. Consider evidence quality, logical reasoning, potential biases, and
                          methodological issues.
                        </p>
                      </div>
                    )}

                    <div className="text-center mt-6">
                      <Button
                        onClick={handleSubmit}
                        disabled={task.options ? selectedOption === null : userAnswer.trim().length < 50}
                        size="lg"
                        className="bg-orange-500 hover:bg-orange-600 px-8 py-4"
                      >
                        Submit Analysis
                      </Button>
                    </div>
                  </div>
                )}

                {/* Result */}
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-gray-50 rounded-lg"
                  >
                    <div className="text-center mb-4">
                      {(task.options && selectedOption === task.correctAnswer) ||
                      (!task.options && userAnswer.length >= 50) ? (
                        <div>
                          <div className="text-green-600 font-bold text-2xl mb-2">🎯 Excellent Analysis!</div>
                          <div className="text-green-700">+{getDifficultyPoints(task.difficulty)} points</div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-orange-600 font-bold text-2xl mb-2">📝 Good Effort!</div>
                          <div className="text-orange-700">Keep practicing critical thinking skills</div>
                        </div>
                      )}
                    </div>

                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-bold text-gray-800 mb-2">Expert Analysis:</h4>
                      <p className="text-gray-700 leading-relaxed">{task.explanation}</p>
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
