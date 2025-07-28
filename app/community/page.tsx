"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Users,
  MessageCircle,
  Calendar,
  Globe,
  UserPlus,
  Search,
  Clock,
  BookOpen,
  Trophy,
  Heart,
  MessageSquare,
  ExternalLink,
  Star,
  Zap,
  Target,
} from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

const STUDY_GROUPS = [
  {
    id: 1,
    name: "IELTS Vocabulary Masters",
    description: "Daily vocabulary challenges and group discussions for IELTS preparation",
    members: 1247,
    category: "IELTS Prep",
    level: "All Levels",
    activity: "Very Active",
    lastActive: "2 minutes ago",
    tags: ["Vocabulary", "IELTS", "Daily Practice"],
  },
  {
    id: 2,
    name: "Academic Writing Excellence",
    description: "Improve your academic writing skills with peer reviews and expert guidance",
    members: 892,
    category: "Writing",
    level: "Intermediate+",
    activity: "Active",
    lastActive: "15 minutes ago",
    tags: ["Writing", "Essays", "Peer Review"],
  },
  {
    id: 3,
    name: "Reading Comprehension Champions",
    description: "Master complex academic texts through collaborative reading sessions",
    members: 634,
    category: "Reading",
    level: "Advanced",
    activity: "Active",
    lastActive: "1 hour ago",
    tags: ["Reading", "Comprehension", "Academic Texts"],
  },
  {
    id: 4,
    name: "Listening Skills Lab",
    description: "Practice listening skills with authentic academic materials and discussions",
    members: 456,
    category: "Listening",
    level: "All Levels",
    activity: "Moderate",
    lastActive: "3 hours ago",
    tags: ["Listening", "Audio", "Practice"],
  },
  {
    id: 5,
    name: "Game Strategy Masters",
    description: "Share tips, strategies, and compete in weekly game challenges",
    members: 789,
    category: "Gaming",
    level: "All Levels",
    activity: "Very Active",
    lastActive: "5 minutes ago",
    tags: ["Games", "Strategy", "Competition"],
  },
  {
    id: 6,
    name: "University Prep Squad",
    description: "Prepare for university-level English with fellow students",
    members: 1156,
    category: "University Prep",
    level: "Advanced",
    activity: "Active",
    lastActive: "30 minutes ago",
    tags: ["University", "Preparation", "Advanced"],
  },
]

const RECENT_DISCUSSIONS = [
  {
    id: 1,
    title: "Best strategies for Level 15+ games?",
    author: "Sarah M.",
    group: "Game Strategy Masters",
    replies: 23,
    likes: 45,
    timeAgo: "2 hours ago",
  },
  {
    id: 2,
    title: "IELTS vocabulary: Academic vs. General words",
    author: "Ahmed K.",
    group: "IELTS Vocabulary Masters",
    replies: 18,
    likes: 32,
    timeAgo: "4 hours ago",
  },
  {
    id: 3,
    title: "How to improve reading speed for academic texts?",
    author: "Maria L.",
    group: "Reading Comprehension Champions",
    replies: 15,
    likes: 28,
    timeAgo: "6 hours ago",
  },
  {
    id: 4,
    title: "Weekly Challenge: Cryptography Games Discussion",
    author: "David C.",
    group: "Game Strategy Masters",
    replies: 41,
    likes: 67,
    timeAgo: "1 day ago",
  },
]

export default function CommunityPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showJoinForm, setShowJoinForm] = useState(false)

  const categories = ["All", "IELTS Prep", "Writing", "Reading", "Listening", "Gaming", "University Prep"]

  const filteredGroups = STUDY_GROUPS.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || group.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case "Very Active":
        return "bg-green-100 text-green-800"
      case "Active":
        return "bg-blue-100 text-blue-800"
      case "Moderate":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleJoinDiscord = () => {
    // Simulate Discord join
    alert(
      "🎉 Welcome to Play & Learn Discord Community!\n\nYou would be redirected to Discord to join our server with:\n• 8,500+ active members\n• 50+ study channels\n• Daily vocabulary challenges\n• Live study sessions\n• Expert tutors available 24/7",
    )
  }

  const handleJoinStudyGroup = (groupName: string) => {
    alert(
      `🎓 Joining "${groupName}"!\n\nYou would be added to this study group where you can:\n• Participate in discussions\n• Share study materials\n• Get help from peers\n• Join live study sessions\n• Track group progress`,
    )
  }

  const handleCreateGroup = () => {
    setShowJoinForm(true)
    alert(
      "📝 Create New Study Group!\n\nFeatures available:\n• Set group topic and description\n• Choose difficulty level\n• Invite members\n• Schedule study sessions\n• Create group challenges",
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Join Our Community
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect with thousands of students worldwide, share knowledge, and accelerate your learning journey
              together.
            </p>
          </motion.div>
        </div>

        {/* Community Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6 text-center">
              <Users size={40} className="mx-auto mb-3 text-purple-200" />
              <div className="text-3xl font-bold">12,847</div>
              <div className="text-purple-100">Active Members</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6 text-center">
              <MessageCircle size={40} className="mx-auto mb-3 text-blue-200" />
              <div className="text-3xl font-bold">156</div>
              <div className="text-blue-100">Study Groups</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6 text-center">
              <Globe size={40} className="mx-auto mb-3 text-green-200" />
              <div className="text-3xl font-bold">89</div>
              <div className="text-green-100">Universities</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6 text-center">
              <Calendar size={40} className="mx-auto mb-3 text-orange-200" />
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-orange-100">Active Support</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Discord Integration */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white mb-12">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0">
                  <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                    <MessageSquare size={36} />
                    Join Our Discord Server
                  </h2>
                  <p className="text-indigo-100 text-lg mb-4">
                    Connect instantly with fellow learners, get real-time help, and participate in live study sessions.
                  </p>
                  <div className="flex items-center gap-6 text-indigo-200">
                    <span className="flex items-center gap-2">
                      <Users size={20} />
                      8,500+ Members
                    </span>
                    <span className="flex items-center gap-2">
                      <MessageCircle size={20} />
                      50+ Channels
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock size={20} />
                      24/7 Active
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <Button
                    onClick={handleJoinDiscord}
                    size="lg"
                    className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-4 text-lg font-bold"
                  >
                    <ExternalLink className="mr-2" size={24} />
                    Join Discord Now
                  </Button>
                  <p className="text-indigo-200 text-sm mt-2">Free • Instant Access</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Study Groups Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Study Groups List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Study Groups</h2>
              <Button onClick={handleCreateGroup} className="bg-purple-600 hover:bg-purple-700">
                <UserPlus className="mr-2" size={18} />
                Create Group
              </Button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Search study groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Groups Grid */}
            <div className="space-y-6">
              {filteredGroups.map((group, index) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{group.name}</h3>
                          <p className="text-gray-600 mb-3">{group.description}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {group.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Badge className={getActivityColor(group.activity)}>{group.activity}</Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Users size={16} />
                            {group.members.toLocaleString()} members
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={16} />
                            {group.lastActive}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {group.level}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={() => handleJoinStudyGroup(group.name)}
                        >
                          Join Group
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Discussions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="text-purple-600" size={24} />
                  Recent Discussions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {RECENT_DISCUSSIONS.map((discussion) => (
                  <div key={discussion.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <h4 className="font-medium text-gray-800 mb-1 hover:text-purple-600 cursor-pointer">
                      {discussion.title}
                    </h4>
                    <p className="text-sm text-gray-500 mb-2">
                      by {discussion.author} in {discussion.group}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <MessageSquare size={12} />
                        {discussion.replies} replies
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart size={12} />
                        {discussion.likes} likes
                      </span>
                      <span>{discussion.timeAgo}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="text-blue-600" size={24} />
                  Community Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Be respectful and supportive to all members</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Share knowledge and help others learn</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Use appropriate language and stay on topic</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Report any inappropriate behavior</span>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Challenge */}
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="text-yellow-600" size={24} />
                  Weekly Challenge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h4 className="font-bold text-gray-800 mb-2">Master Level Vocabulary Sprint</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Complete 5 advanced vocabulary games this week and earn exclusive badges!
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Ends in 3 days</span>
                  <Badge className="bg-yellow-600 text-white cursor-pointer hover:bg-yellow-700">Join Challenge</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="text-blue-600" size={24} />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="sm">
                  <Star className="mr-2" size={16} />
                  Find Study Partner
                </Button>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white" size="sm">
                  <Target className="mr-2" size={16} />
                  Join Live Session
                </Button>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" size="sm">
                  <Trophy className="mr-2" size={16} />
                  View Achievements
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
