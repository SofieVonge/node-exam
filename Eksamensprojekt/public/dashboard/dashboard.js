fetch("/api/summaries")
        .then(response => response.json())
        .then(data => {
            data.response.map((summary) => {
                let summaryElement =  $(".summary").first().clone();
                $(summaryElement).find("#total").html(summary.total / summary.user.memberCount);
                $(summaryElement).find("#date").html(summary.paymentDate);
                $(summaryElement).find("#link").html(`<a href="/summaries/detail/${summary.id}" class="btn btn-info" role="button">Show details</a>`);
                $(".summary-container").append(summaryElement);
            });     
        });