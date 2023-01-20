$(document).ready(function () {

  const dataGridColumns = [{
    dataField: "travel_id",
    caption: "ID",
    visible: false
  },
  {
    dataField: "outdate_fixed_datetime",
    caption: "Date de départ",
    dataType: "date",
    format: "yyyy-MM-dd"
  },
  {
    dataField: "departure",
    caption: "Port de départ"
  },
  {
    dataField: "departure_uncertainity",
    caption: "Départ : incertitude",
    dataType: "string"
  },
  {
    dataField: "destination",
    caption: "Port de destination"
  },
  {
    dataField: "tonnage",
    caption: "Tonnage",
    dataType: "number"
  },
  {
    dataField: "distance_dep_dest_miles",
    caption: "Distance parcourue (en miles)",
    dataType: "number"
  }]

    const departureTreelist = $('#departure-treelist').dxTreeList({
        dataSource: geographical_hierarchy,
        keyExpr: 'uhgs_id',
        parentIdExpr: 'parent_uhgs_id',
        showRowLines: true,
        showBorders: true,
        columnAutoWidth: true,
        selection: {
          mode: 'multiple',
          recursive: true,
        },
        searchPanel: {
          visible: true
        },
        expandedRowKeys: ["Z"],
       /* onSelectionChanged(e) {
         // $("#departure-selected-data").val('')
         let data = e.component.getSelectedRowsData('leavesOnly')
                           .map(x => x.name)
                           .join(",");
          $("#departure-selected-data").val(data)
         },*/
        columns: [{
          dataField: 'name',
          caption: 'Sélectionner tout',
        },
        ],
      }).dxTreeList('instance');
    
      const destinationTreelist = $('#destination-treelist').dxTreeList({
        dataSource: geographical_hierarchy,
        keyExpr: 'uhgs_id',
        parentIdExpr: 'parent_uhgs_id',
        showRowLines: true,
        showBorders: true,
        columnAutoWidth: true,
        selection: {
          mode: 'multiple',
          recursive: true,
        },
        searchPanel: {
          visible: true
        },
        expandedRowKeys: ["Z"],
       /* onSelectionChanged(e) {
          $("#destination-selected-data").val('')
         let data = e.component.getSelectedRowsData('leavesOnly')
                           .map(x => x.name)
                           .join(",");
          $("#destination-selected-data").val(data)
         },*/
        columns: [{
          dataField: 'name',
          caption: 'Sélectionner tout',
        },
        ],
      }).dxTreeList('instance');

      const store = new DevExpress.data.CustomStore({
          key: "travel_id",
          loadMode: "raw",
          cacheRawData: false,
          load: function () {
            let d = new $.Deferred();
            $.get("/api/v1/filtered_data").done(function (results) {
              //let data = JSON.parse(results)
              d.resolve(results)
            })
            return d.promise();
          }
        })
        const dataGrid = $("#dataGrid").dxDataGrid({
          dataSource: store,
          keyExpr: "travel_id",
          showBorders: false,
          allowColumnResizing: true,
          columnAutoWidth: true,
          paging: {
            pageSize: 5
          },
          pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [
              5,
              10,
              20,
              50,
              100,
              200,
              300
            ],
            showInfo: true
          },
          "export": {
            enabled: true,
            fileName: "travels"
          },
          searchPanel: {
            visible: true
          },
          filterRow: {
            visible: true,
            // applyFilter: "onClick"
          },
          columns: dataGridColumns,
          onContentReady: function (e) {
            updateCharts()
          },
        }).dxDataGrid("instance");

})