"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, Eye, Shield } from "lucide-react"

interface DisqualificationTrackerProps {
  isGameActive: boolean
  onDisqualification: (reason: string) => void
}

export function DisqualificationTracker({ isGameActive, onDisqualification }: DisqualificationTrackerProps) {
  const [violations, setViolations] = useState<string[]>([])
  const [warningCount, setWarningCount] = useState(0)
  const [isMonitoring, setIsMonitoring] = useState(false)

  useEffect(() => {
    if (!isGameActive) return

    setIsMonitoring(true)
    let tabSwitchCount = 0
    let suspiciousActivityCount = 0
    const maxWarnings = 2

    // Tab switching detection
    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabSwitchCount++
        const newViolations = [...violations, `Tab switch detected at ${new Date().toLocaleTimeString()}`]
        setViolations(newViolations)
        setWarningCount((prev) => prev + 1)

        if (tabSwitchCount >= maxWarnings) {
          onDisqualification("Multiple tab switching violations - Academic integrity breach")
          return
        }

        // Show progressive warnings
        if (tabSwitchCount === 1) {
          alert("⚠️ WARNING: Tab switching detected! One more violation will result in disqualification.")
        }
      }
    }

    // Right-click detection (prevent inspect element)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      suspiciousActivityCount++

      if (suspiciousActivityCount >= 3) {
        onDisqualification("Attempted to access developer tools - Security violation")
      }
    }

    // Keyboard shortcuts detection
    const handleKeyDown = (e: KeyboardEvent) => {
      // Detect common developer tool shortcuts
      if (
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
        e.key === "F12" ||
        (e.ctrlKey && e.key === "u")
      ) {
        e.preventDefault()
        suspiciousActivityCount++

        if (suspiciousActivityCount >= 2) {
          onDisqualification("Attempted to access developer tools - Security violation")
        } else {
          alert("⚠️ WARNING: Developer tools access blocked!")
        }
      }
    }

    // Mouse leave detection (user trying to switch windows)
    const handleMouseLeave = () => {
      // Only count if mouse leaves the entire document
      const newViolations = [...violations, `Mouse left game area at ${new Date().toLocaleTimeString()}`]
      setViolations(newViolations)
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    document.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("mouseleave", handleMouseLeave)
      setIsMonitoring(false)
    }
  }, [isGameActive, onDisqualification, violations])

  if (!isGameActive || violations.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-20 right-4 z-40 bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 shadow-lg max-w-sm"
    >
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="text-yellow-600" size={20} />
        <h4 className="font-bold text-yellow-800">Security Monitoring</h4>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Eye className="text-blue-500" size={16} />
          <span className="text-gray-700">Active monitoring: ON</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Shield className="text-green-500" size={16} />
          <span className="text-gray-700">Warnings: {warningCount}/2</span>
        </div>
      </div>

      {warningCount > 0 && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
          <strong>Warning:</strong>{" "}
          {warningCount === 1
            ? "First violation detected. One more will result in disqualification."
            : "Final warning! Next violation will disqualify you."}
        </div>
      )}
    </motion.div>
  )
}
