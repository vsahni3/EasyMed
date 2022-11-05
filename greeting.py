from flask import Flask, request, jsonify
import sql

app = Flask(__name__)


@app.route('/login/', methods=['POST'])
def login():
    email = request.form.get('email')
    print("email:", email)

    if email:
        sql.insert_users_table(email, 0)
        sql.create_records_table(email)
        sql.create_meds_table(email)
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

    if email:
        response = {
            "Message": f"Welcome {email} to our awesome API!",
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

    if email:
        response = {
            "Message": f"Welcome {email} to our awesome API!",
            "Points": sql.load_points(email),
            # Add this option to distinct the POST request
            "METHOD": "POST"
        }
        return jsonify(response)
    else:
        return jsonify({
            "ERROR": "No email found. Please send an email."
        })


@app.route('/create/', methods=['POST'])
# TODO: support file submission
def create_medicine():
    email = request.form.get('email')

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


@app.route('/update/', methods=['POST'])
def update_medicine():
    email = request.form.get('email')
    new_med = request.form.get('new_med')
    # new_med should be an array of [med_id, day, time, name, dosage]
    if email and new_med:
        sql.final_update_meds_table(email, *new_med)

        response = {
            "Message": f"Welcome {email} to our awesome API!",
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
    if email and med_id and med_id.isdigit():
        sql.remove_meds_row(email, int(med_id))

        response = {
            "Message": f"Welcome {email} to our awesome API!",
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
    new_record = request.form.get('new_record')
    # new_record should be [status, med_id]
    if email and new_record:
        sql.insert_records_table(email, *new_record)
        if new_record[0] == "GOOD":
            sql.update_users_table(email, 10)

        response = {
            "Message": f"Welcome {email} to our awesome API!",
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



@app.route('/')
def index():
    # A welcome message to test our server
    return "<h1>Welcome to our medium-greeting-api!</h1>"


if __name__ == '__main__':
    # Threaded option to enable multiple instances for multiple user access support
    app.run(threaded=True, port=5000)
