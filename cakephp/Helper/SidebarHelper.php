<?php

namespace App\View\Helper;


use Cake\View\Helper;
use Cake\Routing\Router;
use Cake\Utility\Inflector;

class SidebarHelper extends Helper {

    public $singleLiClasses = "u-sidebar-navigation-v1-menu-item u-side-nav--has-sub-menu u-side-nav--top-level-menu-item";
    public $singleAnchorClasses = "media u-side-nav--top-level-menu-link u-side-nav--hide-on-hidden g-px-15 g-py-12";
    public $singleSpanClasses = "d-flex align-self-center g-pos-rel g-font-size-18 g-mr-18";

    public $mainLiClasses = "u-sidebar-navigation-v1-menu-item u-side-nav--has-sub-menu u-side-nav--top-level-menu-item";
    public $mainAnchorClasses = "media u-side-nav--top-level-menu-link u-side-nav--hide-on-hidden g-px-15 g-py-12";
    public $mainSpanClasses = "d-flex align-self-center g-pos-rel g-font-size-18 g-mr-18";

    public $subUlClasses = "u-sidebar-navigation-v1-menu u-side-nav--second-level-menu mb-0";
    public $subLiClasses = "u-sidebar-navigation-v1-menu-item u-side-nav--second-level-menu-item";
    public $subAnchorClasses = "media u-side-nav--second-level-menu-link g-px-15 g-py-12";
    public $subSpanClasses = "d-flex align-self-center g-mr-15 g-mt-minus-1";


    public function create($menuItems = null) {
        if (!empty($menuItems)) {
            ?>
            <ul id="sideNavMenu"
                class="u-sidebar-navigation-v1-menu u-side-nav--top-level-menu g-min-height-100vh mb-0">
                <?php
                foreach ($menuItems as $index => $menuItem) {
                    $this->menuItem($menuItem, $index);
                }
                ?>
            </ul>
            <?php

            ?>
            <script>
                $(function () {



                    <?php if( $this->getView()->getRequest()->getParam('action') == "trainingVideo") {  ?>
                    var _this = $('[id*="nav_<?= $this->getView()->getRequest()->getParam('controller') . $this->getView()->getRequest()->getParam('action') . implode("", $this->getView()->getRequest()->getParam('pass')); ?>"]');
                    <?php } else { ?>
                    var _this = $('[id*="nav_<?= $this->getView()->getRequest()->getParam('controller') . str_replace("/", "", $this->getView()->getRequest()->getParam('action')); ?>"]');
                    <?php }?>


                    _this.children('a').addClass('active');
                    _this.children('a span i').addClass('fa-spin');
                    if (_this.parent().hasClass('u-side-nav--second-level-menu')) {
                        _this.parent().parent().addClass('u-side-nav-opened');
                    }

                    var _this = $('[id^="nav_<?= $this->getView()->getRequest()->getParam('controller'); ?>"]');
                    if (_this.hasClass('u-side-nav--second-level-menu')) {
                        _this.parent().addClass('u-side-nav-opened');
                        _this.parent().children('a').addClass('active');

                    }


                });
            </script>
            <?php
        }
    }

    public function menuItem($menuItem, $index) {
        $item = $this->buildMenuItem($menuItem);
        if (!$item['custom_sub_menu'] && !$item['default_sub_menu']) {
            $item = $this->buildItem($item);
            $id = 'nav_' . $item['controller'] . str_replace("/", "", $item['action']);
            $url = Router::url(['controller' => $item['controller'], 'action' => $item['action']]);
            ?>

            <li id="<?= $id; ?>" class="<?= $this->singleLiClasses; ?>">
                <a class="<?= $this->singleAnchorClasses; ?>" href="<?= $url; ?>">
                        <span class="<?= $this->singleSpanClasses; ?>">
                            <i class="<?= $item['icon_class']; ?>"></i>
                        </span>
                    <span class="media-body align-self-center"><?= $item['label']; ?></span>
                </a>
            </li>
        <?php } else { ?>
            <?php $mainId = 'nav_' . $item['controller']; ?>
            <li class="<?= $this->mainLiClasses; ?>">
                <a class="<?= $this->mainAnchorClasses; ?>" href="#!" data-hssm-target="#<?= $mainId; ?>">
                    <span class="<?= $this->mainSpanClasses; ?>">
                        <i class="<?= $item['icon_class']; ?>"></i>
                    </span>
                    <span
                            class="media-body align-self-center"><?= empty($item['label']) ? $item['controller'] : $item['label']; ?></span>
                    <span class="d-flex align-self-center u-side-nav--control-icon">
                        <i class="hs-admin-angle-right"></i>
                    </span>
                    <span class="u-side-nav--has-sub-menu__indicator"></span>
                </a>

                <!-- Panels/Cards: Submenu-1 -->
                <ul id="<?= $mainId; ?>" class="<?= $this->subUlClasses; ?>">

                    <?php if ($item['default_sub_menu']) {
                        foreach ($item['default_sub_menu_items'] as $subItem) {
                            $subItem = $this->buildItem($subItem);
                            $id = 'sub_nav_' . $subItem['controller'] . str_replace("/", "", $subItem['action']);
                            $url = Router::url(['controller' => $subItem['controller'],
                                                'action'     => $subItem['action']]);
                            ?>
                            <!-- Panel Variations -->
                            <li class="<?= $this->subLiClasses; ?>" id="<?= $id; ?>">
                                <a class="<?= $this->subAnchorClasses; ?>" href="<?= $url; ?>">
                            <span class="<?= $this->subSpanClasses; ?>">
                                <i class="<?= $subItem['icon_class']; ?>"></i>
                            </span>
                                    <span class="media-body align-self-center"><?= $subItem['label']; ?></span>
                                </a>
                            </li>
                            <!-- End Panel Variations -->
                        <?php } ?>
                    <?php } ?>

                    <?php
                    if (!empty($item['custom_sub_menu'])) {
                        foreach ($item['custom_sub_menu'] as $subItem) {
                            $subItem = $this->buildItem($subItem);
                            $id = 'nav_' . $subItem['controller'] . str_replace("/", "", $subItem['action']);
                            $url = Router::url(['controller' => $subItem['controller'],
                                                'action'     => $subItem['action']]);
                            ?>
                            <!-- Panel Variations -->
                            <li class="<?= $this->subLiClasses; ?>" id="<?= $id; ?>">
                                <a class="<?= $this->subAnchorClasses; ?>" href="<?= $url; ?>">
                            <span class="<?= $this->subSpanClasses; ?>">
                                <i class="<?= $subItem['icon_class']; ?>"></i>
                            </span>
                                    <span class="media-body align-self-center"><?= $subItem['label']; ?></span>
                                </a>
                            </li>
                            <!-- End Panel Variations -->
                        <?php } ?>
                    <?php } ?>
                </ul>
                <!-- End Panels/Cards: Submenu-1 -->
            </li>
            <?php
        }
    }

    public function buildItem($item) {
        return [
            'label'      => empty($item['label']) ? $item['controller'] : $item['label'],
            'controller' => $item['controller'],
            'action'     => empty($item['action']) ? 'index' : $item['action'],
            'icon_class' => empty($item['icon_class']) ? 'fa fa-circle-o' : $item['icon_class'],
        ];
    }

    public function buildMenuItem($item) {
        $plural = Inflector::humanize(Inflector::underscore($item['controller']));
        $singular = Inflector::singularize($plural);

        return [
            'label'                  => empty($item['label']) ? $plural : $item['label'],
            'controller'             => $item['controller'],
            'action'                 => empty($item['action']) ? 'index' : $item['action'],
            'icon_class'             => empty($item['icon_class']) ? 'fa fa-circle-o' : $item['icon_class'],
            'default_sub_menu'       => isset($item['default_sub_menu']) ? $item['default_sub_menu'] : true,
            'default_sub_menu_items' => [
                [
                    'label'      => "List " . $plural,
                    'controller' => $item['controller'],
                    'action'     => 'index',
                    'icon_class' => 'fa fa-list',
                ],
                [
                    'label'      => 'New ' . $singular,
                    'controller' => $item['controller'],
                    'action'     => 'add',
                    'icon_class' => 'fa fa-plus',
                ]
            ],
            'custom_sub_menu'        => empty($item['custom_sub_menu']) ? [] : $item['custom_sub_menu'],
        ];
    }
}
