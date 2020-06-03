<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

// TODO: Check JWT

$key = $_GET['key'];
$block = (int)$_POST['block'];
$algorithm = $_POST['algorithm'];
$hash = $_POST['hash'];

$saveDir = 'workdir/' . $key . '/';
mkdir($saveDir, 0777, true);
move_uploaded_file($_FILES['file']['tmp_name'], $saveDir . 'block_' . $block . '.tmp');
file_put_contents($saveDir . 'meta_' . $block . '.json', json_encode([
    'hash' => $hash,
    'algorithm' => $algorithm,
]));

var_dump($_FILES, $_POST, $_GET);
