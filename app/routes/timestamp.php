<?php

use PhpSPA\Component;

return new Component(function() {
    return '<span id="route-meta" data-route="timestamp" class="hidden"></span>';
})->route('/timestamp', '/epoch')
  ->title('Unix Timestamp & Epoch Converter — DevVault');
