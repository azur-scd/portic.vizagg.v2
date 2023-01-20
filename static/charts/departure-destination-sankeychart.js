$(() => {
    $('#departure-destination-sankeychart').dxSankey({
        //dataSource: data,
        sourceField: 'source',
        targetField: 'target',
        weightField: 'weight',
        node: {
          width: 8,
          padding: 5,
        },
        link: {
          colorMode: 'gradient',
        },
        tooltip: {
          enabled: true,
          customizeLinkTooltip(info) {
            return {
              html:
                            "<b>From:</b> "+info.source + "<br/><b>To:</b> " + info.target + "<br/>" +
                            "<b>Weight:</b> "+ info.weight,
            };
          },
        },
      });
});

const sankeyChartLoadData = () => {
    let dataSource = new DevExpress.data.DataSource({
      load: function () {
        let d = new $.Deferred();
        $.get('/api/v1/simple_groupby_data?key=' + $("input[name='sankey_departure_level']:checked").val() + '&key=' + $("input[name='sankey_destination_level']:checked").val() + '&aggkey=travel_id&aggtype=count').done(function (results) {
         let data = results.map(item =>
                  ({"source" : item[$("input[name='sankey_departure_level']:checked").val()],
                  "target" : item[$("input[name='sankey_destination_level']:checked").val()].concat(" "),
                  "weight" : item["travel_id"]})
                  )
          d.resolve(data)
        })
        return d.promise();
      },
    });
          $("#departure-destination-sankeychart").dxSankey({
              dataSource: dataSource
          });
  
            dataSource.load();
   }

   // init
   sankeyChartLoadData()
    // sidebar filters
    $("#selection-apply-filters").on("click", sankeyChartLoadData)
    /* ---- inline radio buttons on sankey chart ---*/
  $("input[name=sankey_departure_level],input[name=sankey_destination_level]").on("change",sankeyChartLoadData)
