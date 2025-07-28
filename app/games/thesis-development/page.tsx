"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Zap } from "lucide-react"
import GameLayout from "@/components/game-layout"
import { useRouter } from "next/navigation"

interface ThesisTask {
  id: number
  title: string
  topic: string
  context: string
  requirements: string[]
  sampleThesis: string
  rubric: {
    criteria: string
    description: string
    points: number
  }[]
  difficulty: "expert"
  timeLimit: number
}

const THESIS_TASKS: ThesisTask[] = [
  {
    id: 1,
    title: "Environmental Policy Thesis",
    topic: "The effectiveness of carbon pricing mechanisms in developing nations",
    context:
      "You are writing a thesis for a graduate-level environmental economics course. Your thesis should address the complex relationship between economic development and environmental protection in developing countries, specifically focusing on carbon pricing policies.",
    requirements: [
      "Present a clear, debatable argument about carbon pricing effectiveness",
      "Include at least 3 specific supporting points",
      "Address potential counterarguments or limitations",
      "Use sophisticated academic vocabulary and complex sentence structures",
      "Demonstrate understanding of economic and environmental concepts",
      "Include specific examples or case studies",
      "Maintain formal academic tone throughout",
    ],
    sampleThesis:
      "While carbon pricing mechanisms such as carbon taxes and cap-and-trade systems have demonstrated measurable success in reducing emissions in developed economies, their implementation in developing nations faces significant structural, economic, and institutional barriers that fundamentally limit their effectiveness, necessitating the development of hybrid policy frameworks that combine carbon pricing with targeted subsidies, technology transfer programs, and capacity-building initiatives to achieve meaningful emission reductions without compromising essential economic development goals.",
    rubric: [
      {
        criteria: "Argument Clarity",
        description: "Thesis presents a clear, specific, and debatable position",
        points: 25,
      },
      {
        criteria: "Supporting Evidence",
        description: "Includes multiple well-integrated supporting points",
        points: 20,
      },
      {
        criteria: "Complexity",
        description: "Demonstrates sophisticated understanding of the topic",
        points: 20,
      },
      {
        criteria: "Academic Language",
        description: "Uses advanced vocabulary and complex sentence structures",
        points: 20,
      },
      {
        criteria: "Counterarguments",
        description: "Acknowledges and addresses potential limitations",
        points: 15,
      },
    ],
    difficulty: "expert",
    timeLimit: 2700, // 45 minutes
  },
  {
    id: 2,
    title: "Technology and Society Thesis",
    topic: "The impact of artificial intelligence on democratic participation and civic engagement",
    context:
      "You are developing a thesis for a political science dissertation examining how AI technologies are reshaping democratic processes. Consider both positive and negative implications for citizen participation, information access, and democratic institutions.",
    requirements: [
      "Articulate a nuanced position on AI's impact on democracy",
      "Balance discussion of benefits and risks",
      "Include specific technological examples (algorithms, platforms, etc.)",
      "Address implications for different demographic groups",
      "Consider both current and future scenarios",
      "Integrate political theory with technological analysis",
      "Propose potential solutions or recommendations",
    ],
    sampleThesis:
      "Although artificial intelligence technologies have the potential to enhance democratic participation through improved information access, personalized civic engagement platforms, and more efficient government services, the current deployment of AI systems in democratic contexts is fundamentally undermining the foundational principles of informed citizenship and equal participation by creating algorithmic filter bubbles, amplifying misinformation, and concentrating political influence among technology corporations, thereby requiring immediate regulatory intervention and the development of AI governance frameworks that prioritize democratic values, transparency, and citizen agency over technological efficiency and commercial interests.",
    rubric: [
      {
        criteria: "Argument Sophistication",
        description: "Presents a nuanced, multi-faceted argument",
        points: 30,
      },
      {
        criteria: "Evidence Integration",
        description: "Effectively integrates technological and political concepts",
        points: 25,
      },
      {
        criteria: "Critical Analysis",
        description: "Demonstrates critical thinking about complex issues",
        points: 25,
      },
      {
        criteria: "Future Implications",
        description: "Considers long-term consequences and solutions",
        points: 20,
      },
    ],
    difficulty: "expert",
    timeLimit: 2700,
  },
]

export default function ThesisDevelopmentGame() {
  const [currentTask, setCurrentTask] = useState(0)
  const [userThesis, setUserThesis] = useState("")
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [feedback, setFeedback] = useState<string[]>([])
  const [showSample, setShowSample] = useState(false)
  const [showRubric, setShowRubric] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (currentTask < THESIS_TASKS.length) {
      setTimeLeft(THESIS_TASKS[currentTask].timeLimit)
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
    const task = THESIS_TASKS[currentTask]

    // Advanced scoring based on thesis quality
    const wordCount = userThesis.trim().split(/\s+/).length
    let taskScore = 0
    const taskFeedback: string[] = []

    // Word count evaluation (expecting substantial thesis statements)
    if (wordCount >= 50 && wordCount <= 150) {
      taskScore += 30
      taskFeedback.push(`✅ Appropriate length (${wordCount} words)`)
    } else if (wordCount < 50) {
      taskFeedback.push(`❌ Too brief (${wordCount} words) - thesis needs more development`)
    } else {
      taskFeedback.push(`⚠️ Very long (${wordCount} words) - consider condensing`)
      taskScore += 15
    }

    // Content analysis
    const thesis = userThesis.toLowerCase()

    // Check for argument clarity
    if (thesis.includes("while") || thesis.includes("although") || thesis.includes("despite")) {
      taskScore += 25
      taskFeedback.push("✅ Shows sophisticated argument structure")
    }

    // Check for specific examples or evidence
    if (thesis.includes("such as") || thesis.includes("including") || thesis.includes("for example")) {
      taskScore += 20
      taskFeedback.push("✅ Includes specific examples or evidence")
    }

    // Check for complexity and nuance
    if (thesis.includes("however") || thesis.includes("nevertheless") || thesis.includes("furthermore")) {
      taskScore += 20
      taskFeedback.push("✅ Demonstrates complex reasoning")
    }

    // Check for topic-specific vocabulary
    if (task.id === 1) {
      if (thesis.includes("carbon") && thesis.includes("developing") && thesis.includes("economic")) {
        taskScore += 15
        taskFeedback.push("✅ Addresses key topic elements")
      }
    } else if (task.id === 2) {
      if (thesis.includes("artificial intelligence") || thesis.includes("ai")) {
        if (thesis.includes("democratic") || thesis.includes("democracy")) {
          taskScore += 15
          taskFeedback.push("✅ Addresses key topic elements")
        }
      }
    }

    // Check for counterarguments
    if (thesis.includes("despite") || thesis.includes("although") || thesis.includes("while")) {
      taskScore += 15
      taskFeedback.push("✅ Acknowledges complexity/counterarguments")
    }

    // Expert level bonus
    taskScore += 25

    setScore(score + taskScore)
    setFeedback(taskFeedback)
  }

  const nextTask = () => {
    if (currentTask < THESIS_TASKS.length - 1) {
      setCurrentTask(currentTask + 1)
      setUserThesis("")
      setSubmitted(false)
      setFeedback([])
      setShowSample(false)
      setShowRubric(false)
    } else {
      handleGameComplete()
    }
  }

  const handleGameComplete = () => {
    setGameComplete(true)
    const currentProgress = Number.parseInt(localStorage.getItem("gameProgress") || "0")
    if (currentProgress === 9) {
      localStorage.setItem("gameProgress", "10")
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-md"
        >
          <div className="text-6xl mb-4">⚡</div>
          <h2 className="text-3xl font-bold text-yellow-600 mb-4">Thesis Master!</h2>
          <div className="text-6xl font-bold text-yellow-500 mb-4">{score}</div>
          <p className="text-gray-600 mb-6">Exceptional! You've mastered advanced thesis development!</p>
          <Button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
          >
            Back to Home
          </Button>
        </motion.div>
      </div>
    )
  }

  const task = THESIS_TASKS[currentTask]
  const wordCount = userThesis
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length

  return (
    <GameLayout
      gameTitle="Thesis Development"
      gameIcon={<Zap className="text-yellow-500" size={32} />}
      instructions={[
        "Develop sophisticated thesis statements for complex academic topics",
        "Integrate multiple perspectives and evidence sources",
        "Use advanced academic vocabulary and sentence structures",
        "Address counterarguments and limitations",
        "Demonstrate deep understanding of the subject matter",
      ]}
      onGameComplete={handleGameComplete}
      currentQuestion={currentTask + 1}
      totalQuestions={THESIS_TASKS.length}
      score={score}
      timeLeft={timeLeft}
      difficulty="Expert"
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
            <Card className="mb-8 shadow-2xl border-4 border-yellow-400">
              <CardContent className="p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <Badge className="bg-red-100 text-red-800">EXPERT LEVEL</Badge>
                  <div className="flex gap-2">
                    <Badge variant="outline">Time: {formatTime(timeLeft)}</Badge>
                    <Badge variant="outline">Words: {wordCount}</Badge>
                  </div>
                </div>

                {/* Task Information */}
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">{task.title}</h2>

                  {/* Topic */}
                  <div className="bg-blue-50 p-6 rounded-lg mb-6">
                    <h3 className="font-bold text-blue-800 mb-3">Thesis Topic:</h3>
                    <p className="text-blue-700 text-lg font-medium">{task.topic}</p>
                  </div>

                  {/* Context */}
                  <div className="bg-green-50 p-6 rounded-lg mb-6">
                    <h3 className="font-bold text-green-800 mb-3">Context:</h3>
                    <p className="text-green-700 leading-relaxed">{task.context}</p>
                  </div>

                  {/* Requirements */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-gray-800">Requirements:</h3>
                      <Button variant="outline" size="sm" onClick={() => setShowRubric(!showRubric)}>
                        {showRubric ? "Hide" : "Show"} Rubric
                      </Button>
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
                      <div className="space-y-3">
                        {task.rubric.map((criterion, index) => (
                          <div key={index} className="border-l-4 border-yellow-400 pl-4">
                            <div className="flex justify-between items-center">
                              <h4 className="font-semibold text-yellow-800">{criterion.criteria}</h4>
                              <Badge variant="outline">{criterion.points} pts</Badge>
                            </div>
                            <p className="text-gray-700 text-sm mt-1">{criterion.description}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Thesis Writing Area */}
                {!submitted && (
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-800 mb-3">Your Thesis Statement:</h3>
                    <Textarea
                      value={userThesis}
                      onChange={(e) => setUserThesis(e.target.value)}
                      placeholder="Develop your sophisticated thesis statement here. Remember to present a clear argument, include supporting points, and address potential counterarguments..."
                      className="min-h-48 text-base leading-relaxed"
                    />
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-sm text-gray-600">
                        Target: 50-150 words for a comprehensive thesis statement
                        {wordCount < 50 && (
                          <span className="text-orange-600 ml-2">({50 - wordCount} more words recommended)</span>
                        )}
                        {wordCount > 150 && (
                          <span className="text-orange-600 ml-2">
                            (Consider condensing - {wordCount - 150} words over target)
                          </span>
                        )}
                      </div>
                      <Button
                        onClick={handleSubmit}
                        disabled={userThesis.trim().length < 30}
                        size="lg"
                        className="bg-yellow-500 hover:bg-yellow-600"
                      >
                        Submit Thesis
                      </Button>
                    </div>
                  </div>
                )}

                {/* Feedback */}
                {submitted && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-bold text-gray-800 mb-4">Expert Feedback:</h3>
                      <div className="space-y-2 mb-4">
                        {feedback.map((item, index) => (
                          <div key={index} className="text-sm">
                            {item}
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t">
                        <Button variant="outline" onClick={() => setShowSample(!showSample)}>
                          {showSample ? "Hide" : "Show"} Expert Example
                        </Button>
                        <Button onClick={nextTask} size="lg">
                          {currentTask < THESIS_TASKS.length - 1 ? "Next Challenge" : "Complete Thesis Development"}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Sample Thesis */}
                {showSample && submitted && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-green-50 p-6 rounded-lg"
                  >
                    <h3 className="font-bold text-green-800 mb-3">Expert Example Thesis:</h3>
                    <p className="text-green-700 leading-relaxed italic">{task.sampleThesis}</p>
                    <div className="mt-4 text-sm text-green-600">
                      <strong>Note:</strong> This example demonstrates sophisticated argument structure, specific
                      evidence integration, and acknowledgment of complexity - key elements of expert-level thesis
                      development.
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
