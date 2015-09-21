'use strict';

/* exported ViewModule */
/* The above comment disables the JSHint warning of ViewModule being defined but not used. */

var ViewModule = (function(BuildingModel) {

  var AbstractView = function(model) {
    this.model = model;
    this.model.addListener(this);
  };

  _.extend(AbstractView.prototype, {
    init: function() {
      console.log('init AbstractView');
    }, 

    update: function(event) {
      console.log('update AbstractView ' + event);
    },


  });

  var BuildingListView = function(model, UWaterlooService) {
    AbstractView.apply(this, arguments); 
    this.UWaterlooService = UWaterlooService;
    this.init();
  };

  _.extend(BuildingListView.prototype, AbstractView.prototype, {
    init: function() {
      var self = this;
      this.element = document.getElementById('listBuilding');
      /*var searchBuilding = this.element;*/
      self.UWaterlooService.queryBuildings(function(result) {
        _.each(result, function(building) {
          var name = building.building_name; 
          var id = building.building_id;
          var code = building.building_code;
          var lat = building.latitude;
          var lng = building.longitude;
          var buildingModel = new BuildingModel(name,id,code,lat,lng);
          self.model.addBuildingModel(buildingModel);
        });
      });
    },

    /*checkListener: function() {
      var self = this;
      var checkBox = this.element.querySelectorAll('.unchecked');
      var len = checkBox.length;
      var listLen = self.model.buildingModels.length;
      console.log(checkBox);
      console.log('len: ' + len);
      console.log('listLen: ' + listLen);
      var exce = function(i) {
        return function() {
          if(checkBox[i].checked) {
            console.log('The check box is checked.');
            checkBox[i].className = 'checked';
            var id = checkBox[i].getAttribute('id');
            console.log(checkBox[i]);
            console.log(id);
            console.log(self.model);

            //self.model.buildingModels[i].update('BUILDING_CHECKED_EVENT');
            for (var j = 0; j < listLen; j++) {
              var buildingID = self.model.buildingModels[j].buildingID;
              if(buildingID === id) {
                console.log(self.model.buildingModels[j]);
                self.model.buildingModels[j].update('BUILDING_CHECKED_EVENT');
                break;
              }
            }
          }
          else {
            checkBox[i].setAttribute('class','unchecked');
            var unId = checkBox[i].getAttribute('id');
            for (var k = 0; k < listLen; k++) {
              var unBuildingID = self.model.buildingModels[k].buildingID;
              if(unBuildingID === unId) {
                console.log(self.model.buildingModels[k]);
                self.model.buildingModels[k].update('BUILDING_UNCHECKED_EVENT');
                break;
              }
            }
            //self.model.buildingModels[i].update('BUILDING_UNCHECKED_EVENT');
          }
        };
      };
      for (var i = 0; i < len; i++) {
        checkBox[i].addEventListener('click', exce(i));
      }
    },*/

    checkListener: function() {
      var self = this;
      var checkBox = this.element.querySelectorAll('.checkbox-info');
      var len = checkBox.length;
      var listLen = self.model.buildingModels.length;

      var exce = function(i) {
        return function() {
          var checked = checkBox[i].getAttribute('check');
          if(checked === 'false') {
            console.log('The check box is checked.');
            checkBox[i].setAttribute('check','true');
            checkBox[i].className += ' checkbox-check';
            var id = checkBox[i].getAttribute('id');

            //self.model.buildingModels[i].update('BUILDING_CHECKED_EVENT');
            for (var j = 0; j < listLen; j++) {
              var buildingID = self.model.buildingModels[j].buildingID;
              if(buildingID === id) {
                console.log(self.model.buildingModels[j]);
                self.model.buildingModels[j].update('BUILDING_CHECKED_EVENT');
                break;
              }
            }
          }
          else if(checked === 'true'){
            checkBox[i].setAttribute('check','false');
            checkBox[i].setAttribute('class','checkbox checkbox-info');
            var unId = checkBox[i].getAttribute('id');
            for (var k = 0; k < listLen; k++) {
              var unBuildingID = self.model.buildingModels[k].buildingID;
              if(unBuildingID === unId) {
                console.log(self.model.buildingModels[k]);
                self.model.buildingModels[k].update('BUILDING_UNCHECKED_EVENT');
                break;
              }
            }
            //self.model.buildingModels[i].update('BUILDING_UNCHECKED_EVENT');
          }
        };
      };
      for (var i = 0; i < len; i++) {
        checkBox[i].addEventListener('click', exce(i));
      }
    },

    update: function(event) {
      if (event === 'BUILDING_ADDED_TO_BUILDINGLIST_EVENT') {
        var len = this.model.buildingModels.length;
        this.appendBuilding(this.model.buildingModels[len-1]);
        if (len === 251) {
          this.update('FINISH_BUILDING_INIT_EVENT');
        }
      }
      else if (event === 'FINISH_BUILDING_INIT_EVENT') {
        console.log(this.model.buildingModels.length);
        this.checkListener();
      }
      else if (event === 'BUILDING_SEARCH_EVENT') {
        var newBuildingList = this.model.getNewBuildingList();
        this.showBuildingList(newBuildingList);
        this.checkListener();
      }
    },

    appendBuilding: function(buildingModel) {
      var self = this;
      var buildingCheck = buildingModel.getCheck();
      var buildingId = buildingModel.buildingID;
      var buildingName = buildingModel.buildingName;
      var buildingCode = buildingModel.buildingCode;
      var buildingDiv = document.createElement('div');
      buildingDiv.setAttribute('id',buildingId);
      var buildingElement = document.createElement('input');
      buildingElement.setAttribute('type','checkbox');
      buildingElement.setAttribute('id',buildingId);
      var label = document.createElement('label');
      label.htmlFor = buildingName;
      label.innerHTML = buildingName + ' (' + buildingCode + ')';
      if(buildingCheck) {
        buildingDiv.setAttribute('class','checkbox checkbox-info checkbox-check');
        buildingDiv.setAttribute('check','true');
        buildingElement.setAttribute('class','styled');
      }
      else {
        buildingDiv.setAttribute('class','checkbox checkbox-info');
        buildingDiv.setAttribute('check','false');
        buildingElement.setAttribute('class','styled');
      }
      buildingDiv.appendChild(buildingElement);
      buildingDiv.appendChild(label);
      self.element.appendChild(buildingDiv);
    },

    showBuildingList: function(buildinglist) {
      var self = this;
      while (self.element.hasChildNodes()) {
        self.element.removeChild(this.element.lastChild);
      }
      _.each(buildinglist, function(buildingModel) {
        var buildingCheck = buildingModel.getCheck();
        var buildingId = buildingModel.buildingID;
        var buildingName = buildingModel.buildingName;
        var buildingCode = buildingModel.buildingCode;
        var buildingDiv = document.createElement('div');
        buildingDiv.setAttribute('id',buildingId);
        var buildingElement = document.createElement('input');
        buildingElement.setAttribute('type','checkbox');
        buildingElement.setAttribute('id',buildingId);
        var label = document.createElement('label');
        label.htmlFor = buildingName;
        label.innerHTML = buildingName + ' (' + buildingCode + ')';
        if(buildingCheck) {
          buildingDiv.setAttribute('class','checkbox checkbox-info checkbox-check');
          buildingDiv.setAttribute('check','true');
          buildingElement.setAttribute('class','styled');
        }
        else {
          buildingDiv.setAttribute('class','checkbox checkbox-info');
          buildingDiv.setAttribute('check','false');
          buildingElement.setAttribute('class','styled');
        }
        buildingDiv.appendChild(buildingElement);
        buildingDiv.appendChild(label);
        self.element.appendChild(buildingDiv);
      });
    }

  });

  var MapView = function(model, UWaterlooService) {
    AbstractView.apply(this, arguments);
    this.UWaterlooService = UWaterlooService;
    this.init();
    this.markers = {};
  };

  _.extend(MapView.prototype, AbstractView.prototype, {
    setUp: function() {
      var mapOptions = {
        center: new google.maps.LatLng(43.472635, -80.542070),
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    },

    init: function() {
      google.maps.event.addDomListener(window, 'load', this.setUp());
    },

    update: function(event) {
      console.log('updating map view: ' + event);
      var self = this;
      var buildingModelsList = self.model.buildingModels;
      console.log(self.markers);
      var createMarker = function(lat,lng,buildingID) {
        console.log('settingMarkers for: ' + buildingID);
        if(self.markers[buildingID]) {return;}
        var markerOptions = {
            id: buildingID,
            position: new google.maps.LatLng(lat, lng)
        };

          var marker = new google.maps.Marker(markerOptions);
          self.markers[buildingID] = marker;
          console.log(self.markers);
      };
      var setMarker = function(buildingID) {
        var marker = self.markers[buildingID];
        marker.setMap(self.map);
      };
      var deleteMarker = function(buildingID) {
        console.log('deleting marker: ' + buildingID);
        console.log(self.markers);
        console.log(self.markers[buildingID]);
        var marker = self.markers[buildingID];
        if(marker) {
          console.log('valid marker');
          marker.setMap(null);
        }
      };
      _.each(buildingModelsList, function(buildingModel) {
        var buildingID = buildingModel.buildingID;
        var buildingChecked = buildingModel.check;
        if(event === 'BUILDING_UNCHECKED_EVENT' && !buildingChecked) {
          //console.log('clearingMarkers for: ' + buildingID);
          //console.log('buildingChecked: ' + buildingChecked);
          if(self.markers[buildingID]) {
            deleteMarker(buildingID);
            console.log(self.markers);
          }
        }
        else if(event === 'BUILDING_CHECKED_EVENT' && buildingChecked) {
          console.log('map marker BUILDING_CHECKED_EVENT');
          var lat = buildingModel.lat;
          var lng = buildingModel.lng;
          createMarker(lat,lng,buildingID);
          setMarker(buildingID);
        }
      });
    }

  });

  return {
    BuildingListView: BuildingListView,
    MapView: MapView
  };
})(ModelModule.BuildingModel);
