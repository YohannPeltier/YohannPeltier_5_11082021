/*
// Classe Cart
*/

class Cart {
	#regexp;
	constructor() {
		this.items = [];
		this.products = [];
		this.contact = {};
		this.totalPrice = 0;
		this.#regexp = {
			lastName: /^(([a-zA-ZÀ-ÿ]+[\s\-]{1}[a-zA-ZÀ-ÿ]+)|([a-zA-ZÀ-ÿ]+))$/,
			firstName: /^(([a-zA-ZÀ-ÿ]+[\s\-]{1}[a-zA-ZÀ-ÿ]+)|([a-zA-ZÀ-ÿ]+))$/,
			email: /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([_\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/,
			address: /^(([a-zA-ZÀ-ÿ0-9_]+[\s\-][a-zA-ZÀ-ÿ0-9_]+)|([a-zA-ZÀ-ÿ0-9_]+)){1,10}$/,
			city: /^(([a-zA-ZÀ-ÿ]+[\s\-]{1}[a-zA-ZÀ-ÿ]+)|([a-zA-ZÀ-ÿ]+)){1,10}$/,
		};
	}

	// Collect items to localStorage
	create = () => {
		for (let storageId in storage) {
			storage.getItem(storageId) ? this.items.push(storage.getObj(storageId)) : false;
		}
		return this.items[0] ? true : false;
	};

	// Update qty
	update = (id, qty) => {
		let state = "update";
		let itemKey;
		this.totalPrice = 0;
		this.items.forEach((item, key) => {
			if (id === item._id + item.opt && storage.getItem(id)) {
				item.qty = qty;
				item.qty > 0 ? storage.setObj(id, item) : (itemKey = key);
			}
			this.totalPrice += item.price * item.qty;
		});
		if (itemKey !== undefined) {
			this.items.splice(itemKey, 1);
			storage.removeItem(id);
			state = "delete";
		}
		return state;
	};

	// Validate contact informations for submit Cart
	validateForm = () => {
		return new Promise((resolve, reject) => {
			for (let index in this.#regexp) {
				!this.#regexp[index].test(this.contact[index]) ? reject() : false;
			}
			resolve();
		});
	};

	// Submit Cart
	submit = (callback) => {
		this.items.forEach((item) => this.products.push(item._id));

		let contact = this.contact;
		let products = this.products;
		let order = { contact, products };

		fetch(apiUrl + "/order", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(order),
		})
			.then((response) => response.json())
			.then((data) => (data.orderId ? callback(data) : false))
			.catch((err) => callbackError(err));
	};

	// Clear Cart
	clear = () => {
		this.items = [];
		this.products = [];
		this.contact = {};
		this.totalPrice = 0;
		storage.clear();
	};
}

const noItemElmt = document.getElementById("noItem");
const cartElmt = document.getElementById("cart");
const formElmt = document.getElementById("form");
const itemsCartElmt = document.getElementById("itemsCart");
const totalPriceCartElmt = document.getElementById("totalPrice");
const buttonElmt = document.getElementById("sendCart");

// Show success order message
const successOrder = (data) => {
	myCart.clear();
	const orderElmt = document.getElementById("order");
	orderElmt.innerHTML = `<div class="alert alert-success mb-0" role="alert">
								Votre commande est validé<br/><br/><br/>Commande n° :<br/><br/>${data.orderId}
	  						</div>`;
	render();
};

// Show cart
const render = () => {
	myCart.totalPrice = 0;
	// Hide cart
	cartElmt.classList.add("d-none");
	formElmt.classList.add("d-none");
	buttonElmt.classList.add("d-none");
	noItemElmt.classList.remove("d-none");
	itemsCartElmt.innerHTML = "";
	totalPriceCartElmt.innerText = "";

	// Show each line of the cart
	myCart.items.forEach((item) => {
		let totalPriceItem = item.price * item.qty;
		myCart.totalPrice += totalPriceItem;

		let itemCartElmt = `<tr class="d-block d-md-table-row mb-5 mb-md-0" id="i_${item._id + item.opt}">
								<td class="d-block d-md-table-cell table__td" data-label="Produit">${item.name}</td>
								<td class="d-block d-md-table-cell table__td" data-label="Option">${item.opt}</td>
								<td class="d-block d-md-table-cell table__td text-end" data-label="Quantité">
									<input class="table__input text-end" id="${item._id + item.opt}" type="number" min="1" value="${item.qty}"/>
								</td>
								<td class="d-block d-md-table-cell table__td text-end" id="pi_${
									item._id + item.opt
								}" data-label="Prix unitaire">${item.price.viewPrice()}</td>
								<td class="d-block d-md-table-cell table__td text-end" id="tpi_${
									item._id + item.opt
								}" data-label="Prix total">${totalPriceItem.viewPrice()}</td>
							</tr>`;
		itemsCartElmt.insertAdjacentHTML("beforeend", itemCartElmt);

		// Event when qty change
		document.getElementById(item._id + item.opt).addEventListener("change", (event) => {
			let qty = parseInt(event.target.value, 10);
			let priceItem = document.getElementById(`pi_${item._id + item.opt}`).innerText.replace(/[^0-9.-]+/g, "");
			let totalPriceItem = priceItem * qty;

			myCart.update(event.target.id, qty) === "delete"
				? document.getElementById(`i_${item._id + item.opt}`).remove()
				: (document.getElementById(`tpi_${item._id + item.opt}`).innerText = totalPriceItem.viewPrice());

			myCart.totalPrice > 0 ? (totalPriceCartElmt.innerText = myCart.totalPrice.viewPrice()) : render();

			console.log(myCart);
		});
	});

	// Show total price
	totalPriceCartElmt.innerText = myCart.totalPrice.viewPrice();

	// Event on submit cart
	buttonElmt.addEventListener("click", (event) => {
		// Disable button native event
		event.preventDefault();
		event.stopPropagation();

		myCart.contact = {
			firstName: document.getElementById("firstName").value,
			lastName: document.getElementById("lastName").value,
			email: document.getElementById("inputEmail").value,
			address: document.getElementById("inputAddress").value,
			city: document.getElementById("inputCity").value,
		};

		// Validate contact data
		myCart.validateForm().then(
			() => myCart.submit(successOrder),
			() => {
				document.getElementById("needs-validation").checkValidity();
				form.classList.add("was-validated");
			}
		);
	});
	// Show cart
	if (myCart.totalPrice > 0) {
		noItemElmt.classList.add("d-none");
		cartElmt.classList.remove("d-none");
		formElmt.classList.remove("d-none");
		buttonElmt.classList.remove("d-none");
	}
};

// Run cart render
let myCart = new Cart();
myCart.create();
document.readyState !== "loading" ? render() : window.addEventListener("DOMContentLoaded", () => render());
