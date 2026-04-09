// TypingMind Morning Ping Extension
// Sends a message to the active conversation at a scheduled time.
//
// HOW TO USE:
// 1. Host this file (e.g. GitHub Pages -> raw URL)
// 2. Paste the raw URL into TypingMind Extensions -> Install
// 3. Leave TypingMind open in a browser tab with the target agent conversation active
//
// CONFIGURE BELOW:
const PING_HOUR = 7;   // 24h format -- 7 = 7:00 AM
const PING_MINUTE = 0;
const PING_MESSAGE = "Good morning. Write me a morning note.";

let hasPingedToday = false;

function resetAtMidnight() {
  const now = new Date();
  if (now.getHours() === 0 && now.getMinutes() === 0) {
    hasPingedToday = false;
  }
}

function simulateSend(message) {
  // Try to find the textarea/input
  const textarea = document.querySelector('textarea');
  if (!textarea) {
    console.warn('[MorningPing] No textarea found');
    return false;
  }

  // Set the value using native input setter (works with React)
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype,
    'value'
  ).set;
  nativeInputValueSetter.call(textarea, message);

  // Dispatch input event so React picks up the change
  textarea.dispatchEvent(new Event('input', { bubbles: true }));

  // Small delay then click send
  setTimeout(() => {
    // Try common send button selectors
    const sendButton =
      document.querySelector('[data-testid="send-button"]') ||
      document.querySelector('button[class*="send"]') ||
      document.querySelector('form button[type="submit"]') ||
      // Fallback: find a button near the textarea
      textarea.closest('form')?.querySelector('button') ||
      textarea.parentElement?.querySelector('button');

    if (sendButton) {
      sendButton.click();
      console.log('[MorningPing] Message sent!');
    } else {
      // Try pressing Enter instead
      textarea.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        bubbles: true
      }));
      console.log('[MorningPing] Tried Enter key fallback');
    }
  }, 500);

  return true;
}

// Check every 30 seconds
setInterval(() => {
  resetAtMidnight();
  const now = new Date();
  if (
    now.getHours() === PING_HOUR &&
    now.getMinutes() === PING_MINUTE &&
    !hasPingedToday
  ) {
    console.log('[MorningPing] Triggering morning message...');
    const sent = simulateSend(PING_MESSAGE);
    if (sent) hasPingedToday = true;
  }
}, 30000);

console.log(`[MorningPing] Extension loaded. Will ping at ${PING_HOUR}:${String(PING_MINUTE).padStart(2,'0')}`);
