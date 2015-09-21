'use strict'; 

/* exported ServiceModule */
/* The above comment disables the JSHint warning of ServiceModule being defined but not used. */

var ServiceModule = (function() {

  var UWaterlooService = function() {
    this.key = 'fe94c90a88eddfa13bb672a460ccee9a';
    this.urlPrefix = 'https://api.uwaterloo.ca/v2';
    this.building = '';
    this.buildingCode = '';
    this.queryBuildingList = {};
    this.hasQueryBuildings = false;
  };


  _.extend(UWaterlooService.prototype, {
    queryBuildings: function(callback_ftn) {
      var self = this;
      var buildingListUrl = self.urlPrefix + '/buildings/list.json' + '?key=' + self.key;
      var found = this.hasQueryBuildings;
      if (!found) {
        $.ajax ({
          url: buildingListUrl,
          success: function(result) {
            this.queryResult = result.data;
            this.hasQueryBuildings = true;
            _.each(this.queryResult, 
                   function(building) {
                   self.queryBuildingList[building.building_code] = building.building_name;
            });
            callback_ftn(this.queryResult);
            return result.data;
          },
          error: function() {
            callback_ftn(new Error('Getting queryBuildings is wrong.'));
            return undefined;
          }
        });
      }
      else {
        return this.queryResult;
      }
    },

    getBuilding: function(buildingCode,callback_ftn) {
      var buildingCodeUrl = this.urlPrefix + '/buildings/' + this.buildingCode + '.json' + '?key=' + this.key;
      var found = this.findBuilding(buildingCode,this.queryBuildingList);
      if (!found) { 
        $.ajax ({
          url: buildingCodeUrl,
          success: function(result) {
            var ajaxResult = result.data;
            callback_ftn(ajaxResult);
            return result;
          },
          error: function() {
            callback_ftn(new Error('Getting getBuilding is wrong.'));
            return undefined;
          }
        });
      }
      else {
        return this.queryBuildingList[buildingCode];
      }
    },

    findBuilding: function(buildingCode,queryBuildingList) {
       if (queryBuildingList.indexOf(buildingCode) !== -1) {
        return true;
       }
       return false;
    } 
  });


  return {
    UWaterlooService: UWaterlooService,
  };

})();




