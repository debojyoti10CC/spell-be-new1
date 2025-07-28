"use client"

import { useState, useEffect } from "react"
import { GameLayout } from "@/components/game-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AIChallenge {
  id: number
  name: string
  type: "prompt-engineering" | "model-training" | "ethics" | "turing-test" | "optimization"
  description: string
  scenario: string
  question: string
  options?: string[]
  correctAnswer: string | number
  explanation: string
  difficulty: number
}

const AI_CHALLENGES: AIChallenge[] = [
  {
    id: 1,
    name: "Prompt Engineering",
    type: "prompt-engineering",
    description: "Design effective prompts for AI language models",
    scenario: "You need an AI to write a professional email declining a job offer politely.",
    question: "Which prompt would be most effective?",
    options: [
      "Write an email",
      "Write a polite email declining a job offer while expressing gratitude",
      "Decline job offer email professional tone grateful respectful brief",
      "Write a professional email to decline a job offer. Be polite, grateful, and brief. Maintain positive relationship.",
    ],
    correctAnswer: 3,
    explanation:
      "Option 4 is most effective because it's specific, includes tone guidance, and specifies the desired outcome.",
    difficulty: 1,
  },
  {
    id: 2,
    name: "AI Ethics Dilemma",
    type: "ethics",
    description: "Navigate complex ethical decisions in AI development",
    scenario:
      "Your AI hiring system shows bias against certain demographic groups but increases overall hiring efficiency by 40%.",
    question: "What should you do?",
    options: [
      "Keep using it - efficiency matters most",
      "Immediately stop and redesign to eliminate bias",
      "Use it only for initial screening, not final decisions",
      "Adjust the algorithm to favor underrepresented groups",
    ],
    correctAnswer: 1,
    explanation:
      "Eliminating bias is crucial for fair hiring practices, even if it reduces efficiency. Ethical AI must prioritize fairness.",
    difficulty: 2,
  },
  {
    id: 3,
    name: "Turing Test Challenge",
    type: "turing-test",
    description: "Identify whether responses are from humans or AI",
    scenario: "You're evaluating responses to determine if they're human or AI-generated.",
    question: "Which response is most likely from a human when asked 'Describe your childhood'?",
    options: [
      "I had a wonderful childhood with loving parents and many educational opportunities that shaped my development.",
      "My childhood was pretty normal I guess. Spent a lot of time playing video games and avoiding homework lol. My mom was always on my case about cleaning my room.",
      "During my formative years, I experienced various developmental milestones and social interactions that contributed to my cognitive growth.",
      "I experienced a typical human childhood with standard developmental phases including play, learning, and social bonding activities.",
    ],
    correctAnswer: 1,
    explanation:
      "Option 2 shows natural human speech patterns, casual language, specific details, and imperfect grammar that's typical of human responses.",
    difficulty: 3,
  },
  {
    id: 4,
    name: "Model Optimization",
    type: "optimization",
    description: "Optimize AI model performance and efficiency",
    scenario: "Your image recognition model has 95% accuracy but takes 5 seconds per image. Users need faster results.",
    question: "What's the best optimization strategy?",
    options: [
      "Reduce model size by 50% (accuracy drops to 90%)",
      "Use GPU acceleration (2x faster, same accuracy)",
      "Implement model quantization (3x faster, 93% accuracy)",
      "Pre-process images to lower resolution (4x faster, 85% accuracy)",
    ],
    correctAnswer: 2,
    explanation:
      "Model quantization offers the best balance of speed improvement (3x) while maintaining high accuracy (93%).",
    difficulty: 4,
  },
  {
    id: 5,
    name: "AI Training Strategy",
    type: "model-training",
    description: "Design effective training strategies for AI models",
    scenario: "You're training a chatbot with limited data. The model overfits to training data.",
    question: "What's the most effective solution?",
    options: [
      "Collect more training data",
      "Reduce model complexity and add regularization",
      "Increase training epochs",
      "Use a larger pre-trained model",
    ],
    correctAnswer: 1,
    explanation:
      "Reducing model complexity and adding regularization directly addresses overfitting by preventing the model from memorizing training data.",
    difficulty: 5,
  },
]

export default function AIChallengeGame() {
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes
  const [gameStarted, setGameStarted] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [answered, setAnswered] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameOver) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
      return () => clearInterval(timer)
    }
  }, [gameStarted, timeLeft, gameOver])

  const startGame = () => {
    setGameStarted(true)
    setCurrentChallenge(0)
    setScore(0)
    setTimeLeft(600)
    setSelectedAnswer("")
    setShowExplanation(false)
    setAnswered(false)
    setGameOver(false)
    setStreak(0)
  }

  const submitAnswer = () => {
    const challenge = AI_CHALLENGES[currentChallenge]
    const userAnswerIndex = Number.parseInt(selectedAnswer)
    const isCorrect = userAnswerIndex === challenge.correctAnswer

    if (isCorrect) {
      const basePoints = challenge.difficulty * 50
      const streakBonus = streak * 10
      const totalPoints = basePoints + streakBonus
      setScore((prev) => prev + totalPoints)
      setStreak((prev) => prev + 1)
    } else {
      setStreak(0)
    }

    setAnswered(true)
    setShowExplanation(true)
  }

  const nextChallenge = () => {
    if (currentChallenge < AI_CHALLENGES.length - 1) {
      setCurrentChallenge((prev) => prev + 1)
      setSelectedAnswer("")
      setShowExplanation(false)
      setAnswered(false)
    } else {
      setGameOver(true)
      // Update progress in localStorage
      const progress = JSON.parse(localStorage.getItem("gameProgress") || "{}")
      progress[17] = { completed: true, score, timestamp: Date.now() }
      localStorage.setItem("gameProgress", JSON.stringify(progress))
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "prompt-engineering":
        return "bg-blue-100 text-blue-800"
      case "model-training":
        return "bg-green-100 text-green-800"
      case "ethics":
        return "bg-red-100 text-red-800"
      case "turing-test":
        return "bg-purple-100 text-purple-800"
      case "optimization":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!gameStarted) {
    return (
      <GameLayout
        title="AI Challenge"
        level={17}
        onStart={startGame}
        description="Master artificial intelligence concepts and ethical considerations"
      >
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">AI Challenge</h2>
          <p className="text-gray-600">Test your knowledge of AI concepts, ethics, and best practices</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-bold">AI Ethics</h3>
                <p className="text-sm text-gray-600">Navigate moral dilemmas in AI</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-bold">Model Training</h3>
                <p className="text-sm text-gray-600">Optimize AI performance</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-bold">Turing Tests</h3>
                <p className="text-sm text-gray-600">Distinguish human from AI</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </GameLayout>
    )
  }

  if (gameOver) {
    return (
      <GameLayout
        title="AI Challenge"
        level={17}
        onStart={startGame}
        description="Master artificial intelligence concepts and ethical considerations"
      >
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">AI Expert!</h2>
          <p className="text-xl">Final Score: {score}</p>
          <p className="text-gray-600">You've mastered the complexities of artificial intelligence!</p>
          <Button onClick={startGame} size="lg">
            Challenge Again
          </Button>
        </div>
      </GameLayout>
    )
  }

  const challenge = AI_CHALLENGES[currentChallenge]

  return (
    <GameLayout
      title="AI Challenge"
      level={17}
      onStart={startGame}
      description="Master artificial intelligence concepts and ethical considerations"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Game Header */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Badge variant="outline">
              Challenge {currentChallenge + 1}/{AI_CHALLENGES.length}
            </Badge>
            <Badge variant="outline">Score: {score}</Badge>
            <Badge variant={timeLeft < 60 ? "destructive" : "outline"}>Time: {formatTime(timeLeft)}</Badge>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">Streak: {streak}</Badge>
            <Badge className={getTypeColor(challenge.type)}>{challenge.type.replace("-", " ").toUpperCase()}</Badge>
          </div>
        </div>

        {/* Challenge Card */}
        <Card>
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold">{challenge.name}</h3>
              <Badge variant="outline">Difficulty: {challenge.difficulty}/5</Badge>
            </div>

            <p className="text-gray-600 mb-6">{challenge.description}</p>

            <div className="p-6 bg-blue-50 rounded-lg mb-6">
              <h4 className="font-bold text-blue-800 mb-3">Scenario:</h4>
              <p className="text-blue-700 leading-relaxed">{challenge.scenario}</p>
            </div>

            <div className="p-6 bg-green-50 rounded-lg mb-6">
              <h4 className="font-bold text-green-800 mb-3">Question:</h4>
              <p className="text-green-700 text-lg">{challenge.question}</p>
            </div>

            {/* Answer Options */}
            {!answered && challenge.options && (
              <div className="space-y-3">
                <h4 className="font-bold">Choose your answer:</h4>
                {challenge.options.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedAnswer(index.toString())}
                    className={`
                      p-4 rounded-lg border-2 cursor-pointer transition-all
                      ${
                        selectedAnswer === index.toString()
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <Badge variant="outline">{String.fromCharCode(65 + index)}</Badge>
                      <p className="flex-1">{option}</p>
                    </div>
                  </div>
                ))}

                <Button onClick={submitAnswer} disabled={!selectedAnswer} size="lg" className="w-full mt-6">
                  Submit Answer
                </Button>
              </div>
            )}

            {/* Explanation */}
            {showExplanation && (
              <div className="mt-6 p-6 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Badge
                    variant={Number.parseInt(selectedAnswer) === challenge.correctAnswer ? "default" : "destructive"}
                  >
                    {Number.parseInt(selectedAnswer) === challenge.correctAnswer ? "Correct!" : "Incorrect"}
                  </Badge>
                  <span className="font-bold">
                    Correct Answer: {String.fromCharCode(65 + (challenge.correctAnswer as number))}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{challenge.explanation}</p>
                <Button onClick={nextChallenge} size="lg">
                  {currentChallenge < AI_CHALLENGES.length - 1 ? "Next Challenge" : "Finish"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Concepts Reference */}
        <Card>
          <CardContent className="p-4">
            <h4 className="font-bold mb-2">AI Concepts:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Prompt Engineering:</strong> Crafting effective AI inputs
              </div>
              <div>
                <strong>Model Training:</strong> Teaching AI from data
              </div>
              <div>
                <strong>AI Ethics:</strong> Responsible AI development
              </div>
              <div>
                <strong>Turing Test:</strong> Measuring AI intelligence
              </div>
              <div>
                <strong>Optimization:</strong> Improving AI performance
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  )
}
