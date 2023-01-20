$(() => {
    const keys = ["departure", "destination"]
    keys.forEach(key => {
$('#'+key+'-barchart').dxChart({
    rotated: true,
   // dataSource: ,
   series: {
     //argumentField: $("input[name='"+key + "_level']:checked").val(),
     valueField: 'travel_id',
     type: 'bar',
     color: '#ffaa66',
   },
     tooltip: {
     enabled: true,
     location: 'edge',
     customizeTooltip(arg) {
       return {
         text: `${this.argumentText} : ${arg.valueText}`,
       };
     },
   },
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
   loadingIndicator: {
     enabled: true,
   },
   legend: {
     visible: false,
   },
   scrollBar: {
     visible: true,
   },
   zoomAndPan: {
     argumentAxis: "both",  // or "zoom" | "pan" | "none"
      //valueAxis: "both"      // or "zoom" | "pan" | "none"
   },
  });
  const barchartLoadData = () => {
    let dataSource = new DevExpress.data.DataSource({

      load: function () {
        let d = new $.Deferred();
        $.get('/api/v1/simple_groupby_data?key='+$("input[name='"+key + "_level']:checked").val()+'&aggkey=travel_id&aggtype=count').done(function (results) {
          let data = sortBy(results,"travel_id", "asc", "number")
          d.resolve(data)
        })
        return d.promise();
      },
    });
          $('#'+key+'-barchart').dxChart({
              dataSource: dataSource
          });
  
            dataSource.load();
            $('#'+key+'-barchart').dxChart("instance").option("series.argumentField", $("input[name='"+key + "_level']:checked").val()); 
   };
    // init
    barchartLoadData() 
     // sidebar filters
     $("#selection-apply-filters").on("click", barchartLoadData)
     // radio button on geographical level
     $(`input[name=${key}_level]`).change(function () {
      barchartLoadData() ;
    })

 } )
});