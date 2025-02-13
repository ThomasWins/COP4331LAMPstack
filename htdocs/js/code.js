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
	console.log(data);
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
	console.log(data<current);
	console.log(userId + " " + date);
	if( userId < 0 || (date<current))
	{
		window.location.href = "index.html";
	}
	else
	{
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function signOut()
{
	document.cookie = "userId=-1 ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}