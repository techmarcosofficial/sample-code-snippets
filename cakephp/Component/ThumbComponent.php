<?php

namespace App\Controller\Component;

use Cake\Controller\Component;

class ThumbComponent extends Component {


    /*
      THIS METHOD RUN AFTER OR BEFORE UPLOADING A FULL SIZE IMAGE THEN PASS THE UPLOADED IMAGE INFO TO THE METHOD AND IT WILL Resize Or Crop THE IMAGE ACCORDING TO THE WIDTH HEIGHT AND COORDINATES PASSED.
      GET 11 ARGUMENTS
      1) The source path of the image.
      2) The destination path of the image.
      3) Full info of the image like their type, siz etc.
      4) Image name.
      5) Required width of the image.
      6) Required height of the image. If null then it will adjust the height according to their aspect ratio.
      7) Prefix name that automatically added before the image name when saved.
      8) Quality of the image. But only works for the jpeg images.
      9) Image X coordinate incase if you want to crop the image.
      10) Image Y coordinate incase if you want to crop the image.
      11) Whether you want to crop the image or not. Default will be false.

     */

    public function create($attr = array()) {

        $default = array(
            'tmpname' => null,
            'destinationPath' => null,
            'image' => null,
            'name' => strtotime(date('y-m-d H:i:s')),
            'width' => 100,
            'argHeight' => 80,
            'thumb' => null,
            'jpeg_quality' => 90,
            'imageX' => 0,
            'imageY' => 0,
            'imageCrop' => false
        );
        $final_array = array_merge($default, $attr);
        extract($final_array);
        $new_width = $width;
        $info = $image['type'];
        //$fname = $width . 'x' . $argHeight . '_' . $name;
        $fname = $name;



        $newImageInfo = array();
        /* Check the image type(extension)
         * And according to their type create new image of same type */
        if ($info == "image/jpeg" || $info == "image/pjpeg" || $info == "image/jpg")
            $img = imagecreatefromjpeg($tmpname);
        else if ($info == "image/png")
            $img = imagecreatefrompng($tmpname);
        if ($info == "image/gif")
            $img = imagecreatefromgif($tmpname);

        $width = imagesx($img);
        $height = imagesy($img);

        //pr($tmpname);

        // pr('AFTER ORIENTATION');
        // pr($width);
        // pr($height);

        $new_height = (!$argHeight == NULL && !$argHeight == '') ? $argHeight : floor($height * ($new_width / $width));

        $tmp_img = imagecreatetruecolor($new_width, $new_height);
        if ($imageCrop) {
            imagecopyresampled($tmp_img, $img, 0, 0, $imageX, $imageY, $new_width, $new_height, $new_width, $new_height); //resize the image
        } else {
            imagecopyresampled($tmp_img, $img, 0, 0, $imageX, $imageY, $new_width, $new_height, $width, $height); //resize the image
        }
        $newImageInfo['height'] = $new_height;
        $newImageInfo['width'] = $new_width;
        $newImageInfo['type'] = $info;

        /* Save image according to their type */
        if ($info == "image/jpeg" || $info == "image/pjpeg" || $info == "image/jpg") {
            imagejpeg($tmp_img, $destinationPath . $thumb . $fname, 90);
        } else if ($info == "image/png") {
            imagepng($tmp_img, $destinationPath . $thumb . $fname);
        } else if ($info == "image/gif") {
            imagegif($tmp_img, $destinationPath . $thumb . $fname);
        }
        //pr($destinationPath . $thumb . $fname);
        chmod($destinationPath . $thumb . $fname, 0777);
        if ($info == "image/jpeg" || $info == "image/pjpeg" || $info == "image/jpg") {
            $exif_data = exif_read_data($tmpname);
            $orientation = $this->orientation($exif_data);
            $degrees = $this->orientation_flag($orientation);
            $img = imagecreatefromjpeg($destinationPath . $thumb . $fname);
            $img = imagerotate($img, $degrees, 0);
            imagejpeg($img, $destinationPath . $thumb . $fname);
        }

        // pr($newImageInfo);

        return $newImageInfo;
    }

    function orientation($exif_data) {
        // search array for orientation
        foreach ($exif_data as $key => $val) {
            if (strtolower($key) == 'orientation') {
                return $val;
            }
        }
    }


    // gets orientation data and returns degrees needed for rotation
    function orientation_flag($orientation) {
        switch ($orientation):
            case 1:
                return 0;
            case 8:
                return 90;
            case 3:
                return 180;
            case 6:
                return 270;
        endswitch;
    }
}
