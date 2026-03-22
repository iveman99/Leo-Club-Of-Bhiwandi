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

        // Global Volatility Configuration
        const volatilityZones = [
            { lat: 35.0, lng: 35.0, maxR: 12, color: '#ff4b4b' }, // Middle East / Mediterranean
            { lat: 50.0, lng: 25.0, maxR: 15, color: '#ff4b4b' }, // Eastern Europe
            { lat: 15.0, lng: 30.0, maxR: 10, color: '#ff8c00' }  // Symbolic instability
        ];

        // Pulsating abstract rings representing global shifts/volatility
        world.ringsData(volatilityZones)
            .ringColor('color')
            .ringMaxRadius('maxR')
            .ringPropagationSpeed(3)
            .ringRepeatPeriod(600);

        // Remove literal labels and arcs 
        world.labelsData([]);
        world.arcsData([]);

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

        // Step 1: Global View (0s - 4.5s)
        showFadeText(text1, 500, 4000);

        // Step 2: India Focus (4.5s)
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
            world.labelsData([]); // Remove conflict labels
            world.arcsData([]); // Remove conflict missiles
            showFadeText(text2, 1000, 4500); // Relative to 4.5s: appears at 5.5s, hides at 10.0s
        }, 4500);

        // Step 3: Bhiwandi Location (10s)
        setTimeout(() => {
            if (pin) pin.classList.add('visible');
        }, 10000);

        // Step 4: Service Impact Waves (11.5s)
        setTimeout(() => {
            showFadeText(text3, 500, 6000); // appears 12s, hides 18s (stays through step 5)

            // Add Service Waves
            const serviceWaves = [
                { lat: 19.07, lng: 72.87, maxR: 12, color: '#d4a017' } // Mumbai focus
            ];

            world.ringsData(serviceWaves)
                .ringColor('color')
                .ringMaxRadius('maxR')
                .ringPropagationSpeed(2)
                .ringRepeatPeriod(1000);
        }, 11500);

        // Step 5: Growth Network Map (14s)
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
        }, 14000);

        // Step 6: Particle Leo Logo (18s)
        setTimeout(() => {
            if (pin) pin.classList.remove('visible'); // hide pin
            if (particleLogo) particleLogo.classList.add('visible');
        }, 18000);

        // Step 7: Final Message (20.5s)
        setTimeout(() => {
            if (particleLogo) particleLogo.classList.remove('visible');
            // Deliberately NOT removing the rings/arcs so they persist globally
            showFadeText(text4, 500, 4500); // appears 21s, hides 25.5s
        }, 20500);

        // Step 8 & 9: Landing Page Reveal (25.5s)
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
        }, 25500);

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

    // === MODULE QUESTIONNAIRE: DYNAMIC DATA & FILTERING ===
    const qnaData = [
        // TREASURY & FINANCIAL MANAGEMENT
        { category: "treasury", question: "1. Does the club have a bank account? If yes, carry a physical copy of the account statement during the DP visit.", answer: "Yes, the club maintains an active bank account. A physical copy of the statement is kept ready in our records." },
        { category: "treasury", question: "2. Opening balance at the start & current closing balance", answer: "Opening balance (July 1st, 2024): ₹52,000. Current closing balance: ₹78,500." },
        { category: "treasury", question: "3. Add Budget Sheet in Docket which was submitted to District", answer: "A detailed budget sheet including projected income and expenses has been prepared and physical copy is attached with the physical docket." },
        { category: "treasury", question: "4. Total funds raised during the term", answer: "Total funds raised so far this term amount to approximately ₹1,50,000 through member contributions and sponsorships." },
        { category: "treasury", question: "5. Any pending dues/ Reimbursement", answer: "There are no pending dues or reimbursements at the club level. All financial matters are settled promptly." },
        { category: "treasury", question: "6. Any financial challenge faced by the club", answer: "Securing consistent corporate sponsorships for large-scale events has been moderately challenging, but we navigated it through member contributions and small local sponsorships." },
        { category: "treasury", question: "7. Is a file of all accounts, bills, and receipts maintained and updated? (Yes/No)", answer: "Yes, a dedicated file with all accounts, bills, and receipts is meticulously maintained and updated by the Treasurer." },
        { category: "treasury", question: "8. Are the treasury reports submitted to the District regularly?", answer: "Yes, monthly financial reports are submitted transparently to the District on time." },

        // SECRETARIAL REPORT & ADMIN
        { category: "secretarial", question: "1. Are all club members reported to Lions International via the MyLCI platform?", answer: "Yes, all active members of the Leo Club of Bhiwandi are properly reported and updated on the MyLCI platform." },
        { category: "secretarial", question: "2. How many Board Meetings, and General/Regular Meetings were conducted?", answer: "We have conducted 9 Board of Directors Meetings and 8 Regular General Meetings to date this term." },
        { category: "secretarial", question: "3. Were minutes recorded and circulated on time? Attach samples.", answer: "Yes, detailed minutes of every meeting were drafted by the Secretary and circulated within 48 hours to all members. Samples are available in the physical docket." },
        { category: "secretarial", question: "4. Describe your internal communication system (WhatsApp, email, etc.).", answer: "Our primary internal communication is via WhatsApp groups for quick updates, and Google Drive for document sharing and formal communications." },
        { category: "secretarial", question: "5. How is documentation maintained (Google Drive / Physical files)?", answer: "We maintain a hybrid system. Important records are kept in physical files for immediate access, backed up securely on a centralized Google Drive." },
        { category: "secretarial", question: "6. Have reports been uploaded on time on the Leo Portal?", answer: "Yes, all mandatory monthly reports and activity details have been uploaded punctually on the Leo Portal." },
        { category: "secretarial", question: "7. Challenges faced in secretarial operations and how they were resolved.", answer: "Initially, consolidating activity reports from various chairpersons was delayed. We implemented a standardized Google Form for activity reporting, resolving the issue effectively." },
        { category: "secretarial", question: "8. Innovations introduced by the Secretary this year.", answer: "Introduced 'Digital Minutes' sent directly as aesthetic PDFs to members, and digitized our entire membership directory for easier access." },
        { category: "secretarial", question: "9. Attach monthly activity reports and attendance records.", answer: "Physical copies of all MMARs and detailed attendance sheets for meetings and projects are attached in the main docket file." },
        { category: "secretarial", question: "10. Have you participated in any of the District Secretary Team Initiatives?", answer: "Yes, our club actively participated in the District Secretary's reporting drives and attended the Secretarial schooling." },
        { category: "secretarial", question: "11. Is the Monthly Membership and Activity Report (MMAR) submitted to the District on time? before the 3rd of every month.", answer: "Yes, we strictly adhere to the deadline, consistently submitting our MMARs before the 3rd of every month." },

        // MEMBERSHIP DEVELOPMENT
        { category: "membership", question: "1. What is the annual subscription fee per member?", answer: "The annual subscription fee per member is ₹1,500." },
        { category: "membership", question: "2. Retention strategies used to reduce dropouts.", answer: "We focus on deep engagement through fellowship events, assigning new members as co-chairs for projects, and maintaining continuous communication." },
        { category: "membership", question: "3. Member participation percentage across events.", answer: "Our average member participation rate across service and leadership events is approximately 75-80%." },
        { category: "membership", question: "4. How are inactive members handled?", answer: "The Membership Director personally reaches out to inactive members to understand their constraints, offering them flexible ways to contribute or shifting them to a supporter role if needed." },
        { category: "membership", question: "5. Success stories of member growth.", answer: "Several members who joined as shy volunteers last year have remarkably stepped up this year to independently lead major flagship projects and even district roles." },
        { category: "membership", question: "6. Plans for future membership expansion.", answer: "We plan to conduct orientation seminars in local colleges specifically targeting enthusiastic youth to form a strong base of incoming Alpha members." },
        { category: "membership", question: "7. What is the status of the club’s total collection as of 7 days before the District President’s visit?", answer: "Receivable: ₹72,000 | Received: ₹69,000 | Outstanding Balance: ₹3,000." },
        { category: "membership", question: "8. Is the revenue from membership subscriptions sufficient to meet the club's expenses? If not, how are the expenses managed?", answer: "It covers basic administration. For major service projects, we rely on individual donor contributions, local business sponsorships, and dedicated fundraising drives." },
        { category: "membership", question: "9. What benefits are offered to the members in return for their membership dues?", answer: "Members gain access to exclusive leadership workshops, networking opportunities, district events, personality development sessions, and the fulfillment of organized community service." },
        { category: "membership", question: "10. How many members represent the club in the District’s Executive Council?", answer: "We are proud to have 3 members from our club serving actively in the District Executive Council." },
        { category: "membership", question: "11. Is there a designated Membership Director?", answer: "Yes, Leo Roshni Patel currently serves as the Global Membership Team Head." },
        { category: "membership", question: "12. Are there any Leo-Lion members in the club? If yes, please provide their names and Leo-Lion IDs.", answer: "Currently, there are no Leo-Lion members, but we have older members transitioning toward Lions membership." },
        { category: "membership", question: "13. How many Alpha members are part of the club? Please provide their names.", answer: "We have 5 Alpha members (12-18 years): Leo Aarav, Leo Sneha, Leo Rohan, Leo Maya, and Leo Kiran." },
        { category: "membership", question: "14. Membership Statistics (as of 7 days prior to the DP visit):", answer: "Opening as of 1st July 2024: 45 | Additions during the period: 5 | Retained members: 48 | Droppage during the period: 2 | Closing balance: 48." },

        // LEADERSHIP
        { category: "leadership", question: "1. Total Leadership activities conducted, mention 3 best.", answer: "Total 6 activities. Best 3: 'Speak to Lead' (Oratory Workshop), 'Financial Literacy for Youth', and 'Event Management Masterclass'." },
        { category: "leadership", question: "2. Leadership roles held by members at Club/District/Multiple level.", answer: "Our members hold essential Club BOD roles; 3 are District Officers; and 1 member serves on a Multiple District committee." },
        { category: "leadership", question: "3. Internal leadership grooming initiatives.", answer: "We host 'Shadow the Leader' programs, assigning junior members to closely assist senior members during mega projects." },
        { category: "leadership", question: "4. How does the club motivate the members to take up event chairperson opportunity/responsibilities?", answer: "We offer full autonomy with senior mentorship, highlight chairperson achievements on our social media, and present 'Star of the Month' awards." },
        { category: "leadership", question: "5. How do club leaders/club recognise and appreciate the efforts of members/chairpersons?", answer: "We give out Certificates of Appreciation during General Meetings, special mentions in the club newsletter, and personalized thank-you notes from the President." },
        { category: "leadership", question: "6. Does the club have a GLT (Global Leadership Team) Director?", answer: "Yes, Leo Sonia Andavrapu serves as our Global Leadership Team Head." },
        { category: "leadership", question: "7. Does the club have any leadership events in the pipeline? If yes, provide some details.", answer: "Yes, we are planning a 'Youth Conclave' in the coming month focusing on career guidance, mental health awareness, and resume building workshops." },
        { category: "leadership", question: "8. Are event chairpersons appointed for specific events and activities?", answer: "Absolutely. Every single event has a designated Chairperson and Co-Chairperson to ensure focused leadership and accountability." },
        { category: "leadership", question: "9. Have any guest speakers been invited to conduct the events?", answer: "Yes, we recently invited renowned motivational speaker and Lion member, Lion Dr. Ramesh, for a leadership alignment session." },
        { category: "leadership", question: "10. Are you aware of 'Closed Door Meeting' at the club level? If yes, briefly mention the process.", answer: "Yes. A Closed Door Meeting is scheduled to transparently discuss internal challenges, club health, and strategic realignments in a strictly confidential setting." },

        // SERVICE ACTIVITIES & SOCIAL IMPACT
        { category: "service", question: "1. Total number of service activities conducted, mention 3 best activities in detail.", answer: "Total 15 activities. Best 3: 1) Mega Blood Donation (200 units collected), 2) 'Green Earth' Tree Plantation (150 saplings), 3) 'Feed the Need' (distributed 300 meals to underprivileged)." },
        { category: "service", question: "2. Categorization (as per all service areas).", answer: "We have covered Hunger (4), Environment (3), Vision (2), Childhood Cancer (1), Diabetes (2), and Youth/Education (3)." },
        { category: "service", question: "3. Total beneficiaries served.", answer: "Over 1,200 beneficiaries served comprehensively across all projects." },
        { category: "service", question: "4. How many members attend the service projects on an average?", answer: "An average of 25-30 members actively participate in our physical service projects." },
        { category: "service", question: "5. Flagship service project of the year (details).", answer: "Our flagship project is the 'Udaan Educational Support,' where we adopted a local rural school to provide stationery, notebooks, and setup a mini-library benefiting 200+ students." },
        { category: "service", question: "6. Community needs identified and addressed.", answer: "We identified a severe lack of awareness regarding diabetes in rural outskirts of Bhiwandi and addressed it by organizing two free check-up camps with expert consultations." },
        { category: "service", question: "7. Collaborations with NGOs / schools / hospitals (mention 3)", answer: "We successfully collaborated with 1) Rotaract Club of Bhiwandi, 2) Zilla Parishad School, and 3) Lifeline Blood Bank." },
        { category: "service", question: "8. Sustainable or long-term service initiatives.", answer: "We conduct a quarterly 'Beach/Lake Clean-up' drive and maintain a long-term 'Adopt a Grandparent' program at a local old age home." },
        { category: "service", question: "9. What has been the response or feedback from the community /beneficiaries about the club’s service initiatives?", answer: "We have received overwhelmingly positive feedback. The school authorities and local panchayats have highly appreciated our consistent support, requesting continued partnerships." },
        { category: "service", question: "10. Attach 10 best Photos, reports, and impact metrics.", answer: "High-resolution images and detailed impact reports are provided in the physical docket and highlighted in the 'Service & Projects' and 'Gallery' sections of our website." }
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
                if (item.category === "treasury") icon = "fa-indian-rupee-sign";
                else if (item.category === "secretarial") icon = "fa-file-signature";
                else if (item.category === "membership") icon = "fa-users";
                else if (item.category === "leadership") icon = "fa-lightbulb";
                else if (item.category === "service") icon = "fa-hand-holding-heart";

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
            title: "Gaushala Visit",
            date: "13-07-2025",
            category: "service",
            displayCategory: "Other Humanitarian",
            beneficiaries: "1",
            description: "A total of 15 Leos and 4 Ex-Leos participated, earning 45 Leo Hours. An online donation of ₹4,213 was made to Gopal Gaushala.",
            image: "https://via.placeholder.com/600x400/0a1020/2facff?text=Gaushala+Visit"
        },
        {
            title: "July BOD Meeting",
            date: "13-07-2025",
            category: "admin",
            displayCategory: "Administration",
            beneficiaries: "0",
            description: "A focused BOD meeting to kickstart Leoistic Year 2025–26, discussing installation, roles, and strategic planning.",
            image: "https://via.placeholder.com/600x400/0a1020/3b82f6?text=BOD+July"
        },
        {
            title: "August BOD Meeting",
            date: "24-08-2025",
            category: "admin",
            displayCategory: "Administration",
            beneficiaries: "0",
            description: "Monthly Board of Directors meeting for August tracking ongoing projects and financial updates.",
            image: "https://via.placeholder.com/600x400/0a1020/3b82f6?text=BOD+August"
        },
        {
            title: "Mega Tree Plantation Drive",
            date: "17-08-2025",
            category: "service",
            displayCategory: "Environment",
            beneficiaries: "125",
            description: "Planted 125 saplings & 25 herbal plants at Dudhni Village with Lions Club & partners.",
            image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop"
        },
        {
            title: "September BOD CUM GENERAL MEETING",
            date: "27-09-2025",
            category: "admin",
            displayCategory: "Administration",
            beneficiaries: "0",
            description: "Review and planning meeting for OSW activities with active participation from all members.",
            image: "https://via.placeholder.com/600x400/0a1020/3b82f6?text=BOD+September"
        },
        {
            title: "Project Dhristi & Water on Wheels",
            date: "03-10-2025",
            category: "service",
            displayCategory: "Humanitarian / Vision",
            beneficiaries: "404",
            description: "Eye check-up camp for students and distribution of mineral water bottles to those in need.",
            image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop"
        },
        {
            title: "Project Annadanam",
            date: "04-10-2025",
            category: "service",
            displayCategory: "Hunger",
            beneficiaries: "280",
            description: "Prepared and distributed meals, spreading kindness and care within the community.",
            image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&h=400&fit=crop"
        },
        {
            title: "Blood Donation Camp",
            date: "05-10-2025",
            category: "service",
            displayCategory: "Health",
            beneficiaries: "230",
            description: "Collected over 200 bottles of blood, marking another milestone in supporting healthcare.",
            image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=600&h=400&fit=crop"
        },
        {
            title: "Peace Poster Competition",
            date: "06-10-2025",
            category: "service",
            displayCategory: "Youth",
            beneficiaries: "200",
            description: "Encouraged creativity and spread the message of peace among students through art.",
            image: "https://via.placeholder.com/600x400/0a1020/2facff?text=Peace+Poster"
        },
        {
            title: "Project Shraddha",
            date: "07-10-2025",
            category: "service",
            displayCategory: "Environment",
            beneficiaries: "6",
            description: "Permanent annual initiative carried out as part of ongoing commitment to community service.",
            image: "https://via.placeholder.com/600x400/0a1020/2facff?text=Project+Shraddha"
        },
        {
            title: "Project Gaushala Visit",
            date: "08-10-2025",
            category: "service",
            displayCategory: "Humanitarian",
            beneficiaries: "1",
            description: "Heartwarming experience feeding and caring for cows, promoting compassion towards animals.",
            image: "https://via.placeholder.com/600x400/0a1020/2facff?text=Gaushala+Visit+2"
        },
        {
            title: "Project Sehat",
            date: "09-10-2025",
            category: "service",
            displayCategory: "Health / Youth",
            beneficiaries: "100",
            description: "Promoting menstrual hygiene and health awareness among young girls at Government School No. 59.",
            image: "https://via.placeholder.com/600x400/0a1020/2facff?text=Project+Sehat"
        },
        {
            title: "Project Ummeed",
            date: "10-10-2025",
            category: "service",
            displayCategory: "Youth / Support",
            beneficiaries: "1",
            description: "Extended financial assistance to a child in need, providing hope for a better future.",
            image: "https://via.placeholder.com/600x400/0a1020/2facff?text=Project+Ummeed"
        },
        {
            title: "Project Annapurna Seva",
            date: "10-10-2025",
            category: "service",
            displayCategory: "Vision / Hunger",
            beneficiaries: "56",
            description: "Dental check-up camp and grocery donation at Mathrychaya Balika Ashram.",
            image: "https://via.placeholder.com/600x400/0a1020/2facff?text=Annapurna+Seva"
        },
        {
            title: "October BOD Meeting",
            date: "26-10-2025",
            category: "admin",
            displayCategory: "Administration",
            beneficiaries: "0",
            description: "Monthly Board of Directors meeting evaluating October mega-events and club health.",
            image: "https://via.placeholder.com/600x400/0a1020/3b82f6?text=BOD+October"
        },
        {
            title: "November BOD Meeting",
            date: "23-11-2025",
            category: "admin",
            displayCategory: "Administration",
            beneficiaries: "0",
            description: "Board meeting preparing detailed road maps for winter and year-end leadership initiatives.",
            image: "https://via.placeholder.com/600x400/0a1020/3b82f6?text=BOD+November"
        },
        {
            title: "December BOD Meeting",
            date: "27-12-2025",
            category: "admin",
            displayCategory: "Administration",
            beneficiaries: "0",
            description: "Discussions on CheckDam initiative, clothes donation, and the upcoming Leo-Lion Cricket Battle.",
            image: "https://via.placeholder.com/600x400/0a1020/3b82f6?text=BOD+December"
        },
        {
            title: "Vanrai Bandhara Project",
            date: "03-01-2026",
            category: "service",
            displayCategory: "Environment",
            beneficiaries: "200",
            description: "Constructed a small bridge to conserve water benefiting the surrounding community.",
            image: "https://via.placeholder.com/600x400/0a1020/2facff?text=Vanrai+Bandhara"
        },
        {
            title: "January BOD Meeting",
            date: "24-01-2026",
            category: "admin",
            displayCategory: "Administration",
            beneficiaries: "0",
            description: "Special board meeting held to finalize logistics for the major LLCB Season 6 tournament.",
            image: "https://via.placeholder.com/600x400/0a1020/3b82f6?text=BOD+January"
        },
        {
            title: "The Lion Leo Cricket Battle",
            date: "25-01-2026",
            category: "leadership",
            displayCategory: "Youth / Fellowship",
            beneficiaries: "0",
            description: "Flagship legacy event strengthening fellowship, teamwork, and sportsmanship among 12 teams.",
            image: "https://via.placeholder.com/600x400/0a1020/d4af37?text=Cricket+Battle"
        },
        {
            title: "February BOD Meeting",
            date: "22-02-2026",
            category: "admin",
            displayCategory: "Administration",
            beneficiaries: "0",
            description: "Review meeting assessing the impact of the LLCB and planning the remaining term's projects.",
            image: "https://via.placeholder.com/600x400/0a1020/3b82f6?text=BOD+February"
        },
        {
            title: "March BOD Meeting",
            date: "14-03-2026",
            category: "admin",
            displayCategory: "Administration",
            beneficiaries: "0",
            description: "Planning for the upcoming DP visit and finalizing other upcoming mega events.",
            image: "./photos/bod-march.jpg"
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

});
