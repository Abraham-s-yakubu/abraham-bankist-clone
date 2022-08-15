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
};

const account2 = {
  owner: "Maryam Saleh",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Abraham Yakubu",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Patience Linus",
  movements: [430, 1000, 700, 50, 90],
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

const printMovement = function (movements) {
  containerMovements.innerHTML = "";
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `<div class="movements__row">
                      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
                      <div class="movements__value">${mov}₦</div>
                  </div>
        `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

printMovement(account1.movements);
const calcPrintBalance = function (movement) {
  const balance = movement.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${balance}₦`;
};
calcPrintBalance(account1.movements);
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
const calcPrintSummary = function (movements) {
  const incomes = movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => mov + acc, 0);
  labelSumIn.textContent = `${incomes}₦`;
  const out = movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}₦`;
  const interest = movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * account1.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 500;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}₦`;
};
calcPrintSummary(account1.movements);
// console.log(username);
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// let arr = ['a', 'b', 'c', 'd', 'e'];
// // console.log(arr.slice(2));
// // console.log(arr.slice(2, 4));
// // console.log(arr.slice(-1));
// // console.log(arr.slice(-2));
// // console.log(arr.slice(1, -2));
// // console.log(arr.slice());
// // splice
// console.log(arr.splice(-1));
// console.log(arr);
// console.log(arr.splice(1, 2));
// console.log(arr);
// //////////////////////reverse
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);
// // concat
// const letter = arr.concat(arr2);
// console.log(letter);
// console.log([...arr, ...arr2]);
// // join
// console.log(letter.join('-'));
///////////////////AT method
// const arr = [23, 11, 64];
// console.log(arr[0]);
// console.log(arr.at(0));
// // geting the lst element
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);
// console.log(arr.at(-1));
// console.log('abraham'.at(-1));
/////////////////////////////// for each method loop
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// // for (const movement of movements) {
// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`movement ${i + 1}: you deposited ${movement}`);
//   } else {
//     console.log(`movement ${i + 1}: you withdrew ${Math.abs(movement)}`);
//   }
// }
// console.log('---------for each-------------');
// // for each
// movements.forEach(function (mov, i, array) {
//   if (mov > 0) {
//     console.log(`movement ${i + 1}: you deposited ${mov}`);
//   } else {
//     console.log(`movement ${i + 1}: you withdrew ${Math.abs(mov)}`);
//   }
// });
// // 0: function(200)
// // 1: function(450)
// // 2: function(400)
// //...
///////////////// for each  maps
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);
// currencies.forEach(function (value, key, map) {
//   console.log(`${key}:${value}`);
// });
// //set
// const currenciesUnique = new Set([
//   'USD',
//   'GBP',
//   'USD',
//   'NGR',
//   'FRA',
//   'EUR',
//   'EUR',
// ]);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, _value, map) {
//   console.log(`${_value}:${value}`);
// });
//////// coding challenge
// const checkDogs = function (dogJulia, dogsKate) {
//   // const juliaCorrect = dogJulia.slice(1, 3);
//   const juliaCorrect = dogJulia.slice();
//   juliaCorrect.splice(0, 1);
//   juliaCorrect.splice(-2);
//   // console.log(juliaCorrect);
//   const allDogs = juliaCorrect.concat(dogsKate);
//   allDogs.forEach(function (dog, i) {
//     const dogAge =
//       dog >= 3
//         ? `dog number ${i + 1} is an adult, and ${dog} years Old 🐕 `
//         : `dog number ${i + 1} is still a puppy 🐶`;
//     console.log(dogAge);
//   });
// };
// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// console.log("////////////////////////");
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);
///// map method
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const dollarToNgr = 0.0024;
// // const movementusd = movements.map(function (mov) {
// //   return mov * dollarToNgr;
// // });
// // using arrowfunction
// const movementusd = movements.map((mov) => mov * dollarToNgr);
// console.log(movements);
// console.log(movementusd);
// const movementsUsdFor = [];
// for (const mov of movements) {
//   movementsUsdFor.push(mov * dollarToNgr);
// }
// // console.log(movementsUsdFor);
// const movementDescriptions = movements.map(
//   (mov, i) =>
//     `movement ${i + 1}: you ${mov > 0 ? "deposited" : "withdrew"} ${Math.abs(
//       mov
//     )}`
// );
// console.log(movementDescriptions);
/////////// filter method/
// const deposits = movements.filter(function (mov, i, arr) {
//   return mov > 0;
// });
// const withdrawals = movements.filter((mov) => mov < 0);
// console.log(withdrawals);
// console.log(deposits);
// console.log(movements);
///////// reduce method ////
// const balance = movements.reduce(function (acc, curr, i, arr) {
//   console.log(acc);
//   return acc + curr;
// }, 0);
// const balance = movements.reduce((acc, curr, i, arr) => acc + curr, 0);
// console.log(balance);
// // maximum value
// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) return acc;
//   else return mov;
// }, movements[0]);
// console.log(max);
////////// coding challenge/////////
// const calcAverageHumanAge = function (Ages) {
//   const humanAge = Ages.map((dog) => (dog <= 2 ? 2 * dog : 16 + dog * 4));
//   console.log(humanAge);
//   const adultDogs = humanAge.filter((age) => age >= 18);
//   console.log(adultDogs);
//   // const TotalHumanAge =
//   //   adultDogs.reduce((acc, age) => acc + age, 0) / adultDogs.length;
//   // another way of calculating average
//   const TotalHumanAge = adultDogs.reduce(
//     (acc, age, i, arr) => acc + age / arr.length,
//     0
//   );

//   return TotalHumanAge;
// };
// const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// console.log("/////////////////");
// const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
////////// coding challenge 3//
// const calcAverageHumanAge = (ages) =>
//   ages
//     .map((dog) => (dog <= 2 ? 2 * dog : 16 + dog * 4))
//     .filter((age) => age >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
// const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// // console.log("/////////////////");
// const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// console.log(avg1, avg2);
// // chaining methods//
// const dollarToNgr = 0.0024;
// const totalDepositInUsd = movements
//   .filter((mov) => mov > 0)
//   .map((mov) => mov * dollarToNgr)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(movements);
// console.log(totalDepositInUsd);
/////////////////////////////////find method/////////
// const firstWithdrawal = movements.find((mov) => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);
console.log(accounts);
