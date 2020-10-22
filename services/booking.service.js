function SeatsFactory() {

    //------------------- Factory Variables ------------------------------//
    var seats = {
        Premium: {
            visible: false,
            seats: drawSeats(65, 5, 10),
        },
        Standard: {
            visible: false,
            seats: drawSeats(70, 5, 10),
        },
    };
    var checkedSeatCount = 0;
    var currentSelectionSession = {};
    var DEFAULT_SELECT_SESSION = {
        checkedSeats: {},
        count: 0,
        total: 0.0,
    };

    //--------------------------- Factory Initialization -----------------------------//
    // Initialize the default seat selection
    (function init() {
        currentSelectionSession = angular.copy(DEFAULT_SELECT_SESSION);
    })();


    //-------------------------- Factory Methods -----------------------------------//
    /**
     * Draws seats on the screen for user to select.
     * 
     * @param {String} startLetter 
     * @param {Number} rows 
     * @param {Number} cols 
     */
    function drawSeats(startLetter, rows, cols) {
        var rowArray = [],
            columnArray = [];
        for (var i = 0, k = startLetter; i < rows; i++, k++) {
            for (var j = 1; j <= cols; j++) {
                columnArray.push({
                    val: j,
                    letter: String.fromCharCode(k),
                    check: false,
                    booked: false,
                });
            }
            rowArray.push(columnArray);
            columnArray = [];
        }
        return rowArray;
    };

    /**
     * Check if number of seats selected has exceeded the number of seats requested.
     * 
     * @param {Number} newCount 
     */
    function checkSelected(newCount) {
        if (checkedSeatCount === 0) {
            factory.availableSeatCount = angular.copy(newCount);
        } else if (newCount.val > checkedSeatCount) {
            factory.availableSeatCount.val = newCount.val - checkedSeatCount;
        } else {
            removeAllCheck();
            checkedSeatCount = 0;
        }
    }

    /**
     * Remove the current ongoing selection when more seats are selected than originally requested.
     */
    function removeAllCheck() {
        keys = Object.keys(seats);
        for (var rang = 0; rang < keys.length; rang++) {
            var key = keys[rang];
            var curSeats = seats[key].seats;
            for (var row = 0; row < curSeats.length; row++) {
                for (var col = 0; col < curSeats[row].length; col++) {
                    if (!curSeats[row][col].booked) {
                        curSeats[row][col].check = false;
                        removeSeatFromSession(key, curSeats[row], col);
                    }
                }
            }
        }
        checkedSeatCount = 0;
    }

    /**
     * Store a freshly selected seat in current session's selection.
     * 
     * @param {*} rang 
     * @param {*} row 
     * @param {*} seatIndex 
     */
    function storeSeatInSession(rang, row, seatIndex) {
        if (angular.isUndefined(currentSelectionSession.checkedSeats[rang])) {
            currentSelectionSession.checkedSeats[rang] = [];
        }

        var seat = angular.copy(row[seatIndex]);

        delete seat["$$hashKey"];
        delete seat["check"];
        delete seat["booked"];

        currentSelectionSession.checkedSeats[rang].push(seat);
        // console.log(currentSelectionSession);
    }

    /**
     * Remove a particualr seat from current selection if clicked again.
     * 
     * @param {*} rang 
     * @param {*} row 
     * @param {*} seatIndex 
     */
    function removeSeatFromSession(rang, row, seatIndex) {
        if (currentSelectionSession.checkedSeats[rang]) {
            delete currentSelectionSession.checkedSeats[rang].pop();
        }
    }

    /**
     * Select a range of seats
     * 
     * @param {*} selection 
     * @param {*} count 
     */
    function selectSeats(selection, count) {
        var row = selection.row,
            seat = selection.seat,
            borderDistance,
            rest,
            lastIndex,
            lastIndexBookedCheck;

        if (!seat.booked && !seat.check) {
            if (factory.availableSeatCount.val == 0) {
                factory.availableSeatCount = angular.copy(count);
                removeAllCheck();
            }

            lastIndexBookedCheck = row.indexOf(seat) + factory.availableSeatCount.val;

            if (lastIndexBookedCheck > row.length)
                lastIndexBookedCheck = row.length;

            borderDistance = row.length - row.indexOf(seat);

            for (var i = row.indexOf(seat); i < lastIndexBookedCheck; i++) {
                if (row[i].booked) {
                    borderDistance = i - row.indexOf(seat);
                    i = row.length;
                    lastIndex = row.indexOf(seat) + borderDistance;
                }
            }

            rest =
                borderDistance > factory.availableSeatCount.val
                    ? 0
                    : factory.availableSeatCount.val - borderDistance;

            if (!lastIndex) {
                lastIndex =
                    rest > 0
                        ? row.length
                        : row.indexOf(seat) + factory.availableSeatCount.val;
            }

            for (
                var seatIndex = row.indexOf(seat);
                seatIndex < lastIndex;
                seatIndex++
            ) {
                row[seatIndex].check = true;
                storeSeatInSession(selection.rang, row, seatIndex);
                checkedSeatCount++;
            }
            factory.availableSeatCount.val = rest;
        }
    }

    /**
     * Trigger a booking for the currently selected seats.
     */
    function bookCheckedSeats() {
        var keys = Object.keys(seats),
            bookedSession;
        for (var rang = 0; rang < keys.length; rang++) {
            var key = keys[rang];
            var curSeats = seats[key].seats;

            // console.log('Checked Seats '+ seats[key].seats);

            for (var row = 0; row < curSeats.length; row++) {
                for (var col = 0; col < curSeats[row].length; col++) {
                    if (curSeats[row][col].check) {
                        curSeats[row][col].booked = true;
                        curSeats[row][col].check = false;
                    }
                }
            }
        }

        currentSelectionSession.count = checkedSeatCount;
        checkedSeatCount = 0;
        bookedSession = angular.copy(currentSelectionSession);

        // console.log(bookedSession);

        currentSelectionSession = angular.copy(DEFAULT_SELECT_SESSION);

        // console.log(currentSelectionSession);

        return bookedSession;
    }
    

    //-------------------------- Factory Interface --------------------------------//
    var factory = {
        drawSeats: drawSeats,
        map: seats,
        select: selectSeats,
        availableSeatCount: {},
        setAvailableSeatCount: function (count) {
            checkSelected(count);
        },
        getSeats: function (rang) {
            return seats[rang];
        },
        showQuality: function (rang) {
            angular.forEach(Object.keys(seats), function (curRang) {
                seats[rang].visible = curRang === rang;
            });
            this.availableSeatCount.val = this.availableSeatCount.id;
            removeAllCheck();
        },
        bookCheckedSeats: bookCheckedSeats,
    };
    return factory;
}

angular.module("booking-module").factory("seatsManager", SeatsFactory);
