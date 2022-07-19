<?php

namespace App\Controller;

use Cake\I18n\Number;

/**
 * Apartments Controller
 *
 * @property \App\Model\Table\ApartmentsTable $Apartments
 *
 * @method \App\Model\Entity\Apartment[]|\Cake\Datasource\ResultSetInterface paginate($object = null, array $settings = [])
 */
class ApartmentsController extends AppController {

    private $id = 0;

    public function initialize() {
        parent::initialize();

        $this->id = $this->Auth->user('current_apartment'); //Current Apartment Id
    }

    public function add() {
        $apartment = $this->Apartments->newEntity();
        if ($this->request->is('post')) {
            $apartment = $this->Apartments->patchEntity($apartment, $this->request->getData());
            if ($this->Apartments->save($apartment)) {
                $this->Flash->success(__('The apartment has been saved.'));

                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('The apartment could not be saved. Please, try again.'));
        }
        $users        = $this->Apartments->Users->find('list', ['limit' => 200]);
        $cities       = $this->Apartments->Cities->find('list', ['limit' => 200]);
        $states       = $this->Apartments->States->find('list', ['limit' => 200]);
        $marketPlaces = $this->Apartments->MarketPlaces->find('list', ['limit' => 200]);
        $images       = $this->Apartments->Images->find('list', ['limit' => 200]);
        $this->set(compact('apartment', 'users', 'cities', 'states', 'marketPlaces', 'images'));
    }

    public function amenities() {

        $this->loadModel('Amenities');
        $this->loadModel('ApartmentAmenities');
        $this->loadModel('ApartmentPetPolicies');
        $this->loadModel('ApartmentWasherDryerConnections');
        $this->loadModel('ApartmentParking');
        $this->loadModel('ApartmentIncomeDetails');

        $message = empty($this->getRequest()->getQuery('message')) ? "" : $this->getRequest()->getQuery('message');

        $amenities = $this->Amenities->find('all')->where(['Amenities.status' => true])->all()->toArray();

        $apartmentPetPolicy = $this->ApartmentPetPolicies->find('all')->where(['ApartmentPetPolicies.apartment_id' => $this->id])->first();
        if (empty($apartmentPetPolicy)) {
            $apartmentPetPolicy               = $this->ApartmentPetPolicies->newEntity();
            $apartmentPetPolicy->apartment_id = $this->id;
            $this->ApartmentPetPolicies->save($apartmentPetPolicy);
        }

        $apartmentWasherDryerConnection = $this->ApartmentWasherDryerConnections->find('all')->where(['ApartmentWasherDryerConnections.apartment_id' => $this->id])->first();
        if (empty($apartmentWasherDryerConnection)) {
            $apartmentWasherDryerConnection               = $this->ApartmentWasherDryerConnections->newEntity();
            $apartmentWasherDryerConnection->apartment_id = $this->id;
            $this->ApartmentWasherDryerConnections->save($apartmentWasherDryerConnection);
        }

        $apartmentParking = $this->ApartmentParking->find('all')->where(['ApartmentParking.apartment_id' => $this->id])->first();
        if (empty($apartmentParking)) {
            $apartmentParking               = $this->ApartmentParking->newEntity();
            $apartmentParking->apartment_id = $this->id;
            $this->ApartmentParking->save($apartmentParking);
        }

        $apartmentIncomeDetail = $this->ApartmentIncomeDetails->find('all')->where(['ApartmentIncomeDetails.apartment_id' => $this->id])->first();
        if (empty($apartmentIncomeDetail)) {
            $apartmentIncomeDetail               = $this->ApartmentIncomeDetails->newEntity();
            $apartmentIncomeDetail->apartment_id = $this->id;
            $this->ApartmentIncomeDetails->save($apartmentIncomeDetail);
        }

        if ($this->request->is(['patch', 'post', 'put'])) {

            //Updating Apartment Info
            $apartment                    = $this->Apartments->get($this->id);
            $apartment->self_guided_tours = false;
            $apartment->virtual_tours     = false;
            $apt                          = $this->request->getData('apt');
            $apartment                    = $this->Apartments->patchEntity($apartment, $apt);
            $oldSteps                     = $apartment->registration_steps_done;
            if ($apartment->registration_steps_done < 5) {
                $user                            = $this->Auth->user();
                $user['registration_steps_done'] = 5;
                $this->Auth->setUser($user);
                $apartment->registration_steps_done = 5;
            }
            $this->Apartments->save($apartment);

            //Saving Comp Info
            $this->loadModel('Competitors');

            $competitor = $this->Competitors->find('all')
                ->where(['Competitors.apartment_id' => $this->id])
                ->order(['Competitors.modified' => "DESC"])
                ->first();

            $competitor->commission_type        = $this->request->getData('commission_type');
            $competitor->realtor_min_commission = $this->request->getData('realtor_min_commission');
            $competitor->realtor_max_commission = $this->request->getData('realtor_max_commission');
            $competitor->note                   = $this->request->getData('note');

            $this->Competitors->save($competitor);

            $apartmentData = $this->request->getData('apartment');

            //updating Apartment Amenities
            $apartmentAmenities  = $this->ApartmentAmenities->find('all')->where(['ApartmentAmenities.apartment_id' => $this->id])->all();
            $apartmentAmenityIds = [];
            foreach ($apartmentAmenities as $apartmentAmenity) {
                $apartmentAmenityIds[] = $apartmentAmenity->amenity_id;
            }

            if (empty($apartmentData['apartment_amenities'])) {
                $apartmentData['apartment_amenities'] = [];
            }

            $newAmenities = array_diff($apartmentData['apartment_amenities'], $apartmentAmenityIds);

            if (!empty($newAmenities)) {
                $insertableAmenities = [];
                foreach ($newAmenities as $newAmenity) {
                    $insertableAmenities[] = [
                        'apartment_id' => $this->id,
                        'amenity_id'                             => $newAmenity,
                        'amenity_value'                          => 1
                    ];
                }

                $newApartmentAmenities = $this->ApartmentAmenities->newEntities($insertableAmenities);
                $this->ApartmentAmenities->saveMany($newApartmentAmenities);
            }

            $deletableAmenities = array_diff($apartmentAmenityIds, $apartmentData['apartment_amenities']);
            if (!empty($deletableAmenities)) {
                $this->ApartmentAmenities->deleteAll([
                    'apartment_id' => $this->id,
                    'amenity_id IN'                                      => $deletableAmenities
                ]);
            }

            //Updating Pet Policy
            $apartmentPetPolicy->dogs_accepted              = false;
            $apartmentPetPolicy->dog_weight_limit           = 0;
            $apartmentPetPolicy->cats_accepted              = false;
            $apartmentPetPolicy->cat_weight_limit           = 0;
            $apartmentPetPolicy->pets_deposit               = 0;
            $apartmentPetPolicy->pets_rent                  = 0;
            $apartmentPetPolicy->pets_limit                 = 0;
            $apartmentPetPolicy->bread_restrictions         = 'NA';
            $apartmentPetPolicy->aggressive_breads_accepted = false;

            $apartmentPetPolicy = $this->ApartmentPetPolicies->patchEntity($apartmentPetPolicy, $apartmentData['apartment_pet_policy']);
            $this->ApartmentPetPolicies->save($apartmentPetPolicy);

            //Updating Washer Dryer
            if (empty($apartmentData['apartment_washer_dryer_connection'])) {
                $apartmentData['apartment_washer_dryer_connection'] = [];
            }
            $apartmentWasherDryerConnection->has_full_size_connections = false;
            $apartmentWasherDryerConnection->has_stackable_connections = false;
            $apartmentWasherDryerConnection->washer_dryer_provided     = false;

            $apartmentWasherDryerConnection = $this->ApartmentWasherDryerConnections->patchEntity($apartmentWasherDryerConnection, $apartmentData['apartment_washer_dryer_connection']);
            $this->ApartmentWasherDryerConnections->save($apartmentWasherDryerConnection);

            //Updating Parking
            if (empty($apartmentData['apartment_parking'])) {
                $apartmentData['apartment_parking'] = [];
            }
            $apartmentParking->covered_parking        = false;
            $apartmentParking->parking_garage         = false;
            $apartmentParking->assigned_parking       = false;
            $apartmentParking->attached_parking       = false;
            $apartmentParking->detached_parking       = false;
            $apartmentParking->no_of_vehicle          = 0;
            $apartmentParking->detached_no_of_vehicle = 0;
            $apartmentParking                         = $this->ApartmentParking->patchEntity($apartmentParking, $apartmentData['apartment_parking']);
            $this->ApartmentParking->save($apartmentParking);

            //Updating Income Details
            if (empty($apartmentData['apartment_income_detail'])) {
                $apartmentData['apartment_income_detail'] = [];
            }
            $apartmentIncomeDetail->income_restricted           = false;
            $apartmentIncomeDetail->income_restricted_note      = "";
            $apartmentIncomeDetail->accepted_section_8          = false;
            $apartmentIncomeDetail->senior_property             = false;
            $apartmentIncomeDetail->second_chance_property      = false;
            $apartmentIncomeDetail->second_chance_property_note = "NA";

            $apartmentIncomeDetail = $this->ApartmentIncomeDetails->patchEntity($apartmentIncomeDetail, $apartmentData['apartment_income_detail']);
            $this->ApartmentIncomeDetails->save($apartmentIncomeDetail);

            $this->Flash->success('Apartment amenities have been updated successfully.');
            if ($oldSteps == 4) {
                return $this->redirect(['action' => 'dashboard']);
            }
            return $this->redirect(['action' => 'amenities']);
        }

        $apartment = $this->Apartments->find('all')
            ->contain([
                'ApartmentAmenities',
                'ApartmentPetPolicies',
                'ApartmentWasherDryerConnections',
                'ApartmentParking',
                'ApartmentIncomeDetails',
                'Competitors',
            ])
            ->where(['Apartments.id' => $this->id])->first();

        $this->set('message', $message);
        $this->set('amenities', $amenities);
        $this->set('apartment', $apartment);
    }

    

    public function changeImageOrder($category = "Exterior") {
        $this->loadModel('ApartmentImages');
        if ($this->request->is(['patch', 'post', 'put'])) {
            $data     = $this->getRequest()->getData();
            $category = $data['category'];
            $imageIds = explode(",", $data['image_ids']);
            $imageIds = array_filter($imageIds);

            $newImages = [];
            foreach ($imageIds as $imageId) {
                $newImages[] = [
                    'apartment_id' => $this->id,
                    'image_id'     => $imageId,
                    'category'     => $category,
                    'status'       => true,
                ];
            }
            if (!empty($newImages)) {
                $newApartmentImages = $this->ApartmentImages->newEntities($newImages);
                $this->ApartmentImages->saveMany($newApartmentImages);
                $this->Flash->success('Apartment images has been saved successfully.');
            } else {
                $this->Flash->error('Please select least one image.');
            }

            return $this->redirect(['action' => 'images']);
        }
        $images = $this->ApartmentImages->find()
            ->contain(['Images'])
            ->where([
                'ApartmentImages.apartment_id' => $this->id,
                'ApartmentImages.category'     => $category,
            ])
            ->order(['ApartmentImages.sort_order' => 'ASC'])
            ->all();

        $apartment = $this->Apartments->find('all')->contain(['Images'])->where(['Apartments.id' => $this->id])->first();
        $this->set('images', $images);
        $this->set('apartment', $apartment);
        $this->set('category', $category);
    }

    public function changeLeadStatus($leadId, $status) {
        $this->loadModel('SearchedApartments');
        $searchedApartment              = $this->SearchedApartments->get($leadId);
        $searchedApartment->lead_status = $status;
        $this->SearchedApartments->save($searchedApartment);
        echo "Status Updated";
        exit;
    }

    public function changePassword() {
        $this->loadModel('Users');
        $apartmentRepliesPriority = json_decode($this->Auth->user('apartment_replies_priority'));
        if (!empty($apartmentRepliesPriority)) {
            if ($apartmentRepliesPriority[0] == "Force Redirect to Change Password") {
                $this->viewBuilder()->setLayout('inner');
                $layout = "inner";
                $this->set('layout', $layout);
            }
        }
        $user = $admin = $this->Users->get($this->Auth->user('id'), ['contain' => ['Images']]);
        if ($this->request->is(['patch', 'post', 'put'])) {
			 //Removed by Client 29-5-21
            // if ((new DefaultPasswordHasher)->check($this->request->getData('current_password'), $user->password)) {
            if ($this->request->getData('new_password') == $this->request->getData('confirm_password')) {
                $user->password = $this->request->getData('new_password');
                if (!empty($layout) && $layout == "inner") {
                    $user->apartment_replies_priority = "";
                }
                if ($this->Users->save($user)) {

                    $authUser                               = $this->Auth->user();
                    $authUser['apartment_replies_priority'] = "";
                    $this->Auth->setUser($authUser);

                    $this->Flash->success(__('Password has been reset.'));

                    return $this->redirect(['controller' => 'Apartments', 'action' => 'dashboard']);
                } else {
                    $this->Flash->error(__('Password has not been set.'));
                }
            } else {
                $this->Flash->error(__('Confirm Password does not match with New Password'));
            }
            //            } else {
            //                $this->Flash->error(__('Invalid Current Password'));
            //            }
        }

        $this->set('user', $user);
    }

    public function chooseRealtors() {
        $this->viewBuilder()->setLayout(false);
        $this->loadModel('Users');
        $apartment = $this->Apartments->find('all')->contain([
            'Competitors',
            'FloorPlans'
        ])->where(['Apartments.id' => $this->id])->first();
        $where['UserCities.city_id'] = $apartment->city_id;
        $where['Users.active'] = 1;
        $join                        = [
            'table' => 'user_cities',
            'alias'                                 => 'UserCities',
            'type'                                  => 'LEFT',
            'conditions'                            => 'UserCities.user_id = Users.id'
        ];

        $this->loadModel('UnapprovedRealtors');
        $unapprovedQuery = $this->UnapprovedRealtors->find('list', ['valueField' => 'realtor_id'])->where(['UnapprovedRealtors.apartment_id' => $this->id])->all();

        $unapprovedRealtors = $unapprovedQuery->toArray();

        if (!empty($unapprovedRealtors)) {
            $where['Users.id NOT IN'] = array_values($unapprovedRealtors);
        }

        $realtors = $this->Users->find('all')->select([
            'Users.id',
            'Users.name',
            'Users.first_name',
            'Users.last_name',
            'Users.company',
            'Users.email'
        ])->join($join)->where($where)->enableHydration(false)->order(['Users.name' => 'ASC'])->all();

        $rs = [];
        foreach ($realtors as $realtor) {
            $rs[$realtor['id']] = ucfirst($realtor['first_name']) . " " . ucfirst($realtor['last_name']) . " - " . $realtor['company'];
        }
        asort($rs);

        $results = array_map(function ($id, $name) {
            return ['id' => $id, 'name' => $name];
        }, array_keys($rs), array_values($rs));

        echo json_encode(['realtors' => $results]);
        exit;
    }

    public function compInfo() {
        $render = "comp_info";
        $this->loadModel('Competitors');
        if (empty($this->Auth->user('regional_manager'))) {

            $competitorUpdate = $this->Competitors->find('all')->where(['Competitors.apartment_id' => $this->id])->order(['Competitors.modified' => "DESC"])->first();

            $mondayMorning = strtotime(date('Y-m-d', strtotime('this week')) . "00:00:00");
            if (empty($competitorUpdate) || strtotime($competitorUpdate->modified) < $mondayMorning) {
                $this->viewBuilder()->setLayout('inner');
                $render = "comp_info_home";
            }

            if ($render == "comp_info_home") {
                $competitor = $this->Competitors->find('all')->select(['Competitors.id'])->where(['Competitors.apartment_id' => $this->id])->first();
            } else {
                $competitor = $this->Competitors->find('all')->where(['Competitors.apartment_id' => $this->id])->first();
                //Check Floor Plan Info
                $this->loadModel('FloorPlans');

                $floorPlan = $this->FloorPlans->find('all')->where(['FloorPlans.apartment_id' => $this->id])->order(['FloorPlans.modified' => "DESC"])->first();
                if (empty($floorPlan)) {
                    //If Floor Plan Info not set yet
                    return $this->redirect(['controller' => 'FloorPlans', 'action' => 'add']);
                } else {
                    $mondayMorning = strtotime(date('Y-m-d'));
                    if (strtotime($floorPlan->modified) < $mondayMorning) {
                        return $this->redirect(['controller' => 'FloorPlans', 'action' => 'update']);
                    }
                }
            }
        }
        $new = false;
        if (empty($competitor)) {
            $competitor = $this->Competitors->newEntity();
            $new        = true;
        }

        if ($this->request->is(['patch', 'post', 'put'])) {
            $this->loadModel('Apartments');
            $apartment = $this->Apartments->get($this->Auth->user('current_apartment'));
            $apartment->modified = date(SQL_DATETIME);
            $this->Apartments->save($apartment);
            
            if (!$new) {
                $competitor = $this->Competitors->find('all')->where(['Competitors.apartment_id' => $this->id])->first();

                $comp = $competitor->toArray();
                unset($comp['id']);
                unset($comp['created']);
                unset($comp['modified']);
                $this->loadModel('CompetitorLogs');
                $competitorLogs = $this->CompetitorLogs->newEntity();
                $competitorLogs = $this->CompetitorLogs->patchEntity($competitorLogs, $comp);
                $this->CompetitorLogs->save($competitorLogs);
            }

            $competitor           = $this->Competitors->patchEntity($competitor, $this->request->getData());
            $competitor->modified = date('Y-m-d H:i:s');

            if ($this->Competitors->save($competitor)) {
                //Updating apartment last update
                $apartment           = $this->Apartments->get($this->id);
                $apartment->modified = date('Y-m-d H:i:s');
                $this->Apartments->save($apartment);

                $this->Flash->success(__('The comp information has been saved.'));

                if ($apartment->registration_steps_done < 2) {
                    $apartment->registration_steps_done = 2;
                    $this->Apartments->save($apartment);
                    $user                            = $this->Auth->user();
                    $user['registration_steps_done'] = 2;
                    $this->Auth->setUser($user);
                }

                //Check Floor Plan Info
                $this->loadModel('FloorPlans');
                if ($render == "comp_info_home") {

                    $floorPlan = $this->FloorPlans->find('all')->where(['FloorPlans.apartment_id' => $this->id])->order(['FloorPlans.modified' => "DESC"])->first();

                    if (empty($floorPlan)) {
                        //If Floor Plan Info not set yet
                        //return $this->redirect(['controller' => 'FloorPlans', 'action' => 'add']);
                        return $this->redirect(['action' => 'dashboard']);
                    } else {
                        $mondayMorning = strtotime(date('Y-m-d'));
                        if (strtotime($floorPlan->modified) < $mondayMorning) {
                            return $this->redirect(['controller' => 'FloorPlans', 'action' => 'update']);
                        }
                    }
                } else {
                    return $this->redirect(['action' => 'dashboard']);
                }
            } else {
                $this->Flash->error(__('The comp info could not be saved. Please, try again.'));
            }
        }

        $footer = $this->getContent('Home Page Footer');
        $this->set('footer', $footer);
        $this->set('new', $new);
        $this->set('currentApartmentId', $this->id);
        $this->set('competitor', $competitor);
        $this->render($render);
    }

    
    public function deleteImage($id) {
        $this->loadModel('ApartmentImages');
        $apartmentImage = $this->ApartmentImages->get($id);
        $this->ApartmentImages->delete($apartmentImage);
        echo "deleted";
        exit;
    }

    public function eBlast() {
        if (strtotime($this->Auth->user('current_period_end')) < strtotime(date('Y-m-d'))) {
            $this->Flash->success(__('Please enroll premium membership to use this feature for this apartment.'));

            return $this->redirect(['action' => 'premiumServices']);
        }
        $apartment = $this->Apartments->find('all')
            ->contain(['Competitors', 'FloorPlans'])
            ->where(['Apartments.id' => $this->id])
            ->first();

        $this->loadModel('EBlasts');

        $standardBlasts = $this->EBlasts->find('all')
            ->where(['EBlasts.apartment_id' => $this->Auth->user('current_apartment')])
            ->limit(100)
            ->all();

        $weeklyBlasts = $this->EBlasts->find('all')
            ->where([
                'EBlasts.apartment_id' => $this->Auth->user('current_apartment'),
                'EBlasts.no_of_receivers >' => 1,
                ' YEARWEEK(EBlasts.created, 1) = YEARWEEK(CURDATE(), 1)',
            ])
            ->limit(10)
            ->count();

        $this->loadModel('Options');

        $option = $this->Options->find()->where(['option_name' => 'E Blast Weekly Limit'])->first();

        $weeklyLimit = 2;
        if (!empty($option)) {
            $weeklyLimit = $option->option_value;
        }

        $this->set('apartment', $apartment);
        $this->set('standardBlasts', $standardBlasts);
        $this->set('weeklyBlasts', $weeklyBlasts);
        $this->set('weeklyBlastsLimit', $weeklyLimit);
    }

    public function eBlastFlyer() {
        if (strtotime($this->Auth->user('current_period_end')) < strtotime(date('Y-m-d'))) {
            $this->Flash->success(__('Please enroll premium membership to use this feature for this apartment.'));
            return $this->redirect(['action' => 'premiumServices']);
        }
        $apartment = $this->Apartments->find('all')->contain([
            'Competitors',
            'FloorPlans'
        ])->where(['Apartments.id' => $this->id])->first();

        $this->loadModel('ApartmentImages');
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
        $images = $this->ApartmentImages->find()->contain(['Images'])
            ->where([
                'ApartmentImages.apartment_id' => $this->id,
                'ApartmentImages.category IN'  => $imageCategories,
            ])
            ->order(['RAND()'])->all();
        //->limit(5)

        $this->set('apartment', $apartment);
        $this->set('images', $images);

        $this->set('eBlastMaxTemplates', 22);
    }

    
    
    public function saveImageOrder() {
        $this->loadModel('ApartmentImages');
        $imageIds = $this->getRequest()->getData('image_ids');
        foreach ($imageIds as $sortOrder => $imageId) {
            $image             = $this->ApartmentImages->get($imageId);
            $image->sort_order = $sortOrder;
            $this->ApartmentImages->save($image);
        }

        echo ['status' => 'Order Saved'];
    }

    public function setCurrentApartment() {
        $this->autoRender   = false;
        $this->responseCode = CODE_BAD_REQUEST;
        if ($this->request->is('post')) {
            $user                         = $this->Auth->user();
            $user['current_apartment']    = $this->getRequest()->getData('current_apartment');
            $this->id                     = $user['current_apartment'];
            $apartment                    = $this->Apartments->get($user['current_apartment']);
            $user['current_period_start'] = $apartment->current_period_start;
            $user['current_period_end']   = $apartment->current_period_end;
            $this->Auth->setUser($user);
            $this->responseCode = SUCCESS_CODE;
        }

        echo $this->responseFormat();
        exit;
    }

    public function setDefaultImage() {
        $apartment = $this->Apartments->find('all')->where(['Apartments.id' => $this->id])->first();

        $apartment->image_id = $this->request->getData('apartment.image_id');

        $this->Apartments->save($apartment);

        $apartment     = $this->Apartments->find('all')->contain(['Images'])->where(['Apartments.id' => $this->id])->first();
        $user          = $this->Auth->user();
        $user['image'] = $apartment->image;
        $this->Auth->setUser($user);
        $this->Flash->success("Default image has been changed.");
        return $this->redirect(['action' => 'images']);
    }

}
