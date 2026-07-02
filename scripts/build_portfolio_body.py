"""
Portfolio body PDF — generated with ReportLab.
Will be merged with the HTML-rendered cover (portfolio_cover.pdf).

Sections:
  - Profile / About
  - Stack
  - Featured Projects (3 cards)
  - Case Study: personal-platform-infra (deep dive)
  - Contact / Links
"""

import sys
import os
from pathlib import Path

# Add PDF skill scripts to path for any utilities we might need
PDF_SKILL_DIR = "/home/z/my-project/skills/pdf"
sys.path.insert(0, os.path.join(PDF_SKILL_DIR, "scripts"))

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    PageBreak,
    Table,
    TableStyle,
    KeepTogether,
    Image,
    HRFlowable,
    ListFlowable,
    ListItem,
    Frame,
    PageTemplate,
    BaseDocTemplate,
)
from reportlab.platypus.flowables import Flowable

# ────────────────────────────────────────────────────────────────────
# Font registration
# ────────────────────────────────────────────────────────────────────
FONT_DIR = "/usr/share/fonts"

# Try to register Inter (sans) and JetBrains Mono equivalents
# Fallback to Liberation Sans / Liberation Mono if Inter isn't available
def safe_register(name, path):
    try:
        pdfmetrics.registerFont(TTFont(name, path))
        return True
    except Exception as e:
        print(f"⚠️  Could not register {name} from {path}: {e}")
        return False

# Body sans-serif
sans_regular = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
sans_bold = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
sans_italic = "/usr/share/fonts/truetype/liberation/LiberationSans-Italic.ttf"

# Mono
mono_regular = "/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf"
mono_bold = "/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf"

safe_register("Body", sans_regular)
safe_register("Body-Bold", sans_bold)
safe_register("Body-Italic", sans_italic)
safe_register("Mono", mono_regular)
safe_register("Mono-Bold", mono_bold)
registerFontFamily(
    "Body",
    normal="Body",
    bold="Body-Bold",
    italic="Body-Italic",
)
registerFontFamily("Mono", normal="Mono", bold="Mono-Bold")

# ────────────────────────────────────────────────────────────────────
# Palette (from palette.cascade output, dark mode)
# ────────────────────────────────────────────────────────────────────
PAGE_BG       = colors.HexColor('#0f0e0d')
SECTION_BG    = colors.HexColor('#21201e')
CARD_BG       = colors.HexColor('#2b2a25')
TABLE_STRIPE  = colors.HexColor('#211f1b')
HEADER_FILL   = colors.HexColor('#524c38')
COVER_BLOCK   = colors.HexColor('#454033')
BORDER        = colors.HexColor('#514a35')
ICON          = colors.HexColor('#beab74')
ACCENT        = colors.HexColor('#e1c676')  # gold
ACCENT_2      = colors.HexColor('#4aa0bd')  # sky
TEXT_PRIMARY  = colors.HexColor('#e6e5e3')
TEXT_MUTED    = colors.HexColor('#9b9993')

# ────────────────────────────────────────────────────────────────────
# Page geometry — match the cover dimensions exactly (794×1123 px @ 96dpi)
# ────────────────────────────────────────────────────────────────────
PAGE_W, PAGE_H = 595.92, 842.88  # match portfolio_cover.pdf exactly
LEFT_MARGIN = 22 * mm
RIGHT_MARGIN = 22 * mm
TOP_MARGIN = 25 * mm
BOTTOM_MARGIN = 22 * mm
CONTENT_W = PAGE_W - LEFT_MARGIN - RIGHT_MARGIN

# ────────────────────────────────────────────────────────────────────
# Styles
# ────────────────────────────────────────────────────────────────────
styles = {}

styles['eyebrow'] = ParagraphStyle(
    'eyebrow',
    fontName='Mono-Bold',
    fontSize=8,
    textColor=ACCENT,
    leading=12,
    spaceBefore=0,
    spaceAfter=4,
)

styles['h1'] = ParagraphStyle(
    'h1',
    fontName='Body-Bold',
    fontSize=28,
    textColor=TEXT_PRIMARY,
    leading=34,
    spaceBefore=0,
    spaceAfter=8,
)

styles['h2'] = ParagraphStyle(
    'h2',
    fontName='Body-Bold',
    fontSize=18,
    textColor=TEXT_PRIMARY,
    leading=24,
    spaceBefore=14,
    spaceAfter=6,
)

styles['h3'] = ParagraphStyle(
    'h3',
    fontName='Mono-Bold',
    fontSize=10,
    textColor=ACCENT,
    leading=14,
    spaceBefore=12,
    spaceAfter=4,
)

styles['body'] = ParagraphStyle(
    'body',
    fontName='Body',
    fontSize=10.5,
    textColor=TEXT_PRIMARY,
    leading=16,
    spaceBefore=0,
    spaceAfter=8,
    alignment=TA_LEFT,
)

styles['body_muted'] = ParagraphStyle(
    'body_muted',
    fontName='Body',
    fontSize=10,
    textColor=TEXT_MUTED,
    leading=15,
    spaceBefore=0,
    spaceAfter=6,
    alignment=TA_LEFT,
)

styles['mono_small'] = ParagraphStyle(
    'mono_small',
    fontName='Mono',
    fontSize=9,
    textColor=TEXT_MUTED,
    leading=13,
    spaceBefore=0,
    spaceAfter=4,
)

styles['mono_accent'] = ParagraphStyle(
    'mono_accent',
    fontName='Mono-Bold',
    fontSize=9,
    textColor=ACCENT,
    leading=13,
    spaceBefore=0,
    spaceAfter=4,
)

styles['project_title'] = ParagraphStyle(
    'project_title',
    fontName='Mono-Bold',
    fontSize=14,
    textColor=TEXT_PRIMARY,
    leading=18,
    spaceBefore=0,
    spaceAfter=2,
)

styles['project_tagline'] = ParagraphStyle(
    'project_tagline',
    fontName='Body-Italic',
    fontSize=10.5,
    textColor=ACCENT,
    leading=15,
    spaceBefore=0,
    spaceAfter=8,
)

styles['bullet'] = ParagraphStyle(
    'bullet',
    fontName='Body',
    fontSize=10,
    textColor=TEXT_PRIMARY,
    leading=15,
    leftIndent=14,
    spaceBefore=0,
    spaceAfter=4,
    alignment=TA_LEFT,
)

styles['stat_num'] = ParagraphStyle(
    'stat_num',
    fontName='Mono-Bold',
    fontSize=24,
    textColor=ACCENT,
    leading=28,
    alignment=TA_LEFT,
)

styles['stat_lbl'] = ParagraphStyle(
    'stat_lbl',
    fontName='Mono',
    fontSize=7.5,
    textColor=TEXT_MUTED,
    leading=10,
    alignment=TA_LEFT,
)

styles['footer'] = ParagraphStyle(
    'footer',
    fontName='Mono',
    fontSize=8,
    textColor=TEXT_MUTED,
    leading=10,
    alignment=TA_LEFT,
)

# ────────────────────────────────────────────────────────────────────
# Custom flowables
# ────────────────────────────────────────────────────────────────────

class HorizontalLine(Flowable):
    """A simple full-width horizontal line in the accent or border color."""
    def __init__(self, width=CONTENT_W, color=BORDER, thickness=0.5, space_before=0, space_after=0):
        Flowable.__init__(self)
        self.width = width
        self.color = color
        self.thickness = thickness
        self.space_before = space_before
        self.space_after = space_after

    def wrap(self, availWidth, availHeight):
        return self.width, self.thickness + self.space_before + self.space_after

    def draw(self):
        self.canv.setStrokeColor(self.color)
        self.canv.setLineWidth(self.thickness)
        y = self.space_after
        self.canv.line(0, y, self.width, y)


class SectionTitle(Flowable):
    """Section title block: eyebrow + heading + thin rule below."""
    def __init__(self, eyebrow, title, description=None):
        Flowable.__init__(self)
        self.eyebrow = eyebrow
        self.title = title
        self.description = description
        self._h = 60 if description else 48

    def wrap(self, availWidth, availHeight):
        return availWidth, self._h

    def draw(self):
        c = self.canv
        # Eyebrow
        c.setFillColor(ACCENT)
        c.setFont('Mono-Bold', 8)
        c.drawString(0, self._h - 12, self.eyebrow.upper())
        # Title
        c.setFillColor(TEXT_PRIMARY)
        c.setFont('Body-Bold', 22)
        c.drawString(0, self._h - 32, self.title)
        # Description
        if self.description:
            c.setFillColor(TEXT_MUTED)
            c.setFont('Body', 10)
            # Wrap the description simply
            from reportlab.lib.utils import simpleSplit
            lines = simpleSplit(self.description, 'Body', 10, self.wrap_width or 400)
            y = self._h - 48
            for line in lines[:2]:
                c.drawString(0, y, line)
                y -= 14
        # Thin rule
        c.setStrokeColor(BORDER)
        c.setLineWidth(0.5)
        c.line(0, 0, self.wrap_width or 400, 0)

    def wrap(self, availWidth, availHeight):
        self.wrap_width = availWidth
        return availWidth, self._h


class StatBlock(Flowable):
    """Three-up stat block: number + label, separated by vertical rules."""
    def __init__(self, stats, width=CONTENT_W):
        Flowable.__init__(self)
        self.stats = stats
        self.width = width
        self._h = 60

    def wrap(self, availWidth, availHeight):
        self.wrap_width = availWidth
        return availWidth, self._h

    def draw(self):
        c = self.canv
        col_w = self.wrap_width / len(self.stats)
        for i, (num, lbl) in enumerate(self.stats):
            x = i * col_w
            # Vertical divider on left (except first)
            if i > 0:
                c.setStrokeColor(BORDER)
                c.setLineWidth(0.5)
                c.line(x, 5, x, self._h - 10)
            # Number
            c.setFillColor(ACCENT)
            c.setFont('Mono-Bold', 24)
            c.drawString(x + 14, self._h - 30, str(num))
            # Label
            c.setFillColor(TEXT_MUTED)
            c.setFont('Mono', 7.5)
            c.drawString(x + 14, self._h - 48, lbl.upper())


class StackTable(Flowable):
    """A two-column table of stack categories and badges."""
    def __init__(self, stack_data, width=CONTENT_W):
        Flowable.__init__(self)
        self.stack_data = stack_data
        self.width = width
        # Calculate height: each row ~ 56px
        self._h = len(stack_data) * 60 + 8

    def wrap(self, availWidth, availHeight):
        self.wrap_width = availWidth
        return availWidth, self._h

    def draw(self):
        c = self.canv
        row_h = 56
        col_label_w = 100
        for i, (category, items) in enumerate(self.stack_data):
            y = self._h - 8 - (i + 1) * row_h
            # Subtle card background
            c.setFillColor(CARD_BG)
            c.setStrokeColor(BORDER)
            c.setLineWidth(0.4)
            c.roundRect(0, y, self.wrap_width, row_h - 6, 4, fill=1, stroke=1)
            # Category label
            c.setFillColor(ACCENT)
            c.setFont('Mono-Bold', 9)
            c.drawString(14, y + row_h - 22, category.upper())
            # Items as inline text (wrap if needed)
            c.setFillColor(TEXT_PRIMARY)
            c.setFont('Mono', 9)
            # Truncate items list to fit one line
            text = "  ·  ".join(items)
            # Wrap text manually
            from reportlab.lib.utils import simpleSplit
            lines = simpleSplit(text, 'Mono', 9, self.wrap_width - col_label_w - 28)
            y_text = y + row_h - 22
            for line in lines[:2]:
                c.drawString(col_label_w + 14, y_text, line)
                y_text -= 13


class ProjectCard(Flowable):
    """A bordered card with project info: title, tagline, description, stack badges, link."""
    def __init__(self, project, width=CONTENT_W, is_featured=False):
        Flowable.__init__(self)
        self.project = project
        self.width = width
        self.is_featured = is_featured
        # Estimate height based on description length
        from reportlab.lib.utils import simpleSplit
        desc_lines = simpleSplit(project['description'], 'Body', 10, width - 28)
        stack_text = "  ·  ".join(project['stack'][:6])
        stack_lines = simpleSplit(stack_text, 'Mono', 8.5, width - 28)
        self._h = 28 + 16 + len(desc_lines) * 14 + 8 + len(stack_lines) * 12 + 24

    def wrap(self, availWidth, availHeight):
        self.wrap_width = availWidth
        return availWidth, self._h

    def draw(self):
        c = self.canv
        from reportlab.lib.utils import simpleSplit

        # Card border + background
        c.setFillColor(CARD_BG)
        c.setStrokeColor(BORDER if not self.is_featured else ACCENT)
        c.setLineWidth(0.6 if not self.is_featured else 1.0)
        c.roundRect(0, 0, self.wrap_width, self._h, 4, fill=1, stroke=1)

        # Top row: date + featured badge
        y = self._h - 18
        c.setFillColor(TEXT_MUTED)
        c.setFont('Mono', 8)
        c.drawString(14, y, self.project['updatedAt'])

        if self.is_featured:
            badge_text = "MOST RECENT"
            badge_w = c.stringWidth(badge_text, 'Mono-Bold', 7.5) + 10
            c.setFillColor(ACCENT)
            c.setStrokeColor(ACCENT)
            c.setLineWidth(0.5)
            c.roundRect(self.wrap_width - 14 - badge_w, y - 2, badge_w, 12, 2, fill=0, stroke=1)
            c.setFont('Mono-Bold', 7.5)
            c.drawString(self.wrap_width - 14 - badge_w + 5, y + 1, badge_text)

        # Project name (mono)
        y -= 18
        c.setFillColor(TEXT_PRIMARY)
        c.setFont('Mono-Bold', 13)
        c.drawString(14, y, self.project['name'])

        # Tagline
        y -= 14
        c.setFillColor(ACCENT)
        c.setFont('Body-Italic', 10)
        tagline_lines = simpleSplit(self.project['tagline'], 'Body-Italic', 10, self.wrap_width - 28)
        for line in tagline_lines[:2]:
            c.drawString(14, y, line)
            y -= 13

        # Description
        y -= 4
        c.setFillColor(TEXT_PRIMARY)
        c.setFont('Body', 10)
        desc_lines = simpleSplit(self.project['description'], 'Body', 10, self.wrap_width - 28)
        for line in desc_lines[:4]:
            c.drawString(14, y, line)
            y -= 14

        # Stack badges (single line, with "+N" if overflow)
        y -= 6
        c.setFillColor(TEXT_MUTED)
        c.setFont('Mono', 8.5)
        stack_text = "  ·  ".join(self.project['stack'][:6])
        if len(self.project['stack']) > 6:
            stack_text += f"  +{len(self.project['stack']) - 6}"
        c.drawString(14, y, stack_text)

        # Link (bottom-right)
        c.setFillColor(ACCENT)
        c.setFont('Body-Bold', 9)
        link_text = "View repository →"
        link_w = c.stringWidth(link_text, 'Body-Bold', 9)
        c.drawString(self.wrap_width - 14 - link_w, 12, link_text)


class CaseStudyBlock(Flowable):
    """A larger block for the case study: problem, approach list, outcomes, stack."""
    def __init__(self, project, width=CONTENT_W):
        Flowable.__init__(self)
        self.project = project
        self.width = width
        # Rough height estimate
        from reportlab.lib.utils import simpleSplit
        h = 40  # header
        h += 20 + len(simpleSplit(project['problem'], 'Body', 10, width - 28)) * 14
        h += 20 + len(project['approach']) * 22
        h += 20 + len(project['highlights']) * 28
        h += 20 + 30  # stack
        self._h = h

    def wrap(self, availWidth, availHeight):
        self.wrap_width = availWidth
        return availWidth, self._h

    def draw(self):
        c = self.canv
        from reportlab.lib.utils import simpleSplit

        # Outer card
        c.setFillColor(CARD_BG)
        c.setStrokeColor(BORDER)
        c.setLineWidth(0.5)
        c.roundRect(0, 0, self.wrap_width, self._h, 4, fill=1, stroke=1)

        y = self._h - 20

        # THE PROBLEM
        c.setFillColor(ACCENT)
        c.setFont('Mono-Bold', 9)
        c.drawString(14, y, "THE PROBLEM")
        y -= 16
        c.setFillColor(TEXT_PRIMARY)
        c.setFont('Body', 10)
        problem_lines = simpleSplit(self.project['problem'], 'Body', 10, self.wrap_width - 28)
        for line in problem_lines:
            c.drawString(14, y, line)
            y -= 14
        y -= 8

        # THE APPROACH
        c.setFillColor(ACCENT)
        c.setFont('Mono-Bold', 9)
        c.drawString(14, y, "THE APPROACH")
        y -= 16
        for item in self.project['approach']:
            # Bullet point
            c.setFillColor(ACCENT)
            c.setFont('Mono-Bold', 10)
            c.drawString(14, y, "›")
            # Text
            c.setFillColor(TEXT_PRIMARY)
            c.setFont('Body', 9.5)
            item_lines = simpleSplit(item, 'Body', 9.5, self.wrap_width - 32)
            for i, line in enumerate(item_lines[:3]):
                c.drawString(24, y, line)
                y -= 13
            y -= 4

        y -= 6

        # OUTCOMES
        c.setFillColor(ACCENT)
        c.setFont('Mono-Bold', 9)
        c.drawString(14, y, "OUTCOMES")
        y -= 16
        for h in self.project['highlights']:
            # Small box per outcome
            from reportlab.lib.utils import simpleSplit
            h_lines = simpleSplit(h, 'Body', 9.5, self.wrap_width - 50)
            box_h = max(24, len(h_lines) * 13 + 8)
            c.setFillColor(SECTION_BG)
            c.setStrokeColor(BORDER)
            c.setLineWidth(0.3)
            c.roundRect(14, y - box_h + 14, self.wrap_width - 28, box_h, 3, fill=1, stroke=1)
            # Bullet icon (small square)
            c.setFillColor(ACCENT)
            c.rect(20, y + 2, 4, 4, fill=1, stroke=0)
            # Text
            c.setFillColor(TEXT_PRIMARY)
            c.setFont('Body', 9.5)
            ty = y + 2
            for line in h_lines[:2]:
                c.drawString(30, ty, line)
                ty -= 12
            y -= box_h + 4

        y -= 6

        # STACK
        c.setFillColor(ACCENT)
        c.setFont('Mono-Bold', 9)
        c.drawString(14, y, "STACK")
        y -= 14
        c.setFillColor(TEXT_PRIMARY)
        c.setFont('Mono', 9)
        stack_text = ", ".join(self.project['stack'])
        stack_lines = simpleSplit(stack_text, 'Mono', 9, self.wrap_width - 28)
        for line in stack_lines[:2]:
            c.drawString(14, y, line)
            y -= 12


# ────────────────────────────────────────────────────────────────────
# Page background + footer painter
# ────────────────────────────────────────────────────────────────────

def paint_page_bg(canvas, doc):
    """Paint the dark page background + footer on every body page."""
    canvas.saveState()
    # Full-page dark background
    canvas.setFillColor(PAGE_BG)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    # Footer
    canvas.setFillColor(TEXT_MUTED)
    canvas.setFont('Mono', 8)
    # Left: name
    canvas.drawString(LEFT_MARGIN, 12 * mm, "Vinicius Santos · Backend Engineer Portfolio")
    # Right: page number (offset by +1 since cover is page 1, merged later)
    page_num_text = f"p. {doc.page + 1}"
    canvas.drawRightString(PAGE_W - RIGHT_MARGIN, 12 * mm, page_num_text)

    # Thin footer rule
    canvas.setStrokeColor(BORDER)
    canvas.setLineWidth(0.4)
    canvas.line(LEFT_MARGIN, 15 * mm, PAGE_W - RIGHT_MARGIN, 15 * mm)

    # Top accent corner
    canvas.setFillColor(ACCENT)
    canvas.rect(0, PAGE_H - 4, 40 * mm, 4, fill=1, stroke=0)

    canvas.restoreState()


# ────────────────────────────────────────────────────────────────────
# Content
# ────────────────────────────────────────────────────────────────────

PROFILE = {
    "name": "Vinicius de Oliveira Santos",
    "role": "Backend Software Engineer",
    "company": "UOL",
    "location": "São Paulo, SP — Brazil",
    "email": "viniciusoli2020@gmail.com",
    "phone": "+55 (11) 91676-2083",
    "linkedin": "linkedin.com/in/vinicius-oliveira-7ba1bb204",
    "github": "github.com/vinicius-ssantos",
    "pitch": (
        "Backend Software Engineer at UOL, working on authentication, authorization "
        "and account-protection flows. I focus on reliability, delivery quality and "
        "production stability — the kind of work where small mistakes have outsized "
        "consequences."
    ),
    "long_pitch_1": (
        "Backend Software Engineer with experience in APIs, integrations and "
        "security-critical services. I work with a focus on reliability, delivery "
        "quality and production stability — building and evolving the kind of systems "
        "where small mistakes have outsized consequences. My day-to-day at UOL involves "
        "hardening authentication and account-protection flows, standardizing contracts "
        "between services, and sustaining CI/CD pipelines on Kubernetes so releases "
        "stay boring."
    ),
    "long_pitch_2": (
        "My path into backend was unusual: I started in QA at Autbank in 2021, "
        "automating API tests with RestAssured and JMeter. Two years later I moved "
        "into the developer seat at the same company, and in 2024 I joined UOL to "
        "work on the authentication and account-protection layer that millions of "
        "Brazilians rely on daily. The QA years still shape how I write code — I "
        "think in terms of failure modes first, happy paths second."
    ),
    "long_pitch_3": (
        "Outside of work, I keep a public GitHub with 52 repositories because I "
        "believe in shipping in the open — half-finished experiments included. "
        "The most ambitious one is personal-platform-infra, a GitOps-style "
        "infrastructure repo that runs my personal platform of MCP servers and "
        "BFFs across local + VPS environments."
    ),
    "stats": [("5+", "Years backend & QA"), ("52", "Public repos"), ("777", "Contributions / yr")],
}

EXPERIENCE = [
    {
        "period": "08/2024 — Present",
        "company": "UOL",
        "role": "Software Engineer (Backend)",
        "summary": (
            "Developing and evolving APIs and integrations for critical authentication, "
            "authorization and account-protection flows."
        ),
        "bullets": [
            "Evolve APIs and integrations powering critical authentication, authorization and account-protection flows.",
            "Standardize service contracts and refine business rules to reduce integration failures across teams.",
            "Strengthen quality with unit and integration tests, lowering regression on critical changes.",
            "Sustain CI/CD pipelines and Kubernetes operations to keep releases stable across QA and production.",
        ],
        "stack": ["Java", "Spring", "REST APIs", "SQL", "Redis", "JUnit", "Jenkins", "CI/CD", "Kubernetes", "Git"],
        "current": True,
    },
    {
        "period": "01/2023 — 01/2024",
        "company": "Autbank — Projetos e Consultoria",
        "role": "Systems Developer Analyst",
        "summary": (
            "Evolved frontend and backend features with a focus on functional "
            "integrity and operational efficiency."
        ),
        "bullets": [
            "Evolved frontend and backend features with focus on functional integrity and operational efficiency.",
            "Implemented backend improvements in Java and adjusted data integrations across legacy systems.",
            "Worked closely with QA to translate test findings into durable fixes.",
        ],
        "stack": ["Java", "JSF", "Tomcat", "MVC", "Maven", "HTML", "CSS", "SQL Server"],
    },
    {
        "period": "09/2021 — 01/2023",
        "company": "Autbank — Projetos e Consultoria",
        "role": "QA Analyst",
        "summary": (
            "Planned and executed functional, regression and performance tests, "
            "with API test automation."
        ),
        "bullets": [
            "Planned and executed functional, regression and performance tests across the product suite.",
            "Automated API and integration validations to widen coverage and increase release predictability.",
            "Built the QA foundation that later made my transition into backend development smoother.",
        ],
        "stack": ["JMeter", "SoapUI", "Postman", "RestAssured", "Java", "JavaScript"],
    },
]

EDUCATION = [
    {
        "period": "Postgraduate",
        "institution": "Faculdade Impacta",
        "degree": "Full Stack Developer — Postgraduate",
    },
    {
        "period": "2022",
        "institution": "FATEC Ferraz de Vasconcelos",
        "degree": "Análise e Desenvolvimento de Sistemas",
    },
]

# Stack aligned with CV's "Competências Técnicas"
STACK = [
    ("Backend", ["Java", "Kotlin", "Node.js", "Spring", "REST APIs", "Microservices"]),
    ("Quality", ["JUnit", "Mockito", "TDD", "SOLID", "Design Patterns"]),
    ("Data", ["SQL Server", "MySQL", "PostgreSQL", "SQLite", "MongoDB", "Firebase / Firestore", "Redis"]),
    ("DevOps", ["Git", "SVN", "CI/CD", "Jenkins", "Kubernetes", "Docker", "AWS (EC2, S3)"]),
    ("Infrastructure", ["Traefik", "Cloudflare", "Ansible", "Just", "GHCR", "SOPS + age"]),
    ("Methods", ["Scrum", "Kanban"]),
    ("Languages", ["Portuguese (native)", "English (intermediate)"]),
]

PROJECTS = [
    {
        "name": "personal-platform-infra",
        "tagline": "GitOps-style infra for a personal platform of MCP servers and BFFs",
        "description": (
            "Centralized infrastructure repository managing two environments — local "
            "(Windows 11 + WSL2) and VPS (Ubuntu + k3s) — from a single source of "
            "truth. No application code, no Dockerfiles: upstream repos publish "
            "images to GHCR, this repo consumes them."
        ),
        "problem": (
            "Running multiple side-project services across two machines (local dev + "
            "VPS) without turning into a part-time SRE. The challenge: keep "
            "environments reproducible, secrets safe, and still be able to rebuild "
            "either host from zero in an afternoon."
        ),
        "approach": [
            "Two deployment targets — Docker Compose for fast local iteration, k3s single-node on the VPS — driven from the same Justfile.",
            "Three namespaces per cluster (mcp / bff / vos / monitoring) keep blast radius small and routing rules readable.",
            "Traefik handles ingress on the VPS; Cloudflare provides DNS, TLS, Access and Tunnel in front of it.",
            "Secrets sealed with SOPS + age — never plaintext in Git, never mounted as raw env vars.",
            "Every deployment starts with replicas: 0 and scales up on demand via `just wake-*` commands.",
            "20 Architecture Decision Records (ADRs) document every non-trivial choice.",
        ],
        "highlights": [
            "Rebuilds from zero on a fresh VPS or workstation in under an afternoon",
            "20 ADRs documenting trade-offs (image pinning, storage retention, secret rotation)",
            "Per-service runbooks with health endpoints, port contracts and break-glass procedures",
            "Smoke tests validate the whole stack in under 60 seconds",
        ],
        "stack": [
            "Kubernetes (k3s)", "Docker", "Traefik", "Cloudflare", "Ansible",
            "Just", "SOPS + age", "Loki", "KEDA", "GHCR",
        ],
        "updatedAt": "2026-07-02",
        "is_featured": True,
    },
    {
        "name": "SpringCloud",
        "tagline": "Microservices ecosystem for credit card evaluation in Java + Spring Cloud",
        "description": (
            "Study-grade implementation of a microservices architecture simulating a "
            "credit card evaluation ecosystem. Independent services for customers, "
            "cards and credit evaluation, glued together with Eureka, an API "
            "Gateway, RabbitMQ and Keycloak."
        ),
        "problem": (
            "Build a realistic microservices setup that exercises the patterns you "
            "actually see in production: service discovery, gateway routing, sync + "
            "async communication, OAuth2-protected resources, observability — without "
            "skipping the hard parts."
        ),
        "approach": [
            "Eureka Server registers every microservice; gateway uses discovery to route by service name.",
            "Spring Cloud Gateway exposes a single entry point on :8080 with discovery-locator enabled.",
            "RabbitMQ carries the asynchronous card-issuance flow — sync HTTP for reads, async for writes.",
            "Keycloak on :8081 issues JWTs; the gateway acts as OAuth2 resource server.",
            "H2 in-memory persistence per service keeps the demo self-contained; OpenAPI + Actuator for free.",
        ],
        "highlights": [
            "4 independent services + 1 gateway + 1 discovery server",
            "Full OAuth2/JWT flow with Keycloak as IdP",
            "Both sync (REST) and async (RabbitMQ) communication patterns",
            "Documented endpoints for customers, cards and credit evaluation",
        ],
        "stack": [
            "Java 11", "Spring Boot 2.6.5", "Spring Cloud 2021.0.1",
            "Spring Cloud Netflix Eureka", "Spring Cloud Gateway",
            "Spring Security OAuth2", "RabbitMQ", "Keycloak", "H2", "Maven", "Lombok",
        ],
        "updatedAt": "2026-04-27",
        "is_featured": False,
    },
    {
        "name": "api_rest_aplicativo_cars",
        "tagline": "RESTful API in Kotlin + Spring Boot for a transportation service",
        "description": (
            "RESTful API to manage travel requests for a transportation app. Drivers, "
            "passengers and travel requests modeled as domain entities with proper "
            "package separation between domain, interfaces and mapping layers."
        ),
        "problem": (
            "Provide the backend for a native Android Kotlin app that books rides. "
            "The API needed to be straightforward for the mobile team to consume, "
            "with clean DTOs, mappers and a domain layer independent of the HTTP surface."
        ),
        "approach": [
            "DDD-ish package layout: domain (entities + services), interfaces (controllers + DTOs), mapping.",
            "Spring Boot + Spring Data JPA on top of H2 for zero-config local runs.",
            "Gradle as the build tool — Kotlin DSL kept concise.",
            "Driver, Passenger and TravelRequest as first-class domain entities.",
            "Unit + integration tests included — `gradle test` runs the full suite.",
        ],
        "highlights": [
            "Clean separation of domain / interfaces / mapping",
            "Entities: Driver, Passenger, TravelRequest",
            "Documented endpoints for travel request lifecycle",
            "MIT-licensed, ready to fork",
        ],
        "stack": [
            "Kotlin", "Spring Boot", "Spring Data JPA", "Hibernate", "H2", "Gradle",
        ],
        "updatedAt": "2024-08-10",
        "is_featured": False,
    },
]


class ExperienceCard(Flowable):
    """A card showing one work experience entry: header (role, period, company) + bullets + stack."""
    def __init__(self, exp, width=CONTENT_W):
        Flowable.__init__(self)
        self.exp = exp
        self.width = width
        from reportlab.lib.utils import simpleSplit
        # Estimate height: header (40) + summary (lines) + bullets (each ~2 lines max) + stack (1-2 lines)
        summary_lines = simpleSplit(exp['summary'], 'Body-Italic', 9.5, width - 28)
        bullet_h = 0
        for b in exp['bullets']:
            bl = simpleSplit(b, 'Body', 9.5, width - 42)
            bullet_h += max(13, len(bl) * 11) + 3
        stack_text = "  ·  ".join(exp['stack'])
        stack_lines = simpleSplit(stack_text, 'Mono', 8.5, width - 28)
        self._h = 50 + len(summary_lines) * 13 + bullet_h + len(stack_lines) * 12 + 16

    def wrap(self, availWidth, availHeight):
        self.wrap_width = availWidth
        return availWidth, self._h

    def draw(self):
        c = self.canv
        from reportlab.lib.utils import simpleSplit
        exp = self.exp

        # Card background + border (highlight current job with accent border)
        c.setFillColor(CARD_BG)
        c.setStrokeColor(ACCENT if exp.get('current') else BORDER)
        c.setLineWidth(1.0 if exp.get('current') else 0.5)
        c.roundRect(0, 0, self.wrap_width, self._h, 4, fill=1, stroke=1)

        y = self._h - 20

        # Header row: role (left) + period (right)
        c.setFillColor(TEXT_PRIMARY)
        c.setFont('Body-Bold', 12)
        c.drawString(14, y, exp['role'])

        if exp.get('current'):
            badge_text = "CURRENT"
            badge_w = c.stringWidth(badge_text, 'Mono-Bold', 7) + 10
            c.setStrokeColor(ACCENT)
            c.setFillColor(ACCENT)
            c.setLineWidth(0.5)
            c.roundRect(self.wrap_width - 14 - 60 - badge_w - 6, y - 1, badge_w, 12, 2, fill=0, stroke=1)
            c.setFont('Mono-Bold', 7)
            c.drawString(self.wrap_width - 14 - 60 - badge_w - 1, y + 2, badge_text)

        # Period (right-aligned)
        c.setFillColor(TEXT_MUTED)
        c.setFont('Mono', 9)
        c.drawRightString(self.wrap_width - 14, y, exp['period'])

        # Company (left, accent)
        y -= 14
        c.setFillColor(ACCENT)
        c.setFont('Mono-Bold', 9.5)
        c.drawString(14, y, exp['company'])

        # Summary (italic)
        y -= 14
        c.setFillColor(TEXT_PRIMARY)
        c.setFont('Body-Italic', 9.5)
        summary_lines = simpleSplit(exp['summary'], 'Body-Italic', 9.5, self.wrap_width - 28)
        for line in summary_lines[:2]:
            c.drawString(14, y, line)
            y -= 12

        # Bullets
        y -= 4
        for b in exp['bullets']:
            c.setFillColor(ACCENT)
            c.setFont('Mono-Bold', 9)
            c.drawString(18, y, "›")
            c.setFillColor(TEXT_PRIMARY)
            c.setFont('Body', 9.5)
            bl = simpleSplit(b, 'Body', 9.5, self.wrap_width - 42)
            for i, line in enumerate(bl[:3]):
                c.drawString(28, y, line)
                y -= 11
            y -= 3

        # Stack (mono, small)
        y -= 4
        c.setFillColor(TEXT_MUTED)
        c.setFont('Mono', 8.5)
        stack_text = "  ·  ".join(exp['stack'])
        stack_lines = simpleSplit(stack_text, 'Mono', 8.5, self.wrap_width - 28)
        for line in stack_lines[:2]:
            c.drawString(14, y, line)
            y -= 11


class EducationCard(Flowable):
    """A simple card showing one education entry."""
    def __init__(self, edu, width=CONTENT_W):
        Flowable.__init__(self)
        self.edu = edu
        self.width = width
        self._h = 60

    def wrap(self, availWidth, availHeight):
        self.wrap_width = availWidth
        return availWidth, self._h

    def draw(self):
        c = self.canv
        edu = self.edu

        # Card background + border
        c.setFillColor(CARD_BG)
        c.setStrokeColor(BORDER)
        c.setLineWidth(0.5)
        c.roundRect(0, 0, self.wrap_width, self._h, 4, fill=1, stroke=1)

        # Period (top right, mono)
        c.setFillColor(TEXT_MUTED)
        c.setFont('Mono', 8.5)
        c.drawRightString(self.wrap_width - 14, self._h - 18, edu['period'].upper())

        # Degree (bold)
        c.setFillColor(TEXT_PRIMARY)
        c.setFont('Body-Bold', 12)
        c.drawString(14, self._h - 22, edu['degree'])

        # Institution (accent, italic)
        c.setFillColor(ACCENT)
        c.setFont('Body-Italic', 10.5)
        c.drawString(14, self._h - 40, edu['institution'])


# ────────────────────────────────────────────────────────────────────
# Build the story
# ────────────────────────────────────────────────────────────────────

story = []

# === Section 1: About ===
story.append(SectionTitle("// profile", "About me"))
story.append(Spacer(1, 14))

# Name + role line
story.append(Paragraph(
    f'<font name="Body-Bold" size="20" color="#e6e5e3">{PROFILE["name"]}</font>',
    styles['body'],
))
story.append(Paragraph(
    f'<font name="Mono-Bold" size="10" color="#e1c676">{PROFILE["role"].upper()} @ {PROFILE["company"].upper()} · {PROFILE["location"].upper()}</font>',
    styles['body'],
))
story.append(Spacer(1, 14))

# Pitch
story.append(Paragraph(PROFILE['pitch'], styles['body']))

# Stats
story.append(Spacer(1, 10))
story.append(StatBlock(PROFILE['stats']))
story.append(Spacer(1, 18))

# Currently / quick facts
story.append(Paragraph("CURRENTLY", styles['h3']))
story.append(Paragraph(
    "Backend Engineer at UOL — authentication, authorization and account-protection flows · "
    "running a personal k3s cluster on a VPS · studying Spring Cloud patterns and MCP servers.",
    styles['body_muted'],
))

story.append(PageBreak())

# === Section 2: Experience ===
story.append(SectionTitle("// experience", "Where I've worked"))
story.append(Spacer(1, 12))
story.append(Paragraph(
    "Started in QA, grew into backend. Five years across financial software and "
    "large-scale internet services — the path matters as much as the destination.",
    styles['body_muted'],
))
story.append(Spacer(1, 16))

for exp in EXPERIENCE:
    story.append(ExperienceCard(exp))
    story.append(Spacer(1, 12))

story.append(PageBreak())

# === Section 3: Stack ===
story.append(SectionTitle("// stack", "Tools I reach for"))
story.append(Spacer(1, 14))
story.append(Paragraph(
    "A focused toolkit shaped by production work. I'd rather know five tools "
    "deeply than twenty shallowly. Most of my production work touches every "
    "category below — the rest is for experiments and side projects.",
    styles['body_muted'],
))
story.append(Spacer(1, 16))
story.append(StackTable(STACK))

story.append(PageBreak())

# === Section 4: Selected work (cards) ===
story.append(SectionTitle("// selected work", "Three projects, three different problems"))
story.append(Spacer(1, 12))
story.append(Paragraph(
    "Personal projects I build to study patterns I can't always reach at work. "
    "Picked for depth, not for showcase value.",
    styles['body_muted'],
))
story.append(Spacer(1, 18))

for i, p in enumerate(PROJECTS):
    story.append(ProjectCard(p, is_featured=p['is_featured']))
    story.append(Spacer(1, 14))

story.append(PageBreak())

# === Section 5: Case study ===
story.append(SectionTitle("// case study", f"Deep dive: {PROJECTS[0]['name']}"))
story.append(Spacer(1, 8))
story.append(Paragraph(
    f'<font name="Body-Italic" size="11" color="#e1c676">{PROJECTS[0]["tagline"]}</font>',
    styles['body'],
))

# Meta strip
story.append(Spacer(1, 4))
story.append(Paragraph(
    f'<font name="Mono" size="9" color="#9b9993">'
    f'ROLE: SOLE AUTHOR &amp; OPERATOR  ·  UPDATED: {PROJECTS[0]["updatedAt"]}  ·  '
    f'REPO: github.com/vinicius-ssantos/personal-platform-infra'
    f'</font>',
    styles['body'],
))
story.append(Spacer(1, 14))

story.append(CaseStudyBlock(PROJECTS[0]))

story.append(Spacer(1, 14))

# Lessons learned
story.append(Paragraph("LESSONS LEARNED", styles['h3']))
story.append(Paragraph(
    "Building a personal platform forced me to make trade-offs that don't show up "
    "in tutorials. Pinning image tags by digest is more annoying than tracking "
    "latest, but it's the only way to know exactly what's running. SOPS + age "
    "adds friction to secret rotation, but means I can publish the repo publicly "
    "without leaking anything. The biggest lesson: documentation that you write "
    "for yourself six months from now is the only documentation that actually "
    "gets read — so the ADRs are written like a conversation with that future me.",
    styles['body'],
))

story.append(PageBreak())

# === Section 6: Education + long about ===
story.append(SectionTitle("// education", "Academic background"))
story.append(Spacer(1, 12))
story.append(Paragraph(
    "A technical foundation followed by a deliberate full-stack postgraduate — "
    "to round out the backend focus.",
    styles['body_muted'],
))
story.append(Spacer(1, 16))

for edu in EDUCATION:
    story.append(EducationCard(edu))
    story.append(Spacer(1, 10))

story.append(Spacer(1, 14))
story.append(SectionTitle("// about", "In more detail"))
story.append(Spacer(1, 12))
story.append(Paragraph(PROFILE['long_pitch_1'], styles['body']))
story.append(Paragraph(PROFILE['long_pitch_2'], styles['body']))
story.append(Paragraph(PROFILE['long_pitch_3'], styles['body']))

story.append(PageBreak())

# === Section 7: Contact ===
story.append(SectionTitle("// contact", "Let's talk"))
story.append(Spacer(1, 14))
story.append(Paragraph(
    "I'm open to backend &amp; platform roles, contract work on Spring-based "
    "services, and conversations about distributed systems, k8s operations, or "
    "MCP server architecture. The fastest way to reach me is email or LinkedIn — "
    "I check both daily. GitHub is the best place to see how I actually think.",
    styles['body'],
))
story.append(Spacer(1, 24))

# Contact table
contact_data = [
    ["Email",     PROFILE["email"]],
    ["Phone",     PROFILE["phone"]],
    ["Location",  f"{PROFILE['location']} (UTC-3)"],
    ["GitHub",    PROFILE["github"]],
    ["LinkedIn",  PROFILE["linkedin"]],
    ["Status",    "Available for backend & platform roles"],
]
contact_tbl = Table(
    contact_data,
    colWidths=[90, CONTENT_W - 90],
)
contact_tbl.setStyle(TableStyle([
    ('FONTNAME', (0, 0), (0, -1), 'Mono-Bold'),
    ('FONTNAME', (1, 0), (1, -1), 'Body'),
    ('FONTSIZE', (0, 0), (-1, -1), 11),
    ('TEXTCOLOR', (0, 0), (0, -1), ACCENT),
    ('TEXTCOLOR', (1, 0), (1, -1), TEXT_PRIMARY),
    ('LINEBELOW', (0, 0), (-1, -2), 0.4, BORDER),
    ('TOPPADDING', (0, 0), (-1, -1), 10),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
    ('LEFTPADDING', (0, 0), (-1, -1), 14),
    ('BACKGROUND', (0, 0), (-1, -1), CARD_BG),
    ('BOX', (0, 0), (-1, -1), 0.5, BORDER),
]))
story.append(contact_tbl)

story.append(Spacer(1, 30))

# Closing line
story.append(HorizontalLine(color=ACCENT, thickness=1.0, space_before=6, space_after=6))
story.append(Spacer(1, 6))
story.append(Paragraph(
    '<font name="Mono" size="9" color="#9b9993">'
    '5+ years in backend &amp; QA · 52 repositories · 777 contributions / yr · '
    'built with Spring, k3s, and a lot of coffee.'
    '</font>',
    styles['body_muted'],
))


# ────────────────────────────────────────────────────────────────────
# Build the PDF
# ────────────────────────────────────────────────────────────────────

OUTPUT = "/home/z/my-project/scripts/portfolio_body.pdf"

doc = SimpleDocTemplate(
    OUTPUT,
    pagesize=(PAGE_W, PAGE_H),
    leftMargin=LEFT_MARGIN,
    rightMargin=RIGHT_MARGIN,
    topMargin=TOP_MARGIN,
    bottomMargin=BOTTOM_MARGIN,
    title="Vinicius Santos — Backend Engineer Portfolio",
    author="Vinicius de Oliveira Santos",
    subject="Portfolio of selected backend & infrastructure projects",
    creator="Vinicius Santos",
)

doc.build(story, onFirstPage=paint_page_bg, onLaterPages=paint_page_bg)
print(f"✅ Body PDF generated: {OUTPUT}")
