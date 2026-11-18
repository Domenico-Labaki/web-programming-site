import unittest
from datetime import date

from werkzeug.datastructures import MultiDict

from validators import validate_profile


class ProfileValidationTests(unittest.TestCase):
    def validate(self, **overrides):
        data = {
            "student_id": "202312345",
            "fullname": "Test Student",
            "email": "student@net.usek.edu.lb",
            "major": "computer",
            "graduation": "spring",
            "graduation_month": "2027-05",
            "description": "A project description",
            "confirmation": "yes",
        }
        data.update(overrides)
        return validate_profile(MultiDict(data))

    def test_description_required_after_trimming(self):
        for description in ("", "   ", "\t\n"):
            with self.subTest(description=description):
                errors, _ = self.validate(description=description)
                self.assertIn("description", errors)
        errors, cleaned = self.validate(description="  Useful project\n ")
        self.assertFalse(errors)
        self.assertEqual(cleaned["description"], "Useful project")

    def test_student_id_boundaries_and_ascii_format(self):
        year = date.today().year
        for student_id in ("195012345", f"{year}12345"):
            with self.subTest(student_id=student_id):
                self.assertNotIn("student_id", self.validate(student_id=student_id)[0])
        for student_id in ("194912345", f"{year + 1}12345", "485084718", "2023abcde", "20231234", "2023123456", "２０２３１２３４５"):
            with self.subTest(student_id=student_id):
                self.assertIn("student_id", self.validate(student_id=student_id)[0])

    def test_all_graduation_months_for_each_term(self):
        ranges = {"spring": range(1, 6), "summer": range(6, 9), "fall": range(9, 13)}
        for term, allowed in ranges.items():
            for month in range(1, 13):
                with self.subTest(term=term, month=month):
                    errors, _ = self.validate(graduation=term, graduation_month=f"2027-{month:02}")
                    self.assertEqual("graduation_month" in errors, month not in allowed)
        self.assertIn("graduation_month", self.validate(graduation_month="bad-month")[0])

    def test_optional_meeting_date_and_weekdays(self):
        for meeting_date in ("", "2026-11-16", "2026-11-20"):
            with self.subTest(meeting_date=meeting_date):
                self.assertNotIn("meeting_date", self.validate(meeting_date=meeting_date)[0])
        for meeting_date in ("2026-11-21", "2026-11-22", "2026-02-30"):
            with self.subTest(meeting_date=meeting_date):
                self.assertIn("meeting_date", self.validate(meeting_date=meeting_date)[0])

    def test_server_rejects_invalid_post_without_browser_checks(self):
        from app import app

        with app.test_client() as client:
            response = client.post("/profile-validated", data={
                "student_id": "485084718",
                "fullname": "Test Student",
                "email": "student@net.usek.edu.lb",
                "major": "computer",
                "graduation": "spring",
                "graduation_month": "2027-08",
                "description": "   ",
                "meeting_date": "2026-11-21",
                "confirmation": "yes",
            })
        self.assertEqual(response.status_code, 200)
        page = response.get_data(as_text=True)
        for message in ("enrollment year", "matching the graduation term", "This field is required.", "Choose a weekday"):
            self.assertIn(message, page)


if __name__ == "__main__":
    unittest.main()
