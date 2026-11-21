"""Build the editable DOCX and tagged PDF resume variants.

Requires python-docx and LibreOffice. Usage:
    python scripts/build-resume.py --variant general --outdir assets
    python scripts/build-resume.py --variant rainfocus --outdir /path/to/drafts
"""

from argparse import ArgumentParser
from pathlib import Path
from subprocess import run
from tempfile import TemporaryDirectory

from docx import Document
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor


CONTACT = [
    ("Chicago, IL", None),
    ("itcodegirl@gmail.com", "mailto:itcodegirl@gmail.com"),
    ("itcodegirl.com", "https://itcodegirl.com"),
    ("github.com/itcodegirl", "https://github.com/itcodegirl"),
    ("linkedin.com/in/jennazawaski", "https://www.linkedin.com/in/jennazawaski"),
]

EDUCATION = [
    "Fullstack Web Developer Certificate — Fullstack Academy (Powered by UIC), 2022",
    "Master’s Degree, Risk Management — Cambridge College Global, 2020",
    "Bachelor’s Degree, Information System Security — American Public University, 2014",
    "Bachelor’s Degree, Psychology — Saint Xavier University, 2010",
]

RESUMES = {
    "general": {
        "filename": "JennaZawaski-Resume",
        "title": "Frontend Web Developer | Accessible, Responsive UI",
        "summary": (
            "Frontend web developer building accessible, responsive applications with React, "
            "TypeScript, HTML, CSS, and JavaScript. Owns frontend architecture, learning and "
            "workflow interfaces, resilient client-side state, and automated UI checks. "
            "Turns product requirements into clear interactions and recoverable error states."
        ),
        "skills": [
            ("Frontend", "HTML5, CSS3, JavaScript (ES6+), TypeScript, React, React Router, Vite"),
            ("UI and accessibility", "responsive design, semantic HTML, keyboard navigation, WCAG testing, Figma, Canva"),
            ("Data and APIs", "REST APIs, Supabase Auth, PostgreSQL, localStorage"),
            ("Testing and delivery", "Playwright, Vitest, axe-core, Git, GitHub Actions, Vercel, Netlify"),
        ],
        "projects": [
            {
                "name": "CodeHerWay — Frontend Learning Platform",
                "stack": "React, TypeScript, Vite, Supabase | Founder and frontend lead",
                "url": "itcodegirl.com/work/codeherway/",
                "href": "https://itcodegirl.com/work/codeherway/",
                "bullets": [
                    "Led the lesson, quiz, and progress UI for a learning platform with Supabase authentication and persisted learner data.",
                    "Built deduplicated, retry-safe progress behavior so an older queued write cannot undo a newer successful save.",
                    "Added responsive and keyboard-focused UI checks with Playwright; used Vitest and axe-core in the quality workflow.",
                ],
            },
            {
                "name": "CEO OS — Founder Workflow Dashboard",
                "stack": "React, React Router, Vite, localStorage | Designer and frontend lead",
                "url": "itcodegirl.com/work/ceo-os/",
                "href": "https://itcodegirl.com/work/ceo-os/",
                "bullets": [
                    "Built a responsive dashboard for focus, planning, and opportunity tracking with reusable workflow components.",
                    "Designed a repository-pattern data layer across eight domains with versioned storage, migrations, and recovery for stale or corrupted local data.",
                ],
            },
            {
                "name": "Aura Weather — Responsive Weather Application",
                "stack": "React, JavaScript, CSS, REST APIs | Frontend lead",
                "url": "itcodegirl.com/work/aura-weather/",
                "href": "https://itcodegirl.com/work/aura-weather/",
                "bullets": [
                    "Built a weather UI combining three API sources with independent loading, error, and missing-data states.",
                    "Added defensive data handling, an offline last-known view, and Playwright accessibility checks.",
                ],
            },
        ],
    },
    "rainfocus": {
        "filename": "JennaZawaski-RainFocus-Resume",
        "title": "Junior UI Developer | HTML, CSS, JavaScript",
        "summary": (
            "Frontend web developer with hands-on experience building responsive, accessible "
            "interfaces in HTML, CSS, and JavaScript. Translates design goals into reusable UI "
            "components, tests keyboard and mobile behavior, and debugs layout issues. "
            "Uses React in portfolio work and Git in client projects; comfortable learning team standards."
        ),
        "skills": [
            ("Core UI", "HTML5, CSS3, semantic HTML, JavaScript (ES6+), responsive design, CSS custom properties"),
            ("Components and design", "React, TypeScript, UI components, Figma, Canva, visual hierarchy"),
            ("Quality", "keyboard accessibility, WCAG testing, mobile layout debugging, Playwright, axe-core, Git"),
            ("Supporting tools", "Vite, REST API integration, Supabase, GitHub Actions, Netlify"),
        ],
        "projects": [
            {
                "name": "CodeHerWay — Responsive Learning Platform",
                "stack": "React, TypeScript, HTML, CSS, Supabase | Founder and frontend developer",
                "url": "itcodegirl.com/work/codeherway/",
                "href": "https://itcodegirl.com/work/codeherway/",
                "bullets": [
                    "Built responsive lesson, quiz, and progress interfaces with reusable components and clear loading and feedback states.",
                    "Fixed the public mobile menu: moved it to a full-screen overlay, trapped focus while open, and returned focus to its button on Escape.",
                    "Used Playwright to check the mobile overlay across five public routes and added keyboard-focused UI coverage.",
                ],
            },
            {
                "name": "Personal Portfolio — Branded Web Experience",
                "stack": "Semantic HTML, CSS, vanilla JavaScript | Design and development",
                "url": "itcodegirl.com",
                "href": "https://itcodegirl.com",
                "bullets": [
                    "Designed and built a responsive portfolio with a consistent visual system, accessible navigation, and reusable case-study layouts.",
                    "Used static link, route, and asset checks; reviewed layouts at narrow phone and desktop widths.",
                ],
            },
            {
                "name": "Aura Weather — Responsive Weather Application",
                "stack": "React, JavaScript, CSS, REST APIs | Frontend lead",
                "url": "itcodegirl.com/work/aura-weather/",
                "href": "https://itcodegirl.com/work/aura-weather/",
                "bullets": [
                    "Built a responsive interface for three weather APIs with expandable forecasts and clear loading, error, and missing-data states.",
                    "Checked UI flows with Playwright and axe-core and added an offline last-known view.",
                ],
            },
        ],
    },
}


def hyperlink(paragraph, label, url):
    part = paragraph.part
    relation = part.relate_to(
        url,
        "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink",
        is_external=True,
    )
    link = OxmlElement("w:hyperlink")
    link.set(qn("r:id"), relation)
    run = OxmlElement("w:r")
    properties = OxmlElement("w:rPr")
    color = OxmlElement("w:color")
    color.set(qn("w:val"), "14546B")
    properties.append(color)
    run.append(properties)
    text = OxmlElement("w:t")
    text.text = label
    run.append(text)
    link.append(run)
    paragraph._p.append(link)


def section_heading(document, label):
    paragraph = document.add_paragraph(style="Heading 2")
    paragraph.add_run(label)
    paragraph.paragraph_format.space_before = Pt(9)
    paragraph.paragraph_format.space_after = Pt(3)


def bullet(document, text):
    paragraph = document.add_paragraph(style="List Bullet")
    paragraph.add_run(text)
    paragraph.paragraph_format.left_indent = Inches(0.19)
    paragraph.paragraph_format.first_line_indent = Inches(-0.10)
    paragraph.paragraph_format.space_after = Pt(2)


def build_docx(variant, output):
    content = RESUMES[variant]
    document = Document()
    section = document.sections[0]
    section.page_width = Inches(8.5)
    section.page_height = Inches(11)
    section.top_margin = Inches(0.55)
    section.bottom_margin = Inches(0.55)
    section.left_margin = Inches(0.62)
    section.right_margin = Inches(0.62)

    normal = document.styles["Normal"]
    normal.font.name = "Arial"
    normal.font.size = Pt(9.4)
    normal.font.color.rgb = RGBColor(34, 42, 51)
    normal.paragraph_format.space_after = Pt(0)
    normal.paragraph_format.line_spacing = 1.12
    for style_name in ("Heading 1", "Heading 2"):
        style = document.styles[style_name]
        style.font.name = "Arial"
        style.font.bold = True
        style.font.color.rgb = RGBColor(20, 84, 107)
    document.styles["Heading 2"].font.size = Pt(10)
    document.styles["List Bullet"].font.name = "Arial"
    document.styles["List Bullet"].font.size = Pt(9.4)
    document.styles["List Bullet"].paragraph_format.line_spacing = 1.12

    name = document.add_paragraph()
    name.paragraph_format.space_after = Pt(1)
    run = name.add_run("Jenna Zawaski")
    run.bold = True
    run.font.name = "Arial"
    run.font.size = Pt(19)
    run.font.color.rgb = RGBColor(24, 54, 72)

    title = document.add_paragraph()
    title.paragraph_format.space_after = Pt(4)
    run = title.add_run(content["title"])
    run.bold = True
    run.font.size = Pt(10)
    run.font.color.rgb = RGBColor(20, 84, 107)

    contact = document.add_paragraph()
    contact.paragraph_format.space_after = Pt(5)
    for index, (label, url) in enumerate(CONTACT):
        if index:
            contact.add_run("  |  ")
        if url:
            hyperlink(contact, label, url)
        else:
            contact.add_run(label)

    section_heading(document, "SUMMARY")
    document.add_paragraph(content["summary"])

    section_heading(document, "TECHNICAL SKILLS")
    for label, value in content["skills"]:
        paragraph = document.add_paragraph()
        paragraph.paragraph_format.space_after = Pt(2)
        paragraph.add_run(label + ": ").bold = True
        paragraph.add_run(value)

    section_heading(document, "PROFESSIONAL EXPERIENCE")
    paragraph = document.add_paragraph()
    paragraph.paragraph_format.space_after = Pt(1)
    paragraph.add_run("Freelance Web Developer — Self-Employed").bold = True
    paragraph.add_run(" | Chicago, IL | Jan 2021–Present")
    bullet(document, "Designed and delivered responsive client-facing websites using HTML, CSS, JavaScript, Git, GitHub, and Netlify.")
    bullet(document, "Translated client goals into usable layouts, frontend components, and iterative design revisions.")

    section_heading(document, "SELECTED PROJECTS")
    for project in content["projects"]:
        paragraph = document.add_paragraph()
        paragraph.paragraph_format.space_before = Pt(6)
        paragraph.paragraph_format.space_after = Pt(0)
        paragraph.add_run(project["name"]).bold = True
        paragraph = document.add_paragraph()
        paragraph.paragraph_format.space_after = Pt(1)
        paragraph.add_run(project["stack"] + " | ")
        hyperlink(paragraph, project["url"], project["href"])
        for item in project["bullets"]:
            bullet(document, item)

    paragraph = document.add_paragraph()
    paragraph.paragraph_format.space_before = Pt(6)
    paragraph.paragraph_format.space_after = Pt(1)
    paragraph.add_run("Development approach: ").bold = True
    paragraph.add_run("AI-assisted implementation under my requirements, review, and testing.")

    section_heading(document, "EDUCATION")
    for item in EDUCATION:
        paragraph = document.add_paragraph(item)
        paragraph.paragraph_format.space_after = Pt(2)

    document.core_properties.title = f"Jenna Zawaski — {content['title']} Resume"
    document.core_properties.author = "Jenna Zawaski"
    document.core_properties.subject = "Frontend web development resume"
    document.save(output)


def main():
    parser = ArgumentParser()
    parser.add_argument("--variant", choices=RESUMES, default="general")
    parser.add_argument("--outdir", type=Path, default=Path(__file__).resolve().parents[1] / "assets")
    args = parser.parse_args()
    args.outdir.mkdir(parents=True, exist_ok=True)
    stem = RESUMES[args.variant]["filename"]
    docx_path = args.outdir / f"{stem}.docx"
    pdf_path = args.outdir / f"{stem}.pdf"
    build_docx(args.variant, docx_path)
    with TemporaryDirectory() as directory:
        command = [
            "soffice",
            f"-env:UserInstallation=file://{directory}/lo-profile",
            "--headless",
            "--convert-to",
            'pdf:writer_pdf_Export:{"UseTaggedPDF":{"type":"boolean","value":"true"}}',
            "--outdir",
            directory,
            str(docx_path.resolve()),
        ]
        run(command, check=True, capture_output=True, text=True)
        converted = Path(directory) / f"{stem}.pdf"
        if not converted.exists():
            raise RuntimeError("LibreOffice did not produce the expected PDF")
        pdf_path.write_bytes(converted.read_bytes())
    print(docx_path)
    print(pdf_path)


if __name__ == "__main__":
    main()
