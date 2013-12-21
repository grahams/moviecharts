
var ds = new Miso.Dataset({
    importer: Miso.Dataset.Importers.GoogleSpreadsheet,
    parser: Miso.Dataset.Parsers.GoogleSpreadsheet,
    key: "0AuSbp2v6xOkPdGw0ampRdjF4Tl9lNm41eFdqOWtZQ1E",
    worksheet: "1"
});

ds.fetch({
    success : function() {
        var data = [];
        var categories = [];

        // Experimented with collapsing small values into an "Other"
        // category.
        var otherThreshold = 4;
        var otherCount = 0;

        this.countBy("Location").each(function(row){ 
            if(row.count > otherThreshold) {
                data.push(+row.count); 
                categories.push(row.Location);
            }
            else {
                otherCount += row.count;
            }
        });

        if(otherCount > 0) {
            data.push(otherCount); 
            categories.push("Other");
        }

        $(function () { 
            $('#container').highcharts({
                chart: {
                    type: 'bar'
                },
                title: {
                    text: 'Theatre Frequency'
                },
                xAxis: {
                    categories: categories
                },
                yAxis: {
                    title: {
                        text: 'Number of Visits'
                    }
                },
                series: [{
                    data: data,
                    name: "Visits",
                    showInLegend: false
                }]
            });
        });
    },
    error : function() {
        // Data loading failed
    }
});
