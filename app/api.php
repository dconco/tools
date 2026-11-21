<?php

use PhpSPA\Http\Router;
use PhpSPA\Http\Request;
use PhpSPA\Http\Response;

return function(Router $router) {
    // Cryptographic Hashes API
    $router->methods(['GET', 'POST'], '/hash', function(Request $request, Response $response) {
        $raw = file_get_contents('php://input');
        $json = is_string($raw) && $raw !== '' ? json_decode($raw, true) : [];
        $text = (string)($json['text'] ?? $request('text', ''));
        $key = (string)($json['key'] ?? $request('key', ''));

        if ($key !== '') {
            $data = [
                'md5'    => hash_hmac('md5', $text, $key),
                'sha1'   => hash_hmac('sha1', $text, $key),
                'sha256' => hash_hmac('sha256', $text, $key),
                'sha384' => hash_hmac('sha384', $text, $key),
                'sha512' => hash_hmac('sha512', $text, $key),
                'crc32'  => hash_hmac('crc32b', $text, $key),
            ];
        } else {
            $data = [
                'md5'    => hash('md5', $text),
                'sha1'   => hash('sha1', $text),
                'sha256' => hash('sha256', $text),
                'sha384' => hash('sha384', $text),
                'sha512' => hash('sha512', $text),
                'crc32'  => hash('crc32b', $text),
            ];
        }

        return $response->success($data);
    });

    // UUID Generator API
    $router->methods(['GET', 'POST'], '/uuid', function(Request $request, Response $response) {
        $raw = file_get_contents('php://input');
        $json = is_string($raw) && $raw !== '' ? json_decode($raw, true) : [];
        
        $count = max(1, min(100, (int)($request('count', $json['count'] ?? 1))));
        $uppercase = filter_var($request('uppercase', $json['uppercase'] ?? false), FILTER_VALIDATE_BOOLEAN);
        $noHyphens = filter_var($request('no_hyphens', $json['no_hyphens'] ?? false), FILTER_VALIDATE_BOOLEAN);

        $uuids = [];
        for ($i = 0; $i < $count; $i++) {
            $b = random_bytes(16);
            $b[6] = chr((ord($b[6]) & 0x0f) | 0x40);
            $b[8] = chr((ord($b[8]) & 0x3f) | 0x80);
            $hex = bin2hex($b);
            $formatted = $noHyphens ? $hex : vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split($hex, 4));
            $uuids[] = $uppercase ? strtoupper($formatted) : strtolower($formatted);
        }

        return $response->success([
            'uuid'  => $uuids[0],
            'uuids' => $uuids,
            'count' => count($uuids),
        ]);
    });

    // Cryptographic Token & Secret Generator API
    $router->methods(['GET', 'POST'], '/token', function(Request $request, Response $response) {
        $raw = file_get_contents('php://input');
        $json = is_string($raw) && $raw !== '' ? json_decode($raw, true) : [];

        $length = max(8, min(256, (int)($request('length', $json['length'] ?? 32))));
        $type = (string)($request('type', $json['type'] ?? 'hex'));

        $token = '';
        if ($type === 'hex') {
            $bytes = (int)ceil($length / 2);
            $token = substr(bin2hex(random_bytes($bytes)), 0, $length);
        } elseif ($type === 'base64url') {
            $bytes = (int)ceil($length * 3 / 4);
            $b64 = rtrim(strtr(base64_encode(random_bytes($bytes)), '+/', '-_'), '=');
            $token = substr($b64, 0, $length);
        } elseif ($type === 'alphanumeric') {
            $chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            $len = strlen($chars);
            for ($i = 0; $i < $length; $i++) {
                $token .= $chars[random_int(0, $len - 1)];
            }
        } else {
            $chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-_=+[]{}<>?~';
            $len = strlen($chars);
            for ($i = 0; $i < $length; $i++) {
                $token .= $chars[random_int(0, $len - 1)];
            }
        }

        return $response->success(['token' => $token]);
    });
};
