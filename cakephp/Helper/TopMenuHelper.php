<?php

namespace App\View\Helper;


use Cake\View\Helper;
use Cake\Routing\Router;

class TopMenuHelper extends Helper {
    
    public $singleLiClasses = "nav-item ";
    public $singleAnchorClasses = "nav-link";
    
    
    public function create($menuItems = null) {
        if (!empty($menuItems)) {
            
            foreach ($menuItems as $menuItem) {
                if (empty($menuItem['sub_menu_items'])) {
                    $this->menuItem($menuItem);
                } else {
                    $this->menuSubMenuItem($menuItem);
                }
            }
            
            ?>
            <script>
                $(function () {
                    var _this = $('.topNav_<?= $this->getView()->getRequest()->getParam('controller') . $this->getView()->getRequest()->getParam('action'); ?>');
                    _this.children('a').addClass('active');
                });
            </script>
            <?php
        }
    }
    
    public function menuItem($item) {
        $item = $this->buildItem($item);
        $id = 'topNav_' . $item['controller'] . $item['action'];
        if(empty($item['option'])) {
            $url = Router::url(['controller' => $item['controller'], 'action' => $item['action']]);
        } else {
            $url = Router::url(['controller' => $item['controller'], 'action' => $item['action'], $item['option']]);
        }
        ?>
        <li class="<?= $this->singleLiClasses; ?> <?= $id; ?>">
            <a class="<?= $this->singleAnchorClasses; ?>" href="<?= $url; ?>"><?= $item['label']; ?></a>
        </li>
        <?php
    }
    
    public function subMenuItem($item) {
        $item = $this->buildItem($item);
        $id = 'topNav_' . $item['controller'] . $item['action'];
        if(empty($item['option'])) {
            $url = Router::url(['controller' => $item['controller'], 'action' => $item['action']]);
        } else {
            $url = Router::url(['controller' => $item['controller'], 'action' => $item['action'], $item['option']]);
        }
        ?>
        <li class="<?= $this->singleLiClasses; ?> <?= $id; ?>">
            <a class="<?= $this->singleAnchorClasses; ?>" href="<?= $url; ?>"><?= $item['label']; ?></a>
        </li>
        <?php
    }
    
    public function menuSubMenuItem($item) {
        $itm = $this->buildItem($item);
        $id = empty($item['id']) ? 'topNav_' . $itm['controller'] . $itm['action'] : 'topNav_' . $item['id'];
        ?>
        <li class="nav-item hs-has-sub-menu g-mx-10--lg g-mx-15--xl" data-animation-in="fadeIn"
            data-animation-out="fadeOut" style="    margin-top: 1%;">
            <a id="nav-link--<?= $id; ?>" class="nav-link g-py-7 g-px-0" href="javascript:void(0);" aria-haspopup="true"
               aria-expanded="false" aria-controls="nav-submenu--<?= $id; ?>"><?= $item['label']; ?></a>
            <ul class="hs-sub-menu list-unstyled u-shadow-v11 g-color-white g-min-width-220 g-mt-18 g-mt-8--lg--scrolling animated fadeOut"
                id="nav-submenu--<?= $id; ?>" aria-labelledby="nav-link--features" style="width:240px; display: none; background: none !important; margin-top: 1% !important;">
                <?php
                foreach ($item['sub_menu_items'] as $subMenuItem) {
                    $this->subMenuItem($subMenuItem);
                }
                
                ?>
            </ul>
        </li>
        <?php
    }
    
    public function buildItem($item) {
        return [
            'label' => empty($item['label']) ? $item['controller'] : $item['label'],
            'controller' => $item['controller'],
            'action' => empty($item['action']) ? 'index' : $item['action'],
            'option'=>empty($item['option']) ? null : $item['option'],
        ];
    }
}
