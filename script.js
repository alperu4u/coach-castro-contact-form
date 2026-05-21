/*
 * Client-side logic for the Coach Castro contact form.
 *
 * Generates a simple math captcha to deter automated submissions
 * and validates user input on submit. If validation passes the
 * form will reset and a thank-you message will appear. Otherwise
 * errors are displayed and a new captcha is generated as needed.
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const captchaEq = document.getElementById('captchaEquation');
  const captchaInput = document.getElementById('captchaAnswer');
  const messageElem = document.getElementById('message');
  const yearElem = document.getElementById('year');

  // Progress bar elements
  const progressBar = document.querySelector('.progress');
  const totalSteps = 6; // number of required fields including captcha

  // Set current year in footer
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }

  // Generate a simple addition captcha
  function generateCaptcha() {
    const a = Math.floor(Math.random() * 8) + 1; // 1-8
    const b = Math.floor(Math.random() * 8) + 1; // 1-8
    captchaEq.textContent = `What is ${a} + ${b}?`;
    captchaEq.dataset.answer = (a + b).toString();
    captchaInput.value = '';
  }

  generateCaptcha();

  function displayMessage(msg, success = false) {
    messageElem.textContent = msg;
    messageElem.style.color = success ? '#4CAF50' : '#FF5555';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    messageElem.textContent = '';

    // Grab values
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const age = form.age.value.trim();
    const level = form.level.value;
    const captchaAns = captchaInput.value.trim();
    const correctAnswer = captchaEq.dataset.answer;

    // Validate name (letters and spaces only)
    if (!/^[A-Za-z\s]+$/.test(name)) {
      return displayMessage('Please enter a valid name (letters only).');
    }
    // Validate email
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return displayMessage('Please enter a valid email address.');
    }
    // Validate phone (digits, spaces, hyphens, plus signs)
    if (!/^[0-9\s+\-()]+$/.test(phone) || phone.length < 6) {
      return displayMessage('Please enter a valid phone number.');
    }
    // Validate age (3-50)
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 3 || ageNum > 50) {
      return displayMessage('Please enter an age between 3 and 50 years.');
    }
    // Validate soccer level
    if (!level) {
      return displayMessage('Please select a soccer level.');
    }
    // Validate captcha
    if (captchaAns !== correctAnswer) {
      generateCaptcha();
      return displayMessage('Captcha answer is incorrect. Please try again.');
    }
    // If all validations pass
    displayMessage('Thank you! Your information has been submitted.', true);
    form.reset();
    generateCaptcha();
    // reset progress bar
    updateProgress();
  });

  // Update progress bar based on filled fields
  function updateProgress() {
    const fields = [form.name.value.trim(), form.email.value.trim(), form.phone.value.trim(), form.age.value.trim(), form.level.value, captchaInput.value.trim()];
    // Count non-empty fields (for select, treat non-empty value only when selected)
    let completed = fields.reduce((acc, val) => (val ? acc + 1 : acc), 0);
    const percent = (completed / totalSteps) * 100;
    if (progressBar) {
      progressBar.style.width = `${percent}%`;
    }
  }

  // Attach input event listeners to update progress
  ['name', 'email', 'phone', 'age'].forEach((id) => {
    const el = form[id];
    el.addEventListener('input', updateProgress);
  });
  form.level.addEventListener('change', updateProgress);
  captchaInput.addEventListener('input', updateProgress);

  // Initial progress state
  updateProgress();
});