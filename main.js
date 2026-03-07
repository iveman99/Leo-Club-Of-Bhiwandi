document.addEventListener('DOMContentLoaded', () => {

    // Intersection Observer for Slide Activations and HUD Updates
    const docketContainer = document.getElementById('docket');
    const hudNav = document.querySelector('.hud-nav');
    const slides = document.querySelectorAll('.docket-slide');
    const navLinks = document.querySelectorAll('.hud-menu a');

    // Dynamic Navbar Scroll Effect
    if (docketContainer && hudNav) {
        docketContainer.addEventListener('scroll', () => {
            if (docketContainer.scrollTop > 50) {
                hudNav.classList.add('scrolled');
            } else {
                hudNav.classList.remove('scrolled');
            }
        });
    }

    const observerOptions = {
        root: document.getElementById('docket'),
        threshold: 0.15 // Lowered to 15% so very tall slides (like the Org Chart) will still trigger on small screens
    };

    const slideObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Update active link in HUD
                const activeId = entry.target.id;
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });

                // Trigger reveals within the active slide
                const reveals = entry.target.querySelectorAll('.reveal');
                reveals.forEach(r => r.classList.add('active'));
            } else {
                // Optionally remove active class when slide leaves to re-trigger on return
                const reveals = entry.target.querySelectorAll('.reveal');
                reveals.forEach(r => r.classList.remove('active'));
            }
        });
    }, observerOptions);

    slides.forEach(slide => slideObserver.observe(slide));

    // Cyber Accordion Logic
    const accButtons = document.querySelectorAll('.cy-acc-btn');
    accButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            this.classList.toggle('active');
            const icon = this.querySelector('.icon');
            icon.innerText = this.classList.contains('active') ? '-' : '+';

            const content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // Mobile Menu Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu on link click
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                navToggle.querySelector('i').classList.remove('fa-xmark');
                navToggle.querySelector('i').classList.add('fa-bars');
            });
        });
    }

    // === MEMBER SEARCH LOGIC ===
    const searchInput = document.getElementById('member-search');
    const membersTable = document.getElementById('members-table');

    if (searchInput && membersTable) {
        const rows = membersTable.querySelectorAll('tbody tr');

        searchInput.addEventListener('input', function (e) {
            const searchTerm = e.target.value.toLowerCase().trim();

            rows.forEach(row => {
                const firstName = row.cells[2].textContent.toLowerCase();
                const lastName = row.cells[3].textContent.toLowerCase();

                if (firstName.includes(searchTerm) || lastName.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    // === MODULE TIMELINE: HORIZONTAL SCROLL OBSERVER AND AUTO-SCROLL ===
    const timelineContainer = document.getElementById('timelineScroll');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineSection = document.getElementById('module-timeline');

    if (timelineContainer && timelineItems.length > 0) {
        // We observe each timeline-item inside the timelineContainer
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const node = entry.target.querySelector('.timeline-node');
                if (entry.isIntersecting) {
                    // Item is well within the scroll view
                    if (node) node.classList.add('active');
                } else {
                    // Item left the scroll view
                    if (node) node.classList.remove('active');
                }
            });
        }, {
            root: timelineContainer, // Use the scrollable container as viewport
            threshold: 0.6 // Trigger when 60% of the item is visible
        });

        timelineItems.forEach(item => {
            timelineObserver.observe(item);
        });

        // Auto-scroll logic using requestAnimationFrame for smoother performance
        let autoScrollReqId;
        let isHovered = false;
        let scrollSpeed = 1; // Must be integer; fractional pixels get truncated to 0 in scrollLeft

        const startAutoScroll = () => {
            if (!autoScrollReqId) {
                const scrollStep = () => {
                    if (!isHovered && timelineContainer) {
                        timelineContainer.scrollLeft += scrollSpeed;

                        // Check if we reached the end
                        // Added a small buffer for browser rounding issues
                        if (timelineContainer.scrollLeft >= (timelineContainer.scrollWidth - timelineContainer.clientWidth - 5)) {
                            isHovered = true; // Temporary pause
                            setTimeout(() => {
                                // Reset to start smoothly
                                timelineContainer.scrollTo({ left: 0, behavior: 'smooth' });
                                setTimeout(() => {
                                    isHovered = false;
                                }, 500); // wait for smooth scroll to finish
                            }, 1000); // pause at end duration
                        }
                    }
                    autoScrollReqId = requestAnimationFrame(scrollStep);
                };
                autoScrollReqId = requestAnimationFrame(scrollStep);
            }
        };

        const stopAutoScroll = () => {
            if (autoScrollReqId) {
                cancelAnimationFrame(autoScrollReqId);
                autoScrollReqId = null;
            }
        };

        // Pause on interaction
        timelineContainer.addEventListener('mouseenter', () => isHovered = true);
        timelineContainer.addEventListener('mouseleave', () => isHovered = false);
        timelineContainer.addEventListener('touchstart', () => isHovered = true, { passive: true });
        timelineContainer.addEventListener('touchend', () => { setTimeout(() => isHovered = false, 1000); }, { passive: true });
        // Also pause if the user is actively scrolling it manually
        timelineContainer.addEventListener('wheel', () => {
            isHovered = true;
            setTimeout(() => { isHovered = false; }, 1000);
        }, { passive: true });

        // Only auto-scroll when section is in view
        if (timelineSection) {
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        startAutoScroll();
                    } else {
                        stopAutoScroll();
                    }
                });
            }, { threshold: 0.1 }); // lowered threshold so it starts earlier
            sectionObserver.observe(timelineSection);
        }
    }

    // === MODULE 5: IMPACT COUNTER ANIMATION ===
    const impactCards = document.querySelectorAll('.impact-card');

    if (impactCards.length > 0) {
        const animateCounter = (el) => {
            const target = +el.getAttribute('data-target');
            if (el.classList.contains('counted')) return;

            const duration = 2000; // 2 seconds
            const startTime = performance.now();

            const updateCounter = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);

                // Ease out cubic
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const currentCount = Math.floor(easeProgress * target);

                if (currentCount >= 1000) {
                    el.innerText = currentCount.toLocaleString('en-IN');
                } else {
                    el.innerText = currentCount;
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    el.innerText = target.toLocaleString('en-IN');
                    el.classList.add('counted');
                }
            };

            requestAnimationFrame(updateCounter);
        };

        const impactObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    const counterElement = entry.target.querySelector('.counter-num');
                    if (counterElement) {
                        animateCounter(counterElement);
                    }
                }
            });
        }, { threshold: 0.3 });

        impactCards.forEach(card => {
            impactObserver.observe(card);
        });
    }

    // === MODULE PRESIDENT: PARALLAX & SIGNATURE ===
    const parallaxPhoto = document.querySelector('.parallax-photo');
    const presidentFrame = document.querySelector('.president-frame');

    if (parallaxPhoto && presidentFrame) {
        window.addEventListener('scroll', () => {
            const rect = presidentFrame.getBoundingClientRect();
            // Check if the frame is mostly in view
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                // Calculate scroll distance relative to the element's position
                // As rect.top goes from window.innerHeight to 0, move the photo down
                // The photo is 120% height and starts at -10% top.
                // We want to translate it slightly as the user scrolls.
                const scrollProgress = 1 - (rect.top / window.innerHeight);
                // scrollProgress goes from 0 (just appeared at bottom) to 1 (at top of screen)
                // We map this to a gentle translateY. 
                // e.g., move it from -10px to +10px
                const yOffset = (scrollProgress * 30) - 15;
                parallaxPhoto.style.transform = `translateY(${yOffset}px)`;
            }
        });
    }

    const signatureContainer = document.querySelector('.signature-anim-container');
    const signaturePath = document.querySelector('.signature-path');
    if (signatureContainer && signaturePath) {
        const signatureObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    signaturePath.classList.add('draw');
                    signatureObserver.unobserve(entry.target); // Only draw once
                }
            });
        }, { threshold: 0.5 });
        signatureObserver.observe(signatureContainer);
    }

    // === HERO CINEMATIC SEQUENCE ===
    const globeViz = document.getElementById('globeViz');
    if (globeViz && typeof Globe !== 'undefined') {
        // Initialize Globe
        const world = Globe()
            (globeViz)
            .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
            .backgroundColor('#000000') // Dark space
            .pointOfView({ lat: 20, lng: 0, altitude: 2.5 }); // Initial view over Atlantic/Africa

        // Auto-rotate
        world.controls().autoRotate = true;
        world.controls().autoRotateSpeed = 2.0;

        // Remove zoom/pan interaction during intro
        world.controls().enableZoom = false;

        // Conflict Zones Rings Configuration
        const conflictZones = [
            { lat: 31.5, lng: 34.8, maxR: 8, color: '#ff4b4b' }, // Middle East
            { lat: 49.0, lng: 31.4, maxR: 10, color: '#ff4b4b' }  // Eastern Europe
        ];

        // Ring settings
        world.ringsData(conflictZones)
            .ringColor('color')
            .ringMaxRadius('maxR')
            .ringPropagationSpeed(3)
            .ringRepeatPeriod(800);

        // Sequence Elements
        const text1 = document.getElementById('hero-text-1');
        const text2 = document.getElementById('hero-text-2');
        const text3 = document.getElementById('hero-text-3');
        const text4 = document.getElementById('hero-text-4');
        const finalState = document.getElementById('hero-final');
        const glowOverlay = document.getElementById('golden-glow-overlay');
        const logoSlices = document.querySelectorAll('.hero-logo-slice');
        const pin = document.getElementById('hero-pin');
        const particleLogo = document.getElementById('hero-particle-logo');

        // Helper to show/fade text sequentially
        const showFadeText = (element, delayIn, delayOut) => {
            setTimeout(() => { if (element) element.classList.add('visible'); }, delayIn);
            setTimeout(() => { if (element) element.classList.remove('visible'); }, delayOut);
        };

        const scene = world.scene();
        let directionalLight = scene.children.find(o => o.type === 'DirectionalLight');
        let ambientLight = scene.children.find(o => o.type === 'AmbientLight');

        // Step 1: Global View (0s - 4s)
        showFadeText(text1, 500, 3500);

        // Step 2: India Focus (4s)
        setTimeout(() => {
            world.pointOfView({ lat: 20.59, lng: 78.96, altitude: 1.2 }, 2500);
            if (directionalLight) {
                directionalLight.color.setHex(0xd4a017); // Leo gold
                directionalLight.intensity = 2.5;
            }
            if (ambientLight) {
                ambientLight.color.setHex(0x2ac3ff); // Neon blue
                ambientLight.intensity = 1.0;
            }
            world.ringsData([]); // Remove conflict zones
            showFadeText(text2, 1000, 3500); // Relative to 4s: appears at 5s, hides at 7.5s
        }, 4000);

        // Step 3: Bhiwandi Location (8s)
        setTimeout(() => {
            if (pin) pin.classList.add('visible');
        }, 8000);

        // Step 4: Service Impact Waves (11s)
        setTimeout(() => {
            showFadeText(text3, 500, 7500); // appears 11.5s, hides 18.5s (stays through step 5)

            // Add Service Waves
            const serviceWaves = [
                { lat: 19.3, lng: 73.06, maxR: 12, color: '#d4a017' } // Bhiwandi coords
            ];

            world.ringsData(serviceWaves)
                .ringColor('color')
                .ringMaxRadius('maxR')
                .ringPropagationSpeed(2)
                .ringRepeatPeriod(1000);
        }, 11000);

        // Step 5: Service Network Map (14s)
        setTimeout(() => {
            const networkArcs = [
                { startLat: 19.3, startLng: 73.06, endLat: 19.21, endLng: 72.97, color: '#2ac3ff' }, // Thane
                { startLat: 19.3, startLng: 73.06, endLat: 19.65, endLng: 73.14, color: '#2ac3ff' }, // Wada
                { startLat: 19.3, startLng: 73.06, endLat: 19.08, endLng: 72.91, color: '#2ac3ff' }  // Ghatkopar
            ];
            const networkNodes = [
                { lat: 19.21, lng: 72.97, label: 'Thane', color: '#2ac3ff' },
                { lat: 19.65, lng: 73.14, label: 'Wada', color: '#2ac3ff' },
                { lat: 19.08, lng: 72.91, label: 'Ghatkopar', color: '#2ac3ff' }
            ];

            world.arcsData(networkArcs)
                .arcColor('color')
                .arcDashLength(0.4)
                .arcDashGap(0.2)
                .arcDashInitialGap(() => Math.random())
                .arcDashAnimateTime(1500);

            world.labelsData(networkNodes)
                .labelLat('lat')
                .labelLng('lng')
                .labelText('label')
                .labelSize(1.5)
                .labelDotRadius(0.5)
                .labelColor('color')
                .labelResolution(2);
        }, 14000);

        // Step 6: Particle Leo Logo (18s)
        setTimeout(() => {
            if (pin) pin.classList.remove('visible'); // hide pin
            if (particleLogo) particleLogo.classList.add('visible');
        }, 18000);

        // Step 7: Final Message (22s)
        setTimeout(() => {
            if (particleLogo) particleLogo.classList.remove('visible');
            world.ringsData([]); // Remove service waves
            world.arcsData([]);  // Remove network lines
            world.labelsData([]); // Remove network nodes
            showFadeText(text4, 500, 4500); // appears 22.5s, hides 27s
        }, 22000);

        // Step 8 & 9: Landing Page Reveal (27s)
        setTimeout(() => {
            if (glowOverlay) glowOverlay.classList.add('active'); // dim globe slightly
            if (finalState) finalState.classList.add('visible');

            // Reveal logos sequentially
            logoSlices.forEach((logo, index) => {
                setTimeout(() => {
                    logo.classList.add('visible');
                }, index * 200);
            });

            // Do NOT re-enable zoom, let user scroll freely
            world.controls().enableZoom = false;
            world.controls().autoRotate = false;
        }, 27000);

        // Window resize handling
        window.addEventListener('resize', () => {
            if (globeViz.clientWidth && globeViz.clientHeight) {
                world.width(globeViz.clientWidth);
                world.height(globeViz.clientHeight);
            }
        });

        // Initial setup for sizing based on current container
        if (globeViz.clientWidth && globeViz.clientHeight) {
            world.width(globeViz.clientWidth);
            world.height(globeViz.clientHeight);
        }
    }

});
