function highcharts_dependency_wheel(querystring, div_id) {
    // /api/v1/simple_groupby_data?key=departure&key=destination&aggkey=travel_id&aggtype=count
    $.getJSON( "/api/v1/simple_groupby_data?" + querystring)
    .done(function( data ) {
        let result = toTable(data)
        console.log(result)
        Highcharts.chart(div_id, {

            title: {
                text: 'Flux agrégés entre provinces'
            },
        
            accessibility: {
                point: {
                    valueDescriptionFormat: '{index}. From {point.from} to {point.to}: {point.weight}.'
                }
            },
            boost: {
                useGPUTranslations: true
            },
            series: [{
                keys: ['from', 'to', 'weight'],
                data: result.slice(1),
                boostThreshold: 1,
                turboThreshold: 1,
                type: 'dependencywheel',
                name: 'Nombre de trajets',
                dataLabels: {
                    color: '#333',
                    style: {
                        textOutline: 'none'
                    },
                    textPath: {
                        enabled: true
                    },
                    distance: 10
                },
                size: '100%'
            }]
        
        });
    })
}
