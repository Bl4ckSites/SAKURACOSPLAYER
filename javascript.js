document.addEventListener('DOMContentLoaded', function () {
    console.info('%c🔥 Código iniciado com sucesso! Criador: bl4ckSites', 'color: #ff3366; font-weight: bold;');

    // =====================================================================
    // SISTEMA DE SONS COM REDUNDÂNCIA AVANÇADA
    // =====================================================================
    const soundFormats = ['mp3', 'wav', 'ogg'];
    let clickSound = null;
    let audioContext = null;
    let clickBuffer = null;
    let audioLoaded = false;
    
    // Função para carregar áudio com múltiplas tentativas
    async function loadAudioWithFallbacks() {
        // Tentativa 1: Formatos sequenciais (MP3, WAV, OGG)
        for (const format of soundFormats) {
            try {
                const testSound = new Audio(`click.${format}`);
                testSound.volume = 0.3;
                
                // Esperar até que o áudio possa ser reproduzido
                await new Promise((resolve, reject) => {
                    testSound.oncanplaythrough = resolve;
                    testSound.onerror = reject;
                    testSound.load();
                });
                
                clickSound = testSound;
                audioLoaded = true;
                console.info(`🔊 Áudio carregado: click.${format}`);
                return;
            } catch (e) {
                console.warn(`❌ Formato ${format} falhou`, e);
            }
        }
        
        // Tentativa 2: Web Audio API
        if (window.AudioContext) {
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const response = await fetch('click.mp3');
                const data = await response.arrayBuffer();
                clickBuffer = await audioContext.decodeAudioData(data);
                audioLoaded = true;
                console.info('🎵 Web Audio API configurada');
            } catch (e) {
                console.error('❌ Web Audio falhou', e);
            }
        }
        
        // Tentativa 3: Áudio base64 (fallback final)
        if (!audioLoaded) {
            try {
                clickSound = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==');
                audioLoaded = true;
                console.warn('🔇 Usando áudio base64 de fallback');
            } catch (e) {
                console.error('❌ Fallback catastrófico de áudio falhou', e);
            }
        }
    }

    // Carregar o sistema de áudio
    loadAudioWithFallbacks();

    // =====================================================================
    // SISTEMA DE VIBRAÇÃO COM FALLBACK
    // =====================================================================
    const canVibrate = 'vibrate' in navigator;
    const vibrationPatterns = {
        click: [30, 20, 30],
        error: [100, 30, 100],
        success: [50, 100, 50]
    };

    function vibrate(type = 'click') {
        if (!canVibrate) return;
        
        const pattern = vibrationPatterns[type] || vibrationPatterns.click;
        
        try {
            navigator.vibrate(pattern);
        } catch (e) {
            try {
                navigator.vibrate(50);
            } catch (e2) {
                console.warn('⚠️ Falha na vibração');
            }
        }
    }

    // =====================================================================
    // ANIMAÇÕES DE CLIQUE
    // =====================================================================
    // Efeito Ripple
    function createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
        circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
        circle.classList.add('ripple');

        button.appendChild(circle);

        setTimeout(() => circle.remove(), 600);
    }

    // Animação de pulsação
    function pulseAnimation(element) {
        element.classList.add('pulse');
        setTimeout(() => element.classList.remove('pulse'), 300);
    }

    // =====================================================================
    // SISTEMA DE FEEDBACK TÁTIL
    // =====================================================================
    function playClickSound() {
        if (!audioLoaded) return;
        
        try {
            if (clickSound) {
                clickSound.currentTime = 0;
                clickSound.play().catch(e => {
                    console.warn('Fallback para Web Audio API');
                    playWebAudio();
                });
            } else {
                playWebAudio();
            }
        } catch (e) {
            console.warn('🔇 Falha ao reproduzir áudio');
        }
    }

    function playWebAudio() {
        if (!audioContext || !clickBuffer) return;
        
        try {
            const source = audioContext.createBufferSource();
            source.buffer = clickBuffer;
            source.connect(audioContext.destination);
            source.start(0);
        } catch (e) {
            console.warn('Falha no Web Audio:', e);
        }
    }

    // =====================================================================
    // FUNÇÕES EXISTENTES (ATUALIZADAS)
    // =====================================================================
    function typeWriter(element) {
        // Implementação mantida (caso exista)
        if (element) {
            const text = element.innerText;
            element.innerText = '';
            let i = 0;
            const speed = 100;
            
            function type() {
                if (i < text.length) {
                    element.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                }
            }
            type();
        }
    }

    function setupParallax() {
        // Implementação mantida (caso exista)
    }

    function setupProfileGlow() {
        try {
            const profilePic = document.querySelector('.profile-pic');
            if (!profilePic) return;
            
            const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff7700'];
            let currentIndex = 0;
            
            const intervalId = setInterval(() => {
                profilePic.style.boxShadow = `0 0 25px ${colors[currentIndex]}`;
                currentIndex = (currentIndex + 1) % colors.length;
            }, 1500);

            window.addEventListener('beforeunload', () => {
                clearInterval(intervalId);
            });
        } catch (err) {
            console.error('Erro no profile glow:', err);
            vibrate('error');
        }
    }

    // =====================================================================
    // SISTEMA DE BOTÕES - CORREÇÃO PRINCIPAL
    // =====================================================================
    function setupInteractiveElements() {
        try {
            const interactiveElements = [
                ...document.querySelectorAll('a'),
                ...document.querySelectorAll('button'),
                ...document.querySelectorAll('.pack-button')
            ];

            interactiveElements.forEach(el => {
                // Remover event listeners antigos para evitar duplicação
                const newEl = el.cloneNode(true);
                el.parentNode.replaceChild(newEl, el);
                
                // Adicionar novo event listener
                newEl.addEventListener('click', function(e) {
                    // 1. Efeito ripple
                    createRipple(e);
                    
                    // 2. Animação de pulsação
                    pulseAnimation(this);
                    
                    // 3. Vibração
                    vibrate('click');
                    
                    // 4. Som de clique
                    playClickSound();
                    
                    // Tratamento especial para links
                    if (this.tagName === 'A') {
                        e.preventDefault();
                        
                        // Adicionar efeito de loading
                        const originalContent = this.innerHTML;
                        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando...';
                        this.classList.add('loading');
                        
                        // Redirecionar após pequeno delay
                        setTimeout(() => {
                            window.location.href = this.href;
                        }, 500);
                    }
                });
            });

            console.info(`🎮 ${interactiveElements.length} elementos interativos ativados`);
            vibrate('success');
        } catch (err) {
            console.error('Erro na configuração dos elementos:', err);
            vibrate('error');
        }
    }

    // =====================================================================
    // PROTEÇÃO DE IMAGENS
    // =====================================================================
    function protectImages() {
        try {
            document.querySelectorAll('img').forEach(img => {
                img.style.pointerEvents = 'none';
                img.style.userSelect = 'none';
                img.style.webkitUserDrag = 'none';
                
                img.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    vibrate('error');
                    alert('❌ Protegido por Roger Bastos!');
                });
            });
        } catch (e) {
            console.error('Erro ao proteger imagens:', e);
        }
    }

    // =====================================================================
    // INICIALIZAÇÃO ROBUSTA
    // =====================================================================
    try {
        typeWriter(document.getElementById('dynamic-name'));
        setupParallax();
        setupProfileGlow();
        protectImages();
        setupInteractiveElements();
        
        console.info('%c✅ Tudo operacional! Botões funcionando perfeitamente!-byBL4CKSITES', 'color: green; font-weight: bold;');
        vibrate('success');
    } catch (globalErr) {
        console.error('💥 Erro inesperado:', globalErr);
        vibrate('error');
        
        setTimeout(() => {
            console.info('🔄 Tentando recuperação...');
            setupInteractiveElements();
        }, 1000);
    }

    // =====================================================================
    // DETECÇÃO DE NAVEGADOR
    // =====================================================================
    const isChrome = /Chrome/.test(navigator.userAgent);
    if (isChrome) {
        console.info('🚀 Executando otimizações para Chrome');
        document.documentElement.style.setProperty('--click-animation', 'pulse 0.4s');
    }
});

// =====================================================================
// ESTILOS DINÂMICOS PARA ANIMAÇÕES
// =====================================================================
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.7);
        transform: scale(0);
        animation: ripple 0.6s linear;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .pulse {
        animation: pulse 0.3s ease-in-out;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .loading {
        position: relative;
        pointer-events: none;
    }
    
    .loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin: -10px 0 0 -10px;
        border: 2px solid rgba(255,255,255,0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 0.8s linear infinite;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(dynamicStyles);

// =====================================================================
// BLOQUEIO DE EVENTOS
// =====================================================================
document.addEventListener('keydown', function(e) {
    if (
        (e.ctrlKey && ['s', 'u', 'c'].includes(e.key.toLowerCase())) ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i') ||
        (e.keyCode === 123)
    ) {
        e.preventDefault();
        vibrate('error');
    }
});

document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    vibrate('error');
});

document.addEventListener('copy', function(e) {
    e.preventDefault();
});

// Proteção contra iframes
if (window.top !== window.self) {
    window.top.location = window.self.location;
}
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        const lastActive = localStorage.getItem('lastActive');
        const now = Date.now();
        
        if (lastActive && (now - parseInt(lastActive) > 5 * 60 * 1000)) {
            location.reload();
        }
    } else {
        localStorage.setItem('lastActive', Date.now());
    }
});
