<?php 
namespace DS_Plaid;

class Token {
    function __construct($Plaid) {
        $this->Plaid = $Plaid;
    }


    function publicTokenToAccess($publicToken) {

        $data = [
            "public_token" => $publicToken,
       ]; 
        
       
        $out = $this->Plaid->curl("/item/public_token/exchange", $data);
       
        return $out;
    }

    

 
}
?>