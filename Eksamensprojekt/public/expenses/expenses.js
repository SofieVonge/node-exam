fetch("/api/expenses")
        .then(response => response.json())
        .then(data => {
            data.response.map((expense) => {
                let expenseElement =  $(".expense").first().clone();
                $(expenseElement).find("#name").html(expense.name); 
                $(expenseElement).find("#amount").html(expense.amount);
                $(expenseElement).find("#time").html(expense.timeBetween);
                $(expenseElement).find("#update").html(`<a href="/updateExpense/${expense.id}" class="btn btn-info" role="button">Update</a>`);
                $(expenseElement).find("#delete").html(`<a href="/expenses/${expense.id}" class="btn btn-info" role="button">Delete</a>`);
                $(".expense-container").append(expenseElement);
            });     
        });


