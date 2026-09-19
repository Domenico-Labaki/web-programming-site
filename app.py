"""
Web Programming — Flask application.
Serves the portfolio home page and the Week 2 history pages (hand-made and AI).
"""

from flask import Flask, render_template

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


if __name__ == "__main__":
    app.run(debug=True)