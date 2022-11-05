"""Various SQL functions for accessing the database"""

import sqlite3
import datetime
import ml
conn = sqlite3.connect('mydatabase.db')
mycursor = conn.cursor()


def create_records_table(username: str):
    """Initialize record table for specified user"""

    command = f"CREATE TABLE IF NOT EXISTS {username}records (id INTEGER PRIMARY KEY AUTOINCREMENT, date nvarchar(100), time nvarchar(100), status nvarchar(100), med INTEGER, FOREIGN KEY (med) REFERENCES {username}meds(id))"
    mycursor.execute(command)
    conn.commit()


def create_meds_table(username: str):
    """Initialize meds table for specified user"""

    command = f"CREATE TABLE IF NOT EXISTS {username}meds (id INTEGER PRIMARY KEY AUTOINCREMENT, day nvarchar(100), time nvarchar(100), name nvarchar(100), dosage INTEGER)"
    mycursor.execute(command)
    conn.commit()


def insert_records_table(username: str, status: str, med: int):
    """Insert record into user's record table, where med is id of a medicine

    Preconditions:
    - status in {'MISS', 'GOOD'}
    """

    date_and_time = datetime.datetime.now()
    date = date_and_time.strftime('%x')
    time = date_and_time.strftime('%X')
    command = f"INSERT INTO {username}records (date, time, status, med) VALUES ('{date}', '{time}', '{status}', '{med}')"
    mycursor.execute(command)
    conn.commit()


def insert_meds_table(username: str, day: str, time: str, name: str, dosage: int):
    """Insert medicine into user's med table

    - day is a weekday name, capitalized
    - time is in HH:MM:SS, 24h
    - dosage is dosage in mg
    """

    command = f"INSERT INTO {username}meds (day, time, name, dosage) VALUES ('{day}', '{time}', '{name}', '{dosage}')"
    mycursor.execute(command)
    conn.commit()


def create_users_table():
    """Initialize user information table"""

    command = f"CREATE TABLE IF NOT EXISTS userInfo (username nvarchar(100) PRIMARY KEY, points INTEGER)"
    conn.execute(command)


def insert_users_table(username: str, points: int):
    """Insert new user into user table"""
    if not user_exists(username):
        command = f"INSERT INTO userInfo (username, points) VALUES ('{username}', {points})"
        mycursor.execute(command)
    conn.commit()


def update_users_table(username: str, points_increase: int):
    """Update points of user in user table"""

    mycursor.execute(f'SELECT points FROM userInfo WHERE username = "{username}"')
    points = mycursor.fetchone()[0]
    command = f'''UPDATE userInfo SET points = {points + points_increase} WHERE username = "{username}"'''
    mycursor.execute(command)
    conn.commit()


# def calc_status(username, med_id):
#     days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
#     mycursor.execute(f'SELECT day, time FROM {username}meds WHERE id = "{med_id}"')
#     day1, time1 = mycursor.fetchone()
#     date_and_time = datetime.datetime.now()
#     day2 = date_and_time.strftime('%A')
#     time2 = date_and_time.strftime('%X')
#     days_difference = min(abs(days.index(day1) - days.index(day2)), abs(days.index(day1) - (days.index(day2) - len(days))))
#     hour1, minute1, second1 = time1[:2], time1[3:5], time1[6:]
#     hour2, minute2, second2 = time2[:2], time2[3:5], time2[6:]
#
#     time_difference = days_difference * 24 * 60 + (hour1 - hour2) * 60 + (minute1 - minute2) + (second1 - second2)


def final_insert_meds(username, filename):
    """Insert a medicine based on prescription picture"""
    # dict with keys: names : list, dosages: list
    data = ml.extract_data(filename)
    names = data['names']
    dosages = data['dosages']
    for i in range(len(names)):
        insert_meds_table(username, 'NULL', 'NULL', names[i], dosages[i])
    conn.commit()


def final_update_meds_table(username: str, med_id: int, day: str, time: str, name: str, dosage: int):
    """Update medicine record of user's medtable

    - med_id is an id of medicine to change in user's medtable
    - day is a weekday name, capitalized
    - time is in HH:MM:SS, 24h
    - dosage is dosage in mg
    """

    command = f"""UPDATE {username}meds 
    SET day = '{day}', 
    time = '{time}', 
    name = '{name}', 
    dosage = {dosage} 
    WHERE id = {med_id}"""
    mycursor.execute(command)
    conn.commit()


def remove_meds_row(username: str, med_id: int):
    """Remove medicine from user's med table"""
    command = f"DELETE FROM {username}meds WHERE id = {med_id}"
    mycursor.execute(command)
    conn.commit()


def load_records(username: str) -> list[tuple[str]]:
    """Returns a list of records for the user"""
    command = f"""SELECT * FROM {username}records 
    JOIN {username}meds ON {username}records.med = {username}meds.id"""
    mycursor.execute(command)

    data = mycursor.fetchall()
    data = [entry[1:4] + (entry[-2],) for entry in data]
    return data


def load_meds(username: str) -> list[tuple]:
    """Returns a list of current medications for specified user"""
    command = f"""SELECT * FROM {username}meds"""
    mycursor.execute(command)

    return mycursor.fetchall()


def load_points(username: str) -> int:
    """Returns the amount of points the user has"""
    command = f"""SELECT points FROM userInfo WHERE username = '{username}'"""
    mycursor.execute(command)

    return mycursor.fetchone()[0]


def user_exists(username: str) -> bool:
    """Check if the user exists or not in the database"""
    command = f"""SELECT * FROM userInfo WHERE username = '{username}'"""
    mycursor.execute(command)

    return mycursor.fetchone() is not None


def test(command):
    return mycursor.execute(command)

# create_meds_table('varungmailcom')
# create_records_table('varungmailcom')
# insert_meds_table('varungmailcom', 'Wednesday', '18:30', 'Aspirin', 100)
# insert_records_table('varungmailcom', 'Late', 1)


print(load_records('varungmailcom'))