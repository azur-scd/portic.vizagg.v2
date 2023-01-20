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

 $("#datagrid").dxDataGrid({
         // dataSource: store,
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
          },
          columns: dataGridColumns,
         /* onContentReady: function (e) {
            barchartLoadData();
          },*/
        }).dxDataGrid("instance");

        const datagridLoadData = () => {

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
            let dataSource = new DevExpress.data.DataSource({
              key: "travel_id",
              //loadMode: "raw",
              cacheRawData: false,
              load: function () {
                let d = new $.Deferred();
                $.get("/api/v1/filtered_data").done(function (results) {
                  //let data = JSON.parse(results)
                  console.log(results)
                  d.resolve(results)
                })
                return d.promise();
              }
          });
                $("#datagrid").dxDataGrid({
                    dataSource: dataSource
                });
        
                  dataSource.load();
          });
        }
         
         // init
         datagridLoadData() 
         // sidebra filters
         $("#selection-apply-filters").on("click", datagridLoadData)
        })
