$(() => {
    const keys = ["departure", "destination"]
    keys.forEach(key => {
$('#'+key+'-stacked-barchart').dxChart({
    rotated: true,
    //dataSource,
    commonSeriesSettings: {
      argumentField: key,
      type: 'stackedBar',
    },
    series: [
      { valueField: '0', name: '0' },
      { valueField: '-1', name: '-1' },
      { valueField: '-2', name: '-2' },
	  { valueField: '-3', name: '-3' },
      { valueField: '-4', name: '-4' },
      { valueField: '-5', name: '-5' },
    ],
    valueAxis: {
     title: {
       text: 'nb de flux',
       font: {
         color: '#ff950c',
       },
     },
     label: {
       font: {
         color: '#ff950c',
       },
     },
      position: 'right',
    },
	  argumentAxis: {
     title: {
       text: 'Nom',
       font: {
         color: '#696969',
       },
     },
     label: {
       font: {
         color: '#696969',
       },
     },
     visualRange: {
       startValue: 1,
       endValue: 10,
     },
   },
    export: {
      enabled: true,
    },
    tooltip: {
      enabled: true,
      location: 'edge',
      customizeTooltip(arg) {
        return {
          text: `Incertitude ${arg.seriesName} : ${arg.valueText} flux`,
        };
      },
    },
	 loadingIndicator: {
     enabled: true,
   },
    legend: {
      verticalAlignment: 'bottom',
      horizontalAlignment: 'center',
      itemTextPosition: 'top',
    },
   scrollBar: {
     visible: true,
   },
   zoomAndPan: {
     argumentAxis: "both",  // or "zoom" | "pan" | "none"
      //valueAxis: "both"      // or "zoom" | "pan" | "none"
   },
  });
  const stackedBarchartLoadData = () => {
    let dataSource = new DevExpress.data.DataSource({

      load: function () {
        let d = new $.Deferred();
        $.get('/api/v1/uncertainity_crosstab_data/' + key).done(function (results) {
        let data = sortBy(results,"total", "asc", "number")
          d.resolve(data)
        })
        return d.promise();
      },
    });
          $('#'+key+'-stacked-barchart').dxChart({
              dataSource: dataSource
          });
  
            dataSource.load();
   };
    // init
    stackedBarchartLoadData() 
     // sidebra filters
     $("#selection-apply-filters").on("click", stackedBarchartLoadData)

 } )
});