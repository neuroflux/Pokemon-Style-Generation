<?php

$myFile = "pets.txt";
	
if ($_GET["action"] == "save") {
	$thePet = $_GET["data"];
	
	file_put_contents($myFile, "|\r\n".$thePet, FILE_APPEND);

	echo "200ok";
} elseif ($_GET["action"] == "load") {
	$handle = fopen($myFile, "r");
	if ($handle) {
		while (($buffer = fgets($handle, 4096)) !== false) {
			if ($buffer != "" && $buffer != " " && $buffer != "\r\n") {
				echo $buffer;
			}
		}
		fclose($handle);
	}
}

?>