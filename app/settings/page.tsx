"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  Bell,
  Volume2,
  VolumeX,
  Camera,
  CameraOff,
  Monitor,
  Moon,
  Sun,
  Globe,
  Shield,
  Gamepad2,
  Trophy,
  BookOpen,
  Palette,
  Zap,
  Clock,
  Target,
  Brain,
  Eye,
  EyeOff,
  Mic,
  MicOff,
  Wifi,
  WifiOff,
  Save,
  RotateCcw,
  Users,
} from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface SettingsState {
  // Audio Settings
  soundEnabled: boolean
  musicVolume: number
  effectsVolume: number
  voiceEnabled: boolean

  // Visual Settings
  darkMode: boolean
  animations: boolean
  highContrast: boolean
  fontSize: number
  colorBlind: boolean

  // Camera & Privacy
  cameraEnabled: boolean
  faceDetection: boolean
  privacyMode: boolean
  dataCollection: boolean

  // Game Settings
  difficulty: "Easy" | "Medium" | "Hard" | "Expert"
  autoSave: boolean
  hints: boolean
  timer: boolean
  fullscreen: boolean

  // Notifications
  gameReminders: boolean
  achievements: boolean
  communityUpdates: boolean
  emailNotifications: boolean

  // Language & Accessibility
  language: string
  subtitles: boolean
  screenReader: boolean
  keyboardNavigation: boolean

  // Performance
  quality: "Low" | "Medium" | "High" | "Ultra"
  frameRate: number
  internetOptimization: boolean
}

const DEFAULT_SETTINGS: SettingsState = {
  soundEnabled: true,
  musicVolume: 70,
  effectsVolume: 80,
  voiceEnabled: true,
  darkMode: false,
  animations: true,
  highContrast: false,
  fontSize: 16,
  colorBlind: false,
  cameraEnabled: true,
  faceDetection: true,
  privacyMode: false,
  dataCollection: true,
  difficulty: "Medium",
  autoSave: true,
  hints: true,
  timer: true,
  fullscreen: false,
  gameReminders: true,
  achievements: true,
  communityUpdates: false,
  emailNotifications: false,
  language: "English",
  subtitles: false,
  screenReader: false,
  keyboardNavigation: false,
  quality: "High",
  frameRate: 60,
  internetOptimization: true,
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS)
  const [hasChanges, setHasChanges] = useState(false)
  const [activeSection, setActiveSection] = useState("audio")

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("gameSettings")
    if (savedSettings) {
      setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) })
    }
  }, [])

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const saveSettings = () => {
    localStorage.setItem("gameSettings", JSON.stringify(settings))
    setHasChanges(false)
    alert("✅ Settings saved successfully!")
  }

  const resetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to default?")) {
      setSettings(DEFAULT_SETTINGS)
      localStorage.removeItem("gameSettings")
      setHasChanges(false)
      alert("🔄 Settings reset to default!")
    }
  }

  const sections = [
    { id: "audio", name: "Audio", icon: <Volume2 size={20} /> },
    { id: "visual", name: "Visual", icon: <Eye size={20} /> },
    { id: "camera", name: "Camera & Privacy", icon: <Camera size={20} /> },
    { id: "game", name: "Game Settings", icon: <Gamepad2 size={20} /> },
    { id: "notifications", name: "Notifications", icon: <Bell size={20} /> },
    { id: "accessibility", name: "Accessibility", icon: <Globe size={20} /> },
    { id: "performance", name: "Performance", icon: <Zap size={20} /> },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              <span className="bg-gradient-to-r from-gray-600 to-blue-600 bg-clip-text text-transparent">Settings</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Customize your learning experience with personalized settings for optimal performance and comfort.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="text-blue-600" size={24} />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sections.map((section) => (
                  <Button
                    key={section.id}
                    variant={activeSection === section.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveSection(section.id)}
                  >
                    {section.icon}
                    <span className="ml-2">{section.name}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Audio Settings */}
            {activeSection === "audio" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {settings.soundEnabled ? (
                        <Volume2 className="text-green-600" size={24} />
                      ) : (
                        <VolumeX className="text-red-600" size={24} />
                      )}
                      Audio Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Sound Effects</h3>
                        <p className="text-sm text-gray-500">Enable game sound effects and audio feedback</p>
                      </div>
                      <Switch
                        checked={settings.soundEnabled}
                        onCheckedChange={(checked) => updateSetting("soundEnabled", checked)}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="font-medium">Music Volume</label>
                          <Badge variant="outline">{settings.musicVolume}%</Badge>
                        </div>
                        <Slider
                          value={[settings.musicVolume]}
                          onValueChange={(value) => updateSetting("musicVolume", value[0])}
                          max={100}
                          step={5}
                          disabled={!settings.soundEnabled}
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="font-medium">Effects Volume</label>
                          <Badge variant="outline">{settings.effectsVolume}%</Badge>
                        </div>
                        <Slider
                          value={[settings.effectsVolume]}
                          onValueChange={(value) => updateSetting("effectsVolume", value[0])}
                          max={100}
                          step={5}
                          disabled={!settings.soundEnabled}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {settings.voiceEnabled ? (
                          <Mic className="text-green-600" size={20} />
                        ) : (
                          <MicOff className="text-red-600" size={20} />
                        )}
                        <div>
                          <h3 className="font-medium">Voice Instructions</h3>
                          <p className="text-sm text-gray-500">Enable voice guidance and instructions</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.voiceEnabled}
                        onCheckedChange={(checked) => updateSetting("voiceEnabled", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Visual Settings */}
            {activeSection === "visual" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="text-purple-600" size={24} />
                      Visual Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {settings.darkMode ? (
                          <Moon className="text-blue-600" size={20} />
                        ) : (
                          <Sun className="text-yellow-600" size={20} />
                        )}
                        <div>
                          <h3 className="font-medium">Dark Mode</h3>
                          <p className="text-sm text-gray-500">Switch to dark theme for better night viewing</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.darkMode}
                        onCheckedChange={(checked) => updateSetting("darkMode", checked)}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Animations</h3>
                        <p className="text-sm text-gray-500">Enable smooth transitions and animations</p>
                      </div>
                      <Switch
                        checked={settings.animations}
                        onCheckedChange={(checked) => updateSetting("animations", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">High Contrast</h3>
                        <p className="text-sm text-gray-500">Increase contrast for better visibility</p>
                      </div>
                      <Switch
                        checked={settings.highContrast}
                        onCheckedChange={(checked) => updateSetting("highContrast", checked)}
                      />
                    </div>

                    <Separator />

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-medium">Font Size</label>
                        <Badge variant="outline">{settings.fontSize}px</Badge>
                      </div>
                      <Slider
                        value={[settings.fontSize]}
                        onValueChange={(value) => updateSetting("fontSize", value[0])}
                        min={12}
                        max={24}
                        step={1}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Color Blind Support</h3>
                        <p className="text-sm text-gray-500">Adjust colors for color vision deficiency</p>
                      </div>
                      <Switch
                        checked={settings.colorBlind}
                        onCheckedChange={(checked) => updateSetting("colorBlind", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Camera & Privacy Settings */}
            {activeSection === "camera" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {settings.cameraEnabled ? (
                        <Camera className="text-green-600" size={24} />
                      ) : (
                        <CameraOff className="text-red-600" size={24} />
                      )}
                      Camera & Privacy Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="text-yellow-600" size={20} />
                        <h4 className="font-bold text-yellow-800">Academic Integrity Notice</h4>
                      </div>
                      <p className="text-sm text-yellow-700">
                        Camera monitoring is required for all games to ensure academic integrity. Disabling camera will
                        prevent game access.
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Camera Monitoring</h3>
                        <p className="text-sm text-gray-500">Enable camera for academic integrity monitoring</p>
                      </div>
                      <Switch
                        checked={settings.cameraEnabled}
                        onCheckedChange={(checked) => updateSetting("cameraEnabled", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Face Detection</h3>
                        <p className="text-sm text-gray-500">Advanced face detection for security</p>
                      </div>
                      <Switch
                        checked={settings.faceDetection}
                        onCheckedChange={(checked) => updateSetting("faceDetection", checked)}
                        disabled={!settings.cameraEnabled}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {settings.privacyMode ? (
                          <EyeOff className="text-red-600" size={20} />
                        ) : (
                          <Eye className="text-green-600" size={20} />
                        )}
                        <div>
                          <h3 className="font-medium">Privacy Mode</h3>
                          <p className="text-sm text-gray-500">Minimize data collection and tracking</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.privacyMode}
                        onCheckedChange={(checked) => updateSetting("privacyMode", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Data Collection</h3>
                        <p className="text-sm text-gray-500">Allow anonymous usage data collection for improvements</p>
                      </div>
                      <Switch
                        checked={settings.dataCollection}
                        onCheckedChange={(checked) => updateSetting("dataCollection", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Game Settings */}
            {activeSection === "game" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gamepad2 className="text-blue-600" size={24} />
                      Game Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="font-medium mb-2 block">Default Difficulty</label>
                      <select
                        value={settings.difficulty}
                        onChange={(e) => updateSetting("difficulty", e.target.value as any)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Easy">Easy - Beginner friendly</option>
                        <option value="Medium">Medium - Balanced challenge</option>
                        <option value="Hard">Hard - Advanced difficulty</option>
                        <option value="Expert">Expert - Maximum challenge</option>
                      </select>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Save className="text-green-600" size={20} />
                        <div>
                          <h3 className="font-medium">Auto Save</h3>
                          <p className="text-sm text-gray-500">Automatically save game progress</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.autoSave}
                        onCheckedChange={(checked) => updateSetting("autoSave", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Brain className="text-purple-600" size={20} />
                        <div>
                          <h3 className="font-medium">Hints</h3>
                          <p className="text-sm text-gray-500">Show helpful hints during games</p>
                        </div>
                      </div>
                      <Switch checked={settings.hints} onCheckedChange={(checked) => updateSetting("hints", checked)} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="text-orange-600" size={20} />
                        <div>
                          <h3 className="font-medium">Timer Display</h3>
                          <p className="text-sm text-gray-500">Show countdown timer during games</p>
                        </div>
                      </div>
                      <Switch checked={settings.timer} onCheckedChange={(checked) => updateSetting("timer", checked)} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Monitor className="text-blue-600" size={20} />
                        <div>
                          <h3 className="font-medium">Fullscreen Mode</h3>
                          <p className="text-sm text-gray-500">Launch games in fullscreen by default</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.fullscreen}
                        onCheckedChange={(checked) => updateSetting("fullscreen", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Notifications Settings */}
            {activeSection === "notifications" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="text-yellow-600" size={24} />
                      Notification Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="text-blue-600" size={20} />
                        <div>
                          <h3 className="font-medium">Game Reminders</h3>
                          <p className="text-sm text-gray-500">Remind me to practice daily</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.gameReminders}
                        onCheckedChange={(checked) => updateSetting("gameReminders", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Trophy className="text-gold-600" size={20} />
                        <div>
                          <h3 className="font-medium">Achievement Notifications</h3>
                          <p className="text-sm text-gray-500">Notify when I earn new achievements</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.achievements}
                        onCheckedChange={(checked) => updateSetting("achievements", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="text-purple-600" size={20} />
                        <div>
                          <h3 className="font-medium">Community Updates</h3>
                          <p className="text-sm text-gray-500">Updates from study groups and community</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.communityUpdates}
                        onCheckedChange={(checked) => updateSetting("communityUpdates", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="text-green-600" size={20} />
                        <div>
                          <h3 className="font-medium">Email Notifications</h3>
                          <p className="text-sm text-gray-500">Send notifications to my email</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Accessibility Settings */}
            {activeSection === "accessibility" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="text-green-600" size={24} />
                      Accessibility Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="font-medium mb-2 block">Language</label>
                      <select
                        value={settings.language}
                        onChange={(e) => updateSetting("language", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Español</option>
                        <option value="French">Français</option>
                        <option value="German">Deutsch</option>
                        <option value="Chinese">中文</option>
                        <option value="Japanese">日本語</option>
                        <option value="Korean">한국어</option>
                        <option value="Arabic">العربية</option>
                      </select>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="text-blue-600" size={20} />
                        <div>
                          <h3 className="font-medium">Subtitles</h3>
                          <p className="text-sm text-gray-500">Show text for all audio content</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.subtitles}
                        onCheckedChange={(checked) => updateSetting("subtitles", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Eye className="text-purple-600" size={20} />
                        <div>
                          <h3 className="font-medium">Screen Reader Support</h3>
                          <p className="text-sm text-gray-500">Optimize for screen reading software</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.screenReader}
                        onCheckedChange={(checked) => updateSetting("screenReader", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="text-orange-600" size={20} />
                        <div>
                          <h3 className="font-medium">Keyboard Navigation</h3>
                          <p className="text-sm text-gray-500">Navigate using keyboard only</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.keyboardNavigation}
                        onCheckedChange={(checked) => updateSetting("keyboardNavigation", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Performance Settings */}
            {activeSection === "performance" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="text-yellow-600" size={24} />
                      Performance Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="font-medium mb-2 block">Graphics Quality</label>
                      <select
                        value={settings.quality}
                        onChange={(e) => updateSetting("quality", e.target.value as any)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Low">Low - Best performance</option>
                        <option value="Medium">Medium - Balanced</option>
                        <option value="High">High - Better visuals</option>
                        <option value="Ultra">Ultra - Best quality</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-medium">Frame Rate Limit</label>
                        <Badge variant="outline">{settings.frameRate} FPS</Badge>
                      </div>
                      <Slider
                        value={[settings.frameRate]}
                        onValueChange={(value) => updateSetting("frameRate", value[0])}
                        min={30}
                        max={120}
                        step={15}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {settings.internetOptimization ? (
                          <Wifi className="text-green-600" size={20} />
                        ) : (
                          <WifiOff className="text-red-600" size={20} />
                        )}
                        <div>
                          <h3 className="font-medium">Internet Optimization</h3>
                          <p className="text-sm text-gray-500">Optimize for slower internet connections</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.internetOptimization}
                        onCheckedChange={(checked) => updateSetting("internetOptimization", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Save/Reset Actions */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">Settings Actions</h3>
                    <p className="text-sm text-gray-600">
                      {hasChanges ? "You have unsaved changes" : "All settings are saved"}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={resetSettings}
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                    >
                      <RotateCcw className="mr-2" size={18} />
                      Reset All
                    </Button>
                    <Button
                      onClick={saveSettings}
                      disabled={!hasChanges}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Save className="mr-2" size={18} />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
