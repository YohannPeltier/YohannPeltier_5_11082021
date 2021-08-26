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

const domaine =
	location.hostname === "localhost" || location.hostname === "127.0.0.1"
		? `http://localhost:3000/` //Local server
		: `https://yohannpeltier.com/OCP5/`; //Remote server

let apiUrl = `${domaine}api/${api.store}`;

const storage = localStorage;

// API call function
const callApi = (url, id, callback) => {
	fetch(url + id)
		.then((responses) => responses.json())
		.then((data) => {
			//console.log("Data collected", data);
			callback(data);
		})
		.catch((err) => {
			callbackError(err);
		});
};
// API call Error
const callbackError = (err) => {
	//console.log(`Check if server run and port is 3000` + err);
	console.log("Remote server connection...");
	apiUrl = `https://yohannpeltier.com/OCP5/api/${api.store}`;
	start();
};

// Générer ID
const makeId = (id, opt) => {
	const formatId = id + opt.replace(/\s/g, "");
	//console.log("Generated id", id);
	return formatId;
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
