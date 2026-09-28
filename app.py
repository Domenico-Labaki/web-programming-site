"""
Web Programming — Flask application (Week 4).

Download this file from e-learning and REPLACE all the contents of your existing
app.py with it. Then run your app as usual.

WHAT THIS FILE DOES (the "black box" for this week)
---------------------------------------------------
It adds the "Engineering Student Profile" form. You do NOT need to understand this
code yet — server-side form handling is taught in a later session. For now:

  GET  /submit-profile   -> shows your form   (you build templates/profile_form.html)
  POST /submit-profile   -> reads the submitted data and shows your profile page
                            (renders templates/profile.html, which extends your
                             base.html so it appears in YOUR design / CSS)

HOW THE DATA REACHES THE PROFILE PAGE
-------------------------------------
When the form is submitted, this route reads every field the form sends and hands
it to profile.html. Three variables are available inside profile.html:

  data      -> a dictionary of all single-value fields, keyed by the field `name`,
               e.g. data['fullname'], data['student_id'], data['email'],
               data['major'], data['gpa'], data['project_title'], ...
  skills    -> a LIST of the ticked "skills" checkboxes
  software  -> a LIST of the selected "software" options (from the multiple <select>)

Note: `skills` and `software` can hold several values, so they are read as lists.
Every other field is a single value inside `data`.

Example inside profile.html (which extends your base.html):

  <h1>{{ data['fullname'] }}</h1>
  <p>{{ data['major'] }}</p>
  <p>Skills: {{ skills | join(', ') }}</p>
  <p>Software: {{ software | join(', ') }}</p>
"""

from datetime import date, datetime
import re
from zoneinfo import ZoneInfo

from flask import Flask, render_template, request

app = Flask(__name__)

weekly_work = [
    {"week": 1, "title": "Live site launched", "url": "/week1"},
    {"week": 2, "title": "History of the Internet", "url": "/internet-history"},
    {"week": 2, "title": "History of the Web", "url": "/web-history"},
    {"week": 2, "title": "History of the Internet (AI)", "url": "/internet-history-ai"},
    {"week": 2, "title": "History of the Web (AI)", "url": "/web-history-ai"},
]

@app.route("/")
def home():
    """Serve the portfolio home page."""
    return render_template("index.html", weekly_work=weekly_work)

@app.route("/week1")
def week1():
    return render_template("week1.html", weekly_work=weekly_work)

@app.route("/internet-history")
def internet_history():
    return render_template("internet-history.html", weekly_work=weekly_work)


@app.route("/web-history")
def web_history():
    return render_template("web-history.html", weekly_work=weekly_work)


@app.route("/internet-history-ai")
def internet_history_ai():
    return render_template("internet-history-ai.html", weekly_work=weekly_work)


@app.route("/web-history-ai")
def web_history_ai():
    return render_template("web-history-ai.html", weekly_work=weekly_work)


@app.route("/submit-profile", methods=["GET", "POST"])
def submit_profile():
    """
    GET  -> show the profile form (you build templates/profile_form.html).
    POST -> read the submitted fields and show the profile page
            (templates/profile.html, which extends your base.html).
    """
    today = datetime.now(ZoneInfo("Asia/Beirut")).date()
    if request.method == "POST":
        data = request.form.to_dict()                   # all single-value fields
        skills = request.form.getlist("skills")         # checkboxes -> list
        software = request.form.getlist("software")     # multiple <select> -> list
        errors = []

        try:
            meeting_date = date.fromisoformat(data["meeting_date"]) if data.get("meeting_date") else None
        except ValueError:
            meeting_date = None
            errors.append("Enter a valid meeting date.")
        meeting_time = data.get("meeting_time", "")
        try:
            parsed_time = datetime.strptime(meeting_time, "%H:%M").time() if meeting_time else None
        except ValueError:
            parsed_time = None
            errors.append("Enter a valid meeting time.")
        if bool(data.get("meeting_date")) != bool(meeting_time):
            errors.append("Enter both a meeting date and time, or leave both blank.")
        if meeting_date and meeting_date < today:
            errors.append("The meeting date cannot be in the past.")
        if meeting_date == today and parsed_time:
            now = datetime.now(ZoneInfo("Asia/Beirut"))
            if parsed_time <= now.time():
                errors.append("Choose a meeting time later than the current time.")

        graduation = data.get("graduation_month", "")
        try:
            grad_year, grad_month = map(int, graduation.split("-"))
            grad_date = date(grad_year, grad_month, 1)
            if grad_date < today.replace(day=1):
                errors.append("The graduation month cannot be in the past.")
            season_months = {
                "spring": range(1, 6),
                "summer": range(6, 9),
                "fall": range(9, 13),
            }
            if grad_month not in season_months.get(data.get("graduation"), ()):
                errors.append("The graduation month must match the selected season.")
        except (ValueError, TypeError):
            errors.append("Enter a valid graduation month and year.")

        if not re.fullmatch(r"[A-Za-z0-9._%+-]+@net\.usek\.edu\.lb", data.get("email", ""), re.IGNORECASE):
            errors.append("Use your @net.usek.edu.lb email address.")
        phone = data.get("phone", "").strip()
        if phone and not re.fullmatch(r"(?:\+961|00961|0)?[ -]?(?:3|[78]\d)[ -]?\d{3}[ -]?\d{3}", phone):
            errors.append("Enter a Lebanese mobile number, such as +961 70 123456.")
        try:
            team_size = int(data.get("team_size", ""))
            if not 1 <= team_size <= 6:
                errors.append("Team size must be between 1 and 6.")
        except ValueError:
            errors.append("Enter a valid team size.")

        if errors:
            return render_template(
                "profile_form.html", weekly_work=weekly_work, today=today,
                errors=errors, data=data, skills=skills, software=software,
            ), 400
        return render_template(
            "profile.html", data=data, skills=skills, software=software
        )

    # First visit (GET): just show the empty form.
    return render_template("profile_form.html", weekly_work=weekly_work, today=today,
                           data={}, skills=[], software=[], errors=[])


if __name__ == "__main__":
    app.run(debug=True)
