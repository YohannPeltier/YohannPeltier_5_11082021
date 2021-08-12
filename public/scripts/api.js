let url = "http://localhost:3000/api/furniture";

fetch(url)
	// if success convert responses to json
	.then((responses) => responses.json())
	// call data to viewItems()
	.then((data) => {
		viewItems(data);
	})
	// if error call callbackError()
	.catch((err) => {
		callbackError(err);
	});

// function called if error
function callbackError(err) {
	alert(err);
}
