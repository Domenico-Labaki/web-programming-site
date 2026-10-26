import re
from datetime import date

STUDENT_ID = re.compile(r"^\d{9}$")
FULLNAME = re.compile(r"^[A-Za-z][A-Za-z .'\-]{1,79}$")
EMAIL = re.compile(r"^[A-Za-z0-9._%+\-]+@net\.usek\.edu\.lb$")
PHONE = re.compile(
    r"^(?:\+961|00961|0)?[ \-]?(?:3|[78][0-9])[ \-]?[0-9]{3}[ \-]?[0-9]{3}$"
)
GITHUB = re.compile(
    r"^https://github\.com/[A-Za-z0-9](?:[A-Za-z0-9\-]{0,37}[A-Za-z0-9])?(?:/[^\s]*)?$"
)
HTTPS_URL = re.compile(
    r"^https://(?:[A-Za-z0-9](?:[A-Za-z0-9\-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}(?::\d{1,5})?(?:[/?#][^\s]*)?$"
)
MONTH = re.compile(r"^\d{4}-(?:0[1-9]|1[0-2])$")
TIME = re.compile(r"^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$")
HEXCOLOR = re.compile(r"^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$")

MAJORS = {"computer", "electrical", "biomedical", "telecommunications"}
GRADUATION = {"spring", "summer", "fall"}
YESNO = {"yes", "no"}
SKILLS = {"programming", "embedded-systems", "electronics", "computer-networks", "telecommunications", "biomedical-instrumentation", "artificial-intelligence-machine-learning", "signal-processing"}
SOFTWARE = {"MATLAB", "Simulink", "LabVIEW", "LTspice", "Vivado", "SolidWorks", "Proteus"}
PROJECT_AREAS = {"artificial-intelligence", "web-applications", "cybersecurity", "internet-of-things", "power-systems", "renewable-energy", "control-systems", "medical-imaging", "biosensors", "medical-devices", "wireless-communications", "5g-6g-networks"}

REQUIRED = {"student_id", "fullname", "email", "major", "graduation"}

def validate_profile(form):
    errors = {}
    cleaned = {}

    for field in REQUIRED:
        if form.get(field, "").strip() == "":
            errors[field] = "This field is required."

    student_id = form.get("student_id", "").strip()
    if student_id != "" and not STUDENT_ID.match(student_id):
        errors["student_id"] = "Student ID must be exactly 9 digits."
        cleaned["student_id"] = student_id