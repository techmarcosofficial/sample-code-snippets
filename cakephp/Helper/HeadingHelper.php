<?php

namespace App\View\Helper;


use Cake\View\Helper;

class HeadingHelper extends Helper {
    
    public $headingClasses = "u-sidebar-navigation-v1-menu-item u-side-nav--has-sub-menu u-side-nav--top-level-menu-item";
    
    
    public function create($heading = null) {
        if (!empty($heading)) {
            ?>
            <h3 class="<?= $this->headingClasses; ?>" style="color: #007eef !important  "><?= __($heading) ?></h3>
            <?php
        }
    }
}
