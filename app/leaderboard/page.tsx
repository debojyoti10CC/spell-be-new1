"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Trophy, Medal, Award, Crown, TrendingUp, Users, Target } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface LeaderboardEntry {
  rank: number
  name: string
  institution: string
  totalScore: number
  gamesCompleted: number
  averageScore: number
  streak: number
  lastActive: string
  level: string
  achievements: number
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    name: "Sarah Chen",
    institution: "MIT",
    totalScore: 18750,
    gamesCompleted: 19,
    averageScore: 987,
    streak: 15,
    lastActive: "2024-01-20",
    level: "Expert",
    achievements: 12,
  },
  {
    rank: 2,
    name: "Alex Rodriguez",
    institution: "Stanford University",
    totalScore: 17890,
    gamesCompleted: 18,
    averageScore: 994,
    streak: 12,
    lastActive: "2024-01-20",
    level: "Expert",
    achievements: 11,
  },
  {
    rank: 3,
    name: "Emily Watson",
    institution: "Harvard University",
    totalScore: 17234,
    gamesCompleted: 17,
    averageScore: 1014,
    streak: 8,
    lastActive: "2024-01-19",
    level: "Expert",
    achievements: 10,
  },
  {
    rank: 4,
    name: "Michael Kim",
    institution: "UC Berkeley",
    totalScore: 16567,
    gamesCompleted: 16,
    averageScore: 1035,
    streak: 11,
    lastActive: "2024-01-20",
    level: "Advanced",
    achievements: 9,
  },
  {
    rank: 5,
    name: "Lisa Zhang",
    institution: "Oxford University",
    totalScore: 15890,
    gamesCompleted: 15,
    averageScore: 1059,
    streak: 7,
    lastActive: "2024-01-18",
    level: "Advanced",
    achievements: 8,
  },
  {
    rank: 6,
    name: "David Johnson",
    institution: "Cambridge University",
    totalScore: 15234,
    gamesCompleted: 14,
    averageScore: 1088,
    streak: 9,
    lastActive: "2024-01-19",
    level: "Advanced",
    achievements: 7,
  },
  {
    rank: 7,
    name: "Maria Garcia",
    institution: "Yale University",
    totalScore: 14567,
    gamesCompleted: 13,
    averageScore: 1120,
    streak: 6,
    lastActive: "2024-01-17",
    level: "Advanced",
    achievements: 6,
  },
  {
    rank: 8,
    name: "James Wilson",
    institution: "Princeton University",
    totalScore: 13890,
    gamesCompleted: 12,
    averageScore: 1157,
    streak: 5,
    lastActive: "2024-01-16",
    level: "Intermediate",
    achievements: 5,
  },
  {
    rank: 9,
    name: "Anna Petrov",
    institution: "ETH Zurich",
    totalScore: 13234,
    gamesCompleted: 11,
    averageScore: 1203,
    streak: 4,
    lastActive: "2024-01-15",
    level: "Intermediate",
    achievements: 4,
  },
  {
    rank: 10,
    name: "Robert Brown",
    institution: "University of Toronto",
    totalScore: 12567,
    gamesCompleted: 10,
    averageScore: 1257,
    streak: 3,
    lastActive: "2024-01-14",
    level: "Intermediate",
    achievements: 3,
  },
  {
    rank: 11,
    name: "Sophie Martin",
    institution: "Sorbonne University",
    totalScore: 11890,
    gamesCompleted: 9,
    averageScore: 1321,
    streak: 2,
    lastActive: "2024-01-13",
    level: "Intermediate",
    achievements: 2,
  },
  {
    rank: 12,
    name: "Ahmed Hassan",
    institution: "American University of Cairo",
    totalScore: 11234,
    gamesCompleted: 8,
    averageScore: 1404,
    streak: 1,
    lastActive: "2024-01-12",
    level: "Beginner",
    achievements: 1,
  },
  {
    rank: 13,
    name: "Current User",
    institution: "Your University",
    totalScore: 10567,
    gamesCompleted: 7,
    averageScore: 1509,
    streak: 0,
    lastActive: "2024-01-20",
    level: "Beginner",
    achievements: 1,
  },
]

export default function LeaderboardPage() {
  const [timeFilter, setTimeFilter] = useState("all-time")
  const [categoryFilter, setCategoryFilter] = useState("overall")
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [userRank, setUserRank] = useState(13)

  useEffect(() => {
    // Load user's actual progress
    const progress = Number.parseInt(localStorage.getItem("gameProgress") || "0")
    const score = Number.parseInt(localStorage.getItem("totalScore") || "0")

    // Update current user's data
    const updatedData = MOCK_LEADERBOARD.map((entry) => {
      if (entry.name === "Current User") {
        return {
          ...entry,
          totalScore: Math.max(score, 1000),
          gamesCompleted: progress,
          averageScore: progress > 0 ? Math.round(score / progress) : 0,
        }
      }
      return entry
    })

    // Sort by total score and update ranks
    const sortedData = updatedData
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((entry, index) => ({ ...entry, rank: index + 1 }))

    setLeaderboardData(sortedData)

    // Find user's rank
    const userEntry = sortedData.find((entry) => entry.name === "Current User")
    if (userEntry) {
      setUserRank(userEntry.rank)
    }
  }, [])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-500" size={24} />
      case 2:
        return <Medal className="text-gray-400" size={24} />
      case 3:
        return <Award className="text-amber-600" size={24} />
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Expert":
        return "bg-red-100 text-red-800"
      case "Advanced":
        return "bg-orange-100 text-orange-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Beginner":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                Leaderboard
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              See how you rank against other students in academic English mastery.
            </p>
          </motion.div>
        </div>

        {/* User's Current Rank */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold">#{userRank}</div>
                  <div>
                    <h3 className="text-xl font-bold">Your Current Rank</h3>
                    <p className="text-blue-100">Keep playing to climb higher!</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {leaderboardData.find((entry) => entry.name === "Current User")?.totalScore.toLocaleString() || "0"}
                  </div>
                  <p className="text-blue-100">Total Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all-time">All Time</option>
                <option value="this-month">This Month</option>
                <option value="this-week">This Week</option>
                <option value="today">Today</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="overall">Overall Score</option>
                <option value="vocabulary">Vocabulary Games</option>
                <option value="reading">Reading Games</option>
                <option value="writing">Writing Games</option>
                <option value="listening">Listening Games</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Users size={20} />
              <span>{leaderboardData.length} Students</span>
            </div>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {leaderboardData.slice(0, 3).map((entry, index) => (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`${index === 0 ? "md:order-2" : index === 1 ? "md:order-1" : "md:order-3"}`}
            >
              <Card
                className={`${
                  entry.rank === 1
                    ? "bg-gradient-to-b from-yellow-400 to-yellow-500 text-white scale-105"
                    : entry.rank === 2
                      ? "bg-gradient-to-b from-gray-300 to-gray-400 text-white"
                      : "bg-gradient-to-b from-amber-500 to-amber-600 text-white"
                } ${entry.name === "Current User" ? "ring-4 ring-blue-400" : ""}`}
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4">{getRankIcon(entry.rank)}</div>
                  <Avatar className="w-16 h-16 mx-auto mb-4 border-4 border-white">
                    <AvatarFallback className="text-gray-800 font-bold">{getInitials(entry.name)}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold mb-1">{entry.name}</h3>
                  <p className="text-sm opacity-90 mb-3">{entry.institution}</p>
                  <div className="text-2xl font-bold mb-2">{entry.totalScore.toLocaleString()}</div>
                  <div className="flex justify-center gap-4 text-sm opacity-90">
                    <span>{entry.gamesCompleted} games</span>
                    <span>🔥 {entry.streak}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Full Leaderboard */}
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Rank</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Student</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Institution</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Total Score</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Games</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Avg Score</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Streak</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.map((entry, index) => (
                      <tr
                        key={entry.rank}
                        className={`border-b hover:bg-gray-50 transition-colors ${
                          entry.name === "Current User" ? "bg-blue-50 border-blue-200" : ""
                        }`}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            {entry.rank <= 3 ? (
                              getRankIcon(entry.rank)
                            ) : (
                              <span className="text-lg font-bold text-gray-600">#{entry.rank}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="text-sm font-medium">{getInitials(entry.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">
                                {entry.name}
                                {entry.name === "Current User" && (
                                  <Badge className="ml-2 bg-blue-100 text-blue-800">You</Badge>
                                )}
                              </p>
                              <p className="text-sm text-gray-500">{entry.achievements} achievements</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{entry.institution}</td>
                        <td className="py-4 px-6">
                          <span className="font-bold text-lg">{entry.totalScore.toLocaleString()}</span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <Badge variant="outline">{entry.gamesCompleted}/19</Badge>
                        </td>
                        <td className="py-4 px-6 font-mono">{entry.averageScore}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1">
                            <span className="text-orange-500">🔥</span>
                            <span className="font-medium">{entry.streak}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <Badge className={getLevelColor(entry.level)}>{entry.level}</Badge>
                        </td>
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
          <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <CardContent className="p-12">
              <Trophy size={64} className="mx-auto mb-6 text-yellow-300" />
              <h2 className="text-4xl font-bold mb-4">Climb the Rankings!</h2>
              <p className="text-xl mb-8 opacity-90">
                Complete more games and improve your scores to reach the top of the leaderboard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
                  <Target size={20} className="mr-2" />
                  Play More Games
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-orange-600 bg-transparent"
                >
                  <TrendingUp size={20} className="mr-2" />
                  View Progress
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
