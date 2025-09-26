<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class HubspotController extends Controller {

    public $clientId = 'df28a5f2-87ad-4781-9510-f548b8cefa63';
    public  $clientSecret = '0046ce8a-c330-4d95-bfe1-386f556f007f';
    public  $redirectUri = 'https://devapi.subpop.marcos/hubspot-redirect';

    public function hook() {
        pr($_REQUEST);
        pr($_POST);
        Log::info('Message=> ', $_REQUEST);
        Log::info('Message=> ', $_POST);
        file_put_contents(public_path('hubspot.txt'), json_encode($_REQUEST), FILE_APPEND);
        file_put_contents(public_path('hubspot.txt'), json_encode(['post' => $_POST]), FILE_APPEND);

        // takes raw data from the request 
        $json = file_get_contents('php://input');
        // Converts it into a PHP object 
        $data = json_decode($json, true);

        Log::info('JOSN ', $data);
        file_put_contents(public_path('hubspot.txt'), json_encode(['json' => $data]), FILE_APPEND);

        return true;
    }

    public function authorizeMe() {


        file_put_contents(public_path('hubspot.txt'), json_encode(['json' => $_REQUEST]));
    }

    public function invoices() {


        echo "Invoices Listings will be here";
        exit;
    }

    public function redirectHere(Request $request) {

        if (!empty($request->query('code'))) {
            $this->getAccessToken($request->query('code'));
        }

        exit;
    }

    public function card(Request $request) {

        // file_put_contents(public_path('hubspot.txt'), json_encode(['json' => $_REQUEST]));
        /*
            {
                "json": {
                "userId": "45791963",
                "userEmail": "ssingh@techmarcos.com",
                "associatedObjectId": "9033069371",
                "associatedObjectType": "COMPANY",
                "portalId": "22256809"
                }
        }
        */

        $result = [
            "results" =>  [
                [
                    "objectId" =>  $request->query('hs_object_id'),
                    "title" => $_REQUEST['userEmail'],
                    "created" => date('Y-m-d'),

                    "properties" => [
                        [
                            "label" => "User ID",
                            "dataType" => "STRING",
                            "value" => $_REQUEST['userId'],
                        ],
                        [
                            "label" => "Object Type",
                            "dataType" => "STRING",
                            "value" => $_REQUEST['associatedObjectType'],
                        ]
                    ],
                    "actions" => [
                        [
                            "type" => "IFRAME",
                            "width" => 890,
                            "height" => 748,
                            "uri" => 'https://devapi.subpop.marcos/hubspot-invoices',
                            "label" => "Invoice History"
                        ]
                    ]
                ]
            ]
        ];

        return response($result, 200);

        //        file_put_contents(public_path('hubspot.txt'), json_encode(['json' => $_REQUEST]));
    }

    function getAccessToken($code) {

        $vars = [

            'grant_type' => 'authorization_code',
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret,
            'redirect_uri' => $this->redirectUri,
            'code' => $code
        ];

        //pr(http_build_query($vars)); die;

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://api.hubapi.com/oauth/v1/token");
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($vars));  //Post Fields
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $headers = [
            'Content-Type: application/x-www-form-urlencoded',
            'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36;'
        ];

        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        $output = curl_exec($ch);

        curl_close($ch);

        $output;

        file_put_contents(public_path('hubspot-access-token.txt'), $output);
    }
}
