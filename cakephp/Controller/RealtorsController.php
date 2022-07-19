<?php

namespace App\Controller;

use Cake\Http\Client;
use Cake\I18n\Number;

class RealtorsController extends AppController {

    public function initialize() {
        parent::initialize();
        
        $this->Auth->allow(['add', 'setWorkingCities']);
        $this->loadModel('Users');
        
    }

    public function add() {
        $this->autoRender   = false;
        $this->responseCode = CODE_BAD_REQUEST;

        if ($this->request->is('post')) {

            $user                             = $this->Users->newEntity();
            $user->role                       = 'Realtor';
            $user->registration_steps_done    = 3;
            $user->first_name                 = $this->request->getData('first_name');
            $user->last_name                  = $this->request->getData('last_name');
            $user->company                    = $this->request->getData('company');
            $user->email                      = $this->request->getData('email');
            $user->password                   = $this->request->getData('password');
            $user->phone                      = $this->request->getData('phone');
            $user->how_did_you_find_us        = $this->request->getData('how_did_you_find_us');
            $user->address                    = $this->request->getData('address');
            $user->city_id                    = $this->request->getData('city_id');
            $user->state_id                   = $this->request->getData('state_id');
            $user->zip                        = $this->request->getData('zip');
            $user->apartment_special_priority = $this->request->getData('apartment_special_priority');
            $user->apartment_replies_priority = $this->request->getData('apartment_replies_priority');
            $user->website                    = $this->request->getData('website');
            $user->created                    = date(SQL_DATETIME);
            $user->modified                   = date(SQL_DATETIME);
            $user->active                     = -1;
            if ($this->Users->save($user)) {

                //Add User Market Places
                if (!empty($this->request->getData('market_places'))) {
                    $this->loadModel('UserMarketPlaces');
                    $marketPlaces = [];
                    foreach ($this->request->getData('market_places') as $mp) {
                        $marketPlaces[] = [
                            'user_id'         => $user->id,
                            'market_place_id' => $mp,
                            'status'          => true,
                        ];
                    }
                    if (!empty($marketPlaces)) {
                        $userMarketPlaces = $this->UserMarketPlaces->newEntities($marketPlaces);
                        $this->UserMarketPlaces->saveMany($userMarketPlaces);
                    }
                }

                //Add User States
                $this->loadModel('UserStates');
                $userStates = $this->UserStates->newEntity();

                $userStates->user_id        = $user->id;
                $userStates->state_id       = $this->request->getData('state_licensed_in');
                $userStates->licence_number = $this->request->getData('licence_number');

                $this->UserStates->save($userStates);


                //Add User Cities
                if (!empty($this->request->getData('city'))) {
                    $this->loadModel('UserCities');
                    $cities = [];
                    foreach ($this->request->getData('city') as $city) {
                        $cities[] = [
                            'user_id'  => $user->id,
                            'state_id' => $userStates->state_id,
                            'city_id'  => $city,
                        ];
                    }
                    $userCities = $this->UserCities->newEntities($cities);
                    $this->UserCities->saveMany($userCities);
                }

                $options = [
                    'template' => 'admin_realtor_signup',
                    'to'       => ADMIN_EMAIL_FOR_REALTOR,
                    'subject'  => _('New REA Sign Up Notification'),
                    'viewVars' => [
                        'email' => $user->email,
                    ],
                ];

                $this->loadComponent('EmailManager');
                try {
                    $this->EmailManager->sendEmail($options);
                    $this->responseCode    = SUCCESS_CODE;
                    $this->responseMessage = __('Successfully Registered.');
                } catch (\Error $e) {
                    $this->responseMessage = __('Something Went Wrong, could not send email.');
                }
            } else {
                if ($user->hasErrors()) {
                    foreach ($user->getErrors() as $errors) {
                        foreach ($errors as $err) {
                            $error = $err;
                        }
                    }
                }

                if (empty($error)) {
                    $this->responseMessage = __('The apartment could not be saved. Please, try again.');
                } else {
                    $this->responseMessage = __($error);
                }
            }
        } else {
            $this->responseMessage = __('Something went wrong. Please, try again.');
        }

        echo $this->responseFormat();
        exit;
    }

    public function addStateLicensedIn() {
        $id = $this->Auth->user('id');
        if ($this->request->is('post')) {
            //Add User States
            $this->loadModel('UserStates');
            $userStates = $this->UserStates->find()->where([
                'state_id' => $this->request->getData('state_id'),
                'user_id'                                                  => $id
            ])->first();
            if (empty($userStates)) {
                $userStates = $this->UserStates->newEntity();

                $userStates->user_id        = $id;
                $userStates->state_id       = $this->request->getData('state_id');
                $userStates->licence_number = $this->request->getData('licence_number');

                if ($this->UserStates->save($userStates)) {
                    $this->Flash->success(__('The licensed state added successfully.'));
                }
            } else {
                $this->Flash->error(__('State licensed has already been added, you can add/edit active cities for the state.'));
            }
        } else {
            $this->Flash->error(__('Something went wrong. Please, try again.'));
        }
        return $this->redirect(['action' => 'stateLicensedIn']);
    }

    public function addSecondChanceProperty() {

        $this->loadModel('States');
        $this->loadModel('Cities');

        if ($this->request->is(['patch', 'post', 'put'])) {
            $data           = $this->request->getData();
            $addressArray[] = $data['address'];

            if (!empty($data['city_id'])) {
                $city           = $this->Cities->get($data['city_id']);
                $addressArray[] = $city->name;
            }

            if (!empty($data['state_id'])) {
                $state          = $this->States->get($data['state_id']);
                $addressArray[] = $state->name;
            }

            $address = implode(", ", array_filter($addressArray));
            $address = empty($address) ? "NA" : $address;

            $this->loadComponent('EmailManager');

            $user = $this->Auth->user();
            //Send Email
            $options = [
                'template' => 'second_chance_property_by_realtor',
                'to'       => UPDATES_EMAIL,
                'subject'  => 'Second Chance Property - ' . SITE_TITLE,
                'viewVars' => [
                    'realtorName'   => $user['first_name'] . " " . $user['last_name'],
                    'realtorEmail'  => $user['email'],
                    'apartmentName' => $data['name'],
                    'address'       => $address,
                    'phone'         => empty($data['phone']) ? "NA" : $data['phone'],
                    'email'         => empty($data['email']) ? "NA" : $data['email'],
                    'details'       => empty($data['details']) ? "NA" : $data['details'],

                ],
            ];

            $this->EmailManager->sendEmail($options);

            return $this->redirect(['action' => 'dashboard', "?second-chance-property=thank-you"]);
        }

        $states = $this->States->find('list')->where(['States.status' => true])->order(['States.name' => 'ASC'])->toArray();
        $cities = [];

        $this->set(compact('apartment', 'cities', 'states'));
    }

    public function apartmentProfile() {
        $apartmentId                  = $this->getRequest()->getData('apartmentId');
        $apartmentIndexFromSearchPage = $this->getRequest()->getData('index');
        $markedFavorite               = $this->getRequest()->getData('markedFavorite');
        $clientId                     = $this->getRequest()->getData('clientId');
        $customerSearchId             = $this->getRequest()->getData('customerSearchId');

        $data = $this->getRequest()->getData();
        $this->viewBuilder()->setLayout(false);
        $this->loadModel('Apartments');
        $this->loadModel('SearchedApartments');
        $this->loadModel('Customers');

        $apartment = $this->Apartments->find('all')->contain([
            'Users'              => ['Images', 'States', 'cities'],
            'Cities',
            'States',
            'FloorPlans',
            'Competitors',
            'ApartmentAmenities' => ['Amenities'],
            'ApartmentPetPolicies',
            'ApartmentWasherDryerConnections',
            'ApartmentParking',
            'ApartmentIncomeDetails',
            'ApartmentImages'    => ['Images'],
        ])
            ->where(['Apartments.id' => $apartmentId])
            ->first();

        $client = $this->Customers->find('all')->where(['Customers.id' => $clientId])->first();

        $searchedApartment = $this->SearchedApartments->find()
            ->contain(['CustomerRegistrations'])
            ->where([
                'SearchedApartments.apartment_id'       => $apartmentId,
                'SearchedApartments.customer_search_id' => $customerSearchId,
            ])
            ->first();

        $this->loadModel('FloorPlans');

        $floorPlanConditions[] = ['FloorPlans.apartment_id' => $apartmentId];

        foreach ($data as $key => $searchValue) {
            if (!empty($searchValue)) {
                switch ($key) {
                    case 'bedrooms': {
                            $floorPlanConditions[] = ($searchValue == "5+") ? ['FloorPlans.bedrooms >=' => $searchValue] : ['FloorPlans.bedrooms' => $searchValue];
                            break;
                        }
                    case 'bathrooms': {
                            if ($searchValue != "Any") {
                                $floorPlanConditions[] = ($searchValue == "5+") ? ['FloorPlans.bathrooms >=' => $searchValue] : ['FloorPlans.bathrooms' => $searchValue];
                            }
                            break;
                        }
                    case 'minRent': {
                            $floorPlanConditions[] = ['FloorPlans.min_rent >=' => $searchValue - (($searchValue * 10) / 100)];
                            break;
                        }
                    case 'maxRent': {
                            if ($searchValue != "5000+") {
                                $floorPlanConditions['OR'][] = ['FloorPlans.max_rent <=' => $searchValue + (($searchValue * 10) / 100)];
                                $floorPlanConditions['OR'][] = ['FloorPlans.min_rent <=' => $searchValue + (($searchValue * 10) / 100)];
                            }
                            break;
                        }
                }
            }
        }
        $floorPlans = $this->FloorPlans->find('all')
            ->contain(['Images', 'Tours'])
            ->where($floorPlanConditions)
            ->order(['FloorPlans.min_sqft' => 'ASC'])
            ->all();

        $allFloorPlans = $this->FloorPlans->find('all')
            ->contain(['Images', 'Tours'])
            ->where(['FloorPlans.apartment_id' => $apartmentId])
            ->order(['FloorPlans.min_sqft' => 'ASC'])
            ->all();

        $this->loadModel('UpdateInfoRequests');
        $updateInfoRequest = $this->UpdateInfoRequests->find()
            ->where([
                'UpdateInfoRequests.apartment_id' => $apartmentId,
                'UpdateInfoRequests.user_id' => $this->Auth->user('id'),
                'UpdateInfoRequests.customer_id' => $clientId,
                'UpdateInfoRequests.info_updated' => false
            ])
            ->first();

        $this->set('bedrooms', empty($this->request->getData('bedrooms')) ? 0 : $this->request->getData('bedrooms'));
        $this->set('minRent', empty($this->request->getData('minRent')) ? 0 : $this->request->getData('minRent'));
        $this->set('maxRent', empty($this->request->getData('maxRent')) ? 0 : $this->request->getData('maxRent'));
        $this->set('moveDate', empty($this->request->getData('moveDate')) ? 0 : $this->request->getData('moveDate'));
        $this->set('floorPlans', $floorPlans);
        $this->set('allFloorPlans', $allFloorPlans);
        $this->set('markedFavorite', $markedFavorite);
        $this->set('apartmentIndexFromSearchPage', $apartmentIndexFromSearchPage);
        $this->set('client', $client);
        $this->set('searchedApartment', $searchedApartment);
        $this->set('customerSearchId', $customerSearchId);
        $this->set('updateInfoRequest', $updateInfoRequest);
        $this->set('apartment', $apartment);
    }

    public function apartmentProfileLookUp() {
        $apartmentId = $this->getRequest()->getData('apartmentId');

        $this->viewBuilder()->setLayout(false);
        $this->loadModel('Apartments');

        $apartment = $this->Apartments->find('all')->contain([
            'Users'              => ['Images', 'States', 'cities'],
            'Cities',
            'States',
            'FloorPlans',
            'Competitors',
            'ApartmentAmenities' => ['Amenities'],
            'ApartmentPetPolicies',
            'ApartmentWasherDryerConnections',
            'ApartmentParking',
            'ApartmentIncomeDetails',
            'ApartmentImages'    => ['Images'],
        ])
            ->where(['Apartments.id' => $apartmentId])
            ->first();

        $this->loadModel('FloorPlans');

        $allFloorPlans = $this->FloorPlans->find('all')
            ->contain(['Images', 'Tours'])
            ->where(['FloorPlans.apartment_id' => $apartmentId])
            ->order(['FloorPlans.min_sqft' => 'ASC'])
            ->all();

        $floorPlans = $allFloorPlans;

        $this->set('floorPlans', $floorPlans);
        $this->set('allFloorPlans', $allFloorPlans);
        $this->set('apartment', $apartment);
    }

    public function dashboard() {
        $this->loadModel('CustomerSearches');
        $totalSearches = $this->CustomerSearches->find()->contain(['Customers' => ['Users']])->where(['Users.id' => $this->Auth->user('id')])->count();
        $this->set('totalSearches', $totalSearches);

        $totalSearchesApartments = $this->CustomerSearches->find()->select(['total_apartments_searched' => 'SUM(CustomerSearches.no_of_selected_apartments)'])->contain(['Customers' => ['Users']])->where(['Users.id' => $this->Auth->user('id')])->first();
        $this->set('totalSearchesApartments', $totalSearchesApartments->total_apartments_searched);

        $realtor = $this->Users->find('all')->contain([
            'Cities',
            'States'
        ])->where(['Users.id' => $this->Auth->user('id')])->first();

        $this->set('realtor', $realtor);

        $this->loadModel('UserMarketPlaces');
        $userMarketPlaces = $this->UserMarketPlaces->find('list', [
            'keyField' => 'id',
            'valueField'                                                          => 'market_place_id'
        ])
            ->where(['UserMarketPlaces.user_id' => $this->Auth->user('id')])->all()->toarray();

        $this->loadModel('MarketPlaces');

        if (!empty($userMarketPlaces)) {

            $marketPlaces = $this->MarketPlaces->find('all')
                ->select([
                    'MarketPlaces.id',
                    'MarketPlaces.name',

                ])
                ->contain(['MarketPlaceCities' => function ($q) {
                    return $q->select([
                        'MarketPlaceCities.market_place_id',
                        'MarketPlaceCities.city_id',
                        'Cities.name'
                    ])->contain(['Cities'])->order(['Cities.name' => 'ASC']);
                }])
                ->where(['MarketPlaces.id IN' => array_values($userMarketPlaces)])
                ->enablehydration(false)
                ->all();

            $this->set('marketPlaces', $marketPlaces);
        }
    }

    
    public function index() {
        return $this->redirect(['action' => 'dashboard']);
    }

   
    //Save search for future use
    public function saveSearch() {
        $this->autoRender   = false;
        $this->responseCode = CODE_BAD_REQUEST;
        if ($this->request->is('post')) {

            $this->loadModel('Apartments');
            $this->loadModel('Customers');
            $this->loadModel('CustomerSearches');
            $this->loadModel('SearchedApartments');

            parse_str($this->getRequest()->getData('search_parameters'), $parameters);

            $customerSearchId = $this->getRequest()->getData('customer_search_id');

            $newCustomerSearch = $this->CustomerSearches->find('all')->where(['id' => $customerSearchId])->first();

            if (empty($newCustomerSearch)) {
                $newCustomerSearch = $this->CustomerSearches->newEntity();
            }

            $newCustomerSearch->customer_id = $this->getRequest()->getSession()->read('clientId');
            $newCustomerSearch->bedrooms    = empty($parameters['bedrooms']) ? 0 : $parameters['bedrooms'];
            $newCustomerSearch->city_id     = empty($parameters['city_id']) ? 0 : $parameters['city_id'];
            if (!empty($this->getRequest()->getData('move_date'))) {
                $newCustomerSearch->move_date = $this->getRequest()->getData('move_date');
                $customer = $this->Customers->find()->where(['Customers.id' => $this->getRequest()->getSession()->read('clientId')])->first();
                if (!empty($customer)) {
                    $customer->move_date = date('Y-m-d', strtotime($this->getRequest()->getData('move_date')));
                    $this->Customers->save($customer);
                }
            }
            $newCustomerSearch->rent_range        = (!empty($parameters['min_rent']) && !empty($parameters['min_rent'])) ? ("$" . $parameters['min_rent'] . " - $" . $parameters['max_rent']) : "-";
            $newCustomerSearch->search_parameters = json_encode($parameters);
            $this->CustomerSearches->save($newCustomerSearch);

            $customerSearchId = $newCustomerSearch->id;

            $this->loadModel('CustomerSearchParameters');

            $newCustomerSearchParameter = $this->CustomerSearchParameters->newEntity();

            $newCustomerSearchParameter->customer_search_id = $customerSearchId;
            $newCustomerSearchParameter->city_id            = empty($parameters['city_id']) ? 0 : $parameters['city_id'];
            $newCustomerSearchParameter->bedrooms           = empty($parameters['bedrooms']) ? 0 : $parameters['bedrooms'];
            if (!empty($this->getRequest()->getData('move_date'))) {

                $newCustomerSearchParameter->move_date = $this->getRequest()->getData('move_date');
                $customer = $this->Customers->find()->where(['Customers.id' => $this->getRequest()->getSession()->read('clientId')])->first();
                if (!empty($customer)) {
                    $customer->move_date = date('Y-m-d', strtotime($this->getRequest()->getData('move_date')));
                    $this->Customers->save($customer);
                }
            }
            $newCustomerSearchParameter->rent_range        = (!empty($parameters['min_rent']) && !empty($parameters['min_rent'])) ? ("$" . $parameters['min_rent'] . " - $" . $parameters['max_rent']) : "-";
            $newCustomerSearchParameter->search_parameters = json_encode($parameters);

            $this->CustomerSearchParameters->save($newCustomerSearchParameter);

            $this->loadComponent('EmailManager');

            if ($this->CustomerSearches->save($newCustomerSearch)) {

                $searchedAPTs = $this->getRequest()->getData('searched_apartment_ids');
                if (!empty($searchedAPTs)) {
                    $client = $this->Customers->find()->where(['Customers.id' => $this->getRequest()->getSession()->read('clientId')])->first();
                    foreach ($searchedAPTs as $apartmentId) {
                        $searchedApartment = $this->SearchedApartments->find('all')->where([
                            'customer_search_id' => $newCustomerSearch->id,
                            'apartment_id'       => $apartmentId,
                        ])->first();



                        if (empty($searchedApartment)) {

                            $this->loadModel('CustomerRegistrations');

                            $customerRegistration = $this->CustomerRegistrations
                                ->find()
                                ->where([
                                    'customer_id'  => $newCustomerSearch->customer_id,
                                    'apartment_id' => $apartmentId,
                                    'realtor_id'   => $this->Auth->user('id'),
                                ])
                                ->first();

                            if (empty($customerRegistration)) {
                                $customerRegistration               = $this->CustomerRegistrations->newEntity();
                                $customerRegistration->customer_id  = $newCustomerSearch->customer_id;
                                $customerRegistration->apartment_id = $apartmentId;
                                $customerRegistration->realtor_id   = $this->Auth->user('id');
                                $this->CustomerRegistrations->save($customerRegistration);
                            }

                            $searchedApartment                           = $this->SearchedApartments->newEntity();
                            $searchedApartment->customer_search_id       = $newCustomerSearch->id;
                            $searchedApartment->apartment_id             = $apartmentId;
                            $searchedApartment->notified                 = false;
                            $searchedApartment->is_a_lead                = false;
                            $searchedApartment->customer_registration_id = $customerRegistration->id;
                            $this->SearchedApartments->save($searchedApartment);
                        }
                    }
                }
            }

            $this->responseMessage                  = "Search saved successfully";
            $this->responseCode                     = SUCCESS_CODE;
            $this->responseData['customerSearchId'] = $customerSearchId;
        } else {
            $this->responseMessage = __('Something went wrong. Please, try again.');
        }

        echo $this->responseFormat();
        exit;
    }
    
    
    
    // Search Apartments as per filter selected to view on MAP
    public function search($page = 1) {
        $this->loadModel('Apartments');
        $this->autoRender     = false;
        $this->responseCode   = CODE_BAD_REQUEST;
        $limit                = 100;
        $allAptLimit          = 50;
        $zeroRentLimit        = 50;
        $offset               = ($page - 1) * $limit;
        $allAptOffset         = ($page - 1) * $allAptLimit;
        $zeroRentOffset       = ($page - 1) * $zeroRentLimit;
        $floorPlanConditions  = [];
        if ($this->request->is('post')) {
            $searchKeys            = $this->getRequest()->getData();
            $conditions            = [];
            $selectedAmenities     = [];

            foreach ($searchKeys as $searchKey => $searchValue) {

                if (!empty($searchValue)) {
                    $searchValue = $searchValue == 'true' ? true : $searchValue;
                    switch ($searchKey) {
                        case 'name': {
                                $conditions[]            = ['Apartments.name LIKE' => "%" . $searchValue . "%"];
                                break;
                            }
                        case 'company_id': {
                                $conditions[]            = ['Apartments.company_id' => $searchValue];
                                break;
                            }
                        case 'zip': {
                                $conditions[]            = ['Apartments.zip LIKE' => "%" . $searchValue . "%"];
                                break;
                            }
                        case 'city_id': {
                                $conditions[]            = ['Apartments.city_id' => $searchValue];
                                break;
                            }
                        case 'bedrooms': {
                                $floorPlanConditions[] = ($searchValue == "5+") ? ['FloorPlans.bedrooms >=' => $searchValue] : ['FloorPlans.bedrooms' => $searchValue];
                                $conditions[]          = ($searchValue == "5+") ? ['FloorPlans.bedrooms >=' => $searchValue] : ['FloorPlans.bedrooms' => $searchValue];
                                break;
                            }
                        case 'bathrooms': {
                                if ($searchValue != "Any") {
                                    $floorPlanConditions[] = ($searchValue == "5+") ? ['FloorPlans.bathrooms >=' => $searchValue] : ['FloorPlans.bathrooms' => $searchValue];
                                    $conditions[]          = ($searchValue == "5+") ? ['FloorPlans.bathrooms >=' => $searchValue] : ['FloorPlans.bathrooms' => $searchValue];
                                }
                                break;
                            }
                        case 'min_rent': {
                                $floorPlanConditions[] = ['FloorPlans.min_rent >=' => $searchValue - (($searchValue * 10) / 100)];
                                $conditions[]          = ['FloorPlans.min_rent >=' => $searchValue - (($searchValue * 10) / 100)];

                                break;
                            }
                        case 'max_rent': {
                                if ($searchValue != "5000+") {
                                    $floorPlanConditions['OR'][] = ['FloorPlans.max_rent <=' => $searchValue + (($searchValue * 10) / 100)];
                                    $floorPlanConditions['OR'][] = ['FloorPlans.min_rent <=' => $searchValue + (($searchValue * 10) / 100)];
                                    $conditions['OR'][]          = ['FloorPlans.max_rent <=' => $searchValue + (($searchValue * 10) / 100)];
                                    $conditions['OR'][]          = ['FloorPlans.min_rent <=' => $searchValue + (($searchValue * 10) / 100)];
                                }
                                break;
                            }
                        case 'amenities': {
                                $runSecondQuery    = false;
                                $conditions[]      = ['ApartmentAmenities.amenity_id IN' => $searchValue];
                                $selectedAmenities = $searchValue;
                                break;
                            }
                        case 'min_year_built_in': {
                                
                                $conditions[]   = ['Apartments.year_built_in >=' => $searchValue];
                                break;
                            }
                        case 'self_guided_tours': {

                                
                                $conditions[]   = ['Apartments.self_guided_tours' => true];
                                break;
                            }
                        case 'virtual_tours': {
                                
                                $conditions[]   = ['Apartments.virtual_tours' => true];
                                break;
                            }
                        case 'min_sqft': {
                                
                                $conditions[]   = ['FloorPlans.min_sqft >=' => $searchValue];
                                break;
                            }
                        case 'dogs_accepted': {
                                
                                $conditions[]   = ['ApartmentPetPolicies.dogs_accepted' => true];
                                break;
                            }
                        case 'dog_max_weight': {

                                
                                $conditions[]   = ['ApartmentPetPolicies.dog_weight_limit >=' => $searchValue];
                                break;
                            }
                        case 'cats_accepted': {
                                
                                $conditions[]   = ['ApartmentPetPolicies.cats_accepted' => true];
                                break;
                            }
                        case 'cat_max_weight': {
                                
                                $conditions[]   = ['ApartmentPetPolicies.cat_weight_limit <=' => $searchValue];
                                break;
                            }
                        case 'aggressive_breads_accepted': {
                                
                                $conditions[]   = ['ApartmentPetPolicies.aggressive_breads_accepted' => $searchValue];
                                break;
                            }
                        case 'has_full_size_connections': {
                                
                                $conditions[]   = ['ApartmentWasherDryerConnections.has_full_size_connections' => true];
                                break;
                            }
                        case 'has_stackable_connections': {
                                
                                $conditions[]   = ['ApartmentWasherDryerConnections.has_stackable_connections' => true];
                                break;
                            }
                        case 'washer_dryer_provided': {
                                
                                $conditions[]   = ['ApartmentWasherDryerConnections.washer_dryer_provided' => true];
                                break;
                            }
                        case 'covered_parking': {
                                
                                $conditions[]   = ['ApartmentParking.covered_parking' => true];
                                break;
                            }
                        case 'parking_garage': {
                                
                                $conditions[]   = ['ApartmentParking.parking_garage' => true];
                                break;
                            }
                        case 'assigned_parking': {
                                
                                $conditions[]   = ['ApartmentParking.assigned_parking' => true];
                                break;
                            }
                        case 'detached_parking': {
                                
                                $conditions[]   = ['ApartmentParking.detached_parking' => true];
                                break;
                            }
                        case 'detached_no_of_vehicle': {
                                $conditions[] = ['ApartmentParking.detached_no_of_vehicle >=' => $searchValue];
                                break;
                            }
                        case 'attached_parking': {
                                
                                $conditions[]   = ['ApartmentParking.attached_parking' => true];
                                break;
                            }
                        case 'no_of_vehicle': {
                                
                                $conditions[]   = ['ApartmentParking.no_of_vehicle >=' => $searchValue];
                                break;
                            }
                        case 'income_restricted': {
                                
                                $conditions[]   = ['ApartmentIncomeDetails.income_restricted' => true];
                                break;
                            }
                        case 'accepted_section_8': {
                                
                                $conditions[]   = ['ApartmentIncomeDetails.accepted_section_8' => true];
                                break;
                            }
                        case 'senior_property': {
                                
                                $conditions[]   = ['ApartmentIncomeDetails.senior_property' => true];
                                break;
                            }
                        case 'second_chance_property': {
                                
                                $conditions[]   = ['ApartmentIncomeDetails.second_chance_property' => true];
                                break;
                            }
                        case 'description': {
                                $conditions[]   = ['Apartments.description LIKE' => "%" . $searchValue . "%"];
                                break;
                            }
                        case 'apartment_ids': {
                                $conditions[]   = ['Apartments.id IN' => json_decode($searchValue)];
                                break;
                            }
                    }
                }
            }

            $conditions[]                       = ['Apartments.lat IS NOT NULL'];
            $conditions['Apartments.status']    = 1;
            $conditions[]                       = ['Apartments.no_of_floor_plans > 0'];
            
            
            
            $this->loadModel('UserCities');
            $userCities = $this->UserCities->find('list', ['valueField' => 'city_id'])->where(['UserCities.user_id' => $this->Auth->user('id')])->all()->toArray();

            $competitorJoin = [
                'table'      => 'competitors',
                'alias'      => 'Competitors',
                'type'       => 'LEFT',
                'conditions' => 'Apartments.id = Competitors.apartment_id',
            ];
            $floorPlanJoin = [
                'table'      => 'floor_plans',
                'alias'      => 'FloorPlans',
                'type'       => 'LEFT',
                'conditions' => 'Apartments.id = FloorPlans.apartment_id',
            ];

            $apartmentAmenityJoin = [
                'table'      => 'apartment_amenities',
                'alias'      => 'ApartmentAmenities',
                'type'       => 'LEFT',
                'conditions' => 'Apartments.id = ApartmentAmenities.apartment_id',
            ];

            $apartmentPetPoliciesJoin = [
                'table'      => 'apartment_pet_policies',
                'alias'      => 'ApartmentPetPolicies',
                'type'       => 'LEFT',
                'conditions' => 'Apartments.id = ApartmentPetPolicies.apartment_id',
            ];

            $apartmentParkingJoin = [
                'table'      => 'apartment_parking',
                'alias'      => 'ApartmentParking',
                'type'       => 'LEFT',
                'conditions' => 'Apartments.id = ApartmentParking.apartment_id',
            ];

            $apartmentIncomeDetailsJoin = [
                'table'      => 'apartment_income_details',
                'alias'      => 'ApartmentIncomeDetails',
                'type'       => 'LEFT',
                'conditions' => 'Apartments.id = ApartmentIncomeDetails.apartment_id',
            ];

            $apartmentWasherDryerConnectionsJoin = [
                'table'      => 'apartment_washer_dryer_connections',
                'alias'      => 'ApartmentWasherDryerConnections',
                'type'       => 'LEFT',
                'conditions' => 'Apartments.id = ApartmentWasherDryerConnections.apartment_id',
            ];

            $this->loadModel('UnapprovedRealtors');
            $unapprovedQuery = $this->UnapprovedRealtors
                ->find('list', ['valueField' => 'apartment_id'])
                ->where(['UnapprovedRealtors.realtor_id' => $this->Auth->user('id')])
                ->all();

            $unapprovedByApartments = $unapprovedQuery->toArray();

            if (!empty($unapprovedByApartments)) {
                $conditions['Apartments.id NOT IN'] = array_values($unapprovedByApartments);
                $aptIds                             = array_values($unapprovedByApartments);
            }

            // $conditions['Apartments.city_id IN'] = $userCities;
          
            $apartments = $this->Apartments->find()
                ->select([
                    'Apartments.id',
                    'Apartments.name',
                    'Apartments.address',
                    'Apartments.zip',
                    'Apartments.lat',
                    'Apartments.lng',
                    'Apartments.modified',
                    'Apartments.live_status',
                    'Apartments.no_of_floor_plans',
                    'Apartments__commission' => '(SELECT (CASE WHEN (Competitors.realtor_max_commission = Competitors.realtor_min_commission) THEN (CASE WHEN (Competitors.commission_type = "%") THEN CONCAT(Competitors.realtor_min_commission,"%") ELSE CONCAT("$",Competitors.realtor_min_commission) END) ELSE (CASE WHEN (Competitors.commission_type = "%") THEN CONCAT(Competitors.realtor_min_commission,"%-", Competitors.realtor_max_commission,"%") ELSE CONCAT("$",Competitors.realtor_min_commission,"-$",Competitors.realtor_max_commission) END) END)AS commission FROM competitors as Competitors WHERE Competitors.apartment_id = Apartments.id)',
                ])
                //->join($competitorJoin)
                ->join($floorPlanJoin)
                ->join($apartmentAmenityJoin)
                ->join($apartmentPetPoliciesJoin)
                ->join($apartmentParkingJoin)
                ->join($apartmentIncomeDetailsJoin)
                ->join($apartmentWasherDryerConnectionsJoin)
                ->contain([
                    'Users'              => function ($q) {
                        return $q->select(['Users.first_name', 'Users.last_name', 'Users.name', 'Users.phone']);
                    },
                    'Images'             => function ($q) {
                        return $q->select(['Images.image', 'Images.small_thumb', 'Images.medium_thumb', 'Images.large_thumb']);
                    },
                    'Cities'             => function ($q) {
                        return $q->select(['Cities.name']);
                    },
                    'States'             => function ($q) {
                        return $q->select(['States.name']);
                    },
                    'FloorPlans'         => function ($q) use ($floorPlanConditions) {
                        return $q->select([
                            'FloorPlans.id',
                            'FloorPlans.apartment_id'
                        ])->where($floorPlanConditions);
                    },
                    'ApartmentAmenities' => function ($q) {
                        return $q->select([
                            'ApartmentAmenities.amenity_id',
                            'ApartmentAmenities.apartment_id'
                        ]);
                    },
                ])
                ->where($conditions)
                ->group('Apartments.id')
                ->offset($offset)
                ->limit($limit)
                ->order([
                    'Apartments.live_status' => 'ASC',
                    'Apartments.modified'    => 'DESC',
                ])
                ->disableHydration()
                ->toArray();

            
            $apts = [];

            foreach ($apartments as $apartment) {

                if (empty($selectedAmenities)) {
                    $apts[]   = $apartment;
                    $aptIds[] = $apartment['id'];
                } else {

                    $apartmentAmenities = [];

                    if (!empty($apartment['apartment_amenities'])) {
                        foreach ($apartment['apartment_amenities'] as $amenity) {
                            $apartmentAmenities[] = $amenity['amenity_id'];
                        }
                    }

                    if (!empty($apartmentAmenities)) {
                        if (empty(array_diff($selectedAmenities, $apartmentAmenities))) {
                            $apts[]   = $apartment;
                            $aptIds[] = $apartment['id'];
                        }
                    }
                }
            }

            $this->responseData['apartments'] = $apts;
            $this->responseCode               = SUCCESS_CODE;
        } else {
            $this->responseMessage = __('Something went wrong. Please, try again.');
        }

        echo $this->responseFormat();
        exit;
    }

    
}
