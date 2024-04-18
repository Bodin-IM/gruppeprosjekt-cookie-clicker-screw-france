function login() {
    const username = document.getElementById("usernameField").value;
    const password = document.getElementById("passwordField").value;

    const userData = {
        username: username,
        password: password
    }

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    };

    fetch('http://localhost:8080/api/v1/user/login', requestOptions)
    .then(res => {
        if(!res.ok) {
            throw new Error('Network response was not ok')
        }

        return res.text();
    })
    console.log("Login button pressed");
}

function register() {
    console.log("Register button pressed");
}