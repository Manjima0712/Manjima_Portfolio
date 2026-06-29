"""
Freeze Flask app into static HTML files for GitHub Pages deployment.
Renders all routes and saves them as .html files in the project root.
"""

import os
from app import app
from flask import url_for


# Routes to freeze: (route_name, output_filename)
ROUTES = [
    ("home", "index.html"),
    ("about", "about.html"),
    ("skills", "skills.html"),
    ("projects", "projects.html"),
    ("experience", "experience.html"),
    ("education", "education.html"),
    ("certifications", "certifications.html"),
    ("contact", "contact.html"),
]

# Link replacements: Flask route path -> static HTML filename
LINK_REPLACEMENTS = {
    'href="/"': 'href="./index.html"',
    'href="/about"': 'href="./about.html"',
    'href="/skills"': 'href="./skills.html"',
    'href="/projects"': 'href="./projects.html"',
    'href="/experience"': 'href="./experience.html"',
    'href="/education"': 'href="./education.html"',
    'href="/certifications"': 'href="./certifications.html"',
    'href="/certificates"': 'href="./certifications.html"',
    'href="/contact"': 'href="./contact.html"',
}


def fix_paths(html):
    """Convert Flask dynamic paths to static relative paths."""
    # Fix static file paths: /static/... -> ./static/...
    html = html.replace('"/static/', '"./static/')
    html = html.replace("'/static/", "'./static/")

    # Fix navigation links
    for old, new in LINK_REPLACEMENTS.items():
        html = html.replace(old, new)

    return html


def freeze():
    """Render all Flask routes and save as static HTML files."""
    output_dir = os.path.dirname(os.path.abspath(__file__))

    with app.test_client() as client:
        for route_name, output_file in ROUTES:
            # Build the URL path
            with app.test_request_context():
                route_url = url_for(route_name)

            # Fetch the rendered page
            response = client.get(route_url)
            html = response.data.decode("utf-8")

            # Fix all paths for static deployment
            html = fix_paths(html)

            # Write the output file
            output_path = os.path.join(output_dir, output_file)
            with open(output_path, "w", encoding="utf-8") as f:
                f.write(html)

            print(f"  [OK] {route_name:20s} -> {output_file}")

    print(f"\nAll {len(ROUTES)} pages frozen successfully!")
    print("Now commit and push to GitHub for deployment.")


if __name__ == "__main__":
    print("Freezing Flask app to static HTML...\n")
    freeze()
