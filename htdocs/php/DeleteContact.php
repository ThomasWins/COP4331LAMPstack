<?php

    $inData = getRequestInfo();

    $userId = $inData["userId"];

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
            returnWithInfo( $row['ID'] );   
            $stmt = $conn->prepare("DELETE FROM contacts WHERE ID=?");
            $stmt->bind_param("s", $row['ID']); //should this be userID?
            $stmt->execute();
        }
        else
        {
            returnWithError("No contact found to delete");
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

    function returnWithInfo($id)
	{
		$retValue = '{"id":' . $id . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}

    function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}  

?>