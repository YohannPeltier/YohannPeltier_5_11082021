// Choose the type of store
const store = "cameras";

// Array of different store
const apiOptions = {
	teddies: "colors",
	cameras: "lenses",
	furniture: "varnish",
};

// Quick access to the store and its option
const api = {
	store: store,
	opt: apiOptions[store],
};

const apiUrl = `http://localhost:3000/api/${api.store}`;

const storage = localStorage;

// API call function
const callApi = (url, id, callback) => {
	fetch(url + id)
		.then((responses) => responses.json())
		.then((data) => {
			callback(data);
		})
		.catch((err) => {
			callbackError(err);
		});
};
// API call Error
const callbackError = (err) => {
	console.log(`Check if server run and port is 3000` + err);
};

// Change number to price
Number.prototype.viewPrice = function () {
	let price = Intl.NumberFormat("fr-FR", {
		style: "currency",
		currency: "EUR",
		minimumFractionDigits: 2,
	}).format(this / 100);
	return price;
};

// Add the objects to localstorage
Storage.prototype.setObj = function (key, obj) {
	return this.setItem(key, JSON.stringify(obj));
};
Storage.prototype.getObj = function (key) {
	return JSON.parse(this.getItem(key));
};
