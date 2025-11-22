// Framework-agnostic tests for text processing utilities.
// Uses dynamic import to avoid Jest ESM config changes; remains valid after migrating UI from Vue to React.

let utils
beforeAll(async () => {
  utils = await import('./textProcessingUtils.js')
})

describe('textProcessingUtils (agnostic)', () => {
  const sampleText = `大学の演劇サークルで女の学生と部長の男の学生が話しています。女の学生はこの後何をしなければなりませんか。
女:鈴木さん。来週の新入生勧誘のためのサークル体験会、ポスターを見た人から早速参加の申し込みが来てますね。
男:うん、準備進めないとね。当日来てくれた人には演劇を一部実際に体験してもらうよね？その時に使うシーン、台本から候補選ぶのお願いしてたけど、どう？`;

  test('splitByPeriod retains end punctuation', () => {
    const sentences = utils.splitByPeriod(sampleText)
    expect(sentences.length).toBeGreaterThan(0)
    expect(/[。！？]$/.test(sentences[0])).toBe(true)
  })

  test('extractAndRemoveGenderPrefix works for male/female/none', () => {
    expect(utils.extractAndRemoveGenderPrefix('女:これは何ですか。')).toEqual({ text: 'これは何ですか。', gender: 'female' })
    expect(utils.extractAndRemoveGenderPrefix('男：分かりました。')).toEqual({ text: '分かりました。', gender: 'male' })
    expect(utils.extractAndRemoveGenderPrefix('これは何ですか。')).toEqual({ text: 'これは何ですか。', gender: null })
  })

  test('compareTexts detects differences and accuracy', () => {
    const r = utils.compareTexts('abcXde', 'abcdef')
    expect(r.accuracy).toBeGreaterThan(0)
    expect(r.correct).toBe(false)
    expect(r.errorPositions.length).toBeGreaterThan(0)
    expect(r.userHtml).toContain('incorrect-char')
    expect(r.correctHtml).toContain('incorrect-char')
  })

  test('containsJapanese distinguishes scripts', () => {
    expect(utils.containsJapanese('これはテスト')).toBe(true)
    expect(utils.containsJapanese('Test 123')).toBe(false)
  })

  test('pipeline alignment split + gender', () => {
    const sentences = utils.splitByPeriod(sampleText)
    const processed = sentences.map(s => utils.extractAndRemoveGenderPrefix(s))
    expect(processed.length).toBe(sentences.length)
    expect(processed.some(p => p.gender)).toBe(true)
  })
})
