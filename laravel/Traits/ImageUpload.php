<?php

namespace App\Traits;

use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;


trait ImageUpload {

    public function imageUpload($query) { // Taking input image as parameter

        $ext = strtolower($query->getClientOriginalExtension()); // You can use also getClientOriginalName()
        
        $randStr = Str::random(20);

        $fileName = $randStr . time() . '.' . $ext;
        
        if (in_array(strtolower($ext), ['png', 'jpeg', 'jpg'])) {

            if (!file_exists(storage_path() . '/images/')) {
                mkdir(storage_path() . '/images/', 0777, true);
            }

            if (!file_exists(storage_path() . '/images/thumbnail/')) {
                mkdir(storage_path() . '/images/thumbnail/', 0777, true);
            }

            //large thumbnail name
            $query->storeAs('public/images', $fileName);
            $query->storeAs('public/images/thumbnail', $fileName);

            //create medium thumbnail
            $imagePath = "storage/images/$fileName";
            $thumbPath = "storage/images/thumbnail/$fileName";


          // pr(public_path($thumbPath)); die;

            $this->createThumbnail(public_path($thumbPath), 300, 185);

            return [
                "imagePath" => $imagePath,
                "thumbPath" => $thumbPath,
            ];
        } else {
            if (!file_exists(storage_path() . '/images/')) {
                mkdir(storage_path() . '/images/', 0777, true);
            }

            $query->storeAs('public/images', $fileName);
            $filePath = "storage/images/$fileName";

            return [
                "imagePath" => $filePath,
                "thumbPath" => 'front/images/cr2.jpg',
            ];
            
        }
    }

    public function createThumbnail($path, $width, $height) {
        info($path);
        $img = Image::make($path)->resize($width, $height, function ($constraint) {
            $constraint->aspectRatio();
        });
        $img->save($path);
    }
}
