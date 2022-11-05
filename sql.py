"""Various SQL functions for accessing the database"""

import sqlite3
import datetime
conn = sqlite3.connect('mydatabase.db')
mycursor = conn.cursor()


def create_records_table(username):
    """Initialize record table for specified user"""

    command = f"CREATE TABLE IF NOT EXISTS {username}records (id INTEGER PRIMARY KEY AUTOINCREMENT, date nvarchar(100), time nvarchar(100), status nvarchar(100), med INTEGER, FOREIGN KEY (med) REFERENCES {username}meds(id))"
    mycursor.execute(command)


def create_meds_table(username):
    """Initialize meds table for specified user"""

    command = f"CREATE TABLE IF NOT EXISTS {username}meds (id INTEGER PRIMARY KEY AUTOINCREMENT, day nvarchar(100), time nvarchar(100), name nvarchar(100), dosage INTEGER)"
    mycursor.execute(command)


def insert_records_table(username, status, med):
    """Insert record into user's record table, where med is id of a medicine

    Preconditions:
    - status in {'SNOOZE', 'MISS', 'GOOD'}
    """

    date_and_time = datetime.datetime.now()
    date = date_and_time.strftime('%x')
    time = date_and_time.strftime('%X')
    command = f"INSERT INTO {username}records (date, time, status, med) VALUES ('{date}', '{time}', '{status}', '{med}')"
    mycursor.execute(command)


def insert_meds_table(username, day, time, name, dosage):
    """Insert medicine into user's med table"""

    command = f"INSERT INTO {username}meds (day, time, name, dosage) VALUES ('{day}', '{time}', '{name}', '{dosage}')"
    mycursor.execute(command)


def create_users_table():
    """Initialize user information table"""

    command = f"CREATE TABLE IF NOT EXISTS userInfo (username nvarchar(100) PRIMARY KEY, password nvarchar(100), points INTEGER)"
    mycursor.execute(command)


def insert_users_table(username, password, points):
    """Insert new user into user table"""

    command = f"INSERT INTO userInfo (username, password, points) VALUES ('{username}', '{password}', {points})"
    mycursor.execute(command)


def update_users_table(username, points_increase):
    """Update points of user in user table"""

    mycursor.execute(f'SELECT points FROM userInfo WHERE username = "{username}"')
    points = mycursor.fetchone()[0]
    command = f'''UPDATE userInfo SET points = {points + points_increase} WHERE username = "{username}"'''
    mycursor.execute(command)


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


def update_meds_table(username, med_id, day, time, name, dosage):
    """Update medicine record of user's medtable"""

    command = f"""UPDATE {username}meds 
    SET day = '{day}', 
    time = '{time}', 
    name = '{name}', 
    dosage = {dosage} 
    WHERE id = {med_id}"""
    mycursor.execute(command)


def remove_meds_row(username, med_id):
    """Remove medicine from user's med table"""
    command = f"DELETE FROM {username}meds WHERE id = {med_id}"
    mycursor.execute(command)


def load_records(username):
    """Returns a list of records for the user"""
    command = f"""SELECT * FROM {username}records 
    JOIN {username}meds ON {username}records.med = {username}meds.id"""
    mycursor.execute(command)

    data = mycursor.fetchall()
    data = [entry[1:4] + (entry[-2],) for entry in data]
    return data


def test(command):
    return mycursor.execute(command)
