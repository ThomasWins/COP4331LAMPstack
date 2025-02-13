<?php

	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "Group16", "CM2025Lamp!", "contact_manager");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("SELECT COUNT(*) FROM contacts WHERE Name LIKE ? AND UserID=?");
		$name = "%" . $inData["search"] . "%";
		$stmt->bind_param("si", $name, $inData["userId"]);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			$searchCount = $row["COUNT(*)"];
		}
		
		returnWithInfo( $searchCount);
		
		$stmt->close();
		$conn->close();
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
		$retValue = '{"id":0,"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
    function returnWithInfo( $searchCount )
	{
		$retValue = '{"count":' . $searchCount . ',"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
	
?>
