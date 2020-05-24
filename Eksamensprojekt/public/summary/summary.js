const href = window.location.href.split("/");
const id = href.pop();


fetch(`/api/summaries/${id}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        data.response.expenses.map((expense) => {
            console.log(expense);
            let detailElement =  $(".detail").first().clone();
            $(detailElement).find("#name").html(expense.name); 
            $(detailElement).find("#amount").html(expense.amount);
            $(".detail-container").append(detailElement);
        });

        $("#total").append(`<b>Total</b>: ${data.response.total}`);
        $("#per-person").append(`<b>Per person</b>: ${data.response.total / data.response.user.memberCount}`);
    });