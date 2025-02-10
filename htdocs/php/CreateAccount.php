<?php

    $inData = getRequestInfo();
        
    $id = 0;
    $username = $inData["loginName"];
    $password = $inData["loginPassword"];

    $conn = new mysqli("localhost", "Group16", "CM205Lamp", "contact_manager");
    if( $conn->connect_error )
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $stmt = $conn->prepare("SELECT ID FROM users WHERE Username=?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();

        if( $row = $result->fetch_assoc())
        {
            returnWithError("Account Already Exist!");
        }
        else
        {
            $stmt = $conn->prepare("INSERT into users (Username,Password) VALUES(?,?)");
            $stmt->bind_param("ss", $username, $password);
            $stmt->execute();
            returnWithError("");
        }
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
	
	function returnWithInfo($id)
	{
		$retValue = '{"id":' . $id . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	

?>