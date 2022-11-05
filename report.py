"""Various analysis functions for the records page"""
import datetime


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
