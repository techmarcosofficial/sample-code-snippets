<?php

namespace App\Model\Table;

use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * Apartments Model
 *
 * @property \App\Model\Table\UsersTable|\Cake\ORM\Association\BelongsTo $Users
 * @property \App\Model\Table\CitiesTable|\Cake\ORM\Association\BelongsTo $Cities
 * @property \App\Model\Table\StatesTable|\Cake\ORM\Association\BelongsTo $States
 * @property \App\Model\Table\MarketPlacesTable|\Cake\ORM\Association\BelongsTo $MarketPlaces
 * @property \App\Model\Table\ImagesTable|\Cake\ORM\Association\BelongsTo $Images
 * @property \App\Model\Table\ApartmentAmenitiesTable|\Cake\ORM\Association\HasMany $ApartmentAmenities
 * @property \App\Model\Table\ApartmentImagesTable|\Cake\ORM\Association\HasMany $ApartmentImages
 * @property \App\Model\Table\ScheduledEmailApartmentsTable|\Cake\ORM\Association\HasMany $ScheduledEmailApartments
 * @property \App\Model\Table\SearchedApartmentsTable|\Cake\ORM\Association\HasMany $SearchedApartments
 *
 * @method \App\Model\Entity\Apartment get($primaryKey, $options = [])
 * @method \App\Model\Entity\Apartment newEntity($data = null, array $options = [])
 * @method \App\Model\Entity\Apartment[] newEntities(array $data, array $options = [])
 * @method \App\Model\Entity\Apartment|bool save(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\Apartment|bool saveOrFail(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\Apartment patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
 * @method \App\Model\Entity\Apartment[] patchEntities($entities, array $data, array $options = [])
 * @method \App\Model\Entity\Apartment findOrCreate($search, callable $callback = null, $options = [])
 *
 * @mixin \Cake\ORM\Behavior\TimestampBehavior
 */
class ApartmentsTable extends Table {
    
    /**
     * Initialize method
     *
     * @param array $config The configuration for the Table.
     * @return void
     */
    public function initialize(array $config) {
        parent::initialize($config);
        
        $this->setTable('apartments');
        $this->setDisplayField('name');
        $this->setPrimaryKey('id');
        
        $this->addBehavior('Timestamp');

        $this->addBehavior('CounterCache', [
            'Companies' => [
                'no_of_apartments'
            ],
        ]);

        
        $this->belongsTo('Users', [
            'foreignKey' => 'user_id',
            'joinType' => 'LEFT'
        ]);

        $this->belongsTo('Companies', [
            'foreignKey' => 'company_id',
            'joinType' => 'LEFT'
        ]);

        $this->belongsTo('Cities', [
            'foreignKey' => 'city_id',
            'joinType' => 'LEFT'
        ]);
        $this->belongsTo('States', [
            'foreignKey' => 'state_id',
            'joinType' => 'LEFT'
        ]);
        $this->belongsTo('MarketPlaces', [
            'foreignKey' => 'market_place_id',
            'joinType' => 'LEFT'
        ]);
        
        $this->belongsTo('Images', [
            'foreignKey' => 'image_id',
            'joinType' => 'LEFT'
        ]);
        
        $this->hasMany('UserApartments', [
            'foreignKey' => 'apartment_id'
        ]);
        
        $this->hasMany('ApartmentAmenities', [
            'foreignKey' => 'apartment_id'
        ]);
        $this->hasMany('ApartmentImages', [
            'foreignKey' => 'apartment_id'
        ]);
        $this->hasMany('ScheduledEmailApartments', [
            'foreignKey' => 'apartment_id'
        ]);
        $this->hasMany('SearchedApartments', [
            'foreignKey' => 'apartment_id'
        ]);
    
        $this->hasOne('Competitors', [
            'foreignKey' => 'apartment_id'
        ]);
        
        $this->hasMany('FloorPlans', [
            'foreignKey' => 'apartment_id'
        ]);
    
        $this->hasOne('ApartmentPetPolicies', [
            'foreignKey' => 'apartment_id'
        ]);
    
        $this->hasOne('ApartmentWasherDryerConnections', [
            'foreignKey' => 'apartment_id'
        ]);
    
        $this->hasOne('ApartmentParking', [
            'foreignKey' => 'apartment_id'
        ]);
    
        $this->hasOne('ApartmentIncomeDetails', [
            'foreignKey' => 'apartment_id'
        ]);
    
        $this->hasMany('Subscriptions', [
            'foreignKey' => 'apartment_id',
        ]);
    }
    
    /**
     * Default validation rules.
     *
     * @param \Cake\Validation\Validator $validator Validator instance.
     * @return \Cake\Validation\Validator
     */
    public function validationDefault(Validator $validator) {
        $validator
            ->integer('id')
            ->allowEmptyString('id', 'create');
        
        $validator
            ->scalar('name')
            ->maxLength('name', 255)
            ->requirePresence('name', 'create')
            ->allowEmptyString('name', false);
        
        $validator
            ->scalar('address')
            ->maxLength('address', 255)
            ->requirePresence('address', 'create')
            ->allowEmptyString('address', false);
        
        $validator
            ->scalar('zip')
            ->maxLength('zip', 255)
            ->requirePresence('zip', 'create')
            ->allowEmptyString('zip', false);
        
        $validator
            ->numeric('lat')
            ->allowEmptyString('lat', true);
        
        $validator
            ->numeric('lng')
            ->allowEmptyString('lng', true);
        
        $validator
            ->integer('status')
            ->allowEmptyString('status', true);
        
        $validator
            ->boolean('is_premium')
            ->allowEmptyString('is_premium', true);
        
        $validator
            ->boolean('is_available')
            ->allowEmptyString('is_available', true);
        
        $validator
            ->boolean('has_floor_plan')
            ->allowEmptyString('has_floor_plan', true);
        
        $validator
            ->dateTime('last_searched_at')
            ->allowEmptyDateTime('last_searched_at', true);
        
        return $validator;
    }
    
    /**
     * Returns a rules checker object that will be used for validating
     * application integrity.
     *
     * @param \Cake\ORM\RulesChecker $rules The rules object to be modified.
     * @return \Cake\ORM\RulesChecker
     */
    public function buildRules(RulesChecker $rules) {
        $rules->add($rules->existsIn(['user_id'], 'Users'));
        return $rules;
    }
}
