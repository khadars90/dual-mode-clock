// Global variables for theme and time format
let isDarkMode = false;
let is24HourFormat = true;

// DOM elements
const themeToggle = document.getElementById('themeToggle');
const formatToggle = document.getElementById('formatToggle');
const timeDisplay = document.getElementById('timeDisplay');
const dateDisplay = document.getElementById('dateDisplay');
const hourHand = document.getElementById('hourHand');
const minuteHand = document.getElementById('minuteHand');
const secondHand = document.getElementById('secondHand');
const themeIcon = document.querySelector('.theme-icon');

// Initialize the application
function init() {
    // Set initial theme
    updateTheme();
    
    // Start the clocks
    updateTime();
    
    // Set up event listeners
    themeToggle.addEventListener('click', toggleTheme);
    formatToggle.addEventListener('click', toggleTimeFormat);
    
    // Update clocks every second
    setInterval(updateTime, 1000);
}

// Theme management
function toggleTheme() {
    isDarkMode = !isDarkMode;
    updateTheme();
}

function updateTheme() {
    const body = document.body;
    const themeIcon = document.querySelector('.theme-icon');
    
    if (isDarkMode) {
        body.setAttribute('data-theme', 'dark');
        themeIcon.textContent = '☀️';
    } else {
        body.setAttribute('data-theme', 'light');
        themeIcon.textContent = '🌙';
    }
}

// Time format management
function toggleTimeFormat() {
    is24HourFormat = !is24HourFormat;
    formatToggle.textContent = is24HourFormat ? '12H' : '24H';
    updateTime();
}

// Main time update function
function updateTime() {
    const now = new Date();
    
    // Update digital clock
    updateDigitalClock(now);
    
    // Update analog clock
    updateAnalogClock(now);
}

// Digital clock update
function updateDigitalClock(now) {
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    let ampm = '';
    
    // Handle 12-hour format
    if (!is24HourFormat) {
        ampm = hours >= 12 ? ' PM' : ' AM';
        hours = hours % 12;
        if (hours === 0) hours = 12;
    }
    
    // Format time with leading zeros
    const formattedTime = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}${ampm}`;
    timeDisplay.textContent = formattedTime;
    
    // Update date
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    dateDisplay.textContent = now.toLocaleDateString('en-US', options);
}

// Analog clock update
function updateAnalogClock(now) {
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    // Calculate angles for each hand
    const secondAngle = seconds * 6; // 360/60 = 6 degrees per second
    const minuteAngle = minutes * 6 + seconds * 0.1; // 6 degrees per minute + smooth transition
    const hourAngle = hours * 30 + minutes * 0.5; // 30 degrees per hour + smooth transition
    
    // Apply rotations to hands
    secondHand.style.transform = `rotate(${secondAngle}deg)`;
    minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
    hourHand.style.transform = `rotate(${hourAngle}deg)`;
}

// Utility function to pad numbers with leading zeros
function padZero(num) {
    return num.toString().padStart(2, '0');
}

// Add smooth second hand animation (optional enhancement)
function smoothSecondHand() {
    const now = new Date();
    const seconds = now.getSeconds();
    const milliseconds = now.getMilliseconds();
    
    // Calculate precise angle including milliseconds for ultra-smooth movement
    const secondAngle = (seconds + milliseconds / 1000) * 6;
    secondHand.style.transform = `rotate(${secondAngle}deg)`;
}

// Enhanced time update with smooth second hand (runs more frequently)
function startSmoothClock() {
    // Update digital clock and analog hour/minute hands every second
    setInterval(() => {
        const now = new Date();
        updateDigitalClock(now);
        
        const hours = now.getHours() % 12;
        const minutes = now.getMinutes();
        const minuteAngle = minutes * 6 + now.getSeconds() * 0.1;
        const hourAngle = hours * 30 + minutes * 0.5;
        
        minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
        hourHand.style.transform = `rotate(${hourAngle}deg)`;
    }, 1000);
    
    // Update second hand more frequently for smooth movement
    setInterval(smoothSecondHand, 50);
}

// Add hover effects for interactive elements
function addInteractiveEffects() {
    const analogClock = document.querySelector('.analog-clock');
    const digitalClock = document.querySelector('.digital-clock');
    
    // Add subtle hover effects to clocks
    [analogClock, digitalClock].forEach(clock => {
        if (clock) {
            clock.addEventListener('mouseenter', () => {
                clock.style.transform = 'scale(1.02)';
                clock.style.transition = 'transform 0.3s ease';
            });
            
            clock.addEventListener('mouseleave', () => {
                clock.style.transform = 'scale(1)';
            });
        }
    });
}

// Handle keyboard accessibility
function setupKeyboardHandlers() {
    document.addEventListener('keydown', (e) => {
        // Toggle theme with 'T' key
        if (e.key.toLowerCase() === 't') {
            toggleTheme();
        }
        
        // Toggle time format with 'F' key
        if (e.key.toLowerCase() === 'f') {
            toggleTimeFormat();
        }
        
        // Show help with 'H' key
        if (e.key.toLowerCase() === 'h') {
            showKeyboardHelp();
        }
    });
}

// Show keyboard shortcuts help
function showKeyboardHelp() {
    const helpText = `Keyboard Shortcuts:\n• T - Toggle theme\n• F - Toggle time format\n• H - Show this help`;
    alert(helpText);
}

// Add performance monitoring
function setupPerformanceMonitoring() {
    let frameCount = 0;
    let lastTime = performance.now();
    
    function measureFPS() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            // Only log FPS in development (you can remove this in production)
            // console.log(`Clock FPS: ${fps}`);
            frameCount = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(measureFPS);
    }
    
    requestAnimationFrame(measureFPS);
}

// Enhanced initialization
function enhancedInit() {
    // Basic initialization
    init();
    
    // Add enhanced features
    addInteractiveEffects();
    setupKeyboardHandlers();
    setupPerformanceMonitoring();
    
    // Use smooth clock instead of basic update
    clearInterval(updateTime); // Clear basic interval if it exists
    startSmoothClock();
    
    // Add loading animation completion
    document.body.classList.add('loaded');
}

// Error handling wrapper
function safeExecute(fn, context = 'Unknown') {
    try {
        return fn();
    } catch (error) {
        console.error(`Error in ${context}:`, error);
        // Fallback to basic functionality
        if (context === 'Enhanced features') {
            init(); // Fall back to basic initialization
        }
    }
}

// Check if DOM is ready and initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        safeExecute(enhancedInit, 'Enhanced initialization');
    });
} else {
    // DOM is already ready
    safeExecute(enhancedInit, 'Enhanced initialization');
}

// Export functions for potential external use (optional)
window.ClockApp = {
    toggleTheme,
    toggleTimeFormat,
    updateTime,
    isDarkMode: () => isDarkMode,
    is24HourFormat: () => is24HourFormat
};