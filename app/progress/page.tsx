"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Trophy,
  Star,
  Target,
  TrendingUp,
  Award,
  Calendar,
  BookOpen,
  FileText,
  PenTool,
  Headphones,
  Brain,
  Zap,
} from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"

interface GameStats {
  id: number
  title: string
  icon: React.ReactNode
  category: string
  completed: boolean
  score: number
  attempts: number
  bestTime: number
  lastPlayed: string
}

export default function ProgressPage() {
  const [gameProgress, setGameProgress] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [gamesCompleted, setGamesCompleted] = useState(0)
  const [averageScore, setAverageScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [gameStats, setGameStats] = useState<GameStats[]>([])

  useEffect(() => {
    // Load progress data from localStorage
    const progress = Number.parseInt(localStorage.getItem("gameProgress") || "0")
    const score = Number.parseInt(localStorage.getItem("totalScore") || "0")

    setGameProgress(progress)
    setTotalScore(score)
    setGamesCompleted(progress)
    setAverageScore(progress > 0 ? Math.round(score / progress) : 0)
    setStreak(Number.parseInt(localStorage.getItem("currentStreak") || "0"))

    // Mock game statistics
    const mockStats: GameStats[] = [
      {
        id: 1,
        title: "Vocabulary Master",
        icon: <BookOpen className="text-blue-500" size={24} />,
        category: "Vocabulary",
        completed: progress >= 1,
        score: progress >= 1 ? 850 : 0,
        attempts: progress >= 1 ? 3 : 0,
        bestTime: progress >= 1 ? 1180 : 0,
        lastPlayed: progress >= 1 ? "2024-01-15" : "Never",
      },
      {
        id: 2,
        title: "Reading Comprehension",
        icon: <FileText className="text-green-500" size={24} />,
        category: "Reading",
        completed: progress >= 2,
        score: progress >= 2 ? 920 : 0,
        attempts: progress >= 2 ? 2 : 0,
        bestTime: progress >= 2 ? 1650 : 0,
        lastPlayed: progress >= 2 ? "2024-01-16" : "Never",
      },
      {
        id: 3,
        title: "Academic Writing",
        icon: <PenTool className="text-purple-500" size={24} />,
        category: "Writing",
        completed: progress >= 3,
        score: progress >= 3 ? 780 : 0,
        attempts: progress >= 3 ? 4 : 0,
        bestTime: progress >= 3 ? 2340 : 0,
        lastPlayed: progress >= 3 ? "2024-01-17" : "Never",
      },
      {
        id: 4,
        title: "Listening Skills",
        icon: <Headphones className="text-indigo-500" size={24} />,
        category: "Listening",
        completed: progress >= 4,
        score: progress >= 4 ? 690 : 0,
        attempts: progress >= 4 ? 2 : 0,
        bestTime: progress >= 4 ? 1420 : 0,
        lastPlayed: progress >= 4 ? "2024-01-18" : "Never",
      },
      {
        id: 5,
        title: "Critical Analysis",
        icon: <Brain className="text-orange-500" size={24} />,
        category: "Reading",
        completed: progress >= 5,
        score: progress >= 5 ? 1050 : 0,
        attempts: progress >= 5 ? 3 : 0,
        bestTime: progress >= 5 ? 1890 : 0,
        lastPlayed: progress >= 5 ? "2024-01-19" : "Never",
      },
    ]

    setGameStats(mockStats)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getProgressLevel = () => {
    if (gameProgress >= 15) return { level: "Expert", color: "text-red-600", bg: "bg-red-100" }
    if (gameProgress >= 10) return { level: "Advanced", color: "text-orange-600", bg: "bg-orange-100" }
    if (gameProgress >= 5) return { level: "Intermediate", color: "text-yellow-600", bg: "bg-yellow-100" }
    return { level: "Beginner", color: "text-green-600", bg: "bg-green-100" }
  }

  const progressLevel = getProgressLevel()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              Your
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Progress
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Track your learning journey and celebrate your achievements in academic English mastery.
            </p>
          </motion.div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Score</p>
                    <p className="text-3xl font-bold">{totalScore.toLocaleString()}</p>
                  </div>
                  <Trophy size={40} className="text-blue-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Games Completed</p>
                    <p className="text-3xl font-bold">{gamesCompleted}</p>
                  </div>
                  <Target size={40} className="text-green-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Average Score</p>
                    <p className="text-3xl font-bold">{averageScore}</p>
                  </div>
                  <TrendingUp size={40} className="text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Current Streak</p>
                    <p className="text-3xl font-bold">{streak}</p>
                  </div>
                  <Zap size={40} className="text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Progress Level & Overall Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Current Level */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <Card className="h-full">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎓</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Current Level</h3>
                  <Badge className={`${progressLevel.bg} ${progressLevel.color} text-lg px-4 py-2 mb-4`}>
                    {progressLevel.level}
                  </Badge>
                  <p className="text-gray-600 mb-6">You've completed {gameProgress} out of 19 games</p>
                  <Progress value={(gameProgress / 19) * 100} className="h-3 mb-4" />
                  <p className="text-sm text-gray-500">{Math.round((gameProgress / 19) * 100)}% Complete</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Achievements */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
            <Card className="h-full">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Award className="text-yellow-500" />
                  Recent Achievements
                </h3>
                <div className="space-y-4">
                  {gameProgress >= 1 && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl">🏆</div>
                      <div>
                        <p className="font-semibold text-blue-800">First Victory</p>
                        <p className="text-sm text-blue-600">Completed your first game</p>
                      </div>
                    </div>
                  )}
                  {gameProgress >= 3 && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl">📚</div>
                      <div>
                        <p className="font-semibold text-green-800">Scholar</p>
                        <p className="text-sm text-green-600">Completed 3 different skill areas</p>
                      </div>
                    </div>
                  )}
                  {gameProgress >= 5 && (
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl">🎯</div>
                      <div>
                        <p className="font-semibold text-purple-800">Dedicated Learner</p>
                        <p className="text-sm text-purple-600">Completed 5 games</p>
                      </div>
                    </div>
                  )}
                  {gameProgress < 1 && (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">🎮</div>
                      <p>Complete games to unlock achievements!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Game Statistics */}
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Card>
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Star className="text-yellow-500" />
                Game Statistics
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4">Game</th>
                      <th className="text-left py-3 px-4">Category</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Best Score</th>
                      <th className="text-left py-3 px-4">Attempts</th>
                      <th className="text-left py-3 px-4">Best Time</th>
                      <th className="text-left py-3 px-4">Last Played</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gameStats.map((game) => (
                      <tr key={game.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            {game.icon}
                            <span className="font-medium">{game.title}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="outline">{game.category}</Badge>
                        </td>
                        <td className="py-4 px-4">
                          {game.completed ? (
                            <Badge className="bg-green-100 text-green-800">Completed</Badge>
                          ) : (
                            <Badge variant="outline">Not Started</Badge>
                          )}
                        </td>
                        <td className="py-4 px-4 font-mono">{game.completed ? game.score.toLocaleString() : "-"}</td>
                        <td className="py-4 px-4">{game.attempts || "-"}</td>
                        <td className="py-4 px-4 font-mono">{game.completed ? formatTime(game.bestTime) : "-"}</td>
                        <td className="py-4 px-4 text-sm text-gray-600">{game.lastPlayed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-12">
              <h2 className="text-4xl font-bold mb-4">Keep Learning!</h2>
              <p className="text-xl mb-8 opacity-90">Continue your journey to master academic English skills</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/games">
                  <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                    <Trophy size={20} className="mr-2" />
                    Continue Playing
                  </Button>
                </Link>
                <Link href="/">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
                  >
                    <Calendar size={20} className="mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
