const slides = [
  ["01", "orbit", "#67f5d5", "#157a6e"],
  ["01.1", "loop", "#7ef1c9", "#176d53"],
  ["02", "devices", "#78dcff", "#18607b"],
  ["02.1", "dashboard", "#7cf8d4", "#126b5d"],
  ["02.1.1", "browser", "#7cf8d4", "#126b5d"],
  ["02.1.2", "phones", "#a5ff72", "#477b22"],
  ["02.1.3", "timeline", "#ffd76a", "#936d16"],
  ["02.2", "dashboard", "#ff9bc2", "#8b3158"],
  ["02.2.1", "cards", "#84d5ff", "#285a95"],
  ["02.2.2", "chart", "#70f0c8", "#1c795f"],
  ["02.2.3", "timeline", "#ff9bc2", "#8b3158"],
  ["03", "stack", "#8abfff", "#285a95"],
  ["03.1", "coin", "#ffd76a", "#936d16"],
  ["03.2", "chart", "#70f0c8", "#1c795f"],
  ["03.3", "cards", "#ff9bc2", "#8b3158"],
  ["04", "shield", "#80ddff", "#175f7c"],
  ["04.1", "split", "#c6ff71", "#5b8120"],
  ["05", "finale", "#70f5d2", "#13715f"],
].map(([number, scene, accent, glow], index) => ({ number, scene, accent, glow, index }));

const stage = document.querySelector("#stage");
const deck = document.querySelector("#deck");
const progress = document.querySelector("#progress");
const currentNumber = document.querySelector("#currentNumber");
const wheelNodes = document.querySelector("#wheelNodes");
const ticks = document.querySelector("#ticks");
const tour = document.querySelector("#tour");
let active = Math.max(0, slides.findIndex(({ number }) => `#${number}` === location.hash));
let timer = null;
let locked = false;

const bars = (count = 18) => `<div class="bars">${Array.from({ length: count }, (_, i) => `<i style="--h:${26 + ((i * 31) % 70)}%"></i>`).join("")}</div>`;
const dots = (count = 24) => `<div class="dots">${"<i></i>".repeat(count)}</div>`;
const blankLines = (count = 4) => `<div class="blank-lines">${"<i></i>".repeat(count)}</div>`;

function scene(type, number) {
  const common = `<div class="number-copy"><span>${number}</span><i></i>${blankLines(3)}</div>`;
  if (type === "orbit") return `${common}<div class="orbit"><i></i><i></i><i></i><b></b><span></span><span></span><span></span></div>`;
  if (type === "loop") return `${common}<div class="loop">${[1,2,3,4].map(n => `<article><b>0${n}</b><i></i>${blankLines(2)}</article>`).join("")}<span></span></div>`;
  if (type === "devices") return `${common}<div class="devices"><article class="desktop"><header><i></i><i></i><i></i></header>${bars(12)}</article><article class="mobile">${dots(8)}</article><article class="server">${blankLines(6)}</article></div>`;
  if (type === "browser") return `${common}<div class="browser"><header><i></i><i></i><i></i></header><aside>${dots(5)}</aside><section>${bars(20)}<div class="tiles">${"<i></i>".repeat(6)}</div></section></div>`;
  if (type === "phones") return `${common}<div class="phones"><article><b></b>${dots(9)}</article><article><b></b>${bars(12)}</article></div>`;
  if (type === "timeline") return `${common}<div class="console"><header></header><section class="metrics">${[1,2,3].map(n => `<article><small>0${n}</small><b></b><i></i></article>`).join("")}</section><ol>${[1,2,3].map(n => `<li><span>0${n}</span><i></i><b></b></li>`).join("")}</ol></div>`;
  if (type === "dashboard") return `${common}<div class="dashboard"><section class="metrics">${[1,2,3].map(n => `<article><small>0${n}</small><b></b><i></i></article>`).join("")}</section>${bars(24)}${dots(12)}</div>`;
  if (type === "cards") return `${common}<div class="cards">${[1,2,3,4].map(n => `<article><span>0${n}</span><b></b>${blankLines(3)}</article>`).join("")}</div>`;
  if (type === "chart") return `${common}<div class="market"><header><span>${number}</span></header><strong>${number.replaceAll(".", "")}</strong>${bars(28)}<section>${"<i></i>".repeat(4)}</section></div>`;
  if (type === "stack") return `${common}<div class="stack">${[1,2,3,4].map(n => `<article><span>0${n}</span><b></b><i></i></article>`).join("")}<em></em></div>`;
  if (type === "coin") return `${common}<div class="coin"><i></i><i></i><strong>${number}</strong><span></span><b></b></div>`;
  if (type === "shield") return `${common}<div class="shield"><i></i><span></span>${dots(20)}</div>`;
  if (type === "split") return `${common}<div class="split"><section><span>01</span>${blankLines(6)}</section><section><span>02</span>${blankLines(6)}</section></div>`;
  return `${common}<div class="finale"><i></i><b>${number}</b><span></span><span></span></div>`;
}

function render(direction = 1) {
  const slide = slides[active];
  deck.style.setProperty("--accent", slide.accent);
  deck.style.setProperty("--glow", slide.glow);
  progress.style.width = `${((active + 1) / slides.length) * 100}%`;
  currentNumber.textContent = slide.number;
  stage.innerHTML = `<section class="slide ${direction < 0 ? "reverse" : ""}" style="--n:${active}">${scene(slide.scene, slide.number)}</section>`;
  [...wheelNodes.children].forEach((node, index) => node.classList.toggle("active", index === active));
  [...ticks.children].forEach((tick, index) => tick.classList.toggle("active", index === active));
  location.hash = slide.number;
}

function go(next, direction = 1) {
  if (locked || next === active) return;
  locked = true;
  active = (next + slides.length) % slides.length;
  render(direction);
  setTimeout(() => { locked = false; }, 620);
}

slides.forEach((slide, index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = slide.number;
  button.style.setProperty("--i", index);
  button.setAttribute("aria-label", slide.number);
  button.addEventListener("click", () => go(index, index > active ? 1 : -1));
  wheelNodes.append(button);
  const tick = document.createElement("button");
  tick.type = "button";
  tick.setAttribute("aria-label", slide.number);
  tick.addEventListener("click", () => go(index, index > active ? 1 : -1));
  ticks.append(tick);
});

document.querySelector("#previous").addEventListener("click", () => go(active - 1, -1));
document.querySelector("#next").addEventListener("click", () => go(active + 1, 1));
tour.addEventListener("click", () => {
  if (timer) { clearInterval(timer); timer = null; tour.classList.remove("active"); return; }
  tour.classList.add("active");
  timer = setInterval(() => go(active + 1, 1), 3200);
});
addEventListener("keydown", event => {
  if (["ArrowRight", "ArrowDown", "PageDown"].includes(event.key)) go(active + 1, 1);
  if (["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key)) go(active - 1, -1);
  if (event.key === "Home") go(0, -1);
  if (event.key === "End") go(slides.length - 1, 1);
  if (event.key === " ") tour.click();
});
let wheelCooldown = false;
addEventListener("wheel", event => {
  if (wheelCooldown || Math.abs(event.deltaY) < 20) return;
  wheelCooldown = true;
  go(active + (event.deltaY > 0 ? 1 : -1), event.deltaY > 0 ? 1 : -1);
  setTimeout(() => { wheelCooldown = false; }, 700);
}, { passive: true });

render();
