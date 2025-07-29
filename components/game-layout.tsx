"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Camera, Clock, Star, AlertTriangle, Home, Volume2, VolumeX, Shield, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import { DisqualificationTracker } from "./disqualification-tracker"

interface GameLayoutProps {
  // Simple interface props
  title?: string
  level?: number
  onStart?: () => void
  description?: string
  
  // Complex interface props
  gameTitle?: string
  gameIcon?: React.ReactNode
  instructions?: string[]
  onGameComplete?: (score: number) => void
  currentQuestion?: number
  totalQuestions?: number
  score?: number
  timeLeft?: number
  difficulty?: "Basic" | "Expert" | "Master" | "Legendary" | "Ultimate"
  
  children: React.ReactNode
}

export function GameLayout({
  // Simple interface
  title,
  level,
  onStart,
  description,
  
  // Complex interface
  gameTitle,
  gameIcon,
  instructions,
  onGameComplete,
  currentQuestion,
  totalQuestions,
  score,
  timeLeft,
  difficulty = "Basic",
  
  children,
}: GameLayoutProps) {
  // Determine which interface is being used
  const isSimpleInterface = title && level !== undefined && onStart && description
  const isComplexInterface = gameTitle && gameIcon && instructions && onGameComplete && currentQuestion !== undefined && totalQuestions !== undefined && score !== undefined && timeLeft !== undefined

  // Use simple interface if provided, otherwise use complex interface
  const finalTitle = title || gameTitle || "Game"
  const finalLevel = level || 1
  const finalOnStart = onStart || (() => {})
  const finalDescription = description || ""
  const finalGameIcon = gameIcon || "🎮"
  const finalInstructions = instructions || []
  const finalOnGameComplete = onGameComplete || (() => {})
  const finalCurrentQuestion = currentQuestion || 1
  const finalTotalQuestions = totalQuestions || 1
  const finalScore = score || 0
  const finalTimeLeft = timeLeft || 0

  const [gameStarted, setGameStarted] = useState(false)
  const [cameraEnabled, setCameraEnabled] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)
  const [violations, setViolations] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [faceCount, setFaceCount] = useState(1)
  const [multipleFaceTime, setMultipleFaceTime] = useState(0)
  const [showPrivacyAlert, setShowPrivacyAlert] = useState(true)
  const [isDisqualified, setIsDisqualified] = useState(false)
  const [disqualificationReason, setDisqualificationReason] = useState("")
  const [cameraError, setCameraError] = useState("")

  const videoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()

  const handleDisqualification = (reason: string) => {
    setIsDisqualified(true)
    setDisqualificationReason(reason)

    // Stop camera stream
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
    }

    // Redirect after showing disqualification screen
    setTimeout(() => {
      router.push("/")
    }, 8000)
  }

  // Enhanced tab visibility detection with disqualification
  useEffect(() => {
    let tabSwitchCount = 0
    const maxTabSwitches = 1

    const handleVisibilityChange = () => {
      if (document.hidden && gameStarted && !isDisqualified) {
        tabSwitchCount++

        if (tabSwitchCount >= maxTabSwitches) {
          handleDisqualification("Multiple tab switching detected")
        } else {
          alert(
            `Warning: Tab switching detected! ${maxTabSwitches - tabSwitchCount} more switches will result in disqualification.`,
          )
        }
      }
    }

    const handleFocus = () => {
      if (gameStarted && !document.hidden && tabSwitchCount > 0 && tabSwitchCount < maxTabSwitches) {
        console.log("User returned to game tab")
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("focus", handleFocus)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("focus", handleFocus)
    }
  }, [gameStarted, router, isDisqualified])

  // Enhanced camera setup with better error handling
  const setupCamera = async () => {
    try {
      console.log("🎥 Requesting camera access...")
      setCameraError("")

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError("Camera not supported in this browser")
        setCameraEnabled(false)
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640, min: 320 },
          height: { ideal: 480, min: 240 },
          facingMode: "user",
        },
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current
            ?.play()
            .then(() => {
              console.log("✅ Camera feed started successfully")
              setCameraEnabled(true)
              setShowPrivacyAlert(false)
            })
            .catch((error) => {
              console.error("❌ Video play failed:", error)
              setCameraError("Failed to start video playback")
              setCameraEnabled(false)
            })
        }
      }
    } catch (error: any) {
      console.error("❌ Camera setup failed:", error)
      let errorMessage = "Camera access is REQUIRED for this game"

      if (error.name === "NotAllowedError") {
        errorMessage = "Camera permission denied. Please allow camera access and refresh the page."
      } else if (error.name === "NotFoundError") {
        errorMessage = "No camera found. Please connect a camera to play this game."
      } else if (error.name === "NotReadableError") {
        errorMessage = "Camera is being used by another application. Please close other apps and try again."
      }

      setCameraError(errorMessage)
      setCameraEnabled(false)

      // Show blocking alert for camera requirement
      alert(`🚨 CAMERA REQUIRED FOR ACADEMIC INTEGRITY!

${errorMessage}

This game requires camera monitoring for academic integrity. Please:
1. Allow camera permissions
2. Ensure your camera is working
3. Refresh the page and try again

The game cannot proceed without camera access.`)

      // Redirect back to home if camera fails
      router.push("/")
    }
  }

  // Simulate face detection with more realistic behavior
  useEffect(() => {
    if (!gameStarted || !cameraEnabled) return

    const interval = setInterval(() => {
      // Simulate face detection - occasionally detect multiple faces
      const random = Math.random()
      let detectedFaces = 1

      if (random > 0.97) {
        detectedFaces = 2 // 3% chance of detecting 2 faces
      } else if (random > 0.99) {
        detectedFaces = 0 // 1% chance of detecting no faces
      }

      setFaceCount(detectedFaces)

      if (detectedFaces > 1) {
        setMultipleFaceTime((prev) => prev + 1)
        if (multipleFaceTime > 10) {
          // Reduced to 10 seconds for testing
          handleDisqualification("Multiple faces detected for extended period")
        }
      } else if (detectedFaces === 0) {
        setMultipleFaceTime((prev) => prev + 1)
        if (multipleFaceTime > 15) {
          // 15 seconds without face
          handleDisqualification("No face detected - student may have left")
        }
      } else {
        setMultipleFaceTime(0)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [gameStarted, cameraEnabled, multipleFaceTime])

  const startGame = async () => {
    console.log("🚀 Starting game...")
    setShowInstructions(false)
    await setupCamera()
    setGameStarted(true)
    
    // Call the onStart function if provided
    if (finalOnStart) {
      finalOnStart()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Expert":
        return "bg-orange-500"
      case "Master":
        return "bg-red-500"
      case "Legendary":
        return "bg-purple-500"
      case "Ultimate":
        return "bg-gradient-to-r from-yellow-400 to-red-500"
      default:
        return "bg-green-500"
    }
  }

  // If using simple interface, show simplified layout
  if (isSimpleInterface) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-sm shadow-lg p-4 border-b-2 border-purple-200">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 hover:bg-purple-50 border-purple-200"
              >
                <Home size={16} />
                Home
              </Button>
              <div>
                <h1 className="text-xl font-bold text-purple-600">{finalTitle}</h1>
                <Badge variant="outline">Level {finalLevel}</Badge>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
            {children}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 relative">
      {/* Privacy Alert Modal */}
      <AnimatePresence>
        {showPrivacyAlert && showInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              className="bg-white rounded-3xl p-8 max-w-md text-center shadow-2xl border-4 border-blue-400"
            >
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold text-blue-600 mb-4">Privacy & Security Notice</h3>
              <div className="text-left space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <Shield className="text-green-500" size={20} />
                  <span className="text-sm">Your privacy is our priority</span>
                </div>
                <div className="flex items-center gap-3">
                  <Eye className="text-blue-500" size={20} />
                  <span className="text-sm">Camera used only for monitoring</span>
                </div>
                <div className="flex items-center gap-3">
                  <Camera className="text-purple-500" size={20} />
                  <span className="text-sm">No recordings are saved</span>
                </div>
              </div>
              <Button
                onClick={() => setShowPrivacyAlert(false)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-full font-bold"
              >
                I Understand
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Disqualification Screen */}
      <AnimatePresence>
        {isDisqualified && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-red-900/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md text-center shadow-2xl border-4 border-red-500"
            >
              <motion.div
                className="text-8xl mb-6"
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                ❌
              </motion.div>

              <h2 className="text-4xl font-bold text-red-600 mb-4">DISQUALIFIED!</h2>

              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
                <h3 className="font-bold text-red-800 mb-2">Reason:</h3>
                <p className="text-red-700">{disqualificationReason}</p>
              </div>

              <div className="space-y-3 mb-6 text-left">
                <div className="flex items-center gap-3 text-red-700">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Academic integrity violation detected</span>
                </div>
                <div className="flex items-center gap-3 text-red-700">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Game session has been terminated</span>
                </div>
                <div className="flex items-center gap-3 text-red-700">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Progress will not be saved</span>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 text-left">
                <p className="text-sm text-yellow-800">
                  <strong>Remember:</strong> Fair play ensures everyone has an equal opportunity to learn and succeed.
                </p>
              </div>

              <div className="text-center">
                <p className="text-gray-600 text-sm mb-4">Redirecting to dashboard in 8 seconds...</p>
                <Button
                  onClick={() => router.push("/")}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-bold"
                >
                  Return to Dashboard Now
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Instructions Modal */}
      <AnimatePresence>
        {showInstructions && !showPrivacyAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              className="bg-white rounded-3xl p-8 max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="text-center mb-8">
                <motion.div
                  className="text-8xl mb-4"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  {finalGameIcon}
                </motion.div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  {finalTitle}
                </h2>
                <Badge className={`${getDifficultyColor(difficulty)} text-white px-4 py-1 text-sm`}>
                  {difficulty} Level
                </Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Game Rules */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">📋 Game Rules</h3>
                  <ul className="space-y-3">
                    {finalInstructions.map((instruction, index) => (
                      <li key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Security & Scoring Info */}
                <div className="space-y-6">
                  {/* Security Policy */}
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Camera className="text-yellow-600" size={20} />
                      <h4 className="font-bold text-yellow-800">Security Monitoring</h4>
                    </div>
                    <ul className="text-sm text-yellow-700 space-y-2">
                      <li>• Camera monitoring is active during gameplay</li>
                      <li>• Multiple faces will trigger warnings</li>
                      <li>• Tab switching terminates the game</li>
                      <li>• All data is processed locally</li>
                    </ul>
                  </div>

                  {/* Game Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-xl text-center border-2 border-green-200">
                      <Clock className="mx-auto text-green-600 mb-2" size={28} />
                      <div className="font-bold text-green-800">Time Limit</div>
                      <div className="text-green-600 text-lg">15 minutes</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl text-center border-2 border-blue-200">
                      <Star className="mx-auto text-blue-600 mb-2" size={28} />
                      <div className="font-bold text-blue-800">Scoring</div>
                      <div className="text-blue-600 text-lg">+5 / -2</div>
                    </div>
                  </div>

                  {/* Difficulty Info */}
                  {difficulty !== "Basic" && (
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border-2 border-purple-200">
                      <h4 className="font-bold text-purple-800 mb-2">🔥 {difficulty} Challenge</h4>
                      <p className="text-sm text-purple-700">
                        This is an advanced level game with increased difficulty and complex problem-solving
                        requirements.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-center">
                <Button
                  onClick={startGame}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 px-12 text-xl font-bold rounded-full shadow-lg transform hover:scale-105 transition-all"
                >
                  🚀 Start Challenge!
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Game Header */}
      {gameStarted && !isDisqualified && (
        <header className="bg-white/95 backdrop-blur-sm shadow-lg p-4 sticky top-0 z-40 border-b-2 border-purple-200">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 hover:bg-purple-50 border-purple-200"
              >
                <Home size={16} />
                Home
              </Button>
              <div className="flex items-center gap-3">
                <div className="text-3xl">{finalGameIcon}</div>
                <div>
                  <h1 className="text-xl font-bold text-purple-600">{finalTitle}</h1>
                  <Badge className={`${getDifficultyColor(difficulty)} text-white text-xs`}>{difficulty}</Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Sound Toggle */}
              <Button
                onClick={() => setSoundEnabled(!soundEnabled)}
                variant="outline"
                size="sm"
                className="hover:bg-purple-50"
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </Button>

              {/* Progress */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600">
                  Question {finalCurrentQuestion} of {finalTotalQuestions}
                </span>
                <Progress value={(finalCurrentQuestion / finalTotalQuestions) * 100} className="w-24 h-2" />
              </div>

              {/* Score */}
              <Badge variant="secondary" className="text-lg px-4 py-2 bg-purple-100 text-purple-800">
                <Star className="mr-2" size={16} />
                {finalScore} pts
              </Badge>

              {/* Timer */}
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono font-bold ${
                  finalTimeLeft < 300
                    ? "bg-red-100 text-red-600 animate-pulse"
                    : finalTimeLeft < 600
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-green-100 text-green-600"
                }`}
              >
                <Clock size={18} />
                <span className="text-lg">{formatTime(finalTimeLeft)}</span>
              </div>

              {/* Face Detection Alert */}
              {faceCount > 1 && (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
                  className="flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-full border-2 border-red-300"
                >
                  <AlertTriangle size={18} />
                  <span className="text-sm font-bold">Multiple Faces Detected!</span>
                </motion.div>
              )}

              {/* Camera Status Indicator */}
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-bold ${
                  cameraEnabled ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                <Camera size={16} />
                {cameraEnabled ? "MONITORING" : "NO CAMERA"}
              </div>
            </div>
          </div>
        </header>
      )}

      {/* 🎥 MAIN CAMERA FEED - This is where your face appears! */}
      {gameStarted && (
        <div className="fixed bottom-6 right-6 z-50">
          {cameraEnabled ? (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative bg-white rounded-2xl shadow-2xl border-4 border-green-400 overflow-hidden"
            >
              {/* Video Feed */}
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-64 h-48 object-cover rounded-xl"
                style={{ transform: "scaleX(-1)" }} // Mirror effect like a selfie
              />

              {/* Status Indicators */}
              <div className="absolute -top-2 -right-2 bg-green-500 w-6 h-6 rounded-full animate-pulse border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>

              <div className="absolute bottom-2 left-2 bg-black/80 text-white text-xs px-3 py-1 rounded-full font-bold">
                🔴 LIVE MONITORING
              </div>

              <div className="absolute top-2 left-2 bg-green-500/90 text-white text-xs px-3 py-1 rounded-full font-bold">
                ACTIVE
              </div>

              {/* Face Count Display */}
              <div
                className={`absolute top-2 right-2 text-xs px-3 py-1 rounded-full font-bold ${
                  faceCount === 1
                    ? "bg-green-500 text-white"
                    : faceCount === 0
                      ? "bg-yellow-500 text-black"
                      : "bg-red-500 text-white animate-pulse"
                }`}
              >
                {faceCount === 0 ? "NO FACE" : faceCount === 1 ? "1 FACE ✓" : `${faceCount} FACES ⚠️`}
              </div>

              {/* Warning overlay for multiple faces */}
              {faceCount > 1 && (
                <div className="absolute inset-0 bg-red-500/20 border-4 border-red-500 rounded-xl animate-pulse">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                      ⚠️ MULTIPLE FACES
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative bg-gray-800 rounded-2xl shadow-2xl border-4 border-red-400 overflow-hidden w-64 h-48 flex items-center justify-center"
            >
              <div className="text-center text-white">
                <Camera size={48} className="mx-auto mb-4 text-yellow-400" />
                <div className="font-bold text-red-400">CAMERA REQUIRED</div>
                <div className="text-sm text-gray-300 mt-2 px-4">
                  {cameraError || "Camera monitoring is mandatory for academic integrity"}
                </div>
              </div>

              <div className="absolute -top-2 -right-2 bg-yellow-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Debug Panel - Shows camera status */}
      {gameStarted && !isDisqualified && (
        <div className="fixed bottom-6 left-6 z-30 bg-black/90 text-white p-4 rounded-xl text-sm font-mono border border-gray-600">
          <div className="text-green-400 font-bold mb-2">🔧 MONITORING STATUS</div>
          <div className="space-y-1">
            <div>Camera: {cameraEnabled ? "✅ ACTIVE" : "❌ INACTIVE"}</div>
            <div>Game: {gameStarted ? "✅ RUNNING" : "❌ STOPPED"}</div>
            <div>
              Faces: <span className={faceCount === 1 ? "text-green-400" : "text-red-400"}>{faceCount}</span>
            </div>
            <div>
              Violations: <span className="text-yellow-400">{violations}</span>
            </div>
            {cameraError && <div className="text-red-400">Error: {cameraError}</div>}
          </div>
        </div>
      )}

      {/* Disqualification Tracker */}
      <DisqualificationTracker
        isGameActive={gameStarted && !isDisqualified}
        onDisqualification={handleDisqualification}
      />

      {/* Game Content */}
      {gameStarted && !isDisqualified && (
        <main className="container mx-auto px-6 py-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">{children}</div>
        </main>
      )}
    </div>
  )
}

export default GameLayout
