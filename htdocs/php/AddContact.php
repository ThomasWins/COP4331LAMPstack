<?php
	$inData = getRequestInfo();
	
	$name = $inData["name"];
    $email = $inData["email"];
    $phone = $inData["phone"];
	$userId = $inData["userId"];

	$conn = new mysqli("localhost", "Group16 ", "CM2025Lamp!", "contact_manager");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into contacts (UserId,Name,Email,Phone) VALUES(?,?,?,?)");
		$stmt->bind_param("isss", $userId, $name, $email, $phone);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>