"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Music } from "lucide-react"
import GameLayout from "@/components/game-layout"
import { useRouter } from "next/navigation"

interface DiscussionScenario {
  id: number
  title: string
  context: string
  participants: string[]
  audioDescription: string
  transcript: string
  questions: {
    question: string
    type: "multiple-choice" | "open-response" | "analysis"
    options?: string[]
    correct?: number | string
    sampleAnswer?: string
  }[]
  difficulty: "intermediate" | "advanced" | "expert"
  duration: number
}

const DISCUSSION_SCENARIOS: DiscussionScenario[] = [
  {
    id: 1,
    title: "Climate Change Policy Debate",
    context: "University seminar discussing climate change policies and their economic implications",
    participants: [
      "Dr. Sarah Chen (Environmental Economist)",
      "Prof. Michael Torres (Policy Analyst)",
      "Lisa Wang (Graduate Student)",
    ],
    audioDescription:
      "Academic discussion about carbon pricing mechanisms and their effectiveness in reducing emissions",
    duration: 240,
    transcript: `Dr. Chen: Good morning everyone. Today we're examining the effectiveness of carbon pricing as a policy tool. Michael, you've been critical of cap-and-trade systems. Could you elaborate on your concerns?

Prof. Torres: Certainly, Sarah. While I acknowledge that carbon pricing can theoretically internalize environmental costs, the practical implementation has been problematic. The European Union's Emissions Trading System, for instance, suffered from over-allocation of permits in its early phases, leading to carbon prices that were too low to incentivize meaningful behavioral change.

Lisa: But Professor Torres, hasn't the EU ETS been reformed significantly? The Market Stability Reserve introduced in 2019 has helped address the surplus of allowances, and carbon prices have increased substantially.

Dr. Chen: Lisa raises an excellent point. The recent price increases do suggest that the system is beginning to function as intended. However, Michael's broader concern about implementation challenges remains valid. We must also consider the distributional effects of carbon pricing.

Prof. Torres: Exactly. Carbon pricing can be regressive, disproportionately affecting lower-income households who spend a larger percentage of their income on energy and transportation. This raises important questions about social equity and political feasibility.

Lisa: That's why many economists advocate for revenue recycling, isn't it? Using carbon tax revenues to reduce other taxes or provide direct rebates to households can address these distributional concerns while maintaining the price signal.

Dr. Chen: Precisely. The design details matter enormously. A well-designed carbon pricing system with appropriate complementary policies can be both environmentally effective and socially equitable. The challenge lies in the political economy of implementation.`,
    questions: [
      {
        question: "What was Prof. Torres's main criticism of the EU Emissions Trading System?",
        type: "multiple-choice",
        options: [
          "It was too expensive to implement",
          "Over-allocation of permits led to ineffectively low carbon prices",
          "It only covered a small percentage of emissions",
          "The system was too complex for businesses to understand",
        ],
        correct: 1,
      },
      {
        question: "How did Lisa Wang counter Prof. Torres's criticism?",
        type: "multiple-choice",
        options: [
          "She argued that the system was perfect from the beginning",
          "She mentioned the Market Stability Reserve reforms and rising carbon prices",
          "She said the criticism was completely unfounded",
          "She suggested abandoning carbon pricing altogether",
        ],
        correct: 1,
      },
      {
        question:
          "Analyze the concept of 'revenue recycling' mentioned in the discussion. How does it address the distributional concerns raised about carbon pricing?",
        type: "analysis",
        sampleAnswer:
          "Revenue recycling addresses distributional concerns by using carbon tax revenues to offset the regressive effects of carbon pricing. Instead of simply imposing costs on consumers, governments can use the revenue to reduce other taxes (like income taxes) or provide direct rebates to households, particularly lower-income ones. This approach maintains the price signal that encourages emission reductions while ensuring that the policy doesn't disproportionately burden those least able to afford higher energy costs. The key is that it preserves the environmental incentive while addressing social equity concerns.",
      },
    ],
    difficulty: "advanced",
  },
  {
    id: 2,
    title: "Artificial Intelligence Ethics Symposium",
    context: "Interdisciplinary panel discussing ethical implications of AI in healthcare and employment",
    participants: [
      "Dr. Raj Patel (AI Researcher)",
      "Prof. Elena Rodriguez (Bioethicist)",
      "Dr. James Kim (Labor Economist)",
    ],
    audioDescription: "Expert panel discussing AI bias, healthcare applications, and employment displacement",
    duration: 300,
    transcript: `Dr. Patel: The potential for AI to revolutionize healthcare is immense, but we must address the ethical challenges head-on. Algorithmic bias in medical AI systems can perpetuate and amplify existing health disparities.

Prof. Rodriguez: Absolutely, Raj. We've seen concerning examples where AI diagnostic tools perform significantly worse for underrepresented populations. The training data often reflects historical biases in healthcare delivery, leading to systems that may provide inferior care to already marginalized communities.

Dr. Kim: This connects to broader questions about AI's impact on employment. While AI may create new opportunities in healthcare, it's also likely to displace certain categories of workers. We need to consider the distributional effects carefully.

Dr. Patel: That's a crucial point, James. However, I'd argue that the benefits of AI in healthcare - improved diagnostic accuracy, personalized treatment plans, drug discovery acceleration - could ultimately benefit society broadly. The key is ensuring equitable access to these benefits.

Prof. Rodriguez: But we can't simply assume that benefits will be distributed equitably without deliberate intervention. We need robust governance frameworks that prioritize fairness, transparency, and accountability in AI development and deployment.

Dr. Kim: I agree with Elena. We also need proactive policies to support workers whose jobs may be affected by AI automation. This includes retraining programs, social safety nets, and potentially new models of work and compensation.

Dr. Patel: These are all valid concerns. Perhaps we need to think about AI development as inherently requiring interdisciplinary collaboration - bringing together technologists, ethicists, economists, and affected communities from the outset.`,
    questions: [
      {
        question: "According to Prof. Rodriguez, what is the main cause of AI bias in medical systems?",
        type: "multiple-choice",
        options: [
          "Poorly designed algorithms",
          "Insufficient computing power",
          "Training data that reflects historical biases in healthcare",
          "Lack of medical expertise in AI development",
        ],
        correct: 2,
      },
      {
        question: "What solution does Dr. Kim propose for workers affected by AI automation?",
        type: "multiple-choice",
        options: [
          "Banning AI development in certain sectors",
          "Retraining programs, social safety nets, and new work models",
          "Requiring companies to hire more human workers",
          "Slowing down AI development",
        ],
        correct: 1,
      },
      {
        question:
          "Evaluate the tension between AI's potential benefits in healthcare and the ethical concerns raised. How might society balance innovation with equity?",
        type: "analysis",
        sampleAnswer:
          "The tension between AI's healthcare benefits and ethical concerns requires a balanced approach that doesn't sacrifice innovation for equity or vice versa. Society can balance these by: 1) Implementing inclusive AI development processes that involve diverse stakeholders from the beginning, 2) Establishing regulatory frameworks that require bias testing and fairness audits before deployment, 3) Ensuring equitable access to AI-enhanced healthcare through policy interventions, 4) Investing in retraining and support for displaced workers, and 5) Creating governance structures that can adapt to emerging challenges. The key is proactive, rather than reactive, approaches that embed ethical considerations into the innovation process itself.",
      },
    ],
    difficulty: "expert",
  },
  {
    id: 3,
    title: "Global Trade and Development Forum",
    context: "International economics conference discussing trade policies and developing nations",
    participants: [
      "Dr. Amara Okafor (Development Economist)",
      "Prof. Zhang Wei (Trade Specialist)",
      "Dr. Maria Santos (Policy Advisor)",
    ],
    audioDescription: "Academic discussion on trade liberalization, protectionism, and economic development strategies",
    duration: 280,
    transcript: `Dr. Okafor: The relationship between trade liberalization and economic development remains one of the most contentious issues in development economics. While theory suggests that free trade should benefit all parties, the empirical evidence presents a more nuanced picture.

Prof. Zhang: Indeed, Amara. The experience of East Asian economies suggests that strategic trade policies, including temporary protection of infant industries, can be crucial for economic development. The one-size-fits-all approach of rapid liberalization hasn't always yielded the expected results.

Dr. Santos: But we must also consider the costs of protectionism. While infant industry protection might make theoretical sense, in practice, it often leads to inefficient industries that never become competitive. The political economy dynamics make it difficult to remove protection once it's in place.

Dr. Okafor: That's a fair point, Maria. However, I'd argue that the issue isn't whether to use trade policy as a development tool, but how to use it effectively. Countries like South Korea and Taiwan successfully graduated from protection to become competitive exporters.

Prof. Zhang: The key difference might be institutional capacity. Countries with strong institutions and governance can implement strategic trade policies effectively, while those with weaker institutions may be better served by more liberal approaches.

Dr. Santos: This brings us to the role of international organizations. The WTO's rules limit the policy space available to developing countries, potentially constraining their ability to pursue development strategies that worked for today's developed nations.

Dr. Okafor: Exactly. There's an inherent tension between the need for global trade rules and the recognition that different countries may need different approaches to development. The challenge is creating a system that's both predictable and flexible.`,
    questions: [
      {
        question: "What does Prof. Zhang suggest about the East Asian development experience?",
        type: "multiple-choice",
        options: [
          "It proves that free trade is always beneficial",
          "It shows that strategic trade policies, including temporary protection, can aid development",
          "It demonstrates that protectionism always fails",
          "It indicates that all countries should follow the same trade policies",
        ],
        correct: 1,
      },
      {
        question: "According to Prof. Zhang, what determines whether strategic trade policies are effective?",
        type: "multiple-choice",
        options: [
          "The size of the country's economy",
          "The level of natural resources",
          "Institutional capacity and governance quality",
          "Geographic location",
        ],
        correct: 2,
      },
      {
        question:
          "Analyze the tension Dr. Okafor identifies between global trade rules and national development strategies. How might this tension be resolved?",
        type: "analysis",
        sampleAnswer:
          "The tension between global trade rules and national development strategies reflects the challenge of balancing predictability in international trade with the flexibility needed for diverse development paths. This could be resolved through: 1) Reforming WTO rules to provide more policy space for developing countries, including longer transition periods and more flexible use of development-oriented trade measures, 2) Creating differentiated rules based on development levels, allowing less developed countries more flexibility while maintaining stricter disciplines for advanced economies, 3) Establishing better monitoring and evaluation mechanisms to ensure that policy flexibility is used for genuine development purposes rather than protectionism, 4) Promoting regional trade agreements that can accommodate different development needs while maintaining global integration, and 5) Strengthening technical assistance and capacity building to help developing countries design and implement effective trade policies within international constraints.",
      },
    ],
    difficulty: "expert",
  },
]

export default function AcademicDiscussionsGame() {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [userResponse, setUserResponse] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(2100) // 35 minutes
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
          if (newProgress >= DISCUSSION_SCENARIOS[currentScenario].duration) {
            setIsPlaying(false)
            return DISCUSSION_SCENARIOS[currentScenario].duration
          }
          return newProgress
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isPlaying, listeningPhase, currentScenario])

  const handleAnswerSubmit = () => {
    const scenario = DISCUSSION_SCENARIOS[currentScenario]
    const question = scenario.questions[currentQuestion]
    let isCorrect = false

    if (question.type === "multiple-choice") {
      isCorrect = selectedAnswer === question.correct
    } else if (question.type === "analysis" || question.type === "open-response") {
      // Simple scoring for open responses - check for key concepts
      const response = userResponse.toLowerCase()
      isCorrect =
        response.length >= 100 &&
        (response.includes("policy") ||
          response.includes("economic") ||
          response.includes("social") ||
          response.includes("development") ||
          response.includes("trade") ||
          response.includes("equity"))
    }

    setShowResult(true)

    if (isCorrect) {
      const basePoints = getDifficultyPoints(scenario.difficulty)
      const questionTypeBonus = getQuestionTypeBonus(question.type)
      setScore(score + basePoints + questionTypeBonus)
    }

    setTimeout(() => {
      if (currentQuestion < scenario.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        resetQuestion()
      } else if (currentScenario < DISCUSSION_SCENARIOS.length - 1) {
        setCurrentScenario(currentScenario + 1)
        setCurrentQuestion(0)
        setListeningPhase(true)
        setAudioProgress(0)
        resetQuestion()
      } else {
        handleGameComplete()
      }
    }, 4000)
  }

  const resetQuestion = () => {
    setSelectedAnswer(null)
    setUserResponse("")
    setShowResult(false)
  }

  const getDifficultyPoints = (difficulty: string) => {
    switch (difficulty) {
      case "intermediate":
        return 20
      case "advanced":
        return 30
      case "expert":
        return 40
      default:
        return 20
    }
  }

  const getQuestionTypeBonus = (type: string) => {
    switch (type) {
      case "multiple-choice":
        return 5
      case "open-response":
        return 10
      case "analysis":
        return 15
      default:
        return 0
    }
  }

  const handleGameComplete = () => {
    setGameComplete(true)
    const currentProgress = Number.parseInt(localStorage.getItem("gameProgress") || "0")
    if (currentProgress === 7) {
      localStorage.setItem("gameProgress", "8")
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
          <div className="text-6xl mb-4">🎵</div>
          <h2 className="text-3xl font-bold text-pink-600 mb-4">Discussion Expert!</h2>
          <div className="text-6xl font-bold text-yellow-500 mb-4">{score}</div>
          <p className="text-gray-600 mb-6">Outstanding! You've mastered academic discussions!</p>
          <Button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
          >
            Back to Home
          </Button>
        </motion.div>
      </div>
    )
  }

  const scenario = DISCUSSION_SCENARIOS[currentScenario]
  const question = scenario.questions[currentQuestion]

  if (listeningPhase) {
    return (
      <GameLayout
        gameTitle="Academic Discussions"
        gameIcon={<Music className="text-pink-500" size={32} />}
        instructions={[
          "Read the academic discussion transcript carefully",
          "Analyze different perspectives and arguments presented",
          "Pay attention to how speakers support their points",
          "Note the structure and flow of academic discourse",
          "Answer questions about content and argumentation",
        ]}
        onGameComplete={handleGameComplete}
        currentQuestion={currentScenario + 1}
        totalQuestions={DISCUSSION_SCENARIOS.length}
        score={score}
        timeLeft={timeLeft}
      >
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8 shadow-2xl border-4 border-pink-400">
            <CardContent className="p-8">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <Badge className={getDifficultyColor(scenario.difficulty)}>{scenario.difficulty.toUpperCase()}</Badge>
                <Badge variant="outline">Academic Discussion Analysis</Badge>
              </div>

              {/* Title and Context */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">{scenario.title}</h2>
                <p className="text-lg text-gray-600 mb-4">{scenario.context}</p>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-bold text-purple-800 mb-2">Participants:</h4>
                  <ul className="text-purple-700">
                    {scenario.participants.map((participant, index) => (
                      <li key={index} className="mb-1">
                        • {participant}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Discussion Transcript */}
              <div className="bg-pink-50 rounded-lg p-6 mb-6 border-2 border-pink-200">
                <h3 className="font-bold text-pink-800 mb-4 text-xl">💬 Discussion Transcript:</h3>
                <div className="text-pink-900 leading-relaxed space-y-4 max-h-96 overflow-y-auto">
                  {scenario.transcript.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="text-justify border-l-4 border-pink-300 pl-4 py-2">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Analysis Instructions */}
              <div className="text-center mb-6">
                <div className="bg-pink-100 rounded-lg p-4 inline-block">
                  <p className="text-pink-800 font-medium">🎯 Analysis Focus: 5-7 minutes</p>
                  <p className="text-pink-600 text-sm">Identify arguments, evidence, and different perspectives</p>
                </div>
              </div>

              {/* Continue Button */}
              <div className="text-center">
                <Button onClick={() => setListeningPhase(false)} size="lg" className="bg-green-500 hover:bg-green-600">
                  Continue to Questions ({scenario.questions.length} questions)
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
      gameTitle="Academic Discussions"
      gameIcon={<Music className="text-pink-500" size={32} />}
      instructions={[
        "Answer questions based on the discussion you heard",
        "For analysis questions, provide detailed responses",
        "Consider multiple perspectives presented in the discussion",
        "Support your answers with evidence from the conversation",
      ]}
      onGameComplete={handleGameComplete}
      currentQuestion={`${currentScenario + 1}.${currentQuestion + 1}`}
      totalQuestions={`${DISCUSSION_SCENARIOS.length} discussions`}
      score={score}
      timeLeft={timeLeft}
    >
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentScenario}-${currentQuestion}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mb-8 shadow-2xl border-4 border-pink-400">
              <CardContent className="p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <Badge variant="outline">
                    Question {currentQuestion + 1} of {scenario.questions.length}
                  </Badge>
                  <Button variant="outline" onClick={() => setShowTranscript(!showTranscript)} size="sm">
                    {showTranscript ? "Hide" : "Show"} Transcript
                  </Button>
                </div>

                {/* Question */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{question.question}</h3>
                  <Badge variant="outline" className="text-sm">
                    {question.type.replace("-", " ").toUpperCase()}
                  </Badge>
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
                              ? "bg-pink-100 border-pink-500 text-pink-700"
                              : "bg-white border-gray-300 text-gray-700 hover:bg-pink-50 hover:border-pink-400"
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
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  )}

                  {(question.type === "analysis" || question.type === "open-response") && (
                    <div>
                      <Textarea
                        value={userResponse}
                        onChange={(e) => setUserResponse(e.target.value)}
                        placeholder="Provide a detailed analysis based on the discussion..."
                        className="min-h-32 text-base leading-relaxed"
                        disabled={showResult}
                      />
                      <p className="text-sm text-gray-600 mt-2">
                        Minimum 100 words. Consider the arguments presented and provide your analysis.
                      </p>
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
                        ((question.type === "analysis" || question.type === "open-response") &&
                          userResponse.trim().length < 50)
                      }
                      size="lg"
                      className="bg-pink-500 hover:bg-pink-600 px-8 py-4"
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
                    <div className="text-center mb-4">
                      <div className="text-green-600 font-bold text-2xl mb-2">
                        {question.type === "multiple-choice" && selectedAnswer === question.correct
                          ? "🎉 Correct!"
                          : question.type !== "multiple-choice" && userResponse.length >= 100
                            ? "📝 Good Analysis!"
                            : "❌ Needs Improvement"}
                      </div>
                      <div className="text-green-700">
                        +{getDifficultyPoints(scenario.difficulty)} base points + {getQuestionTypeBonus(question.type)}{" "}
                        type bonus
                      </div>
                    </div>

                    {question.sampleAnswer && (
                      <div className="bg-blue-50 p-4 rounded-lg text-left">
                        <h4 className="font-bold text-blue-800 mb-2">Sample Analysis:</h4>
                        <p className="text-blue-700 text-sm leading-relaxed">{question.sampleAnswer}</p>
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
                    <h3 className="font-bold text-yellow-800 mb-3">Discussion Transcript:</h3>
                    <div className="text-yellow-700 leading-relaxed max-h-48 overflow-y-auto text-sm">
                      {scenario.transcript.split("\n\n").map((paragraph, index) => (
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
