/**
  @fileoverview Dropdown directive. A custom dropdown.
  @author Agustin Diaz agustin.diaz@globallogic.com
*/
angular.module('myPath')
  .directive("myDropdown", function($rootScope) {
    return {
      restrict: "AE",
      templateUrl: "commons/directives/dropdown/dropdown.html",
      scope: {
        placeholder: "@", // Text to display as default in the dropdown
        list: "=", // List of values for the dropdown options
        selected: "=", // Selected item
        property: "@" // Property to determine if the item is selected
      },
      link: function(scope, element) {
        scope.listVisible = false;
        scope.isPlaceholder = true;

        scope.is_ie = (typeof is_ie !== 'undefined')? is_ie : false;
        scope.select = function(item) {
          scope.isPlaceholder = false;
          scope.selected = item;
          scope.hide();
        };


  	/**
  	 * Function to set if an item is selected
	 * @returns {boolean} A flag determining if an item is selected
  	 */
        scope.isSelected = function(item) {
          return item[scope.property] === scope.selected[scope.property];
        };


        scope.toggle = function() {
          scope.listVisible = !scope.listVisible;
          if(scope.listVisible){
            scope.show();
          }
        }


        scope.show = function() {
          scope.listVisible = true;
          $('html').one('click',function() {
            scope.hide();
          });

          element.one('click',function(event){
            event.stopPropagation();
          })
        };


        scope.hide = function() {
          scope.listVisible = false;
          scope.$apply();
        };


        scope.$watch("selected", function(value) {
          scope.isPlaceholder = scope.selected[scope.property] === undefined;
          scope.display = scope.selected[scope.property];
        });
      }
    }
  });
