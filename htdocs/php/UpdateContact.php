<?php

    $inData = getRequestInfo();

    $Id = $inData["Id"];
    $name = $inData["name"];
    $phone = $inData["phone"];
    $email = $inData["email"];

    $conn = new mysqli("localhost", "Group16", "CM2025Lamp!", "contact_manager");
    if($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $stmt = $conn->prepare("SELECT ID FROM contacts WHERE ID=?");
        $stmt->bind_param("i", $Id);
        $stmt->execute();
        $result = $stmt->get_result();

        if($row = $result->fetch_assoc())
        {
            $stmt = $conn->prepare("UPDATE contacts SET (Email,Phone,Name) VALUES(?,?,?) WHERE ID=?");
            $stmt->bind_param("sssi", $email, $phone, $name, $Id);
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