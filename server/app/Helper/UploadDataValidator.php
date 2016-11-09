<?php

namespace App\Helper;

class UploadDataValidator
{
    private $crude_data;
    private $refined_data;

    public function __construct(array $crude_data)
    {
        $this->crude_data = $crude_data;
        $this->refined_data = array("success" => [], "error" => []);
        if (!isset($crude_data[0][0])) {
            $this->crude_data = [$crude_data];
        }
    }

    public function checkForNulls(array $row, array $required_keys)
    {
        $entry = array_filter($row);
        $null_keys = array_diff($required_keys, array_keys($entry));
        return !(count($null_keys) > 0);
    }

    public function validateAndRefineUploadedExcel(array $required_keys)
    {
        foreach ($this->crude_data as $sheet_key => $sheet) {
            foreach ($sheet as $row_key => $row) {
                $diff = array_diff($required_keys, array_keys($row));
                if (!count($diff)) {
                    if ($this->checkForNulls($row, $required_keys)) {
                        array_push($this->refined_data["success"], $row);
                    } else {
                        $row['error_msg'] = 'A required entry is left empty';
                        array_push($this->refined_data["error"], $row);
                    }
                }
            }
        }

        return $this->refined_data;
    }
}
