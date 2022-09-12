'use strict';
window.YKimport(function(lib,game,ui,get,ai,_status){
	//防止反复加载
	/*if(window.ykloadJSON_basic) return ;
	window.ykloadJSON_basic=true;*/
	//解锁角色gainNewPerson、gainNewPerson2---------用法：game.YKgainNewPerson2('qxq_yk_yanmengyuejian-female-3-ykshimeng-ykyueyan');
	game.YKgainNewPerson2=function(str){
		if(!str){alert('角色名错误！');return ;}
		if(game.ykHasCharacter(str)){alert('您已拥有角色【'+get.translation(str.slice(0,str.indexOf('-')))+'】！');return ;}
		alert('按住并拖动鼠标或划动屏幕画出你喜欢的符号，召唤武将');
		if(str.indexOf('-')!=-1){
			var strx=str;
			str=str.slice(0,str.indexOf('-'));
		}
		var dialogCharacter={};
		window.background_callMyCharacterBackground=ui.create.dialog('hidden');
		window.background_callMyCharacterBackground.classList.add('popped');
		window.background_callMyCharacterBackground.setBackgroundImage('');
		window.background_callMyCharacterBackground.classList.add('static');
		window.background_callMyCharacterBackground.style.height='100%';
		window.background_callMyCharacterBackground.style.width='100%';
		window.background_callMyCharacterBackground.style.left='0%';
		window.background_callMyCharacterBackground.style.top='0%';
		ui.window.appendChild(window.background_callMyCharacterBackground);
		dialogCharacter.background=window.background_callMyCharacterBackground;
		window.background_callMyCharacter=ui.create.div('hidden');
		window.background_callMyCharacter.classList.add('popped');
		window.background_callMyCharacter.classList.add('static');
		window.background_callMyCharacter.style.height='calc(100%)';
		window.background_callMyCharacter.style.width='calc(100%)';
		window.background_callMyCharacter.style.left='0%';
		window.background_callMyCharacter.style.top='0%';
		window.background_callMyCharacter.style.backgroundColor='black';
		window.background_callMyCharacter.style.opacity=0.8;
		window.background_callMyCharacter.style['text-align']='center';
		window.background_callMyCharacter.innerHTML='<span style="color:white;font-size:35px;font-weight:400;font-family:shousha"><b>按住并拖动鼠标或划动屏幕画出你喜欢的符号，召唤武将</b></span>';
		dialogCharacter.background=window.background_callMyCharacter;
		window.background_callMyCharacterBackground.appendChild(window.background_callMyCharacter);
		if(strx!=undefined) var list=['character',str,'YKgainNewPerson',strx];
		else var list=['character',str];
		window.yk_divMoveCanvas(window.background_callMyCharacter,document.body,true,'yellow',false,'yk_unlockScreen',list);
	}
	game.YKgainNewPerson=function(str){
		if(!str){alert('角色名错误！');return ;}
		if(game.ykHasCharacter(str)){alert('您已拥角色【'+get.translation(str.slice(0,str.indexOf('-')))+'】！');return ;}
		if(typeof str!='string') var str=''+str;
		var character=str;
		if(str.indexOf('qxq_yk')==-1||str.indexOf('-')==-1){
			if(game.saydpcq&&typeof game.saydpcq=='function') game.saydpcq('无效的角色名，请联系扩展作者尽快修复！');
			return ;
		}
		var name=(character.slice(0,character.indexOf('-'))||'');
		character=character.slice(character.indexOf('-')+1,character.length);
		var sex=(character.slice(0,character.indexOf('-'))||'');
		character=character.slice(character.indexOf('-')+1,character.length);
		var hp=parseInt(character.slice(0,(character.indexOf('-')==-1?character.length:character.indexOf('-'))));
		if(name.length==0||sex.length==0||isNaN(hp)){
			if(game.saydpcq&&typeof game.saydpcq=='function') game.saydpcq('无效的角色名，请联系扩展作者尽快修复！');
			return ;
		}
		if(lib.config.YKcharacterNameList.indexOf(str)!=-1){
			if(game.saydpcq&&typeof game.saydpcq=='function') game.saydpcq('您已获得该角色！');
			return ;
		}
		if(!lib.config.qxq_YK_person.score[name]||lib.config.qxq_YK_person.score[name]==undefined){//添加基础评分
			if(lib.config.qxq_YK_person.rank&&lib.config.qxq_YK_person.rank[name]&&lib.config.qxq_YK_person.rank[name].indexOf('超稀-限定')!=-1) lib.config.qxq_YK_person.score[name]=1000;
			if(lib.config.qxq_YK_person.rank&&lib.config.qxq_YK_person.rank[name]&&lib.config.qxq_YK_person.rank[name].indexOf('天级')!=-1) lib.config.qxq_YK_person.score[name]=1000;
			if(lib.config.qxq_YK_person.rank&&lib.config.qxq_YK_person.rank[name]&&lib.config.qxq_YK_person.rank[name].indexOf('地级')!=-1) lib.config.qxq_YK_person.score[name]=800;
			if(lib.config.qxq_YK_person.rank&&lib.config.qxq_YK_person.rank[name]&&lib.config.qxq_YK_person.rank[name].indexOf('玄级')!=-1) lib.config.qxq_YK_person.score[name]=400;
			if(lib.config.qxq_YK_person.rank&&lib.config.qxq_YK_person.rank[name]&&lib.config.qxq_YK_person.rank[name].indexOf('黄级')!=-1) lib.config.qxq_YK_person.score[name]=200;
			if(lib.config.qxq_YK_person.rank&&lib.config.qxq_YK_person.rank[name]&&lib.config.qxq_YK_person.rank[name].indexOf('凡级')!=-1) lib.config.qxq_YK_person.score[name]=100;
			game.saveConfig('qxq_YK_person',lib.config.qxq_YK_person);
		}
		lib.config.YKcharacterNameList.push(str);
		game.saveConfig('YKcharacterNameList',lib.config.YKcharacterNameList);
		alert('恭喜解锁新角色：【'+get.translation(name)+'】！新武将的角色图片需要前往【自动检测版本和更新】处下载！即将重启以保存。');
		if(game.saydpcq&&typeof game.saydpcq=='function') game.saydpcq('恭喜解锁新角色：【'+get.translation(name)+'】！即将重启以保存。');
		setTimeout(function(){game.reload();},3000);
	}
	//升级技能upGradeSkill--------------技能格式：skillname_rank---------例：法则天定0级------------fazetianding_0-----用法：game.upGradeSkill('qxq_yk_yanmengyuejian','fazetianding');
	game.upGradeSkill=function(skillname,upnum){
		if(!skillname) return ;
		if(!upnum) upnum=1;
		if(lib.config['yk_'+skillname+'_rank']==undefined) game.saveConfig('yk_'+skillname+'_rank',upnum);
		else{
			var rank=parseInt(lib.config['yk_'+skillname+'_rank']);
			if(rank==5){alert('该技能已达到最大等级！');return ;}
			if(isNaN(rank)) game.saveConfig('yk_'+skillname+'_rank',upnum);
			else game.saveConfig('yk_'+skillname+'_rank',rank+upnum);
		}
		alert('技能【'+get.translation(skillname)+'】升级成功！当前等级为：Lv'+lib.config['yk_'+skillname+'_rank']+'。即将重启以保存。');
		if(game.saydpcq&&game.saydpcq!=undefined&&typeof game.saydpcq=='function'){game.saydpcq('技能【'+get.translation(skillname)+'】升级成功！当前等级为：Lv'+lib.config['yk_'+skillname+'_rank']);}
		if(game.saydpcq&&game.saydpcq!=undefined&&typeof game.saydpcq=='function'){game.saydpcq('即将自动重启以保存！');}
		setTimeout(function(){
			game.reload();
		},3000);
	}
	//-----------------------------------提示-----------------------------//
	/*if(!lib.config['yktips_2022/3/22']){
		alert('增加【更新日志】和【文件下载】功能啦！详见云空菜单栏。（此提示显示一次后自动不再显示）');
		game.saveConfig('yktips_2022/3/22',true);
	}*/
	//----------------------------------加载文件----------------------------//
	window.ykloadjs("achievement");
	var ykdateUpdate=function(){
		var date=new Date();
		var day=date.getDate();
		if(lib.config.yk_updateDate==undefined||lib.config.yk_updateDate!=day){
			var date=new Date();
			var day=date.getDate();
			lib.config.yk_updateDate=day;
			game.download('https://raw.fastgit.org/qxqdpcq/yunkong/main/extension/skin.js','extension/云空/skin.js',function(){},function(){});
			game.download('https://raw.fastgit.org/qxqdpcq/yunkong/main/extension/yk2.css','extension/云空/yk2.css',function(){},function(){});
			game.saveConfig('yk_updateDate',lib.config.yk_updateDate);
		}
	};
	ykdateUpdate();
	window.yk_downloadElementJson=function(){
		if(lib.config.ykDTSCache&&lib.config.ykDTSCache.content&&typeof lib.config.ykDTSCache.content.element=='string') eval(lib.config.ykDTSCache.content.element);
		else window.ykloadjs("element");
	}
	window.yk_downloadElementJson();
// ---------------------------------------适配十周年用------------------------------------------//
	game.dpcqHasExtension = function(str){
		return lib.config.extensions && lib.config.extensions.contains(str) && lib.config['extension_'+str+'_enable'];
	};
// ---------------------------------------适配千幻用------------------------------------------//
	window.yk_downloadSkinJson=function(){
		lib.init.js(lib.assetURL+'extension/云空','skin',function(){},function(){
			game.download('https://raw.fastgit.org/qxqdpcq/yunkong/main/extension/skin.js','extension/云空/skin.js',function(){},function(){});
			setTimeout(window.yk_downloadSkinJson,2500);
		});
	}
	window.yk_downloadSkinJson();
	//--------------------------------换肤设置--------------------------------//
	if(lib.config.ykCharacterSkin==undefined) lib.config.ykCharacterSkin={};
	lib.config.ykCharacterSkin.skinList={//皮肤列表-皮肤名
		'qxq_yk_xiaoqiao':['huanhongzhuang','yixianglvren','chunricaizhuang','jindengyezhu'],//小乔
		'qxq_yk_kongshanlingxue':['zhijianren'],//空山泠雪
		'qxq_yk_yanmengyuejian':['heizhishi','zhumengzhe'],//魇梦月见
		'qxq_yk_fuling':['churuhongchen'],//茯苓
		'qxq_yk_tian':['huayanxiaozhu','guanghanzhexian'],//天
		'qxq_yk_mingyun':['moouyuezhang'],//命运
	};
	if(lib.config.ykCharacterSkin.myChoose==undefined) lib.config.ykCharacterSkin.myChoose={};
	game.saveConfig('ykCharacterSkin',lib.config.ykCharacterSkin);
	//CheckCheat
	window.ykCheatCount = 0;
	window.ykcheatChecked = function(){
		if(!window.ykCheatCount){
			window.ykCheatCount = 1;
		}else{
			window.ykCheatCount ++;
		}
	};
	var divFunction = ui.create.div;
	ui.create.div = function(){
		var ret = divFunction.apply(this,arguments);
		if(arguments[0] == '.menubutton.round.highlight'){
			if(arguments[1] == '执'){
				ret.listen(function(){
					window.ykcheatChecked();
				});
			}else if(arguments[1] == '作'){
				ret.listen(function(){
					window.ykcheatChecked();
				});
			}
		}
		return ret;
	};
   	game.playyk = function(character,fn,dir,sex,time) {
		if(!character) return ;
		if (lib.config.background_speak) {
			if (dir && sex) game.playAudio(dir, sex, fn);
			else if (dir) game.playAudio(dir, fn);
			else game.playAudio('..', 'extension', '云空',character, fn);
		}
		if(time){
			if(typeof time=='string') time=parseFloat(time);
			if(typeof time=='number'){
				if(ui.backgroundMusic){ui.backgroundMusic.pause();lib.music_isPaused=true;}
				setTimeout(function(){if(lib.music_isPaused){ui.backgroundMusic.play();lib.music_isPaused=false;}},time+1000);
			}
		}
	};
   	game.playykvideo = function(name,time) {
		alive('extension/云空/'+name+'.gif',time,true);
	};
	//解锁特效
	window.yk_unlockScreen=function(type,name,func,funcContent){
		//if(!name) return ;
		if(Array.isArray(type)&&type.length>0){
			if(name!==undefined) var func=name;
			var name=type[1];
			if(!func) var func=type[2];
			if(!funcContent) var funcContent=type[3];
			var type=type[0];
		}
		window.yk_showName=name;
		if(type=='character'){
			var dialogM={};
			window.animationBackground=ui.create.dialog('hidden');
			window.animationBackground.classList.add('popped');
			window.animationBackground.classList.add('static');
			window.animationBackground.style.height='300px';
			window.animationBackground.style.width='600px';
			window.animationBackground.style.left='calc( 50% - 300px)';
			window.animationBackground.style.top='calc( 50% - 150px)';
			window.animationBackground.style.transition='all 1.5s';
			ui.window.appendChild(window.animationBackground);
			dialogM.background=window.animationBackground;
			game.ykDrawImage3(0,0,'100%','100%','extension/云空/gainNewCharacter.gif',window.animationBackground,'yk_unlockScreenPict');
			window.animationBackgroundCharacter=ui.create.div('hidden');
			window.animationBackgroundCharacter.classList.add('popped');
			window.animationBackgroundCharacter.classList.add('static');
			window.animationBackgroundCharacter.style.height='73%';
			window.animationBackgroundCharacter.style.width='24.5%';
			window.animationBackgroundCharacter.style.left='37.5%';
			window.animationBackgroundCharacter.style.top='10%';
			window.animationBackgroundCharacter.style.transition='all 2s';
			window.animationBackgroundCharacter.style.backgroundColor='black';
			window.ykCacheSetImage('https://raw.fastgit.org/qxqdpcq/yunkong/main/extension/'+name+'.jpg',window.animationBackgroundCharacter,true,"cover");
			window.animationBackgroundCharacter.style.opacity=0;
			window.animationBackground.appendChild(window.animationBackgroundCharacter);
			setTimeout(function(){
				window.animationBackgroundCharacter.style.opacity=1;
			},10000);
			setTimeout(function(){
				window.yk_unlockScreenPict.delete();
				delete window.yk_unlockScreenPict;
				window.yk_unlockScreenPict=undefined;
				window.animationBackground.style.height='450px';
				window.animationBackground.style.width='900px';
				window.animationBackground.style.left='calc( 50% - 450px)';
				window.animationBackground.style.top='calc( 50% - 225px)';
				var introduce=(lib.characterIntro[window.yk_showName]||'暂无介绍');
				window.animationBackgroundCharacterIntroTop=ui.create.div('hidden');
				window.animationBackgroundCharacterIntroTop.style.height='10%';
				window.animationBackgroundCharacterIntroTop.style.width='24.5%';
				window.animationBackgroundCharacterIntroTop.style.left='37.5%';
				window.animationBackgroundCharacterIntroTop.style.top='0%';
				window.animationBackgroundCharacterIntroTop.style.transition='all 2s';
				window.animationBackgroundCharacterIntroTop.style.opacity=0;
				window.animationBackgroundCharacterIntroTop.innerHTML='<span style="cursor:pointer;"><font color=red>恭喜解锁新角色！<br>点击关闭面板介绍</font></span>';
				window.animationBackground.appendChild(window.animationBackgroundCharacterIntroTop);
				
				window.animationBackgroundCharacterIntroButtom=ui.create.div('hidden');
				window.animationBackgroundCharacterIntroButtom.style.height='17%';
				window.animationBackgroundCharacterIntroButtom.style.width='24.5%';
				window.animationBackgroundCharacterIntroButtom.style.left='37.5%';
				window.animationBackgroundCharacterIntroButtom.style.top='83%';
				window.animationBackgroundCharacterIntroButtom.style.transition='all 3s';
				window.animationBackgroundCharacterIntroButtom.style.opacity=0;
				window.animationBackgroundCharacterIntroButtom.innerHTML='<span style="cursor:pointer;"><font color=red><b>'+get.translation(window.yk_showName)+'<b></font></span>';
				window.animationBackground.appendChild(window.animationBackgroundCharacterIntroButtom);
				
				window.animationBackgroundCharacterIntroLeft=ui.create.div('hidden');
				window.animationBackgroundCharacterIntroLeft.style.height='73%';
				window.animationBackgroundCharacterIntroLeft.style.width='35%';
				window.animationBackgroundCharacterIntroLeft.style.left='1%';
				window.animationBackgroundCharacterIntroLeft.style.top='10%';
				window.animationBackgroundCharacterIntroLeft.style.transition='all 3s';
				window.animationBackgroundCharacterIntroLeft.style.opacity=0;
				window.animationBackgroundCharacterIntroLeft.style.backgroundColor='white';
				window.animationBackgroundCharacterIntroLeft.innerHTML='<font color=black><span style="cursor:pointer;"><b>人物介绍：</b></span><br>'+introduce+'</font>';
				window.animationBackgroundCharacterIntroLeft.style['overflow-y']='scroll';
				lib.setScroll(window.animationBackgroundCharacterIntroLeft);
				window.animationBackground.appendChild(window.animationBackgroundCharacterIntroLeft);
				
				window.animationBackgroundCharacterIntroRight=ui.create.div('hidden');
				window.animationBackgroundCharacterIntroRight.style.height='73%';
				window.animationBackgroundCharacterIntroRight.style.width='36%';
				window.animationBackgroundCharacterIntroRight.style.left='63%';
				window.animationBackgroundCharacterIntroRight.style.top='10%';
				window.animationBackgroundCharacterIntroRight.style.transition='all 3s';
				window.animationBackgroundCharacterIntroRight.style.opacity=0;
				window.animationBackgroundCharacterIntroRight.style.backgroundColor='white';
				window.animationBackgroundCharacterIntroRight.innerHTML='<font color=black><span style="cursor:pointer;"><b>角色评级：</b></span>'+(lib.config.qxq_YK_person.rank[window.yk_showName]||'未知错误！')+'</font><br><br><font color=black><span style="cursor:pointer;"><b>角色评分：</b></span>'+(lib.config.qxq_YK_person.score[window.yk_showName]||'未知错误！')+'</font>';
				if(lib.config.qxq_YK_person.nature.Mp[window.yk_showName]!=undefined) window.animationBackgroundCharacterIntroRight.innerHTML+='<br><br><font color=black>角色基础术法值：</font><font color=cyan>'+lib.config.qxq_YK_person.nature.Mp[window.yk_showName]+'</font>';
				if(lib.config.qxq_YK_person.nature.Strength[window.yk_showName]!=undefined) window.animationBackgroundCharacterIntroRight.innerHTML+='<br><br><font color=black>角色基础气力值：</font><font color=yellow>'+lib.config.qxq_YK_person.nature.Strength[window.yk_showName]+'</font>';
				if(lib.config.qxq_YK_person.nature.Defend[window.yk_showName]!=undefined) window.animationBackgroundCharacterIntroRight.innerHTML+='<br><br><font color=black>角色基础真气值：</font><font color=grey>'+lib.config.qxq_YK_person.nature.Defend[window.yk_showName]+'</font>';
				if(lib.config.qxq_YK_person.nature.Soul[window.yk_showName]!=undefined) window.animationBackgroundCharacterIntroRight.innerHTML+='<br><br><font color=black>角色基础元力值：</font><font color=purple>'+lib.config.qxq_YK_person.nature.Soul[window.yk_showName]+'</font>';
				window.animationBackgroundCharacterIntroRight.style['overflow-y']='scroll';
				lib.setScroll(window.animationBackgroundCharacterIntroRight);
				window.animationBackground.appendChild(window.animationBackgroundCharacterIntroRight);
				setTimeout(function(){
					window.animationBackgroundCharacterIntroTop.style.opacity=1;
					window.animationBackgroundCharacterIntroButtom.style.opacity=1;
					window.animationBackgroundCharacterIntroLeft.style.opacity=1;
					window.animationBackgroundCharacterIntroRight.style.opacity=1;
					window.animationBackground.onclick=function(){
						window.animationBackground.delete();
						delete window.animationBackground;
						window.animationBackground=undefined;
						if(func!=undefined&&window[func]!=undefined&&typeof window[func]=='function') window[func](funcContent);
						else if(func!=undefined&&game[func]!=undefined&&typeof game[func]=='function') game[func](funcContent);
						if(window.background_callMyCharacterBackground!=undefined){
							window.background_callMyCharacterBackground.delete();
							delete window.background_callMyCharacterBackground;
							window.background_callMyCharacterBackground=undefined;
						}
					}
				},50);
			},12000);
		}
		if(type=='achievement'){
			
		}
	}
	//读取图片长宽-----第一次读取均为[0,0];
	game.getImageWH=function(src){//[width,height];
		var img=new Image();
		img.src=(src||lib.assetURL+src);
		if(img.width==0&&img.height==0) return false;
		return [img.width,img.height];
	};
	//div画图
	if (!window.yk_divMoveCanvas) {
		let isMobile = navigator.userAgent.match(/(Android|iPhone|SymbianOS|Windows Phone|iPad|iPod)/i);
		window.yk_divMoveCanvas = function zyile_dragZoom(element, body, drawPath, pathColor, moveElementBool, func, funcContent, Tran, XZ, isImp) {
			if(moveElementBool!=false) moveElementBool=true;
			element.movable=moveElementBool;
			var disX = 0,
			disY = 0,
			area,
			contains = body || element.parentNode || document.body,
			isTouch = false, types = ['mousedown', 'mousemove', 'mouseup'], dragtouche,
			TranLeT = function (iT, iL, b) {
				if (isNaN(iT) || isNaN(iL)) return;
				if(element.movable==false) return ;
				if (!Tran) {
					var translate = element._translate.slice(0);
					if (b) translate = element._translate;
					translate[0] += iL;
					translate[1] += iT;
					if (!XZ) {
						if (translate[1] + element.offsetTop + element.offsetHeight > contains.offsetHeight) {
							translate[1] = contains.offsetHeight - (element.offsetTop + element.offsetHeight);
						} else if (translate[1] + element.offsetTop < 0) {
							translate[1] = -element.offsetTop;
						};
						if (translate[0] + element.offsetLeft + element.offsetWidth > contains.offsetWidth) {
							translate[0] = contains.offsetWidth - (element.offsetLeft + element.offsetWidth);
						} else if (translate[0] + element.offsetLeft < 0) {
							translate[0] = -element.offsetLeft;
						};
					};
					if (!isImp) element.style.transform = "translate3d(" + translate[0] + "px," + translate[1] + "px,0) scale(" + element._scale + ")";
					else element.style.setProperty('transform', "translate3d(" + translate[0] + "px," + translate[1] + "px,0) scale(" + element._scale + ")", 'important');
				} else {
					if (!XZ) {
						if (iT + area[1] + element.offsetHeight > contains.offsetHeight) {
							iT = contains.offsetHeight - (area[1] + element.offsetHeight);
						} else if (iT + area[1] < 0) {
							iT = -area[1];
						};
					if (iL + area[0] + element.offsetWidth > contains.offsetWidth) {
						iL = contains.offsetWidth - (area[0] + element.offsetWidth);
					} else if (iL + area[0] < 0) {
						iL = -area[0];
					};
				};
				if (!isImp) element.css({
					left: area[0] + iL + 'px',
					top: area[1] + iT + 'px',
				});
				else
					element.style.setProperty('left', area[0] + iL + 'px', 'important'), element.style.setProperty('top', area[1] + iT + 'px', 'important');
				};
			};
			element._scale = 1,
			element.zooming = false,
			element.style.touchAction = "none";
			if (!element._translate) element._translate = [0, 0];
			if (isMobile) types = ['touchstart', "touchmove", 'touchend'];
			element['on' + types[0]] = event => {
				event.stopPropagation();
				if (element.classList.contains('dialog')) {
					if (element.classList.contains('fixed') || element.classList.contains('popped')) return void 0;
					if (event.target.finished) return void 0;
					if (isMobile) if (event.touches.length <= 1) return undefined;
				} else if (event.target.finished || (element.content && element.content.contains(event.target))) return void 0;
				if (event.touches && event.touches[0]) event = event.touches[0];
				isTouch = true, area = [element.offsetLeft, element.offsetTop];
				disX = event.clientX / game.documentZoom;
				disY = event.clientY / game.documentZoom;
				window.yk_drawPath_startPoint=[disX,disY];
				window.yk_drawPath_path=[];
				document.addEventListener(types[1], windowmousemove, true);
				document.addEventListener(types[2], windowmouseup, true);
				element['on' + types[2]] = windowmouseup;
				element.dispatchEvent(new Event('zyile_move_Stat'));
			};
			var windowmousemove = function (event) {
				if (!isTouch) return false;
				event.preventDefault();
				event.stopPropagation();
				var event = event || window.event
				if (event.touches && event.touches[0]) event = event.touches[0], dragtouche = event;
				var iL = event.clientX / game.documentZoom - disX;
				var iT = event.clientY / game.documentZoom - disY;
				if(drawPath==true){//画出路径，鼠标离开时路径和div消失
					if(window.yk_drawPath_startPoint==undefined) window.yk_drawPath_startPoint=[0,0];
					if(window['yk_drawPath'+iL+'_'+iT]!=undefined){
						window['yk_drawPath'+iL+'_'+iT].delete();
						delete window['yk_drawPath'+iL+'_'+iT];
						window['yk_drawPath'+iL+'_'+iT]=undefined;
					}
					window['yk_drawPath'+iL+'_'+iT]=ui.create.div('');
					window['yk_drawPath'+iL+'_'+iT].style.backgroundColor=(pathColor||'yellow');
					window['yk_drawPath'+iL+'_'+iT].style.height='5px';
					window['yk_drawPath'+iL+'_'+iT].style.width='5px';
					window['yk_drawPath'+iL+'_'+iT].style.borderRadius='100%';
					window['yk_drawPath'+iL+'_'+iT].style.left=window.yk_drawPath_startPoint[0]+iL-2.5+'px';
					window['yk_drawPath'+iL+'_'+iT].style.top=window.yk_drawPath_startPoint[1]+iT-2.5+'px';
					window['yk_drawPath'+iL+'_'+iT].style.transition='none';
					var pathRecord='yk_drawPath'+iL+'_'+iT;
					if(window.yk_drawPath_path.indexOf(pathRecord)==-1) window.yk_drawPath_path.push(pathRecord);
					if(moveElementBool==false) element.appendChild(window['yk_drawPath'+iL+'_'+iT]);
					else contains.appendChild(window['yk_drawPath'+iL+'_'+iT]);
				}
				else if(typeof drawPath=='number'&&!isNaN(drawPath)){
					drawPath=drawPath*1000;
				}
				TranLeT(iT, iL);
				element.dispatchEvent(new Event('zyile_moving'));
				return false;
			};
			var windowmouseup = event => {
				if (!isTouch) return void 0;
				event.stopPropagation();
				event.preventDefault();
				document.removeEventListener(types[1], windowmousemove);
				document.removeEventListener(types[2], windowmouseup);
				element['on' + types[2]] = null;
				isTouch = false;
				if (dragtouche) event = dragtouche;
				var iL = event.clientX / game.documentZoom - disX;
				var iT = event.clientY / game.documentZoom - disY;
				TranLeT(iT, iL, true);
				dragtouche = null;
				var iiT = Math.abs(iL),
				iiL = Math.abs(iT);
				if ((iiT < 10 && iiL < 10) || (isNaN(iiT) && isNaN(iiL))) element.dispatchEvent(new Event('endDang'));
				element.dispatchEvent(new Event('moveStop'));
				if(moveElementBool!=true&&(drawPath==true||(typeof drawPath=='number'&&!isNaN(drawPath)))){
					setTimeout(function(){
						element.delete();
						element=undefined;
						for(var i of window.yk_drawPath_path){
							window[i].delete();
							delete window[i];
							window[i]=undefined;
						}
						window.yk_drawPath_path=[];
						delete window.yk_drawPath_path;
					},50);
				}
				if(func!=undefined&&window[func]!=undefined&&typeof window[func]=='function') setTimeout(function(){window[func](funcContent);},50);
				else if(func!=undefined&&game[func]!=undefined&&typeof game[func]=='function') setTimeout(function(){game[func](funcContent);},50);
			};
		};
	}
	//云空剧情&挑战模式
	if(lib.config.only_yk){
		window.characterList=[];
		for(var x=0;x<lib.config.YKcharacterNameList.length;x++){
			var character=lib.config.YKcharacterNameList[x];
			var name=character.slice(0,character.indexOf('-'));
			if(!window.characterList.contains(name)) window.characterList.push(name);
		}
		if(window.characterList.length>0){
			var savedFilter = lib.filter.characterDisabled;
			lib.filter.characterDisabled = function(i,libCharacter){
				if(i&&((i.indexOf('qxq_yk_')== -1&&window.characterList.indexOf(i)==-1)||lib.qxq_yk_bossList.indexOf(i)!=-1)){
					return true;
				}
			}
			if(lib.arenaReady!=undefined) lib.arenaReady.push(function(){
				setTimeout(function(){
					for(var i=0;i<ui.controls.length;i++){
						if(ui.controls[i].innerHTML.indexOf('自由选将')!=-1) ui.controls[i].delete();
					}
				},50);
			});
			window.checkYKMode=function(){
				var bool=true;
				for(var i in lib.character){
					if(i&&window.characterList.indexOf(i)==-1){
						var bool=false;
					}
				}
				if(bool==false){
					if(confirm('检测到存在非云空武将，是否尝试再次重启？')){
						setTimeout(function(){game.reload();},100);
					}
					else{
						game.saveConfig('only_yk',false);
						game.saveConfig('only_ykCardPile',false);
						alert('即将自动退出云空模式并重启。');
						setTimeout(function(){game.reload();},1000);
					}
				}
				return bool;
			}
			setTimeout(window.checkYKMode(),3000);
		}
		else{
			alert('您尚未拥有任何云空非Boss武将，将启动保护机制，自动退出此模式和云空牌堆模式。');
			game.saveConfig('only_yk',false);
			game.saveConfig('only_ykCardPile',false);
			var savedFilter = lib.filter.characterDisabled;
			lib.filter.characterDisabled = function(i,libCharacter){
				return savedFilter(i,libCharacter);
			}
		}
	}
	//云空牌堆
	if(lib.config.only_ykCardPile){
		lib.arenaReady.push(function(){
			//ykpd
			lib.card.list.splice(0,lib.card.list.length);
			var numberCard = {
				sha:{
					heart:10,
					diamond:26,
					spade:23,
					club:65,
				},
				huosha:{
					heart:14,
					diamond:5,
				},
				leisha:{
					spade:25,
					club:11,
				},
				shan:{
					heart:30,
					diamond:70,
				},
				tao:{
					heart:35,
					diamond:11,
				},
				jiu:{
					diamond:1,
					club:9,
					spade:8,
				},
			};
			var cursorHeart = 0;
			var fillHeart = [
				'tengjia',
				'guohe',
				'juedou',
				'shunshou',
				'taoyuan',
				'wanjian',
				'wugu',
				'wuzhong',
				'lebu',
				'shandian',
				'guanshi',
				'qilin',
				'qinglong',
				'zhangba',
				'zhuahuang',
				'chitu',
				'huogong',
				'zhuque',
				'wuxie'
			];
			var cursorDiamond = 0;
			var fillDiamond = [
				'juedou',
				'taoyuan',
				'wanjian',
				'wugu',
				'wuzhong',
				'lebu',
				'fangtian',
				'guanshi',
				'qilin',
				'zhuge',
				'renwang',
				'dilu',
				'zhuahuang',
				'chitu',
				'dawan',
				'zixin',
				'huogong',
				'zhuque',
				'hualiu',
				'muniu',
				'wuxie'
			];
			var cursorClub = 0;
			var fillClub = [
				'tengjia',
				'baiyin',
				'bagua',
				'jiedao',
				'juedou',
				'nanman',
				'cixiong',
				'fangtian',
				'hanbing',
				'qinggang',
				'zhuge',
				'renwang',
				'dilu',
				'jueying',
				'dawan',
				'zixin',
				'tiesuo',
				'bingliang',
				'guding',
				'hualiu',
				'muniu',
				'wuxie'
			];
			var cursorSpade = 0;
			var fillSpade = [
				'baiyin',
				'bagua',
				'jiedao',
				'guohe',
				'juedou',
				'nanman',
				'shunshou',
				'shandian',
				'cixiong',
				'hanbing',
				'qinggang',
				'qinglong',
				'zhangba',
				'jueying',
				'tiesuo',
				'bingliang',
				'guding',
				'wuxie'
			];
			var report = {
				'sum':0,
				'fill':0,
				'heart':0,
				'spade':0,
				'diamond':0,
				'club':0,
				'basic':0,
				'delay':0,
				'trick':0,
				'equip':0,
			};
			var fetchName = function(suit,number){
				var foundName = null;
				for(var name in numberCard){
					if(numberCard[name][suit]){
						foundName = name;
					}
				}
				if(foundName !== null){
					numberCard[foundName][suit]--;
					if(numberCard[foundName][suit] === 0){
						delete numberCard[foundName][suit];
					}
					if(Object.keys(numberCard[foundName]).length == 0){
						delete numberCard[foundName];
					}
					return foundName;
				}
				report['fill']++;
				var ret = '';
				if(suit == 'heart'){
					ret = fillHeart[cursorHeart % fillHeart.length];
					cursorHeart ++;
				}else if(suit == 'diamond'){
					ret = fillDiamond[cursorDiamond % fillDiamond.length];
					cursorDiamond++;
				}else if(suit == 'spade'){
					ret = fillSpade[cursorSpade % fillSpade.length];
					cursorSpade++;
				}else if(suit == 'club'){
					ret = fillClub[cursorClub % fillClub.length];
					cursorClub++;
				}
				return ret;
			};
			var suits = ['diamond','spade','club','heart'];
			for(var j=0;j<15;j++){
				for(var suit of suits){
					for(var i=1;i<=13;i++){
						var name = fetchName(suit,i);
						if(!report[name]){
							report[name] = 1;
						}else{
							report[name]++;
						}
						report['sum']++;
						if(name == 'huosha'){
							lib.card.list.push([suit,i,'sha','fire']);
							report[suit]++;
							report['basic']++;
						}else if(name == 'leisha'){
							lib.card.list.push([suit,i,'sha','thunder']);
							report[suit]++;
							report['basic']++;
						}else{
							window.yk_cardPileError = false;
							var info = lib.card[name];
							if(!info){
								if(!window.yk_cardPileError){
									alert('出现错误的卡牌名——错误来源：云空牌堆。请联系扩展作者以反馈bug。');
									window.yk_cardPileError = true;
									continue;
								}
								lib.card.list.push([suit,i,'sha']);
								if(Math.random()<=0.5) lib.card.list.push([suit,i,'shan']);
							}else{
								report[info.type]++;
								report[suit]++;
								lib.card.list.push([suit,i,name]);
							}
						}
					}
				}
			}
			game.ykCardPileRetCards = JSON.stringify(numberCard);
			lib.card.list.randomSort();
			lib.config.ykpaidui_report = JSON.stringify(report);
		});
	}
	//读取网络时间
	//计时器
	window.playTime={};
	window.timeCaculate=function(){
		if(window.ykOffline) return ;
		var http_request="";
		if(window.XMLHttpRequest){
			try{
				http_request=new XMLHttpRequest();
			}catch(e){}
		}
		else if(window.ActiveXObject){
			try{
				http_request = new ActiveXObject("Msxml2.XMLHTTP");
			}catch(e){}
			if(http_request==null){
				try{
					http_request=new ActiveXObject("MicrosoftXMLHTTP");
				}catch(e){}
			}
		}
		http_request.open('HEAD','https://biaozhunshijian.bmcx.com/',false);//网址可更换
		http_request.send(null);
		var onlineDate=new Date(http_request.getResponseHeader('Date'));
		var year=onlineDate.getYear()+1900;
		var month=onlineDate.getMonth()+1;
		var day=onlineDate.getDate();
		var hour=onlineDate.getHours();
		var minute=onlineDate.getMinutes();
		var second=onlineDate.getSeconds();
		window.playTime.weekdays=onlineDate.getDay();
		window.playTime.seconds=second+1;
		window.playTime.minutes=minute;
		window.playTime.hours=hour;
		window.playTime.days=day;
		window.playTime.months=month;
		window.playTime.years=year;
		var interval=setInterval(function(){
			window.playTime.seconds++;
			if(window.playTime.seconds>59){
				window.playTime.seconds-=60;
				window.playTime.minutes++;
			}
			if(window.playTime.minutes>59){
				window.playTime.minutes-=60;
				window.playTime.hours++;
			}
			if(window.playTime.hours>23){
				window.playTime.hours-=24;
				window.playTime.days++;
			}
			if([1,3,5,7,8,10,12].indexOf(window.playTime.months)!=-1){
				if(window.playTime.days>31){
					window.playTime.days-=31;
					window.playTime.months++;
				}
			}
			if([4,6,9,11].indexOf(window.playTime.months)!=-1){
				if(window.playTime.days>30){
					window.playTime.days-=30;
					window.playTime.months++;
				}
			}
			if([2].indexOf(window.playTime.months)!=-1){
				if(window.playTime.years%4==0&&window.playTime.days>29){
					window.playTime.days-=29;
					window.playTime.months++;
				}
				if(window.playTime.years%4!=0&&window.playTime.days>28){
					window.playTime.days-=28;
					window.playTime.months++;
				}
			}
			if(window.playTime.months>12){
				window.playTime.months-=12;
				window.playTime.years++;
			}
		},1000);
	}
	lib.init.req('https://biaozhunshijian.bmcx.com/',function(){
		window.timeCaculate();
	},function(e){
	},true);
	//Check时间点
	window.checkOnlineTime=function(yearx,monthx,dayx,hourx,minutex,secondx){
		if(window.ykOffline) return false;
		var year=''+window.playTime.years;
		var month=''+window.playTime.months;
		var day=''+window.playTime.days;
		var hour=''+window.playTime.hours;
		var minute=''+window.playTime.minutes;
		var second=''+window.playTime.seconds;
		if(yearx&&yearx!=undefined&&(yearx+'')!=year) return false;
		else if(monthx&&monthx!=undefined&&(monthx+'')!=month) return false;
		else if(dayx&&dayx!=undefined&&(dayx+'')!=day) return false;
		else if(hourx&&hourx!=undefined&&(hourx+'')!=hour) return false;
		else if(minutex&&minutex!=undefined&&(minutex+'')!=minute) return false;
		else if(secondx&&secondx!=undefined&&(secondx+'')!=second) return false;
		return true;
	}
	//Check时间段
	window.checkOnlineTime1=function(yearx1,monthx1,dayx1,yearx2,monthx2,dayx2){
		var isDuringDate=function(beginDateStr,endDateStr){
			var curDate = new Date(),
			beginDate = new Date(beginDateStr),
			endDate = new Date(endDateStr);
			if (curDate >= beginDate && curDate <= endDate) {
				return true;
			}
			return false;
		}
		if(isDuringDate(yearx1+'/'+monthx1+'/'+dayx1,yearx2+'/'+monthx2+'/'+dayx2)) return true;
		else return false;
	}
	//兑换系统
	if(lib.arenaReady) lib.arenaReady.push(function(){
		if(window.ykshow_duihuanma) return ;
		window.ykshow_duihuanma=true;
		ui.ykSpecialCode=ui.create.system('',null,true);
		ui.ykSpecialCode.style.display='none';
		ui.ykSpecialCode.style.display='';
		ui.ykSpecialCode.innerHTML="<body><samp id='兑换码'>兑换码</samp></body><style>#兑换码{animation:change 7s linear 0s infinite;}@keyframes change{0% {color:#FF0000;}10%{color:#FF7F00;}20%{color: #FFFF00;}30%{color:#00FF00;}40% {color:#00FFFF;}50%{color: #0000FF;}60%{color: #8B00FF;}70%{color: #0000FF;}75%{color: #00FFFF ;}80%{color:#00FF00;}85%{color:#FFFF00 ;}90%{color:  #FF7F00;}100%{color: #FF0000;}}</style>";
		lib.setPopped(ui.ykSpecialCode,function(){
			var uiintro=ui.create.dialog('hidden');
			uiintro.add('兑换码');
			var div=ui.create.div();
			div.style.height='22px';
			div.style.width='calc(100% - 4px)';
			div.style.left='0px';
			div.style.margin='2px';
			div.style.borderRadius='2px';
			div.style['background-image']='linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4))';
			div.style['box-shadow']='rgba(0, 0, 0, 0.4) 0 0 0 1px, rgba(0, 0, 0, 0.2) 0 3px 10px';
			div.innerHTML='<input type="text" value="请输入兑换码，领取相应奖励" style="width:calc(100% - 10px);text-align:center;"></input>';
			var input=div.querySelector('input');
			input.onclick=function(e){
				e.stopPropagation();
			};
			input.onfocus=function(){
				if(this.value=='请输入兑换码，领取相应奖励') this.value='';
			};
			input.onkeydown=function(e){
				e.stopPropagation();
				if(e.keyCode==13){
					var value=this.value;
					if(typeof game['yk'+value]=='function'){
						if(game['yk'+value+'_checkTime']==undefined||typeof game['yk'+value+'_checkTime']!='function'||game['yk'+value+'_checkTime']()!=true){
							alert('不在可兑换时间或网络状况不佳，请稍后再试！');
							return ;
						}
						else if(lib.config['yk'+value]!=true){
							lib.config['yk'+value]=true;
							game.saveConfig('yk'+value,lib.config['yk'+value]);
							game['yk'+value]();
						}
						else{alert('您已兑换此奖励！');return ;}
					}
					else{alert('兑换码错误，请输入正确的兑换码！');return ;}
				};
			};
			uiintro.add(div);
			return uiintro;
		});
	});
	//2022新年兑换礼
	game.ykHappyNewYear_checkTime=function(){
		if(window.checkOnlineTime1(2022,1,31,2022,2,1)==true){
			return true;
		}
		else{
			alert('兑换码已过期或活动未开始或网络状况不佳导致获取时间失败！');
			return false;
		}
	}
	game.ykHappyNewYear=function(){
		if(!lib.config.YKcharacterNameList){lib.config.YKcharacterNameList=[];game.saveConfig('YKcharacterNameList',lib.config.YKcharacterNameList);}
		if(game.ykHasCharacter('qxq_yk_xiaoqiao')){alert('已拥有该角色！');return ;}
		if(confirm('春节到啦，快领取你的新年礼物吧O(∩_∩)O~！请许愿你的新年礼物：点击确定——许愿获得角色【小乔】，点击取消——许愿获得角色【魇梦月见】。重要说明：此新年礼物仅可兑换一次，中途退出将导致无法再次领取，请谨慎选择！！！如大家想要另一个未选择的角色，可以开启 云空模式 和 云空牌堆模式 后，在【剧情&挑战-活动】（点击左下角的按钮切换）处通关梦魇难度的副本【缇傀】后领取。')){
			game.YKgainNewPerson2('qxq_yk_xiaoqiao-female-3-yktianxiang-ykzhuyan-ykpiaoling');
			alert('兑换成功！新年快乐！');
		}
		else{
			game.YKgainNewPerson2('qxq_yk_yanmengyuejian-female-3-ykshimeng-ykyueyan');
			alert('兑换成功！新年快乐！');
		}
	}
	
	game.ykGainNewCharacter_checkTime=function(){
		if(window.checkOnlineTime1(2022,3,31,2022,5,31)==true){
			return true;
		}
		else{
			alert('兑换码已过期或活动未开始或网络状况不佳导致获取时间失败！');
			return false;
		}
	}
	game.ykGainNewCharacter=function(){
		if(!lib.config.YKcharacterNameList){lib.config.YKcharacterNameList=[];game.saveConfig('YKcharacterNameList',lib.config.YKcharacterNameList);}
		if(game.ykHasCharacter('qxq_yk_kongshanlingxue')){alert('已拥有该角色！');return ;}
		game.YKgainNewPerson2('qxq_yk_kongshanlingxue-female-3-ykfuji');
		alert('兑换成功！别忘了下载新武将素材哦！');
	}
	//快速制图
	game.ykDrawImage3=function(pictTop,pictLeft,width,height,src,parentChild,thisname){//渲染本地图片，不能调节参数----extension/XXX/XXX.jpg
		if(!width) width=0;
		if(!height) height=0;
		if(!parentChild) parentChild=document.body;
		if(!src) src='';
		var div=ui.create.div('');
		if(!pictTop) pictTop='0%';
		if(!pictLeft) pictLeft='0%';
		if(typeof pictTop=='number'||(typeof pictTop=='string'&&(pictTop.indexOf('%')==-1&&pictTop.indexOf('px')==-1))) pictTop=pictTop+'%';
		if(typeof pictLeft=='number'||(typeof pictLeft=='string'&&(pictLeft.indexOf('%')==-1&&pictLeft.indexOf('px')==-1))) pictLeft=pictLeft+'%';
		div.style.top=(pictTop||'0%');
		div.style.left=(pictLeft||'0%');
		if(typeof height=='string'&&height.indexOf('%')!=-1){
			div.style.height=height;
			height=parseInt(height.slice(0,height.indexOf('%')));
		}
		else if(typeof height=='string'&&height.indexOf('px')!=-1){
			div.style.height=height;
			height=parseInt(height.slice(0,height.indexOf('px')));
		}
		else if(typeof height=='string') height=parseInt(height);
		else div.style.height=height+'px';
		if(typeof width=='string'&&width.indexOf('%')!=-1){
			div.style.width=width;
			width=parseInt(width.slice(0,width.indexOf('%')));
		}
		else if(typeof width=='string'&&width.indexOf('px')!=-1){
			div.style.width=width;
			width=parseInt(width.slice(0,width.indexOf('px')));
		}
		else if(typeof width=='string') width=parseInt(width);
		else div.style.width=width+'px';
		div.setBackgroundImage(src);
		div.style.backgroundSize="100% 100%";
		if(thisname) {window[thisname]=div;parentChild.appendChild(window[thisname]);}
		else parentChild.appendChild(div);
	}
	game.ykSetImage2=function(src,thisChild,bool){
		if(!thisChild) thisChild=ui.background;
		if(!src) return ;
		if(bool) thisChild.style.backgroundSize="100% 100%";
		else thisChild.style.backgroundSize="cover";
		window.ykCacheSetImage(src,thisChild,true,thisChild.style.backgroundSize);
	}
	game.ykDrawImage2=function(pictTop,pictLeft,width,height,src,parentChild,thisname){//渲染网络图片，不能调节参数
		if(!width) width=0;
		if(!height) height=0;
		if(typeof pictTop!='number'&&!isNaN(parseInt(pictTop+''))){
			pictTop=parseInt(pictTop);
			if(pictTop>100) pictTop=pictTop+'px';
		}
		else if(typeof pictTop=='number'&&pictTop>100) pictTop=pictTop+'px';
		if(typeof pictLeft!='number'&&!isNaN(parseInt(pictLeft+''))){
			pictLeft=parseInt(pictLeft);
			if(pictLeft>100) pictLeft=pictLeft+'px';
		}
		else if(typeof pictLeft=='number'&&pictLeft>100) pictLeft=pictLeft+'px';
		if(typeof width!='number'&&!isNaN(parseInt(width+''))){
			width=parseInt(width);
			if(width>100) width=width+'px';
		}
		else if(typeof width=='number'&&width>100) width=width+'px';
		if(typeof height!='number'&&!isNaN(parseInt(height+''))){
			height=parseInt(height);
			if(height>100) height=height+'px';
		}
		else if(typeof height=='number'&&height>100) height=height+'px';
		if(!parentChild) parentChild=document.body;
		if(!src) src='';
		var div=ui.create.div('');
		if(!pictTop) pictTop='0%';
		if(!pictLeft) pictLeft='0%';
		if(typeof pictTop=='number'||(typeof pictTop=='string'&&(pictTop.indexOf('%')==-1&&pictTop.indexOf('px')==-1))) pictTop=pictTop+'%';
		if(typeof pictLeft=='number'||(typeof pictLeft=='string'&&(pictLeft.indexOf('%')==-1&&pictLeft.indexOf('px')==-1))) pictLeft=pictLeft+'%';
		div.style.top=(pictTop||'0%');
		div.style.left=(pictLeft||'0%');
		if(typeof height=='string'&&height.indexOf('%')!=-1){
			div.style.height=height;
			height=parseInt(height.slice(0,height.indexOf('%')));
		}
		else if(typeof height=='string'&&height.indexOf('px')!=-1){
			div.style.height=height;
			height=parseInt(height.slice(0,height.indexOf('px')));
		}
		else if(typeof height=='string') height=parseInt(height);
		else div.style.height=height+'px';
		if(typeof width=='string'&&width.indexOf('%')!=-1){
			div.style.width=width;
			width=parseInt(width.slice(0,width.indexOf('%')));
		}
		else if(typeof width=='string'&&width.indexOf('px')!=-1){
			div.style.width=width;
			width=parseInt(width.slice(0,width.indexOf('px')));
		}
		else if(typeof width=='string') width=parseInt(width);
		else div.style.width=width+'px';
		window.ykCacheSetImage(src,div,true,"100% 100%");
		if(thisname) {window[thisname]=div;parentChild.appendChild(window[thisname]);}
		else parentChild.appendChild(div);
	}
	game.ykDrawImage=function(pictTop,pictLeft,width,height,src,parentChild,thisname,drawpos1,drawpos2,text,textColor,textSize,textpos1,textpos2){//只能渲染网络静图，可调大小位置
		//pictTop、pictLeft图片位置；width、heigth图片长宽；src图片路径；parentChild父层Child；thisname用于此函数外修改、删除该图片时调用；drawpos1、drawpos2画图起点;text图片文字
		if(!width) width=0;
		if(!height) height=0;
		if(!drawpos1) drawpos1=0;
		if(!drawpos2) drawpos2=0;
		if(!parentChild) parentChild=document.body;
		if(!src) src='';
		var div=ui.create.div('');
		if(!pictTop) pictTop='0%';
		if(!pictLeft) pictLeft='0%';
		if(typeof pictTop=='number'||(typeof pictTop=='string'&&(pictTop.indexOf('%')==-1&&pictTop.indexOf('px')==-1))) pictTop=pictTop+'%';
		if(typeof pictLeft=='number'||(typeof pictLeft=='string'&&(pictLeft.indexOf('%')==-1&&pictLeft.indexOf('px')==-1))) pictLeft=pictLeft+'%';
		div.style.top=(pictTop||'0%');
		div.style.left=(pictLeft||'0%');
		if(typeof height=='string'&&height.indexOf('%')!=-1){
			div.style.height=height;
			height=parseInt(height.slice(0,height.indexOf('%')));
		}
		else if(typeof height=='string'&&height.indexOf('px')!=-1){
			div.style.height=height;
			height=parseInt(height.slice(0,height.indexOf('px')));
		}
		else if(typeof height=='string') height=parseInt(height);
		else div.style.height=height+'px';
		if(typeof width=='string'&&width.indexOf('%')!=-1){
			div.style.width=width;
			width=parseInt(width.slice(0,width.indexOf('%')));
		}
		else if(typeof width=='string'&&width.indexOf('px')!=-1){
			div.style.width=width;
			width=parseInt(width.slice(0,width.indexOf('px')));
		}
		else if(typeof width=='string') width=parseInt(width);
		else div.style.width=width+'px';
		var canvas=document.createElement("canvas");
		var image = new Image();
		canvas.width = width;
		canvas.height = height;
		var ctx = canvas.getContext("2d");
		if(!text) var text = "";
		// canvas上绘制图片，是一个异步函数；
		image.onload = function(){
			ctx.drawImage(image,drawpos1,drawpos2);
			var imgData = canvas.toDataURL();
			ctx.font = (textSize||20)+'px Arial';
			ctx.fillStyle = textColor||"#FF0000";
			ctx.fillText(text,(textpos1||10),(textpos2||66));
			div.appendChild(canvas);
			if(thisname){window[thisname]=div;parentChild.appendChild(window[thisname]);}
			else parentChild.appendChild(div);
		}
		image.src = src;
	}
});
