const keys = ["departure", "destination"]

const updateCharts = () => {
  keys.forEach(key => {
    echarts_barchart_stacked_uncertainity(key);
    echarts_depdest_linerace("key=" + $("input[name='linerace_" + key + "_level']:checked").val() + "&key=outdate_fixed_datetime_month_number&aggkey=travel_id&aggtype=count", $("input[name='linerace_" + key + "_level']:checked").val(), "travel_id", "outdate_fixed_datetime_month_number", "echarts-" + key + "-linerace")
  }
  );
  /* arc diagram
  highcharts_arc_diagram("key=departure&key=destination&aggkey=travel_id&aggtype=count", "highcharts-arcdiagram-departure-destination")*/
  // gauge
  highcharts_gauge("highcharts-gauge")
  // sankey
  highcharts_sankey("key="+ $("input[name='sankey_departure_level']:checked").val()+"&key="+ $("input[name='sankey_destination_level']:checked").val()+"&aggkey=travel_id&aggtype=count", "highcharts-sankey-departure-destination")
  /* network
  highcharts_network("key=departure_admiraltye&key=destination_admiralty&aggkey=travel_id&aggtype=count", "highcharts-network-departure-destination")*/
  // streamgraph
  highcharts_streamgraph("highcharts-streamgraph-products")
}

/* --- First step : datatrees selection update datagrid --- */
const datatreeToDatagrid = () => {
  $("#returned-dep").empty()
  $("#returned-dest").empty()
  $("#returned-uncertainity").empty()
  let departure_selected_datastring = ($('#departure-treelist').dxTreeList("instance")
    .getSelectedRowsData('leavesOnly')
    .map(x => x.name)
    .join(","))
  let destination_selected_datastring = ($('#destination-treelist').dxTreeList("instance")
    .getSelectedRowsData('leavesOnly')
    .map(x => x.name)
    .join(","))
  let uncertainity_selected_arr = []
  $('input[name=uncertainity_level]:checked').each(function () {
    uncertainity_selected_arr.push($(this).val())
  });
  let uncertainity_selected_datastring = uncertainity_selected_arr.join(",")
  // ui
  $("#returned-dep").append(departure_selected_datastring)
  $("#returned-dest").append(destination_selected_datastring)
  $("#returned-uncertainity").append(uncertainity_selected_datastring)
  // data
  let formData = {
    departure_selected_data: departure_selected_datastring,
    destination_selected_data: destination_selected_datastring,
    uncertainity_selected_data: uncertainity_selected_datastring,
  };
  $.ajax({
    type: "POST",
    url: "/api/v1/filters",
    data: formData,
    dataType: "json",
    encode: true,
  }).done(function (data) {
    console.log(data);
    $("#dataGrid").dxDataGrid("instance").refresh();
  });
}
const test = () => {alert("ok");}

/* --- Second step : then datagrid ready content event updates charts --- 
const datagridToCharts = () => {
  $("#dataGrid").dxDataGrid("instance").on({
    "onContentReady": test
  });
} */

/* --- init : on load datagrid ready content event--- */
$(document).ready(datatreeToDatagrid);
/* --- sidebar filters event --- */
$("#selection-apply-filters").on("click", datatreeToDatagrid);
/* ---- radio buttons on echarts linerace events ---- */
keys.forEach(key =>
($(`input[name=linerace_${key}_level]`).change(function () {
  echarts_depdest_linerace("key=" + $("input[name='linerace_" + key + "_level']:checked").val() + "&key=outdate_fixed_datetime_month_number&aggkey=travel_id&aggtype=count", $("input[name=linerace_" + key + "_level']:checked").val(), "travel_id", "outdate_fixed_datetime_month_number", "echarts-" + key + "-linerace")
}))
);
/* ---- radio buttons on sankey chart ---*/
  ($("input[name=sankey_departure_level],input[name=sankey_destination_level]").change(function () {
    highcharts_sankey("key="+ $("input[name='sankey_departure_level']:checked").val()+"&key="+ $("input[name='sankey_destination_level']:checked").val()+"&aggkey=travel_id&aggtype=count", "highcharts-sankey-departure-destination")
  }))


/* [Unused]
      const updateTreeListsSource = () => {
        const dataSource =  $("#dataGrid").dxDataGrid("getDataSource");
        dataSource
      .store()
      .load()
      .then((result) => {
        let departureFilteredData = getValuesByKey(result, "departure", true).map(x => ({ "name": x }))
        let destinationFilteredData = getValuesByKey(result, "destination", true).map(x => ({ "name": x }))
        departureTreelist.clearFilter();
        destinationTreelist.clearFilter();
      departureTreelist.option('filterValue', selectedDataToFilterbuilder(departureFilteredData, "name"));
      destinationTreelist.option('filterValue', selectedDataToFilterbuilder(destinationFilteredData, "name"));
      })
      }

          const selectedDataToFilterbuilder = (selectedData, row) => {
        //row is "departure" or "destination"
        let arr = []
        if (selectedData.length) {
          if (selectedData.length == 1) {
            arr = [
              row, "=", selectedData[0].name
            ]
          }
          else {
            selectedData.map(function (item) {
              arr.push([
                row, "=", item.name
              ], "or")
            })
            arr = arr.splice(0, arr.length - 1)
          }
        }
        return arr;
      }
      */