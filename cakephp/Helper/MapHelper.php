<?php

namespace App\View\Helper;

use Cake\View\Helper;
use Cake\Utility\Inflector;

class MapHelper extends Helper {
    
    public $view;
    
    public function infoWindow($object = null) {
        $image = SITE_URL . (($object->has('image')) ? $object->image->small_thumb : 'files/images/default.png');
        return '<div style="width: 400px; height:120px;"><img class="detail-img-fluid" src="' . $image . '" alt="' . $object->name . '" style="width: 100px; height: 100px; margin: 10px; float: left;"><h4 style="max-width: 280px; float: left;">' . $object->name . '</h4><p style="max-width: 280px; float: left;"><i class="fa fa-book"></i> ' . $this->addressFormat($object) . '</p><p style="max-width: 280px; float: left;"><i class="fa fa-user"></i> ' . $object->user->name . '</p></div>';
    }
    
    public function addressFormat($object = null, $toShow = true) {
        $addressFields = ['address', 'city_id', 'state_id', 'zip'];
        $address = [];
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
    
    public function marker($object = null, $markerIcon = "https://www.google.com/intl/en_us/mapfiles/ms/micons/green-dot.png") {
        return [$this->infoWindow($object), $object->lat, $object->lng, $markerIcon];
    }
}
