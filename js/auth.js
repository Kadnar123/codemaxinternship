/**
 * ============================================================================
 * BLOGCRAFT - AUTHENTICATION LOGIC (Login & Register)
 * ============================================================================
 * Handles:
 * - Client-side form validation (Email format, Password length, Match)
 * - Password visibility toggling
 * - Registration & Login submission
 * - Demo account autofill for rapid testing
 */

document.addEventListener('DOMContentLoaded', () => {
  // Password Visibility Toggle
  document.querySelectorAll('.toggle-password-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (input) {
        if (input.type === 'password') {
          input.type = 'text';
          btn.textContent = 'Hide';
        } else {
          input.type = 'password';
          btn.textContent = 'Show';
        }
      }
    });
  });

  // Login Form Handling
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors(loginForm);

      const emailInput = document.getElementById('login-email');
      const passwordInput = document.getElementById('login-password');
      let isValid = true;

      if (!isValidEmail(emailInput.value.trim())) {
        showFieldError(emailInput, 'Please enter a valid email address.');
        isValid = false;
      }

      if (!passwordInput.value.trim()) {
        showFieldError(passwordInput, 'Password is required.');
        isValid = false;
      }

      if (!isValid) return;

      const result = window.blogStorage.loginUser(emailInput.value.trim(), passwordInput.value);
      if (result.success) {
        showToast('Login successful! Welcome back.', 'success');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 800);
      } else {
        showFieldError(passwordInput, result.message);
        showToast(result.message, 'error');
      }
    });

    // Quick demo login filler
    const fillDemoBtn = document.getElementById('fill-demo-btn');
    if (fillDemoBtn) {
      fillDemoBtn.addEventListener('click', () => {
        document.getElementById('login-email').value = 'demo@blogcraft.com';
        document.getElementById('login-password').value = 'password123';
        showToast('Demo credentials autofilled!', 'info');
      });
    }
  }

  // Register Form Handling
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors(registerForm);

      const nameInput = document.getElementById('register-name');
      const emailInput = document.getElementById('register-email');
      const passwordInput = document.getElementById('register-password');
      const confirmPasswordInput = document.getElementById('register-confirm-password');
      const termsCheckbox = document.getElementById('register-terms');
      let isValid = true;

      if (nameInput.value.trim().length < 2) {
        showFieldError(nameInput, 'Full name must be at least 2 characters.');
        isValid = false;
      }

      if (!isValidEmail(emailInput.value.trim())) {
        showFieldError(emailInput, 'Please enter a valid email address.');
        isValid = false;
      }

      if (passwordInput.value.length < 6) {
        showFieldError(passwordInput, 'Password must be at least 6 characters.');
        isValid = false;
      }

      if (passwordInput.value !== confirmPasswordInput.value) {
        showFieldError(confirmPasswordInput, 'Passwords do not match.');
        isValid = false;
      }

      if (termsCheckbox && !termsCheckbox.checked) {
        showToast('Please agree to the Terms of Service to register.', 'error');
        isValid = false;
      }

      if (!isValid) return;

      const result = window.blogStorage.registerUser(
        nameInput.value.trim(),
        emailInput.value.trim(),
        passwordInput.value
      );

      if (result.success) {
        showToast('Account created successfully!', 'success');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 900);
      } else {
        showFieldError(emailInput, result.message);
        showToast(result.message, 'error');
      }
    });
  }
});

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showFieldError(input, message) {
  input.classList.add('is-invalid');
  let feedback = input.parentElement.querySelector('.error-feedback');
  if (!feedback) {
    feedback = document.createElement('div');
    feedback.className = 'error-feedback';
    input.parentElement.appendChild(feedback);
  }
  feedback.textContent = message;
}

function clearErrors(form) {
  form.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
  form.querySelectorAll('.error-feedback').forEach((el) => (el.textContent = ''));
}
