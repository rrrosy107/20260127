'use client'

class TextToSpeech {
  private speechSynthesis: SpeechSynthesis | null = null
  private currentUtterance: SpeechSynthesisUtterance | null = null
  private isPlaying: boolean = false

  constructor() {
    // Check if speech synthesis is available
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.speechSynthesis = window.speechSynthesis
    }
  }

  /**
   * Speak text using Web Speech API
   * @param text Text to speak
   * @param lang Language code (default: 'zh-CN')
   * @param onEnd Callback when speech ends
   * @returns Promise that resolves when speech starts
   */
  async speak(text: string, lang: string = 'zh-CN', onEnd?: () => void): Promise<boolean> {
    if (!this.speechSynthesis) {
      console.error('Speech synthesis is not available in this browser')
      return false
    }

    // Cancel any ongoing speech
    this.cancel()

    try {
      // Create new utterance
      this.currentUtterance = new SpeechSynthesisUtterance(text)
      this.currentUtterance.lang = lang
      this.currentUtterance.rate = 1
      this.currentUtterance.pitch = 1
      this.currentUtterance.volume = 1

      // Set callbacks
      this.currentUtterance.onstart = () => {
        this.isPlaying = true
      }

      this.currentUtterance.onend = () => {
        this.isPlaying = false
        this.currentUtterance = null
        if (onEnd) {
          onEnd()
        }
      }

      this.currentUtterance.onerror = () => {
        this.isPlaying = false
        this.currentUtterance = null
        console.error('Speech synthesis error')
      }

      // Start speaking
      this.speechSynthesis.speak(this.currentUtterance)
      return true
    } catch (error) {
      console.error('Error speaking text:', error)
      this.isPlaying = false
      this.currentUtterance = null
      return false
    }
  }

  /**
   * Cancel current speech
   */
  cancel(): void {
    if (this.speechSynthesis) {
      this.speechSynthesis.cancel()
      this.isPlaying = false
      this.currentUtterance = null
    }
  }

  /**
   * Pause current speech
   */
  pause(): void {
    if (this.speechSynthesis && this.isPlaying) {
      this.speechSynthesis.pause()
      this.isPlaying = false
    }
  }

  /**
   * Resume paused speech
   */
  resume(): void {
    if (this.speechSynthesis && !this.isPlaying) {
      this.speechSynthesis.resume()
      this.isPlaying = true
    }
  }

  /**
   * Check if speech is currently playing
   */
  getIsPlaying(): boolean {
    return this.isPlaying
  }

  /**
   * Get available voices
   */
  getVoices(): SpeechSynthesisVoice[] {
    if (this.speechSynthesis) {
      return this.speechSynthesis.getVoices()
    }
    return []
  }
}

// Create singleton instance
const tts = new TextToSpeech()

export default tts
