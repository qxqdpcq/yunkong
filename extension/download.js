'use strict';
(function(lib,game,ui,get,ai,_status){
	try{
		if(!lib.config.ykassetURL) game.saveConfig('ykassetURL',(__dirname+'/').replace(/\\/g,'/'));
	}catch(e){};
	window.yk_URL={
		'qxq_yk_xiaoqiao':'1bA79bFt2mnqxFiSUuk2QgA',
		'qxq_yk_yanmengyuejian':'1k1yawBcu78g4YUuereai6Q',
		'qxq_yk_kongshanlingxue':'1m9JpWYENuDBg2QZoja9i3Q',
		'qxq_yk_wuwangxuanyue':'1AQwX9N6qW5R0VxWB1x9g3g',
		'qxq_yk_fuling':'1MavZovO76zSnd3O11dSuXw',
		'qxq_yk_dijunxuanpin':'1VJSNt8lUReex5SdXXl4FLA',
		'qxq_yk_mingyun':'1MLHoUcCxpewScs5HCOFDHQ',
		'qxq_yk_zhixu':'1xZAPTkvYBHKejxJx3u-tmw',
		'qxq_yk_akalai':'1ysDQwQRaCHzwacEHqmKxvA',
		'qxq_yk_tian':'1JJoYGUfkcJ0rAHMHwNSZSg',
		'qxq_yk_yunying':'1JBgTQP8d0YrgnteAF7W51w',
		'qxq_yk_lingshang':'1T5mVgYbM__4WHGRa9wxbjA',
		'其他文件':'1oDX4cLqmmV2-ZU02ENcYaQ',
	};
	game.yktranslatePicture={//防止图片因外链而失效
		'qxq_yk_lingyue':'.jpg',
	};
	game.YK_else=[
		'word/Ocean.ttf',
		
		'skin.js',
		'challenge.js',
		'element.js',
        
		'ykChallenge.jpg',
		'towardSky.jpg',
			
		//元素
		'yk_fire.jpg',
		'yk_water.jpg',
		'yk_wood.jpg',
		'yk_wind.jpg',
		'yk_thunder.jpg',
		'yk_stone.jpg',
		'yk_ice.jpg',
		'yk_light.jpg',
		'yk_dark.jpg',
		'yk_soul.jpg',
		
		'qxq_yk_tian.jpg',
		'chunsheng.jpg',
		'xiarong.jpg',
		'qiuku.jpg',
		'dongji.jpg',
		'kongzhen.jpg',
		'zhanshu.jpg',
		'shenli.jpg',
		'guqi.jpg',
		'fuyuan.jpg',
		
		'01',
		'10',
		
		'boss_yk_tikui.jpg',
		'boss_yk_pohuaishen.jpg',
		
		'formation/formation_dark.png',
		'formation/formation_fire.png',
		'formation/formation_ice.png',
		'formation/formation_light.png',
		'formation/formation_none.png',
		'formation/formation_soul.png',
		'formation/formation_stone.png',
		'formation/formation_thunder.png',
		'formation/formation_water.png',
		'formation/formation_wind.png',
		'formation/formation_wood.png',
		
		'loop/loop_dark.png',
		'loop/loop_fire.png',
		'loop/loop_light.png',
		'loop/loop_none.png',
		'loop/loop_soul.png',
		'loop/loop_stone.png',
		'loop/loop_thunder.png',
		'loop/loop_water.png',
		'loop/loop_wind.png',
		'loop/loop_wood.png',
		
		'nature/blue.png',
		'nature/cyan.png',
		'nature/green.png',
		'nature/purple.png',
		'nature/red.png',
		'nature/white.png',
		'nature/yellow.png',
		
		'point/point_dark.png',
		'point/point_fire.png',
		'point/point_ice.png',
		'point/point_light.png',
		'point/point_none.png',
		'point/point_stone.png',
		'point/point_thunder.png',
		'point/point_water.png',
		'point/point_wind.png',
		'point/point_wood.png',
	];
	if(typeof game.ykHasCharacter=='function'&&game.ykHasCharacter('qxq_yk_yanmengyuejian')){
		//game.YK_else.push('qxq_yk_mengyanyouwu_female.jpg');
		//game.YK_else.push('qxq_yk_mengyanyouwu_male.jpg');
	}
	/*if(lib.config.yk_myBag==undefined) lib.config.yk_myBag={};
	for(var item in lib.config.yk_myBag){
		if(lib.config.yk_myBag[item]!=undefined){
			if(lib.ykEquip[item]&&lib.ykEquip[item].image) game.YK_else.push(lib.ykEquip[item].image);
			else if(lib.ykBook[item]&&lib.ykBook[item].image) game.YK_else.push(lib.ykBook[item].image);
			else if(lib.yk_otherItemLibrary[item]&&lib.yk_otherItemLibrary[item].image) game.YK_else.push(lib.yk_otherItemLibrary[item].image);
			else game.YK_else.push(item+'.jpg');
		}
	}*/
	game.YK_qxq_yk_xiaoqiao=[
		'qxq_yk_xiaoqiao.mp3',
		'yktianxiang1.mp3',
		'ykzhuyan1.mp3',
		'ykpiaoling_jili1.mp3',
		'ykpiaoling1.mp3',
		'ykpiaoling2.mp3',
		'qxq_yk_xiaoqiao_huanhongzhuang.jpg',
		'qxq_yk_xiaoqiao_yixianglvren.jpg',
		'qxq_yk_xiaoqiao_chunricaizhuang.jpg',
		'qxq_yk_xiaoqiao_jindengyezhu.jpg',
	];
	game.YK_qxq_yk_fuling=[
		'qxq_yk_fuling_churuhongchen.jpg',
	];
	game.YK_qxq_yk_yanmengyuejian=[
		'qxq_yk_yanmengyuejian.mp3',
		'qxq_yk_yanmengyuejian_heizhishi.jpg',
		'qxq_yk_yanmengyuejian_zhumengzhe.jpg',
		'qxq_yk_lingyue',
	];
	game.YK_qxq_yk_kongshanlingxue=[
		'qxq_yk_kongshanlingxue_zhijianren.jpg',
		//塔罗牌
		'tarot_0.jpg',
		'tarot_1.jpg',
		'tarot_2.jpg',
		'tarot_3.jpg',
		'tarot_4.jpg',
		'tarot_5.jpg',
		'tarot_6.jpg',
		'tarot_7.jpg',
		'tarot_8.jpg',
		'tarot_9.jpg',
		'tarot_10.jpg',
		'tarot_11.jpg',
		'tarot_12.jpg',
		'tarot_13.jpg',
		'tarot_14.jpg',
		'tarot_15.jpg',
		'tarot_16.jpg',
		'tarot_17.jpg',
		'tarot_18.jpg',
		'tarot_19.jpg',
		'tarot_20.jpg',
		'tarot_21.jpg',
		'tarot_special0.jpg',
		'tarot_special1.jpg',
		'tarot_special2.jpg',
		'tarot_special3.jpg',
	];
	game.YK_qxq_yk_tian=[
		'qxq_yk_tian_huayanxiaozhu.jpg',
		'qxq_yk_tian_guanghanzhexian.jpg',
	];
	game.YK_qxq_yk_mingyun=[
		'qxq_yk_mingyun_moouyuezhang.jpg'
	];
	game.ykdownload=function(){
		"step 0"
		game.YK_Text=document.createElement("div");
		game.YK_Text_style={
			width:"calc(25%)",
			height:"calc(5%)",
			display:"table",
			background:'rgba(0,0,0,0.5)',
			position:"absolute",
			top:"0px",
			left:"calc(38%)",
			zIndex:"10",
			textAlign:"center",
			'font-size':'30px',
			'font-family':"'STXinwei','xinwei'",
		};
		for(var k in game.YK_Text_style){
			game.YK_Text.style[k]=game.YK_Text_style[k];
		};
		window.yk_personlistList=[];
		if(!lib.config.YKcharacterNameList){lib.config.YKcharacterNameList=[];game.saveConfig('YKcharacterNameList',lib.config.YKcharacterNameList);}
		for(var i=0;i<lib.config.YKcharacterNameList.length;i++){
			var character=lib.config.YKcharacterNameList[i];
			var name=character.slice(0,character.indexOf('-'));
			if(game['YK_'+name]!=undefined&&game['YK_'+name].length>0){
				window.yk_personlistList.push(name);
			}
		}
		if(!lib.qxq_yk_bossList) lib.qxq_yk_bossList=[];
		for(var i=0;i<lib.qxq_yk_bossList.length;i++){
			var name=lib.qxq_yk_bossList[i];
			if(game['YK_'+name]!=undefined&&game['YK_'+name].length>0){
				window.yk_personlistList.push(name);
			}
		}
		window.picturelist=game.YK_else;
		if(!lib.config.YKcharacterNameList){lib.config.YKcharacterNameList=[];game.saveConfig('YKcharacterNameList',lib.config.YKcharacterNameList);}
		for(var i=0;i<lib.config.YKcharacterNameList.length;i++){
			var character=lib.config.YKcharacterNameList[i];
			var name=character.slice(0,character.indexOf('-'));
			window.picturelist.push(name+'.jpg');
		}
		var num=0;
		var num5=window.picturelist.length;
		document.body.appendChild(game.YK_Text);
		var download=function(){
			game.download('https://gitee.com/qxqdpcq/yunkong/raw/master/extension/'+window.picturelist[0],'extension/云空/'+window.picturelist[0]+(window.picturelist[0].indexOf('.')==-1?(game.yktranslatePicture[window.picturelist[0]]||''):''),function(){
				num++
				window.picturelist.remove(window.picturelist[0]);
				if(window.picturelist.length>0){
					game.YK_Text.innerHTML='正在下载云空世界素材<br>-'+window.picturelist[0]+(window.picturelist[0].indexOf('.')==-1?(game.yktranslatePicture[window.picturelist[0]]||''):'')+'-<br>（'+num+'/'+num5+'）';
					download();
				}else{
					if(window.yk_personlistList.length>0) game.ykdownload_add();
					else{
						game.YK_Text.innerHTML='下载完毕';
						if(game.sayyk&&typeof game.sayyk=='function') game.sayyk('云空世界素材下载完毕！');
						document.body.removeChild(game.YK_Text);
						if(game.sayyk&&typeof game.sayyk=='function') game.sayyk('请稍候，即将自动为您重启游戏！');
						setTimeout(function(){
							game.reload();
						},3000);
					}
				};
			},function(){
				if(confirm('下载'+window.picturelist[0]+'失败，是否继续下载？（取消则关闭扩展包并刷新游戏）')){
					download();
				}else{
					if(game.sayyk&&typeof game.sayyk=='function') game.sayyk('部分文件下载失败。');
					num++;
					window.picturelist.remove(window.picturelist[0]);
					download();
				};
			})
		}
		download();
	};
	game.ykdownload_add=function(){
		"step 0"
		document.body.appendChild(game.YK_Text);
		window.picturelist=game['YK_'+window.yk_personlistList[0]];
		window.num=0;
		window.numx=game['YK_'+window.yk_personlistList[0]].length;
		var download=function(){
			game.download('https://gitee.com/qxqdpcq/yunkong/raw/master/extension/'+window.picturelist[0],'extension/云空/'+window.yk_personlistList[0]+'/'+window.picturelist[0]+(window.picturelist[0].indexOf('.')==-1?(game.yktranslatePicture[window.picturelist[0]]||''):''),function(){
				window.num++
				window.picturelist.remove(window.picturelist[0]);
				if(window.picturelist.length>0){
					game.YK_Text.innerHTML='正在下载云空世界人物皮肤语音——【'+get.translation(window.yk_personlistList[0])+'】（'+window.num+'/'+window.numx+'）<br>-'+window.yk_personlistList[0]+(window.picturelist[0].indexOf('.')==-1?(game.yktranslatePicture[window.picturelist[0]]||''):'');
					download(window.picturelist);
				}else{
					window.yk_personlistList.remove(window.yk_personlistList[0]);
					if(window.yk_personlistList.length>0){
						window.num=0;
						window.numx=game['YK_'+window.yk_personlistList[0]].length;
						window.picturelist=game['YK_'+window.yk_personlistList[0]];
						download();
					}
					else{
						game.YK_Text.innerHTML='下载完毕';
						if(game.sayyk&&typeof game.sayyk=='function') game.sayyk('云空世界人物皮肤语音下载完毕！');
						document.body.removeChild(game.YK_Text);
						if(game.sayyk&&typeof game.sayyk=='function') game.sayyk('请稍候，即将自动为您重启游戏！');
						setTimeout(function(){
							game.reload();
						},3000);
					}
				};
			},function(){
				if(confirm('下载'+window.picturelist[0]+'失败，是否继续下载？（取消则关闭扩展包并刷新游戏）')){
					download();
				}else{
					if(game.sayyk&&typeof game.sayyk=='function') game.sayyk('部分文件下载失败。');
					window.num++;
					window.picturelist.remove(window.picturelist[0]);
					download();
				};
			})
		}
		download();
	};
	if(typeof window.ykcloseBgM=='function') window.ykcloseBgM();
	var fast_download_func=()=>{//快速下载
		if(confirm('快速下载是从gitee上下载所有资源，但部分资源因文件过大会出现失效的情况，建议快速下载后使用【素材下载】按钮重新检测一遍本地文件，手动下载缺失的文件。')){
			game.ykdownload();
			panel.delete();
			panel=null;
		}
	};
	var panel=ui.create.dialog('hidden');
	panel.style.cssText='left:15%;top:15%;height:70%;width:70%;border-radius:8px;opacity:0.8;background-color:black;z-index:99999;';
	ui.window.appendChild(panel);
	var title=ui.create.div();
	title.style.cssText='height:40px;left:0%;top:0%;width:100%;text-align:center;';
	title.innerHTML='<span style="font-size:30px;font-weight:400;font-family:shousha"><b>下载更新</b></span>';
	panel.appendChild(title);
	var record=ui.create.div();
	record.style.cssText='right:0%;top:40px;width:30%;height:calc(100% - 40px);background-color:white;overflow-y:scroll;';
	lib.setScroll(record);
	record.innerHTML='<span style="font-size:20px;font-weight:400;font-family:shousha;color:black">正在检测本地文件……</span>';
	record.addText=function(text){
		this.innerHTML='<span style="font-size:18px;font-weight:400;font-family:shousha;color:black">'+text+'<br><br>'+this.innerHTML+'</span>';
	};
	panel.appendChild(record);
	var url=ui.create.div();
	url.style.cssText='top:40px;left:0%;height:20px;width:70%;overflow-y:scroll;background-color:white;text-align:left;';
	url.innerHTML='<div style="white-space:nowrap;width:calc(100% - 10px)"><input type="file" style="width:calc(100% - 40px)"><button style="width:40px">读取</button></div>';
	url.querySelector('button').onclick=function(){
		if(lib.assetURL&&lib.assetURL.length||(__dirname&&__dirname.length)){
			alert('本设备无需设置路径！');
			return ;
		}
		if(!url.showFileURL){
			panel2.style.cssText='top:80px;left:0%;height:calc(100% - 80px);width:70%;overflow-y:scroll;';
			url.showFileURL=ui.create.dialog('hidden');
			url.showFileURL.classList.add('popped');
			url.showFileURL.classList.add('static');
			url.showFileURL.style.cssText='top:60px;left:0%;height:20px;width:70%;overflow-x:scroll;background-color:white;text-align:left;';
			url.showFileURL.div=ui.create.div();
			url.showFileURL.div.style.cssText='top:0px;left:0%;height:22px;width:calc(100% - 70px);margin:2px;border-radius:2px;background-image:linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4));box-shadow:rgba(0, 0, 0, 0.4) 0 0 0 1px, rgba(0, 0, 0, 0.2) 0 3px 10px;';
			url.showFileURL.div.innerHTML='<input type="text" value="'+(lib.assetURL&&lib.assetURL.length?lib.assetURL:(__dirname+'/').replace(/\\/g,'/'))+'" style="width:calc(100% - 10px);text-align:center;"></input>';
			url.showFileURL.input=url.showFileURL.div.querySelector('input');
			url.showFileURL.input.onclick=function(e){
				e.stopPropagation();
			};
			url.showFileURL.input.onfocus=function(){
				if(this.value&&this.value.length) this.value='';
			};
			window.url_showFileURL_inputcheck=function(){
				panel.checkPath(url.showFileURL.input.value);
			};
			url.showFileURL.input.onkeydown=function(e){
				e.stopPropagation();
				if(e.keyCode==13){
					window.url_showFileURL_inputcheck();
				};
			};
			url.showFileURL.add(url.showFileURL.div);
			panel.appendChild(url.showFileURL);
			url.showFileURL.div_ok=ui.create.div();
			url.showFileURL.div_ok.style.cssText='left:calc(100% - 70px);top:0%;height:100%;width:60px;border-radius:8px;text-align:center;';
			url.showFileURL.div_ok.innerHTML='<button style="width:60px" onclick="window.url_showFileURL_inputcheck()">确定</button>';
			url.showFileURL.appendChild(url.showFileURL.div_ok);
		}
		var fileToLoad=this.previousSibling.files[0];
		if(fileToLoad){
			panel.checkPath(fileToLoad.path.replace(/\\/g,'/'));
		}
		else{
			record.addText('读取失败！');
			url.showFileURL.innerHTML='<font color=black>未选择文件！</font>';
		}
	}
	panel.appendChild(url);
	panel.checkPath=path=>{
		if(path.indexOf('/resources/app/')==-1){
			record.addText('路径错误，读取失败！');
			url.showFileURL.input.value='路径错误，读取失败！';
			return ;
		}
		else{
			if(path.indexOf('已读取游戏路径：')!=-1) path=path.slice(path.indexOf('已读取游戏路径：')+8,path.length);
			path=path.slice(0,path.indexOf('/resources/app/')+15);
			if(!window.ykFileExist(path+'game/game.js')||!window.ykFileExist(path+'extension/云空/extension.js')){
				record.addText('路径错误，读取失败！');
				url.showFileURL.innerHTML='<font color=black>路径错误，读取失败！</font>';
				return ;
			}
			record.addText('读取成功！');
			url.showFileURL.input.value='已读取游戏路径：'+path;
			game.saveConfig('ykassetURL',path);
			record.addText('路径已自动保存！自动检测本地资源！');
			readURL();
		}
	};
	var panel2=ui.create.div();
	panel2.style.cssText='top:60px;left:0%;height:calc(100% - 60px);width:70%;overflow-y:scroll;';
	lib.setScroll(panel2);
	panel.appendChild(panel2);
	game.ykdownload_createButton=(parentNode,list)=>{
		if(!parentNode) return ;
		for(var item of list){
			var div=ui.create.div('.menu');
			div.innerHTML='<span style="margin-top:10px;font-family:shousha;color:black">'+get.translation(item)+'</span>';
			div.name=item;
			div.style.cssText='text-align:center;margin-top:20px;margin-left:20px;top:0px;left:0px;height:40px;width:70px;position:relative;border-radius:8px;background-color:white;';
			div.onclick=function(){
				if(window.yk_URL[this.name]&&confirm('手动下载：是否打开【'+get.translation(this.name)+'】的网盘资源文件')){
					window.open('https://pan.baidu.com/s/'+window.yk_URL[this.name]+'?pwd=ykkz');
				}
			};
			window.yk_clickFK(div);
			parentNode.appendChild(div);
		}
	};
	var readURL=()=>{
		if(window.yk_isCheckingNow){
			record.addText('当前正在检测，请不要频繁点击！');
			return ;
		}
		panel2.delete();
		panel2=ui.create.div();
		panel2.style.cssText='top:60px;left:0%;height:calc(100% - 60px);width:70%;overflow-y:scroll;';
		lib.setScroll(panel2);
		panel.appendChild(panel2);
		var fast_download=ui.create.div('.menu');
		fast_download.innerHTML='<span style="margin-top:10px;font-family:shousha;color:black">快速下载</span>';
		fast_download.name='fast';
		fast_download.style.cssText='text-align:center;margin-top:20px;margin-left:20px;top:0px;left:0px;height:40px;width:70px;position:relative;border-radius:8px;background-color:white;';
		fast_download.onclick=fast_download_func;
		window.yk_clickFK(fast_download);
		panel2.appendChild(fast_download);
		if(check){
			check.delete();
			check=null;
		}
		if(lib.config.ykassetURL||(lib.assetURL&&lib.assetURL.length)){
			record.addText('当前选择路径：'+(lib.assetURL&&lib.assetURL.length?lib.assetURL:lib.config.ykassetURL)+'，若路径变更请重新读取游戏内的game.js或本扩展extension.js文件位置，手机端可自动定位游戏位置。');
			record.addText('即将解析路径，请稍候……');
			var readpath;
			if(lib.assetURL&&lib.assetURL.length) readpath=lib.assetURL;
			else if(lib.config.ykassetURL.length) readpath=lib.config.ykassetURL;
			if(!readpath||!window.ykFileExist(readpath+'game/game.js')||!window.ykFileExist(readpath+'extension/云空/extension.js')){
				record.addText('路径错误，可能文件位置发生变更，请重新读取文件以设置路径！');
				var check=ui.create.div('.menu');
				check.innerHTML='检测本地资源';
				check.style.cssText='text-align:center;margin-top:20px;margin-left:20px;top:0px;left:0px;height:40px;width:70px;border-radius:8px;background-color:white;';
				panel2.appendChild(check);
				check.onclick=readURL;
				var fast_download=ui.create.div('.menu');
				fast_download.innerHTML='<span style="margin-top:10px;font-family:shousha;color:black">快速下载</span>';
				fast_download.name='fast';
				fast_download.style.cssText='text-align:center;margin-top:20px;margin-left:20px;top:0px;left:0px;height:40px;width:70px;position:relative;border-radius:8px;background-color:white;';
				fast_download.onclick=fast_download_func;
				window.yk_clickFK(fast_download);
				panel2.appendChild(fast_download);
				return ;
			}
			record.addText('开始检测本地文件完整性（需联网），请稍候……');
			window.yk_isCheckingNow=true;
			panel2.delete();
			panel2=ui.create.div();
			panel2.style.cssText='top:60px;left:0%;height:calc(100% - 60px);width:70%;overflow-y:scroll;text-align:left;';
			lib.setScroll(panel2);
			panel.appendChild(panel2);
			panel2.innerHTML='当前检测数：-/-';
			var listfile=[];
			var list=[];
			for(var f of game.YK_else) listfile.push({
				url:'extension/云空/'+f,
				source:'其他文件',
			});
			for(var character in window.yunkong_Character.character){
				listfile.push({
					url:'extension/云空/'+character+'.jpg',
					source:character,
				});
				if(Array.isArray(game['YK_'+character])) for(var file of game['YK_'+character]) listfile.push({
					url:'extension/云空/'+character+'/'+(game.yktranslatePicture[file]?(file+game.yktranslatePicture[file]):file),
					source:character,
				});
			}
			game.ykcheck_file_num=0;
			game.ykcheck_file_sum=listfile.length;
			panel2.innerHTML='当前检测数：'+game.ykcheck_file_num+' / '+game.ykcheck_file_sum;
			game.ykgetSize(listfile,(filePath,exportList)=>{
				game.ykcheck_file_num++;
				panel2.innerHTML='当前检测数：'+game.ykcheck_file_num+' / '+game.ykcheck_file_sum+'<br>当前检测文件：'+filePath.url;
			},(exportList)=>{
				var list=[],log1='<br><br>缺失的文件（前缀“extension/云空/”已省略）：',log2='<br><br>存在该文件，但该文件大小为0KB（前缀“extension/云空/”已省略）：';
				for(var file of exportList[0].concat(exportList[1])){
					if(file.size==null){
						log1+=file.url.slice(file.url.indexOf('extension/云空/')+13,file.url.length)+'、';
						if(list.indexOf(file.parent.source)==-1) list.push(file.parent.source);
					}
					if(file.size==0){
						log2+=file.url.slice(file.url.indexOf('extension/云空/')+13,file.url.length)+'、';
						if(list.indexOf(file.parent.source)==-1) list.push(file.parent.source);
					}
				}
				setTimeout(()=>{
					if(log1=='<br><br>缺失的文件（前缀“extension/云空/”已省略）：') log1+='无、'; 
					if(log2=='<br><br>存在该文件，但该文件大小为0KB（前缀“extension/云空/”已省略）：') log2+='无、'; 
					record.addText('检测完成！');
					record.addText('本次检测结果：'+log1.slice(0,log1.length-1)+log2.slice(0,log2.length-1));
					record.addText('点击左侧按钮，手动下载对应武将和其他缺失的文件');
					panel2.delete();
					panel2=ui.create.div();
					panel2.style.cssText='top:60px;left:0%;height:calc(100% - 60px);width:70%;overflow-y:scroll;text-align:left;';
					lib.setScroll(panel2);
					panel.appendChild(panel2);
					var fast_download=ui.create.div('.menu');
					fast_download.innerHTML='<span style="margin-top:10px;font-family:shousha;color:black">快速下载</span>';
					fast_download.name='fast';
					fast_download.style.cssText='text-align:center;margin-top:20px;margin-left:20px;top:0px;left:0px;height:40px;width:70px;position:relative;border-radius:8px;background-color:white;';
					fast_download.onclick=fast_download_func;
					window.yk_clickFK(fast_download);
					panel2.appendChild(fast_download);
					game.ykdownload_createButton(panel2,list);
					window.yk_isCheckingNow=false;
				},50);
			});
		}
		else{
			record.addText('尚未获取无名杀文件位置，请使用选择文件功能选择无名杀game.js文件或任意扩展的extension.js并点击读取按钮。');
			var check=ui.create.div('.menu');
			check.innerHTML='检测本地资源';
			check.style.cssText='text-align:center;margin-top:20px;margin-left:20px;top:0px;left:0px;height:40px;width:70px;border-radius:8px;background-color:white;';
			panel2.appendChild(check);
			var fast_download=ui.create.div('.menu');
			fast_download.innerHTML='<span style="margin-top:10px;font-family:shousha;color:black">快速下载</span>';
			fast_download.name='fast';
			fast_download.style.cssText='text-align:center;margin-top:20px;margin-left:20px;top:0px;left:0px;height:40px;width:70px;position:relative;border-radius:8px;background-color:white;';
			fast_download.onclick=fast_download_func;
			window.yk_clickFK(fast_download);
			panel2.appendChild(fast_download);
			check.onclick=readURL;
			return ;
		}
	};
	readURL();
	var funcDownload=function(){
		if(window.yk_isCheckingNow){
			alert('当前正在检测！');
			return ;
		};
		panel.delete();
		panel=undefined;
	};
	var div=ui.create.div('.menubutton.round','×',function(){
		funcDownload();
	});
	div.style.top='5px';
	div.style.left='calc(100% - 55px)';
	div.style['z-index']=99999;
	panel.appendChild(div);
	window.yk_clickFK(div);
})(lib,game,ui,get,ai,_status);