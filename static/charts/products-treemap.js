$(() => {
  $('#products-treemap-simple').dxTreeMap({
    //dataSource: citiesPopulation,
    idField: 'id',
    parentField: 'parentId',
    tooltip: {
      enabled: true,
      //format: 'thousands',
      customizeTooltip(arg) {
        const { data } = arg.node;
        let result = null;

        if (arg.node.isLeaf()) {
          result = "<span>"+data.name+" ("+ data.parentId+") :"+arg.valueText+"</span>";
        }

        return {
          text: result,
        };
      },
    },
  });

  $('#products-treemap-drill').dxTreeMap({
    //dataSource: citiesPopulation,
    idField: 'id',
    parentField: 'parentId',
    tooltip: {
      enabled: true,
     // format: 'thousands',
      customizeTooltip(arg) {
        const { data } = arg.node;
        let result = null;

        if (arg.node.isLeaf()) {
          result = "<span>"+data.name+" ("+ data.parentId+") :"+arg.valueText+"</span>";
        }

        return {
          text: result,
        };
      },
    },
	 interactWithGroup: true,
    maxDepth: 1,
    onClick(e) {
      e.node.drillDown();
    },
	  onDrill(e) {
      const markup = $('#drill-down-title').empty();
      let node;
      for (node = e.node.getParent(); node; node = node.getParent()) {
        markup.prepend(' > ').prepend($('<span />')
          .addClass('link')
          .text(node.label() || 'Tous les produits')
          .data('node', node)
          .on('dxclick', onLinkClick));
      }
      if (markup.children().length) {
        markup.append(e.node.label());
      }
    },
  });
});

const treemapLoadData = () => {
  let dataSource = new DevExpress.data.DataSource({
    load: function () {
      let d = new $.Deferred();
      $.get('/api/v1/simple_groupby_data?key=category_portic_fr&key=commodity_standardized_fr&aggkey=travel_id&aggtype=count').done(function (results) {
	  let data = results.map(x => ({"id": x["commodity_standardized_fr"], "name": x["commodity_standardized_fr"], "parentId": x["category_portic_fr"], "value": x["travel_id"]}))
	  let parent_cat = getValuesByKey(results, 'category_portic_fr', true).map(x => ({"id":x, "name":x}))
	  let result = data.concat(parent_cat)
        d.resolve(result)
      })
      return d.promise();
    },
  });
        $("#products-treemap-simple").dxTreeMap({
            dataSource: dataSource
        });
        $("#products-treemap-drill").dxTreeMap({
          dataSource: dataSource
      });

          dataSource.load();
 }

const onLinkClick = (e) => {
  $(e.target).data('node').drillDown();
}

// init
treemapLoadData()

// sidebar filters
$("#selection-apply-filters").on("click", treemapLoadData)