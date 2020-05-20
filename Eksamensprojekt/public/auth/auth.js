function signIn()
{
    const input = {
        username: document.forms.signin.username.value.trim(),
        password: document.forms.signin.password.value.trim(),
    }

    if (input.username.length < 1 || input.password.length < 1) {
        $("#signin .error-message").text("username or password missing");
        return;
    }

    fetch("/api/auth/signin", {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json' // json data
        //'Content-Type': 'application/x-www-form-urlencoded', // form data
        },
        body: JSON.stringify(input) // body data type must match "Content-Type" header
    }).then(response => {
        response.json().then(data => {
            console.log(response.status);
            if (response.status === 200) {
                window.location.reload();
                return;
            }

            $("#signin .error-message").text(data.response);
        });
    });
}


function signUp()
{
    const input = {
        username: document.forms.signup.username.value.trim(),
        password: document.forms.signup.password.value.trim(),
        email: document.forms.signup.email.value.trim(),
        household: document.forms.signup.household.value.trim(),
    }
    const passwordCompare = document.forms.signup.password_confirmation.value.trim();

    // password validation
    if (input.username.length < 1 || input.password.length < 1) {
        $("#signup .error-message").text("username or password missing");
        return;
    } else if (input.password.length < 8) {
        $("#signup .error-message").text("password must be 8 characters or longer");
        return;
    } else if (input.password != passwordCompare) {
        $("#signup .error-message").text("passwords doesn't match");
        return;
    }

    // email validation
    if (!validateEmail(input.email)) {
        $("#signup .error-message").text("email syntax is wrong");
        return;
    }

    // household validation
    if (input.household.length < 1) {
        $("#signup .error-message").text("household name is missing");
        return;
    }

   
    fetch("/api/auth/signup", {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        //'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(input) // body data type must match "Content-Type" header
    }).then(response => {
        response.json().then(data => {
            console.log(data);
            if (response.status === 201) {
                //alert("Your account was created");
                //window.location.href = "/auth/signin";
                
                const creationText =`<p>The account ${data.response.username} of ${data.response.household.name} was created.<br /><a href="/auth/signin">Click here to login</a></p>`;
                $("#signup .error-message").css({color: 'blue'});
                $("#signup .error-message").html(creationText);
                return;
            }

            $("#signup .error-message").text(data.response);
        });
    });
}



function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}