fetch("/api/expenses")
        .then(response => response.json())
        .then(data => {
            data.response.map((expense) => {
                let expenseElement =  $(".expense").first().clone();
                $(expenseElement).find("#name").html(expense.name); 
                $(expenseElement).find("#amount").html(expense.amount);
                $(expenseElement).find("#time").html(intervalConverter(expense.timeBetween));
                $(expenseElement).find("#update").html(`<a href="/updateExpense/${expense.id}" class="btn btn-info" role="button">Update</a>`);
                $(expenseElement).find("#delete").html(`<a href="#" onclick="return deleteExpense(${expense.id})" class="btn btn-info" role="button">Delete</a>`);
                $(".expense-container").append(expenseElement);
            });     
        });


function intervalConverter(number) {
    switch (number) {
        case 1:
            return "Monthly";
        case 2:
            return "Every second month";
        case 3:
            return "Quarterly";
        case 4:
            return "Every fourth month";
        case 6:
            return "Semiannually";
        case 12:
            return "Annually";
        
    }
}

function deleteExpense(id) {
    fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json'
        },
    }).then(response => {
        response.json().then(data => {
            if (response.status === 201) {    
                alert(`Expense deleted`);
                window.location.reload();
                return;
            }
        });
    });

}


