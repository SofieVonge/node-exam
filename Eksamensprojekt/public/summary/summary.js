fetch("/summaries/")
        .then(response => response.json())
        .then(data => {
            data.response.map((expense) => {
                let detailElement =  $(".detail").first().clone();
                $(detailElement).find("#name").html(expense.name); 
                $(detailElement).find("#amount").html(expense.amount);
                $(".detail-container").append(detailElement);
            });
            
            $("#total").html(expense.total);
            $("#per-person").html(); //total divideret med antal i household???   
        });