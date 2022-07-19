<?php

namespace App\Model\Entity;

use Cake\ORM\Entity;
use Cake\Auth\DefaultPasswordHasher;

/**
 * User Entity
 *
 * @property int $id
 * @property string $first_name
 * @property string $last_name
 * @property string $reporting_name
 * @property string $email
 * @property string $reporting_email
 * @property string $password
 * @property string $forgot_password_token
 * @property int $image_id
 * @property string $phone
 * @property string $address
 * @property int $city_id
 * @property int $state_id
 * @property string $zip
 * @property string $role
 * @property int $registration_steps_done
 * @property bool $active
 * @property int $no_of_apartments
 * @property int $no_of_customers
 * @property \Cake\I18n\FrozenTime $created
 * @property \Cake\I18n\FrozenTime $modified
 *
 * @property \App\Model\Entity\Image $image
 * @property \App\Model\Entity\City $city
 * @property \App\Model\Entity\State $state
 * @property \App\Model\Entity\Apartment[] $apartments
 * @property \App\Model\Entity\Customer[] $customers
 * @property \App\Model\Entity\EmailTemplate[] $email_templates
 * @property \App\Model\Entity\RealtorMarketPlace[] $realtor_market_places
 */
class User extends Entity {

    public $virtualFields = ['full_name' => 'CONCAT(User.first_name, " ", User.last_name)'];

    /**
     * Fields that can be mass assigned using newEntity() or patchEntity().
     *
     * Note that when '*' is set to true, this allows all unspecified fields to
     * be mass assigned. For security purposes, it is advised to set '*' to false
     * (or remove it), and explicitly make individual fields accessible as needed.
     *
     * @var array
     */
    protected $_accessible = [
        'parent_id'                  => true,
        'apartment_info_id'          => true,
        'name'                       => true,
        'first_name'                 => true,
        'last_name'                  => true,
        'company'                    => true,
        'reporting_name'             => true,
        'email'                      => true,
        'reporting_email'            => true,
        'password'                   => true,
        'forgot_password_token'      => true,
        'image_id'                   => true,
        'phone'                      => true,
        'address'                    => true,
        'city_id'                    => true,
        'state_id'                   => true,
        'zip'                        => true,
        'role'                       => true,
        'website'                    => true,
        'registration_steps_done'    => true,
        'active'                     => true,
        'no_of_apartments'           => true,
        'no_of_customers'            => true,
        'no_of_market_places'        => true,
        'no_of_states'               => true,
        'no_of_cities'               => true,
        'current_period_start'       => true,
        'current_period_end'         => true,
        'last_logged_in_at'          => true,
        'login_reminder_sent_at'     => true,
        'expired_email_sent_at'      => true,
        'profile_updated_at'         => true,
        'subscription_request'       => true,
        'last_selected_marketplace'  => true,
        'daily_usage_report'         => true,
        'weekly_usage_report'        => true,
        'monthly_usage_report'       => true,
        'never_usage_report'         => true,
        'last_usage_report_sent_at'  => true,
        'live_status'                => true,
        'live_at'                    => true,
        'login_token'                => true,
        'last_login_at'              => true,
        'last_activity_at'           => true,
        'created'                    => true,
        'modified'                   => true,
        'image'                      => true,
        'city'                       => true,
        'state'                      => true,
        'apartments'                 => true,
        'customers'                  => true,
        'email_templates'            => true,
        'realtor_market_places'      => true,
        'how_did_you_find_us'        => true,
        'apartment_special_priority' => true,
        'apartment_replies_priority' => true,
        'realtor_marketing_email_priority' => true,
        'realtor_previous_eblasts_loaded' => true,
    ];

    /**
     * Fields that are excluded from JSON versions of the entity.
     *
     * @var array
     */
    protected $_hidden = [
        'password'
    ];

    protected function _setPassword($password) {
        return (new DefaultPasswordHasher)->hash($password);
    }
}
