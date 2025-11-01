// ========================================
// Mobile Navigation Toggle
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');

            // Animate hamburger menu
            const spans = navToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu && navToggle) {
            if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
                navMenu.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        }
    });

    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (navToggle) {
                    const spans = navToggle.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            }
        });
    });
});

// ========================================
// Smooth Scrolling for Anchor Links
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ========================================
// Form Validation & Submission
// ========================================
const enrollmentForm = document.getElementById('enrollmentForm');

if (enrollmentForm) {
    enrollmentForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate form
        if (validateEnrollmentForm()) {
            // In a production environment, this would submit to a server
            // For now, we'll show a success message
            showSuccessMessage();
        }
    });
}

function validateEnrollmentForm() {
    let isValid = true;
    const form = document.getElementById('enrollmentForm');

    // Check required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            highlightError(field);
        } else {
            clearError(field);
        }
    });

    // Validate email format
    const emailField = document.getElementById('email');
    if (emailField && emailField.value) {
        if (!isValidEmail(emailField.value)) {
            isValid = false;
            highlightError(emailField, 'Please enter a valid email address');
        }
    }

    // Validate phone number format (South African)
    const phoneField = document.getElementById('phone');
    if (phoneField && phoneField.value) {
        if (!isValidSAPhone(phoneField.value)) {
            isValid = false;
            highlightError(phoneField, 'Please enter a valid South African phone number');
        }
    }

    // Validate ID number (basic check)
    const idField = document.getElementById('idNumber');
    if (idField && idField.value) {
        if (!isValidSAID(idField.value)) {
            highlightError(idField, 'Please enter a valid ID or Passport number');
        }
    }

    // Check if at least one financing option is selected
    const financingCheckboxes = document.querySelectorAll('input[name="financing"]');
    const financingChecked = Array.from(financingCheckboxes).some(cb => cb.checked);
    if (!financingChecked) {
        isValid = false;
        alert('Please select at least one financing option');
    }

    // Check declaration checkbox
    const declarationCheckbox = document.getElementById('declaration');
    if (declarationCheckbox && !declarationCheckbox.checked) {
        isValid = false;
        highlightError(declarationCheckbox.parentElement, 'You must accept the declaration to proceed');
    }

    // Check privacy checkbox
    const privacyCheckbox = document.getElementById('privacy');
    if (privacyCheckbox && !privacyCheckbox.checked) {
        isValid = false;
        highlightError(privacyCheckbox.parentElement, 'You must consent to data processing to proceed');
    }

    if (!isValid) {
        // Scroll to first error
        const firstError = document.querySelector('.error-highlight');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    return isValid;
}

function highlightError(field, message) {
    field.classList.add('error-highlight');
    field.style.borderColor = '#d32f2f';

    // Remove existing error message
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Add error message
    if (message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#d32f2f';
        errorDiv.style.fontSize = '0.85rem';
        errorDiv.style.marginTop = '0.25rem';
        errorDiv.textContent = message;
        field.parentElement.appendChild(errorDiv);
    }
}

function clearError(field) {
    field.classList.remove('error-highlight');
    field.style.borderColor = '';

    const errorMessage = field.parentElement.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidSAPhone(phone) {
    // Remove spaces, hyphens, and plus signs
    const cleaned = phone.replace(/[\s\-\+]/g, '');

    // Check if it matches South African format
    // Should be 10 digits (0XXXXXXXXX) or 11 digits starting with 27 (27XXXXXXXXX)
    const saPhoneRegex = /^(0\d{9}|27\d{9})$/;
    return saPhoneRegex.test(cleaned);
}

function isValidSAID(id) {
    // Basic validation - check if it's 13 digits or passport format
    const cleaned = id.replace(/[\s\-]/g, '');

    // SA ID is 13 digits
    if (/^\d{13}$/.test(cleaned)) {
        return true;
    }

    // Or passport format (alphanumeric, 5-20 characters)
    if (/^[A-Z0-9]{5,20}$/i.test(cleaned)) {
        return true;
    }

    return false;
}

function showSuccessMessage() {
    // Create modal/overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;

    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        padding: 3rem;
        border-radius: 12px;
        max-width: 500px;
        text-align: center;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    `;

    modal.innerHTML = `
        <div style="color: #7AB539; font-size: 4rem; margin-bottom: 1rem;">✓</div>
        <h2 style="color: #1e3a4c; margin-bottom: 1rem; font-family: 'Montserrat', sans-serif;">Application Submitted!</h2>
        <p style="color: #666; margin-bottom: 2rem;">
            Thank you for your application to On The Mountain Revival Centre.
            You will receive a confirmation email shortly with next steps.
        </p>
        <p style="color: #666; margin-bottom: 2rem;">
            Our admissions team will contact you within 3-5 business days.
        </p>
        <button onclick="location.href='index.html'" style="
            background-color: #7AB539;
            color: white;
            padding: 1rem 2rem;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            font-family: 'Montserrat', sans-serif;
        ">Return to Homepage</button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Close on overlay click
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
            // Optionally reset form
            document.getElementById('enrollmentForm').reset();
        }
    });
}

// ========================================
// Real-time Field Validation
// ========================================
if (enrollmentForm) {
    // Email validation
    const emailField = document.getElementById('email');
    if (emailField) {
        emailField.addEventListener('blur', function() {
            if (this.value && !isValidEmail(this.value)) {
                highlightError(this, 'Please enter a valid email address');
            } else {
                clearError(this);
            }
        });
    }

    // Phone validation
    const phoneField = document.getElementById('phone');
    if (phoneField) {
        phoneField.addEventListener('blur', function() {
            if (this.value && !isValidSAPhone(this.value)) {
                highlightError(this, 'Please enter a valid South African phone number (e.g., 0821234567 or +27821234567)');
            } else {
                clearError(this);
            }
        });
    }

    // ID validation
    const idField = document.getElementById('idNumber');
    if (idField) {
        idField.addEventListener('blur', function() {
            if (this.value && !isValidSAID(this.value)) {
                highlightError(this, 'Please enter a valid 13-digit ID number or passport number');
            } else {
                clearError(this);
            }
        });
    }

    // Clear errors on input
    const allInputs = enrollmentForm.querySelectorAll('input, select, textarea');
    allInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.classList.contains('error-highlight')) {
                clearError(this);
            }
        });
    });
}

// ========================================
// Scroll animations (fade in on scroll)
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Add fade-in animation to cards
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.feature-card, .program-card, .form-section');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
