/**
 * TIMELINE MODULE JAVASCRIPT
 * Isolated logic for rendering and controlling the timeline horizontal carousel.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Rely on timelineData being loaded before this script via HTML tag
    const timelineRoot = document.getElementById('timeline-module-root');
    if (!timelineRoot || typeof timelineData === 'undefined') return;

    // 1. Render the Base Structure
    timelineRoot.innerHTML = `
        <div class="tm-container">
            <div class="tm-header reveal">
                <div class="tm-icon"><i class="fa-solid fa-clock-rotate-left"></i></div>
                <h2 class="tm-title">Club Timeline</h2>
                <p class="tm-subtitle">A legacy of leadership and service.</p>
            </div>

            <div class="tm-track-wrapper reveal delay-1">
                <div class="tm-central-line"></div>
                <!-- Dynamic Content Goes Here -->
                <div class="tm-track" id="tmTrack"></div>
            </div>
        </div>
    `;

    // 2. Populate the Cards
    const track = document.getElementById('tmTrack');
    
    // Reverse data so newest (2025-26) appears first
    const reversedData = [...timelineData].reverse();
    
    reversedData.forEach((item, index) => {
        // Stagger every other card slightly up or down for visual interest
        const staggerClass = index % 2 === 0 ? 'tm-node-up' : 'tm-node-down';
        
        const cardDiv = document.createElement('div');
        cardDiv.className = `tm-item ${staggerClass}`;

        const safeYear = item.year.replace(/-/g, '&ndash;');
        let membersHTML = '';
        item.leaders.forEach(leader => {
            membersHTML += `<li><i class="fa-solid fa-caret-right tm-bullet"></i>${leader}</li>`;
        });

        cardDiv.innerHTML = `
            <div class="tm-dot"></div>
            <div class="tm-card">
                <div class="tm-card-year">${safeYear}</div>
                <ul class="tm-card-list">
                    ${membersHTML}
                </ul>
            </div>
        `;

        track.appendChild(cardDiv);
    });

    // 3. Attach Scroll Logic & Auto-Scroll
    const scrollAmount = 300; // Width of a card + gap

    // Auto-scroll mechanics
    let isAutoScrolling = true;
    let autoScrollId;
    const autoScrollSpeed = 1; // pixels per frame

    const startAutoScroll = () => {
        if (!isAutoScrolling) return;
        track.scrollLeft += autoScrollSpeed;
        
        // If we hit the end, smoothly loop or just bounce back/reset
        if (track.scrollLeft >= (track.scrollWidth - track.clientWidth - 5)) {
            // reset to start seamlessly
            track.scrollLeft = 0; 
        }
        autoScrollId = requestAnimationFrame(startAutoScroll);
    };

    const stopAutoScroll = () => {
        cancelAnimationFrame(autoScrollId);
    };

    // Pause auto-scroll on hover or interaction
    track.addEventListener('mouseenter', () => { isAutoScrolling = false; stopAutoScroll(); });
    track.addEventListener('mouseleave', () => { isAutoScrolling = true; startAutoScroll(); });
    track.addEventListener('touchstart', () => { isAutoScrolling = false; stopAutoScroll(); }, { passive: true });
    track.addEventListener('touchend', () => { 
        setTimeout(() => { isAutoScrolling = true; startAutoScroll(); }, 1000); 
    }, { passive: true });

    // Start auto-scroll initially
    startAutoScroll();

    if (track) {

        // Basic Drag-to-Scroll implementation
        let isDown = false;
        let startX;
        let scrollLeft;

        track.addEventListener('mousedown', (e) => {
            isDown = true;
            isAutoScrolling = false;
            stopAutoScroll();
            track.classList.add('tm-grabbing');
            startX = e.pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
        });

        track.addEventListener('mouseleave', () => {
            isDown = false;
            track.classList.remove('tm-grabbing');
        });

        track.addEventListener('mouseup', () => {
            isDown = false;
            track.classList.remove('tm-grabbing');
            setTimeout(() => { isAutoScrolling = true; startAutoScroll(); }, 2000);
        });

        track.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - track.offsetLeft;
            const walk = (x - startX) * 2; // Scroll speed multiplier
            track.scrollLeft = scrollLeft - walk;
        });
    }
});

