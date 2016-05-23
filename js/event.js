/**
 * @author Administrator
 */
var editor = new Editor();
$(document).ready(function(){
	
	editor.initial("editor");
	editor.focus();
	$("#bold,#italic,#underline,#strikethrough").click(function(){
		if($(this).parent().attr("class")=="icons-ban"){
			return false;
		}
		if($(this).parent().attr("class")=="icons"){
			$(this).parent().attr("class","icons-click");
		}else{
			$(this).parent().attr("class","icons");
		}
		
	})
	$("#redo,#undo,#bold,#italic,#underline,#strikethrough,#InsertHorizontalRule,#RemoveFormat,#SelectAll,#delete,#unlink").click(function(){
		if($(this).parent().attr("class")=="icons-ban"){
			return false;
		}
		editor.execComment(this.id);
	})
	$("#InsertUnorderedList,#InsertOrderedList").click(function(){
		$("#InsertUnorderedList,#InsertOrderedList").parent().attr("class","icons");
		$(this).parent().attr("class","icons-click");
		editor.execComment(this.id);
	})
	$("#link").dialog({
		autoOpen:false,
		title:"超链接",
		buttons:{
			"完成":function(){
				editor.returnCursorState();
//				editor.execComment("CreateLink",$("#linksrc").val());
				var isBlank = $("#isBlank").val()=="on"?true:false;
				editor.createLink($("#linkName").val(),$("#linkSrc").val(),isBlank);
				$(this).dialog('close');
			},
			"关闭":function(){
				editor.returnCursorState();
				$(this).dialog('close');
			}
			
		}
		
		});
	$("#CreateLink").click(function(){
		editor.backupCursorState();
		$("#link").dialog("open");
	})
	$("#editor").mouseup(function(){
		if($("#editor").text()==""){
			editor.focus();
		}
	})
	$("#editor").keydown(function(event){
		//editor.balickupCursorState();
		if(event.keyCode>=33&&event.keyCode<=40){
			var cmds = new Array("bold","italic","underline","strikethrough","InsertOrderedList",
				"InsertUnorderedList","justifyLeft","justifyCenter","justifyRight");
			var values = editor.queryCommandStates(cmds);
			for(key in values){
				if(values[key]){
					$("#"+cmds[key]).parent().attr("class","icons-click");
				}
				else{
					$("#"+cmds[key]).parent().attr("class","icons");
				}
			}
			var cmds = new Array("foreColor","backColor","heading","fontName","fontSize");
			var values = editor.queryCommandValues(cmds);
			if(typeof values[0]=="number"){//ie得到的颜色是10进制bgr颜色number类型，FF是rgb（）类型的字符串
				$("#foreColor").colorpicker("val",values[0]==0?"#0f0f0f":"#"+values[0].toString(16).BGRToRGB());
				$("#backColor").colorpicker("val",values[1]==0?"#ffffff":"#"+values[1].toString(16).BGRToRGB());
			}else{
				$("#foreColor").colorpicker("val",values[0].colorHex()=="#000000"?"#0f0f0f":values[0].colorHex());
				$("#backColor").colorpicker("val",values[1].colorHex()=="#000000"?"#ffffff":values[1].colorHex());
			}
			values[2]?$("#heading-button>.ui-selectmenu-text").text(values[2]):$("#heading-button>.ui-selectmenu-text").text("p");
			values[3]?$("#fontName-button>.ui-selectmenu-text").text(values[3]):$("#fontName-button>.ui-selectmenu-text").text("宋体");
			values[4]?$("#fontSize-button>.ui-selectmenu-text").text(values[4]):$("#fontSize-button>.ui-selectmenu-text").text("1");
		}
		//editor.returnCursorState()
	});
	$("#editor").mouseup(function(){
		var cmds = new Array("bold","italic","underline","strikethrough","InsertOrderedList",
				"InsertUnorderedList","justifyLeft","justifyCenter","justifyRight");
		var values = editor.queryCommandStates(cmds);
		for(key in values){
			if(values[key]){
				$("#"+cmds[key]).parent().attr("class","icons-click");
			}
			else{
				$("#"+cmds[key]).parent().attr("class","icons");
			}
		}
		if(!(values[6]||values[7]||values[8])){
			$("#"+cmds[6]).parent().attr("class","icons-click");
		}
		if(editor.isCollapsed()){
			editor.backupCursorState();
			var cmds = new Array("foreColor","backColor","heading","fontName","fontSize");
			var values = editor.queryCommandValues(cmds);
			if(typeof values[0]=="number"){//ie得到的颜色是10进制bgr颜色number类型，FF是rgb（）类型的字符串
				$("#foreColor").colorpicker("val",values[0]==0?"#0f0f0f":"#"+values[0].toString(16).BGRToRGB());
				$("#backColor").colorpicker("val",values[1]==0?"#ffffff":"#"+values[1].toString(16).BGRToRGB());
			}else{
				$("#foreColor").colorpicker("val",values[0].colorHex()=="#000000"?"#0f0f0f":values[0].colorHex());
				$("#backColor").colorpicker("val",values[1].colorHex()=="#000000"?"#ffffff":values[1].colorHex());
			}
			values[2]?$("#heading-button>.ui-selectmenu-text").text(values[2]):$("#heading-button>.ui-selectmenu-text").text("p");
			values[3]?$("#fontName-button>.ui-selectmenu-text").text(values[3]):$("#fontName-button>.ui-selectmenu-text").text("宋体");
			values[4]?$("#fontSize-button>.ui-selectmenu-text").text(values[4]):$("#fontSize-button>.ui-selectmenu-text").text("1");
			editor.returnCursorState();	
		}
	});
	$('#icons-html').click(function(){
		if($('#icons-html').parent().attr('class')=='icons'){
			$('#editor-html').text($('#editor').html());
			$('#editor-html').css("display","block");
			$('#editor').css('display',"none");
			$('.icons,.icons-click').attr("class","icons-ban")
			$('#icons-html').parent().addClass("icons-click");
			$('#icons-html').parent().removeClass("icons-ban");
			$( "#fontName,#fontSize,#heading" ).selectmenu( "option", "disabled", true);
		}else if($('#icons-html').parent().attr('class')=='icons-click'){
			$('#editor').html($('#editor-html').text());
			$('#editor-html').css("display","none");
			$('#editor').css('display',"block");
			$('.icons-ban,.icons-click').attr('class',"icons");
			$( "#fontName,#fontSize,#heading" ).selectmenu("option","disabled",false);
		}
	});
	
	$('#icons-clear').click(function(){
		editor.clear("editor");
		editor.focus();
	});
	
	
	$("#justifyLeft,#justifyCenter,#justifyRight").click(function(){
		$("#justifyLeft,#justifyCenter,#justifyRight").parent().attr("class","icons");
		$(this).parent().attr("class","icons-click");
		editor.execComment(this.id);
	})
	//过滤黏贴文本
	$("#editor").bind("paste",function(){
		var sel=getSelection();
		range=sel.getRangeAt(0);
		filter1(range);
		setTimeout(function(){
			filter2(range);
		},100);
	})
	$("#foreColor,#backColor").colorpicker({
		color: "#6666ff",
		defaultPalette: 'web'
	});
	$("#foreColor,#backColor").next("div").mousedown(function(){
		editor.backupCursorState();
	})
	$("#foreColor,#backColor").next("div").attr("unselectable","on");
	$("#foreColor,#backColor").on("change.color", function(event, color){
		editor.returnCursorState();
    		editor.execComment(this.id,this.value);
	});
	
	$("#generateword").submit(function(){
		$("input[name='html']").val($("#editor").html());
	})
	$( "#fontName,#fontSize,#heading" ).selectmenu({
		width:100,
		change:function(){
			editor.returnCursorState();
			editor.execComment(this.id,this.value);
		}
	});
	$( "#fontName,#fontSize,#heading" ).next("span").children().mousedown (function(){
		editor.backupCursorState();
	})
	$("#upload").submit(function(){
		editor.backupCursorState();
	})
});

