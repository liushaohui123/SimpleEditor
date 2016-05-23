<?php
	//$upfile为文件表单名,$file_new_path为保存地址例如c://
	function get_up_file($upfile,$file_new_path=NULL){
		if($_FILES[$upfile]){
			//获得上次时的原始名称
			$file_name=$_FILES[$upfile]['name'];
			//分割
			$arr=explode('.', $_FILES[$upfile]['name']);
			//文件类型,最后一个数组内容为文件后缀
			$file_type=$arr[count($arr)-1];
			//上传后的临时存储位置
			$file_path=$_FILES[$upfile]['tmp_name'];
			//设置文件在服务器的存储位置
			if($file_new_path==null){
				$file_new_path=rand(1, 100).time().".".$file_type;
			}
			else {
				$file_new_path.=rand(1, 100).time().".".$file_type;
			}
			//转移文件致新地址
			move_uploaded_file($file_path, $file_new_path);
			echo "<script language='javascript'>parent.dealUploadImage('$file_new_path')</script>";
			
		}
		
	}
	//get_up_file('upfile');
	//$upfile为文件表单名
	function up_img_tobase64($upfile){
		if($_FILES[$upfile]){
			//获得上次时的原始名称
			$file_name=$_FILES[$upfile]['name'];
			//分割
			$arr=explode('.', $_FILES[$upfile]['name']);
			//文件类型,最后一个数组内容为文件后缀
			$file_type=$arr[count($arr)-1];
			//上传后的临时存储位置
			$file_path=$_FILES[$upfile]['tmp_name'];
			$file=file_get_contents($file_path);
			
			$file_content_64=base64_encode($file);
			$img='data:image/'.$file_type.';base64,'.$file_content_64;//合成图片的base64编码
			echo "<script language='javascript'>parent.inputImage('$img');</script>";
		}
		
	
	}
// 	up_img_tobase64('upfile');
	get_up_file("upfile","image/");
	