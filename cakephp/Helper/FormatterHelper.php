<?php

namespace App\View\Helper;

use Cake\View\Helper;

class FormatterHelper extends Helper {

    public $view;

    public function floorPlansForApartmentProfile($fp = null, $fptempData = null) {
        if ($fp != null) {
            $file = false;
            if ($fp->has('tour')) {
                $videoThumb = SITE_URL . $fp->tour->small_thumb;
                if ($fp->tour->file_type == "VIDEO") {
                    $file = SITE_URL . $fp->tour->image;
                }
            } else {
                $videoThumb = SITE_URL . 'files/images/default_video.png';
            }

            $image    = SITE_URL . ($fp->has('image') ? $fp->image->small_thumb : DEFAULT_IMAGE);
            $fileType = ($fp->has('image') ? $fp->image->file_type : 'IMAGE');
            $fileUrl  = SITE_URL . (($fileType == "FILE") ? $fp->image->image : $image);

            if ($fptempData != null) {
                $fp->min_rent = empty($fptempData->min_rent) ? $fp->min_rent : $fptempData->min_rent;
                $fp->max_rent = empty($fptempData->max_rent) ? $fp->max_rent : $fptempData->max_rent;
                $fp->is_available = isset($fptempData->is_available) && $fptempData->is_available == false ? false : true;
                $fp->availability_date = empty($fptempData->availability_date) ? $fp->availability_date : $fptempData->availability_date;
            }

            return [
                'id'                => $fp->id,
                'image'             => $image,
                'file_type'         => $fileType,
                'file_url'          => $fileUrl,
                'video_url'         => $file,
                'video_image'       => $videoThumb,
                'name'              => $fp->name,
                'bedrooms'          => $fp->bedrooms,
                'bathrooms'         => $fp->bathrooms,
                'rent'              => ($fp->min_rent == $fp->max_rent) ? "$" . $fp->min_rent : "$" . $fp->min_rent . " - $" . $fp->max_rent,
                'min_rent'              => $fp->min_rent,
                'max_rent'              => $fp->max_rent,
                'area'              => $fp->min_sqft . " - " . $fp->max_sqft,
                'availability'      => ($fp->is_available) ? "<button class='btn btn-sm btn-success'>Available</button>" : "<button class='btn btn-sm btn-danger'>Not Available</button>",
                'is_available'      => $fp->is_available,
                'availability_date' => ($fp->availability_date) ? date("M d, Y", strtotime($fp->availability_date)) : (($fp->is_available) ? "Immediate" : "Not Available"),
            ];
        }

        return [];
    }

    public function addressFormat($object = null, $toShow = true) {
        $addressFields = ['address', 'city_id', 'state_id', 'zip'];
        $address       = [];
        foreach ($addressFields as $addressField) {
            if (strpos($addressField, '_id') !== false) {
                $relatedModel = str_replace('_id', '', $addressField);
                if ($object->has($relatedModel)) {
                    $address[] = $object->{$relatedModel}->name;
                }
            } else {
                $address[] = $object->{$addressField};
            }
        }
        return implode(", ", array_filter($address));
    }

    public function floorplanTabls($allFloorPlans, $floorPlans) {

        $tabs = [];

        foreach ($allFloorPlans as $fp) {

            $tabs['All Floorplans'][] = $this->floorPlansForApartmentProfile($fp);
        }

        $nTabs = [];

        foreach ($floorPlans as $fp) {

            if (preg_match('/[a-zA-Z]/', $fp->decription)) {
                $index = $fp->decription;
            } else {
                $index = $fp->bedrooms . ($fp->bedrooms == 1 ? " Bedroom" : " Bedrooms");
            }
            $nTabs[$index][] = $this->floorPlansForApartmentProfile($fp);
        }

        ksort($nTabs);

        foreach ($nTabs as $index => $nTab) {
            $tabs[$index] = $nTab;
        }

        return $tabs;
    }

    public function orderApartmentImages($apartmentImages) {
        $imageCategories = [
            'Exterior',
            'Living',
            'Kitchen',
            'Bed',
            'Bath',
            'Business',
            'Clubhouse',
            'Fitness',
            'Pool',
            'Playground',
            'Parking'
        ];

        $images = [];

        foreach ($imageCategories as $cat) {
            foreach ($apartmentImages as $index => $image) {
                if ($image->category == $cat) {
                    $images[] = [
                        'image' => $image->image->image,
                        'small_thumb' => $image->image->small_thumb,
                        'medium_thumb' => $image->image->medium_thumb,
                        'large_thumb' => $image->image->large_thumb,
                    ];

                    unset($apartmentImages[$index]);
                }
            }
        }

        return json_decode(json_encode($images));
    }
}
