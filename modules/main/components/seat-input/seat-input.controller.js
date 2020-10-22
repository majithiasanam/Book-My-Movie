function SeatInputController($scope, seatsManager, QUANTITIES, QUALITIES) {
    
    (function init() {
        $scope.premiumSeats = seatsManager.getSeats("Premium");
        $scope.standardSeats = seatsManager.getSeats("Standard");
        $scope.seats = seatsManager;
        $scope.quantities = QUANTITIES;
        $scope.seatQualities = QUALITIES;
        $scope.seatQuality = "Standard";
        $scope.selectedCount = $scope.quantities[0];
        seatsManager.setAvailableSeatCount($scope.selectedCount);
    })();

}

angular
    .module("booking-module")
    .controller("SeatInputController", [
        "$scope",
        "seatsManager",
        'QUANTITIES',
        'QUALITIES',
        SeatInputController,
    ]);
