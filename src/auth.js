function login() {
    const usernameField = document.getElementById('usernameField');
    const passwordField = document.getElementById('passwordField');

    if (usernameField && passwordField) {
        const username = usernameField.value;
        const password = passwordField.value;

        const userData = {
            username: username,
            password: password
        };

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        };

        fetch('http://10.100.0.62:8080/api/v1/user/login', requestOptions)
            .then(response => {
                if (response.status === 403) {
                    response.json().then(json => {
                        const error = json.error || "Forbidden";
                        displayError(error);
                    });
                } else if (response.ok) {
                    return response.json()
                }
            })
            // Handles the successful login response (containing a token).
            .then(json => {
                localStorage.setItem("token", json.token);
                console.log("Successfully stored user-token.");

                window.location.href = "Changelater.html";
            })
            .catch((error) => {
                console.error(error);
                return displayError(error);
            });
    }
}

function register() {
    const usernameField = document.getElementById('usernameField');
    const passwordField = document.getElementById('passwordField');

    if (usernameField && passwordField) {
        const username = usernameField.value;
        const password = passwordField.value;

        const userData = {
            username: username,
            password: password,
        };

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        };

        fetch('http://10.100.0.62:8080/api/v1/user/register', requestOptions)
            .then((response) => {
                switch (response.status) {
                    case 409: // Conflict
                        response.json().then(json => {
                            const message = json.message || "Conflict";
                            displayError("409: " + message);
                        });
                        break;
                        case 400: // Bad request
                        response.json().then(json => {
                            const message = json.message || "Bad Request";
                            displayError("400: " + message);
                        });
                        break;
                    case 201: // Created
                        const modal = new bootstrap.Modal(document.getElementById('modal'));
                        modal.show();
                        break;
                }
            })
            .catch((error) => {
                console.error(error);
                return displayError(error);
            })
    }
}

function validateAuthentication() {
    const token = localStorage.getItem("token");
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': token,
        }
    };

    return new Promise((resolve, reject) => {
        fetch('http://10.100.0.62:8080/api/v1/user/verify-token', requestOptions)
            .then(response => {
                if (response.status === 200) {
                    console.log("Authentication token valid, user authorized.")
                    resolve(true);
                } else if (response.status === 401) {
                    resolve(false);
                } else {
                    reject(new Error(`Unexpected status code: ${response.status}`));
                }
            })
            .catch(error => {
                console.error("Error validating authentication:", error);
                resolve(false); // If there's an error, consider authentication as failed
            });
    });
}

let errorTimeout;
function displayError(error) {
    const errorAlert = document.getElementById('errorAlert');

    if (errorAlert) {
        errorAlert.classList.remove('hide');
        errorAlert.innerText = error;

        if (errorTimeout) {
            clearTimeout(errorTimeout);
        }

        errorTimeout = setTimeout(() => {
            errorAlert.classList.add('hide');
            errorAlert.innerText = "";
        }, 10000);
    } else {
        console.error("Element with ID 'errorAlert' not found.")
    }
}

export { login, register, validateAuthentication };