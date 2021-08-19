const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const itemId = `/${urlParams.get("id")}`;
let myItem = {};

const saveData = (data) => {
	myItem = data;
	render();
};

// Add to cart function
const addToCart = () => {
	let id = myItem._id + myItem.opt;
	if (storage.getItem(id)) {
		myItem.qty += storage.getObj(id).qty;
	}
	myItem.qty < 1 ? storage.removeItem(id) : storage.setObj(id, myItem);
};

// Product render
function render() {
	const noItemElmt = document.getElementById("noItem");
	const itemElmt = document.getElementById("item");
	let selectOption = "";

	if (myItem.name) {
		document.title += ` - ${myItem.name}`;
		itemElmt.innerHTML = "";

		// Detail the options
		for (option in myItem[api.opt]) {
			selectOption += `<option value="${myItem[api.opt][option]}">${myItem[api.opt][option]}</option>`;
		}

		card = `<div class="card text-dark text-decoration-none shadow">
					<img class="card-img-top" src="${myItem.imageUrl}" alt="${myItem.name}"/>
					<div class="card-body">
						<h4 class="card-title">${myItem.name}</h4>
						<h5 class="card-title">${myItem.price.viewPrice()}</h5>
						<p class="card-text">${myItem.description}</p>
					</div>
					<ul class="list-group list-group-flush text-center text-sm-start">
    					<li class="list-group-item">
							<div class="row">
								<label for="option" class="col-sm-5 col-md-4 col-form-label">Choisissez une option</label>
								<div class="col-sm-7 col-md-8">
									<select name="option" id="option" class="form-select" aria-label="${myItem[api.opt][0]}">
										${selectOption}
									</select>
								</div>
							</div>
						</li>
						<li class="list-group-item">
							<div class="row">
								<label for="qty" class="col-sm-5 col-md-4 col-form-label">Quantité</label>
								<div class="col-sm-7 col-md-8">
									<input type="number" class="form-control" id="qty" min="1" value="1">
								</div>
							</div>
						</li>
					</ul>
					<div class="card-body text-center d-grid gap-3 col-6 mx-auto">
						<div>
							<button class="btn btn-primary" id="addToCart">Ajouter au panier</button>
						</div>
						<div id="goToCard">
						<div>
					</div>
				</div>`;
		itemElmt.insertAdjacentHTML("beforeend", card);

		// Event to add to cart
		document.getElementById("addToCart").addEventListener("click", (event) => {
			myItem.opt = document.getElementById("option").value;
			myItem.qty = parseInt(document.getElementById("qty").value, 10);
			let goToCart = `<a class="btn btn-success" href="/cart.html">Accéder au panier</a>`;
			let goToCartElmt = document.getElementById("goToCard");
			goToCartElmt.innerHTML = "";
			goToCartElmt.insertAdjacentHTML("beforeend", goToCart);
			addToCart();
		});

		// Show product
		noItemElmt.classList.add("d-none");
		itemElmt.classList.remove("d-none");
	}
}

// Run product render
callApi(apiUrl, itemId, saveData);
