
var theatreChart = null;
var formatChart = null;
var firstChart = null;
var genreChart = null;
var monthChart = null;

var ds = new Miso.Dataset({
    importer: Miso.Dataset.Importers.GoogleSpreadsheet,
    parser: Miso.Dataset.Parsers.GoogleSpreadsheet,
    key: "0AuSbp2v6xOkPdGw0ampRdjF4Tl9lNm41eFdqOWtZQ1E",
    fast: true,
    sheetName: "2013"
});

var requestData = function() {
    createFirstViewingChart();
    createTheatreChart();
    createFormatChart();
    createGenreChart();
    createMonthChart();

    ds.fetch({
        success : function() {
            prepareTheatreData(this);
            prepareFormatData(this);
            prepareGenreData(this);
            prepareFirstViewingData(this);
            prepareMonthData(this);
            prepareListData(this);
        },
        error : function() {
            // Data loading failed
        }
    });
};

var countMonth = function(data, month) {
    var rows = data.where({
        // copy over the one column
        columns: ['Date'],
        // and only where the values are > 1
        rows: function(row) {
            return moment(row.Date).month() === month;
        }
    });
    
    return rows.length;
};

$(document).ready(function() {
    requestData();
});

var createPieChart = function(container, title, seriesName) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: container,
            height: 600,
            marginBottom: 150,
            spacingBottom: 200,
            type: 'pie'
        },
        title: {
            text: title
        },
        xAxis: {
        },
        yAxis: {
        },
        legend: {
            enabled: false,
            align: "center",
            itemWidth: 200,
            width: 200,
            y: 200,
            verticalAlign: "bottom"
        },
        series: [{
            name: seriesName,
            showInLegend: false,
            allowPointSelect: true,
            dataLabels: {
                enabled: true,
                format: '{point.name} - {percentage:.1f}%'
            },
            data: []
        }]
    });        

    return chart;
};

var createFirstViewingChart = function() {
    firstChart = createPieChart("firstViewingContainer", "First Viewing", "Viewings");
};

var createTheatreChart = function() {
    theatreChart = 
        createPieChart("theatreContainer", "Theatre Frequency", "Visits");
};

var createFormatChart = function() {
    formatChart = 
        createPieChart("formatContainer", "Format", "Viewings");
};

var createGenreChart = function() {
    genreChart = createPieChart("genreContainer", "Genres", "Viewings");
};

var createMonthChart = function () {
    monthChart = new Highcharts.Chart({
        chart: {
            renderTo: "monthContainer",
            type: 'line'
        },
        title: {
            text: "Movies by Month"
        },
        xAxis: {
            title: {
                text: "Month"
            }
        },
        yAxis: {
            title: {
                text: "# Movies"
            }
        },
        legend: {
            align: "right",
            itemWidth: 200,
            width: 200,
            verticalAlign: "middle"
        },
        series: [{
            name: "Movies",
            showInLegend: false,
            data: []
        }]
    });        
};

var prepareTheatreData = function(data) {
    var theatreThreshold = 4;
    var theatreOtherCount = 0;
    var theatreCategories = [];

    // Pull out the location data
    data.countBy("Location").each(function(row){ 
        // add the point
        if(row.count > theatreThreshold) {
            theatreChart.series[0].addPoint({
                name: row.Location,
                y: +row.count
            }, true);
            theatreCategories.push(row.Location);
        }
        else {
            theatreOtherCount += row.count;
        }
    });

    if(theatreOtherCount > 0) {
        theatreChart.series[0].addPoint({
            name: "Other",
            y: theatreOtherCount
        }, true);
        theatreCategories.push("Other");
    }

    theatreChart.axes[0].setCategories(theatreCategories);
};

var prepareFormatData = function(data) {
    var formatThreshold = 0;
    var formatOtherCount = 0;
    var formatCategories = [];

    // Pull out the location data
    data.countBy("Format").each(function(row){ 
        // add the point
        if(row.count > formatThreshold) {
            formatChart.series[0].addPoint({
                name: row.Format,
                y: +row.count
            }, true);
            formatCategories.push(row.Format);
        }
        else {
            formatOtherCount += row.count;
        }
    });

    if(formatOtherCount > 0) {
        formatChart.series[0].addPoint({
            name: "Other",
            y: formatOtherCount
        }, true);
        formatCategories.push("Other");
    }

    formatChart.axes[0].setCategories(formatCategories);
};

var prepareGenreData = function(data) {
    var genreThreshold = 3;
    var genreOtherCount = 0;
    var genreCategories = [];
    // Pull out the genre data
    data.countBy("Genre").each(function(row){ 
        if(row.count > genreThreshold) {
            genreChart.series[0].addPoint({
                name: row.Genre,
                y: +row.count
            }, true);
            genreCategories.push(row.Genre);
        }
        else {
            genreOtherCount += row.count;
        }
    });

    if(genreOtherCount > 0) {
        genreChart.series[0].addPoint({
            name: "Other",
            y: genreOtherCount
        }, true);
        genreCategories.push("Other");
    }

    genreChart.axes[0].setCategories(genreCategories);

};

var prepareFirstViewingData = function(data) {
    // Pull out the first/repeat viewing data
    data.countBy("First Viewing").each(function(row) {
        if(row["First Viewing"] === 'y') {
            firstChart.series[0].addPoint({
                name: "First Viewing",
                y: +row.count
            }, true);
        }
        else {
            firstChart.series[0].addPoint({
                name: "Repeat Viewing",
                y: +row.count
            }, true);
        }
    });
};

var prepareMonthData = function(data) {
    var monthCategories = [];

    for(var x = 0; x < 12; x += 1) {
        monthChart.series[0].addPoint({
            name: moment().month(x).format("MMMM"),
            y: countMonth(data, x)
        }, true);

        monthCategories.push(moment().month(x).format("MMM"));
    }

    monthChart.axes[0].setCategories(monthCategories);
};

var prepareListData = function(data) {
    data.each(function(row) {
        var link = $("<a />", { 'href': row.URL, 
                                'text': row.Title, 
                                'title': row.Review  });

        if(row["First Viewing"] !== 'y') {
            link.css("font-style", "italic");
        }

        $("#movieList").append($("<li />").append(link));
    });
};
