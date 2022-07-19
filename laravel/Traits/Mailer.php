<?php

namespace App\Traits;

use Illuminate\Support\Facades\Mail;
use App\Mail\Emailable;

trait Mailer {

    public function email($options = []) {

        Mail::send(new Emailable($options));
        return true;
    }
}
