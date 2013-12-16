
var ds = new Miso.Dataset({
    importer: Miso.Dataset.Importers.GoogleSpreadsheet,
    parser: Miso.Dataset.Parsers.GoogleSpreadsheet,
    key: "0AuSbp2v6xOkPdGw0ampRdjF4Tl9lNm41eFdqOWtZQ1E",
    worksheet: "1"
});
ds.fetch({
    success : function() {
        var data = [];
        this.countBy("Location").each(function(row){ 
            data.push({name: row.Location, value: +row.count}); 
        });

        var width = 800;
        var barHeight = 20;

        var x = d3.scale.linear().range([0, width]);
        x.domain([0, d3.max(data, function(d) { 
            return d.value; 
        })]);

        var chart = d3.select(".chart")
            .attr("width", width)
            .attr("height", barHeight * data.length);

        var bar = chart.selectAll("g")
            .data(data)
            .enter().append("g")
            .attr("transform", function(d, i) { 
                return "translate(0," + i * barHeight + ")"; 
            });

        bar.append('text')
            .text(function(d){ return d.name; })
            .attr('text-anchor', 'end')
            .attr('height', 25)
            .attr('class', 'nameLabel')
            .attr("dy", ".35em")
            .attr('x', 190)
            .attr("y", barHeight / 2);

        bar.append("rect")
            .attr("width", function(d) { return x(d.value); })
            .attr("height", barHeight - 1)
            .attr("x", 200);

        bar.append("text")
            .attr("x", function(d) { return x(d.value) + 200 - 3; })
            .attr("y", barHeight / 2)
            .attr('class', 'valueLabel')
            .attr("dy", ".35em")
            .text(function(d) { return d.value; });

    },
    error : function() {
        // Data loading failed
    }
});
