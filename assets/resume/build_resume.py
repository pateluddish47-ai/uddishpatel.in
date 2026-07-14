"""Generates uddish-patel-resume.pdf from the resume text supplied by Uddish.
Run with the system python3 (the homebrew one has a broken pyexpat symbol):
  /usr/bin/python3 assets/resume/build_resume.py
"""
from fpdf import FPDF
from fpdf.enums import XPos, YPos

ACCENT = (44, 110, 190)   # professional blue, close to site accent
TEXT = (30, 30, 30)
MUTED = (90, 90, 90)

pdf = FPDF(format="Letter")
pdf.set_auto_page_break(auto=True, margin=15)
pdf.set_margins(18, 16, 18)
pdf.add_page()
pdf.set_title("Uddish Patel - Resume")
pdf.set_author("Uddish Patel")

def h1(text):
    pdf.set_font("Helvetica", "B", 17)
    pdf.set_text_color(20, 20, 20)
    pdf.cell(0, 8, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")

def subtitle(text):
    pdf.set_font("Helvetica", "B", 11)
    pdf.set_text_color(*ACCENT)
    pdf.cell(0, 6, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")

def contact_line(text):
    pdf.set_font("Helvetica", "", 9.5)
    pdf.set_text_color(*MUTED)
    pdf.cell(0, 6, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")

def section_title(text):
    pdf.ln(3)
    pdf.set_font("Helvetica", "B", 11.5)
    pdf.set_text_color(*ACCENT)
    pdf.cell(0, 7, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    y = pdf.get_y()
    pdf.set_draw_color(*ACCENT)
    pdf.set_line_width(0.5)
    pdf.line(18, y, 210 - 18, y)
    pdf.ln(2)

def body(text, size=9.7, leading=4.6):
    pdf.set_font("Helvetica", "", size)
    pdf.set_text_color(*TEXT)
    pdf.multi_cell(0, leading, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)

def skill_line(label, items):
    pdf.set_font("Helvetica", "B", 9.7)
    pdf.set_text_color(*ACCENT)
    label_w = pdf.get_string_width(label + "  ") + 1
    pdf.write(4.6, label + "  ")
    pdf.set_font("Helvetica", "", 9.7)
    pdf.set_text_color(*TEXT)
    pdf.write(4.6, items)
    pdf.ln(6.2)

def project_title(text):
    pdf.set_font("Helvetica", "B", 10.2)
    pdf.set_text_color(20, 20, 20)
    pdf.multi_cell(0, 5, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)

# ---- HEADER -----------------------------------------------------------
h1("UDDISH VIRALKUMAR PATEL")
subtitle("Software Engineer & Cybersecurity Specialist")
contact_line("+91 83209 05694  |  pateluddish47@gmail.com  |  github.com/pateluddish47-ai  |  linkedin.com/in/uddish-patel")

# ---- PROFESSIONAL SUMMARY ----------------------------------------------
section_title("PROFESSIONAL SUMMARY")
body(
    "Software Engineer & Cybersecurity Specialist with expertise in full-stack development, "
    "distributed systems, and application security. Hands-on experience in vulnerability "
    "assessment, web security testing, REST API design, database optimization, and production "
    "deployment. Proficient in building secure, scalable applications from architecture to "
    "deployment. Strong foundation in OWASP security practices, network fundamentals, and "
    "systems engineering."
)

# ---- TECHNICAL SKILLS ---------------------------------------------------
section_title("TECHNICAL SKILLS")
skill_line("Security & Web Application:",
    "Vulnerability Assessment | Penetration Testing | OWASP Top 10 | XSS/SQLi Detection | "
    "Security Headers Analysis | Input Validation | IDS/WAF Concepts | HTTP Traffic Analysis | Risk Assessment")
skill_line("Programming & Development:",
    "Python | JavaScript | HTML5 | CSS3 | REST API Design | Performance Optimization | Error Handling")
skill_line("Backend & Frameworks:",
    "Flask | SQLAlchemy | .NET Basics | API Architecture | Routing & Middleware")
skill_line("Databases & Systems:",
    "PostgreSQL | SQLite | Database Optimization | Query Tuning | Schema Design | Indexing | Database Migration")
skill_line("Cloud & DevOps:",
    "Docker | Railway | Git/GitHub | CI/CD | Streamlit | Environment Configuration | Container Orchestration")
skill_line("Network & Infrastructure:",
    "TCP/IP | Port Scanning | DNS/WHOIS | HTTP/HTTPS Lifecycle | Network Communication | Subdomain Enumeration")
skill_line("Tools & Platforms:",
    "TryHackMe | Git & GitHub | Linux CLI | Vulnerability Scanners | Visual Studio Code | Postman")

# ---- TECHNICAL PROJECTS -------------------------------------------------
section_title("TECHNICAL PROJECTS")

project_title("1. Password Cracking & Credential Attack Suite - Security Toolkit")
body(
    "Developed an ethical password security toolkit with live interactive dashboard for "
    "real-world hash cracking simulations. Implemented crypto-hash cracking against Linux "
    "shadow ($1/$5/$6$) and Windows NTLM hashes. Built live hardware benchmark measuring "
    "actual hashing performance (hashes/sec) at runtime. Integrated NIST SP 800-63B compliance "
    "engine with breach corpus analysis, entropy calculation, and pattern-based vulnerability "
    "checks. Created visual analytics: entropy histogram, severity pie chart, risk ranking. "
    "Implemented 38 automated pytest tests. Deployed on Streamlit Community Cloud."
)
pdf.ln(1.5)

project_title("2. SentinelShield - Intrusion Detection System & Web Application Firewall")
body(
    "Engineered educational IDS/WAF system analyzing HTTP traffic and detecting web attacks "
    "(SQL injection, XSS). Implemented packet inspection, real-time alert generation, and "
    "dashboard visualization. Built secure request logging and efficient query performance "
    "using Flask + PostgreSQL. Designed data pipelines for security event logging and "
    "analysis. Demonstrated network protocol understanding and traffic monitoring at scale."
)
pdf.ln(1.5)

project_title("3. AegisScan - Web Vulnerability Scanner")
body(
    "Designed modular distributed architecture with separate backend modules: DNS resolution, "
    "port scanning, API discovery, directory enumeration. Implemented scalable REST API "
    "handling concurrent scan requests with async result processing. Built modules detecting "
    "XSS and SQL Injection vulnerabilities. Created interactive dashboard for result "
    "visualization. Deployed with Docker containerization for service isolation and scalable "
    "deployment patterns."
)
pdf.ln(1.5)

project_title("4. CA Management System - Full-Stack Production Application")
body(
    "Architected and deployed production-grade client management system using Flask + "
    "SQLAlchemy. Optimized database: migrated SQLite -> PostgreSQL for production "
    "reliability. Designed RESTful APIs with robust error handling and data consistency. "
    "Deployed containerized application using Docker + Railway with environment configuration "
    "and secrets management. Demonstrated systems-level thinking for load handling and "
    "concurrent requests."
)
pdf.ln(1.5)

project_title("5. Doctor Appointment System - Full-Stack Web Application")
body(
    "Built end-to-end web application for appointment scheduling with role-based access "
    "control. Frontend: Responsive HTML5/CSS3/JavaScript UI. Backend: Flask API with proper "
    "state management and authentication focus. Designed database for efficient scheduling "
    "queries and appointment consistency. Evaluated authentication mechanisms and implemented "
    "validation techniques to reduce security risks."
)

# ---- EDUCATION -----------------------------------------------------------
section_title("EDUCATION")
pdf.set_font("Helvetica", "B", 9.8)
pdf.set_text_color(20, 20, 20)
pdf.cell(0, 5, "B.E. Computer Science & Engineering  |  CGPA: 7.80/10", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
pdf.set_font("Helvetica", "", 9.5)
pdf.set_text_color(*MUTED)
pdf.cell(0, 5, "Narnarayan Shastri Institute of Technology (NSIT), Gujarat Technological University (GTU)", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
pdf.ln(3)
pdf.set_font("Helvetica", "B", 9.8)
pdf.set_text_color(20, 20, 20)
pdf.cell(0, 5, "Skillogic Cybersecurity Course  |  In Progress", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

# ---- TRAINING & CERTIFICATIONS -------------------------------------------
section_title("TRAINING & CERTIFICATIONS")
certifications = [
    ("Cybersecurity Internship - Unified Mentor Private Limited", "3-month internship: network security, vulnerability assessment, ethical hacking fundamentals"),
    ("Pre Security Learning Path - TryHackMe", "Completed - 19h 10m of hands-on labs: reconnaissance, web attacks, real-world attack simulations"),
    ("Complete Web Development Course - Udemy", "100-hour program: HTML, CSS, JavaScript, responsive design, frontend and backend development"),
    ("Certificate of Professional Exposure - SkillFied Mentor", "Professional career development and industry orientation session"),
]
for title, desc in certifications:
    pdf.set_font("Helvetica", "B", 9.7)
    pdf.set_text_color(20, 20, 20)
    pdf.write(4.6, title + " - ")
    pdf.set_font("Helvetica", "", 9.7)
    pdf.set_text_color(*TEXT)
    pdf.write(4.6, desc)
    pdf.ln(6)
pdf.ln(1)

# ---- KEY STRENGTHS --------------------------------------------------------
section_title("KEY STRENGTHS")
strengths = [
    ("Security & Systems Mindset:", "End-to-end application design from architecture to deployment with security-first thinking"),
    ("Production-Ready Code:", "Built and deployed real applications; familiar with deployment, monitoring, and debugging challenges"),
    ("Full-Stack Capabilities:", "Comfortable across frontend, backend, databases, DevOps, and security testing"),
    ("Fast Learner:", "Self-taught Docker, PostgreSQL optimization, cloud deployment, and advanced security tools"),
    ("Independent Problem Solver:", "Autonomously own projects from ideation through production; strong debugging and troubleshooting skills"),
]
for label, desc in strengths:
    pdf.set_font("Helvetica", "B", 9.6)
    pdf.set_text_color(*ACCENT)
    pdf.write(4.6, label + " ")
    pdf.set_font("Helvetica", "", 9.6)
    pdf.set_text_color(*TEXT)
    pdf.write(4.6, desc)
    pdf.ln(5.6)

pdf.output("uddish-patel-resume.pdf")
print("done")
