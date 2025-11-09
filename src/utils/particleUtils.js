import { JAPANESE_PARTICLES } from '../constants/japaneseParticles'

/**
 * 查找从指定位置开始的下一个助词位置
 */
export function findNextParticlePosition(text, startPos) {
  // 从起始位置开始检查每个字符
  for (let i = startPos; i < text.length; i++) {
    // 检查当前字符是否是助词
    if (JAPANESE_PARTICLES.includes(text[i])) {
      return i
    }

    // 检查是否是双字符助词（如"って"）
    if (i < text.length - 1) {
      const twoChars = text[i] + text[i + 1]
      if (JAPANESE_PARTICLES.includes(twoChars)) {
        return i + 1 // 返回双字符助词的结束位置
      }
    }
  }

  // 如果没有找到助词，返回文本末尾
  return text.length - 1
}

/**
 * 查找从指定位置开始的第N个助词位置
 */
export function findNthParticlePosition(text, startPos, count) {
  let particleCount = 0
  let lastPosition = startPos

  // 从起始位置开始检查每个字符
  for (let i = startPos; i < text.length; i++) {
    // 检查当前字符是否是助词
    if (JAPANESE_PARTICLES.includes(text[i])) {
      particleCount++
      lastPosition = i
      if (particleCount >= count) {
        return lastPosition
      }
    }

    // 检查是否是双字符助词（如"って"）
    if (i < text.length - 1) {
      const twoChars = text[i] + text[i + 1]
      if (JAPANESE_PARTICLES.includes(twoChars)) {
        particleCount++
        lastPosition = i + 1
        if (particleCount >= count) {
          return lastPosition
        }
        i++ // 跳过已处理的第二个字符
      }
    }
  }

  // 如果找到的助词不足N个，返回文本末尾
  return text.length - 1
}
