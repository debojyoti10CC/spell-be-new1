"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { PenTool } from "lucide-react"
import GameLayout from "@/components/game-layout"
import { useRouter } from "next/navigation"

interface WritingTask {
  id: number
  type: "essay-structure" | "thesis-statement" | "paragraph-development" | "citation" | "argument-analysis"
  title: string
  prompt: string
  requirements: string[]
  sampleAnswer: string
  rubric: {
    criteria: string
    excellent: string
    good: string
    needs_improvement: string
  }[]
  difficulty: "intermediate" | "advanced" | "expert"
  timeLimit: number // in minutes
}

const WRITING_TASKS: WritingTask[] = [
  {
    id: 1,
    type: "thesis-statement",
    title: "Crafting a Strong Thesis Statement",
    difficulty: "intermediate",
    timeLimit: 15,
    prompt:
      "Write a thesis statement for an essay about the impact of social media on academic performance among university students. Your thesis should present a clear argument and preview your main supporting points.",
    requirements: [
      "Present a clear, debatable argument",
      "Include 2-3 main supporting points",
      "Use academic language and tone",
      "Be specific and focused",
      "Avoid vague generalizations",
    ],
    sampleAnswer:
      "While social media platforms offer valuable educational resources and networking opportunities, excessive social media use among university students significantly impairs academic performance by reducing study time, decreasing attention span during lectures, and creating addictive behavioral patterns that interfere with effective learning strategies.",
    rubric: [
      {
        criteria: "Clarity of Argument",
        excellent: "Presents a crystal-clear, debatable thesis",
        good: "Presents a clear argument with minor ambiguity",
        needs_improvement: "Argument is unclear or not debatable",
      },
      {
        criteria: "Supporting Points",
        excellent: "Includes 2-3 well-integrated supporting points",
        good: "Includes supporting points with adequate integration",
        needs_improvement: "Supporting points are missing or poorly integrated",
      },
      {
        criteria: "Academic Language",
        excellent: "Uses sophisticated academic vocabulary and tone",
        good: "Uses appropriate academic language",
        needs_improvement: "Language is too informal or imprecise",
      },
    ],
  },
  {
    id: 2,
    type: "paragraph-development",
    title: "Developing a Body Paragraph",
    difficulty: "advanced",
    timeLimit: 25,
    prompt:
      "Write a well-developed body paragraph for an essay arguing that renewable energy investment is essential for economic growth. Use the PEEL structure (Point, Evidence, Explanation, Link). Include at least one specific example and proper transitions.",
    requirements: [
      "Start with a clear topic sentence (Point)",
      "Provide specific evidence or examples",
      "Explain how the evidence supports your argument",
      "Link back to the thesis or transition to next point",
      "Use appropriate academic transitions",
      "Maintain formal academic tone throughout",
    ],
    sampleAnswer:
      "Investment in renewable energy technologies creates substantial employment opportunities that drive economic expansion. According to the International Renewable Energy Agency (IRENA), the renewable energy sector employed 13.7 million people globally in 2022, representing a 7% increase from the previous year. This growth is particularly evident in countries like Germany, where the Energiewende policy has generated over 300,000 jobs in wind and solar industries alone. The employment multiplier effect occurs because renewable energy projects require diverse skill sets, from manufacturing and installation to maintenance and research, creating both direct and indirect job opportunities across multiple economic sectors. Furthermore, these positions often offer higher wages than traditional energy jobs and cannot be outsourced, providing stable, long-term economic benefits to local communities. This job creation demonstrates that renewable energy investment functions not merely as an environmental necessity, but as a powerful economic catalyst that strengthens national competitiveness in the global marketplace.",
    rubric: [
      {
        criteria: "PEEL Structure",
        excellent: "Perfect implementation of Point-Evidence-Explanation-Link structure",
        good: "Good use of PEEL with minor structural issues",
        needs_improvement: "PEEL structure is incomplete or poorly executed",
      },
      {
        criteria: "Evidence Quality",
        excellent: "Uses specific, credible, and relevant evidence",
        good: "Uses appropriate evidence with minor relevance issues",
        needs_improvement: "Evidence is vague, irrelevant, or missing",
      },
      {
        criteria: "Analysis Depth",
        excellent: "Provides sophisticated analysis connecting evidence to argument",
        good: "Provides adequate analysis with clear connections",
        needs_improvement: "Analysis is superficial or connections are unclear",
      },
    ],
  },
  {
    id: 3,
    type: "argument-analysis",
    title: "Analyzing and Refuting Counter-arguments",
    difficulty: "expert",
    timeLimit: 30,
    prompt:
      "Write a paragraph that acknowledges and refutes the counter-argument that 'artificial intelligence will eliminate more jobs than it creates.' Your response should demonstrate sophisticated critical thinking by fairly presenting the opposing view before systematically dismantling it with evidence and logical reasoning.",
    requirements: [
      "Fairly and accurately present the counter-argument",
      "Use transition phrases to signal the refutation",
      "Provide multiple lines of evidence against the counter-argument",
      "Address potential weaknesses in your own argument",
      "Demonstrate nuanced understanding of the issue",
      "Maintain respectful but confident tone",
    ],
    sampleAnswer:
      "Critics of artificial intelligence development argue that AI will inevitably eliminate more jobs than it creates, pointing to automation's historical displacement of manufacturing workers and projecting similar devastation across service and knowledge sectors. While this concern merits serious consideration given the rapid advancement of machine learning capabilities, this pessimistic projection fails to account for several crucial economic and historical factors. First, empirical evidence from previous technological revolutions demonstrates that innovation consistently generates new categories of employment even as it eliminates others; the internet, initially feared as a job destroyer, ultimately created entire industries from e-commerce to digital marketing that employ millions globally. Second, current AI limitations in creativity, emotional intelligence, and complex problem-solving ensure that human workers will remain essential in healthcare, education, research, and interpersonal services for the foreseeable future. Most significantly, the World Economic Forum's 2023 Future of Jobs Report indicates that while AI may displace 85 million jobs by 2025, it will simultaneously create 97 million new positions in data analysis, AI engineering, and human-AI collaboration roles. Rather than wholesale job elimination, the evidence suggests AI will catalyze job transformation, requiring proactive retraining programs and educational adaptation but ultimately expanding rather than contracting employment opportunities for workers who adapt to technological change.",
    rubric: [
      {
        criteria: "Counter-argument Presentation",
        excellent: "Fairly and accurately presents opposing viewpoint",
        good: "Presents counter-argument with minor misrepresentation",
        needs_improvement: "Misrepresents or oversimplifies counter-argument",
      },
      {
        criteria: "Refutation Strength",
        excellent: "Provides multiple compelling lines of evidence and reasoning",
        good: "Provides adequate evidence with clear reasoning",
        needs_improvement: "Refutation is weak or poorly supported",
      },
      {
        criteria: "Critical Thinking",
        excellent: "Demonstrates sophisticated analysis and nuanced understanding",
        good: "Shows good analytical thinking with minor gaps",
        needs_improvement: "Analysis is superficial or one-dimensional",
      },
    ],
  },
]

export default function AcademicWritingGame() {
  const [currentTask, setCurrentTask] = useState(0)
  const [userResponse, setUserResponse] = useState("")
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [showRubric, setShowRubric] = useState(false)
  const [showSample, setShowSample] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [feedback, setFeedback] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    if (currentTask < WRITING_TASKS.length) {
      setTimeLeft(WRITING_TASKS[currentTask].timeLimit * 60)
    }
  }, [currentTask])

  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !submitted) {
      handleSubmit()
    }
  }, [timeLeft, submitted])

  const handleSubmit = () => {
    setSubmitted(true)
    const task = WRITING_TASKS[currentTask]

    // Simple scoring based on word count and requirements met
    const wordCount = userResponse.trim().split(/\s+/).length
    const minWords = task.type === "thesis-statement" ? 25 : task.type === "paragraph-development" ? 150 : 200

    let taskScore = 0
    const taskFeedback: string[] = []

    // Word count scoring
    if (wordCount >= minWords) {
      taskScore += 20
      taskFeedback.push("✅ Meets minimum word count requirement")
    } else {
      taskFeedback.push(`❌ Below minimum word count (${wordCount}/${minWords} words)`)
    }

    // Content analysis (simplified)
    const response = userResponse.toLowerCase()

    if (task.type === "thesis-statement") {
      if (response.includes("social media") && (response.includes("academic") || response.includes("performance"))) {
        taskScore += 15
        taskFeedback.push("✅ Addresses the topic appropriately")
      }
      if (response.includes("because") || response.includes("by") || response.includes("through")) {
        taskScore += 10
        taskFeedback.push("✅ Includes supporting reasoning")
      }
    } else if (task.type === "paragraph-development") {
      if (response.includes("renewable energy") && response.includes("economic")) {
        taskScore += 15
        taskFeedback.push("✅ Stays on topic")
      }
      if (
        response.includes("evidence") ||
        response.includes("study") ||
        response.includes("research") ||
        response.includes("%")
      ) {
        taskScore += 10
        taskFeedback.push("✅ Includes evidence or examples")
      }
    } else if (task.type === "argument-analysis") {
      if (response.includes("critics") || response.includes("however") || response.includes("while")) {
        taskScore += 15
        taskFeedback.push("✅ Acknowledges counter-arguments")
      }
      if (response.includes("evidence") || response.includes("research") || response.includes("study")) {
        taskScore += 10
        taskFeedback.push("✅ Provides evidence for refutation")
      }
    }

    // Difficulty bonus
    const difficultyBonus = task.difficulty === "expert" ? 20 : task.difficulty === "advanced" ? 15 : 10
    taskScore += difficultyBonus

    setScore(score + taskScore)
    setFeedback(taskFeedback)
  }

  const nextTask = () => {
    if (currentTask < WRITING_TASKS.length - 1) {
      setCurrentTask(currentTask + 1)
      setUserResponse("")
      setSubmitted(false)
      setShowRubric(false)
      setShowSample(false)
      setFeedback([])
    } else {
      handleGameComplete()
    }
  }

  const handleGameComplete = () => {
    setGameComplete(true)
    const currentProgress = Number.parseInt(localStorage.getItem("gameProgress") || "0")
    if (currentProgress === 2) {
      localStorage.setItem("gameProgress", "3")
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
          <div className="text-6xl mb-4">✍️</div>
          <h2 className="text-3xl font-bold text-purple-600 mb-4">Writing Master!</h2>
          <div className="text-6xl font-bold text-yellow-500 mb-4">{score}</div>
          <p className="text-gray-600 mb-6">Excellent! You've mastered academic writing skills!</p>
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

  const task = WRITING_TASKS[currentTask]

  return (
    <GameLayout
      gameTitle="Academic Writing"
      gameIcon={<PenTool className="text-purple-500" size={32} />}
      instructions={[
        "Read each writing prompt carefully",
        "Follow the specific requirements for each task",
        "Use formal academic language and tone",
        "Support your arguments with evidence and examples",
        "Complete tasks within the time limit",
      ]}
      onGameComplete={handleGameComplete}
      currentQuestion={currentTask + 1}
      totalQuestions={WRITING_TASKS.length}
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
            <Card className="mb-8 shadow-2xl border-4 border-purple-400">
              <CardContent className="p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-2">
                    <Badge className={getDifficultyColor(task.difficulty)}>{task.difficulty.toUpperCase()}</Badge>
                    <Badge variant="outline">{task.type.replace("-", " ").toUpperCase()}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">Time: {formatTime(timeLeft)}</Badge>
                    <Badge variant="outline">
                      Words:{" "}
                      {
                        userResponse
                          .trim()
                          .split(/\s+/)
                          .filter((word) => word.length > 0).length
                      }
                    </Badge>
                  </div>
                </div>

                {/* Title and Prompt */}
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">{task.title}</h2>
                  <div className="bg-blue-50 p-6 rounded-lg mb-6">
                    <h3 className="font-bold text-blue-800 mb-3">Writing Prompt:</h3>
                    <p className="text-blue-700 leading-relaxed">{task.prompt}</p>
                  </div>
                </div>

                {/* Requirements */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-gray-800">Requirements:</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setShowRubric(!showRubric)}>
                        {showRubric ? "Hide" : "Show"} Rubric
                      </Button>
                      {submitted && (
                        <Button variant="outline" size="sm" onClick={() => setShowSample(!showSample)}>
                          {showSample ? "Hide" : "Show"} Sample Answer
                        </Button>
                      )}
                    </div>
                  </div>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {task.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>

                {/* Rubric */}
                {showRubric && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mb-6 bg-gray-50 p-6 rounded-lg"
                  >
                    <h3 className="font-bold text-gray-800 mb-4">Assessment Rubric:</h3>
                    <div className="space-y-4">
                      {task.rubric.map((criterion, index) => (
                        <div key={index} className="border-l-4 border-purple-400 pl-4">
                          <h4 className="font-semibold text-purple-800">{criterion.criteria}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 text-sm">
                            <div className="bg-green-50 p-2 rounded">
                              <strong className="text-green-800">Excellent:</strong> {criterion.excellent}
                            </div>
                            <div className="bg-yellow-50 p-2 rounded">
                              <strong className="text-yellow-800">Good:</strong> {criterion.good}
                            </div>
                            <div className="bg-red-50 p-2 rounded">
                              <strong className="text-red-800">Needs Improvement:</strong> {criterion.needs_improvement}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Writing Area */}
                {!submitted && (
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-800 mb-3">Your Response:</h3>
                    <Textarea
                      value={userResponse}
                      onChange={(e) => setUserResponse(e.target.value)}
                      placeholder="Begin writing your response here..."
                      className="min-h-64 text-base leading-relaxed"
                    />
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm text-gray-600">
                        Minimum words:{" "}
                        {task.type === "thesis-statement" ? 25 : task.type === "paragraph-development" ? 150 : 200}
                      </span>
                      <Button
                        onClick={handleSubmit}
                        disabled={userResponse.trim().length < 10}
                        size="lg"
                        className="bg-purple-500 hover:bg-purple-600"
                      >
                        Submit Response
                      </Button>
                    </div>
                  </div>
                )}

                {/* Feedback */}
                {submitted && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-bold text-gray-800 mb-4">Feedback:</h3>
                      <div className="space-y-2">
                        {feedback.map((item, index) => (
                          <div key={index} className="text-sm">
                            {item}
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <Button onClick={nextTask} size="lg">
                          {currentTask < WRITING_TASKS.length - 1 ? "Next Task" : "Complete Writing Assessment"}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Sample Answer */}
                {showSample && submitted && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-green-50 p-6 rounded-lg"
                  >
                    <h3 className="font-bold text-green-800 mb-3">Sample Answer:</h3>
                    <p className="text-green-700 leading-relaxed">{task.sampleAnswer}</p>
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
