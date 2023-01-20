function highcharts_arc_diagram(querystring, div_id) {
    // /api/v1/simple_groupby_data?key=departure&key=destination&aggkey=travel_id&aggtype=count
    $.getJSON( "/api/v1/simple_groupby_data?" + querystring)
    .done(function( data ) {
    let result = toTable(data)
    Highcharts.chart(div_id, {
        /*chart: {
            inverted: true
        },*/
        title: {
            text: 'Flux entrants et sortants entre ports'
        },
        accessibility: {
            description: '',
            point: {
                valueDescriptionFormat: 'Départs de {point.from} vers {point.to}.'
            }
        },
        plotOptions: {
            marker: {
                radius: 4
            }
        },
        boost: {
            useGPUTranslations: true
        },
        series: [{
            keys: ['from', 'to', 'weight'],
            centerPos: '50%',
            type: 'arcdiagram',
            name: 'Connections entre ports',
            linkWeight: 1,
            centeredLinks: true,
            dataLabels: {
                align: 'right',
                x: -20,
                y: -2,
                color: '#333333',
                overflow: 'allow',
                padding: 0
            },
            offset: '60%',
            nodes: [{
                offsetVertical: '10%'
            }],
            data: result.slice(1)
           // data: logarithmicCol(result.slice(1),0)
        }]

    });
})
}

//init
highcharts_arc_diagram("key=departure&key=destination&aggkey=travel_id&aggtype=count", "highcharts-arcdiagram-departure-destination")