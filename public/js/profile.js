document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    const usernameElement = document.getElementById('username');
    const emailElement = document.getElementById('email');

    // Fetch user profile information
    fetch('/api/auth/profile', {
        method: 'GET',
        credentials: 'include',
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            usernameElement.textContent = `Username: ${data.user.username}`;
            emailElement.textContent = `Email: ${data.user.email}`;
        } else {
            alert('Failed to fetch profile information. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error fetching profile:', error);
        alert('An error occurred while fetching profile information.');
    });

    logoutBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
            const data = await response.json();
            if (data.success) {
                window.location.href = '/login.html';
            } else {
                alert('Logout failed. Please try again.');
            }
        } catch (error) {
            console.error('Logout error:', error);
            alert('An error occurred during logout. Please try again.');
        }
    });
});

