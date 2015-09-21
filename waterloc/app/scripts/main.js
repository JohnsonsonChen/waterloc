'use strict';


(function(Models, Views, Services) {
  $(document).ready(function() {
  	console.log('loading...');
  	var service = new Services.UWaterlooService();
    var buildingListModule = new Models.BuildingListModel();

    new Views.BuildingListView(buildingListModule,service);
    new Views.MapView(buildingListModule,service);
    var searchBuilding = document.getElementById('searchBuilding');
    searchBuilding.addEventListener('input', function() {
        var value = searchBuilding.value;
        var dot = '.*';
        var input = '';
        for (var i = 0; i <= value.length; i++) {
          var char = value.charAt(i);
          input = input + dot + char;
        }
        var pattern = new RegExp(input);
        console.log(pattern);
        buildingListModule.setSearchPattern(pattern);
        buildingListModule.update('BUILDING_SEARCH_EVENT');
      });
  });
})(ModelModule, ViewModule, ServiceModule);
