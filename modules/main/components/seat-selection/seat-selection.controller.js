function SeatSelectionController($scope, $window, seatsManager) {
    
    $scope.seats = seatsManager;
    $scope.seatQuality = "Standard";
    $scope.selectedCount = 0;

    $scope.storeSeat = function () {
        if ($scope.seats.availableSeatCount != 0) {
            $window.alert(
                "You haven't selected " +
                    $scope.seats.availableSeatCount.val +
                    " seats"
            );
            return;
        }
        var sessionInfo = seatsManager.bookCheckedSeats();
        seatsManager.setAvailableSeatCount($scope.selectedCount);

        $scope.alertMsg = [];
        angular.forEach(sessionInfo.checkedSeats, function (v, k) {
            for (var i = 0; i < v.length; i++) {
                $scope.alertMsg.push(v[i].val + v[i].letter);
            }
        });

        $window.alert(
            "Thank you for Booking " +
                sessionInfo.count +
                " seats. " +
                "Your seats are: " +
                $scope.alertMsg.join(", ")
        );
    };
}

angular
    .module("booking-module")
    .controller("SeatSelectionController", [
        "$scope",
        "$window",
        "seatsManager",
        SeatSelectionController,
    ]);
