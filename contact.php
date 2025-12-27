<?php
error_reporting(0);
ini_set('display_errors', 0);
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Invalid request"]);
    exit;
}

function clean($value) {
    return trim(str_replace(["\r", "\n"], '', $value));
}

$name    = clean($_POST['name'] ?? '');
$email   = clean($_POST['email'] ?? '');
$phone   = clean($_POST['phone'] ?? '');
$topic   = clean($_POST['topic'] ?? '');
$message = clean($_POST['message'] ?? '');

if (!$name || !$email || !$topic || !$message) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

// SMTP SETTINGS
$smtpHost = "smtp.purelymail.com";
$smtpPort = 465;
$smtpUser = "info@thegunsmithnv.com";
$smtpPass = "nywxir-qopfec-woxTa6";

$from = "info@thegunsmithnv.com";
$to   = "info@thegunsmithnv.com";

// EMAIL CONTENT
$headers =
"From: The Gunsmith N.V. <$from>\r\n" .
"Reply-To: $email\r\n" .
"Content-Type: text/plain; charset=UTF-8\r\n";

$body =
"Name: $name\r\n" .
"Email: $email\r\n" .
"Phone: $phone\r\n" .
"Topic: $topic\r\n\r\n" .
"Message:\r\n$message";

$data = "Subject: New Contact Form: $topic\r\n" . $headers . "\r\n" . $body;

// SMTP FUNCTIONS
function smtp_cmd($fp, $cmd) {
    fwrite($fp, $cmd . "\r\n");
    return fgets($fp, 512);
}

// SMTP CONNECTION
$fp = fsockopen($smtpHost, $smtpPort, $errno, $errstr, 15);
if (!$fp) {
    echo json_encode(["success" => false, "message" => "SMTP connection failed"]);
    exit;
}

fgets($fp, 512);
smtp_cmd($fp, "EHLO localhost");
smtp_cmd($fp, "AUTH LOGIN");
smtp_cmd($fp, base64_encode($smtpUser));
smtp_cmd($fp, base64_encode($smtpPass));
smtp_cmd($fp, "MAIL FROM:<$from>");
smtp_cmd($fp, "RCPT TO:<$to>");
smtp_cmd($fp, "DATA");

fwrite($fp, $data . "\r\n.\r\n");
smtp_cmd($fp, "QUIT");
fclose($fp);

echo json_encode(["success" => true]);
