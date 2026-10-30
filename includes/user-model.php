<?php
namespace DS_Plaid;

class User_Model
{
    public $phone_number;
    public $date_of_birth;
    public $ip_address;
    public $email_address;

    public $name;       
    public $first_name;  
    public $last_name;    

    public $address;      
    public $id_number;

    public function __construct(array $data)
    {
        $this->phone_number   = $data['phone_number']   ?? null;
        $this->date_of_birth  = $data['date_of_birth']  ?? null;
        $this->ip_address     = $data['ip_address']     ?? null;
        $this->email_address  = $data['email_address']  ?? null;

        $this->name           = $data['name']           ?? [];
        $this->first_name     = $this->name['given_name']  ?? null;
        $this->last_name      = $this->name['family_name'] ?? null;

        $this->address        = $data['address']        ?? [];
        $this->id_number      = $data['id_number']["value"]      ?? false;
        $this->id_number_type = $data['id_number']["type"]      ?? false;
    }

    public function toArray()
    {
        return [
            'user' => [
                'phone_number'          => $this->phone_number,
                'date_of_birth'         => $this->date_of_birth,
                'ip_address'            => $this->ip_address,
                'email_address'         => $this->email_address,
                'name'                  => $this->name,
                'address'               => $this->address,
                'id_number'             => $this->id_number,
                'id_number_type'        => $this->id_number_type
            ]
        ];
    }

    public function getName() {
        return ["first_name" => $this->first_name, "last_name" => $this->last_name];
    }

    public function getPhone() {
        return $this->phone_number;
    }

    public function getIdNumber() {
        return $this->id_number;
    }

    public function getIdNumberType() {
        return $this->id_number_type;
    }
}

?>