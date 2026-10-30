<?php
namespace DS_Plaid;

    class Auth {
        function __construct($Plaid) {
            $this->Plaid = $Plaid;
        }


    function getAccount($accessToken) {
       
        $data = [
            "access_token" => $accessToken
         ]; 
          
              
          $out = $this->Plaid->curl("/auth/get", $data);
         
          return $out;
    }
}
?>