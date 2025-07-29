/**
 * Mascot Chat - Interactive Anime Character Feature
 * This script creates an interactive anime character mascot that users can chat with
 */

class MascotChat {
    constructor(options = {}) {
        // Default options
        this.options = {
            name: options.name || 'Verda',
            position: options.position || 'bottom-right',
            initialMode: options.initialMode || 'friendly',
            useLive2D: options.useLive2D !== undefined ? options.useLive2D : true,
            ...options
        };
        
        // Character states
        this.isVisible = true;
        this.isMinimized = false;
        this.isTalking = false;
        this.currentMode = this.options.initialMode;
        
        // Live2D integration
        this.live2d = null;
        
        // Available character modes
        this.modes = {
            friendly: {
                name: 'Taiga (Ramah)',
                greetings: [
                    'Hai! Aku Taiga! Ada yang bisa kubantu hari ini?',
                    'Selamat datang di Verda4Store! Aku Taiga, senang bertemu denganmu!',
                    'Hai! Mau top up game apa hari ini? Aku akan membantumu!'
                ],
                responses: {
                    topup: [
                        'Tentu! Silakan pilih game yang ingin kamu top up. Aku akan membantumu!',
                        'Kamu bisa top up dengan harga terbaik di sini! Aku jamin!',
                        'Kita punya banyak pilihan game untuk di-top up! Pilih yang kamu suka!'
                    ],
                    discount: [
                        'Kamu bisa gunakan kode promo WELCOME10 untuk diskon 10%! Lumayan kan?',
                        'Ada promo spesial hari ini! Cek di halaman utama ya. Jangan sampai ketinggalan!',
                        'Mau diskon? Tentu saja! Coba gunakan kode promo WELCOME10!'
                    ],
                    help: [
                        'Butuh bantuan? Kamu bisa hubungi admin kami melalui WhatsApp atau Telegram. Atau tanya saja padaku!',
                        'Ada masalah dengan transaksi? Cek status transaksi di menu Cek Transaksi. Aku akan membantumu!',
                        'Jika ada pertanyaan, jangan ragu untuk bertanya padaku! Aku senang bisa membantu!'
                    ],
                    random: [
                        'Hari yang cerah untuk top up game! Seperti suasana hatiku saat ini!',
                        'Kamu tahu? Verda4Store adalah toko top up game terpercaya! Aku bangga bisa menjadi bagian dari tim!',
                        'Jangan lupa follow sosial media kami untuk info promo terbaru! Aku selalu update info di sana!'
                    ]
                }
            },
            tsundere: {
                name: 'Taiga',
                greetings: [
                    'Hmph! Apa yang kamu lihat, baka?! Mau top up atau tidak?',
                    'Jangan salah paham! Aku di sini bukan karena aku peduli padamu, Ryuuji no baka!',
                    'Apa-apaan tatapanmu itu?! Cepat pilih game yang mau kamu top up!'
                ],
                responses: {
                    topup: [
                        'Hmph, kamu cuma mau diskon doang ya? Dasar pelit!',
                        'B-bukan berarti aku senang membantumu top up atau apa... Baka!',
                        'Aku akan membantumu top up, tapi jangan berpikir ini karena aku peduli padamu! Ini hanya tugasku!'
                    ],
                    discount: [
                        'Dasar! Selalu mencari diskon... Nih, pakai kode WELCOME10. Tapi jangan bilang siapa-siapa aku memberitahumu!',
                        'Kamu ini benar-benar... *menghela napas* Baiklah, gunakan kode WELCOME10 untuk diskon 10%. Puas?',
                        'Hmph! Aku tidak sengaja memberitahumu, tapi ada diskon spesial hari ini. Jangan ge-er ya!'
                    ],
                    help: [
                        'K-kamu butuh bantuan? *wajah memerah* B-bukan berarti aku mau membantumu atau apa...',
                        'Baiklah, aku akan membantumu. Tapi ini untuk terakhir kalinya, mengerti?! Jangan terbiasa!',
                        'Jangan salah paham! Aku membantumu karena ini tugasku! Bukan karena aku khawatir atau apa!'
                    ],
                    random: [
                        'B-bukan berarti aku senang kamu mengunjungi website ini atau apa... Baka!',
                        'Hmph! Jangan terus-terusan menatapku seperti itu! Apa kamu tidak punya kerjaan lain?!',
                        'A-aku tidak memikirkanmu atau apa... Baka! *menendang udara*'
                    ]
                }
            },
            helpful: {
                name: 'Taiga (Profesional)',
                greetings: [
                    'Selamat datang di Verda4Store. Saya Taiga, siap membantu Anda dengan segala kebutuhan top up game.',
                    'Halo! Taiga di sini. Ada yang bisa saya bantu hari ini?',
                    'Selamat datang di Verda4Store. Bagaimana saya, Taiga, bisa membantu Anda?'
                ],
                responses: {
                    topup: [
                        'Untuk top up, silakan pilih game yang Anda inginkan di halaman utama. Saya akan memandu prosesnya.',
                        'Proses top up sangat mudah: pilih game, masukkan ID, pilih nominal, dan lakukan pembayaran. Saya akan memastikan prosesnya lancar.',
                        'Kami menyediakan berbagai metode pembayaran untuk top up game Anda. Silakan pilih yang paling nyaman.'
                    ],
                    discount: [
                        'Anda bisa menggunakan kode promo WELCOME10 untuk diskon 10% pada pembelian pertama. Saya rekomendasikan untuk menggunakannya sekarang.',
                        'Ikuti sosial media kami untuk mendapatkan info promo dan diskon terbaru. Saya selalu memposting penawaran terbaik di sana.',
                        'Kami sering mengadakan promo spesial pada hari-hari tertentu. Pantau terus website kami untuk mendapatkan penawaran terbaik!'
                    ],
                    help: [
                        'Jika Anda mengalami masalah, silakan hubungi customer service kami melalui WhatsApp atau Telegram. Saya juga bisa membantu mengarahkan Anda.',
                        'Untuk mengecek status transaksi, silakan kunjungi halaman Cek Transaksi. Saya bisa membantu Anda menafsirkan statusnya.',
                        'Ada pertanyaan lain? Saya, Taiga, siap membantu Anda dengan informasi yang Anda butuhkan!'
                    ],
                    random: [
                        'Verda4Store menyediakan layanan top up game dengan harga terbaik dan proses cepat. Saya bangga menjadi bagian dari layanan ini.',
                        'Keamanan transaksi Anda adalah prioritas kami. Saya memastikan setiap transaksi dilakukan dengan aman.',
                        'Terima kasih telah memilih Verda4Store untuk kebutuhan top up game Anda! Saya, Taiga, selalu siap membantu.'
                    ]
                }
            }
        };
        
        // Chat history
        this.chatHistory = [];
        
        // DOM elements
        this.mascotElement = null;
        this.chatboxElement = null;
    }

    /**
     * Initialize the mascot
     */
    async init() {
        this.createMascotElements();
        
        // Initialize Live2D if enabled
        if (this.options.useLive2D) {
            try {
                // Load Live2D integration script if not already loaded
                if (!window.Live2DIntegration) {
                    await this.loadScript('live2d-integration.js');
                }
                
                // Initialize Live2D
                this.live2d = new Live2DIntegration({
                    position: this.options.position
                });
                
                await this.live2d.init();
                
                // Hide the static mascot character when Live2D is active
                if (this.mascotElement) {
                    this.mascotElement.style.opacity = '0';
                }
            } catch (error) {
                console.error('Failed to initialize Live2D:', error);
                console.log('Falling back to static image mascot');
                
                // Show the static mascot character if Live2D fails
                if (this.mascotElement) {
                    this.mascotElement.style.opacity = '1';
                }
                
                // Disable Live2D
                this.options.useLive2D = false;
            }
        }
        
        this.setupEventListeners();
        this.showGreeting();
    }
    
    /**
     * Load a script dynamically
     * @param {string} src - Script source URL
     * @returns {Promise} Promise that resolves when script is loaded
     */
    loadScript(src) {
        return new Promise((resolve, reject) => {
            // Check if script is already loaded
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = () => resolve();
            script.onerror = (e) => reject(new Error(`Failed to load script: ${src}`));
            document.head.appendChild(script);
        });
    }

    /**
     * Create mascot elements
     */
    createMascotElements() {
        // Create mascot container if it doesn't exist
        if (!document.getElementById('mascot-container')) {
            // Create container
            const container = document.createElement('div');
            container.id = 'mascot-container';
            container.className = `mascot-${this.options.position}`;
            
            // Create mascot character
            const mascot = document.createElement('div');
            mascot.id = 'mascot-character';
            mascot.className = `mascot-mode-${this.currentMode}`;
            
            // Create chat bubble
            const chatBubble = document.createElement('div');
            chatBubble.id = 'mascot-bubble';
            chatBubble.className = 'mascot-bubble-hidden';
            
            // Create chat message
            const chatMessage = document.createElement('div');
            chatMessage.id = 'mascot-message';
            chatBubble.appendChild(chatMessage);
            
            // Create chat options
            const chatOptions = document.createElement('div');
            chatOptions.id = 'mascot-options';
            chatOptions.innerHTML = `
                <button class="mascot-option" data-option="topup">Top Up</button>
                <button class="mascot-option" data-option="discount">Diskon</button>
                <button class="mascot-option" data-option="help">Bantuan</button>
                <button class="mascot-option" data-option="random">Random</button>
            `;
            chatBubble.appendChild(chatOptions);
            
            // Create chat controls
            const chatControls = document.createElement('div');
            chatControls.id = 'mascot-controls';
            chatControls.innerHTML = `
                <button id="mascot-mode-toggle" title="Ubah Mode">
                    <i class="fas fa-exchange-alt"></i>
                </button>
                <button id="mascot-minimize" title="Minimize">
                    <i class="fas fa-minus"></i>
                </button>
                <button id="mascot-close" title="Tutup">
                    <i class="fas fa-times"></i>
                </button>
            `;
            chatBubble.appendChild(chatControls);
            
            // Append elements to container
            container.appendChild(mascot);
            container.appendChild(chatBubble);
            
            // Append container to body
            document.body.appendChild(container);
            
            // Store references to elements
            this.mascotElement = mascot;
            this.chatboxElement = chatBubble;
            
            // Add styles
            this.addStyles();
        }
    }

    /**
     * Add styles for mascot
     */
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Mascot Container */
            #mascot-container {
                position: fixed;
                z-index: 9999;
                display: flex;
                align-items: flex-end;
                transition: all 0.3s ease;
            }
            
            .mascot-bottom-right {
                right: 20px;
                bottom: 20px;
            }
            
            .mascot-bottom-left {
                left: 20px;
                bottom: 20px;
            }
            
            /* Mascot Character */
            #mascot-character {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background-size: cover;
                background-position: center;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(255, 107, 129, 0.4);
                transition: all 0.3s ease;
                z-index: 2;
                border: 3px solid #ffb7c5;
                position: relative;
                overflow: hidden;
            }
            
            #mascot-character::before {
                content: '';
                position: absolute;
                top: -10px;
                left: -10px;
                right: -10px;
                bottom: -10px;
                background: linear-gradient(45deg, #ff6b81, #ff92a3, #ffb7c5, #ff92a3, #ff6b81);
                background-size: 400% 400%;
                z-index: -1;
                border-radius: 50%;
                animation: gradient-border 3s ease infinite;
                opacity: 0.7;
            }
            
            @keyframes gradient-border {
                0% { background-position: 0% 50%; transform: rotate(0deg); }
                50% { background-position: 100% 50%; transform: rotate(180deg); }
                100% { background-position: 0% 50%; transform: rotate(360deg); }
            }
            
            #mascot-character:hover {
                transform: scale(1.15);
                box-shadow: 0 8px 25px rgba(255, 107, 129, 0.6);
                border-color: #ff6b81;
            }
            
            #mascot-character::after {
                content: '';
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            #mascot-character:hover::after {
                opacity: 0.5;
                animation: shine 1.5s infinite;
            }
            
            @keyframes shine {
                0% { transform: scale(0.5); opacity: 0; }
                50% { opacity: 0.3; }
                100% { transform: scale(1.2); opacity: 0; }
            }
            
            /* Mascot modes - All using Taiga Aisaka from Toradora */
            .mascot-mode-friendly {
                background-image: url('taiga.png');
            }
            
            .mascot-mode-tsundere {
                background-image: url('taiga.png');
            }
            
            .mascot-mode-helpful {
                background-image: url('taiga.png');
            }
            
            /* Chat Bubble */
            #mascot-bubble {
                position: absolute;
                bottom: 90px;
                right: 0;
                width: 300px;
                background-color: #fff5f5;
                background-image: linear-gradient(135deg, #ffe8e8 25%, #fff5f5 25%, #fff5f5 50%, #ffe8e8 50%, #ffe8e8 75%, #fff5f5 75%, #fff5f5 100%);
                background-size: 20px 20px;
                border-radius: 12px;
                box-shadow: 0 8px 25px rgba(255, 107, 129, 0.2);
                border: 2px solid #ffb7c5;
                padding: 15px;
                transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                z-index: 1;
            }
            
            .mascot-bottom-left #mascot-bubble {
                left: 0;
                right: auto;
            }
            
            .mascot-bubble-hidden {
                opacity: 0;
                visibility: hidden;
                transform: translateY(20px) scale(0.8);
            }
            
            .mascot-bubble-visible {
                opacity: 1;
                visibility: visible;
                transform: translateY(0) scale(1);
                animation: bubble-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            
            @keyframes bubble-pop {
                0% { transform: translateY(20px) scale(0.8); opacity: 0; }
                40% { transform: translateY(-5px) scale(1.05); }
                60% { transform: translateY(2px) scale(0.98); }
                100% { transform: translateY(0) scale(1); opacity: 1; }
            }
            
            /* Chat Message */
            #mascot-message {
                margin-bottom: 15px;
                font-size: 14px;
                line-height: 1.5;
                color: #e74c3c;
                background-color: rgba(255, 255, 255, 0.7);
                padding: 10px 12px;
                border-radius: 8px;
                border-left: 3px solid #ff6b81;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                animation: message-fade 0.3s ease-in-out;
            }
            
            @keyframes message-fade {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            /* Chat Options */
            #mascot-options {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-bottom: 15px;
            }
            
            .mascot-option {
                padding: 8px 14px;
                background-color: #ffecef;
                border: 1px solid #ffb7c5;
                border-radius: 20px;
                cursor: pointer;
                font-size: 12px;
                color: #e74c3c;
                font-weight: bold;
                transition: all 0.3s ease;
                box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            }
            
            .mascot-option:hover {
                background-color: #ffb7c5;
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(255, 107, 129, 0.3);
            }
            
            .mascot-option:active {
                transform: translateY(1px);
            }
            
            /* Chat Controls */
            #mascot-controls {
                display: flex;
                justify-content: flex-end;
                gap: 8px;
            }
            
            #mascot-controls button {
                width: 28px;
                height: 28px;
                border-radius: 50%;
                border: 1px solid #ffb7c5;
                background-color: #ffecef;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                color: #e74c3c;
                transition: all 0.3s ease;
                box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            }
            
            #mascot-controls button:hover {
                background-color: #ffb7c5;
                color: white;
                transform: translateY(-2px) rotate(5deg);
                box-shadow: 0 4px 8px rgba(255, 107, 129, 0.3);
            }
            
            #mascot-close:hover {
                background-color: #ff6b6b;
                color: white;
                transform: translateY(-2px) rotate(90deg);
            }
            
            /* Animations */
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% {transform: translateY(0) rotate(0deg);}
                40% {transform: translateY(-20px) rotate(-5deg);}
                60% {transform: translateY(-10px) rotate(5deg);}
            }
            
            .mascot-bounce {
                animation: bounce 1s cubic-bezier(0.280, 0.840, 0.420, 1);
            }
            
            @keyframes pulse {
                0% {transform: scale(1) rotate(0deg);}
                50% {transform: scale(1.1) rotate(5deg);}
                100% {transform: scale(1) rotate(0deg);}
            }
            
            .mascot-pulse {
                animation: pulse 1s infinite;
            }
            
            /* Floating animation for mascot */
            @keyframes floating {
                0% { transform: translateY(0) rotate(0deg); }
                25% { transform: translateY(-5px) rotate(3deg); }
                50% { transform: translateY(0) rotate(0deg); }
                75% { transform: translateY(5px) rotate(-3deg); }
                100% { transform: translateY(0) rotate(0deg); }
            }
            
            #mascot-character {
                animation: floating 3s ease-in-out infinite;
            }
            
            #mascot-character:hover {
                animation: pulse 0.5s infinite;
            }
            
            /* Minimized state */
            .mascot-minimized #mascot-bubble {
                height: 40px;
                padding: 10px 15px;
                transform: scale(0.9);
                opacity: 0.9;
            }
            
            .mascot-minimized #mascot-message,
            .mascot-minimized #mascot-options {
                display: none;
            }
            
            /* Mobile responsive */
            @media (max-width: 768px) {
                #mascot-character {
                    width: 60px;
                    height: 60px;
                }
                
                #mascot-bubble {
                    width: 250px;
                    bottom: 70px;
                }
            }
            /* Notification badge */
            #mascot-character.has-notification::before {
                content: '';
                position: absolute;
                top: 0;
                right: 0;
                width: 20px;
                height: 20px;
                background-color: #ff3b5c;
                border-radius: 50%;
                border: 2px solid white;
                animation: pulse-notification 1.5s infinite;
            }
            
            @keyframes pulse-notification {
                0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 59, 92, 0.7); }
                70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(255, 59, 92, 0); }
                100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 59, 92, 0); }
            }
            
            /* Typing animation enhancement */
            .typing-indicator {
                background-color: #ffecef;
                padding: 8px 12px;
                border-radius: 15px;
                display: inline-block;
                margin-bottom: 5px;
                font-size: 14px;
                color: #e74c3c;
                position: relative;
            }
            
            .typing-indicator::before {
                content: '';
                position: absolute;
                bottom: -6px;
                left: 15px;
                width: 12px;
                height: 12px;
                background-color: #ffecef;
                transform: rotate(45deg);
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Add notification badge to mascot
     */
    addNotificationBadge() {
        this.mascotElement.classList.add('has-notification');
        
        // Remove notification after a delay
        setTimeout(() => {
            this.mascotElement.classList.remove('has-notification');
        }, 5000);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Mascot click event
        this.mascotElement.addEventListener('click', () => {
            if (this.isMinimized) {
                this.maximizeChatbox();
            } else {
                this.toggleChatbox();
            }
        });
        
        // Chat option click events
        document.querySelectorAll('.mascot-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const optionType = e.target.getAttribute('data-option');
                this.respondToOption(optionType);
            });
        });
        
        // Mode toggle click event
        document.getElementById('mascot-mode-toggle').addEventListener('click', () => {
            this.cycleMode();
        });
        
        // Minimize button click event
        document.getElementById('mascot-minimize').addEventListener('click', (e) => {
            e.stopPropagation();
            this.minimizeChatbox();
        });
        
        // Close button click event
        document.getElementById('mascot-close').addEventListener('click', (e) => {
            e.stopPropagation();
            this.hideMascot();
        });
    }

    /**
     * Show greeting message
     */
    showGreeting() {
        const greetings = this.modes[this.currentMode].greetings;
        const greeting = greetings[Math.floor(Math.random() * greetings.length)];
        
        this.setMessage(greeting);
        
        // Show chat bubble after a short delay
        setTimeout(() => {
            this.showChatbox();
        }, 1000);
        
        // Show emotion in Live2D model if available
        if (this.options.useLive2D && this.live2d) {
            // Map mode to emotion
            let emotion = 'default';
            switch (this.currentMode) {
                case 'friendly':
                    emotion = 'happy';
                    break;
                case 'tsundere':
                    emotion = 'angry';
                    break;
                case 'helpful':
                    emotion = 'default';
                    break;
            }
            
            this.live2d.showEmotion(emotion);
        }
    }

    /**
     * Set message in chat bubble
     * @param {string} message - The message to display
     */
    setMessage(message) {
        const messageElement = document.getElementById('mascot-message');
        
        // Clear previous message
        messageElement.innerHTML = '';
        
        // Create a typing effect
        let i = 0;
        const speed = 30; // typing speed in milliseconds
        
        // Start talking animation in Live2D
        if (this.options.useLive2D && this.live2d) {
            this.live2d.setTalking(true);
        }
        
        const typeWriter = () => {
            if (i < message.length) {
                messageElement.innerHTML += message.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            } else {
                // Stop talking animation when typing is complete
                if (this.options.useLive2D && this.live2d) {
                    setTimeout(() => {
                        this.live2d.setTalking(false);
                    }, 500);
                }
            }
        };
        
        typeWriter();
        
        // Add to chat history
        this.chatHistory.push({
            sender: 'mascot',
            message,
            timestamp: new Date()
        });
        
        // Animate mascot
        if (!this.options.useLive2D) {
            this.mascotElement.classList.add('mascot-bounce');
            setTimeout(() => {
                this.mascotElement.classList.remove('mascot-bounce');
            }, 1000);
        } else if (this.live2d) {
            // Perform action in Live2D
            this.live2d.performAction('nod');
        }
        
        // Add notification badge
        this.addNotificationBadge();
    }

    /**
     * Respond to user option
     * @param {string} optionType - The type of option selected
     */
    respondToOption(optionType) {
        const responses = this.modes[this.currentMode].responses[optionType];
        if (!responses) return;
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        
        // Add to chat history
        this.chatHistory.push({
            sender: 'user',
            message: document.querySelector(`[data-option="${optionType}"]`).textContent,
            timestamp: new Date()
        });
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Show response after a short delay
        setTimeout(() => {
            this.hideTypingIndicator();
            this.setMessage(response);
        }, 1000);
    }

    /**
     * Show typing indicator
     */
    showTypingIndicator() {
        const messageElement = document.getElementById('mascot-message');
        
        // Create a more animated typing indicator
        messageElement.innerHTML = `
            <span class="typing-indicator">
                <span class="typing-dot" style="animation-delay: 0s;">.</span>
                <span class="typing-dot" style="animation-delay: 0.2s;">.</span>
                <span class="typing-dot" style="animation-delay: 0.4s;">.</span>
                <span style="margin-left: 5px;">Mengetik</span>
            </span>
        `;
        
        // Add typing animation
        const style = document.createElement('style');
        style.textContent = `
            .typing-dot {
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background-color: #e74c3c;
                margin-right: 3px;
                animation: typingBounce 1.4s infinite;
            }
            
            @keyframes typingBounce {
                0%, 60%, 100% { transform: translateY(0); }
                30% { transform: translateY(-6px); }
            }
        `;
        document.head.appendChild(style);
        
        // Start talking animation in Live2D
        if (this.options.useLive2D && this.live2d) {
            this.live2d.setTalking(true);
        } else {
            // Add subtle animation to static mascot while typing
            this.mascotElement.classList.add('mascot-pulse');
        }
    }

    /**
     * Hide typing indicator
     */
    hideTypingIndicator() {
        const messageElement = document.getElementById('mascot-message');
        messageElement.innerHTML = '';
        
        // Stop talking animation in Live2D
        if (this.options.useLive2D && this.live2d) {
            this.live2d.setTalking(false);
        } else {
            // Remove pulse animation from static mascot
            this.mascotElement.classList.remove('mascot-pulse');
        }
    }

    /**
     * Toggle chat bubble visibility
     */
    toggleChatbox() {
        const chatBubble = document.getElementById('mascot-bubble');
        
        if (chatBubble.classList.contains('mascot-bubble-visible')) {
            this.hideChatbox();
        } else {
            this.showChatbox();
        }
    }

    /**
     * Show chat bubble
     */
    showChatbox() {
        const chatBubble = document.getElementById('mascot-bubble');
        chatBubble.classList.remove('mascot-bubble-hidden');
        chatBubble.classList.add('mascot-bubble-visible');
        
        // Play a subtle pop sound
        this.playSound('pop');
    }
    
    /**
     * Play sound effect
     * @param {string} type - Type of sound to play
     */
    playSound(type) {
        // Create audio element
        const audio = document.createElement('audio');
        
        // Set source based on sound type
        switch(type) {
            case 'pop':
                audio.src = 'data:audio/mp3;base64,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';
                break;
            default:
                return; // No sound to play
        }
        
        // Set volume and play
        audio.volume = 0.2;
        audio.play().catch(e => console.log('Audio play prevented:', e));
    }

    /**
     * Hide chat bubble
     */
    hideChatbox() {
        const chatBubble = document.getElementById('mascot-bubble');
        chatBubble.classList.remove('mascot-bubble-visible');
        chatBubble.classList.add('mascot-bubble-hidden');
    }

    /**
     * Minimize chat bubble
     */
    minimizeChatbox() {
        const container = document.getElementById('mascot-container');
        container.classList.add('mascot-minimized');
        this.isMinimized = true;
    }

    /**
     * Maximize chat bubble
     */
    maximizeChatbox() {
        const container = document.getElementById('mascot-container');
        container.classList.remove('mascot-minimized');
        this.isMinimized = false;
    }

    /**
     * Hide mascot
     */
    hideMascot() {
        const container = document.getElementById('mascot-container');
        container.style.display = 'none';
        this.isVisible = false;
        
        // Hide Live2D model if available
        if (this.options.useLive2D && this.live2d) {
            this.live2d.hide();
        }
    }

    /**
     * Show mascot
     */
    showMascot() {
        const container = document.getElementById('mascot-container');
        container.style.display = 'flex';
        this.isVisible = true;
        
        // Show Live2D model if available
        if (this.options.useLive2D && this.live2d) {
            this.live2d.show();
        }
    }

    /**
     * Cycle through character modes
     */
    cycleMode() {
        const modes = Object.keys(this.modes);
        const currentIndex = modes.indexOf(this.currentMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        
        this.setMode(modes[nextIndex]);
    }

    /**
     * Set character mode
     * @param {string} mode - The mode to set
     */
    setMode(mode) {
        if (!this.modes[mode]) return;
        
        // Update current mode
        this.currentMode = mode;
        
        // Update mascot appearance
        if (!this.options.useLive2D) {
            this.mascotElement.className = `mascot-mode-${mode}`;
        } else if (this.live2d) {
            // Update Live2D expression based on mode
            let emotion = 'default';
            switch (mode) {
                case 'friendly':
                    emotion = 'happy';
                    break;
                case 'tsundere':
                    emotion = 'angry';
                    break;
                case 'helpful':
                    emotion = 'default';
                    break;
            }
            
            this.live2d.showEmotion(emotion);
        }
        
        // Show mode change message
        this.setMessage(`Mode berubah ke: ${this.modes[mode].name}`);
    }

    /**
     * Get chat history
     * @returns {Array} Chat history
     */
    getChatHistory() {
        return this.chatHistory;
    }

    /**
     * Clear chat history
     */
    clearChatHistory() {
        this.chatHistory = [];
    }
}

// Initialize Mascot Chat
const mascotChat = new MascotChat({
    name: 'Taiga',
    position: 'bottom-right',
    initialMode: 'tsundere',  // Set default mode to tsundere for Taiga
    useLive2D: true  // Enable Live2D functionality
});

document.addEventListener('DOMContentLoaded', () => {
    mascotChat.init();
});

// Export for use in other scripts
window.mascotChat = mascotChat;