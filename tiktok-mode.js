/**
 * TikTok Mode - Automatic Video Generation from Transactions
 * This script creates a shareable TikTok-style video template after successful transactions
 */

class TikTokMode {
    constructor() {
        this.videoContainer = null;
        this.canvas = null;
        this.ctx = null;
        this.frames = 0;
        this.animationId = null;
        this.transactionData = null;
        this.isRecording = false;
        this.recordedFrames = [];
        this.mediaRecorder = null;
        this.recordedChunks = [];
    }

    /**
     * Initialize the TikTok Mode
     */
    init() {
        // Create video container if it doesn't exist
        if (!document.getElementById('tiktok-video-container')) {
            this.createVideoContainer();
        }

        // Add event listeners for buttons
        document.addEventListener('click', (e) => {
            if (e.target.id === 'close-tiktok-video') {
                this.hideVideo();
            } else if (e.target.id === 'download-tiktok-video') {
                this.downloadVideo();
            } else if (e.target.id === 'share-tiktok-video') {
                this.shareVideo();
            }
        });
    }

    /**
     * Create the video container
     */
    createVideoContainer() {
        const container = document.createElement('div');
        container.id = 'tiktok-video-container';
        container.style.display = 'none';
        container.innerHTML = `
            <div class="tiktok-modal-content">
                <div class="tiktok-header">
                    <h3>Video Transaksi Anda</h3>
                    <button id="close-tiktok-video" class="tiktok-close-btn">&times;</button>
                </div>
                <div class="tiktok-video-wrapper">
                    <canvas id="tiktok-canvas" width="320" height="560"></canvas>
                    <div class="tiktok-overlay">
                        <div class="tiktok-username">@verda4store</div>
                        <div class="tiktok-caption" id="tiktok-caption"></div>
                        <div class="tiktok-music">
                            <i class="fas fa-music"></i> <span>Top Up Success - Verda4Store</span>
                        </div>
                    </div>
                </div>
                <div class="tiktok-actions">
                    <button id="download-tiktok-video" class="tiktok-action-btn">
                        <i class="fas fa-download"></i> Download
                    </button>
                    <button id="share-tiktok-video" class="tiktok-action-btn">
                        <i class="fas fa-share-alt"></i> Bagikan
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(container);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #tiktok-video-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.8);
                z-index: 10000;
                display: flex;
                justify-content: center;
                align-items: center;
                animation: fadeIn 0.3s ease;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            .tiktok-modal-content {
                background-color: #000;
                border-radius: 12px;
                width: 350px;
                max-width: 90%;
                overflow: hidden;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
            }
            
            .tiktok-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px;
                background-color: #111;
                color: white;
            }
            
            .tiktok-header h3 {
                margin: 0;
                font-size: 18px;
            }
            
            .tiktok-close-btn {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
            }
            
            .tiktok-video-wrapper {
                position: relative;
                width: 100%;
                background-color: #000;
            }
            
            #tiktok-canvas {
                display: block;
                width: 100%;
                height: auto;
                aspect-ratio: 9/16;
            }
            
            .tiktok-overlay {
                position: absolute;
                bottom: 20px;
                left: 0;
                width: 100%;
                padding: 0 15px;
                color: white;
                text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
            }
            
            .tiktok-username {
                font-weight: bold;
                margin-bottom: 5px;
                font-size: 16px;
            }
            
            .tiktok-caption {
                margin-bottom: 10px;
                font-size: 14px;
            }
            
            .tiktok-music {
                display: flex;
                align-items: center;
                gap: 5px;
                font-size: 12px;
                opacity: 0.8;
            }
            
            .tiktok-actions {
                display: flex;
                justify-content: space-around;
                padding: 15px;
                background-color: #111;
            }
            
            .tiktok-action-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                padding: 10px 15px;
                background-color: #FE2C55;
                color: white;
                border: none;
                border-radius: 4px;
                font-weight: bold;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            
            .tiktok-action-btn:hover {
                background-color: #e6254d;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Generate a video for a transaction
     * @param {Object} transactionData - The transaction data
     */
    generateVideo(transactionData) {
        this.transactionData = transactionData;
        
        // Show the video container
        const container = document.getElementById('tiktok-video-container');
        container.style.display = 'flex';
        
        // Set the caption
        const caption = document.getElementById('tiktok-caption');
        const productName = transactionData.cart[0].name;
        caption.textContent = `Top up ${productName} sukses - by @fahril29124`;
        
        // Initialize canvas
        this.canvas = document.getElementById('tiktok-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Start animation
        this.frames = 0;
        this.startAnimation();
        
        // Start recording (simulated)
        this.startRecording();
    }

    /**
     * Start the animation
     */
    startAnimation() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#FE2C55');
        gradient.addColorStop(1, '#25F4EE');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw logo
        this.drawLogo();
        
        // Draw transaction details
        this.drawTransactionDetails();
        
        // Draw animated elements
        this.drawAnimatedElements();
        
        // Increment frame counter
        this.frames++;
        
        // Continue animation
        this.animationId = requestAnimationFrame(() => this.startAnimation());
    }

    /**
     * Draw the logo
     */
    drawLogo() {
        // Load logo image
        const logo = new Image();
        logo.src = 'logoverda.jpg';
        
        // Draw logo when loaded
        if (logo.complete) {
            // Draw circular logo
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.canvas.width / 2, 100, 50, 0, Math.PI * 2);
            this.ctx.closePath();
            this.ctx.clip();
            this.ctx.drawImage(logo, this.canvas.width / 2 - 50, 50, 100, 100);
            this.ctx.restore();
        } else {
            logo.onload = () => {
                // Draw circular logo
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.arc(this.canvas.width / 2, 100, 50, 0, Math.PI * 2);
                this.ctx.closePath();
                this.ctx.clip();
                this.ctx.drawImage(logo, this.canvas.width / 2 - 50, 50, 100, 100);
                this.ctx.restore();
            };
        }
        
        // Draw store name
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Verda4Store', this.canvas.width / 2, 180);
    }

    /**
     * Draw transaction details
     */
    drawTransactionDetails() {
        if (!this.transactionData) return;
        
        const productName = this.transactionData.cart[0].name;
        const price = this.transactionData.total;
        
        // Draw product name
        this.ctx.font = 'bold 20px Arial';
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(productName, this.canvas.width / 2, 230);
        
        // Draw price
        this.ctx.font = '18px Arial';
        this.ctx.fillText(`Rp ${price.toLocaleString('id-ID')}`, this.canvas.width / 2, 260);
        
        // Draw success message
        this.ctx.font = 'bold 28px Arial';
        this.ctx.fillText('TRANSAKSI SUKSES!', this.canvas.width / 2, 320);
        
        // Draw date
        const date = new Date().toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        this.ctx.font = '16px Arial';
        this.ctx.fillText(date, this.canvas.width / 2, 350);
    }

    /**
     * Draw animated elements
     */
    drawAnimatedElements() {
        // Draw animated diamonds
        for (let i = 0; i < 10; i++) {
            const x = Math.sin(this.frames * 0.05 + i) * 100 + this.canvas.width / 2;
            const y = Math.cos(this.frames * 0.05 + i) * 100 + 400;
            const size = Math.sin(this.frames * 0.1 + i) * 5 + 15;
            
            this.drawDiamond(x, y, size);
        }
        
        // Draw TikTok logo
        this.drawTikTokLogo();
    }

    /**
     * Draw a diamond
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} size - Size of the diamond
     */
    drawDiamond(x, y, size) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(this.frames * 0.01);
        
        this.ctx.beginPath();
        this.ctx.moveTo(0, -size);
        this.ctx.lineTo(size, 0);
        this.ctx.lineTo(0, size);
        this.ctx.lineTo(-size, 0);
        this.ctx.closePath();
        
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.fill();
        
        this.ctx.restore();
    }

    /**
     * Draw TikTok logo
     */
    drawTikTokLogo() {
        // Draw TikTok logo at the bottom
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('TikTok', this.canvas.width / 2, this.canvas.height - 50);
        
        // Draw musical note
        this.ctx.font = '24px Arial';
        this.ctx.fillText('♪', this.canvas.width / 2 - 40, this.canvas.height - 50);
        this.ctx.fillText('♫', this.canvas.width / 2 + 40, this.canvas.height - 50);
    }

    /**
     * Start recording (simulated)
     */
    startRecording() {
        this.isRecording = true;
        this.recordedFrames = [];
        
        // Simulate recording for 3 seconds
        setTimeout(() => {
            this.stopRecording();
        }, 3000);
    }

    /**
     * Stop recording (simulated)
     */
    stopRecording() {
        this.isRecording = false;
        
        // Take a snapshot of the canvas as the final video frame
        this.recordedFrames.push(this.canvas.toDataURL('image/png'));
    }

    /**
     * Hide the video
     */
    hideVideo() {
        const container = document.getElementById('tiktok-video-container');
        container.style.display = 'none';
        
        // Stop animation
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * Download the video (actually downloads a screenshot)
     */
    downloadVideo() {
        if (this.recordedFrames.length === 0) {
            // Take a screenshot if no frames recorded
            this.recordedFrames.push(this.canvas.toDataURL('image/png'));
        }
        
        // Create a download link
        const link = document.createElement('a');
        link.href = this.recordedFrames[0];
        link.download = `verda4store-transaction-${Date.now()}.png`;
        link.click();
    }

    /**
     * Share the video (opens share dialog if supported)
     */
    shareVideo() {
        if (navigator.share) {
            // Take a screenshot if no frames recorded
            if (this.recordedFrames.length === 0) {
                this.recordedFrames.push(this.canvas.toDataURL('image/png'));
            }
            
            // Convert data URL to blob
            const fetchResponse = fetch(this.recordedFrames[0]);
            fetchResponse.then(res => res.blob()).then(blob => {
                const file = new File([blob], 'verda4store-transaction.png', { type: 'image/png' });
                
                navigator.share({
                    title: 'Transaksi Verda4Store',
                    text: 'Lihat transaksi saya di Verda4Store!',
                    files: [file]
                }).catch(error => {
                    console.error('Error sharing:', error);
                    alert('Maaf, tidak dapat membagikan video. Coba download dan bagikan secara manual.');
                });
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            alert('Maaf, browser Anda tidak mendukung fitur berbagi. Coba download dan bagikan secara manual.');
        }
    }
}

// Initialize TikTok Mode
const tikTokMode = new TikTokMode();
document.addEventListener('DOMContentLoaded', () => {
    tikTokMode.init();
});

// Export for use in other scripts
window.tikTokMode = tikTokMode;