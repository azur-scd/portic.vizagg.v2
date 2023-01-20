$(document).ready(function () {

   $('#departure-treelist').dxTreeList({
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
    
     $('#destination-treelist').dxTreeList({
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
})