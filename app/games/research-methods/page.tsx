"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Microscope, CheckCircle, XCircle } from "lucide-react"
import GameLayout from "@/components/game-layout"
import { useRouter } from "next/navigation"

interface ResearchQuestion {
  id: number
  scenario: string
  context: string
  question: string
  type: "multiple-choice" | "short-answer" | "methodology-design" | "analysis"
  options?: string[]
  correct?: number | string
  sampleAnswer?: string
  difficulty: "intermediate" | "advanced" | "expert"
  category: "quantitative" | "qualitative" | "mixed-methods" | "ethics"
  points: number
}

const RESEARCH_QUESTIONS: ResearchQuestion[] = [
  {
    id: 1,
    scenario: "Student Engagement Study",
    context:
      "A university wants to investigate factors affecting student engagement in online learning environments. The research team needs to design a comprehensive study that examines both quantitative metrics (attendance, grades, participation rates) and qualitative aspects (student experiences, motivation, barriers).",
    question: "What research design would be most appropriate for this study?",
    type: "multiple-choice",
    options: [
      "Pure quantitative experimental design",
      "Qualitative ethnographic study only",
      "Mixed-methods sequential explanatory design",
      "Cross-sectional survey design only",
    ],
    correct: 2,
    difficulty: "intermediate",
    category: "mixed-methods",
    points: 20,
  },
  {
    id: 2,
    scenario: "Healthcare Intervention Effectiveness",
    context:
      "Researchers want to test the effectiveness of a new cognitive behavioral therapy program for treating anxiety in college students. They have access to 200 students who have been diagnosed with anxiety disorders and want to ensure the study meets ethical standards while providing reliable results.",
    question:
      "Design a research methodology for this intervention study. Include sampling method, control group considerations, ethical considerations, and measurement tools.",
    type: "methodology-design",
    sampleAnswer:
      "Research Design: Randomized Controlled Trial (RCT)\n\nSampling: Random assignment of 200 students to intervention group (n=100) and control group (n=100). Use stratified randomization by anxiety severity level.\n\nControl Group: Waitlist control group that receives standard counseling services, with option to receive intervention after study completion.\n\nEthical Considerations: IRB approval required, informed consent, right to withdraw, confidentiality protection, crisis intervention protocols for severe cases.\n\nMeasurement Tools: Pre/post/follow-up assessments using validated instruments (GAD-7, Beck Anxiety Inventory), weekly self-report measures, therapist ratings.\n\nData Collection: Baseline, 8-week intervention period, post-intervention, 3-month follow-up.\n\nAnalysis Plan: Intent-to-treat analysis, ANCOVA controlling for baseline scores, effect size calculations.",
    difficulty: "expert",
    category: "quantitative",
    points: 40,
  },
  {
    id: 3,
    scenario: "Workplace Culture Research",
    context:
      "A multinational corporation wants to understand how remote work has affected company culture across different departments and geographic locations. They're particularly interested in communication patterns, team cohesion, and employee satisfaction.",
    question: "What qualitative research methods would be most appropriate for exploring workplace culture changes?",
    type: "multiple-choice",
    options: [
      "Online surveys with Likert scales only",
      "In-depth interviews and focus groups",
      "Experimental manipulation of work conditions",
      "Statistical analysis of productivity metrics",
    ],
    correct: 1,
    difficulty: "intermediate",
    category: "qualitative",
    points: 25,
  },
  {
    id: 4,
    scenario: "Educational Technology Impact",
    context:
      "Researchers are investigating how the implementation of AI tutoring systems affects student learning outcomes in mathematics. They have pre-implementation data from 500 students across 10 schools and want to measure changes after one academic year of AI tutor use.",
    question: "Identify potential threats to internal validity in this study and propose solutions for each threat.",
    type: "analysis",
    sampleAnswer:
      "Threats to Internal Validity and Solutions:\n\n1. History Threat: External events (curriculum changes, teacher training) could affect outcomes.\nSolution: Use control schools without AI implementation, document any curriculum changes.\n\n2. Maturation: Students naturally improve in math over time.\nSolution: Include control group, use age-appropriate pre/post measures.\n\n3. Testing Effects: Repeated testing may improve scores independent of intervention.\nSolution: Use alternate forms of tests, include control group with same testing schedule.\n\n4. Selection Bias: Schools choosing AI tutors may differ systematically.\nSolution: Random assignment of schools to conditions, match schools on key characteristics.\n\n5. Attrition: Student dropout may be non-random.\nSolution: Track and analyze dropout patterns, use intent-to-treat analysis.\n\n6. Instrumentation: Changes in measurement tools or procedures.\nSolution: Standardize all procedures, train data collectors, use validated instruments.",
    difficulty: "expert",
    category: "quantitative",
    points: 45,
  },
  {
    id: 5,
    scenario: "Social Media and Mental Health",
    context:
      "A research team wants to explore the relationship between social media use and mental health among teenagers. They're concerned about ethical issues related to studying minors and sensitive topics, while ensuring they gather meaningful data.",
    question: "What are the key ethical considerations for this research, and how should they be addressed?",
    type: "short-answer",
    correct:
      "Key ethical considerations include: 1) Informed consent from both minors and parents/guardians, 2) Confidentiality protection especially for sensitive mental health data, 3) Mandatory reporting requirements for self-harm risks, 4) Minimizing psychological harm from research participation, 5) Data security for digital information, 6) Right to withdraw without penalty, 7) Debriefing and resource provision for participants who may be distressed.",
    difficulty: "advanced",
    category: "ethics",
    points: 30,
  },
  {
    id: 6,
    scenario: "Cross-Cultural Communication Study",
    context:
      "Researchers want to study communication patterns in multicultural teams within international organizations. They plan to observe team meetings, conduct interviews, and analyze communication artifacts across different cultural contexts.",
    question:
      "What sampling strategy would be most appropriate for ensuring cultural diversity and representativeness?",
    type: "multiple-choice",
    options: [
      "Simple random sampling from all employees",
      "Purposive sampling with maximum variation strategy",
      "Convenience sampling from available teams",
      "Systematic sampling every 10th employee",
    ],
    correct: 1,
    difficulty: "advanced",
    category: "qualitative",
    points: 25,
  },
  {
    id: 7,
    scenario: "Educational Intervention Evaluation",
    context:
      "A school district implemented a new reading comprehension program and wants to evaluate its effectiveness. They have test scores from before implementation and plan to collect post-implementation data. However, they're concerned about confounding variables and want to strengthen their evaluation design.",
    question:
      "Design an evaluation study that addresses potential confounding variables and strengthens causal inference.",
    type: "methodology-design",
    sampleAnswer:
      "Evaluation Design: Quasi-experimental with comparison group\n\nDesign Elements:\n1. Treatment Group: Schools implementing new reading program\n2. Comparison Group: Matched schools continuing with standard curriculum\n3. Matching Criteria: School size, socioeconomic status, baseline reading scores, teacher experience\n\nData Collection:\n- Pre-implementation: 2 years of historical reading scores\n- Post-implementation: Quarterly assessments for 2 years\n- Process data: Implementation fidelity measures, teacher surveys\n- Contextual data: Student demographics, teacher turnover, resource allocation\n\nThreat Mitigation:\n- Selection bias: Propensity score matching of schools\n- Diffusion: Ensure geographic separation of treatment/comparison schools\n- Compensatory rivalry: Monitor comparison schools for program adoption\n- Implementation fidelity: Regular classroom observations, teacher training logs\n\nAnalysis: Difference-in-differences analysis, multilevel modeling accounting for student nesting in classrooms and schools.",
    difficulty: "expert",
    category: "quantitative",
    points: 50,
  },
  {
    id: 8,
    scenario: "Consumer Behavior Research",
    context:
      "A marketing research firm wants to understand how consumers make purchasing decisions for sustainable products. They're interested in both conscious decision-making processes and unconscious influences on behavior.",
    question:
      "What combination of research methods would best capture both conscious and unconscious aspects of consumer decision-making?",
    type: "multiple-choice",
    options: [
      "Surveys and focus groups only",
      "Experimental studies and interviews combined with observational methods",
      "Statistical analysis of sales data only",
      "Online questionnaires with demographic questions",
    ],
    correct: 1,
    difficulty: "advanced",
    category: "mixed-methods",
    points: 30,
  },
]

export default function ResearchMethodsGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [userResponse, setUserResponse] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(2400) // 40 minutes
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
    const question = RESEARCH_QUESTIONS[currentQuestion]
    let isCorrect = false

    if (question.type === "multiple-choice") {
      isCorrect = selectedAnswer === question.correct
    } else if (question.type === "short-answer") {
      const response = userResponse.toLowerCase().trim()
      const correctAnswer = question.correct?.toString().toLowerCase() || ""
      isCorrect =
        response.length >= 50 &&
        (response.includes("ethical") ||
          response.includes("consent") ||
          response.includes("confidentiality") ||
          response.includes("harm") ||
          response.includes("withdraw"))
    } else if (question.type === "methodology-design" || question.type === "analysis") {
      // Score based on response length and key concepts
      const response = userResponse.toLowerCase()
      isCorrect =
        response.length >= 200 &&
        (response.includes("design") ||
          response.includes("method") ||
          response.includes("sample") ||
          response.includes("analysis") ||
          response.includes("validity"))
    }

    setShowResult(true)

    if (isCorrect) {
      const points = showHint ? Math.floor(question.points * 0.8) : question.points
      setScore(score + points)
    }

    setTimeout(() => {
      if (currentQuestion < RESEARCH_QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        resetQuestion()
      } else {
        handleGameComplete()
      }
    }, 5000)
  }

  const resetQuestion = () => {
    setSelectedAnswer(null)
    setUserResponse("")
    setShowResult(false)
    setShowHint(false)
  }

  const handleGameComplete = () => {
    setGameComplete(true)
    const currentProgress = Number.parseInt(localStorage.getItem("gameProgress") || "0")
    if (currentProgress === 8) {
      localStorage.setItem("gameProgress", "9")
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
      case "quantitative":
        return "bg-blue-100 text-blue-800"
      case "qualitative":
        return "bg-purple-100 text-purple-800"
      case "mixed-methods":
        return "bg-orange-100 text-orange-800"
      case "ethics":
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
          <div className="text-6xl mb-4">🔬</div>
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Research Expert!</h2>
          <div className="text-6xl font-bold text-yellow-500 mb-4">{score}</div>
          <p className="text-gray-600 mb-6">Outstanding! You've mastered research methodology!</p>
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

  const question = RESEARCH_QUESTIONS[currentQuestion]

  return (
    <GameLayout
      gameTitle="Research Methods"
      gameIcon={<Microscope className="text-blue-500" size={32} />}
      instructions={[
        "Analyze research scenarios and design appropriate methodologies",
        "Consider ethical implications and validity threats",
        "Choose appropriate sampling and data collection methods",
        "Design studies that address research questions effectively",
        "Apply both quantitative and qualitative research principles",
      ]}
      onGameComplete={handleGameComplete}
      currentQuestion={currentQuestion + 1}
      totalQuestions={RESEARCH_QUESTIONS.length}
      score={score}
      timeLeft={timeLeft}
    >
      <div className="max-w-5xl mx-auto">
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
                  <div className="flex gap-2">
                    <Badge className={getDifficultyColor(question.difficulty)}>
                      {question.difficulty.toUpperCase()}
                    </Badge>
                    <Badge className={getCategoryColor(question.category)}>{question.category.toUpperCase()}</Badge>
                    <Badge variant="outline">{question.points} points</Badge>
                  </div>
                  <Badge variant="outline">
                    Question {currentQuestion + 1} of {RESEARCH_QUESTIONS.length}
                  </Badge>
                </div>

                {/* Scenario */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-blue-600 mb-3">{question.scenario}</h2>
                  <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                    <h3 className="font-bold text-blue-800 mb-2">Research Context:</h3>
                    <p className="text-blue-900 leading-relaxed">{question.context}</p>
                  </div>
                </div>

                {/* Question */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800">{question.question}</h3>
                </div>

                {/* Answer Input */}
                <div className="mb-6">
                  {question.type === "multiple-choice" && question.options && (
                    <div className="grid grid-cols-1 gap-4">
                      {question.options.map((option, index) => {
                        let buttonClass =
                          "p-4 text-left rounded-lg border-2 cursor-pointer transition-all duration-300 "

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
                              ? "bg-blue-100 border-blue-500 text-blue-700"
                              : "bg-white border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-400"
                        }

                        return (
                          <motion.div
                            key={index}
                            onClick={() => !showResult && setSelectedAnswer(index)}
                            className={buttonClass}
                            whileHover={{ scale: showResult ? 1 : 1.02 }}
                            whileTap={{ scale: showResult ? 1 : 0.98 }}
                          >
                            <div className="flex items-start gap-3">
                              <Badge variant="outline" className="px-3 py-1 mt-1">
                                {String.fromCharCode(65 + index)}
                              </Badge>
                              <span className="flex-1">{option}</span>
                              {showResult && index === question.correct && (
                                <CheckCircle className="text-green-500 mt-1" size={20} />
                              )}
                              {showResult && index === selectedAnswer && index !== question.correct && (
                                <XCircle className="text-red-500 mt-1" size={20} />
                              )}
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  )}

                  {(question.type === "short-answer" ||
                    question.type === "methodology-design" ||
                    question.type === "analysis") && (
                    <div>
                      <Textarea
                        value={userResponse}
                        onChange={(e) => setUserResponse(e.target.value)}
                        placeholder={
                          question.type === "methodology-design"
                            ? "Design a comprehensive research methodology addressing all aspects mentioned in the scenario..."
                            : question.type === "analysis"
                              ? "Provide a detailed analysis addressing the research question..."
                              : "Provide a detailed answer addressing all key points..."
                        }
                        className="min-h-40 text-base leading-relaxed"
                        disabled={showResult}
                      />
                      <p className="text-sm text-gray-600 mt-2">
                        {question.type === "methodology-design" || question.type === "analysis"
                          ? "Minimum 200 words. Include specific methodological details and justifications."
                          : "Minimum 50 words. Address all key ethical considerations."}
                      </p>
                    </div>
                  )}
                </div>

                {/* Hint Button */}
                {!showResult && !showHint && (
                  <div className="text-center mb-6">
                    <Button
                      variant="outline"
                      onClick={() => setShowHint(true)}
                      className="text-orange-600 border-orange-300 hover:bg-orange-50"
                    >
                      💡 Show Hint (-20% points)
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
                    <h4 className="font-bold text-orange-800 mb-2">💡 Research Hint:</h4>
                    <div className="text-orange-700 text-sm">
                      {question.category === "quantitative" &&
                        "Consider experimental design, control groups, and statistical validity."}
                      {question.category === "qualitative" &&
                        "Think about data saturation, participant perspectives, and thematic analysis."}
                      {question.category === "mixed-methods" &&
                        "Consider how to integrate quantitative and qualitative approaches effectively."}
                      {question.category === "ethics" &&
                        "Focus on participant protection, informed consent, and potential risks/benefits."}
                    </div>
                  </motion.div>
                )}

                {/* Submit Button */}
                {!showResult && (
                  <div className="text-center">
                    <Button
                      onClick={handleAnswerSubmit}
                      disabled={
                        (question.type === "multiple-choice" && selectedAnswer === null) ||
                        ((question.type === "short-answer" ||
                          question.type === "methodology-design" ||
                          question.type === "analysis") &&
                          userResponse.trim().length < (question.type === "short-answer" ? 50 : 200))
                      }
                      size="lg"
                      className="bg-blue-500 hover:bg-blue-600 px-8 py-4"
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
                    <div className="mb-4">
                      {(question.type === "multiple-choice" && selectedAnswer === question.correct) ||
                      (question.type !== "multiple-choice" &&
                        userResponse.length >= (question.type === "short-answer" ? 50 : 200)) ? (
                        <div>
                          <div className="text-green-600 font-bold text-2xl mb-2">🎉 Excellent Work!</div>
                          <div className="text-green-700">
                            +{showHint ? Math.floor(question.points * 0.8) : question.points} points
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-red-600 font-bold text-2xl mb-2">❌ Needs Improvement</div>
                          <div className="text-red-700">
                            {question.type === "multiple-choice"
                              ? `Correct answer: ${question.options?.[question.correct as number]}`
                              : "Response needs more detail and specific methodological considerations"}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sample Answer */}
                    {question.sampleAnswer && (
                      <div className="bg-blue-50 p-4 rounded-lg text-left">
                        <h4 className="font-bold text-blue-800 mb-2">📋 Sample Response:</h4>
                        <div className="text-blue-700 text-sm leading-relaxed whitespace-pre-line">
                          {question.sampleAnswer}
                        </div>
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
