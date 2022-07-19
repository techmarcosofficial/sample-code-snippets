<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrganizationRequest extends FormRequest {
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize() {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules() {
        if ($this->route()->getName() == 'admin.user.update') {
            return [
                'display_name' => 'required|max:100',
                'email' => 'required|email|max:200',
                'description' => 'nullable|max:5000',
            ];
        } else {
            return [
                'display_name' => 'required|max:100',
                'email' => 'required|email|unique:users,email,NULL,id,deleted_at,NULL|max:200',
                'description' => 'nullable|max:5000',
            ];
        }
    }
}
