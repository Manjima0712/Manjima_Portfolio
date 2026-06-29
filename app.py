from flask import Flask, render_template, request, jsonify, redirect, url_for

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/skills')
def skills():
    return render_template('skills.html')

@app.route('/projects')
def projects():
    return render_template('projects.html')

@app.route('/experience')
def experience():
    return render_template('experience.html')

@app.route('/education')
def education():
    return render_template('education.html')


@app.route('/certifications')
def certifications():
    return render_template('certifications.html')

@app.route('/certificates')
def certificates():
    return redirect(url_for('certifications'))

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        try:
            data = request.json
            name = data.get('name')
            email = data.get('email')
            subject = data.get('subject')
            message = data.get('message')

            # Basic validation
            if not all([name, email, subject, message]):
                return jsonify({'success': False, 'message': 'All fields are required.'}), 400

            # Here you would typically send an email or store in a database
            return jsonify({'success': True, 'message': 'Thank you! Your message has been sent successfully.'}), 200

        except Exception as e:
            return jsonify({'success': False, 'message': 'An error occurred. Please try again later.'}), 500
    
    # GET request
    return render_template('contact.html')

if __name__ == '__main__':
    app.run(debug=True)
