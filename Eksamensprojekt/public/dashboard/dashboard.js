fetch("/api/summaries")
        .then(response => response.json())
        .then(data => {
            data.response.map((summary) => {
                const paymentDate = new Date(summary.paymentDate);
                let summaryElement =  $(".summary").first().clone();
                $(summaryElement).find("#total").html(summary.total / summary.household.memberCount);
                $(summaryElement).find("#date").html(paymentDate.getDay() + "/" + paymentDate.getMonth() + "/" + paymentDate.getFullYear());
                $(summaryElement).find("#link").html(`<a href="/summaries/detail/${summary.id}" class="btn btn-info" role="button">Show details</a>`);
                $(".summary-container").append(summaryElement);
            });     
        });