<?php

    $inData = getRequestInfo();

    $userId = $inData["userId"];
    $name = $inData["name"];
    $phone = $inData["phone"];
    $email = $inData["email"];

    $conn = new mysqli("localhost", "Group16", "CM205Lamp", "contact_manager");
    if($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $stmt = $conn->prepare("SELECT ID FROM contacts WHERE ID=?");
        $stmt->bind_param("s", $userId);
        $stmt->execute();
        $result = $stmt->get_result();

        if($row = $result->fetch_assoc())
        {
            $stmt = $conn->prepare("UPDATE contacts (Email,Phone,Name) VALUES(?,?,?)");
            $stmt->bind_param("sss", $email, $phone, $name);
            $stmt->execute();
        }
        else
        {
            returnWithError("No Contact found by ID");
        }
        $stmt->close();
        $conn->close();
    }

    function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

    function returnWithError( $err )
	{
		$retValue = '{"id":0,"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

?>