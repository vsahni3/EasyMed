import datetime

def alerts(records_data):
    late_meds = {}
    total_lates = 0
    date_and_time = datetime.datetime.now()
    date = date_and_time.strftime('%x')
    time = date_and_time.strftime('%X')
    for row in records_data:




