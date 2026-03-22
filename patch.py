import re

js_file = r"c:\Users\Veman S Chippa\Leo-Club-Of-Bhiwandi\main.js"

with open(js_file, "r", encoding="utf-8") as f:
    content = f.read()

new_array = """    const projectsData = [
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
            title: "Sai Baba Palki Seva",
            date: "26-07-2025",
            category: "service",
            displayCategory: "Pilgrim Service",
            beneficiaries: "200",
            description: "A spiritually driven activity focused on selfless service at Datta Mandir, distributing Prasad and serving 200 pilgrims.",
            image: "https://via.placeholder.com/600x400/0a1020/2facff?text=Palki+Seva"
        },
        {
            title: "Zone Chairperson Visit & Canva Workshop",
            date: "27-07-2025",
            category: "leadership",
            displayCategory: "Workshop / Interaction",
            beneficiaries: "0",
            description: "Members gained valuable insights from Zone Chairperson Leo Rahul Dudham and enhanced their creative skills through a hands-on Canva workshop.",
            image: "https://via.placeholder.com/600x400/0a1020/d4af37?text=Canva+Workshop"
        },
        {
            title: "Zone 3 & 4 Joint Orientation & Fellowship",
            date: "10-08-2025",
            category: "leadership",
            displayCategory: "Fellowship",
            beneficiaries: "0",
            description: "A knowledge-driven event at The Next School aimed at strengthening leadership, networking, and understanding of Leoism.",
            image: "https://via.placeholder.com/600x400/0a1020/d4af37?text=Joint+Orientation"
        },
        {
            title: "District Orientation – Leo District 3231 A2",
            date: "10-08-2025",
            category: "leadership",
            displayCategory: "Orientation",
            beneficiaries: "0",
            description: "A district-level leadership initiative focused on preparing Leos for the year through structured sessions and guidance from experienced leaders.",
            image: "https://via.placeholder.com/600x400/0a1020/d4af37?text=District+Orientation"
        },
        {
            title: "LEOS Go Green – Mega Tree Plantation Drive",
            date: "17-08-2025",
            category: "service",
            displayCategory: "Environment",
            beneficiaries: "125",
            description: "An environmental initiative focused on sustainability. We planted 125 saplings & 25 herbal plants at Dudhni Village. Event Chairperson: Leo Srikanth Yelle.",
            image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop"
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
            title: "Project Drishti & Smile – Medical Camp",
            date: "19-09-2025",
            category: "service",
            displayCategory: "Health / Vision",
            beneficiaries: "200",
            description: "A healthcare initiative providing dental, eye, and general health screenings to improve student well-being at Dandekar School.",
            image: "https://via.placeholder.com/600x400/0a1020/2facff?text=Drishti+Smile"
        },
        {
            title: "OSW Activity – Donation Drive & Health Camp",
            date: "20-09-2025",
            category: "service",
            displayCategory: "Health / Hunger",
            beneficiaries: "0",
            description: "Conducted under October Service Week, focusing on supporting underprivileged communities at Balika Ashram through grocery donations and health check-ups.",
            image: "https://via.placeholder.com/600x400/0a1020/2facff?text=OSW+Donation"
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
    ];"""

# Find the start and end of projectsData in main.js
start_idx = content.find("const projectsData = [")
# Find the next const projectsContainer
end_idx = content.find("const projectsContainer = document.getElementById")

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + new_array + "\n\n    " + content[end_idx:]
    with open(js_file, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Successfully replaced array.")
else:
    print("Could not find array boundaries.")
