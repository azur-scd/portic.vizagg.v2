const highcharts_streamgraph = (productLevelKey) => {
    $.getJSON( "/api/v1/products_crosstab_data?key=" + productLevelKey)
    .done(function( data ) {
            let productsData = data.products     
            let xSeriesData = ['1','2','3','4','5','6','7','8','9','10','11','12']
     Highcharts.chart("highcharts-streamgraph-products", {

         chart: {
             type: 'streamgraph',
             marginBottom: 30,
             zoomType: 'x'
         },
         title: {
             floating: true,
             align: 'left',
            // text: 'Cargaisons'
         },
         subtitle: {
             floating: true,
             align: 'left',
             y: 30,
             text: "Se reporter à la gauge mesurant le % de flux sans produits connus"
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

 // init
 highcharts_streamgraph($("input[name='products_level']:checked").val())
 
 // sidebar filters
 $("#selection-apply-filters").click(function(){
    highcharts_streamgraph($("input[name='products_level']:checked").val())
  });

   /* ---- inline radio buttons on sankey chart ---*/
   $("input[name='products_level']").change(function(){
    highcharts_streamgraph($("input[name='products_level']:checked").val())
  });