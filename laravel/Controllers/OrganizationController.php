<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use App\Traits\Mailer;
use App\Traits\ImageUpload;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\OrganizationRequest;

class OrganizationController extends Controller {

    use Mailer, ImageUpload;

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request) {
        $organizations = User::where('role_id', 1);

        //For Search
        if (!empty($request->query('key'))) {
            $key = '%' .  $request->query('key') . '%';
            $organizations->where('display_name', 'like', $key);
        }
        //For Sorting
        if (!empty($request->query('sort'))) {
            if ($request->query('direction') == 'asc') {
                $organizations = $organizations->orderBy($request->query('sort'));
            } else {
                $organizations = $organizations->orderByDesc($request->query('sort'));
            }
        } else {
            $organizations = $organizations->orderByDesc('created_at');
        }

        $organizations = $organizations->paginate(10);
        return view('admin.organization.index', compact('organizations'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create() {
        return view('admin.organization.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(OrganizationRequest $request) {
        $organization = User::where('email', $request->email)->withTrashed()->first();
        if (empty($organization)) {
            $validated = $request->validated();
            $organization = new User();
        } else {
            $organization->deleted_at = null;
        }

        $organization->slug = empty($request->display_name) ?  uniqid() : $this->getSlug($request->display_name);
        $organization->display_name = $request->display_name;
        $organization->email = $request->email;
        $organization->description = $request->description;
        $organization->role_id = 1;
        
        if ($request->hasFile('image')) {
            $resp = $this->imageUpload($request->file('image'));
            $organization->image = $resp['imagePath'];
            $organization->thumb = $resp['thumbPath'];
        }

        if ($organization->save()) {
            try {
                $this->email([
                    'to' => $organization->email,
                    'subject' => env('APP_NAME') . ' - Welcome',
                    'template' => 'account-created',
                    'params' => [
                        "url" => env('FRONT_END_URL'),
                        "name" => $organization->display_name,
                        "email" => $organization->email,
                        "password" => $password,
                    ],
                ]);
            } catch (\Exception $e) {
                return redirect(route('admin.user.index'))->with("error", "The user has been created successfully, but could not send the email!");
            }
            return redirect(route('admin.user.index'))->with("success", "The user has been created successfully!");
        }

        return redirect()->back()->with("error", "New user failed to save");
    }

    public function getSlug($title) {
        $slug = Str::slug($title);
        $alreadySlugs = User::where('slug', $slug)->count();

        if ($alreadySlugs > 0) {
            $slug = $slug . '-' . $alreadySlugs;
        }

        return $slug;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id) {
        $organization = User::where('id', $id)->first();
        return view('admin.organization.show', [
            'organization' => $organization
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id) {
        $organization = User::where('id', $id)->first();
        return view('admin.organization.edit', [
            'organization' => $organization
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(OrganizationRequest $request, $id) {
        $validated = $request->validated();

        $organization = User::where('id', $id)->first();
        $organization->display_name = $request->display_name;
        $organization->email = $request->email;
        $organization->description = $request->description;

        if ($request->hasFile('image')) {
            $resp = $this->imageUpload($request->file('image'));
            $organization->image = $resp['imagePath'];
            $organization->thumb = $resp['thumbPath'];
        }

        if ($organization->save()) {
            return redirect(route('admin.user.index'))->with("success", "The user has been updated successfully!");
        }

        return redirect()->back()->with("error", "New user failed to update");
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id) {
        User::find($id)->delete();
        return back()->with('success', 'User deleted successfully');
    }
}
