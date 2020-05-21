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

    const input = {
        name: document.forms.new-expense.name.value.trim(),
        amount: document.forms.new-expense.amount.value.trim(),
        time: document.forms.new-expense.time.value.trim(),
        date: document.forms.new-expense.date.value.trim(),
    };

    if (input.name.length < 1 || input.amount.length < 1 || input.date.length < 1) {
        $("#signin .error-message").text("Please fill out the form");
        return;
    }

    if (!validateAmount(input.amount)) {
        $("#signin .error-message").text("Please submit a number for a price");
        return;
    }


}

function validateAmount(amount) {

}