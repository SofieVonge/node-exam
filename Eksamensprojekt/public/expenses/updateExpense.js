let href = window.location.href.split("/");
const id = href.pop();
console.log("id", id);

fetch(`/api/expenses/${id}`)
.then(response => response.json())
.then(data => {
    console.log(data.response.name);
    $("#name").val(data.response.name); 
    $("#amount").val(data.response.amount);
    $("#select").val(data.response.timeBetween);
});

function updateExpense(id) {

    const input = {
        name: document.forms.expense.name.value.trim(),
        amount: document.forms.expense.amount.value.trim(),
        time: document.forms.expense.time.value,
        date: document.forms.expense.date.value
    };

    if (input.name.length < 1 || input.amount.length < 1 || input.date.length < 1) {
        $("#update-expense .error-message").text("Please fill out the form");
        return;
    }

    if (isNaN(input.amount)) {
        $("#update-expense .error-message").text("Please submit a number for a price");
        return;
    }

    fetch(`/api/expenses/${id}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(input)
    }).then(response => {
        response.json().then(data => {
            if (response.status === 201) {    
                const creationText =`<p>${data.response.name} was updated.<br /></p>`;
                $("#update-expense .error-message").css({color: 'blue'});
                $("#update-expense .error-message").html(creationText);

                $("#name").val("");
                $("#amount").val("");
                $("#date").val("");
                $("#select").val("1");
                return;
            }
            $("#update-expense .error-message").text(data.response);
        });
    });
}