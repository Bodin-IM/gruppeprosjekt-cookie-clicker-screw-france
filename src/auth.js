function displayError(error) {
    document.getElementById('errorAlert').classList.remove('hide');
    document.getElementById('errorAlert').innerText = error;

    setTimeout(() => {
        document.getElementById('errorAlert').classList.add('hide');
        document.getElementById('errorAlert').innerText = "";
    }, 6000);
}

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
        .then(response => {
            if(response.ok) {
                return response.json()
            }

            return Promise.reject(response);
        })
        .then((json) => {
            localStorage.setItem("token", json.token);
            console.log("Successfully stored user-token.")
            
            window.location.href = "Changelater.html"
        })
        .catch((response) => {
        console.log(response.status, response.statusText);

        response.json().then((json) => {
            console.log(json);
        })
        });
    console.log("Login button pressed");
}

function register() {
    console.log("Register button pressed");
}