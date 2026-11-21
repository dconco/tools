<?php

declare(strict_types=1);

$base = dirname(__DIR__);

use PhpSPA\App;
use PhpSPA\Component;
use PhpSPA\Compression\Compressor;

require_once "$base/vendor/autoload.php";

// --- Load react configuration ---
$config = require "$base/config.php";

// --- Register the app and its route components ---
$app = new App(require "$base/app/layout.php")
   ->prefix('/api', require "$base/app/api.php")
   ->attach(require "$base/app/routes/json.php")
   ->attach(require "$base/app/routes/jwt.php")
   ->attach(require "$base/app/routes/codec.php")
   ->attach(require "$base/app/routes/crypto.php")
   ->attach(require "$base/app/routes/uuid.php")
   ->attach(require "$base/app/routes/timestamp.php")
   ->attach((new Component(fn() => ''))->route('*')->pattern())
   ->compression(Compressor::LEVEL_EXTREME)
   ->useModule()
   ->defaultTargetID('app');

// --- Attach scripts and links from config.php ---
for ($i = 0; $i < count($config['scripts']); $i++) { 
   $app->script(...$config['scripts'][$i]);
}

for ($i = 0; $i < count($config['links']); $i++) { 
   $app->link(...$config['links'][$i]);
}

$app->run();
