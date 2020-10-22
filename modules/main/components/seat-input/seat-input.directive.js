function SeatInputDirective() {
    return {
        templateUrl: 'seat-input.tpl.html',
        controller: 'SeatInputController',
        controllerAs: 'SeatInputCtrl',
        restrict: 'AE',
        replace: true,
        scope: {},
        bindToController: {}
    };
}

angular
.module('booking-module')
.directive('seatInput', SeatInputDirective);