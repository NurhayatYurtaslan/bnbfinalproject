// Web3 ile Ethereum ağına bağlanma
const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

// Akıllı sözleşme adresi ve ABI
const contractAddress = '0x123456789ABCDEF';
const contractABI = [...];

// Akıllı sözleşme örneği oluşturma
const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

// Kullanıcı giriş durumunu takip etmek için değişkenler
let isLoggedIn = false;
let currentUser = '';

// Kullanıcı girişi işlevi
function login(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Kullanıcı giriş işlemi burada gerçekleştirilir

    isLoggedIn = true;
    currentUser = username;

    document.getElementById('loginPanel').style.display = 'none';
    document.getElementById('carList').style.display = 'block';
    loadCars();
}

// Araba listesini yükleme işlevi
async function loadCars() {
    const carList = document.getElementById('cars');
    carList.innerHTML = '';

    // Akıllı sözleşmeden arabaların listesini alın ve ekrana ekleyin
    const cars = await contractInstance.methods.getAllCars().call();

    cars.forEach((car) => {
        const carElement = document.createElement('div');
        carElement.className = 'car';

        const carImage = document.createElement('img');
        carImage.src = car.image;
        carImage.alt = car.name;

        const carDetails = document.createElement('p');
        carDetails.innerHTML = `<strong>${car.name}</strong><br>Price: ${car.price} ETH`;

        const purchaseButton = document.createElement('button');
        purchaseButton.textContent = 'Purchase';
        purchaseButton.addEventListener('click', () => {
            showPurchaseForm(car);
        });

        carElement.appendChild(carImage);
        carElement.appendChild(carDetails);
        carElement.appendChild(purchaseButton);

        carList.appendChild(carElement);
    });
}

// Satın alma formunu gösterme işlevi
function showPurchaseForm(car) {
    document.getElementById('carList').style.display = 'none';
    document.getElementById('purchaseForm').style.display = 'block';

    const selectedCarImage = document.getElementById('selectedCarImage');
    const selectedCarDetails = document.getElementById('selectedCarDetails');
    const purchaseButton = document.getElementById('purchaseButton');

    selectedCarImage.src = car.image;
    selectedCarImage.alt = car.name;
    selectedCarDetails.innerHTML = `<strong>${car.name}</strong><br>Price: ${car.price} ETH`;

    purchaseButton.addEventListener('click', () => {
        purchaseCar(car);
    });
}

// Araba satın alma işlevi
function purchaseCar(car) {
    // Akıllı sözleşme üzerinden araba satın alma işlemi burada gerçekleştirilir

    // Satın alma işlemi tamamlandıktan sonra cüzdandan ödeme yapılır

    document.getElementById('purchaseForm').style.display = 'none';
    document.getElementById('carList').style.display = 'block';
    loadCars();
}

// Kullanıcı çıkışı işlevi
function logout() {
    isLoggedIn = false;
    currentUser = '';

    document.getElementById('loginPanel').style.display = 'block';
    document.getElementById('carList').style.display = 'none';
    document.getElementById('purchaseForm').style.display = 'none';
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', login);
});
