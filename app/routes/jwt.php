<?php

use PhpSPA\Component;

return new Component(function() {
    return '<span id="route-meta" data-route="jwt" class="hidden"></span>';
})->route('/jwt')
  ->title('JWT Debugger & Token Inspector — DevVault');
