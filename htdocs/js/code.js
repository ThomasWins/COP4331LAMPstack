


function CheckSamePass()
{
	
	let password = document.getElementById("password").value;
	let confirm = document.getElementById("passwordConfirm").value;

	if(password==null || password == ""){
	//the user hit button without entering password so we can just fail here
		document.getElementById("LoginResult").innerHTML = "Please enter a password";
		return;
	}
	else if(password!=confirm){
	//this means that the user input 2 different passwords
		document.getElementById("LoginResult").innerHTML = "Passwords do not match";
		return;
	}
	else{
		document.getElementById("LoginResult").innerHTML = "Success";
		//put in a function here to send user and pass to database to save it
		//we need to make sure if the username already exists it doesnt get overwritten
		return;
	
	
	
	}
}
