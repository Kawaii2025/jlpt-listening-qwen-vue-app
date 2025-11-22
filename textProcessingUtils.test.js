import { splitByPeriod, extractAndRemoveGenderPrefix, compareTexts, containsJapanese } from './src/utils/textProcessingUtils.js'

// Framework-agnostic unit tests for pure text utils; safe across Vue -> React refactors.

describe('textProcessingUtils (framework agnostic)', () => {
  const sampleText = `大学の演劇サークルで女の学生と部長の男の学生が話しています。女の学生はこの後何をしなければなりませんか。
女:鈴木さん。来週の新入生勧誘のためのサークル体験会、ポスターを見た人から早速参加の申し込みが来てますね。
男:うん、準備進めないとね。当日来てくれた人には演劇を一部実際に体験してもらうよね？その時に使うシーン、台本から候補選ぶのお願いしてたけど、どう？`;

  test('splitByPeriod splits sentences retaining end punctuation', () => {
    const sentences = splitByPeriod(sampleText)
    expect(sentences.length).toBeGreaterThan(0)
    expect(/[。！？]$/.test(sentences[0])).toBe(true)
  })

  test('extractAndRemoveGenderPrefix extracts gender and strips prefix', () => {
    expect(extractAndRemoveGenderPrefix('女:これは何ですか。')).toEqual({ text: 'これは何ですか。', gender: 'female' })
    expect(extractAndRemoveGenderPrefix('男：分かりました。')).toEqual({ text: '分かりました。', gender: 'male' })
    expect(extractAndRemoveGenderPrefix('これは何ですか。')).toEqual({ text: 'これは何ですか。', gender: null })
  })

  test('compareTexts returns accuracy and error positions', () => {
    const { accuracy, correct, errorPositions, userHtml, correctHtml } = compareTexts('abcXde', 'abcdef')
    expect(accuracy).toBeGreaterThan(0)
    expect(correct).toBe(false)
    expect(errorPositions.length).toBeGreaterThan(0)
    expect(userHtml).toContain('incorrect-char')
    expect(correctHtml).toContain('incorrect-char')
  })

  test('containsJapanese detects Japanese characters', () => {
    expect(containsJapanese('これはテスト')).toBe(true)
    expect(containsJapanese('Test 123')).toBe(false)
  })

  test('pipeline: split + gender extraction keeps alignment', () => {
    const sentences = splitByPeriod(sampleText)
    const processed = sentences.map(s => extractAndRemoveGenderPrefix(s))
    expect(processed.length).toBe(sentences.length)
    expect(processed.some(p => p.gender)).toBe(true)
  })
})
