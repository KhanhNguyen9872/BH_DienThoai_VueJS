from flask import Flask, request, render_template_string, jsonify

app = Flask(__name__)

# HTML form to submit data
error403 = """
{"status": {status}, "status_code": {status_code}, "message": "{message}"}
"""

# Route for displaying the HTML form (GET request)
@app.route('/', methods=['GET'])
def index():
    return jsonify(error403.format(status="error", status_code=403, message="un"))

# Route for handling form submission (POST request)
@app.route('/submit', methods=['POST'])
def submit():
    name = request.form.get('name')  # Retrieve the 'name' field from the form data
    return f"Hello, {name}! You submitted the form successfully."

if __name__ == '__main__':
    app.run(debug=True)
