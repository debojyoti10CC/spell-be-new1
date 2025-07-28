"use client"

import { useState, useEffect } from "react"
import { GameLayout } from "@/components/game-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

interface HackingChallenge {
  id: number
  name: string
  type: "sql-injection" | "xss" | "buffer-overflow" | "social-engineering" | "cryptanalysis"
  description: string
  scenario: string
  target: string
  solution: string
  hint: string
  difficulty: number
  explanation: string
}

const HACKING_CHALLENGES: HackingChallenge[] = [
  {
    id: 1,
    name: "SQL Injection Attack",
    type: "sql-injection",
    description: "Exploit a vulnerable login form using SQL injection",
    scenario: "A login form executes: SELECT * FROM users WHERE username='$input' AND password='$pass'",
    target: "Bypass authentication without knowing the password",
    solution: "admin'--",
    hint: "Use SQL comments to ignore the password check",
    difficulty: 1,
    explanation:
      "The input 'admin'--' closes the username string and comments out the password check, allowing login as admin without a password.",
  },
  {
    id: 2,
    name: "Cross-Site Scripting (XSS)",
    type: "xss",
    description: "Inject malicious JavaScript into a vulnerable web page",
    scenario: "A comment form displays user input directly: <div>$userComment</div>",
    target: "Execute JavaScript to show an alert with 'XSS'",
    solution: "<script>alert('XSS')</script>",
    hint: "HTML script tags can execute JavaScript",
    difficulty: 2,
    explanation:
      "The script tag is interpreted as HTML and executes the JavaScript alert, demonstrating XSS vulnerability.",
  },
  {
    id: 3,
    name: "Buffer Overflow Exploit",
    type: "buffer-overflow",
    description: "Overflow a buffer to overwrite the return address",
    scenario: "A C function has char buffer[8] and uses strcpy() without bounds checking",
    target: "What happens if you input 12 characters?",
    solution: "overwrites return address",
    hint: "Think about what's stored after the buffer in memory",
    difficulty: 3,
    explanation:
      "With 12 characters in an 8-byte buffer, the extra 4 bytes overflow and overwrite the return address on the stack.",
  },
  {
    id: 4,
    name: "Social Engineering",
    type: "social-engineering",
    description: "Use psychological manipulation to gain unauthorized access",
    scenario: "You need to get an employee's password over the phone",
    target: "What's the most effective social engineering approach?",
    solution: "impersonate IT support",
    hint: "People trust authority figures, especially in urgent situations",
    difficulty: 4,
    explanation:
      "Impersonating IT support creates authority and urgency, making people more likely to comply with password requests.",
  },
  {
    id: 5,
    name: "Advanced Cryptanalysis",
    type: "cryptanalysis",
    description: "Break a weak encryption scheme using frequency analysis",
    scenario: "Encrypted text: 'WKLV LV D VHFUHW PHVVDJH' (Caesar cipher)",
    target: "Decrypt the message",
    solution: "THIS IS A SECRET MESSAGE",
    hint: "Try different shift values, look for common English words",
    difficulty: 5,
    explanation: "This is a Caesar cipher with shift +3. Shifting back by 3 reveals 'THIS IS A SECRET MESSAGE'.",
  },
]

export default function SystemHackGame() {
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [userInput, setUserInput] = useState("")
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(540) // 9 minutes
  const [gameStarted, setGameStarted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [answered, setAnswered] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [hackingProgress, setHackingProgress] = useState(0)

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
    setTimeLeft(540)
    setUserInput("")
    setShowHint(false)
    setShowExplanation(false)
    setAnswered(false)
    setGameOver(false)
    setAttempts(0)
    setHackingProgress(0)
  }

  const submitSolution = () => {
    const challenge = HACKING_CHALLENGES[currentChallenge]
    const isCorrect = userInput.toLowerCase().trim() === challenge.solution.toLowerCase()

    setAttempts((prev) => prev + 1)

    if (isCorrect) {
      const basePoints = challenge.difficulty * 150
      const attemptPenalty = attempts * 20
      const hintPenalty = showHint ? 50 : 0
      const finalPoints = Math.max(basePoints - attemptPenalty - hintPenalty, 50)

      setScore((prev) => prev + finalPoints)
      setHackingProgress((prev) => prev + 20)
      setAnswered(true)
      setShowExplanation(true)

      // Simulate hacking progress
      setTimeout(() => {
        if (hackingProgress < 100) {
          setHackingProgress((prev) => Math.min(prev + 20, 100))
        }
      }, 1000)
    } else {
      if (attempts >= 2) {
        setAnswered(true)
        setShowExplanation(true)
      } else {
        alert(`Access denied. ${3 - attempts - 1} attempts remaining.`)
      }
    }
  }

  const nextChallenge = () => {
    if (currentChallenge < HACKING_CHALLENGES.length - 1) {
      setCurrentChallenge((prev) => prev + 1)
      setUserInput("")
      setShowHint(false)
      setShowExplanation(false)
      setAnswered(false)
      setAttempts(0)
    } else {
      setGameOver(true)
      // Update progress in localStorage
      const progress = JSON.parse(localStorage.getItem("gameProgress") || "{}")
      progress[19] = { completed: true, score, timestamp: Date.now() }
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
      case "sql-injection":
        return "bg-red-100 text-red-800"
      case "xss":
        return "bg-orange-100 text-orange-800"
      case "buffer-overflow":
        return "bg-purple-100 text-purple-800"
      case "social-engineering":
        return "bg-blue-100 text-blue-800"
      case "cryptanalysis":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!gameStarted) {
    return (
      <GameLayout
        title="System Hack"
        level={19}
        onStart={startGame}
        description="Master ethical hacking and cybersecurity concepts"
      >
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">System Hack Challenge</h2>
          <p className="text-gray-600">Learn ethical hacking techniques and cybersecurity defense</p>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
            <p className="text-red-700 text-sm">
              ⚠️ <strong>Educational Purpose Only:</strong> These challenges are for learning cybersecurity concepts.
              Never use these techniques on systems you don't own or without permission.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-bold">Web Vulnerabilities</h3>
                <p className="text-sm text-gray-600">SQL injection, XSS attacks</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-bold">System Exploits</h3>
                <p className="text-sm text-gray-600">Buffer overflows, memory corruption</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-bold">Social Engineering</h3>
                <p className="text-sm text-gray-600">Human psychology exploitation</p>
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
        title="System Hack"
        level={19}
        onStart={startGame}
        description="Master ethical hacking and cybersecurity concepts"
      >
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Elite Hacker!</h2>
          <p className="text-xl">Final Score: {score}</p>
          <p className="text-gray-600">You've mastered the art of ethical hacking and cybersecurity!</p>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm">
              🎓 <strong>Remember:</strong> Use your knowledge responsibly to protect systems and help organizations
              improve their security.
            </p>
          </div>
          <Button onClick={startGame} size="lg">
            Hack Again
          </Button>
        </div>
      </GameLayout>
    )
  }

  const challenge = HACKING_CHALLENGES[currentChallenge]

  return (
    <GameLayout
      title="System Hack"
      level={19}
      onStart={startGame}
      description="Master ethical hacking and cybersecurity concepts"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Game Header */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Badge variant="outline">
              Challenge {currentChallenge + 1}/{HACKING_CHALLENGES.length}
            </Badge>
            <Badge variant="outline">Score: {score}</Badge>
            <Badge variant={timeLeft < 60 ? "destructive" : "outline"}>Time: {formatTime(timeLeft)}</Badge>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">Attempts: {attempts}/3</Badge>
            <Badge className={getTypeColor(challenge.type)}>{challenge.type.replace("-", " ").toUpperCase()}</Badge>
          </div>
        </div>

        {/* Hacking Progress */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">System Penetration Progress</span>
              <span className="text-sm text-gray-600">{hackingProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${hackingProgress}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        {/* Challenge Terminal */}
        <Card>
          <CardContent className="p-0">
            <div className="bg-black text-green-400 font-mono text-sm">
              <div className="flex items-center justify-between p-3 border-b border-gray-700">
                <span>🔴 🟡 🟢</span>
                <span>ETHICAL HACKING TERMINAL</span>
                <span className="text-xs">SECURE CONNECTION</span>
              </div>
              <div className="p-4 space-y-2">
                <div>root@hacklab:~$ cat challenge_{challenge.id}.txt</div>
                <div className="text-white">
                  <div className="mb-4">
                    <div className="text-yellow-400">CHALLENGE: {challenge.name}</div>
                    <div className="text-gray-300">{challenge.description}</div>
                  </div>

                  <div className="mb-4">
                    <div className="text-blue-400">SCENARIO:</div>
                    <div className="text-gray-300 ml-2">{challenge.scenario}</div>
                  </div>

                  <div className="mb-4">
                    <div className="text-red-400">TARGET:</div>
                    <div className="text-gray-300 ml-2">{challenge.target}</div>
                  </div>
                </div>
                <div>root@hacklab:~$ █</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Solution Input */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold">Enter Your Exploit:</h4>
              <Badge variant="outline">Difficulty: {challenge.difficulty}/5</Badge>
            </div>

            {showHint && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                <h5 className="font-bold text-yellow-800 mb-2">💡 Hint:</h5>
                <p className="text-yellow-700">{challenge.hint}</p>
              </div>
            )}

            {!answered && (
              <div className="space-y-4">
                <Textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Enter your solution here..."
                  className="font-mono text-sm min-h-20"
                />
                <div className="flex gap-4">
                  <Button
                    onClick={submitSolution}
                    disabled={!userInput.trim()}
                    size="lg"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    🚀 Execute Exploit
                  </Button>
                  <Button variant="outline" onClick={() => setShowHint(true)} disabled={showHint} size="lg">
                    💡 Show Hint (-50 points)
                  </Button>
                </div>
              </div>
            )}

            {/* Explanation */}
            {showExplanation && (
              <div className="mt-6 p-6 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Badge
                    variant={
                      userInput.toLowerCase().trim() === challenge.solution.toLowerCase() ? "default" : "destructive"
                    }
                  >
                    {userInput.toLowerCase().trim() === challenge.solution.toLowerCase()
                      ? "🎯 EXPLOIT SUCCESSFUL!"
                      : "❌ ACCESS DENIED"}
                  </Badge>
                  <span className="font-bold">Solution: {challenge.solution}</span>
                </div>
                <div className="mb-4">
                  <h5 className="font-bold mb-2">Explanation:</h5>
                  <p className="text-gray-700">{challenge.explanation}</p>
                </div>
                <Button onClick={nextChallenge} size="lg">
                  {currentChallenge < HACKING_CHALLENGES.length - 1 ? "Next Challenge" : "Complete Mission"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Reference */}
        <Card>
          <CardContent className="p-4">
            <h4 className="font-bold mb-2">Cybersecurity Concepts:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>SQL Injection:</strong> Malicious SQL code injection
              </div>
              <div>
                <strong>XSS:</strong> Cross-site scripting attacks
              </div>
              <div>
                <strong>Buffer Overflow:</strong> Memory corruption exploits
              </div>
              <div>
                <strong>Social Engineering:</strong> Human psychology manipulation
              </div>
              <div>
                <strong>Cryptanalysis:</strong> Breaking encryption schemes
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ethical Notice */}
        <Card>
          <CardContent className="p-4 bg-blue-50">
            <div className="flex items-start gap-2">
              <span className="text-blue-600">ℹ️</span>
              <div>
                <h5 className="font-bold text-blue-800">Ethical Hacking Reminder</h5>
                <p className="text-blue-700 text-sm">
                  Always obtain proper authorization before testing security. Use these skills to protect and defend
                  systems, not to cause harm.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  )
}
