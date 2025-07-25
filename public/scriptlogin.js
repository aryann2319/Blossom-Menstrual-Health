document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
 
        const result = await response.json();

        if (response.ok && result.redirect) {
            localStorage.setItem('username', result.username);

            window.location.href = result.redirect;
        } else {
            alert(result.message); 
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
