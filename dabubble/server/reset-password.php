<?php
switch ($_SERVER['REQUEST_METHOD']) {
    case ("OPTIONS"):
        header(header: "Access-Control-Allow-Origin: *");
        header(header: "Access-Control-Allow-Methods: POST");
        header(header: "Access-Control-Allow-Headers: content-type");
        exit;
    case ("POST"):
        header(header: "Access-Control-Allow-Origin: *");

        $json = file_get_contents(filename: 'php://input');
        $params = json_decode(json: $json);

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

        mail(to: $to, subject: $subject, message: $message, additional_headers: implode(separator: "\r\n", array: $headers));
        break;
    default:
        header(header: "Allow: POST", replace: true, response_code: 405);
        exit;
}
