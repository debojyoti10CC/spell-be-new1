"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, ArrowRight } from "lucide-react"
import GameLayout from "@/components/game-layout"
import { useRouter } from "next/navigation"

const stories = [
  {
    title: "The Little Red Hen",
    story:
      "A little red hen found some wheat seeds. She asked her friends to help plant them, but they all said 'Not I!' So she planted them herself. When the wheat grew, she asked for help to harvest it, but again they said 'Not I!' She harvested it herself. Finally, when she baked bread, everyone wanted to help eat it!",
    question: "What lesson does this story teach?",
    options: [
      "Always share your food",
      "Hard work deserves rewards",
      "Friends should help each other",
      "Wheat makes good bread",
    ],
    correct: 1,
  },
  {
    title: "The Tortoise and the Hare",
    story:
      "A speedy hare made fun of a slow tortoise. The tortoise challenged the hare to a race. The hare ran very fast and got far ahead, so he decided to take a nap. While he slept, the tortoise kept moving slowly but steadily. When the hare woke up, the tortoise was crossing the finish line!",
    question: "What is the moral of this story?",
    options: [
      "Fast animals always win",
      "Slow and steady wins the race",
      "Never take naps during races",
      "Tortoises are faster than hares",
    ],
    correct: 1,
  },
  {
    title: "The Boy Who Cried Wolf",
    story:
      "A shepherd boy was bored watching sheep. He cried 'Wolf! Wolf!' to trick the villagers. They came running but found no wolf. He did this several times. When a real wolf came and he cried for help, nobody believed him anymore.",
    question: "What does this story teach us?",
    options: [
      "Wolves are dangerous",
      "Don't lie or people won't trust you",
      "Shepherds have boring jobs",
      "Always help others",
    ],
    correct: 1,
  },
  {
    title: "The Three Little Pigs",
    story:
      "Three little pigs built houses. The first used straw, the second used sticks, and the third used bricks. A big bad wolf came and blew down the straw house, then the stick house. But he couldn't blow down the brick house, so the pigs were safe.",
    question: "Why was the third pig's house the best?",
    options: [
      "It was the prettiest",
      "It was built with strong materials",
      "It was the biggest",
      "It had the best location",
    ],
    correct: 1,
  },
  {
    title: "Goldilocks and the Three Bears",
    story:
      "Goldilocks entered the bears' house while they were away. She tried their porridge - one too hot, one too cold, one just right. She tried their chairs - one too hard, one too soft, one just right (but it broke!). She tried their beds and fell asleep in the smallest one.",
    question: "What should Goldilocks have done?",
    options: [
      "Eaten all the porridge",
      "Not entered someone else's house",
      "Broken all the chairs",
      "Slept in the biggest bed",
    ],
    correct: 1,
  },
]

export default function StoryMazeGame() {
  const [currentStory, setCurrentStory] = useState(0)
  const [showStory, setShowStory] = useState(true)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(900)
  const [gameComplete, setGameComplete] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const router = useRouter()

  useEffect(() => {
    if (timeLeft > 0 && !gameComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      handleGameComplete()
    }
  }, [timeLeft, gameComplete])

  useEffect(() => {
    if (showStory) {
      const story = stories[currentStory]
      const totalLength = story.story.length
      let progress = 0

      const interval = setInterval(() => {
        progress += totalLength / 50 // Simulate reading progress
        setReadingProgress(Math.min(progress, totalLength))

        if (progress >= totalLength) {
          clearInterval(interval)
        }
      }, 100)

      return () => clearInterval(interval)
    }
  }, [showStory, currentStory])

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return

    setSelectedAnswer(answerIndex)
    setShowResult(true)

    const isCorrect = answerIndex === stories[currentStory].correct
    if (isCorrect) {
      setScore(score + 5)
    } else {
      setScore(Math.max(0, score - 2))
    }

    setTimeout(() => {
      if (currentStory < stories.length - 1) {
        setCurrentStory(currentStory + 1)
        setShowStory(true)
        setSelectedAnswer(null)
        setShowResult(false)
        setReadingProgress(0)
      } else {
        handleGameComplete()
      }
    }, 2000)
  }

  const handleGameComplete = () => {
    setGameComplete(true)
    const currentProgress = Number.parseInt(localStorage.getItem("gameProgress") || "0")
    if (currentProgress === 6) {
      localStorage.setItem("gameProgress", "7")
    }
  }

  const instructions = [
    "Read each story carefully from beginning to end",
    "Pay attention to the characters and what happens",
    "After reading, answer the question about the story",
    "Think about the lesson or moral of each story",
    "Complete all 5 stories to finish the game",
  ]

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-md"
        >
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-3xl font-bold text-indigo-600 mb-4">Story Master!</h2>
          <div className="text-6xl font-bold text-yellow-500 mb-4">{score}</div>
          <p className="text-gray-600 mb-6">Wonderful! You've completed all the story adventures!</p>
          <Button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
          >
            Back to Home
          </Button>
        </motion.div>
      </div>
    )
  }

  const story = stories[currentStory]

  return (
    <GameLayout
      gameTitle="Story Maze"
      gameIcon={<BookOpen className="text-indigo-500" size={32} />}
      instructions={instructions}
      onGameComplete={handleGameComplete}
      currentQuestion={currentStory + 1}
      totalQuestions={stories.length}
      score={score}
      timeLeft={timeLeft}
    >
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {showStory ? (
            <motion.div
              key={`story-${currentStory}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-2xl border-4 border-indigo-400">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className="text-8xl mb-4">📖</div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">{story.title}</h2>
                  </div>

                  {/* Story Content */}
                  <div className="bg-indigo-50 rounded-2xl p-8 mb-8">
                    <div className="text-lg leading-relaxed text-gray-700 mb-6">{story.story}</div>

                    {/* Reading Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div
                        className="bg-indigo-500 h-2 rounded-full transition-all duration-100"
                        style={{ width: `${(readingProgress / story.story.length) * 100}%` }}
                      ></div>
                    </div>

                    <p className="text-sm text-indigo-600 text-center">
                      Reading Progress: {Math.round((readingProgress / story.story.length) * 100)}%
                    </p>
                  </div>

                  <div className="text-center">
                    <Button
                      onClick={() => setShowStory(false)}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 text-xl"
                      disabled={readingProgress < story.story.length}
                    >
                      Continue to Question
                      <ArrowRight className="ml-2" size={20} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key={`question-${currentStory}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-2xl border-4 border-indigo-400">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className="text-8xl mb-4">❓</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">{story.question}</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {story.options.map((option, index) => {
                      let buttonClass = "p-6 text-lg font-semibold rounded-xl border-2 transition-all duration-300 "

                      if (showResult) {
                        if (index === story.correct) {
                          buttonClass += "bg-green-100 border-green-500 text-green-700"
                        } else if (index === selectedAnswer) {
                          buttonClass += "bg-red-100 border-red-500 text-red-700"
                        } else {
                          buttonClass += "bg-gray-100 border-gray-300 text-gray-500"
                        }
                      } else {
                        buttonClass +=
                          "bg-white border-indigo-300 text-gray-700 hover:bg-indigo-50 hover:border-indigo-500 hover:scale-105 cursor-pointer"
                      }

                      return (
                        <motion.div
                          key={index}
                          onClick={() => handleAnswerSelect(index)}
                          className={buttonClass}
                          whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
                          whileTap={{ scale: selectedAnswer === null ? 0.98 : 1 }}
                        >
                          {option}
                        </motion.div>
                      )
                    })}
                  </div>

                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 text-center"
                    >
                      {selectedAnswer === story.correct ? (
                        <div className="text-green-600 font-bold text-2xl">🎉 Excellent! +5 points</div>
                      ) : (
                        <div className="text-red-600 font-bold text-2xl">😔 Not quite! -2 points</div>
                      )}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GameLayout>
  )
}
