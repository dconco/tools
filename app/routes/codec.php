<?php

use PhpSPA\Component;

return new Component(function() {
    return '<span id="route-meta" data-route="codec" class="hidden"></span>';
})->route('/codec', '/base64')
  ->title('Base64, URL & Hex Codec — DevVault');
