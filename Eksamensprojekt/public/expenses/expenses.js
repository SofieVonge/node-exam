fetch("/expenses")
        .then(response => response.json())
        .then(data => {
            data.response.map((expense) => {
                let expenseElement =  $(".expense").first().clone();
                $(expenseElement).find("#name").html(expense.name); 
                $(expenseElement).find("#amount").html(expense.amount);
                $(expenseElement).find("#time").html(expense.timeBetween);
                $(expenseElement).find("#update").html(`<a href="/expenses/${expense.id}" class="btn btn-info" role="button">Update</a>`);
                $(expenseElement).find("#delete").html(`<a href="/expenses/${expense.id}" class="btn btn-info" role="button">Delete</a>`);
                $(".expense-container").append(expenseElement);
            });     
        });

$('#date').datepicker({
    format: "mm/yyyy",
    startDate: "-Infinity",
    minViewMode: 1,
    maxViewMode: 2,
    autoclose: true
});

function sendExpense() {
// SyntaxError: JSON.parse: unexpected character at line 1 column 1 of the JSON data ???
    const input = {
        name: document.forms.expense.name.value.trim(),
        amount: document.forms.expense.amount.value.trim(),
        time: document.forms.expense.time.value.trim(),
        date: document.forms.expense.date.value.trim()
    };

    console.log(input);

    if (input.name.length < 1 || input.amount.length < 1 || input.date.length < 1) {
        $("#signin .error-message").text("Please fill out the form");
        return;
    }

    if (isNaN(input.amount)) {
        $("#signin .error-message").text("Please submit a number for a price");
        return;
    }

    fetch("/api/expense/expenses", {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(input) // body data type must match "Content-Type" header
    }).then(response => {
        response.json().then(data => {
            console.log(data);
            if (response.status === 201) {
                
                const creationText =`<p>${data.response.name} was created.<br /></p>`;
                $("#signup .error-message").css({color: 'blue'});
                $("#signup .error-message").html(creationText);

                //eventuelt husk at slette indhold i inputfelterne her??
                return;
            }

            $("#signup .error-message").text(data.response);
        });
    });


}

