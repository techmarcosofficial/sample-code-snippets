<?php

namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * Apartment Entity
 *
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property string $address
 * @property int $city_id
 * @property int $state_id
 * @property string $zip
 * @property float $lat
 * @property float $lng
 * @property int $market_place_id
 * @property int $image_id
 * @property bool $status
 * @property bool $is_premium
 * @property bool $is_available
 * @property bool $has_floor_plan
 * @property \Cake\I18n\FrozenTime $last_searched_at
 * @property \Cake\I18n\FrozenTime $created
 * @property \Cake\I18n\FrozenTime $modified
 *
 * @property \App\Model\Entity\User $user
 * @property \App\Model\Entity\City $city
 * @property \App\Model\Entity\State $state
 * @property \App\Model\Entity\MarketPlace $market_place
 * @property \App\Model\Entity\Image $image
 * @property \App\Model\Entity\ApartmentAmenity[] $apartment_amenities
 * @property \App\Model\Entity\ApartmentImage[] $apartment_images
 * @property \App\Model\Entity\ScheduledEmailApartment[] $scheduled_email_apartments
 * @property \App\Model\Entity\SearchedApartment[] $searched_apartments
 */
class Apartment extends Entity {

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
        'apartment_info_id'          => true,
        'user_id'                    => true,
        'name'                       => true,
        'description'                => true,
        'address'                    => true,
        'city_id'                    => true,
        'state_id'                   => true,
        'zip'                        => true,
        'lat'                        => true,
        'lng'                        => true,
        'market_place_id'            => true,
        'company_id'                 => true,
        'image_id'                   => true,
        'website'                    => true,
        'status'                     => true,
        'is_premium'                 => true,
        'is_available'               => true,
        'no_of_floor_plans'          => true,
        'last_searched_at'           => true,
        'property_info_hours'        => true,
        'min_lease_terms_in_months'  => true,
        'max_lease_terms_in_months'  => true,
        'no_of_units'                => true,
        'stories'                    => true,
        'app_fee'                    => true,
        'deposit'                    => true,
        'year_built_in'              => true,
        'renovated_year'             => true,
        'required_registration_type' => true,
        'self_guided_tours'          => true,
        'virtual_tours'              => true,
        'payment_policy'             => true,
        'payment_policy_note'        => true,
        'current_period_start'       => true,
        'current_period_end'         => true,
        'last_e_blast_sent_at'       => true,
        'e_blast_reminder_sent_at'   => true,
        'expired_email_sent_at'      => true,
        'profile_updated_at'         => true,
        'subscription_request'       => true,
        'registration_steps_done'    => true,
        'realtor_inquiry_priority'   => true,
        'customer_referral_priority' => true,
        'marketing_email_priority'   => true,
        'live_status'                => true,
        'live_at'                    => true,
        'ignore_price_update_for'    => true,
        'import_log'                 => true,
        'created'                    => true,
        'modified'                   => true,
        'user'                       => true,
        'city'                       => true,
        'state'                      => true,
        'market_place'               => true,
        'image'                      => true,
        'apartment_amenities'        => true,
        'apartment_images'           => true,
        'scheduled_email_apartments' => true,
        'searched_apartments'        => true
    ];
}
