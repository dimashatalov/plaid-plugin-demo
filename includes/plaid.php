<?php 
namespace DS_Plaid;


class Plaid {
    function __construct($settings) {
        $this->settings = $settings;
    }


    function test() {
        echo "TEST";
        exit();
    }
    

   
    function curl($apiRequest, $postArray) {

        $postArray["client_id"] = $this->settings["client_id"];
        $postArray["secret"] = $this->settings["secret"];
        
        $jsonString = json_encode($postArray);

        $url = 'https://sandbox.plaid.com' . $apiRequest;
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_POST, TRUE);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));

        curl_setopt($curl, CURLOPT_POSTFIELDS, $jsonString);

        $data = curl_exec($curl);

   
        curl_close($curl);    
        
        return json_decode($data,1);
    }   
    
    
}
?>