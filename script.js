"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [250000, 4500, -40000, 30000, -6500, -9300, 70000, 13000],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "USD",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Maryam Saleh",
  movements: [5000, 3400, -150, -790, -3210, -1000, 88500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "NGR",
  locale: "en-US",
};

const account3 = {
  owner: "Abraham Yakubu",
  movements: [20000, -200, 3400, -300, -20, 50, 40000, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Patience Linus",
  movements: [4030, 1000, 7000, 50, 9000],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const printMovement = function (movements, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `<div class="movements__row">
                      <div class="movements__type movements__type--${type}">${
      i + 1
    })  ${type}</div>
                      <div class="movements__value">₦${mov}</div>
                  </div>
        `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `₦${acc.balance}`;
};

// const user = "Abraham yakubu"; // ay
const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((word) => word.at(0))
      .join("");
  });
};
createUserName(accounts);
const calcPrintSummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => mov + acc, 0);
  labelSumIn.textContent = `₦${incomes}`;
  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `₦${Math.abs(out)}`;
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 500;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `₦${interest}`;
};
const updateUI = function (curr) {
  // display movement
  printMovement(curr.movements);
  // display balance
  calcPrintBalance(curr);
  // display summary
  calcPrintSummary(curr);
};
// event listeners
let currentAccount;

btnLogin.addEventListener("click", function (e) {
  // prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  );
  // console.log(currentAccount);
  //?. is optional chaining it will check for pin if only the current account exist
  if (currentAccount?.pin === +inputLoginPin.value) {
    // display UI and the welcome message
    labelWelcome.textContent = `Welcome Back ${
      currentAccount.owner.split(" ")[0]
    }`;

    containerApp.style.opacity = 100;
    // clear the input field
    inputLoginUsername.value = inputLoginPin.value = "";
    // to make the pin losses focus whenn we login
    inputLoginPin.blur();
    // update ui
    updateUI(currentAccount);
  } else {
    alert(" incorrect Username or pin");
  }
});
// transfers
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const reieverAccount = accounts.find(
    (acc) => acc.userName === inputTransferTo.value
  );

  // console.log(amount, reieverAccount);
  inputTransferTo.value = inputTransferAmount.value = "";

  if (
    amount > 0 &&
    reieverAccount &&
    amount <= currentAccount.balance &&
    reieverAccount?.userName !== currentAccount.userName
  ) {
    // confirm
    if (
      window.confirm(
        `Are you sure you want to send ₦${amount} to ${reieverAccount.owner}`
      )
    ) {
      // doing the transer
      currentAccount.movements.push(-amount);
      reieverAccount.movements.push(amount);
      // update ui
      updateUI(currentAccount);
      alert("transaction successful updating account");
    }
  } else alert("transaction Failed (incorrect recipient or insufficient funds) ");
});
// requesting loans(the bank will give a loan if the user has a deposite that is at least 10% of the requested loan amount)
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  if (window.confirm("Are you sure you want to proceed")) {
    const amount = +inputLoanAmount.value;
    if (
      amount > 0 &&
      currentAccount.movements.some((mov) => mov >= amount / 10)
    ) {
      // add movement
      currentAccount.movements.push(amount);
      // update ui
      updateUI(currentAccount);
    } else alert("you did not meat the condition to request a loan");
    inputLoanAmount.value = "";
  } else {
    inputLoanAmount.value = "";
  }
});
// close account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.userName &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.userName === currentAccount.userName
    );
    if (window.confirm("Do you really want to Delete this account")) {
      // console.log(index);
      accounts.splice(index, 1);
      // hind ui
      containerApp.style.opacity = 0;
      inputCloseUsername.value = inputClosePin.value = "";
      labelWelcome.textContent = "Log in to get started";
    } else {
      inputCloseUsername.value = inputClosePin.value = "";
    }
  } else {
    alert("Incorrect information");
  }
});
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  printMovement(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////lectures///
// console.log(23 === 23.0);
// console.log(0.1 + 0.2 === 0.3);
// convert str to numbers
// console.log(Number("23"));
// console.log(+"23");
// // parsing
// console.log(Number.parseInt("30px", 10));
// console.log(Number.parseInt("2.5rem", 10));
// console.log(Number.parseFloat("2.5rem", 10));
// check if value is NAN
// console.log(Number.isNaN(20));
// console.log(Number.isNaN("20"));
// console.log(Number.isNaN(+"20x"));
// best way of checking  a number
// console.log(Number.isFinite(20));
// console.log(Number.isFinite("20"));
// //
// console.log(Number.isInteger(23));
// console.log(Number.isInteger(23.0));
// console.log(Number.isInteger(23.1));
//////////math and rounding
// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));
// console.log(8 ** (1 / 3));
// console.log(Math.max(5, 11, 45, 2, 4, 6));
// console.log(Math.max(5, 11, "45", 2, 4, 6));
// console.log(Math.min(5, 11, "45", 2, 4, 6));
// calculating the area of a circle
// console.log(Math.PI * Number.parseFloat("10px") ** 2);
// console.log(Math.trunc(Math.random() * 6) + 1);
// creating randon number between two numbers
const randonInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min;
console.log(randonInt(10, 20));
//rounding intergals
// console.log(Math.trunc(23.3));
// //
// console.log(Math.round(23.3));
// console.log(Math.round(23.5));
// //
// console.log(Math.ceil(23.3));
// console.log(Math.ceil(23.5));
// //
// console.log(Math.floor(23.3));
// console.log(Math.floor(23.5));
//// floor vs trunc
// console.log(Math.floor(-23.5));
// console.log(Math.trunc(-23.5));
////////rounding decimals////////////
console.log((2.7).toFixed(0));
