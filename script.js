const flap = document.getElementById('flap');
const letter = document.getElementById('letter');
const scrollSection = document.querySelector('.scroll-section');

const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const confettiCanvas = document.getElementById('confetti-canvas');
const myConfetti = confetti.create(confettiCanvas, { resize: true });

let noCount = 0;

// Scroll-driven flap and letter animation
window.addEventListener('scroll', () => {
  const rect = scrollSection.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  let progress = 1 - (rect.bottom / (windowHeight + rect.height));
  progress = Math.min(Math.max(progress, 0), 1);

  flap.style.transform = `rotateX(${-120 * progress}deg)`;
  const translateY = 60 - 80 * progress;
  const rotateX = -20 + 20 * progress;
  const scale = 0.9 + 0.1 * progress;
  letter.style.transform = `translate(-50%, ${translateY}px) rotateX(${rotateX}deg) scale(${scale})`;
  letter.style.opacity = progress;
});

// Yes button
yesBtn.addEventListener('click', () => {
  letter.querySelector('p').textContent = "Yay! Yes! Best day ever! 💖";
  const duration = 3*1000;
  const end = Date.now() + duration;
  (function frame() {
    myConfetti({particleCount:5, angle:60, spread:55, origin:{x:0}, colors:['#ff0000','#ff69b4','#ffffff']});
    myConfetti({particleCount:5, angle:120, spread:55, origin:{x:1}, colors:['#ff0000','#ff69b4','#ffffff']});
    if(Date.now() < end) requestAnimationFrame(frame);
  })();
});

// No button
noBtn.addEventListener('click', () => {
  noCount++;
  const messages = ["Are you sure? 🥺","Pretty please? 🍒","Don't break my heart! 💔"];
  if(noCount <= 3){
    letter.querySelector('p').textContent = messages[noCount-1];
    noBtn.classList.add('shake');
    setTimeout(()=>noBtn.classList.remove('shake'), 500);
  } else {
    letter.querySelector('p').textContent = "Maybe next year... 😢";
  }
});
