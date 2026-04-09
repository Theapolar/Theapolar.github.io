// TypingMind Morning Ping Extension
// CONFIGURE:
const PING_HOUR = 7;
const PING_MINUTE = 0;
const PING_MESSAGE = "Good morning. Write me a morning note.";

let hasPingedToday = false;

function simulateSend(message) {
  const textarea = document.querySelector('[data-element-id="chat-input-textbox"]');
  if (!textarea) {
    console.warn('[MorningPing] No chat input found');
    return false;
  }

  // Set value via native setter (React compatibility)
  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype, 'value'
  ).set;
  setter.call(textarea, message);
  textarea.dispatchEvent(new Event('input', { bubbles: true }));

  // Try Enter key after short delay
  setTimeout(() => {
    // Find send button by data-element-id or by text content
    const sendBtn = document.querySelector('[data-element-id="send-button"]');
    if (sendBtn) {
      sendBtn.click();
      console.log('[MorningPing] Sent via button');
    } else {
      textarea.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true
      }));
      console.log('[MorningPing] Sent via Enter key');
    }
  }, 500);

  return true;
}

setInterval(() => {
  const now = new Date();
  if (now.getHours() === 0 && now.getMinutes() === 0) hasPingedToday = false;
  if (now.getHours() === PING_HOUR && now.getMinutes() === PING_MINUTE && !hasPingedToday) {
    console.log('[MorningPing] Triggering...');
    if (simulateSend(PING_MESSAGE)) hasPingedToday = true;
  }
}, 30000);

console.log('[MorningPing] Loaded. Will ping at ' + PING_HOUR + ':' + String(PING_MINUTE).padStart(2, '0'));
