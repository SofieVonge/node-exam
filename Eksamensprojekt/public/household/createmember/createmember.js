function createMember()
{
    const input = {
        username: document.forms.household_member_signupform.username.value.trim(),
        password: document.forms.household_member_signupform.password.value.trim(),
        email: document.forms.household_member_signupform.email.value.trim()
    }
    const passwordCompare = document.forms.household_member_signupform.password_confirmation.value.trim();

    // password validation
    if (input.username.length < 1 || input.password.length < 1) {
        $("#household_member_signupform .error-message").text("username or password missing");
        return;
    } else if (input.password.length < 8) {
        $("#household_member_signupform .error-message").text("password must be 8 characters or longer");
        return;
    } else if (input.password != passwordCompare) {
        $("#household_member_signupform .error-message").text("passwords doesn't match");
        return;
    }

    // email validation
    if (!validateEmail(input.email)) {
        $("#household_member_signupform .error-message").text("email syntax is wrong");
        return;
    }
   
    fetch("/api/household/member", {
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
                
                const creationText =`<p>The account ${data.response.username} of ${data.response.household.name} was created.<br />`;
                $("#household-member-signupform .error-message").css({color: 'blue'});
                $("#household-member-signupform .error-message").html(creationText);
                return;
            }

            $("#household-member-signupform .error-message").text(data.response);
        });
    });
}



function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}