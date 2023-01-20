function echarts_depdest_linerace(querystring,key,key_agg, key_sort, div_id) {

        $.getJSON( "/api/v1/simple_groupby_data?" + querystring)
          .done(function( data ) {
    const chartDom = document.getElementById(div_id);
    const myChart = echarts.init(chartDom);  

    let result = sortBy(data, key_sort, "asc", "string")
    const categories = getValuesByKey(data, key, true)
    const datasetWithFilters = [];
    const seriesList = [];
    echarts.util.each(categories, function (cat) {
      let datasetId = 'dataset_' + cat;
      datasetWithFilters.push({
        id: datasetId,
        fromDatasetId: 'dataset_raw',
        transform: {
          type: 'filter',
          config: {
            and: [
              { dimension: key, '=': cat }
            ]
          }
        }
      });
      seriesList.push({
        type: 'line',
        datasetId: datasetId,
        showSymbol: false,
        name: cat,
        endLabel: {
          show: true,
          formatter: function (params) {
            //return params["value"][key] + ': ' + params["value"]["count"];
            
            return cat;
          }
        },
        labelLayout: {
          moveOverlap: 'shiftY'
        },
        emphasis: {
          focus: 'series'
        },
        encode: {
          x: key_sort,
          y: key_agg,
          label: [key, key_agg],
          itemName: key_sort,
          tooltip: [key_agg]
        }
      });
    });
    
    let option = {
      animationDuration: 20000,
      dataset: [
        {
          id: 'dataset_raw',
          source: result
        },
        ...datasetWithFilters
      ],
      tooltip: {
        order: 'valueDesc',
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        nameLocation: 'middle'
      },
      yAxis: {
        name: key_agg
      },
      grid: {
        right: 140
      },
      series: seriesList
    };
    myChart.setOption(option);
})
  }