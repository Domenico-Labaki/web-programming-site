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
    profileForm.addEventListener('submit', (event) => {
        event.preventDefault();
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
        if (!profileForm.reportValidity()) {
            return;
        }
        profileIsSubmitting = true;
        profileConfirmButton.disabled = true;
        HTMLFormElement.prototype.submit.call(profileForm);
    });
}
