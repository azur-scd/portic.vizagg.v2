$(() => {
    const mapping = {"percent_tonnage": "Proportion de tonnage transporté", "percent_travels": "Part des flux totaux", "percent_unknown_products": "Part des flux sans produits"}
    const options = {
        scale: {
           startValue: 0,
           endValue: 100,
           tickInterval: 50,
           minorTick: {
             visible: true,
           },
           label: {
             customizeText(arg) {
               return `${arg.valueText} %`;
             },
              font: {
              color: '#ff950c',
            },
           },
         },
            tooltip: {
          enabled: true,
          customizeTooltip(arg) {
            return {
              text: `${arg.valueText}%`,
            };
          },
        },
        export: {
            enabled: true,
          },
       };
      
       for (let item in mapping) {
        $('#'+item+'-linear-gauge').dxLinearGauge($.extend(true, {}, options,{
            //value: data[item],
            valueIndicator: {
              type: 'textCloud',
              color: '#734F96',
            },
            title: {
                text: mapping[item],
                font: { size: 28 },
              },
          })).dxLinearGauge('instance')
       }

    const linearGaugeLoadData = () => {
        $.getJSON( "http://localhost:5000/api/v1/stats_filtered_data")
         .done(function( data ) {
            for (let item in mapping) {
                $('#'+item+'-linear-gauge').dxLinearGauge("instance").option("value", data[item])
            } 
         })
       }

  // init
  linearGaugeLoadData()
  // sidebar filters
  $("#selection-apply-filters").on("click",linearGaugeLoadData)
    })