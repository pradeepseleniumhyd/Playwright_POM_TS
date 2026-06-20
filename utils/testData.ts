export const TestData = {
  users: {
    standard: {
      username: 'standard_user',
      password: 'secret_sauce',
    },
    locked: {
      username: 'locked_out_user',
      password: 'secret_sauce',
    },
    problem: {
      username: 'problem_user',
      password: 'secret_sauce',
    },
    performance: {
      username: 'performance_glitch_user',
      password: 'secret_sauce',
    },
  },
  errorMessages: {
    usernameRequired: 'Epic sadface: Username is required',
    passwordRequired: 'Epic sadface: Password is required',
    invalidCredentials: 'Epic sadface: Username and password do not match any user in this service',
    lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
  },
  urls: {
    baseUrl: 'https://www.saucedemo.com/',
    inventory: 'https://www.saucedemo.com/inventory.html',
    cart: 'https://www.saucedemo.com/cart.html',
  },
  products: {
    backpack: {
      name: 'Sauce Labs Backpack',
      id: 'sauce-labs-backpack',
      price: '$29.99',
    },
    bikeLight: {
      name: 'Sauce Labs Bike Light',
      id: 'sauce-labs-bike-light',
      price: '$9.99',
    },
    boltTShirt: {
      name: 'Sauce Labs Bolt T-Shirt',
      id: 'sauce-labs-bolt-t-shirt',
      price: '$15.99',
    },
    fleeceJacket: {
      name: 'Sauce Labs Fleece Jacket',
      id: 'sauce-labs-fleece-jacket',
      price: '$49.99',
    },
    onesie: {
      name: 'Sauce Labs Onesie',
      id: 'sauce-labs-onesie',
      price: '$7.99',
    },
    redTShirt: {
      name: 'Test.allTheThings() T-Shirt (Red)',
      id: 'test.allthethings()-t-shirt-(red)',
      price: '$15.99',
    },
  },
  productLists: {
    all: [
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Onesie',
      'Test.allTheThings() T-Shirt (Red)',
    ],
    popular: [
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Fleece Jacket',
    ],
    budget: [
      'Sauce Labs Onesie',
      'Sauce Labs Bike Light',
    ],
  },
};
