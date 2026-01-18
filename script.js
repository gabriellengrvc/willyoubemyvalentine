const wrapper = document.getElementById("wrapper");
const envelopeSound = document.getElementById("envelopeSound");
const yesSound = document.getElementById("yesSound");
const noSound = document.getElementById("noSound");

const yesBox = document.getElementById("yesBox");
const noBox = document.getElementById("noBox");

function playOnce(audio) {
  if (!audio) return;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

wrapper.addEventListener("mouseenter", () => {
  envelopeSound.currentTime = 0;
  envelopeSound.volume = 1;
  envelopeSound.play().catch(() => {});
});

wrapper.addEventListener("mouseleave", () => {
  envelopeSound.pause();
  envelopeSound.currentTime = 0;
});

yesBox.addEventListener("change", () => {
  if (yesBox.checked) {
    noBox.checked = false; 
    playOnce(yesSound);
  }
});

noBox.addEventListener("change", () => {
  if (noBox.checked) {
    yesBox.checked = false; 
    playOnce(noSound);
  }
});

window.addEventListener(
  "pointerdown",
  () => {
    [envelopeSound, yesSound, noSound].forEach((a) => {
      a.play().then(() => a.pause()).catch(() => {});
    });
  },
  { once: true }
);
