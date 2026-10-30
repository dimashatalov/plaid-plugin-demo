<?php
namespace DS_Plaid;

class Kyc_Model {

    private $data = [];

    public function __construct(array $data) {
        $this->data = $data;
    }

    public function isNameMatch(): bool {
        return $this->getSummary('name') === 'match';
    }

    public function isDobMatch(): bool {
        return $this->getSummary('date_of_birth') === 'match';
    }

    public function isIdNumberMatch(): bool {
        return $this->getSummary('id_number') === 'match';
    }

    public function isPhoneMatch(): bool {
        return $this->getSummary('phone_number') === 'match';
    }

    public function isAddressMatch(): bool {
        return $this->getSummary('address') === 'match';
    }

    public function isPhoneAreaCodeMatch(): bool {
        return $this->data['phone_number']['area_code'] === 'match';
    }

    public function getStatus(): ?string {
        return $this->data['status'] ?? null;
    }

    private function getSummary(string $field): ?string {
        return $this->data[$field]['summary'] ?? null;
    }
}
?>