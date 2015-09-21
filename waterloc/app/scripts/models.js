'use strict'; 

/* exported ModelModule */
/* The above comment disables the JSHint warning of ModelModule being defined but not used. */

var ModelModule = (function() {
  var BUILDING_ADDED_TO_BUILDINGLIST_EVENT = 'BUILDING_ADDED_TO_BUILDINGLIST_EVENT';
  var BUILDING_REMOVED_FROM_BUILDINGLIST_EVENT = 'BUILDING_REMOVED_FROM_BUILDINGLIST_EVENT';
  var BUILDING_CHECKED_EVENT = 'BUILDING_CHECKED_EVENT';
  var BUILDING_UNCHECKED_EVENT = 'BUILDING_UNCHECKED_EVENT';
  var BUILDING_SEARCH_EVENT = 'BUILDING_SEARCH_EVENT';

  var AbstractModel = function() {
    this.listeners = [];
  };


  _.extend(AbstractModel.prototype, {
    addListener: function(listener) {
      this.listeners.push(listener);
    },

    removeListener: function(listener) {
      var index = this.listeners.indexOf(listener);
        if (index !== -1) {
          this.listeners.splice(index, 1);
        }
    },

    notify: function(event) {
      _.each(this.listeners,
                function(listener) {
                  listener.update(event);
                }
                );
    },

    update: function(event) {
      console.log('updating AbstractModel' + event);
    }
  });



  var BuildingModel = function(name, id, code,lat,lng) {
    AbstractModel.apply(this, arguments);
    this.buildingName = name;
    this.buildingID = id;
    this.buildingCode = code;
    this.check = false;
    this.lat = lat;
    this.lng = lng;
  };

  _.extend(BuildingModel.prototype, AbstractModel.prototype, {
    update: function(event) {
      var self = this;
      if (event === BUILDING_CHECKED_EVENT) {
        self.check = true;
        console.log('BUILDING_CHECKED_EVENT: ' + self.buildingID);
        self.notify(BUILDING_CHECKED_EVENT);
      }
      else if (event === BUILDING_UNCHECKED_EVENT) {
        self.check = false;
        console.log('BUILDING_UNCHECKED_EVENT: ' + self.buildingID);
        self.notify(BUILDING_UNCHECKED_EVENT);
      }
    },

    getCheck: function() {
      return this.check;
    }

  });




  var BuildingListModel = function() {
    AbstractModel.apply(this, arguments);
    this.searchPattern = '';
    this.buildingModels = [];
    this.newBuildingList = [];
  };

  _.extend(BuildingListModel.prototype, AbstractModel.prototype, {
    addBuildingModel: function(buildingModel) {
      var self = this;
      
      console.log('adding building to list');
      self.buildingModels.push(buildingModel);
      buildingModel.addListener(self);

      self.notify(BUILDING_ADDED_TO_BUILDINGLIST_EVENT);
    },

    removeBuildingModel: function(buildingModel) {
      var self = this;

      var index = self.buildingModels.indexOf(buildingModel);
      if (index !== -1) {
        self.buildingModels.splice(index, 1);
      }

      self.notify(BUILDING_REMOVED_FROM_BUILDINGLIST_EVENT);
    },

    update: function(event) {
      var self = this;
      if (event === BUILDING_CHECKED_EVENT) {
        self.notify(BUILDING_CHECKED_EVENT);
      }
      else if (event === BUILDING_UNCHECKED_EVENT) {
        self.notify(BUILDING_UNCHECKED_EVENT);
      }
      else if (event === BUILDING_SEARCH_EVENT) {
        var len = self.buildingModels.length;
        var newBuildingList = [];
        for (var i = 0; i < len; i++) {
          var name = self.buildingModels[i].buildingName;
          var code = self.buildingModels[i].buildingCode;
          if(name.match(self.searchPattern) || code.match(self.searchPattern)) {
            newBuildingList.push(self.buildingModels[i]);
          }
        }
        self.newBuildingList = newBuildingList;
        self.notify(BUILDING_SEARCH_EVENT);
      }
    },

    getNewBuildingList: function() {
        return this.newBuildingList;
    },

    getBuildingModels: function() {
      return this.buildingModels.slice();
    },

    setSearchPattern: function(pattern) {
      this.searchPattern = pattern;
    }
  });

  return {
    BuildingModel: BuildingModel,
    BuildingListModel: BuildingListModel,

    BUILDING_ADDED_TO_BUILDINGLIST_EVENT: BUILDING_ADDED_TO_BUILDINGLIST_EVENT,
    BUILDING_REMOVED_FROM_BUILDINGLIST_EVENT: BUILDING_REMOVED_FROM_BUILDINGLIST_EVENT,
    BUILDING_CHECKED_EVENT: BUILDING_CHECKED_EVENT,
    BUILDING_UNCHECKED_EVENT: BUILDING_UNCHECKED_EVENT,
    BUILDING_SEARCH_EVENT: BUILDING_SEARCH_EVENT
  };
})();