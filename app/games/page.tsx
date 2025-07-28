"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  FileText,
  PenTool,
  Headphones,
  Brain,
  FileEdit,
  Music,
  Microscope,
  GraduationCap,
  Search,
  Lock,
  Star,
  Clock,
  Target,
  Code,
  Calculator,
  Network,
  Key,
  Cpu,
  Database,
  Bot,
  Terminal,
} from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface Game {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  difficulty: "Basic" | "Expert" | "Master" | "Legendary" | "Ultimate"
  category: "Language" | "Academic" | "Technical" | "Advanced"
  estimatedTime: string
  points: number
  unlocked: boolean
  path: string
  level: number
}

const GAMES: Game[] = [
  {
    id: 1,
    title: "Vocabulary Master",
    description: "Master advanced academic vocabulary with contextual understanding and usage examples.",
    icon: <BookOpen className="text-blue-500" size={32} />,
    difficulty: "Basic",
    category: "Language",
    estimatedTime: "25 min",
    points: 100,
    unlocked: true,
    path: "/games/vocabulary-master",
    level: 1,
  },
  {
    id: 2,
    title: "Reading Comprehension",
    description: "Analyze complex academic texts and demonstrate deep understanding of content.",
    icon: <FileText className="text-green-500" size={32} />,
    difficulty: "Basic",
    category: "Language",
    estimatedTime: "30 min",
    points: 120,
    unlocked: true,
    path: "/games/reading-comprehension",
    level: 2,
  },
  {
    id: 3,
    title: "Academic Writing",
    description: "Develop sophisticated writing skills for academic and professional contexts.",
    icon: <PenTool className="text-purple-500" size={32} />,
    difficulty: "Expert",
    category: "Language",
    estimatedTime: "35 min",
    points: 150,
    unlocked: true,
    path: "/games/academic-writing",
    level: 3,
  },
  {
    id: 4,
    title: "Listening Skills",
    description: "Enhance comprehension of academic lectures, discussions, and presentations.",
    icon: <Headphones className="text-indigo-500" size={32} />,
    difficulty: "Expert",
    category: "Language",
    estimatedTime: "25 min",
    points: 130,
    unlocked: true,
    path: "/games/listening-skills",
    level: 4,
  },
  {
    id: 5,
    title: "Critical Analysis",
    description: "Develop advanced critical thinking and analytical reasoning skills.",
    icon: <Brain className="text-red-500" size={32} />,
    difficulty: "Master",
    category: "Academic",
    estimatedTime: "40 min",
    points: 180,
    unlocked: true,
    path: "/games/critical-analysis",
    level: 5,
  },
  {
    id: 6,
    title: "Essay Structure",
    description: "Master the art of structuring compelling and coherent academic essays.",
    icon: <FileEdit className="text-orange-500" size={32} />,
    difficulty: "Master",
    category: "Academic",
    estimatedTime: "30 min",
    points: 160,
    unlocked: true,
    path: "/games/essay-structure",
    level: 6,
  },
  {
    id: 7,
    title: "Contextual Vocabulary",
    description: "Advanced vocabulary mastery through contextual analysis and application.",
    icon: <BookOpen className="text-purple-500" size={32} />,
    difficulty: "Master",
    category: "Language",
    estimatedTime: "30 min",
    points: 170,
    unlocked: true,
    path: "/games/contextual-vocabulary",
    level: 7,
  },
  {
    id: 8,
    title: "Academic Discussions",
    description: "Analyze and participate in high-level academic discourse and debates.",
    icon: <Music className="text-pink-500" size={32} />,
    difficulty: "Legendary",
    category: "Academic",
    estimatedTime: "35 min",
    points: 200,
    unlocked: true,
    path: "/games/academic-discussions",
    level: 8,
  },
  {
    id: 9,
    title: "Research Methods",
    description: "Master research methodology, design, and analysis techniques.",
    icon: <Microscope className="text-blue-500" size={32} />,
    difficulty: "Legendary",
    category: "Academic",
    estimatedTime: "40 min",
    points: 220,
    unlocked: true,
    path: "/games/research-methods",
    level: 9,
  },
  {
    id: 10,
    title: "Thesis Development",
    description: "Advanced thesis writing and argumentation for graduate-level work.",
    icon: <GraduationCap className="text-emerald-500" size={32} />,
    difficulty: "Legendary",
    category: "Academic",
    estimatedTime: "45 min",
    points: 250,
    unlocked: false,
    path: "/games/thesis-development",
    level: 10,
  },
  {
    id: 11,
    title: "Master Logic",
    description: "Ultimate logical reasoning and problem-solving challenges.",
    icon: <Brain className="text-violet-500" size={32} />,
    difficulty: "Ultimate",
    category: "Advanced",
    estimatedTime: "50 min",
    points: 300,
    unlocked: false,
    path: "/games/master-logic",
    level: 11,
  },
  {
    id: 12,
    title: "Code Breaker",
    description: "Advanced pattern recognition and cryptographic problem solving.",
    icon: <Code className="text-cyan-500" size={32} />,
    difficulty: "Ultimate",
    category: "Technical",
    estimatedTime: "45 min",
    points: 280,
    unlocked: false,
    path: "/games/code-breaker",
    level: 12,
  },
  {
    id: 13,
    title: "Quantum Math",
    description: "Master advanced mathematical concepts and quantum problem solving.",
    icon: <Calculator className="text-blue-600" size={32} />,
    difficulty: "Ultimate",
    category: "Technical",
    estimatedTime: "55 min",
    points: 350,
    unlocked: false,
    path: "/games/quantum-math",
    level: 13,
  },
  {
    id: 14,
    title: "Neural Network",
    description: "Advanced AI and machine learning concept mastery.",
    icon: <Network className="text-green-600" size={32} />,
    difficulty: "Ultimate",
    category: "Technical",
    estimatedTime: "50 min",
    points: 320,
    unlocked: false,
    path: "/games/neural-network",
    level: 14,
  },
  {
    id: 15,
    title: "Cipher Quest",
    description: "Master advanced cryptography and security concepts.",
    icon: <Key className="text-yellow-600" size={32} />,
    difficulty: "Ultimate",
    category: "Technical",
    estimatedTime: "45 min",
    points: 290,
    unlocked: false,
    path: "/games/cipher-quest",
    level: 15,
  },
  {
    id: 16,
    title: "Algorithm Race",
    description: "Advanced algorithmic thinking and computational problem solving.",
    icon: <Cpu className="text-red-600" size={32} />,
    difficulty: "Ultimate",
    category: "Technical",
    estimatedTime: "60 min",
    points: 380,
    unlocked: false,
    path: "/games/algorithm-race",
    level: 16,
  },
  {
    id: 17,
    title: "Data Mining",
    description: "Master advanced data analysis and pattern recognition.",
    icon: <Database className="text-purple-600" size={32} />,
    difficulty: "Ultimate",
    category: "Technical",
    estimatedTime: "55 min",
    points: 360,
    unlocked: false,
    path: "/games/data-mining",
    level: 17,
  },
  {
    id: 18,
    title: "AI Challenge",
    description: "Ultimate artificial intelligence and machine learning mastery.",
    icon: <Bot className="text-indigo-600" size={32} />,
    difficulty: "Ultimate",
    category: "Advanced",
    estimatedTime: "65 min",
    points: 400,
    unlocked: false,
    path: "/games/ai-challenge",
    level: 18,
  },
  {
    id: 19,
    title: "System Hack",
    description: "Master advanced cybersecurity and system analysis.",
    icon: <Terminal className="text-gray-600" size={32} />,
    difficulty: "Ultimate",
    category: "Technical",
    estimatedTime: "70 min",
    points: 450,
    unlocked: false,
    path: "/games/system-hack",
    level: 19,
  },
]

export default function GamesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [gameProgress, setGameProgress] = useState(0)

  useEffect(() => {
    const progress = Number.parseInt(localStorage.getItem("gameProgress") || "0")
    setGameProgress(progress)
  }, [])

  const filteredGames = GAMES.filter((game) => {
    const matchesSearch =
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || game.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "All" || game.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Basic":
        return "bg-green-100 text-green-800"
      case "Expert":
        return "bg-yellow-100 text-yellow-800"
      case "Master":
        return "bg-orange-100 text-orange-800"
      case "Legendary":
        return "bg-red-100 text-red-800"
      case "Ultimate":
        return "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Language":
        return "bg-blue-100 text-blue-800"
      case "Academic":
        return "bg-purple-100 text-purple-800"
      case "Technical":
        return "bg-green-100 text-green-800"
      case "Advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const isGameUnlocked = (game: Game) => {
    return game.level <= gameProgress + 1
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Game Library
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Challenge yourself with 19 levels of IELTS-level academic games designed for college students.
            </p>

            {/* Progress Indicator */}
            <div className="bg-white rounded-2xl p-6 shadow-lg max-w-md mx-auto">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">Your Progress</span>
                <span className="text-sm font-bold text-blue-600">{gameProgress}/19 Games</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(gameProgress / 19) * 100}%` }}
                ></div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    placeholder="Search games..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="All">All Categories</option>
                    <option value="Language">Language</option>
                    <option value="Academic">Academic</option>
                    <option value="Technical">Technical</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="All">All Difficulties</option>
                    <option value="Basic">Basic</option>
                    <option value="Expert">Expert</option>
                    <option value="Master">Master</option>
                    <option value="Legendary">Legendary</option>
                    <option value="Ultimate">Ultimate</option>
                  </select>
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-center">
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    {filteredGames.length} Games Found
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGames.map((game, index) => {
            const unlocked = isGameUnlocked(game)

            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={`h-full transition-all duration-300 hover:shadow-xl ${
                    unlocked ? "hover:scale-105 cursor-pointer" : "opacity-60"
                  }`}
                >
                  <CardContent className="p-6">
                    {/* Game Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {unlocked ? game.icon : <Lock className="text-gray-400" size={32} />}
                        <Badge className="text-xs font-bold">Level {game.level}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getDifficultyColor(game.difficulty)}>{game.difficulty}</Badge>
                        <Badge className={getCategoryColor(game.category)}>{game.category}</Badge>
                      </div>
                    </div>

                    {/* Game Title */}
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{game.title}</h3>

                    {/* Game Description */}
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">{game.description}</p>

                    {/* Game Stats */}
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{game.estimatedTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={16} />
                        <span>{game.points} pts</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-auto">
                      {unlocked ? (
                        <Link href={game.path}>
                          <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                            <Target className="mr-2" size={16} />
                            Start Challenge
                          </Button>
                        </Link>
                      ) : (
                        <Button disabled className="w-full">
                          <Lock className="mr-2" size={16} />
                          Complete Level {game.level - 1} to Unlock
                        </Button>
                      )}
                    </div>

                    {/* Unlock Progress */}
                    {!unlocked && (
                      <div className="mt-3 text-center">
                        <p className="text-xs text-gray-500">
                          Progress: {gameProgress}/{game.level - 1} games completed
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                          <div
                            className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((gameProgress / (game.level - 1)) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* No Results */}
        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Games Found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
