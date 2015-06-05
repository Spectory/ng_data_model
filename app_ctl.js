/*globals angular, document, JST, window, _ */
angular.module('app')
  .controller('appCtl', ['$scope', 'dataModel', function ($scope, dataModel) {
    'use strict';

    var dm;

    function reset() {
      $scope.target_model_name = $scope.attr = $scope.val = null;
    }

    $scope.init = function () {
      dm = dataModel;
      dm.init();
      $scope.models_names = [];
      $scope.loadExample();
    };

    $scope.loadExample = function () {
      var cat;
      $scope.models_names.push('cats');
      $scope.models_names.push('cat_owners');
      dm.initModelByName('cats');
      _.each(['m', 'p', 'k', 't', 'b', 'z', 'v', 'l'], function (letter, i) {
        cat = {
          id: i,
          name: letter + 'itzi',
          color: Math.random() > 0.5 ? 'black' : 'white',
          owner_id: Math.random() > 0.5 ? 1 : 2,
        };
        dm.addToModel('cats', cat);
      });

      dm.initModelByName('cat_owners');
      var owner_1 = {id: 1, name: 'PAPA'};
      var owner_2 = {id: 2, name: 'MAMA'};
      dm.addToModel('cat_owners', owner_1);
      dm.addToModel('cat_owners', owner_2);
    };

    $scope.createModel = function () {
      if ($scope.target_model_name) {
        dm.initModelByName($scope.target_model_name);
        $scope.models_names.push($scope.target_model_name);
        reset();
      }
    };

    $scope.getModelByName = function (name) {
      return dm.getModelByName(name).data;
    };

    $scope.addToModel = function () {
      if ($scope.target_model_name && $scope.attr) {
        var obj = {};
        obj[$scope.attr] = $scope.val;
        dm.addToModel($scope.target_model_name, obj);
      }
      reset();
    };

    $scope.groupModelByAttr = function () {
      if ($scope.target_model_name && $scope.attr) {
        $scope.group = dm.groupModelByAttr($scope.target_model_name, $scope.attr);
      }
      reset();
    };

    $scope.filterModelByAttrAndValue = function () {
      if ($scope.target_model_name && $scope.attr) {
        $scope.filtered_with_val = dm.filterModelByAttrAndValue($scope.target_model_name, $scope.attr, $scope.val);
      }
      reset();
    };

    $scope.filterModelByAttr = function () {
      if ($scope.target_model_name && $scope.attr) {
        $scope.filtered = dm.filterModelByAttr($scope.target_model_name, $scope.attr, $scope.val);
      }
      reset();
    };

    $scope.filterModelByAttrAndValuesArray = function () {
      if ($scope.target_model_name && $scope.attr) {
        var arr = $scope.val.split(',');
        $scope.filtered_with_val_arr = dm.filterModelByAttrAndValuesArray($scope.target_model_name, $scope.attr, arr);
      }
      reset();
    };

    $scope.joinView = function () {
      $scope.joined_view = dm.joinView('cats', 'cat_owners', 'owner_', ['owner_id', 'id']);
    };

  }]);