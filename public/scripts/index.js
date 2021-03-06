let myItems = {};

const saveData = (data) => {
	myItems = data;
	render();
};

// Show all products
const render = () => {
	const container = document.getElementById("container");
	for (item of myItems) {
		let card = `<div class="col">
						<a class="card text-dark text-decoration-none shadow" href="item.html?id=${item._id}">
							<img class="card-img-top cover-fit h-7" src="${item.imageUrl}" alt="${item.name}"/>
							<div class="card-body">
								<h4 class="card-title">${item.name}</h4>
								<h5 class="card-title">${item.price.viewPrice()}</h5>
								<p class="card-text">${item.description}</p>
							</div>
						</a>
					</div>`;
		container.insertAdjacentHTML("beforeend", card);
	}
};

// Render all products
const start = () => callApi(apiUrl, "", saveData);
document.readyState !== "loading" ? start() : document.addEventListener("DOMContentLoaded", () => start());
