"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import {
  BookOpen,
  Trophy,
  Users,
  Target,
  Clock,
  Star,
  TrendingUp,
  Award,
  Zap,
  Brain,
  Play,
  Lock,
  CheckCircle,
  FileText,
  PenTool,
  Headphones,
  Puzzle,
  Music,
  Gamepad2,
} from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface Game {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  estimatedTime: string
  points: number
  category: "vocabulary" | "reading" | "writing" | "listening" | "advanced"
  route: string
  locked: boolean
  requiredLevel: number
}

const GAMES: Game[] = [
  // Basic Games (Levels 1-9)
  {
    id: 1,
    title: "Vocabulary Master",
    description: "Master IELTS-level vocabulary with advanced word definitions and contexts",
    icon: <BookOpen className="text-blue-500" size={32} />,
    difficulty: "Beginner",
    estimatedTime: "20 min",
    points: 100,
    category: "vocabulary",
    route: "/games/vocabulary-master",
    locked: false,
    requiredLevel: 1,
  },
  {
    id: 2,
    title: "Reading Comprehension",
    description: "Analyze complex academic passages and answer comprehension questions",
    icon: <FileText className="text-green-500" size={32} />,
    difficulty: "Intermediate",
    estimatedTime: "30 min",
    points: 150,
    category: "reading",
    route: "/games/reading-comprehension",
    locked: false,
    requiredLevel: 2,
  },
  {
    id: 3,
    title: "Academic Writing",
    description: "Develop thesis statements, paragraphs, and argumentative essays",
    icon: <PenTool className="text-purple-500" size={32} />,
    difficulty: "Advanced",
    estimatedTime: "45 min",
    points: 200,
    category: "writing",
    route: "/games/academic-writing",
    locked: false,
    requiredLevel: 3,
  },
  {
    id: 4,
    title: "Listening Skills",
    description: "Improve comprehension through academic lectures and conversations",
    icon: <Headphones className="text-indigo-500" size={32} />,
    difficulty: "Intermediate",
    estimatedTime: "25 min",
    points: 125,
    category: "listening",
    route: "/games/listening-skills",
    locked: false,
    requiredLevel: 4,
  },
  {
    id: 5,
    title: "Critical Analysis",
    description: "Analyze arguments, identify fallacies, and evaluate evidence",
    icon: <Brain className="text-orange-500" size={32} />,
    difficulty: "Advanced",
    estimatedTime: "35 min",
    points: 175,
    category: "reading",
    route: "/games/critical-analysis",
    locked: false,
    requiredLevel: 5,
  },
  {
    id: 6,
    title: "Essay Structure",
    description: "Master the art of structuring academic essays and research papers",
    icon: <Target className="text-red-500" size={32} />,
    difficulty: "Advanced",
    estimatedTime: "40 min",
    points: 180,
    category: "writing",
    route: "/games/essay-structure",
    locked: false,
    requiredLevel: 6,
  },
  {
    id: 7,
    title: "Contextual Vocabulary",
    description: "Learn advanced vocabulary through contextual usage and collocations",
    icon: <Puzzle className="text-teal-500" size={32} />,
    difficulty: "Intermediate",
    estimatedTime: "30 min",
    points: 140,
    category: "vocabulary",
    route: "/games/contextual-vocabulary",
    locked: false,
    requiredLevel: 7,
  },
  {
    id: 8,
    title: "Academic Discussions",
    description: "Participate in simulated academic discussions and debates",
    icon: <Music className="text-pink-500" size={32} />,
    difficulty: "Advanced",
    estimatedTime: "35 min",
    points: 165,
    category: "listening",
    route: "/games/academic-discussions",
    locked: false,
    requiredLevel: 8,
  },
  {
    id: 9,
    title: "Research Methods",
    description: "Learn to evaluate research methodologies and statistical data",
    icon: <Gamepad2 className="text-cyan-500" size={32} />,
    difficulty: "Expert",
    estimatedTime: "50 min",
    points: 220,
    category: "reading",
    route: "/games/research-methods",
    locked: false,
    requiredLevel: 9,
  },

  // Advanced Games (Levels 10-19)
  {
    id: 10,
    title: "Thesis Development",
    description: "Craft compelling thesis statements for complex academic arguments",
    icon: <Zap className="text-yellow-500" size={32} />,
    difficulty: "Expert",
    estimatedTime: "45 min",
    points: 250,
    category: "advanced",
    route: "/games/thesis-development",
    locked: true,
    requiredLevel: 10,
  },
  {
    id: 11,
    title: "Discourse Analysis",
    description: "Analyze linguistic patterns and rhetorical strategies in texts",
    icon: <Trophy className="text-gold-500" size={32} />,
    difficulty: "Expert",
    estimatedTime: "55 min",
    points: 275,
    category: "advanced",
    route: "/games/discourse-analysis",
    locked: true,
    requiredLevel: 11,
  },
  {
    id: 12,
    title: "Comparative Literature",
    description: "Compare and contrast literary works across different cultures",
    icon: <Star className="text-purple-600" size={32} />,
    difficulty: "Expert",
    estimatedTime: "60 min",
    points: 300,
    category: "advanced",
    route: "/games/comparative-literature",
    locked: true,
    requiredLevel: 12,
  },
  {
    id: 13,
    title: "Philosophical Arguments",
    description: "Construct and deconstruct complex philosophical arguments",
    icon: <Brain className="text-indigo-600" size={32} />,
    difficulty: "Expert",
    estimatedTime: "50 min",
    points: 280,
    category: "advanced",
    route: "/games/philosophical-arguments",
    locked: true,
    requiredLevel: 13,
  },
  {
    id: 14,
    title: "Scientific Writing",
    description: "Master the conventions of scientific and technical writing",
    icon: <FileText className="text-green-600" size={32} />,
    difficulty: "Expert",
    estimatedTime: "55 min",
    points: 290,
    category: "advanced",
    route: "/games/scientific-writing",
    locked: true,
    requiredLevel: 14,
  },
  {
    id: 15,
    title: "Sociolinguistics",
    description: "Explore the relationship between language and society",
    icon: <Users className="text-blue-600" size={32} />,
    difficulty: "Expert",
    estimatedTime: "45 min",
    points: 270,
    category: "advanced",
    route: "/games/sociolinguistics",
    locked: true,
    requiredLevel: 15,
  },
  {
    id: 16,
    title: "Cognitive Psychology",
    description: "Understand cognitive processes through academic texts",
    icon: <Brain className="text-red-600" size={32} />,
    difficulty: "Expert",
    estimatedTime: "50 min",
    points: 285,
    category: "advanced",
    route: "/games/cognitive-psychology",
    locked: true,
    requiredLevel: 16,
  },
  {
    id: 17,
    title: "Global Economics",
    description: "Analyze economic theories and global market trends",
    icon: <TrendingUp className="text-emerald-600" size={32} />,
    difficulty: "Expert",
    estimatedTime: "55 min",
    points: 295,
    category: "advanced",
    route: "/games/global-economics",
    locked: true,
    requiredLevel: 17,
  },
  {
    id: 18,
    title: "Environmental Science",
    description: "Explore complex environmental issues and solutions",
    icon: <Target className="text-green-700" size={32} />,
    difficulty: "Expert",
    estimatedTime: "50 min",
    points: 280,
    category: "advanced",
    route: "/games/environmental-science",
    locked: true,
    requiredLevel: 18,
  },
  {
    id: 19,
    title: "Master's Thesis",
    description: "The ultimate challenge: Write a complete thesis proposal",
    icon: <Award className="text-gold-600" size={32} />,
    difficulty: "Expert",
    estimatedTime: "90 min",
    points: 500,
    category: "advanced",
    route: "/games/masters-thesis",
    locked: true,
    requiredLevel: 19,
  },
]

export default function HomePage() {
  const [gameProgress, setGameProgress] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showWelcomeModal, setShowWelcomeModal] = useState(true)

  useEffect(() => {
    const progress = Number.parseInt(localStorage.getItem("gameProgress") || "0")
    const score = Number.parseInt(localStorage.getItem("totalScore") || "0")
    setGameProgress(progress)
    setTotalScore(score)
  }, [])

  const filteredGames = selectedCategory === "all" ? GAMES : GAMES.filter((game) => game.category === selectedCategory)

  const completedGames = GAMES.filter((_, index) => index < gameProgress).length
  const progressPercentage = (gameProgress / GAMES.length) * 100

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-orange-100 text-orange-800"
      case "Expert":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      {/* Welcome Modal */}
      {showWelcomeModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md text-center shadow-2xl"
          >
            <div className="text-6xl mb-4">🎓</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Play & Learn!</h2>
            <p className="text-gray-600 mb-6">
              Master IELTS-level vocabulary and academic skills through engaging games designed for college students.
            </p>
            <div className="flex gap-4">
              <Button
                onClick={() => setShowWelcomeModal(false)}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                Start Learning
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              Master Academic
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                English
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Enhance your IELTS vocabulary, reading comprehension, academic writing, and listening skills through
              interactive games designed specifically for college students.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">{GAMES.length}</div>
                <div className="text-gray-600">Total Games</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">{completedGames}</div>
                <div className="text-gray-600">Completed</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">{totalScore.toLocaleString()}</div>
                <div className="text-gray-600">Total Score</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-orange-600 mb-2">{Math.round(progressPercentage)}%</div>
                <div className="text-gray-600">Progress</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-12">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Overall Progress</h3>
                <Badge variant="outline" className="text-sm">
                  Level {gameProgress + 1}
                </Badge>
              </div>
              <Progress value={progressPercentage} className="h-3 mb-2" />
              <div className="text-sm text-gray-600">
                {completedGames} of {GAMES.length} games completed
              </div>
            </div>
          </motion.div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {["all", "vocabulary", "reading", "writing", "listening", "advanced"].map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category === "all" ? "All Games" : category.replace("-", " ")}
            </Button>
          ))}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={`h-full transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                  game.locked ? "opacity-60" : ""
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {game.icon}
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{game.title}</h3>
                        <Badge className={getDifficultyColor(game.difficulty)} variant="secondary">
                          {game.difficulty}
                        </Badge>
                      </div>
                    </div>
                    {game.locked ? (
                      <Lock className="text-gray-400" size={20} />
                    ) : (
                      <CheckCircle className="text-green-500" size={20} />
                    )}
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">{game.description}</p>

                  <div className="flex items-center justify-between mb-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      {game.estimatedTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={16} />
                      {game.points} pts
                    </div>
                  </div>

                  <Link href={game.locked ? "#" : game.route}>
                    <Button className="w-full" disabled={game.locked} variant={game.locked ? "outline" : "default"}>
                      {game.locked ? (
                        <>
                          <Lock size={16} className="mr-2" />
                          Requires Level {game.requiredLevel}
                        </>
                      ) : (
                        <>
                          <Play size={16} className="mr-2" />
                          Play Now
                        </>
                      )}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Excel in Academic English?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of students who have improved their academic English skills through our comprehensive
              game-based learning platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/progress">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Trophy size={20} className="mr-2" />
                  View Leaderboard
                </Button>
              </Link>
              <Link href="/community">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
                >
                  <Users size={20} className="mr-2" />
                  Join Community
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
