const href = window.location.href.split("/");
const id = href.pop();

fetch(`/api/expenses/${id}`)
.then(response => response.json())
.then(data => {
    $("#name").val(data.response.name); 
    $("#amount").val(data.response.amount);
    $("#select").val(data.response.timeBetween);

    const today = new Date();

    if (data.response.nextPayment >= today.getMonth()) {
        $("#date").val(data.response.nextPayment + "/" + today.getFullYear());
    } else {
        let year = today.getFullYear();
        year++;
        $("#date").val(data.response.nextPayment + "/" + year);
    }
});

$('#date').datepicker({
    format: "mm/yyyy",
    startDate: "-Infinity",
    minViewMode: 1,
    maxViewMode: 2,
    autoclose: true
});

function updateExpense() {

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
                console.log(data);  
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