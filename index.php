<?php
// Hostinger High-Performance Reverse Proxy for Next.js
$backend = 'http://145.79.58.61:3000';
$uri = $_SERVER['REQUEST_URI'];
$url = $backend . $uri;

// Forward incoming HTTP headers
$headers = [];
foreach (getallheaders() as $name => $value) {
    if (strtolower($name) === 'host') {
        $headers[] = 'Host: ' . $_SERVER['HTTP_HOST'];
    } elseif (strtolower($name) !== 'content-length') {
        $headers[] = "$name: $value";
    }
}
$headers[] = 'X-Forwarded-For: ' . ($_SERVER['REMOTE_ADDR'] ?? '127.0.0.1');
$headers[] = 'X-Forwarded-Proto: ' . (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http');

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_TCP_NODELAY, 1);

if (in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT', 'PATCH', 'DELETE'])) {
    $input = file_get_contents('php://input');
    curl_setopt($ch, CURLOPT_POSTFIELDS, $input);
}

$response = curl_exec($ch);
if ($response === false) {
    http_response_code(502);
    echo 'Bad Gateway - Next.js server unreachable';
    exit;
}

$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$header_text = substr($response, 0, $header_size);
$body = substr($response, $header_size);

http_response_code($http_code);
foreach (explode("\r\n", $header_text) as $header_line) {
    if (!empty($header_line) && !preg_match('/^(Transfer-Encoding|Connection):/i', $header_line)) {
        header($header_line, false);
    }
}
echo $body;
curl_close($ch);
