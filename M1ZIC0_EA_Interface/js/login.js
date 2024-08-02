document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('userLoginForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === 'demo' && password === 'demo') {
            localStorage.setItem('userType', 'demo');
            setupDemoEnvironment();
        } else {
            document.getElementById('loginMessage').textContent = 'Invalid credentials';
        }
    });

    document.getElementById('demoButton').addEventListener('click', function () {
        localStorage.setItem('userType', 'demo');
        setupDemoEnvironment();
    });

    document.getElementById('localEAManagementButton').addEventListener('click', function () {
        localStorage.setItem('userType', 'local');
        window.location.href = 'main.html';
    });

    function setupDemoEnvironment() {
        fetch('php/createDemoEnvironment.php')
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    window.location.href = 'main.html';
                } else {
                    alert('Failed to setup demo environment');
                }
            })
            .catch(error => {
                console.error('Error setting up demo environment:', error);
                alert('Error setting up demo environment');
            });
    }
});
