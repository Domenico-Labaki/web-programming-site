# Web Programming — Portfolio Site (Starter)

A minimal Flask application that serves a portfolio home page. You build on this
project every week; by the end of the semester it becomes a full web application.

## Run locally

```
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS / Linux
pip install -r requirements.txt
flask run
```

Then open http://127.0.0.1:5000

## Project structure

```
.
├─ app.py              # Flask application and routes
├─ requirements.txt    # Python dependencies
├─ Procfile            # Production start command (used by Render)
├─ .gitignore          # Files Git should ignore
└─ templates/
   └─ index.html       # Portfolio home page (Jinja template)
```

## Deploy on Render

- Build command: `pip install -r requirements.txt`
- Start command: `gunicorn app:app`

## Notes

- Research topics live at `/research` (Week X). To add one, add its slug and title
  to `research_topics` in `app.py`, then create `templates/research/<slug>.html`
  extending `research/topic.html`. Fill its `research_content` and
  `research_sources` blocks, and credit each image's creator, source, and reuse
  terms beneath it. The hub lists new entries automatically.

- Never commit secrets. Put anything sensitive in a `.env` file, which is already ignored.
- Add each week's page or feature and link it from the "Weekly Work" list on the home page.
