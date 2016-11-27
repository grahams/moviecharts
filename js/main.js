
var theatreChart = null;
var formatChart = null;
var firstChart = null;
var genreChart = null;
var monthChart = null;

var ds = null;
var year = null;
var retry = false;

$(document).ready(function() {
    var yearQuery = URI(window.location.href).search(true).year;
    year = mcYear;

    if(yearQuery) {
        year = yearQuery.replace("/","");
    }

    ds = createDataset('/data/' + year + '.json');

    requestData();
});

var createDataset = function(url) {
    dataset = new Miso.Dataset({
        url: url, 
        columns : [
            { 
                name : "movieTitle", 
                type : "string", 
                before : function(v) {
                    return decodeURIComponent(v);
                }
            },
            {
                name : "viewingDate", 
                type : "string", 
                before : function(v) {
                    return decodeURIComponent(v);
                }
            },
            {
                name : "movieURL", 
                type : "string", 
                before : function(v) {
                    return decodeURIComponent(v);
                }
            },
            {
                name : "viewFormat", 
                type : "string", 
                before : function(v) {
                    return decodeURIComponent(v);
                }
            },
            {
                name : "viewLocation", 
                type : "string", 
                before : function(v) {
                    return decodeURIComponent(v);
                }
            },
            {
                name : "movieGenre", 
                type : "string", 
                before : function(v) {
                    return decodeURIComponent(v);
                }
            },
            {
                name : "movieReview", 
                type : "string", 
                before : function(v) {
                    return decodeURIComponent(v);
                }
            }
        ]
    });

    return dataset;
};

var requestData = function() {
    createFirstViewingChart();
    createTheatreChart();
    createFormatChart();
    createGenreChart();
    createMonthChart();

    $('#theatreControlButton').click(function() {
        var data  = theatreChart.series[0].data;
        if(data.length) {
            for(var x = 0; x < data.length; x += 1) {
                if(data[x].name === "Home") {
                    var current = data[x].visible;
                    data[x].setVisible(!current);
                    break;
                }
            }
        }
    });

    ds.fetch({
        success : function() {
            this.sort(function(rowA, rowB) {
                var timeA = new Date(rowA.viewingDate).getTime();
                var timeB = new Date(rowB.viewingDate).getTime();

                if (timeA < timeB) {
                    return -1;
                }
                if (timeA > timeB) {
                    return 1;
                }

                return 0;
            });

            if($("#textStats").length > 0) {
                prepareTextData(this);
            }
            if($("#theatreContainer").length > 0) {
                prepareTheatreData(this);
            }
            if($("#formatContainer").length > 0) {
                prepareFormatData(this);
            }
            if($("#genreContainer").length > 0) {
                prepareGenreData(this);
            }
            if($("#firstViewingContainer").length > 0) {
                prepareFirstViewingData(this);
            }
            if($("#monthContainer").length > 0) {
                prepareMonthData(this);
            }
            if($("#movieListDiv").length > 0) {
                prepareListData(this);
            }
        },
        error : function() {
            if(!retry) {
                retry = true;
                ds = createDataset("/local/moviething/?year=" + year);
                requestData();
            }
        }
    });
};

var countMonth = function(data, month) {
    var rows = data.where({
        // copy over the one column
        columns: ['Date'],
        // and only where the values are > 1
        rows: function(row) {
            return moment(row.viewingDate).month() === month;
        }
    });
    
    return rows.length;
};

var createPieChart = function(container, title, seriesName) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: container,
            height: 600,
            type: 'pie'
        },
        credits: {
            enabled: false
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
        tooltip: {
            formatter: function() {
                var s = '<b>'+ this.key +'</b>';
                var chart = this.series.chart;
                
                s += '<br/>'+ this.point.series.name +': '+
                    this.point.y;

                // List the individual components of the 'Other' category
                // in the tooltip (if any)
                if(this.key === "Other" && chart.otherNames) {
                    s = '<b>'+ this.key +'</b>';

                    for(var x = 0; x < chart.otherNames.length; x += 1) {
                        s += '<br/>'+ chart.otherNames[x] +': '+
                            chart.otherValues[x];
                    }
                }
                
                return s;
            },
            shared: true
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
    if($("#firstViewingContainer").length > 0) {
        firstChart = createPieChart("firstViewingContainer", "First Viewing", "Viewings");
    }
};

var createTheatreChart = function() {
    if($("#theatreContainer").length > 0) {
        theatreChart = 
            createPieChart("theatreContainer", "Theatre Frequency", "Visits");
    }
};

var createFormatChart = function() {
    if($("#formatContainer").length > 0) {
        formatChart = 
            createPieChart("formatContainer", "Format", "Viewings");
    }
};

var createGenreChart = function() {
    if($("#genreContainer").length > 0) {
        genreChart = createPieChart("genreContainer", "Genres", "Viewings");
    }
};

var createMonthChart = function () {
    if($("#monthContainer").length > 0) {
        monthChart = new Highcharts.Chart({
            chart: {
                renderTo: "monthContainer",
                type: 'bar'
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
    }
};

var prepareTextData = function(data) {
    var shortCount = 0;

    data.each(function(row){ 
        if(row.movieGenre === "Short") {
            shortCount += 1;
        }
    });

    $("#textStatsTotal").html(data.length);
    $("#textStatsFeatures").html(data.length - shortCount);
    $("#textStatsShorts").html(shortCount);
};

var prepareTheatreData = function(data) {
    var theatreCategories = [];

    // Folds theatres below a number of visits into a 'Other' category
    var theatreOtherThreshold = 3;
    var theatreOtherNames = [];
    var theatreOtherValues = [];
    var theatreOtherCount = 0;

    // Folds several 'locations' into 'Home'
    var theatreCollapseTarget = "Home";
    var theatreCollapseCount = 0;
    var theatreCollapseNames = {"Home": true,
                                "Camp Awesome": true,
                                "Rochester": true,
                                "Hopatcong": true,
                                "Michigan": true,
                                "jwm's house": true,
                                "Virginia": true,
                                "Gualala": true,
                                "Puerto Rico": true,
                                "Airplane": true,
                                "Hampton Beach": true};

    // Pull out the location data
    data.countBy("viewLocation").each(function(row){ 
        // add the point
        if(theatreCollapseNames[row.viewLocation] === true) {
            theatreCollapseCount += +row.count;
        }
        else if(row.count > theatreOtherThreshold) {
            theatreChart.series[0].addPoint({
                name: row.viewLocation,
                y: +row.count
            }, true);
            theatreCategories.push(row.viewLocation);
        }
        else {
            theatreOtherCount += row.count;
            theatreOtherNames.push(row.viewLocation);
            theatreOtherValues.push(row.count);
        }
    });

    if(theatreCollapseCount > 0) {
        theatreChart.series[0].addPoint({
            name: theatreCollapseTarget,
            y: theatreCollapseCount
        }, true);
        theatreCategories.push(theatreCollapseTarget);
    }

    if(theatreOtherCount > 0) {
        theatreChart.series[0].addPoint({
            name: "Other",
            y: theatreOtherCount
        }, true);
        theatreCategories.push("Other");
    }

    theatreChart.axes[0].setCategories(theatreCategories);
    theatreChart.otherNames = theatreOtherNames;
    theatreChart.otherValues = theatreOtherValues;
};

var prepareFormatData = function(data) {
    var formatThreshold = 3;
    var formatOtherCount = 0;
    var formatCategories = [];

    var formatOtherNames = [];
    var formatOtherValues = [];

    // Pull out the location data
    data.countBy("viewFormat").each(function(row){ 
        // add the point
        if(row.count > formatThreshold) {
            formatChart.series[0].addPoint({
                name: row.viewFormat,
                y: +row.count
            }, true);
            formatCategories.push(row.viewFormat);
        }
        else {
            formatOtherCount += row.count;
            formatOtherNames.push(row.viewFormat);
            formatOtherValues.push(row.count);
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
    formatChart.otherNames = formatOtherNames;
    formatChart.otherValues = formatOtherValues;
};

var prepareGenreData = function(data) {
    var genreThreshold = 3;
    var genreOtherCount = 0;

    var genreOtherNames = [];
    var genreOtherValues = [];

    var genreCategories = [];
    // Pull out the genre data
    data.countBy("movieGenre").each(function(row){ 
        if(row.count > genreThreshold) {
            genreChart.series[0].addPoint({
                name: row.movieGenre,
                y: +row.count
            }, true);
            genreCategories.push(row.movieGenre);
        }
        else {
            genreOtherCount += row.count;
            genreOtherNames.push(row.movieGenre);
            genreOtherValues.push(row.count);
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
    genreChart.otherNames = genreOtherNames;
    genreChart.otherValues = genreOtherValues;

};

var prepareFirstViewingData = function(data) {
    // Pull out the first/repeat viewing data
    data.countBy("firstViewing").each(function(row) {
        if(row.firstViewing === 1) {
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
        var link = $("<a />", { 'href': row.movieURL, 
                                'text': row.movieTitle, 
                                'title': row.movieReview  });

        if(row.firstViewing !== 1) {
            link.css("font-style", "italic");
        }

        $("#movieList").append($("<li />").append(link));
    });
};
