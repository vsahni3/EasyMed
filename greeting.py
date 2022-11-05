from flask import Flask, request, jsonify
import sql

app = Flask(__name__)


@app.route('/login/', methods=['POST'])
def login():
    email = request.form.get('email')
    print(email)
    if email:
        response = {
            "Message": f"Welcome {email} to our awesome API!",
            # this includes med_id which is needed for other requests
            "Medicines": sql.load_meds(email),
            # Add this option to distinct the POST request
            "METHOD": "POST"
        }
        return jsonify(response)
    else:
        return jsonify({
            "ERROR": "No email found. Please send an email."
        })


@app.route('/records/', methods=['POST'])
def records():
    email = request.form.get('email')
    print(email)
    if email:
        response = {
            "Message": f"Welcome {email} to our awesome API!",
            "Medicines": sql.load_records(email),
            # Add this option to distinct the POST request
            "METHOD": "POST"
        }
        return jsonify(response)
    else:
        return jsonify({
            "ERROR": "No email found. Please send an email."
        })


@app.route('/create/', methods=['POST'])
def create_medicine():
    email = request.form.get('email')
    print(email)
    if email:
        response = {
            "Message": f"Welcome {email} to our awesome API!",
            "Medicines": sql.load_records(email),
            # Add this option to distinct the POST request
            "METHOD": "POST"
        }
        return jsonify(response)
    else:
        return jsonify({
            "ERROR": "No email found. Please send an email."
        })


@app.route('/')
def index():
    # A welcome message to test our server
    return "<h1>Welcome to our medium-greeting-api!</h1>"


if __name__ == '__main__':
    # Threaded option to enable multiple instances for multiple user access support
    app.run(threaded=True, port=5000)
