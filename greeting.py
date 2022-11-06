from flask import Flask, request, jsonify
import sql
import ml
import sqlite3
from datetime import datetime

app = Flask(__name__)


@app.route('/login/', methods=['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password')
    if not email:
        email = request.get_json()['email']
    if not password:
        password = request.get_json()['password']

    if email and password:
        conn = sqlite3.connect('mydatabase.db', check_same_thread=False)
        mycursor = conn.cursor()
        mycursor.execute(f'SELECT password FROM userInfo WHERE username = "{email}"')
        correct_password = mycursor.fetchone()[0]
        if password == correct_password:

            sql.create_records_table(email)
            sql.create_meds_table(email)
            response = {
                # this includes med_id which is needed for other requests
                "Medicines": sql.load_meds(email),
                # Add this option to distinct the POST request
                "METHOD": "POST"
            }
            return jsonify(response)
        else:
            return jsonify({
                'ERROR': 'Incorrect Login or Password'
            })
    else:
        return jsonify({
            "ERROR": "No email found. Please send an email."
        })


@app.route('/upload/', methods=['POST'])
def upload():
    data = request.form.get('text')
    email = request.form.get('email')
    if not email:
        email = request.get_json()['email']
    if not data:
        data = request.get_json()['text']
    if data and email:
        extracted_data = ml.extract_data(data)
        sql.final_insert_meds(email, extracted_data)
        response = {
            "Message": f"Your prescription has been added",
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
    if not email:
        email = request.get_json()['email']

    if email:
        response = {
            "Records": sql.load_records(email),
            # Add this option to distinct the POST request
            "METHOD": "POST"
        }
        return jsonify(response)
    else:
        return jsonify({
            "ERROR": "No email found. Please send an email."
        })


@app.route('/points/', methods=['POST'])
def points():
    email = request.form.get('email')
    if not email:
        email = request.get_json()['email']

    if email:
        response = {
            "Points": sql.load_points(email),
            # Add this option to distinct the POST request
            "METHOD": "POST"
        }
        return jsonify(response)
    else:
        return jsonify({
            "ERROR": "No email found. Please send an email."
        })


@app.route('/update/', methods=['POST'])
def update_medicine():
    email = request.form.get('email')
    new_med = request.form.get('new_med')
    if not email:
        email = request.get_json()['email']
        new_med = request.get_json()['new_med']
    # new_med should be an array of [med_id, day, time, name, dosage]
    if email and new_med:
        sql.final_update_meds_table(email, *new_med)

        response = {
            "Medicines": sql.load_meds(email),
            # Add this option to distinct the POST request
            "METHOD": "POST"
        }
        return jsonify(response)
    elif not email:
        return jsonify({
            "ERROR": "No email found. Please send an email."
        })
    else:
        return jsonify({
            "ERROR": "No changes found. Please include medicine changes."
        })


@app.route('/remove/', methods=['POST'])
def remove_medicine():
    email = request.form.get('email')
    med_id = request.form.get('med_id')
    if not email:
        email = request.get_json()['email']
        med_id = request.get_json()['med_id']

    if email and med_id and med_id.isdigit():
        sql.remove_meds_row(email, int(med_id))

        response = {
            "Medicines": sql.load_meds(email),
            # Add this option to distinct the POST request
            "METHOD": "POST"
        }
        return jsonify(response)
    elif not email:
        return jsonify({
            "ERROR": "No email found. Please send an email."
        })
    else:
        return jsonify({
            "ERROR": "No med id found. Please include med id."
        })


@app.route('/newrecord/', methods=['POST'])
def add_record():
    email = request.form.get('email')
    med_id = request.form.get('med_id')
    expected_time = request.form.get('expected_time')
    if not email:
        email = request.get_json()['email']
        med_id = request.get_json()['med_id']
        expected_time = request.get_json()['expected_time']
    # expected_time is in HH:MM:SS, 24h
    if email and med_id and expected_time:

        current_datetime = datetime.now()
        times = [int(time) for time in expected_time.split(":")]
        expected_datetime = datetime.today()
        expected_datetime = expected_datetime.replace(hour=times[0], minute=times[1], second=times[2])
        time_diff = current_datetime - expected_datetime
        mins_diff = abs(time_diff.total_seconds() / 60)

        if mins_diff > 10:
            status = 'MISS'
        else:
            status = 'GOOD'
            # sql.update_users_table(email, 10)

        sql.insert_records_table(email, status, med_id)

        response = {
            # Add this option to distinct the POST request
            "Records": sql.load_records(email),
            "METHOD": "POST"
        }
        return jsonify(response)
    elif not email:
        return jsonify({
            "ERROR": "No email found. Please send an email."
        })
    else:
        return jsonify({
            "ERROR": "No med id found. Please include med id."
        })


@app.route('/')
def index():
    # A welcome message to test our server
    return "<h1>Welcome to our medium-greeting-api!</h1>"


if __name__ == '__main__':
    # Threaded option to enable multiple instances for multiple user access support
    app.run(threaded=True, port=5000)
