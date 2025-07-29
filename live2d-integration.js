/**
 * Live2D Integration for Mascot Chat
 * This script integrates Live2D functionality with the mascot chat feature
 * It handles loading the Live2D model, rendering it, and controlling its animations
 */

class Live2DIntegration {
    constructor(options = {}) {
        // Default options
        this.options = {
            modelPath: options.modelPath || 'models/taiga/taiga.model3.json',
            canvasId: options.canvasId || 'live2d-canvas',
            width: options.width || 300,
            height: options.height || 300,
            position: options.position || 'bottom-right',
            ...options
        };
        
        // Live2D model and related objects
        this.live2dModel = null;
        this.modelLoaded = false;
        this.canvas = null;
        this.gl = null;
        this.framework = null;
        this.modelMatrix = null;
        
        // Animation states
        this.isTalking = false;
        this.isBlinking = false;
        this.headDirection = { x: 0, y: 0 };
        
        // Bind methods
        this.render = this.render.bind(this);
    }
    
    /**
     * Initialize Live2D integration
     * @returns {Promise} Promise that resolves when initialization is complete
     */
    async init() {
        console.log('Initializing Live2D integration...');
        
        // Create canvas if it doesn't exist
        this.createCanvas();
        
        // Load required scripts
        await this.loadScripts();
        
        // Initialize Live2D framework
        await this.initFramework();
        
        // Load model
        await this.loadModel();
        
        // Start rendering
        this.startRendering();
        
        // Setup event listeners
        this.setupEventListeners();
        
        return this;
    }
    
    /**
     * Create canvas for Live2D rendering
     */
    createCanvas() {
        // Check if canvas already exists
        if (document.getElementById(this.options.canvasId)) {
            this.canvas = document.getElementById(this.options.canvasId);
            return;
        }
        
        // Create canvas element
        this.canvas = document.createElement('canvas');
        this.canvas.id = this.options.canvasId;
        this.canvas.width = this.options.width;
        this.canvas.height = this.options.height;
        this.canvas.style.position = 'absolute';
        this.canvas.style.zIndex = '1';
        
        // Position canvas based on options
        if (this.options.position === 'bottom-right') {
            this.canvas.style.right = '20px';
            this.canvas.style.bottom = '20px';
        } else if (this.options.position === 'bottom-left') {
            this.canvas.style.left = '20px';
            this.canvas.style.bottom = '20px';
        }
        
        // Add canvas to mascot container
        const mascotContainer = document.getElementById('mascot-container');
        if (mascotContainer) {
            // Insert canvas before the mascot character
            const mascotCharacter = document.getElementById('mascot-character');
            if (mascotCharacter) {
                mascotContainer.insertBefore(this.canvas, mascotCharacter);
            } else {
                mascotContainer.appendChild(this.canvas);
            }
        } else {
            // If mascot container doesn't exist, add to body
            document.body.appendChild(this.canvas);
        }
        
        // Get WebGL context
        try {
            this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        } catch (e) {
            console.error('WebGL not supported:', e);
        }
        
        if (!this.gl) {
            console.error('Unable to initialize WebGL. Your browser may not support it.');
            return;
        }
    }
    
    /**
     * Load required scripts for Live2D
     * @returns {Promise} Promise that resolves when all scripts are loaded
     */
    async loadScripts() {
        const scripts = [
            'https://cdn.jsdelivr.net/gh/guansss/pixi-live2d-display/dist/cubism4.min.js',
            'https://cdn.jsdelivr.net/npm/pixi.js@5.3.3/dist/pixi.min.js',
            'https://cdn.jsdelivr.net/npm/pixi-live2d-display/dist/index.min.js'
        ];
        
        const loadPromises = scripts.map(src => {
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
        });
        
        try {
            await Promise.all(loadPromises);
            console.log('All Live2D scripts loaded successfully');
        } catch (error) {
            console.error('Error loading Live2D scripts:', error);
            throw error;
        }
    }
    
    /**
     * Initialize Live2D framework
     * @returns {Promise} Promise that resolves when framework is initialized
     */
    async initFramework() {
        try {
            // Wait for PIXI and Live2DModel to be available
            if (typeof PIXI === 'undefined' || !PIXI.live2d) {
                throw new Error('PIXI or PIXI.live2d is not loaded');
            }
            
            // Create PIXI application
            this.app = new PIXI.Application({
                view: this.canvas,
                autoStart: true,
                transparent: true,
                width: this.options.width,
                height: this.options.height
            });
            
            console.log('Live2D framework initialized');
        } catch (error) {
            console.error('Error initializing Live2D framework:', error);
            throw error;
        }
    }
    
    /**
     * Load Live2D model
     * @returns {Promise} Promise that resolves when model is loaded
     */
    async loadModel() {
        try {
            // Load model settings
            console.log('Loading Live2D model:', this.options.modelPath);
            
            // Load model using PIXI Live2D Display
            this.model = await PIXI.live2d.Live2DModel.from(this.options.modelPath);
            
            // Adjust model position and scale
            this.model.x = this.options.width / 2;
            this.model.y = this.options.height / 2;
            this.model.scale.set(0.2); // Adjust scale as needed
            
            // Add model to stage
            this.app.stage.addChild(this.model);
            
            // Enable dragging (optional)
            this.model.interactive = true;
            this.model.buttonMode = true;
            this.model.on('pointerdown', this.onModelPointerDown.bind(this));
            
            // Set model as loaded
            this.modelLoaded = true;
            console.log('Live2D model loaded successfully');
            
            // Initialize default expressions and motions
            this.initDefaultState();
        } catch (error) {
            console.error('Error loading Live2D model:', error);
            throw error;
        }
    }
    
    /**
     * Initialize default state for the model
     */
    initDefaultState() {
        if (!this.modelLoaded || !this.model) return;
        
        // Set default expression (if available)
        if (this.model.internalModel.settings.expressions) {
            this.setExpression('default');
        }
        
        // Start idle animation (if available)
        if (this.model.internalModel.settings.motions.idle) {
            this.startMotion('idle');
        }
        
        // Start random blinking
        this.startRandomBlinking();
    }
    
    /**
     * Start rendering loop
     */
    startRendering() {
        // PIXI handles rendering automatically
        console.log('Live2D rendering started');
    }
    
    /**
     * Setup event listeners for interaction
     */
    setupEventListeners() {
        // Track mouse movement for head tracking
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        
        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }
    
    /**
     * Handle mouse movement for head tracking
     * @param {MouseEvent} event - Mouse event
     */
    onMouseMove(event) {
        if (!this.modelLoaded || !this.model) return;
        
        // Calculate normalized coordinates (-1 to 1)
        const rect = this.canvas.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate distance from center of canvas
        const dx = (event.clientX - centerX) / (window.innerWidth / 2);
        const dy = (event.clientY - centerY) / (window.innerHeight / 2);
        
        // Update head direction with smoothing
        this.headDirection.x += (dx - this.headDirection.x) * 0.1;
        this.headDirection.y += (dy - this.headDirection.y) * 0.1;
        
        // Apply head tracking parameters
        if (this.model.internalModel.coreModel) {
            // For Cubism 4 models
            this.model.internalModel.coreModel.setParameterValueById(
                'ParamAngleX', 
                this.headDirection.x * 30 // Adjust multiplier for sensitivity
            );
            this.model.internalModel.coreModel.setParameterValueById(
                'ParamAngleY', 
                this.headDirection.y * -30 // Negative for correct direction
            );
            this.model.internalModel.coreModel.setParameterValueById(
                'ParamBodyAngleX', 
                this.headDirection.x * 10 // Body follows head with less intensity
            );
        }
    }
    
    /**
     * Handle window resize
     */
    onWindowResize() {
        // Adjust canvas size if needed
        // For now, we keep the canvas size fixed
    }
    
    /**
     * Handle model pointer down event (for dragging)
     * @param {PIXI.InteractionEvent} event - Interaction event
     */
    onModelPointerDown(event) {
        // Implement dragging if needed
    }
    
    /**
     * Set expression for the model
     * @param {string} expressionId - Expression ID
     */
    setExpression(expressionId) {
        if (!this.modelLoaded || !this.model) return;
        
        try {
            this.model.expression(expressionId);
        } catch (error) {
            console.error(`Error setting expression "${expressionId}":`, error);
        }
    }
    
    /**
     * Start motion for the model
     * @param {string} group - Motion group
     * @param {number} index - Motion index
     * @param {number} priority - Motion priority
     */
    startMotion(group, index = 0, priority = 3) {
        if (!this.modelLoaded || !this.model) return;
        
        try {
            this.model.motion(group, index, priority);
        } catch (error) {
            console.error(`Error starting motion "${group}":`, error);
        }
    }
    
    /**
     * Start random blinking
     */
    startRandomBlinking() {
        if (!this.modelLoaded || !this.model) return;
        
        this.isBlinking = true;
        
        const blink = () => {
            if (!this.isBlinking) return;
            
            // Set eye blink parameter
            if (this.model.internalModel.coreModel) {
                this.model.internalModel.coreModel.setParameterValueById('ParamEyeLOpen', 0);
                this.model.internalModel.coreModel.setParameterValueById('ParamEyeROpen', 0);
                
                // Reset after a short delay
                setTimeout(() => {
                    if (this.model.internalModel.coreModel) {
                        this.model.internalModel.coreModel.setParameterValueById('ParamEyeLOpen', 1);
                        this.model.internalModel.coreModel.setParameterValueById('ParamEyeROpen', 1);
                    }
                }, 100);
            }
            
            // Schedule next blink
            const nextBlinkTime = 2000 + Math.random() * 5000; // Random between 2-7 seconds
            setTimeout(blink, nextBlinkTime);
        };
        
        // Start blinking
        const initialDelay = Math.random() * 3000; // Random initial delay
        setTimeout(blink, initialDelay);
    }
    
    /**
     * Stop random blinking
     */
    stopRandomBlinking() {
        this.isBlinking = false;
    }
    
    /**
     * Simulate talking animation
     * @param {boolean} isTalking - Whether the model is talking
     */
    setTalking(isTalking) {
        if (!this.modelLoaded || !this.model) return;
        
        this.isTalking = isTalking;
        
        if (isTalking) {
            // Start mouth animation
            this.talkingInterval = setInterval(() => {
                if (!this.isTalking || !this.model.internalModel.coreModel) {
                    clearInterval(this.talkingInterval);
                    return;
                }
                
                // Randomly open/close mouth
                const openAmount = Math.random() * 0.8;
                this.model.internalModel.coreModel.setParameterValueById('ParamMouthOpenY', openAmount);
            }, 100);
        } else {
            // Stop mouth animation
            clearInterval(this.talkingInterval);
            
            // Close mouth
            if (this.model.internalModel.coreModel) {
                this.model.internalModel.coreModel.setParameterValueById('ParamMouthOpenY', 0);
            }
        }
    }
    
    /**
     * Show a specific emotion
     * @param {string} emotion - Emotion to show (happy, sad, angry, surprised)
     */
    showEmotion(emotion) {
        if (!this.modelLoaded || !this.model) return;
        
        // Set expression if available
        this.setExpression(emotion);
        
        // Also set parameters directly for more control
        if (this.model.internalModel.coreModel) {
            switch (emotion) {
                case 'happy':
                    this.model.internalModel.coreModel.setParameterValueById('ParamMouthForm', 1); // Smile
                    this.model.internalModel.coreModel.setParameterValueById('ParamEyeLSmile', 1);
                    this.model.internalModel.coreModel.setParameterValueById('ParamEyeRSmile', 1);
                    break;
                case 'sad':
                    this.model.internalModel.coreModel.setParameterValueById('ParamMouthForm', -1); // Frown
                    this.model.internalModel.coreModel.setParameterValueById('ParamBrowLY', -1);
                    this.model.internalModel.coreModel.setParameterValueById('ParamBrowRY', -1);
                    break;
                case 'angry':
                    this.model.internalModel.coreModel.setParameterValueById('ParamBrowLY', -1);
                    this.model.internalModel.coreModel.setParameterValueById('ParamBrowRY', -1);
                    this.model.internalModel.coreModel.setParameterValueById('ParamBrowLAngle', -1);
                    this.model.internalModel.coreModel.setParameterValueById('ParamBrowRAngle', -1);
                    this.model.internalModel.coreModel.setParameterValueById('ParamMouthForm', -0.5);
                    break;
                case 'surprised':
                    this.model.internalModel.coreModel.setParameterValueById('ParamBrowLY', 1);
                    this.model.internalModel.coreModel.setParameterValueById('ParamBrowRY', 1);
                    this.model.internalModel.coreModel.setParameterValueById('ParamEyeLOpen', 1.5);
                    this.model.internalModel.coreModel.setParameterValueById('ParamEyeROpen', 1.5);
                    this.model.internalModel.coreModel.setParameterValueById('ParamMouthOpenY', 1);
                    break;
                default:
                    // Reset to default
                    this.model.internalModel.coreModel.setParameterValueById('ParamMouthForm', 0);
                    this.model.internalModel.coreModel.setParameterValueById('ParamEyeLSmile', 0);
                    this.model.internalModel.coreModel.setParameterValueById('ParamEyeRSmile', 0);
                    this.model.internalModel.coreModel.setParameterValueById('ParamBrowLY', 0);
                    this.model.internalModel.coreModel.setParameterValueById('ParamBrowRY', 0);
                    this.model.internalModel.coreModel.setParameterValueById('ParamBrowLAngle', 0);
                    this.model.internalModel.coreModel.setParameterValueById('ParamBrowRAngle', 0);
            }
        }
    }
    
    /**
     * Perform a specific action/motion
     * @param {string} action - Action to perform (wave, nod, shake)
     */
    performAction(action) {
        if (!this.modelLoaded || !this.model) return;
        
        // Start specific motion if available
        if (action === 'wave' && this.model.internalModel.settings.motions.wave) {
            this.startMotion('wave');
            return;
        }
        
        // Otherwise, animate using parameters
        if (this.model.internalModel.coreModel) {
            switch (action) {
                case 'nod':
                    // Nodding animation
                    this.animateParameter('ParamAngleX', 0, 0, 1000); // Reset X angle
                    this.animateParameter('ParamAngleY', 15, -15, 1000, 3); // Nod up and down
                    break;
                case 'shake':
                    // Head shake animation
                    this.animateParameter('ParamAngleY', 0, 0, 1000); // Reset Y angle
                    this.animateParameter('ParamAngleX', 15, -15, 1000, 3); // Shake left and right
                    break;
                case 'wave':
                    // Fallback wave animation using arm parameters
                    this.animateParameter('ParamArmLA', -30, 30, 1000, 3);
                    break;
            }
        }
    }
    
    /**
     * Animate a parameter from one value to another
     * @param {string} parameterId - Parameter ID
     * @param {number} startValue - Start value
     * @param {number} endValue - End value
     * @param {number} duration - Duration in milliseconds
     * @param {number} cycles - Number of cycles (for oscillation)
     */
    animateParameter(parameterId, startValue, endValue, duration, cycles = 1) {
        if (!this.modelLoaded || !this.model || !this.model.internalModel.coreModel) return;
        
        const startTime = Date.now();
        const range = endValue - startValue;
        const totalDuration = duration * cycles;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            
            if (elapsed >= totalDuration) {
                // Animation complete, set final value
                this.model.internalModel.coreModel.setParameterValueById(parameterId, startValue);
                return;
            }
            
            // Calculate current cycle and progress within cycle
            const cycleProgress = (elapsed % duration) / duration;
            const cycleValue = startValue + range * Math.sin(cycleProgress * Math.PI * 2);
            
            // Set parameter value
            this.model.internalModel.coreModel.setParameterValueById(parameterId, cycleValue);
            
            // Continue animation
            requestAnimationFrame(animate);
        };
        
        // Start animation
        animate();
    }
    
    /**
     * Hide the Live2D model
     */
    hide() {
        if (this.canvas) {
            this.canvas.style.display = 'none';
        }
    }
    
    /**
     * Show the Live2D model
     */
    show() {
        if (this.canvas) {
            this.canvas.style.display = 'block';
        }
    }
    
    /**
     * Clean up resources
     */
    dispose() {
        // Stop animations
        this.stopRandomBlinking();
        this.setTalking(false);
        
        // Remove event listeners
        document.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('resize', this.onWindowResize);
        
        // Dispose PIXI application
        if (this.app) {
            this.app.destroy(true, { children: true, texture: true, baseTexture: true });
        }
        
        // Remove canvas
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        
        console.log('Live2D integration disposed');
    }
}

// Export for use in other scripts
window.Live2DIntegration = Live2DIntegration;