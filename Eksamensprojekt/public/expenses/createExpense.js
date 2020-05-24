$('#date').datepicker({
    format: "mm/yyyy",
    startDate: "-Infinity",
    minViewMode: 1,
    maxViewMode: 2,
    autoclose: true
});

function sendExpense() {
    const input = {
        name: document.forms.expense.name.value.trim(),
        amount: document.forms.expense.amount.value.trim(),
        time: document.forms.expense.time.value,
        date: document.forms.expense.date.value
    };

    if (input.name.length < 1 || input.amount.length < 1 || input.date.length < 1) {
        $("#new-expense .error-message").text("Please fill out the form");
        return;
    }

    if (isNaN(input.amount)) {
        $("#new-expense .error-message").text("Please submit a number for a price");
        return;
    }

    fetch("/api/expenses", {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(input) // body data type must match "Content-Type" header
    }).then(response => {
        response.json().then(data => {
            if (response.status === 201) {
                
                const creationText =`<p>${data.response.name} was created.<br /></p>`;
                $("#new-expense .error-message").css({color: 'blue'});
                $("#new-expense .error-message").html(creationText);

                //eventuelt husk at slette indhold i inputfelterne her??
                return;
            }

            $("#new-expense .error-message").text(data.response);
        });
    });


}