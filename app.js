const state = {
  user: null,
  tab: "home",
  step: 1,
  product: null,
  script: null,
  editedScript: "",
  avatar: "nova",
  video: null,
  audio: null,
  history: [],
  ragDocs: [],
  fineTuneStatus: null,
  metrics: {
    scriptsApproved: 0,
    videosGenerated: 0,
    generationTimes: [],
  },
};

const authShell = document.getElementById("auth-shell");
const authForm = document.getElementById("auth-form");
const main = document.getElementById("main");
const tabButtons = document.querySelectorAll(".tab-button");
const views = document.querySelectorAll(".view");
const stepperSteps = document.querySelectorAll(".step");
const panels = document.querySelectorAll(".panel");
const productForm = document.getElementById("product-form");
const scriptLoading = document.getElementById("script-loading");
const scriptOutput = document.getElementById("script-output");
const approveScriptBtn = document.getElementById("approve-script");
const regenerateScriptBtn = document.getElementById("regenerate-script");
const backToInputBtn = document.getElementById("back-to-input");
const scriptEditor = document.getElementById("script-editor");
const editBackBtn = document.getElementById("edit-back");
const finalizeScriptBtn = document.getElementById("finalize-script");
const avatarGrid = document.getElementById("avatar-grid");
const generateVideoBtn = document.getElementById("generate-video");
const avatarBackBtn = document.getElementById("avatar-back");
const videoLoading = document.getElementById("video-loading");
const videoPreview = document.getElementById("video-preview");
const videoSubtitle = document.getElementById("video-subtitle");
const videoAudio = document.getElementById("video-audio");
const previewBackBtn = document.getElementById("preview-back");
const downloadBtn = document.getElementById("download-video");
const shareBtn = document.getElementById("share-video");
const historyList = document.getElementById("history-list");
const recentVideos = document.getElementById("recent-videos");
const userNameEl = document.getElementById("user-name");
const metricVideos = document.getElementById("metric-videos");
const metricScripts = document.getElementById("metric-scripts");
const metricTime = document.getElementById("metric-time");
const ragForm = document.getElementById("rag-form");
const ragList = document.getElementById("rag-list");
const fineTuneForm = document.getElementById("fine-tune-form");
const fineTuneStatus = document.getElementById("fine-tune-status");

const panelsByStep = new Map(
  Array.from(panels).map((panel) => [Number(panel.dataset.panel), panel])
);

function showMainUI() {
  authShell.hidden = true;
  main.hidden = false;
  document.body.style.background = "var(--bg)";
}

function completeAuth(user) {
  state.user = user;
  const prettyName = user.name.charAt(0).toUpperCase() + user.name.slice(1);
  userNameEl.textContent = prettyName;
  showMainUI();
}

authForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = authForm.querySelector("#email").value.trim();
  const company = authForm.querySelector("#company").value.trim();
  if (!email || !company) return;
  completeAuth({ email, company, name: email.split("@")[0] });
});

document.querySelectorAll(".oauth-group .btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const provider = btn.dataset.provider || "oauth";
    const name = provider.split(" ")[0];
    completeAuth({
      email: `${name}@${provider}.login`,
      company: `${name.charAt(0).toUpperCase() + name.slice(1)} OAuth`,
      name,
    });
  });
});

function setActiveTab(tab) {
  state.tab = tab;
  tabButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });
  views.forEach((view) => {
    view.hidden = view.id !== tab;
  });
}

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => setActiveTab(btn.dataset.tab));
});

document.querySelectorAll("[data-tab-target]").forEach((btn) => {
  btn.addEventListener("click", (event) => {
    const tab = event.currentTarget.dataset.tabTarget;
    setActiveTab(tab);
  });
});

function setStep(step) {
  state.step = step;
  stepperSteps.forEach((el) => {
    const current = Number(el.dataset.step);
    el.classList.toggle("active", current <= step);
  });
  panelsByStep.forEach((panel, index) => {
    panel.hidden = index !== step;
  });
}

function simulateLLMScript(product, ragDocs) {
  const { productName, description, features, audience, tone } = product;
  const formattedFeatures = features
    .split("\n")
    .map((f) => f.trim())
    .filter(Boolean)
    .map((f) => `• ${f}`)
    .join("\n");
  const contextSummary = ragDocs.length
    ? `We've woven in insights from your ${ragDocs.length} brand guideline${ragDocs.length > 1 ? "s" : ""}.`
    : "";
  const toneAdjective = tone.charAt(0).toUpperCase() + tone.slice(1);
  const body = `Hey ${audience}, meet ${productName}! ${description} In under a minute, here's why it matters:`;
  return `${body}\n\n${formattedFeatures}\n\n${toneAdjective} and on-brand${contextSummary ? `. ${contextSummary}` : "."}\nCall to action: Try ${productName} today.`;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateScript(product) {
  scriptOutput.textContent = "";
  scriptLoading.hidden = false;
  approveScriptBtn.disabled = true;
  regenerateScriptBtn.disabled = true;
  await wait(1400 + Math.random() * 1200);
  const script = simulateLLMScript(product, state.ragDocs);
  state.script = script;
  scriptOutput.textContent = script;
  scriptLoading.hidden = true;
  approveScriptBtn.disabled = false;
  regenerateScriptBtn.disabled = false;
}

productForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(productForm);
  state.product = {
    productName: data.get("productName").trim(),
    description: data.get("description").trim(),
    features: data.get("features").trim(),
    audience: data.get("audience").trim(),
    tone: data.get("tone"),
  };
  setStep(2);
  await generateScript(state.product);
});

approveScriptBtn.addEventListener("click", () => {
  if (!state.script) return;
  scriptEditor.value = state.script;
  state.editedScript = state.script;
  state.metrics.scriptsApproved += 1;
  updateMetrics();
  setStep(3);
});

regenerateScriptBtn.addEventListener("click", async () => {
  if (!state.product) return;
  await generateScript(state.product);
});

backToInputBtn.addEventListener("click", () => {
  setStep(1);
});

scriptEditor.addEventListener("input", (event) => {
  state.editedScript = event.target.value;
});

editBackBtn.addEventListener("click", () => {
  setStep(2);
});

finalizeScriptBtn.addEventListener("click", () => {
  if (!state.editedScript.trim()) return;
  setStep(4);
});

avatarGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".avatar-card");
  if (!card) return;
  state.avatar = card.dataset.avatar;
  avatarGrid.querySelectorAll(".avatar-card").forEach((btn) => btn.classList.remove("selected"));
  card.classList.add("selected");
});

avatarBackBtn.addEventListener("click", () => {
  setStep(3);
});

async function generateVideo() {
  if (!state.editedScript) return;
  videoLoading.hidden = false;
  generateVideoBtn.disabled = true;
  const start = performance.now();
  await wait(1800 + Math.random() * 1600);
  const end = performance.now();
  const duration = Math.max(20, Math.round(state.editedScript.split(" ").length / 3));
  state.video = {
    subtitle: summarizeScript(state.editedScript),
    avatar: state.avatar,
    duration,
    generatedAt: new Date(),
  };
  state.audio = "coffee.mp3";
  state.metrics.videosGenerated += 1;
  state.metrics.generationTimes.push((end - start) / 1000);
  updateMetrics();
  addToHistory();
  renderVideoPreview();
  videoLoading.hidden = true;
  generateVideoBtn.disabled = false;
  setStep(5);
}

generateVideoBtn.addEventListener("click", generateVideo);

function summarizeScript(script) {
  const sentences = script.split(/(?<=[.!?])/).map((s) => s.trim()).filter(Boolean);
  return sentences.slice(0, 2).join(" ");
}

function renderVideoPreview() {
  if (!state.video) return;
  videoSubtitle.textContent = state.video.subtitle;
  if (state.audio) {
    videoAudio.src = state.audio;
    videoAudio.hidden = false;
  }
}

previewBackBtn.addEventListener("click", () => {
  setStep(4);
});

downloadBtn.addEventListener("click", () => {
  if (!state.video) return;
  const blob = new Blob([state.editedScript], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${state.product.productName}-script.txt`;
  link.click();
  URL.revokeObjectURL(url);
});

shareBtn.addEventListener("click", async () => {
  if (!state.video) return;
  const shareData = {
    title: `${state.product.productName} Promo Video`,
    text: state.video.subtitle,
  };
  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (error) {
      console.warn("Share cancelled", error);
    }
  } else {
    alert("Sharing is supported on mobile devices. Copy the script to share manually.");
  }
});

function addToHistory() {
  if (!state.video) return;
  const item = {
    id: crypto.randomUUID(),
    productName: state.product.productName,
    avatar: state.avatar,
    subtitle: state.video.subtitle,
    script: state.editedScript,
    generatedAt: state.video.generatedAt,
    duration: state.video.duration,
  };
  state.history.unshift(item);
  renderHistory();
  renderRecent();
}

function renderHistory() {
  historyList.innerHTML = "";
  if (!state.history.length) {
    historyList.classList.add("empty");
    historyList.innerHTML = "<li>No videos yet. They will appear here after generation.</li>";
    return;
  }
  historyList.classList.remove("empty");
  state.history.forEach((entry) => {
    const li = document.createElement("li");
    const left = document.createElement("div");
    left.innerHTML = `<span>${entry.productName}</span><small>${entry.generatedAt.toLocaleString()}</small>`;
    const right = document.createElement("button");
    right.className = "btn secondary";
    right.textContent = "View script";
    right.addEventListener("click", () => {
      alert(`${entry.productName} Script:\n\n${entry.script}`);
    });
    li.append(left, right);
    historyList.appendChild(li);
  });
}

function renderRecent() {
  recentVideos.innerHTML = "";
  if (!state.history.length) {
    recentVideos.classList.add("empty");
    recentVideos.innerHTML = "<li>No videos yet. Start by creating one!</li>";
    return;
  }
  recentVideos.classList.remove("empty");
  state.history.slice(0, 3).forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = `${entry.productName} · ${entry.duration}s · ${entry.generatedAt.toLocaleDateString()}`;
    recentVideos.appendChild(li);
  });
}

function updateMetrics() {
  metricVideos.textContent = state.metrics.videosGenerated;
  metricScripts.textContent = state.metrics.scriptsApproved;
  if (state.metrics.generationTimes.length) {
    const avg =
      state.metrics.generationTimes.reduce((sum, value) => sum + value, 0) /
      state.metrics.generationTimes.length;
    metricTime.textContent = `${avg.toFixed(1)} s`;
  } else {
    metricTime.textContent = "—";
  }
}

ragForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const files = Array.from(document.getElementById("rag-upload").files || []);
  if (!files.length) return;
  files.forEach((file) => {
    state.ragDocs.push({ name: file.name, size: file.size });
  });
  renderRagList();
  ragForm.reset();
});

function renderRagList() {
  ragList.innerHTML = "";
  if (!state.ragDocs.length) {
    ragList.classList.add("empty");
    ragList.innerHTML = "<li>No guidelines uploaded yet.</li>";
    return;
  }
  ragList.classList.remove("empty");
  state.ragDocs.forEach((doc) => {
    const li = document.createElement("li");
    li.textContent = `${doc.name} (${Math.round(doc.size / 1024)} KB)`;
    ragList.appendChild(li);
  });
}

fineTuneForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const file = document.getElementById("fine-tune-upload").files[0];
  if (!file) return;
  state.fineTuneStatus = {
    fileName: file.name,
    submittedAt: new Date(),
  };
  fineTuneStatus.textContent = `Dataset \"${file.name}\" submitted • processing`;
  fineTuneStatus.classList.remove("muted");
  fineTuneStatus.classList.add("success");
  fineTuneForm.reset();
});

setActiveTab("home");
setStep(1);
updateMetrics();
renderHistory();
renderRecent();
renderRagList();
