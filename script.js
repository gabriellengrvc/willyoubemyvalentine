window.addEventListener('load', () => {
  setTimeout(() => {
      document.getElementById('loading-screen').classList.add('hidden');
  }, 3000);
});

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

const mailStage = document.getElementById('mail-stage');
if (mailStage) {
  mailStage.addEventListener('click', () => {
    mailStage.classList.add('hidden');
    document.body.classList.remove('scroll-locked');
    window.scrollTo(0, 0);
    window.dispatchEvent(new Event('scroll'));
  }, { once: true });
}

const envelopeSound = document.getElementById('envelopeSound');
const yesSound = document.getElementById('yesSound');
const noSound = document.getElementById('noSound');
function playOnce(audio) {
  if (!audio) return;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}
window.addEventListener('pointerdown', () => {
  [envelopeSound, yesSound, noSound].forEach((a) => {
      a.play().then(() => a.pause()).catch(() => {});
  });
}, { once: true });

const bgMusic = document.getElementById('bgMusic');
const soundToggle = document.getElementById('sound-toggle');
const soundToggleImg = document.getElementById('sound-toggle-img');
const SOUND_ON_SRC = 'assets/soundon.png';
const SOUND_OFF_SRC = 'assets/soundoff.png';

if (bgMusic) bgMusic.volume = 0.5;

if (bgMusic && soundToggle && soundToggleImg) {
  soundToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (bgMusic.paused) {
      bgMusic.volume = 0.5;
      bgMusic.play().then(() => {
        soundToggleImg.src = SOUND_ON_SRC;
        soundToggleImg.alt = 'Sound on';
      }).catch(() => {});
    } else {
      bgMusic.pause();
      soundToggleImg.src = SOUND_OFF_SRC;
      soundToggleImg.alt = 'Sound off';
    }
  });
}

const openingFlap = document.querySelector('.opening-flap');
const letter = document.querySelector('.letter');
const envelopeContainer = document.querySelector('.envelope-container');
const scrollHint = document.querySelector('.scroll-hint');
let letterWasVisible = false;

const MAIL_SECTIONS_COUNT = 5;
const ENVELOPE_SCROLL_START = () => MAIL_SECTIONS_COUNT * window.innerHeight;
const scrollSpacer = document.querySelector('.scroll-spacer');
const ENVELOPE_SCROLL_END = () => {
  const start = ENVELOPE_SCROLL_START();
  const spacerH = scrollSpacer ? scrollSpacer.offsetHeight : 3 * window.innerHeight;
  return start + spacerH;
};

window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const envelopeStart = ENVELOPE_SCROLL_START();
  const envelopeEnd = ENVELOPE_SCROLL_END();
  const mainContainer = document.getElementById('main-container');

  if (scrolled >= envelopeEnd) {
    mainContainer.style.opacity = '0';
    mainContainer.style.visibility = 'hidden';
    return;
  }

  if (scrolled < envelopeStart) {
    mainContainer.style.opacity = '1';
    mainContainer.style.visibility = 'hidden';
    scrollHint.classList.remove('hidden');
    letterWasVisible = false;
    openingFlap.classList.remove('open');
    letter.classList.remove('visible');
    return;
  }
  mainContainer.style.visibility = 'visible';

  const envelopeScrolled = scrolled - envelopeStart;
  const envelopeMaxScroll = Math.max(1, maxScroll - envelopeStart);
  const scrollPercentage = envelopeScrolled / envelopeMaxScroll;

  mainContainer.style.opacity = '1';

  if (envelopeScrolled > 80) {
      scrollHint.classList.add('hidden');
  } else {
      scrollHint.classList.remove('hidden');
  }

  if (scrollPercentage <= 0.4) {
      const moveDown = scrollPercentage * 100;
      envelopeContainer.style.transform = `translateY(${moveDown}vh)`;
      openingFlap.classList.remove('open');
      letter.classList.remove('visible');
      letterWasVisible = false;
  } else if (scrollPercentage <= 0.65) {
      envelopeContainer.style.transform = 'translateY(40vh)';
      openingFlap.classList.add('open');
      letter.classList.remove('visible');
      letterWasVisible = false;
  } else {
      envelopeContainer.style.transform = 'translateY(40vh)';
      openingFlap.classList.add('open');
      letter.classList.add('visible');
      if (!letterWasVisible) {
          letterWasVisible = true;
          playOnce(envelopeSound);
      }
  }
});

window.addEventListener('load', () => {
  window.dispatchEvent(new Event('scroll'));
});

function handleAnswer(checkbox) {
  const checkboxes = document.querySelectorAll('input[name="answer"]');
  checkboxes.forEach(cb => {
      if (cb !== checkbox) {
          cb.checked = false;
      }
  });

  if (checkbox.checked) {
      if (checkbox.id === 'yes') {
          playOnce(yesSound);
          createConfettiExplosion();
          const signSection = document.getElementById('sign-section');
          if (signSection) signSection.classList.remove('sign-section--hidden');
      } else {
          playOnce(noSound);
      }
  }
}

(function() {
  const canvas = document.getElementById('sign-canvas');
  const clearBtn = document.getElementById('sign-clear');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  function startDraw(e) {
    e.preventDefault();
    isDrawing = true;
    const p = getPos(e);
    lastX = p.x;
    lastY = p.y;
  }

  function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const p = getPos(e);
    ctx.strokeStyle = '#2c2419';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    lastX = p.x;
    lastY = p.y;
  }

  function endDraw(e) {
    e.preventDefault();
    isDrawing = false;
  }

  canvas.addEventListener('pointerdown', startDraw);
  canvas.addEventListener('pointermove', draw);
  canvas.addEventListener('pointerup', endDraw);
  canvas.addEventListener('pointerleave', endDraw);
  canvas.addEventListener('touchstart', startDraw, { passive: false });
  canvas.addEventListener('touchmove', draw, { passive: false });
  canvas.addEventListener('touchend', endDraw, { passive: false });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  }

  const saveBtn = document.getElementById('sign-save');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.download = 'valentine-signature.png';
      a.href = dataUrl;
      a.click();
    });
  }
})();