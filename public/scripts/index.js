// display of all products
function viewItems(data) {
	const container = document.getElementById("container");
	for (item of data) {
		console.log(item);

		let card = `<a class="card" href="item.html?name=${item.name}">
                        <img class="card__img" src="${item.imageUrl}" alt="${item.name}"/>
                        <span class="card__name">${item.name}</span>
                        <span class="card__price">${item.price}</span>
                        <p class="card__description">${item.description}</p>
                    <a/>`;

		container.innerHTML += card;
	}
}
