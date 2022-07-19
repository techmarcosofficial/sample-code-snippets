<?php

namespace App\Traits;


trait LatLng {

    public function getLatLng($address = []) {
        if (!empty($address)) {
            //Send request and receive json data by address
            if (is_array($address)) {
                $formattedAddress = str_replace(' ', '+', implode(" ", $address));
            } else {
                $formattedAddress = str_replace(' ', '+', $address);
            }

            if (!empty($formattedAddress)) {
                $geocodeFromAddr = file_get_contents('https://maps.googleapis.com/maps/api/geocode/json?address=' . $formattedAddress . '&key=' . env('GOOGLE_MAP_KEY'));

                $output = json_decode($geocodeFromAddr);

                if (!empty($output->results)) {

                    /*Get latitude and longitute from json data*/
                    $lat = $output->results[0]->geometry->location->lat;
                    $lng = $output->results[0]->geometry->location->lng;

                    /*Return latitude and longitude of the given address*/
                    if (!empty($lat) && !empty($lng)) {
                        return [
                            'lat' => $lat,
                            'lng' => $lng,
                        ];
                    }
                }
            }
        }

        return [];
    }
}
