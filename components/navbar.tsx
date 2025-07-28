"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Menu, X, BookOpen, Trophy, User, Settings, Home } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <BookOpen className="text-blue-600" size={28} />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold text-white">Play & Learn</h1>
              <p className="text-blue-100 text-sm">Game Zone</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-white hover:text-blue-200 transition-colors duration-200 flex items-center gap-2 font-medium"
            >
              <Home size={18} />
              Home
            </Link>
            <Link
              href="/games"
              className="text-white hover:text-blue-200 transition-colors duration-200 flex items-center gap-2 font-medium"
            >
              <Trophy size={18} />
              Games
            </Link>
            <Link
              href="/progress"
              className="text-white hover:text-blue-200 transition-colors duration-200 flex items-center gap-2 font-medium"
            >
              <User size={18} />
              Progress
            </Link>
            <Link
              href="/settings"
              className="text-white hover:text-blue-200 transition-colors duration-200 flex items-center gap-2 font-medium"
            >
              <Settings size={18} />
              Settings
            </Link>
          </div>

          {/* User Info & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* User Score Badge */}
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hidden sm:flex">
              Score: 1,250
            </Badge>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white hover:bg-white/20"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white/10 backdrop-blur-sm rounded-lg mb-4 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                <Link
                  href="/"
                  className="flex items-center gap-3 text-white hover:text-blue-200 transition-colors duration-200 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Home size={20} />
                  <span className="font-medium">Home</span>
                </Link>
                <Link
                  href="/games"
                  className="flex items-center gap-3 text-white hover:text-blue-200 transition-colors duration-200 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Trophy size={20} />
                  <span className="font-medium">Games</span>
                </Link>
                <Link
                  href="/progress"
                  className="flex items-center gap-3 text-white hover:text-blue-200 transition-colors duration-200 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  <User size={20} />
                  <span className="font-medium">Progress</span>
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-3 text-white hover:text-blue-200 transition-colors duration-200 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings size={20} />
                  <span className="font-medium">Settings</span>
                </Link>
                <div className="pt-4 border-t border-white/20">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    Total Score: 1,250
                  </Badge>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
