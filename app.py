"""
Web Programming — Flask application.
"""

from flask import Flask, render_template, request
from quiz_api import init_quiz
from validators import validate_profile

app = Flask(__name__)

init_quiz(app)

weekly_work = [
    {"week": 1, "title": "Live site launched", "url": "/week1"},
    {"week": 2, "title": "History of the Internet", "url": "/internet-history"},
    {"week": 2, "title": "History of the Web", "url": "/web-history"},
    {"week": 2, "title": "History of the Internet (AI)", "url": "/internet-history-ai"},
    {"week": 2, "title": "History of the Web (AI)", "url": "/web-history-ai"},
    {"week": 4, "title": "Engineering Profile", "url": "/submit-profile"},
    {"week": 5, "title": "JavaScript app", "url": "/quiz"},
    {"week": 6, "title": "Profile Form Validation", "url": "/submit-validated-profile"},
    {"week": 7, "title": "Live Quiz with Fetch", "url": "/live-quiz"},
]

@app.context_processor
def inject_weekly_work():
    return {"weekly_work": weekly_work}

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
    if request.method == "POST":
        data = request.form.to_dict()                   # all single-value fields
        skills = request.form.getlist("skills")         # checkboxes -> list
        software = request.form.getlist("software")     # multiple <select> -> list
        return render_template(
            "profile.html", data=data, skills=skills, software=software,
            weekly_work=weekly_work
        )

    # First visit (GET): just show the empty form.
    return render_template("profile_form.html", weekly_work=weekly_work)


@app.route("/submit-validated-profile")
def submit_validated_profile():
    return render_template("profile_form_validated.html", weekly_work=weekly_work)


@app.route("/quiz", methods=["GET", "POST"])
def quiz():
    return render_template("quiz.html", weekly_work=weekly_work)

@app.route("/profile-validated", methods=["GET", "POST"])
def profile_validated():
    if request.method == "POST":
        errors, cleaned = validate_profile(request.form)
        if errors:
            # something's wrong -> re-show the FORM with errors + what was typed
            return render_template(
                "profile-form-validated.html",
                errors=errors,
                data=request.form,
                sel_skills=request.form.getlist("skills"),
                sel_software=request.form.getlist("software"),
            )
        # all good -> show the profile
        return render_template("profile_validated.html", data=cleaned, skills=cleaned.get("skills", []), software=cleaned.get("software", []))
    # first visit (GET): empty form
    return render_template("profile-form-validated.html", errors={}, data={}, sel_skills=[], sel_software=[])


if __name__ == "__main__":
    app.run(debug=True)
