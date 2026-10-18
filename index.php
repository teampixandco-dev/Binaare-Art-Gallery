<?php
// ==============================================================================
// Binaare Art Gallery — Self-Healing Reverse Proxy for Hostinger
// ==============================================================================

$backend = 'http://145.79.58.61:3000';
$uri = $_SERVER['REQUEST_URI'];
$url = $backend . $uri;

// Forward incoming HTTP headers
$headers = [];
$incoming_headers = function_exists('getallheaders') ? getallheaders() : [];
foreach ($incoming_headers as $name => $value) {
    if (strtolower($name) === 'host') {
        $headers[] = 'Host: ' . $_SERVER['HTTP_HOST'];
    } elseif (strtolower($name) !== 'content-length') {
        $headers[] = "$name: $value";
    }
}
$headers[] = 'X-Forwarded-Host: ' . ($_SERVER['HTTP_HOST'] ?? 'binaareartgallery.com');
$headers[] = 'X-Forwarded-For: ' . ($_SERVER['REMOTE_ADDR'] ?? '127.0.0.1');
$headers[] = 'X-Forwarded-Proto: ' . (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http');

$input = null;
if (in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT', 'PATCH', 'DELETE'])) {
    if (!empty($_FILES)) {
        // Multipart file uploads parsed by PHP: re-package as CURLFile for cURL
        $post_data = $_POST;
        foreach ($_FILES as $field => $data) {
            if (is_array($data['name'])) {
                foreach ($data['name'] as $idx => $name) {
                    if (isset($data['error'][$idx]) && $data['error'][$idx] === UPLOAD_ERR_OK && !empty($data['tmp_name'][$idx])) {
                        $post_data["{$field}[{$idx}]"] = new CURLFile(
                            $data['tmp_name'][$idx],
                            !empty($data['type'][$idx]) ? $data['type'][$idx] : 'application/octet-stream',
                            $name
                        );
                    }
                }
            } else {
                if (isset($data['error']) && $data['error'] === UPLOAD_ERR_OK && !empty($data['tmp_name'])) {
                    $post_data[$field] = new CURLFile(
                        $data['tmp_name'],
                        !empty($data['type']) ? $data['type'] : 'application/octet-stream',
                        $data['name']
                    );
                }
            }
        }
        $input = $post_data;

        // Strip incoming Content-Type/Length so cURL generates a clean multipart boundary
        $clean_headers = [];
        foreach ($headers as $h) {
            if (stripos($h, 'Content-Type:') !== 0 && stripos($h, 'Content-Length:') !== 0 && stripos($h, 'Expect:') !== 0) {
                $clean_headers[] = $h;
            }
        }
        $clean_headers[] = 'Expect:';
        $headers = $clean_headers;
    } else {
        $input = file_get_contents('php://input');
    }
}

function execute_request($url, $headers, $input, $timeout = 60) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
    } else if ($_SERVER['REQUEST_METHOD'] !== 'GET' && $_SERVER['REQUEST_METHOD'] !== 'HEAD') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);
    }
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
    curl_setopt($ch, CURLOPT_TCP_NODELAY, 1);

    if ($input !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, $input);
    }

    $response = curl_exec($ch);
    $error = curl_error($ch);
    $info = curl_getinfo($ch);
    curl_close($ch);

    return [$response, $info, $error];
}

function trigger_self_healing() {
    $script = __DIR__ . '/scripts/keep-alive.sh';
    if (file_exists($script) && function_exists('proc_open')) {
        $cmd = '/bin/bash ' . escapeshellarg($script) . ' > /dev/null 2>&1 &';
        $descriptors = [
            0 => ['pipe', 'r'],
            1 => ['pipe', 'w'],
            2 => ['pipe', 'w']
        ];
        $process = proc_open($cmd, $descriptors, $pipes);
        if (is_resource($process)) {
            fclose($pipes[0]);
            fclose($pipes[1]);
            fclose($pipes[2]);
            proc_close($process);
        }
    }
}

// 1. First proxy attempt (60s timeout for image optimization/uploads)
list($response, $info, $error) = execute_request($url, $headers, $input, 60);

// 2. If backend is down, auto-heal and retry
if ($response === false) {
    trigger_self_healing();

    // Fast retry loop for 4 seconds
    for ($attempt = 1; $attempt <= 4; $attempt++) {
        usleep(1000000); // Wait 1 second for Node.js boot
        list($retry_response, $retry_info, $retry_error) = execute_request($url, $headers, $input, 5);
        if ($retry_response !== false) {
            $response = $retry_response;
            $info = $retry_info;
            break;
        }
    }
}

// 3. If still offline, render JSON for API calls or auto-reload page for browser navigation
if ($response === false) {
    http_response_code(503);
    if (strpos($uri, '/api/') === 0 || stripos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false) {
        header('Content-Type: application/json; charset=utf-8');
        header('Retry-After: 3');
        echo json_encode([
            'error' => 'Service temporarily reconnecting. Please try again in a moment.',
            'status' => 503,
            'retry_after' => 3
        ]);
        exit;
    }
    header('Retry-After: 3');
    header('Content-Type: text/html; charset=utf-8');
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="refresh" content="3">
        <title>Binaare Art Gallery — Loading</title>
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
                background: #0d0f12;
                color: #e2e8f0;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                text-align: center;
                padding: 24px;
            }
            .card {
                max-width: 480px;
                padding: 40px;
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 20px;
                backdrop-filter: blur(16px);
            }
            .spinner {
                width: 48px;
                height: 48px;
                border: 3px solid rgba(212, 175, 55, 0.2);
                border-top-color: #d4af37;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 24px;
            }
            @keyframes spin { to { transform: rotate(360deg); } }
            h1 { font-family: "Cormorant Garamond", Georgia, serif; font-size: 28px; font-weight: 400; color: #f8fafc; letter-spacing: 0.05em; margin-bottom: 12px; }
            p { color: #94a3b8; font-size: 14px; line-height: 1.6; }
            .badge { display: inline-block; margin-top: 20px; font-size: 12px; color: #d4af37; letter-spacing: 0.1em; text-transform: uppercase; }
        </style>
    </head>
    <body>
        <div class="card">
            <div class="spinner"></div>
            <h1>Binaare Art Gallery</h1>
            <p>The gallery studio is preparing your experience. This page will automatically display in a moment...</p>
            <div class="badge">Auto-recovering</div>
        </div>
    </body>
    </html>
    <?php
    exit;
}

// 4. Relay successful response
$header_size = $info['header_size'];
$http_code = $info['http_code'];
$header_text = substr($response, 0, $header_size);
$body = substr($response, $header_size);

http_response_code($http_code);
foreach (explode("\r\n", $header_text) as $header_line) {
    if (!empty($header_line) && !preg_match('/^(Transfer-Encoding|Connection):/i', $header_line)) {
        header($header_line, false);
    }
}
echo $body;
