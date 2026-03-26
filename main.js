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

    // === MODULE 7: RESOLUTION PARCHMENT UNROLL ===
    const parchmentScroll = document.querySelector('.parchment-scroll');
    if (parchmentScroll) {
        const parchmentObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    parchmentScroll.classList.add('active');
                    parchmentObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        parchmentObserver.observe(parchmentScroll);
    }

    // === HERO CINEMATIC SEQUENCE ===
    const globeViz = document.getElementById('globeViz');
    if (globeViz && typeof Globe !== 'undefined') {
        document.body.classList.add('war-zone'); // ADD EXTREME WAR VISUALS
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

        // Global Volatility Configuration (More Crazy Graphics)
        const volatilityZones = [
            { lat: 35.0, lng: 35.0, maxR: 12, color: '#ff4b4b' }, // Middle East / Mediterranean
            { lat: 50.0, lng: 25.0, maxR: 15, color: '#ff4b4b' }, // Eastern Europe
            { lat: 15.0, lng: 30.0, maxR: 10, color: '#ff4b4b' }, // Symbolic instability
            { lat: 45.0, lng: -100.0, maxR: 18, color: '#ff4b4b' }, // North America Conflict
            { lat: -10.0, lng: -60.0, maxR: 14, color: '#ff4b4b' }, // South America Conflict
            { lat: 35.0, lng: 105.0, maxR: 16, color: '#ff4b4b' } // East Asia Conflict
        ];

        // Pulsating abstract rings representing global shifts/volatility
        world.ringsData(volatilityZones)
            .ringColor('color')
            .ringMaxRadius('maxR')
            .ringPropagationSpeed(3)
            .ringRepeatPeriod(600);

        // Remove literal labels
        world.labelsData([]);

        // Mass Combat Visuals: Hundreds of missiles for "Crazy Graphics"
        const conflictArcs = [];
        // Generate 150 random high-speed arcs concentrated in conflict zones
        for (let i = 0; i < 150; i++) {
            const isMidEast = Math.random() > 0.4;
            const startLat = isMidEast ? 20 + Math.random() * 20 : 40 + Math.random() * 20;
            const startLng = isMidEast ? 30 + Math.random() * 30 : 10 + Math.random() * 30;
            const endLat = startLat + (Math.random() - 0.5) * 15;
            const endLng = startLng + (Math.random() - 0.5) * 15;
            conflictArcs.push({
                startLat, startLng, endLat, endLng, 
                color: Math.random() > 0.5 ? '#ff0000' : '#ffaa00'
            });
        }
        
        // Render extreme combat missiles
        world.arcsData(conflictArcs)
            .arcColor('color')
            .arcDashLength(0.15) // Shorter, faster dashes
            .arcDashGap(0.1)
            .arcDashInitialGap(() => Math.random())
            .arcDashAnimateTime(400) // Much faster flight time!
            .arcStroke(1.2); 

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

        const audioWar = document.getElementById('audio-war');
        const audioPeace = document.getElementById('audio-peace');
        const audioEntry = document.getElementById('audio-entry');
        const audioHover = document.getElementById('audio-hover');
        const initOverlay = document.getElementById('init-overlay');
        const initBtn = document.getElementById('init-btn');

        if (initBtn) {
            initBtn.addEventListener('mouseenter', () => {
                if(audioHover) {
                    audioHover.currentTime = 0;
                    audioHover.volume = 0.3;
                    audioHover.play().catch(e => {});
                }
            });

            initBtn.addEventListener('click', () => {
                if(audioEntry) {
                    audioEntry.volume = 0.8;
                    audioEntry.play().catch(e => console.log('Audio blocked:', e));
                }
                
                // Crazy Animation: Intense shake during glitch
                document.body.style.animation = "textGlitch 0.3s 4";
                
                // Add creative visual transition classes
                initOverlay.classList.add('entry-glitch-active');
                initOverlay.classList.add('entry-zoom-out');
                
                setTimeout(() => {
                    initOverlay.style.display = 'none';
                    if(audioWar) {
                        audioWar.volume = 0.5;
                        audioWar.play().catch(e => console.log('Audio blocked:', e));
                    }
                    startCinematicSequence();
                }, 1200);
            });
        } else {
            startCinematicSequence();
        }

        function startCinematicSequence() {
        // Step 1: Global View (0s - 7.5s)
        showFadeText(text1, 500, 7000);

        // Step 2: India Focus (7.5s)
        setTimeout(() => {
            document.body.classList.remove('war-zone'); // RESTORE PEACE
            
            // Audio Transition
            if (audioWar) {
                let vol = audioWar.volume;
                const fadeOut = setInterval(() => {
                    vol -= 0.05;
                    if (vol <= 0) { clearInterval(fadeOut); audioWar.pause(); } 
                    else { audioWar.volume = vol; }
                }, 100);
            }
            if (audioPeace) {
                audioPeace.volume = 0;
                audioPeace.play().catch(e => console.log('Audio blocked:', e));
                let vol = 0;
                const fadeIn = setInterval(() => {
                    vol += 0.05;
                    if (vol >= 0.5) clearInterval(fadeIn);
                    else audioPeace.volume = vol;
                }, 100);
            }

            world.pointOfView({ lat: 20.59, lng: 78.96, altitude: 1.2 }, 2500);
            if (directionalLight) {
                directionalLight.color.setHex(0xd4a017); // Leo gold
                directionalLight.intensity = 2.5;
            }
            if (ambientLight) {
                ambientLight.color.setHex(0x2ac3ff); // Neon blue
                ambientLight.intensity = 1.0;
            }
            // Keep global conflict active, introduce festive Peace/Growth rings over India
            const indiaFestiveZones = [
                { lat: 28.70, lng: 77.10, maxR: 6, color: '#16a34a' }, // Delhi Green Growth
                { lat: 19.07, lng: 72.87, maxR: 8, color: '#d4a017' }, // Mumbai Gold Peace
                { lat: 12.97, lng: 77.59, maxR: 7, color: '#ffffff' }, // Bangalore Bright Core
                { lat: 22.57, lng: 88.36, maxR: 6, color: '#2ac3ff' }  // Kolkata Vibrant Blue
            ];
            world.ringsData([...volatilityZones, ...indiaFestiveZones]); // Keep conflict active!
            world.labelsData([]); // Keep conflict labels empty
            // Deliberately letting conflict arcs (missiles) continue running in background
            showFadeText(text2, 1000, 4500); // Relative to 7.5s: appears at 8.5s, hides at 13.0s
        }, 7500);

        // Step 3: Bhiwandi Location (13s)
        setTimeout(() => {
            if (pin) pin.classList.add('visible');
        }, 13000);

        // Step 4: Service Impact Waves (14.5s)
        setTimeout(() => {
            showFadeText(text3, 500, 6000); // appears 15s, hides 21s (stays through step 5)

            // Add Service Waves (Keep global volatility, boost local impact)
            const serviceWaves = [
                { lat: 19.07, lng: 72.87, maxR: 15, color: '#d4a017' }, // Mumbai focus strong
                { lat: 23.02, lng: 72.57, maxR: 10, color: '#16a34a' }  // Secondary growth node
            ];

            world.ringsData([...volatilityZones, ...serviceWaves])
                .ringColor('color')
                .ringMaxRadius('maxR')
                .ringPropagationSpeed(2)
                .ringRepeatPeriod(1000);
        }, 14500);

        // Step 5: Growth Network Map (17s)
        setTimeout(() => {
            const networkArcs = [
                { startLat: 19.07, startLng: 72.87, endLat: 28.70, endLng: 77.10, color: '#2ac3ff' }, // Mumbai -> Delhi (Tech Connect)
                { startLat: 19.07, startLng: 72.87, endLat: 12.97, endLng: 77.59, color: '#16a34a' }, // Mumbai -> Bangalore (Growth)
                { startLat: 19.07, startLng: 72.87, endLat: 23.02, endLng: 72.57, color: '#d4a017' }, // Mumbai -> Ahmedabad (Gold/Festive)
                { startLat: 28.70, startLng: 77.10, endLat: 22.57, endLng: 88.36, color: '#d4a017' } // Delhi -> Kolkata
            ];

            // Abstract nodes representing thriving hubs, no explicit labels needed because the text conveys it.
            const abstractNodes = [
                { lat: 28.70, lng: 77.10, size: 0.8, color: '#2ac3ff' }, // Delhi
                { lat: 12.97, lng: 77.59, size: 1.0, color: '#16a34a' }, // Bangalore
                { lat: 23.02, lng: 72.57, size: 1.2, color: '#d4a017' }, // Ahmedabad
                { lat: 22.57, lng: 88.36, size: 0.9, color: '#facc15' }  // Kolkata
            ];

            world.arcsData(networkArcs)
                .arcColor('color')
                .arcDashLength(0.6)
                .arcDashGap(0.3)
                .arcDashInitialGap(() => Math.random())
                .arcDashAnimateTime(2000); // Slower, more elegant arcs

            // Repurpose labelsData point rendering for abstract glowing hubs
            world.labelsData(abstractNodes)
                .labelLat('lat')
                .labelLng('lng')
                .labelText(() => '') // Clear text, just the glowing dot
                .labelDotRadius('size')
                .labelColor('color')
                .labelResolution(2);
        }, 17000);

        // Step 6: Particle Leo Logo (21s)
        setTimeout(() => {
            if (pin) pin.classList.remove('visible'); // hide pin
            if (particleLogo) particleLogo.classList.add('visible');
        }, 21000);

        // Step 7: Final Message (23.5s)
        setTimeout(() => {
            if (particleLogo) particleLogo.classList.remove('visible');
            // Deliberately NOT removing the rings/arcs so they persist globally
            showFadeText(text4, 500, 4500); // appears 24s, hides 28.5s
        }, 23500);

        // Step 8 & 9: Landing Page Reveal (28.5s)
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
            // Keep the globe spinning continuously as a background!
            world.controls().autoRotate = true;
            world.controls().autoRotateSpeed = 0.5; // Slow down for gentle background spinning
        }, 28500);
        } // End startCinematicSequence()

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

    // === SITE-WIDE CRAZY GRAPHICS TSPARTICLES BACKGROUND ===
    if (typeof tsParticles !== 'undefined') {
        // Particles for the Initialization screen
        tsParticles.load("init-particles", {
            background: { color: { value: "transparent" } },
            fpsLimit: 60,
            particles: {
                color: { value: ["#ffaa00", "#2ac3ff", "#ffffff"] },
                links: { enable: false },
                move: { direction: "none", enable: true, random: true, speed: 2.5, straight: false },
                number: { density: { enable: true, area: 800 }, value: 80 },
                opacity: { value: { min: 0.2, max: 0.8 }, animation: { enable: true, speed: 1, minimumValue: 0.2 } },
                shape: { type: "circle" },
                size: { value: { min: 1, max: 3 }, animation: { enable: true, speed: 2, minimumValue: 0.1 } }
            },
            detectRetina: true
        });

        tsParticles.load("particles-overlay", {
            background: { color: { value: "transparent" } },
            fpsLimit: 60,
            interactivity: { events: { onHover: { enable: true, mode: "repulse" }, resize: true }, modes: { repulse: { distance: 100, duration: 0.4 } } },
            particles: {
                color: { value: ["#ff4b4b", "#10b981", "#d4a017", "#2ac3ff"] },
                links: { color: "random", distance: 150, enable: true, opacity: 0.3, width: 2 },
                move: { direction: "top", enable: true, outModes: { default: "out" }, random: true, speed: 2.5, straight: false },
                number: { density: { enable: true, area: 800 }, value: 150 }, // High density for crazy visuals
                opacity: { value: { min: 0.1, max: 0.7 } },
                shape: { type: ["circle", "triangle", "edge"] },
                size: { value: { min: 1, max: 5 } }
            },
            detectRetina: true
        });
    }

    // === MODULE QUESTIONNAIRE: DYNAMIC DATA & FILTERING ===
    const qnaData = [
        // CLUB OVERVIEW & VISION
        { category: "overview", question: "1. Club Vision & Theme (Leoistic Year 2025–26)", answer: "Our vision for this Leoistic year is 'Strength in Unity, Service with Impact.' Inspired by the interconnected hands in our logo, we aim to build a club where every member contributes towards meaningful community service. Our focus is on empowering individuals, uplifting communities, and standing together as one strong force of change, truly living our motto: 'Be the hand that helps them stand.'" },
        { category: "overview", question: "2. Significant Changes Introduced as President", answer: "<ul><li>Enhanced Service Quality – Prioritizing meaningful and high-impact service activities.</li><li>Ex-Leo Engagement – Actively involving Ex-Leos for mentorship.</li><li>Stronger Parent Club Collaboration – Building closer coordination with Lions Club of Bhiwandi.</li><li>Structured Teamwork – Assigning clear roles for smoother execution.</li><li>Member Development – Encouraging leadership among all members.</li></ul>" },
        { category: "overview", question: "3. What Makes Our Club Unique", answer: "<ul><li>Strong Service Legacy.</li><li>Ex-Leo Support System.</li><li>Excellent Bond with Parent Club.</li><li>Unity & Bonding.</li><li>Consistency & Commitment in community service.</li></ul>" },
        { category: "overview", question: "4. Office Bearers – Roles & Tenure (2025–26)", answer: "Tenure: Leoistic Year 2025–2026." },

        // SECRETARIAL REPORT & ADMIN
        { category: "secretarial", question: "1. Are all club members reported to Lions International via the MyLCI Platform?", answer: "Yes." },
        { category: "secretarial", question: "2. How many Board Meetings, and General/Regular Meetings were Conducted?", answer: "10." },
        { category: "secretarial", question: "3. Were minutes recorded and circulated on time? Attach samples.", answer: "Yes." },
        { category: "secretarial", question: "4. Describe your internal communication system (WhatsApp, email, etc.).", answer: "Our club follows a structured and active communication system. WhatsApp as Primary Platform for quick updates. Pre-Activity Communication detailing roles. Regular Reminders sent. Post-Activity Reporting shared highlighting outcomes. Content & Visibility actively created." },
        { category: "secretarial", question: "5. How is documentation maintained (Google Drive / Physical files)?", answer: "A hybrid system: Dedicated Google Account created for digital safety, and a Physical Record Book maintained for official documentation." },
        { category: "secretarial", question: "6. Have reports been uploaded on time on the Leo Portal?", answer: "Yes." },
        { category: "secretarial", question: "7. Challenges faced in secretarial operations and how they were Resolved.", answer: "Challenge: Delays in collecting activity reports. Solution: Event chairpersons submit details immediately. Challenge: Communication gaps. Solution: Clear messaging formats with reminders." },
        { category: "secretarial", question: "8. Innovations introduced by the Secretary this year.", answer: "Real-Time Post Activity Updates: Key details, metrics, and summaries are shared immediately after each activity." },
        { category: "secretarial", question: "9. Attach monthly activity reports and attendance records.", answer: "Attached in activities section." },
        { category: "secretarial", question: "10. Have you participated in any of the District Secretary Team Initiatives?", answer: "No." },
        { category: "secretarial", question: "11. Is the Monthly Membership and Activity Report (MMAR) submitted to the District on time? before the 3rd of every month.", answer: "Yes." },

        // TREASURY & FINANCIAL MANAGEMENT
        { category: "treasury", question: "1. Does the club have a bank account? If yes, carry a physical copy of the account statement during the DP visit.", answer: "We need to discuss this. Our club does not have an administrative account, but we do have a service account which has not been used throughout the year. In the last BD meeting, it was decided to close that account and open a new one at a nearby location." },
        { category: "treasury", question: "2. Opening balance at the start & current closing balance", answer: "Opening balance: 27,097. Closing balance: 9,006." },
        { category: "treasury", question: "3. Add Budget Sheet in Docket which was submitted to District", answer: "Attached." },
        { category: "treasury", question: "4. Total funds raised during the term", answer: "No funds were raised during the term." },
        { category: "treasury", question: "5. Any pending dues/Reimbursement", answer: "We are expecting to receive a pending reimbursement amount from the district via Umang." },
        { category: "treasury", question: "6. Any financial challenge faced by the club", answer: "As of now, we have not faced any financial challenges due to minimal events. Please add if anything is missing." },
        { category: "treasury", question: "7. Is a file of all accounts, bills, and receipts maintained and updated?", answer: "Yes, all accounts, bills, and receipts are properly maintained and updated." },
        { category: "treasury", question: "8. Are the treasury reports submitted to the District regularly?", answer: "Yes, treasury reports are submitted to the District regularly." },

        // MEMBERSHIP DEVELOPMENT
        { category: "membership", question: "1. What is the annual subscription fee per member?", answer: "Rs 1500." },
        { category: "membership", question: "2. Retention strategies used to reduce dropouts.", answer: "Mentorship from Ex-Leos, Strong Support from Parent Club, Consistent Communication & Follow-ups." },
        { category: "membership", question: "3. Member participation percentage across events.", answer: "35%." },
        { category: "membership", question: "4. How are inactive members handled?", answer: "Personal follow-ups to understand reasons for inactivity. Encouraging their closest friends in the club to motivate and reconnect them." },
        { category: "membership", question: "5. Success stories of member growth.", answer: "Several members have improved their communication, confidence, and teamwork skills through active participation. With guidance from Ex-Leos and Lions Club, members have gained exposure and a strong sense of responsibility." },
        { category: "membership", question: "6. Plans for future membership expansion.", answer: "An orientation with college students is planned and is in pipeline." },
        { category: "membership", question: "7. What is the status of the club’s total collection as of 7 days before the District President’s visit?", answer: "Receivable: Rs. ____ Received: Rs. ____ Outstanding Balance: Rs. ____" },
        { category: "membership", question: "8. Is the revenue from membership subscriptions sufficient to meet the club's expenses?", answer: "Yes, anyways we get good support from our Past Presidents and Ex Leos, who are still Leos by heart." },
        { category: "membership", question: "9. What benefits are offered to the members in return for their membership dues?", answer: "Club Merchandise, Leadership & Growth Opportunities, Networking & Mentorship, and Participation in Service Activities." },
        { category: "membership", question: "10. How many members represent the club in the District’s Executive Council?", answer: "5." },
        { category: "membership", question: "11. Is there a designated Membership Director?", answer: "No." },
        { category: "membership", question: "12. Are there any Leo-Lion members in the club?", answer: "Yes. 1. Leo Ln Sneha Adep 2. Leo Ln Srikanth Yelle 3. Leo Ln Rahul Dudam 4. Leo Ln Varsha Sircilla 5. Leo Ln Vivek Butla." },
        { category: "membership", question: "13. How many Alpha members are part of the club?", answer: "0." },
        { category: "membership", question: "14. Membership Statistics (as of 7 days prior to the DP visit):", answer: "Opening as of 1st July 2025: ____ Additions during the period: ____ Retained members: ____ Droppage during the period: ____ Closing balance: ____." },

        // LEADERSHIP
        { category: "leadership", question: "1. Total Leadership activities conducted, mention 3 best.", answer: "1. Canva Workshop: A highly practical session where members learned design skills, content creation, and improved their digital creativity." },
        { category: "leadership", question: "2. Leadership roles held by members at Club/District/Multiple level.", answer: "Canva Workshop by Leo Namra Gada." },
        { category: "leadership", question: "3. Internal leadership grooming initiatives.", answer: "Canva Workshop." },
        { category: "leadership", question: "4. How does the club motivate the members to take up event chairperson opportunity/responsibilities?", answer: "Encouragement & Personal Push from core team, and a Support System providing guidance from Past Presidents and Ex-Leos." },
        { category: "leadership", question: "5. How do club leaders/club recognise and appreciate the efforts of members/chairpersons?", answer: "Public Recognition in WhatsApp groups and social media. Verbal Appreciation during meetings." },
        { category: "leadership", question: "6. Does the club have a GLT (Global Leadership Team) Director?", answer: "Yes." },
        { category: "leadership", question: "7. Does the club have any leadership events in the pipeline?", answer: "Yes, Leadership Interaction Sessions invoking experienced Ex-Leos and Lions Club members to share insights." },
        { category: "leadership", question: "8. Are event chairpersons appointed for specific events and Activities?", answer: "Yes." },
        { category: "leadership", question: "9. Have any guest speakers been invited to conduct the events?", answer: "No." },
        { category: "leadership", question: "10. Are you aware of “Closed Door Meeting” at the club level?", answer: "Yes. Internal discussion among core members, evaluation, and finalization through mutual consensus. Scheduled Date: 25th April 2026." },

        // SERVICE ACTIVITIES & SOCIAL IMPACT
        { category: "service", question: "1. Total number of service activities conducted, mention 3 best activities in detail.", answer: "Total Activities: 30. 1) Blood Donation Camp (200+ bottles). 2) Project Aashirwaad (Visit to Vanaprasthi Ashram). 3) Project Dhristi (Eye check-up camp for 400+ students)." },
        { category: "service", question: "2. Categorization (as per all service areas).", answer: "Hunger Relief, Health & Vision, Youth Development, Environment, Humanitarian Service." },
        { category: "service", question: "3. Total beneficiaries served.", answer: "Total Beneficiaries: 2,386+ people." },
        { category: "service", question: "4. How many members attend the service projects on an average?", answer: "On average, 10–15 members actively participate." },
        { category: "service", question: "5. Flagship service project of the year (details).", answer: "Blood Donation Camp. Annual signature event, 200+ blood units collected, strong volunteer coordination." },
        { category: "service", question: "6. Community needs identified and addressed.", answer: "Healthcare, Hunger & Basic Needs, Education Support, Environmental Concerns, Support for Underprivileged." },
        { category: "service", question: "7. Collaborations with NGOs / schools / hospitals (mention 3)", answer: "Lions Club of Bhiwandi, Government Schools (Dandekar, School No. 59, Umbar Bandhan), Mathrychaya Balika Ashram." },
        { category: "service", question: "8. Sustainable or long-term service initiatives.", answer: "Annual Blood Donation Camp, Project Aashirwaad, Tree Plantation Drives, Vanrai Bandhara." },
        { category: "service", question: "9. Response or feedback from the community.", answer: "Highly positive. Beneficiaries appreciated the consistent efforts and impactful activities." },
        { category: "service", question: "10. Attach 10 best Photos, reports, and impact metrics.", answer: "Attached above." },

        // PERMANENT & CONTINUOUS PROJECTS (Mapped under service)
        { category: "service", question: "1. Does the club have any existing permanent projects?", answer: "Yes: Blood Donation Camp, Project Aashirwaad, Gaushala Visits." },
        { category: "service", question: "2. Are there any new permanent projects executed or planned for this Leoistic year?", answer: "Project Sehat – Focused on menstrual hygiene awareness among young girls." },
        { category: "service", question: "3. Does the club organize any continuous activities?", answer: "Food distribution (Annadanam), Donation drives, Community support initiatives as per need." },

        // FUNDRAISING DRIVES
        { category: "fundraising", question: "1. Has the club undertaken any major fundraising drives?", answer: "None completed yet." },
        { category: "fundraising", question: "2. Are there plans for any upcoming fundraising activities?", answer: "Yes: Open Turf Tournament on 26th April 2026. Objective: Generate funds through participation and sponsorships for future service projects." },
        { category: "fundraising", question: "3. Does the club provide receipts to the donors?", answer: "Yes, ensuring transparency and maintaining proper financial records." },

        // IMAGE BUILDING & PUBLIC RELATIONS
        { category: "pr", question: "1. Which social media platforms is the club active on?", answer: "Instagram." },
        { category: "pr", question: "2. Total Social Media Initiatives. Describe any 2", answer: "0." },
        { category: "pr", question: "3. Best-performing post/reel and why.", answer: "Reel featuring our Sports Head, Leo Rakesh Kunden, during the Installation Ceremony. Viral with 14.1K views due to his charismatic performance and high-quality editing." },
        { category: "pr", question: "4. Attach screenshots of the instagram page.", answer: "Attached." },
        { category: "pr", question: "5. Are these platforms updated regularly?", answer: "Yes." },
        { category: "pr", question: "6. How does the club leverage social media?", answer: "Posting reels, photos, and updates to highlight service work and increase visibility." },
        { category: "pr", question: "7. Did you receive any membership growth from your digital presence?", answer: "Yes, 2 members joined via Instagram." },

        // FELLOWSHIP & MEMBER BONDING
        { category: "fellowship", question: "1. Total fellowship events conducted. Mention 3 best.", answer: "Multiple activities. Best 3: Potluck & Power Meet, Housie Night, and Lion-Leo Cricket Battle (LLCB)." },
        { category: "fellowship", question: "2. Average attendance percentage.", answer: "40–50%." },
        { category: "fellowship", question: "3. Innovative or unique fellowship ideas executed.", answer: "Potluck Meetings, Housie Night with Planning, Leo-Lion Combined Events." },
        { category: "fellowship", question: "4. Member feedback on fellowship activities.", answer: "Very positive: strong bonding, enjoyable interactions, better connection with peers." },
        { category: "fellowship", question: "5. Has the club conducted any inter/intra district fellowship activities?", answer: "No." },

        // PARENT CLUB
        { category: "parentclub", question: "1. Does the club invite members of the Parent Lions Club to its BOD meetings and events?", answer: "Yes." },
        { category: "parentclub", question: "2. Is the MMAR, Minutes of the meetings and Treasury Report shared with the Parent Lions Club?", answer: "No." },
        { category: "parentclub", question: "3. How many activities or events have been conducted in twinning with the Parent Lions Club?", answer: "Total of 16 activities. Leos actively participate and volunteer on-ground. Benefits include mentorship and improved leadership skills." },
        { category: "parentclub", question: "4. How does the club define and strengthen the Leo-Lion bonding?", answer: "Mentorship and collaboration via joint activities (Mega Tree Plantation, LLCB), guidance, and regular interactions." },

        // DISTRICT INVOLVEMENT
        { category: "district", question: "1. Does your club members actively participate in District events and Meetings?", answer: "Yes." },
        { category: "district", question: "2. Has the club hosted any District event this year?", answer: "Yes, successfully hosted the Leo Leadership Institute (LLI) graduating 40+ empowered leaders." },
        { category: "district", question: "3. What feedback or suggestions does the club have for improving the District's operation?", answer: "NA." },
        { category: "district", question: "4. What changes can the District implement to attract more participation?", answer: "NA." },

        // ACHIEVEMENTS & RECOGNITIONS
        { category: "achievements", question: "1. Club-level achievements this year.", answer: "Appreciation for OSW Model at OSW Final Day." },
        { category: "achievements", question: "2. Individual member achievements.", answer: "Grassroot Leo (Zone 4) recognition for Leo Dhriti Shetty." },
        { category: "achievements", question: "3. Awards applied for / received.", answer: "NA." },
        { category: "achievements", question: "4. Special recognitions from district or multiple.", answer: "Recognition received for our club model presentation at OSW Finale Day." },
        { category: "achievements", question: "5. Proud moments of the year.", answer: "Successfully hosting the Leo Leadership Institute (LLI) and maintaining consistency with 41 service activities throughout the year." },

        // CHALLENGES & LEARNINGS
        { category: "learnings", question: "1. Major challenges faced by the club.", answer: "Maintaining consistent member participation due to personal commitments, and managing coordination among members." },
        { category: "learnings", question: "2. Lessons learned as a team.", answer: "Importance of teamwork, clear role distribution, structured planning, and communication." },

        // FUTURE ROADMAP
        { category: "roadmap", question: "1. Pending activities planned for the year.", answer: "Open Turf Tournament (26th April) – Fundraising initiative, food distribution, and summer water projects." },
        { category: "roadmap", question: "2. Administrative practices to continue next year.", answer: "Dedicated Google Drive + physical documentation system, strong Leo-Lion collaboration, focusing on impactful service and member leadership." }
    ];

    const qnaContainer = document.getElementById("qna-container");
    const filterBtns = document.querySelectorAll(".qna-filter-btn");

    if (qnaContainer && filterBtns.length > 0) {
        // Render function
        const renderQnA = (filter) => {
            qnaContainer.innerHTML = "";
            let filteredData = qnaData;
            if (filter !== "all") {
                filteredData = qnaData.filter(item => item.category === filter);
            }

            filteredData.forEach((item, index) => {
                // Determine icon based on category
                let icon = "fa-circle-info";
                if (item.category === "overview") icon = "fa-eye";
                else if (item.category === "secretarial") icon = "fa-file-signature";
                else if (item.category === "treasury" || item.category === "fundraising") icon = "fa-indian-rupee-sign";
                else if (item.category === "membership") icon = "fa-users";
                else if (item.category === "leadership") icon = "fa-lightbulb";
                else if (item.category === "service" || item.category === "permanent") icon = "fa-hand-holding-heart";
                else if (item.category === "pr") icon = "fa-hashtag";
                else if (item.category === "fellowship") icon = "fa-handshake";
                else if (item.category === "parentclub") icon = "fa-people-group";
                else if (item.category === "district") icon = "fa-globe";
                else if (item.category === "achievements") icon = "fa-trophy";
                else if (item.category === "learnings") icon = "fa-brain";
                else if (item.category === "roadmap") icon = "fa-route";

                const cardHtml = `
                    <div class="qna-card category-${item.category}" style="animation-delay: ${index * 0.02}s">
                        <div class="qna-question"><i class="fa-solid ${icon}" style="margin-right: 8px;"></i> ${item.question}</div>
                        <div class="qna-answer"><i class="fa-solid fa-arrow-right text-dim" style="font-size: 0.8rem; margin-right: 8px;"></i> ${item.answer}</div>
                    </div>
                `;
                qnaContainer.innerHTML += cardHtml;
            });
        };

        // Initial render
        renderQnA("all");

        // Filter events
        filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                // Update active class
                filterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                // Get filter and re-render
                const filterValue = btn.getAttribute("data-filter");
                renderQnA(filterValue);
            });
        });
    }

    // === MODULE 4: SERVICE & PROJECTS (DYNAMIC DATA & FILTERING) ===
            const projectsData = [
        {
            title: "CODE & SCHOOLING",
            date: "01-07-2025",
            category: "admin",
            displayCategory: "Administration",
            beneficiaries: "0",
            description: "CODE & SCHOOLING WAS A FANTASTIC LEARNING EXPERIENCE FOR CLUB LEADERS, FILLED WITH VALUABLE INSIGHTS AND TAKEAWAYS.",
            image: "./Service & Projects Photos/1.jpg"
        },
        {
            title: "District Installation and PCM",
            date: "05-07-2025",
            category: "admin",
            displayCategory: "Administration",
            beneficiaries: "0",
            description: "We began with the PCM, where our President shared plans and policies for the year ahead. It was a great platform to align with the district vision ...",
            image: "./Service & Projects Photos/2.jpg"
        },
        {
            title: "BOD Meeting",
            date: "13-07-2025",
            category: "admin",
            displayCategory: "Administration",
            beneficiaries: "1",
            description: "A focused BOD meeting was held on 13th July 2025 to kickstart Leoistic Year 2025–26. Key discussions included finalizing the installation ceremony ...",
            image: "./Service & Projects Photos/3.jpg"
        },
        {
            title: "Gaushala Visit",
            date: "13-07-2025",
            category: "service",
            displayCategory: "Humanitarian",
            beneficiaries: "1",
            description: "Event Report – Gaushala Visit Leo Club of Bhiwandi conducted its first service activity for Leoistic Year 2025–26 with a visit to Angoan Gaushala o...",
            image: "./Service & Projects Photos/4.jpg"
        },
        {
            title: "SSC and HSC Meri Shield Distribution",
            date: "19-07-2025",
            category: "service",
            displayCategory: "Youth",
            beneficiaries: "100",
            description: "We successfully has Merit shield distribution to the students of SSC and HSC who came out exceptionally with their marks.",
            image: "./Service & Projects Photos/5.jpg"
        },
        {
            title: "Leo Club of Bhiwandi Installation Ceremony of Leo Yeman Adep",
            date: "20-07-2025",
            category: "admin",
            displayCategory: "Administration",
            beneficiaries: "0",
            description: "On this day we had Installation Ceremony of Leo Yeman Adep and his team. New Leo’s were also inducted. This event was graced by all our past presid...",
            image: "./Service & Projects Photos/6.jpg"
        },
        {
            title: "Sai Baba Palkhi Prasadham Distribution",
            date: "26-07-2025",
            category: "service",
            displayCategory: "Humanitarian",
            beneficiaries: "200",
            description: "We had distributed Prasadham to Sai Baba Palkhi Pilgrimages who walk miles to Shirdi and seeking divine blessings. Prasadham was sponsored by Lion ...",
            image: "./Service & Projects Photos/7.jpg"
        },
        {
            title: "ZC Visit x Canva Workshop",
            date: "27-07-2025",
            category: "leadership",
            displayCategory: "Workshop",
            beneficiaries: "0",
            description: "We successfully had our ZC Visit at Shakti Group Office where our ZC Leo Rahul Dudam graced the event and shared the valuable insights. Later we ha...",
            image: "./Service & Projects Photos/8.jpg"
        },
        {
            title: "Multiple District Installation 3231",
            date: "03-08-2025",
            category: "admin",
            displayCategory: "Administration",
            beneficiaries: "0",
            description: "We attended Multiple District Installation Ceremony of Leo Lion Shishir Maheshwari and Team at Kandivali. It was very welcoming and later we witnes...",
            image: "./Service & Projects Photos/9.jpg"
        },
        {
            title: "District Orientation- Class of 2025",
            date: "10-08-2025",
            category: "leadership",
            displayCategory: "Orientation",
            beneficiaries: "0",
            description: "We had attend joint zone orientation with our club members where members got brief idea of how Leoism works and thank you to DP, ZC and ZS for such...",
            image: "./Service & Projects Photos/10.jpg"
        },
        {
            title: "Project Shikshanam- Independence Day",
            date: "15-08-2025",
            category: "service",
            displayCategory: "Youth",
            beneficiaries: "33",
            description: "on this Independence Day, we successfully conducted Project Shikshanam at Umbar Bandhan ZP School! ✨ Here’s a quick recap of the event: Total Leos ...",
            image: "./Service & Projects Photos/11.jpg"
        },
        {
            title: "BOD Meeting",
            date: "16-08-2025",
            category: "admin",
            displayCategory: "Administration",
            beneficiaries: "0",
            description: "Post flag hoisting, a BOD meeting was held with Leos and ex-Leos. Members shared key inputs on upcoming events and initiatives. Focus remained on p...",
            image: "./Service & Projects Photos/12.jpg"
        },
        {
            title: "𐌱✨ LEOs Go Green! – Mega Tree Plantation Drive 2025 ✨𐌱",
            date: "17-08-2025",
            category: "service",
            displayCategory: "Environment",
            beneficiaries: "125",
            description: "𐌱✨ The Leo Club of Bhiwandi, with Lions Club of Bhiwandi & partners, proudly hosted the Mega Tree Plantation Drive 2025 at Dudhni Village! Together...",
            image: "./Service & Projects Photos/13.jpg"
        },
        {
            title: "Pot Luck and Power Meet- General Meeting",
            date: "14-09-2025",
            category: "admin",
            displayCategory: "Administration",
            beneficiaries: "0",
            description: "𐍲✨ Potluck & Power Meet – Leo Club of Bhiwandi ✨𐍲 Dear Leos & Lions Family 𐂛𐆁, Today’s BOD cum General Meeting + Potluck Gathering was a perfect bl...",
            image: "./Service & Projects Photos/14.jpg"
        },
        {
            title: "Leo Lion Meeting with Parent Club",
            date: "18-09-2025",
            category: "admin",
            displayCategory: "Administration",
            beneficiaries: "0",
            description: "We had a meeting with Lions Club of Bhiwandi regarding upcoming OSW activities.",
            image: "./Service & Projects Photos/15.jpg"
        },
        {
            title: "Scam Sangeet- District First Council Meet",
            date: "21-09-2025",
            category: "admin",
            displayCategory: "Administration",
            beneficiaries: "0",
            description: "LCOB attended Scam sangeet FCM and Zonal Dance Competition where out proud President Leo Yeman Adep shared his plans and policies for the quarter. ...",
            image: "./Service & Projects Photos/16.jpg"
        },
        {
            title: "BOD CUM GENERAL MEETING",
            date: "27-09-2025",
            category: "admin",
            displayCategory: "Administration",
            beneficiaries: "0",
            description: "𐃢 Dear All, We had a meeting today regarding OSW activities. This meeting was conducted as part of our BOD (Board of Directors) review and planning...",
            image: "./Service & Projects Photos/17.jpg"
        },
        {
            title: "Project Dhristi and Project Water on Wheels",
            date: "03-10-2025",
            category: "service",
            displayCategory: "Humanitarian",
            beneficiaries: "404",
            description: "The Leo Club of Bhiwandi successfully organized two impactful initiatives — Project Dhristi and Water on Wheels. Under Project Dhristi, an eye chec...",
            image: "./Service & Projects Photos/18.jpg"
        },
        {
            title: "BOD Meeting For OSW",
            date: "04-10-2025",
            category: "admin",
            displayCategory: "Administration",
            beneficiaries: "0",
            description: "A BOD meeting was held to finalize the OSW action plan. Roles, timelines, and strategies were clearly defined. Focus was on smooth and effective ex...",
            image: "./Service & Projects Photos/19.jpg"
        },
        {
            title: "Leo Club of Bhiwandi – Project Annadanam",
            date: "04-10-2025",
            category: "service",
            displayCategory: "Hunger",
            beneficiaries: "280",
            description: "The Leo Club of Bhiwandi successfully carried out Project Annadanam, an initiative dedicated to serving food to those in need. Club members activel...",
            image: "./Service & Projects Photos/20.jpg"
        },
        {
            title: "Leo Club of Bhiwandi – Blood Donation Camp",
            date: "05-10-2025",
            category: "service",
            displayCategory: "Humanitarian",
            beneficiaries: "230",
            description: "The Blood Donation Camp is one of the signature events of the Leo Club of Bhiwandi, organized every year with great enthusiasm and participation. I...",
            image: "./Service & Projects Photos/21.jpg"
        },
        {
            title: "Leo Club of Bhiwandi – Project Peace Poster Competition",
            date: "06-10-2025",
            category: "service",
            displayCategory: "Youth",
            beneficiaries: "200",
            description: "The Leo Club of Bhiwandi successfully organized the Project Peace Poster Competition at Dadasaheb Dandekar Vidyalaya. The event aimed to encourage ...",
            image: "./Service & Projects Photos/22.jpg"
        },
        {
            title: "Leo Club of Bhiwandi – Project Shraddha",
            date: "07-10-2025",
            category: "service",
            displayCategory: "Environment",
            beneficiaries: "6",
            description: "Project Shraddha is a permanent annual initiative of the Leo Club of Bhiwandi. The project is carried out every year as part of the club’s ongoing ...",
            image: "./Service & Projects Photos/23.jpg"
        },
        {
            title: "Leo Club of Bhiwandi – Project Gaushala Visit",
            date: "08-10-2025",
            category: "service",
            displayCategory: "Humanitarian",
            beneficiaries: "1",
            description: "The Leo Club of Bhiwandi organized a Gaushala Visit, where members visited the Gaushala and spent time feeding and caring for the cows. The visit w...",
            image: "./Service & Projects Photos/24.jpg"
        },
        {
            title: "Leo Club of Bhiwandi – Project Sehat",
            date: "09-10-2025",
            category: "service",
            displayCategory: "Vision",
            beneficiaries: "100",
            description: "The Leo Club of Bhiwandi conducted Project Sehat at Government School No. 59, Bhiwandi, focusing on promoting menstrual hygiene and health awarenes...",
            image: "./Service & Projects Photos/25.jpg"
        },
        {
            title: "Leo Club of Bhiwandi – Project Annapurna Seva",
            date: "10-10-2025",
            category: "service",
            displayCategory: "Vision",
            beneficiaries: "56",
            description: "The Leo Club of Bhiwandi organized Project Annapurna Seva at Mathrychaya Balika Ashram, combining care and service through multiple meaningful acti...",
            image: "./Service & Projects Photos/26.jpg"
        },
        {
            title: "Leo Club of Bhiwandi – Project Ummeed",
            date: "10-10-2025",
            category: "service",
            displayCategory: "Youth",
            beneficiaries: "1",
            description: "Under Project Ummeed, the Leo Club of Bhiwandi extended financial assistance to a child in need. The initiative aimed to provide support and hope f...",
            image: "./Service & Projects Photos/27.jpg"
        },
        {
            title: "OSW Finale Day",
            date: "12-10-2025",
            category: "admin",
            displayCategory: "Administration",
            beneficiaries: "0",
            description: "We attended OSW Finale Day with our eco friendly Model which depicted our club Logo. We had also got recognition for our Model at Finale Day.",
            image: "./Service & Projects Photos/28.jpg"
        },
        {
            title: "Project Aashirwaad",
            date: "18-10-2025",
            category: "service",
            displayCategory: "Humanitarian",
            beneficiaries: "75",
            description: "*𐌸 PROJECT AASHIRWAAD – SUCCESSFUL COMPLETION 𐌸* *Hey Leos! 𐂛* Yesterday, we successfully carried out one of our most soulful and heart-touching in...",
            image: "./Service & Projects Photos/29.jpg"
        },
        {
            title: "Project Umang",
            date: "19-10-2025",
            category: "service",
            displayCategory: "Hunger",
            beneficiaries: "200",
            description: "It was our privilege to be part of Projetc Umang. Kudos to DP Leo Shivani Shah and her team for such an heart touching service activity",
            image: "./Service & Projects Photos/30.jpg"
        },
        {
            title: "First Multiple Council Meet",
            date: "02-11-2025",
            category: "admin",
            displayCategory: "Administration",
            beneficiaries: "0",
            description: "We LCOB attended First Multiple Council Meet, where in our MDP shared his plans and policies of upcoming quarter. It was very fruitful meeting Leo’...",
            image: "./Service & Projects Photos/31.jpg"
        },
        {
            title: "Charter Nite Celebration and Peace Poster Prize Distribution",
            date: "08-11-2025",
            category: "admin",
            displayCategory: "Administration",
            beneficiaries: "0",
            description: "✨ *LEO CLUB OF BHIWANDI* ✨ 𐃍Dist. 3231-A2 | Zone 4 | We are glad to share that 7 Leos from our club actively participated in the Official Visit Pro...",
            image: "./Service & Projects Photos/32.jpg"
        },
        {
            title: "General Meeting",
            date: "16-11-2025",
            category: "admin",
            displayCategory: "Administration",
            beneficiaries: "0",
            description: "𐃄 Minutes of Meeting – Leo Club Date: 16th November 2025 Time: 11:00 AM Duration: 45 minutes Total Leos Attended: 9 Summary We conducted a 45-minut...",
            image: "./Service & Projects Photos/33.jpg"
        },
        {
            title: "Pahal 5.0",
            date: "23-11-2025",
            category: "service",
            displayCategory: "Hunger",
            beneficiaries: "23",
            description: "*PAHAL 5.0 Event Highlight* Date: November 23, 2025 calendar 𐇓️ Location:~ Ashram Shala, Chikle, Panvel𐃍 *Leo Club of Bhiwandi at PAHAL 5.0*𐄩 ✨Even...",
            image: "./Service & Projects Photos/34.jpg"
        },
        {
            title: "Project KambhalDaan - Blanket Distribution",
            date: "29-11-2025",
            category: "service",
            displayCategory: "Humanitarian",
            beneficiaries: "150",
            description: "✨ LEO CLUB OF BHIWANDI ✨ We are grateful to share the heartfelt success of *Project Khambal Daan*, our winter blanket distribution drive dedicated ...",
            image: "./Service & Projects Photos/35.jpg"
        },
        {
            title: "Leo Leadership Institute (Host Club)",
            date: "30-11-2025",
            category: "leadership",
            displayCategory: "Workshop",
            beneficiaries: "0",
            description: "✨ LEO LEADERSHIP INSTITUTE — A DAY WE WILL NEVER FORGET ✨ Proudly hosted by Leo Club of Bhiwandi 𐆁𐂥 Some days change us. Some days define us. Yeste...",
            image: "./Service & Projects Photos/36.jpg"
        },
        {
            title: "BOD Meeting",
            date: "27-12-2025",
            category: "admin",
            displayCategory: "Administration",
            beneficiaries: "0",
            description: "The discussion was productive and positive, setting the tone for impactful initiatives ahead. 𐃌 *Events Discussed* : - 3rd Jan: Check Dam initiativ...",
            image: "./Service & Projects Photos/37.jpg"
        },
        {
            title: "𐌊 Vanrai Bandhara Project – Successfully Completed 𐌱",
            date: "03-01-2026",
            category: "service",
            displayCategory: "Environment",
            beneficiaries: "200",
            description: "Thrilled to share that Leo Club of Bhiwandi, in collaboration with Lions Club of Bhiwandi, successfully executed today's event for Project Vanrai B...",
            image: "./Service & Projects Photos/38.jpg"
        },
        {
            title: "The Lion Leo Cricket Battle (LLCB) Season 6",
            date: "25-01-2026",
            category: "leadership",
            displayCategory: "Leadership & Youth",
            beneficiaries: "0",
            description: "The Lion Leo Cricket Battle (LLCB) Season 6 was successfully conducted on Sunday, 25th January 2026, at Dadasaheb Dandekar School Ground, Kalyan Na...",
            image: "./Service & Projects Photos/39.jpg"
        },
        {
            title: "General Meeting",
            date: "22-02-2026",
            category: "admin",
            displayCategory: "Administration",
            beneficiaries: "0",
            description: "We had our BOD cum General Meeting with Advisor Lion Vinod Siricilla regarding the clubs upcoming activities. He shared his valuable insights regar...",
            image: "./Service & Projects Photos/40.jpg"
        },
        {
            title: "Housie Night cum General Meeting",
            date: "14-03-2026",
            category: "admin",
            displayCategory: "Administration",
            beneficiaries: "0",
            description: "Leo Club of Bhiwandi 𐃅 Date: 14th March 2026 𐃍 Venue: Residence of Leo Yeman Adep, Arihant Shopping Complex, Dhamankar Naka, Bhiwandi ⏰ Duration: 2...",
            image: "./Service & Projects Photos/41.jpg"
        }
    ];

    const projectsContainer = document.getElementById("projects-container");
    const projFilterBtns = document.querySelectorAll(".project-filter-btn");

    if (projectsContainer && projFilterBtns.length > 0) {
        const renderProjects = (filter) => {
            projectsContainer.innerHTML = "";
            let filteredProjects = projectsData;
            if (filter !== "all") {
                filteredProjects = projectsData.filter(p => p.category === filter);
            }

            filteredProjects.forEach((proj, index) => {
                let borderClass = "border-cyan";
                let titleColor = "neon-cyan";

                if (proj.category === "leadership") {
                    borderClass = "border-gold";
                    titleColor = "neon-gold";
                } else if (proj.category === "admin") {
                    borderClass = "border-blue";
                    titleColor = "neon-blue";
                }

                // Truncate description for the card preview
                let shortDesc = proj.description.length > 80 ? proj.description.substring(0, 80) + "..." : proj.description;

                const article = document.createElement("article");
                article.className = "project-card reveal active";
                article.style.transitionDelay = `${index * 0.05}s`;
                article.style.cursor = "pointer";

                article.innerHTML = `
                    <div class="project-img-wrapper">
                        <img src="${proj.image}" alt="${proj.title}" onerror="this.src='leo logo.png'; this.style.opacity='0.2';">
                    </div>
                    <div class="project-content" style="height: 100%; display: flex; flex-direction: column;">
                        <span class="project-category ${borderClass}">${proj.displayCategory}</span>
                        <h3 class="project-title ${titleColor} mt-2">${proj.title}</h3>
                        <p class="text-dim mt-2" style="font-size: 0.8rem; line-height: 1.4; flex-grow: 1;">${shortDesc}</p>
                        <div class="card-action-hint"><i class="fa-solid fa-angles-right"></i> Click to Access Data</div>
                        <div class="project-meta mt-3">
                            <span class="meta-item"><i class="fa-regular fa-calendar"></i> ${proj.date}</span>
                            <span class="meta-item border-left"><i class="fa-solid fa-users"></i> ${proj.beneficiaries} Benefited</span>
                        </div>
                    </div>
                `;

                // Add click listener to open the interactive cyber modal
                article.addEventListener("click", () => {
                    openProjectModal(proj, borderClass, titleColor);
                });

                projectsContainer.appendChild(article);
            });
        };

        // Render all by default
        renderProjects("all");

        // Attach click listeners to filter buttons
        projFilterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                projFilterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                renderProjects(btn.getAttribute("data-filter"));
            });
        });

        // Modal Logic
        const cyberModal = document.getElementById("cyberModal");
        const closeModalBtn = document.getElementById("closeModal");
        const modalBackdrop = document.querySelector(".modal-backdrop");

        const openProjectModal = (proj, borderClass, titleColor) => {
            if (!cyberModal) return;

            // Populate Data
            document.getElementById("modalImg").src = proj.image;
            document.getElementById("modalImg").alt = proj.title;

            const categoryEl = document.getElementById("modalCategory");
            categoryEl.className = `project-category ${borderClass} mb-2`;
            categoryEl.textContent = proj.displayCategory;

            const titleEl = document.getElementById("modalTitle");
            titleEl.className = `${titleColor} mb-3`;
            titleEl.textContent = proj.title;

            document.getElementById("modalDate").textContent = proj.date;
            document.getElementById("modalBeneficiaries").textContent = `${proj.beneficiaries} Benefited`;
            document.getElementById("modalDescription").textContent = proj.description;

            // Show modal
            cyberModal.classList.add("active");
            document.body.style.overflow = "hidden"; // Prevent background scrolling
        };

        const closeProjectModal = () => {
            if (!cyberModal) return;
            cyberModal.classList.remove("active");
            document.body.style.overflow = "auto";
        };

        if (closeModalBtn) closeModalBtn.addEventListener("click", closeProjectModal);
        if (modalBackdrop) modalBackdrop.addEventListener("click", closeProjectModal);
    }

    // === MODULE LEADERSHIP: DYNAMIC MARQUEE RENDERING ===
    const renderLeadershipMarquees = () => {
        const coreTrack = document.getElementById('core-marquee-track');
        const leadsTrack = document.getElementById('leads-marquee-track');

        if (!coreTrack || !leadsTrack || typeof LEADERSHIP_DATA === 'undefined') return;

        const createCard = (member) => {
            const card = document.createElement('div');
            card.className = `member-card ${member.elite ? 'elite' : ''}`;
            
            // Check if photo exists and is not empty
            const hasPhoto = member.photo && member.photo.trim() !== "";
            const photoContent = hasPhoto 
                ? `<img src="${member.photo}" alt="${member.name}" 
                    onerror="console.error('Failed to load image:', '${member.photo}'); this.style.display='none'; this.parentElement.querySelector('.photo-placeholder').style.display='flex';">
                   <div class="photo-placeholder" style="display:none;"><i class="fa-solid fa-user"></i></div>`
                : `<div class="photo-placeholder"><i class="fa-solid fa-user"></i></div>`;

            card.innerHTML = `
                <div class="card-hud-decor top-left"></div>
                <div class="member-photo">${photoContent}</div>
                <div class="member-info">
                    <h4>${member.name}</h4>
                    <p>${member.role}</p>
                </div>
            `;
            return card;
        };

        // Render Core Executives
        LEADERSHIP_DATA.coreExecutives.forEach(m => coreTrack.appendChild(createCard(m)));
        // Duplicate for seamless loop
        LEADERSHIP_DATA.coreExecutives.forEach(m => coreTrack.appendChild(createCard(m)));

        // Render Team Leads
        LEADERSHIP_DATA.teamLeads.forEach(m => leadsTrack.appendChild(createCard(m)));
        // Duplicate for seamless loop
        LEADERSHIP_DATA.teamLeads.forEach(m => leadsTrack.appendChild(createCard(m)));
    };

    renderLeadershipMarquees();
});
