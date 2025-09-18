document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const socialSelect = document.getElementById('social');
    const socialUrlGroup = document.getElementById('socialUrlGroup');
    const socialUrlInput = document.getElementById('socialUrl');
    const socialUrlLabel = document.getElementById('socialUrlLabel');
    const phoneInput = document.getElementById('phone');
    const confirmationModal = document.getElementById('confirmationModal');
    const closeModal = document.getElementById('closeModal');
    const confirmSubmit = document.getElementById('confirmSubmit');
    const cancelSubmit = document.getElementById('cancelSubmit');
    const successMessage = document.getElementById('successMessage');
    const loadingBar = document.getElementById('loadingBar');

    const scriptURL = 'https://script.google.com/macros/s/AKfycbyq5Sc75TzBhMX6JXRFDAYh9T8k1Guq3_A0yPJHVdI4eEsv3r2DhF0oTvKnB0SdfW0p/exec';

    confirmationModal.style.display = 'none';
    loadingBar.style.display = 'none';

    socialSelect.addEventListener('change', () => {
        if (socialSelect.value) {
            socialUrlGroup.style.display = 'block';
            socialUrlLabel.textContent = `${socialSelect.options[socialSelect.selectedIndex].text} URL`;
        } else {
            socialUrlGroup.style.display = 'none';
            socialUrlInput.value = '';
            socialUrlGroup.classList.remove('invalid');
        }
    });

    phoneInput.value = '0';

    const validateForm = () => {
        let isValid = true;

        document.querySelectorAll('.form-group').forEach(group => group.classList.remove('invalid'));
        document.querySelectorAll('.error-message').forEach(error => error.style.display = 'none');

        const name = form.name.value.trim();
        if (!name) {
            document.getElementById('nameError').style.display = 'block';
            document.querySelector('#name').parentElement.classList.add('invalid');
            isValid = false;
        }

        const email = form.email.value.trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/;
        if (!email || !emailRegex.test(email)) {
            document.getElementById('emailError').style.display = 'block';
            document.querySelector('#email').parentElement.classList.add('invalid');
            isValid = false;
        }

        const social = form.social.value;
        if (!social) {
            document.getElementById('socialError').style.display = 'block';
            document.querySelector('#social').parentElement.classList.add('invalid');
            isValid = false;
        }

        if (social && !socialUrlInput.value.trim()) {
            document.getElementById('socialUrlError').style.display = 'block';
            socialUrlGroup.classList.add('invalid');
            isValid = false;
        }

        const phone = phoneInput.value.trim();
        const phoneRegex = /^0[0-9]{9}$/;
        if (!phone || !phoneRegex.test(phone)) {
            document.getElementById('phoneError').style.display = 'block';
            document.querySelector('#phone').parentElement.classList.add('invalid');
            isValid = false;
        }

        const message = form.message.value.trim();
        if (!message) {
            document.getElementById('messageError').style.display = 'block';
            document.querySelector('#message').parentElement.classList.add('invalid');
            isValid = false;
        }

        return isValid;
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm()) {
            document.getElementById('confirmName').textContent = form.name.value;
            document.getElementById('confirmEmail').textContent = form.email.value;
            document.getElementById('confirmSocial').textContent = form.social.value;
            document.getElementById('confirmSocialUrl').textContent = socialUrlInput.value || 'Not provided';
            document.getElementById('confirmPhone').textContent = phoneInput.value;
            document.getElementById('confirmSubject').textContent = form.subject.value || 'Not provided';
            document.getElementById('confirmMessage').textContent = form.message.value;
            confirmationModal.style.display = 'flex';
        }
    });

    closeModal.addEventListener('click', () => {
        confirmationModal.style.display = 'none';
        loadingBar.style.display = 'none';
    });

    cancelSubmit.addEventListener('click', () => {
        confirmationModal.style.display = 'none';
        loadingBar.style.display = 'none';
    });

    confirmSubmit.addEventListener('click', () => {
        // Show loading bar and disable buttons
        loadingBar.style.display = 'block';
        confirmSubmit.disabled = true;
        cancelSubmit.disabled = true;

        // Submit to Google Sheet
        fetch(scriptURL, { method: 'POST', body: new FormData(form) })
            .then(response => {
                console.log('Success!', response);
                confirmationModal.style.display = 'none';
                loadingBar.style.display = 'none';
                confirmSubmit.disabled = false;
                cancelSubmit.disabled = false;
                successMessage.style.display = 'block';
                form.reset();
                socialUrlGroup.style.display = 'none';
                phoneInput.value = '0';
                document.querySelectorAll('.form-group').forEach(group => group.classList.remove('invalid'));
                document.querySelectorAll('.error-message').forEach(error => error.style.display = 'none');
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 10000);
            })
            .catch(error => {
                console.error('Error!', error.message);
                loadingBar.style.display = 'none';
                confirmSubmit.disabled = false;
                cancelSubmit.disabled = false;
                alert('An error occurred while submitting the form. Please try again.');
            });
    });

    window.addEventListener('click', (e) => {
        if (e.target === confirmationModal) {
            confirmationModal.style.display = 'none';
            loadingBar.style.display = 'none';
        }
    });
});