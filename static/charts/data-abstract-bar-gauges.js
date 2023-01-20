$(() => {
    $('#data-abstract-bar-gauge').dxBarGauge({
        startValue: 0,
        endValue: 100,
       // values: [47.27, 65.32, 84.59, 71.86],
        label: {
          indent: 30,
          format: {
            type: 'fixedPoint',
            precision: 1,
          },
          customizeText(arg) {
            return `${arg.valueText} %`;
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
        palette: 'ocean',
        title: {
          text: "Statistiques",
          font: {
            size: 28,
          },
        },
        legend: {
            visible: true,
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            customizeText(arg) {
              return arg.item + ":" + arg.text;
            },
        }
      }).dxBarGauge("instance")

      const barGaugeLoadData = () => {
        $.getJSON( "http://localhost:5000/api/v1/stats_filtered_data")
         .done(function( data ) {
                $('#data-abstract-bar-gauge').dxBarGauge("instance").option("values", [data["percent_travels"], data["percent_tonnage"], data["percent_unknown_products"]])
         })
       }

    // init
    barGaugeLoadData()
    // sidebar filters
  $("#selection-apply-filters").on("click",barGaugeLoadData)
})