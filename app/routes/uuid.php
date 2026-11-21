<?php

use PhpSPA\Component;

return new Component(function() {
    return '<span id="route-meta" data-route="uuid" class="hidden"></span>';
})->route('/uuid', '/tokens')
  ->title('UUID & Secret Token Generator — DevVault');
