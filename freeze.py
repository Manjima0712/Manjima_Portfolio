"""
Freeze Flask app into static HTML files for GitHub Pages deployment.
Renders all routes and saves them as .html files in the project root.
"""
from app import app
import os
import re

# Routes to freeze: (route_name, output_filename)
ROUTES = [
    ('home', 'index.html'),
    ('about', 'about.html'),
    ('skills', 'skills.html'),
    ('projects', 'projects.html'),
    ('experience', 'experience.html'),
    ('education', 'education.html'),
    ('certifications', 'certifications.html'),
    ('contact', 'contact.html'),
]

def freeze():
    with app.test_client() as client:
        for route_name, output_file in ROUTES:
            # Build the URL path
            with app.test_request_context():
                from flask import url_for
                url = url_for(route_name)
            
            # Fetch the rendered page
            response = client.get(url)
            html = response.data.decode('utf-8')
            
            # Fix static file paths: /static/... -> ./static/...
            html = html.replace('"/static/', '"./static/')
            html = html.replace("'/static/", "'./static/")
            
            # Fix navigation links: /about -> ./about.html, / -> ./index.html
            html = html.replace('href="/"', 'href="./index.html"')
            html = html.replace('href="/about"', 'href="./about.html"')
            html = html.replace('href="/skills"', 'href="./skills.html"')
            html = html.replace('href="/projects"', 'href="./projects.html"')
            html = html.replace('href="/experience"', 'href="./experience.html"')
            html = html.replace('href="/education"', 'href="./education.html"')
            html = html.replace('href="/certifications"', 'href="./certifications.html"')
            html = html.replace('href="/certificates"', 'href="./certifications.html"')
            html = html.replace('href="/contact"', 'href="./contact.html"')
            
            # Fix any remaining request.path active class checks (already rendered by Jinja)
            # No action needed - Jinja already evaluated these
            
            # Write the output file
            output_path = os.path.join(os.path.dirname(__file__), output_file)
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(html)
            
            print(f"  [OK] {route_name:20s} -> {output_file}")
    
    print(f"\nAll {len(ROUTES)} pages frozen successfully!")
    print("Now commit and push to GitHub for deployment.")

if __name__ == '__main__':
    print("Freezing Flask app to static HTML...\n")
    freeze()
