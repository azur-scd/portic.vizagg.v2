$(() => {
    const mapping = { "percent_travels": "Part des flux totaux", "percent_tonnage": "Proportion de tonnage transporté","percent_unknown_products": "Part des flux sans produits"}

let gaugeOptions = {
    chart: {
        type: 'solidgauge'
    },

    title: null,

    pane: {
        center: ['50%', '85%'],
        size: '140%',
        startAngle: -90,
        endAngle: 90,
        background: {
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc'
        }
    },

    exporting: {
        enabled: false
    },

    tooltip: {
        enabled: false
    },

    // the value axis
    yAxis: {
        stops: [
            [0.1, '#DF5353'], // red
            [0.5, '#DDDF0D'], // yellow
            [0.9, '#55BF3B'] // green
        ],
        lineWidth: 0,
        tickWidth: 0,
        minorTickInterval: null,
        tickAmount: 2,
        title: {
            y: -70
        },
        labels: {
            y: 16
        }
    },

    plotOptions: {
        solidgauge: {
            dataLabels: {
                y: 5,
                borderWidth: 0,
                useHTML: true
            }
        }
    }
};

const highcharts_gauges = () => {
    $.getJSON( "http://localhost:5000/api/v1/stats_filtered_data")
    .done(function( data ) {
        for (const [key, value] of Object.entries(mapping)) {
            $("#label-" + key).append(value)
            Highcharts.chart("data-abstract-gauge-" + key, Highcharts.merge(gaugeOptions, {
                yAxis: {
                    min: 0,
                    max: 100,
                    title: {
                       // text: value
                    }
                },
            
                credits: {
                    enabled: false
                },
            
                series: [{
                    name: value,
                    data: [data[key]],
                    dataLabels: {
                        format:
                            '<div style="text-align:center">' +
                            '<span style="font-size:25px">{y}</span><br/>' +
                            '<span style="font-size:12px;opacity:0.4">%</span>' +
                            '</div>'
                    },
                    tooltip: {
                        valueSuffix: ' %'
                    }
                }]
            
            })); 
        }

    })
}


    // init
    highcharts_gauges()
    // sidebar filters
  $("#selection-apply-filters").on("click",highcharts_gauges)

})