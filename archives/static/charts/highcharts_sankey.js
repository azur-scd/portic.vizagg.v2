function highcharts_sankey(querystring, div_id) {
    // /api/v1/simple_groupby_data?key=departure&key=destination&aggkey=travel_id&aggtype=count
    $.getJSON("/api/v1/simple_groupby_data?" + querystring)
        .done(function (data) {
            let result = toTable(data)
            // astuce pour avoir un sankey chart à 2 colonnes
            let sankeyResult = result.map((data) =>
                [data[0],
                 data[1].concat(" "),
                data[2]
                ]
            )
            Highcharts.chart(div_id, {

                title: {
                    text: 'Flux agrégés entre provinces'
                },
                accessibility: {
                    point: {
                        valueDescriptionFormat: '{index}. {point.from} to {point.to}, {point.weight}.'
                    }
                },
                boost: {
                    useGPUTranslations: true
                },
                series: [{
                    keys: ['from', 'to', 'weight'],
                    data: sankeyResult.slice(1),
                    type: 'sankey',
                    name: 'Nombre de trajets',
                    boostThreshold: 1,
                    turboThreshold: 1,
                }]

            });

        })
}