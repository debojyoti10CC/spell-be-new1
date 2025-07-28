"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Target } from "lucide-react"
import GameLayout from "@/components/game-layout"
import { useRouter } from "next/navigation"

interface EssayTask {
  id: number
  title: string
  type: "introduction" | "body-paragraph" | "conclusion" | "full-essay"
  prompt: string
  requirements: string[]
  wordLimit: { min: number; max: number }
  rubric: string[]
  difficulty: "intermediate" | "advanced" | "expert"
}

const ESSAY_TASKS: EssayTask[] = [
  {
    id: 1,
    title: "Crafting Effective Introductions",
    type: "introduction",
    difficulty: "intermediate",
    prompt:
      "Write an introduction paragraph for an essay on the topic: 'The role of technology in modern education: benefits and challenges.' Your introduction should include a hook, background information, and a clear thesis statement.",
    requirements: [
      "Start with an engaging hook (question, statistic, or thought-provoking statement)",
      "Provide relevant background context about technology in education",
      "Present a clear, arguable thesis statement",
      "Use smooth transitions between sentences",
      "Maintain formal academic tone",
    ],
    wordLimit: { min: 100, max: 150 },
    rubric: [
      "Hook effectiveness and engagement",
      "Background information relevance and clarity",
      "Thesis statement strength and specificity",
      "Overall coherence and flow",
      "Academic language and tone",
    ],
  },
  {
    id: 2,
    title: "Developing Strong Body Paragraphs",
    type: "body-paragraph",
    difficulty: "advanced",
    prompt:
      "Write a body paragraph supporting the argument that 'Remote work increases employee productivity.' Use the PEEL structure (Point, Evidence, Explanation, Link) and include specific examples and data.",
    requirements: [
      "Begin with a clear topic sentence (Point)",
      "Provide credible evidence or examples",
      "Explain how evidence supports your argument",
      "Link back to thesis or transition to next point",
      "Include at least one specific statistic or study",
      "Use appropriate academic transitions",
    ],
    wordLimit: { min: 150, max: 200 },
    rubric: [
      "Topic sentence clarity and relevance",
      "Quality and credibility of evidence",
      "Depth of explanation and analysis",
      "Effective use of transitions",
      "Integration of specific examples",
    ],
  },
  {
    id: 3,
    title: "Writing Compelling Conclusions",
    type: "conclusion",
    difficulty: "advanced",
    prompt:
      "Write a conclusion paragraph for an essay arguing that 'Universities should make financial literacy courses mandatory for all students.' Summarize key points, restate the thesis, and end with a call to action.",
    requirements: [
      "Restate thesis in different words",
      "Summarize main supporting arguments",
      "Avoid introducing new information",
      "End with a call to action or broader implications",
      "Create sense of closure and finality",
    ],
    wordLimit: { min: 100, max: 130 },
    rubric: [
      "Effective thesis restatement",
      "Comprehensive summary of main points",
      "Strong call to action or implications",
      "Avoidance of new information",
      "Sense of closure and completeness",
    ],
  },
]

export default function EssayStructureGame() {
  const [currentTask, setCurrentTask] = useState(0)
  const [userResponse, setUserResponse] = useState("")
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(2700) // 45 minutes
  const [gameComplete, setGameComplete] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [feedback, setFeedback] = useState<string[]>([])
  const [showRubric, setShowRubric] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (timeLeft > 0 && !gameComplete && !submitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !submitted) {
      handleSubmit()
    }
  }, [timeLeft, gameComplete, submitted])

  const handleSubmit = () => {
    setSubmitted(true)
    const task = ESSAY_TASKS[currentTask]
    const wordCount = userResponse
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length

    let taskScore = 0
    const taskFeedback: string[] = []

    // Word count evaluation
    if (wordCount >= task.wordLimit.min && wordCount <= task.wordLimit.max) {
      taskScore += 20
      taskFeedback.push(`✅ Word count within range (${wordCount} words)`)
    } else if (wordCount < task.wordLimit.min) {
      taskFeedback.push(`❌ Below minimum word count (${wordCount}/${task.wordLimit.min} words)`)
    } else {
      taskFeedback.push(`⚠️ Exceeds maximum word count (${wordCount}/${task.wordLimit.max} words)`)
      taskScore += 10
    }

    // Content analysis based on task type
    const response = userResponse.toLowerCase()

    if (task.type === "introduction") {
      if (response.includes("?") || response.includes("imagine") || response.includes("consider")) {
        taskScore += 15
        taskFeedback.push("✅ Includes engaging hook")
      }
      if (response.includes("technology") && response.includes("education")) {
        taskScore += 15
        taskFeedback.push("✅ Addresses the topic appropriately")
      }
      if (response.includes("argue") || response.includes("believe") || response.includes("thesis")) {
        taskScore += 10
        taskFeedback.push("✅ Contains thesis statement")
      }
    } else if (task.type === "body-paragraph") {
      if (response.includes("remote work") && response.includes("productivity")) {
        taskScore += 15
        taskFeedback.push("✅ Stays on topic")
      }
      if (response.includes("%") || response.includes("study") || response.includes("research")) {
        taskScore += 15
        taskFeedback.push("✅ Includes evidence or statistics")
      }
      if (response.includes("furthermore") || response.includes("additionally") || response.includes("moreover")) {
        taskScore += 10
        taskFeedback.push("✅ Uses academic transitions")
      }
    } else if (task.type === "conclusion") {
      if (response.includes("in conclusion") || response.includes("therefore") || response.includes("thus")) {
        taskScore += 15
        taskFeedback.push("✅ Appropriate conclusion language")
      }
      if (response.includes("should") || response.includes("must") || response.includes("need to")) {
        taskScore += 15
        taskFeedback.push("✅ Includes call to action")
      }
    }

    // Difficulty bonus
    const difficultyBonus = task.difficulty === "expert" ? 25 : task.difficulty === "advanced" ? 20 : 15
    taskScore += difficultyBonus

    setScore(score + taskScore)
    setFeedback(taskFeedback)
  }

  const nextTask = () => {
    if (currentTask < ESSAY_TASKS.length - 1) {
      setCurrentTask(currentTask + 1)
      setUserResponse("")
      setSubmitted(false)
      setFeedback([])
      setShowRubric(false)
    } else {
      handleGameComplete()
    }
  }

  const handleGameComplete = () => {
    setGameComplete(true)
    const currentProgress = Number.parseInt(localStorage.getItem("gameProgress") || "0")
    if (currentProgress === 5) {
      localStorage.setItem("gameProgress", "6")
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
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-3xl font-bold text-red-600 mb-4">Essay Master!</h2>
          <div className="text-6xl font-bold text-yellow-500 mb-4">{score}</div>
          <p className="text-gray-600 mb-6">Outstanding! You've mastered essay structure!</p>
          <Button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
          >
            Back to Home
          </Button>
        </motion.div>
      </div>
    )
  }

  const task = ESSAY_TASKS[currentTask]
  const wordCount = userResponse
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length

  return (
    <GameLayout
      gameTitle="Essay Structure"
      gameIcon={<Target className="text-red-500" size={32} />}
      instructions={[
        "Follow the specific requirements for each essay component",
        "Use formal academic language and tone",
        "Stay within the word count limits",
        "Structure your writing clearly and logically",
        "Include specific examples and evidence where required",
      ]}
      onGameComplete={handleGameComplete}
      currentQuestion={currentTask + 1}
      totalQuestions={ESSAY_TASKS.length}
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
            <Card className="mb-8 shadow-2xl border-4 border-red-400">
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
                      Words: {wordCount}/{task.wordLimit.min}-{task.wordLimit.max}
                    </Badge>
                  </div>
                </div>

                {/* Title and Prompt */}
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">{task.title}</h2>
                  <div className="bg-blue-50 p-6 rounded-lg mb-6">
                    <h3 className="font-bold text-blue-800 mb-3">Writing Task:</h3>
                    <p className="text-blue-700 leading-relaxed">{task.prompt}</p>
                  </div>
                </div>

                {/* Requirements and Rubric */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-gray-800">Requirements:</h3>
                    <Button variant="outline" size="sm" onClick={() => setShowRubric(!showRubric)}>
                      {showRubric ? "Hide" : "Show"} Rubric
                    </Button>
                  </div>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                    {task.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                  <div className="text-sm text-gray-600">
                    <strong>Word Limit:</strong> {task.wordLimit.min}-{task.wordLimit.max} words
                  </div>
                </div>

                {/* Rubric */}
                {showRubric && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mb-6 bg-gray-50 p-6 rounded-lg"
                  >
                    <h3 className="font-bold text-gray-800 mb-4">Assessment Criteria:</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {task.rubric.map((criterion, index) => (
                        <li key={index}>{criterion}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* Writing Area */}
                {!submitted && (
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-800 mb-3">Your {task.type.replace("-", " ")}:</h3>
                    <Textarea
                      value={userResponse}
                      onChange={(e) => setUserResponse(e.target.value)}
                      placeholder={`Begin writing your ${task.type.replace("-", " ")} here...`}
                      className="min-h-64 text-base leading-relaxed"
                    />
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-sm text-gray-600">
                        Word count: {wordCount} / {task.wordLimit.min}-{task.wordLimit.max}
                        {wordCount < task.wordLimit.min && (
                          <span className="text-red-600 ml-2">({task.wordLimit.min - wordCount} more needed)</span>
                        )}
                        {wordCount > task.wordLimit.max && (
                          <span className="text-orange-600 ml-2">({wordCount - task.wordLimit.max} over limit)</span>
                        )}
                      </div>
                      <Button
                        onClick={handleSubmit}
                        disabled={userResponse.trim().length < 20}
                        size="lg"
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Submit {task.type.replace("-", " ")}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Feedback */}
                {submitted && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-bold text-gray-800 mb-4">Feedback:</h3>
                      <div className="space-y-2 mb-4">
                        {feedback.map((item, index) => (
                          <div key={index} className="text-sm">
                            {item}
                          </div>
                        ))}
                      </div>
                      <div className="pt-4 border-t">
                        <Button onClick={nextTask} size="lg">
                          {currentTask < ESSAY_TASKS.length - 1 ? "Next Task" : "Complete Essay Structure"}
                        </Button>
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
