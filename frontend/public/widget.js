(function () {
  // ================= BUTTON =================
  const chatBtn = document.createElement("button");
  chatBtn.innerText = "💬";
  
  Object.assign(chatBtn.style, {
    position: "fixed",
    bottom: "20px",
    right: "2vw",
    zIndex: "9999",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    border: "none",
    background: "linear-gradient(135deg, #4f9cff, #6a5cff)",
    color: "#fff",
    fontSize: "24px",
    cursor: "pointer",
    boxShadow: "0 8px 25px rgba(79,156,255,0.4)",
    transition: "all 0.3s ease",
    animation: "pulse 2s infinite"
  });

  // Hover animation
  chatBtn.onmouseenter = () => {
    chatBtn.style.transform = "scale(1.1) rotate(5deg)";
    chatBtn.style.boxShadow = "0 12px 30px rgba(79,156,255,0.6)";
  };

  chatBtn.onmouseleave = () => {
    chatBtn.style.transform = "scale(1) rotate(0deg)";
    chatBtn.style.boxShadow = "0 8px 25px rgba(79,156,255,0.4)";
  };

  document.body.appendChild(chatBtn);

  // ================= BACKDROP =================
  const backdrop = document.createElement("div");
  Object.assign(backdrop.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.2)",
    backdropFilter: "blur(4px)",
    zIndex: "9998",
    opacity: "0",
    pointerEvents: "none",
    transition: "opacity 0.3s ease"
  });

  document.body.appendChild(backdrop);

  // ================= IFRAME =================
  const iframe = document.createElement("iframe");
  iframe.src = "https://hindustan-zone.vercel.app";

  Object.assign(iframe.style, {
    position: "fixed",
    bottom: "90px",
    right: "20px",
    width: "370px",
    height: "520px",
    border: "none",
    borderRadius: "16px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
    zIndex: "9999",

    // Animation initial state
    opacity: "0",
    transform: "translateY(40px) scale(0.95)",
    transition: "all 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
    display: "none"
  });

  document.body.appendChild(iframe);

  let isOpen = false;

  // ================= TOGGLE =================
  function openChat() {
    iframe.style.display = "block";

    setTimeout(() => {
      iframe.style.opacity = "1";
      iframe.style.transform = "translateY(0) scale(1)";
      backdrop.style.opacity = "1";
      backdrop.style.pointerEvents = "auto";
    }, 10);

    chatBtn.innerText = "✖";
    chatBtn.style.animation = "none";
    isOpen = true;
  }

  function closeChat() {
    iframe.style.opacity = "0";
    iframe.style.transform = "translateY(40px) scale(0.95)";
    backdrop.style.opacity = "0";
    backdrop.style.pointerEvents = "none";

    setTimeout(() => {
      iframe.style.display = "none";
    }, 300);

    chatBtn.innerText = "💬";
    chatBtn.style.animation = "pulse 2s infinite";
    isOpen = false;
  }

  chatBtn.onclick = () => (isOpen ? closeChat() : openChat());
  backdrop.onclick = closeChat;

  // ================= CSS ANIMATIONS =================
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.08); }
      100% { transform: scale(1); }
    }
  `;
  document.head.appendChild(style);
})();
