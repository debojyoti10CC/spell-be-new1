"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="text-white" size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Play & Learn</h3>
                <p className="text-blue-200 text-sm">Game Zone</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Empowering college students to master vocabulary and boost confidence through the exciting IEM Spell Bee Competition.
            </p>
            <div className="flex space-x-4">
              <Badge variant="secondary" className="bg-blue-600/20 text-blue-200 border-blue-500/30">
                IEM Partnership
              </Badge>
              <Badge variant="secondary" className="bg-purple-600/20 text-purple-200 border-purple-500/30">
                UEM Collaboration
              </Badge>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2"
                >
                  <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/games"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2"
                >
                  <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                  All Games
                </Link>
              </li>
              <li>
                <Link
                  href="/progress"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2"
                >
                  <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                  Progress Tracking
                </Link>
              </li>
              <li>
                <Link
                  href="/leaderboard"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2"
                >
                  <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2"
                >
                  <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Game Categories */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-white">Game Categories</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/games/vocabulary"
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center gap-2"
                >
                  <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                  Vocabulary Building
                </Link>
              </li>
              <li>
                <Link
                  href="/games/reading"
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center gap-2"
                >
                  <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                  Reading Comprehension
                </Link>
              </li>
              <li>
                <Link
                  href="/games/writing"
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center gap-2"
                >
                  <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                  Academic Writing
                </Link>
              </li>
              <li>
                <Link
                  href="/games/listening"
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center gap-2"
                >
                  <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                  Listening Skills
                </Link>
              </li>
              <li>
                <Link
                  href="/games/advanced"
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center gap-2"
                >
                  <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                  Advanced Challenges
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-white">Connect With Us</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="text-blue-400" size={18} />
                <span className="text-sm">support@playlearn.edu</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="text-blue-400" size={18} />
                <span className="text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="text-blue-400" size={18} />
                <span className="text-sm">Kolkata, West Bengal</span>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h5 className="text-lg font-medium text-white mb-3">Follow Us</h5>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-sky-500 hover:bg-sky-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <Twitter size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-pink-600 hover:bg-pink-700 rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <Youtube size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>© 2025 Play & Learn Game Zone. All rights reserved.</span>
              <span className="hidden md:block">|</span>
              <span className="flex items-center gap-1">
                Developed with <Heart className="text-red-500" size={14} /> for Spell-a-thon 2025
              </span>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="/support" className="text-gray-400 hover:text-white transition-colors duration-200">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
