<?php

namespace App\Models;


use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable {
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    public $sortable = [
        'id',
        'display_name',
        'created_at',
        'updated_at'
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'slug',
        'first_name',
        'last_name',
        'display_name',
        'role_id',
        'email',
        'password',
        'image',
        'thumb',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'deleted_at',
        'role_id',
        'parent_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function role() {
        return $this->belongsTo(Role::class, 'role_id')->select(['id', 'name']);
    }

    public function modalities() {
        return  $this->options('modality');
    }

    public function business_models() {
        return  $this->options('business-model');
    }

    public function client_bases() {
        return  $this->options('client-base');
    }

    public function conditions_covereds() {
        return  $this->options('conditions-covered');
    }

    public function integration_capabilities() {
        return  $this->options('integration-capability');
    }

    public function provider_staffings() {
        return  $this->options('provider-staffing');
    }

    public function referral_sources() {
        return  $this->options('referral-source');
    }

    public function vendor_sections() {
        return  $this->options('vendor-section');
    }
    public function services() {
        return  $this->options('service');
    }

    private function options($type = 'modality') {
        return  $this->hasMany(UserCategory::class, 'user_id')
            ->leftJoin('categories', 'categories.id', '=', 'user_categories.category_id')
            ->select([
                'user_categories.user_id',
                'categories.id',
                'categories.name',
                'categories.description',
                'categories.image',
                'categories.thumb',
                'categories.type',
            ])
            ->where('categories.type', $type);
    }
}
