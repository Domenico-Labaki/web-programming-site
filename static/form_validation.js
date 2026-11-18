const profileForm = document.getElementById('profile-form');
const profileReviewPanel = document.getElementById('profile-review');
const profileReviewValues = document.getElementById('review-values');
const profileReviewHeading = document.getElementById('review-heading');
const profileEditButton = document.getElementById('edit-profile');
const profileConfirmButton = document.getElementById('confirm-profile');
const profileFieldLabels = {
    form_version: 'Form Version',
    student_id: 'Student ID',
    fullname: 'Full Name',
    email: 'USEK Email',
    phone: 'Mobile Number',
    birthdate: 'Date of Birth',
    portfolio: 'GitHub',
    gin446: 'GIN446 Website',
    major: 'Engineering Major',
    gpa: 'Current GPA / 100',
    credits: 'Credits Completed',
    graduation: 'Expected Graduation',
    graduation_month: 'Expected Graduation Month & Year',
    internship_completed: 'Internship Completed',
    skills: 'Areas of Experience',
    language: 'Primary Programming Language',
    software: 'Engineering Software Used',
    project_title: 'Proposed Project Title',
    project_area: 'Preferred Project Area',
    description: 'Brief Project Description',
    team_size: 'Preferred Team Size',
    project_color: 'Project Dashboard Color',
    meeting_date: 'Preferred Meeting Date',
    meeting_time: 'Preferred Meeting Time',
    confirmation: 'Information Accuracy Confirmation'
};
let profileReviewIsOpen = false;
let profileIsSubmitting = false;
function validateProfileFields(trimDescription = false) {
    const description = profileForm.elements.namedItem('description');
    const studentId = profileForm.elements.namedItem('student_id');
    const graduationMonth = profileForm.elements.namedItem('graduation_month');
    const meetingDate = profileForm.elements.namedItem('meeting_date');
    if (trimDescription) {
        description.value = description.value.trim();
    }
    description.setCustomValidity(description.value.trim() ? '' : 'Enter a project description.');

    const currentYear = new Date().getFullYear();
    let idError = '';
    if (studentId.value && !/^[0-9]{9}$/.test(studentId.value)) {
        idError = 'Student ID must be exactly 9 digits.';
    } else if (studentId.value && (Number(studentId.value.slice(0, 4)) < 1950 || Number(studentId.value.slice(0, 4)) > currentYear)) {
        idError = `Student ID must start with an enrollment year from 1950 to ${currentYear}.`;
    }
    studentId.setCustomValidity(idError);

    const term = profileForm.elements.namedItem('graduation').value;
    const month = Number(graduationMonth.value.slice(5));
    const termMonths = { spring: [1, 5], summer: [6, 8], fall: [9, 12] };
    const range = termMonths[term];
    graduationMonth.setCustomValidity(graduationMonth.value && range && (month < range[0] || month > range[1])
        ? 'Choose a month matching the graduation term: spring Jan–May, summer Jun–Aug, fall Sep–Dec.' : '');

    let meetingError = '';
    if (meetingDate.value) {
        const [year, month, day] = meetingDate.value.split('-').map(Number);
        const weekday = new Date(year, month - 1, day).getDay();
        if (weekday === 0 || weekday === 6) {
            meetingError = 'Choose a weekday (Monday–Friday).';
        }
    }
    meetingDate.setCustomValidity(meetingError);
}

function showProfileForm() {
    profileReviewPanel.classList.add('is-hidden');
    profileForm.classList.remove('is-hidden');
    profileReviewIsOpen = false;
}
function getProfileDisplayValues(controls, submittedValues) {
    const firstControl = controls[0];
    if (firstControl.tagName === 'SELECT') {
        return Array.from(firstControl.selectedOptions)
            .filter((option) => option.value !== '')
            .map((option) => option.textContent.trim());
    }
    if (firstControl.type === 'checkbox' || firstControl.type === 'radio') {
        return controls
            .filter((control) => control.checked)
            .map((control) => {
                const label = control.labels?.[0];
                return label ? label.textContent.trim() : control.value;
            });
    }
    return submittedValues.filter((value) => value !== '');
}
function buildProfileReview() {
    const data = new FormData(profileForm);
    const groups = new Map();
    const fragment = document.createDocumentFragment();
    for (const control of profileForm.elements) {
        if (!control.name || control.disabled || !control.matches('input, select, textarea') || ['submit', 'reset', 'button'].includes(control.type)) {
            continue;
        }
        if (!groups.has(control.name)) {
            groups.set(control.name, []);
        }
        groups.get(control.name).push(control);
    }
    for (const [name, controls] of groups) {
        const values = getProfileDisplayValues(controls, data.getAll(name));
        const term = document.createElement('dt');
        const description = document.createElement('dd');
        term.textContent = profileFieldLabels[name] || name;
        description.textContent = values.length ? values.join(', ') : 'Not provided';
        fragment.append(term, description);
    }
    profileReviewValues.replaceChildren(fragment);
}

if (profileForm && profileReviewPanel && profileReviewValues && profileReviewHeading && profileEditButton && profileConfirmButton) {
    profileForm.noValidate = true;
    for (const eventName of ['input', 'change']) {
        profileForm.addEventListener(eventName, () => validateProfileFields());
    }
    profileForm.addEventListener('reset', () => {
        for (const control of profileForm.elements) {
            if (typeof control.setCustomValidity === 'function') {
                control.setCustomValidity('');
            }
        }
    });
    profileForm.addEventListener('submit', (event) => {
        event.preventDefault();
        validateProfileFields(true);
        if (profileIsSubmitting || !profileForm.reportValidity()) {
            return;
        }
        buildProfileReview();
        profileForm.classList.add('is-hidden');
        profileReviewPanel.classList.remove('is-hidden');
        profileReviewIsOpen = true;
        profileReviewHeading.focus();
    });
    profileEditButton.addEventListener('click', () => {
        showProfileForm();
        profileForm.querySelector('button[type="submit"]').focus();
    });
    profileConfirmButton.addEventListener('click', () => {
        if (!profileReviewIsOpen || profileIsSubmitting) {
            return;
        }
        showProfileForm();
        validateProfileFields(true);
        if (!profileForm.reportValidity()) {
            return;
        }
        profileIsSubmitting = true;
        profileConfirmButton.disabled = true;
        HTMLFormElement.prototype.submit.call(profileForm);
    });
}
