<?php
require_once 'phpword/PHPWord.php';
require_once 'simple_html_dom.php';
class GenerateWord{
	protected $html;
	protected $phpword;
	public function __construct($html){
		$this->html = str_get_html($html);
	}
	public function set_html($html){
		$this->html = str_get_html($html);
	}
	public function get_html($html){
		return $this->html;
	}
	public function trans_html_to_phpword(){
		$this->phpword = new PHPWord();
		$section = $this->phpword->createSection();
		$list = $this->html->find("ul,ol")?$this->html->find("ul,ol",0):null;//最多只会有一个ul
		if ($list){
			$listType = $list->tag=="ul"?PHPWord_Style_ListItem::TYPE_BULLET_FILLED:PHPWord_Style_ListItem::TYPE_NUMBER;
			$listStyle = array(
				'listType' => $listType
			);
			foreach ($list->find("li") as $list_item){
				$fontStyle = array();
				$paragraphStyle=array();
				if ($list_item->find("p,h1,h2,h3,h4,h5,h6",0)){
					$paragraph = $list_item->find("p,h1,h2,h3,h4,h5,h6",0);
					switch ($paragraph->tag){
						case "h1":$fontStyle['size']=20;break;
						case "h2":$fontStyle['size']=18;break;
						case "h3":$fontStyle['size']=16;break;
						case "h4":$fontStyle['size']=14;break;
						case "h5":$fontStyle['size']=12;break;
						case "h6":$fontStyle['size']=11;break;
					}
					if ($paragraph->align){
						$paragraphStyle['align'] = $paragraph->align;
					}
				}
				$section->addListItem($paragraph->plaintext,0,$fontStyle,$listStyle,$paragraphStyle);
				$section->addTextBreak(1);
			}
		}else{
			foreach ($this->html->find("p,h1,h2,h3,h4,h5,h6") as $paragraph){
				$paragraphStyle=array();
				$fontStyle = array();
				switch ($paragraph->tag){
					case "h1":$fontStyle['size']=20;break;
					case "h2":$fontStyle['size']=18;break;
					case "h3":$fontStyle['size']=16;break;
					case "h4":$fontStyle['size']=14;break;
					case "h5":$fontStyle['size']=12;break;
					case "h6":$fontStyle['size']=11;break;
				}
				if ($paragraph->align){
					$paragraphStyle['align'] = $paragraph->align;
				}
				$this->trans_text($section, $paragraph,$fontStyle,$paragraphStyle);
				$section->addTextBreak(1);
			}
		}
	}
	/**
	 * 处理html文本
	 * @param PHPWord_Section $section
	 * @param simple_html_dom $html
	 */
	public function trans_text($section,$html,$fontStyle,$paragraphStyle){
		$start = 0;
		$innerText = $html->innertext;
		foreach ($html->childNodes() as $node){
			$node_str = $node->outertext;
			$pos = strpos($innerText, $node_str);
			$section->addText(substr($innerText, $start, $pos-$start),$fontStyle,$paragraphStyle);
			if ($node->tag!="br"){
				$font = $fontStyle;
				switch ($node->tag){
					case "b":$font['bold'] = true;break;
					case 'i':$font['italic'] = true;break;
					case 'u':$font['underline'] = PHPWord_Style_Font::UNDERLINE_SINGLE;break;
				}
				if ($node->tag=="font"){
					$node->color?$font['color'] = substr($node->color,1):"";
					$matchs = array();
					$node->face?$font['name'] = $node->face:"";
					$node->size?$font['size'] = $node->size*3:"";
				}
				if ($node->tag=="a"){
					$section->addLink($node->href,$node->plaintext,$fontStyle,$paragraphStyle);
				}elseif ($node->tag=="img"){
					$section->addImage("../".$node->src);	
				}else{
					$this->trans_text($section, $node, $font,$paragraphStyle);
				}
				
			}
			$start = $pos+strlen($node_str);
 		}
 		if ($start!=strlen($innerText)){
 			$section->addText(substr($innerText, $start),$fontStyle,$paragraphStyle);
 		}
	}
	public function write_word($src){
		$writer = PHPWord_IOFactory::createWriter($this->phpword,"Word2007");
		$writer->save($src);
	}
}