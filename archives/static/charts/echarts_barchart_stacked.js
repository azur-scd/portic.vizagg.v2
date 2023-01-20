function echarts_barchart_stacked_uncertainity(key) {
  $.getJSON( "/api/v1/uncertainity_crosstab_data/" + key)
  .done(function( data ) {
            let dataset = {}
            const container = document.getElementById("echarts-" + key + "-container")
            const myChart = echarts.init(document.getElementById("echarts-" + key + "-barchart"));
           // new ResizeObserver(() => myChart.resize()).observe(container);

            let dimensions = [key, '0', '-1', '-2', '-3', '-4', '-5']
            let seriesEntry = dimensions.slice(1)
            dataset["dimensions"] = dimensions
            dataset["source"] = data

            let option = {
                toolbox: {
                  feature: {
                    dataZoom: {
                      xAxisIndex: 'none'
                    },
                    restore: {},
                    saveAsImage: {}
                  }
                },
                yAxis: {
                  type: 'category',
                  data: getValuesByKey(data, key, false)
                },
                xAxis: { type: 'value' },
                series: seriesEntry.map(item => ({
                  type: 'bar',
                  stack: 'stack',
                  name: item,
                  data: getValuesByKey(data, item, false),
                })),
                dataZoom: [
                  {
                    "id": "dataZoomX",
                    "type": "slider",
                    "xAxisIndex": [0],
                    "filterMode": "filter",
                  },
                  {
                    "id": "dataZoomY",
                    "type": "slider",
                    "yAxisIndex": [0],
                    "filterMode": "filter",
                    "showDataShadow": true,
                  }
                ]
              };
              option && myChart.setOption(option);
        })
}