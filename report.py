# """Various analysis functions for the records page"""
import datetime
import numpy as np
import matplotlib.pyplot as plt
import sql 
import pandas as pd
import requests
def stats(records_data):
    """Given records data, return the number of misses and frequency of drugs that were missed,
    also return number of drugs on time and which drugs were never missed, all in the past 7 days
    """
    late_meds = {}
    perfect_meds = set()
    all_meds = set()
    total_on_time = 0
    total_lates = 0
    max_streak = 0
    streak = 0
    today = datetime.date.today()

    for row in records_data:
        date = datetime.datetime.strptime(row[0], "%m/%d/%y").date()
        difference = today - date
        if difference.days <= 7:
            drug = row[3]
            all_meds.add(drug)

            if row[2] == 'MISS':
                total_lates += 1
                if drug in late_meds:
                    late_meds[drug] += 1
                else:
                    late_meds[drug] = 1

                max_streak = max(max_streak, streak)
                streak = 0
            elif row[2] == "GOOD":
                total_on_time += 1
                streak += 1

    for drug in all_meds:
        if drug not in late_meds:
            perfect_meds.add(drug)

    return perfect_meds, total_on_time, late_meds, total_lates, streak


def analysis(late_meds, streak):
    """Analyze user's late meds and streak"""
    warning_meds = [med for med in late_meds if late_meds[med] >= 3]
    if streak >= 5:
        remark = f"Wow! You have a streak of {streak}! You're on fire!"
    else:
        remark = ""

    return warning_meds, remark

def graph1_data(records_data):
    """x axis is days, two bars for num missed and num completed"""
    x = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    y1 = [0] * len(x)
    y2 = [0] * len(x)
    today = datetime.date.today()
    for row in records_data:
        date = datetime.datetime.strptime(row[0], "%m/%d/%y").date()
        difference = today - date
        if difference.days > 7:
            continue
        weekday = datetime.datetime.strptime('11/05/22', "%m/%d/%y").weekday()
        if row[2] == 'MISS':
            y1[weekday] += 1
        else:
            y2[weekday] += 1
    return x, y1, y2

def graph2_data(records_data):
    """x axis is medicine, two bars for num missed and num completed"""
    data = {}
    today = datetime.date.today()
    for row in records_data:
        date = datetime.datetime.strptime(row[0], "%m/%d/%y").date()
        difference = today - date
        if difference.days > 7:
            continue
        name = row[-1]
        status = row[-2]
        if name not in data:
            data[name] = [0, 0]
        if status == 'MISS':
            data[name][1] += 1
        else:
            data[name][0] += 1
    x = list(data.keys())
    vals = list(data.values())
    y1 = [val[0] for val in vals]
    y2 = [val[1] for val in vals]
    return x, y1, y2

def create_graph(data):
    """data == (x1, y1, y1)"""    
    if 'Monday' in data[0]:
        x_label = 'Weekday'
    else:
        x_label = 'Medicine Name'
        
    plotdata = pd.DataFrame({
    "MISSED": data[1],
    "COMPLETED": data[2]},
    index=data[0])
    plotdata.plot(kind='bar', stacked=True,figsize=(15, 8))
    plt.title("Medication Analysis")

    plt.xlabel(x_label)

    plt.ylabel("Status")
    plt.show()
# sample call
# create_graph(graph2_data(sql.load_records('test')))





# sql.final_update_meds_table('test', 3, 'Tuesday', '18:00:21', 'Amoxicillin', 250)
# sql.final_update_meds_table('test', 4, 'Friday', '08:21:09', 'Amoxicillin', 150)
# print(sql.load_meds('test'))
# print(graph2_data(sql.load_records('test')))

# url = "https://ez-med.herokuapp.com/newrecord"
# data = {"email":"test","med_id":2,"expected_time":"12:45:00","current_date":"11/06/22","current_time":"01:28:44"} 
# print(requests.post(url=url, data=data).text)
