function SeatSelectionDirective() {
    return {
        templateUrl: 'seat-selection.tpl.html',
        controller: 'SeatSelectionController',
        controllerAs: 'SeatSelectionCtrl',
        restrict: 'AE',
        replace: true,
        scope: {},
        bindToController: {}
    };
}

angular
.module('booking-module')
.directive('seatSelection', SeatSelectionDirective);