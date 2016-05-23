/**
 * @author �ٻ�
 */
//十六进制颜色值的正则表达式
 var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
 /*RGB颜色转换为16进制*/
 String.prototype.colorHex = function(){
     var that = this;
     if(/^(rgb|RGB|rgba)/.test(that)){
         var aColor = that.replace(/(?:\(|\)|rgba|RGB|rgb)*/g,"").split(",");
         var strHex = "#";
         for(var i=0; i<3; i++){
             var hex = Number(aColor[i]).toString(16);
             if(hex === "0"){
                 hex += hex;        
             }
             strHex += hex;
         }
         if(strHex.length !== 7){
             strHex = that;        
         }
         return strHex;
     }else if(reg.test(that)){
         var aNum = that.replace(/#/,"").split("");
         if(aNum.length === 6){
             return that;        
         }else if(aNum.length === 3){
             var numHex = "#";
             for(var i=0; i<aNum.length; i+=1){
                 numHex += (aNum+aNum);
             }
             return numHex;
         }
     }else{
         return that;        
     }};
  /*16进制颜色转为RGB格式*/
  String.prototype.colorRgb = function(){
     var sColor = this.toLowerCase();
     if(sColor && reg.test(sColor)){
         if(sColor.length === 4){
             var sColorNew = "#";
                 for(var i=1; i<4; i+=1){
                     sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));        
                 }
                 sColor = sColorNew;
         }
         //处理六位的颜色值
         var sColorChange = [];
         for(var i=1; i<7; i+=2){
             sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));        
         }
         return "RGB(" + sColorChange.join(",") + ")";
     }else{
         return sColor;        
     }};
String.prototype.BGRToRGB=function()

{

   var color = this;

    if( color.length != 6 )

    {

       // 补位，关键！

       if (color.length % 2) { clor = "0" + color };
         // 为交换rb做准备
         color = "0000" + color
         // 剪切多余位
         color = color.substr(color.length - 6);

    }

    // 颠倒 rgb

    color = color.replace(/([\w]{2})([\w]{2})([\w]{2})/, "$3$2$1");

    return color;

}

function getOuterHtml($obj) {
    var $box = $('<div></div>');
    $box.append($obj.clone());
    return $box.html();

}
//使粘贴的文字先不显示
function filter1(range){
	var store_range=range.cloneRange();
//	alert(store_range.toString());
	$div=$("<div id='paste' style='text-indent:-999em'></div>");
	$("#editor").append($div);
	store_range.setStart($div[0],0);
	store_range.collapse(1);
	var sel=getSelection();
	sel.removeAllRanges();//删除sel中所有节点
	sel.addRange(store_range);
}
//过滤粘贴的文字，模拟粘贴效果
function filter2(range){
//	alert($("#paste").text())
	range.deleteContents();
	$node=$($("#paste").html());
	$node.removeClass();
	$node.removeAttr("style");
	$node.find("*").removeClass();
	$node.find("*").removeAttr("style");
//    var text=document.createTextNode($("#paste").text());
	for(var i=$node.length-1;i>=0;i--){
		range.insertNode($node[i]);
	}
	
	range.collapse(0);
	var sel=getSelection();
	sel.removeAllRanges();//删除sel中所有节点
	sel.addRange(range);
	$("#paste").remove();
}
//处理上传的图片
function dealUploadImage(src){
    editor.returnCursorState();
    document.execCommand("insertImage",false,"upload/"+src);
}
