document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const credentialsResponse = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });
            const credentialsData = await credentialsResponse.json();
            if (credentialsData.success) {
                const otpResponse = await fetch('/api/auth/send-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                });
                const otpData = await otpResponse.json();
                


                if (otpData.success) {
                    localStorage.setItem('pendingSignup', JSON.stringify({ username, email, password }));
                    window.location.href = '/verify-otp.html';
                } else {
                    alert(otpData.error);
                }
            } else {
                alert(credentialsData.error);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login. Please try again.');
        }

    });
});