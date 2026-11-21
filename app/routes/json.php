<?php

use PhpSPA\Component;

return new Component(function() {
    return '<span id="route-meta" data-route="json" class="hidden"></span>';
})->route('/', '/json')
  ->title('JSON Formatter & Validator — DevVault');
