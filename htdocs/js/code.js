const urlBase = 'http://proctest.christopherjparrett.xyz/php';
const extension = 'php';



function doLogin()
{
	userId = 0;
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		

				saveCookie();
	
				window.location.href = "contactsPage.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function createAccount()
{
	userId = 0;
	
	let login = document.getElementById("username").value;
	let password = document.getElementById("password").value;
	let confirm = document.getElementById("passwordConfirm").value;
	//	var hash = md5( password );
	if(password==null || password == ""){
	//the user hit button without entering password so we can just fail here
		document.getElementById("createAccountResult").innerHTML = "Please enter a password";
		return;
	}
	else if(password!=confirm){
	//this means that the user input 2 different passwords
		document.getElementById("createAccountResult").innerHTML = "Passwords do not match";
		return;
	}
	document.getElementById("createAccountResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/CreateAccount.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
				err = jsonObject.error;
				
				if(err!=""){
					document.getElementById("createAccountResult").innerHTML = err;
					return;
				}
	
				window.location.href = "index.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function searchContacts(search, page){
	let tmp = {search:search, userId:userId,page:page};
	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + '/SearchContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				
				if(jsonObject.error!=""){
					console.log(err);
					return;
				}
	
				buildTable(jsonObject);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		console.log(err);
	}
}

function buildTable(data){
	const table = document.getElementById('table');
	table.style.visibility = 'visible';
	const tbody = document.getElementById('contactsTableBody');
	for (const row in data){
		var newRow = tbody.insertRow();
		newRow.innerHTML = '<td>'+row.Name+ '</td><td>' + row.Email + '</td><td>+'
		+row.Phone+'</td><td><button type="button" class="settings" onclick="removeContact('+row.ID+
		');">Remove</button><button type="button" class="editContact" onclick="editContact('+row.ID+');">Edit</button></td>'
	}
}
function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	date = "Thu, 01 Jan 1970 00:00:00 GMT";
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");	
		if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
		else if( tokens[0] == "expires"){
			date = Date.parse(tokens[1].trim());
		}
	}
	current = new Date();
	if( userId < 0 || (date<current))
	{
		window.location.href = "index.html";
	}
}

function checkQueries(){
	const urlParams = new URLSearchParams(window.location.search);
	let page = urlParams.get('page');
	const search = urlParams.get('search');
	if(search != null){
		if (page == null)
			page = 1;
		searchContacts(search, page);
	}
}

function signOut()
{
	document.cookie = "userId=-1 ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}