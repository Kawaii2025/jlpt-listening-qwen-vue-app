/**
 * Test Utilities for E2E Testing
 * Helpers for speech synthesis mocking, audio playback, and common assertions
 */

/**
 * Mock the Web Speech API for testing
 * @param {import('@playwright/test').Page} page
 */
export async function mockSpeechSynthesis(page) {
  await page.addInitScript(() => {
    // Mock SpeechSynthesisUtterance
    window.mockUtterances = [];
    window.SpeechSynthesisUtterance = class MockUtterance {
      constructor(text) {
        this.text = text;
        this.lang = 'ja-JP';
        this.rate = 1;
        this.pitch = 1;
        this.volume = 1;
        this.voice = null;
        this.onend = null;
        this.onerror = null;
        this.onstart = null;
      }
    };

    // Mock speechSynthesis
    window.speechSynthesis = {
      pending: false,
      speaking: false,
      paused: false,
      
      speak(utterance) {
        window.mockUtterances.push({
          text: utterance.text,
          lang: utterance.lang,
          voice: utterance.voice,
          timestamp: Date.now()
        });
        
        this.speaking = true;
        if (utterance.onstart) {
          setTimeout(() => utterance.onstart(), 10);
        }
        
        setTimeout(() => {
          this.speaking = false;
          if (utterance.onend) {
            utterance.onend();
          }
        }, 100);
      },
      
      cancel() {
        this.speaking = false;
        window.mockUtterances = [];
      },
      
      pause() {
        this.paused = true;
      },
      
      resume() {
        this.paused = false;
      },
      
      getVoices() {
        return [
          {
            name: 'Microsoft Haruka - Japanese (Japan)',
            lang: 'ja-JP',
            localService: true,
            default: false
          },
          {
            name: 'Google 日本語',
            lang: 'ja-JP',
            localService: false,
            default: true
          }
        ];
      }
    };
  });
}

/**
 * Get the captured speech utterances from the mock
 * @param {import('@playwright/test').Page} page
 */
export async function getCapturedUtterances(page) {
  return await page.evaluate(() => window.mockUtterances || []);
}

/**
 * Clear captured utterances
 * @param {import('@playwright/test').Page} page
 */
export async function clearUtterances(page) {
  await page.evaluate(() => {
    window.mockUtterances = [];
  });
}

/**
 * Wait for an element to be visible with retry
 * @param {import('@playwright/test').Page} page
 * @param {string} selector
 * @param {number} timeout
 */
export async function waitForElement(page, selector, timeout = 5000) {
  await page.waitForSelector(selector, { state: 'visible', timeout });
}

/**
 * Wait for notification to appear and check its content
 * @param {import('@playwright/test').Page} page
 * @param {string} expectedMessage
 */
export async function waitForNotification(page, expectedMessage) {
  const notification = await page.waitForSelector('.fixed.bottom-4.right-4', { 
    state: 'visible',
    timeout: 5000 
  });
  
  const text = await notification.textContent();
  return text.includes(expectedMessage);
}

/**
 * Fill textarea and trigger events properly
 * @param {import('@playwright/test').Page} page
 * @param {string} selector
 * @param {string} text
 */
export async function fillTextarea(page, selector, text) {
  await page.fill(selector, text);
  await page.dispatchEvent(selector, 'input');
}

/**
 * Get sentence card elements
 * @param {import('@playwright/test').Page} page
 */
export async function getSentenceCards(page) {
  return await page.locator('.bg-white.rounded-xl.shadow-sm.p-6').all();
}

/**
 * Get a specific sentence card by index
 * @param {import('@playwright/test').Page} page
 * @param {number} index
 */
export async function getSentenceCard(page, index) {
  const cards = await getSentenceCards(page);
  return cards[index];
}

/**
 * Type text slowly to simulate real user input
 * @param {import('@playwright/test').Page} page
 * @param {string} selector
 * @param {string} text
 */
export async function typeSlowly(page, selector, text) {
  await page.focus(selector);
  for (const char of text) {
    await page.keyboard.type(char);
    await page.waitForTimeout(50);
  }
}

/**
 * Check if element has class
 * @param {import('@playwright/test').Locator} element
 * @param {string} className
 */
export async function hasClass(element, className) {
  const classes = await element.getAttribute('class');
  return classes.includes(className);
}

/**
 * Sample Japanese text for testing
 */
export const testData = {
  sampleText: `大学の演劇サークルで女の学生と部長の男の学生が話しています。女の学生はこの後何をしなければなりませんか。
女:鈴木さん。来週の新入生勧誘のためのサークル体験会、ポスターを見た人から早速参加の申し込みが来てますね。
男:うん、準備進めないとね。当日来てくれた人には演劇を一部実際に体験してもらうよね？その時に使うシーン、台本から候補選ぶのお願いしてたけど、どう?
女:はい。体験者が多くても使えそうなシーンを3つピックアップしました。`,
  
  shortText: `女:これはテストです。
男:分かりました。`,

  textWithoutGender: `これは性別なしの文です。もう一つの文です。`,
  
  singleSentence: `女:今日はいい天気ですね。`,
  
  incorrectAnswer: `鈴木さん。来週の新入生勧誘`,
  
  correctAnswer: `鈴木さん。来週の新入生勧誘のためのサークル体験会、ポスターを見た人から早速参加の申し込みが来てますね。`,
};
