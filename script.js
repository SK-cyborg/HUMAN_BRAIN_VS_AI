document.addEventListener("DOMContentLoaded", () => {
  // --- Mobile Hamburger Menu ---
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navLinks.classList.toggle("active");
    });
    document.querySelectorAll(".nav-links a").forEach(link => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
      });
    });
  }

  // --- Sticky Navbar Scroll Effect ---
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll(".reveal, .glass-card, .stat-card, .split-side, .timeline-item");
  const checkReveal = () => {
    const triggerBottom = window.innerHeight * 0.85;
    revealElements.forEach(el => {
      const elTop = el.getBoundingClientRect().top;
      if (elTop < triggerBottom) {
        el.classList.add("active");
      }
    });
  };
  window.addEventListener("scroll", checkReveal);
  checkReveal();

  // --- Floating Glowing Particles Canvas ---
  const canvas = document.getElementById("particles-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let particlesArray = [];
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.6 - 0.3;
        this.speedY = Math.random() * 0.6 - 0.3;
        this.color = Math.random() > 0.5 ? "rgba(139, 92, 246, 0.5)" : "rgba(0, 229, 255, 0.5)";
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      particlesArray = [];
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 15000);
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    };
    initParticles();
    window.addEventListener("resize", initParticles);

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesArray.forEach(particle => {
        particle.update();
        particle.draw();
      });
      requestAnimationFrame(animateParticles);
    };
    animateParticles();
  }

  // --- Back to Top Button ---
  const backToTopBtn = document.getElementById("back-to-top");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ==========================================
  // PENGUIN AI ENGINE
  // ==========================================
  const penguinBtn = document.getElementById("penguin-btn");
  const penguinChatWindow = document.getElementById("penguin-chat-window");
  const penguinClose = document.getElementById("penguin-close");
  const chatForm = document.getElementById("penguin-chat-form");
  const chatInput = document.getElementById("penguin-input");
  const chatMessages = document.getElementById("penguin-chat-messages");

  if (penguinBtn && penguinChatWindow) {

    // Your exact API key
    const GEMINI_API_KEY = "AQ.Ab8RN6LEgX-kdApg_5PxbxE84ukr3WWyXkm7gu8OEruKHbR5LA";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const SYSTEM_PROMPT = `You are Pingu AI 🐧, the interactive penguin mascot and resident assistant on an educational website called "Human Brain vs Artificial Intelligence".
    Keep every response under 3 sentences. Maintain your fun penguin persona (using Noot noot! occasionally) while giving accurate educational facts.`;

    // Toggle Chat Window
    penguinBtn.addEventListener("click", () => {
      penguinChatWindow.classList.toggle("hidden");
    });

    penguinClose.addEventListener("click", () => {
      penguinChatWindow.classList.add("hidden");
    });

    // Handle User Message
    chatForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const userText = chatInput.value.trim();
      if (!userText) return;

      appendMessage(userText, "user");
      chatInput.value = "";

      const typingId = appendTypingIndicator();

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: [{ role: "user", parts: [{ text: userText }] }]
          })
        });

        const data = await response.json();
        removeTypingIndicator(typingId);

        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
          appendMessage(data.candidates[0].content.parts[0].text, "bot");
        } else {
          appendMessage("Noot noot! 🐧 I ran into an error processing your query.", "bot");
        }
      } catch (error) {
        removeTypingIndicator(typingId);
        appendMessage("Noot noot! 🐧 I couldn't reach Google AI. Check your internet connection!", "bot");
      }
    });

    function appendMessage(text, sender) {
      const msgDiv = document.createElement("div");
      msgDiv.classList.add("chat-msg", sender);
      msgDiv.innerHTML = `<span>${text}</span>`;
      chatMessages.appendChild(msgDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function appendTypingIndicator() {
      const typingDiv = document.createElement("div");
      const id = "typing-" + Date.now();
      typingDiv.id = id;
      typingDiv.classList.add("chat-msg", "bot");
      typingDiv.innerHTML = `<span>Pingu is thinking... 🐧⚡</span>`;
      chatMessages.appendChild(typingDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      return id;
    }

    function removeTypingIndicator(id) {
      const el = document.getElementById(id);
      if (el) el.remove();
    }
  }
});
