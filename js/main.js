
var ds = new Miso.Dataset({
    importer: Miso.Dataset.Importers.GoogleSpreadsheet,
    parser: Miso.Dataset.Parsers.GoogleSpreadsheet,
    key: "0AuSbp2v6xOkPdGw0ampRdjF4Tl9lNm41eFdqOWtZQ1E",
    worksheet: "1"
});
ds.fetch({
    success : function() {
        var data = [];
        this.countBy("Location").each(function(row){ data.push(row); });

        var chart = d3.selectAll('.my-chart').append('svg')
            .attr('width', 600)
            .attr('height', function(){ return data.length*25; });

        var scale = d3.scale.linear().domain([0,
            ds.countBy("Location").max("count")]).range([0,150]);

        chart.selectAll('g')
            .data(data)
            .enter()
            .append('g')
            .attr('transform', 
                function(d,i){ return "translate(0," + i*25 + ")"; });            
        chart.selectAll('g').append('text')
            .text(function(d){ return d.Location; })
            .attr('text-anchor', 'end')
            .attr('height', 25)
            .attr('x', 200)
            .attr('y', 20);

        chart.selectAll('g').append('rect')
            .attr('fill', 'blue')
            .attr('height', 23)
            .attr('width', function(d){ return scale(d.count); })
            .attr('x', 210)
            .attr('y', 2);

        chart.selectAll('g').append('text')
            .text(function(d){ return d.count; })
            .attr('height', 25)
            .attr('x', function(d){ return scale(d.count) + 215; })
            .attr('y', 20);
    },
    error : function() {
        // Data loading failed
    }
});
