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
  movements: [5000, 3400, -150, -790, -3210, -1000, 88500, -30],
  interestRate: 1.5,
  pin: 2222,
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
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
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
  const amount = Number(inputTransferAmount.value);
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
    confirm(
      `Are you sure you want to send ₦${amount} to ${reieverAccount.owner}`
    );
    // doing the transer
    currentAccount.movements.push(-amount);
    reieverAccount.movements.push(amount);
    // update ui
    updateUI(currentAccount);
  } else alert("transaction Failed");
});
// requesting loans(the bank will give a loan if the user has a deposite that is at least 10% of the requested loan amount)
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount / 10)
  ) {
    // confirm from the user
    confirm("Are you sure you want to proceed");
    // add movement
    currentAccount.movements.push(amount);
    // update ui
    updateUI(currentAccount);
  } else alert("you did not meat the condition to request a loan");
  inputLoanAmount.value = "";
});
// close account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.userName === currentAccount.userName
    );
    confirm("Are you sure you want to delete this account");
    // console.log(index);
    accounts.splice(index, 1);
    // hind ui
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = "";
    labelWelcome.textContent = "Log in to get started";
  }
});
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  printMovement(currentAccount.movements, !sorted);
  sorted = !sorted;
});
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
// console.log(accounts);
// const account = accounts.find((acc) => acc.owner === "Abraham Yakubu");
// console.log(account);
// for (const acc of accounts) {
//   if (acc.owner === "Abraham Yakubu") {
//     console.log(acc);
//   }
// }
////////////////////// some and every///////////////////
// some
// console.log(movements);
// // equality
// console.log(movements.includes(-130));

// // condition
// console.log(movements.some((mov) => mov === -130));
// const anyDeposite = movements.some((mov) => mov > 1500);
// console.log(anyDeposite);
// every
// console.log(movements.every((mov) => mov > 0));
// // seprate calback
// const deposit = (mov) => mov > 0;
///////////////////////////flat and flatmaps//////////////
// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2));
// const accountMovements = accounts.map((acc) => acc.movements);

// const allMovements = accountMovements.flat();
// const overallBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
// flat
// const overallBalance = accounts
//   .map((acc) => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance);
// // flatmap
// const overallBalance2 = accounts
//   .flatMap((acc) => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance2);
/////////////////////////////////// sorting
// const owners = ["abraham", "maryam", "adam", "martha"];
// console.log(owners.sort());
// // numbers
// console.log(movements);
// // console.log(movements.sort());
// //return<0 a,b(keep order)
// // return>0 b,a(switch order)
// // acceding order
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (b > a) return -1;
// });
// // imporved version
// movements.sort((a, b) => a - b);
// console.log(movements);
// // decending order
// // movements.sort((a, b) => {
// //   if (a > b) return -1;
// //   if (b > a) return 1;
// // });
// // improved version
// movements.sort((a, b) => b - a);
// console.log(movements);
///// creating and filling arrays programatically
// empty array + fill
// const x = new Array(7);
// console.log(x);
// // x.fill(1);
// x.fill(1, 3, 5);
// console.log(x);
// // array.from
// // const y = Array.from({ length: 7 }, () => 1);
// // console.log(y);
// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);
// // generating random dice rolls
// // const dice = Array.from(
// //   { length: 101 },
// //   () => Math.trunc(Math.random() * 6) + 1
// // );
// // console.log(dice);

// labelBalance.addEventListener("click", function () {
//   const movementUi = Array.from(
//     document.querySelectorAll(".movements__value"),
//     (el) => Number(el.textContent.replace("₦", ""))
//   );
//   console.log(movementUi);
//   const movementUi2 = [...document.querySelectorAll(".movements__value")];

// });
////////////////////practicing array methods///////////
//1
// const bankDepositeSum = accounts
//   .flatMap((acc) => acc.movements)
//   .filter((mov) => mov > 0)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(bankDepositeSum);
//2
// way one
// const numDeposit10000 = accounts
//   .flatMap((acc) => acc.movements)
//   .filter((mov) => mov > 10000).length;
// console.log(numDeposit10000);
// const numDeposit10000 = accounts
//   .flatMap((acc) => acc.movements)
//   // .reduce((count, curr) => (curr >= 10000 ? count + 1 : count), 0);
//   .reduce((count, curr) => (curr >= 10000 ? ++count : count), 0);
// console.log(numDeposit10000);
// // prefixed ++ oprator
// // let a = 10;
// // console.log(++a);
// // console.log(a);
//3
// const { deposit, withdrawal } = accounts
//   .flatMap((acc) => acc.movements)
//   .reduce(
//     (sums, curr) => {
//       // curr > 0 ? (sums.deposit += curr) : (sums.withdrawal += curr);
//       // another way
//       sums[curr > 0 ? "deposit" : "withdrawal"] += curr;
//       return sums;
//     },
//     { deposit: 0, withdrawal: 0 }
//   );
// console.log(deposit, withdrawal);
//4
// this is a nice tile => This Is a Nice Title
// const convertTileCase = function (title) {
//   const capitalize = (str) => str[0].toUpperCase() + str.slice(1);
//   const exceptions = ["a", "an", "the", "and", "but", "or", "on", "in", "with"];
//   const titleCase = title
//     .toLowerCase()
//     .split(" ")
//     .map((word) => (exceptions.includes(word) ? word : capitalize(word)))
//     .join(" ");
//   return capitalize(titleCase);
// };
// console.log(convertTileCase("this is a nice title"));
// console.log(convertTileCase("this is a LONG title but not too long"));
// console.log(convertTileCase("and heres another title with an EXAMPLE"));
//////////////coding challrnge
// // TEST DATA:
// const dogs = [
//   { weight: 22, curFood: 250, owners: ["Alice", "Bob"] },
//   { weight: 8, curFood: 200, owners: ["Matilda"] },
//   { weight: 13, curFood: 275, owners: ["Sarah", "John"] },
//   { weight: 32, curFood: 340, owners: ["Michael"] },
// ];
// //1
// dogs.forEach(
//   (dog) => (dog.recommemedFood = Math.trunc(dog.weight ** 0.75 * 28))
// );
// console.log(dogs);
// //2
// console.log("/////2//////");
// const sarahCheck = function (arr) {
//   arr.forEach((dog) => {
//     if (dog.owners.includes("Sarah")) {
//       dog.curFood > dog.recommemedFood * 0.9 &&
//       dog.curFood < dog.recommemedFood * 1.1
//         ? console.log("Sarah dog is eating the recommemded food ")
//         : console.log("sarah dog is not eating the recommemded potion");
//       console.log(dog.curFood, dog.recommemedFood);
//     }
//   });
//   // if (dog.owners.includes("Sarah")) {
//   // return dog.curFood > dog.recommemedFood * 90 &&
//   //   dog.curFood < dog.recommemedFood * 1.1
//   //   ? "Sarah dog is eating the recommemded food "
//   //   : "sarah dog is not eating";
//   // }
// };
// sarahCheck(dogs);
// //3
// console.log("/////3//////");
// const ownerEatToLittle = [];
// dogs.forEach((dog) => {
//   if (dog.curFood < dog.recommemedFood * 0.9) {
//     ownerEatToLittle.push(dog.owners);
//   }
// });
// const ownerEatToMuch = [];
// dogs.forEach((dog) => {
//   if (dog.curFood > dog.recommemedFood * 1.1) {
//     ownerEatToMuch.push(dog.owners);
//   }
// });

// console.log(ownerEatToMuch.flat());
// console.log(ownerEatToLittle.flat());
// //4
// console.log("/////4//////");
// console.log(
//   `${ownerEatToLittle}'s dogs eat too little  `.replaceAll(",", " and ")
// );
// console.log(`${ownerEatToMuch}'s dogs eat too Much  `.replaceAll(",", " and "));
// //5
// console.log("/////5//////");
// console.log(dogs.some((dog) => dog.curFood === dog.recommemedFood));

// //6
// const checkEaingRec = (dog) =>
//   dog.curFood > dog.recommemedFood * 0.9 &&
//   dog.curFood < dog.recommemedFood * 1.1;
// console.log("/////6//////");
// console.log(dogs.some(checkEaingRec));
// //7
// console.log("/////7//////");
// const eatingRecommemed = dogs.filter(checkEaingRec);
// console.log(...eatingRecommemed);
// console.log("/////8//////");
// const sort = dogs.slice().sort((a, b) => a.recommemedFood - b.recommemedFood);
// console.log(sort);
