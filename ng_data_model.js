/*globals angular, document, JST, window, _ */
angular.module('app').factory('dataModel',
  function () {
    'use strict';
    var dm = {};
    var data = {};
    var RANDOM_VAL = Math.random().toString(36);

    /****************** Helpers ******************/

    function buildErr(location, args) {
      var msg = args.join('');
      return ['Error at', location, ':', msg].join(' ');
    }

    function isUndefined(model_name, location) {
      if (data[model_name]) {
        return;
      }
      return {status: 0, msg: buildErr(location, ['cant find model by name ', '"', model_name, '"'])};
    }

    function objHasNoId(obj, location) {
      if (_.has(obj, 'id')) {
        return;
      }
      return {status: 0, msg: buildErr(location, ['obj must have an id attr ', '"', obj, '"'])};
    }

    dm.mockWith = function (obj) {
      data = obj;
    };

    /****************** Helpers ******************/

    dm.init = function () {
      data = {};
    };

    dm.initModelByName = function (model_name) {
      data[model_name] = [];
    };

    dm.getModelByName = function (model_name) {
      var err = isUndefined(model_name, 'getModelByName');
      if (err) {
        return err;
      }
      return {status: 1, data: data[model_name]};
    };

    dm.addToModel = function (model_name, obj) {
      var err = isUndefined(model_name, 'addToModel');
      if (err) {
        return err;
      }
      err = objHasNoId(obj, 'addToModel');
      if (err) {
        return err;
      }
      data[model_name].push(obj);
      return {status: 1};
    };

    /*
    * returns all members in model_name s.t member.attr is a valid key.
    */
    dm.filterModelByAttr = function (model_name, attr) {
      return dm.filterModelByAttrAndValue(model_name, attr, RANDOM_VAL);
    };

    /*
    * returns all members in model_name s.t member.attr === value
    */
    dm.filterModelByAttrAndValue = function (model_name, attr, value) {
      var err = isUndefined(model_name, 'filterModelByAttrAndValue');
      if (err) {
        return err;
      }
      return _.filter(data[model_name], function (member) {
        if (value === RANDOM_VAL) {
          return member[attr];
        }
        return member[attr] === value;
      });
    };

    dm.filterModelByAttrAndValuesArray = function (model_name, attr, value_arr) {
      var err = isUndefined(model_name, 'filterModelByAttrAndValuesArray');
      if (err) {
        return err;
      }
      return _.filter(data[model_name], function (member) {
        return _.contains(value_arr, member[attr]);
      });
    };

    dm.groupModelByAttr = function (model_name, attr) {
      var err = isUndefined(model_name, 'groupModelByAttr');
      if (err) {
        return err;
      }
      var res = {};
      res.unknown = [];
      _.each(data[model_name], function (member) {
        if (member[attr]) {
          if (!res[member[attr]]) {
            res[member[attr]] = [];
          }
          res[member[attr]].push(member);
        } else {
          res.unknown.push(member);
        }
      });
      return res;
    };

    dm.joinView = function (model_name, join_model_name, prefix, onAttrs) {
      var err = isUndefined(model_name, 'joinView');
      if (err) {
        return err;
      }
      err = isUndefined(join_model_name, 'joinView');
      if (err) {
        return err;
      }
      var res = [];
      var selected_attr = onAttrs[0];
      var join_attr = onAttrs[1];
      var clone, found_join_target, keys;
      _.each(data[model_name], function (member) {
        clone = null;
        found_join_target = _.find(data[join_model_name], function (join_member) {
          return member[selected_attr] === join_member[join_attr];
        });
        if (found_join_target) {
          clone = _.cloneDeep(member);
          keys = _.keys(found_join_target);
          var unwanted_element_index = keys.indexOf("$$hashKey");
          if (unwanted_element_index !== -1) {
            keys.splice(keys.indexOf("$$hashKey"), 1);
          }
          _.each(keys, function (key) {
            if (key !== join_attr) {
              clone[prefix + key] = found_join_target[key];
            }
          });
          res.push(clone);
        }
      });
      return res;
    };

    return dm;
  });