import { useSpeechSynthesis } from './useSpeechSynthesis'
import { useNotification } from './useNotification'
import {
  compareTexts,
  splitByPeriod,
  extractAndRemoveGenderPrefix,
  containsJapanese
} from '../utils/textProcessingUtils'
import {
  findNextParticlePosition,
  findNthParticlePosition
} from '../utils/particleUtils'

export function useTextProcessing() {
  const { speakJapanese } = useSpeechSynthesis()
  const { showNotification } = useNotification()

  return {
    containsJapanese,
    splitByPeriod,
    extractAndRemoveGenderPrefix,
    findNextParticlePosition,
    findNthParticlePosition,
    compareTexts,
    speakJapanese,
    showNotification
  }
}
