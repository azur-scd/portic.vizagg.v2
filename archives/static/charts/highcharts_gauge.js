function highcharts_gauge(div_id) {
    // /api/v1/simple_groupby_data?key=departure&key=destination&aggkey=travel_id&aggtype=count
    $.getJSON( "/api/v1/stats_filtered_data")
    .done(function( data ) {
        Highcharts.chart(div_id, {

            chart: {
                type: 'solidgauge',
                height: '100%',
                /*events: {
                    render: renderIcons
                }*/
            },
        
            title: {
                text: 'Data Abstract',
                style: {
                    fontSize: '24px'
                }
            },
        
            tooltip: {
                borderWidth: 0,
                backgroundColor: 'none',
                shadow: false,
                style: {
                    fontSize: '16px'
                },
                valueSuffix: '%',
                pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}</span>',
                positioner: function (labelWidth) {
                    return {
                        x: (this.chart.chartWidth - labelWidth) / 2,
                        y: (this.chart.plotHeight / 2) + 15
                    };
                }
            },
        
            pane: {
                startAngle: 0,
                endAngle: 360,
                background: [{ // Track for Move
                    outerRadius: '112%',
                    innerRadius: '88%',
                    backgroundColor: Highcharts.color(Highcharts.getOptions().colors[0])
                        .setOpacity(0.3)
                        .get(),
                    borderWidth: 0
                }, { // Track for Exercise
                    outerRadius: '87%',
                    innerRadius: '63%',
                    backgroundColor: Highcharts.color(Highcharts.getOptions().colors[1])
                        .setOpacity(0.3)
                        .get(),
                    borderWidth: 0
                }, { // Track for Stand
                    outerRadius: '62%',
                    innerRadius: '38%',
                    backgroundColor: Highcharts.color(Highcharts.getOptions().colors[2])
                        .setOpacity(0.3)
                        .get(),
                    borderWidth: 0
                }]
            },
        
            yAxis: {
                min: 0,
                max: 100,
                lineWidth: 0,
                tickPositions: []
            },
        
            plotOptions: {
                solidgauge: {
                    dataLabels: {
                        enabled: false
                    },
                    linecap: 'round',
                    stickyTracking: false,
                    rounded: true
                }
            },
        
            series: [{
                name: 'Pourcentage des flux',
                data: [{
                    color: Highcharts.getOptions().colors[2],
                    radius: '112%',
                    innerRadius: '88%',
                    y: data.percent_travels
                }]
            }, {
                name: 'Pourcentage du tonnage total',
                data: [{
                    color: Highcharts.getOptions().colors[0],
                    radius: '87%',
                    innerRadius: '63%',
                    y: data.percent_tonnage
                }]
            }, {
                name: 'Proportion de flux sans cargaison connue',
                data: [{
                    color: Highcharts.getOptions().colors[1],
                    radius: '62%',
                    innerRadius: '38%',
                    y: data.percent_unknown_products
                }]
            }]
        });
    })
}