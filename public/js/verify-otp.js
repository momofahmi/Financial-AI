document.addEventListener('DOMContentLoaded', () => {
    const otpForm = document.getElementById('otpForm');

    otpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const otp = document.getElementById('otp').value;
        const pendingSignup = JSON.parse(localStorage.getItem('pendingSignup'));
        const pendingLogin = localStorage.getItem('pendingLogin');

        try {
            const email = pendingSignup ? pendingSignup.email : pendingLogin;
            //const password = pendingSignup ? pendingSignup.password : null;
            const verifyResponse = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });
            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
                if (pendingSignup) {
                    // const signupResponse = await fetch('/api/auth/signup', {
                    //     method: 'POST',
                    //     headers: { 'Content-Type': 'application/json' },
                    //     body: JSON.stringify(pendingSignup),
                    // });
                    // const signupData = await signupResponse.json();

                    // if (signupData.success) {
                    //     localStorage.removeItem('pendingSignup');
                    //     window.location.href = '/dashboard.html';
                    // } else {
                    //     alert(signupData.error);
                    // }
                    localStorage.setItem('userEmail', email);

                    window.location.href = '/dashboard.html';

                } else if (pendingLogin) {
                    // const loginResponse = await fetch('/api/auth/login', {
                    //     method: 'POST',
                    //     headers: { 'Content-Type': 'application/json' },
                    //     body: JSON.stringify({ email: pendingLogin }),
                    // });
                    // const loginData = await loginResponse.json();

                    // if (loginData.success) {
                    //     localStorage.removeItem('pendingLogin');
                    //     window.location.href = '/dashboard.html';
                    // } else {
                    //     alert(loginData.error);
                    // }
                    localStorage.setItem('userEmail', email);

                    window.location.href = '/dashboard.html';
                }
            } else {
                alert(verifyData.error);
            }
        } catch (error) {
            console.error('OTP verification error:', error);
            alert('An error occurred during OTP verification. Please try again.');
        }
    });
});

