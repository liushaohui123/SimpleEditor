<?php
require_once 'GenerateWord.php';
$html = $_POST['html'];
$factory = new GenerateWord($html);
$factory->trans_html_to_phpword();
$factory->write_word("E://abc.docx");