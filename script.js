
    const defaultConfig = {
      her_name: "Maria Eduarda",
      discord_link: "https://discord.gg/j5FVDEz2",
      meeting_date: "25/11/2025",
      meeting_time: "19:02",
      background_color: "#0a0a0a",
      accent_color: "#8b0000",
      text_color: "#e8d5d5",
      secondary_surface: "#1a0510",
      button_color: "#4a0000",
      font_family: "Playfair Display",
      font_size: 16
    };

    let currentConfig = { ...defaultConfig };
    let noClickCount = 0;
    const noButtonPositions = [
      { top: '20%', left: '20%' },
      { top: '60%', right: '15%' },
      { top: '40%', left: '70%' }
    ];

    // Typewriter effect
    const texts = [
      `Nos conhecemos naquela noite — ${currentConfig.meeting_date} às ${currentConfig.meeting_time}.`,
      "",
      "Você entrou no meu mundo. Logo que escutei aquela voz, meu coração acelerou.",
      "",
      "Desde então… você não saiu mais dos meus pensamentos."
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeWriter() {
      const typewriterElement = document.getElementById('typewriter');
      
      if (textIndex < texts.length) {
        const currentText = texts[textIndex];
        
        if (!isDeleting && charIndex <= currentText.length) {
          typewriterElement.innerHTML = texts.slice(0, textIndex).join('<br><br>') + 
            (textIndex > 0 ? '<br><br>' : '') + 
            currentText.substring(0, charIndex);
          charIndex++;
          setTimeout(typeWriter, 50);
        } else if (charIndex === currentText.length + 1) {
          textIndex++;
          charIndex = 0;
          setTimeout(typeWriter, 1000);
        }
      }
    }

    // Create stars
    function createStars() {
      const container = document.getElementById('starsContainer');
      for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        container.appendChild(star);
      }
    }

    // Create floating hearts
    function createFloatingHearts() {
      const container = document.getElementById('floatingHeartsContainer');
      setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = '❤️';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 2 + 's';
        heart.style.fontSize = (Math.random() * 1.5 + 1) + 'em';
        container.appendChild(heart);
        
        setTimeout(() => heart.remove(), 8000);
      }, 1000);
    }

    // Navigation
    function goToPage(pageNum) {
      document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
      });
      
      const targetPage = document.getElementById(`page${pageNum}`);
      targetPage.classList.add('active');
      
      if (pageNum === 3) {
        createFloatingHearts();
      }
    }

    // Handle No button
    function handleNo() {
      noClickCount++;
      const noButton = document.getElementById('noButton');
      
      if (noClickCount < 3) {
        const position = noButtonPositions[noClickCount - 1];
        noButton.style.top = position.top || 'auto';
        noButton.style.bottom = position.bottom || 'auto';
        noButton.style.left = position.left || 'auto';
        noButton.style.right = position.right || 'auto';
      } else {
        noButton.style.display = 'none';
        const yesButton = document.getElementById('yesButton');
        yesButton.style.position = 'relative';
        yesButton.style.fontSize = '2.5em';
        yesButton.style.padding = '25px 80px';
      }
    }

    // Handle Yes button
    async function handleYes() {
      const now = new Date();
      const dateStr = now.toLocaleDateString('pt-BR');
      const timeStr = now.toLocaleTimeString('pt-BR');
      
      createHeartExplosion(event);
      
      const result = await window.dataSdk.create({
        response_date: dateStr,
        response_time: timeStr,
        answer: "SIM"
      });
      
      if (result.isOk) {
        setTimeout(() => {
          const responseInfo = document.getElementById('responseInfo');
          responseInfo.innerHTML = `
            <p>Ela disse SIM! 💕</p>
            <p>Data: ${dateStr} às ${timeStr}</p>
            <p style="margin-top: 15px;">Redirecionando para o Discord...</p>
          `;
          responseInfo.classList.add('show');
          
          setTimeout(() => {
            window.open(currentConfig.discord_link, '_blank', 'noopener,noreferrer');
          }, 2000);
        }, 1000);
      }
    }

    // Heart explosion effect
    function createHeartExplosion(event) {
      const container = document.createElement('div');
      container.className = 'heart-explosion';
      container.style.left = event.clientX + 'px';
      container.style.top = event.clientY + 'px';
      document.body.appendChild(container);
      
      for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.className = 'exploding-heart';
        heart.textContent = '❤️';
        
        const angle = (Math.PI * 2 * i) / 20;
        const distance = 150;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        heart.style.setProperty('--tx', tx + 'px');
        heart.style.setProperty('--ty', ty + 'px');
        
        container.appendChild(heart);
      }
      
      setTimeout(() => container.remove(), 1500);
    }

    // Audio control
    const audioControl = document.getElementById('audioControl');
    const bgMusic = document.getElementById('bgMusic');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeLabel = document.getElementById('volumeLabel');
    let audioPlaying = true;

    // Start music automatically with low volume
    bgMusic.volume = 0.1; // 20% volume
    bgMusic.play().catch(() => {
      // If autoplay is blocked, user will need to click the button
      audioPlaying = false;
      audioControl.textContent = '🔊 Música';
    });

    audioControl.addEventListener('click', () => {
      if (audioPlaying) {
        bgMusic.pause();
        audioControl.textContent = '🔇 Música';
        audioPlaying = false;
      } else {
        bgMusic.play();
        audioControl.textContent = '🔊 Música';
        audioPlaying = true;
      }
    });

    // Data SDK implementation
    const dataHandler = {
      onDataChanged(data) {
        // Data is only displayed after user clicks YES
      }
    };

    // Element SDK implementation
    async function onConfigChange(config) {
      currentConfig = config;
      
      // Update all name references
      const nameElements = document.querySelectorAll('.name-highlight, #nameHighlight, #proposalName');
      nameElements.forEach(el => {
        el.textContent = config.her_name || defaultConfig.her_name;
      });
      
      // Update colors
      document.documentElement.style.setProperty('--background-color', config.background_color || defaultConfig.background_color);
      document.documentElement.style.setProperty('--accent-color', config.accent_color || defaultConfig.accent_color);
      document.documentElement.style.setProperty('--text-color', config.text_color || defaultConfig.text_color);
      
      const bodyEl = document.body;
      bodyEl.style.background = config.background_color || defaultConfig.background_color;
      bodyEl.style.color = config.text_color || defaultConfig.text_color;
      
      // Update font
      const fontFamily = config.font_family || defaultConfig.font_family;
      document.querySelectorAll('.title, .impact-title, .proposal-text, .nav-button, .answer-button, .signature, .audio-control').forEach(el => {
        el.style.fontFamily = `${fontFamily}, serif`;
      });
      
      // Update font sizes
      const baseSize = config.font_size || defaultConfig.font_size;
      document.querySelector('.title').style.fontSize = `${baseSize * 2.2}px`;
      document.querySelector('.typewriter').style.fontSize = `${baseSize * 1.125}px`;
      document.querySelector('.impact-title').style.fontSize = `${baseSize * 1.875}px`;
      document.querySelectorAll('.intense-text').forEach(el => {
        el.style.fontSize = `${baseSize * 0.9375}px`;
      });
      document.querySelector('.proposal-text').style.fontSize = `${baseSize * 1.5625}px`;
      document.querySelectorAll('.answer-button').forEach(el => {
        el.style.fontSize = `${baseSize * 1.125}px`;
      });
    }

    function mapToCapabilities(config) {
      return {
        recolorables: [
          {
            get: () => config.background_color || defaultConfig.background_color,
            set: (value) => {
              config.background_color = value;
              window.elementSdk.setConfig({ background_color: value });
            }
          },
          {
            get: () => config.secondary_surface || defaultConfig.secondary_surface,
            set: (value) => {
              config.secondary_surface = value;
              window.elementSdk.setConfig({ secondary_surface: value });
            }
          },
          {
            get: () => config.text_color || defaultConfig.text_color,
            set: (value) => {
              config.text_color = value;
              window.elementSdk.setConfig({ text_color: value });
            }
          },
          {
            get: () => config.accent_color || defaultConfig.accent_color,
            set: (value) => {
              config.accent_color = value;
              window.elementSdk.setConfig({ accent_color: value });
            }
          },
          {
            get: () => config.button_color || defaultConfig.button_color,
            set: (value) => {
              config.button_color = value;
              window.elementSdk.setConfig({ button_color: value });
            }
          }
        ],
        borderables: [],
        fontEditable: {
          get: () => config.font_family || defaultConfig.font_family,
          set: (value) => {
            config.font_family = value;
            window.elementSdk.setConfig({ font_family: value });
          }
        },
        fontSizeable: {
          get: () => config.font_size || defaultConfig.font_size,
          set: (value) => {
            config.font_size = value;
            window.elementSdk.setConfig({ font_size: value });
          }
        }
      };
    }

    function mapToEditPanelValues(config) {
      return new Map([
        ["her_name", config.her_name || defaultConfig.her_name],
        ["discord_link", config.discord_link || defaultConfig.discord_link],
        ["meeting_date", config.meeting_date || defaultConfig.meeting_date],
        ["meeting_time", config.meeting_time || defaultConfig.meeting_time]
      ]);
    }

    // Initialize
    async function init() {
      if (window.elementSdk) {
        window.elementSdk.init({
          defaultConfig,
          onConfigChange,
          mapToCapabilities,
          mapToEditPanelValues
        });
      }
      
      if (window.dataSdk) {
        await window.dataSdk.init(dataHandler);
      }
      
      createStars();
      setTimeout(typeWriter, 500);
    }

    init();

(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9aa2a97d535a8aef',t:'MTc2NTA5NjIzNy4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();