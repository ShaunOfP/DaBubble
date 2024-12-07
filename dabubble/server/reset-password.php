<?php
switch ($_SERVER['REQUEST_METHOD']) {
    case ("OPTIONS"):
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST");
        header("Access-Control-Allow-Headers: content-type");
        exit;
    case ("POST"):
        header("Access-Control-Allow-Origin: *");

        $json = file_get_contents('php://input');
        $params = json_decode($json);

        $email = $params->email;
        $name = $params->name;
        $id = $params->id;

        $resetLink = "http://dabubble/reset-password?token=$id";

        $to = $email;
        $subject = "Passwort zurücksetzen";
        $message = "Hallo $name, <br><br> Du hast eine Anfrage zum Zurücksetzen deines Passworts erhalten. <br> 
        Klicke auf den folgenden Link, um dein Passwort zurückzusetzen: <br><br> 
        <a href='$resetLink'>$resetLink</a> <br><br> 
        Wenn du diese Anfrage nicht gestellt hast, ignoriere diese Nachricht bitte.";

        $headers   = array();
        $headers[] = 'MIME-Version: 1.0';
        $headers[] = 'Content-type: text/html; charset=utf-8';


        $headers[] = "From: noreply@restore.dabubble.de";

        mail($to, $subject, $message, implode("\r\n", $headers));
        break;
    default:
        header("Allow: POST", true, 405);
        exit;
}
