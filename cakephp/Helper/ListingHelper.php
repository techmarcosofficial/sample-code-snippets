<?php

namespace App\View\Helper;


use Cake\View\Helper;
use Cake\Routing\Router;
use Cake\Utility\Inflector;

class ListingHelper extends Helper {

    public $controller;
    public $relatedModel;
    public $obj;
    public $object;
    public $objectFieldValue;
    public $fields;
    public $field;
    public $includeStatusScript = false;
    public $hasPagination = false;
    public $paging = false;
    public $bulk;
    public $search;
    public $request;
    public $view;
    public $hideDeleteButtonIf;

    public function create($params = null, $actions = ['view', 'edit', 'delete']) {
        $this->view = $this->getView();
        $this->request = $this->view->getRequest();
        $this->controller = isset($params['controller']) ? $params['controller'] : $this->request->getParam('controller');
        $this->object = isset($params['object']) ? $params['object'] : $this->view->get($this->view->getVars()[0]);

        $this->fields = $params['fields'];
        $this->hideDeleteButtonIf = empty($params['hideDeleteButtonIf']) ? [] : $params['hideDeleteButtonIf'];


        if (!empty($this->getView()->getRequest()->getParam('paging'))) {

            $this->paging = array_values($this->getView()->getRequest()->getParam('paging'))[0];
            if ($this->paging['count'] > 0) {
                $this->hasPagination = true;
                $this->setBulk($params);
                $this->setSearch($params);
            }
        }


        if (!empty($this->fields)) {
            $this->createSearchAndBulkActions();
            ?>
            <style>
                .sortable a {
                    color: #ffffff !important;
                }
            </style>
            <div class="faqs table-responsive g-mb-40">
                <table cellpadding="0" cellspacing="0"
                       class="table table-bordered table-hover u-table--v3 g-color-black table-striped">
                    <thead>
                    <tr class=" g-color-white" style="background-color: #007eef !important; color: #ffffff !important;">
                        <!-- th style="width: 6%;">Sr. No.</th -->
                        <?php foreach ($this->fields as $field) { ?>
                            <?php $field['type'] = empty($field['type']) ? 'text' : $field['type']; ?>
                            <?php $sortableField = empty($field['sortable_field_name']) ? $field['name'] : $field['sortable_field_name']; ?>
                            <?php if (isset($field['sortable']) && $field['sortable'] == false) { ?>
                                <th scope="col"
                                    class="<?= in_array($field['type'], ["image",
                                                                         "video"]) ? "text-center" : "" ?>"><?= __(empty($field['label']) ? $field['name'] : $field['label']) ?></th>
                            <?php } else { ?>
                                <th scope="col"
                                    class="sortable"><?= $this->view->Paginator->sort($sortableField, empty($field['label']) ? null : $field['label']) ?></th>
                            <?php } ?>
                        <?php } ?>
                        <?php if (!empty($actions)) { ?>
                            <th scope="col" class="actions"
                                style="width: <?= count($actions) * 7; ?>%;"><?= __('Actions') ?></th>
                        <?php } ?>
                    </tr>
                    </thead>
                    <tbody>
                    <?php if (count($this->object) <= 0) { ?>
                        <tr>
                            <td colspan="<?= count($this->fields) + (!$this->hasPagination ? 1 : 2); ?>">

                                <h3>No Records Found </h3>

                            </td>
                        </tr>
                    <?php } else { ?>
                        <?php foreach ($this->object as $srNo => $obj): ?>
                            <?php $this->obj = $obj; ?>
                            <tr>
                                <!-- td><?php // ($srNo + (($this->paging['page'] - 1) * $this->paging['perPage']) + 1); ?></td -->
                                <?php
                                foreach ($this->fields as $field) {
                                    $field['type'] = empty($field['type']) ? 'text' : $field['type'];
                                    $this->field = $field;
                                    $this->fieldValue();

                                    ?>
                                    <td class="<?= in_array($field['type'], ["image",
                                                                             'video']) ? "text-center" : "" ?>">
                                        <?php
                                        if (in_array($this->field['name'], ['created', 'modified'])) {
                                            $this->createDateTime();
                                        } else {
                                            switch ($field['type']) {
                                                case 'image':
                                                    {
                                                        $this->createImage();
                                                        break;
                                                    }
                                                case 'video':
                                                    {
                                                        $this->createVideo();
                                                        break;
                                                    }
                                                case 'link':
                                                    {
                                                        $this->createLink();
                                                        break;
                                                    }
                                                case 'status':
                                                    {
                                                        $this->createStatus();
                                                        $this->includeStatusScript = true;
                                                        break;
                                                    }
                                                case 'datetime':
                                                    {
                                                        $this->createDateTime();
                                                        break;
                                                    }
                                                case 'date':
                                                    {
                                                        $this->createDate();
                                                        break;
                                                    }
                                                case 'currency':
                                                    {
                                                        $this->createCurrency();
                                                        break;
                                                    }
                                                case 'join-currency':
                                                    {
                                                        $this->createJoinCurrency();
                                                        break;
                                                    }
                                                case 'text':
                                                    {
                                                        $this->createText();
                                                        break;
                                                    }
                                            }
                                        }
                                        ?>
                                    </td>
                                    <?php

                                }
                                ?>
                                <?php
                                if (!empty($actions)) {
                                    $this->createActions($actions);
                                }

                                ?>
                            </tr>
                        <?php endforeach; ?>
                    <?php } ?>
                    </tbody>
                </table>
                <?php $this->statusScript(); ?>
                <?php if ($this->hasPagination) { ?>
                    <script>
                        $(document).ready(function () {
                            var deleteBtn = null;
                            $('#selectAll').click(function (e) {
                                $('.select-row').prop('checked', $(this).is(':checked'));
                            });

                            $('.select-row').click(function (e) {
                                var totalChecks = $('.select-row').length;
                                var checkedChecks = $('.select-row:checked').length;

                                $('#selectAll').prop('checked', ((totalChecks == checkedChecks) ? true : false));
                            });

                            $('.js-select').selectpicker();

                            $('.delete-btn').click(function (e) {
                                e.preventDefault();
                                deleteBtn = $(this).attr('id');
                            });

                            $('#deleteIt').click(function (e) {
                                e.preventDefault();
                                deleteBtn = $('#' + deleteBtn.replace("btn", 'form')).submit();
                            });
                            $.HSCore.components.HSModalWindow.init('[data-modal-target]');

                            $('#applyAction').click(function (e) {
                                e.preventDefault();
                                alert('This  feature is in progress..')
                            });
                        });
                    </script>
                    <div id="deleteConfirmModal"
                         class="text-left g-color-white g-overflow-y-auto  g-pa-20"
                         style="display: none; width: auto; min-width: 600px; height: auto; padding: 10%; background-color:#007eef">
                        <button type="button" class="close" onclick="Custombox.modal.close();">
                            <i class="hs-icon hs-icon-close"></i>
                        </button>
                        <h4 class="h4 g-mb-20">
                            Delete <?= Inflector::humanize(Inflector::singularize(Inflector::underscore($this->controller))) ?></h4>
                        <div calss="modal-body" id="imageMedia" style="position: relative;">
                            <div class="row">
                                <div class="col-md-12">
                                    <h5 class="h5">Are you sure you want delete this?</h5>
                                </div>
                                <div class="col-md-7"></div>
                                <div class="col-md-5">
                                    <button type="button" class="btn btn-danger pull-left ml-4" id="deleteIt">
                                        <i class="fa fa-trash"></i> Delete
                                    </button>
                                    &nbsp;
                                    <button type="button" class="btn btn-dark pull-right"
                                            onclick="Custombox.modal.close();">
                                        <i class="fa fa-close"></i> Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="clear-both"></div>
                    </div>
                <?php } ?>
                <link href="https://vjs.zencdn.net/7.7.5/video-js.css" rel="stylesheet"/>
                <script src="https://vjs.zencdn.net/ie8/1.1.2/videojs-ie8.min.js"></script>
                <div id="videoPlayerListModal"
                     class="text-left g-color-white g-bg-black g-overflow-y-auto "
                     style="display: none; width: auto; min-width: 640px; height: auto; min-height: 480px; padding: 1%;">
                    <button type="button" class="close" onclick="Custombox.modal.close();">
                        <i class="hs-icon hs-icon-close"></i>
                    </button>

                    <div calss="modal-body text-center" style="position: relative;">
                        <video
                                id="tourVideoPlayerListJS"
                                class="video-js"
                                controls
                                preload="auto"
                                width="640"
                                height="480"
                                data-setup="{}"
                        ></video>
                        <script src="https://vjs.zencdn.net/7.7.5/video.js"></script>

                    </div>
                    <div class="clear-both"></div>
                </div>
                <div id="showImgListModal"
                     class="text-left g-color-white g-bg-gray-dark-v2 g-overflow-y-auto "
                     style="display: none; width: auto; min-width: 200px; height: auto; min-height: 200px; padding: 1%;">
                    <button type="button" class="close" onclick="Custombox.modal.close();">
                        <i class="hs-icon hs-icon-close"></i>
                    </button>
                    <div calss="modal-body text-center" style="position: relative;">
                        <div style="text-align: center; margin-top: 8%">
                            <img id="fpImageToShowList" src="<?= SITE_URL.DEFAULT_IMAGE; ?>"/>
                        </div>
                        <div class="clear-both"></div>
                    </div>
                </div>
                <script>
                    var vgsPlayerList, posterList, urlList, fileWindow = null;

                    $(function () {

                        $('.load-video-player-list').hide();

                        setTimeout(function () {
                            vgsPlayerList = videojs('tourVideoPlayerListJS', {
                                techOrder: ["html5"],
                                autoplay: false,
                            });

                            vgsPlayerList.poster("<?=  SITE_URL . 'files/images/default_video.png'; ?>");
                            $('.load-video-player-list').fadeIn();
                        }, 1500);

                        $('.load-video-player-list').click(function (e) {
                            e.preventDefault();

                            urlList = $(this).attr('data-url');
                            posterList = "<?=  SITE_URL . 'files/images/default_video.png'; ?>";


                            var newModal = new Custombox.modal({
                                content: {
                                    target: '#videoPlayerListModal',
                                    effect: 'slide',
                                    animateFrom: 'top',
                                    animateTo: 'bottom',
                                    positionX: 'center',
                                    positionY: 'center',
                                    speedIn: 300,
                                    speedOut: 300,
                                    fullscreen: false,
                                    onClose: function () {
                                        vgsPlayerList.pause();
                                    },
                                    onOpen: function () {

                                        var v = "";
                                        if (urlList.includes('mp4')) {
                                            v = {
                                                type: "video/mp4",
                                                src: urlList
                                            };
                                        } else {
                                            v = {
                                                type: "video/webm",
                                                src: urlList
                                            }
                                        }

                                        vgsPlayerList.src([v]);
                                        vgsPlayerList.poster(posterList);
                                        vgsPlayerList.play();
                                    }
                                }
                            });
                            newModal.open();

                        });

                        $('.show-img-list').click(function (e) {
                            e.preventDefault();

                            if ($(this).attr('data-file-type') == "FILE") {
                                window.open($(this).attr('data-file'), '_blank');
                            } else {

                                var img = $(this).attr('src');

                                var imgListModal = new Custombox.modal({
                                    content: {
                                        target: '#showImgListModal',
                                        positionX: 'center',
                                        positionY: 'center',
                                        speedIn: 300,
                                        speedOut: 300,
                                        fullscreen: false,
                                        onClose: function () {
                                            $('#fpImageToShowList').attr('src', "<?= SITE_URL; ?>files/images/loading-image.gif");
                                        },
                                        onOpen: function () {
                                            $('#fpImageToShowList').attr('src', img.replace('small', 'large'));
                                        }
                                    }
                                });
                                imgListModal.open();
                            }
                        });
                    });
                </script>
            </div>
            <?php
            $this->pagination();
        }
    }

    public function fieldValue() {
        if (isset($this->field['join'])) {
            foreach ($this->field['join'] as $name) {
                if ($this->field['type'] == 'join-currency') {
                    $val = $this->getValue($name);
                    $values[] = $this->view->Number->currency(empty($val) ? 0 : $val, 'USD');

                } else {
                    $values[] = $this->getValue($name);
                }
            }
            $this->objectFieldValue = implode(empty($this->field['separator']) ? " " : $this->field['separator'], $values);
        } else {
            $this->objectFieldValue = $this->getValue($this->field['name']);
        }

        if (isset($this->field['short'])) {
            $this->objectFieldValue = strip_tags($this->objectFieldValue); 
            $dots = (strlen($this->objectFieldValue) > (int)$this->field['short']) ? ".." : "";
            if (strlen($this->objectFieldValue) > (int)$this->field['short']) {
                $this->objectFieldValue = substr($this->objectFieldValue, 0, strpos($this->objectFieldValue, ' ', $this->field['short'])) . $dots;
            }
        }
    }

    public function getValue($name) {
        $objectFieldValue = "";
        if (strpos($name, '_id') !== false) {
            $relatedModel = str_replace('_id', '', $name);

            if ($this->obj->has($relatedModel)) {

                if (!empty($this->field['related_model_fields'])) {

                    $values = [];
                    foreach ($this->field['related_model_fields'] as $f) {
                        $values[] = $this->getChildValue($this->obj->{$relatedModel}, $f);
                    }
                    $objectFieldValue = implode(empty($this->field['separator']) ? " " : $this->field['separator'], $values);
                } else {
                    $objectFieldValue = $this->obj->{$relatedModel}->name;
                }
            }
        } else {
            $objectFieldValue = $this->obj->{$name};
        }

        return $objectFieldValue;
    }

    public function getChildValue($obj, $name) {
        $value = "";
        if (strpos($name, '_id') !== false) {
            $relatedModelInner = str_replace('_id', '', $name);
            if ($obj->has($relatedModelInner)) {
                $value = $obj->{$relatedModelInner}->name;
            }
        } else {
            $value = $obj->{$name};
        }

        return $value;
    }

    public function createImage() {
        $relatedModel = str_replace('_id', '', $this->field['name']);
        $image = SITE_URL . (($this->obj->has($relatedModel)) ? $this->obj->{$relatedModel}->small_thumb : DEFAULT_IMAGE);
        $fileType = (($this->obj->has($relatedModel)) ? $this->obj->{$relatedModel}->file_type : 'IMAGE');
        $file = SITE_URL . (($fileType == "FILE") ? $this->obj->{$relatedModel}->image : $image);

        ?>
        <img class="img-fluid detail-img-fluid rounded-circle show-img-list" data-file-type="<?= $fileType; ?>"
             data-file="<?= $file; ?>" src="<?= $image; ?>" style="width:100px; height: 100px;"
             alt="Profile Image">
        <?php
    }

    public function createVideo() {
        $relatedModel = str_replace('_id', '', $this->field['name']);
        $file = false;
        $videoTitle = "Video Not Found";
        if ($this->obj->has($relatedModel)) {
            $image = SITE_URL . $this->obj->{$relatedModel}->small_thumb;
            if ($this->obj->{$relatedModel}->file_type == "VIDEO") {
                $file = SITE_URL . $this->obj->{$relatedModel}->image;
                $videoTitle = "Click to Video";
            }

        } else {
            $image = SITE_URL . 'files/images/default_video.png';
        }
        ?>
        <div class="d-inline-block g-pos-rel">
            <?php if ($file) { ?>
                <a
                        class="u-badge-v4--lg g-width-100 g-height-100 load-video-player-list"
                        href="javascript:void(0);"
                        data-url="<?= $file; ?>"
                        data-poster="<?= $image; ?>"

                        style="top:50%; right: 50%;"

                >

                </a>

            <?php } ?>
            <img class="img-fluid detail-img-fluid rounded-circle " src="<?= $image; ?>"
                 style="width:100px; height: 100px;"
                 alt="Video Description" title="<?= $videoTitle; ?>">
        </div>
        <?php
    }

    public function createLink() {
        if(empty($this->field['url'])) {
            $url = "javascript:void(0);";
        } else {
            $linkUrl = $this->field['url'];
            $linkUrl[] = empty($this->field['id_field']) ? $this->obj->id : $this->obj->{$this->field['id_field']};
            $url = Router::url($linkUrl);
        }

        $cssClass = empty($this->field['class']) ? "" : $this->field['class'];
        if(!empty($this->field['conditional_class']) && !empty($this->field['match'])){
            if( $this->objectFieldValue == $this->field['match'] ){
                $cssClass = $this->field['conditional_class'];
            }
        }
        ?>
        <a
                href="<?=  $url?>"
                class="<?= $cssClass ?>"
                data-id="<?= $this->obj->id; ?>">
            <?= empty($this->field['link_label']) ? $this->objectFieldValue : $this->field['link_label']; ?>
        </a>
        <?php
    }

    public function createStatus() {
        $anchorClasses = "btn btn-sm btn-success rounded-3x";
        $activeText = empty($this->field['active_text']) ? "Active" : $this->field['active_text'];
        $inactiveText = empty($this->field['inactive_text']) ? "Inactive" : $this->field['inactive_text'];
        if ((int)$this->objectFieldValue < 0) {
            $label = "Pending";
        } else {
            if ($this->objectFieldValue) {
                $label = $activeText;
            } else {
                $anchorClasses = $anchorClasses . " btn-danger ";
                $label = $inactiveText;
            }
        }
        $readOnly = '';
        if (isset($this->field['readonly'])) {
            $readOnly = 'disabled';
            $anchorClasses = $anchorClasses . " disabled  btn btn-sm btn-default";
        } else {
            $anchorClasses = $anchorClasses . ' active-deactive';
        }

        ?>
        <button class="<?= $anchorClasses; ?>"
                id="<?= Inflector::camelize($this->field['name']); ?>_<?= $this->obj->id ?>"
                data-model="<?= $this->field['model']; ?>"
                data-field="<?= $this->field['name'] ?>"
                data-active-text="<?= $activeText ?>" data-inactive-text="<?= $inactiveText ?>" <?= $readOnly; ?>>
            <?= $label ?>
        </button>

    <?php }

    public function createDate() {

        echo empty($this->objectFieldValue) ? "NA" : date(DATE_PICKER, strtotime($this->objectFieldValue));
    }

    public function createCurrency() {

        echo $this->view->Number->currency(empty($this->objectFieldValue) ? 0 : $this->objectFieldValue, 'USD');
    }

    public function createJoinCurrency() {

        echo $this->objectFieldValue;
    }

    public function createDateTime() {

        echo empty($this->objectFieldValue) ? "NA" : date(SHORT_DATE, strtotime($this->objectFieldValue));
    }

    public function createText() {
        echo $this->objectFieldValue;
    }

    public function createActions($actions) {

        ?>
        <td class="actions">
            <?php
            foreach ($actions as $action) {
                if (is_array($action)) {
                    $this->customAction($action);
                } else {
                    $this->{$action}();
                }
            }
            ?>
        </td>
        <?php
    }

    public function customAction($action = []) {

        $htmlId = empty($action['htmlId']) ? "customAction_" : $action['htmlId'];

        if (isset($action['id']) && !empty($action['id'])) {
            if (empty($action['id_field'])) {
                $action['url'][] = $this->obj->id;
                $htmlId = $htmlId . $this->obj->id;
            } else {
                $action['url'][] = $this->obj->{$action['id_field']};
                $htmlId = $htmlId . $this->obj->{$action['id_field']};
            }
        }

        if (!empty($action['field'])) {
            $action['url'][] = $this->obj->{$action['field']};
            $htmlId = $htmlId . $this->obj->{$action['field']};
        }

        $url = Router::url($action['url']);
        ?>
        <a href="<?= $url; ?>" class=" <?= empty($action['class']) ? "btn btn-dark btn-sm" : $action['class']; ?>"
           style="float: left; margin-left: 10px;" id="<?= $htmlId; ?>">
            <i class='<?= empty($action['icon']) ? "fa fa-circle-o" : $action['icon']; ?>'></i> <?= $action['label']; ?>
        </a>
        <?php
    }

    public function view() {
        $url = Router::url(['controller' => $this->controller, 'action' => 'view', $this->obj->id]);
        ?>
        <a href="<?= $url; ?>" class="btn btn-success btn-sm" style="float: left; margin-left: 10px;">
            <i class='hs-admin-eye'></i> Detail
        </a>
        <?php
    }

    public function edit() {
        $url = Router::url(['controller' => $this->controller, 'action' => 'edit', $this->obj->id]);
        ?>
        <a href="<?= $url; ?>" class="btn btn-primary btn-sm" style="float: left; margin-left: 10px;">
            <i class='hs-admin-pencil'></i> Edit
        </a>
        <?php
    }

    public function delete() {
        $show = true;
        if (!empty($this->hideDeleteButtonIf)) {
            if ($this->obj->{$this->hideDeleteButtonIf['field']} == $this->hideDeleteButtonIf['match']) {
                $show = false;
            }
        }
        if ($show) {
            $url = ['controller' => $this->controller, 'action' => 'delete', $this->obj->id];
            //$url = 'javascript:void(0);';
            ?>
            <?= $this->view->Form->create(null, ['url' => $url, 'id' => 'delete_' . $this->obj->id . '_form']); ?>
            <button data-modal-target="#deleteConfirmModal"
                    data-modal-effect="slide" class="btn btn-danger btn-sm delete-btn"
                    style="float: left; margin-left: 10px;" id="delete_<?= $this->obj->id; ?>_btn"><i
                        class="hs-admin-close"></i> Delete
            </button>
            <?= $this->view->Form->end(); ?>
            <?php
        }
    }

    public function pagination() {
        if ($this->view->Paginator->hasPage()) {
            ?>
            <div class="paginator">
                <ul class="pagination">
                    <?= $this->view->Paginator->first('<< ' . __('first')) ?>
                    <?= $this->view->Paginator->prev('< ' . __('previous')) ?>
                    <?= $this->view->Paginator->numbers() ?>
                    <?= $this->view->Paginator->next(__('next') . ' >') ?>
                    <?= $this->view->Paginator->last(__('last') . ' >>') ?>
                </ul>
                <p><?= $this->view->Paginator->counter(['format' => __('Page {{page}} of {{pages}}, showing {{current}} record(s) out of {{count}} total')]) ?></p>
            </div>
            <?php
        }
    }

    public function statusScript() {

        if ($this->includeStatusScript) {
            ?>
            <script>
                $(document).ready(function () {

                    $('.active-deactive').click(function () {
                        var _this = $(this);
                        var model = _this.attr('data-model');
                        var field = _this.attr('data-field');
                        var id = _this.attr('id').split('_')[1];

                        $.ajax({
                            url: SITE_URL + "admin/admins/changeStatus/",
                            type: "POST",
                            data: {model: model, field: field, id: id},
                            dataType: "json",
                            beforeSend: function () {
                                _this.html(_this.html() + ' <i class="fa fa-spinner fa-spin"></i>');
                            },
                            success: function (response) {

                                if (response.code == 200) {

                                    _this.removeClass('btn-u-orange');

                                    if (response.data.new_status) {
                                        _this.html(_this.attr('data-active-text'));
                                    } else {
                                        _this.addClass('btn-u-orange');
                                        _this.html(_this.attr('data-inactive-text'));
                                    }
                                } else {
                                    $().showFlashMessage("error", response.message);
                                }
                            }
                        });
                    });

                });
            </script>
            <?php
        }
    }

    public function setBulk($params) {
        $bulk = empty($params['bulk']) ? [] : $params['bulk'];
        $defaultBulk = [
            'actions' => [
                'active'   => 'Active',
                'inactive' => 'Inactive',
                'delete'   => 'Delete',
            ],
        ];

        $bulk += $defaultBulk;

        $this->bulk = $bulk;

    }

    public function setSearch($params) {
        $search = empty($params['search']) ? [] : $params['search'];
        $model = empty($search['model']) ? array_keys($this->getView()->getRequest()->getParam('paging'))[0] : $search['model'];

        $match = [];
        if (empty($search['match'])) {
            $match = [$model . '.name'];
        } else {
            foreach ($search['match'] as $relatedModel => $m) {
                if (is_array($m)) {
                    foreach ($m as $f) {
                        $match[] = $relatedModel . '.' . $f;
                    }
                } else {
                    $match[] = $model . '.' . $m;
                }

            }
        }

        $finalSearch = [
            'controller'  => empty($search['controller']) ? $this->request->getParam('controller') : $search['controller'],
            'action'      => empty($search['action']) ? $this->request->getParam('action') : $search['action'],
            'model'       => $model,
            'match'       => $match,
            'placeholder' => empty($search['placeholder']) ? 'Search...' : $search['placeholder'],
        ];
        $this->search = $finalSearch;
    }


    public function createSearchAndBulkActions() {
        if ($this->hasPagination) {
            if (empty($this->search['url'])) {
                $url = Router::url(['controller' => empty($this->search['controller']) ? $this->controller : $this->search['controller'],
                                    'action'     => empty($this->search['action']) ? 'index' : $this->search['action']]);
            } else {
                $url = Router::url($this->search['url']);
            }
            ?>
            <div class="row g-mt-10">
                <div class="col-md-6">&nbsp;</div>
                <div class="col-md-6">
                    <?= $this->view->Form->create(null, ['id' => 'searchFrom', 'url' => $url]) ?>
                    <div class="row">
                        <div class="col-md-2" id="searchEmptySection">&nbsp;</div>
                        <div class="col-md-8 text-right pr-0">
                            <div class="form-group">
                                <div class="g-pos-rel">
                      <span class="g-pos-abs g-top-0 g-right-0 d-block g-width-50 h-100">
	                    <i class="hs-admin-search g-absolute-centered g-font-size-16 g-color-gray-light-v6"></i>
	                  </span>
                                    <input id="listingSearchKey"
                                           name="key"
                                           class="form-control form-control-md g-brd-gray-light-v7 g-brd-gray-light-v3--focus g-rounded-4 g-px-14 g-py-10"
                                           type="text" placeholder="<?= $this->search['placeholder']; ?>"
                                           value="<?= $this->view->get('search_key'); ?>"
                                    >
                                </div>
                            </div>
                            <input type="hidden" name="search_in_listings" value="true"/>
                            <input type="hidden" name="match" value="<?= implode(",", $this->search['match']); ?>"
                                   id="searchMatches"/>
                        </div>

                        <div class="col-md-2 text-right pl-0">
                            <button type="submit" class="btn btn-primary btn-lg" id="searchInListing">Search</button>
                        </div>
                    </div>
                    <?= $this->view->Form->end(); ?>
                </div>
                <script>
                    $(function () {
                        $('#searchFrom').submit(function (e) {
                            e.preventDefault();
                            window.location.href = "<?= $url; ?>/?keyword=" + $('#listingSearchKey').val() + "&match=<?= implode(',', $this->search['match']); ?>";

                        });
                    });
                </script>
            </div>
            <?php
        }
    }

    public function phoneFormat($phone) {
        if (preg_match('/(\d{3})(\d{3})(\d{4})$/', $phone, $matches)) {
            return $matches[1] . '-' . $matches[2] . '-' . $matches[3];
        }
        return $phone;
    }
}
