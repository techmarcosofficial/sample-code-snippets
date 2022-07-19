<?php

namespace App\Traits;

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use Illuminate\Support\Str;


trait ExportCsv {
    public function exportFile($params) {

        $objects = $params['objects'];
        $headings = [];
        foreach ($params['fields'] as $field) {
            $f  = $this->readyField($field);
            $fields[] = $f;
            $headings[] = $f['label'];
        }

        $lines[] = $headings;

        $fileName = ($params['file_name'] ?? uniqid()) . '.csv';

        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename=' . $fileName);
        header('Pragma: no-cache');
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        header('Expires: 0');

        try {
            foreach ($objects as $obj) {
                $row = [];
                foreach ($fields as $f) {
                    $row[] = $this->fieldValue($obj, $f);
                }
                $lines[] = $row;
            }
            $file = fopen('php://output', 'w');

            foreach ($lines as $line) {
                fputcsv($file, $line);
            }

            fclose($file);
        } catch (\Exception $e) {
            echo json_encode([
                'status' => 'error',
                'message' =>  $e->getMessage()
            ]);
            exit;
        }
    }

    public function readyField($field) {
        return [
            'name' => $field['name'],
            'label' => $field['label'] ?? $this->snake2word($field['name']),
            'related_model_fields' => $field['related_model_fields'] ?? [],
            'related_model' => $field['related_model'] ?? "",
            'separator' => $field['separator'] ?? " ",
        ];
    }

    public function snake2word($str) {
        return ucwords(str_replace('_', ' ', $str));
    }


    function fieldValue($obj, $field) {
        if (!empty($field['join'])) {
            foreach ($field['join'] as $name) {
                $values[] = $this->getValue($obj, $field, $name);
            }
            $values = array_filter($values);
            $objectFieldValue = implode(empty($field['separator']) ? " " : $field['separator'], $values);
        } else {
         $objectFieldValue = $this->getValue($obj, $field, $field['name']);
        }

        return $objectFieldValue;

    }

    function getValue($obj, $field) {

        $objectFieldValue = "";
        if (!empty($field['sub_field'])) {
            return $obj->{$field['name']}->{$field['sub_field']};
        } else {

            if (strpos($field['name'], '_id') !== false || !empty($field['related_model'])) {
                $relatedModel = empty($field['related_model']) ? str_replace('_id', '', $field['name']) : $field['related_model'];
                if (!empty($obj->{$relatedModel})) {
                    if (!empty($field['related_model_fields'])) {
                        $values = [];
                        foreach ($field['related_model_fields'] as $thirdModel => $f) {
                            if (is_array($f)) {
                                if (!empty($obj->{$relatedModel}->{$thirdModel})) {
                                    foreach ($f as  $fs) {
                                        $values[] = $obj->{$relatedModel}->{$thirdModel}->{$fs};
                                    }
                                }
                            } else {
                                $values[] = $obj->{$relatedModel}->{$f};
                            }
                        }
                        return implode(empty($field['separator']) ? " " : $field['separator'], $values);
                    } else {
                        return $obj->{$relatedModel}->name;
                    }
                } else {
                    return $obj->{$field['name']};
                }
            } else {
                return $obj->{$field['name']};
            }
        }

        return $objectFieldValue;
    }
}
