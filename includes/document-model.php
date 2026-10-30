<?php
namespace DS_Plaid;

class Document_Model
{
    public string $status;
    public int $attempt;
    public array $images;
    public array $extractedData;
    public array $analysis;
    public ?string $redactedAt;

    public function __construct(array $data)
    {
        $this->status = $data['status'] ?? '';
        $this->attempt = $data['attempt'] ?? 0;

        $this->images = $data['images'] ?? [];

        $this->extractedData = [
            'id_number'       => $data['extracted_data']['id_number'] ?? '',
            'category'        => $data['extracted_data']['category'] ?? '',
            'expiration_date' => $data['extracted_data']['expiration_date'] ?? '',
            'issuing_country' => $data['extracted_data']['issuing_country'] ?? '',
            'issuing_region'  => $data['extracted_data']['issuing_region'] ?? '',
            'date_of_birth'   => $data['extracted_data']['date_of_birth'] ?? '',
            'name' => [
                'first_name'  => $data['extracted_data']['name']['given_name'] ?? '',
                'last_name'   => $data['extracted_data']['name']['family_name'] ?? '',
            ],
            'address' => [
                'street'      => $data['extracted_data']['address']['street'] ?? '',
                'city'        => $data['extracted_data']['address']['city'] ?? '',
                'region'      => $data['extracted_data']['address']['region'] ?? '',
                'postal_code' => $data['extracted_data']['address']['postal_code'] ?? '',
                'country'     => $data['extracted_data']['address']['country'] ?? '',
            ]
        ];

        $this->analysis = [
            'authenticity'   => $data['analysis']['authenticity'] ?? '',
            'image_quality'  => $data['analysis']['image_quality'] ?? '',
            'name_match'     => $data['analysis']['extracted_data']['name'] ?? '',
            'dob_match'      => $data['analysis']['extracted_data']['date_of_birth'] ?? '',
            'expiration'     => $data['analysis']['extracted_data']['expiration_date'] ?? '',
            'country_match'  => $data['analysis']['extracted_data']['issuing_country'] ?? ''
        ];

        $this->redactedAt = $data['redacted_at'] ?? null;
    }

    public function isVerified() {
        if ($this->status == "success" OR $this->status == "manually_approved") {
            return true;
        }
        else {
            return false;
        }
    }

    public function isNameMatch() {
        if ($this->analysis["name_match"] == "match") {
            return true;
        }
        else {
            return false;
        }
    }

    public function getName() {
        return $this->extractedData["name"];
    }

    public function getFullName() {
        $fullName = $this->extractedData["name"]["first_name"];

        if (!empty($this->extractedData["name"]["last_name"])) {

            $fullName .= " " . $this->extractedData["name"]["last_name"];
        }

        return $fullName;
    }

    public function getArray() {
        return $this->extractedData;   
    }
}
