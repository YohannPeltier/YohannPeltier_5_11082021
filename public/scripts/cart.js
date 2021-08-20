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
			if (id === makeId(item._id, item.opt) && storage.getItem(id)) {
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

// Event function on quantity
const changeQty = (event, qty) => {
	// remove the first 4 characters to get the id
	const id = event.target.id.substr(4);
	qty !== 0 ? (qty = parseInt(event.target.value, 10)) : (qty = 0);
	const priceItem = document.getElementById(`pi_${id}`).innerText.replace(/[^0-9.-]+/g, "");
	const totalPriceItem = priceItem * qty;

	myCart.update(id, qty) === "delete"
		? document.getElementById(`i_${id}`).remove()
		: (document.getElementById(`tpi_${id}`).innerText = totalPriceItem.viewPrice());

	myCart.totalPrice > 0 ? (totalPriceCartElmt.innerText = myCart.totalPrice.viewPrice()) : render();
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
		const id = makeId(item._id, item.opt);

		let itemCartElmt = `<tr class="d-block d-md-table-row mb-5 mb-md-0" id="i_${id}">
								<td class="d-block d-md-table-cell table__td" data-label="Produit">${item.name}</td>
								<td class="d-block d-md-table-cell table__td" data-label="Option">${item.opt}</td>
								<td class="d-block d-md-table-cell table__td text-end" data-label="Quantité">
									<input class="table__input text-end" id="qty_${id}" type="number" min="1" value="${item.qty}"/>
								</td>
								<td class="d-block d-md-table-cell table__td text-end" id="pi_${id}" data-label="Prix unitaire">${item.price.viewPrice()}</td>
								<td class="d-block d-md-table-cell table__td text-end" id="tpi_${id}" data-label="Prix total">${totalPriceItem.viewPrice()}</td>
								<td class="d-block d-md-table-cell table__td text-end" data-label="Supprimer">
									<svg xmlns="http://www.w3.org/2000/svg"
										class="bi bi-x-circle text-danger"
										id="del_${id}"
										aria-label="supprimer l'article"
										width="24"
										height="24"
										fill="currentColor"
										viewBox="0 0 16 16"
									>
										<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
										<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path>
									</svg>
								</td>
							</tr>`;
		itemsCartElmt.insertAdjacentHTML("beforeend", itemCartElmt);

		// Event qty change
		document.getElementById(`qty_${id}`).addEventListener("change", (event) => {
			changeQty(event);
		});

		// Event delete change
		document.getElementById(`del_${id}`).addEventListener("click", (event) => {
			changeQty(event, 0);
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
