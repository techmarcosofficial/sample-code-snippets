<?php

namespace App\Model\Table;

use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * Users Model
 *
 * @property \App\Model\Table\ImagesTable|\Cake\ORM\Association\BelongsTo $Images
 * @property \App\Model\Table\CitiesTable|\Cake\ORM\Association\BelongsTo $Cities
 * @property \App\Model\Table\StatesTable|\Cake\ORM\Association\BelongsTo $States
 * @property \App\Model\Table\ApartmentsTable|\Cake\ORM\Association\HasMany $Apartments
 * @property \App\Model\Table\CustomersTable|\Cake\ORM\Association\HasMany $Customers
 * @property \App\Model\Table\EmailTemplatesTable|\Cake\ORM\Association\HasMany $EmailTemplates
 * @property \App\Model\Table\RealtorMarketPlacesTable|\Cake\ORM\Association\HasMany $RealtorMarketPlaces
 *
 * @method \App\Model\Entity\User get($primaryKey, $options = [])
 * @method \App\Model\Entity\User newEntity($data = null, array $options = [])
 * @method \App\Model\Entity\User[] newEntities(array $data, array $options = [])
 * @method \App\Model\Entity\User|bool save(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\User|bool saveOrFail(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\User patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
 * @method \App\Model\Entity\User[] patchEntities($entities, array $data, array $options = [])
 * @method \App\Model\Entity\User findOrCreate($search, callable $callback = null, $options = [])
 *
 * @mixin \Cake\ORM\Behavior\TimestampBehavior
 */
class UsersTable extends Table {
    
    /**
     * Initialize method
     *
     * @param array $config The configuration for the Table.
     * @return void
     */
    public function initialize(array $config) {
        parent::initialize($config);
        
        $this->setTable('users');
        $this->setDisplayField('id');
        $this->setPrimaryKey('id');
        
        $this->addBehavior('Timestamp');
    
        $this->belongsTo('Users', [
            'foreignKey' => 'parent_id',
            'joinType' => 'LEFT'
        ]);

        $this->belongsTo('Images', [
            'foreignKey' => 'image_id',
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
    
        $this->hasMany('Users', [
            'foreignKey' => 'parent_id'
        ]);
        
        $this->hasMany('Apartments', [
            'foreignKey' => 'user_id'
        ]);
        $this->hasMany('Customers', [
            'foreignKey' => 'user_id'
        ]);
        $this->hasMany('EmailTemplates', [
            'foreignKey' => 'user_id'
        ]);
        
    
        $this->hasMany('UserStates', [
            'foreignKey' => 'user_id'
        ]);
    
        $this->hasMany('UserCities', [
            'foreignKey' => 'user_id'
        ]);
    
        $this->hasMany('UserApartments', [
            'foreignKey' => 'user_id'
        ]);
        
        $this->hasMany('UserMarketPlaces', [
            'foreignKey' => 'user_id'
        ]);
    
        $this->hasMany('Subscriptions', [
            'foreignKey' => 'user_id',
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
            ->allowEmptyString('name', true);
        
        
        $validator
            ->scalar('first_name')
            ->maxLength('first_name', 255)
            ->requirePresence('first_name', 'create')
            ->allowEmptyString('first_name', false);
        
        $validator
            ->scalar('last_name')
            ->maxLength('last_name', 255)
            ->requirePresence('last_name', 'create')
            ->allowEmptyString('last_name', false);
        
        $validator
            ->scalar('reporting_name')
            ->maxLength('reporting_name', 255)
            ->allowEmptyString('reporting_name', true);
        
        $validator
            ->email('email')
            ->requirePresence('email', 'create')
            ->allowEmptyString('email', false);
        
        $validator
            ->scalar('reporting_email')
            ->maxLength('reporting_email', 255)
            ->allowEmptyString('reporting_email', false);
        
        $validator
            ->scalar('password')
            ->maxLength('password', 255)
            ->allowEmptyString('password', true);
        
        $validator
            ->scalar('forgot_password_token')
            ->maxLength('forgot_password_token', 255)
            ->allowEmptyString('forgot_password_token', true);
        
        
        $validator
            ->scalar('role')
            ->maxLength('role', 255)
            ->allowEmptyString('role', true);
        
        $validator
            ->integer('registration_steps_done')
            ->allowEmptyString('registration_steps_done', true);
        
        $validator
            ->integer('active')
            ->allowEmptyString('active', true);
        
        $validator
            ->allowEmptyString('no_of_apartments', true);
        
        $validator
            ->allowEmptyString('no_of_customers', true);
        
        return $validator;
    }
    
    /*
     * This validation method is used when adding new user
     */
    
    public function validationNewUser(Validator $validator) {
        
        $validator
            ->scalar('first_name')
            ->maxLength('first_name', 255)
            ->requirePresence('first_name', 'create')
            ->allowEmptyString('first_name', false);;
        
        $validator
            ->scalar('last_name')
            ->maxLength('last_name', 255)
            ->requirePresence('last_name', 'create')
            ->allowEmptyString('last_name', false);;
        
        $validator
            ->email('email')
            ->requirePresence('email', 'create')
            ->allowEmptyString('email', false);;
        
        $validator
            ->scalar('password')
            ->maxLength('password', 255)
            ->requirePresence('password', 'create')
            ->allowEmptyString('password', false);;
        
        $validator
            ->allowEmptyFile('image_id');
        
        
        
        $validator
            ->scalar('forgot_password_token')
            ->maxLength('forgot_password_token', 255)
            ->allowEmptyString('forgot_password_token');
        
        
        $validator
            ->integer('active')
            ->allowEmpty('active');
        
       
        
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
        return $rules;
    }
}
