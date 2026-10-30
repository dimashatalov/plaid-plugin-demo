<?php
namespace DS_Plaid;

use  \DS_Plaid\Document_Model;
use  \DS_Plaid\User_Model;
use  \DS_Plaid\Kyc_Model;

class Verified_Identity {

    function __construct($Plaid) {
       $this->Plaid = $Plaid;

       $this->verifiedDocuments = false;
       $this->documents         = [];
       $this->user              = [];
       $this->kyc               = [];
    }


    function getData($link_session_id, $useTestFile = true) {
    
     
        if ($useTestFile) {
       
            $jsonString = file_get_contents(get_template_directory()  . '/test_identity_verification.json');
            $out = json_decode($jsonString, true);

        } 
        else {       
 
          

            $data = [
                "identity_verification_id" =>  $link_session_id
            ];      
            
            $out = $this->Plaid->curl("/identity_verification/get", $data);

 
        }
              
        if (empty($out)) {
            $_SESSION["user_uuid"] = false;
            return false;
        }

        if ($this->validated($out) === false) {
            return false;
        }

        $this->mapDocuments($out);
        $this->mapUser($out);
        $this->mapKyc($out);

        $out = $this->mapOutput($out);
    
        if (empty($out["documents"])) {
            $_SESSION["user_uuid"] = false;
            return false;
        } 

        

        return $out;
        
    }


    public function validated($out) {
        if (empty($out["steps"])) {
            return false;
        }

        $failed = false;


        $steps_to_verify = [
            "accept_tos",
            "kyc_check",
            "verify_sms",
            "risk_check"
        ];


        /*
            We are checking failed steps to allow some steps to be "fail"
        */

        foreach ($steps_to_verify as $stepIndex) {
            if (empty($out["steps"][$stepIndex])) {
                return false;
            }

            if ($out["steps"][$stepIndex] == "failed") {
                return false;
            }
        }

        /*
           [accept_tos] => success
            [documentary_verification] => not_applicable
            [kyc_check] => success
            [risk_check] => failed
            [selfie_check] => not_applicable
            [verify_sms] => success
            [watchlist_screening] => not_applicable
        */      
      

        if (empty($out["status"])) {
            return false;
        }

        
        if ($out["status"] == "failed") {
            return true;
        }
 
     
        if ($failed === false) {
            return true;
        }
    }


    public function mapDocuments($data) {
        $docs = [];
 
        if (!empty($data["documentary_verification"]["documents"])) {

            $documents = $data["documentary_verification"]["documents"];

            foreach ($documents as $doc) {
                
                $docs[] = new Document_Model($doc);
            }
        }

       $this->documents = $docs;
    }

    public function mapUser($data) {
        if (!empty($data["user"])) {
            $this->user = new User_Model($data["user"]);
        }
        else {
            return $this->user = false;
        }
    }

    public function mapKyc($data) {
        if (!empty($data["kyc_check"])) {
            $this->kyc = new Kyc_Model($data["kyc_check"]);
        }
        else {
            return $this->kyc = false;
        }
    }    

    public function mapOutput($data) {
        $out = [];
        

        $out["user_name"] = $this->getName($data) ?? false;
        $out["phone"]     = $this->getPhone($data) ?? false;
        $out["documents"] = $this->getDocumentsForOutput($data) ?? false;
 
        return $out;
    }

    function getDocumentsForOutput() {
        $docs = $this->getVerifiedDocuments();
        $out  = [];

        if (!empty($docs)) {
            foreach ($docs as $doc) {
                $out[] = $doc->getArray();        
            }
        }

        // Add id number
        if ($this->kyc->isIdNumberMatch() === true) {
            $out[] = [
                "id_number" => $this->user->getIdNumber(),
                "category"  => $this->user->getIdNumberType()
            ];
        }

        return $out;
    }

    function getVerifiedDocuments() {

        $docs = [];
        if ($this->verifiedDocuments != false) {
            return $this->verifiedDocuments;
        }

        if (!empty($this->documents)) {
       
            foreach ($this->documents as $doc) {
                if ($doc->isVerified() === true) {
                    $docs[] = $doc;
                }
            }
        }

        $this->verifiedDocuments = $docs;

        return $this->verifiedDocuments;
    }

    function isDocNameMatch($doc) {
        if (
            !empty($doc["analysis"]["extracted_data"]["name"]) AND 
            $doc["analysis"]["extracted_data"]["name"] == "match") {
                return true;
        }
        else {
            return false;
        }
    }

 
    function getPhone($data) {

        $phone = false;
        if ($this->kyc->isPhoneMatch()) {
            $phone = $this->user->getPhone();
        }

        if (empty($phone)) {
            // Let's check SMS verifications just in case
            if (!empty($data["verify_sms"]["verifications"])) {
                foreach ($data["verify_sms"]["verifications"] as $row) {
                    $status =  $row['status']  ?? false;

                    if ($status == "success") {
                        $phone = $row['phone_number']  ?? false;

                        if ($phone != false) {
                            break;
                        }
                    }
                }
            }

        }

        return $phone;
    }

    function getName($data) {

        $unMatchName = '';

        // Let's try to extract from matched document
        $documents = $this->getVerifiedDocuments();

        if (!empty($documents)) {
            foreach ($documents as $doc) {
             
                if ($doc->isNameMatch()) {
                   
                    $name = $doc->getName();

                    if (empty($name)) {
                        continue;
                    }
 
                    return $name;

                }
                else {
                    $unMatchName = $doc->getName();
                }
            
            }
        }


        // Extract from user input if match
        $name = false;

        if (!empty($data["kyc_check"]["name"])) {          
            if ($data["kyc_check"]["name"]["summary"] == "match") {                                            
                $name = $this->user->getName();
            }
        }

        if ($name  === false AND !empty($unMatchName)) {
            return $unMatchName;
        }
        else
        if ($name != false) {
            return $name;
        }
        else {
            return false;
        }
    }
}
?>