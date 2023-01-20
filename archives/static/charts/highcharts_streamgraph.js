function highcharts_streamgraph(div_id) {
    $.getJSON( "/api/v1/products_crosstab_data")
    .done(function( data ) {
            let productsData = data.products     
            let xSeriesData = ['1','2','3','4','5','6','7','8','9','10','11','12']
     Highcharts.chart(div_id, {

         chart: {
             type: 'streamgraph',
             marginBottom: 30,
             zoomType: 'x'
         },
         title: {
             floating: true,
             align: 'left',
             text: 'Cargaisonss'
         },
         subtitle: {
             floating: true,
             align: 'left',
             y: 30,
             text: "x % des trajets n'ont pas le champ renseigné"
         },
         boost: {
             useGPUTranslations: true
         },
         xAxis: {
             maxPadding: 0,
             type: 'category',
             crosshair: true,
             categories: xSeriesData,
             labels: {
                 align: 'left',
                 reserveSpace: false,
                 rotation: 270
             },
             lineWidth: 0,
             margin: 20,
             tickWidth: 0
         },
         yAxis: {
             title: {
                 text: 'nb de trajets'
             },
             visible: false,
         startOnTick: false,
         endOnTick: false          
         },
     
         legend: {
             enabled: false
         },
         plotOptions: {
             series: {
                 label: {
                     minFontSize: 5,
                     maxFontSize: 15,
                     style: {
                         color: 'rgba(255,255,255,0.75)'
                     }
                 },
                 accessibility: {
                     exposeAsGroupOnly: true
                 }
             }
         },
 
         series: productsData.map(item => ({
             name: item,
             boostThreshold: 1,
             turboThreshold: 1,
             data: getValuesByKey(data.data, item, false),
         }))
     })
    })
 }
 