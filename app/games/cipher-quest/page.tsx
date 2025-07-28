"use client"

import { useState, useEffect } from "react"
import { GameLayout } from "@/components/game-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface CipherChallenge {
  id: number
  name: string
  type: "caesar" | "substitution" | "vigenere" | "morse" | "binary"
  encryptedText: string
  plainText: string
  hint: string
  key?: string | number
  difficulty: number
}

const CIPHER_CHALLENGES: CipherChallenge[] = [
  {
    id: 1,
    name: "Caesar's Secret",
    type: "caesar",
    encryptedText: "KHOOR ZRUOG",
    plainText: "HELLO WORLD",
    hint: "Julius Caesar used a shift of 3",
    key: 3,
    difficulty: 1,
  },
  {
    id: 2,
    name: "Morse Mystery",
    type: "morse",
    encryptedText: "... --- ...",
    plainText: "SOS",
    hint: "International distress signal",
    difficulty: 2,
  },
  {
    id: 3,
    name: "Binary Puzzle",
    type: "binary",
    encryptedText: "01001000 01100101 01101100 01101100 01101111",
    plainText: "Hello",
    hint: "Computer language - 8 bits per character",
    difficulty: 3,
  },
  {
    id: 4,
    name: "Vigenère Challenge",
    type: "vigenere",
    encryptedText: "LXFOPVEFRNHR",
    plainText: "ATTACKATDAWN",
    hint: "Key: LEMON - repeating pattern",
    key: "LEMON",
    difficulty: 4,
  },
  {
    id: 5,
    name: "Substitution Cipher",
    type: "substitution",
    encryptedText: "WKH TXLFN EURZQ IRA MXPSV RYHU WKH ODCB GRJ",
    plainText: "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG",
    hint: "Each letter is consistently replaced by another",
    difficulty: 5,
  },
]

export default function CipherQuestGame() {
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(420) // 7 minutes
  const [gameStarted, setGameStarted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [decryptionKey, setDecryptionKey] = useState("")

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
    setTimeLeft(420)
    setUserAnswer("")
    setShowHint(false)
    setAttempts(0)
    setGameOver(false)
    setDecryptionKey("")
  }

  const caesarDecrypt = (text: string, shift: number) => {
    return text
      .split("")
      .map((char) => {
        if (char.match(/[A-Z]/)) {
          return String.fromCharCode(((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65)
        }
        return char
      })
      .join("")
  }

  const morseToText = (morse: string) => {
    const morseCode: { [key: string]: string } = {
      ".-": "A",
      "-...": "B",
      "-.-.": "C",
      "-..": "D",
      ".": "E",
      "..-.": "F",
      "--.": "G",
      "....": "H",
      "..": "I",
      ".---": "J",
      "-.-": "K",
      ".-..": "L",
      "--": "M",
      "-.": "N",
      "---": "O",
      ".--.": "P",
      "--.-": "Q",
      ".-.": "R",
      "...": "S",
      "-": "T",
      "..-": "U",
      "...-": "V",
      ".--": "W",
      "-..-": "X",
      "-.--": "Y",
      "--..": "Z",
    }
    return morse
      .split(" ")
      .map((code) => morseCode[code] || "")
      .join("")
  }

  const binaryToText = (binary: string) => {
    return binary
      .split(" ")
      .map((bin) => String.fromCharCode(Number.parseInt(bin, 2)))
      .join("")
  }

  const submitAnswer = () => {
    const challenge = CIPHER_CHALLENGES[currentChallenge]
    const isCorrect =
      userAnswer.toUpperCase().replace(/\s/g, "") === challenge.plainText.toUpperCase().replace(/\s/g, "")

    setAttempts((prev) => prev + 1)

    if (isCorrect) {
      const basePoints = challenge.difficulty * 100
      const bonusPoints = Math.max(50 - attempts * 10, 10)
      const hintPenalty = showHint ? 25 : 0
      const finalPoints = basePoints + bonusPoints - hintPenalty

      setScore((prev) => prev + finalPoints)

      if (currentChallenge < CIPHER_CHALLENGES.length - 1) {
        setTimeout(() => {
          setCurrentChallenge((prev) => prev + 1)
          setUserAnswer("")
          setShowHint(false)
          setAttempts(0)
          setDecryptionKey("")
        }, 1500)
        alert(`Correct! +${finalPoints} points`)
      } else {
        setGameOver(true)
        // Update progress in localStorage
        const progress = JSON.parse(localStorage.getItem("gameProgress") || "{}")
        progress[14] = { completed: true, score: score + finalPoints, timestamp: Date.now() }
        localStorage.setItem("gameProgress", JSON.stringify(progress))
        alert(`All ciphers cracked! Final Score: ${score + finalPoints}`)
      }
    } else {
      alert("Incorrect. Try again!")
    }
  }

  const getDecryptionHelp = () => {
    const challenge = CIPHER_CHALLENGES[currentChallenge]

    switch (challenge.type) {
      case "caesar":
        if (decryptionKey) {
          const shift = Number.parseInt(decryptionKey)
          const decrypted = caesarDecrypt(challenge.encryptedText, shift)
          setUserAnswer(decrypted)
        }
        break
      case "morse":
        const morseDecrypted = morseToText(challenge.encryptedText)
        setUserAnswer(morseDecrypted)
        break
      case "binary":
        const binaryDecrypted = binaryToText(challenge.encryptedText)
        setUserAnswer(binaryDecrypted)
        break
      default:
        break
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getCipherColor = (type: string) => {
    switch (type) {
      case "caesar":
        return "bg-red-100 text-red-800"
      case "morse":
        return "bg-blue-100 text-blue-800"
      case "binary":
        return "bg-green-100 text-green-800"
      case "vigenere":
        return "bg-purple-100 text-purple-800"
      case "substitution":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!gameStarted) {
    return (
      <GameLayout
        title="Cipher Quest"
        level={14}
        onStart={startGame}
        description="Decrypt various historical and modern ciphers"
      >
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Cipher Quest</h2>
          <p className="text-gray-600">Master the art of cryptanalysis and code breaking</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-bold">5 Cipher Types</h3>
                <p className="text-sm text-gray-600">Caesar, Morse, Binary, Vigenère, Substitution</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-bold">Historical Context</h3>
                <p className="text-sm text-gray-600">Learn real cryptographic methods</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-bold">Decryption Tools</h3>
                <p className="text-sm text-gray-600">Use keys and patterns to decode</p>
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
        title="Cipher Quest"
        level={14}
        onStart={startGame}
        description="Decrypt various historical and modern ciphers"
      >
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Cryptanalysis Master!</h2>
          <p className="text-xl">Final Score: {score}</p>
          <p className="text-gray-600">You've mastered the ancient art of code breaking!</p>
          <Button onClick={startGame} size="lg">
            Play Again
          </Button>
        </div>
      </GameLayout>
    )
  }

  const challenge = CIPHER_CHALLENGES[currentChallenge]

  return (
    <GameLayout
      title="Cipher Quest"
      level={14}
      onStart={startGame}
      description="Decrypt various historical and modern ciphers"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Game Header */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Badge variant="outline">
              Challenge {currentChallenge + 1}/{CIPHER_CHALLENGES.length}
            </Badge>
            <Badge variant="outline">Score: {score}</Badge>
            <Badge variant={timeLeft < 60 ? "destructive" : "outline"}>Time: {formatTime(timeLeft)}</Badge>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">Attempts: {attempts}</Badge>
            <Badge className={getCipherColor(challenge.type)}>{challenge.type.toUpperCase()}</Badge>
          </div>
        </div>

        {/* Challenge Info */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{challenge.name}</h3>
              <Badge variant="outline">Difficulty: {challenge.difficulty}/5</Badge>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-bold mb-2">Encrypted Message:</h4>
                <div className="p-4 bg-gray-100 rounded-lg font-mono text-lg break-all">{challenge.encryptedText}</div>
              </div>

              {showHint && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-bold text-yellow-800 mb-2">Hint:</h4>
                  <p className="text-yellow-700">{challenge.hint}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Decryption Tools */}
        {(challenge.type === "caesar" || challenge.type === "vigenere") && (
          <Card>
            <CardContent className="p-6">
              <h4 className="font-bold mb-4">Decryption Tools:</h4>
              <div className="flex gap-4">
                <Input
                  placeholder={challenge.type === "caesar" ? "Enter shift number (0-25)" : "Enter key"}
                  value={decryptionKey}
                  onChange={(e) => setDecryptionKey(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={getDecryptionHelp} variant="outline">
                  Apply {challenge.type === "caesar" ? "Shift" : "Key"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Answer Input */}
        <Card>
          <CardContent className="p-6">
            <h4 className="font-bold mb-4">Your Decryption:</h4>
            <div className="space-y-4">
              <Textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter the decrypted message..."
                className="min-h-20 text-lg"
              />
              <div className="flex gap-4">
                <Button onClick={submitAnswer} size="lg" disabled={!userAnswer.trim()}>
                  Submit Answer
                </Button>
                <Button variant="outline" onClick={() => setShowHint(true)} disabled={showHint} size="lg">
                  Show Hint (-25 points)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cipher Reference */}
        <Card>
          <CardContent className="p-4">
            <h4 className="font-bold mb-2">Cipher Reference:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Caesar:</strong> Each letter shifted by fixed amount
              </div>
              <div>
                <strong>Morse:</strong> Dots and dashes (. -)
              </div>
              <div>
                <strong>Binary:</strong> 8-bit ASCII codes
              </div>
              <div>
                <strong>Vigenère:</strong> Keyword-based polyalphabetic
              </div>
              <div>
                <strong>Substitution:</strong> Each letter replaced consistently
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  )
}
