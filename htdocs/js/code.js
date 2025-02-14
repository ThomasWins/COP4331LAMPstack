const urlBase = 'http://proctest.christopherjparrett.xyz/php';
const extension = 'php';



function doLogin() {
	userId = 0;

	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	//	var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

	let tmp = { login: login, password: password };
	//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;

				if (userId < 1) {
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}


				saveCookie();

				window.location.href = "contactsPage.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function createAccount() {
	userId = 0;

	let login = document.getElementById("username").value;
	let password = document.getElementById("password").value;
	let confirm = document.getElementById("passwordConfirm").value;
	//	var hash = md5( password );
	if (password == null || password == "") {
		//the user hit button without entering password so we can just fail here
		document.getElementById("createAccountResult").innerHTML = "Please enter a password";
		return;
	}
	else if (password != confirm) {
		//this means that the user input 2 different passwords
		document.getElementById("createAccountResult").innerHTML = "Passwords do not match";
		return;
	}
	document.getElementById("createAccountResult").innerHTML = "";

	let tmp = { login: login, password: password };
	//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/CreateAccount.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;
				err = jsonObject.error;

				if (err != "") {
					document.getElementById("createAccountResult").innerHTML = err;
					return;
				}

				window.location.href = "index.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function countContacts(search, page) {
	let tmp = { search: search, userId: userId };
	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + '/CountContacts.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);

				if (jsonObject.error != "") {
					console.log(jsonObject.error);
					return;
				}
				setArrows(jsonObject.count, page);
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		console.log(err);
	}
}

function searchContacts(search, page) {
	countContacts(search, page);
	let tmp = { search: search, userId: userId, page: page };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/SearchContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);

				if (jsonObject.error != "") {
					console.log(jsonObject.error);
					return;
				}

				buildTable(jsonObject);
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		console.log(err);
	}
}

function setArrows(count, page){
	if (count == 0) {
		document.getElementById("searchError").innerHTML = "There don't seem to be any search results matching that criteria"
	}
	else if (count < (page - 1) * 10) {
		window.location.href = "contactsPage.html?search=" + search + "&page=" + Math.ceil(count / 10);
	}
	if (page > 1)
		document.getElementById("page-back").style.visibility = "visible";
	if (count > (page) * 10)
		document.getElementById("page-for").style.visibility = "visible";
}

function pageForward(){
	const urlParams = new URLSearchParams(window.location.search);
	let page = parseInt(urlParams.get('page'));
	if (page == null)
		page = 1;
	const query = urlParams.get('search');
	if (search != null) {
		search(query, page.parseInt+1);
	}
}

function pageBack(){
	const urlParams = new URLSearchParams(window.location.search);
	let page = urlParams.get('page');
	const query = urlParams.get('search');
	if (search != null) {
		search(query, page-1);
	}
}

function addContact(){
	let name = document.getElementById('ContactName').value;
	let email = document.getElementById('ContactEmail').value;
	let phone = document.getElementById('ContactPhone').value;
	let tmp = {userId: userId, name: name, phone: phone, email: email};
	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + '/AddContact.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);

				if (jsonObject.error != "") {
					console.log(jsonObject.error);
					return;
				}

				window.location.reload(true);
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		console.log(err);
	}
}

function updateContact(){
	let name = document.getElementById('ContactName2').value;
	let email = document.getElementById('ContactEmail2').value;
	let phone = document.getElementById('ContactPhone2').value;
	let id = document.getElementById('EditContact').dataset.id;
	let tmp = {id: id, name: name, phone: phone, email: email};
	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + '/UpdateContact.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);

				if (jsonObject.error != "") {
					console.log(jsonObject.error);
					return;
				}

				window.location.reload(true);
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		console.log(err);
	}
}

function removeContact(id){
	let tmp = {id: id};
	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + '/DeleteContact.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);

				if (jsonObject.error != "") {
					console.log(jsonObject.error);
					return;
				}

				window.location.reload(true);
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		console.log(err);
	}
}

function buildTable(data) {
	const table = document.getElementById('table');
	table.style.visibility = 'visible';
	table.style.minHeight = 'max-content';
	const tbody = document.getElementById('contactsTableBody');
	for (const index in data.results) {
		row = data.results[index];
		var newRow = tbody.insertRow();
		newRow.innerHTML =
			'<td>' + row.Name + '</td>' +
			'<td>' + row.Email + '</td>' +
			'<td>' + row.Phone + '</td>' +
			'<td>' +
			'<button type="button" id="remove_' + row.ID + '" class="settings" onclick="removeContact(' + row.ID + ');">Remove</button>' +
			'<button type="button" id="edit_' + row.ID + '" class="editContact" onclick="editContact(' + row.ID + ', \'' + row.Name + '\', \'' + row.Email + '\', \'' + row.Phone + '\');">Edit</button>' +
		'</td>';

	}
}
function saveCookie() {
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime() + (minutes * 60 * 1000));
	document.cookie = "userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
	userId = -1;
	let date = "Thu, 01 Jan 1970 00:00:00 GMT";
	let data = document.cookie;
	let splits = data.split(",");
	for (var i = 0; i < splits.length; i++) {
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if (tokens[0] == "userId") {
			userId = parseInt(tokens[1].trim());
		}
		else if (tokens[0] == "expires") {
			date = Date.parse(tokens[1].trim());
		}
	}
	current = new Date();
	if (userId < 0 || (date < current)) {
		window.location.href = "index.html";
	}
}

function checkQueries() {
	const urlParams = new URLSearchParams(window.location.search);
	let page = urlParams.get('page');
	const search = urlParams.get('search');
	if (search != null) {
		if (page == null)
			page = 1;
		searchContacts(search, page);
	}
}

function search(search, page = 1) {
	window.location.href = "//contactsPage.html?search=" + search + "&page=" + page;
}

function signOut() {
	document.cookie = "userId=-1 ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}
function editContact(id, name, email, phone) {
	const popup2 = document.getElementById('popup2');
	const closePopupButton2 = document.getElementById('closePopup2');

	// Open the popup
	document.getElementById('ContactName2').value = name;
	document.getElementById('ContactEmail2').value = email;
	document.getElementById('ContactPhone2').value = phone;
	document.getElementById('EditContact').dataset.id = id
	popup2.style.display = 'flex';

	// Close the popup
	closePopupButton2.addEventListener('click', () => {
		popup2.style.display = 'none';
		document.getElementById('ContactName2').value = "";
		document.getElementById('ContactEmail2').value = "";
		document.getElementById('ContactPhone2').value = "";
		document.getElementById('EditContact').dataset.id = null;
	});

	// Close the popup when clicking outside the content
	popup2.addEventListener('click', (e) => {
		if (e.target === popup2) {
			popup2.style.display = 'none';
		}
	});
}

