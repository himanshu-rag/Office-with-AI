#!/bin/bash
OFFICECLI="/Users/himanshu_rags/.local/bin/officecli"
FILE="DeepShield_AI.pptx"

# Ensure the file doesn't exist to start fresh
rm -f $FILE

$OFFICECLI create $FILE

# SLIDE 1 - TITLE SLIDE
$OFFICECLI add $FILE / --type slide --prop background=0A0A0F
$OFFICECLI add $FILE '/slide[1]' --type shape --prop text="DeepShield AI" --prop font=Inter --prop size=54 --prop bold=true --prop color=FFFFFF --prop x=2cm --prop y=3cm --prop w=15cm
$OFFICECLI add $FILE '/slide[1]' --type shape --prop text="Your Personal Cybersecurity Intelligence Shield" --prop font=Inter --prop size=32 --prop color=0A84FF --prop x=2cm --prop y=6cm --prop w=20cm
$OFFICECLI add $FILE '/slide[1]' --type shape --prop text='"Detect threats in seconds. Before they reach you."' --prop font=Inter --prop size=24 --prop color=CCCCCC --prop x=2cm --prop y=8cm --prop w=20cm --prop italic=true
# Icon concept (shield shape)
$OFFICECLI add $FILE '/slide[1]' --type shape --prop shapeType=shield --prop x=18cm --prop y=3cm --prop w=5cm --prop h=5cm --prop fill=0A84FF

# SLIDE 2 - THE PROBLEM
$OFFICECLI add $FILE / --type slide --prop background=0A0A0F
$OFFICECLI add $FILE '/slide[2]' --type shape --prop text="Cyber Threats Are Invisible to Normal People" --prop font=Inter --prop size=40 --prop bold=true --prop color=FFFFFF --prop x=1cm --prop y=1cm --prop w=22cm
$OFFICECLI add $FILE '/slide[2]' --type shape --prop text="• 3.4 billion phishing emails are sent every day
• 1 in 3 people cannot identify a phishing link
• Cybercrime causes \$8 trillion in damage yearly" --prop font=Inter --prop size=26 --prop color=FF453A --prop x=2cm --prop y=4cm --prop w=20cm --prop h=4cm
$OFFICECLI add $FILE '/slide[2]' --type shape --prop text="Existing tools are built for enterprises, not for individuals. There is no simple, intelligent tool for everyday users to verify suspicious content before they click, open, or install it." --prop font=Inter --prop size=22 --prop color=CCCCCC --prop x=2cm --prop y=9cm --prop w=20cm

# SLIDE 3 - OUR SOLUTION
$OFFICECLI add $FILE / --type slide --prop background=0A0A0F
$OFFICECLI add $FILE '/slide[3]' --type shape --prop text="DeepShield AI — Scan Anything. Know Instantly." --prop font=Inter --prop size=40 --prop bold=true --prop color=FFFFFF --prop x=1cm --prop y=1cm --prop w=22cm
$OFFICECLI add $FILE '/slide[3]' --type shape --prop text="An AI-powered threat detection platform that lets any person instantly scan URLs, emails, messages, files, PDFs, QR codes, images, and audio for cyber threats — in plain English." --prop font=Inter --prop size=22 --prop color=0A84FF --prop x=2cm --prop y=3cm --prop w=21cm
$OFFICECLI add $FILE '/slide[3]' --type shape --prop text="1. Instant Analysis — Results in under 5 seconds
2. Plain English — No technical jargon, just clear verdicts
3. Every Format — Links, files, images, audio, QR codes" --prop font=Inter --prop size=24 --prop color=FFFFFF --prop x=2cm --prop y=7cm --prop w=20cm

# SLIDE 4 - KEY FEATURES (8 tiles)
$OFFICECLI add $FILE / --type slide --prop background=0A0A0F
$OFFICECLI add $FILE '/slide[4]' --type shape --prop text="8 Specialized AI Scanning Engines" --prop font=Inter --prop size=40 --prop bold=true --prop color=FFFFFF --prop x=1cm --prop y=1cm --prop w=22cm
# Using a 4x2 grid of shapes
# Row 1
$OFFICECLI add $FILE '/slide[4]' --type shape --prop text="🔗 URL & Website Scanner
Detects phishing sites, malware domains, fake login pages" --prop font=Inter --prop size=14 --prop color=FFFFFF --prop fill=1A1A24 --prop x=1cm --prop y=3.5cm --prop w=5.5cm --prop h=3.5cm
$OFFICECLI add $FILE '/slide[4]' --type shape --prop text="📧 Phishing Email
Analyzes email headers, sender spoofing, urgent language" --prop font=Inter --prop size=14 --prop color=FFFFFF --prop fill=1A1A24 --prop x=7cm --prop y=3.5cm --prop w=5.5cm --prop h=3.5cm
$OFFICECLI add $FILE '/slide[4]' --type shape --prop text="💬 Scam SMS Analyzer
Identifies prize scams, OTP fraud, fake bank alerts" --prop font=Inter --prop size=14 --prop color=FFFFFF --prop fill=1A1A24 --prop x=13cm --prop y=3.5cm --prop w=5.5cm --prop h=3.5cm
$OFFICECLI add $FILE '/slide[4]' --type shape --prop text="📷 QR Code Scanner
Reveals hidden malicious URLs inside QR codes" --prop font=Inter --prop size=14 --prop color=FFFFFF --prop fill=1A1A24 --prop x=19cm --prop y=3.5cm --prop w=5.5cm --prop h=3.5cm
# Row 2
$OFFICECLI add $FILE '/slide[4]' --type shape --prop text="🖼️ Image Scanner
Detects fake screenshots, scam images, embedded threats" --prop font=Inter --prop size=14 --prop color=FFFFFF --prop fill=1A1A24 --prop x=1cm --prop y=8cm --prop w=5.5cm --prop h=3.5cm
$OFFICECLI add $FILE '/slide[4]' --type shape --prop text="📄 PDF Security
Finds hidden JavaScript, embedded files, exploit payloads" --prop font=Inter --prop size=14 --prop color=FFFFFF --prop fill=1A1A24 --prop x=7cm --prop y=8cm --prop w=5.5cm --prop h=3.5cm
$OFFICECLI add $FILE '/slide[4]' --type shape --prop text="🎙️ Audio Scam Detector
Identifies deepfake voices, social engineering calls" --prop font=Inter --prop size=14 --prop color=FFFFFF --prop fill=1A1A24 --prop x=13cm --prop y=8cm --prop w=5.5cm --prop h=3.5cm
$OFFICECLI add $FILE '/slide[4]' --type shape --prop text="📦 Software & Files
Scans APKs, EXEs, and scripts for malware behavior" --prop font=Inter --prop size=14 --prop color=FFFFFF --prop fill=1A1A24 --prop x=19cm --prop y=8cm --prop w=5.5cm --prop h=3.5cm

# SLIDE 5 - HOW IT WORKS
$OFFICECLI add $FILE / --type slide --prop background=0A0A0F
$OFFICECLI add $FILE '/slide[5]' --type shape --prop text="Simple as 1, 2, 3" --prop font=Inter --prop size=40 --prop bold=true --prop color=FFFFFF --prop x=1cm --prop y=1cm --prop w=22cm
$OFFICECLI add $FILE '/slide[5]' --type shape --prop text="1. Upload or Paste
Drop a file, paste a link, or forward a message" --prop font=Inter --prop size=18 --prop color=FFFFFF --prop fill=1A1A24 --prop x=1.5cm --prop y=5cm --prop w=6cm --prop h=4cm
$OFFICECLI add $FILE '/slide[5]' --type shape --prop shapeType=rightArrow --prop fill=0A84FF --prop x=8.2cm --prop y=6.5cm --prop w=1cm --prop h=1cm
$OFFICECLI add $FILE '/slide[5]' --type shape --prop text="2. AI Analysis
Our engine performs deep static + behavioral analysis" --prop font=Inter --prop size=18 --prop color=FFFFFF --prop fill=1A1A24 --prop x=9.7cm --prop y=5cm --prop w=6cm --prop h=4cm
$OFFICECLI add $FILE '/slide[5]' --type shape --prop shapeType=rightArrow --prop fill=0A84FF --prop x=16.4cm --prop y=6.5cm --prop w=1cm --prop h=1cm
$OFFICECLI add $FILE '/slide[5]' --type shape --prop text="3. Get Your Verdict
Threat score 0–100, plain English explanation, actions" --prop font=Inter --prop size=18 --prop color=FFFFFF --prop fill=1A1A24 --prop x=17.9cm --prop y=5cm --prop w=6cm --prop h=4cm

# SLIDE 6 - FORENSIC REPORT
$OFFICECLI add $FILE / --type slide --prop background=0A0A0F
$OFFICECLI add $FILE '/slide[6]' --type shape --prop text="Not Just a Score — A Full Forensic Report" --prop font=Inter --prop size=40 --prop bold=true --prop color=FFFFFF --prop x=1cm --prop y=1cm --prop w=22cm
$OFFICECLI add $FILE '/slide[6]' --type shape --prop text="• Threat Score (0–100)
• Threat Classification (Phishing / Safe / Malware)
• Plain English Explanation
• Per-Category Breakdown (Domain Reputation, JS Risk)
• Actionable Recommendations
• Evidence List (Specific proof from file or URL)" --prop font=Inter --prop size=22 --prop color=FFFFFF --prop x=2cm --prop y=4cm --prop w=16cm --prop h=8cm
# Visual mock
$OFFICECLI add $FILE '/slide[6]' --type shape --prop text="98
Critical Threat" --prop font=Inter --prop size=28 --prop bold=true --prop color=FFFFFF --prop fill=FF453A --prop x=17cm --prop y=4.5cm --prop w=6cm --prop h=5cm

# SLIDE 7 - TELEGRAM BOT
$OFFICECLI add $FILE / --type slide --prop background=0A0A0F
$OFFICECLI add $FILE '/slide[7]' --type shape --prop text="Scan Threats Directly from WhatsApp & Telegram" --prop font=Inter --prop size=38 --prop bold=true --prop color=FFFFFF --prop x=1cm --prop y=1cm --prop w=23cm
$OFFICECLI add $FILE '/slide[7]' --type shape --prop text="• Forward any suspicious message, file, image, or voice note
• Bot replies with full threat verdict in seconds
• No app download required — works on any device
• Ideal for elderly users, students, and non-technical people" --prop font=Inter --prop size=22 --prop color=FFFFFF --prop x=2cm --prop y=3.5cm --prop w=20cm
$OFFICECLI add $FILE '/slide[7]' --type shape --prop text="Use Case: Your grandmother gets a suspicious bank message. She forwards it to DeepShield Bot. In 3 seconds she knows: 🔴 Scam Detected." --prop font=Inter --prop size=20 --prop color=0A84FF --prop x=2cm --prop y=8cm --prop w=20cm --prop h=3cm

# SLIDE 8 - GLOBAL THREAT RADAR
$OFFICECLI add $FILE / --type slide --prop background=0A0A0F
$OFFICECLI add $FILE '/slide[8]' --type shape --prop text="Live Global Threat Intelligence" --prop font=Inter --prop size=40 --prop bold=true --prop color=FFFFFF --prop x=1cm --prop y=1cm --prop w=22cm
$OFFICECLI add $FILE '/slide[8]' --type shape --prop text="A real-time 3D globe visualization showing active threat detections happening across the world. Cybersecurity teams can monitor live threat trends and geographic attack patterns at a glance." --prop font=Inter --prop size=22 --prop color=FFFFFF --prop x=2cm --prop y=4cm --prop w=14cm
# Circle representation of globe
$OFFICECLI add $FILE '/slide[8]' --type shape --prop shapeType=ellipse --prop fill=0A0A0F --prop line.color=0A84FF --prop line.width=3pt --prop x=17cm --prop y=4cm --prop w=6cm --prop h=6cm
$OFFICECLI add $FILE '/slide[8]' --type shape --prop shapeType=star5 --prop fill=FF453A --prop line.width=0 --prop x=18cm --prop y=5cm --prop w=0.5cm --prop h=0.5cm
$OFFICECLI add $FILE '/slide[8]' --type shape --prop shapeType=star5 --prop fill=FF9F0A --prop line.width=0 --prop x=19cm --prop y=8cm --prop w=0.5cm --prop h=0.5cm
$OFFICECLI add $FILE '/slide[8]' --type shape --prop shapeType=star5 --prop fill=FF453A --prop line.width=0 --prop x=21cm --prop y=6cm --prop w=0.5cm --prop h=0.5cm

# SLIDE 9 - CHROME EXTENSION
$OFFICECLI add $FILE / --type slide --prop background=0A0A0F
$OFFICECLI add $FILE '/slide[9]' --type shape --prop text="Passive Protection While You Browse" --prop font=Inter --prop size=40 --prop bold=true --prop color=FFFFFF --prop x=1cm --prop y=1cm --prop w=22cm
$OFFICECLI add $FILE '/slide[9]' --type shape --prop text="Features of the DeepShield Chrome Extension:
• Automatically scans every website you visit in the background
• Blocks access to malicious pages before they load
• Shows a real-time risk badge on every site
• User can toggle 'Active Guardian' mode for hands-free protection
• No friction — works silently in the background" --prop font=Inter --prop size=22 --prop color=FFFFFF --prop x=2cm --prop y=4cm --prop w=18cm
$OFFICECLI add $FILE '/slide[9]' --type shape --prop text="Active Guardian: ON" --prop font=Inter --prop size=18 --prop color=FFFFFF --prop fill=30D158 --prop x=18cm --prop y=2cm --prop w=5cm --prop h=1.2cm

# SLIDE 10 - WHO IS IT FOR
$OFFICECLI add $FILE / --type slide --prop background=0A0A0F
$OFFICECLI add $FILE '/slide[10]' --type shape --prop text="Built for Everyone, Not Just Experts" --prop font=Inter --prop size=40 --prop bold=true --prop color=FFFFFF --prop x=1cm --prop y=1cm --prop w=22cm
# 2x2 grid
$OFFICECLI add $FILE '/slide[10]' --type shape --prop text="Students
Verify links from unknown senders before clicking" --prop font=Inter --prop size=20 --prop color=FFFFFF --prop fill=1A1A24 --prop x=2cm --prop y=4cm --prop w=10cm --prop h=3.5cm
$OFFICECLI add $FILE '/slide[10]' --type shape --prop text="Working Professionals
Scan email attachments before opening" --prop font=Inter --prop size=20 --prop color=FFFFFF --prop fill=1A1A24 --prop x=13.5cm --prop y=4cm --prop w=10cm --prop h=3.5cm
$OFFICECLI add $FILE '/slide[10]' --type shape --prop text="Senior Citizens
Forward suspicious messages to Telegram Bot for instant help" --prop font=Inter --prop size=20 --prop color=FFFFFF --prop fill=1A1A24 --prop x=2cm --prop y=8.5cm --prop w=10cm --prop h=3.5cm
$OFFICECLI add $FILE '/slide[10]' --type shape --prop text="Small Businesses
Protect employees from phishing without enterprise costs" --prop font=Inter --prop size=20 --prop color=FFFFFF --prop fill=1A1A24 --prop x=13.5cm --prop y=8.5cm --prop w=10cm --prop h=3.5cm

# SLIDE 11 - IMPACT & VISION
$OFFICECLI add $FILE / --type slide --prop background=0A0A0F
$OFFICECLI add $FILE '/slide[11]' --type shape --prop text="Our Vision" --prop font=Inter --prop size=40 --prop bold=true --prop color=FFFFFF --prop x=1cm --prop y=1cm --prop w=22cm
$OFFICECLI add $FILE '/slide[11]' --type shape --prop text='"We believe cybersecurity should not be a privilege. Every person, regardless of technical knowledge, deserves to know if something is trying to hurt them online."' --prop font=Inter --prop size=26 --prop color=0A84FF --prop italic=true --prop x=2cm --prop y=3cm --prop w=21cm
$OFFICECLI add $FILE '/slide[11]' --type shape --prop text="• Prevent financial fraud for millions of everyday users
• Reduce successful phishing attacks through education + AI
• Make threat intelligence accessible in every language, on every platform" --prop font=Inter --prop size=22 --prop color=FFFFFF --prop x=2cm --prop y=7cm --prop w=21cm

# SLIDE 12 - THANK YOU
$OFFICECLI add $FILE / --type slide --prop background=0A0A0F
$OFFICECLI add $FILE '/slide[12]' --type shape --prop text="DeepShield AI" --prop font=Inter --prop size=60 --prop bold=true --prop color=FFFFFF --prop x=7cm --prop y=3.5cm --prop w=12cm --prop h=3cm
$OFFICECLI add $FILE '/slide[12]' --type shape --prop text="Scan Smart. Stay Safe." --prop font=Inter --prop size=32 --prop color=0A84FF --prop x=7cm --prop y=6.5cm --prop w=12cm --prop h=2cm
$OFFICECLI add $FILE '/slide[12]' --type shape --prop shapeType=shield --prop x=10.5cm --prop y=8.5cm --prop w=4cm --prop h=4cm --prop fill=0A84FF

$OFFICECLI close $FILE
