"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Headphones } from "lucide-react"
import GameLayout from "@/components/game-layout"
import { useRouter } from "next/navigation"

interface ListeningTask {
  id: number
  title: string
  type: "lecture" | "conversation" | "interview" | "presentation"
  difficulty: "intermediate" | "advanced" | "expert"
  transcript: string
  audioDescription: string
  questions: {
    question: string
    type: "multiple-choice" | "fill-blank" | "short-answer" | "true-false"
    options?: string[]
    correct: string | number
    timeStamp?: string
  }[]
  duration: number // in seconds
}

const LISTENING_TASKS: ListeningTask[] = [
  {
    id: 1,
    title: "University Lecture: Climate Change Economics",
    type: "lecture",
    difficulty: "intermediate",
    duration: 180,
    audioDescription:
      "Professor discusses the economic implications of climate change, including carbon pricing, green investments, and policy frameworks.",
    transcript: `Good morning, everyone. Today we're going to explore the fascinating intersection between climate science and economics. Now, when we talk about climate change, we often focus on the environmental aspects, but there's a crucial economic dimension that's equally important to understand.

First, let's consider the concept of carbon pricing. This is essentially putting a price on carbon emissions to reflect their true cost to society. There are two main approaches: carbon taxes and cap-and-trade systems. Carbon taxes directly price carbon by defining a tax rate on greenhouse gas emissions. Cap-and-trade systems, on the other hand, set a limit on emissions and allow companies to trade emission allowances.

The European Union's Emissions Trading System is a prime example of cap-and-trade in action. Since its launch in 2005, it has covered approximately 40% of the EU's greenhouse gas emissions. The system has faced challenges, particularly in its early years when carbon prices were too low to incentivize significant behavioral change. However, recent reforms have strengthened the system considerably.

Now, let's talk about green investments. The transition to a low-carbon economy requires massive capital investment. The International Energy Agency estimates that achieving net-zero emissions by 2050 will require annual clean energy investment to triple by 2030. This presents both challenges and opportunities for investors and policymakers alike.`,
    questions: [
      {
        question: "What are the two main approaches to carbon pricing mentioned in the lecture?",
        type: "multiple-choice",
        options: [
          "Carbon taxes and green bonds",
          "Carbon taxes and cap-and-trade systems",
          "Cap-and-trade and carbon credits",
          "Green investments and carbon offsets",
        ],
        correct: 1,
        timeStamp: "0:45",
      },
      {
        question: "What percentage of EU greenhouse gas emissions does the Emissions Trading System cover?",
        type: "fill-blank",
        correct: "40",
        timeStamp: "1:30",
      },
      {
        question:
          "According to the International Energy Agency, clean energy investment needs to _____ by 2030 to achieve net-zero emissions by 2050.",
        type: "fill-blank",
        correct: "triple",
        timeStamp: "2:45",
      },
    ],
  },
  {
    id: 2,
    title: "Academic Interview: Research Methodology",
    type: "interview",
    difficulty: "advanced",
    duration: 240,
    audioDescription:
      "Interview between a graduate student and professor discussing qualitative vs quantitative research methods in social sciences.",
    transcript: `Interviewer: Thank you for joining us today, Dr. Martinez. Could you explain the fundamental differences between qualitative and quantitative research methodologies?

Dr. Martinez: The distinction is quite fundamental to how we approach research in the social sciences. Quantitative research is primarily concerned with measuring and quantifying phenomena. It relies heavily on statistical analysis, large sample sizes, and seeks to establish generalizable patterns or relationships. Think of surveys with hundreds or thousands of respondents, or experimental studies with control groups.

Qualitative research, on the other hand, is more exploratory and interpretive. It focuses on understanding the meaning, context, and subjective experiences of participants. Methods include in-depth interviews, focus groups, ethnographic observation, and case studies. The sample sizes are typically much smaller, but the data collected is much richer and more detailed.

Interviewer: How do researchers decide which approach to use?

Dr. Martinez: The choice depends largely on your research question and what you're trying to achieve. If you want to know "how many" or "how much," or if you're testing a specific hypothesis, quantitative methods are usually more appropriate. If you want to understand "why" or "how" something happens, or explore complex social phenomena, qualitative approaches are often better suited.

Many contemporary researchers advocate for mixed-methods approaches, combining both quantitative and qualitative elements. This triangulation can provide a more comprehensive understanding of complex research problems.`,
    questions: [
      {
        question: "According to Dr. Martinez, what is the primary concern of quantitative research?",
        type: "multiple-choice",
        options: [
          "Understanding subjective experiences",
          "Measuring and quantifying phenomena",
          "Conducting ethnographic observations",
          "Exploring complex social contexts",
        ],
        correct: 1,
        timeStamp: "0:30",
      },
      {
        question: "What type of research would be most appropriate for understanding 'why' something happens?",
        type: "multiple-choice",
        options: ["Quantitative research", "Statistical analysis", "Qualitative research", "Survey research"],
        correct: 2,
        timeStamp: "2:15",
      },
      {
        question:
          "Dr. Martinez mentions that many researchers advocate for _____ approaches that combine both methodologies.",
        type: "fill-blank",
        correct: "mixed-methods",
        timeStamp: "3:30",
      },
    ],
  },
  {
    id: 3,
    title: "Academic Presentation: Artificial Intelligence Ethics",
    type: "presentation",
    difficulty: "expert",
    duration: 300,
    audioDescription:
      "Graduate student presentation on ethical considerations in AI development, including bias, transparency, and accountability.",
    transcript: `Good afternoon, everyone. Today I'll be presenting on one of the most pressing issues in contemporary technology: the ethical implications of artificial intelligence development.

As AI systems become increasingly sophisticated and ubiquitous, we face unprecedented ethical challenges that require careful consideration from multiple perspectives. The first major concern is algorithmic bias. AI systems learn from data, and if that data reflects historical biases or systemic inequalities, the AI will perpetuate and potentially amplify these biases.

A striking example is the case of facial recognition systems that have shown significantly higher error rates for women and people of color. This isn't just a technical problem—it has real-world consequences when these systems are used in hiring, law enforcement, or healthcare decisions.

The second critical issue is transparency and explainability. Many modern AI systems, particularly deep learning models, operate as "black boxes." Even their creators cannot fully explain how they arrive at specific decisions. This lack of transparency becomes problematic when AI systems make decisions that significantly impact people's lives.

Consider the use of AI in medical diagnosis or criminal justice risk assessment. If we cannot understand how these systems reach their conclusions, how can we ensure they are fair, accurate, and accountable? This leads us to our third major concern: accountability.

When an AI system makes a mistake or causes harm, who is responsible? Is it the programmer, the company that deployed the system, the user who relied on its output, or somehow the AI system itself? This question becomes increasingly complex as AI systems become more autonomous and their decision-making processes become more opaque.

Furthermore, we must consider the broader societal implications. AI has the potential to exacerbate existing inequalities if access to AI benefits is unevenly distributed. There's also the question of job displacement and the need for social safety nets as AI automates various forms of work.

Moving forward, I believe we need a multi-stakeholder approach involving technologists, ethicists, policymakers, and affected communities to develop frameworks for responsible AI development and deployment.`,
    questions: [
      {
        question: "What is the primary cause of algorithmic bias according to the presentation?",
        type: "multiple-choice",
        options: [
          "Poor programming techniques",
          "Insufficient computing power",
          "Biased training data reflecting historical inequalities",
          "Lack of diverse development teams",
        ],
        correct: 2,
        timeStamp: "1:15",
      },
      {
        question:
          "The presenter describes modern AI systems as operating like '_____' because their decision-making processes cannot be fully explained.",
        type: "fill-blank",
        correct: "black boxes",
        timeStamp: "2:30",
      },
      {
        question:
          "According to the presentation, facial recognition systems have shown higher error rates for which groups?",
        type: "short-answer",
        correct: "women and people of color",
        timeStamp: "1:45",
      },
      {
        question: "The presenter believes that responsible AI development requires a multi-stakeholder approach.",
        type: "true-false",
        correct: "true",
        timeStamp: "4:45",
      },
    ],
  },
]

export default function ListeningSkillsGame() {
  const [currentTask, setCurrentTask] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(1500) // 25 minutes
  const [gameComplete, setGameComplete] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioProgress, setAudioProgress] = useState(0)
  const [showTranscript, setShowTranscript] = useState(false)
  const [listeningPhase, setListeningPhase] = useState(true)
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
    if (isPlaying && listeningPhase) {
      const interval = setInterval(() => {
        setAudioProgress((prev) => {
          const newProgress = prev + 1
          if (newProgress >= LISTENING_TASKS[currentTask].duration) {
            setIsPlaying(false)
            setListeningPhase(false)
            return LISTENING_TASKS[currentTask].duration
          }
          return newProgress
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isPlaying, listeningPhase, currentTask])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleAnswerSubmit = () => {
    const task = LISTENING_TASKS[currentTask]
    const question = task.questions[currentQuestion]
    let isCorrect = false

    if (question.type === "multiple-choice") {
      isCorrect = selectedAnswer === question.correct
    } else if (question.type === "fill-blank" || question.type === "short-answer") {
      isCorrect = userAnswer.toLowerCase().trim() === question.correct.toString().toLowerCase()
    } else if (question.type === "true-false") {
      isCorrect = userAnswer.toLowerCase() === question.correct.toString().toLowerCase()
    }

    setShowResult(true)

    if (isCorrect) {
      const basePoints = getDifficultyPoints(task.difficulty)
      const questionTypeBonus = getQuestionTypeBonus(question.type)
      setScore(score + basePoints + questionTypeBonus)
    }

    setTimeout(() => {
      if (currentQuestion < task.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        resetQuestion()
      } else if (currentTask < LISTENING_TASKS.length - 1) {
        setCurrentTask(currentTask + 1)
        setCurrentQuestion(0)
        setListeningPhase(true)
        setAudioProgress(0)
        resetQuestion()
      } else {
        handleGameComplete()
      }
    }, 3000)
  }

  const resetQuestion = () => {
    setUserAnswer("")
    setSelectedAnswer(null)
    setShowResult(false)
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
      case "multiple-choice":
        return 5
      case "fill-blank":
        return 8
      case "short-answer":
        return 10
      case "true-false":
        return 3
      default:
        return 0
    }
  }

  const handleGameComplete = () => {
    setGameComplete(true)
    const currentProgress = Number.parseInt(localStorage.getItem("gameProgress") || "0")
    if (currentProgress === 3) {
      localStorage.setItem("gameProgress", "4")
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case "lecture":
        return "bg-blue-100 text-blue-800"
      case "conversation":
        return "bg-green-100 text-green-800"
      case "interview":
        return "bg-purple-100 text-purple-800"
      case "presentation":
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
          <div className="text-6xl mb-4">🎧</div>
          <h2 className="text-3xl font-bold text-indigo-600 mb-4">Listening Master!</h2>
          <div className="text-6xl font-bold text-yellow-500 mb-4">{score}</div>
          <p className="text-gray-600 mb-6">Excellent! You've mastered academic listening skills!</p>
          <Button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
          >
            Back to Home
          </Button>
        </motion.div>
      </div>
    )
  }

  const task = LISTENING_TASKS[currentTask]
  const question = task.questions[currentQuestion]

  // Remove the audio player simulation and replace with text-based approach
  if (listeningPhase) {
    return (
      <GameLayout
        gameTitle="Listening Skills"
        gameIcon={<Headphones className="text-indigo-500" size={32} />}
        instructions={[
          "Read the transcript carefully and take notes",
          "Study the academic content and key details",
          "Pay attention to main ideas and supporting arguments",
          "After reading, you'll answer comprehension questions",
          "Focus on understanding academic vocabulary and concepts",
        ]}
        onGameComplete={handleGameComplete}
        currentQuestion={currentTask + 1}
        totalQuestions={LISTENING_TASKS.length}
        score={score}
        timeLeft={timeLeft}
      >
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8 shadow-2xl border-4 border-indigo-400">
            <CardContent className="p-8">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                  <Badge className={getDifficultyColor(task.difficulty)}>{task.difficulty.toUpperCase()}</Badge>
                  <Badge className={getTypeColor(task.type)}>{task.type.toUpperCase()}</Badge>
                </div>
                <Badge variant="outline">Academic Reading Task</Badge>
              </div>

              {/* Title and Description */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">{task.title}</h2>
                <p className="text-lg text-gray-600">{task.audioDescription}</p>
              </div>

              {/* Reading Content */}
              <div className="bg-blue-50 rounded-lg p-6 mb-6 border-2 border-blue-200">
                <h3 className="font-bold text-blue-800 mb-4 text-xl">📖 Academic Text:</h3>
                <div className="text-blue-900 leading-relaxed space-y-4 max-h-96 overflow-y-auto">
                  {task.transcript.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="text-justify">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Study Timer */}
              <div className="text-center mb-6">
                <div className="bg-indigo-100 rounded-lg p-4 inline-block">
                  <p className="text-indigo-800 font-medium">📚 Study Time Recommended: 3-5 minutes</p>
                  <p className="text-indigo-600 text-sm">Take notes and identify key concepts</p>
                </div>
              </div>

              {/* Continue Button */}
              <div className="text-center">
                <Button onClick={() => setListeningPhase(false)} size="lg" className="bg-green-500 hover:bg-green-600">
                  Continue to Questions ({task.questions.length} questions)
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
      gameTitle="Listening Skills"
      gameIcon={<Headphones className="text-indigo-500" size={32} />}
      instructions={[
        "Answer questions based on what you heard",
        "Choose the best answer or fill in the blanks",
        "You can review the transcript if needed",
        "Different question types give different points",
      ]}
      onGameComplete={handleGameComplete}
      currentQuestion={`${currentTask + 1}.${currentQuestion + 1}`}
      totalQuestions={`${LISTENING_TASKS.length} tasks`}
      score={score}
      timeLeft={timeLeft}
    >
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentTask}-${currentQuestion}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mb-8 shadow-2xl border-4 border-indigo-400">
              <CardContent className="p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      Question {currentQuestion + 1} of {task.questions.length}
                    </Badge>
                    {question.timeStamp && <Badge variant="outline">Time: {question.timeStamp}</Badge>}
                  </div>
                  <Button variant="outline" onClick={() => setShowTranscript(!showTranscript)} size="sm">
                    {showTranscript ? "Hide" : "Show"} Transcript
                  </Button>
                </div>

                {/* Question */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{question.question}</h3>
                </div>

                {/* Answer Input */}
                <div className="mb-6">
                  {question.type === "multiple-choice" && question.options && (
                    <div className="grid grid-cols-1 gap-4">
                      {question.options.map((option, index) => {
                        let buttonClass = "p-4 text-left rounded-lg border-2 transition-all duration-300 "

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
                              ? "bg-indigo-100 border-indigo-500 text-indigo-700"
                              : "bg-white border-gray-300 text-gray-700 hover:bg-indigo-50 hover:border-indigo-400 cursor-pointer"
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
                              <span>{option}</span>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  )}

                  {(question.type === "fill-blank" || question.type === "short-answer") && (
                    <div className="max-w-md mx-auto">
                      <Input
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Enter your answer..."
                        className="text-lg text-center py-4"
                        disabled={showResult}
                      />
                    </div>
                  )}

                  {question.type === "true-false" && (
                    <div className="flex justify-center gap-4">
                      {["true", "false"].map((option) => (
                        <Button
                          key={option}
                          onClick={() => setUserAnswer(option)}
                          variant={userAnswer === option ? "default" : "outline"}
                          disabled={showResult}
                          className="px-8 py-4 text-lg"
                        >
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                {!showResult && (
                  <div className="text-center">
                    <Button
                      onClick={handleAnswerSubmit}
                      disabled={
                        (question.type === "multiple-choice" && selectedAnswer === null) ||
                        ((question.type === "fill-blank" ||
                          question.type === "short-answer" ||
                          question.type === "true-false") &&
                          !userAnswer.trim())
                      }
                      size="lg"
                      className="bg-indigo-500 hover:bg-indigo-600 px-8 py-4"
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
                    {(question.type === "multiple-choice" && selectedAnswer === question.correct) ||
                    ((question.type === "fill-blank" ||
                      question.type === "short-answer" ||
                      question.type === "true-false") &&
                      userAnswer.toLowerCase().trim() === question.correct.toString().toLowerCase()) ? (
                      <div>
                        <div className="text-green-600 font-bold text-2xl mb-2">🎉 Correct!</div>
                        <div className="text-green-700">
                          +{getDifficultyPoints(task.difficulty)} base points + {getQuestionTypeBonus(question.type)}{" "}
                          type bonus
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-red-600 font-bold text-2xl mb-2">❌ Incorrect</div>
                        <div className="text-red-700">
                          Correct answer:{" "}
                          {question.type === "multiple-choice" && question.options
                            ? question.options[question.correct as number]
                            : question.correct}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Transcript */}
                {showTranscript && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-6 p-6 bg-yellow-50 border border-yellow-200 rounded-lg"
                  >
                    <h3 className="font-bold text-yellow-800 mb-3">Transcript:</h3>
                    <div className="text-yellow-700 leading-relaxed max-h-48 overflow-y-auto text-sm">
                      {task.transcript.split("\n\n").map((paragraph, index) => (
                        <p key={index} className="mb-3 last:mb-0">
                          {paragraph}
                        </p>
                      ))}
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
