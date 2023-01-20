function highcharts_network(querystring, div_id) {
    // /api/v1/simple_groupby_data?key=departure&key=destination&aggkey=travel_id&aggtype=count
    $.getJSON( "/api/v1/simple_groupby_data?" + querystring)
    .done(function( data ) {
        let result = toTable(data)
        Highcharts.chart(div_id, {
            chart: {
                type: 'networkgraph',
                height: '100%'
            },
            title: {
                text: 'Flux entre amirautés'
            },
            subtitle: {
                text: ''
            },
            plotOptions: {
                networkgraph: {
                    keys: ['from', 'to'],
                    layoutAlgorithm: {
                        enableSimulation: true,
                        friction: -0.9
                    }
                }
            },
            series: [{
                accessibility: {
                    enabled: false
                },
                dataLabels: {
                    enabled: true,
                    linkFormat: ''
                },
                id: 'lang-tree',
                data: result.slice(1, -1)
            }]
        
        });
    })
}


//init
highcharts_network("key=departure_admiralty&key=destination_admiralty&aggkey=travel_id&aggtype=count", "highcharts-network-departure-destination")