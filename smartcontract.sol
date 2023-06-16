// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CarRental {
    struct Car {
        address owner;
        uint256 rentalPricePerHour;
        bool available;
        uint256 availableFrom;
        uint256 availableTo;
    }

    mapping(uint256 => Car) public cars;

    event CarRented(uint256 carId, address renter, uint256 rentalDuration);
    event CarReturned(uint256 carId, address renter);

    constructor() {
        createCar(1, msg.sender, 10 ether);
        createCar(2, msg.sender, 15 ether);
        createCar(3, msg.sender, 20 ether);
    }

    function createCar(uint256 carId, address owner, uint256 rentalPricePerHour) private {
        cars[carId] = Car(owner, rentalPricePerHour, true, 0, 0);
    }

    function rentCar(uint256 carId, uint256 rentalDuration) public payable {
        require(cars[carId].available, "Secilen arac kiralanamaz.");
        require(msg.value >= cars[carId].rentalPricePerHour * rentalDuration, "Yetersiz odeme miktari.");

        cars[carId].owner = msg.sender;
        cars[carId].available = false;
        cars[carId].availableFrom = block.timestamp + 1 hours;
        cars[carId].availableTo = cars[carId].availableFrom + rentalDuration * 1 hours;

        emit CarRented(carId, msg.sender, rentalDuration);
    }

    function returnCar(uint256 carId) public {
        require(cars[carId].owner == msg.sender, "Bu aracin sahibi degilsiniz.");
        require(!cars[carId].available, "Arac zaten musait degil.");

        cars[carId].owner = msg.sender;
        cars[carId].available = true;
        cars[carId].availableFrom = 0;
        cars[carId].availableTo = 0;

        emit CarReturned(carId, msg.sender);

        payable(msg.sender).transfer(cars[carId].rentalPricePerHour);
    }

    function getCarAvailability(uint256 carId) public view returns (bool) {
        return cars[carId].available && cars[carId].availableFrom <= block.timestamp;
    }
}
