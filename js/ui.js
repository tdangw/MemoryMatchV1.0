// ui.js

import { gameState } from './gameState.js';
import { sounds } from './sound.js'; // ✅ Đã tách âm thanh

const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const hintElement = document.getElementById('hint');
const timerElement = document.getElementById('timer');
const highScoreEl = document.getElementById('high-score');

export function updateHighScoreDisplay(score) {
  if (highScoreEl) {
    highScoreEl.textContent = `🥇${score}`;
  }
}

export function updateScoreDisplay(score) {
  if (scoreElement) scoreElement.textContent = score;
}

export function updateLevelDisplay(level) {
  if (levelElement) levelElement.textContent = level;
}

export function updateHintDisplay(hints) {
  if (hintElement) hintElement.textContent = `${hints}`;
}

export function updateTimerDisplay(seconds) {
  if (!timerElement) return;
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  timerElement.textContent = `⏱️${m}:${s}`;
}

export function showBonusOverlay(message) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay fade-in';

  const modal = document.createElement('div');
  modal.className = 'modal slide-down';
  modal.innerHTML = `
    <h2>🎁 Thông báotest</h2>
    <p>${message}</p>
    <button class="settings-btn">Tiếp tục</button>
  `;

  if (gameState.settings?.sound) {
    sounds.overlay.currentTime = 0;
    sounds.overlay.play().catch(() => {});
  }

  modal.querySelector('button').onclick = () => {
    modal.classList.add('slide-up');
    overlay.classList.remove('fade-in');
    overlay.classList.add('fade-out');
    setTimeout(() => document.body.removeChild(overlay), 300);
  };

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

export function showLevelRewardOverlay({ reward, hintGain, timeBonus }) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay fade-in';

  const modal = document.createElement('div');
  modal.className = 'modal slide-down';
  modal.innerHTML = `
    <h2>🎉Thưởng qua màn!</h2>
    <p>⭐+${reward} điểm</p>
    <p>💡+${hintGain} gợi ý</p>
    <p>⏱️+${timeBonus} giây</p>
    <button class="settings-btn">Tiếp tục</button>
  `;

  if (gameState.settings?.sound) {
    sounds.bonus.currentTime = 0;
    sounds.bonus.play().catch(() => {});
  }

  modal.querySelector('button').onclick = () => {
    modal.classList.add('slide-up');
    overlay.classList.remove('fade-in');
    overlay.classList.add('fade-out');
    setTimeout(() => document.body.removeChild(overlay), 300);
  };

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

export function showResetConfirmationOverlay() {
  const existing = document.getElementById('reset-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'reset-overlay';
  overlay.className = 'overlay fade-in';

  const modal = document.createElement('div');
  modal.className = 'modal slide-down';
  modal.innerHTML = `
    <h2>📛 Xác nhận</h2>
    <p>Bạn có chắc muốn xoá điểm kỷ lục không?</p>
    <div class="button-row">
      <button class="confirm-btn">✅ Đồng ý</button>
      <button class="cancel-btn">❌ Huỷ</button>
    </div>
  `;

  if (gameState.settings?.sound) {
    sounds.overlay.currentTime = 0;
    sounds.overlay.play().catch(() => {});
  }

  modal.querySelector('.confirm-btn').onclick = () => {
    if (gameState.settings?.sound) {
      sounds.confirm.currentTime = 0;
      sounds.confirm.play().catch(() => {});
    }
    localStorage.removeItem('highScore');
    overlay.classList.remove('fade-in');
    overlay.classList.add('fade-out');
    setTimeout(() => {
      overlay.remove();
      location.reload();
    }, 1500);
  };

  modal.querySelector('.cancel-btn').onclick = () => {
    modal.classList.add('slide-up');
    overlay.classList.remove('fade-in');
    overlay.classList.add('fade-out');
    setTimeout(() => overlay.remove(), 300);
  };

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

export function showReturnToMenuOverlay() {
  const existing = document.getElementById('return-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'return-overlay';
  overlay.className = 'overlay fade-in';

  const modal = document.createElement('div');
  modal.className = 'modal slide-down';
  modal.innerHTML = `
    <h2>🏠 Quay về menu?</h2>
    <p>Tiến trình hiện tại sẽ bị mất.<br>Bạn có chắc không?</p>
    <div class="button-row">
      <button class="confirm-btn">✅ Đồng ý</button>
      <button class="cancel-btn">❌ Huỷ</button>
    </div>
  `;

  if (gameState.settings?.sound) {
    sounds.overlay.currentTime = 0;
    sounds.overlay.play().catch(() => {});
  }

  modal.querySelector('.confirm-btn').onclick = () => {
    if (gameState.settings?.sound) {
      sounds.confirm.currentTime = 0;
      sounds.confirm.play().catch(() => {});
    }

    overlay.classList.remove('fade-in');
    overlay.classList.add('fade-out');
    setTimeout(() => {
      overlay.remove();
      location.reload();
    }, 1500);
  };

  modal.querySelector('.cancel-btn').onclick = () => {
    modal.classList.add('slide-up');
    overlay.classList.remove('fade-in');
    overlay.classList.add('fade-out');
    setTimeout(() => overlay.remove(), 300);
  };

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}
/**
 * 💡 Hiển thị hiệu ứng cộng điểm tại vị trí tile cụ thể (ví dụ ô thứ 2 khi match)
 * @param {HTMLElement} tileElement - Ô tile DOM
 * @param {string|number} text - Nội dung hiển thị (ví dụ: 12 hoặc '+12 points')
 */
export function showTilePointEffect(tileElement, text = '') {
  const effect = document.createElement('div');
  effect.className = 'tile-point-effect';

  // Tự chuyển số thành dạng +12
  if (typeof text === 'number') {
    effect.textContent = `+${text}`;
  } else {
    effect.textContent = text;
  }

  const rect = tileElement.getBoundingClientRect();
  effect.style.left = `${rect.left + rect.width / 2}px`;
  effect.style.top = `${rect.top}px`;

  document.body.appendChild(effect);

  setTimeout(() => {
    effect.classList.add('fade-out');
    setTimeout(() => {
      effect.remove();
    }, 400);
  }, 1600);
}
