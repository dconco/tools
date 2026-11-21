<?php

use PhpSPA\Component;

return new Component(function() {
    return '<span id="route-meta" data-route="crypto" class="hidden"></span>';
})->route('/crypto', '/hash')
  ->title('Cryptography & HMAC Suite — DevVault');
