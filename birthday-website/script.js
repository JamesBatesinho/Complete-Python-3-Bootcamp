const planMessages = {
  odyssey: "Odyssey & IMAX it is! 🎬 Big screen, popcorn, then MetroCentre shopping spree 🛍️. Let's go!",
  alnmouth: "Alnmouth it is! 🏖️ Fresh air, coastal views, and a proper nature hike 🥾. Can't wait!",
  jesmond: "Jesmond Dene it is! 🌳 A gorgeous stroll through the dene, then a well-earned lunch in Jesmond 🍽️.",
  filmtown: "Film & city lunch it is! 🎥 Cosy cinema time, then lunch in Newcastle city centre 🍕.",
  baltic: "Baltic Gallery & Quayside it is! 🎨 Art, views, and a lovely wander by the river 🚶‍♀️."
};

const form = document.getElementById("birthday-form");
const result = document.getElementById("result");
const resultText = document.getElementById("result-text");
const resetBtn = document.getElementById("reset-btn");

const STORAGE_KEY = "birthdayPlanChoice";

function showResult(plan) {
  resultText.textContent = planMessages[plan] || "Great choice! Can't wait to celebrate with you 🎉";
  form.classList.add("hidden");
  result.classList.remove("hidden");
  burstConfetti();
}

function restoreSavedChoice() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && planMessages[saved]) {
    const input = form.querySelector(`input[value="${saved}"]`);
    if (input) input.checked = true;
    showResult(saved);
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const selected = form.querySelector('input[name="plan"]:checked');
  if (!selected) {
    form.classList.add("shake");
    setTimeout(() => form.classList.remove("shake"), 400);
    return;
  }
  localStorage.setItem(STORAGE_KEY, selected.value);
  showResult(selected.value);
});

resetBtn.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  result.classList.add("hidden");
  form.classList.remove("hidden");
});

restoreSavedChoice();

/* Confetti burst */
const canvas = document.getElementById("confetti-canvas");
const ctx = canvas.getContext("2d");
let confettiPieces = [];
let animationFrame = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const confettiColors = ["#ffd166", "#f472b6", "#c084fc", "#8b2fd6", "#fdf4ff"];

function burstConfetti() {
  const count = 140;
  confettiPieces = [];
  for (let i = 0; i < count; i++) {
    confettiPieces.push({
      x: canvas.width / 2,
      y: canvas.height / 3,
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * -10 - 4,
      size: Math.random() * 8 + 4,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      gravity: 0.35,
      life: 0,
      maxLife: 130 + Math.random() * 40
    });
  }
  if (!animationFrame) {
    animateConfetti();
  }
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let alive = false;

  for (const p of confettiPieces) {
    if (p.life >= p.maxLife) continue;
    alive = true;
    p.vy += p.gravity * 0.2;
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.rotSpeed;
    p.life++;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = Math.max(0, 1 - p.life / p.maxLife);
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    ctx.restore();
  }

  if (alive) {
    animationFrame = requestAnimationFrame(animateConfetti);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animationFrame = null;
  }
}
