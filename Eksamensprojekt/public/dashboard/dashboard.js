fetch("/api/summaries")
        .then(response => response.json())
        .then(data => {
            data.response.map((summary) => {
                let summaryElement =  $(".summary").first().clone();
                $(summaryElement).find("#total").html(summary.total); //total skal på en eller anden måde divideres med antal i household??
                $(summaryElement).find("#date").html(summary.paymentDate);
                $(summaryElement).find("#link").html(`<a href="/summaries/${summary.id}" class="btn btn-info" role="button">Show details</a>`);
                $(".summary-container").append(summaryElement);
            });     
        });