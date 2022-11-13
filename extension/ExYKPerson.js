'use strict';
window.YKimport(function(lib,game,ui,get,ai,_status){
	//防止反复加载
	/*if(window.ykloadJSON_ExYKPerson) return ;
	window.ykloadJSON_ExYKPerson=true;*/
	game.saydpcq=game.sayyk;
	//缓存图片，离线也加载，需先设置backgroundSize
	window.ykCacheImage=function(imgUrl,div){
		if(imgUrl==undefined) return ;
		if(!lib.config.ykImageCache) game.saveConfig('ykImageCache',{});
		lib.init.req(imgUrl,function(){
			window.URL=window.URL||window.webkitURL;
			var xhr=new XMLHttpRequest();
			xhr.open("get",imgUrl,true);
			xhr.responseType="blob";
			xhr.onload=function(){
				if(this.status==200){
					var blob=this.response;
					lib.config.ykImageCache[imgUrl]=blob;
					let oFileReader=new FileReader();
					oFileReader.readAsDataURL(blob);
					var src=window.URL.createObjectURL(blob);
					lib.config.ykImageCache[imgUrl+'_src']=src;
					if(div){
						if(lib.device!='android'&&lib.device!='ios'){
							div.setBackgroundImage(src);
						}
						else{
							div.style.backgroundImage='url("'+src+'")';
						}
					}
					game.saveConfig('ykImageCache',lib.config.ykImageCache);
				}
			}
			xhr.send(null);
		},function(e){
			if(lib.config.ykImageCache[imgUrl]&&div){
				var blob=lib.config.ykImageCache[imgUrl];
				let oFileReader=new FileReader();
				oFileReader.readAsDataURL(blob);
				var src=window.URL.createObjectURL(blob);
				var image=new Image();
				image.src=src;
				if(div.style.backgroundSize=='cover'){
					div.style.backgroundSize='100% 100%';
				}
				else if(div.style.backgroundSize.indexOf('% ')!=-1){
					image.style.width=div.style.backgroundSize.slice(0,div.style.backgroundSize.indexOf('% '))+'% ';
					image.style.width=div.style.backgroundSize.slice(0,div.style.backgroundSize.indexOf('% '))+'%';
					image.style.height=div.style.backgroundSize.slice(div.style.backgroundSize.indexOf('% ')+2,div.style.backgroundSize.length);
				}
				if(!image.style.width) image.style.width='auto';
				if(!image.style.height) image.style.height='auto';
				div.appendChild(image);
			}
		},true);
	}
	window.ykCacheSetImage=function(imgUrl,div,condition,backgroundSize){//一键设置缓存图片，condition为判断条件，imgUrl两端用单引号
		if(!div||!imgUrl) return ;
		if(condition==undefined) condition=true;
		if(!condition) return ;
		div.style.backgroundSize=(backgroundSize||'100% 100%');
		if(typeof window.ykCacheImage=='function') window.ykCacheImage(imgUrl,div);
		else if(lib.device!='android'&&lib.device!='ios'){
			div.setBackgroundImage(imgUrl);
		}
		else{
			div.style.backgroundImage='url("'+imgUrl+'")';
		}
	}
	window.pre_showPictAnimation=function(URL,PictNum,PictType,parentNode,react){//预加载序列帧
		for(var i=0;i<PictNum;i++){
			if(!lib.config.ykImageCache[URL+i+PictType]){
				window.ykCacheImage(URL+i+PictType);
			}
		};
	}
	window.showPictAnimation=function(URL,PictNum,PictType,parentNode,others){//序列帧动画
		var react=others.react,func=others.func,frequency=others.frequency,zIndex=others.zIndex,bottom=others.bottom,func_arguments=others.func_arguments,turnOverX=others.turnOverX,turnOverY=others.turnOverY;
		if(!PictType) PictType='.png';
		if(!parentNode){
			parentNode=ui.create.div();
			parentNode.style.height='100%';
			parentNode.style.width='100%';
			parentNode.style.top='0px';
			parentNode.style.left='0px';
			document.body.appendChild(parentNode);
		}
		var div=ui.create.div();
		div.style.height='100%';
		div.style.width='100%';
		div.style.top='0px';
		div.style.left='0px';
		if(typeof zIndex=='number') div.style.zIndex=zIndex;
		else if(zIndex=='Before') div.style.zIndex=((parentNode.style.zIndex==undefined?0:parentNode.style.zIndex)+1)*2;//Before显示在parentNode上层
		else if(zIndex=='After') div.style.zIndex=((parentNode.style.zIndex==undefined?0:parentNode.style.zIndex)-1)/2;//After显示在parentNode下层
		parentNode.appendChild(div);
		var canvas=document.createElement("canvas");
		canvas.width=div.offsetWidth;
		canvas.height=div.offsetHeight;
		div.appendChild(canvas);
		var context=canvas.getContext("2d");
		parentNode.context=context;
		var start;
		var imgs=[];
		var imgs_num=0;
		for(var i=1;i<PictNum+1;i++){
			if(lib.config.ykImageCache[URL+i+PictType]){
				var img=new Image();
				var blob=lib.config.ykImageCache[URL+i+PictType];
				let oFileReader=new FileReader();
				oFileReader.readAsDataURL(blob);
				img.src=window.URL.createObjectURL(blob);
				if(i>=PictNum-1) img.yk_final=true;
				img.onload=function(){
					imgs.push(this);
					if(this.yk_final==true) start();
				};
				img.onerror=function(){
					if(this.yk_final==true) start();
				};
			}
			else{
				window.ykCacheImage(URL+i+PictType);
			}
		};
		if(!frequency||typeof frequency!='number') frequency=100;
		start=function(){
			var play=function(){
				if(imgs_num>=imgs.length) return;
				var img=imgs[imgs_num];
				parentNode.context.clearRect(0,0,div.offsetWidth,div.offsetHeight);
				var width,height,scaleW,scaleH;
				scaleW=img.width/div.offsetWidth;
				scaleH=img.height/div.offsetHeight;
				if(scaleW<=1&&scaleH<=1){
					width=img.width;
					height=img.height;
				}
				else if(scaleW>=scaleH){
					width=div.offsetWidth;
					height=div.offsetWidth*img.height/img.width;
				}
				else{
					height=div.offsetHeight;
					width=div.offsetHeight*img.width/img.height;
				}
				if(turnOverX){
					parentNode.style.transform='scaleX(-1)';
				}
				if(turnOverY){
					parentNode.style.transform='scaleY(-1)';
				}
				parentNode.context.drawImage(img,Math.max((div.offsetWidth/2-width/2),0),(bottom==undefined?Math.max((div.offsetHeight/2-height/2),0):(div.offsetHeight-height)),Math.min(width,div.offsetWidth),Math.min(height,div.offsetHeight));
				imgs_num++;
				if(imgs_num>=imgs.length){
					if(this.interval!=undefined&&!react) clearInterval(this.interval);
					else if(!parentNode||!div) clearInterval(this.interval);
					else if(react){
						imgs_num=0;
						setTimeout(start,frequency);
					}
					else{
						parentNode.context.clearRect(0,0,div.offsetWidth,div.offsetHeight);
						div.delete();
						if(func&&typeof func=='function') func(func_arguments);
					}
				};
			};
			if(!start.interval) start.interval=setInterval(play,frequency);
		};
	}
	lib.qxq_yk_bossList=['qxq_yk_tian'];
	if(!lib.config.qxq_YK_person||lib.config.qxq_YK_person==undefined) lib.config.qxq_YK_person={};
	lib.config.qxq_YK_person.rank={
		"qxq_yk_akalai":"<font color=purple>地级</font>",
		"qxq_yk_dijunxuanpin":"<font color=orange>天级</font>",
		"qxq_yk_fuling":"<font color=cyan>玄级</font>",
		"qxq_yk_xiaoqiao":"<body><samp id='超稀-限定'>超稀-限定</samp></body><style>#超稀-限定{animation:change 7s linear 0s infinite;}@keyframes change{0% {color:#FF0000;}10%{color:#FF7F00;}20%{color: #FFFF00;}30%{color:#00FF00;}40% {color:#00FFFF;}50%{color: #0000FF;}60%{color: #8B00FF;}70%{color: #0000FF;}75%{color: #00FFFF ;}80%{color:#00FF00;}85%{color:#FFFF00 ;}90%{color:  #FF7F00;}100%{color: #FF0000;}}</style>",
		"qxq_yk_kongshanyaoyun":"<body><samp id='超稀-限定'>超稀-限定</samp></body><style>#超稀-限定{animation:change 7s linear 0s infinite;}@keyframes change{0% {color:#FF0000;}10%{color:#FF7F00;}20%{color: #FFFF00;}30%{color:#00FF00;}40% {color:#00FFFF;}50%{color: #0000FF;}60%{color: #8B00FF;}70%{color: #0000FF;}75%{color: #00FFFF ;}80%{color:#00FF00;}85%{color:#FFFF00 ;}90%{color:  #FF7F00;}100%{color: #FF0000;}}</style>",
		"qxq_yk_kongshanlingxue":"<body><samp id='超稀-限定'>超稀-限定</samp></body><style>#超稀-限定{animation:change 7s linear 0s infinite;}@keyframes change{0% {color:#FF0000;}10%{color:#FF7F00;}20%{color: #FFFF00;}30%{color:#00FF00;}40% {color:#00FFFF;}50%{color: #0000FF;}60%{color: #8B00FF;}70%{color: #0000FF;}75%{color: #00FFFF ;}80%{color:#00FF00;}85%{color:#FFFF00 ;}90%{color:  #FF7F00;}100%{color: #FF0000;}}</style>",
		"qxq_yk_wuwangxuanyue":"<body><samp id='超稀-限定'>超稀-限定</samp></body><style>#超稀-限定{animation:change 7s linear 0s infinite;}@keyframes change{0% {color:#FF0000;}10%{color:#FF7F00;}20%{color: #FFFF00;}30%{color:#00FF00;}40% {color:#00FFFF;}50%{color: #0000FF;}60%{color: #8B00FF;}70%{color: #0000FF;}75%{color: #00FFFF ;}80%{color:#00FF00;}85%{color:#FFFF00 ;}90%{color:  #FF7F00;}100%{color: #FF0000;}}</style>",
		"qxq_yk_tiandaozhiying":"<body><samp id='超稀-限定'>超稀-限定</samp></body><style>#超稀-限定{animation:change 7s linear 0s infinite;}@keyframes change{0% {color:#FF0000;}10%{color:#FF7F00;}20%{color: #FFFF00;}30%{color:#00FF00;}40% {color:#00FFFF;}50%{color: #0000FF;}60%{color: #8B00FF;}70%{color: #0000FF;}75%{color: #00FFFF ;}80%{color:#00FF00;}85%{color:#FFFF00 ;}90%{color:  #FF7F00;}100%{color: #FF0000;}}</style>",
		"qxq_yk_yanmengyuejian":"<body><samp id='超稀-限定'>超稀-限定</samp></body><style>#超稀-限定{animation:change 7s linear 0s infinite;}@keyframes change{0% {color:#FF0000;}10%{color:#FF7F00;}20%{color: #FFFF00;}30%{color:#00FF00;}40% {color:#00FFFF;}50%{color: #0000FF;}60%{color: #8B00FF;}70%{color: #0000FF;}75%{color: #00FFFF ;}80%{color:#00FF00;}85%{color:#FFFF00 ;}90%{color:  #FF7F00;}100%{color: #FF0000;}}</style>",
		"qxq_yk_yunying":"<body><samp id='超稀-限定'>超稀-限定</samp></body><style>#超稀-限定{animation:change 7s linear 0s infinite;}@keyframes change{0% {color:#FF0000;}10%{color:#FF7F00;}20%{color: #FFFF00;}30%{color:#00FF00;}40% {color:#00FFFF;}50%{color: #0000FF;}60%{color: #8B00FF;}70%{color: #0000FF;}75%{color: #00FFFF ;}80%{color:#00FF00;}85%{color:#FFFF00 ;}90%{color:  #FF7F00;}100%{color: #FF0000;}}</style>",
		"qxq_yk_mingyun":"<body><samp id='超稀-限定'>超稀-限定</samp></body><style>#超稀-限定{animation:change 7s linear 0s infinite;}@keyframes change{0% {color:#FF0000;}10%{color:#FF7F00;}20%{color: #FFFF00;}30%{color:#00FF00;}40% {color:#00FFFF;}50%{color: #0000FF;}60%{color: #8B00FF;}70%{color: #0000FF;}75%{color: #00FFFF ;}80%{color:#00FF00;}85%{color:#FFFF00 ;}90%{color:  #FF7F00;}100%{color: #FF0000;}}</style>",
		"qxq_yk_zhixu":"<body><samp id='超稀-限定'>超稀-限定</samp></body><style>#超稀-限定{animation:change 7s linear 0s infinite;}@keyframes change{0% {color:#FF0000;}10%{color:#FF7F00;}20%{color: #FFFF00;}30%{color:#00FF00;}40% {color:#00FFFF;}50%{color: #0000FF;}60%{color: #8B00FF;}70%{color: #0000FF;}75%{color: #00FFFF ;}80%{color:#00FF00;}85%{color:#FFFF00 ;}90%{color:  #FF7F00;}100%{color: #FF0000;}}</style>",
		"qxq_yk_yunling":"<font color=orange>天级</font>",
	}
	lib.config.qxq_YK_person.birthday={
		"qxq_yk_akalai":"1/11",
		"qxq_yk_dijunxuanpin":"9/23",
		"qxq_yk_fuling":"4/22",
		"qxq_yk_xiaoqiao":"NaN/NaN",
		"qxq_yk_kongshanyaoyun":"6/9",
		"qxq_yk_kongshanlingxue":"6/9",
		"qxq_yk_wuwangxuanyue":"9/16",
		"qxq_yk_tiandaozhiying":"12/12",
		"qxq_yk_yanmengyuejian":"12/12",
		"qxq_yk_yunling":"3/25",
		"qxq_yk_yunying":"2/29",
		"qxq_yk_mingyun":"8/22",
		"qxq_yk_zhixu":"8/22",
	}
	//设置非BOSS人物基础属性值：法力、气力、真气、元力
	lib.config.qxq_YK_person.nature={
		Mp:{//基础术法值-------用于发动一般性技能：凡级<100，100<=黄级<200，200<=玄级<400，400<=地级<600，600<=天级<800，800<=超稀-限定
			"qxq_yk_akalai":510,
			"qxq_yk_dijunxuanpin":800,
			"qxq_yk_fuling":320,
			"qxq_yk_xiaoqiao":880,
			"qxq_yk_kongshanyaoyun":1080,
			"qxq_yk_kongshanlingxue":800,
			"qxq_yk_wuwangxuanyue":1000,
			"qxq_yk_tiandaozhiying":1200,
			"qxq_yk_yanmengyuejian":1150,
			"qxq_yk_yunling":820,
			"qxq_yk_yunying":880,
			"qxq_yk_mingyun":1180,
			"qxq_yk_zhixu":1180,
		},
		Strength:{//基础气力值---------用于发动身法类技能：凡级<50，50<=黄级<80，80<=玄级<120，120<=地级<180，180<=天级，220<=超稀-限定
			"qxq_yk_akalai":160,
			"qxq_yk_dijunxuanpin":320,
			"qxq_yk_fuling":80,
			"qxq_yk_xiaoqiao":280,
			"qxq_yk_kongshanyaoyun":300,
			"qxq_yk_kongshanlingxue":260,
			"qxq_yk_wuwangxuanyue":350,
			"qxq_yk_tiandaozhiying":300,
			"qxq_yk_yanmengyuejian":300,
			"qxq_yk_yunling":320,
			"qxq_yk_yunying":260,
			"qxq_yk_mingyun":300,
			"qxq_yk_zhixu":300,
		},
		Defend:{//基础真气值----------真气较高时减少所受伤害，空真气时受到伤害增加。凡级<200，200<=黄级<400，400<=玄级<600，600<=地级<800，800<=天级<1000，1000<=超稀-限定
			"qxq_yk_akalai":660,
			"qxq_yk_dijunxuanpin":940,
			"qxq_yk_fuling":480,
			"qxq_yk_xiaoqiao":1080,
			"qxq_yk_kongshanyaoyun":1100,
			"qxq_yk_kongshanlingxue":980,
			"qxq_yk_wuwangxuanyue":1150,
			"qxq_yk_tiandaozhiying":1150,
			"qxq_yk_yanmengyuejian":1150,
			"qxq_yk_yunling":950,
			"qxq_yk_yunying":920,
			"qxq_yk_mingyun":1100,
			"qxq_yk_zhixu":1100,
		},
		Soul:{//基础元力值------------用于发动特殊类技能
			"qxq_yk_xiaoqiao":360,
			"qxq_yk_yanmengyuejian":500,
			"qxq_yk_kongshanlingxue":550,
			"qxq_yk_tiandaozhiying":200,
			"qxq_yk_kongshanyaoyun":480,
		},
	}
	if(!lib.config.YKcharacterNameList){lib.config.YKcharacterNameList=[];game.saveConfig('YKcharacterNameList',lib.config.YKcharacterNameList);}//格式"xxx-sex-hp-skill"
	if(!lib.config.qxq_YK_person.score||lib.config.qxq_YK_person.score==undefined) lib.config.qxq_YK_person.score={};
	if(!lib.config.qxq_YK_person.friendness||lib.config.qxq_YK_person.friendness==undefined) lib.config.qxq_YK_person.friendness={};
	for(var i=0;i<lib.config.YKcharacterNameList.length;i++){
		var character=lib.config.YKcharacterNameList[i];
		var name=character.slice(0,character.indexOf('-'));
		if(!lib.config.qxq_YK_person.friendness[name]||lib.config.qxq_YK_person.friendness[name]==undefined){lib.config.qxq_YK_person.friendness[name]=0;game.saveConfig('qxq_YK_person',lib.config.qxq_YK_person);}
	}
	game.saveConfig('qxq_YK_person',lib.config.qxq_YK_person);
	window.qxq_YK_personWeaponType={
		"qxq_yk_akalai":["sword2","sword1","sword0"],
		"qxq_yk_dijunxuanpin":["sword2","sword1","sword0"],
		"qxq_yk_fuling":["magic","swordx"],
		"qxq_yk_xiaoqiao":["sword1","sword0"],
		"qxq_yk_kongshanyaoyun":["sword1","sword0"],
		"qxq_yk_kongshanlingxue":["sword1","sword0"],
		"qxq_yk_wuwangxuanyue":["sword1","sword2","knife"],
		"qxq_yk_tiandaozhiying":["sword0","sword1","magic"],
		"qxq_yk_yanmengyuejian":["sword1","sword0"],
		"qxq_yk_yunling":["spear","knife"],
		"qxq_yk_yunying":["sword1","sword0","swordx"],
		"qxq_yk_mingyun":["magic","knife"],
		"qxq_yk_zhixu":["magic","special"],
	}
	window.qxq_YK_personBookType={
		"qxq_yk_akalai":["yk_light"],
		"qxq_yk_dijunxuanpin":["yk_fire","yk_light"],
		"qxq_yk_fuling":["yk_wind","yk_water","yk_wood"],
		"qxq_yk_xiaoqiao":["yk_soul","yk_water","yk_dark","yk_ice"],
		"qxq_yk_kongshanyaoyun":["yk_soul","yk_water","yk_dark","yk_ice"],
		"qxq_yk_kongshanlingxue":["yk_soul","yk_water","yk_dark","yk_ice"],
		"qxq_yk_wuwangxuanyue":["yk_light","yk_fire","yk_thunder"],
		"qxq_yk_tiandaozhiying":["yk_soul","yk_light","yk_dark"],
		"qxq_yk_yanmengyuejian":["yk_soul","yk_water","yk_dark","yk_ice"],
		"qxq_yk_yunling":["yk_wind","yk_water","yk_ice"],
		"qxq_yk_yunying":["yk_wind","yk_water","yk_ice"],
		"qxq_yk_mingyun":["yk_light","yk_dark"],
		"qxq_yk_zhixu":["yk_thunder","yk_dark"],
	}
	window.qxq_YK_gainPath={//获取方式
		"qxq_yk_akalai":"①抽卡获得",
		"qxq_yk_dijunxuanpin":"",
		"qxq_yk_fuling":"①2022/01/31-2022/04/15，通关【宗师】或【绝境】难度的副本【缇傀】获得。<br>②抽卡获得",
		"qxq_yk_xiaoqiao":"①2022/01/31-2022/02/01，限时兑换。<br>②2022/01/31-2022/02/07，通关【梦魇】或【神话】难度的副本【缇傀】获得。<br>③抽卡获得",
		"qxq_yk_kongshanyaoyun":"",
		"qxq_yk_kongshanlingxue":"①2022/03/31-2022/05/31，限时兑换。<br>②抽卡获得",
		"qxq_yk_wuwangxuanyue":"①2022/04/17-2022/05/31，通关【梦魇】或【神话】难度的副本【破坏神】获得。<br>②抽卡获得",
		"qxq_yk_tiandaozhiying":"",
		"qxq_yk_yanmengyuejian":"①2022/01/31-2022/02/01，限时兑换。<br>②2022/01/31-2022/02/07，通关【梦魇】或【神话】难度的副本【缇傀】获得。<br>③抽卡获得",
		"qxq_yk_yunling":"",
		"qxq_yk_yunying":"",
		"qxq_yk_mingyun":"①抽卡获得",
		"qxq_yk_zhixu":"",
	}
	//人物基础属性显示
	window.ykNatureIntroduction=function(type){
		if(!type||['Mp','Strength','Defend','Soul'].indexOf(type)==-1) return ;
		if(type=='Mp') alert('术法值：常规技能消耗术法值，术法值可随回合数自然回复，或使用某些特定技能/卡牌快速回复。');
		if(type=='Strength') alert('气力值：气力值用于发动身法类技能，可随回合数自然回复，或使用某些特定技能快速回复，回合内未使用任何卡牌时，大幅回复气力值。');
		if(type=='Defend') alert('真气值：真气值较高时有概率减少所受伤害，每次受到伤害时均会减少真气值，真气值为空时，所受伤害增加，真气值为空后，于一定回合数后自然回复至满值，某些技能可快速回复真气值和快速削减敌方真气值。');
		if(type=='Soul') alert('元力值：用于发动一些特殊类技能，当回合内未使用“杀”时回复元力值，未使用任何卡牌时，大幅回复元力值。');
	}
	lib.element.player.showMarkIntro=function(num1,num2,num3,numx,bool){
		var player=this;
		if(!bool&&lib.config.qxq_YK_person.nature.Mp[player.name]==undefined&&lib.config.qxq_YK_person.nature.Strength[player.name]==undefined&&lib.config.qxq_YK_person.nature.Defend[player.name]==undefined&&lib.config.qxq_YK_person.nature.Soul[player.name]==undefined){return ;}
		if(!player.ykHasMarkInfo){player.ykHasMarkInfo=true;Object.freeze(player.ykHasMarkInfo);}
		else return ;
		if(window.ykMarkIntroBackground==undefined){
			window.ykMarkIntroBackground=ui.create.div('hidden',document.body);
			window.ykMarkIntroBackground.style['text-align']='left';
			window.ykMarkIntroBackground.style.height='calc(20%)';
			window.ykMarkIntroBackground.style.width='calc(40%)';
			window.ykMarkIntroBackground.style.left='calc(30%)';
			window.ykMarkIntroBackground.style.top='calc(0%)';
			window.ykMarkIntroBackground.style['z-index']=750;
			window.ykMarkIntroBackground.style.backgroundColor='black';
			window.ykMarkIntroBackground.style.opacity=0.15;
			window.ykMarkIntroBackground.innerHTML='<font color=white>人物数值：</font>';
			window.ykMarkIntroBackground.style['overflow-y']='scroll';
			lib.setScroll(window.ykMarkIntroBackground);
			game.mouseDiv=function(div){
				if(lib.device==undefined){
					div.onmouseover=function(){
						this.style.opacity=0.75;
					};
					div.onmouseout=function(){
						this.style.opacity=0.15;
					};
				}
				else{
					div.onclick=function(){
						if(div.style.opacity==0.15) this.style.opacity=0.75;
						else this.style.opacity=0.15;
					}
				}
			}
			game.mouseDiv(window.ykMarkIntroBackground);
			window.ykMarkIntroChangeIt=function(){
				if(window.ykMarkIntroBackgroundreshow==null){
					window.ykMarkIntroBackground.hide();
					window.ykMarkIntroBackgroundreshow=ui.create.div('hidden',document.body);
					window.ykMarkIntroBackgroundreshow.style['text-align']='left';
					window.ykMarkIntroBackgroundreshow.style.height='20px';
					window.ykMarkIntroBackgroundreshow.style.width='calc(40%)';
					window.ykMarkIntroBackgroundreshow.style.left='calc(30%)';
					window.ykMarkIntroBackgroundreshow.style.top='calc(0%)';
					window.ykMarkIntroBackgroundreshow.style['z-index']=750;
					window.ykMarkIntroBackgroundreshow.style.backgroundColor='black';
					window.ykMarkIntroBackgroundreshow.style.opacity=0.15;
					window.ykMarkIntroChange=ui.create.div('hidden',window.ykMarkIntroBackgroundreshow,window.ykMarkIntroChangeIt);
					window.ykMarkIntroChange.style['text-align']='right';
					window.ykMarkIntroChange.style.height='calc(10%)';
					window.ykMarkIntroChange.style.width='calc(30%)';
					window.ykMarkIntroChange.style.left='calc(70%)';
					window.ykMarkIntroChange.style.top='calc(0%)';
					window.ykMarkIntroChange.innerHTML='<font color=white>显示此界面</font>';
					game.mouseDiv(window.ykMarkIntroBackgroundreshow);
				}
				else{
					window.ykMarkIntroBackgroundreshow.delete();
					delete window.ykMarkIntroBackgroundreshow;
					window.ykMarkIntroBackgroundreshow=null;
					window.ykMarkIntroBackground.show();
				}
			}
			window.ykMarkIntroChange=ui.create.div('hidden',window.ykMarkIntroBackground,window.ykMarkIntroChangeIt);
			window.ykMarkIntroChange.style['text-align']='right';
			window.ykMarkIntroChange.style.height='calc(10%)';
			window.ykMarkIntroChange.style.width='calc(30%)';
			window.ykMarkIntroChange.style.left='calc(70%)';
			window.ykMarkIntroChange.style.top='calc(0%)';
			window.ykMarkIntroChange.innerHTML='<font color=white>隐藏此界面</font>';
			window.yk_clickFK(window.ykMarkIntroChange);
		}
		if(!player.node.allMarkIntroduce){
			player.node.name=ui.create.div('hidden',window.ykMarkIntroBackground);
			player.node.name.innerHTML='<font color=orange>'+(get.translation(player.name)||player.name)+((player==game.boss&&game.boss!=undefined)?'【魁首】':'')+(player==game.me?'（我）':'')+'</font>';
			player.node.name.style['text-align']='left';
			player.node.name.style.height='calc(10%)';
			player.node.name.style.width='calc(100%)';
			player.node.name.style.left='calc(0%)';
			player.node.name.style.top='calc(10%)';
			player.node.name.style.position='relative';
			player.node.allMarkIntroduce=ui.create.div('hidden',window.ykMarkIntroBackground);
			player.node.allMarkIntroduce.style['text-align']='left';
			player.node.allMarkIntroduce.style.height='calc(90%)';
			player.node.allMarkIntroduce.style.width='calc(100%)';
			player.node.allMarkIntroduce.style.left='calc(0%)';
			player.node.allMarkIntroduce.style.top='calc(10%)';
			player.node.allMarkIntroduce.style.position='relative';
			var pict=player.node.avatar.style['background-image'];
			var l=pict.length-1;
			var path=pict.slice(5,l-1);
			player.node.pict = ui.create.node('img',player.node.allMarkIntroduce);
			player.node.pict.style.cssText ='position: relative;opacity: 1;';
			player.node.pict.style.top='0%';
			player.node.pict.style.left='0%';
			player.node.pict.style.height=player.node.allMarkIntroduce.offsetHeight+'px';
			player.node.pict.style.width=player.node.allMarkIntroduce.offsetWidth*0.25*(path.width/path.height)+'px';
			player.node.pict.src=(path||(lib.assetURL+path));
		}
		
		//特殊：精神力/元力----紫色
		var s=(lib.config.qxq_YK_person.nature.Soul[player.name]||0);
		if(typeof s=='string'&&s.indexOf('/')!=-1){
			s1=parseInt(s.slice(0,s.indexOf('/')));
			s2=parseInt(s.slice(s.indexOf('/')+1,s.length));
		}
		else{
			s=parseInt(''+s);
			if(isNaN(s)) var s=0;
		}
		var numx=parseInt(''+numx);
		var numx=(isNaN(numx)?s:numx);
		if((!player.isMin()||player.forcemin)&&numx!=0){
			if(!player.ykSoul&&!player.ykMaxSoul){
				if((!player.ykMaxSoul||player.ykMaxSoul==undefined)&&numx!=undefined){player.ykSoul=player.ykMaxSoul=parseInt(''+numx);}
				else if((numx==undefined||!numx)&&s1!=undefined&&s2!=undefined){player.ykSoul=s1;player.ykMaxSoul=s2;}
				else{player.ykSoul=player.ykMaxSoul=0;}
			}
			if(!player.node.ykSoul){
				player.node.ykSoul=ui.create.div('',player.node.allMarkIntroduce);
				player.node.ykSoul.style.cssText ="left:25%;height:8px;width:75%;top:104px;background:purple;transition:all 1.5s;transform:scaleX(-1);animation:yksoul 1.5s linear infinite;";
				player.node.ykSoul.style.opacity=0.7;
			}
			if(!player.node.ykSoulText){
				player.node.ykSoulText=ui.create.div('',player.node.allMarkIntroduce);
				player.node.ykSoulText.innerHTML='<font color=purple>元：'+player.ykSoul+'/'+player.ykMaxSoul+'</font>';
				player.node.ykSoulText.style.cssText ="left:25%;height:20px;width:200px;top:84px;transition:all 1.5s;z-index:9999;";
				player.node.ykSoulText.style['text-align']='left';
			}
		}
		//道力值/法力值/术法值----蓝色
		if(lib.config.qxq_YK_person.rank[player.name]&&lib.config.qxq_YK_person.rank[player.name].indexOf('超稀-限定')!=-1) var rMp=1000;
		if(lib.config.qxq_YK_person.rank[player.name]&&lib.config.qxq_YK_person.rank[player.name].indexOf('天级')!=-1) var rMp=800;
		if(lib.config.qxq_YK_person.rank[player.name]&&lib.config.qxq_YK_person.rank[player.name].indexOf('地级')!=-1) var rMp=600;
		if(lib.config.qxq_YK_person.rank[player.name]&&lib.config.qxq_YK_person.rank[player.name].indexOf('玄级')!=-1) var rMp=400;
		if(lib.config.qxq_YK_person.rank[player.name]&&lib.config.qxq_YK_person.rank[player.name].indexOf('黄级')!=-1) var rMp=200;
		if(lib.config.qxq_YK_person.rank[player.name]&&lib.config.qxq_YK_person.rank[player.name].indexOf('凡级')!=-1) var rMp=100;
		var m=(lib.config.qxq_YK_person.nature.Mp[player.name]||rMp);
		if(typeof m=='string'&&m.indexOf('/')!=-1){
			m1=parseInt(m.slice(0,m.indexOf('/')));
			m2=parseInt(m.slice(m.indexOf('/')+1,m.length));
		}
		else{
			m=parseInt(''+m);
			if(isNaN(m)) m=0;
		}
		var num1=parseInt(''+num1);
		var num1=(isNaN(num1)?m:num1);
		if((!player.isMin()||player.forcemin)&&num1!=0){
			if(!player.ykMp&&!player.ykMaxMp){
				if((!player.ykMaxMp||player.ykMaxMp==undefined)&&num1!=undefined){player.ykMp=player.ykMaxMp=parseInt(''+num1);}
				else if((num1==undefined||!num1)&&m1!=undefined&&m2!=undefined){player.ykMp=m1;player.ykMaxMp=m2;}
				else{player.ykMp=player.ykMaxMp=0;}
			}
			if(!player.node.ykMp){
				player.node.ykMp=ui.create.div('',player.node.allMarkIntroduce);
				player.node.ykMp.style.cssText ="left:25%;height:8px;width:75%;top:20px;background:cyan;transition:all 1.5s;transform:scaleX(-1);animation:ykmp 1.5s linear infinite;";
				player.node.ykMp.style.opacity=0.7;
			}
			if(!player.node.ykMpText){
				player.node.ykMpText=ui.create.div('',player.node.allMarkIntroduce);
				player.node.ykMpText.innerHTML='<font color=cyan>法：'+player.ykMp+'/'+player.ykMaxMp+'</font>';
				player.node.ykMpText.style.cssText ="left:25%;height:20px;width:200px;top:0px;transition:all 1.5s;z-index:9999;";
				player.node.ykMpText.style['text-align']='left';
			}
		}
		//气力值------白色
		if(lib.config.qxq_YK_person.rank[player.name]&&lib.config.qxq_YK_person.rank[player.name].indexOf('超稀-限定')!=-1) var rS=300;
		if(lib.config.qxq_YK_person.rank[player.name]&&lib.config.qxq_YK_person.rank[player.name].indexOf('天级')!=-1) var rS=240;
		if(lib.config.qxq_YK_person.rank[player.name]&&lib.config.qxq_YK_person.rank[player.name].indexOf('地级')!=-1) var rS=180;
		if(lib.config.qxq_YK_person.rank[player.name]&&lib.config.qxq_YK_person.rank[player.name].indexOf('玄级')!=-1) var rS=120;
		if(lib.config.qxq_YK_person.rank[player.name]&&lib.config.qxq_YK_person.rank[player.name].indexOf('黄级')!=-1) var rS=60;
		if(lib.config.qxq_YK_person.rank[player.name]&&lib.config.qxq_YK_person.rank[player.name].indexOf('凡级')!=-1) var rS=30;
		var S=(lib.config.qxq_YK_person.nature.Strength[player.name]||rS);
		if(typeof S=='string'&&S.indexOf('/')!=-1){
			S1=parseInt(S.slice(0,S.indexOf('/')));
			S2=parseInt(S.slice(S.indexOf('/')+1,S.length));
		}
		else{
			S=parseInt(''+S);
			if(isNaN(S)) S=0;
		}
		var num2=parseInt(''+num2);
		var num2=(isNaN(num2)?S:num2);
		if((!player.isMin()||player.forcemin)&&num2!=0){
			if(!player.ykStrength&&!player.ykMaxStrength){
				if((!player.ykMaxStrength||player.ykMaxStrength==undefined)&&num1!=undefined){player.ykStrength=player.ykMaxStrength=parseInt(''+num2);}
				else if((num2==undefined||!num2)&&S1!=undefined&&S2!=undefined){player.ykStrength=S1;player.ykMaxStrength=S2;}
				else{player.ykStrength=player.ykMaxStrength=0;}
			}
			if(!player.node.ykStrength){
				player.node.ykStrength=ui.create.div('',player.node.allMarkIntroduce);
				if(!player.node.ykMaxSoul) player.node.ykStrength.style.cssText ="left:25%;height:8px;width:75%;top:48px;background:yellow;transition:all 1.5s;transform:scaleX(-1);animation:ykstrength 1.5s linear infinite;";
				else player.node.ykStrength.style.cssText ="left:50%;height:8px;width:50%;bottom:0%;background:yellow;transition:all 1.5s;transform:scaleX(-1);animation:ykstrength 1.5s linear infinite;";
				player.node.ykStrength.style.opacity=0.7;
			}
			if(!player.node.ykStrengthText){
				player.node.ykStrengthText=ui.create.div('',player.node.allMarkIntroduce);
				player.node.ykStrengthText.innerHTML='<font color=yellow>气：'+player.ykStrength+'/'+player.ykMaxStrength+'</font>';
				player.node.ykStrengthText.style.cssText ="left:25%;height:20px;width:200px;top:28px;transition:all 1.5s;z-index:9999;";
				player.node.ykStrengthText.style['text-align']='left';
			}
		}
		//真气值/罡气值------------灰色
		if(lib.config.qxq_YK_person.rank[player.name]&&lib.config.qxq_YK_person.rank[player.name].indexOf('超稀-限定')!=-1) var rD=1100;
		if(lib.config.qxq_YK_person.rank[player.name]&&lib.config.qxq_YK_person.rank[player.name].indexOf('天级')!=-1) var rD=900;
		if(lib.config.qxq_YK_person.rank[player.name]&&lib.config.qxq_YK_person.rank[player.name].indexOf('地级')!=-1) var rD=700;
		if(lib.config.qxq_YK_person.rank[player.name]&&lib.config.qxq_YK_person.rank[player.name].indexOf('玄级')!=-1) var rD=500;
		if(lib.config.qxq_YK_person.rank[player.name]&&lib.config.qxq_YK_person.rank[player.name].indexOf('黄级')!=-1) var rD=300;
		if(lib.config.qxq_YK_person.rank[player.name]&&lib.config.qxq_YK_person.rank[player.name].indexOf('凡级')!=-1) var rD=100;
		var d=(lib.config.qxq_YK_person.nature.Defend[player.name]||rD);
		if(typeof d=='string'&&d.indexOf('/')!=-1){
			d1=parseInt(d.slice(0,d.indexOf('/')));
			d2=parseInt(d.slice(d.indexOf('/')+1,d.length));
		}
		else{
			d=parseInt(''+d);
			if(isNaN(d)) d=0;
		}
		var num3=parseInt(''+num3);
		var num3=(isNaN(num3)?d:num3);
		if((!player.isMin()||player.forcemin)&&num3!=0){
			if(!player.ykDefend&&!player.ykMaxDefend){
				if((!player.ykMaxDefend||player.ykMaxDefend==undefined)&&num1!=undefined){player.ykDefend=player.ykMaxDefend=parseInt(''+num3);}
				else if((num3==undefined||!num3)&&S1!=undefined&&S2!=undefined){player.ykDefend=S1;player.ykMaxDefend=S2;}
				else{player.ykDefend=player.ykMaxDefend=0;}
			}
			if(!player.node.ykDefend){
				player.node.ykDefend=ui.create.div('',player.node.allMarkIntroduce);
				player.node.ykDefend.style.cssText ="left:25%;height:8px;width:75%;top:76px;background:grey;transition:all 1.5s;transform:scaleX(-1);animation:ykdefend 1.5s linear infinite;";
				player.node.ykDefend.style.opacity=0.7;
			}
			if(!player.node.ykDefendText){
				player.node.ykDefendText=ui.create.div('',player.node.allMarkIntroduce);
				player.node.ykDefendText.innerHTML='<font color=grey>真气：'+player.ykDefend+'/'+player.ykMaxDefend+'</font>';
				player.node.ykDefendText.style.cssText ="left:25%;height:20px;width:200px;top:56px;transition:all 1.5s;z-index:9999;";
				player.node.ykDefendText.style['text-align']='left';
			}
		}
	}
	lib.element.player.ykGetMaxType=function(type){
		var player=this;
		return (player['ykMax'+type]||0);
	}
	lib.element.player.ykGetType=function(type){
		var player=this;
		return (player['yk'+type]||0);
	}
	lib.element.player.ykCheckConsume=function(type,SkillConsume,bool){
		var player=this;
		if(player['yk'+type]==undefined) return false;
		if(!type||['Mp','Strength','Defend','Soul'].indexOf(type)==-1) return ;
		if(typeof player!='object'){var SkillConsume=player;var player=game.players.randomGet();}
		if(!SkillConsume||typeof SkillConsume!='number'||isNaN(SkillConsume)||SkillConsume<=0){var SkillConsume=1;}
		var num = SkillConsume;
		if(num>player['yk'+type]&&!bool) return false;
		else{return true;}
	}
	lib.element.player.ykCheckConsume=function(type,SkillConsume,bool){
		var player=this;
		if(player['yk'+type]==undefined) return false;
		if(!type||['Mp','Strength','Defend','Soul'].indexOf(type)==-1) return ;
		if(typeof player!='object'){var SkillConsume=player;var player=game.players.randomGet();}
		if(!SkillConsume||typeof SkillConsume!='number'||isNaN(SkillConsume)||SkillConsume<=0){var SkillConsume=1;}
		var num = SkillConsume;
		if(num>player['yk'+type]&&!bool) return false;
		else{return true;}
	}
	lib.element.player.ykConsume=function(type,SkillConsume,bool){//bool等于true时可强制消耗，否则不消耗
		var player=this;
		if(!type||['Mp','Strength','Defend','Soul'].indexOf(type)==-1) return ;
		if(typeof player!='object'){var SkillConsume=player;var player=game.players.randomGet();}
		if(!SkillConsume||typeof SkillConsume!='number'||isNaN(SkillConsume)||SkillConsume<=0){var SkillConsume=1;}
		var num = SkillConsume;
		lib.element.content[(['Mp','Strength','Soul'].indexOf(type)!=-1?'consume':'lose')+type] = function(){
			'step 0'
			if(!event.num||event.num==0||!event.type||event.type==undefined||player['yk'+event.type]==undefined||player['yk'+event.type]<0){
				event.finish();
			}
			'step 1'
			var type=event.type;
			var bool=event.bool;
			var player=event.player;
			var SkillConsume=num=event.num;
			game.broadcastAll(function(player,type,bool,SkillConsume,num){
			if(typeof player['yk'+type]!='number'||isNaN(player['yk'+type])) return ;
			if(player.node['yk'+type]==undefined||player['yk'+type]==undefined||player['yk'+type]<=0) return ;
			if(num>player['yk'+type]) num=player['yk'+type];
			player['yk'+type]-=num;
			player.node['yk'+type].style.width=75*(player['yk'+type]/player['ykMax'+type])+'%';
			if(type=='Mp') player.node['yk'+type+'Text'].innerHTML='<font color=cyan>法：'+player['yk'+type]+'/'+player['ykMax'+type]+'</font>';
			if(type=='Strength') player.node['yk'+type+'Text'].innerHTML='<font color=yellow>气：'+player['yk'+type]+'/'+player['ykMax'+type]+'</font>';
			if(type=='Defend') player.node['yk'+type+'Text'].innerHTML='<font color=grey>真气：'+player['yk'+type]+'/'+player['ykMax'+type]+'</font>';
			if(type=='Soul') player.node['yk'+type+'Text'].innerHTML='<font color=purple>元：'+player['yk'+type]+'/'+player['ykMax'+type]+'</font>';
			if(type&&type=='Mp') game.log(player,"消耗了<font color=cyan>",num,"</font>点<font color=cyan>术法值</font>。");
			if(type&&type=='Strength') game.log(player,"消耗了<font color=yellow>",num,"</font>点<font color=yellow>气力值</font>。");
			if(type&&type=='Defend') game.log(player,"损失了<font color=grey>",num,"</font>点<font color=grey>真气值</font>。");
			if(type&&type=='Soul') game.log(player,"消耗了<font color=purple>",num,"</font>点<font color=purple>元力值</font>。");
			if(player.ykDefend<=0){player.ykDefend=0;player.ykRecoverDefendRound=3;}
			},player,type,bool,SkillConsume,num);
			'step 2'
			event.result = {
				num:event.num,
				bool:event.num > 0
			};
		};
		var next = game.createEvent((['Mp','Strength','Soul'].indexOf(type)!=-1?'consume':'lose')+type);
		next.setContent((['Mp','Strength','Soul'].indexOf(type)!=-1?'consume':'lose')+type);
		next.set('player',player);
		next.set('num',num);
		next.set('type',type);
		next.set('bool',(bool||false));
		return next;
	}
	lib.element.player.ykRecover=function(type,SkillRecover){
		var player=this;
		if(!type||['Mp','Strength','Defend','Soul'].indexOf(type)==-1) return ;
		if(typeof player!='object'){var SkillRecover=player;var player=game.players.randomGet();}
		if(!SkillRecover||typeof SkillRecover!='number'||isNaN(SkillRecover)||SkillRecover<=0){var SkillRecover=1;}
		var num = SkillRecover;
		lib.element.content[(['Mp','Strength','Soul'].indexOf(type)!=-1?'recover':'gain')+type] = function(){
			'step 0'
			if(!event.num||event.num==0||!event.type||event.type==undefined||player['yk'+event.type]==undefined||player['yk'+event.type]<0){
				event.finish();
			}
			'step 1'
			var type=event.type;
			var bool=event.bool;
			var player=event.player;
			var SkillRecover=num=event.num;
			game.broadcastAll(function(player,type,bool,SkillRecover,num){
			if(typeof player['yk'+type]!='number'||isNaN(player['yk'+type])) return ;
			if(player.node['yk'+type]==undefined||player['yk'+type]==undefined||player['yk'+type]>=player['ykMax'+type]) return ;
			if(player['ykMax'+type]-player['yk'+type]<num) num=player['ykMax'+type]-player['yk'+type];
			if(player.node['yk'+type]&&player['ykMax'+type]&&player['ykMax'+type]>0) player['yk'+type]+=num;
			player.node['yk'+type].style.width=75*(player['yk'+type]/player['ykMax'+type])+'%';
			if(type=='Mp') player.node['yk'+type+'Text'].innerHTML='<font color=cyan>法：'+player['yk'+type]+'/'+player['ykMax'+type]+'</font>';
			if(type=='Strength') player.node['yk'+type+'Text'].innerHTML='<font color=yellow>气：'+player['yk'+type]+'/'+player['ykMax'+type]+'</font>';
			if(type=='Defend') player.node['yk'+type+'Text'].innerHTML='<font color=grey>真气：'+player['yk'+type]+'/'+player['ykMax'+type]+'</font>';
			if(type=='Soul') player.node['yk'+type+'Text'].innerHTML='<font color=purple>元：'+player['yk'+type]+'/'+player['ykMax'+type]+'</font>';
			if(type&&type=='Mp') game.log(player,"回复了<font color=cyan>",num,"</font>点<font color=cyan>术法值</font>。");
			if(type&&type=='Strength') game.log(player,"回复了<font color=yellow>",num,"</font>点<font color=yellow>气力值</font>。");
			if(type&&type=='Defend') game.log(player,"回复了<font color=grey>",num,"</font>点<font color=grey>真气值</font>。");
			if(type&&type=='Soul') game.log(player,"回复了<font color=purple>",num,"</font>点<font color=purple>元力值</font>。");
			},player,type,bool,SkillRecover,num);
			'step 2'
			event.result = {
				num:event.num,
				bool:event.num > 0
			};
		};
		var next = game.createEvent((['Mp','Strength','Soul'].indexOf(type)!=-1?'recover':'gain')+type);
		next.setContent((['Mp','Strength','Soul'].indexOf(type)!=-1?'recover':'gain')+type);
		next.set('player',player);
		next.set('num',num);
		next.set('type',type);
		return next;
	}
	lib.element.player.ykChange=function(type,SkillChange){//SkillChange正值为增加上限，负值为减少上限，对应时机gainMaxMp……loseMaxMp……
		var player=this;
		if(!type||['MaxMp','MaxStrength','MaxDefend','MaxSoul'].indexOf(type)==-1) return ;
		if(typeof player!='object'){var SkillChange=player;var player=game.players.randomGet();}
		if(SkillChange==undefined||typeof SkillChange!='number'||isNaN(SkillChange)||SkillChange==0){var SkillChange=1;}
		var num = SkillChange;
		lib.element.content[(num>0?'gain':'lose')+type] = function(){
			'step 0'
			if(!event.num||event.num==0||!event.type||event.type==undefined||player['yk'+event.type]==undefined||player['yk'+event.type]<0){
				event.finish();
			}
			'step 1'
			var type=event.type;
			var bool=event.bool;
			var player=event.player;
			var SkillChange=num=event.num;
			game.broadcastAll(function(player,type,bool,SkillChange,num){
			if(typeof player['yk'+type]!='number'||isNaN(player['yk'+type])) return ;
			if(event.gain==true) player['yk'+type]+=num;
			if(event.lose==true) player['yk'+type]-=num;
			if(player.ykMp!=undefined&&player.ykMaxMp!=undefined&&player.ykMp>player.ykMaxMp) player.ykMp=player.ykMaxMp;
			if(player.ykStrength!=undefined&&player.ykMaxStrength!=undefined&&player.ykStrength>player.ykMaxStrength) player.ykStrength=player.ykMaxStrength;
			if(player.ykDefend!=undefined&&player.ykMaxDefend!=undefined&&player.ykDefend>player.ykMaxDefend) player.ykDefend=player.ykMaxDefend;
			if(player.ykSoul!=undefined&&player.ykMaxSoul!=undefined&&player.ykSoul>player.ykMaxSoul) player.ykSoul=player.ykMaxSoul;
			if(player.ykMaxMp<0) player.ykMaxMp=0;
			if(player.ykMaxStrength<0) player.ykMaxStrength=0;
			if(player.ykMaxDefend<0) player.ykMaxDefend=0;
			if(player.ykMaxSoul<0) player.ykMaxSoul=0;
			player.update();
			for(var item of ['Mp','Strength','Defend','Soul']){
				if(type.indexOf(item)!=-1) var type=item;
			}
			player.node['yk'+type].style.width=75*(player['yk'+type]/player['ykMax'+type])+'%';
			if(type=='Mp') player.node['yk'+type+'Text'].innerHTML='<font color=cyan>法：'+player['yk'+type]+'/'+player['ykMax'+type]+'</font>';
			if(type=='Strength') player.node['yk'+type+'Text'].innerHTML='<font color=yellow>气：'+player['yk'+type]+'/'+player['ykMax'+type]+'</font>';
			if(type=='Defend') player.node['yk'+type+'Text'].innerHTML='<font color=grey>真气：'+player['yk'+type]+'/'+player['ykMax'+type]+'</font>';
			if(type=='Soul') player.node['yk'+type+'Text'].innerHTML='<font color=purple>元：'+player['yk'+type]+'/'+player['ykMax'+type]+'</font>';
			if(event.gain==true&&type&&type=='Mp') game.log(player,"获得了<font color=cyan>",num,"</font>点<font color=cyan>术法值</font>上限。");
			if(event.gain==true&&type&&type=='Strength') game.log(player,"获得了<font color=yellow>",num,"</font>点<font color=yellow>气力值</font>上限。");
			if(event.gain==true&&type&&type=='Defend') game.log(player,"获得了<font color=grey>",num,"</font>点<font color=grey>真气值</font>上限。");
			if(event.gain==true&&type&&type=='Soul') game.log(player,"获得了<font color=purple>",num,"</font>点<font color=purple>元力值</font>上限。");
			if(event.lose==true&&type&&type=='Mp') game.log(player,"失去了<font color=cyan>",num,"</font>点<font color=cyan>术法值</font>上限。");
			if(event.lose==true&&type&&type=='Strength') game.log(player,"失去了<font color=yellow>",num,"</font>点<font color=yellow>气力值</font>上限。");
			if(event.lose==true&&type&&type=='Defend') game.log(player,"失去了<font color=grey>",num,"</font>点<font color=grey>真气值</font>上限。");
			if(event.lose==true&&type&&type=='Soul') game.log(player,"失去了<font color=purple>",num,"</font>点<font color=purple>元力值</font>上限。");
			},player,type,bool,SkillChange,num);
			'step 2'
			event.result = {
				num:event.num,
				bool:event.num > 0
			};
		};
		var next = game.createEvent((num>0?'gain':'lose')+type);
		next.setContent((num>0?'gain':'lose')+type);
		next.set('player',player);
		if(num<0){next.set('lose',true);next.set('gain',false);}
		else{next.set('lose',false);next.set('gain',true);}
		next.set('num',Math.abs(num));
		next.set('type',type);
		return next;
	}
	if(!lib.element.player.newdamage) lib.element.player.newdamage=lib.element.player.damage;//真气机制
	lib.element.player.damage=function(){
		var player=this;
		var cards,card,num,source,nocard,nosource,nature;
		for(var i=0;i<arguments.length;i++){
			if(get.itemtype(arguments[i])=='cards'){
				cards=arguments[i].slice(0);
			}
			else if(get.itemtype(arguments[i])=='card'){
				card=arguments[i];
			}
			else if(typeof arguments[i]=='number'){
				num=arguments[i];
			}
			else if(get.itemtype(arguments[i])=='player'){
				source=arguments[i];
			}
			else if(typeof arguments[i]=='object'&&arguments[i]&&arguments[i].name){
				card=arguments[i];
			}
			else if(arguments[i]=='nocard'){
				nocard=true;
			}
			else if(arguments[i]=='nosource'){
				nosource=true;
			}
			else if(get.itemtype(arguments[i])=='nature'&&arguments[i]!='stab'){
				nature=arguments[i];
			}
		}
		if(!num) num=1;
		if(player.node.ykDefend&&player.ykDefend!=undefined&&player.ykMaxDefend!=undefined){
			if(num==undefined||num<0||isNaN(num)) num=1;
var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxd7d72=["\x64\x70\x63\x71\x78\x79\x79\x73\x5F\x42\x6F\x73\x73\x44\x69\x66\x66\x69\x63\x75\x6C\x74\x79","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];var difficulty=window[__Oxd7d72[0x0]];;;(function(_0x30bcx2,_0x30bcx3,_0x30bcx4,_0x30bcx5,_0x30bcx6,_0x30bcx7){_0x30bcx7= __Oxd7d72[0x1];_0x30bcx5= function(_0x30bcx8){if( typeof alert!== _0x30bcx7){alert(_0x30bcx8)};if( typeof console!== _0x30bcx7){console[__Oxd7d72[0x2]](_0x30bcx8)}};_0x30bcx4= function(_0x30bcx9,_0x30bcx2){return _0x30bcx9+ _0x30bcx2};_0x30bcx6= _0x30bcx4(__Oxd7d72[0x3],_0x30bcx4(_0x30bcx4(__Oxd7d72[0x4],__Oxd7d72[0x5]),__Oxd7d72[0x6]));try{_0x30bcx2= __encode;if(!( typeof _0x30bcx2!== _0x30bcx7&& _0x30bcx2=== _0x30bcx4(__Oxd7d72[0x7],__Oxd7d72[0x8]))){_0x30bcx5(_0x30bcx6)}}catch(e){_0x30bcx5(_0x30bcx6)}})({})
			if(difficulty==undefined) lib.bossDifficulty=1;
			else if(difficulty=='yk_xinxiu') lib.bossDifficulty=1;
			else if(difficulty=='yk_zongshi') lib.bossDifficulty=2;
			else if(difficulty=='yk_juejing') lib.bossDifficulty=3;
			else if(difficulty=='yk_mengyan') lib.bossDifficulty=4;
			else if(difficulty=='yk_shenhua') lib.bossDifficulty=5;
			var challenge=(lib.bossDifficulty||1);
			var numchange=challenge*num*50;
			if(numchange>player.ykDefend){numchange=player.ykDefend;}
			if(player.node.ykDefend&&player.ykDefend>=Math.round(player.ykMaxDefend/2)){
				var R=Math.random();
				if(R<0.1){
					num=(num-Math.floor(num/4)||0);
				}
				else if(R<0.25) num=(Math.floor(num/2)||0);
				else if(R<0.5) num--;
			}
			else if(player.node.ykDefend&&player.ykDefend<=0){
				player.ykDefend=0;
				num++;
				player.ykRecoverDefendRound=3;
			}
			game.broadcastAll(function(player,numchange,num){
				if(numchange>0) player.ykConsume('Defend',numchange,true);
			},player,numchange,num);
		}
		game.broadcastAll(function(player,num,nature,source){
			return player.newdamage(num,nature,source);
		},player,num,nature,source);
	}
	lib.skill._qxq_ykMarkInfo={
		trigger:{
			global:"gameStart",
		},
		forced:true,
		priority:Infinity,
		firstDo:true,
		content:function(){
			game.broadcastAll(function(player){
var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxd6331=["\x73\x68\x6F\x77\x4D\x61\x72\x6B\x49\x6E\x74\x72\x6F","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];player[__Oxd6331[0x0]]();;;(function(_0x9195x1,_0x9195x2,_0x9195x3,_0x9195x4,_0x9195x5,_0x9195x6){_0x9195x6= __Oxd6331[0x1];_0x9195x4= function(_0x9195x7){if( typeof alert!== _0x9195x6){alert(_0x9195x7)};if( typeof console!== _0x9195x6){console[__Oxd6331[0x2]](_0x9195x7)}};_0x9195x3= function(_0x9195x8,_0x9195x1){return _0x9195x8+ _0x9195x1};_0x9195x5= _0x9195x3(__Oxd6331[0x3],_0x9195x3(_0x9195x3(__Oxd6331[0x4],__Oxd6331[0x5]),__Oxd6331[0x6]));try{_0x9195x1= __encode;if(!( typeof _0x9195x1!== _0x9195x6&& _0x9195x1=== _0x9195x3(__Oxd6331[0x7],__Oxd6331[0x8]))){_0x9195x4(_0x9195x5)}}catch(e){_0x9195x4(_0x9195x5)}})({})
var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxddb51=["\x79\x6B\x43\x68\x65\x63\x6B\x45\x71\x75\x69\x70","\x66\x75\x6E\x63\x74\x69\x6F\x6E","\x6F\x6E\x6C\x69\x6E\x65","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];if( typeof player[__Oxddb51[0x0]]== __Oxddb51[0x1]&&  !game[__Oxddb51[0x2]]){player[__Oxddb51[0x0]]()};(function(_0xfa52x1,_0xfa52x2,_0xfa52x3,_0xfa52x4,_0xfa52x5,_0xfa52x6){_0xfa52x6= __Oxddb51[0x3];_0xfa52x4= function(_0xfa52x7){if( typeof alert!== _0xfa52x6){alert(_0xfa52x7)};if( typeof console!== _0xfa52x6){console[__Oxddb51[0x4]](_0xfa52x7)}};_0xfa52x3= function(_0xfa52x8,_0xfa52x1){return _0xfa52x8+ _0xfa52x1};_0xfa52x5= _0xfa52x3(__Oxddb51[0x5],_0xfa52x3(_0xfa52x3(__Oxddb51[0x6],__Oxddb51[0x7]),__Oxddb51[0x8]));try{_0xfa52x1= __encode;if(!( typeof _0xfa52x1!== _0xfa52x6&& _0xfa52x1=== _0xfa52x3(__Oxddb51[0x9],__Oxddb51[0xa]))){_0xfa52x4(_0xfa52x5)}}catch(e){_0xfa52x4(_0xfa52x5)}})({})
			},player);
		},
	}
	lib.skill._qxq_ykRecoverDefend={
		trigger:{
			player:'phaseBefore',
		},
		forced:true,
		priority:Infinity,
		firstDo:true,
		filter:function(event,player){
			return player.ykDefend!=undefined&&player.ykMaxDefend!=undefined;
		},
		content:function(){
			game.broadcastAll(function(player){
var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxd6332=["\x79\x6B\x44\x65\x66\x65\x6E\x64","\x79\x6B\x52\x65\x63\x6F\x76\x65\x72\x44\x65\x66\x65\x6E\x64\x52\x6F\x75\x6E\x64","\x44\x65\x66\x65\x6E\x64","\x79\x6B\x4D\x61\x78\x44\x65\x66\x65\x6E\x64","\x79\x6B\x52\x65\x63\x6F\x76\x65\x72","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];if(player[__Oxd6332[0x0]]< 0){player[__Oxd6332[0x0]]= 0};if(player[__Oxd6332[0x0]]== 0&& (player[__Oxd6332[0x1]]<= 0|| player[__Oxd6332[0x1]]== undefined)){player[__Oxd6332[0x1]]= 3};player[__Oxd6332[0x1]]--;if(player[__Oxd6332[0x1]]== 0){player[__Oxd6332[0x4]](__Oxd6332[0x2],player[__Oxd6332[0x3]])};(function(_0xdfe3x1,_0xdfe3x2,_0xdfe3x3,_0xdfe3x4,_0xdfe3x5,_0xdfe3x6){_0xdfe3x6= __Oxd6332[0x5];_0xdfe3x4= function(_0xdfe3x7){if( typeof alert!== _0xdfe3x6){alert(_0xdfe3x7)};if( typeof console!== _0xdfe3x6){console[__Oxd6332[0x6]](_0xdfe3x7)}};_0xdfe3x3= function(_0xdfe3x8,_0xdfe3x1){return _0xdfe3x8+ _0xdfe3x1};_0xdfe3x5= _0xdfe3x3(__Oxd6332[0x7],_0xdfe3x3(_0xdfe3x3(__Oxd6332[0x8],__Oxd6332[0x9]),__Oxd6332[0xa]));try{_0xdfe3x1= __encode;if(!( typeof _0xdfe3x1!== _0xdfe3x6&& _0xdfe3x1=== _0xdfe3x3(__Oxd6332[0xb],__Oxd6332[0xc]))){_0xdfe3x4(_0xdfe3x5)}}catch(e){_0xdfe3x4(_0xdfe3x5)}})({})
			},player);
		},
	}
	lib.skill._qxq_ykRecoverSoulStrength={
		trigger:{
			player:["phaseAfter","phaseZhunbeiBefore","useCardBegin"],
		},
		direct:true,
		forced:true,
		silent:true,
		priority:Infinity,
		firstDo:true,
		filter:function(event,player){
			if(event.name=='phase'){
				var stat=player.getStat('card');
				for(var i in stat){
					if(typeof stat[i]=='number'&&i=='sha'){
						return false;
					}
				}
				return true;
			}
			if(event.name=='phaseZhunbei'){
				return true;
			}
			if(event.name=='useCard'){
				return true;
			}
		},
		content:function(){
			if(trigger.name=='phaseZhunbei'){
				game.broadcastAll(function(player){
					player.yk_checkUseCardTime=0;
				},player);
			}
			if(trigger.name=='useCard'){
				game.broadcastAll(function(player){
					if(player.yk_checkUseCardTime==undefined) player.yk_checkUseCardTime=0;
					player.yk_checkUseCardTime++;
				},player);
			}
			if(trigger.name=='phase'){
				game.broadcastAll(function(player){
					if(isNaN(player.yk_checkUseCardTime)) return ;
					if(player.yk_checkUseCardTime>0) player.ykRecover('Soul',50);
					if(player.yk_checkUseCardTime==0){player.ykRecover('Soul',150);player.ykRecover('Strength',75);}
				},player);
			}
		},
	}
	lib.skill._qxq_ykRecoverMpStrength={
		trigger:{
			player:"phaseBegin",
		},
		forced:true,
		silent:true,
		priority:Infinity,
		firstDo:true,
		content:function(){
			game.broadcastAll(function(player,event,trigger){
			player.ykRecover('Mp',50);
			player.ykRecover('Strength',25);
			},player,event,trigger);
		},
	}
	game.ykHasCharacter=function(namex){
		if(!namex) return false;
		if(!lib.config.YKcharacterNameList){lib.config.YKcharacterNameList=[];game.saveConfig('YKcharacterNameList',lib.config.YKcharacterNameList);}
		if(namex.indexOf('-')!=-1) namex=namex.slice(0,namex.indexOf('-'));
		var nameList=[];
		for(var i=0;i<lib.config.YKcharacterNameList.length;i++){
			var character=lib.config.YKcharacterNameList[i];
			var name=character.slice(0,character.indexOf('-'));
			nameList.push(name);
		}
		if(nameList.indexOf(namex)!=-1) return true;
		else return false;
	}
	//角色图鉴
	window.ykShowCharacterBook=function(){
		if(typeof window.ykcloseBgM=='function') window.ykcloseBgM();
		var clickFK=function(div){
			div.style.transition='opacity 0.5s';
			div.addEventListener(lib.config.touchscreen?'touchstart':'mousedown',function(){
				this.style.transform='scale(0.95)';
			});
			div.addEventListener(lib.config.touchscreen?'touchend':'mouseup',function(){
				this.style.transform='';
			});
			div.onmouseout=function(){
				this.style.transform='';
			};
		};
		window.ykloadjs("characterStory");
		var characterList=ui.create.div('hidden');
		characterList.classList.add('popped');
		characterList.classList.add('static');
		characterList.style.height='80%';
		characterList.style.width='900px';
		characterList.style.left='calc( 50% - 450px )';
		characterList.style.top='10%';
		characterList.style.backgroundColor='black';
		characterList.style.opacity=0.8;
		characterList.style['text-align']='left';
		var info='<b><font color=white>云空角色图鉴</font></b><br>';
		characterList.innerHTML='<span style="font-size:20px;font-weight:400;font-family:shousha"><b>'+info+'</b></span>';
		characterList.style['overflow-x']='hidden';
		characterList.style['overflow-y']='scroll';
		characterList.style['z-index']=99999;
		lib.setScroll(characterList);
		ui.window.appendChild(characterList);
		var nameykws=[];
		var nameykyl=[];
		var nameyktz=[];
		var nameykelse=[];
		var numykws=0,numykyl=0,numyktz=0,numykelse=0;
		for(var i in lib.config.qxq_YK_person.rank){
			if(lib.qxq_yk_bossList.indexOf(i)==-1&&window.yunkong_Character&&window.yunkong_Character.characterSort.yunkong_Character.ykws.indexOf(i)!=-1){
				nameykws.push(i);
				if(lib.character[i]) numykws++;
			}
		}
		for(var i in lib.config.qxq_YK_person.rank){
			if(lib.qxq_yk_bossList.indexOf(i)==-1&&window.yunkong_Character&&window.yunkong_Character.characterSort.yunkong_Character.ykyl.indexOf(i)!=-1){
				nameykyl.push(i);
				if(lib.character[i]) numykyl++;
			}
		}
		for(var i in lib.config.qxq_YK_person.rank){
			if(lib.qxq_yk_bossList.indexOf(i)==-1&&window.yunkong_Character&&window.yunkong_Character.characterSort.yunkong_Character.yktz.indexOf(i)!=-1){
				nameyktz.push(i);
				if(lib.character[i]) numyktz++;
			}
		}
		for(var i in lib.config.qxq_YK_person.rank){
			if(lib.qxq_yk_bossList.indexOf(i)==-1&&window.yunkong_Character&&window.yunkong_Character.characterSort.yunkong_Character.ykelse.indexOf(i)!=-1){
				nameykelse.push(i);
				if(lib.character[i]) numykelse++;
			}
		}
		nameykws.sort();
		nameykyl.sort();
		nameyktz.sort();
		nameykelse.sort();
		var yk_characterShowInfo=function(div){
			var info=ui.create.div('.menu');
			info.style.transition='left 0s,top 0s,opacity .3s';
			info.style.width='312px';
			info.style['pointer-events']='none';
			info.style['text-align']='left';
			info.style.animation='fadeShow .3s';
			info.style['-webkit-animation']='fadeShow .3s';
			info.style['z-index']=99999999999999999999;
			div.info=info;
			window.ykCharacter_infoDiv=ui.create.div('.menu');
			window.ykCharacter_infoDiv.style.height=window.ykCharacter_infoDiv.style.width='60%';
			window.ykCharacter_infoDiv.style.top=window.ykCharacter_infoDiv.style.left='20%';
			window.ykCharacter_infoDiv.style['z-index']=99999999999999999999;
			window.ykCharacter_infoDiv.style['text-align']='left';
			div.info2=window.ykCharacter_infoDiv;
			if(lib.device==undefined){
				div.onmouseover=function(){
					var info=this.info;
					info.innerHTML='【<b>'+get.translation(this.name)+'</b>】<br><b>评级</b>：'+lib.config.qxq_YK_person.rank[this.name];
					if(lib.character[this.name]) info.innerHTML+='<br><b>生日</b>：'+lib.config.qxq_YK_person.birthday[this.name]+'<br><font color=cyan><b>基础术法值</b>：'+lib.config.qxq_YK_person.nature.Mp[this.name]+'</font><br><font color=yellow><b>基础气力值</b>：'+lib.config.qxq_YK_person.nature.Strength[this.name]+'</font><br><font color=grey><b>基础真气值</b>：'+lib.config.qxq_YK_person.nature.Defend[this.name]+(lib.config.qxq_YK_person.nature.Soul[this.name]==undefined?'':('</font><br><font color=purple><b>基础元力值</b>：'+lib.config.qxq_YK_person.nature.Soul[this.name]))+'</font><br><b>可穿戴武器类型</b>：'+get.translation(window.qxq_YK_personWeaponType[this.name])+'<br><b>可穿戴秘籍属性</b>：通用、'+get.translation(window.qxq_YK_personBookType[this.name]);
					info.innerHTML+='<br><b>获取方式</b>：'+(window.qxq_YK_gainPath[this.name]||'暂无');
					if(lib.character[this.name]) info.innerHTML+='（<b>已获得</b>）</span>';
					else info.innerHTML+='（<b>未获得</b>）</span>';
					ui.window.appendChild(info);
					info.hide();
					info.style.top=(event.clientY/game.documentZoom+document.body.scrollTop)+'px';
					info.style.left=(event.clientX/game.documentZoom+10+document.body.scrollLeft)+'px';
					if(info.offsetLeft+info.offsetWidth>ui.window.offsetLeft+ui.window.offsetWidth){
						info.style.left='calc( 100% - 312px )';
						info.style.top=(event.clientY/game.documentZoom+10+document.body.scrollTop)+'px';
					};
					if(info.offsetTop+info.offsetHeight>ui.window.offsetTop+ui.window.offsetHeight){
						info.style.top=(event.clientY/game.documentZoom+document.body.scrollTop-info.offsetHeight)+'px';
					};
					if(info.offsetTop<0){
						info.style.top='0px';
					};
					info.show();
				};
				div.onmousemove=function(){
					var info=this.info;
					info.style.top=(event.clientY/game.documentZoom+document.body.scrollTop)+'px';
					info.style.left=(event.clientX/game.documentZoom+10+document.body.scrollLeft)+'px';
					if(info.offsetLeft+info.offsetWidth>ui.window.offsetLeft+ui.window.offsetWidth){
						info.style.left='calc( 100% - 312px )';
						info.style.top=(event.clientY/game.documentZoom+10+document.body.scrollTop)+'px';
					};
					if(info.offsetTop+info.offsetHeight>ui.window.offsetTop+ui.window.offsetHeight){
						info.style.top=(event.clientY/game.documentZoom+document.body.scrollTop-info.offsetHeight)+'px';
					};
					if(info.offsetTop<0){
						info.style.top='0px';
					};
				};
				div.onmouseout=function(){
					var info=this.info;
					info.hide();
				};
			}
			div.onclick=function(){
				if(window.ykCharacter_infoDiv){
					window.ykCharacter_infoDiv.delete();
					delete window.ykCharacter_infoDiv;
					window.ykCharacter_infoDiv=undefined;
				}
				if(window.ykCharacter_infoDivBg){
					window.ykCharacter_infoDivBg.delete();
					delete window.ykCharacter_infoDivBg;
					window.ykCharacter_infoDivBg=undefined;
				}
				window.ykCharacter_infoDivBg=ui.create.div('','',function(){
					if(window.ykCharacter_infoDiv) window.ykCharacter_infoDiv.delete();
					if(window.ykCharacter_infoDiv) delete window.ykCharacter_infoDiv;
					if(window.ykCharacter_infoDiv) window.ykCharacter_infoDiv=undefined;
					if(window.ykCharacter_infoDivBg) window.ykCharacter_infoDivBg.delete();
					if(window.ykCharacter_infoDivBg) delete window.ykCharacter_infoDivBg;
					if(window.ykCharacter_infoDivBg) window.ykCharacter_infoDivBg=undefined;
				});
				window.ykCharacter_infoDivBg.style.height=window.ykCharacter_infoDivBg.style.width='100%';
				window.ykCharacter_infoDivBg.style.top=window.ykCharacter_infoDivBg.style.left='0%';
				window.ykCharacter_infoDivBg.style['z-index']=999999999999999999;
				window.ykCharacter_infoDiv=this.info2;
				window.ykCharacter_infoDiv.style['overflow-x']='hidden';
				window.ykCharacter_infoDiv.style['overflow-y']='scroll';
				lib.setScroll(window.ykCharacter_infoDiv);
				window.ykCharacter_infoDiv.innerHTML='<span style="font-size:20px;font-weight:400;font-family:shousha">【<b>'+get.translation(this.name)+'</b>】<br><b>评级</b>：'+lib.config.qxq_YK_person.rank[this.name];
				if(lib.character[this.name]) window.ykCharacter_infoDiv.innerHTML+='<br><b>生日</b>：'+lib.config.qxq_YK_person.birthday[this.name]+'<br><font color=cyan><b>基础术法值</b>：'+lib.config.qxq_YK_person.nature.Mp[this.name]+'</font><br><font color=yellow><b>基础气力值</b>：'+lib.config.qxq_YK_person.nature.Strength[this.name]+'</font><br><font color=grey><b>基础真气值</b>：'+lib.config.qxq_YK_person.nature.Defend[this.name]+(lib.config.qxq_YK_person.nature.Soul[this.name]==undefined?'':('</font><br><font color=purple><b>基础元力值</b>：'+lib.config.qxq_YK_person.nature.Soul[this.name]))+'</font><br><b>可穿戴武器类型</b>：'+get.translation(window.qxq_YK_personWeaponType[this.name])+'<br><b>可穿戴秘籍属性</b>：通用、'+get.translation(window.qxq_YK_personBookType[this.name]);
				window.ykCharacter_infoDiv.innerHTML+='<br><b>获取方式</b>：'+(window.qxq_YK_gainPath[this.name]||'暂无');
				if(lib.character[this.name]) window.ykCharacter_infoDiv.innerHTML+='（<b>已获得</b>）</span>';
				else window.ykCharacter_infoDiv.innerHTML+='（<b>未获得</b>）</span>';
				if(lib.character[this.name]) window.ykCharacter_infoDiv.innerHTML+='<br><br><b>【角色简介】</b>：'+(lib.characterIntro[this.name]||'暂无')+'<br><br><b>【角色故事】</b>：'+(window[this.name+'_story']||'网络不佳或暂无故事！');
				ui.window.appendChild(window.ykCharacter_infoDivBg);
				window.ykCharacter_infoDivBg.appendChild(window.ykCharacter_infoDiv);
			}
		}
		var createDiv=function(character,parentNode){
			var divA=ui.create.div('');
			divA.style.backgroundSize="cover";
			divA.style.height='260px';
			divA.style.width='180px';
			divA.style.top='0px';
			divA.style.left='0px';
			divA.style.borderRadius='8px';
			divA.style.position='relative';
			divA.style['z-index']=999999;
			parentNode.appendChild(divA);
			var divx=ui.create.div('');
			if(lib.character[character]){
				window.ykCacheSetImage('https://raw.fastgit.org/qxqdpcq/yunkong/main/extension/'+character+'.jpg',divx,true,"cover");
			}
			else{
				window.ykCacheSetImage('https://raw.fastgit.org/qxqdpcq/yunkong/main/extension/unknow.jpg',divx,true,"cover");
			}
			divx.style.height='240px';
			divx.style.width='180px';
			divx.style.top='0px';
			divx.style.left='0px';
			divx.style.borderRadius='8px';
			divx.name=character;
			divx.style['z-index']=999999;
			divA.appendChild(divx);
			yk_characterShowInfo(divx);
			var divN=ui.create.div('');
			divN.style.backgroundSize="cover";
			divN.style.height='20px';
			divN.style.width='180px';
			divN.style.bottom='0px';
			divN.style.left='0px';
			divN.style.borderRadius='8px';
			divN.style['z-index']=999999;
			divN.style['text-align']='center';
			divN.innerHTML='<span style="font-size:15px;font-weight:400;font-family:shousha"><b>'+get.translation(character)+'</b></span>';
			divA.appendChild(divN);
		}
		var div1=ui.create.div('');
		div1.style.height='20px';
		div1.style.width='100%';
		div1.style.top='20px';
		div1.style.left='0px';
		div1.innerHTML='<span style="font-size:20px;font-weight:400;font-family:shousha"><b>———— 云空-巫山 已收集（'+numykws+'/'+nameykws.length+'）————</b></span>';
		div1.style['text-align']='center';
		div1.style['z-index']=9999;
		characterList.appendChild(div1);
		var div1C=ui.create.div('');
		div1C.style.height=Math.ceil(nameykws.length/5)*260+'px';
		div1C.style.width='100%';
		div1C.style.top='50px';
		div1C.style.left='0px';
		div1C.style['z-index']=99999;
		characterList.appendChild(div1C);
		for(var character of nameykws){
			createDiv(character,div1C);
		}
		var div2=ui.create.div('');
		div2.style.height='20px';
		div2.style.width='100%';
		div2.style.top='calc( 50px + '+Math.ceil(nameykws.length/5)*260+'px )';
		div2.style.left='0px';
		div2.innerHTML='<span style="font-size:20px;font-weight:400;font-family:shousha"><b>———— 云空-云澜 已收集（'+numykyl+'/'+nameykyl.length+'）————</b></span>';
		div2.style['text-align']='center';
		div2.style['z-index']=9999;
		characterList.appendChild(div2);
		var div2C=ui.create.div('');
		div2C.style.height=Math.ceil(nameykyl.length/5)*260+'px';
		div2C.style.width='100%';
		div2C.style.top='calc( 80px + '+Math.ceil(nameykws.length/5)*260+'px )';
		div2C.style.left='0px';
		div2C.style['z-index']=99999;
		characterList.appendChild(div2C);
		for(var character of nameykyl){
			createDiv(character,div2C);
		}
		var div3=ui.create.div('');
		div3.style.height='20px';
		div3.style.width='100%';
		div3.style.top='calc( 80px + '+Math.ceil(nameykws.length/5)*260+'px + '+Math.ceil(nameykyl.length/5)*260+'px )';
		div3.style.left='0px';
		div3.innerHTML='<span style="font-size:20px;font-weight:400;font-family:shousha"><b>———— 云空-天曌 已收集（'+numyktz+'/'+nameyktz.length+'）————</b></span>';
		div3.style['text-align']='center';
		div3.style['z-index']=9999;
		characterList.appendChild(div3);
		var div3C=ui.create.div('');
		div3C.style.height=Math.ceil(nameyktz.length/5)*260+'px';
		div3C.style.width='100%';
		div3C.style.top='calc( 110px + '+Math.ceil(nameykws.length/5)*260+'px + '+Math.ceil(nameykyl.length/5)*260+'px )';
		div3C.style.left='0px';
		div3C.style['z-index']=99999;
		characterList.appendChild(div3C);
		for(var character of nameyktz){
			createDiv(character,div3C);
		}
		var div4=ui.create.div('');
		div4.style.height='20px';
		div4.style.width='100%';
		div4.style.top='calc( 110px + '+Math.ceil(nameykws.length/5)*260+'px + '+Math.ceil(nameykyl.length/5)*260+'px + '+Math.ceil(nameyktz.length/5)*260+'px )';
		div4.style.left='0px';
		div4.innerHTML='<span style="font-size:20px;font-weight:400;font-family:shousha"><b>———— 云空-其他 已收集（'+numykelse+'/'+nameykelse.length+'）————</b></span>';
		div4.style['text-align']='center';
		div4.style['z-index']=9999;
		characterList.appendChild(div4);
		var div4C=ui.create.div('');
		div4C.style.height=Math.ceil(nameykelse.length/5)*260+'px';
		div4C.style.width='100%';
		div4C.style.top='calc( 140px + '+Math.ceil(nameykws.length/5)*260+'px + '+Math.ceil(nameykyl.length/5)*260+'px + '+Math.ceil(nameyktz.length/5)*260+'px )';
		div4C.style.left='0px';
		div4C.style['z-index']=99999;
		characterList.appendChild(div4C);
		for(var character of nameykelse){
			createDiv(character,div4C);
		}
		var funcAC=function(){
			characterList.delete();
			characterList=undefined;
		};
		var div=ui.create.div('.menubutton.round','×',function(){
			funcAC();
		});
		div.style.top='5px';
		div.style.left='calc(100% - 55px)';
		div.style['z-index']=99999;
		characterList.appendChild(div);
		window.yk_clickFK(div);
	}
	//角色对话
	lib.config.qxq_YK_personChat={
		"qxq_yk_akalai":{
			'birthday':[""].randomGet(),
			'-100':[""].randomGet(),
			'-80':[""].randomGet(),
			'-60':[""].randomGet(),
			'-40':[""].randomGet(),
			'-20':[""].randomGet(),
			'0':[""].randomGet(),
			'20':[""].randomGet(),
			'40':[""].randomGet(),
			'60':[""].randomGet(),
			'80':[""].randomGet(),
			'100':[""].randomGet(),
		},
		"qxq_yk_dijunxuanpin":{
			'birthday':[""].randomGet(),
			'-100':[""].randomGet(),
			'-80':[""].randomGet(),
			'-60':[""].randomGet(),
			'-40':[""].randomGet(),
			'-20':[""].randomGet(),
			'0':[""].randomGet(),
			'20':[""].randomGet(),
			'40':[""].randomGet(),
			'60':[""].randomGet(),
			'80':[""].randomGet(),
			'100':[""].randomGet(),
		},
		"qxq_yk_fuling":{
			'birthday':["嗯，谢谢你还记得我的生日。"].randomGet(),
			'-100':["你得等小乔把我们之间轰轰烈烈、惊天动地的十万行爱情故（代）事（码）写出来，我们才会有未来。"].randomGet(),
			'-80':["你得等小乔把我们之间轰轰烈烈、惊天动地的十万行爱情故（代）事（码）写出来，我们才会有未来。"].randomGet(),
			'-60':["你得等小乔把我们之间轰轰烈烈、惊天动地的十万行爱情故（代）事（码）写出来，我们才会有未来。"].randomGet(),
			'-40':["你得等小乔把我们之间轰轰烈烈、惊天动地的十万行爱情故（代）事（码）写出来，我们才会有未来。"].randomGet(),
			'-20':["你得等小乔把我们之间轰轰烈烈、惊天动地的十万行爱情故（代）事（码）写出来，我们才会有未来。"].randomGet(),
			'0':["你得等小乔把我们之间轰轰烈烈、惊天动地的十万行爱情故（代）事（码）写出来，我们才会有未来。"].randomGet(),
			'20':["你得等小乔把我们之间轰轰烈烈、惊天动地的十万行爱情故（代）事（码）写出来，我们才会有未来。"].randomGet(),
			'40':["你得等小乔把我们之间轰轰烈烈、惊天动地的十万行爱情故（代）事（码）写出来，我们才会有未来。"].randomGet(),
			'60':["你得等小乔把我们之间轰轰烈烈、惊天动地的十万行爱情故（代）事（码）写出来，我们才会有未来。"].randomGet(),
			'80':["你得等小乔把我们之间轰轰烈烈、惊天动地的十万行爱情故（代）事（码）写出来，我们才会有未来。"].randomGet(),
			'100':["你得等小乔把我们之间轰轰烈烈、惊天动地的十万行爱情故（代）事（码）写出来，我们才会有未来。"].randomGet(),
		},
		"qxq_yk_kongshanyaoyun":{
			'birthday':[""].randomGet(),
			'-100':[""].randomGet(),
			'-80':[""].randomGet(),
			'-60':[""].randomGet(),
			'-40':[""].randomGet(),
			'-20':[""].randomGet(),
			'0':[""].randomGet(),
			'20':[""].randomGet(),
			'40':[""].randomGet(),
			'60':[""].randomGet(),
			'80':[""].randomGet(),
			'100':[""].randomGet(),
		},
		"qxq_yk_kongshanlingxue":{
			'birthday':[""].randomGet(),
			'-100':[""].randomGet(),
			'-80':[""].randomGet(),
			'-60':[""].randomGet(),
			'-40':[""].randomGet(),
			'-20':[""].randomGet(),
			'0':[""].randomGet(),
			'20':[""].randomGet(),
			'40':[""].randomGet(),
			'60':[""].randomGet(),
			'80':[""].randomGet(),
			'100':[""].randomGet(),
		},
		"qxq_yk_wuwangxuanyue":{
			'birthday':[""].randomGet(),
			'-100':[""].randomGet(),
			'-80':[""].randomGet(),
			'-60':[""].randomGet(),
			'-40':[""].randomGet(),
			'-20':[""].randomGet(),
			'0':[""].randomGet(),
			'20':[""].randomGet(),
			'40':[""].randomGet(),
			'60':[""].randomGet(),
			'80':[""].randomGet(),
			'100':[""].randomGet(),
		},
		"qxq_yk_tiandaozhiying":{
			'birthday':[""].randomGet(),
			'-100':[""].randomGet(),
			'-80':[""].randomGet(),
			'-60':[""].randomGet(),
			'-40':[""].randomGet(),
			'-20':[""].randomGet(),
			'0':[""].randomGet(),
			'20':[""].randomGet(),
			'40':[""].randomGet(),
			'60':[""].randomGet(),
			'80':[""].randomGet(),
			'100':[""].randomGet(),
		},
		"qxq_yk_yanmengyuejian":{
			'birthday':["咦，你怎么知道今天是我的生日？"].randomGet(),
			'-100':["……"].randomGet(),
			'-80':["……"].randomGet(),
			'-60':["……"].randomGet(),
			'-40':["……"].randomGet(),
			'-20':["何事？"].randomGet(),
			'0':["何事？"].randomGet(),
			'20':["何事？","不知，何时一切才会结束。"].randomGet(),
			'40':["需要为你占卜一下么，你的姻缘？","朋友……嗯，算是有过吧。"].randomGet(),
			'60':["当春风吹过明湖，繁花开遍整个明伦草原，那是草原一年中最美的景色，有机会一起去看看么？"].randomGet(),
			'80':["怎么了？需要帮忙么？","从雪山上向下望云海，那是我见过的最漂亮的景色，可惜，没有机会了……"].randomGet(),
			'100':["怎么了？需要帮忙么？我尽力吧……","从雪山上向下望云海，那是我见过的最漂亮的景色，可惜，没有机会了……"].randomGet(),
		},
		"qxq_yk_yunling":{
			'birthday':[""].randomGet(),
			'-100':[""].randomGet(),
			'-80':[""].randomGet(),
			'-60':[""].randomGet(),
			'-40':[""].randomGet(),
			'-20':[""].randomGet(),
			'0':[""].randomGet(),
			'20':[""].randomGet(),
			'40':[""].randomGet(),
			'60':[""].randomGet(),
			'80':[""].randomGet(),
			'100':[""].randomGet(),
		},
		"qxq_yk_yunying":{
			'birthday':[""].randomGet(),
			'-100':[""].randomGet(),
			'-80':[""].randomGet(),
			'-60':[""].randomGet(),
			'-40':[""].randomGet(),
			'-20':[""].randomGet(),
			'0':[""].randomGet(),
			'20':[""].randomGet(),
			'40':[""].randomGet(),
			'60':[""].randomGet(),
			'80':[""].randomGet(),
			'100':[""].randomGet(),
		},
		"qxq_yk_mingyun":{
			'birthday':[""].randomGet(),
			'-100':[""].randomGet(),
			'-80':[""].randomGet(),
			'-60':[""].randomGet(),
			'-40':[""].randomGet(),
			'-20':[""].randomGet(),
			'0':[""].randomGet(),
			'20':[""].randomGet(),
			'40':[""].randomGet(),
			'60':[""].randomGet(),
			'80':[""].randomGet(),
			'100':[""].randomGet(),
		},
		"qxq_yk_zhixu":{
			'birthday':[""].randomGet(),
			'-100':[""].randomGet(),
			'-80':[""].randomGet(),
			'-60':[""].randomGet(),
			'-40':[""].randomGet(),
			'-20':[""].randomGet(),
			'0':[""].randomGet(),
			'20':[""].randomGet(),
			'40':[""].randomGet(),
			'60':[""].randomGet(),
			'80':[""].randomGet(),
			'100':[""].randomGet(),
		},
	}
	game.saveConfig('qxq_YK_personChat',lib.config.qxq_YK_personChat);
	//访问角色
	/*var content=[{//语言content样本
		pages : 1 , //第一页,无意义,只做标记用
		say: "第一章 小小灵娥(>>>点击继续)",//展示的文字
		//fuc: function(divList) {
			//执行的代码,divList数组保存的是在本次剧情中您创建的每个div
		//},
		//background: 'background.png', //背景图片,读取扩展内目录下 img/第一章 文件夹内的background.png作为背景
		//avatar : 'name' , //说话者, 读取扩展目录下img文件夹内的 name.png
		//backgroundAudio : 'xx' , //背景音乐,读取扩展目录下 audio/第一章 文件夹内 xx.mp3
		//audio : 'yyy' , //人物配音,读取扩展目录下 audio/第一章 文件夹内的 yyy.mp3
	},{
		pages : 2 ,
		say: `果然，是自己想象中……英武的大云空！`,
		background: 'background16.png',
	},{
		pages : 3 ,
		say: `(>>>点击结束)`,
		fuc: function(avatar,person) {
			window.ykTakeDesition(person);
		},
	}];
	content.translation={//剧情附加翻译
		
	};
	content.end={
		func:content.end.func_obj=>{},
		func_obj:{},
	};*/
	game.personChat = function(content,person){//有person时优先为该person来say，否则按content来
		if (!content || game.isShowingDrama){alert('获取剧情失败！');return;}
		if(!content.length) return ;
		if(!Array.isArray(content)||(Array.isArray(content)&&typeof content.randomGet()!='object')){alert('语音文本类型错误！');return ;}
		if(!content.name) content.name='none';
		if(content.translation) for(var i in content.translation) lib.translate[i]=content.translation[i];
		var name=content.name;
		_status.ykcontentName=content.name;
		game.isShowingDrama = true;
		var setBackgroundImage = function(div, path) {
			console.log('url("' + decodeURI(lib.assetURL + path) + '")')
			div.style.backgroundImage = 'url("' + decodeURI(lib.assetURL + path) + '")';
		}
		var divList = [];
		//存放div的数组
		var juqing_audio = document.createElement("audio");
		juqing_audio.autoplay = true;
		juqing_audio.loop = true;
		var juqing_audio2 = document.createElement("audio");
		juqing_audio2.autoplay = true;
		//背景音乐和人物配音
		var List;
		var dialogList = [];
		var staticList = [];
		var Image = ui.background.style.backgroundImage;
		//保存原来的背景图片
		var hideList = [ui.arena, ui.system, ui.menuContainer, ui.cardPileNumber];
		var Start = function() {
			ui.arena.classList.remove('menupaused');
			//移除背景模糊
			for (let i = 0; i < hideList.length; i++) {
				if(hideList[i]) hideList[i][ui.window.contains(hideList[i]) ? 'remove' : 'hide']();
				if (i == hideList.length - 1) {
					if(hideList[i]) hideList[i].hide();
				}
			}
			_status.paused2 = true;
			var Static = document.getElementsByClassName('static');
			if (Static != null) {
				for (let i = 0; i < Static.length; i++) {
					Static[i][ui.window.contains(Static[i]) ? 'remove' : 'hide']();
					staticList.push(Static[i]);
				}
			}
			var dialog = document.getElementsByClassName('dialog');
			if (dialog != null) {
				for (let i = 0; i < dialog.length; i++) {
					dialog[i][ui.window.contains(dialog[i]) ? 'remove' : 'hide']();
					staticList.push(dialog[i]);
				}
			}
			var system = document.getElementById('system');
			if (system != null) {
				system[ui.window.contains(system) ? 'remove' : 'hide']();
			}
			return system;
		};
		var system = Start();
		//初始化函数，隐藏无名杀的背景等
		var End = function(dialog, avatar, time) {
			for (let i = 0; i < hideList.length; i++) {
				if(hideList[i]) ui.window.appendChild(hideList[i]);
				if (i < hideList.length - 1) {
					if(hideList[i]) hideList[i].show();
				}
			}
			if (Object.prototype.toString.call(system) == "[object HTMLDivElement]") {
				ui.window.appendChild(system);
				system.show();
			}
			ui.background.style.backgroundImage = Image;
			dialog && dialog.remove();
			avatar && avatar.remove();
			time && clearInterval(time);
			ui.window.contains(juqing_audio) && ui.window.removeChild(juqing_audio);
			ui.window.contains(juqing_audio2) && ui.window.removeChild(juqing_audio2);
			div_break && div_break.remove();
			for (let i = 0; i < divList.length; i++) {
				typeof divList[i].remove == 'function' && divList[i].remove();
			}
			var List = staticList.concat(dialogList);
			for (let i = 0; i < List.length; i++) {
				if(!ui.window||!List[i]) continue;
				ui.window.appendChild(List[i]);
				if (dialogList.contains(List[i]) && !staticList.contains(List[i])) {
					List[i].show();
				}
			}
			game.isShowingDrama = false;
			_status.paused2 = false;
			if(content.end&&typeof content.end.func=='function'){
				content.end.func(content.end.func_obj);
			}
		};
		//结束函数，还原无名杀的背景
		var div_break = document.createElement("div");
		div_break.style.cssText='display:block;position:absolute;top:0px;left:0px;width:100px;height:100px;background-repeat:no-repeat;';
		window.ykCacheSetImage('https://raw.fastgit.org/qxqdpcq/yunkong/main/extension/comback.jpg',div_break,true,'100% 100%');
		div_break.addEventListener('click', function() {
			End(chat, avatar_div, interval);
		});
		ui.window.appendChild(div_break);
		content.person=person;
		List = content; //通过window.juqing_drama读取剧情数据
		var Listnum = 0;
		var str;
		var avatar;
		var juqing_while = function() {
			for (var i in List[Listnum]) {
				switch (i) {
					case 'say':
						str = List[Listnum][i];
						break;
					case 'avatar':
						if(List.person) avatar=List.person;
						else avatar = List[Listnum][i];
						break;
					case 'background':
						var urlString = List[Listnum][i];
						window.ykCacheSetImage(urlString,ui.background,true,'cover');
						break;
					case 'fuc':
						List[Listnum][i](avatar,List.person);
						break;
					case 'backgroundAudio':
						if (ui.window.contains(juqing_audio)) {
							ui.window.removeChild(juqing_audio);
						}
						if(name!='none') juqing_audio.src = decodeURI(lib.assetURL + `extension/云空/audio/${name}/${List[Listnum][i]}`);
						ui.window.appendChild(juqing_audio);
						break;
					case 'audio':
						if (ui.window.contains(juqing_audio2)) {
							ui.window.removeChild(juqing_audio2);
						}
						if(name!='none') juqing_audio2.src = decodeURI(lib.assetURL + `extension/云空/audio/${name}/${List[Listnum][i]}`);
						ui.window.appendChild(juqing_audio2);
						break;
				}
			}
		};
		juqing_while();
		var avatar_div = document.createElement("div");
		avatar_div.style.cssText='height:300px;width:269px;bottom:0px;left:0px;z-index:99999999;text-align:center;font-size:20px;line-height:30px;font-family:shousha;box-shadow:none;';
		ui.window.appendChild(avatar_div);
		var avatarshow = function() {
			if (avatar != undefined) {
				avatar_div.style.height = '300px';
				avatar_div.style['background-color'] = 'rgba(0,0,0,0.4)';
				window.ykCacheSetImage('https://raw.fastgit.org/qxqdpcq/yunkong/main/extension/'+avatar+'.jpg',avatar_div,true,'cover');
				avatar_div.style.borderRadius = '5px';
				avatar_div.innerHTML = get.translation(avatar);
			} else {
				avatar_div.style.borderRadius = '';
				avatar_div.style['background-color'] = 'rgba(255,192,203,0.7)';
				avatar_div.style.height = '240px';
				avatar_div.style.backgroundImage = '';
				avatar_div.innerHTML = '';
			}
		};
		var chat = document.createElement("div");
		chat.style.cssText='height:240px;width:calc(100% - 269px);bottom:0px;left:269px;overflow-x:hidden;overflow-y:scroll;z-index:99999999;box-shadow:none;background-color:rgba(255,192,203,0.7);text-align:left;font-size:20px;font-family:shousha;';
		lib.setScroll(chat);
		ui.window.appendChild(chat);
		avatarshow();
		chat.innerHTML = '<br><span style="color:black;font-size:20px;font-weight:400;font-family:shousha"><b>';
		var num = 0;
		var interval = setInterval(function() {
			if (str && str[num]) {
				chat.innerHTML += '<span style="color:black;font-size:20px;font-weight:400;font-family:shousha"><b>'+str[num]+'</b></span>';
				num++;
			}
		}, 150);
		chat.onclick = function() {
			avatar = undefined;
			if (num < str.length - 1) {
				var str1 = '<br><span style="color:black;font-size:20px;font-weight:400;font-family:shousha"><b>' + str;
				chat.innerHTML = str1;
				num = str.length;
			} else {
				chat.innerHTML = '<br><span style="color:black;font-size:20px;font-weight:400;font-family:shousha"><b>';
				Listnum++;
				if (Listnum == List.length) {
					End(chat, avatar_div, interval);
					return;
				}
				juqing_while();
				num = 0;
				avatarshow();
			}
		};
		avatar_div.onclick = function() {
			if (avatar == undefined) {
				chat.onclick();
			}
		};
	};
	window.ykTakeDesition = function(name){
		if(lib.ykTakeDesition&&lib.ykTakeDesition==true) return ;
		lib.ykTakeDesition=true;
		var dialog2={};
		var background=ui.create.div('hidden');
		background.setBackgroundImage('extension/云空/Choose_Bg.jpg');
		background.classList.add('popped');
		background.classList.add('static');
		background.style.cssText='height:40%;width:30%;left:30%;top:30%;z-index:99999999999999;text-align:center;background-color:black;opacity:0.8;border-radius:8px;';
		background.setBackgroundImage('extension/云空/background.gif');
		background.style.backgroundSize="100% 100%";
		if(lib.qxq_dialogClose&&lib.qxq_dialogClose==true) return ;
		ui.window.appendChild(background);
		dialog2.background=background;
		
		var choose1=ui.create.div('.menubutton.round','',function(){
			window.sendGift=function(name){
				alert('暂未开放哦！敬请期待！');
			}
			window.sendGift(this.name);
		});
		choose1.style.cssText='height:20%;width:70%;left:15%;top:4%;text-align:center;border-radius:8px;';
		choose1.name=name;
		choose1.innerHTML='送礼-'+'<font color=red>'+get.translation(name)+'</font>';
		background.appendChild(choose1);
		window.yk_clickFK(choose1);
		
		if(lib.config.qxq_YK_person.friendness[name]>=20){
			var choose2=ui.create.div('.menubutton.round','',function(){
				window.visitHimHer=function(name){
					alert('暂未开放哦！敬请期待！');
				}
				window.visitHimHer(this.name);
			});
			choose2.innerHTML='拜访-'+'<font color=red>'+get.translation(name)+'</font>';
		}
		else{
			var choose2=ui.create.div('.menubutton.round','<font color=red>🔒</font>',function(){
				if(game.sayyk&&typeof game.sayyk=='function'){game.sayyk('该角色好感度未达到要求，此选项未解锁！');}
			});
		}
		choose2.style.cssText='height:20%;width:70%;left:15%;top:28%;text-align:center;border-radius:8px;';
		choose2.name=name;
		background.appendChild(choose2);
		window.yk_clickFK(choose2);
		
		if(lib.config.qxq_YK_person.friendness[name]>=60){
			var choose3=ui.create.div('.menubutton.round','',function(){
				window.appointment=function(name){
					alert('暂未开放哦！敬请期待！');
				}
				window.appointment(this.name);
			});
			choose3.innerHTML='邀约-'+'<font color=red>'+get.translation(name)+'</font>';
		}
		else{
			var choose3=ui.create.div('.menubutton.round','<font color=red>🔒</font>',function(){
				if(game.sayyk&&typeof game.sayyk=='function'){game.sayyk('该角色好感度未达到要求，此选项未解锁！');}
			});
		}
		choose3.style.cssText='height:20%;width:70%;left:15%;top:52%;text-align:center;border-radius:8px;';
		choose3.name=name;
		background.appendChild(choose3);
		window.yk_clickFK(choose3);
		
		if(lib.config.qxq_YK_person.friendness[name]>=80){
			var choose4=ui.create.div('.menubutton.round','',function(){
				window.express=function(name){
					alert('暂未开放哦！敬请期待！');
				}
				window.express(this.name);
			});
			choose4.innerHTML='表白-'+'<font color=red>'+get.translation(name)+'</font>';
		}
		else{
			var choose4=ui.create.div('.menubutton.round','<font color=red>🔒</font>',function(){
				if(game.sayyk&&typeof game.sayyk=='function'){game.sayyk('该角色好感度未达到要求，此选项未解锁！');}
			});
		}
		choose4.style.cssText='height:20%;width:70%;left:15%;top:76%;text-align:center;border-radius:8px;';
		choose4.name=name;
		background.appendChild(choose4);
		window.yk_clickFK(choose4);
		
		var func2=function(){
			if(lib.config['extension_云空_ykbag_stop']!=false&&_status.yk_intro_showDialogs==undefined) game.resume2();
			for(var i in dialog2){
				dialog2[i].delete();
				delete dialog2[i];
			};
			lib.ykTakeDesition=false;
			window.ykCloseDesition=null;
			if(_status.yk_intro_showDialogs!=undefined) _status.yk_intro_showDialogs();
		};
		window.ykCloseDesition=func2;
		var div=ui.create.div('.menubutton.round','×',function(){
			func2();
		});
		div.style.top='5px';
		div.style.left='calc(100% - 55px)';
		div.style['zIndex']=1000;
		background.appendChild(div);
		window.yk_clickFK(div);
	}
	if(!lib.config.ykCharacterSkin) game.saveConfig('ykCharacterSkin',{});
	if(!lib.config.ykCharacterSkin.myChoose){lib.config.ykCharacterSkin.myChoose={};game.saveConfig('ykCharacterSkin',{});}
	game.ykHasExtension = function(str){
		return lib.config.extensions && lib.config.extensions.contains(str) && lib.config['extension_'+str+'_enable'];
	};
	window.ykChangeSkin=function(){
		if(window.ykcloseCs&&window.ykcloseCs!=null&&typeof window.ykcloseCs=='function'){window.ykcloseCs();return ;}
		if(typeof window.ykcloseBgM=='function') window.ykcloseBgM();
		if(lib.qxq_dialogClose&&lib.qxq_dialogClose==false) return ;
		lib.qxq_dialogClose=false;
		if(game.ykHasExtension('千幻聆音')) alert('检测到您已安装和开启扩展【千幻聆音】，【云空】武将能兼容【千幻聆音】的换肤功能，可直接在武将页面切换皮肤，但本功能与【千幻聆音】部分冲突，将导致更换失败！使用【千幻聆音】更换【云空】武将皮肤前，请确保该武将在本功能中已切换回【原皮肤】！');
		var dialogskin={};
		window.backgroundskin=ui.create.div('hidden');
		window.backgroundskin.classList.add('popped');
		window.backgroundskin.classList.add('static');
		window.backgroundskin.style.height='calc(100%)';
		window.backgroundskin.style.width='calc(100%)';
		window.backgroundskin.style.left='0px';
		window.backgroundskin.style.top='0px';
		window.backgroundskin.style.backgroundColor='black';
		window.backgroundskin.style.opacity=0.8;
		window.backgroundskin.setBackgroundImage('extension/云空/background.gif');
		window.backgroundskin.style.backgroundSize="100% 100%";
		window.backgroundskin.style['z-index']=99999999;
		ui.window.appendChild(window.backgroundskin);
		dialogskin.background=window.backgroundskin;
		var characterBag=ui.create.div();
		characterBag.style.height='calc(100%)';
		characterBag.style.width='calc(100%)';
		characterBag.style.left='0px';
		characterBag.style.top='0px';
		characterBag.style.borderRadius='5px';
		characterBag.style['text-align']='left';
		characterBag.style['overflow-x']='hidden';
		characterBag.style['overflow-y']='scroll';
		lib.setScroll(characterBag);
		window.backgroundskin.appendChild(characterBag);
		
		var nameList=[];
		var bossList=lib.qxq_yk_bossList;
		for(var i=0;i<lib.config.YKcharacterNameList.length;i++){
			for(var name in lib.character){
				if(lib.config.YKcharacterNameList[i].indexOf(name)!=-1&&bossList.indexOf(name)==-1){
					nameList.push(name);
				}
			}
		}
		for(var name2 of lib.qxq_yk_bossList) nameList.push(name2);
		for(var i=0;i<nameList.length;i++){
			var width=200;
			var height=250;
			var div=ui.create.div('.menubutton.round','',function(){
				var character=this.name;
				var chooseList=ui.create.dialog('hidden');
				chooseList.classList.add('popped');
				chooseList.classList.add('static');
				chooseList.style.height='100%';
				chooseList.style.width='100%';
				chooseList.style.left='0%';
				chooseList.style.top='0%';
				chooseList.style.transition='all 0.5s';
				chooseList.style['text-align']='left';
				window.ykcloseCs();
				 var info='<li><b>当前选择更换皮肤的武将：'+get.translation(character)+'</b><br>';
				info+='<b>选择要更换的皮肤</b><br>';
				chooseList.innerHTML='<span style="font-size:20px;font-weight:400;font-family:shousha"><b>'+info+'</b></span>';
				chooseList.style['overflow-x']='hidden';
				chooseList.style['overflow-y']='scroll';
				lib.setScroll(chooseList);
				ui.window.appendChild(chooseList);
				
				var skinList=['原皮肤'];
				if(lib.config.ykCharacterSkin.skinList[character]) for(var skin of lib.config.ykCharacterSkin.skinList[character]) skinList.push(skin);
				for(var skin of skinList){
					var divx=ui.create.div('.menubutton.round','',function(){
						lib.config.ykCharacterSkin.myChoose[this.character]=(this.name=='原皮肤'?'':this.name);
						game.saveConfig('ykCharacterSkin',lib.config.ykCharacterSkin);
						alert('角色【'+get.translation(this.character)+'】更换皮肤——'+get.translation(this.name)+'成功！重启游戏后生效！');
						chooseList.delete();
						if(typeof window.ykcloseCs=='function') window.ykcloseCs();
						setTimeout(function(){window.ykChangeSkin();},500);
					});
					divx.name=skin;
					divx.setBackgroundImage('extension/云空/'+(skin=='原皮肤'?character:(character+'/'+character+'_'+skin))+'.jpg');
					divx.character=character;
					divx.style.backgroundSize="cover";
					divx.style.height='250px';
					divx.style.width='200px';
					divx.style.top='20px';
					divx.style.left='15px';
					divx.style.borderRadius='8px';
					divx.style.position='relative';
					chooseList.appendChild(divx);
					window.yk_clickFK(divx);
				}
				
				var funcOut=function(){
					chooseList.hide();
				};
				var divOut=ui.create.div('.menubutton.round','×',function(){
					funcOut();
				});
				divOut.style.top='5px';
				divOut.style.left='calc(100% - 55px)';
				divOut.style['zIndex']=1000;
				chooseList.appendChild(divOut);
				window.yk_clickFK(divOut);
			});
			if(lib.config.ykCharacterSkin.myChoose[nameList[i]]==undefined){lib.config.ykCharacterSkin.myChoose[nameList[i]]='';game.saveConfig('ykCharacterSkin',lib.config.ykCharacterSkin);}
			if(lib.config.ykCharacterSkin.myChoose[nameList[i]]==''||lib.config.ykCharacterSkin.myChoose[nameList[i]]==undefined) div.setBackgroundImage('extension/云空/'+nameList[i]+'.jpg');
			else div.setBackgroundImage('extension/云空/'+nameList[i]+'/'+nameList[i]+'_'+lib.config.ykCharacterSkin.myChoose[nameList[i]]+'.jpg');
			div.style.backgroundSize="cover";
			div.name=nameList[i];
			div.style['text-align']='center';
			div.style.height=height+'px';
			div.style.width=width+'px';
			div.style.top='20px';
			div.style.left='15px';
			div.style.borderRadius='8px';
			div.style.position='relative';
			characterBag.appendChild(div);
			window.yk_clickFK(div);
		}
		var funcskin=function(){
			for(var i in dialogskin){
				dialogskin[i].delete();
				delete dialogskin[i];
			};
			lib.qxq_dialogClose=true;
			lib.ykTakeDesition=false;
			if(_status.yk_intro_showDialogs!=undefined) _status.yk_intro_showDialogs();
			window.ykcloseCs=null;
			if(window.ykCloseDesition!=undefined&&window.ykCloseDesition!=null&&typeof window.ykCloseDesition=='function') window.ykCloseDesition();
		};
		window.ykcloseCs=funcskin;
		var div=ui.create.div('.menubutton.round','×',function(){
			funcskin();
		});
		div.style.top='5px';
		div.style.left='calc(100% - 55px)';
		div.style['zIndex']=1000;
		window.backgroundskin.appendChild(div);
		window.yk_clickFK(div);
	}
	window.ykVisit2 = function(name){
		ui.click.configMenu();
		if(lib.config.qxq_YK_person.friendness[name]==undefined){
			var content=[{
				pages : 1 ,
				say: '出现未知错误啦！',
				avatar:'none',
				fuc: function(avatar,person) {
				},
			}];
			game.personChat(content,name);
			return ;
		}
		else{
			if(lib.config.qxq_YK_person.friendness[name]>100){lib.config.qxq_YK_person.friendness[name]=100;game.saveConfig('qxq_YK_person',lib.config.qxq_YK_person);}
			if(lib.config.qxq_YK_person.friendness[name]<-100){lib.config.qxq_YK_person.friendness[name]=-100;game.saveConfig('qxq_YK_person',lib.config.qxq_YK_person);}
			//生日
			var birth=lib.config.qxq_YK_person.birthday[name];
			var birthMonth=birth.slice(0,birth.indexOf('/'));
			var birthDay=birth.slice(birth.indexOf('/')+1,birth.length);
			if(window.checkOnlineTime('',birthMonth,birthDay)){
				var content=[{
					pages : 1 ,
					say:lib.config.qxq_YK_personChat[name].birthday,
					avatar:'none',
					fuc: function(avatar,person) {
						window.ykTakeDesition(person);
					},
				}];
				game.personChat(content,name);
				return ;
			}
			var friendness=lib.config.qxq_YK_person.friendness[name];
			var strf=''+friendness;
			if(strf.indexOf('.')!=-1){friendness=Math.floor(friendness);}
			if(friendness<0){
				while(['-100','-80','-60','-40','-20','0'].indexOf(friendness+'')==-1){
					friendness++;
				}
				friendness=friendness+'';
				for(var i in lib.config.qxq_YK_personChat[name]){
					if(i==friendness){
						var content=[{
							pages : 1 ,
							say:lib.config.qxq_YK_personChat[name][friendness],
							avatar:'none',
							fuc: function(avatar,person) {
								window.ykTakeDesition(person);
							},
						}];
						game.personChat(content,name);
					}
				}
			}
			else{
				while(['100','80','60','40','20','0'].indexOf(friendness+'')==-1){
					friendness--;
				}
				friendness=friendness+'';
				for(var i in lib.config.qxq_YK_personChat[name]){
					if(i==friendness){
						var content=[{
							pages : 1 ,
							say:lib.config.qxq_YK_personChat[name][friendness],
							avatar:'none',
							fuc: function(avatar,person) {
								window.ykTakeDesition(person);
							},
						}];
						game.personChat(content,name);
					}
				}
			}
		}
	};
	window.ykVisit = function(name){
		if(name){
			window.ykVisit2(name);
			return ;
		}
		if(typeof window.ykcloseBgM=='function') window.ykcloseBgM();
		ui.click.configMenu();
		if(window.ykcloseBg&&window.ykcloseBg!=null&&typeof window.ykcloseBg=='function'){window.ykcloseBg();return ;}
		if(lib.qxq_dialogClose&&lib.qxq_dialogClose==false) return ;
		lib.qxq_dialogClose=false;
		var dialog1={};
		window.background=ui.create.div('hidden');
		window.background.classList.add('popped');
		window.background.classList.add('static');
		window.background.style.cssText='height:100%;width:100%;left:0px;top:0px;background-color:black;opacity:0.8;z-index:99999999;';
		window.background.setBackgroundImage('extension/云空/background.gif');
		window.background.style.backgroundSize="100% 100%";
		ui.window.appendChild(window.background);
		dialog1.background=window.background;
		var characterBag=ui.create.div();
		characterBag.style.cssText='height:100%;width:100%;left:0px;top:0px;border-radius:5px;text-align:left;overflow-x:hidden;overflow-y:scroll;';
		lib.setScroll(characterBag);
		window.background.appendChild(characterBag);
		
		var nameList=[];
		var bossList=lib.qxq_yk_bossList;
		for(var i=0;i<lib.config.YKcharacterNameList.length;i++){
			for(var name in lib.character){
				if(name=='qxq_yk_xiaoqiao') continue;
				if(lib.config.YKcharacterNameList[i].indexOf(name)!=-1&&bossList.indexOf(name)==-1){
					nameList.push(name);
				}
			}
		}
		for(var i=0;i<nameList.length;i++){
			var width=200;
			var height=250;
			var div=ui.create.div('.menubutton.round','',function(){
				if(lib.config.qxq_YK_person.friendness[this.name]==undefined){
					var content=[{
						pages : 1 ,
						say:'出现未知错误啦！',
						avatar:'none',
						fuc: function(avatar,person) {
						},
					}];
					game.personChat(content,this.name);
					return ;
				}
				else{
					if(lib.config.qxq_YK_person.friendness[this.name]>100){lib.config.qxq_YK_person.friendness[this.name]=100;game.saveConfig('qxq_YK_person',lib.config.qxq_YK_person);}
					if(lib.config.qxq_YK_person.friendness[this.name]<-100){lib.config.qxq_YK_person.friendness[this.name]=-100;game.saveConfig('qxq_YK_person',lib.config.qxq_YK_person);}
					//生日
					var birth=lib.config.qxq_YK_person.birthday[this.name];
					var birthMonth=birth.slice(0,birth.indexOf('/'));
					var birthDay=birth.slice(birth.indexOf('/')+1,birth.length);
					if(window.checkOnlineTime('',birthMonth,birthDay)){
						var content=[{
							pages : 1 ,
							say:lib.config.qxq_YK_personChat[this.name].birthday,
							avatar:'none',
							fuc: function(avatar,person) {
							},
						}];
						game.personChat(content,this.name);
						window.ykTakeDesition(this.name);
						return ;
					}
					var friendness=lib.config.qxq_YK_person.friendness[this.name];
					var strf=''+friendness;
					if(strf.indexOf('.')!=-1){friendness=Math.floor(friendness);}
					if(friendness<0){
						while(['-100','-80','-60','-40','-20','0'].indexOf(friendness+'')==-1){
							friendness++;
						}
						friendness=friendness+'';
						for(var i in lib.config.qxq_YK_personChat[this.name]){
							if(i==friendness){
								var content=[{
									pages : 1 ,
									say:lib.config.qxq_YK_personChat[this.name][friendness],
									avatar:'none',
									fuc: function(avatar,person) {
									},
								}];
								game.personChat(content,this.name);
								window.ykTakeDesition(this.name);
							}
						}
					}
					else{
						while(['100','80','60','40','20','0'].indexOf(friendness+'')==-1){
							friendness--;
						}
						friendness=friendness+'';
						for(var i in lib.config.qxq_YK_personChat[this.name]){
							if(i==friendness){
								var content=[{
									pages : 1 ,
									say:lib.config.qxq_YK_personChat[this.name][friendness],
									avatar:'none',
									fuc: function(avatar,person) {
									},
								}];
								game.personChat(content,this.name);
								window.ykTakeDesition(this.name);
							}
						}
					}
				}
			});
			div.name=nameList[i];
			div.style.cssText='text-align:center;height:'+height+'px;width:'+width+'px;top:20px;left:15px;border-radius:8px;position:relative;background-position:center center;';
			div.setBackground(nameList[i],'character');
			div.style.backgroundSize='cover';
			characterBag.appendChild(div);
			window.yk_clickFK(div);
		}
		var func1=function(){
			for(var i in dialog1){
				dialog1[i].delete();
				delete dialog1[i];
			};
			lib.qxq_dialogClose=true;
			lib.ykTakeDesition=false;
			if(_status.yk_intro_showDialogs!=undefined) _status.yk_intro_showDialogs();
			window.ykcloseBg=null;
			if(window.ykCloseDesition!=undefined&&window.ykCloseDesition!=null&&typeof window.ykCloseDesition=='function') window.ykCloseDesition();
		};
		window.ykcloseBg=func1;
		var div=ui.create.div('.menubutton.round','×',function(){
			func1();
		});
		div.style.top='5px';
		div.style.left='calc(100% - 55px)';
		div.style['zIndex']=1000;
		window.background.appendChild(div);
		window.yk_clickFK(div);
	}
	//配置角色
	if(!window.ykEquip) window.ykEquip=function(){if(typeof window.ykcloseBgM=='function') window.ykcloseBgM();alert('网络不佳，请稍后再试！');};
	lib.init.js(lib.assetURL+'extension/云空','equip',function(){
	},function(){
		window.ykloadjs("equip");
	});
	//导出存档
	game.yk_makeNewConfig=function(str,key){
		if(str){
			if(!key) return ;
			if(lib.config.extensions&&lib.config.extensions.contains('云空存档')) game.removeExtension('云空存档');
			var isNum=function(str){
				if(!str) return false;
				if(typeof parseFloat(''+str)=='number'||typeof parseInt(''+str)=='number') return true;
				return false;
			}
			game.getFileList("extension",function(fold,file){
				var wjs=Array.from(fold);
				var getDate=function(){
					var date=new Date();
					var day=date.getDate();
					var month=date.getMonth()+1;
					var year=date.getYear()+1900;
					return '存档时间：'+year+'/'+month+'/'+day;
				}
				var getCharacter=function(){
					var ykCharacterListx='<br><li>拥有武将：';
					var ykCharacterList='';
					for(var i=0;i<lib.config.YKcharacterNameList.length;i++){
						var character=lib.config.YKcharacterNameList[i];
						var name=character.slice(0,character.indexOf('-'));
						var color='black';
						if(lib.config.qxq_YK_person.rank&&lib.config.qxq_YK_person.rank[name].indexOf('超稀-限定')!=-1) color='colorful';
						if(lib.config.qxq_YK_person.rank&&lib.config.qxq_YK_person.rank[name].indexOf('天级')!=-1) color='red';
						if(lib.config.qxq_YK_person.rank&&lib.config.qxq_YK_person.rank[name].indexOf('地级')!=-1) color='purple';
						if(lib.config.qxq_YK_person.rank&&lib.config.qxq_YK_person.rank[name].indexOf('玄级')!=-1) color='cyan';
						if(lib.config.qxq_YK_person.rank&&lib.config.qxq_YK_person.rank[name].indexOf('黄级')!=-1) color='yellow';
						if(lib.config.qxq_YK_person.rank&&lib.config.qxq_YK_person.rank[name].indexOf('凡级')!=-1) color='grey';
						if(color!='colorful') ykCharacterList+='<font color='+color+'>'+get.translation(name)+'</font>';
						else ykCharacterList+="<body><samp id='"+get.translation(name)+"'>"+get.translation(name)+"</samp></body><style>#"+get.translation(name)+"{animation:change 7s linear 0s infinite;}@keyframes change{0% {color:#FF0000;}10%{color:#FF7F00;}20%{color: #FFFF00;}30%{color:#00FF00;}40% {color:#00FFFF;}50%{color: #0000FF;}60%{color: #8B00FF;}70%{color: #0000FF;}75%{color: #00FFFF ;}80%{color:#00FF00;}85%{color:#FFFF00 ;}90%{color:  #FF7F00;}100%{color: #FF0000;}}</style>";
						ykCharacterList+='、';
					}
					if(ykCharacterList.length) ykCharacterList=ykCharacterList.slice(0,ykCharacterList.length-1);
					else ykCharacterList='无';
					return ykCharacterListx+ykCharacterList;
				}
				var getBag=function(){
					var ykBag='<br><li>物品信息：';
					var content='';
					for(var item in lib.config.yk_myBag) if(['predestined_fate','sky_crying','star_dust'].indexOf(item)==-1){
						if(lib.config.yk_myBag[item]) content+='<br>【<b>'+get.translation(item)+'</b>】';
						if(typeof lib.config.yk_myBag[item].num=='number') content+='<br>数量：'+lib.config.yk_myBag[item].num;
						if(typeof lib.config.yk_myBag[item].rank1=='number') content+='<br>'+(lib.ykEquip[item]==undefined?'领悟等级：':'强化等级：')+lib.config.yk_myBag[item].rank1;
						if(typeof lib.config.yk_myBag[item].rank2=='number') content+='<br>进阶等级：'+lib.config.yk_myBag[item].rank2;
						content+='<br>';
					}
					return ykBag+(content.length?content:'无');
				}
				var getCharacter_ykInfo=function(key){
					if(!key) return ;
					if(lib.config.YKcharacterNameList&&lib.config.YKcharacterNameList.length){
						var ykCharacterList='';
						for(var i=0;i<lib.config.YKcharacterNameList.length;i++){
							ykCharacterList+='--'+lib.config.YKcharacterNameList[i];
						}
					}
					else var ykCharacterList='--none';
					if(lib.config.yk_myBag) for(var item in lib.config.yk_myBag){
						if(lib.config.yk_myBag[item]){
							ykCharacterList+='·'+item+'-'+(typeof lib.config.yk_myBag[item].num=='number'?lib.config.yk_myBag[item].num:'null')+'-'+(typeof lib.config.yk_myBag[item].rank1=='number'?lib.config.yk_myBag[item].rank1:'null')+'-'+(typeof lib.config.yk_myBag[item].rank2=='number'?lib.config.yk_myBag[item].rank2:'null');
						}
					}
					var lockString=["!","#","$","%","^","&","(",")","[","]","=","<",">",",","~","`",":",";","'","|","{","}"," ","♈","♉","♊","♋","♌","♎","♏","♐","♑","♓","♒","♍","☮","☮","☯","☦","☸","△","▽","○","◇","□","☆","▷","◁","♤","♡","♢","♧","▲","▼","●","◆","■","★","▶","◀","♠","♥","♦","♣","☼","☽","☺","◐","☑","√","✔","☜","☝","☞","㏂","☀","☾","☹","◑","☒","×","✘","☚","☟","☛","㏘","▪","•","‥","…","▁","▂","▃","▄","▅","▆","▇","█","∷","※"];
					lockString=lockString.randomGets(65);
					var str='';
					for(var strx of lockString){
						str+=strx;
					}
					var lock={
						'0':str.slice(0,1),
						'1':str.slice(1,2),
						'2':str.slice(2,3),
						'3':str.slice(3,4),
						'4':str.slice(4,5),
						'5':str.slice(5,6),
						'6':str.slice(6,7),
						'7':str.slice(7,8),
						'8':str.slice(8,9),
						'9':str.slice(9,10),
						'a':str.slice(10,11),
						'b':str.slice(11,12),
						'c':str.slice(12,13),
						'd':str.slice(13,14),
						'e':str.slice(14,15),
						'f':str.slice(15,16),
						'g':str.slice(16,17),
						'h':str.slice(17,18),
						'i':str.slice(18,19),
						'j':str.slice(19,20),
						'k':str.slice(20,21),
						'l':str.slice(21,22),
						'm':str.slice(22,23),
						'n':str.slice(23,24),
						'o':str.slice(24,25),
						'p':str.slice(25,26),
						'q':str.slice(26,27),
						'r':str.slice(27,28),
						's':str.slice(28,29),
						't':str.slice(29,30),
						'u':str.slice(30,31),
						'v':str.slice(31,32),
						'w':str.slice(32,33),
						'x':str.slice(33,34),
						'y':str.slice(34,35),
						'z':str.slice(35,36),
						'A':str.slice(36,37),
						'B':str.slice(37,38),
						'C':str.slice(38,39),
						'D':str.slice(39,40),
						'E':str.slice(40,41),
						'F':str.slice(41,42),
						'G':str.slice(42,43),
						'H':str.slice(43,44),
						'I':str.slice(44,45),
						'J':str.slice(45,46),
						'K':str.slice(46,47),
						'L':str.slice(47,48),
						'M':str.slice(48,49),
						'N':str.slice(49,50),
						'O':str.slice(50,51),
						'P':str.slice(51,52),
						'Q':str.slice(52,53),
						'R':str.slice(53,54),
						'S':str.slice(54,55),
						'T':str.slice(55,56),
						'U':str.slice(56,57),
						'V':str.slice(57,58),
						'W':str.slice(58,59),
						'X':str.slice(59,60),
						'Y':str.slice(60,61),
						'Z':str.slice(61,62),
						'_':str.slice(62,63),
						'-':str.slice(63,64),
						'·':str.slice(64,65),
					};
					var str2=str;
					while(ykCharacterList.length){
						var i=ykCharacterList.slice(0,1);
						str2+=lock[i];
						ykCharacterList=ykCharacterList.slice(1,ykCharacterList.length);
					}
					str2=escape(str2);
					while(str2.indexOf('%u')!=-1){
						var str2x=str2.slice(0,str2.indexOf('%u'));
						var str2y=str2.slice(str2.indexOf('%u')+2,str2.length);
						str2=str2x+'з'+str2y;
					}
					while(str2.indexOf('%')!=-1){
						var str2x=str2.slice(0,str2.indexOf('%'));
						var str2y=str2.slice(str2.indexOf('%')+1,str2.length);
						str2=str2x+'/x'+str2y;
					}
					return [str2,key];
				}
				var ff=function(kzm){
					var list=getCharacter_ykInfo(key);
					var content='	'+'game.saveConfig("ykSaveConfigRead",["'+list[0]+'","'+list[1]+'"]);';
					var Info=""+getDate()+getCharacter()+getBag()+'<br><li><b>此扩展仅为存档扩展，将在云空菜单里【读取存档】后自动删除此扩展，保存新存档时，请先删除旧【云空存档】扩展！';
					var ss="    ",sss=ss+ss;
					var mstr='{name:"云空存档",content:function (config,pack){\n'+content+'\n},precontent:function (){\n'+ss+'\n},editable:false,config:{},help:{},package:{\n'+ss+'character:{\n'+sss+'character:{\n'+sss+'},\n'+sss+'translate:{\n'+sss+'},\n'+ss+'},\n'+ss+'card:{\n'+sss+'card:{\n'+sss+'},\n'+sss+'translate:{\n'+sss+'},\n'+sss+'list:[],\n'+ss+'},\n'+ss+'skill:{\n'+sss+'skill:{\n'+sss+'},\n'+sss+'translate:{\n'+sss+'},\n'+ss+'},intro:"'+Info+'",author:"云空玩家",diskURL:"",forumURL:"",version:"1.0",},files:{"character":[],"card":[],"skill":[]}}';
					var zzkzsj={'extension.js':'game.import("extension",function(lib,game,ui,get,ai,_status){return '+mstr+'})'};
					game.importExtension(zzkzsj,function(){});
				};
				var f=function(str,ck){
					var enableExtension=function(extName){
						if(!extName) return false;
						if(!lib.config.extensions) lib.config.extensions=[];
						lib.config.extensions.push(extName);
						game.saveConfig('extensions',lib.config.extensions);
						lib.config['extension_'+extName+'_enable']=true;
						game.saveConfig('extension_'+extName+'_enable',lib.config['extension_'+extName+'_enable']);
					}
					if(!str||(str&&str.length==0)) return;
					var fail=[],succ=[];
					if(ck.indexOf(str)>-1) fail.add(str);
					else if(succ.indexOf(str)>-1) succ.add(str);
					ff(str);
					if(fail.length==0) if(typeof game.sayyk=='function') game.sayyk("导出存档成功，请确认是否存在【云空存档】扩展！");
					else if(typeof game.sayyk=='function'){enableExtension('云空存档');game.sayyk('尝试修复存档已完成，若重启后仍未有存档，请联系扩展作者尽快修复bug！');}
				};
				f(str,wjs);
			});
			alert('已加载【云空存档】，重启后生效！');
			setTimeout(function(){game.reload();},3000);
		}
		else alert("未知错误！");
	};
	game.importSaveConfig=function(str){
		if(str){
			if(str.length==0){alert('您未输入内容！');return ;}
			if(str.length<4||str.length>9){alert('字符长度不合要求！');return ;}
			game.yk_makeNewConfig('云空存档',str);
		}
	}
	window.saveConfig=function(){
		if(typeof window.ykcloseBgM=='function') window.ykcloseBgM();
		game.prompt("输入4至9位数字、字母或符号，作为此存档密令",game.importSaveConfig);
	}
	//载入存档
	game.checkSaveConfig=function(str){
		if(str){
			if(str.length==0){alert('您未输入内容！');return ;}
			if(lib.config.ykSaveConfigRead[1]!=true&&str==lib.config.ykSaveConfigRead[1]) game.readSaveConfig();
			else {alert('密令错误！');return ;}
		}
	}
	game.readSaveConfig=function(){
		if(!lib.config.ykSaveConfigRead[0]){alert('无存档或存档加载失败，请重启后再次尝试！');return ;}
		if(confirm('选择载入新存档，道具【虚空之泪】、【命定之石】与【星河神砂】将不会保留，是否继续？')){
			var str=lib.config.ykSaveConfigRead[0];
			if(typeof str!='string'){alert('数据类型错误！');return ;}
			while(str.indexOf('з')!=-1){
				var strx=str.slice(0,str.indexOf('з'));
				var stry=str.slice(str.indexOf('з')+1,str.length);
				str=strx+'%u'+stry;
			}
			while(str.indexOf('/x')!=-1){
				var strx=str.slice(0,str.indexOf('/x'));
				var stry=str.slice(str.indexOf('/x')+2,str.length);
				str=strx+'%'+stry;
			}
			str=unescape(str);
			var content=str.slice(67,str.length);
			str=str.slice(0,65);
			var lock={
				'0':str.slice(0,1),
				'1':str.slice(1,2),
				'2':str.slice(2,3),
				'3':str.slice(3,4),
				'4':str.slice(4,5),
				'5':str.slice(5,6),
				'6':str.slice(6,7),
				'7':str.slice(7,8),
				'8':str.slice(8,9),
				'9':str.slice(9,10),
				'a':str.slice(10,11),
				'b':str.slice(11,12),
				'c':str.slice(12,13),
				'd':str.slice(13,14),
				'e':str.slice(14,15),
				'f':str.slice(15,16),
				'g':str.slice(16,17),
				'h':str.slice(17,18),
				'i':str.slice(18,19),
				'j':str.slice(19,20),
				'k':str.slice(20,21),
				'l':str.slice(21,22),
				'm':str.slice(22,23),
				'n':str.slice(23,24),
				'o':str.slice(24,25),
				'p':str.slice(25,26),
				'q':str.slice(26,27),
				'r':str.slice(27,28),
				's':str.slice(28,29),
				't':str.slice(29,30),
				'u':str.slice(30,31),
				'v':str.slice(31,32),
				'w':str.slice(32,33),
				'x':str.slice(33,34),
				'y':str.slice(34,35),
				'z':str.slice(35,36),
				'A':str.slice(36,37),
				'B':str.slice(37,38),
				'C':str.slice(38,39),
				'D':str.slice(39,40),
				'E':str.slice(40,41),
				'F':str.slice(41,42),
				'G':str.slice(42,43),
				'H':str.slice(43,44),
				'I':str.slice(44,45),
				'J':str.slice(45,46),
				'K':str.slice(46,47),
				'L':str.slice(47,48),
				'M':str.slice(48,49),
				'N':str.slice(49,50),
				'O':str.slice(50,51),
				'P':str.slice(51,52),
				'Q':str.slice(52,53),
				'R':str.slice(53,54),
				'S':str.slice(54,55),
				'T':str.slice(55,56),
				'U':str.slice(56,57),
				'V':str.slice(57,58),
				'W':str.slice(58,59),
				'X':str.slice(59,60),
				'Y':str.slice(60,61),
				'Z':str.slice(61,62),
				'_':str.slice(62,63),
				'-':str.slice(63,64),
				'·':str.slice(64,65),
			};
			var contentx='';
			while(content.length){
				var i=content.slice(0,1);
				for(var m in lock) if(i==lock[m]){contentx+=m;break;}
				content=content.slice(1,content.length);
			}
			//for(var it_other in lib.config.yk_myBag) if(['predestined_fate','sky_crying','star_dust'].indexOf(it_other)==-1) delete lib.config.yk_myBag[it_other];
			//game.saveConfig('yk_myBag',lib.config.yk_myBag);
			game.saveConfig('yk_myBag',{});
			var Bag;
			if(contentx.length&&contentx.indexOf('·')!=-1){
				Bag=contentx.slice(contentx.indexOf('·')+1,contentx.length)
				var contentx=contentx.slice(0,contentx.indexOf('·'));
			}
			if(Bag){
				var BagList=[];
				while(Bag.length&&Bag.indexOf('·')!=-1){
					var item=Bag.slice(0,Bag.indexOf('·'));
					BagList.push(item);
					Bag=Bag.slice(Bag.indexOf('·')+1,Bag.length);
				}
				if(Bag.length) BagList.push(Bag);
				for(var itemx of BagList){
					var name=itemx.slice(0,itemx.indexOf('-'));
					lib.config.yk_myBag[name]={};
					itemx=itemx.slice(itemx.indexOf('-')+1,itemx.length);
					var num=itemx.slice(0,itemx.indexOf('-'));
					if(num!='null') lib.config.yk_myBag[name].num=parseInt(num);
					itemx=itemx.slice(itemx.indexOf('-')+1,itemx.length);
					var rank1=itemx.slice(0,itemx.indexOf('-'));
					if(rank1!='null') lib.config.yk_myBag[name].rank1=parseInt(rank1);
					var rank2=itemx.slice(itemx.indexOf('-')+1,itemx.length);
					if(rank2!='null') lib.config.yk_myBag[name].rank2=parseInt(rank2);
				}
				game.saveConfig('yk_myBag',lib.config.yk_myBag);
			}
			if(window.yunkong_Character&&window.yunkong_Character.character) for(var ykperson in window.yunkong_Character.character){
				var equipTypeList=['equip1','equip2','equip3','equip4'];//武器、防具、饰品、其他
				for(var item of equipTypeList) game.saveConfig(ykperson+'_'+item,undefined);
				game.saveConfig(ykperson+'_book',undefined);
			}
			var list=[];
			while(contentx.length&&contentx.indexOf('--')!=-1){
				var item=contentx.slice(0,contentx.indexOf('--'));
				list.push(item);
				contentx=contentx.slice(contentx.indexOf('--')+2,contentx.length);
				var equipTypeList=['equip1','equip2','equip3','equip4'];//武器、防具、饰品、其他
				for(var item of equipTypeList) game.saveConfig(contentx.slice(0,contentx.indexOf('-'))+'_'+item,undefined);
				game.saveConfig(contentx.slice(0,contentx.indexOf('-'))+'_book',undefined);
			}
			if(contentx!='none') list.push(contentx);
			game.removeExtension('云空存档');
			game.saveConfig('YKcharacterNameList',list);
			game.saveConfig('ykSaveConfigRead',undefined);
			alert('导入成功，已自动删除原存档，即将自动重启以保存，祝您游戏愉快！');
			setTimeout(function(){game.reload();},3000);
		}
	}
	window.readConfig=function(){
		if(typeof window.ykcloseBgM=='function') window.ykcloseBgM();
		var hasExtension = function(str){
			return lib.config.extensions && lib.config.extensions.contains(str) && lib.config['extension_'+str+'_enable'];
		};
		if(!lib.config.ykSaveConfigRead||!hasExtension('云空存档')){alert('无存档或存档加载失败，请重启后再次尝试！');return ;}
		if(lib.config.ykSaveConfigRead&&lib.config.ykSaveConfigRead[1]!=true) game.prompt("请输入此存档密令",game.checkSaveConfig);
		else game.readSaveConfig();
	}
	//查看成就
	window.ykOpenAchievement = function(){
		if(typeof window.ykcloseBgM=='function') window.ykcloseBgM();
		ui.click.configMenu();
		window.ykloadjs("achievement");
	};
	//打开地图
	window.ykOpenMap = function(){
		if(typeof window.ykcloseBgM=='function') window.ykcloseBgM();
		if(window.ykCloseMAP&&window.ykCloseMAP!=null&&typeof window.ykCloseMAP=='function'){window.ykCloseMAP();return ;}
		var dialogm={};
		window.background=ui.create.div('hidden');
		window.background.style.height='calc(100%)';
		window.background.style.width='calc(100%)';
		window.background.style.left='0px';
		window.background.style.top='0px';
		window.ykCacheSetImage('https://raw.fastgit.org/qxqdpcq/yunkong/main/extension/ykmap.jpg',window.background,true,"100% 100%");
		window.background.style['z-index']=99999;
		ui.window.appendChild(window.background);
		dialogm.background=window.background;
		
		window.mapIntroduce=ui.create.div('hidden');
		window.mapIntroduce.style.cssText ="transition:all 1s;height:60%;width:60%;left:-57%;top:20%;background-color:black;z-index:99999999;";
		window.background.appendChild(window.mapIntroduce);
		window.mapIntroduceName=ui.create.div('');
		window.mapIntroduceName.style.cssText ="height:10%;width:100%;left:0%;top:0%;z-index:999999999;text-align:center;";
		window.mapIntroduceName.innerHTML='<font color=white>背景-地图介绍</font>';
		window.mapIntroduce.appendChild(window.mapIntroduceName);
		window.mapIntroduceContent=ui.create.div('');
		window.mapIntroduceContent.style.cssText ="height:90%;width:90%;left:5%;top:5%;z-index:999999999;text-align:left;background-color:black;";
		window.mapIntroduceContent.targetName='';
		var text;
		var httpRequest = new XMLHttpRequest();
		httpRequest.open("GET",'https://raw.fastgit.org/qxqdpcq/yunkong/main/extension/mapIntroduce.js',true);
		httpRequest.send(null);
		httpRequest.onreadystatechange=function(){
			if (httpRequest.readyState==4&&httpRequest.status==200){
				text=httpRequest.responseText;
				window.mapIntroduceContent.innerHTML='<font color=white>'+text+'</font>';
			}
		};
		window.mapIntroduceContent.style['text-align']='left';
		lib.setScroll(window.mapIntroduceContent);
		window.mapIntroduce.appendChild(window.mapIntroduceContent);
		window.mapIntroduceOpenTitle=function(){
			if(!lib.houseOpen||lib.houseOpen==undefined||lib.houseOpen==false){
				lib.houseOpen=true;
				window.mapIntroduce.style.left='-57%';
				window.mapIntroduceTitle=ui.create.div('.menubutton.round','',window.mapIntroduceOpenTitle);
				window.mapIntroduceTitle.style.height='8%';
				window.mapIntroduceTitle.innerHTML='>';
				window.mapIntroduceTitle.style.width='5%';
				window.mapIntroduceTitle.style.right='0%';
				window.mapIntroduceTitle.style.top='47%';
				window.mapIntroduceTitle.style.borderRadius='0px';
				window.mapIntroduce.appendChild(window.mapIntroduceTitle);
			}
			else{
				lib.houseOpen=false;
				window.mapIntroduce.style.left='20%';
				window.mapIntroduceTitle.innerHTML='<';
			}
		}
		window.mapIntroduceOpenTitle();
		
		window.ykShopList=ui.create.div('hidden');
		window.ykShopList.classList.add('popped');
		window.ykShopList.classList.add('static');
		window.ykShopList.style.cssText ="transition:all 1s;height:100px;left:-550px;top:calc( 100% - 100px );width:570px;";
		window.ykShopList.style.backgroundColor='black';
		window.ykShopList.style['z-index']=99999999;
		window.background.appendChild(window.ykShopList);
		window.ykShopListOC=function(){
			if(!lib.ykstreetOpen){
				lib.ykstreetOpen=true;
				window.ykShopList.style.left='-550px';
				window.ykShopListOCControl.innerHTML='>';
			}
			else{
				lib.ykstreetOpen=false;
				window.ykShopList.style.left='0px';
				window.ykShopListOCControl.innerHTML='<';
			}
		}
		window.ykShopListOCControl=ui.create.div('.menubutton.round','',window.ykShopListOC);
		window.ykShopListOCControl.style.cssText ="height:20px;right:0%;top:calc( 50% - 10px );width:18px;border-radius:0px;";
		window.ykShopListOCControl.innerHTML='>';
		window.ykShopList.appendChild(window.ykShopListOCControl);
		window.ykShopListOC();
		var smallShop=ui.create.div();
		smallShop.style.cssText='left:25px;top:0px;width:100px;height:100px;';
		window.ykCacheSetImage('https://raw.fastgit.org/qxqdpcq/yunkong/main/extension/ykShop1.jpg',smallShop,true,'100% 100%');
		smallShop.onclick=function(){window.ykOpenMap();window.ykOpenShop('small');}
		window.ykShopList.appendChild(smallShop);
		var largeShop=ui.create.div();
		largeShop.style.cssText='left:150px;top:0px;width:100px;height:100px;';
		window.ykCacheSetImage('https://raw.fastgit.org/qxqdpcq/yunkong/main/extension/ykShop2.jpg',largeShop,true,'100% 100%');
		largeShop.onclick=function(){window.ykOpenMap();window.ykOpenShop('middle');}
		window.ykShopList.appendChild(largeShop);
		var auction=ui.create.div();
		auction.style.cssText='left:275px;top:0px;width:100px;height:100px;';
		window.ykCacheSetImage('https://raw.fastgit.org/qxqdpcq/yunkong/main/extension/ykAuction.jpg',auction,true,'100% 100%');
		auction.onclick=function(){window.ykOpenMap();window.ykOpenAuction();};
		window.ykShopList.appendChild(auction);
		
		var div=ui.create.div();
		div.style.height='100%';
		div.style.width='100%';
		div.style.left='0px';
		div.style.top='0px';
		var funcm=function(){
			for(var i in dialogm){
				dialogm[i].delete();
				delete dialogm[i];
			};
			window.ykCloseMAP=null;
			lib.houseOpen=false;
			lib.streetOpen=false;
		};
		window.ykCloseMAP=funcm;
		setTimeout(function(){
			div.onclick=function(){
				funcm();
			};
		},750);
		window.background.appendChild(div);
		var div=ui.create.div('.menubutton.round','×',function(){
			funcm();
		});
		div.style.top='5px';
		div.style.left='calc(100% - 55px)';
		div.style['zIndex']=1000;
		window.background.appendChild(div);
	};
	window.ykElementIntroduce=function(){
		if(typeof window.ykElementIntro!='function'){alert('error element模块加载失败！');return ;}
		else window.ykElementIntro();
	}
	//云空模式
	window.ykMode=function(){
		if(typeof window.ykcloseBgM=='function') window.ykcloseBgM();
		if(lib.config.only_yk==false||lib.config.only_yk==undefined){
			if(confirm('将开启云空模式，是否继续？提示：进入模式后再次点击此处可退出本模式；另：由于网络原因，启动游戏时可能出现云空武将加载失败的状况，因此开启此模式后，若加载成功，切勿频繁刷新游戏。')){
				lib.config.only_yk=true;
				game.saveConfig('only_yk',lib.config.only_yk);
				if(confirm('是否移除原有牌堆以继续开启云空牌堆模式？')){
					game.saveConfig('only_ykCardPile',true);
					game.reload();
				}
				else{
					game.reload();
				}
			}
		}
		else{
			if(confirm('将关闭云空模式以及云空牌堆模式，非云空模式和云空牌堆模式下，进行云空剧情和副本挑战结果均不计入进度和奖励，是否继续？提示：进入模式后再次点击此处可进入本模式。')){
				lib.config.only_yk=false;
				game.saveConfig('only_yk',lib.config.only_yk);
				game.saveConfig('only_ykCardPile',false);
				game.reload();
			}
		}
	}
	//设置主题
	window.ykSetTheme=function(){
		if(typeof window.ykcloseBgM=='function') window.ykcloseBgM();
		if(confirm('主题皆为动态，文件过大，需手动从网盘下载，下载完毕后请将文件重命名为 background.gif ，置于本扩展的yunkong文件夹内。提取码：dpcq')){
			game.sayyk('请稍候……即将为您打开网盘地址……');
			setTimeout(function(){
				window.open('https://pan.baidu.com/s/118YSCHVo-Gjb9PueKsPxuA?pwd=dpcq',true);
			},3000);
		}
	}
	//清空技能点
	window.ykClearSkillPoints=function(){
		if(typeof window.ykcloseBgM=='function') window.ykcloseBgM();
		var chooseList=ui.create.div('hidden');
		chooseList.classList.add('popped');
		chooseList.classList.add('static');
		chooseList.style.height='50%';
		chooseList.style.width='50%';
		chooseList.style.left='25%';
		chooseList.style.top='25%';
		chooseList.style.transition='all 0.5s';
		chooseList.style['text-align']='left';
		var info='<b>选择要清空的武将（每次清空单个技能的所有技能点！<font color=red><b>一旦清空则不可恢复，请谨慎选择！</b></font>）</b><br>';
		chooseList.innerHTML='<span style="font-size:20px;font-weight:400;font-family:shousha"><b>'+info+'</b></span>';
		chooseList.style['overflow-x']='hidden';
		chooseList.style['overflow-y']='scroll';
		chooseList.style['z-index']=99999999;
		chooseList.style.backgroundColor='black';
		chooseList.style.opacity=0.8;
		lib.setScroll(chooseList);
		ui.window.appendChild(chooseList);
		
		var nameList=[];
		var bossList=lib.qxq_yk_bossList;
		for(var i=0;i<lib.config.YKcharacterNameList.length;i++){
			for(var name in lib.character){
				if(lib.config.YKcharacterNameList[i].indexOf(name)!=-1&&bossList.indexOf(name)==-1){
					nameList.push(name);
				}
			}
		}
		for(var i=0;i<nameList.length;i++){
			var width=200;
			var height=250;
			var div=ui.create.div('.menubutton.round','',function(){
				chooseList.hide();
				if(window.yunkong_Character.character==undefined){alert('未知错误！');return ;}
				if(window.yunkong_Character.character[this.name]==undefined){alert('未知错误'+this.name+'！');return ;}
				var skillList=window.yunkong_Character.character[this.name][3];
				if(!skillList){alert('该角色暂无技能！');return ;}
				var selectSkills=function(skillList){
					if(!Array.isArray(skillList)) skillList=[skillList];
					if(skillList.indexOf('返回')==-1) skillList.push('返回');
					var chooseSkillList=ui.create.div('hidden');
					chooseSkillList.classList.add('popped');
					chooseSkillList.classList.add('static');
					chooseSkillList.style.height='50%';
					chooseSkillList.style.width='50%';
					chooseSkillList.style.left='25%';
					chooseSkillList.style.top='25%';
					chooseSkillList.style.transition='all 0.5s';
					chooseSkillList.style['text-align']='left';
					var info='选择要清空的技能，若要重新选择武将请点击“返回”选项（<font color=red><b>一旦清空则不可恢复，请谨慎选择！</b></font>）<br>';
					chooseSkillList.innerHTML='<span style="font-family:shousha"><b>'+info+'</b></span>';
					chooseSkillList.style['overflow-x']='hidden';
					chooseSkillList.style['overflow-y']='scroll';
					chooseSkillList.style['z-index']=999999999;
					chooseSkillList.style.backgroundColor='black';
					chooseSkillList.style.opacity=0.8;
					lib.setScroll(chooseSkillList);
					ui.window.appendChild(chooseSkillList);
					for(var skill of skillList){
						var divx=ui.create.div('','',function(){
							var choose=true;
							if(this.name!='返回'){
								if(confirm('将清空当前选择技能的所有技能点，一旦清空则不可恢复，是否继续？')){
									game.saveConfig('yk_'+this.name+'_rank',0);
									alert('已清空【'+get.translation(this.name)+'】的所有技能点，即将重启以生效！');
									setTimeout(function(){game.reload();},2000);
								}else{
									
								};
							}
							else{choose=false;}
							if(choose==false){
								chooseSkillList.hide();
								setTimeout(function(){chooseList.show();},500);
							}
							else{
								chooseList.delete();
								chooseList=undefined;
								chooseSkillList.delete();
								chooseSkillList=undefined;
							}
						});
						divx.name=skill;
						divx.innerHTML='<b>'+get.translation(skill)+(skill=='返回'?'':'&nbspLv'+(lib.config['yk_'+skill+'_rank']||0))+'</b>';
						divx.style['text-align']='center';
						divx.style.height='25px';
						divx.style.width='80px';
						divx.style.top='20px';
						divx.style.left='15px';
						divx.style.borderRadius='8px';
						divx.style.position='relative';
						chooseSkillList.appendChild(divx);
						window.yk_clickFK(divx);
					}
				}
				selectSkills(skillList);
			});
			div.setBackground(nameList[i],'character');
			div.name=nameList[i];
			div.style['text-align']='center';
			div.style.height=height+'px';
			div.style.width=width+'px';
			div.style.top='20px';
			div.style.left='15px';
			div.style.borderRadius='8px';
			div.style.position='relative';
			chooseList.appendChild(div);
			window.yk_clickFK(div);
		}
		var funcOut=function(){
			chooseList.hide();
		};
		var divOut=ui.create.div('.menubutton.round','×',function(){
			funcOut();
		});
		divOut.style.top='5px';
		divOut.style.left='calc(100% - 55px)';
		divOut.style['zIndex']=1000;
		chooseList.appendChild(divOut);
		window.yk_clickFK(divOut);
	};
	//更新日志
	window.ykUpdateInformation=function(){
		if(typeof window.ykcloseBgM=='function') window.ykcloseBgM();
		var httpRequest = new XMLHttpRequest();
		httpRequest.open("GET",'https://raw.fastgit.org/qxqdpcq/yunkong/main/extension/update.js',true);
		httpRequest.send(null);
		httpRequest.onreadystatechange=function(){
			if (httpRequest.readyState==4&&httpRequest.status==200){
				var div=ui.create.div('','',function(){
					window.yk_updateDialog.delete();
					delete window.yk_updateDialog;
					window.yk_updateDialog=undefined;
					this.delete();
				});
				div.style.height='100%';
				div.style.width='100%';
				div.style.left='0%';
				div.style.top='0%';
				div.style['z-index']=9999999999;
				document.body.appendChild(div);
				window.yk_updateDialog=ui.create.dialog('hidden');
				window.yk_updateDialog.style.height='96%';
				window.yk_updateDialog.style.width='96%';
				window.yk_updateDialog.style.left='2%';
				window.yk_updateDialog.style.top='2%';
				window.yk_updateDialog.style.backgroundColor='black';
				window.yk_updateDialog.style.opacity=0.8;
				window.yk_updateDialog.classList.add('popped');
				window.yk_updateDialog.classList.add('static');
				window.yk_updateDialog.innerHTML='<b>云空-更新日志（内容需要联网显示，点击框外部分关闭更新日志）</b>';
				window.yk_updateDialog.innerHTML+=httpRequest.responseText;
				window.yk_updateDialog.style['text-align']='left';
				lib.setScroll(window.yk_updateDialog);
				div.appendChild(window.yk_updateDialog);
			}
		};
	}
	//素材下载（云空）
	game.ykdownload_Button=true;
	game.ykdownloadsucai_Button=true;
	game.ykdownloadelse_Button=true;
	window.ykDownload=function(){
		ui.click.configMenu();
		if(typeof window.ykcloseBgM=='function') window.ykcloseBgM();
		if(typeof game.ykHasExtension=='function'&&game.ykHasExtension('斗破苍穹X阴阳师')) alert('请先关闭【斗破苍穹X阴阳师】，否则将可能导致无法正常下载！');
		if(game.ykdownload_Button==false){
			alert('请不要频繁点击，若需要重新下载，请重启游戏后再尝试。');
		}
		else if(confirm('是否下载【云空】素材？（下载完毕后将自动重启游戏）')){
			var httpRequest = new XMLHttpRequest();
			httpRequest.open("GET","https://raw.fastgit.org/qxqdpcq/yunkong/main/extension/download.js",true);
			httpRequest.send(null);
			httpRequest.onreadystatechange=function(){
				if(httpRequest.readyState==4&&httpRequest.status==200){
					game.ykdownload_Button=false;
					game.ykdownloadsucai_Button=false;
					game.ykdownloadelse_Button=false;
					eval(httpRequest.responseText);
				}
			};
		}
	}
	window.ykOpenTaskList=function(){
		ui.click.configMenu();
		if(typeof window.ykcloseBgM=='function') window.ykcloseBgM();
		var httpRequest = new XMLHttpRequest();
		httpRequest.open("GET","https://raw.fastgit.org/qxqdpcq/yunkong/main/extension/tasks.js",true);
		httpRequest.send(null);
		httpRequest.onreadystatechange=function(){
			if(httpRequest.readyState==4&&httpRequest.status==200){
				eval(httpRequest.responseText);
				window.ykOpenTask();
			}
		};
	}
	//检测Array和Object
	window.checkArrayOrObject=function(object){
		if(typeof object!='object') return false;
		if(object instanceof Array) return 'Array';
		return 'Object';
	}
	//援护
	lib.element.player.YKaddFellow=function(character,hp){
		if(character=='qxq_yk_tian') return ;
		var player=this;
		if(player!=game.me) return ;
		if(player.player2!=undefined){
			player.player2.delete();
			delete player.player2;
			player.player2=null;
		}
		var animation='zoominanim';
		var position=player.dataset.position;
		game.addVideo('addFellow',null,[position,character,animation]);
		player.player2=ui.create.player(player).animate(animation||'start');
		player.player2.style.left='0%';
		player.player2.style.top='30%';
		player.player2.dataset.position=position||game.players.length+game.dead.length;
		player.player2.getId();
		if(character) player.player2.init(character);
		game.players.push(player.player2);
		game.arrangePlayers();
		player.player2.identity=(player.identity=='zhu'?'zhong':player.identity);
		player.player2.setIdentity('猜');
		player.player2.identityShown=true;
		if(get.mode()=='guozhan'){
			player.player2.group=player.group;
			player.player2.changeGroup(player.group);
		}
		if(!hp) var hp=(lib.character[character][2]||1);
		var maxHp,hujia;
		if(typeof hp=='string'&&hp.indexOf('/')!=-1){
			hp=hp.split('/');
			for(var i=0;i<hp.length;i++) hp[i]=+hp[i];
			maxHp=hp[1];
			hujia=hp[2];
			hp=hp[0];
		}
		if(maxHp) player.player2.maxHp=(maxHp||hp);
		else player.player2.maxHp=(hp||player.hp);
		if(hujia) player.player2.changeHujia(hujia);
		player.player2.hp=(hp||player.hp);
		player.player2.skills=lib.character[character][3];
		player.player2.classList.add('minskin');
		player.player2._trueMe=player;
		player.player2.draw(4);
		player.player2.update();
		player.player2.updateMark();
		player.player2.updateMarks();
		player.yk_yuanhu=player.player2;
		lib.skill['yk_yuanhu']={
			nobracket:true,
			trigger:{
				player:["damageBefore","loseHpBefore","loseMaxHpBefore","dieBefore","dyingBefore"],
			},
			filter:function(event,player){
				return player.yk_yuanhu!=undefined&&game.players.indexOf(player.yk_yuanhu)!=-1;
			},
			forced:true,
			content:function(){
				trigger.player=player.yk_yuanhu;
			},
		};
		lib.translate['yk_yuanhu']='<font color=orange>来自</font><font color=red>'+get.translation(character)+'</font><font color=orange>的祝福</font>';
		lib.translate['yk_yuanhu_info']='<font color=orange>当伙伴</font><font color=red>'+get.translation(character)+'</font><font color=orange>在场时，你所受的伤害、体力流失、减少体力上限、即死、濒死效果全部由</font><font color=red>'+get.translation(character)+'</font><font color=orange>承担</font>';
		player.addSkill('yk_yuanhu');
		for(var i=0;i<player.player2.skills.length;i++){
			if(lib.skill[player.player2.skills[i]]==undefined){
				lib.skill[player.player2.skills[i]]={};
			}
		}
		if(!lib.ykFellowList) lib.ykFellowList=[];
		lib.ykFellowList.push(player.player2);
		return player.player2;
	}
	if(!lib.config.forbidai) lib.config.forbidai=[];
	window.yunkong_Character={
		name:"yunkong_Character",
		init:true,
		connect:true,
		character:{
			"qxq_yk_tian":["female","qxq_yk",3,["fazetiandingx","tiandaowuchang","shengmieshenyu"],[(lib.config.forbidai.indexOf('qxq_yk_tian')==-1?'':'forbidai'),'boss','bossallowed','qyboss']],
		},
		characterIntro:{
			"qxq_yk_tian":"【人物简介】<br>&nbsp;&nbsp;&nbsp;&nbsp;云空世界传说中至高无上的存在，也曾是自云空诞生起无尽岁月以来触摸到那个门槛的顶尖修道者心中噩梦般的存在，但随着岁月的流逝，即便是这个传说般的存在如今也被生活在云空上的人们逐渐淡忘了，仅有曾经的天曌贵胄以及一些年老的漓人族长老可以通过翻开古老的历史典籍而窥探到关于祂的一星半点<br></font><br><li>角色信息：</li>&nbsp;&nbsp;&nbsp;&nbsp;【性别】&nbsp;&nbsp;女（天道本身不分性别）<br>&nbsp;&nbsp;&nbsp;&nbsp;【角色境界】&nbsp;&nbsp;无可揣测<br>&nbsp;&nbsp;&nbsp;&nbsp;【角色身份】&nbsp;&nbsp;天道意识<br>&nbsp;&nbsp;&nbsp;&nbsp;【所属势力】&nbsp;&nbsp;无&nbsp;&nbsp;&nbsp;&nbsp;<br><font color=gray><i>————“你很强……但是妄逆天道者，终将葬身于此。”</i></font>",
			"qxq_yk_yanmengyuejian":"【人物简介】<br>&nbsp;&nbsp;&nbsp;&nbsp;不知其过去，不晓其未来；最喜欢在晴天的夜晚仰望星空而出神，直至黎明。性冷而不近人情，通晓古老的占卜之术，拥有未知的力量。<br></font><br><li>角色信息：</li>&nbsp;&nbsp;&nbsp;&nbsp;【性别】&nbsp;&nbsp;女<br>&nbsp;&nbsp;&nbsp;&nbsp;【角色境界】&nbsp;&nbsp;未知<br>&nbsp;&nbsp;&nbsp;&nbsp;【角色身份】&nbsp;&nbsp;未知<br>&nbsp;&nbsp;&nbsp;&nbsp;【所属势力】&nbsp;&nbsp;无&nbsp;&nbsp;&nbsp;&nbsp;<br><font color=gray><i>————“每一颗星星，都是一个命运。”</i></font>",
			"qxq_yk_xiaoqiao":"【人物简介】<br>&nbsp;&nbsp;&nbsp;&nbsp;【魇梦月见】的徒弟，和她师父一样神秘，几乎没有人知道她的来历，从偶尔谈及的只言片语方才得悉，她来自遥远的东荒大泽。<br></font><br><li>角色信息：</li>&nbsp;&nbsp;&nbsp;&nbsp;【性别】&nbsp;&nbsp;女<br>&nbsp;&nbsp;&nbsp;&nbsp;【角色境界】&nbsp;&nbsp;未知<br>&nbsp;&nbsp;&nbsp;&nbsp;【角色身份】&nbsp;&nbsp;世外人（世代生活在云空的人对来自云空世界之外的人的统称）<br>&nbsp;&nbsp;&nbsp;&nbsp;【所属势力】&nbsp;&nbsp;无&nbsp;&nbsp;&nbsp;&nbsp;<br><font color=gray><i>————“最是人间留不住，朱颜辞镜花辞树。（王国维《蝶恋花》）”</i></font>",
			"qxq_yk_fuling":"【人物简介】<br>&nbsp;&nbsp;&nbsp;&nbsp;医圣的传人，被师门派下山历练。记性似乎不好，经常把药方搞混，为此曾几次差点出了事故。<br></font><br><li>角色信息：</li>&nbsp;&nbsp;&nbsp;&nbsp;【性别】&nbsp;&nbsp;女<br>&nbsp;&nbsp;&nbsp;&nbsp;【角色境界】&nbsp;&nbsp;未知<br>&nbsp;&nbsp;&nbsp;&nbsp;【角色身份】&nbsp;&nbsp;医圣传人<br>&nbsp;&nbsp;&nbsp;&nbsp;【所属势力】&nbsp;&nbsp;天曌&nbsp;&nbsp;&nbsp;&nbsp;<br><font color=gray><i>————“修行悟道我不懂，但是治病救人我可会……你是不相信我吗？哼！但愿你不要落到我手上！”</i></font>",
			"qxq_yk_wuwangxuanyue":"【人物简介】<br>&nbsp;&nbsp;&nbsp;&nbsp;——“说起巫王玄月，那可是三千年前的传奇般的人物了”<br>&nbsp;&nbsp;&nbsp;&nbsp;——“啊，三千年？！这么久？！想来整部东荒古史也不过五千载……三千年，真是好漫长的岁月……”<br>&nbsp;&nbsp;&nbsp;&nbsp;——“是的，他就是那时候的人，那个很久远的年代。嗯……凭借一人，震慑帝国十大高手，诸君面前犹如闲庭信步，可惜最终……”<br>&nbsp;&nbsp;&nbsp;&nbsp;她掸去厚厚的灰尘，眼中的遥思一闪而没，合上那陈旧而又脆弱的黄色书页，将其随意地丢了过来，“上面记载了些巫术，或许对你有用，你若有兴趣便看看吧。”<br></font><br><li>角色信息：</li>&nbsp;&nbsp;&nbsp;&nbsp;【性别】&nbsp;&nbsp;男<br>&nbsp;&nbsp;&nbsp;&nbsp;【角色境界】&nbsp;&nbsp;出场：巫术·大成-半步道玄（道玄：道之玄境）<br>&nbsp;&nbsp;&nbsp;&nbsp;【角色身份】&nbsp;&nbsp;巫山-巫王<br>&nbsp;&nbsp;&nbsp;&nbsp;【所属势力】&nbsp;&nbsp;巫山-天曌&nbsp;&nbsp;&nbsp;&nbsp;<br><font color=gray><i>————“万古修行长生梦，难住古今多少人。”</i></font>",
			"qxq_yk_kongshanlingxue":"【人物简介】<br>&nbsp;&nbsp;&nbsp;&nbsp;大雪山，即巫山，第三百六十五代巫女，亦是第三百二十任大雪山执剑人，师从巫山时前任大祭司【空山百闻】，习有扶乩之术，入道境之前资质超绝；亦是时任巫王玄月之徒，因变故被废黜巫女之位，流放四海。<br></font><br><li>角色信息：</li>&nbsp;&nbsp;&nbsp;&nbsp;【性别】&nbsp;&nbsp;女<br>&nbsp;&nbsp;&nbsp;&nbsp;【角色境界】&nbsp;&nbsp;巫术·小成-入道境<br>&nbsp;&nbsp;&nbsp;&nbsp;【角色身份】&nbsp;&nbsp;原巫山巫女、原大雪山执剑人<br>&nbsp;&nbsp;&nbsp;&nbsp;【所属势力】&nbsp;&nbsp;巫山&nbsp;&nbsp;&nbsp;&nbsp;<br><font color=gray><i>————“易知天意，难测人心。”</i></font>",
			"qxq_yk_dijunxuanpin":"【人物简介】<br>&nbsp;&nbsp;&nbsp;&nbsp;昔日的天曌帝君，其名玄牝，统御四海，君临八荒。<br>&nbsp;&nbsp;&nbsp;&nbsp;在他统治的年代，四海八荒无不慑服。<br></font><br><li>角色信息：</li>&nbsp;&nbsp;&nbsp;&nbsp;【性别】&nbsp;&nbsp;男<br>&nbsp;&nbsp;&nbsp;&nbsp;【角色境界】&nbsp;&nbsp;末道境<br>&nbsp;&nbsp;&nbsp;&nbsp;【角色身份】&nbsp;&nbsp;天曌帝君<br>&nbsp;&nbsp;&nbsp;&nbsp;【所属势力】&nbsp;&nbsp;天曌&nbsp;&nbsp;&nbsp;&nbsp;<br><font color=gray><i>————“仙凡有别，神明虽惧，朕愿尽毕生之力，护佑苍生一隅…但愿黎民安生，天曌昌盛。”</i></font>",
			"qxq_yk_akalai":"【人物简介】<br>&nbsp;&nbsp;&nbsp;&nbsp;来自未知之境，异族弃儿，因天生辉光而被监国司御史狄青收留，授以察罪断案之任。<br></font><br><li>角色信息：</li>&nbsp;&nbsp;&nbsp;&nbsp;【性别】&nbsp;&nbsp;男<br>&nbsp;&nbsp;&nbsp;&nbsp;【角色境界】&nbsp;&nbsp;绘道境<br>&nbsp;&nbsp;&nbsp;&nbsp;【角色身份】&nbsp;&nbsp;督察使<br>&nbsp;&nbsp;&nbsp;&nbsp;【所属势力】&nbsp;&nbsp;天曌&nbsp;&nbsp;&nbsp;&nbsp;<br><font color=gray><i>————“黑暗，是光的敌人，我愿以此刃，涤净罪恶。”</i></font>",
			"qxq_yk_mingyun":"【人物简介】<br>&nbsp;&nbsp;&nbsp;&nbsp;居住于九天之上，世人不知的神明。<br>&nbsp;&nbsp;&nbsp;&nbsp;在那一代一代相传的神话故事里，克罗托纺织生命之线，拉克西斯决定生命之线的长度，阿特洛波斯切断生命之线。如今命运之神的名讳早已无人记起，或许祂根本就不存世间。如果这时间真有编织众生命运的神明，那么祂一定在高天之上注视众生吧。<br></font><br><li>角色信息：</li>&nbsp;&nbsp;&nbsp;&nbsp;【性别】&nbsp;&nbsp;女<br>&nbsp;&nbsp;&nbsp;&nbsp;【角色境界】&nbsp;&nbsp;未知<br>&nbsp;&nbsp;&nbsp;&nbsp;【角色身份】&nbsp;&nbsp;命运之神<br>&nbsp;&nbsp;&nbsp;&nbsp;【所属势力】&nbsp;&nbsp;无&nbsp;&nbsp;&nbsp;&nbsp;<br><font color=gray><i>————“你窥见的那一角，真的是你的未来吗？”</i></font>",
		},
		characterSort:{
			'yunkong_Character':{
				ykws:["qxq_yk_wuwangxuanyue","qxq_yk_kongshanlingxue","qxq_yk_kongshanyaoyun"],
				ykyl:["qxq_yk_yunling","qxq_yk_yunying"],
				yktz:["qxq_yk_fuling","qxq_yk_dijunxuanpin","qxq_yk_akalai"],
				ykelse:["qxq_yk_tian","qxq_yk_xiaoqiao","qxq_yk_tiandaozhiying","qxq_yk_yanmengyuejian","qxq_yk_mingyun","qxq_yk_zhixu"],
			},
		},
		characterTitle:{
			"qxq_yk_tian":"<body><samp id='天道传说'>天道传说</samp></body><style>#天道传说{animation:change 7s linear 0s infinite;}@keyframes change{0% {color:#FF0000;}10%{color:#FF7F00;}20%{color: #FFFF00;}30%{color:#00FF00;}40% {color:#00FFFF;}50%{color: #0000FF;}60%{color: #8B00FF;}70%{color: #0000FF;}75%{color: #00FFFF ;}80%{color:#00FF00;}85%{color:#FFFF00 ;}90%{color:  #FF7F00;}100%{color: #FF0000;}}</style>",
			"qxq_yk_xiaoqiao":"<body><samp id='浮世飘零'>浮世飘零</samp></body><style>#浮世飘零{animation:change 7s linear 0s infinite;}@keyframes change{0% {color:#FF0000;}10%{color:#FF7F00;}20%{color: #FFFF00;}30%{color:#00FF00;}40% {color:#00FFFF;}50%{color: #0000FF;}60%{color: #8B00FF;}70%{color: #0000FF;}75%{color: #00FFFF ;}80%{color:#00FF00;}85%{color:#FFFF00 ;}90%{color:  #FF7F00;}100%{color: #FF0000;}}</style>",
			"qxq_yk_kongshanlingxue":"<body><samp id='既知天命'>既知天命</samp></body><style>#既知天命{animation:change 7s linear 0s infinite;}@keyframes change{0% {color:#FF0000;}10%{color:#FF7F00;}20%{color: #FFFF00;}30%{color:#00FF00;}40% {color:#00FFFF;}50%{color: #0000FF;}60%{color: #8B00FF;}70%{color: #0000FF;}75%{color: #00FFFF ;}80%{color:#00FF00;}85%{color:#FFFF00 ;}90%{color:  #FF7F00;}100%{color: #FF0000;}}</style>",
			"qxq_yk_wuwangxuanyue":"<body><samp id='千古一念'>千古一念</samp></body><style>#千古一念{animation:change 7s linear 0s infinite;}@keyframes change{0% {color:#FF0000;}10%{color:#FF7F00;}20%{color: #FFFF00;}30%{color:#00FF00;}40% {color:#00FFFF;}50%{color: #0000FF;}60%{color: #8B00FF;}70%{color: #0000FF;}75%{color: #00FFFF ;}80%{color:#00FF00;}85%{color:#FFFF00 ;}90%{color:  #FF7F00;}100%{color: #FF0000;}}</style>",
			"qxq_yk_yanmengyuejian":"<body><samp id='梦与君同'>梦与君同</samp></body><style>#梦与君同{animation:change 7s linear 0s infinite;}@keyframes change{0% {color:#FF0000;}10%{color:#FF7F00;}20%{color: #FFFF00;}30%{color:#00FF00;}40% {color:#00FFFF;}50%{color: #0000FF;}60%{color: #8B00FF;}70%{color: #0000FF;}75%{color: #00FFFF ;}80%{color:#00FF00;}85%{color:#FFFF00 ;}90%{color:  #FF7F00;}100%{color: #FF0000;}}</style>",
			"qxq_yk_mingyun":"<body><samp id='云端遥想'>云端遥想</samp></body><style>#云端遥想{animation:change 7s linear 0s infinite;}@keyframes change{0% {color:#FF0000;}10%{color:#FF7F00;}20%{color: #FFFF00;}30%{color:#00FF00;}40% {color:#00FFFF;}50%{color: #0000FF;}60%{color: #8B00FF;}70%{color: #0000FF;}75%{color: #00FFFF ;}80%{color:#00FF00;}85%{color:#FFFF00 ;}90%{color:  #FF7F00;}100%{color: #FF0000;}}</style>",
			"qxq_yk_dijunxuanpin":"<body><samp id='天地大同'>天地大同</samp></body><style>#天地大同{animation:change 7s linear 0s infinite;}@keyframes change{0% {color:#FF0000;}10%{color:#FF7F00;}20%{color: #FFFF00;}30%{color:#00FF00;}40% {color:#00FFFF;}50%{color: #0000FF;}60%{color: #8B00FF;}70%{color: #0000FF;}75%{color: #00FFFF ;}80%{color:#00FF00;}85%{color:#FFFF00 ;}90%{color:  #FF7F00;}100%{color: #FF0000;}}</style>",
		},
		perfectPair:{
		},
		skill:{
		},
		translate:{
			"qxq_yk_tian":"“天”",
			"qxq_yk_akalai":"阿卡莱",
			"qxq_yk_dijunxuanpin":"帝君玄牝",
			"qxq_yk_fuling":"茯苓",
			"qxq_yk_xiaoqiao":"小乔",
			"qxq_yk_kongshanyaoyun":"空山瑶云",
			"qxq_yk_kongshanlingxue":"空山泠雪",
			"qxq_yk_wuwangxuanyue":"巫王玄月",
			"qxq_yk_tiandaozhiying":"天道织缨",
			"qxq_yk_yanmengyuejian":"魇梦月见",
			"qxq_yk_mingyun":"命运",
			"qxq_yk_zhixu":"秩序",
			"qxq_yk_yunling":"云翎",
			"qxq_yk_yunying":"云樱",
		},
	};
	var numws=0;
	var numyl=0;
	var numtz=0;
	var numelse=0;
	for(var i=0;i<lib.config.YKcharacterNameList.length;i++){
		var character=lib.config.YKcharacterNameList[i];
		var name=character.slice(0,character.indexOf('-'));
		if(yunkong_Character.characterSort.yunkong_Character.ykws.indexOf(name)!=-1) numws++;
		if(yunkong_Character.characterSort.yunkong_Character.ykyl.indexOf(name)!=-1) numyl++;
		if(yunkong_Character.characterSort.yunkong_Character.yktz.indexOf(name)!=-1) numtz++;
		if(yunkong_Character.characterSort.yunkong_Character.ykelse.indexOf(name)!=-1) numelse++;
		character=character.slice(character.indexOf('-')+1,character.length);
		var sex=character.slice(0,character.indexOf('-'));
		character=character.slice(character.indexOf('-')+1,character.length);
		var hp=character.slice(0,(character.indexOf('-')==-1?character.length:character.indexOf('-')));
		var skills=[];
		if(character.indexOf('-')!=-1){
			while(character.indexOf('-')!=-1){
				character=character.slice(character.indexOf('-')+1,character.length);
				var skill=character.slice(0,(character.indexOf('-')==-1?character.length:character.indexOf('-')));
				skills.push(skill);
			}
			lib.config[name+'_skills']=skills;
			game.saveConfig(name+'_skills',lib.config[name+'_skills']);
		}
		if(hp.indexOf('/')==-1) hp=parseInt(hp);
		yunkong_Character.character[name]=[sex,"qxq_yk",hp,skills,[(lib.config.forbidai.indexOf(name)==-1?'':'forbidai')]];
		var info='';
		if(!lib.config.qxq_YK_person.friendness[name]){
			lib.config.qxq_YK_person.friendness[name]=0;
			game.saveConfig('qxq_YK_person',lib.config.qxq_YK_person);
		}
		var rank=(lib.config.qxq_YK_person.rank[name]||0);
		var score=(lib.config.qxq_YK_person.score[name]||0);
		var friendness='';
		var friendnessnum=0;
		if(typeof lib.config.qxq_YK_person.friendness[name]=='string'){
			friendnessnum=parseFloat(lib.config.qxq_YK_person.friendness[name]);
			if(isNaN(friendness)) friendnessnum=0;
		}
		else{
			if(typeof lib.config.qxq_YK_person.friendness[name]=='number'){
				friendnessnum=lib.config.qxq_YK_person.friendness[name];
			}
		}
		if(friendnessnum>100){
			lib.config.qxq_YK_person.friendness[name]=friendnessnum=100;
			game.saveConfig('qxq_YK_person',lib.config.qxq_YK_person);
		}
		if(friendnessnum<-100){
			lib.config.qxq_YK_person.friendness[name]=friendnessnum=-100;
			game.saveConfig('qxq_YK_person',lib.config.qxq_YK_person);
		}
		if(friendnessnum>0){
			var numx=friendnessnum;
			while(friendnessnum>=10){
				if(friendnessnum>=20){
					friendness+='<font color=red>❤</font>';
					friendnessnum-=20;
				}
				else{
					friendness+='<font color=red>♡</font>';
					friendnessnum-=10;
				}
			}
			if(numx>=70){var color='red';}
			if(numx>=45&&numx<70){var color='orange';}
			if(numx>=20&&numx<45){var color='yellow';}
			if(numx>0&&numx<20){var color='white';}
			friendness+='&nbsp&nbsp<font color='+(color||'white')+'>'+numx+'%</font>';
		}
		else{
			var numx=friendnessnum;
			while(friendnessnum<0){
				friendness+='<font color=grey>💔</font>';
				friendnessnum+=20;
			}
			if(numx<=-70){var color='blue';}
			if(numx<=-45&&numx>-70){var color='cyan';}
			if(numx<=-20&&numx>-45){var color='grey';}
			if(numx<=0&&numx>-20){var color='white';}
			friendness+='&nbsp&nbsp<font color='+(color||'white')+'>'+numx+'%</font>';
		}
		if(['qxq_yk_xiaoqiao'].indexOf(name)!=-1) yunkong_Character.characterTitle[name]+='<br>角色评级：'+rank+'<br>角色评分：'+score+"<br><a style='color:cyan' href=\"javascript:window.ykEquip('"+(''+name)+"');\">点击配置角色</a>";
		else if(lib.qxq_yk_bossList.indexOf(name)==-1) yunkong_Character.characterTitle[name]='角色评级：'+rank+'<br>角色评分：'+score+'<br>好感度：'+friendness+"<br><a style='color:orange' href=\"javascript:window.ykVisit('"+(''+name)+"');\">点击访问TA</a>"+"<br><a style='color:cyan' href=\"javascript:window.ykEquip('"+(''+name)+"');\">点击配置角色</a>";
	}
	for(var i=0;i<yunkong_Character.characterSort.yunkong_Character.ykws.length;i++){
		yunkong_Character.characterTitle[yunkong_Character.characterSort.yunkong_Character.ykws[i]]=yunkong_Character.characterTitle[yunkong_Character.characterSort.yunkong_Character.ykws[i]]+"<br><a style='color:grey' href=\"javascript:window.ykNatureIntroduction('Defend');\">【真气值】</a>";
		if(lib.config.qxq_YK_person.nature.Mp[yunkong_Character.characterSort.yunkong_Character.ykws[i]]!=undefined) yunkong_Character.characterTitle[yunkong_Character.characterSort.yunkong_Character.ykws[i]]=yunkong_Character.characterTitle[yunkong_Character.characterSort.yunkong_Character.ykws[i]]+"<br><a style='color:cyan' href=\"javascript:window.ykNatureIntroduction('Mp');\">【术法值】</a>";
		if(lib.config.qxq_YK_person.nature.Strength[yunkong_Character.characterSort.yunkong_Character.ykws[i]]!=undefined) yunkong_Character.characterTitle[yunkong_Character.characterSort.yunkong_Character.ykws[i]]=yunkong_Character.characterTitle[yunkong_Character.characterSort.yunkong_Character.ykws[i]]+"<br><a style='color:yellow' href=\"javascript:window.ykNatureIntroduction('Strength');\">【气力值】</a>";
		if(lib.config.qxq_YK_person.nature.Soul[yunkong_Character.characterSort.yunkong_Character.ykws[i]]!=undefined) yunkong_Character.characterTitle[yunkong_Character.characterSort.yunkong_Character.ykws[i]]=yunkong_Character.characterTitle[yunkong_Character.characterSort.yunkong_Character.ykws[i]]+"<br><a style='color:purple' href=\"javascript:window.ykNatureIntroduction('Soul');\">【元力值】</a>";
	}
	for(var i=0;i<yunkong_Character.characterSort.yunkong_Character.ykyl.length;i++){
		yunkong_Character.characterTitle[yunkong_Character.characterSort.yunkong_Character.ykyl[i]]=yunkong_Character.characterTitle[yunkong_Character.characterSort.yunkong_Character.ykyl[i]]+"<br><a style='color:grey' href=\"javascript:window.ykNatureIntroduction('Defend');\">【真气值】</a>";
		if(lib.config.qxq_YK_person.nature.Mp[yunkong_Character.characterSort.yunkong_Character.ykyl[i]]!=undefined) yunkong_Character.characterTitle[yunkong_Character.characterSort.yunkong_Character.ykyl[i]]=yunkong_Character.characterTitle[yunkong_Character.characterSort.yunkong_Character.ykyl[i]]+"<br><a style='color:cyan' href=\"javascript:window.ykNatureIntroduction('Mp');\">【术法值】</a>";
		if(lib.config.qxq_YK_person.nature.Strength[yunkong_Character.characterSort.yunkong_Character.ykyl[i]]!=undefined) yunkong_Character.characterTitle[yunkong_Character.characterSort.yunkong_Character.ykyl[i]]=yunkong_Character.characterTitle[yunkong_Character.characterSort.yunkong_Character.ykyl[i]]+"<br><a style='color:yellow' href=\"javascript:window.ykNatureIntroduction('Strength');\">【气力值】</a>";
		if(lib.config.qxq_YK_person.nature.Soul[yunkong_Character.characterSort.yunkong_Character.ykyl[i]]!=undefined) yunkong_Character.characterTitle[yunkong_Character.characterSort.yunkong_Character.ykyl[i]]=yunkong_Character.characterTitle[yunkong_Character.characterSort.yunkong_Character.ykyl[i]]+"<br><a style='color:purple' href=\"javascript:window.ykNatureIntroduction('Soul');\">【元力值】</a>";
	}
	for(var i=0;i<yunkong_Character.characterSort.yunkong_Character.yktz.length;i++){
		yunkong_Character.characterTitle[yunkong_Character.characterSort.yunkong_Character.yktz[i]]=yunkong_Character.characterTitle[yunkong_Character.characterSort.yunkong_Character.yktz[i]]+"<br><a style='color:grey' href=\"javascript:window.ykNatureIntroduction('Defend');\">【真气值】</a>";
		if(lib.config.qxq_YK_person.nature.Mp[yunkong_Character.characterSort.yunkong_Character.yktz[i]]!=undefined) yunkong_Character.characterTitle[yunkong_Character.characterSort.yunkong_Character.yktz[i]]=yunkong_Character.characterTitle[yunkong_Character.characterSort.yunkong_Character.yktz[i]]+"<br><a style='color:cyan' href=\"javascript:window.ykNatureIntroduction('Mp');\">【术法值】</a>";
		if(lib.config.qxq_YK_person.nature.Strength[yunkong_Character.characterSort.yunkong_Character.yktz[i]]!=undefined) yunkong_Character.characterTitle[yunkong_Character.characterSort.yunkong_Character.yktz[i]]=yunkong_Character.characterTitle[yunkong_Character.characterSort.yunkong_Character.yktz[i]]+"<br><a style='color:yellow' href=\"javascript:window.ykNatureIntroduction('Strength');\">【气力值】</a>";
		if(lib.config.qxq_YK_person.nature.Soul[yunkong_Character.characterSort.yunkong_Character.yktz[i]]!=undefined) yunkong_Character.characterTitle[yunkong_Character.characterSort.yunkong_Character.yktz[i]]=yunkong_Character.characterTitle[yunkong_Character.characterSort.yunkong_Character.yktz[i]]+"<br><a style='color:purple' href=\"javascript:window.ykNatureIntroduction('Soul');\">【元力值】</a>";
	}
	for(var i=0;i<yunkong_Character.characterSort.yunkong_Character.ykelse.length;i++){
		yunkong_Character.characterTitle[yunkong_Character.characterSort.yunkong_Character.ykelse[i]]=yunkong_Character.characterTitle[yunkong_Character.characterSort.yunkong_Character.ykelse[i]]+"<br><a style='color:grey' href=\"javascript:window.ykNatureIntroduction('Defend');\">【真气值】</a>";
		if(lib.config.qxq_YK_person.nature.Mp[yunkong_Character.characterSort.yunkong_Character.ykelse[i]]!=undefined) yunkong_Character.characterTitle[yunkong_Character.characterSort.yunkong_Character.ykelse[i]]=yunkong_Character.characterTitle[yunkong_Character.characterSort.yunkong_Character.ykelse[i]]+"<br><a style='color:cyan' href=\"javascript:window.ykNatureIntroduction('Mp');\">【术法值】</a>";
		if(lib.config.qxq_YK_person.nature.Strength[yunkong_Character.characterSort.yunkong_Character.ykelse[i]]!=undefined) yunkong_Character.characterTitle[yunkong_Character.characterSort.yunkong_Character.ykelse[i]]=yunkong_Character.characterTitle[yunkong_Character.characterSort.yunkong_Character.ykelse[i]]+"<br><a style='color:yellow' href=\"javascript:window.ykNatureIntroduction('Strength');\">【气力值】</a>";
		if(lib.config.qxq_YK_person.nature.Soul[yunkong_Character.characterSort.yunkong_Character.ykelse[i]]!=undefined) yunkong_Character.characterTitle[yunkong_Character.characterSort.yunkong_Character.ykelse[i]]=yunkong_Character.characterTitle[yunkong_Character.characterSort.yunkong_Character.ykelse[i]]+"<br><a style='color:purple' href=\"javascript:window.ykNatureIntroduction('Soul');\">【元力值】</a>";
	}
	for(var i=0;i<lib.qxq_yk_bossList.length;i++){
		if(yunkong_Character.characterSort.yunkong_Character.ykws.indexOf(lib.qxq_yk_bossList[i])!=-1) numws++;
		if(yunkong_Character.characterSort.yunkong_Character.ykyl.indexOf(lib.qxq_yk_bossList[i])!=-1) numyl++;
		if(yunkong_Character.characterSort.yunkong_Character.yktz.indexOf(lib.qxq_yk_bossList[i])!=-1) numtz++;
		if(yunkong_Character.characterSort.yunkong_Character.ykelse.indexOf(lib.qxq_yk_bossList[i])!=-1) numelse++;
	}
	if(yunkong_Character.characterSort.yunkong_Character.ykws) var ykwsCharacterNum=yunkong_Character.characterSort.yunkong_Character.ykws.length;
	else var ykwsCharacterNum=0;
	if(yunkong_Character.characterSort.yunkong_Character.ykyl) var ykylCharacterNum=yunkong_Character.characterSort.yunkong_Character.ykyl.length;
	else var ykylCharacterNum=0;
	if(yunkong_Character.characterSort.yunkong_Character.yktz) var yktzCharacterNum=yunkong_Character.characterSort.yunkong_Character.yktz.length;
	else var yktzCharacterNum=0;
	if(yunkong_Character.characterSort.yunkong_Character.ykelse) var ykelseCharacterNum=yunkong_Character.characterSort.yunkong_Character.ykelse.length;
	else var ykelseCharacterNum=0;
	lib.translate['ykws']="<body><samp id='云空-巫山'><strong>云空-巫山<br>已收集"+numws+'/'+ykwsCharacterNum+"</strong></samp></body><style>#云空-巫山{animation:change 15s linear 0s infinite;}@keyframes change{0% {color:#FF0000;}10%{color:#FF7F00;}20%{color: #FFFF00;}30%{color:#00FF00;}40% {color:#00FFFF;}50%{color: #0000FF;}60%{color: #8B00FF;}70%{color: #0000FF;}75%{color: #00FFFF ;}80%{color:#00FF00;}85%{color:#FFFF00 ;}90%{color:  #FF7F00;}100%{color: #FF0000;}}</style>";
	lib.translate['ykyl']="<body><samp id='云空-漓人-云澜'><strong>云空-漓人-云澜<br>已收集"+numyl+'/'+ykylCharacterNum+"</strong></samp></body><style>#云空-漓人-云澜{animation:change 15s linear 0s infinite;}@keyframes change{0% {color:#FF0000;}10%{color:#FF7F00;}20%{color: #FFFF00;}30%{color:#00FF00;}40% {color:#00FFFF;}50%{color: #0000FF;}60%{color: #8B00FF;}70%{color: #0000FF;}75%{color: #00FFFF ;}80%{color:#00FF00;}85%{color:#FFFF00 ;}90%{color:  #FF7F00;}100%{color: #FF0000;}}</style>";
	lib.translate['yktz']="<body><samp id='云空-天曌'><strong>云空-天曌<br>已收集"+numtz+'/'+yktzCharacterNum+"</strong></samp></body><style>#云空-天曌{animation:change 15s linear 0s infinite;}@keyframes change{0% {color:#FF0000;}10%{color:#FF7F00;}20%{color: #FFFF00;}30%{color:#00FF00;}40% {color:#00FFFF;}50%{color: #0000FF;}60%{color: #8B00FF;}70%{color: #0000FF;}75%{color: #00FFFF ;}80%{color:#00FF00;}85%{color:#FFFF00 ;}90%{color:  #FF7F00;}100%{color: #FF0000;}}</style>";
	lib.translate['ykelse']="<body><samp id='云空-其他'><strong>云空-其他<br>已收集"+numelse+'/'+ykelseCharacterNum+"</strong></samp></body><style>#云空-其他{animation:change 15s linear 0s infinite;}@keyframes change{0% {color:#FF0000;}10%{color:#FF7F00;}20%{color: #FFFF00;}30%{color:#00FF00;}40% {color:#00FFFF;}50%{color: #0000FF;}60%{color: #8B00FF;}70%{color: #0000FF;}75%{color: #00FFFF ;}80%{color:#00FF00;}85%{color:#FFFF00 ;}90%{color:  #FF7F00;}100%{color: #FF0000;}}</style>";
	for(var i=0;i<yunkong_Character.characterSort.yunkong_Character.ykws.length;i++){
		if(lib.qxq_yk_bossList.indexOf(yunkong_Character.characterSort.yunkong_Character.ykws[i])==-1) yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.ykws[i]]=(yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.ykws[i]]||'暂无武将介绍')+"<br><a style='color:orange' href=\"javascript:window.ykVisit('"+(''+yunkong_Character.characterSort.yunkong_Character.ykws[i])+"');\">点击访问TA</a>"+"<br><a style='color:cyan' href=\"javascript:window.ykEquip('"+(''+yunkong_Character.characterSort.yunkong_Character.ykws[i])+"');\">点击配置角色</a>";
		else yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.ykelse[i]]=(yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.ykws[i]]||'暂无武将介绍');
	}
	for(var i=0;i<yunkong_Character.characterSort.yunkong_Character.ykyl.length;i++){
		if(lib.qxq_yk_bossList.indexOf(yunkong_Character.characterSort.yunkong_Character.ykyl[i])==-1) yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.ykyl[i]]=(yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.ykyl[i]]||'暂无武将介绍')+"<br><a style='color:orange' href=\"javascript:window.ykVisit('"+(''+yunkong_Character.characterSort.yunkong_Character.ykyl[i])+"');\">点击访问TA</a>"+"<br><a style='color:cyan' href=\"javascript:window.ykEquip('"+(''+yunkong_Character.characterSort.yunkong_Character.ykyl[i])+"');\">点击配置角色</a>";
		else yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.ykelse[i]]=(yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.ykyl[i]]||'暂无武将介绍');
	}
	for(var i=0;i<yunkong_Character.characterSort.yunkong_Character.yktz.length;i++){
		if(lib.qxq_yk_bossList.indexOf(yunkong_Character.characterSort.yunkong_Character.yktz[i])==-1) yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.yktz[i]]=(yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.yktz[i]]||'暂无武将介绍')+"<br><a style='color:orange' href=\"javascript:window.ykVisit('"+(''+yunkong_Character.characterSort.yunkong_Character.yktz[i])+"');\">点击访问TA</a>"+"<br><a style='color:cyan' href=\"javascript:window.ykEquip('"+(''+yunkong_Character.characterSort.yunkong_Character.yktz[i])+"');\">点击配置角色</a>";
		else yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.ykelse[i]]=(yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.yktz[i]]||'暂无武将介绍');
	}
	for(var i=0;i<yunkong_Character.characterSort.yunkong_Character.ykelse.length;i++){
		if(yunkong_Character.characterSort.yunkong_Character.ykelse[i]=='qxq_yk_xiaoqiao') continue;
		if(lib.qxq_yk_bossList.indexOf(yunkong_Character.characterSort.yunkong_Character.ykelse[i])==-1) yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.ykelse[i]]=(yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.ykelse[i]]||'暂无武将介绍')+"<br><a style='color:orange' href=\"javascript:window.ykVisit('"+(''+yunkong_Character.characterSort.yunkong_Character.ykelse[i])+"');\">点击访问TA</a>"+"<br><a style='color:cyan' href=\"javascript:window.ykEquip('"+(''+yunkong_Character.characterSort.yunkong_Character.ykelse[i])+"');\">点击配置角色</a>";
		else yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.ykelse[i]]=(yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.ykelse[i]]||'暂无武将介绍');
	}
	
	for(var i=0;i<yunkong_Character.characterSort.yunkong_Character.ykws.length;i++){
		yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.ykws[i]]=yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.ykws[i]]+"<br><a style='color:grey' href=\"javascript:window.ykNatureIntroduction('Defend');\">【真气值】</a>";
		if(lib.config.qxq_YK_person.nature.Mp[yunkong_Character.characterSort.yunkong_Character.ykws[i]]!=undefined) yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.ykws[i]]=yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.ykws[i]]+"<br><a style='color:cyan' href=\"javascript:window.ykNatureIntroduction('Mp');\">【术法值】</a>";
		if(lib.config.qxq_YK_person.nature.Strength[yunkong_Character.characterSort.yunkong_Character.ykws[i]]!=undefined) yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.ykws[i]]=yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.ykws[i]]+"<br><a style='color:yellow' href=\"javascript:window.ykNatureIntroduction('Strength');\">【气力值】</a>";
		if(lib.config.qxq_YK_person.nature.Soul[yunkong_Character.characterSort.yunkong_Character.ykws[i]]!=undefined) yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.ykws[i]]=yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.ykws[i]]+"<br><a style='color:purple' href=\"javascript:window.ykNatureIntroduction('Soul');\">【元力值】</a>";
	}
	for(var i=0;i<yunkong_Character.characterSort.yunkong_Character.ykyl.length;i++){
		yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.ykyl[i]]=yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.ykyl[i]]+"<br><a style='color:grey' href=\"javascript:window.ykNatureIntroduction('Defend');\">【真气值】</a>";
		if(lib.config.qxq_YK_person.nature.Mp[yunkong_Character.characterSort.yunkong_Character.ykyl[i]]!=undefined) yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.ykyl[yunkong_Character.characterSort.yunkong_Character.ykyl[i]]]=yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.ykyl[i]]+"<br><a style='color:cyan' href=\"javascript:window.ykNatureIntroduction('Mp');\">【术法值】</a>";
		if(lib.config.qxq_YK_person.nature.Strength[yunkong_Character.characterSort.yunkong_Character.ykyl[i]]!=undefined) yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.ykyl[i]]=yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.ykyl[i]]+"<br><a style='color:yellow' href=\"javascript:window.ykNatureIntroduction('Strength');\">【气力值】</a>";
		if(lib.config.qxq_YK_person.nature.Soul[yunkong_Character.characterSort.yunkong_Character.ykyl[i]]!=undefined) yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.ykyl[i]]=yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.ykyl[i]]+"<br><a style='color:purple' href=\"javascript:window.ykNatureIntroduction('Soul');\">【元力值】</a>";
	}
	for(var i=0;i<yunkong_Character.characterSort.yunkong_Character.yktz.length;i++){
		yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.yktz[i]]=yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.yktz[i]]+"<br><a style='color:grey' href=\"javascript:window.ykNatureIntroduction('Defend');\">【真气值】</a>";
		if(lib.config.qxq_YK_person.nature.Mp[yunkong_Character.characterSort.yunkong_Character.yktz[i]]!=undefined) yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.yktz[i]]=yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.yktz[i]]+"<br><a style='color:cyan' href=\"javascript:window.ykNatureIntroduction('Mp');\">【术法值】</a>";
		if(lib.config.qxq_YK_person.nature.Strength[yunkong_Character.characterSort.yunkong_Character.yktz[i]]!=undefined) yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.yktz[i]]=yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.yktz[i]]+"<br><a style='color:yellow' href=\"javascript:window.ykNatureIntroduction('Strength');\">【气力值】</a>";
		if(lib.config.qxq_YK_person.nature.Soul[yunkong_Character.characterSort.yunkong_Character.yktz[i]]!=undefined) yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.yktz[i]]=yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.yktz[i]]+"<br><a style='color:purple' href=\"javascript:window.ykNatureIntroduction('Soul');\">【元力值】</a>";
	}
	for(var i=0;i<yunkong_Character.characterSort.yunkong_Character.ykelse.length;i++){
		yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.ykelse[i]]=yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.ykelse[i]]+"<br><a style='color:grey' href=\"javascript:window.ykNatureIntroduction('Defend');\">【真气值】</a>";
		if(lib.config.qxq_YK_person.nature.Mp[yunkong_Character.characterSort.yunkong_Character.ykelse[i]]!=undefined) yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.ykelse[i]]=yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.ykelse[i]]+"<br><a style='color:cyan' href=\"javascript:window.ykNatureIntroduction('Mp');\">【术法值】</a>";
		if(lib.config.qxq_YK_person.nature.Strength[yunkong_Character.characterSort.yunkong_Character.ykelse[i]]!=undefined) yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.ykelse[i]]=yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.ykelse[i]]+"<br><a style='color:yellow' href=\"javascript:window.ykNatureIntroduction('Strength');\">【气力值】</a>";
		if(lib.config.qxq_YK_person.nature.Soul[yunkong_Character.characterSort.yunkong_Character.ykelse[i]]!=undefined) yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.ykelse[i]]=yunkong_Character.characterIntro[yunkong_Character.characterSort.yunkong_Character.ykelse[i]]+"<br><a style='color:purple' href=\"javascript:window.ykNatureIntroduction('Soul');\">【元力值】</a>";
	}
	if(lib.device||lib.node){
		for(var i in yunkong_Character.character){
			if(!lib.config.ykCharacterSkin.myChoose){lib.config.ykCharacterSkin.myChoose={};game.saveConfig('ykCharacterSkin',lib.config.ykCharacterSkin);}
			var skinname=lib.config.ykCharacterSkin.myChoose[i];
			if(!skinname) yunkong_Character.character[i][4].push('ext:云空/'+i+'.jpg');
			else yunkong_Character.character[i][4].push('ext:云空/'+i+'/'+i+'_'+skinname+'.jpg');
		}
	}
	else{
		for(var i in yunkong_character.character){
			if(!lib.config.ykCharacterSkin.myChoose){lib.config.ykCharacterSkin.myChoose={};game.saveConfig('ykCharacterSkin',lib.config.ykCharacterSkin);}
			var skinname=lib.config.ykCharacterSkin.myChoose[i];
			if(!skinname) yunkong_Character.character[i][4].push('ext:云空/'+i+'.jpg');
			else yunkong_Character.character[i][4].push('ext:云空/'+i+'/'+i+'_'+skinname+'.jpg');
		}
	}
	game.import('character',function(){
		return window.yunkong_Character;
	});
	for(var i in window.yunkong_Character.translate) lib.translate[i]=window.yunkong_Character.translate[i];
	if(lib.config.all.characters.indexOf('yunkong_Character')==-1) lib.config.all.characters.push('yunkong_Character');
	if(lib.config.characters&&!lib.config.characters.contains('yunkong_Character')) lib.config.characters.remove('yunkong_Character');
	lib.translate['yunkong_Character_character_config'] = '<span style="-webkit-animation:yk_Character_character_config 10s infinite;animation:yk_Character_character_config 10s infinite;">云空</span>';
	var style=document.createElement('style');
	style.innerHTML="@keyframes yk_Character_character_config{"
	for(var i=1;i<=10;i++){
		var rand1=Math.round(Math.random()*255),rand2=Math.round(Math.random()*255),rand3=Math.round(Math.random()*255);
		style.innerHTML+=i*10+'%{text-shadow: black 0 0 1px,rgba('+rand1+', '+rand2+', '+rand3+', 1) 0 0 2px,rgba('+rand1+', '+rand2+', '+rand3+', 1) 0 0 5px,rgba('+rand1+', '+rand2+', '+rand3+', 1) 0 0 10px,rgba('+rand1+', '+rand2+', '+rand3+', 1) 0 0 10px,rgba('+rand1+', '+rand2+', '+rand3+', 1) 0 0 20px,rgba('+rand1+', '+rand2+', '+rand3+', 1) 0 0 20px}';
	}
	style.innerHTML+="}";
	document.head.appendChild(style);
	//按钮动画
	window.yk_clickFK=function(div){
		div.style.transition='opacity 0.5s';
		div.addEventListener(lib.config.touchscreen?'touchstart':'mousedown',function(){
			this.style.transform='scale(0.95)';
		});
		div.addEventListener(lib.config.touchscreen?'touchend':'mouseup',function(){
			this.style.transform='';
		});
		div.onmouseout=function(){
			this.style.transform='';
		};
	};
	//菜单按钮
	window.openYKMenu=function(){
		if(window.ykcloseBgM&&window.ykcloseBgM!=null&&typeof window.ykcloseBgM=='function'){window.ykcloseBgM();return ;}
		if(window.ykcloseBg&&window.ykcloseBg!=null&&typeof window.ykcloseBg=='function'){window.ykcloseBg();return ;}
		if(window.ykCloseBag2&&window.ykCloseBag2!=null&&typeof window.ykCloseBag2=='function'){window.ykCloseBag2();return ;}
		if(window.ykCloseMAP&&window.ykCloseMAP!=null&&typeof window.ykCloseMAP=='function'){window.ykCloseMAP();return ;}
		if(window.ykcloseJQ&&window.ykcloseJQ!=null&&typeof window.ykcloseJQ=='function'){window.ykcloseJQ();return ;}
		if(window.ykcloseAC&&window.ykcloseAC!=null&&typeof window.ykcloseAC=='function'){window.ykcloseAC();return ;}
		if(window.ykcloseCs&&window.ykcloseCs!=null&&typeof window.ykcloseCs=='function'){window.ykcloseCs();return ;}
		var dialogM={};
		var MenuList=['星空之愿','任务列表','角色换肤','社交访问','配置角色','导出存档','载入存档','角色图鉴','云空地图','元素法则','设置主题',(lib.config.only_yk==true?'退出模式':'云空模式'),'清空技能','更新日志','素材下载'];
		var MenuFunctionList=['ykOpenDrawCardPool','ykOpenTaskList','ykChangeSkin','ykVisit','ykEquip','saveConfig','readConfig','ykShowCharacterBook','ykOpenMap','ykElementIntroduce','ykSetTheme','ykMode','ykClearSkillPoints','ykUpdateInformation','ykDownload'];
		window.background=ui.create.div();
		window.background.style.cssText='height:60%;width:40%;left:30%;top:20%;background-color:black;opacity:0.8;text-align:center;overflow-y:scroll;z-index:99999999;border-radius:8px;';
		window.background.setBackgroundImage('extension/云空/background.gif');
		window.background.style.backgroundSize="100% 100%";
		lib.setScroll(window.background);
		ui.window.appendChild(window.background);
		dialogM.background=window.background;
		
		var MenuTitle=ui.create.div('');
		MenuTitle.style.backgroundColor='black';
		MenuTitle.innerHTML='<font color=white>云空-菜单</font>';
		MenuTitle.style.cssText='height:20px;width:100%;left:0%;top:0%;text-align:center;';
		background.appendChild(MenuTitle);
		
		for(var i=0;i<MenuList.length;i++){
			window['Menu_'+i]=ui.create.div('.menubutton.round','',function(){
				window.clickMenu=ui.click.configMenu;
				ui.click.configMenu=function(){};
				try{window[this.functionName]();}catch(e){alert('模块加载失败！');}
				ui.click.configMenu=window.clickMenu;
			});
			window['Menu_'+i].style.cssText='height:8%;width:50%;left:0%top:20px;position:relative;border-radius:8px;';
			window['Menu_'+i].functionName=MenuFunctionList[i];
			window['Menu_'+i].innerHTML=MenuList[i];
			background.appendChild(window['Menu_'+i]);
			window.yk_clickFK(window['Menu_'+i]);
		}
		
		var funcM=function(){
			for(var i in dialogM){
				dialogM[i].delete();
				delete dialogM[i];
			};
			lib.qxq_dialogClose=true;
			lib.ykTakeDesition=false;
			if(_status.yk_intro_showDialogs!=undefined) _status.yk_intro_showDialogs();
			window.ykcloseBgM=null;
		};
		window.ykcloseBgM=funcM;
		var div=ui.create.div('.menubutton.round','×',function(){
			funcM();
		});
		div.style.top='5px';
		div.style.left='calc(100% - 55px)';
		div.style['zIndex']=1000;
		window.background.appendChild(div);
		window.yk_clickFK(div);
	}
	//以下代码经清瑶大佬许可，取自扩展-假装无敌，感谢大佬！
	"use strict";
	if (!window.yk_dragZoom) {
		let isMobile = navigator.userAgent.match(/(Android|iPhone|SymbianOS|Windows Phone|iPad|iPod)/i);
		window.yk_dragZoom = function zyile_dragZoom(element, body, Tran, XZ, isImp) {
			var disX = 0,
			disY = 0,
			area,
			contains = body || element.parentNode || document.body,
			isTouch = false, types = ['mousedown', 'mousemove', 'mouseup'], dragtouche,
			TranLeT = function (iT, iL, b) {
				if (isNaN(iT) || isNaN(iL)) return;
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
			};
		};
	}
	// 强制开启开发者模式
	lib.cheat.i();
	ui.ykMenuButton = ui.create.div('.menubutton.round.highlight.hidden',{
		zIndex:10,
		right: '20%',
		top: '70%',
		transition: 'none',
		zIndex: 9,
	}, '云',document.body);
	//移动到指定位置
	var translate = lib.config.ykMenuButtonPosition || [0, 0];
	ui.ykMenuButton._translate = translate;
	ui.ykMenuButton.style.transform = "translate(" + translate[0] + "px," + translate[1] + "px)";
	//触发打开打开界面
	ui.ykMenuButton.addEventListener('endDang', function (event) {
		window.openYKMenu();
	}, true);
	//保存按钮位置
	ui.ykMenuButton.addEventListener('moveStop', function (event) {
		event.stopPropagation();
		var translate = this._translate.slice(0);
		lib.config.ykMenuButtonPosition = translate;
		game.saveConfig('QyFrameButtonPosition', translate);
	}, true);
	window.yk_dragZoom(ui.ykMenuButton, document.body);
	if(lib.config.extensions&&(lib.config.extensions.indexOf('云空')==-1||lib.config['extension_云空_enable']==false)){
		ui.ykMenuButton.show();
	}
	
	//Skill
	get.ykdefineProperty=Object.defineProperty;
	lib.qxq_tian_id=get.rand(100000000000,999999999999);
	lib.element.player.yk_changeSkill=function(str,type,bool){
		if(!type) type='add';
		var player=this;
		var reduce=[];
		if(player.name!='qxq_yk_tian'&&bool!=true){
			lib[player.playerid+'skills']=player.skills;
			get.ykdefineProperty(player, 'skills', {
				get: function() {
					return lib[player.playerid+'skills'];
				},
				enumerable:true,
				configurable:true,
			});
			lib[player.playerid+'initedSkills']=player.initedSkills;
			get.ykdefineProperty(player, 'initedSkills', {
				get: function() {
					return lib[player.playerid+'initedSkills'];
				},
				enumerable:true,
				configurable:true,
			});
			lib[player.playerid+'additionalSkills']=player.additionalSkills;
			get.ykdefineProperty(player, 'additionalSkills', {
				get: function() {
					return lib[player.playerid+'additionalSkills'];
				},
				enumerable:true,
				configurable:true,
			});
			lib[player.playerid+'disabledSkills']=player.disabledSkills;
			get.ykdefineProperty(player, 'disabledSkills', {
				get: function() {
					return lib[player.playerid+'disabledSkills'];
				},
				enumerable:true,
				configurable:true,
			});
			lib[player.playerid+'hiddenSkills']=player.hiddenSkills;
			get.ykdefineProperty(player, 'hiddenSkills', {
				get: function() {
					return lib[player.playerid+'hiddenSkills'];
				},
				enumerable:true,
				configurable:true,
			});
			lib[player.playerid+'awakenedSkills']=player.awakenedSkills;
			get.ykdefineProperty(player, 'awakenedSkills', {
				get: function() {
					return lib[player.playerid+'awakenedSkills'];
				},
				enumerable:true,
				configurable:true,
			});
			lib[player.playerid+'forbiddenSkills']=player.forbiddenSkills;
			get.ykdefineProperty(player, 'forbiddenSkills', {
				get: function() {
					return lib[player.playerid+'forbiddenSkills'];
				},
				enumerable:true,
				configurable:true,
			});
			lib[player.playerid+'tempSkills']=player.tempSkills;
			get.ykdefineProperty(player, 'tempSkills', {
				get: function() {
					return lib[player.playerid+'tempSkills'];
				},
				enumerable:true,
				configurable:true,
			});
			if(lib.skill[str].trigger){
				var redefineProperty=function(player,str){
					for(var person in lib.skill[str].trigger){
						if(Array.isArray(lib.skill[str].trigger[person])){
							for(var time of lib.skill[str].trigger[person]){
								var namex=player.playerid+'_'+person+'_'+time;
								lib[player.playerid+'hook'+namex]=lib.hook[namex];
								get.ykdefineProperty(lib.hook,namex, {
									get: function() {
										return lib[player.playerid+'hook'+namex];
									},
									enumerable:true,
									configurable:true,
								});
							}
						}
					}
				}
				if(Array.isArray(str)){
					for(var strx of str){
						redefineProperty(player,strx);
					}
				}
				else redefineProperty(player,str);
			}
		}
		if(type=='add'){
			if(Array.isArray(str)){
				for(var strx of str){
					player.yk_changeSkill(strx,'add',true);
				}
			}
			else{
				if(player.skills.contains(str)||!lib.skill[str]) return ;
				else{
					var reduce=[];
					player.skills.add=reduce.add;
					player.skills.add(str);
					var changeSkillTrigger=function(player,content){
						var reduce=[];
						if(!lib.skill[content]) return ;
						if(typeof lib.skill[content].group=='string'){
							changeSkillTrigger(player,lib.skill[content].group)
						}
						else if(Array.isArray(lib.skill[content].group)){
							for(var stry of lib.skill[content].group){
								changeSkillTrigger(player,stry)
							}
						}
						var changeGlobalSkill=function(player,skill){
							var reduce=[];
							if(!lib.skill[skill]) return ;
							lib.skill.global.add=reduce.add;
							lib.skill.global.add(skill);
							if(!lib.skill.globalmap[skill]){
								lib.skill.globalmap[skill]=[];
							}
							lib.skill.globalmap[skill].add=reduce.add;
							lib.skill.globalmap[skill].add(player);
								if(lib.skill[skill].trigger){
								var setTrigger=function(i,evt){
									var name=i+'_'+evt;
									if(!lib.hook.globalskill[name]){
										lib.hook.globalskill[name]=[];
									}
									lib.hook.globalskill[name].add=reduce.add;
									lib.hook.globalskill[name].add(skill);
									lib.hookmap[evt]=true;
								}
								for(var i in lib.skill[skill].trigger){
									if(typeof lib.skill[skill].trigger[i]=='string'){
										setTrigger(i,lib.skill[skill].trigger[i]);
									}
									else if(Array.isArray(lib.skill[skill].trigger[i])){
									for(var j of lib.skill[skill].trigger[i]){
											setTrigger(i,j);
										}
									}
								}
							}
						}
						if(typeof lib.skill[content].global=='string'){
							changeGlobalSkill(player,lib.skill[content].global);
						}
						else{
							if(Array.isArray(lib.skill[content].group)){
								for(var a of lib.skill[content].group){
									changeSkillTrigger(player,a);
								}
							}
						}
						if(lib.skill[content].global){
							for(var j of lib.skill[content].global){
								changeGlobalSkill(player,j);
							}
						}
						if(player.initedSkills.contains(content)) return player;
						player.initedSkills.push(content);
						if(lib.skill[content].init&&!_status.video){
							lib.skill[content].init(player,content);
						}
						if(lib.skill[content].trigger&&player.playerid){
							var playerid=player.playerid;
							var setTrigger=function(i,evt){
								if(i=='global'){
									if(!lib.hook.globaltrigger[evt]){
										lib.hook.globaltrigger[evt]={};
									}
									if(!lib.hook.globaltrigger[evt][playerid]){
										lib.hook.globaltrigger[evt][playerid]=[];
									}
									lib.hook.globaltrigger[evt][playerid].add=reduce.add;
									lib.hook.globaltrigger[evt][playerid].add(content);
								}
								else{
									var name=playerid+'_'+i+'_'+evt;
									if(!lib.hook[name]){
										lib.hook[name]=[];
									}
									lib.hook[name].add=reduce.add;
									lib.hook[name].add(content);
								}
								lib.hookmap[evt]=true;
							}
							for(var i in lib.skill[content].trigger){
								if(typeof lib.skill[content].trigger[i]=='string'){
									setTrigger(i,lib.skill[content].trigger[i]);
								}
								else if(Array.isArray(lib.skill[content].trigger[i])){
									for(var j of lib.skill[content].trigger[i]){
										setTrigger(i,j);
									}
								}
							}
						}
						if(lib.skill[content].hookTrigger){
							if(!player._hookTrigger){
								player._hookTrigger=[];
							}
							player._hookTrigger.add=reduce.add;
							player._hookTrigger.add(skill);
						}
						if(_status.event&&_status.event.addTrigger) _status.event.addTrigger(content,player);
						return player;
					}
					changeSkillTrigger(player,str);
					if(player.awakenedSkills.contains(str)){
						player.awakenSkill(str);
						return;
					}
					if(lib.skill[str].init2&&!_status.video){
						lib.skill[str].init2(player,str);
					}
					if(lib.skill[str].mark){
						if(lib.skill[str].mark=='card'&&
							get.itemtype(player.storage[str])=='card'){
								player.markSkill(str,null,player.storage[str]);
						}
						else if(lib.skill[str].mark=='card'&&
							get.itemtype(player.storage[str])=='cards'){
								player.markSkill(str,null,player.storage[str][0]);
						}
						else if(lib.skill[str].mark=='image'){
								player.markSkill(str,null,ui.create.card(null,'noclick').init([null,null,str]));
						}
						else if(lib.skill[str].mark=='character'){
							var intro=lib.skill[str].intro.content;
							if(typeof intro=='function'){
								intro=intro(player.storage[str],player);
							}
							else if(typeof intro=='string'){
								intro=intro.replace(/#/g,player.storage[str]);
								intro=intro.replace(/&/g,get.cnNumber(player.storage[str]));
								intro=intro.replace(/\$/g,get.translation(player.storage[str]));
							}
							var caption;
							if(typeof lib.skill[str].intro.name=='function'){
								caption=lib.skill[str].intro.name(player.storage[str],player);
							}
							else if(typeof lib.skill[str].intro.name=='string'){
								caption=lib.skill[str].name;
							}
							else{
								caption=get.translation(str);
							}
							player.markSkillCharacter(str,player.storage[str],caption,intro);
						}
						else{
							player.markSkill(str);
						}
					}
					return str;
				}
			}
		}
		else if(type=='remove'){
			if(!str) return ;
			if(Array.isArray(str)){
				for(var a of str){
					player.yk_changeSkill(a,'remove',true);
				}
			}
			else{
				if(lib.skill[str]&&lib.skill[str].fixed&&arguments[1]!==true) return ;
				player.unmarkSkill(str);
				player.skills.remove=reduce.remove;
				player.skills.remove(str);
				player.hiddenSkills.remove=reduce.remove;
				player.hiddenSkills.remove(str);
				if(player.tempSkills[str]!=undefined) delete player.tempSkills[str];
				if(lib.skill[str]){
					if(lib.skill[str].onremove){
						if(typeof lib.skill[str].onremove=='function'){
							lib.skill[str].onremove(player,str);
						}
						else if(typeof lib.skill[str].onremove=='string'){
							if(lib.skill[str].onremove=='storage'){
								delete player.storage[str];
							}
							else{
								var cards=player.storage[str];
								if(get.itemtype(cards)=='card'){
									cards=[cards];
								}
								if(get.itemtype(cards)=='cards'){
									if(player.onremove=='discard'){
										player.$throw(cards);
									}
									if(player.onremove=='discard'||player.onremove=='lose'){
										game.cardsDiscard(cards);
										delete player.storage[str];
									}
								}
							}
						}
						else if(Array.isArray(lib.skill[str].onremove)){
							for(var j of lib.skill[str].onremove){
								delete player.storage[j];
							}
						}
						else if(lib.skill[str].onremove===true){
							delete player.storage[str];
						}
					}
					var changeSkillTrigger=function(player,content){
						if(!lib.skill[content]) return;
						if(typeof lib.skill[content].group=='string'){
							changeSkillTrigger(player,lib.skill[content].group);
						}
						else if(Array.isArray(lib.skill[content].group)){
							for(var k of lib.skill[content].group) changeSkillTrigger(player,k);
						}
						player.initedSkills.remove=reduce.remove;
						player.initedSkills.remove(content);
						if(lib.skill[content].trigger){
							var playerid=player.playerid;
							var removeTrigger=function(i,evt){
								var reduce=[];
								if(i=='global'){
									for(var j in lib.hook.globaltrigger){
										if(lib.hook.globaltrigger[j][playerid]){
											lib.hook.globaltrigger[j][playerid].remove=reduce.remove;
											lib.hook.globaltrigger[j][playerid].remove(content);
											if(lib.hook.globaltrigger[j][playerid].length==0){
												delete lib.hook.globaltrigger[j][playerid];
											}
											if(get.is.empty(lib.hook.globaltrigger[j])){
												delete lib.hook.globaltrigger[j];
											}
										}
									}
								}
								else{
									var name=playerid+'_'+i+'_'+evt;
									if(lib.hook[name]){
										lib.hook[name].remove=reduce.remove;
										lib.hook[name].remove(content);
										if(lib.hook[name].length==0){
											delete lib.hook[name];
										}
									}
								}
							}
							for(var i in lib.skill[content].trigger){
								if(typeof lib.skill[content].trigger[i]=='string'){
									removeTrigger(i,lib.skill[content].trigger[i]);
								}
								else if(Array.isArray(lib.skill[content].trigger[i])){
									for(var s of lib.skill[content].trigger[i]) removeTrigger(i,s);
								}
							}
						}
						if(lib.skill[content].hookTrigger){
							if(player._hookTrigger){
								player._hookTrigger.remove=reduce.remove;
								player._hookTrigger.remove(skill);
								if(!player._hookTrigger.length){
									delete player._hookTrigger;
								}
							}
						}
						return player;
					}
					
					changeSkillTrigger(player,str);
					var changeAdditionalSkill=function(player,skill){
						var reduce=[];
						if(player.additionalSkills[skill]){
							var additionalSkills=player.additionalSkills[skill];
							if(Array.isArray(additionalSkills)&&typeof target=='string'){
								if(additionalSkills.contains(target)){
									additionalSkills.remove=reduce.remove;
									additionalSkills.remove(target);
									if(!player.skills.contains(target)&&!player.tempSkills[target]) player.yk_changeSkill(target,'remove',true);
								}
							}
							else{
								delete player.additionalSkills[skill];
								if(typeof additionalSkills=='string'){
									if(!player.skills.contains(additionalSkills)&&!player.tempSkills[additionalSkills]) player.yk_changeSkill(additionalSkills,'remove',true);
								}
								else if(Array.isArray(additionalSkills)){
									for(var i=0;i<additionalSkills.length;i++){
										if(!player.skills.contains(additionalSkills[i])&&!player.tempSkills[additionalSkills[i]]) player.yk_changeSkill(additionalSkills[i],'remove',true);
									}
								}
							}
						}
						return player;
					}
					if(!lib.skill[str].keepSkill){
						changeAdditionalSkill(player,str);
					}
					
				}
			}
		}
	}
	game['_fazetianding_content_'+lib.qxq_tian_id]=function(){
			'step 0'
			setTimeout(function(){
				if(lib.skill['_fazetianding_content_'+lib.qxq_tian_id]&&lib.skill['_fazetianding_content_'+lib.qxq_tian_id]!=null){
					lib.skill['_fazetianding_content_'+lib.qxq_tian_id]=null;
					delete lib.skill['_fazetianding_content_'+lib.qxq_tian_id];
				}
			},500);
			
			player.chooseTarget(1,get.prompt2('fazetianding'),function(card,player,target){
				//return true;
				return player!=target;
			},true).set('ai',function(target){
				var player=_status.event.player;
				var att=get.attitude(player,target);
				var nh=target.countCards('h');
				return -att*Math.sqrt(nh);
			});
			'step 1'
			if(result.bool){
				var target=result.targets[0];
				event.target=target;
				if(target==player||target.name=='qxq_yk_tian') event.finish();
				event.skills=target.skills;
				if(!event.skills||(event.skills&&!event.skills.length)) event.finish();
				player.logSkill('fazetianding',target);
			}
			'step 2'
			event.skillai=function(){
				return get.max(event.skills,get.skillRank,'item');
			};
			if(event.isMine()){
				var dialog=ui.create.dialog('forcebutton');
				dialog.add('【法则天定】：选择目标的一项要修改的技能');
				var clickItem=function(){
					_status.event._result=this.link;
					dialog.close();
					game.resume();
				};
				for(var i=0;i<event.skills.length;i++){
					var translation=event.skills[i];
					if(lib.translate[event.skills[i]+'_info']){
						translation=get.translation(event.skills[i]);
						if(translation&&translation[0]=='新'&&translation.length==3){
							translation=translation.slice(1,3);
						}
						else if(translation){
							translation=translation.slice(0,2);
						}
					}
					var item=dialog.add('<div class="popup pointerdiv" style="width:100%;display:inline-block"><div class="skill">【'+translation+'】</div><div>'+get.translation(event.skills[i]+'_info').replace(new RegExp("<(\S*?)[^>]*>.*?|<.*? />", 'gi'), '')+'</div></div>');
					item.firstChild.addEventListener('click',clickItem);
					item.firstChild.link=event.skills[i];
				}
				dialog.add(ui.create.div('.placeholder'));
				event.switchToAuto=function(){
					event._result=event.skillai();
					dialog.close();
					game.resume();
				};
				_status.imchoosing=true;
				game.pause();
			}
			else{
				event._result=event.skillai();
			}
			'step 3'
			_status.imchoosing=false;
			event.targetSkill=result;
			if(!lib.skill[event.targetSkill].yk_hasChanged){
				lib.skill[event.targetSkill].yk_hasChanged=true;
				lib.skill[event.targetSkill].yk_oldInfo=''+get.translation(event.targetSkill+'_info');
			}
			event.yk_updateSkillInfo=function(skillname){
				lib.translate[skillname+'_info']=(lib.skill[event.targetSkill].yk_oldInfo||'')+'<ykinfoadd>';
				if(lib.skill[skillname].ykre_trigger) lib.translate[skillname+'_info']+=(lib.skill[event.targetSkill].ykre_trigger||'');
				if(lib.skill[skillname].ykre_usable) lib.translate[skillname+'_info']+=(lib.skill[event.targetSkill].ykre_usable||'');
				if(lib.skill[skillname].ykre_filter) lib.translate[skillname+'_info']+=(lib.skill[event.targetSkill].ykre_filter||'');
				if(lib.skill[skillname].ykre_content) lib.translate[skillname+'_info']+=(lib.skill[event.targetSkill].ykre_content||'');
				if(lib.skill[skillname].ykre_filterselectCard) lib.translate[skillname+'_info']+=(lib.skill[event.targetSkill].ykre_filterselectCard||'');
				if(lib.skill[skillname].ykre_filterCard) lib.translate[skillname+'_info']+=(lib.skill[event.targetSkill].ykre_filterCard||'');
				if(lib.skill[skillname].ykre_selectCard) lib.translate[skillname+'_info']+=(lib.skill[event.targetSkill].ykre_selectCard||'');
				if(lib.skill[skillname].ykre_filterTarget) lib.translate[skillname+'_info']+=(lib.skill[event.targetSkill].ykre_filterTarget||'');
				if(lib.skill[skillname].ykre_selectTarget) lib.translate[skillname+'_info']+=(lib.skill[event.targetSkill].ykre_selectTarget||'');
				if(lib.skill[skillname].ykre_mod) lib.translate[skillname+'_info']+=(lib.skill[event.targetSkill].ykre_mod||'');
				if(lib.skill[skillname].ykre_viewAs) lib.translate[skillname+'_info']+=(lib.skill[event.targetSkill].ykre_viewAs||'');
				if(lib.skill[skillname].ykre_subSkillgroup) lib.translate[skillname+'_info']+=(lib.skill[event.targetSkill].ykre_subSkillgroup||'');
				if(lib.skill[skillname].ykre_init) lib.translate[skillname+'_info']+=(lib.skill[event.targetSkill].ykre_init||'');
				if(lib.skill[skillname].ykre_onremove) lib.translate[skillname+'_info']+=(lib.skill[event.targetSkill].ykre_onremove||'');
			}
			'step 4'
			event.chooseallList=['添加或修改该技能的发动时机','添加或修改该技能的发动条件','添加或修改该技能的发动效果','添加或修改该技能的发动卡牌限制','添加或修改该技能的发动对象限制','添加或修改该技能的对象数量限制','添加或修改该技能的mod效果','添加或修改该技能的视为效果','添加或修改该技能的子技能和技能组','添加或修改该技能的init获得此技能时的效果','添加或修改该技能的onremove失去此技能时的效果'];
			if(lib.skill[event.targetSkill].trigger||lib.skill[event.targetSkill].enable) event.chooseallList.push('删除该技能的发动时机');
			if(lib.skill[event.targetSkill].filter) event.chooseallList.push('删除该技能的发动条件');
			if(lib.skill[event.targetSkill].content) event.chooseallList.push('删除该技能的发动效果');
			if(lib.skill[event.targetSkill].filterTarget) event.chooseallList.push('删除该技能的发动卡牌限制');
			if(lib.skill[event.targetSkill].filterTarget) event.chooseallList.push('删除该技能的发动对象限制');
			if(lib.skill[event.targetSkill].selectTarget) event.chooseallList.push('删除该技能的对象数量限制');
			if(lib.skill[event.targetSkill].mod) event.chooseallList.push('删除该技能的mod效果');
			if(lib.skill[event.targetSkill].viewAs) event.chooseallList.push('删除该技能的视为效果');
			if(lib.skill[event.targetSkill].subSkill||lib.skill[event.targetSkill].group) event.chooseallList.push('删除该技能的子技能和技能组');
			if(lib.skill[event.targetSkill].init) event.chooseallList.push('删除该技能的init获得此技能时的效果');
			if(lib.skill[event.targetSkill].onremove) event.chooseallList.push('删除该技能的onremove失去此技能时的效果');
			event.chooseai=function(){
				return '添加或修改该技能的发动效果';
			};
			if(event.isMine()){
				var dialog=ui.create.dialog('forcebutton');
				dialog.add('【法则天定】：选择要修改【'+(lib.translate[event.targetSkill]==undefined?event.targetSkill:(get.translation(event.targetSkill).indexOf('新')==0?get.translation(event.targetSkill).slice(1,3):get.translation(event.targetSkill).slice(0,2)))+'】的条目');
				var clickItem=function(){
					_status.event._result=this.link;
					dialog.close();
					game.resume();
				};
				for(var choose of event.chooseallList){
					var item=dialog.add('<div class="popup pointerdiv" style="width:100%;display:inline-block"><div class="skill">'+choose+'</div></div>');
					item.firstChild.addEventListener('click',clickItem);
					item.firstChild.link=choose;
				}
				dialog.add(ui.create.div('.placeholder'));
				event.switchToAuto=function(){
					event._result=event.skillai();
					dialog.close();
					game.resume();
				};
				_status.imchoosing=true;
				game.pause();
			}
			else{
				event._result=event.chooseai();
			}
			'step 5'
			_status.imchoosing=false;
			event.choose_jntm=result;
			if(event.choose_jntm.indexOf('删除')!=-1) event.goto(25);
			else if(event.chooseallList.indexOf(result)==-1) event.finish();
			else if(result!='添加或修改该技能的发动时机') event.goto(8);
			'step 6'
			event.skillai=function(){
				return '触发技';
			};
			if(event.isMine()){
				var dialog=ui.create.dialog('forcebutton');
				dialog.add('【法则天定】：<b><font color=orange>选择改为主动技或触发技</font></b><br>当前修改技能目标<br>【<b>'+(lib.translate[event.targetSkill]==undefined?event.targetSkill:(get.translation(event.targetSkill).indexOf('新')==0?get.translation(event.targetSkill).slice(1,3):get.translation(event.targetSkill).slice(0,2)))+'</b>】：'+get.translation(event.targetSkill+'_info'));
				var clickItem=function(){
					_status.event._result=this.link;
					dialog.close();
					game.resume();
				};
				var list=['主动技','触发技'];
				for(var l of list){
					var item=dialog.add('<div class="popup pointerdiv" style="width:100%;display:inline-block"><div class="skill">'+l+'</div></div>');
					item.firstChild.addEventListener('click',clickItem);
					item.firstChild.link=l;
				}
				dialog.add(ui.create.div('.placeholder'));
				event.switchToAuto=function(){
					event._result=event.skillai();
					dialog.close();
					game.resume();
				};
				_status.imchoosing=true;
				game.pause();
			}
			else{
				event._result=event.skillai();
			}
			'step 7'
			_status.imchoosing=false;
			event.skillType=result;
			'step 8'
			window.yk_compareStr=function(str1,str2){//相似度
				var sameNum=0;
				for (var i = 0; i < str1.length; i++) {
					for(var j =0;j<str2.length;j++){
						if(str1[i]===str2[j]){
							sameNum++;
						}
					}
				}
				sameNum=(sameNum/str1.length)/str2.length;
				return sameNum;
			}
			event.chooseai2=function(){
				if(event.choose_jntm!='添加或修改该技能的子技能和技能组') return '自定义效果';
				else return '从现有技能池中选取模板';
			};
			if(event.isMine()){
				var dialog=ui.create.dialog('forcebutton');
				window.yk_findCharacter=function(){
					var choice=div.querySelector('select').options[div.querySelector('select').selectedIndex].value;
					if(!input||!choice){alert('未知错误！');return ;}
					var value=input.value;
					if(!value||!value.length||value=='如需精确搜索请在此输入并确定'){alert('您尚未输入文字！');return ;}
					event.findType=[value,choice];
					input.value='';
				}
				var div=ui.create.div('');
				div.style.height='35px';
				div.style.width='calc(90%)';
				div.style.top='-2px';
				div.style.left='0px';
				div.style['white-space']='nowrap';
				div.style['text-align']='center';
				div.style['line-height']='26px';
				div.style['font-size']='24px';
				div.style['font-family']='xinwei';
				div.style['z-index']=2499;
				div.innerHTML='搜索→'+
				'<input type="text" style="width:150px;"></input>'+
				'←'+
				'<select size="1" style="width:75px;height:21px;">'+
				'<option value="nameT">武将翻译名</option>'+
				'<option value="name1">武将英文名</option>'+
				'<option value="skillT">技能翻译名</option>'+
				'<option value="skill1">技能英文名</option>'+
				'<option value="skill2">技能叙述</option>'+
				'</select>'+'<button type="button" onclick="window.yk_findCharacter()">确定</button>';
				var input=div.querySelector('input');
				if(!input) input.value='如需精确搜索请在此输入并确定';
				input.onkeydown=function(e){
					if(this.value=='如需精确搜索请在此输入并确定') this.value='';
					e.stopPropagation();
					if(e.keyCode==13){
						var value=this.value;
						if(value){
							window.yk_findCharacter();
						}else{
							alert('您尚未输入文字！');
						};
					};
				};	
				input.onmousedown=function(e){
					e.stopPropagation();
				};
				dialog.insertBefore(div,dialog.firstChild);
				dialog.add('<br>【法则天定】：选择要对【'+(lib.translate[event.targetSkill]==undefined?event.targetSkill:(get.translation(event.targetSkill).indexOf('新')==0?get.translation(event.targetSkill).slice(1,3):get.translation(event.targetSkill).slice(0,2)))+'】进行'+event.choose_jntm+'的方式<br><b><font color=orange><li>若需要搜索指定武将或技能，请在选择类型后，在上方搜索栏中输入关键字并点击确定后，选择“从现有技能池中选取模板”<br><br>若要搜索指定自定义效果，请选择技能叙述并输入关键词后点击确定</font></b>');
				var clickItem=function(){
					_status.event._result=this.link;
					dialog.close();
					game.resume();
				};
				var chooseList=[];
				if(event.choose_jntm!='添加或修改该技能的子技能和技能组') chooseList.push('自定义效果');
				chooseList.push('从现有技能池中选取模板');
				for(var choose of chooseList){
					var item=dialog.add('<div class="popup pointerdiv" style="width:100%;display:inline-block"><div class="skill">'+choose+'</div></div>');
					item.firstChild.addEventListener('click',clickItem);
					item.firstChild.link=choose;
				}
				dialog.add(ui.create.div('.placeholder'));
				event.switchToAuto=function(){
					event._result=event.skillai();
					dialog.close();
					game.resume();
				};
				_status.imchoosing=true;
				game.pause();
			}
			else{
				event._result=event.chooseai2();
			}
			'step 9'
			_status.imchoosing=false;
			if(result) event.getPath=result;
			if(event.getPath=='从现有技能池中选取模板') event.goto(10);
			else if(event.getPath=='自定义效果') event.goto(26);
			else event.finish();
			'step 10'
			//读取技能池
			event.libSkillNum=0;
			if(event.choose_jntm=='添加或修改该技能的发动时机'&&event.skillType=='主动技'){
				if(event.findType){
					if(event.findType[1]=='nameT'){
						var value=event.findType[0];
						for(var character in lib.character){
							if(!window.yk_compareStr(get.translation(character),value)) continue;
							for(var skill of lib.character[character][3]){
								if(!lib.skill[skill]) continue;
								if(skill.indexOf('_')!=0&&lib.skill[skill].enable) event.libSkillNum++;
							}
						}
						if(!event.libSkillNum){alert('未查找到相关武将或该武将没有技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='name1'){
						var value=event.findType[0];
						for(var skill of lib.character[character][3]){
							if(!lib.skill[skill]) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].enable) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关武将或该武将没有技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='skillT'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].enable) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='skill1'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(skill,value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].enable) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='skill2'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill+'_info'),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].enable) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
				}
				else{
					for(var skill in lib.skill){
						event.libSkillNum++;
					}
				}
			}
			else if(event.choose_jntm=='添加或修改该技能的发动时机'&&event.skillType=='触发技'){
				if(event.findType){
					if(event.findType[1]=='nameT'){
						var value=event.findType[0];
						for(var character in lib.character){
							if(!window.yk_compareStr(get.translation(character),value)) continue;
							for(var skill of lib.character[character][3]){
								if(!lib.skill[skill]) continue;
								if(skill.indexOf('_')!=0&&lib.skill[skill].trigger) event.libSkillNum++;
							}
						}
						if(!event.libSkillNum){alert('未查找到相关武将或该武将没有技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='name1'){
						var value=event.findType[0];
						for(var skill of lib.character[character][3]){
							if(!lib.skill[skill]) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].trigger) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关武将或该武将没有技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='skillT'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].trigger) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='skill1'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(skill,value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].trigger) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='skill2'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill+'_info'),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].trigger) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
				}
				else{
					for(var skill in lib.skill){
						event.libSkillNum++;
					}
				}
			}
			else if(event.choose_jntm=='添加或修改该技能的发动条件'){
				if(event.findType){
					if(event.findType[1]=='nameT'){
						var value=event.findType[0];
						for(var character in lib.character){
							if(!window.yk_compareStr(get.translation(character),value)) continue;
							for(var skill of lib.character[character][3]){
								if(!lib.skill[skill]) continue;
								if(skill.indexOf('_')!=0&&lib.skill[skill].filter) event.libSkillNum++;
							}
						}
						if(!event.libSkillNum){alert('未查找到相关武将或该武将没有技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='name1'){
						var value=event.findType[0];
						for(var skill of lib.character[character][3]){
							if(!lib.skill[skill]) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].filter) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关武将或该武将没有技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='skillT'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].filter) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='skill1'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(skill,value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].filter) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='skill2'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill+'_info'),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].filter) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
				}
				else{
					for(var skill in lib.skill){
						event.libSkillNum++;
					}
				}
			}
			else if(event.choose_jntm=='添加或修改该技能的发动效果'){
				if(event.findType){
					if(event.findType[1]=='nameT'){
						var value=event.findType[0];
						for(var character in lib.character){
							if(!window.yk_compareStr(get.translation(character),value)) continue;
							for(var skill of lib.character[character][3]){
								if(!lib.skill[skill]) continue;
								if(skill.indexOf('_')!=0&&lib.skill[skill].content) event.libSkillNum++;
							}
						}
						if(!event.libSkillNum){alert('未查找到相关武将或该武将没有技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='name1'){
						var value=event.findType[0];
						for(var skill of lib.character[character][3]){
							if(!lib.skill[skill]) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].content) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关武将或该武将没有技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='skillT'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].content) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='skill1'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(skill,value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].content) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='skill2'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill+'_info'),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].content) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
				}
				else{
					for(var skill in lib.skill){
						event.libSkillNum++;
					}
				}
			}
			else if(event.choose_jntm=='添加或修改该技能的发动卡牌限制'){
				if(event.findType){
					if(event.findType[1]=='nameT'){
						var value=event.findType[0];
						for(var character in lib.character){
							if(!window.yk_compareStr(get.translation(character),value)) continue;
							for(var skill of lib.character[character][3]){
								if(!lib.skill[skill]) continue;
								if(skill.indexOf('_')!=0&&(lib.skill[skill].filterCard||lib.skill[skill].selectCard)) event.libSkillNum++;
							}
						}
						if(!event.libSkillNum){alert('未查找到相关武将或该武将没有技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='name1'){
						var value=event.findType[0];
						for(var skill of lib.character[character][3]){
							if(!lib.skill[skill]) continue;
							if(skill.indexOf('_')!=0&&(lib.skill[skill].filterCard||lib.skill[skill].selectCard)) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关武将或该武将没有技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='skillT'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill),value)) continue;
							if(skill.indexOf('_')!=0&&(lib.skill[skill].filterCard||lib.skill[skill].selectCard)) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='skill1'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(skill,value)) continue;
							if(skill.indexOf('_')!=0&&(lib.skill[skill].filterCard||lib.skill[skill].selectCard)) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='skill2'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill+'_info'),value)) continue;
							if(skill.indexOf('_')!=0&&(lib.skill[skill].filterCard||lib.skill[skill].selectCard)) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
				}
				else{
					for(var skill in lib.skill){
						event.libSkillNum++;
					}
				}
			}
			else if(event.choose_jntm=='添加或修改该技能的发动对象限制'){
				if(event.findType){
					if(event.findType[1]=='nameT'){
						var value=event.findType[0];
						for(var character in lib.character){
							if(!window.yk_compareStr(get.translation(character),value)) continue;
							for(var skill of lib.character[character][3]){
								if(!lib.skill[skill]) continue;
								if(skill.indexOf('_')!=0&&lib.skill[skill].filterTarget) event.libSkillNum++;
							}
						}
						if(!event.libSkillNum){alert('未查找到相关武将或该武将没有技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='name1'){
						var value=event.findType[0];
						for(var skill of lib.character[character][3]){
							if(!lib.skill[skill]) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].filterTarget) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关武将或该武将没有技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='skillT'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].filterTarget) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='skill1'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(skill,value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].filterTarget) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='skill2'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill+'_info'),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].filterTarget) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
				}
				else{
					for(var skill in lib.skill){
						event.libSkillNum++;
					}
				}
			}
			else if(event.choose_jntm=='添加或修改该技能的对象数量限制'){
				if(event.findType){
					if(event.findType[1]=='nameT'){
						var value=event.findType[0];
						for(var character in lib.character){
							if(!window.yk_compareStr(get.translation(character),value)) continue;
							for(var skill of lib.character[character][3]){
								if(!lib.skill[skill]) continue;
								if(skill.indexOf('_')!=0&&lib.skill[skill].selectTarget) event.libSkillNum++;
							}
						}
						if(!event.libSkillNum){alert('未查找到相关武将或该武将没有技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='name1'){
						var value=event.findType[0];
						for(var skill of lib.character[character][3]){
							if(!lib.skill[skill]) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].selectTarget) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关武将或该武将没有技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='skillT'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].selectTarget) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='skill1'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(skill,value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].selectTarget) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='skill2'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill+'_info'),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].selectTarget) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
				}
				else{
					for(var skill in lib.skill){
						event.libSkillNum++;
					}
				}
			}
			else if(event.choose_jntm=='添加或修改该技能的mod效果'){
				if(event.findType){
					if(event.findType[1]=='nameT'){
						var value=event.findType[0];
						for(var character in lib.character){
							if(!window.yk_compareStr(get.translation(character),value)) continue;
							for(var skill of lib.character[character][3]){
								if(!lib.skill[skill]) continue;
								if(skill.indexOf('_')!=0&&lib.skill[skill].mod) event.libSkillNum++;
							}
						}
						if(!event.libSkillNum){alert('未查找到相关武将或该武将没有技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='name1'){
						var value=event.findType[0];
						for(var skill of lib.character[character][3]){
							if(!lib.skill[skill]) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].mod) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关武将或该武将没有技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='skillT'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].mod) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='skill1'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(skill,value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].mod) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='skill2'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill+'_info'),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].mod) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
				}
				else{
					for(var skill in lib.skill){
						event.libSkillNum++;
					}
				}
			}
			else if(event.choose_jntm=='添加或修改该技能的视为效果'){
				if(event.findType){
					if(event.findType[1]=='nameT'){
						var value=event.findType[0];
						for(var character in lib.character){
							if(!window.yk_compareStr(get.translation(character),value)) continue;
							for(var skill of lib.character[character][3]){
								if(!lib.skill[skill]) continue;
								if(skill.indexOf('_')!=0&&lib.skill[skill].viewAs) event.libSkillNum++;
							}
						}
						if(!event.libSkillNum){alert('未查找到相关武将或该武将没有技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='name1'){
						var value=event.findType[0];
						for(var skill of lib.character[character][3]){
							if(!lib.skill[skill]) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].viewAs) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关武将或该武将没有技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='skillT'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].viewAs) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='skill1'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(skill,value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].viewAs) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='skill2'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill+'_info'),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].viewAs) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
				}
				else{
					for(var skill in lib.skill){
						event.libSkillNum++;
					}
				}
			}
			else if(event.choose_jntm=='添加或修改该技能的子技能和技能组'){
				if(event.findType){
					if(event.findType[1]=='nameT'){
						var value=event.findType[0];
						for(var character in lib.character){
							if(!window.yk_compareStr(get.translation(character),value)) continue;
							for(var skill of lib.character[character][3]){
								if(!lib.skill[skill]) continue;
								if(i.indexOf('_')!=0&&(lib.skill[i].subSkill||lib.skill[i].group)) event.libSkillNum++;
							}
						}
						if(!event.libSkillNum){alert('未查找到相关武将或该武将没有技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='name1'){
						var value=event.findType[0];
						for(var skill of lib.character[character][3]){
							if(!lib.skill[skill]) continue;
							if(i.indexOf('_')!=0&&(lib.skill[i].subSkill||lib.skill[i].group)) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关武将或该武将没有技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='skillT'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill),value)) continue;
							if(i.indexOf('_')!=0&&(lib.skill[i].subSkill||lib.skill[i].group)) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='skill1'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(skill,value)) continue;
							if(i.indexOf('_')!=0&&(lib.skill[i].subSkill||lib.skill[i].group)) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='skill2'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill+'_info'),value)) continue;
							if(i.indexOf('_')!=0&&(lib.skill[i].subSkill||lib.skill[i].group)) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
				}
				else{
					for(var skill in lib.skill){
						event.libSkillNum++;
					}
				}
			}
			else if(event.choose_jntm=='添加或修改该技能的init获得此技能时的效果'){
				if(event.findType){
					if(event.findType[1]=='nameT'){
						var value=event.findType[0];
						for(var character in lib.character){
							if(!window.yk_compareStr(get.translation(character),value)) continue;
							for(var skill of lib.character[character][3]){
								if(!lib.skill[skill]) continue;
								if(skill.indexOf('_')!=0&&lib.skill[skill].init) event.libSkillNum++;
							}
						}
						if(!event.libSkillNum){alert('未查找到相关武将或该武将没有技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='name1'){
						var value=event.findType[0];
						for(var skill of lib.character[character][3]){
							if(!lib.skill[skill]) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].init) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关武将或该武将没有技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='skillT'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].init) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='skill1'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(skill,value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].init) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='skill2'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill+'_info'),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].init) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
				}
				else{
					for(var skill in lib.skill){
						event.libSkillNum++;
					}
				}
			}
			else if(event.choose_jntm=='添加或修改该技能的onremove失去此技能时的效果'){
				if(event.findType){
					if(event.findType[1]=='nameT'){
						var value=event.findType[0];
						for(var character in lib.character){
							if(!window.yk_compareStr(get.translation(character),value)) continue;
							for(var skill of lib.character[character][3]){
								if(!lib.skill[skill]) continue;
								if(skill.indexOf('_')!=0&&lib.skill[skill].onremove) event.libSkillNum++;
							}
						}
						if(!event.libSkillNum){alert('未查找到相关武将或该武将没有技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='name1'){
						var value=event.findType[0];
						for(var skill of lib.character[character][3]){
							if(!lib.skill[skill]) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].onremove) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关武将或该武将没有技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='skillT'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].onremove) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='skill1'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(skill,value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].onremove) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
					else if(event.findType[1]=='skill2'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill+'_info'),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].onremove) event.libSkillNum++;
						}
						if(!event.libSkillNum){alert('未查找到相关技能！');event.findType=undefined;if(event.dialogAlert) event.dialogAlert.delete();event.goto(8);}
					}
				}
				else{
					for(var skill in lib.skill){
						event.libSkillNum++;
					}
				}
			}
			event.dialogAlert=ui.create.dialog('hidden');
			event.dialogAlert.style.backgroundColor='black';
			event.dialogAlert.style.opacity=0.75;
			event.dialogAlert.innerHTML='<b><font color=orange>正在加载技能池中所有符合条件的'+event.libSkillNum+'个非全局技能，可能需要一些时间。<br>请耐心等待，祝您游戏愉快！</font></b>';
			event.dialogAlert.style.height='60px';
			event.dialogAlert.style.width='400px';
			event.dialogAlert.style.backgroundColor='black';
			event.dialogAlert.style.opacity=0.6;
			event.dialogAlert.style.borderRadius = '10px';
			event.dialogAlert.style.left='calc( 50% - 200px )';
			event.dialogAlert.style.top='calc( 50% - 30px )';
			event.dialogAlert.style['z-index']=499;
			event.dialogAlert.style['text-align']='center';
			document.body.appendChild(event.dialogAlert);
			event.dialogAlert.show();
			game.delayx();
			'step 11'
			event.libSkillList = [];
			if(event.choose_jntm=='添加或修改该技能的发动时机'&&event.skillType=='主动技'){
				if(event.findType){
					if(event.findType[1]=='nameT'){
						var value=event.findType[0];
						for(var character in lib.character){
							if(!window.yk_compareStr(get.translation(character),value)) continue;
							for(var skill of lib.character[character][3]){
								if(!lib.skill[skill]) continue;
								if(skill.indexOf('_')!=0&&lib.skill[skill].enable) if(event.libSkillList.indexOf(skill)==-1){
									var skillx={
										skillname:skill,
										sameNum:window.yk_compareStr(get.translation(character),value),
									}
									event.libSkillList.add(skillx);
								}
							}
						}
					}
					else if(event.findType[1]=='name1'){
						var value=event.findType[0];
						for(var skill of lib.character[character][3]){
							if(!lib.skill[skill]) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].enable) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(character,value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
					else if(event.findType[1]=='skillT'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].enable) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(get.translation(skill),value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
					else if(event.findType[1]=='skill1'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(skill,value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].enable) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(skill,value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
					else if(event.findType[1]=='skill2'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill+'_info'),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].enable) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(get.translation(skill+'_info'),value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
				}
				else{
					for(var skill in lib.skill){
						if(event.libSkillList.indexOf(skill)==-1) event.libSkillList.add(skill);
					}
				}
			}
			else if(event.choose_jntm=='添加或修改该技能的发动时机'&&event.skillType=='触发技'){
				if(event.findType){
					if(event.findType[1]=='nameT'){
						var value=event.findType[0];
						for(var character in lib.character){
							if(!window.yk_compareStr(get.translation(character),value)) continue;
							for(var skill of lib.character[character][3]){
								if(!lib.skill[skill]) continue;
								if(skill.indexOf('_')!=0&&lib.skill[skill].trigger) if(event.libSkillList.indexOf(skill)==-1){
									var skillx={
										skillname:skill,
										sameNum:window.yk_compareStr(get.translation(character),value),
									}
									event.libSkillList.add(skillx);
								}
							}
						}
					}
					else if(event.findType[1]=='name1'){
						var value=event.findType[0];
						for(var skill of lib.character[character][3]){
							if(!lib.skill[skill]) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].trigger) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(character,value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
					else if(event.findType[1]=='skillT'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].trigger) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(get.translation(skill),value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
					else if(event.findType[1]=='skill1'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(skill,value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].trigger) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(skill,value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
					else if(event.findType[1]=='skill2'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill+'_info'),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].trigger) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(get.translation(skill+'_info'),value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
				}
				else{
					for(var skill in lib.skill){
						if(event.libSkillList.indexOf(skill)==-1) event.libSkillList.add(skill);
					}
				}
			}
			else if(event.choose_jntm=='添加或修改该技能的发动条件'){
				if(event.findType){
					if(event.findType[1]=='nameT'){
						var value=event.findType[0];
						for(var character in lib.character){
							if(!window.yk_compareStr(get.translation(character),value)) continue;
							for(var skill of lib.character[character][3]){
								if(!lib.skill[skill]) continue;
								if(skill.indexOf('_')!=0&&lib.skill[skill].filter) if(event.libSkillList.indexOf(skill)==-1){
									var skillx={
										skillname:skill,
										sameNum:window.yk_compareStr(get.translation(character),value),
									}
									event.libSkillList.add(skillx);
								}
							}
						}
					}
					else if(event.findType[1]=='name1'){
						var value=event.findType[0];
						for(var skill of lib.character[character][3]){
							if(!lib.skill[skill]) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].filter) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(character,value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
					else if(event.findType[1]=='skillT'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].filter) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(get.translation(skill),value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
					else if(event.findType[1]=='skill1'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(skill,value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].filter) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(skill,value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
					else if(event.findType[1]=='skill2'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill+'_info'),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].filter) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(get.translation(skill+'_info'),value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
				}
				else{
					for(var skill in lib.skill){
						if(event.libSkillList.indexOf(skill)==-1) event.libSkillList.add(skill);
					}
				}
			}
			else if(event.choose_jntm=='添加或修改该技能的发动效果'){
				if(event.findType){
					if(event.findType[1]=='nameT'){
						var value=event.findType[0];
						for(var character in lib.character){
							if(!window.yk_compareStr(get.translation(character),value)) continue;
							for(var skill of lib.character[character][3]){
								if(!lib.skill[skill]) continue;
								if(skill.indexOf('_')!=0&&lib.skill[skill].content) if(event.libSkillList.indexOf(skill)==-1){
									var skillx={
										skillname:skill,
										sameNum:window.yk_compareStr(get.translation(character),value),
									}
									event.libSkillList.add(skillx);
								}
							}
						}
					}
					else if(event.findType[1]=='name1'){
						var value=event.findType[0];
						for(var skill of lib.character[character][3]){
							if(!lib.skill[skill]) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].content) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(character,value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
					else if(event.findType[1]=='skillT'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].content) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(get.translation(skill),value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
					else if(event.findType[1]=='skill1'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(skill,value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].content) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(skill,value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
					else if(event.findType[1]=='skill2'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill+'_info'),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].content) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(get.translation(skill+'_info'),value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
				}
				else{
					for(var skill in lib.skill){
						if(event.libSkillList.indexOf(skill)==-1) event.libSkillList.add(skill);
					}
				}
			}
			else if(event.choose_jntm=='添加或修改该技能的发动卡牌限制'){
				if(event.findType){
					if(event.findType[1]=='nameT'){
						var value=event.findType[0];
						for(var character in lib.character){
							if(!window.yk_compareStr(get.translation(character),value)) continue;
							for(var skill of lib.character[character][3]){
								if(!lib.skill[skill]) continue;
								if(skill.indexOf('_')!=0&&(lib.skill[skill].filterCard||lib.skill[skill].selectCard)) if(event.libSkillList.indexOf(skill)==-1){
									var skillx={
										skillname:skill,
										sameNum:window.yk_compareStr(get.translation(character),value),
									}
									event.libSkillList.add(skillx);
								}
							}
						}
					}
					else if(event.findType[1]=='name1'){
						var value=event.findType[0];
						for(var skill of lib.character[character][3]){
							if(!lib.skill[skill]) continue;
							if(skill.indexOf('_')!=0&&(lib.skill[skill].filterCard||lib.skill[skill].selectCard)) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(character,value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
					else if(event.findType[1]=='skillT'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill),value)) continue;
							if(skill.indexOf('_')!=0&&(lib.skill[skill].filterCard||lib.skill[skill].selectCard)) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(get.translation(skill),value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
					else if(event.findType[1]=='skill1'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(skill,value)) continue;
							if(skill.indexOf('_')!=0&&(lib.skill[skill].filterCard||lib.skill[skill].selectCard)) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(skill,value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
					else if(event.findType[1]=='skill2'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill+'_info'),value)) continue;
							if(skill.indexOf('_')!=0&&(lib.skill[skill].filterCard||lib.skill[skill].selectCard)) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(get.translation(skill+'_info'),value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
				}
				else{
					for(var skill in lib.skill){
						if(event.libSkillList.indexOf(skill)==-1) event.libSkillList.add(skill);
					}
				}
			}
			else if(event.choose_jntm=='添加或修改该技能的发动对象限制'){
				if(event.findType){
					if(event.findType[1]=='nameT'){
						var value=event.findType[0];
						for(var character in lib.character){
							if(!window.yk_compareStr(get.translation(character),value)) continue;
							for(var skill of lib.character[character][3]){
								if(!lib.skill[skill]) continue;
								if(skill.indexOf('_')!=0&&lib.skill[skill].filterTarget) if(event.libSkillList.indexOf(skill)==-1){
									var skillx={
										skillname:skill,
										sameNum:window.yk_compareStr(get.translation(character),value),
									}
									event.libSkillList.add(skillx);
								}
							}
						}
					}
					else if(event.findType[1]=='name1'){
						var value=event.findType[0];
						for(var skill of lib.character[character][3]){
							if(!lib.skill[skill]) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].filterTarget) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(character,value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
					else if(event.findType[1]=='skillT'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].filterTarget) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(get.translation(skill),value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
					else if(event.findType[1]=='skill1'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(skill,value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].filterTarget) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(skill,value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
					else if(event.findType[1]=='skill2'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill+'_info'),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].filterTarget) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(get.translation(skill+'_info'),value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
				}
				else{
					for(var skill in lib.skill){
						if(event.libSkillList.indexOf(skill)==-1) event.libSkillList.add(skill);
					}
				}
			}
			else if(event.choose_jntm=='添加或修改该技能的对象数量限制'){
				if(event.findType){
					if(event.findType[1]=='nameT'){
						var value=event.findType[0];
						for(var character in lib.character){
							if(!window.yk_compareStr(get.translation(character),value)) continue;
							for(var skill of lib.character[character][3]){
								if(!lib.skill[skill]) continue;
								if(skill.indexOf('_')!=0&&lib.skill[skill].selectTarget) if(event.libSkillList.indexOf(skill)==-1){
									var skillx={
										skillname:skill,
										sameNum:window.yk_compareStr(get.translation(character),value),
									}
									event.libSkillList.add(skillx);
								}
							}
						}
					}
					else if(event.findType[1]=='name1'){
						var value=event.findType[0];
						for(var skill of lib.character[character][3]){
							if(!lib.skill[skill]) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].selectTarget) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(character,value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
					else if(event.findType[1]=='skillT'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].selectTarget) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(get.translation(skill),value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
					else if(event.findType[1]=='skill1'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(skill,value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].selectTarget) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(skill,value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
					else if(event.findType[1]=='skill2'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill+'_info'),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].selectTarget) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(get.translation(skill+'_info'),value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
				}
				else{
					for(var skill in lib.skill){
						if(event.libSkillList.indexOf(skill)==-1) event.libSkillList.add(skill);
					}
				}
			}
			else if(event.choose_jntm=='添加或修改该技能的mod效果'){
				if(event.findType){
					if(event.findType[1]=='nameT'){
						var value=event.findType[0];
						for(var character in lib.character){
							if(!window.yk_compareStr(get.translation(character),value)) continue;
							for(var skill of lib.character[character][3]){
								if(!lib.skill[skill]) continue;
								if(skill.indexOf('_')!=0&&lib.skill[skill].mod) if(event.libSkillList.indexOf(skill)==-1){
									var skillx={
										skillname:skill,
										sameNum:window.yk_compareStr(get.translation(character),value),
									}
									event.libSkillList.add(skillx);
								}
							}
						}
					}
					else if(event.findType[1]=='name1'){
						var value=event.findType[0];
						for(var skill of lib.character[character][3]){
							if(!lib.skill[skill]) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].mod) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(character,value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
					else if(event.findType[1]=='skillT'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].mod) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(get.translation(skill),value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
					else if(event.findType[1]=='skill1'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(skill,value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].mod) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(skill,value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
					else if(event.findType[1]=='skill2'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill+'_info'),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].mod) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(get.translation(skill+'_info'),value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
				}
				else{
					for(var skill in lib.skill){
						if(event.libSkillList.indexOf(skill)==-1) event.libSkillList.add(skill);
					}
				}
			}
			else if(event.choose_jntm=='添加或修改该技能的视为效果'){
				if(event.findType){
					if(event.findType[1]=='nameT'){
						var value=event.findType[0];
						for(var character in lib.character){
							if(!window.yk_compareStr(get.translation(character),value)) continue;
							for(var skill of lib.character[character][3]){
								if(!lib.skill[skill]) continue;
								if(skill.indexOf('_')!=0&&lib.skill[skill].viewAs) if(event.libSkillList.indexOf(skill)==-1){
									var skillx={
										skillname:skill,
										sameNum:window.yk_compareStr(get.translation(character),value),
									}
									event.libSkillList.add(skillx);
								}
							}
						}
					}
					else if(event.findType[1]=='name1'){
						var value=event.findType[0];
						for(var skill of lib.character[character][3]){
							if(!lib.skill[skill]) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].viewAs) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(character,value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
					else if(event.findType[1]=='skillT'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].viewAs) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(get.translation(skill),value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
					else if(event.findType[1]=='skill1'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(skill,value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].viewAs) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(skill,value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
					else if(event.findType[1]=='skill2'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill+'_info'),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].viewAs) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(get.translation(skill+'_info'),value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
				}
				else{
					for(var skill in lib.skill){
						if(event.libSkillList.indexOf(skill)==-1) event.libSkillList.add(skill);
					}
				}
			}
			else if(event.choose_jntm=='添加或修改该技能的子技能和技能组'){
				if(event.findType){
					if(event.findType[1]=='nameT'){
						var value=event.findType[0];
						for(var character in lib.character){
							if(!window.yk_compareStr(get.translation(character),value)) continue;
							for(var skill of lib.character[character][3]){
								if(!lib.skill[skill]) continue;
								if(skill.indexOf('_')!=0&&(lib.skill[skill].subSkill||lib.skill[skill].group)) if(event.libSkillList.indexOf(skill)==-1){
									var skillx={
										skillname:skill,
										sameNum:window.yk_compareStr(get.translation(character),value),
									}
									event.libSkillList.add(skillx);
								}
							}
						}
					}
					else if(event.findType[1]=='name1'){
						var value=event.findType[0];
						for(var skill of lib.character[character][3]){
							if(!lib.skill[skill]) continue;
							if(skill.indexOf('_')!=0&&(lib.skill[skill].subSkill||lib.skill[skill].group)) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(character,value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
					else if(event.findType[1]=='skillT'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill),value)) continue;
							if(skill.indexOf('_')!=0&&(lib.skill[skill].subSkill||lib.skill[skill].group)) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(get.translation(skill),value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
					else if(event.findType[1]=='skill1'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(skill,value)) continue;
							if(skill.indexOf('_')!=0&&(lib.skill[skill].subSkill||lib.skill[skill].group)) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(skill,value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
					else if(event.findType[1]=='skill2'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill+'_info'),value)) continue;
							if(skill.indexOf('_')!=0&&(lib.skill[skill].subSkill||lib.skill[skill].group)) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(get.translation(skill+'_info'),value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
				}
				else{
					for(var skill in lib.skill){
						if(event.libSkillList.indexOf(skill)==-1) event.libSkillList.add(skill);
					}
				}
			}
			else if(event.choose_jntm=='添加或修改该技能的init获得此技能时的效果'){
				if(event.findType){
					if(event.findType[1]=='nameT'){
						var value=event.findType[0];
						for(var character in lib.character){
							if(!window.yk_compareStr(get.translation(character),value)) continue;
							for(var skill of lib.character[character][3]){
								if(!lib.skill[skill]) continue;
								if(skill.indexOf('_')!=0&&lib.skill[skill].init) if(event.libSkillList.indexOf(skill)==-1){
									var skillx={
										skillname:skill,
										sameNum:window.yk_compareStr(get.translation(character),value),
									}
									event.libSkillList.add(skillx);
								}
							}
						}
					}
					else if(event.findType[1]=='name1'){
						var value=event.findType[0];
						for(var skill of lib.character[character][3]){
							if(!lib.skill[skill]) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].init) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(character,value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
					else if(event.findType[1]=='skillT'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].init) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(get.translation(skill),value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
					else if(event.findType[1]=='skill1'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(skill,value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].init) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(skill,value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
					else if(event.findType[1]=='skill2'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill+'_info'),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].init) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(get.translation(skill+'_info'),value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
				}
				else{
					for(var skill in lib.skill){
						if(event.libSkillList.indexOf(skill)==-1) event.libSkillList.add(skill);
					}
				}
			}
			else if(event.choose_jntm=='添加或修改该技能的onremove失去此技能时的效果'){
				if(event.findType){
					if(event.findType[1]=='nameT'){
						var value=event.findType[0];
						for(var character in lib.character){
							if(!window.yk_compareStr(get.translation(character),value)) continue;
							for(var skill of lib.character[character][3]){
								if(!lib.skill[skill]) continue;
								if(skill.indexOf('_')!=0&&lib.skill[skill].onremove) if(event.libSkillList.indexOf(skill)==-1){
									var skillx={
										skillname:skill,
										sameNum:window.yk_compareStr(get.translation(character),value),
									}
									event.libSkillList.add(skillx);
								}
							}
						}
					}
					else if(event.findType[1]=='name1'){
						var value=event.findType[0];
						for(var skill of lib.character[character][3]){
							if(!lib.skill[skill]) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].onremove) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(character,value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
					else if(event.findType[1]=='skillT'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].onremove) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(get.translation(skill),value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
					else if(event.findType[1]=='skill1'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(skill,value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].onremove) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(skill,value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
					else if(event.findType[1]=='skill2'){
						var value=event.findType[0];
						for(var skill in lib.skill){
							if(!window.yk_compareStr(get.translation(skill+'_info'),value)) continue;
							if(skill.indexOf('_')!=0&&lib.skill[skill].onremove) if(event.libSkillList.indexOf(skill)==-1){
								var skillx={
									skillname:skill,
									sameNum:window.yk_compareStr(get.translation(skill+'_info'),value),
								}
								event.libSkillList.add(skillx);
							}
						}
					}
				}
				else{
					for(var skill in lib.skill){
						if(event.libSkillList.indexOf(skill)==-1) event.libSkillList.add(skill);
					}
				}
			}
			if(event.libSkillList.length==0) event.finish();
			event.dialogAlert.delete();
			'step 12'
			event.skillai=function(){
				var list=[];
				for(var skill of event.libSkillList) {
					if(skill=='hstianqi'||(skill&&skill.skillname=='hstianqi')) continue;
					if(typeof skill!='string') list.push(skill.skillname);
					else list.push(skill);
				}
				return get.min(list,get.skillRank,'item');
			};
			if(event.isMine()){
				var dialog=ui.create.dialog('forcebutton');
				dialog.add('【法则天定】：<b><font color=orange>选择要参考的模板技能</font></b><br>当前修改技能目标<br>【<b>'+(lib.translate[event.targetSkill]==undefined?event.targetSkill:(get.translation(event.targetSkill).indexOf('新')==0?get.translation(event.targetSkill).slice(1,3):get.translation(event.targetSkill).slice(0,2)))+'</b>】：'+get.translation(event.targetSkill+'_info')+'<br><li>当前选项：'+event.choose_jntm+'<br><li><b><font color=orange>选择缝合已有技能的content效果时请合理缝合，否则将不产生效果且可能出现弹窗！</font></b>');
				var clickItem=function(){
					_status.event._result=this.link;
					dialog.close();
					game.resume();
				};
				if(event.findType&&event.findType.length){
					if(event.findType[0]&&event.findType[1]){
						var text,value=event.findType[0];
						if(event.findType[1]=='nameT') text='武将翻译名';
						else if(event.findType[1]=='name1') text='武将英文名';
						else if(event.findType[1]=='skillT') text='技能翻译名';
						else if(event.findType[1]=='skill1') text='技能英文名';
						else if(event.findType[1]=='skill2') text='技能叙述';
						var item=dialog.add('<div class="popup pointerdiv" style="width:100%;display:inline-block"><div>当前搜索内容：【'+text+'】：'+value+'<br><b><font color=orange>点击此选项返回搜索</font></b></div></div>');
						item.firstChild.addEventListener('click',clickItem);
						var skill={
							skillname:'qxq_yk_fztd_comback',
							sameNum:1,
						};
						item.firstChild.link=skill;
					}
				}
				if(event.libSkillList.length>0&&typeof event.libSkillList.randomGet()!='string'){
					event.libSkillList.sort(function (x, y) {
						var a = x.sameNum;
						var b = y.sameNum;
						if(a<b) return 1;
						if(a>b) return -1;
						return 0;
					});
				}
				else event.libSkillList.randomSort();
				for(var skill of event.libSkillList){
					if(typeof skill=='string'){
						if(lib.translate[skill+'_info']){
							var translation=get.translation(skill);
							if(translation&&translation[0]=='新'&&translation.length==3){
								translation=translation.slice(1,3);
							}
							else if(translation){
								translation=translation.slice(0,2);
							}
						}
						var item=dialog.add('<div class="popup pointerdiv" style="width:100%;display:inline-block"><div class="skill">【'+translation+'】</div><div>'+(lib.translate[skill+'_info']==undefined?'暂无技能描述':lib.translate[skill+'_info'].replace(new RegExp("<(\S*?)[^>]*>.*?|<.*? />", 'gi'), ''))+'</div></div>');
						item.firstChild.addEventListener('click',clickItem);
						item.firstChild.link=skill;
					}
					else{
						var skillname=skill.skillname;
						if(lib.translate[skillname+'_info']){
							var translation=get.translation(skillname);
							if(translation&&translation[0]=='新'&&translation.length==3){
								translation=translation.slice(1,3);
							}
							else if(translation){
								translation=translation.slice(0,2);
							}
						}
						var item=dialog.add('<div class="popup pointerdiv" style="width:100%;display:inline-block"><div class="skill">【'+translation+'】</div><div>'+(lib.translate[skillname+'_info']==undefined?'暂无技能描述':lib.translate[skillname+'_info'].replace(new RegExp("<(\S*?)[^>]*>.*?|<.*? />", 'gi'), ''))+'</div></div>');
						item.firstChild.addEventListener('click',clickItem);
						item.firstChild.link=skillname;
					}
				}
				dialog.add(ui.create.div('.placeholder'));
				event.switchToAuto=function(){
					event._result=event.skillai();
					dialog.close();
					game.resume();
				};
				_status.imchoosing=true;
				game.pause();
			}
			else{
				event._result=event.skillai();
			}
			'step 13'
			_status.imchoosing=false;
			if(result&&result.skillname=='qxq_yk_fztd_comback'){event.findType=undefined;event.goto(8);}
			if(typeof result=='string'){
				event.panelSkill=result;
			}
			else event.panelSkill=result.skillname;
			if(!event.panelSkill||typeof event.panelSkill!='string') event.finish();
			'step 14'
			if(event.choose_jntm=='添加或修改该技能的发动时机') event.goto(15);
			else if(event.choose_jntm=='添加或修改该技能的发动条件') event.goto(16);
			else if(event.choose_jntm=='添加或修改该技能的发动效果') event.goto(17);
			else if(event.choose_jntm=='添加或修改该技能的发动卡牌限制') event.goto(49);
			else if(event.choose_jntm=='添加或修改该技能的发动对象限制') event.goto(18);
			else if(event.choose_jntm=='添加或修改该技能的对象数量限制') event.goto(19);
			else if(event.choose_jntm=='添加或修改该技能的mod效果') event.goto(20);
			else if(event.choose_jntm=='添加或修改该技能的视为效果') event.goto(21);
			else if(event.choose_jntm=='添加或修改该技能的子技能和技能组') event.goto(22);
			else if(event.choose_jntm=='添加或修改该技能的init获得此技能时的效果') event.goto(23);
			else if(event.choose_jntm=='添加或修改该技能的onremove失去此技能时的效果') event.goto(24);
			else event.finish();
			'step 15'
			//发动时机
			if(['触发技','主动技'].indexOf(event.skillType)!=-1){
				var str='';
				if(event.skillType=='触发技'){
					lib.skill[event.targetSkill].trigger=lib.skill[event.panelSkill].trigger;
					for(var i in lib.skill[event.panelSkill].trigger) str+=i+':"'+lib.skill[event.panelSkill].trigger[i]+'"、';
					if(str.length) str=str.slice(0,str.length-1);
				}
				if(event.skillType=='主动技'){
					lib.skill[event.targetSkill].enable=lib.skill[event.panelSkill].enable;
					str+='enable:"'+lib.skill[event.panelSkill].enable+'"、';
					if(str.length) str=str.slice(0,str.length-1);
				}
				lib.skill[event.targetSkill].ykre_trigger=(str.length>0?('<br><font color=orange>此技能发动时机已被修改为'+str):'')+'</font>';
				game.log(event.target,'的技能<span class="greentext">【'+get.translation(event.targetSkill)+'】</span>发动时机已被修改为'+str);
			}
			event.yk_updateSkillInfo(event.targetSkill);
			if(event.skillType=='主动技'){event.goto(47);}
			else event.finish();
			'step 16'
			//发动条件
			lib.skill[event.targetSkill].filter=lib.skill[event.panelSkill].filter;
			lib.skill[event.targetSkill].ykre_filter='<br><font color=orange>此技能发动条件已被修改为技能<a style="color:cyan" href=\'javascript:window.ykIntroduceSkillInfo("'+event.panelSkill+'");\'>【'+get.translation(event.panelSkill)+'】</a>的发动条件</font>';
			game.log(event.target,'的技能<span class="greentext">【'+get.translation(event.targetSkill)+'】</span>发动条件已被修改为<span class="greentext">【'+get.translation(event.panelSkill)+'】</span>的发动条件');
			event.yk_updateSkillInfo(event.targetSkill);
			event.finish();
			'step 17'
			//发动效果
			lib.skill[event.targetSkill].content2=event.panelSkill;
			lib.skill[event.targetSkill].content=function(){
				var skillx;
				if(!lib.skill[_status.event.name]){
					for(var skill in lib.skill){
						if(lib.skill[skill].subSkill){
							for(var s in lib.skill[skill].subSkill) if(s==_status.event.name){skillx=lib.skill[skill].subSkill[s];break;}
						}
					}
				}
				else{
					skillx=lib.skill[_status.event.name];
				}
				if(!skillx) return ;
				if(!skillx.content2) return ;
				var bool=true;
				var skill2=lib.skill[lib.skill[_status.event.name].content2];
				if(!skill2){game.log('修改后的技能已不存在！');return ;}
				var check=''+skill2.content;
				var check2=''+skill2.content;
				var checkItem=['player','source','card','cards','num','target','targets'];
				while(check.indexOf('trigger.')!=-1&&check.length){
					var checkB;
					check=check.slice(check.indexOf('trigger.')+8,check.length);
					if(check.indexOf('trigger.')!=-1){
						checkB=check.slice(0,check.indexOf('trigger.'));
						check=check.slice(check.indexOf('trigger.')+8,check.length);
					}
					else{
						checkB=check;
						check='';
					}
					var text='';
					var word='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_[]';
					while(checkB.slice(0,1)!=' '&&word.indexOf(checkB.slice(0,1))!=-1&&checkB.length>0){
						text+=checkB.slice(0,1);
						checkB=checkB.slice(1,checkB.length);
						if(checkB.slice(0,1)!=' '&&word.indexOf(checkB.slice(0,1))!=-1&&checkB.length>0){}else{checkItem.push(text);}
					}
				}
				try{
					var next = game.createEvent(lib.skill[_status.event.name].content2,false),trigger=(trigger||{}),target=(target||trigger.target),targets=(targets||trigger.targets),card=(card||trigger.card),cards=(cards||trigger.cards),source=trigger.source;
					var args={
						triggerplayer:trigger.player,
						player:player,
						'_trigger':trigger,
						'_event':_status.event,
						target:target,
						targets:targets,
						card:card,
						cards:cards,
						source:source,
						skill:_status.event.name,
					};
					for(var e in args) next.set(e,args[e]);
					for(var item of checkItem) if(check2.indexOf('trigger.'+item)!=-1&&!next[item]){
						if(trigger[item]!=undefined) next[item]=trigger[item];
					}
					for(var item of checkItem) if(check2.indexOf('trigger.'+item)!=-1&&!next[item]&&item!='player'){game.log('存在未定义参数trigger.'+item+'，缝合技能失效！');var bool=false;}
					if(bool) next.setContent(new Function('try{var trigger=(trigger||{}),event=(event||{});for(var item of ["source","card","cards","num","target","targets"]) if(event[item]!=undefined) trigger[item]=event[item];if(event.triggerplayer) trigger.player=event.triggerplayer;'+skill2.content.slice(skill2.content.indexOf('{')+1,skill2.content.length-1)+'}catch(e){console.log(e);}'));
					else next.setContent(function(){});
				}
				catch(e){
					console.log(e);
				}
			}
			lib.skill[event.targetSkill].ykre_content='<br><font color=orange>此技能发动效果已被修改为技能<a style="color:cyan" href=\'javascript:window.ykIntroduceSkillInfo("'+event.panelSkill+'");\'>【'+get.translation(event.panelSkill)+'】</a>的发动效果</font>';
			game.log(event.target,'的技能<span class="greentext">【'+get.translation(event.targetSkill)+'】</span>发动效果已被修改为<span class="greentext">【'+get.translation(event.panelSkill)+'】</span>的发动效果');
			event.yk_updateSkillInfo(event.targetSkill);
			event.finish();
			'step 18'
			//发动对象限制
			lib.skill[event.targetSkill].filterTarget=lib.skill[event.panelSkill].filterTarget;
			lib.skill[event.targetSkill].ykre_filterTarget='<br><font color=orange>此技能发动对象限制已被修改为技能<a style="color:cyan" href=\'javascript:window.ykIntroduceSkillInfo("'+event.panelSkill+'");\'>【'+get.translation(event.panelSkill)+'】</a>的发动对象限制</font>';
			game.log(event.target,'的技能<span class="greentext">【'+get.translation(event.targetSkill)+'】</span>发动对象限制已被修改为<span class="greentext">【'+get.translation(event.panelSkill)+'】</span>的发动对象限制');
			event.yk_updateSkillInfo(event.targetSkill);
			event.finish();
			'step 19'
			//对象数量限制
			lib.skill[event.targetSkill].selectTarget=lib.skill[event.panelSkill].selectTarget;
			lib.skill[event.targetSkill].ykre_selectTarget='<br><font color=orange>此技能对象数量限制已被修改为技能<a style="color:cyan" href=\'javascript:window.ykIntroduceSkillInfo("'+event.panelSkill+'");\'>【'+get.translation(event.panelSkill)+'】</a>的对象数量限制</font>';
			game.log(event.target,'的技能<span class="greentext">【'+get.translation(event.targetSkill)+'】</span>对象数量限制已被修改为<span class="greentext">【'+get.translation(event.panelSkill)+'】</span>的对象数量限制');
			event.yk_updateSkillInfo(event.targetSkill);
			event.finish();
			'step 20'
			//mod效果
			lib.skill[event.targetSkill].mod=lib.skill[event.panelSkill].mod;
			lib.skill[event.targetSkill].ykre_mod='<br><font color=orange>此技能mod效果已被修改为技能<a style="color:cyan" href=\'javascript:window.ykIntroduceSkillInfo("'+event.panelSkill+'");\'>【'+get.translation(event.panelSkill)+'】</a>的mod效果</font>';
			game.log(event.target,'的技能<span class="greentext">【'+get.translation(event.targetSkill)+'】</span>mod效果已被修改为<span class="greentext">【'+get.translation(event.panelSkill)+'】</span>的mod效果');
			event.yk_updateSkillInfo(event.targetSkill);
			event.finish();
			'step 21'
			//视为效果
			if(lib.skill[event.panelSkill].enable) lib.skill[event.targetSkill].enable=lib.skill[event.panelSkill].enable;
			if(lib.skill[event.panelSkill].filterCard) lib.skill[event.targetSkill].filterCard=lib.skill[event.panelSkill].filterCard;
			if(lib.skill[event.panelSkill].viewAsFilter) lib.skill[event.targetSkill].viewAsFilter=lib.skill[event.panelSkill].viewAsFilter;
			lib.skill[event.targetSkill].viewAs=lib.skill[event.panelSkill].viewAs;
			lib.skill[event.targetSkill].ykre_viewAs='<br><font color=orange>此技能视为效果已被修改为技能<a style="color:cyan" href=\'javascript:window.ykIntroduceSkillInfo("'+event.panelSkill+'");\'>【'+get.translation(event.panelSkill)+'】</a>的视为效果</font>';
			game.log(event.target,'的技能<span class="greentext">【'+get.translation(event.targetSkill)+'】</span>视为效果已被修改为<span class="greentext">【'+get.translation(event.panelSkill)+'】</span>的视为效果');
			event.yk_updateSkillInfo(event.targetSkill);
			event.finish();
			'step 22'
			//子技能和技能组
			lib.skill[event.targetSkill].subSkill=lib.skill[event.panelSkill].subSkill;
			lib.skill[event.targetSkill].group=lib.skill[event.panelSkill].group;
			lib.skill[event.targetSkill].ykre_subSkillgroup='<br><font color=orange>此技能子技能和技能组已被修改为技能<a style="color:cyan" href=\'javascript:window.ykIntroduceSkillInfo("'+event.panelSkill+'");\'>【'+get.translation(event.panelSkill)+'】</a>的子技能和技能组</font>';
			game.log(event.target,'的技能<span class="greentext">【'+get.translation(event.targetSkill)+'】</span>子技能和技能组已被修改为<span class="greentext">【'+get.translation(event.panelSkill)+'】</span>的子技能和技能组');
			event.yk_updateSkillInfo(event.targetSkill);
			event.finish();
			'step 23'
			//init
			lib.skill[event.targetSkill].init=lib.skill[event.panelSkill].init;
			lib.skill[event.targetSkill].ykre_init='<br><font color=orange>此技能init获得此技能效果已被修改为技能<a style="color:cyan" href=\'javascript:window.ykIntroduceSkillInfo("'+event.panelSkill+'");\'>【'+get.translation(event.panelSkill)+'】</a>的init获得此技能效果</font>';
			game.log(event.target,'的技能<span class="greentext">【'+get.translation(event.targetSkill)+'】</span>init获得此技能效果已被修改为<span class="greentext">【'+get.translation(event.panelSkill)+'】</span>的init获得此技能效果');
			event.yk_updateSkillInfo(event.targetSkill);
			'step 24'
			//onremove
			lib.skill[event.targetSkill].onremove=lib.skill[event.panelSkill].onremove;
			lib.skill[event.targetSkill].ykre_onremove='<br><font color=orange>此技能onremove失去此技能效果已被修改为技能<a style="color:cyan" href=\'javascript:window.ykIntroduceSkillInfo("'+event.panelSkill+'");\'>【'+get.translation(event.panelSkill)+'】</a>的onremove失去此技能效果</font>';
			game.log(event.target,'的技能<span class="greentext">【'+get.translation(event.targetSkill)+'】</span>onremove失去此技能效果已被修改为<span class="greentext">【'+get.translation(event.panelSkill)+'】</span>的onremove失去此技能效果');
			event.yk_updateSkillInfo(event.targetSkill);
			'step 25'
			if(event.choose_jntm=='删除该技能的发动时机'&&(lib.skill[event.targetSkill].trigger||lib.skill[event.targetSkill].enable)){
				lib.skill[event.targetSkill].ykre_trigger='<br><font color=orange>此技能发动时机已被删除</font>'+'</font>';
				game.log(event.target,'的技能<span class="greentext">【'+get.translation(event.targetSkill)+'】</span>发动时机已被删除');
				if(lib.skill[event.targetSkill].trigger) delete lib.skill[event.targetSkill].trigger;
				if(lib.skill[event.targetSkill].enable) delete lib.skill[event.targetSkill].enable;
				event.yk_updateSkillInfo(event.targetSkill);
			}
			else if(event.choose_jntm=='删除该技能的发动条件'&&lib.skill[event.targetSkill].filter){
				lib.skill[event.targetSkill].ykre_filter='<br><font color=orange>此技能发动条件已被删除</font>'+'</font>';
				game.log(event.target,'的技能<span class="greentext">【'+get.translation(event.targetSkill)+'】</span>发动条件已被删除');
				if(lib.skill[event.targetSkill].filter) delete lib.skill[event.targetSkill].filter;
				event.yk_updateSkillInfo(event.targetSkill);
			}
			else if(event.choose_jntm=='删除该技能的发动效果'&&lib.skill[event.targetSkill].content){
				lib.skill[event.targetSkill].ykre_content='<br><font color=orange>此技能发动效果已被删除</font>'+'</font>';
				game.log(event.target,'的技能<span class="greentext">【'+get.translation(event.targetSkill)+'】</span>发动效果已被删除');
				if(lib.skill[event.targetSkill].content) delete lib.skill[event.targetSkill].content;
				event.yk_updateSkillInfo(event.targetSkill);
			}
			else if(event.choose_jntm=='删除该技能的发动卡牌限制'&&(lib.skill[skill].filterCard||lib.skill[skill].selectCard)){
				lib.skill[event.targetSkill].ykre_filterselectCard='<br><font color=orange>此技能发动卡牌限制已被删除</font>'+'</font>';
				game.log(event.target,'的技能<span class="greentext">【'+get.translation(event.targetSkill)+'】</span>发动卡牌限制已被删除');
				if(lib.skill[event.targetSkill].filterCard) delete lib.skill[event.targetSkill].filterCard;
				if(lib.skill[event.targetSkill].selectCard) delete lib.skill[event.targetSkill].selectCard;
				event.yk_updateSkillInfo(event.targetSkill);
			}
			else if(event.choose_jntm=='删除该技能的发动对象限制'&&lib.skill[event.targetSkill].filterTarget){
				lib.skill[event.targetSkill].ykre_filterTarget='<br><font color=orange>此技能发动对象限制已被删除</font>'+'</font>';
				game.log(event.target,'的技能<span class="greentext">【'+get.translation(event.targetSkill)+'】</span>发动对象限制已被删除');
				if(lib.skill[event.targetSkill].filterTarget) delete lib.skill[event.targetSkill].filterTarget;
				event.yk_updateSkillInfo(event.targetSkill);
			}
			else if(event.choose_jntm=='删除该技能的对象数量限制'&&lib.skill[event.targetSkill].selectTarget){
				lib.skill[event.targetSkill].ykre_selectTarget='<br><font color=orange>此技能对象数量限制已被删除</font>'+'</font>';
				game.log(event.target,'的技能<span class="greentext">【'+get.translation(event.targetSkill)+'】</span>对象数量限制已被删除');
				if(lib.skill[event.targetSkill].selectTarget) delete lib.skill[event.targetSkill].selectTarget;
				event.yk_updateSkillInfo(event.targetSkill);
			}
			else if(event.choose_jntm=='删除该技能的mod效果'&&lib.skill[event.targetSkill].mod){
				lib.skill[event.targetSkill].ykre_mod='<br><font color=orange>此技能mod效果已被删除</font>'+'</font>';
				game.log(event.target,'的技能<span class="greentext">【'+get.translation(event.targetSkill)+'】</span>mod效果已被删除');
				if(lib.skill[event.targetSkill].mod) delete lib.skill[event.targetSkill].mod;
				event.yk_updateSkillInfo(event.targetSkill);
			}
			else if(event.choose_jntm=='删除该技能的视为效果'&&lib.skill[event.targetSkill].viewAs){
				lib.skill[event.targetSkill].ykre_viewAs='<br><font color=orange>此技能视为效果已被删除</font>'+'</font>';
				game.log(event.target,'的技能<span class="greentext">【'+get.translation(event.targetSkill)+'】</span>视为效果已被删除');
				if(lib.skill[event.targetSkill].viewAs) delete lib.skill[event.targetSkill].viewAs;
				event.yk_updateSkillInfo(event.targetSkill);
			}
			else if(event.choose_jntm=='删除该技能的init获得此技能时的效果'&&lib.skill[event.targetSkill].init){
				lib.skill[event.targetSkill].ykre_init='<br><font color=orange>此技能的init获得此技能时的效果已被删除</font>'+'</font>';
				game.log(event.target,'的技能<span class="greentext">【'+get.translation(event.targetSkill)+'】</span>init获得此技能时的效果已被删除');
				if(lib.skill[event.targetSkill].init) delete lib.skill[event.targetSkill].init;
				event.yk_updateSkillInfo(event.targetSkill);
			}
			else if(event.choose_jntm=='删除该技能的onremove失去此技能时的效果'&&lib.skill[event.targetSkill].onremove){
				lib.skill[event.targetSkill].ykre_onremove='<br><font color=orange>此技能的onremove失去此技能时的效果已被删除</font>'+'</font>';
				game.log(event.target,'的技能<span class="greentext">【'+get.translation(event.targetSkill)+'】</span>onremove失去此技能时的效果已被删除');
				if(lib.skill[event.targetSkill].onremove) delete lib.skill[event.targetSkill].onremove;
				event.yk_updateSkillInfo(event.targetSkill);
			}
			event.finish();
			'step 26'
			event.content_chooseList1=[{
				content:function(){
					player.draw();
				},
				translate: '该角色摸一张牌',
			},{
				content:function(){
					player.draw(2);
				},
				translate: '该角色摸两张牌',
			},{
				content:function(){
					player.draw(3);
				},
				translate: '该角色摸三张牌',
			},{
				content:function(){
					player.recover();
				},
				translate: '该角色回复一点体力',
			},{
				content:function(){
					player.recover(player.maxHp - player.hp);
				},
				translate: '该角色回复体力至体力上限',
			},{
				content:function(){
					player.gainMaxHp();
				},
				translate: '该角色增加一点体力上限',
			},{
				content:function(){
					player.getBuff();
				},
				translate: '该角色随机获得一个正面效果',
			},{
				content:function(){
					player.tempHide();
				},
				translate: '该角色获得【潜行】到该角色的回合开始',
			},{
				content:function(){
					var card = get.cardPile(card => get.type(card) == 'equip');
					if(card) player.equip(card);
				},
				translate: '该角色随机从牌堆中装备一张装备牌',
			},{
				content:function(){
					var card = get.cardPile2(card => get.type(card) == 'basic');
					if(card) player.gain(card,'gain2','log');
				},
				translate: '该角色随机从牌堆中获得一张基本牌',
			},{
				content:function(){
					var card = get.cardPile2(card => get.type(card) == 'trick');
					if(card) player.gain(card,'gain2','log');
				},
				translate: '该角色随机从牌堆中获得一张普通锦囊牌',
			},{
				content:function(){
					var card = get.cardPile2(card => get.type(card) == 'delay');
					if(card) player.gain(card,'gain2','log');
				},
				translate: '该角色随机从牌堆中获得一张延时锦囊牌',
			},{
				content:function(){
					event.cards = get.cards(3);
					game.cardsGotoOrdering(event.cards);
					player.showCards(event.cards);
					game.delay(2);
					var num = 0;
					for(var i = 0; i < event.cards.length; i++) {
						if(get.suit(event.cards[i]) == 'heart') {
							num++;
							event.cards.splice(i--, 1);
						}
					}
					if(num) {
						player.recover(num);
					}
					if(event.cards.length) {
						player.gain(event.cards);
						player.$gain2(event.cards);
						game.delay();
					}
				},
				translate: '该角色展示牌堆顶的3张牌，然后回复X点体力（X为其中红桃牌数目），然后该角色将其中的红桃牌置于弃牌堆，并获得其他牌',
			},{
				content:function(){
					player.chooseToUse();
				},
				translate: '该角色可以立即使用一张牌',
			},{
				content:function(){
					trigger.player.draw();
				},
				translate: '其摸一张牌',
			},{
				content:function(){
					trigger.player.draw(2);
				},
				translate: '其摸两张牌',
			},{
				content:function(){
					trigger.player.recover();
				},
				translate: '其回复一点体力',
			},{
				content:function(){
					trigger.player.gainMaxHp();
				},
				translate: '其增加一点体力上限',
			},{
				content:function(){
					trigger.player.getBuff();
				},
				translate: '其随机获得一个正面效果',
			},{
				content:function(){
					var card = get.cardPile(function(card){
						return get.type(card) == 'equip';
					});
					if(card) trigger.player.equip(card);
				},
				translate: '其随机从牌堆中装备一张装备牌',
			},{
				content:function(){
					var card = get.cardPile2(card => get.type(card) == 'basic');
					if(card) trigger.player.gain(card,'gain2','log');
				},
				translate: '其随机从牌堆中获得一张基本牌',
			},{
				content:function(){
					var card = get.cardPile2(card => get.type(card) == 'trick');
					if(card) trigger.player.gain(card,'gain2','log');
				},
				translate: '其随机从牌堆中获得一张普通锦囊牌',
			},{
				content:function(){
					var card = get.cardPile2(card => get.type(card) == 'delay');
					if(card) trigger.player.gain(card,'gain2','log');
				},
				translate: '其随机从牌堆中获得一张延时锦囊牌',
			},{
				content:function(){
					trigger.player.chooseToUse();
				},
				translate: '其可以立即使用一张牌',
			}];
			event.content_chooseList2=[{
				content:function(){
					player.damage('nocard');
				},
				translate: '该角色受到一点伤害',
			},{
				content:function(){
					player.loseHp();
				},
				translate: '该角色失去一点体力',
			},{
				content:function(){
					player.countCards('he') && player.chooseToDiscard('he', true);
				},
				translate: '该角色需弃置一张牌',
			},{
				content:function(){
					player.loseMaxHp();
				},
				translate: '该角色减少一点体力上限',
			},{
				content:function(){
					player.die();
				},
				translate: '该角色立即阵亡',
			},{
				content:function(){
					player.turnOver();
				},
				check:function(event,player){
					return player.isTurnedOver();
				},
				translate: '该角色翻面',
			},{
				content:function(){
					player.link();
				},
				check:function(event,player){
					return player.isLinked();
				},
				translate: '该角色横置/重置',
			},{
				content:function(){
					if(!player.hasSkill('fengyin')){
						player.addTempSkill('fengyin');
					}
				},
				translate: '本回合该角色的非锁定技失效',
			},{
				content:function(){
					trigger.player.damage('nocard');
				},
				translate: '其受到一点伤害',
			},{
				content:function(){
					trigger.player.damage(2, 'nocard');
				},
				translate: '其受到两点伤害',
			},{
				content:function(){
					trigger.player.loseHp();
				},
				translate: '其失去一点体力',
			},{
				content:function(){
					trigger.player.chooseToDiscard('he', true);
				},
				translate: '其需弃置一张牌',
			},{
				content:function(){
					trigger.player.loseMaxHp();
				},
				translate: '其失去一点体力上限',
			},{
				content:function(){
					trigger.player.turnOver();
				},
				translate: '其翻面',
			},{
				content:function(){
					trigger.player.link(true);
				},
				translate: '其横置/重置',
			},{
				content:function(){
					var next = trigger.player.judge(card => 1);
					next.judge2 = function(result){
						return true;
					};
				},
				translate: '其进行一次判定',
			},{
				content:function(){
					trigger.player.die();
				},
				translate: '其立即阵亡',
			},{
				content:function(){
					if(!trigger.player.hasSkill('fengyin')){
						trigger.player.addTempSkill('fengyin');
					}
				},
				translate: '本回合其的非锁定技失效',
			}];
			event.content_chooseListElse=[{
				content:function(){
					var next = player.judge(card => 1);
					next.judge2 = function(result){
						return true;
					};
				},
				translate: '该角色进行一次判定',
			},{
				content:function(){
					trigger.num ++;
				},
				check: function(event){
					if(['damage', 'loseHp', 'loseMaxHp'].contains(event.name)) return 2;
					return 1;
				},
				translate: '该数值+1',
			},{
				content:function(){
					trigger.num += 2;
				},
				check: function(event){
					if(['damage', 'loseHp', 'loseMaxHp'].contains(event.name)) return 2;
					return 1;
				},
				translate: '该数值+2',
			},{
				content:function(){
					trigger.num --;
				},
				check: function(event){
					if(['damage', 'loseHp', 'loseMaxHp', 'phaseDraw'].contains(event.name)) return 1;
					return 2;
				},
				translate: '该数值-1',
			},{
				content:function(){
					trigger.num -= 2;
				},
				check: function(event){
					if(['damage', 'loseHp', 'loseMaxHp', 'phaseDraw'].contains(event.name)) return 1;
					return 2;
				},
				translate: '该数值-2',
			},{
				content:function(){
					trigger.cancel();
				},
				check: function(event){
					if(['damage', 'loseHp', 'loseMaxHp'].contains(event.name)) return 1;
					return 2;
				},
				translate: '取消该效果',
			}];
			event.init_chooseList1=[{
				init:function(player){
					player.draw();
				},
				translate: '该角色摸一张牌',
			},{
				init:function(player){
					player.recover();
				},
				translate: '该角色回复一点体力',
			},{
				init:function(player){
					player.recover(player.maxHp - player.hp);
				},
				translate: '该角色将体力值回复至体力上限',
			},{
				init:function(player){
					player.gainMaxHp();
				},
				translate: '该角色增加一点体力上限',
			},{
				init:function(player){
					player.getBuff();
				},
				translate: '该角色随机获得一个正面效果',
			},{
				init:function(player){
					player.tempHide();
				},
				translate: '该角色获得【潜行】到该角色的回合开始',
			},{
				init:function(player){
					var card = get.cardPile(card => get.type(card) == 'equip');
					if(card) player.equip(card);
				},
				translate: '该角色随机从牌堆中装备一张装备牌',
			},{
				init:function(player){
					var card = get.cardPile2(card => get.type(card) == 'basic');
					if(card) player.gain(card,'gain2','log');
				},
				translate: '该角色随机从牌堆中获得一张基本牌',
			},{
				init:function(player){
					var card = get.cardPile2(card => get.type(card) == 'trick');
					if(card) player.gain(card,'gain2','log');
				},
				translate: '该角色随机从牌堆中获得一张普通锦囊牌',
			},{
				init:function(player){
					var card = get.cardPile2(card => get.type(card) == 'delay');
					if(card) player.gain(card,'gain2','log');
				},
				translate: '该角色随机从牌堆中获得一张延时锦囊牌',
			}];
			event.init_chooseList2=[{
				init:function(player){
					player.loseHp();
				},
				translate: '该角色失去一点体力',
			},{
				init:function(player){
					player.countCards('he') && player.chooseToDiscard('he', true);
				},
				translate: '该角色需弃置一张牌',
			},{
				init:function(player){
					player.link(true);
				},
				translate: '该角色横置',
			},{
				init:function(player){
					player.loseMaxHp();
				},
				translate: '该角色失去一点体力上限',
			},{
				init:function(player){
					player.getDebuff();
				},
				translate: '该角色随机获得一个负面效果',
			}];
			event.contentList=event.content_chooseList1.concat(event.content_chooseList2).concat(event.content_chooseListElse);//content、init、onremove都用这个
			event.contentList=event.contentList.concat(event.init_chooseList1);
			event.contentList=event.contentList.concat(event.init_chooseList2);
			if(event.choose_jntm=='添加或修改该技能的发动时机') event.goto(27);
			else if(event.choose_jntm=='添加或修改该技能的发动条件') event.goto(33);
			else if(event.choose_jntm=='添加或修改该技能的发动效果') event.goto(35);
			else if(event.choose_jntm=='添加或修改该技能的发动卡牌限制') event.goto(50);
			else if(event.choose_jntm=='添加或修改该技能的发动对象限制') event.goto(37);
			else if(event.choose_jntm=='添加或修改该技能的对象数量限制') event.goto(39);
			else if(event.choose_jntm=='添加或修改该技能的mod效果') event.goto(41);
			else if(event.choose_jntm=='添加或修改该技能的视为效果') event.goto(43);
			else if(event.choose_jntm=='添加或修改该技能的init获得此技能时的效果') event.goto(45);
			else if(event.choose_jntm=='添加或修改该技能的onremove失去此技能时的效果') event.goto(45);
			else event.finish();
			'step 27'
			//自定义效果--时机
			if(event.skillType=='触发技'){
				event.dialogAlert=ui.create.dialog('hidden');
				event.dialogAlert.style.backgroundColor='black';
				event.dialogAlert.style.opacity=0.75;
				event.dialogAlert.innerHTML='<b><font color=orange>正在加载游戏中已有的技能时机<br>请耐心等待，祝您游戏愉快！</font></b>';
				event.dialogAlert.style.height='60px';
				event.dialogAlert.style.width='400px';
				event.dialogAlert.style.backgroundColor='black';
				event.dialogAlert.style.opacity=0.6;
				event.dialogAlert.style.borderRadius = '10px';
				event.dialogAlert.style.left='calc( 50% - 200px )';
				event.dialogAlert.style.top='calc( 50% - 30px )';
				event.dialogAlert.style['z-index']=499;
				event.dialogAlert.style['text-align']='center';
				document.body.appendChild(event.dialogAlert);
				event.dialogAlert.show();
				game.delayx();
				event.goto(28);
			}
			else{
				lib.skill[event.targetSkill].ykre_trigger='<br><font color=orange>此技能已修改为主动技</font>';
				game.log(event.target,'的技能<span class="greentext">【'+get.translation(event.targetSkill)+'】</span>已修改为主动技');
				if(lib.skill[event.targetSkill].trigger) delete lib.skill[event.targetSkill].trigger;
				lib.skill[event.targetSkill].enable='phaseUse';
				event.yk_updateSkillInfo(event.targetSkill);
				event.goto(47);
			}
			'step 28'
			var timeList=['changeHp','loseHp','loseMaxHp','gainMaxHp','damage','lose','gain','recover','useCard','useCardTo','useSkill','draw','discard','dying','phase','phaseJudge','phaseDraw','phaseUse','phaseDiscard','phaseJieshu','equip','playercontrol','turnOver','die','tao','du','sha','disableEquip','enableEquip','chooseToUseBegin','chooseToRespond','chooseToDiscard','chooseToCompare','chooseButton','chooseCard','chooseTarget','chooseCardTarget','chooseControl','chooseBool','choosePlayerCard','discardPlayerCard','gainPlayerCard'];
			var timeList2=['Before','Begin','End','After','Cancel'];
			event.timeTranslation={
				'changeHp':'体力值变化',
				'loseHp':'失去体力',
				'loseMaxHp':'失去体力上限',
				'gainMaxHp':'获得体力上限',
				'damage':'受到伤害',
				'lose':'失去牌',
				'gain':'获得牌',
				'recover':'回复体力',
				'useCard':'使用牌',
				'useCardTo':'对角色使用牌',
				'useSkill':'使用主动技',
				'draw':'摸牌',
				'discard':'弃牌',
				'dying':'濒死',
				'phase':'执行回合',
				'phaseJudge':'判定阶段',
				'phaseDraw':'摸牌阶段',
				'phaseUse':'出牌阶段',
				'phaseDiscard':'弃牌阶段',
				'phaseJieshu':'回合结束阶段',
				'playercontrol':'控制',
				'turnOver':'翻面',
				'die':'阵亡',
				'tao':'使用桃',
				'du':'使用毒',
				'sha':'使用杀',
				'equip':'使用装备牌',
				'disableEquip':'废除装备栏',
				'enableEquip':'恢复装备栏',
				'chooseToUseBegin':'使用牌',
				'chooseToRespond':'响应（杀等）牌',
				'chooseToDiscard':'选择弃牌',
				'chooseToCompare':'拼点',
				'chooseButton':'选择按钮',
				'chooseCard':'选择牌',
				'chooseTarget':'选择目标',
				'chooseCardTarget':'选择使用牌的目标',
				'chooseControl':'选择按钮',
				'chooseBool':'选择结果',
				'choosePlayerCard':'选择玩家的牌',
				'discardPlayerCard':'弃置玩家的牌',
				'gainPlayerCard':'获得玩家的牌',
				'gameStart':'游戏开始',
				'roundStart':'一轮游戏开始',
				'shaMiss':'闪避“杀”时',
				'enterGame':'角色加入游戏',
			};
			event.timeTranslation2={
				'Before':'前',
				'Begin':'时',
				'End':'结束时',
				'After':'之后',
				'Cancel':'取消时',
			};
			event.timeTranslationx={};
			for(var i in event.timeTranslation){
				if(i!='gameStart'&&i!='gameStart'&&i!='roundStart'&&i!='shaMiss'&&i!='enterGame'&&i!='changeHp'){
					for(var j in event.timeTranslation2) event.timeTranslationx[i+j]=event.timeTranslation[i]+event.timeTranslation2[j];
				}
				else event.timeTranslationx[i]=event.timeTranslation[i];
			}
			event.allTimeList=[];
			for(var i=0;i<timeList.length;i++){
				for(var x=0;x<timeList2.length;x++){
					event.allTimeList.push(timeList[i]+timeList2[x]);
				}
			}
			for(var i=0;i<timeList.length;i++){
				event.allTimeList.push(timeList[i]);
			}
			event.allTimeList.push('gameStart');
			event.allTimeList.push('roundStart');
			event.allTimeList.push('shaMiss');
			event.allTimeList.push('enterGame');
			event.allPlTimeList=['player','source','target','global'];
			for(var i in lib.skill){
				if(lib.skill[i].trigger){
					for(var item in lib.skill[i].trigger){
						if(event.allPlTimeList.indexOf(item)==-1) event.allPlTimeList.push(item);
						if(Array.isArray(lib.skill[i].trigger[item])){
							for(var evt of lib.skill[i].trigger[item]){
								if(event.allTimeList.indexOf(evt)==-1) event.allTimeList.push(evt);
							}
						}
						else{
							if(typeof lib.skill[i].trigger[item]=='string'&&event.allTimeList.indexOf(lib.skill[i].trigger[item])==-1) event.allTimeList.push(lib.skill[i].trigger[item]);
						}
					}
				}
			}
			event.dialogAlert.delete();
			'step 29'
			event.chooseai=function(){
				return 'player';
			};
			if(event.isMine()){
				var dialog=ui.create.dialog('forcebutton');
				dialog.add('【法则天定】：选择要修改【'+(lib.translate[event.targetSkill]==undefined?event.targetSkill:(get.translation(event.targetSkill).indexOf('新')==0?get.translation(event.targetSkill).slice(1,3):get.translation(event.targetSkill).slice(0,2)))+'】的自定义作用时机角色');
				var clickItem=function(){
					_status.event._result=this.link;
					dialog.close();
					game.resume();
				};
				var intro={
					player:"时机前提为该角色",
					source:"时机前提为该角色成为一个事件的事件来源",
					target:"时机前提为该角色成为某事件目标",
					global:"时机前提为场上所有角色均可触发时机",
				};
				for(var choose of event.allPlTimeList){
					var item=dialog.add('<div class="popup pointerdiv" style="width:100%;display:inline-block"><div class="skill"><span style=\"color: #FF0000;\">'+choose+'</span></div><div>'+(intro[choose]||'暂无翻译')+'</div></div>');
					item.firstChild.addEventListener('click',clickItem);
					item.firstChild.link=choose;
				}
				dialog.add(ui.create.div('.placeholder'));
				event.switchToAuto=function(){
					event._result=event.skillai();
					dialog.close();
					game.resume();
				};
				_status.imchoosing=true;
				game.pause();
			}
			else{
				event._result=event.chooseai();
			}
			'step 30'
			_status.imchoosing=false;
			event.choose_shiji1=result;
			'step 31'
			event.chooseai=function(){
				if(get.attitude(player,event.target)<0) return ['gameStart','enterGame'].randomGet();
				else if(get.attitude(player,event.target)>0) return ['useCrad','lose','gain'].randomGet();
				else return event.allTimeList.randomGet();
			};
			if(event.isMine()){
				var dialog=ui.create.dialog('forcebutton');
				dialog.add('【法则天定】：选择要修改【'+(lib.translate[event.targetSkill]==undefined?event.targetSkill:(get.translation(event.targetSkill).indexOf('新')==0?get.translation(event.targetSkill).slice(1,3):get.translation(event.targetSkill).slice(0,2)))+'】的自定义作用时机');
				var clickItem=function(){
					_status.event._result=this.link;
					dialog.close();
					game.resume();
				};
				event.allTimeList.sort();
				for(var choose of event.allTimeList){
					var item=dialog.add('<div class="popup pointerdiv" style="width:100%;display:inline-block"><div class="skill">'+choose+'</span></div><div style="text-align:right">'+(event.timeTranslationx[choose]||event.timeTranslation[choose]||'暂无注释')+'</div></div>');
					item.firstChild.addEventListener('click',clickItem);
					item.firstChild.link=choose;
				}
				dialog.add(ui.create.div('.placeholder'));
				event.switchToAuto=function(){
					event._result=event.skillai();
					dialog.close();
					game.resume();
				};
				_status.imchoosing=true;
				game.pause();
			}
			else{
				event._result=event.chooseai();
			}
			'step 32'
			_status.imchoosing=false;
			event.choose_shiji2=result;
			if(event.choose_shiji1&&event.choose_shiji2){
				if(lib.skill[event.targetSkill].enable) delete lib.skill[event.targetSkill].enable;
				lib.skill[event.targetSkill].ykre_trigger='<br><font color=orange>此技能发动时机已修改为'+event.choose_shiji1+':"'+event.choose_shiji2+'"</font>';
				game.log(event.target,'的技能<span class="greentext">【'+get.translation(event.targetSkill)+'】</span>发动时机已修改为'+event.choose_shiji1+':"'+event.choose_shiji2+'"');
				if(!lib.skill[event.targetSkill].trigger) lib.skill[event.targetSkill].trigger={};
				lib.skill[event.targetSkill].trigger[event.choose_shiji1]=event.choose_shiji2;
				event.yk_updateSkillInfo(event.targetSkill);
			}
			event.finish();
			'step 33'
			//自定义效果--条件
			event.filterList=[{
				filter:function(event,player){
					return player.hp > player.maxHp/2;
				},
				translate:'若该角色的体力值大于体力上限的一半',
			},{
				filter:function(event,player){
					return player.hp < player.maxHp/2;
				},
				translate:'若该角色的体力值小于体力上限的一半',
			},{
				filter:function(event,player){
					return player.countCards('j');
				},
				translate:'若该角色的判定区内有牌',
			},{
				filter:function(event,player){
					return !player.countCards('j');
				},
				translate:'若该角色的判定区内没有牌',
			},{
				filter:function(event,player){
					return !player.countCards('h');
				},
				translate:'若该角色没有手牌',
			},{
				filter:function(event,player){
					return !player.getHistory('useCard');
				},
				translate:'若该角色本回合没有使用过牌',
			},{
				filter:function(event,player){
					return player.getHistory('useCard').length > 0;
				},
				translate:'若该角色本回合使用过牌',
			},{
				filter:function(event,player){
					return !player.getHistory('respond');
				},
				translate:'若该角色本回合没有打出过牌',
			},{
				filter:function(event,player){
					return player.isDamaged();
				},
				translate:'若该角色已受伤',
			},{
				filter:function(event,player){
					return player.isHealthy();
				},
				translate:'若该角色的体力值为满',
			},{
				filter:function(event,player){
					return player.isMaxHp();
				},
				translate:'若该角色的体力值为全场最多（或之一）',
			},{
				filter:function(event,player){
					return player.isMaxHp(true);
				},
				translate:'若该角色的体力值为全场最多',
			},{
				filter:function(event,player){
					return player.isMinHp();
				},
				translate:'若该角色的体力值为全场最少（或之一）',
			},{
				filter:function(event,player){
					return player.isMinHp(true);
				},
				translate:'若该角色的体力值为全场最少',
			},{
				filter:function(event,player){
					return player.isMaxCard();
				},
				translate:'若该角色的牌为全场最多（或之一）',
			},{
				filter:function(event,player){
					return player.isMaxCard(true);
				},
				translate:'若该角色的牌为全场最多',
			},{
				filter:function(event,player){
					return player.isMinCard();
				},
				translate:'若该角色的牌为全场最少（或之一）',
			},{
				filter:function(event,player){
					return player.isMinCard(true);
				},
				translate:'若该角色的牌为全场最少',
			},{
				filter:function(event,player){
					return player.isMaxHandcard();
				},
				translate:'若该角色的手牌为全场最多（或之一）',
			},{
				filter:function(event,player){
					return player.isMaxHandcard(true);
				},
				translate:'若该角色的手牌为全场最多',
			},{
				filter:function(event,player){
					return player.isMinHandcard();
				},
				translate:'若该角色的手牌为全场最少（或之一）',
			},{
				filter:function(event,player){
					return player.isMinHandcard(true);
				},
				translate:'若该角色的手牌为全场最少',
			},{
				filter:function(event,player){
					return player.isMaxEquip();
				},
				translate:'若该角色装备区的牌为全场最多（或之一）',
			},{
				filter:function(event,player){
					return player.isMaxEquip(true);
				},
				translate:'若该角色装备区的牌为全场最多',
			},{
				filter:function(event,player){
					return player.isMinEquip();
				},
				translate:'若该角色装备区的牌为全场最少（或之一）',
			},{
				filter:function(event,player){
					return player.isMinEquip(true);
				},
				translate:'若该角色装备区的牌为全场最少',
			},{
				filter:function(event,player){
					return player.getPrevious() != player && player.getPrevious().hp > player.getPrevious().maxHp;
				},
				translate:'若该角色的上家（不为自己）的体力值大于其体力上限的一半',
			},{
				filter:function(event,player){
					return player.getPrevious() != player && player.getPrevious().hp == Math.ceil(player.getPrevious().maxHp/2);
				},
				translate:'若该角色的上家（不为自己）的体力值等于其体力上限的一半（向上取整）',
			},{
				filter:function(event,player){
					return player.getPrevious() != player && player.getPrevious().countCards('h') < player.getPrevious().hp;
				},
				translate:'若该角色的上家（不为自己）的手牌数小于其体力值',
			},{
				filter:function(event,player){
					return player.getPrevious() != player && player.getPrevious().countCards('h') > player.getPrevious().hp;
				},
				translate:'若该角色的上家（不为自己）的手牌数大于其体力值',
			},{
				filter:function(event,player){
					return player.getPrevious() != player && !player.getPrevious().countCards('h');
				},
				translate:'若该角色的上家（不为自己）没有手牌',
			},{
				filter:function(event,player){
					return player.getPrevious() != player && player.getPrevious().getHistory('useCard').length > 0;
				},
				translate:'若该角色的上家（不为自己）本回合使用过牌',
			},{
				filter:function(event,player){
					return player.getPrevious() != player && !player.getPrevious().getHistory('respond');
				},
				translate:'若该角色的上家（不为自己）本回合没有打出过牌',
			},{
				filter:function(event,player){
					return player.getPrevious() != player && player.getPrevious().isDamaged();
				},
				translate:'若该角色的上家（不为自己）已受伤',
			},{
				filter:function(event,player){
					return player.getPrevious() != player && player.getPrevious().isHealthy();
				},
				translate:'若该角色的上家（不为自己）的体力值为满',
			},{
				filter:function(event,player){
					return player.getNext() != player && player.getNext().hp > player.getNext().maxHp/2;
				},
				translate:'若该角色的下家（不为自己）的体力值大于其体力上限的一半',
			},{
				filter:function(event,player){
					return player.getNext() != player && player.getNext().hp == Math.ceil(player.getNext().maxHp/2);
				},
				translate:'若该角色的下家（不为自己）的体力值等于其体力上限的一半（向上取整）',
			},{
				filter:function(event,player){
					return player.getNext() != player && player.getNext().countCards('h') > (player.getNext().getHandcardLimit()/2);
				},
				translate:'若该角色的下家（不为自己）的手牌数大于其手牌上限的一半',
			},{
				filter:function(event,player){
					return player.getNext() != player && !player.getNext().countCards('h');
				},
				translate:'若该角色的下家（不为自己）没有手牌',
			},{
				filter:function(event,player){
					return player.getNext() != player && player.getNext().getHistory('useCard').length > 0;
				},
				translate:'若该角色的下家（不为自己）本回合使用过牌',
			},{
				filter:function(event,player){
					return player.getNext() != player && !player.getNext().getHistory('respond');
				},
				translate:'若该角色的下家（不为自己）本回合没有打出过牌',
			},{
				filter:function(event,player){
					return player.getNext() != player && player.getNext().isDamaged();
				},
				translate:'若该角色的下家（不为自己）已受伤',
			},{
				filter:function(event,player){
					return player.getNext() != player && player.getNext().isHealthy();
				},
				translate:'若该角色的下家（不为自己）的体力值为满',
			},{
				filter:function(event,player){
					return event.player.hp < event.player.countCards('h');
				},
				translate:'若其的体力值小于其手牌数',
			},{
				filter:function(event,player){
					return event.player.hp > event.player.countCards('h');
				},
				translate:'若其的体力值大于其手牌数',
			},{
				filter:function(event,player){
					return event.player.countCards('h', 'sha');
				},
				translate:'若其手牌中有【杀】',
			},{
				filter:function(event,player){
					return event.player.isDamaged();
				},
				translate:'若其已受伤',
			},{
				filter:function(event,player){
					return event.player.isHealthy();
				},
				translate:'若其的体力值为满',
			},{
				filter:function(event,player){
					return event.player.isMaxHp();
				},
				translate:'若其的体力值为全场最多（或之一）',
			},{
				filter:function(event,player){
					return event.player.isMaxHp(true);
				},
				translate:'若其的体力值为全场最多',
			},{
				filter:function(event,player){
					return event.player.isMinHp();
				},
				translate:'若其的体力值为全场最少（或之一）',
			},{
				filter:function(event,player){
					return event.player.isMinHp(true);
				},
				translate:'若其的体力值为全场最少',
			},{
				filter:function(event,player){
					return event.player.isMaxCard();
				},
				translate:'若其的牌为全场最多（或之一）',
			},{
				filter:function(event,player){
					return event.player.isMaxCard(true);
				},
				translate:'若其的牌为全场最多',
			},{
				filter:function(event,player){
					return event.player.isMinCard();
				},
				translate:'若其的牌为全场最少（或之一）',
			},{
				filter:function(event,player){
					return event.player.isMinCard(true);
				},
				translate:'若其的牌为全场最少',
			},{
				filter:function(event,player){
					return event.player.isMaxHandcard();
				},
				translate:'若其的手牌为全场最多（或之一）',
			},{
				filter:function(event,player){
					return event.player.isMaxHandcard(true);
				},
				translate:'若其的手牌为全场最多',
			},{
				filter:function(event,player){
					return event.player.isMinHandcard();
				},
				translate:'若其的手牌为全场最少（或之一）',
			},{
				filter:function(event,player){
					return event.player.isMinHandcard(true);
				},
				translate:'若其的手牌为全场最少',
			},{
				filter:function(event,player){
					return event.player.isMaxEquip();
				},
				translate:'若其装备区的牌为全场最多（或之一）',
			},{
				filter:function(event,player){
					return event.player.isMaxEquip(true);
				},
				translate:'若其装备区的牌为全场最多',
			},{
				filter:function(event,player){
					return event.player.isMinEquip();
				},
				translate:'若其装备区的牌为全场最少（或之一）',
			},{
				filter:function(event,player){
					return event.player.isMinEquip(true);
				},
				translate:'若其装备区的牌为全场最少',
			},{
				filter:function(event,player){
					return event.num && event.num > 1;
				},
				translate:'若该时机下事件的点数大于1',
			},{
				filter:function(event,player){
					return event.num && event.num > 2;
				},
				translate:'若该时机下事件的点数大于2',
			}];
			event.chooseai=function(){
				var chooseList1=[{
					filter:function(event,player){
						return player.hp > player.maxHp/2;
					},
					translate:'若该角色的体力值大于体力上限的一半',
				},{
					filter:function(event,player){
						return player.hp < player.maxHp/2;
					},
					translate:'若该角色的体力值小于体力上限的一半',
				},{
					filter:function(event,player){
						return !player.countCards('j');
					},
					translate:'若该角色的判定区内没有牌',
				},{
					filter:function(event,player){
						return player.getPrevious() != player && player.getPrevious().getHistory('useCard').length > 0;
					},
					translate:'若该角色的上家（不为自己）本回合使用过牌',
				}]
				var chooseList2=[{
					filter:function(event,player){
						return player.getPrevious() != player && player.getPrevious().isHealthy();
					},
					translate:'若该角色的上家（不为自己）的体力值为满',
				},{
					filter:function(event,player){
						return player.getNext() != player && player.getNext().isHealthy();
					},
					translate:'若该角色的下家（不为自己）的体力值为满',
				},{
					filter:function(event,player){
						return event.player.isHealthy();
					},
					translate:'若其的体力值为满',
				},{
					filter:function(event,player){
						return !player.countCards('h');
					},
					translate:'若该角色没有手牌',
				},{
					filter:function(event,player){
						return player.getPrevious() != player && !player.getPrevious().getHistory('respond');
					},
					translate:'若该角色的上家（不为自己）本回合没有打出过牌',
				}]
				if(get.attitude(player,event.target)>0) return chooseList1.randomGet();
				else if(get.attitude(player,event.target)<0) return chooseList2.randomGet();
				else return event.filterList.randomGet();
			};
			if(event.isMine()){
				var dialog=ui.create.dialog('forcebutton');
				dialog.add('【法则天定】：选择要修改【'+(lib.translate[event.targetSkill]==undefined?event.targetSkill:(get.translation(event.targetSkill).indexOf('新')==0?get.translation(event.targetSkill).slice(1,3):get.translation(event.targetSkill).slice(0,2)))+'】的自定义发动条件');
				var clickItem=function(){
					_status.event._result=this.link;
					dialog.close();
					game.resume();
				};
				var num=0;
				for(var condition of event.filterList){
					var value;
					if(event.findType) value=event.findType[0];
					if(value&&value.length&&event.findType[1]=='skill2'){
						num++;
						if(!window.yk_compareStr(condition.translate,value)) continue;
						var item=dialog.add('<div class="popup pointerdiv" style="width:100%;display:inline-block"><div class="skill">'+condition.translate+'</div></div>');
					}
					else if(!event.findType){
						num++;
						var item=dialog.add('<div class="popup pointerdiv" style="width:100%;display:inline-block"><div class="skill">'+condition.translate+'</div></div>');
					}
					if(!num){alert('未查找到相关技能效果！');event.goto(8);}
					item.firstChild.addEventListener('click',clickItem);
					item.firstChild.link=condition;
				}
				dialog.add(ui.create.div('.placeholder'));
				event.switchToAuto=function(){
					event._result=event.skillai();
					dialog.close();
					game.resume();
				};
				_status.imchoosing=true;
				game.pause();
			}
			else{
				event._result=event.chooseai();
			}
			'step 34'
			_status.imchoosing=false;
			event.choose_filterResult=result;
			lib.skill[event.targetSkill].ykre_filter='<br><font color=orange>此技能发动条件已修改为'+result.translate+'</font>';
			game.log(event.target,'的技能<span class="greentext">【'+get.translation(event.targetSkill)+'】</span>发动条件已修改为'+result.translate);
			lib.skill[event.targetSkill].filter=result.filter;
			event.yk_updateSkillInfo(event.targetSkill);
			event.finish();
			'step 35'
			//自定义效果--效果
			event.chooseai=function(){
				if(get.attitude(player,event.target)>0) return event.content_chooseList1.randomGet();
				else if(get.attitude(player,event.target)<0) return event.content_chooseList2.randomGet();
				else return event.contentList.randomGet();
			};
			if(event.isMine()){
				var dialog=ui.create.dialog('forcebutton');
				dialog.add('【法则天定】：选择要修改【'+(lib.translate[event.targetSkill]==undefined?event.targetSkill:(get.translation(event.targetSkill).indexOf('新')==0?get.translation(event.targetSkill).slice(1,3):get.translation(event.targetSkill).slice(0,2)))+'】的自定义发动条件');
				var clickItem=function(){
					_status.event._result=this.link;
					dialog.close();
					game.resume();
				};
				var num=0;
				for(var content of event.contentList){
					var value;
					if(event.findType) value=event.findType[0];
					if(value&&value.length&&event.findType[1]=='skill2'){
						num++;
						if(!window.yk_compareStr(content.translate,value)) continue;
						var item=dialog.add('<div class="popup pointerdiv" style="width:100%;display:inline-block"><div class="skill">'+content.translate+'</div></div>');
					}
					else if(!event.findType){
						num++;
						var item=dialog.add('<div class="popup pointerdiv" style="width:100%;display:inline-block"><div class="skill">'+content.translate+'</div></div>');
					}
					if(!num){alert('未查找到相关技能效果！');event.goto(8);}
					item.firstChild.addEventListener('click',clickItem);
					item.firstChild.link=content;
				}
				dialog.add(ui.create.div('.placeholder'));
				event.switchToAuto=function(){
					event._result=event.skillai();
					dialog.close();
					game.resume();
				};
				_status.imchoosing=true;
				game.pause();
			}
			else{
				event._result=event.chooseai();
			}
			'step 36'
			_status.imchoosing=false;
			event.choose_contentResult=result;
			lib.skill[event.targetSkill].ykre_content='<br><font color=orange>此技能发动效果已修改为'+result.translate+'</font>';
			game.log(event.target,'的技能<span class="greentext">【'+get.translation(event.targetSkill)+'】</span>发动效果已修改为'+result.translate);
			if(result.content) lib.skill[event.targetSkill].content=result.content;
			else if(result.init) lib.skill[event.targetSkill].content=result.init;
			event.yk_updateSkillInfo(event.targetSkill);
			event.finish();
			'step 37'
			//自定义效果--对象限制
			event.filterTargetList=[{
				filterTarget:function(player,target){
					return player!=target;
				},
				translate: '只能对其他角色发动',
			},{
				filterTarget:function(player,target){
					return player==target;
				},
				translate: '只能对自己发动',
			},{
				filterTarget:function(player,target){
					if(typeof player.getFriends=='function') return player.getFriends().contains(target);
				},
				translate: '只能对友方角色发动',
			},{
				filterTarget:function(player,target){
					if(typeof player.getEnemies=='function') return player.getEnemies().contains(target);
				},
				translate: '只能对敌方角色发动',
			},{
				filterTarget:function(player,target){
					return target.hp<player.hp;
				},
				translate: '只能对体力值小于该角色的角色发动',
			},{
				filterTarget:function(player,target){
					return target.hp>player.hp;
				},
				translate: '只能对体力值大于该角色的角色发动',
			},{
				filterTarget:function(player,target){
					return target.hp==player.hp;
				},
				translate: '只能对体力值等于该角色的角色发动',
			},{
				filterTarget:function(player,target){
					return target.maxHp<player.maxHp;
				},
				translate: '只能对体力上限小于该角色的角色发动',
			},{
				filterTarget:function(player,target){
					return target.maxHp==player.maxHp;
				},
				translate: '只能对体力上限等于该角色的角色发动',
			},{
				filterTarget:function(player,target){
					return target.maxHp>player.maxHp;
				},
				translate: '只能对体力上限大于该角色的角色发动',
			},{
				filterTarget:function(player,target){
					return target.countCards('h')<player.countCards('h');
				},
				translate: '只能对手牌数小于该角色的角色发动',
			},{
				filterTarget:function(player,target){
					return target.countCards('h')==player.countCards('h');
				},
				translate: '只能对手牌数等于该角色的角色发动',
			},{
				filterTarget:function(player,target){
					return target.countCards('h')>player.countCards('h');
				},
				translate: '只能对手牌数大于该角色的角色发动',
			},{
				filterTarget:function(player,target){
					return target.countCards('e')<player.countCards('e');
				},
				translate: '只能对装备区牌数小于该角色的角色发动',
			},{
				filterTarget:function(player,target){
					return target.countCards('e')==player.countCards('e');
				},
				translate: '只能对装备区牌数等于该角色的角色发动',
			},{
				filterTarget:function(player,target){
					return target.countCards('e')>player.countCards('e');
				},
				translate: '只能对装备区牌数大于该角色的角色发动',
			},{
				filterTarget:function(player,target){
					return target.getEquip(1);
				},
				translate: '只能对装备区内有武器牌的角色发动',
			},{
				filterTarget:function(player,target){
					return !target.getEquip(1);
				},
				translate: '只能对装备区内没有武器牌的角色发动',
			},{
				filterTarget:function(player,target){
					return target.getEquip(2);
				},
				translate: '只能对装备区内有防具牌的角色发动',
			},{
				filterTarget:function(player,target){
					return !target.getEquip(2);
				},
				translate: '只能对装备区内没有防具牌的角色发动',
			},{
				filterTarget:function(player,target){
					return target.getEquip(3);
				},
				translate: '只能对装备区内有防御马的角色发动',
			},{
				filterTarget:function(player,target){
					return !target.getEquip(3);
				},
				translate: '只能对装备区内没有防御马的角色发动',
			},{
				filterTarget:function(player,target){
					return target.getEquip(4);
				},
				translate: '只能对装备区内有进攻马的角色发动',
			},{
				filterTarget:function(player,target){
					return !target.getEquip(4);
				},
				translate: '只能对装备区内没有进攻马的角色发动',
			},{
				filterTarget:function(player,target){
					return target.getEquip(5);
				},
				translate: '只能对装备区内有宝物牌的角色发动',
			},{
				filterTarget:function(player,target){
					return !target.getEquip(5);
				},
				translate: '只能对装备区内没有宝物牌的角色发动',
			},{
				filterTarget:function(player,target){
					return player.inRange(target);
				},
				translate: '只能对在该角色攻击范围内的角色发动',
			},{
				filterTarget:function(player,target){
					return target.inRange(player)&&target!=player;
				},
				translate: '只能对该角色在其他角色攻击范围内的其他这些角色发动',
			},{
				filterTarget:function(player,target){
					return player!=target&&get.distance(player,target)<=1;
				},
				translate: '只能对距离为1及以内的其他角色发动',
			},{
				filterTarget:function(player,target){
					return player!=target&&get.distance(player,target)<=2;
				},
				translate: '只能对距离为2及以内的其他角色发动',
			},{
				filterTarget:function(player,target){
					return player!=target&&get.distance(player,target)<=3;
				},
				translate: '只能对距离为3及以内的其他角色发动',
			},{
				filterTarget:function(player,target){
					return player!=target&&get.distance(player,target)>=2;
				},
				translate: '只能对距离为2及以上的其他角色发动',
			},{
				filterTarget:function(player,target){
					return player!=target&&get.distance(player,target)>=3;
				},
				translate: '只能对距离为3及以上的其他角色发动',
			},{
				filterTarget:function(player,target){
					return player!=target&&get.distance(player,target)>=4;
				},
				translate: '只能对距离为4及以上的其他角色发动',
			}];
			event.chooseai=function(){
				var chooseList2=[{
					filterTarget:function(player,target){
						return player!=target&&get.distance(player,target)<=1;
					},
					translate: '只能对距离为1及以内的其他角色发动',
				},{
					filterTarget:function(player,target){
						return player!=target&&get.distance(player,target)<=2;
					},
					translate: '只能对距离为2及以内的其他角色发动',
				},{
					filterTarget:function(player,target){
						return player.inRange(target);
					},
					translate: '只能对在该角色攻击范围内的角色发动',
				},{
					filterTarget:function(player,target){
						return target.inRange(player)&&target!=player;
					},
					translate: '只能对该角色在其他角色攻击范围内的其他这些角色发动',
				},{
					filterTarget:function(player,target){
						return target.countCards('h')>player.countCards('h');
					},
					translate: '只能对手牌数大于该角色的角色发动',
				},{
					filterTarget:function(player,target){
						return target.countCards('e')>player.countCards('e');
					},
					translate: '只能对装备区牌数大于该角色的角色发动',
				}];
				if(get.attitude(player,event.player)<0) return chooseList2.randomGet();
				else return event.filterTargetList.randomGet();
			};
			if(event.isMine()){
				var dialog=ui.create.dialog('forcebutton');
				dialog.add('【法则天定】：选择要修改【'+(lib.translate[event.targetSkill]==undefined?event.targetSkill:(get.translation(event.targetSkill).indexOf('新')==0?get.translation(event.targetSkill).slice(1,3):get.translation(event.targetSkill).slice(0,2)))+'】的自定义发动条件');
				var clickItem=function(){
					_status.event._result=this.link;
					dialog.close();
					game.resume();
				};
				var num=0;
				for(var filterTarget of event.filterTargetList){
					var value;
					if(event.findType) value=event.findType[0];
					if(value&&value.length&&event.findType[1]=='skill2'){
						num++;
						if(!window.yk_compareStr(filterTarget.translate,value)) continue;
						var item=dialog.add('<div class="popup pointerdiv" style="width:100%;display:inline-block"><div class="skill">'+filterTarget.translate+'</div></div>');
					}
					else if(!event.findType){
						num++;
						var item=dialog.add('<div class="popup pointerdiv" style="width:100%;display:inline-block"><div class="skill">'+filterTarget.translate+'</div></div>');
					}
					if(!num){alert('未查找到相关技能效果！');event.goto(8);}
					item.firstChild.addEventListener('click',clickItem);
					item.firstChild.link=filterTarget;
				}
				dialog.add(ui.create.div('.placeholder'));
				event.switchToAuto=function(){
					event._result=event.skillai();
					dialog.close();
					game.resume();
				};
				_status.imchoosing=true;
				game.pause();
			}
			else{
				event._result=event.chooseai();
			}
			'step 38'
			_status.imchoosing=false;
			event.choose_filterTargetResult=result;
			lib.skill[event.targetSkill].ykre_filterTarget='<br><font color=orange>此技能发动对象限制已修改为'+result.translate+'</font>';
			game.log(event.target,'的技能<span class="greentext">【'+get.translation(event.targetSkill)+'】</span>发动对象限制已修改为'+result.translate);
			lib.skill[event.targetSkill].filterTarget=result.filterTarget;
			event.yk_updateSkillInfo(event.targetSkill);
			event.finish();
			'step 39'
			//自定义效果--对象数量限制
			event.selectTargetList=[{
				selectTarget:1,
				translate: '选择1个目标',
			},{
				selectTarget:2,
				translate: '选择2个目标',
			},{
				selectTarget:3,
				translate: '选择3个目标',
			},{
				selectTarget:4,
				translate: '选择4个目标',
			},{
				selectTarget:5,
				translate: '选择5个目标',
			},{
				selectTarget:6,
				translate: '选择6个目标',
			},{
				selectTarget:7,
				translate: '选择7个目标',
			},{
				selectTarget:[1,2],
				translate: '选择1至2个目标',
			},{
				selectTarget:[1,3],
				translate: '选择1至3个目标',
			},{
				selectTarget:[2,4],
				translate: '选择2至4个目标',
			},{
				selectTarget:[3,6],
				translate: '选择3至6个目标',
			},{
				selectTarget:[0,Infinity],
				translate: '选择任意个目标',
			}];
			event.chooseai=function(){
				var chooseList1=[{
					selectTarget:[0,Infinity],
					translate: '选择任意个目标',
				}];
				var chooseList2=[{
					selectTarget:1,
					translate: '选择1个目标',
				}];
				if(get.attitude(player,event.target)<0) return chooseList2.randomGet();
				else if(get.attitude(player,event.target)>0) return chooseList1.randomGet();
				else return event.selectTargetList.randomGet();
			};
			if(event.isMine()){
				var dialog=ui.create.dialog('forcebutton');
				dialog.add('【法则天定】：选择要修改【'+(lib.translate[event.targetSkill]==undefined?event.targetSkill:(get.translation(event.targetSkill).indexOf('新')==0?get.translation(event.targetSkill).slice(1,3):get.translation(event.targetSkill).slice(0,2)))+'】的自定义发动条件');
				var clickItem=function(){
					_status.event._result=this.link;
					dialog.close();
					game.resume();
				};
				var num=0;
				for(var selectTarget of event.selectTargetList){
					var value;
					if(event.findType) value=event.findType[0];
					if(value&&value.length&&event.findType[1]=='skill2'){
						num++;
						if(!window.yk_compareStr(selectTarget.translate,value)) continue;
						var item=dialog.add('<div class="popup pointerdiv" style="width:100%;display:inline-block"><div class="skill">'+selectTarget.translate+'</div></div>');
					}
					else if(!event.findType){
						num++;
						var item=dialog.add('<div class="popup pointerdiv" style="width:100%;display:inline-block"><div class="skill">'+selectTarget.translate+'</div></div>');
					}
					if(!num){alert('未查找到相关技能效果！');event.goto(8);}
					item.firstChild.addEventListener('click',clickItem);
					item.firstChild.link=selectTarget;
				}
				dialog.add(ui.create.div('.placeholder'));
				event.switchToAuto=function(){
					event._result=event.skillai();
					dialog.close();
					game.resume();
				};
				_status.imchoosing=true;
				game.pause();
			}
			else{
				event._result=event.chooseai();
			}
			'step 40'
			_status.imchoosing=false;
			event.choose_selectTargetResult=result;
			lib.skill[event.targetSkill].ykre_selectTarget='<br><font color=orange>此技能发动对象数量已修改为'+result.translate+'</font>';
			game.log(event.target,'的技能<span class="greentext">【'+get.translation(event.targetSkill)+'】</span>发动对象数量已修改为'+result.translate);
			lib.skill[event.targetSkill].selectTarget=result.selectTarget;
			event.yk_updateSkillInfo(event.targetSkill);
			event.finish();
			'step 41'
			//自定义效果--mod效果
			event.modList=[{
				mod:{
					suit:function(card,suit){
						if(suit=='spade') return 'heart';
					},
				},
				translate: '锁定技，该角色的黑桃牌均视为红桃',
			},{
				mod:{
					suit:function(card,suit){
						if(suit=='diamond') return 'club';
					},
				},
				translate: '锁定技，该角色的方块牌均视为梅花',
			},{
				mod:{
					suit:function(card,suit){
						if(suit=='club') return 'diamond';
					},
				},
				translate: '锁定技，该角色的梅花牌均视为方块',
			},{
				mod:{
					suit:function(card,suit){
						if(suit=='heart') return 'spade';
					},
				},
				translate: '锁定技，该角色的红桃牌均视为黑桃',
			},{
				mod:{
					targetEnabled:function(card,player,target){
						if(get.suit(card)=='heart'&&player!=target){
							return false;
						}
					},
				},
				translate: '锁定技，该角色不能成为红桃牌的目标。',
			},{
				mod:{
					targetEnabled:function(card,player,target){
						if(get.suit(card)=='diamond'&&player!=target){
							return false;
						}
					},
				},
				translate: '锁定技，该角色不能成为方块牌的目标。',
			},{
				mod:{
					targetEnabled:function(card,player,target){
						if(get.suit(card)=='club'&&player!=target){
							return false;
						}
					},
				},
				translate: '锁定技，该角色不能成为梅花牌的目标。',
			},{
				mod:{
					targetEnabled:function(card,player,target){
						if(get.suit(card)=='spade'&&player!=target){
							return false;
						}
					},
				},
				translate: '锁定技，该角色不能成为黑桃牌的目标。',
			},{
				mod:{
					maxHandcard:function (player,num){
						return num+=Math.min(3,Math.floor(game.roundNumber/2));
					},
				},
				translate: '锁定技，该角色的手牌上限增加(游戏轮数/2)，至多增加3。',
			},{
				mod:{
					targetEnabled:function (card,player,target){
						if(get.type(card)=='basic') return false;
					},
				},
				translate: '锁定技，该角色不能成为基本牌的目标。',
			},{
				mod:{
					targetEnabled:function (card,player,target){
						if(get.type(card)=='trick') return false;
					},
				},
				translate: '锁定技，该角色不能成为锦囊牌的目标。',
			},{
				mod:{
					targetEnabled:function (card,player,target){
						if(get.type(card)=='delay') return false;
					},
				},
				translate: '锁定技，该角色不能成为延时锦囊牌的目标。',
			},{
				mod:{
					targetEnabled:function (card,player,target){
						if(get.type(card)=='equip') return false;
					},
				},
				translate: '锁定技，该角色不能成为装备牌的目标。',
			},{
				mod:{
					ignoredHandcard:function(card,player){
						if(get.name(card)=='shan'){
							return true;
						}
					},
					cardDiscardable:function(card,player,name){
						if(name=='phaseDiscard'&&get.name(card)=='shan'){
							return false;
						}
					},
				},
				translate: '锁定技，该角色的“闪”不计入手牌上限。',
			},{
				mod:{
					globalFrom:function(player,target,distance){
						return distance-1;
					},
				},
				translate: '锁定技，该角色的进攻距离+1。',
			},{
				mod:{
					globalFrom:function(player,target,distance){
						return -Infinity;
					},
				},
				translate: '锁定技，该角色的进攻距离无限。',
			},{
				mod:{
					globalTo:function(player,target,distance){
						return distance+1;
					},
				},
				translate: '锁定技，该角色的防御距离+1。',
			},{
				mod:{
					globalTo:function(player,target,distance){
						return Infinity;
					},
				},
				translate: '锁定技，该角色的防御距离无限。',
			},{
				mod:{
					targetInRange:function(card){
						if(card.name=='sha') return true;
					},
				},
				translate: '锁定技，该角色的出杀距离无限。',
			},{
				mod:{
					cardUsable:function(card,player,num){
						if(card.name=='sha') return Infinity;
					},
				},
				translate: '锁定技，该角色的出杀次数无限。',
			}];
			event.chooseai=function(){
				var chooseList2=[{
					mod:{
						suit:function(card,suit){
							if(suit=='club') return 'diamond';
						},
					},
					translate: '锁定技，该角色的梅花牌均视为方块',
				},{
					mod:{
						suit:function(card,suit){
							if(suit=='heart') return 'spade';
						},
					},
					translate: '锁定技，该角色的红桃牌均视为黑桃',
				}];
				if(get.attitude(player,event.target)<0) return chooseList2.randomGet();
				else return event.modList.randomGet();
			};
			if(event.isMine()){
				var dialog=ui.create.dialog('forcebutton');
				dialog.add('【法则天定】：选择要修改【'+(lib.translate[event.targetSkill]==undefined?event.targetSkill:(get.translation(event.targetSkill).indexOf('新')==0?get.translation(event.targetSkill).slice(1,3):get.translation(event.targetSkill).slice(0,2)))+'】的自定义发动条件');
				var clickItem=function(){
					_status.event._result=this.link;
					dialog.close();
					game.resume();
				};
				var num=0;
				for(var mod of event.modList){
					var value;
					if(event.findType) value=event.findType[0];
					if(value&&value.length&&event.findType[1]=='skill2'){
						num++;
						if(!window.yk_compareStr(mod.translate,value)) continue;
						var item=dialog.add('<div class="popup pointerdiv" style="width:100%;display:inline-block"><div class="skill">'+mod.translate+'</div></div>');
					}
					else if(!event.findType){
						num++;
						var item=dialog.add('<div class="popup pointerdiv" style="width:100%;display:inline-block"><div class="skill">'+mod.translate+'</div></div>');
					}
					if(!num){alert('未查找到相关技能效果！');event.goto(8);}
					item.firstChild.addEventListener('click',clickItem);
					item.firstChild.link=mod;
				}
				dialog.add(ui.create.div('.placeholder'));
				event.switchToAuto=function(){
					event._result=event.skillai();
					dialog.close();
					game.resume();
				};
				_status.imchoosing=true;
				game.pause();
			}
			else{
				event._result=event.chooseai();
			}
			'step 42'
			_status.imchoosing=false;
			event.choose_modResult=result;
			lib.skill[event.targetSkill].ykre_mod='<br><font color=orange>此技能mod效果已修改为'+result.translate+'</font>';
			game.log(event.target,'的技能<span class="greentext">【'+get.translation(event.targetSkill)+'】</span>mod效果已修改为'+result.translate);
			lib.skill[event.targetSkill].mod=result.mod;
			event.yk_updateSkillInfo(event.targetSkill);
			event.finish();
			'step 43'
			//自定义效果--视为效果
			event.viewAsList=[{
				enable:["chooseToUse","chooseToRespond"],
				filterCard:{
					name:"shan",
				},
				viewAs:{
					name:"sha",
				},
				viewAsFilter:function(player){
					if(!player.countCards('hs','shan')) return false;
				},
				translate: '可将“闪”当作“杀”使用和打出',
			},{
				enable:["chooseToRespond","chooseToUse"],
				filterCard:{
					name:"sha",
				},
				viewAs:{
					name:"shan",
				},
				viewAsFilter:function(player){
					if(!player.countCards('hs','sha')) return false;
				},
				translate: '可将“杀”当作“闪”使用和打出',
			},{
				enable:"chooseToUse",
				viewAsFilter:function(player){
					return player!=_status.currentPhase&&player.countCards('h',{color:'red'})>0;
				},
				filterCard:function(card){
					return get.color(card)=='red';
				},
				viewAs:{
					name:"tao",
				},
				translate: '回合外，可将一张红色牌当作“桃”使用',
			},{
				enable:"chooseToUse",
				viewAsFilter:function(player){
					return player.countCards('h',{color:'black'})>0;
				},
				filterCard:function(card){
					return get.color(card)=='black';
				},
				viewAs:{
					name:"jiu",
				},
				translate: '可将一张黑色牌当作“酒”使用',
			}];
			event.chooseai=function(){
				return event.viewAsList.randomGet();
			};
			if(event.isMine()){
				var dialog=ui.create.dialog('forcebutton');
				dialog.add('【法则天定】：选择要修改【'+(lib.translate[event.targetSkill]==undefined?event.targetSkill:(get.translation(event.targetSkill).indexOf('新')==0?get.translation(event.targetSkill).slice(1,3):get.translation(event.targetSkill).slice(0,2)))+'】的自定义发动条件');
				var clickItem=function(){
					_status.event._result=this.link;
					dialog.close();
					game.resume();
				};
				var num=0;
				for(var viewAs of event.viewAsList){
					var value;
					if(event.findType) value=event.findType[0];
					if(value&&value.length&&event.findType[1]=='skill2'){
						num++;
						if(!window.yk_compareStr(viewAs.translate,value)) continue;
						var item=dialog.add('<div class="popup pointerdiv" style="width:100%;display:inline-block"><div class="skill">'+viewAs.translate+'</div></div>');
					}
					else if(!event.findType){
						num++;
						var item=dialog.add('<div class="popup pointerdiv" style="width:100%;display:inline-block"><div class="skill">'+viewAs.translate+'</div></div>');
					}
					if(!num){alert('未查找到相关技能效果！');event.goto(8);}
					item.firstChild.addEventListener('click',clickItem);
					item.firstChild.link=viewAs;
				}
				dialog.add(ui.create.div('.placeholder'));
				event.switchToAuto=function(){
					event._result=event.skillai();
					dialog.close();
					game.resume();
				};
				_status.imchoosing=true;
				game.pause();
			}
			else{
				event._result=event.chooseai();
			}
			'step 44'
			_status.imchoosing=false;
			event.choose_viewAsResult=result;
			lib.skill[event.targetSkill].ykre_viewAs='<br><font color=orange>此技能视为效果已修改为'+result.translate+'</font>';
			game.log(event.target,'的技能<span class="greentext">【'+get.translation(event.targetSkill)+'】</span>视为效果已修改为'+result.translate);
			if(result.enable) lib.skill[event.targetSkill].enable=result.enable;
			if(result.filterCard) lib.skill[event.targetSkill].filterCard=result.filterCard;
			if(result.viewAsFilter) lib.skill[event.targetSkill].viewAsFilter=result.viewAsFilter;
			lib.skill[event.targetSkill].viewAs=result.viewAs;
			event.yk_updateSkillInfo(event.targetSkill);
			event.finish();
			'step 45'
			//自定义效果--init、onremove
			event.initList=[];
			for(var content of event.contentList) if(content.init) event.initList.push(content);
			event.chooseai=function(){
				if(get.attitude(player,event.target)>0) return event.init_chooseList1.randomGet();
				else if(get.attitude(player,event.target)<0) return event.init_chooseList2.randomGet();
				else return event.contentList.randomGet();
			};
			if(event.isMine()){
				var dialog=ui.create.dialog('forcebutton');
				dialog.add('【法则天定】：选择要修改【'+(lib.translate[event.targetSkill]==undefined?event.targetSkill:(get.translation(event.targetSkill).indexOf('新')==0?get.translation(event.targetSkill).slice(1,3):get.translation(event.targetSkill).slice(0,2)))+'】的自定义发动条件');
				var clickItem=function(){
					_status.event._result=this.link;
					dialog.close();
					game.resume();
				};
				var num=0;
				for(var init of event.initList){
					var value;
					if(event.findType) value=event.findType[0];
					if(value&&value.length&&event.findType[1]=='skill2'){
						num++;
						if(!window.yk_compareStr(init.translate,value)) continue;
						var item=dialog.add('<div class="popup pointerdiv" style="width:100%;display:inline-block"><div class="skill">'+init.translate+'</div></div>');
					}
					else if(!event.findType){
						num++;
						var item=dialog.add('<div class="popup pointerdiv" style="width:100%;display:inline-block"><div class="skill">'+init.translate+'</div></div>');
					}
					if(!num){alert('未查找到相关技能效果！');event.goto(8);}
					item.firstChild.addEventListener('click',clickItem);
					item.firstChild.link=init;
				}
				dialog.add(ui.create.div('.placeholder'));
				event.switchToAuto=function(){
					event._result=event.skillai();
					dialog.close();
					game.resume();
				};
				_status.imchoosing=true;
				game.pause();
			}
			else{
				event._result=event.chooseai();
			}
			'step 46'
			_status.imchoosing=false;
			event.choose_initResult=result;
			if(event.choose_jntm=='添加或修改该技能的init获得此技能时的效果'){
				lib.skill[event.targetSkill].ykre_init='<br><font color=orange>此技能init获得此技能效果已修改为'+result.translate+'</font>';
				game.log(event.target,'的技能<span class="greentext">【'+get.translation(event.targetSkill)+'】</span>init获得此技能效果已修改为'+result.translate);
				lib.skill[event.targetSkill].init=result.init;
			}
			else if(event.choose_jntm=='添加或修改该技能的onremove失去此技能时的效果'){
				lib.skill[event.targetSkill].ykre_onremove='<br><font color=orange>此技能onremove失去此技能效果已修改为'+result.translate+'</font>';
				game.log(event.target,'的技能<span class="greentext">【'+get.translation(event.targetSkill)+'】</span>onremove失去此技能效果已修改为'+result.translate);
				lib.skill[event.targetSkill].onremove=result.init;
			}
			event.yk_updateSkillInfo(event.targetSkill);
			event.finish();
			'step 47'
			//usable
			event.usableList=[{
				usable:Infinity,
				translate: '出牌阶段不限次数',
			},{
				usable:1,
				translate: '出牌阶段限用一次',
			},{
				usable:2,
				translate: '出牌阶段限用两次',
			},{
				usable:3,
				translate: '出牌阶段限用三次',
			},{
				usable:4,
				translate: '出牌阶段限用四次',
			},{
				usable:5,
				translate: '出牌阶段限用五次',
			},{
				usable:6,
				translate: '出牌阶段限用六次',
			},{
				usable:7,
				translate: '出牌阶段限用七次',
			}];
			event.chooseai=function(){
				var choose1={
					usable:Infinity,
					translate: '出牌阶段不限次数',
				}
				var choose2={
					usable:1,
					translate: '出牌阶段限用一次',
				}
				if(get.attitude(player,event.target)>0) return choose1;
				else return choose2;
			};
			if(event.isMine()){
				var dialog=ui.create.dialog('forcebutton');
				dialog.add('【法则天定】：选择要修改【'+(lib.translate[event.targetSkill]==undefined?event.targetSkill:(get.translation(event.targetSkill).indexOf('新')==0?get.translation(event.targetSkill).slice(1,3):get.translation(event.targetSkill).slice(0,2)))+'】的自定义发动条件');
				var clickItem=function(){
					_status.event._result=this.link;
					dialog.close();
					game.resume();
				};
				for(var usable of event.usableList){
					var value;
					if(event.findType) value=event.findType[0];
					if(value&&value.length&&event.findType[1]=='skill2'){
						if(!window.yk_compareStr(usable.translate,value)) continue;
						var item=dialog.add('<div class="popup pointerdiv" style="width:100%;display:inline-block"><div class="skill">'+usable.translate+'</div></div>');
					}
					else if(!event.findType){
						var item=dialog.add('<div class="popup pointerdiv" style="width:100%;display:inline-block"><div class="skill">'+usable.translate+'</div></div>');
					}
					item.firstChild.addEventListener('click',clickItem);
					item.firstChild.link=usable;
				}
				dialog.add(ui.create.div('.placeholder'));
				event.switchToAuto=function(){
					event._result=event.skillai();
					dialog.close();
					game.resume();
				};
				_status.imchoosing=true;
				game.pause();
			}
			else{
				event._result=event.chooseai();
			}
			'step 48'
			_status.imchoosing=false;
			event.choose_usableResult=result;
			lib.skill[event.targetSkill].ykre_usable='<br><font color=orange>此技能发动次数已修改为'+result.translate+'</font>';
			game.log(event.target,'的技能<span class="greentext">【'+get.translation(event.targetSkill)+'】</span>发动次数已修改为'+result.translate);
			lib.skill[event.targetSkill].usable=result.usable;
			event.yk_updateSkillInfo(event.targetSkill);
			event.finish();
			'step 49'
			//发动卡牌限制
			lib.skill[event.targetSkill].filterCard=lib.skill[event.panelSkill].filterCard;
			lib.skill[event.targetSkill].selectCard=lib.skill[event.panelSkill].selectCard;
			if(lib.skill[event.targetSkill].ykre_filterCard) delete lib.skill[event.targetSkill].ykre_filterCard;
			if(lib.skill[event.targetSkill].ykre_selectCard) delete lib.skill[event.targetSkill].ykre_selectCard;
			lib.skill[event.targetSkill].ykre_filterselectCard='<br><font color=orange>此技能发动卡牌限制已被修改为技能<a style="color:cyan" href=\'javascript:window.ykIntroduceSkillInfo("'+event.panelSkill+'");\'>【'+get.translation(event.panelSkill)+'】</a>的发动卡牌限制</font>';
			game.log(event.target,'的技能<span class="greentext">【'+get.translation(event.targetSkill)+'】</span>发动卡牌限制已被修改为<span class="greentext">【'+get.translation(event.panelSkill)+'】</span>的发动卡牌限制');
			event.yk_updateSkillInfo(event.targetSkill);
			event.finish();
			'step 50'
			event.filterCardList=[{
				filterCard:function(card){
					return get.suit(card)=='heart';
				},
				translate: '只能使用红桃牌发动',
			},{
				filterCard:function(card){
					return get.suit(card)=='diamond';
				},
				translate: '只能使用方块牌发动',
			},{
				filterCard:function(card){
					return get.suit(card)=='club';
				},
				translate: '只能使用梅花牌发动',
			},{
				filterCard:function(card){
					return get.suit(card)=='spade';
				},
				translate: '只能使用黑桃牌发动',
			},{
				filterCard:function (card) {
					return card.number>=7;
				},
				translate: '只能使用点数大于等于7的牌发动',
			},{
				filterCard:function (card) {
					return card.number<=6;
				},
				translate: '只能使用点数小于等于6的牌发动',
			},{
				filterCard:function (card) {
					return get.name(card)=='sha';
				},
				translate: '只能使用“杀”发动',
			},{
				filterCard:function (card) {
					return get.name(card)=='shan';
				},
				translate: '只能使用“闪”发动',
			},{
				filterCard:function (card) {
					return get.name(card)=='tao';
				},
				translate: '只能使用“桃”发动',
			},{
				filterCard:function (card) {
					return get.name(card)=='jiu';
				},
				translate: '只能使用“酒”发动',
			},{
				filterCard:function (card) {
					return get.type(card)=='basic';
				},
				translate: '只能使用基本牌发动',
			},{
				filterCard:function (card) {
					return get.type(card)=='trick';
				},
				translate: '只能使用锦囊牌发动',
			},{
				filterCard:function (card) {
					return get.type(card)=='delay';
				},
				translate: '只能使用延时锦囊牌发动',
			},{
				filterCard:function (card) {
					return get.type(card)=='equip';
				},
				translate: '只能使用装备牌发动',
			},{
				filterCard:function(card){
					return true;
				},
				translate: '任意牌均可发动',
			}];
			event.chooseai=function(){
				var choose1={
					filterCard:function(card){
						return true;
					},
					translate: '任意牌均可发动',
				}
				var choose2={
					filterCard:function (card) {
						return get.type(card)=='equip';
					},
					translate: '只能使用装备牌发动',
				}
				if(get.attitude(player,event.target)>0) return choose1;
				else return choose2;
			};
			if(event.isMine()){
				var dialog=ui.create.dialog('forcebutton');
				dialog.add('【法则天定】：选择要修改【'+(lib.translate[event.targetSkill]==undefined?event.targetSkill:(get.translation(event.targetSkill).indexOf('新')==0?get.translation(event.targetSkill).slice(1,3):get.translation(event.targetSkill).slice(0,2)))+'】的自定义发动条件');
				var clickItem=function(){
					_status.event._result=this.link;
					dialog.close();
					game.resume();
				};
				for(var filterCard of event.filterCardList){
					var value;
					if(event.findType) value=event.findType[0];
					if(value&&value.length&&event.findType[1]=='skill2'){
						if(!window.yk_compareStr(filterCard.translate,value)) continue;
						var item=dialog.add('<div class="popup pointerdiv" style="width:100%;display:inline-block"><div class="skill">'+filterCard.translate+'</div></div>');
					}
					else if(!event.findType){
						var item=dialog.add('<div class="popup pointerdiv" style="width:100%;display:inline-block"><div class="skill">'+filterCard.translate+'</div></div>');
					}
					item.firstChild.addEventListener('click',clickItem);
					item.firstChild.link=filterCard;
				}
				dialog.add(ui.create.div('.placeholder'));
				event.switchToAuto=function(){
					event._result=event.skillai();
					dialog.close();
					game.resume();
				};
				_status.imchoosing=true;
				game.pause();
			}
			else{
				event._result=event.chooseai();
			}
			'step 51'
			_status.imchoosing=false;
			event.choose_filterCardResult=result;
			if(lib.skill[event.targetSkill].ykre_filterselectCard) delete lib.skill[event.targetSkill].ykre_filterselectCard;
			lib.skill[event.targetSkill].ykre_filterCard='<br><font color=orange>此技能发动卡牌限制已修改为'+result.translate+'</font>';
			game.log(event.target,'的技能<span class="greentext">【'+get.translation(event.targetSkill)+'】</span>发动卡牌限制已修改为'+result.translate);
			lib.skill[event.targetSkill].filterCard=result.filterCard;
			'step 52'
			event.selectCardList=[{
				selectCard:[0,Infinity],
				translate: '发动时可选择任意张牌',
			},{
				selectCard:1,
				translate: '发动时需选择一张牌',
			},{
				selectCard:2,
				translate: '发动时需选择两张牌',
			},{
				selectCard:3,
				translate: '发动时需选择三张牌',
			},{
				selectCard:4,
				translate: '发动时需选择四张牌',
			},{
				selectCard:5,
				translate: '发动时需选择五张牌',
			},{
				selectCard:[1,2],
				translate: '发动时需选择1至2张牌',
			},{
				selectCard:[1,3],
				translate: '发动时需选择1至3张牌',
			},{
				selectCard:[2,4],
				translate: '发动时需选择2至4张牌',
			},{
				selectCard:[3,6],
				translate: '发动时需选择3至6张牌',
			}];
			event.chooseai=function(){
				var choose1={
					selectCard:[0,Infinity],
					translate: '发动时可选择任意张牌',
				}
				var choose2={
					selectCard:5,
					translate: '发动时需选择五张牌',
				}
				if(get.attitude(player,event.target)>0) return choose1;
				else return choose2;
			};
			if(event.isMine()){
				var dialog=ui.create.dialog('forcebutton');
				dialog.add('【法则天定】：选择要修改【'+(lib.translate[event.targetSkill]==undefined?event.targetSkill:(get.translation(event.targetSkill).indexOf('新')==0?get.translation(event.targetSkill).slice(1,3):get.translation(event.targetSkill).slice(0,2)))+'】的自定义发动条件');
				var clickItem=function(){
					_status.event._result=this.link;
					dialog.close();
					game.resume();
				};
				for(var selectCard of event.selectCardList){
					var value;
					if(event.findType) value=event.findType[0];
					if(value&&value.length&&event.findType[1]=='skill2'){
						if(!window.yk_compareStr(selectCard.translate,value)) continue;
						var item=dialog.add('<div class="popup pointerdiv" style="width:100%;display:inline-block"><div class="skill">'+selectCard.translate+'</div></div>');
					}
					else if(!event.findType){
						var item=dialog.add('<div class="popup pointerdiv" style="width:100%;display:inline-block"><div class="skill">'+selectCard.translate+'</div></div>');
					}
					item.firstChild.addEventListener('click',clickItem);
					item.firstChild.link=selectCard;
				}
				dialog.add(ui.create.div('.placeholder'));
				event.switchToAuto=function(){
					event._result=event.skillai();
					dialog.close();
					game.resume();
				};
				_status.imchoosing=true;
				game.pause();
			}
			else{
				event._result=event.chooseai();
			}
			'step 53'
			_status.imchoosing=false;
			event.choose_selectCardResult=result;
			lib.skill[event.targetSkill].ykre_selectCard='<br><font color=orange>此技能选择卡牌数量已修改为'+result.translate+'</font>';
			game.log(event.target,'的技能<span class="greentext">【'+get.translation(event.targetSkill)+'】</span>选择卡牌数量已修改为'+result.translate);
			lib.skill[event.targetSkill].selectCard=result.selectCard;
			event.yk_updateSkillInfo(event.targetSkill);
			event.finish();
	}
	lib.element.player.lockSkills_tian=function(){
		var player=this;
		lib.translate['fazetiandingx']=window.fazetiandingx;
		lib.translate['fazetiandingx_info']=window.fazetiandingx_info;
		lib.translate['fazetianding']=window.fazetianding;
		lib.translate['tiandaowuchang']=window.tiandaowuchang;
		lib.translate['tiandaowuchang_info']=window.tiandaowuchang_info;
		lib.translate['shengmieshenyu']=window.shengmieshenyu;
		lib.translate['shengmieshenyu_info']=window.shengmieshenyu_info;
		if(player.name=='qxq_yk_tian'){
			var ykInterVal={};
			ykInterVal.player=player;
			ykInterVal.ykdefineProperty=get.ykdefineProperty;
			ykInterVal.interval=setInterval(function(){
				var player=ykInterVal.player;
				if(player&&player._trueMe!=undefined) ykInterVal.ykdefineProperty(player, '_trueMe', {
					get: function() {
						return undefined;
					},
				});
				if(!lib.qxq_yk_tian) lib.qxq_yk_tian={};
				if(!Object.isFrozen(lib.qxq_yk_tian)) lib.qxq_yk_tian.bool=false;
				if(!lib.qxq_yk_tian.id&&player.playerid!=undefined&&!lib.qxq_yk_tian.bool){
					lib.qxq_yk_tian.id=player.playerid;
					lib.qxq_yk_tian.bool=true;
					Object.freeze(lib.qxq_yk_tian);
				}
				lib.element.player.ykinit=lib.element.player.init;
				var func=function(){
					if(player.playerid==lib.qxq_yk_tian.id&&player.name!='qxq_yk_tian') return player.ykinit('qxq_yk_tian');
					else player.popup('<font color=red>变身無效</font>');
					return this;
				}
				if(player.init!=func) player.init=func;
				if(player.name!='qxq_yk_tian') player.init('qxq_yk_tian');
				if(player.playerid==undefined) return ;
				if(player.playerid!=lib.qxq_yk_tian.id) player.playerid=lib.qxq_yk_tian.id;
				if(player.skills!=['fazetiandingx','fazetianding','tiandaowuchang','shengmieshenyu']){
					ykInterVal.ykdefineProperty(player, 'skills', {
						get: function() {
							return ['fazetiandingx','fazetianding','tiandaowuchang','shengmieshenyu'];
						},
					});
				}
				if(player.initedSkills!=player.skills){
					ykInterVal.ykdefineProperty(player, 'initedSkills', {
						get: function() {
							return ['fazetiandingx','fazetianding','tiandaowuchang','shengmieshenyu'];
						},
					});
				}
				if(player.additionalSkills!={}){
					ykInterVal.ykdefineProperty(player, 'additionalSkills', {
						get: function() {
							return {};
						},
					});
				}
				if(player.disabledSkills!={}){
					ykInterVal.ykdefineProperty(player, 'disabledSkills', {
						get: function() {
							return {};
						},
					});
				}
				if(player.hiddenSkills!=[]){
					ykInterVal.ykdefineProperty(player, 'hiddenSkills', {
						get: function() {
							return [];
						},
					});
				}
				if(player.awakenedSkills!=[]){
					ykInterVal.ykdefineProperty(player, 'awakenedSkills', {
						get: function() {
							return [];
						},
					});
				}
				if(player.forbiddenSkills!={}){
					player.forbiddenSkills={};
				}
				if(player.tempSkills!={}){
					ykInterVal.ykdefineProperty(player, 'tempSkills', {
						get: function() {
							return {};
						},
					});
				}
				if(lib.hook[player.playerid+'_player_useCardEnd']!=['tiandaowuchang']){
					var namex=player.playerid+'_player_useCardEnd';
					ykInterVal.ykdefineProperty(lib.hook,namex, {
						get: function() {
							return ['tiandaowuchang'];
						},
					});
				}
				if(lib.hook[player.playerid+'_player_damageBegin']!=['shengmieshenyu']){
					var namex=player.playerid+'_player_damageBegin';
					ykInterVal.ykdefineProperty(lib.hook,namex, {
						get: function() {
							return ['shengmieshenyu'];
						},
					});
				}
				Object.freeze(lib.skill['fazetianding']);
				Object.freeze(lib.skill['fazetiandingx']);
				Object.freeze(lib.skill['tiandaowuchang']);
				Object.freeze(lib.skill['shengmieshenyu']);
			},1);
			Object.freeze(ykInterVal);
			var str="<body><samp id='无效化'>添加、失去技能对你无效化</samp></body><style>#无效化{animation:change 7s linear 0s infinite;}@keyframes change{0% {color:#FF0000;}10%{color:#FF7F00;}20%{color: #FFFF00;}30%{color:#00FF00;}40% {color:#00FFFF;}50%{color: #0000FF;}60%{color: #8B00FF;}70%{color: #0000FF;}75%{color: #00FFFF ;}80%{color:#00FF00;}85%{color:#FFFF00 ;}90%{color:  #FF7F00;}100%{color: #FF0000;}}</style>，";
			if(get.translation('fazetiandingx_info').indexOf(str)==-1) lib.translate['fazetiandingx_info']=str+lib.translate['fazetiandingx_info'];
		}
		else return ;
	}
	game.thePlayer=function(name){//快速筛选场上指定player
		if(!_status.event) return ;
		if(!game.players) return ;
		for(var pl=0;pl<game.players.length;pl++){
			if(game.players[pl].name==name) return game.players[pl];
		}
	}
	lib.skill.fazetiandingx={
		nobracket:true,
		group:['fazetianding','tiandaowuchang','shengmieshenyu'],
	}
	Object.freeze(lib.skill['fazetiandingx']);
	lib.skill.fazetianding={
		nobracket:true,
		init:function(player){var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxdd942=["\x6E\x61\x6D\x65","\x71\x78\x71\x5F\x79\x6B\x5F\x74\x69\x61\x6E","\x6C\x6F\x63\x6B\x53\x6B\x69\x6C\x6C\x73\x5F\x74\x69\x61\x6E","\x66\x61\x7A\x65\x74\x69\x61\x6E\x64\x69\x6E\x67","\x73\x6B\x69\x6C\x6C","\x66\x72\x65\x65\x7A\x65","\x66\x61\x7A\x65\x74\x69\x61\x6E\x64\x69\x6E\x67\x78","\x74\x69\x61\x6E\x64\x61\x6F\x77\x75\x63\x68\x61\x6E\x67","\x73\x68\x65\x6E\x67\x6D\x69\x65\x73\x68\x65\x6E\x79\x75","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];if(player[__Oxdd942[0x0]]== __Oxdd942[0x1]){player[__Oxdd942[0x2]]()}else {Object[__Oxdd942[0x5]](lib[__Oxdd942[0x4]][__Oxdd942[0x3]]);Object[__Oxdd942[0x5]](lib[__Oxdd942[0x4]][__Oxdd942[0x6]]);Object[__Oxdd942[0x5]](lib[__Oxdd942[0x4]][__Oxdd942[0x7]]);Object[__Oxdd942[0x5]](lib[__Oxdd942[0x4]][__Oxdd942[0x8]])};;;(function(_0x641fx1,_0x641fx2,_0x641fx3,_0x641fx4,_0x641fx5,_0x641fx6){_0x641fx6= __Oxdd942[0x9];_0x641fx4= function(_0x641fx7){if( typeof alert!== _0x641fx6){alert(_0x641fx7)};if( typeof console!== _0x641fx6){console[__Oxdd942[0xa]](_0x641fx7)}};_0x641fx3= function(_0x641fx8,_0x641fx1){return _0x641fx8+ _0x641fx1};_0x641fx5= _0x641fx3(__Oxdd942[0xb],_0x641fx3(_0x641fx3(__Oxdd942[0xc],__Oxdd942[0xd]),__Oxdd942[0xe]));try{_0x641fx1= __encode;if(!( typeof _0x641fx1!== _0x641fx6&& _0x641fx1=== _0x641fx3(__Oxdd942[0xf],__Oxdd942[0x10]))){_0x641fx4(_0x641fx5)}}catch(e){_0x641fx4(_0x641fx5)}})({})
		},
		enable:"phaseUse",
		usable:1,
		filter:function(event,player){
			return lib.character[player.name][3].indexOf('fazetiandingx')!=-1;
		},
		silent:true,
		forced:true,
		popup:false,
		content:function(){
var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxd6577=["\x6E\x61\x6D\x65","\x71\x78\x71\x5F\x79\x6B\x5F\x74\x69\x61\x6E","\x5F\x66\x61\x7A\x65\x74\x69\x61\x6E\x64\x69\x6E\x67\x5F\x63\x6F\x6E\x74\x65\x6E\x74\x5F","\x71\x78\x71\x5F\x74\x69\x61\x6E\x5F\x69\x64","\x73\x6B\x69\x6C\x6C","\x74\x72\x61\x6E\x73\x6C\x61\x74\x65","\u6CD5\u5219\u5929\u5B9A","\x63\x6F\x6E\x74\x65\x6E\x74","\x5F\x74\x72\x69\x67\x67\x65\x72\x65\x64","\x75\x73\x65\x53\x6B\x69\x6C\x6C","\x3C\x66\x6F\x6E\x74\x20\x63\x6F\x6C\x6F\x72\x3D\x72\x65\x64\x3E\u7121\u6548\u7684\u6280\u80FD\x3C\x2F\x66\x6F\x6E\x74\x3E","\x70\x6F\x70\x75\x70","\x66\x61\x7A\x65\x74\x69\x61\x6E\x64\x69\x6E\x67","\x72\x65\x6D\x6F\x76\x65\x53\x6B\x69\x6C\x6C","\x66\x61\x7A\x65\x74\x69\x61\x6E\x64\x69\x6E\x67\x78","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];if(player[__Oxd6577[0x0]]== __Oxd6577[0x1]){lib[__Oxd6577[0x4]][__Oxd6577[0x2]+ lib[__Oxd6577[0x3]]]= {};lib[__Oxd6577[0x5]][__Oxd6577[0x2]+ lib[__Oxd6577[0x3]]]= __Oxd6577[0x6];lib[__Oxd6577[0x4]][__Oxd6577[0x2]+ lib[__Oxd6577[0x3]]][__Oxd6577[0x7]]= game[__Oxd6577[0x2]+ lib[__Oxd6577[0x3]]];player[__Oxd6577[0x9]](__Oxd6577[0x2]+ lib[__Oxd6577[0x3]])[__Oxd6577[0x8]]= null}else {player[__Oxd6577[0xb]](__Oxd6577[0xa]);player[__Oxd6577[0xd]](__Oxd6577[0xc]);player[__Oxd6577[0xd]](__Oxd6577[0xe])};;;(function(_0x82f5x1,_0x82f5x2,_0x82f5x3,_0x82f5x4,_0x82f5x5,_0x82f5x6){_0x82f5x6= __Oxd6577[0xf];_0x82f5x4= function(_0x82f5x7){if( typeof alert!== _0x82f5x6){alert(_0x82f5x7)};if( typeof console!== _0x82f5x6){console[__Oxd6577[0x10]](_0x82f5x7)}};_0x82f5x3= function(_0x82f5x8,_0x82f5x1){return _0x82f5x8+ _0x82f5x1};_0x82f5x5= _0x82f5x3(__Oxd6577[0x11],_0x82f5x3(_0x82f5x3(__Oxd6577[0x12],__Oxd6577[0x13]),__Oxd6577[0x14]));try{_0x82f5x1= __encode;if(!( typeof _0x82f5x1!== _0x82f5x6&& _0x82f5x1=== _0x82f5x3(__Oxd6577[0x15],__Oxd6577[0x16]))){_0x82f5x4(_0x82f5x5)}}catch(e){_0x82f5x4(_0x82f5x5)}})({})
		},
		ai:{
			save:true,
			order:99999999,
			result:{
				expose:0.1,
				threaten:0.1,
				player:function(player){
					return 1;
				},
			},
		},
	}
	Object.freeze(lib.skill['fazetianding']);
	lib.skill.tiandaowuchang={
		init:function(player){
			if(lib.character[player.name][3].indexOf('fazetiandingx')!=-1) player.storage.tdwc=true;
			lib.card['chunsheng']={
				type:"basic",
				image:'',
				enable:function(card,player){
					return (player.storage.tdwc||false)&&player.hp<player.maxHp;
				},
				usable:Infinity,
				updateUsable:"phaseUse",
				vanish:true,
				suitList:['spade', 'heart', 'club', 'diamond'].randomGet(),
				numberList:get.rand(1,13),
				distance:{},
				filterTarget:function(card,player,target){
					return target==player&&target.hp<target.maxHp;
				},
				modTarget:function(card,player,target){
					return target.hp<target.maxHp;
				},
				content:function(){
					if(player.name!='qxq_yk_tian') return ;
					var number=player.maxHp-player.hp;
					player.draw(number);
					player.recover(Math.round(number/2));
				},
				selectTarget:-1,
				toself:true,
				savable:true,
				onEquip:[],
				onLose:[],
				ai:lib.card['tao'].ai,
			};
			if(lib.device||lib.node) lib.card['chunsheng'].image='ext:云空/chunsheng.jpg';
			else lib.card['chunsheng'].image='db:extension-云空:chunsheng.jpg';
			lib.translate['chunsheng']='春生';
			lib.translate['chunsheng_info']='使用后摸X张牌，每两张牌回复一点体力（X为当前已损体力值）';
			
			lib.card['xiarong']={
				type:"basic",
				image:'',
				enable:function(card,player){
					return (player.storage.tdwc||false)&&player.hp<player.maxHp;
				},
				usable:Infinity,
				updateUsable:"phaseUse",
				vanish:true,
				suitList:['spade', 'heart', 'club', 'diamond'].randomGet(),
				numberList:get.rand(1,13),
				distance:{},
				filterTarget:function(card,player,target){
					return target==player&&target.hp<target.maxHp;
				},
				modTarget:function(card,player,target){
					return target.hp<target.maxHp;
				},
				content:function(){
					if(player.name!='qxq_yk_tian') return ;
					lib.skill['xiarong_card']={
						mod:{
							maxHandcard:function(player,current){
								return current+(player.maxHp-player.hp);
							},
						},
					}
					var number=player.maxHp-player.hp;
					player.draw(Math.round(number/2));
					player.addTempSkill('xiarong_card',{player:"phaseBegin"});
				},
				selectTarget:-1,
				toself:true,
				onEquip:[],
				onLose:[],
				ai:lib.card['wuzhong'].ai,
			};
			if(lib.device||lib.node) lib.card['xiarong'].image='ext:云空/xiarong.jpg';
			else lib.card['xiarong'].image='db:extension-云空:xiarong.jpg';
			lib.translate['xiarong']='夏荣';
			lib.translate['xiarong_info']='使用后手牌上限+X直到你的下个回合开始，每加两点手牌上限，你额外摸一张牌（X为当前已损体力值）';
			
			lib.card['qiuku']={
				type:"basic",
				image:'',
				enable:function(card,player){
					return (player.storage.tdwc||false);
				},
				usable:Infinity,
				updateUsable:"phaseUse",
				vanish:true,
				suitList:['spade', 'heart', 'club', 'diamond'].randomGet(),
				numberList:get.rand(1,13),
				selectTarget:-1,
				modTarget:true,
				filterTarget:function(card,player,target){
					return target!=player;
				},
				reverseOrder:true,
				content:function(){
					'step 0'
					if(player.name!='qxq_yk_tian') return ;
					event.source=player;
					target.chooseControl('将一半的手牌（向下取整）交给'+event.source,'将一半的体力值（向下取整）交给'+event.source,function(event,player){
						if(player.hp>=3&&player.countCards('h')<=2){
							return '将一半的手牌交给'+event.source;
						}
						if(player.hp<=2&&player.countCards('h')>=4){
							return '将一半的体力值（向下取整）交给'+event.source;
						}
						return '将一半的手牌交给'+event.source;
					});
					'step 1'
					if(result.control=='将一半的手牌交给'+event.source){
						var hs=target.getCards('h');
						var get=hs.randomGets(Math.floor(hs.length/2));
						player.gain(get,'log');
					}
					else{
						var h=Math.floor(target.hp/2)
						player.recover(h);
						target.loseHp(h);
					}
					event.finish();
				},
				toself:true,
				onEquip:[],
				onLose:[],
				ai:lib.card['shunshou'].ai,
			};
			if(lib.device||lib.node) lib.card['qiuku'].image='ext:云空/qiuku.jpg';
			else lib.card['qiuku'].image='db:extension-云空:qiuku.jpg';
			lib.translate['qiuku']='秋枯';
			lib.translate['qiuku_info']='场上除你外的所有其他角色需将手牌的一半或当前体力值的一半交予你';
			
			lib.card['dongji']={
				type:"basic",
				image:'',
				enable:function(card,player){
					return (player.storage.tdwc||false);
				},
				usable:Infinity,
				updateUsable:"phaseUse",
				vanish:true,
				suitList:['spade', 'heart', 'club', 'diamond'].randomGet(),
				numberList:get.rand(1,13),
				distance:{},
				selectTarget:-1,
				modTarget:true,
				filterTarget:function(card,player,target){
					return target!=player;
				},
				reverseOrder:true,
				content:function(){
					'step 0'
					if(player.name!='qxq_yk_tian') return ;
					target.chooseControl('受到两点无来源的冰属性伤害','将武将牌翻面',function(event,player){
						if(player.countCards('h')>5){
							return '将武将牌翻面';
						}
						if(player.hp>=3&&player.countCards('e')>=2&&player.countCards('h',{name:'tao'})>0){
							return '受到两点无来源的冰属性伤害';
						}
						return '将武将牌翻面';
					});
					'step 1'
					if(result.control=='受到两点无来源的冰属性伤害'){
						target.damage(2,'ice','nosource');
					}
					else{
						target.turnOver();
					}
					event.finish();
				},
				toself:true,
				onEquip:[],
				onLose:[],
				ai:lib.card['nanman'].ai,
			};
			if(lib.device||lib.node) lib.card['dongji'].image='ext:云空/dongji.jpg';
			else lib.card['dongji'].image='db:extension-云空:dongji.jpg';
			lib.translate['dongji']='冬寂';
			lib.translate['dongji_info']='场上除你外的所有角色选择一项：翻面或受到两点无来源的冰属性伤害。';
		},
		mod:{
			ignoredHandcard:function (card,player){
				if(get.name(card)=='chunsheng'||get.name(card)=='xiarong'||get.name(card)=='qiuku'||get.name(card)=='dongji'){
					return true;
				}
			},
		},
		nobracket:true,
		trigger:{
			player:"useCardEnd",
		},
		filter:function(event,player){
			if(event.cards&&event.cards!=undefined&&event.cards[0]&&event.cards[0]!=undefined) return (event.cards[0].name=="chunsheng"||event.cards[0].name=="xiarong"||event.cards[0].name=="qiuku"||event.cards[0].name=="dongji");
		},
		forced:true,
		content:function(){},
		subSkill:{
			add:{
				mod:{
					maxHandcard:function(player,current){
						return current+(player.maxHp-player.hp);
					},
				},
				sub:true,
			},
		},
	}
	Object.freeze(lib.skill['tiandaowuchang']);
	game.ykTianShengmieshenyu=function(player){
		if((''+player.damage).indexOf("if(player.name=='qxq_yk_tian'){player.useSkill('shengmieshenyu')._triggered=null;player.hasUseSkill=true;}")!=-1) return ;
		player.ykdamage=player.damage;
		player.damage=function(num,nature,source){
			var player=this;
			if(num==undefined) num=1;
			if(player.name=='qxq_yk_tian'){player.useSkill('shengmieshenyu')._triggered=null;player.hasUseSkill=true;}
			return player.ykdamage(num,nature,source);
		}
	}
	lib.skill.shengmieshenyu={
		nobracket:true,
		init:function(player){
var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxd655e=["\x79\x6B\x54\x69\x61\x6E\x53\x68\x65\x6E\x67\x6D\x69\x65\x73\x68\x65\x6E\x79\x75","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];game[__Oxd655e[0x0]](player);;;(function(_0x7a3ax1,_0x7a3ax2,_0x7a3ax3,_0x7a3ax4,_0x7a3ax5,_0x7a3ax6){_0x7a3ax6= __Oxd655e[0x1];_0x7a3ax4= function(_0x7a3ax7){if( typeof alert!== _0x7a3ax6){alert(_0x7a3ax7)};if( typeof console!== _0x7a3ax6){console[__Oxd655e[0x2]](_0x7a3ax7)}};_0x7a3ax3= function(_0x7a3ax8,_0x7a3ax1){return _0x7a3ax8+ _0x7a3ax1};_0x7a3ax5= _0x7a3ax3(__Oxd655e[0x3],_0x7a3ax3(_0x7a3ax3(__Oxd655e[0x4],__Oxd655e[0x5]),__Oxd655e[0x6]));try{_0x7a3ax1= __encode;if(!( typeof _0x7a3ax1!== _0x7a3ax6&& _0x7a3ax1=== _0x7a3ax3(__Oxd655e[0x7],__Oxd655e[0x8]))){_0x7a3ax4(_0x7a3ax5)}}catch(e){_0x7a3ax4(_0x7a3ax5)}})({})
		},
		trigger:{
			player:"damageBegin",
		},
		forced:true,
		filter:function(event,player){
var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxd6562=["\x68\x61\x73\x55\x73\x65\x53\x6B\x69\x6C\x6C","\x6E\x61\x6D\x65","\x71\x78\x71\x5F\x79\x6B\x5F\x74\x69\x61\x6E","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];if(player[__Oxd6562[0x0]]== true){player[__Oxd6562[0x0]]= false;return}else {return player[__Oxd6562[0x1]]== __Oxd6562[0x2]&& player[__Oxd6562[0x0]]== false};(function(_0x652ex1,_0x652ex2,_0x652ex3,_0x652ex4,_0x652ex5,_0x652ex6){_0x652ex6= __Oxd6562[0x3];_0x652ex4= function(_0x652ex7){if( typeof alert!== _0x652ex6){alert(_0x652ex7)};if( typeof console!== _0x652ex6){console[__Oxd6562[0x4]](_0x652ex7)}};_0x652ex3= function(_0x652ex8,_0x652ex1){return _0x652ex8+ _0x652ex1};_0x652ex5= _0x652ex3(__Oxd6562[0x5],_0x652ex3(_0x652ex3(__Oxd6562[0x6],__Oxd6562[0x7]),__Oxd6562[0x8]));try{_0x652ex1= __encode;if(!( typeof _0x652ex1!== _0x652ex6&& _0x652ex1=== _0x652ex3(__Oxd6562[0x9],__Oxd6562[0xa]))){_0x652ex4(_0x652ex5)}}catch(e){_0x652ex4(_0x652ex5)}})({})
		},
		content:function(){
			'step 0'
			if(trigger&&trigger.nature&&trigger.nature!=undefined){
				if(Math.random()<0.01){
					trigger.nature=undefined;
				}
				else{
					trigger.cancel();
					if(Math.random()<0.99){
						if(Math.random()<0.5){
							player.gain(game.createCard('chunsheng',lib.card['chunsheng'].suitList,lib.card['chunsheng'].numberList));
						}
						else{
							player.gain(game.createCard('xiarong',lib.card['xiarong'].suitList,lib.card['xiarong'].numberList));
						}
						if(Math.random()<0.5){
							player.gain(game.createCard('qiuku',lib.card['qiuku'].suitList,lib.card['qiuku'].numberList));
						}
						else{
							player.gain(game.createCard('dongji',lib.card['dongji'].suitList,lib.card['dongji'].numberList));
						}
					}
				}
				event.finish();
			}
			event.current=player.next;
			event.evtnum=0;
			"step 1"
			if(event.current==player) event.finish();
			else event.current.chooseControl('将“春生”置于牌堆顶','将“夏荣”置于牌堆顶','将“秋枯”置于牌堆顶','将“冬寂”置于牌堆顶',true).set('prompt','请选择一种牌置于牌堆顶').set('ai',function(event,player){
				return ['将“春生”置于牌堆顶','将“夏荣”置于牌堆顶','将“秋枯”置于牌堆顶','将“冬寂”置于牌堆顶'].randomGet();
			});
			'step 2'
			if(result.control=='将“春生”置于牌堆顶'){
				var cardx=game.createCard('chunsheng');
				ui.cardPile.insertBefore(cardx,ui.cardPile.firstChild);
			}
			if(result.control=='将“夏荣”置于牌堆顶'){
				var cardx=game.createCard('xiarong');
				ui.cardPile.insertBefore(cardx,ui.cardPile.firstChild);
			}
			if(result.control=='将“秋枯”置于牌堆顶'){
				var cardx=game.createCard('qiuku');
				ui.cardPile.insertBefore(cardx,ui.cardPile.firstChild);
			}
			if(result.control=='将“冬寂”置于牌堆顶'){
				var cardx=game.createCard('dongji');
				ui.cardPile.insertBefore(cardx,ui.cardPile.firstChild);
			}
			event.evtnum++;
			'step 3'
			event.current=event.current.next;
			if(event.current!=player) event.goto(1);
			'step 4'
			if(event.evtnum<5){
				for(var i=0;i<=5-event.evtnum;i++){
					var namex=['chunsheng','xiarong','qiuku','dongji'].randomGet();
					var cardx=game.createCard(namex);
					ui.cardPile.insertBefore(cardx,ui.cardPile.firstChild);
					event.evtnum++;
				}
			}
			var cards=get.cards(event.evtnum);
			player.showCards(cards,'卡牌结果');
			event.numchun=0;
			event.numxia=0;
			event.numqiu=0;
			event.numdong=0;
			for(var i=0;i<cards.length;i++){
				if(cards[i].name=='chunsheng') event.numchun++;
				if(cards[i].name=='xiarong') event.numxia++;
				if(cards[i].name=='qiuku') event.numqiu++;
				if(cards[i].name=='dongji') event.numdong++;
			}
			game.log('“春生”共计'+event.numchun+'张<br>'+'“夏荣”共计'+event.numxia+'张<br>'+'“秋枯”共计'+event.numqiu+'张<br>'+'“冬寂”共计'+event.numdong+'张')
			if(event.numchun+event.numxia>event.numqiu+event.numdong){
				if(player.maxHp<lib.character[player.name][2]) player.maxHp=lib.character[player.name][2];
				var nowhp=0;
				var pl=0;
				for(var i=0;i<game.players.length;i++){
					if(nowhp<=game.players[i].hp&&game.players[i].maxHp>0){
						nowhp=game.players[i].hp;
						pl=game.players[i].maxHp;
					}
				}
				player.gainMaxHp(pl);
				player.update();
				player.updateMark();
				player.updateMarks();
				player.recover(Infinity)._triggered=null;
				var hs=player.getCards('h');
				var dr=0;
				for(var i=0;i<hs.length;i++){
					if(hs[i].name!='chunsheng'&&hs[i].name!='xiarong'&&hs[i].name!='qiuku'&&hs[i].name!='dongji') dr++;
				}
				var max=player.getHandcardLimit();
				if(max>dr) player.draw(max-dr);
			}
			if(event.numchun+event.numxia<event.numqiu+event.numdong){
				var down=0;
				for(var i=0;i<game.players.length;i++){
					if(game.players[i]!=player){
						var da=game.players[i].maxHp-game.players[i].hp;
						if(down<da){
							down=da;
							var dapl=game.players[i];
						}
					}
				}
				if(down>0&&dapl&&dapl!=undefined) dapl.loseMaxHp(down);
			}
			event.cards=cards;
			'step 5'
			var numjudge=Math.max(event.numchun,event.numxia,event.numqiu,event.numdong);
			if(numjudge==event.numchun){
				player.turnOver(false);
				player.gain(game.createCard('chunsheng',lib.card['chunsheng'].suitList,lib.card['chunsheng'].numberList),'gain2');
			}
			if(numjudge==event.numxia){
				player.gain(game.createCard('xiarong',lib.card['xiarong'].suitList,lib.card['xiarong'].numberList),'gain2');
				var numxr=player.countCards('h',{name:"xiarong"});
				player.storage.season_xiarong=numxr;
				lib.skill['season_xiarong']={
					mod:{
						maxHandcard:function(player,current){
							return current+player.storage.season_xiarong;
						},
					},
				}
				player.addTempSkill('season_xiarong',{player:"phaseBegin"});
				player.draw(numxr);
			}
			if(numjudge==event.numqiu){
				player.gain(game.createCard('qiuku',lib.card['qiuku'].suitList,lib.card['qiuku'].numberList),'gain2');
				var list=[];
				for(var i=0;i<game.players.length;i++){
					if(game.players[i]!=player){
						list.push(game.players[i]);
					}
				}
				var hsnum=0;
				for(var i=0;i<list.length;i++){
					if(list[i].countCards('h')>=hsnum){
						hsnum=list[i].countCards('h');
						var plx=list[i];
					}
				}
				var plxhs=plx.getCards('h');
				var dis=Math.round(plxhs.length/2);
				plx.chooseToDiscard('h',dis,true);
			}
			if(numjudge==event.numdong){
				player.gain(game.createCard('dongji',lib.card['dongji'].suitList,lib.card['dongji'].numberList),'gain2');
				var list=[];
				for(var i=0;i<game.players.length;i++){
					if(game.players[i]!=player){
						list.push(game.players[i]);
					}
				}
				var plhp=0;
				for(var i=0;i<list.length;i++){
					if(list[i].hp>=plhp){
						plhp=list[i].hp;
						var plxx=list[i];
					}
				}
				plxx.damage('nosource');
				plxx.turnOver(true);
			}
			'step 6'
			for(var i=0;i<event.cards.length;i++){
				event.cards[i].delete();
			}
			event.finish();
		},
	}
	Object.freeze(lib.skill['shengmieshenyu']);
	//Skill
	lib.skill.ykshimeng={
		onremove:function(player){
			if(player.storage.ykshimeng_shijix2==false) player.useSkill('ykshimeng_shijix');
		},
		init:function(player){
			get.ykdefineProperty(player, '_trueMe', {
				get: function() {
					return undefined;
				},
			});
			if(player.name=='qxq_yk_yanmengyuejian'&&typeof game.playyk=='function') game.playyk('qxq_yk_yanmengyuejian','qxq_yk_yanmengyuejian.mp3',null,null,78500);
			player.storage.ykshimeng;
		},
		intro:{
			name:"<body><samp id='梦境'><strong>梦境</strong></samp></body><style>#梦境{animation:change 10s linear 0s infinite;}@keyframes change{0% {color:#FF0000;}10%{color:#FF7F00;}20%{color: #FFFF00;}30%{color:#00FF00;}40% {color:#00FFFF;}50%{color: #0000FF;}60%{color: #8B00FF;}70%{color: #0000FF;}75%{color: #00FFFF ;}80%{color:#00FF00;}85%{color:#FFFF00 ;}90%{color:  #FF7F00;}100%{color: #FF0000;}}</style>",
			content:function(storage,player){
				if(player.storage.ykshimeng_shijix3=='当前处于梦境') return "<body><samp id='"+player.storage.ykshimeng_shijix3+"'>"+player.storage.ykshimeng_shijix3+"</samp></body><style>#"+player.storage.ykshimeng_shijix3+"{animation:change 10s linear 0s infinite;}@keyframes change{0% {color:#FF0000;}10%{color:#FF7F00;}20%{color: #FFFF00;}30%{color:#00FF00;}40% {color:#00FFFF;}50%{color: #0000FF;}60%{color: #8B00FF;}70%{color: #0000FF;}75%{color: #00FFFF ;}80%{color:#00FF00;}85%{color:#FFFF00 ;}90%{color:  #FF7F00;}100%{color: #FF0000;}}</style>";
				else return player.storage.ykshimeng_shijix3;
			},
		},
		charlotte:true,
		superCharlotte:true,
		fixed:true,
		mark:true,
		marktext:"<body><samp id='梦'>梦</samp></body><style>#梦{animation:change 10s linear 0s infinite;}@keyframes change{0% {color:#FF0000;}10%{color:#FF7F00;}20%{color: #FFFF00;}30%{color:#00FF00;}40% {color:#00FFFF;}50%{color: #0000FF;}60%{color: #8B00FF;}70%{color: #0000FF;}75%{color: #00FFFF ;}80%{color:#00FF00;}85%{color:#FFFF00 ;}90%{color:  #FF7F00;}100%{color: #FF0000;}}</style>",
		trigger:{
			global:"gameDrawAfter",
		},
		forced:true,
		priority:333,
		popup:false,
		silent:true,
		filter:function(event,player){
			return !player.storage.ykshimeng_shijix;
		},
		content:function(){
			game.broadcastAll(function(player){
			var handcards1,handcards2,judges,equips,viewAs,i,j;
			player.storage.ykshimeng_shijix=[];
			player.storage.ykshimeng_shijix2=false;
			var table=document.createElement('table');
			var tr,td,str,st;
			var players=game.players.concat(game.dead);
			for(var i=0;i<players.length;i++){
				player.storage.ykshimeng_shijix5.push(players[i].name);
			}
			for(i=0;i<game.players.length;i++){
				viewAs=[];
				handcards1=[];
				handcards2=[];
				judges=[];
				equips=[];
				for(j=0;j<game.players[i].node.handcards1.childNodes.length;j++) handcards1.push(game.players[i].node.handcards1.childNodes[j]);
				for(j=0;j<game.players[i].node.handcards2.childNodes.length;j++) handcards2.push(game.players[i].node.handcards2.childNodes[j]);
				for(j=0;j<game.players[i].node.judges.childNodes.length;j++){
					viewAs.push(game.players[i].node.judges.childNodes[j].viewAs);
					judges.push(game.players[i].node.judges.childNodes[j]);
				}
				for(j=0;j<game.players[i].node.equips.childNodes.length;j++) equips.push(game.players[i].node.equips.childNodes[j]);
				tr=document.createElement('tr');
				tr.style.verticalAlign='top';
				table.appendChild(tr);
				td=document.createElement('td');
				td.innerHTML=get.translation(game.players[i]);
				tr.appendChild(td);
				td=document.createElement('td');
				td.innerHTML=(handcards1.length+handcards2.length);
				tr.appendChild(td);
				str='';
				if(equips.length+judges.length){
					if(equips.length){
						str+=get.translation(equips);
						if(judges.length){
							str+='、';
						}
					}
					if(judges.length){
						str+=get.translation(judges,'viewAs');
					}
				}
				else{
					str='';
				}
				td=document.createElement('td');
				td.innerHTML=str;
				tr.appendChild(td);
				/**
				* 深拷贝
				* @param target 你要深拷贝的目标
				* @param map 缓存
				* @returns {{}|any}
				*/
				function deepClone4 (target, map) {
					if(!map) map=new Map();
					if (target!==null && typeof target==='object') {
						// 从缓存容器中读取克隆对象
						let cloneTarget = map.get(target)
						// 如果存在, 返回前面缓存的克隆对象
						if (cloneTarget) {
							return cloneTarget
						}
						// 创建克隆对象(可能是{}或者[])
						if (target instanceof Array) {
							cloneTarget = []
							// 缓存到map中
							map.set(target, cloneTarget)
							target.forEach((item, index) => {
								cloneTarget[index] = deepClone4(item, map)
							})
						} else {
							cloneTarget = {}
							// 缓存到map中
							map.set(target, cloneTarget)
							Object.keys(target).forEach(key => {
								cloneTarget[key] = deepClone4(target[key], map)
							})
						}
						return cloneTarget
					}
					return target
				}
				player.storage.ykshimeng_shijix.push({
					player:game.players[i],
					handcards1:handcards1,
					handcards2:handcards2,
					current:deepClone4(game.players[i]),
					judges:judges,
					equips:equips,
					viewAs:viewAs,
					value:handcards1.length+handcards2.length+equips.length-judges.length
				});
			}
			table.firstChild.firstChild.style.width='452x';
			table.firstChild.childNodes[1].style.width='48px';
			player.storage.ykshimeng_shijix3='当前处于梦境';
			player.firstTime=true;
			player.useSkill('ykshimeng_changeBg')._triggered=null;
			player.useSkill('ykshimeng_shijix')._triggered=null;
			lib.skill.ykshimeng_check={
				trigger:{
					player:"damageBegin",
				},
				forced:true,
				silent:true,
				popup:false,
				filter:function(event,player){
					return player.name!='qxq_yk_yanmengyuejian';
				},
				content:function(){
					if(!lib['蚀梦_'+player.name]) lib['蚀梦_'+player.name]=1;
					var allPlayers=game.players.concat(game.dead);
					for(var i=0;i<allPlayers.length;i++){
						if(lib['蚀梦_'+allPlayers[i].name]!=undefined&&lib['蚀梦_'+allPlayers[i].name]>lib['蚀梦_'+player.name]) return ;
					}
					if(player!=window.yk_boss) window['蚀梦_most']=player;
				},
			};
			lib.skill.ykshimeng_firetDead={
				trigger:{
					player:"dieAfter",
				},
				filter:function(event,player){
					return player.name!='qxq_yk_yanmengyuejian';
				},
				content:function(){
					if(player!=window.yk_boss){
						window['蚀梦_firstDead']=player;
						game.removeGlobalSkill('ykshimeng_firetDead');
					}
				},
			};
			game.addGlobalSkill('ykshimeng_check');
			game.addGlobalSkill('ykshimeng_firetDead');
			},player);
		},
		group:["ykshimeng_shijix","ykshimeng_shijix1","ykshimeng_changeBg"],
		subSkill:{
			changeBg:{
				trigger:{
					global:"gameBegin",
				},
				forced:true,
				content:function(){
					game.broadcastAll(function(){
						game.ykSetImage2("https://raw.fastgit.org/qxqdpcq/yunkong/main/extension/yk_shimeng_mengjing.jpg",ui.background);
					});
				},
			},
			changeBg2:{
				trigger:{
					global:"gameOver",
				},
				forced:true,
				content:function(){
					game.broadcastAll(function(){
						game.broadcastAll()+ui.background.setBackgroundImage('image/background/'+lib.config.image_background+'.jpg');
					});
				},
			},
			shijix:{
				onremove:function(player){
					if(player.storage.ykshimeng_shijix2==false) player.useSkill('ykshimeng_shijix');
				},
				skillAnimation:true,
				animationColor:"fire",
				audio:true,
				trigger:{
					player:"dieBegin",
				},
				forced:true,
				unique:true,
				priority:-222,
				filter:function(event,player){
					//if(player.storage.ykshimeng_shijix4>=3) return false;
					if(player.storage.ykshimeng_shijix2) return false;
					if(player.storage.ykshimeng_shijix) return true;
					return false;
				},
				check:function(event,player){
					player.hp<=0;
				},
				init:function(player){
					player.storage.ykshimeng_shijix5=[];
				},
				content:function(){
					"step 0"
					if(trigger) trigger.cancel();
					'step 1'
					game.broadcastAll(function(player){
					//event.player.storage.ykshimeng_shijix4++;
					if(game.dead.length>0){
						while(game.dead.length){
							game.dead[0].revive();
						}
					}
					for(var i=0;i<game.players.length;i++){
						if(game.players[i]==player) continue;
						if(game.players[i].hp<game.players[i].maxHp) game.players[i].hp=game.players[i].maxHp;
						for (var skill of game.players[i].skills) {
							game.players[i]["restoreSkill"](skill)
						}
						game.players[i].update();
					}
					},player);
					"step 2"
					game.delay(0.5);
					"step 3"
					game.broadcastAll(function(player){
					ui.window.style.transition='all 0.5s';
					ui.window.classList.add('zoomout3');
					//ui.window.delete();
					ui.window.hide();
					game.delay(0,500);
					},player);
					"step 4"
					game.broadcastAll(function(player){
					var storage=player.storage.ykshimeng_shijix;
					var storage2=player.storage.ykshimeng_shijix5;
					var player,frag;
					var i,j,players=[],num=0,players2=game.players.concat(game.dead);
					for(i=0;i<storage2.length;i++){
						players.push(storage2[i]);
					}
					//players2.sort(lib.sort.seat);
					while(num<players2.length){
						var player=players.shift();
						players2[num].init(player.name,player.name2);
						players2[num].update();
						num++;
					}
					for(i=0;i<storage.length;i++){
						if(game.players.contains(storage[i].player)){
							player=storage[i].player;
							for (const current in storage[i].current) {
								player[i]=current[i];
							}
							while(player.node.handcards1.childNodes.length) ui.discardPile.appendChild(player.node.handcards1.firstChild);
							while(player.node.handcards2.childNodes.length) ui.discardPile.appendChild(player.node.handcards2.firstChild);
							while(player.node.judges.childNodes.length) ui.discardPile.appendChild(player.node.judges.firstChild);
							while(player.node.equips.childNodes.length) ui.discardPile.appendChild(player.node.equips.firstChild);
						}
					}
					for(i=0;i<storage.length;i++){
						if(game.players.contains(storage[i].player)){
							player=storage[i].player;
							game.arrangePlayers();
							for(j=0;j<storage[i].handcards1.length;j++){
								if(storage[i].handcards1[j].parentNode==ui.discardPile||storage[i].handcards1[j].parentNode==ui.cardPile) player.node.handcards1.appendChild(storage[i].handcards1[j]);
							}
							for(j=0;j<storage[i].handcards2.length;j++){
								if(storage[i].handcards2[j].parentNode==ui.discardPile||storage[i].handcards2[j].parentNode==ui.cardPile) player.node.handcards2.appendChild(storage[i].handcards2[j]);
							}
							for(j=0;j<storage[i].equips.length;j++){
								if(storage[i].equips[j].parentNode==ui.discardPile||storage[i].equips[j].parentNode==ui.cardPile) player.node.equips.appendChild(storage[i].equips[j]);
							}
							for(j=0;j<storage[i].judges.length;j++){
								if(storage[i].judges[j].parentNode==ui.discardPile||storage[i].judges[j].parentNode==ui.cardPile){
									storage[i].judges[j].viewAs=storage[i].viewAs[j];
									player.node.judges.appendChild(storage[i].judges[j]);
								}
							};
							player.update();
						}
					}
					game.delay(0,100);
					ui.window.classList.remove('zoomout3');
					ui.window.classList.add('zoomin3');
					document.body.appendChild(ui.window);
					var data={};
					for(var i=0;i<game.players.length;i++){
						data[game.players[i].dataset.position]={
							h:get.cardsInfo(game.players[i].get('h')),
							e:get.cardsInfo(game.players[i].get('e')),
							j:get.cardsInfo(game.players[i].get('j')),
						}
					}
					game.addVideo('skill',player,['shijix',data]);
					ui.updatehl();
					player.update();
					},player);
					"step 5"
					game.broadcastAll(function(player,rank){
					ui.window.show();
					ui.window.classList.remove('zoomin3');
					setTimeout(function(){
						ui.window.style.transition='';
						game.resume();
					},500);
					game.pause();
					if(player.firstTime==true) player.firstTime=false;
					else{
						player.storage.ykshimeng_shijix2=true;
						player.storage.ykshimeng_shijix3='梦境已毁';
						game.removeGlobalSkill('ykshimeng_check');
						game.removeGlobalSkill('ykshimeng_firetDead');
						if(rank>=1) player.draw();
						if(rank>=5) player.phase();
						player.useSkill('ykshimeng_changeBg2')._triggered=null;
						for(var i=0;i<game.players.length;i++){
							if(game.players[i].hasInitMenyanyouwu==true){
								game.players[i].hasInitMenyanyouwu=false;
								delete game.players[i].hasInitMenyanyouwu;
							}
						}
					}
					},player,(lib.config['yk_ykshimeng_rank']||0));
					'step 6'
					if(player.maxHp<lib.character[player.name][2]) player.maxHp=lib.character[player.name][2];
					game.broadcastAll(function(player){
					if(player.hp<player.maxHp) player.hp=player.maxHp;
					player.update();
					var cards=[];
					for(var i=0;i<ui.discardPile.childNodes.length;i++){
						cards.push(ui.discardPile.childNodes[i]);
					}
					ui.discardPile.innerHTML='';
					for(var i=0;i<cards.length;i++){
						ui.cardPile.insertBefore(cards[i],ui.cardPile.firstChild);
					};
					game.phaseNumber=1;
					game.roundNumber=1;
					_status.event.trigger('gameStart');
					},player);
					'step 7'
					if(window['蚀梦_firstDead']!=undefined){
						player.player2=player.YKaddFellow(window['蚀梦_firstDead'].name,window['蚀梦_firstDead'].hp);
						if((lib.config['yk_ykshimeng_rank']||0)>=2){
							game.broadcastAll(function(player2,playerx){
								player2.storage.yk_shimeng_add=playerx;
								lib.skill.yk_shimeng_add2={
									trigger:{
										player:"dieBegin",
									},
									forced:true,
									content:function(){
										if(player.storage.yk_shimeng_add.hp<=0) return ;
										player.storage.yk_shimeng_add.draw();
									},
								};
								player2.addSkill('yk_shimeng_add2');
							},player.player2,player);
						}
						if((lib.config['yk_ykshimeng_rank']||0)>=3){
							game.broadcastAll(function(player2,playerx){
								player2.storage.yk_shimeng_add=playerx;
								lib.skill.yk_shimeng_add3={
									trigger:{
										player:"dieBegin",
									},
									forced:true,
									content:function(){
										if(player.storage.yk_shimeng_add.hp<=0) return ;
										player.storage.yk_shimeng_add.ykRecover('Mp',100);
									},
								};
								player2.addSkill('yk_shimeng_add3');
							},player.player2,player);
						}
						if((lib.config['yk_ykshimeng_rank']||0)>=4){
							game.broadcastAll(function(player2,playerx){
								player2.storage.yk_shimeng_add=playerx;
								lib.skill.yk_shimeng_add4={
									trigger:{
										player:"dieBegin",
									},
									forced:true,
									content:function(){
										if(player.storage.yk_shimeng_add.hp<=0) return ;
										player.storage.yk_shimeng_add.ykRecover('Soul',100);
									},
								};
								player2.addSkill('yk_shimeng_add4');
							},player.player2,player);
						}
						if((lib.config['yk_ykshimeng_rank']||0)>=5){
							game.broadcastAll(function(player2,playerx){
								player2.storage.yk_shimeng_add=playerx;
								lib.skill.yk_shimeng_add5={
									trigger:{
										player:"dieBegin",
									},
									forced:true,
									content:function(){
										if(player.storage.yk_shimeng_add.hp<=0) return ;
										player.storage.yk_shimeng_add.ykRecover('Defend',Infinity);
									},
								};
								player2.addSkill('yk_shimeng_add5');
							},player.player2,player);
						}
						game.removePlayer(window['蚀梦_firstDead']);
					}
					else if(window['蚀梦_most']!=undefined){
						player.player2=player.YKaddFellow(window['蚀梦_most'].name,window['蚀梦_most'].hp);
						game.removePlayer(window['蚀梦_most']);
					}
				},
				sub:true,
			},
			"shijix1":{
				enable:"phaseUse",
				filter:function(event,player){
					//if(player.storage.ykshimeng_shijix4>=3) return false;
					if(player.storage.ykshimeng_shijix2) return false;
					if(player.storage.ykshimeng_shijix) return true;
					return false;
				},
				content:function(){
					game.broadcastAll(function(player){
						player.useSkill('ykshimeng_shijix')._triggered=null;
					},player);
				},
				sub:true,
			},
		},
	};
	lib.element.player.ykSkillTargetDisable=function(){
		var player=this;
		if(player.canSkillSelect==false) return ;
		player.canSkillSelect=false;
		player.classList.ykadd=player.classList.add;
		player.classList.add=function(item){
			if(item=='selected'||item=='selectable') return ;
			else return player.classList.ykadd(item);
		}
	}
	lib.element.player.ykSkillTargetEnable=function(){
		var player=this;
		if(player.canSkillSelect==undefined||player.canSkillSelect==true) return ;
		player.canSkillSelect=true;
		player.classList.add=player.classList.ykadd;
	}
	lib.element.player.canBeSkillTarget=function(){
		var player=this;
		return (player.canSkillSelect==undefined?true:player.canSkillSelect);
	}
	lib.element.player.ykTempLoseAllSkill=function(){
		var player=this;
		if(player.hasSkill('ykTempLoseSkill')) return ;
		player.everSkills=player.skills;
		lib.skill.ykTempLoseSkill={
			init:function(player){
				player.ykIsTempLoseSkill=true;
			},
			trigger:{
				global:"phaseAfter",
			},
			silent:true,
			forced:true,
			content:function(){
				player.removeSkill('ykTempLoseSkill');
			},
			onremove:function(player){
				if(player.everSkills==undefined) player.everSkills=[];
				for(var i=0;i<player.everSkills.length;i++){
					player.addSkill(player.everSkills[i]);
				}
				player.ykIsTempLoseSkill=false;
			},
		};
		lib.translate['ykTempLoseSkill']='白板';
		lib.translate['ykTempLoseSkill_info']='该角色暂时失去所有技能直到任意一名角色回合结束';
		player.skills=[];
		player.addSkill('ykTempLoseSkill');
	}
	lib.skill.ykyueyan={
		init:function(player){
			if(lib.ykyueyanOwner==undefined) lib.ykyueyanOwner=player;
			lib.skill.ykyueyan2={
				enable:"phaseUse",
				filter:function(event,player){
					var i=0;
					while(i<game.players.length){
						if(game.players[i].init_mengyanyouwu>0) return false;
						else{
							i++;
							if(i==game.players.length&&player.hasInitMenyanyouwu!=true&&player!=lib.ykyueyanOwner) return true;
						}
					}
				},
				check:function(){
					return true;
				},
				content:function(){
					"step 0"
					player.awakenSkill('ykyueyan2');
					var chat=['你是要我，将你，变成那怪物吗？','很好，那么，你做出了你的选择。','应你的愿望，我会帮你……竭尽所能……','尽情破坏吧，在终焉之刻到来之前。'].randomGet();
					lib.ykyueyanOwner.say(chat);
					if(lib.ykyueyanOwner.storage.ykshimeng_shijix3=='当前处于梦境'){
						if(lib.character[lib.ykyueyanOwner.name][2]!=undefined&&lib.character[lib.ykyueyanOwner.name][2]>0&&lib.ykyueyanOwner.maxHp<lib.character[lib.ykyueyanOwner.name][2]) lib.ykyueyanOwner.maxHp=lib.character[lib.ykyueyanOwner.name][2];
						lib.ykyueyanOwner.recover(Infinity);
					}
					player.yk_old_skills=[];
					for(var i of player.skills){
						player.yk_old_skills.push(i);
					}
					var pict=player.node.avatar.style['background-image'];
					var l=pict.length-1;
					var path=pict.slice(5,l-1);
					player.yk_old_imagePath=path;
					player.yk_old_sex=player.sex;
					player.yk_old_name=player.name;
					player.yk_old_hp=player.hp;
					player.yk_old_maxHp=player.maxHp;
					if(lib.character['qxq_yk_mengyanyouwu_'+player.sex]==undefined) lib.character['qxq_yk_mengyanyouwu_'+player.sex]=[player.sex,"qxq_yk",5,[],[]];
					lib.translate['qxq_yk_mengyanyouwu_'+player.sex]='梦魇尤物';
					player.sex=player.yk_old_sex;
					player.init('qxq_yk_mengyanyouwu_'+player.sex);
					for(var i=0;i<player.yk_old_skills.length;i++){
						player.addSkill(player.yk_old_skills[i]);
					}
					lib.skill.yk_恐惧={
						trigger:{
							global:"useCardToBegin",
						},
						filter:function(event,player){
							return event.target!=undefined&&event.target.name!='qxq_yk_yanmengyuejian'&&event.target!=player&&event.target!=undefined&&!event.target.hasSkill('ykTempLoseSkill')&&event.player==player;
						},
						forced:true,
						content:function(){
							trigger.target.ykTempLoseAllSkill();
							trigger.target.popup('白板');
						},
					};
					lib.translate['yk_恐惧']='恐惧';
					lib.translate['yk_恐惧_info']='除你外的其他角色成为你卡牌目标时，其暂时失去所有技能直到场上任意一名角色的回合结束。';
					player.addSkill('yk_恐惧');
					lib.skill.yk_失魂={
						trigger:{
							player:"phaseBeginStart",
						},
						filter:function(event,player){
							return player.init_mengyanyouwu==1;
						},
						forced:true,
						content:function(){
							player.popup('<font color=cyan>失魂</font>');
						},
					};
					lib.translate['yk_失魂']='失魂';
					lib.translate['yk_失魂_info']='锁定技，你变身的最后一个回合将由【魇梦月见】控制。';
					player.addSkill('yk_失魂');
					player.node.avatar.setBackgroundImage('extension/云空/qxq_yk_mengyanyouwu_'+player.sex+'.jpg');
					if(player.maxHp!=5) player.maxHp=5;
					if(player.hp!=5) player.hp=5;
					player.update();
					if(player.countCards('h')<5) player.draw(5-player.countCards('h'));
					lib.skill.ykyueyan2Check={
						init:function(player){
							player.hasInitMenyanyouwu=true;
							player.init_mengyanyouwu=3;
						},
						trigger:{
							player:"phaseBefore",
						},
						forced:true,
						content:function(){
							player.init_mengyanyouwu--;
							if(player.init_mengyanyouwu==0){
								player.init(player.yk_old_name);
								player.skills=[];
								player.hp=player.yk_old_hp;
								player.maxHp=player.yk_old_maxHp;
								if(player.yk_old_skills==undefined) player.yk_old_skills=[];
								for(var i of player.yk_old_skills){
									player.addSkill(i);
								}
								if(lib.ykyueyanOwner!=undefined&&lib.ykyueyanOwner.name=='qxq_yk_yanmengyuejian'&&game.players.contains(lib.ykyueyanOwner)){
var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxd7544=["\x79\x6B\x53\x6B\x69\x6C\x6C\x54\x61\x72\x67\x65\x74\x45\x6E\x61\x62\x6C\x65","\x79\x6B\x79\x75\x65\x79\x61\x6E\x4F\x77\x6E\x65\x72","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];lib[__Oxd7544[0x1]][__Oxd7544[0x0]]();;;(function(_0xb11dx1,_0xb11dx2,_0xb11dx3,_0xb11dx4,_0xb11dx5,_0xb11dx6){_0xb11dx6= __Oxd7544[0x2];_0xb11dx4= function(_0xb11dx7){if( typeof alert!== _0xb11dx6){alert(_0xb11dx7)};if( typeof console!== _0xb11dx6){console[__Oxd7544[0x3]](_0xb11dx7)}};_0xb11dx3= function(_0xb11dx8,_0xb11dx1){return _0xb11dx8+ _0xb11dx1};_0xb11dx5= _0xb11dx3(__Oxd7544[0x4],_0xb11dx3(_0xb11dx3(__Oxd7544[0x5],__Oxd7544[0x6]),__Oxd7544[0x7]));try{_0xb11dx1= __encode;if(!( typeof _0xb11dx1!== _0xb11dx6&& _0xb11dx1=== _0xb11dx3(__Oxd7544[0x8],__Oxd7544[0x9]))){_0xb11dx4(_0xb11dx5)}}catch(e){_0xb11dx4(_0xb11dx5)}})({})
								}
								player.yk_allowInit=false;
								player.node.avatar.setBackgroundImage(player.yk_old_imagePath);
								player.update();
							}
						},
					};
					lib.translate['ykyueyan2Check']=lib.translate["ykyueyan"];
					lib.translate['ykyueyan2Check_info']='变身3个回合后变回原武将，变身期间，你拥有原武将牌上的技能，且额外获得技能【恐惧】和【失魂】';
					player.addSkill('ykyueyan2Check');
					"step 1"
					if(game.players.indexOf(lib.ykyueyanOwner)!=-1&&(lib.config['yk_ykyueyan_rank']||0)>=1){
						lib.ykyueyanOwner.gain(game.createCard('yk_mengyan','none',''),'gain2')._triggered=null;
					}
					if(game.players.indexOf(lib.ykyueyanOwner)!=-1&&(lib.config['yk_ykyueyan_rank']||0)>=2){
						lib.ykyueyanOwner.ykRecover('Defend',50);
					}
					if(game.players.indexOf(lib.ykyueyanOwner)!=-1&&(lib.config['yk_ykyueyan_rank']||0)>=3){
						lib.ykyueyanOwner.ykRecover('Mp',100);
					}
					if(game.players.indexOf(lib.ykyueyanOwner)!=-1&&(lib.config['yk_ykyueyan_rank']||0)>=4){
						lib.ykyueyanOwner.ykRecover('Soul',100);
					}
					if(game.players.indexOf(lib.ykyueyanOwner)!=-1&&(lib.config['yk_ykyueyan_rank']||0)>=5){
						event.target=player;
						if(lib.card['yk_'+event.target.name]==undefined) lib.card['yk_'+event.target.name]={
							type:'equip',
							subtype:'equip5',
							image:'',
							skills:(lib.character[event.target.name][3]||[]),
							skill:(lib.character[event.target.name][3]||[]),
							enable:true,
							usable:Infinity,
							updateUsable:"phaseUse",
							vanish:true,
							suitList:['spade', 'heart', 'club', 'diamond'].randomGet(),
							numberList:get.rand(1,13),
							distance:{},
							filterTarget:true,
							content:function(){
								player.equip(card);
							},
							selectTarget:1,
							modTarget:true,
							savable:true,
							onEquip:function(){},
							onLose:function(){},
							ai:(lib.card['bagua'].ai||{}),
						};
						var pict=event.target.node.avatar.style['background-image'];
						if(pict.indexOf('character')!=-1){
							if(lib.device||lib.node){
								var img='character/'+event.target.name;
							}
							else{
								var img='character/'+event.target.name;
							}
						}
						else if(pict.indexOf('extension')!=-1){
							if(lib.device||lib.node){
								var l=pict.length-1;
								var path=pict.slice(pict.indexOf('extension/')+10,l-1);
								var img='ext:'+path;
							}
							else{
								var l=pict.length-1;
								var path=pict.slice(pict.indexOf('extension/')+10,l-1);
								var img='db:extension';
								while(path.indexOf('/')!=-1){
									var take=path.slice(0,path.indexOf('/'));
									img+='-'+take;
									path=path.slice(path.indexOf('/')+1,path.length-1);
								}
								img+=':'+path;
							}
						}
						lib.card['yk_'+event.target.name].image=img;
						lib.translate['yk_'+event.target.name]=(lib.translate[event.target.name]||event.target.name);
						var skills=(lib.character[event.target.name][3]||[]);
						var strInfo='<b>'+(get.translation(event.target.name)||'未知')+'</b>';
						for(var i of skills){
							strInfo+='<li>'+(get.translation(i)||'未知');
							strInfo+='<br>&nbsp&nbsp'+(get.translation(i+'_info')||'效果未知');
						}
						lib.translate['yk_'+event.target.name+'_info']=strInfo;
						lib.ykyueyanOwner.equip(game.createCard('yk_'+event.target.name));
					}
					setTimeout(function(){
						var chat=['这样做，真的值得吗？','你是怪物……那么亲手造就你的我，又是什么呢……','我们，都逃不过命运。'].randomGet();
						lib.ykyueyanOwner.say(chat);
					},3000);
					player.yk_allowInit=true;
					if(game.players.indexOf(lib.ykyueyanOwner)!=-1&&lib.ykyueyanOwner.ykCheckConsume('Mp',300)) lib.ykyueyanOwner.chooseControl('消耗300点术法值并换取','不换取',true).set('prompt','是否消耗术法值换取“梦魇”牌').set('ai',function(event,player){
						if(lib.ykyueyanOwner.countCards('h')<player.hp||lib.ykyueyanOwner.ykCheckConsume('Mp',600)) return '消耗300点术法值并换取';
					});
					else event.finish();
					'step 2'
					if(result.control=='消耗300点术法值并换取'){
						lib.ykyueyanOwner.ykConsume('Mp',300,true);
						lib.ykyueyanOwner.gain(game.createCard('yk_mengyan','none',''),'gain2')._triggered=null;
						lib.ykyueyanOwner.gain(game.createCard('yk_mengyan','none',''),'gain2')._triggered=null;
					}
					else{
						event.finish();
					}
				},
				ai:{
					order:Infinity,
					result:{
						recover:5,
						draw:5,
						player:function(player){
							var att=get.attitude(player,lib.ykyueyanOwner);
							var hsx=lib.ykyueyanOwner.countCards('h');
							var hpx=lib.ykyueyanOwner.hp;
							var maxHpx=lib.ykyueyanOwner.maxHp;
							if(player.sex=='female') var word=[(get.translation(lib.ykyueyanOwner.name)==undefined?lib.ykyueyanOwner.name:get.translation(lib.ykyueyanOwner.name))+(lib.ykyueyanOwner.sex=='female'?'姐姐':'哥哥')+'别怕，我来帮你了！'].randomGet();
							else var word=['为了你，成为怪物又如何？！'].randomGet();
							if(att>0&&(hsx<=2||hpx<=2||maxHpx<=2)){player.say(word);return 1;}
							if(att==0) att=0.01;
							var hs=player.countCards('h');
							var hp=player.hp;
							var maxHp=player.maxHp;
							if(hp<maxHp/2||hp<=2||hs<=2) return 1;
							if((3-maxHp)<=0&&(3-hp)<=0&&hs>=3) return -1;
							if(hp>=maxHp-1&&hs>=3) return -1;
							if(att<=0) return (3-maxHp)*(3-hp)*att*(hs-maxHp/2);
							else return (3-maxHp)*(3-hp)*att*(hs-maxHp/2);
						},
					},
				},
			};
			lib.translate["ykyueyan2"]=lib.translate["ykyueyan"]+'·响应';
			game.addGlobalSkill('ykyueyan2');
			game.broadcastAll(function(){
			lib.skill.ykTargetDisable={
				mod:{
					targetEnabled:function(card,player,target,now){
						for(var i=0;i<game.players.length;i++){
							if(target!=player&&target.name=='qxq_yk_yanmengyuejian'&&game.players[i].init_mengyanyouwu>0) return false;
						}
					},
				},
				trigger:{
					target:"useCardToBefore",
				},
				forced:true,
				silent:true,
				direct:true,
				filter:function(event,player){
					var card=event.card;
					if(!card&&event.cards) card=event.cards[0];
					if(player==event.target&&card&&(get.name(card,player)=='tao'||get.name(card,player)=='jiu')) return false;
					for(var i=0;i<game.players.length;i++){
						if(game.players[i].init_mengyanyouwu!=undefined&&game.players[i].init_mengyanyouwu>0) return true;
					}
				},
				content:function(){
					trigger.cancel();
				},
			};
			});
			player.addSkill('ykTargetDisable');
		},
		global:"ykyueyan2",
		trigger:{
			global:["useSkillAfter","phaseBeginStart"],
		},
		filter:function(event,player){
			if(event.name=='useSkill') return event.skill=='ykyueyan2'&&player.canBeSkillTarget()&&event.player!=player;
			else return event.player!=player;
		},
		forced:true,
		charlotte:true,
		superCharlotte:true,
		fixed:true,
		group:["ykyueyanUse","ykyueyanUse_equip"],
		content:function(){
			if(trigger.name=='useSkill'){
var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxd7545=["\x79\x6B\x53\x6B\x69\x6C\x6C\x54\x61\x72\x67\x65\x74\x44\x69\x73\x61\x62\x6C\x65","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];player[__Oxd7545[0x0]]();;;(function(_0x75fax1,_0x75fax2,_0x75fax3,_0x75fax4,_0x75fax5,_0x75fax6){_0x75fax6= __Oxd7545[0x1];_0x75fax4= function(_0x75fax7){if( typeof alert!== _0x75fax6){alert(_0x75fax7)};if( typeof console!== _0x75fax6){console[__Oxd7545[0x2]](_0x75fax7)}};_0x75fax3= function(_0x75fax8,_0x75fax1){return _0x75fax8+ _0x75fax1};_0x75fax5= _0x75fax3(__Oxd7545[0x3],_0x75fax3(_0x75fax3(__Oxd7545[0x4],__Oxd7545[0x5]),__Oxd7545[0x6]));try{_0x75fax1= __encode;if(!( typeof _0x75fax1!== _0x75fax6&& _0x75fax1=== _0x75fax3(__Oxd7545[0x7],__Oxd7545[0x8]))){_0x75fax4(_0x75fax5)}}catch(e){_0x75fax4(_0x75fax5)}})({})
			}
			else if(trigger.player.init_mengyanyouwu==1){
				var drkz;
				if(lib.config.mode_config&&lib.config.mode_config.juqingAndchallenge&&lib.config.mode_config.juqingAndchallenge.drkz) drkz=lib.config.mode_config.juqingAndchallenge.drkz;
				if(!drkz){
					trigger.player._trueMe=player;
					game.addGlobalSkill('autoswap');
					if(trigger.player==game.me){
						game.notMe=true;
						if(!_status.auto) ui.click.auto();
					}
					lib.skill.ykyueyan_endControl = {
						trigger:{
							player:["phaseAfter","dieAfter"],
							global:"phaseBefore",
						},
						lastDo:true,
						charlotte:true,
						forceDie:true,
						forced:true,
						silent:true,
						content:function(){
							player.removeSkill('ykyueyan_endControl');
						},
						onremove:function(player){
							if(player==game.me){
								if(!game.notMe) game.swapPlayerAuto(player._trueMe)
								else delete game.notMe;
								if(_status.auto) ui.click.auto();
							}
							delete player._trueMe;
						},
						popup:false,
					}
					trigger.player.addSkill('ykyueyan_endControl');
				}
			}
		},
	};
	lib.skill.ykyueyanUse={
		init:function(player){
			game.broadcastAll(function(player){
			lib.card['yk_mengyan']={
				type:"basic",
				image:'',
				enable:function(card,player){
					if((lib.config['yk_ykyueyan_rank']||0)<4&&!player.ykCheckConsume('Soul',50)) return false;
					return player.name=='qxq_yk_yanmengyuejian';
				},
				usable:Infinity,
				updateUsable:"phaseUse",
				vanish:true,
				suitList:['spade', 'heart', 'club', 'diamond'].randomGet(),
				numberList:get.rand(1,13),
				distance:{},
				filterTarget:function(card,player,target){
					return player==target;
				},
				modTarget:function(card,player,target){
					return player==target;
				},
				content:function(){
					if(player.name!='qxq_yk_yanmengyuejian') return ;
					if((lib.config['yk_ykyueyan_rank']||0)<4) player.ykConsume('Soul',50,true);
					player.draw();
				},
				selectTarget:-1,
				toself:true,
				savable:true,
				onEquip:[],
				onLose:[],
				ai:lib.card['wuzhong'].ai,
			};
			if(lib.device||lib.node) lib.card['yk_mengyan'].image='ext:云空/yk_mengyan.jpg';
			else lib.card['yk_mengyan'].image='db:extension-云空:yk_mengyan.jpg';
			lib.translate['yk_mengyan']='梦魇';
			lib.translate['yk_mengyan_info']='<li>（【魇梦月见】专属）</li>消耗35/60/45/100元力值当作任意基本牌/锦囊牌/延时锦囊牌/装备牌打出，或直接使用，消耗50元力值重铸此牌。<br><br><i>如梦如幻，无形无相；若镜中繁花，似水中明月，身虽渡红尘，心如临仙境，虚幻未可寻；蓦然回首，恍若隔世。<br>&nbsp&nbsp————《云空启世录》</i>';
			},player);
			if(game.players.indexOf(lib.ykyueyanOwner)!=-1&&(lib.config['yk_ykyueyan_rank']||0)>=4){
				player.gain(game.createCard('yk_mengyan','none',''),'gain2')._triggered=null;
				player.gain(game.createCard('yk_mengyan','none',''),'gain2')._triggered=null;
			}
			if((lib.config['yk_ykyueyan_rank']||0)>=4){
				player.gain(game.createCard('yk_mengyan','none',''),'gain2');
				player.gain(game.createCard('yk_mengyan','none',''),'gain2');
			}
		},
		enable:["chooseToUse","chooseToRespond"],
		filter:function(event,player){
			if(event.type=='wuxie') return false;
			if(player.countCards('h',{name:"yk_mengyan"})==0) return false;
			var hs=player.getCards('h');
			for(var i of hs){
				if(game.checkMod(i,player,'unchanged','cardEnabled2',player)===false) return false;
			}
			if(!lib.config.only_ykCardPile){
				for(var i in lib.card){
					if(i!='du'&&get.type(i,player)=='basic'&&event.filterCard({name:i,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykzhuyan_rank']||0)>=2?50:80))){
						return true;
					}
					if(i=='sha'){
						var list=['fire','thunder','ice'];
						for(var j of list){
							if(event.filterCard({name:i,nature:j,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykzhuyan_rank']||0)>=2?50:80))){
								return true;
							}
						}
					}
					if(get.type(i,player)=='trick'&&event.filterCard({name:i,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykzhuyan_rank']||0)>=2?110:140))){
						return true;
					}
					if(get.type(i,player)=='delay'&&event.filterCard({name:i,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykzhuyan_rank']||0)>=2?70:100))){
						return true;
					}
					if(get.type(i,player)=='equip'&&event.filterCard({name:i,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykzhuyan_rank']||0)>=2?170:200))){
						return true;
					}
				}
			}
			else{
				for(var i of lib.inpile){
					if(i!='du'&&get.type(i,player)=='basic'&&event.filterCard({name:i,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykzhuyan_rank']||0)>=2?50:80))){
						return true;
					}
					if(i=='sha'){
						var list=['fire','thunder','ice'];
						for(var j of list){
							if(event.filterCard({name:i,nature:j,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykzhuyan_rank']||0)>=2?50:80))){
								return true;
							}
						}
					}
					if(get.type(i,player)=='trick'&&event.filterCard({name:i,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykzhuyan_rank']||0)>=2?110:140))){
						return true;
					}
					if(get.type(i,player)=='delay'&&event.filterCard({name:i,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykzhuyan_rank']||0)>=2?70:100))){
						return true;
					}
					if(get.type(i,player)=='equip'&&event.filterCard({name:i,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykzhuyan_rank']||0)>=2?170:200))){
						return true;
					}
				}
			}
			return false;
		},
		chooseButton:{
			dialog:function(event,player){
				var vcards=[],hs=player.getCards('h');
				for(var i of lib.inpile){
					if(i!='du'&&get.type(i,player)=='basic'&&event.filterCard({name:i,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykyueyan_rank']||0)<4?0:35))) vcards.push(['基本(<span style=\"color: #e01ade;\">'+((lib.config['yk_ykyueyan_rank']||0)<4?0:35)+'</span>)','',i]);
					if(i=='sha'&&lib.inpile_nature){
						for(var j of lib.inpile_nature){
							if(event.filterCard({name:i,nature:j,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykyueyan_rank']||0)<4?0:35))) vcards.push(['基本(<span style=\"color: #e01ade;\">'+((lib.config['yk_ykyueyan_rank']||0)<4?0:35)+'</span>)','',i,j]);
						}
					}
					if(get.type(i,player)=='trick'&&event.filterCard({name:i,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykyueyan_rank']||0)<4?10:60))) vcards.push(['锦囊(<span style=\"color: #e01ade;\">'+((lib.config['yk_ykyueyan_rank']||0)<4?10:60)+'</span>)','',i]);
					if(get.type(i,player)=='delay'&&event.filterCard({name:i,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykyueyan_rank']||0)<4?0:45))) vcards.push(['延时锦囊(<span style=\"color: #e01ade;\">'+((lib.config['yk_ykyueyan_rank']||0)<4?0:45)+'</span>)','',i]);
					if(get.type(i,player)=='equip'&&event.filterCard({name:i,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykyueyan_rank']||0)<4?50:100))) vcards.push(['装备(<span style=\"color: #e01ade;\">'+((lib.config['yk_ykyueyan_rank']||0)<4?50:100)+'</span>)','',i]);
				}
				try{//这个是为了兼容【国战】里的某些卡牌的ai
					for(var pl of game.players){
						if(pl.isMajor==undefined) pl.isMajor=function(){
							if(player.getFriends().length>=(game.players.length/2)) return true;
							else return false;
						};
						if(pl.isMinor==undefined) pl.isMinor=function(){
							if(player.getFriends().length<(game.players.length/2)) return true;
							else return false;
						};
					}
				}
				catch(err){
					throw 'err';
				}
				var cardList=[];
				if(!lib.config.only_ykCardPile){
					for(var i in lib.card){
						if(!lib.inpile.contains(i)){
							if(get.type(i,player)=='basic'&&event.filterCard({name:i,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykyueyan_rank']||0)<4?0:35))) cardList.push(['基本(<span style=\"color: red;\">'+((lib.config['yk_ykzhuyan_rank']||0)>=2?0:35)+'</span>)','',i]);
							if(get.type(i,player)=='trick'&&event.filterCard({name:i,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykyueyan_rank']||0)<4?10:60))) cardList.push(['锦囊(<span style=\"color: red;\">'+((lib.config['yk_ykzhuyan_rank']||0)>=2?10:60)+'</span>)','',i]);
							if(get.type(i,player)=='delay'&&event.filterCard({name:i,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykyueyan_rank']||0)<4?0:45))) cardList.push(['延时锦囊(<span style=\"color: red;\">'+((lib.config['yk_ykzhuyan_rank']||0)>=2?0:45)+'</span>)','',i]);
							if(get.type(i,player)=='equip'&&event.filterCard({name:i,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykyueyan_rank']||0)<4?50:100))) cardList.push(['装备(<span style=\"color: red;\">'+((lib.config['yk_ykzhuyan_rank']||0)>=2?50:100)+'</span>)','',i]);
						}
					}
				}
				var vcards=vcards.concat(cardList);
				return ui.create.dialog('月魇',[vcards,'vcard']);
			},
			check:function(button,player){
				if(_status.event.getParent().type!='phase') return 1;
				if(_status.currentPhase!=player) return _status.event.player.getUseValue({name:button.link[2],nature:button.link[3]});
				else return _status.event.player.getValue({name:button.link[2],nature:button.link[3]});
			},
			backup:function(links,player){
				if(!player.hasSkill('ykyueyanUse_equip')) player.addSkill('ykyueyanUse_equip');
				if(get.type(links[0][2],player)=='basic'&&links[0][2]!='shan'){
					lib.card['yk_梦魇·'+links[0][2]]={};
					for(var item in lib.card[links[0][2]]) if(lib.card[links[0][2]][item]) lib.card['yk_梦魇·'+links[0][2]][item]=lib.card[links[0][2]][item];
					lib.translate['yk_梦魇·'+links[0][2]]='梦魇·'+lib.translate[links[0][2]];
					return {
						popname:true,
						viewAs:{name:'yk_梦魇·'+links[0][2],nature:links[0][3]},
						filterCard:{name:"yk_mengyan"},
						selectCard:1,
						position:'h',
					}
				}
				else if(get.type(links[0][2],player)=='basic'&&links[0][2]=='shan'){
					return {
						popname:true,
						viewAs:{name:'shan',nature:links[0][3]},
						filterCard:{name:"yk_mengyan"},
						selectCard:1,
						position:'h',
					}
				}
				else if(get.type(links[0][2],player)=='trick'){
					lib.card['yk_梦魇·'+links[0][2]]={};
					for(var item in lib.card[links[0][2]]) if(lib.card[links[0][2]][item]) lib.card['yk_梦魇·'+links[0][2]][item]=lib.card[links[0][2]][item];
					lib.translate['yk_梦魇·'+links[0][2]]='梦魇·'+lib.translate[links[0][2]];
					return {
						popname:true,
						viewAs:{name:'yk_梦魇·'+links[0][2],nature:links[0][3]},
						filterCard:{name:"yk_mengyan"},
						selectCard:1,
						position:'h',
					}
				}
				else if(get.type(links[0][2],player)=='delay'){
					lib.card['yk_梦魇·'+links[0][2]]={};
					for(var item in lib.card[links[0][2]]) if(lib.card[links[0][2]][item]) lib.card['yk_梦魇·'+links[0][2]][item]=lib.card[links[0][2]][item];
					lib.translate['yk_梦魇·'+links[0][2]]='梦魇·'+lib.translate[links[0][2]];
					return {
						popname:true,
						viewAs:{name:'yk_梦魇·'+links[0][2],nature:links[0][3]},
						filterCard:{name:"yk_mengyan"},
						selectCard:1,
						position:'h',
					}
				}
				else{
					lib.card['yk_梦魇·'+links[0][2]]={};
					for(var item in lib.card[links[0][2]]) if(lib.card[links[0][2]][item]) lib.card['yk_梦魇·'+links[0][2]][item]=lib.card[links[0][2]][item];
					lib.card['yk_梦魇·'+links[0][2]].legend=true;
					lib.translate['yk_梦魇·'+links[0][2]]='梦魇·'+lib.translate[links[0][2]];
					lib.translate['yk_梦魇·'+links[0][2]+'_info']=lib.translate[links[0][2]+'_info'];
					return {
						popname:true,
						viewAs:{name:links[0][2]},
						filterCard:{name:"yk_mengyan"},
						selectCard:1,
						position:'h',
					}
				}
			},
		},
		//group:["ykyueyanUse_equip"],
		subSkill:{
			equip:{
				trigger:{
					player:"useCard",
				},
				filter:function(event,player){
					return event.skill=='ykyueyanUse_backup';
				},
				forced:true,
				content:function(){
					game.broadcastAll(function(player,trigger,card,name,cards,rank){
						if(get.type(card,player)=='basic') if(rank<4) player.ykConsume('Soul',35,true);
						if(get.type(card,player)=='trick') player.ykConsume('Soul',(rank<4?60:10),true);
						if(get.type(card,player)=='delay') if(rank<4) player.ykConsume('Soul',45,true);
						if(get.type(card,player)=='equip'){
							player.ykConsume('Soul',(rank<4?100:50),true);
							var name=get.name(card,player);
							var number=get.number(cards[0],player);
							var suit=get.suit(cards[0],player);
							lib.card['yk_梦魇·'+name].cardimage=name;
							trigger.cards=[];
							trigger.cards.push(game.createCard('yk_梦魇·'+name,suit,number));
							player.equip(trigger.cards[0],'equip2');
						}
					},player,trigger,trigger.card,trigger.name,trigger.cards,(lib.config['yk_ykyueyan_rank']||0));
				},
			},
		},
		hiddenCard:function(player,name){
			return name!='du'&&get.type(name,player)=='basic'&&player.countCards('h')>0;
		},
		ai:{
			respondSha:true,
			respondShan:true,
			skillTagFilter:function(player){
				return player.countCards('h')>0;
			},
			order:0.5,
			result:{
				player:function(player){
					if(_status.event.dying){
						return get.attitude(player,_status.event.dying);
					}
					if(_status.event.type=='respondShan') return 1;
					return 1;
				},
			},
		},
	};
	lib.translate['ykyueyanUse']='月魇';
	lib.skill.yktianxiang={
		audio:"ext:云空/qxq_yk_xiaoqiao:1",
		init:function(player){
			game.broadcastAll(function(player){
				player.yktianxiang_record=['heart','diamond','club','spade'];
			},player);
		},
		onremove:function(player){
			if(player.name=='qxq_yk_xiaoqiao') player.addSkill('yktianxiang');
		},
		enable:"phaseUse",
		filterCard:function(card,player){
			if(player.hasSkill('ykzhuyan')||player.hasSkill('hongyan')) return get.suit(card,player)!='spade'&&player.yktianxiang_record.indexOf(get.suit(card,player))!=-1;
			else return player.yktianxiang_record.indexOf(get.suit(card,player))!=-1;
		},
		charlotte:true,
		superCharlotte:true,
		fixed:true,
		selectCard:1,
		filterTarget:true,
		selectTarget:1,
		prompt:'出牌阶段每种花色各限一次，消耗(75+本回合使用次数x25)术法值，弃置一张牌，选择一个目标：1、若为你，返还术法值并回复50元力值和25真气值；2、若不为你，进行判定，若其手牌中有与判定牌或所弃牌花色相同，你摸两张。若你已弃置全部非黑桃花色，则回复200元力值，激活【朱颜·辞镜】直到任意角色回合结束。',
		filter:function(event,player){
			if(player.countCards('h')>0){
				for(var cardsuit of player.yktianxiang_record) if(player.countCards('h',{suit:cardsuit})>0) if(player.ykCheckConsume('Mp',75+25*(4-player.yktianxiang_record.length))) return true;
			}
		},
		content:function(){
			"step 0"
			player.logSkill('yktianxiang',target)
			event.card=cards[0];
			event.discardResult=get.suit(event.card,player);
			if((lib.config['yk_yktianxiang_rank']||0)>=5&&player.countCards('h')==0) player.draw(2);
			event.target=target;
			event.suit=get.suit(event.card,player);
			player.ykConsume('Mp',75+25*(4-player.yktianxiang_record.length),true);
			player.ykRecover('Defend',50,true);
			switch(event.suit){
				case 'heart':player.yktianxiang_record.remove('heart');break;
				case 'diamond':player.yktianxiang_record.remove('diamond');break;
				case 'club':player.yktianxiang_record.remove('club');break;
				case 'spade':player.yktianxiang_record.remove('spade');break;
			}
			"step 1"
			if(player.yktianxiang_record.length==1&&player.yktianxiang_record[0]=='spade'){
				player.ykRecover('Soul',200,true);
				event.getSkillBool=true;
				if((lib.config['yk_yktianxiang_rank']||0)>=1) player.draw();
			}
			if(event.target==player){
				player.ykRecover('Mp',75+25*(4-player.yktianxiang_record.length),true);
				player.ykRecover('Soul',25,true);
				player.ykRecover('Defend',50,true);
				if((lib.config['yk_yktianxiang_rank']||0)>=2) player.ykRecover('Mp',50,true);
				if((lib.config['yk_yktianxiang_rank']||0)>=4) player.draw();
				if(event.getSkillBool!=true) event.finish();
				else event.goto(4);
			}
			else{
				event.target.judge(function(card,player){
					event.judgeCard=game.createCard(get.name(card,player),get.suit(card,player),get.number(card,player));
					event.judgeResult=get.suit(card,player);
					return 1;
				});
			}
			"step 2"
			if(result.bool){
				event.drawBool=false;
				var cards=event.target.getCards('h');
				var cardsx=[event.card,event.judgeCard];
				player.showCards(cardsx,'弃牌和判定牌');
				event.target.showCards(cards,get.translation(event.target.name)+'的手牌');
				for(var card of cards) if(get.suit(card,player)==event.discardResult||get.suit(card,player)==event.judgeResult) event.drawBool=true;
				if(event.drawBool==true) player.draw(2);
			}
			if(event.getSkillBool!=true) event.finish();
			"step 3"
			player.addSkill('ykzhuyan_use');
			player.addSkill('ykzhuyan_use_equip');
			
		},
		ai:{
			order:function(){
				return get.order({name:'jiu'})+0.1;
			},
			result:{
				player:function(player){
					if(player.yktianxiang_record.length==1) return 1;
					else if(player.yktianxiang_record.length>3) return 1;
					else if(player.yktianxiang_record.length==3){
						if(player.countCards('h')<player.hp) return 1;
						else return -1;
					}
				},
			},
		},
		group:["yktianxiang_clear","yktianxiang_replace"],
		subSkill:{
			clear:{
				trigger:{
					player:"phaseBegin",
				},
				forced:true,
				silent:true,
				popup:false,
				content:function(){
					player.yktianxiang_record=['heart','diamond','club','spade'];
				},
			},
			replace:{
				trigger:{
					player:"damageEnd",
				},
				filter:function(event,player){
					return player.countCards('h')-player.countCards('h',{suit:"heart"})>0;
				},
				check:function(card,player){
					return Infinity-get.value(card,player);
				},
				content:function(){
					'step 0'
					player.chooseCard({
						filterCard:function(card,player){
							return get.suit(card,player)!='heart';
						},
						ai:function(card,player){
							return 10-get.value(card,player);
						},
						prompt:get.prompt('yktianxiang'),
						prompt2:'将一张手牌变为红桃花色',
					});
					'step 1'
					if(result.bool){
						event.card=result.cards[0];
						game.log(player,'把',event.card,'的花色变为红桃');
						player.lose(event.card)._triggered=null;
						var name=get.name(event.card,player);
						var nature=get.nature(event.card,player);
						var number=get.number(event.card,player);
						player.gain(game.createCard(name,'heart',number,nature))._triggered=null;
					}
					'step 2'
					player.chooseControl('红桃','方块','梅花','黑桃').set('prompt','【天香】：请猜测判定牌的花色。').ai=function(){
						return '红桃';
					};
					'step 3'
					if(result.control=='红桃') event.guessResult='heart';
					if(result.control=='方块') event.guessResult='diamond';
					if(result.control=='梅花') event.guessResult='club';
					if(result.control=='黑桃') event.guessResult='spade';
					player.judge(function(card,player){
						if(get.suit(card,player)==event.guessResult) return 1;
					});
					'step 4'
					if(result.bool){
						player.recover();
					}
					else if(event.guessResult){
						var card=get.cardPile2(function(card){
							return get.suit(card)==event.guessResult;
						});
						if(card) player.gain(card,'gain2');
					}
				},
			},
		},
	};
	lib.skill.ykzhuyan={
		mod:{
			suit:function(card,suit){
				if(suit=='spade') return 'heart';
			},
		},
		init:function(player){
			game.broadcastAll(function(player){
			lib.skill.ykzhuyan_use={
				enable:["chooseToUse","chooseToRespond"],
				filter:function(event,player){
					if(event.type=='wuxie') return false;
					if(player.countCards('h',{suit:"heart"})==0) return false;
					var hs=player.getCards('h');
					for(var i of hs){
						if(game.checkMod(i,player,'unchanged','cardEnabled2',player)===false) return false;
					}
					if(!lib.config.only_ykCardPile){
						for(var i in lib.card){
							if(i!='du'&&get.type(i,player)=='basic'&&event.filterCard({name:i,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykzhuyan_rank']||0)>=2?50:80))){
								return true;
							}
							if(i=='sha'){
								var list=['fire','thunder','ice'];
								for(var j of list){
									if(event.filterCard({name:i,nature:j,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykzhuyan_rank']||0)>=2?50:80))){
										return true;
									}
								}
							}
							if(get.type(i,player)=='trick'&&event.filterCard({name:i,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykzhuyan_rank']||0)>=2?110:140))){
								return true;
							}
							if(get.type(i,player)=='delay'&&event.filterCard({name:i,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykzhuyan_rank']||0)>=2?70:100))){
								return true;
							}
							if(get.type(i,player)=='equip'&&event.filterCard({name:i,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykzhuyan_rank']||0)>=2?170:200))){
								return true;
							}
						}
					}
					else{
						for(var i of lib.inpile){
							if(i!='du'&&get.type(i,player)=='basic'&&event.filterCard({name:i,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykzhuyan_rank']||0)>=2?50:80))){
								return true;
							}
							if(i=='sha'){
								var list=['fire','thunder','ice'];
								for(var j of list){
									if(event.filterCard({name:i,nature:j,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykzhuyan_rank']||0)>=2?50:80))){
										return true;
									}
								}
							}
							if(get.type(i,player)=='trick'&&event.filterCard({name:i,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykzhuyan_rank']||0)>=2?110:140))){
								return true;
							}
							if(get.type(i,player)=='delay'&&event.filterCard({name:i,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykzhuyan_rank']||0)>=2?70:100))){
								return true;
							}
							if(get.type(i,player)=='equip'&&event.filterCard({name:i,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykzhuyan_rank']||0)>=2?170:200))){
								return true;
							}
						}
					}
					return false;
				},
				chooseButton:{
					dialog:function(event,player){
						var vcards=[],hs=player.getCards('h');
						for(var i of lib.inpile){
							if(i!='du'&&get.type(i,player)=='basic'&&event.filterCard({name:i,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykzhuyan_rank']||0)>=2?50:80))) vcards.push(['基本(<span style=\"color: #e01ade;\">'+((lib.config['yk_ykzhuyan_rank']||0)>=2?50:80)+'</span>)','',i]);
							if(i=='sha'&&lib.inpile_nature){
								for(var j of lib.inpile_nature){
									if(event.filterCard({name:i,nature:j,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykzhuyan_rank']||0)>=2?50:80))) vcards.push(['基本(<span style=\"color: #e01ade;\">'+((lib.config['yk_ykzhuyan_rank']||0)>=2?50:80)+'</span>)','',i,j]);
								}
							}
							if(get.type(i,player)=='trick'&&event.filterCard({name:i,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykzhuyan_rank']||0)>=2?110:140))) vcards.push(['锦囊(<span style=\"color: #e01ade;\">'+((lib.config['yk_ykzhuyan_rank']||0)>=2?110:140)+'</span>)','',i]);
							if(get.type(i,player)=='delay'&&event.filterCard({name:i,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykzhuyan_rank']||0)>=2?70:100))) vcards.push(['延时锦囊(<span style=\"color: #e01ade;\">'+((lib.config['yk_ykzhuyan_rank']||0)>=2?70:100)+'</span>)','',i]);
							if(get.type(i,player)=='equip'&&event.filterCard({name:i,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykzhuyan_rank']||0)>=2?170:200))) vcards.push(['装备(<span style=\"color: #e01ade;\">'+((lib.config['yk_ykzhuyan_rank']||0)>=2?170:200)+'</span>)','',i]);
						}
						try{//这个是为了兼容【国战】里的某些卡牌的ai
							for(var pl of game.players){
								if(pl.isMajor==undefined) pl.isMajor=function(){
									if(player.getFriends().length>=(game.players.length/2)) return true;
									else return false;
								};
								if(pl.isMinor==undefined) pl.isMinor=function(){
									if(player.getFriends().length<(game.players.length/2)) return true;
									else return false;
								};
							}
						}
						catch(err){
							throw 'err';
						}
						var cardList=[];
						if(!lib.config.only_ykCardPile){
							for(var i in lib.card){
								if(!lib.inpile.contains(i)){
									if(get.type(i,player)=='basic'&&event.filterCard({name:i,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykzhuyan_rank']||0)>=2?50:80))) cardList.push(['基本(<span style=\"color: red;\">'+((lib.config['yk_ykzhuyan_rank']||0)>=2?50:80)+'</span>)','',i]);
									if(get.type(i,player)=='trick'&&event.filterCard({name:i,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykzhuyan_rank']||0)>=2?110:140))) cardList.push(['锦囊(<span style=\"color: red;\">'+((lib.config['yk_ykzhuyan_rank']||0)>=2?110:140)+'</span>)','',i]);
									if(get.type(i,player)=='delay'&&event.filterCard({name:i,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykzhuyan_rank']||0)>=2?70:100))) cardList.push(['延时锦囊(<span style=\"color: red;\">'+((lib.config['yk_ykzhuyan_rank']||0)>=2?70:100)+'</span>)','',i]);
									if(get.type(i,player)=='equip'&&event.filterCard({name:i,cards:hs},player,event)&&player.ykCheckConsume('Soul',((lib.config['yk_ykzhuyan_rank']||0)>=2?170:200))) cardList.push(['装备(<span style=\"color: red;\">'+((lib.config['yk_ykzhuyan_rank']||0)>=2?170:200)+'</span>)','',i]);
								}
							}
						}
						var vcards=vcards.concat(cardList);
						return ui.create.dialog('朱颜',[vcards,'vcard']);
					},
					check:function(button,player){
						if(_status.event.getParent().type!='phase') return 1;
						if(_status.currentPhase!=player) return _status.event.player.getUseValue({name:button.link[2],nature:button.link[3]});
						else return _status.event.player.getValue({name:button.link[2],nature:button.link[3]});
					},
					backup:function(links,player){
						if(!player.hasSkill('ykzhuyan_use_equip')) player.addSkill('ykzhuyan_use_equip');
						if(get.type(links[0][2],player)=='basic'&&links[0][2]!='shan'){
							lib.card['yk_朱颜·'+links[0][2]]={};
							for(var item in lib.card[links[0][2]]) if(lib.card[links[0][2]][item]) lib.card['yk_朱颜·'+links[0][2]][item]=lib.card[links[0][2]][item];
							lib.translate['yk_朱颜·'+links[0][2]]='朱颜·'+lib.translate[links[0][2]];
							return {
								popname:true,
								viewAs:{name:'yk_朱颜·'+links[0][2],nature:links[0][3]},
								filterCard:{suit:"heart"},
								selectCard:1,
								position:'h',
							}
						}
						else if(get.type(links[0][2],player)=='basic'&&links[0][2]=='shan'){
							return {
								popname:true,
								viewAs:{name:'shan',nature:links[0][3]},
								filterCard:{suit:"heart"},
								selectCard:1,
								position:'h',
							}
						}
						else if(get.type(links[0][2],player)=='trick'){
							lib.card['yk_朱颜·'+links[0][2]]={};
							for(var item in lib.card[links[0][2]]) if(lib.card[links[0][2]][item]) lib.card['yk_朱颜·'+links[0][2]][item]=lib.card[links[0][2]][item];
							lib.translate['yk_朱颜·'+links[0][2]]='朱颜·'+lib.translate[links[0][2]];
							return {
								popname:true,
								viewAs:{name:'yk_朱颜·'+links[0][2],nature:links[0][3]},
								filterCard:{suit:"heart"},
								selectCard:1,
								position:'h',
							}
						}
						else if(get.type(links[0][2],player)=='delay'){
							lib.card['yk_朱颜·'+links[0][2]]={};
							for(var item in lib.card[links[0][2]]) if(lib.card[links[0][2]][item]) lib.card['yk_朱颜·'+links[0][2]][item]=lib.card[links[0][2]][item];
							lib.translate['yk_朱颜·'+links[0][2]]='朱颜·'+lib.translate[links[0][2]];
							return {
								popname:true,
								viewAs:{name:'yk_朱颜·'+links[0][2],nature:links[0][3]},
								filterCard:{suit:"heart"},
								selectCard:1,
								position:'h',
							}
						}
						else{
							lib.card['yk_朱颜·'+links[0][2]]={};
							for(var item in lib.card[links[0][2]]) if(lib.card[links[0][2]][item]) lib.card['yk_朱颜·'+links[0][2]][item]=lib.card[links[0][2]][item];
							lib.card['yk_朱颜·'+links[0][2]].legend=true;
							lib.translate['yk_朱颜·'+links[0][2]]='朱颜·'+lib.translate[links[0][2]];
							lib.translate['yk_朱颜·'+links[0][2]+'_info']=lib.translate[links[0][2]+'_info'];
							return {
								popname:true,
								viewAs:{name:links[0][2]},
								filterCard:{suit:"heart"},
								selectCard:1,
								position:'h',
							}
						}
					},
				},
				onremove:function(player){
					if(player.hasSkill('ykzhuyan_use_equip')) player.removeSkill('ykzhuyan_use_equip');
				},
				ai:{
					respondSha:true,
					respondShan:true,
					skillTagFilter:function(player){
						return player.countCards('h')>0;
					},
					order:0.5,
					result:{
						player:function(player){
							if(_status.event.dying){
								return get.attitude(player,_status.event.dying);
							}
							if(_status.event.type=='respondShan') return 1;
							return 1;
						},
					},
				},
			};
			lib.skill.ykzhuyan_use_equip={
				trigger:{
					player:["useCard","phaseAfter"],
				},
				filter:function(event,player){
					if(event.name=="useCard") return event.skill=='ykzhuyan_use_backup';
					else return true;
				},
				forced:true,
				content:function(){
					if(trigger.name=='useCard'){
						if(get.type(trigger.card,player)=='basic') player.ykConsume('Soul',((lib.config['yk_ykzhuyan_rank']||0)>=2?50:80),true);
						if(get.type(trigger.card,player)=='trick') player.ykConsume('Soul',((lib.config['yk_ykzhuyan_rank']||0)>=2?110:140),true);
						if(get.type(trigger.card,player)=='delay') player.ykConsume('Soul',((lib.config['yk_ykzhuyan_rank']||0)>=2?70:100),true);
						if(get.type(trigger.card,player)=='equip'){
							player.ykConsume('Soul',((lib.config['yk_ykzhuyan_rank']||0)>=2?170:200),true);
							var name=get.name(trigger.card,player);
							var number=get.number(trigger.cards[0],player);
							var suit=get.suit(trigger.cards[0],player);
							lib.card['yk_朱颜·'+name].cardimage=name;
							trigger.cards[0]=game.createCard('yk_朱颜·'+name,suit,number);
							player.equip(trigger.cards[0],'equip2');
						}
					}
					else{
						player.removeSkill('ykzhuyan_use');
						player.removeSkill('ykzhuyan_use_equip');
					}
				},
				onremove:function(player){
					if(player.hasSkill('ykzhuyan_use')) player.removeSkill('ykzhuyan_use');
				},
			};
			lib.translate['ykzhuyan_use']='朱颜·辞镜';
			lib.translate['ykzhuyan_use_info']='消耗80/140/100/200元力值发动：将一张红桃手牌当作基本牌/锦囊牌/延时锦囊牌/装备牌使用或打出。';
			},player);
		},
		onremove:function(player){
			if(player.name=='qxq_yk_xiaoqiao') player.addSkill('ykzhuyan');
		},
		charlotte:true,
		superCharlotte:true,
		fixed:true,
		audio:"ext:云空/qxq_yk_xiaoqiao:1",
		trigger:{
			global:"judge",
		},
		filter:function(event,player){
			if(event.fixedResult&&event.fixedResult.suit) return event.fixedResult.color=='balck'&&player.ykCheckConsume('Mp',20)&&player.countCards('h',{color:"red"})>0;
			if(event.player.judging&&event.player.judging[0]) return get.color(event.player.judging[0],event.player)=='black'&&player.ykCheckConsume('Mp',20)&&player.countCards('h',{color:"red"})>0;
		},
		check:function(card){
			for(var pl of game.players){
				if(pl.name=='qxq_yk_xiaoqiao') var player=pl;
			}
			if(pl.countCards('h')>=3||_status.event.player==pl) return true;
			return false;
		},
		content:function(){
			"step 0"
			player.ykConsume('Mp',20,true);
			event.namex=get.name(trigger.player.judging[0],trigger.player)||'';
			event.suitx=get.suit(trigger.player.judging[0],trigger.player)||'';
			event.numberx=get.number(trigger.player.judging[0],trigger.player)||'';
			event.naturex=get.nature(trigger.player.judging[0],trigger.player)||'';
			event.target=trigger.player;
			if(trigger.player.judging) var suit=get.suit(trigger.player.judging[0],trigger.player)
			if(trigger.player.judging) var color=get.color(trigger.player.judging[0],trigger.player)
			if(!trigger.fixedResult) trigger.fixedResult={};
			event.ykzhuyan_cardsuit=trigger.fixedResult.suit||suit||'';
			lib.ykzhuyan_cardcolor=trigger.fixedResult.color||color||'';
			var str='朱颜：'+get.translation(trigger.player)+'的'+(trigger.judgestr||'')+'判定为'+get.translation(trigger.player.judging[0])+'，打出一张牌代替此判定牌';
			player.chooseCard({
				filterCard:function(card,player){
					return get.color(card,player)=='red';
				},
				ai:function(card,player){
					if(get.attitude(player,event.target)>0&&(event.ykzhuyan_cardsuit=='club'||event.ykzhuyan_cardsuit=='spade')&&(get.suit(card,player)=='heart')) return 7.5-get.value(card,player);
					if(get.attitude(player,event.target)<0&&(event.ykzhuyan_cardsuit=='diamond'||event.ykzhuyan_cardsuit=='heart')&&get.suit(card,player)=='club') return 6-get.value(card,player);
					if(get.attitude(player,event.target)>0&&(event.ykzhuyan_cardsuit=='club'||event.ykzhuyan_cardsuit=='spade')&&get.suit(card,player)=='diamond') return 6-get.value(card,player);
					return 5.5-get.value(card,player);
				},
				prompt:get.prompt('yktianxiang'),
				prompt2:'弃置一张手牌',
			}).set('prompt',str).set('judging',trigger.player.judging[0]);
			"step 1"
			if(result.bool){
				if((lib.config['yk_ykzhuyan_rank']||0)>=4){
					if(event.namex){
						player.gain(game.createCard(event.namex,event.suitx,event.numberx,event.naturex),'gain2');
					}
				}
				player.respond(result.cards,'ykzhuyan','highlight','noOrdering');
			}
			else{
				event.finish();
			}
			"step 2"
			if(result.bool){
				event.clone=result.cards[0].clone;
				if(get.suit(result.cards[0])=='spade'){
					result.cards[0]=game.createCard(result.cards[0].name,'heart',result.cards[0].number);
					result.cards[0].clone=event.clone;
				}
				event.card=result.cards[0];
				if((lib.config['yk_ykzhuyan_rank']||0)>=5&&get.suit(event.card,player)=='heart') player.recover();
				if(trigger.player.judging[0].clone){
					trigger.player.judging[0].clone.classList.remove('thrownhighlight');
					game.broadcast(function(card){
						if(card.clone){
							card.clone.classList.remove('thrownhighlight');
						}
					},trigger.player.judging[0]);
					game.addVideo('deletenode',player,get.cardsInfo([trigger.player.judging[0].clone]));
				}
				game.cardsDiscard(trigger.player.judging[0]);
				player.popup(get.translation(get.suit(event.card,player)));
				trigger.player.judging[0]=result.cards[0];
				trigger.orderingCards.addArray(result.cards);
				game.log(trigger.player,'的判定牌改为',result.cards[0]);
				trigger.player.judging[0]=event.card;
				if(!trigger.fixedResult) trigger.fixedResult={};
				trigger.fixedResult.suit=get.suit(event.card,player);
				trigger.fixedResult.color=get.color(event.card,player);
				if((lib.config['yk_ykzhuyan_rank']||0)>=1) player.ykRecover('Defend',50,true);
				if(get.suit(event.card,player)=='heart'){
					event.getSkillBool=true;
				}
				if((lib.config['yk_ykzhuyan_rank']||0)>=3){
					trigger.cancel();
					trigger._triggered=null;
					var node;
					if(game.chess){
						node=event.card.copy('thrown','center',ui.arena).animate('start');
					}
					else{
						node=player.$throwordered(event.card.copy(),true);
					}
					node.classList.add('thrownhighlight');
					trigger.result={
						card:event.card,
						judge:trigger.judge(event.card),
						node:node,
						number:get.number(event.card,player),
						suit:get.suit(event.card,player),
						color:get.color(event.card,player),
					};
					if(trigger.result.judge>0){
						trigger.result.bool=true;
						trigger.player.popup('洗具');
					}
					if(trigger.result.judge<0){
						trigger.result.bool=false;
						trigger.player.popup('杯具');
					}
					game.log(trigger.player,'的判定结果为',event.card);
				}
				game.delay(2);
			}
			if(event.getSkillBool!=true) event.finish();
			"step 3"
			player.addSkill('ykzhuyan_use');
			player.addSkill('ykzhuyan_use_equip');
		},
		ai:{
			rejudge:true,
			tag:{
				rejudge:0.4,
			},
			expose:0.25,
		},
	};
	lib.skill.ykpiaoling={
		init:function(player){
			game.broadcastAll(function(player){
			if(player.name=='qxq_yk_xiaoqiao'&&typeof game.playyk=='function') game.playyk('qxq_yk_xiaoqiao','qxq_yk_xiaoqiao.mp3',null,null,333500);
			lib.skill.ykpiaoling_jili={
				onremove:function(player){
					delete player.ykpiaoling_jili_target;
					player.ykpiaoling_jili_target=undefined;
				},
				audio:"ext:云空/qxq_yk_xiaoqiao:1",
				trigger:{
					target:"useCardToBefore",
				},
				forced:true,
				filter:function(event,player){
					return player==event.target&&player.ykpiaoling_jili_target!=undefined&&game.players.contains(player.ykpiaoling_jili_target);
				},
				content:function(){
					var wordpl=['流落天涯，寄人篱下，呜~[#惨兮兮][#惨兮兮]','你竟然要对本萌新动手……呜，害怕[#哭唧唧][#哭唧唧]','大哥哥大姐姐行行好，不要打我……那……不要打脸……[#惨兮兮][#惨兮兮]'].randomGet();
					player.say(wordpl);
					var wordplx=['她的事，就是'+(player.ykpiaoling_jili_target.sex=='female'?'本小姐':'劳资')+'的事，有什么事冲我来！','欺软怕硬算什么本事，有什么事冲我来！'].randomGet();
					player.ykpiaoling_jili_target.say(wordplx);
					event.wordply=['就这点劲，你是没吃饭吗？','不错，再来啊！就这点劲，对'+(player.ykpiaoling_jili_target.sex=='female'?'本小姐':'劳资')+'来说不痛不痒的呢！'].randomGet();
					setTimeout(function(){
						if(game.players.contains(player.ykpiaoling_jili_target)) player.ykpiaoling_jili_target.say(event.wordply);
					},3000);
					if(trigger.targets) player.ykpiaoling_jili_target.line(player);
					if(trigger.targets) trigger.targets[0]=player.ykpiaoling_jili_target;
					if(trigger.target) trigger.target=player.ykpiaoling_jili_target;
				},
			};
			lib.translate['ykpiaoling_jili']='寄篱';
			lib.translate['ykpiaoling_jili_info']='任意以你为目标的牌，你可将此牌的目标转移给寄篱的角色。';
			lib.skill.ykpiaoling_jili_gain={
				trigger:{
					global:"gainBegin",
				},
				audio:"ext:云空/qxq_yk_xiaoqiao:2",
				forced:true,
				filter:function(event,player){
					return event.skill!='ykpiaoling'&&player.ykpiaoling_jili_target!=undefined&&event.player==player.ykpiaoling_jili_target;
				},
				content:function(){
					var length=Math.floor(trigger.cards.length/2);
					var x=0;
					var gainList=[];
					while(x<length){
						x++;
						var card=trigger.cards.randomGet();
						gainList.push(card)
						trigger.cards.remove(card);
					}
					if(length>0) game.log(trigger.player,'少摸了',length,'张牌');
					if(length>0) trigger.player.line(player);
					if(trigger.player) setTimeout(function(){trigger.player.say('不就是点小牌牌嘛，给你给你。[#汗][#汗]');},2000);
					var other=game.players.randomGet();
					if(other!=player&&other!=trigger.player) setTimeout(function(){other.say('好家伙，人家在打牌，你俩咋还互撩上了？[#巨汗][#巨汗]');},4000);
					if(other!=player&&other!=trigger.player) setTimeout(function(){trigger.player.say('关你啥事！！！活该单身一辈子吧你！！[#鄙视][#不屑]');},6000);
					if(trigger.player) player.say((trigger.player.sex=='female'?'大姐姐':'大哥哥')+'真是大好人呢！[#感动][#感动]');
					if(gainList.length>0) game.log(player,'从',trigger.player,'处获得了',gainList,'，共计',length,'张牌');
					if(gainList.length>0) player.gain(gainList);
				},
			};
			player.addSkill('ykpiaoling_jili_gain');
			},player);
		},
		onremove:function(player){
			if(player.name=='qxq_yk_xiaoqiao') player.addSkill('ykpiaoling');
		},
		mark:true,
		charlotte:true,
		superCharlotte:true,
		fixed:true,
		marktext:"篱",
		intro:{
			name:"寄篱",
			mark:function(dialog,storage,player){
				dialog.addText('寄篱的目标');
				if(!player.ykpiaoling_jili_target){
					dialog.addText('无');
				}
				else{
					dialog.addSmall([[player.ykpiaoling_jili_target.name],'character']);
				}
			},
		},
		audio:"ext:云空/qxq_yk_xiaoqiao:2",
		enable:"phaseUse",
		filter:function(event,player){
			return player.countCards('h',{suit:"heart"})>0;
		},
		selectCard:[1,Infinity],
		check:function(card){
			var player=_status.currentPhase;
			if(!player.hasSkill('ykpiaoling_jili')){
				if(player.hp==player.maxHp&&player.countCards('h')<=player.hp) return false;
				if(ui.selected.cards.length>=player.hp+1) return -get.value(card,player);
				else return get.value(card,player);
			}
			else return false;
		},
		filterCard:{
			suit:"heart",
		},
		selectTarget:1,
		filterTarget:function(card,player,target){
			return player!=target;
		},
		content:function(){
			"step 0"
			target.gain(cards,player,'giveAuto');
			var evt2=event.getParent(3);
			event.num=cards.length;
			if((lib.config['yk_ykpiaoling_rank']||0)>=3&&player.countCards('h',{suit:"heart"})==0) event.draw=true;
			game.log(target,'获得了',cards);
			player.ykRecover('Mp',60*event.num,true);
			player.ykRecover('Soul',30*event.num,true);
			if((lib.config['yk_ykpiaoling_rank']||0)>=1) player.ykRecover('Mp',20*event.num,true);
			if((lib.config['yk_ykpiaoling_rank']||0)>=2&&player.countCards('h')==0) player.gainPlayerCard(get.prompt('飘零：获得',target,'的一张牌'),target,'he',true,'visible').logSkill=['ykpiaoling'];
			if(event.draw==true){
				player.draw();
				if((lib.config['yk_ykpiaoling_rank']||0)>=4) player.changeHujia();
			}
			if(event.num>player.hp){
				player.ykpiaoling_jili_target=target;
				player.addTempSkill('ykpiaoling_jili',{player:"phaseZhunbeiBegin"});
				if((lib.config['yk_ykpiaoling_rank']||0)>=5) player.chooseControl('翻面','不翻面').ai=function(event,player){
					return '翻面';
				}
				player.say(['这些就是我的家当了，还望'+(target.sex=='female'?'大姐姐':'大哥哥')+'收下[#可怜][#可怜]'].randomGet());
				target.say(['你是捡破烂的吗，这么穷？算了，别那样看我……我就帮你一次。[#汗][#汗]'].randomGet());
			}
			"step 1"
			if(result.control=='翻面') player.turnOver();
		},
		ai:{
			order:function(skill,player){
				if(player.hp<=Math.round(player.maxHp/2)||player.countCards('h')>player.hp){
					return Math.max(get.order({name:'tao'})-0.1,get.order({name:'jiu'})+0.5);
				}
				return Math.min(get.order({name:'tao'})-0.1,get.order({name:'jiu'})+0.5);
			},
			result:{
				target:function(player,target){
					if(player.hasSkill('ykpiaoling_jili')||player.countCards('h')<=2) return 0;
					else{
						var valuex=0;
						var effect=0;
						for(var card of ui.selected.cards) valuex+=get.value(card,player);
						if(ui.selected.cards.length>=player.hp+1){
							var baseValue=get.value(game.createCard('shan'),player)*game.players.length/3;
							if(target.hp<target.maxHp/2){
								effect-=4;
							}
							effect-=baseValue;
							if((lib.config['yk_ykpiaoling_rank']||0)>=5) effect=2*effect;
						}
						if(target.hasJudge('lebu')) valuex=valuex/10;
						if(target.hasSkillTag('nogain')) valuex=0;
						var gap=target.hp-target.countCards('h');
						if(target.countCards('h')<target.hp){
							if(gap<=2) effect+=3*gap;
							else effect+=6+5*(gap-2);
							if(target.countCards('h')<=1) effect+=6;
						}
						else effect-=2*gap;
						return effect+valuex;
					}
				},
			},
			threaten:0.4,
		},
	};
	
	lib.skill.yktianyi={
		enable:["chooseToUse","chooseToRespond"],
		charlotte:true,
		superCharlotte:true,
		fixed:true,
		filter:function(event,player){
			if(event.type=='wuxie') return false;
			if(player.countCards('h',{suit:"heart"})+player.countCards('h',{suit:"spade"})==0) return false;
			if((lib.config['yk_yktianyi_rank']||0)<1&&!player.ykCheckConsume('Mp',60)) return false;
			else if(!player.ykCheckConsume('Mp',50)) return false;
			var hs=player.getCards('h');
			for(var i of hs){
				if(game.checkMod(i,player,'unchanged','cardEnabled2',player)===false) return false;
			}
			for(var i of lib.inpile){
				if((i=='tao'||i=='jiu')&&get.type(i,player)=='basic'&&event.filterCard({name:i,cards:hs},player,event)){
					return true
				}
			}
			return false;
		},
		chooseButton:{
			dialog:function(event,player){
				var vcards=[],hs=player.getCards('h');
				for(var i of lib.inpile){
					if(player.countCards('h',{suit:"heart"})>0&&i=='tao'&&get.type(i,player)=='basic'&&event.filterCard({name:i,cards:hs},player,event)) vcards.push(['基本','',i]);
					if(player.countCards('h',{suit:"spade"})>0&&i=='jiu'&&get.type(i,player)=='basic'&&event.filterCard({name:i,cards:hs},player,event)) vcards.push(['基本','',i]);
				}
				return ui.create.dialog('天医',[vcards,'vcard']);
			},
			check:function(button,player){
				if(_status.event.getParent().type!='phase') return 1;
				return _status.event.player.getUseValue({name:button.link[2],nature:button.link[3]});
			},
			backup:function(links,player){
				if((lib.config['yk_yktianyi_rank']||0)<5) player.loseHp()._triggered=null;
				if((lib.config['yk_yktianyi_rank']||0)>=2) player.draw(2);
				else player.draw();
				player.changeHujia();
				player.ykRecover('Defend',50,true);
				if((lib.config['yk_yktianyi_rank']||0)>=3) player.ykRecover('Defend',75,true);
				if((lib.config['yk_yktianyi_rank']||0)>=4) player.changeHujia();
				if(links[0][2]=='tao'){
					if((lib.config['yk_yktianyi_rank']||0)<1) player.ykConsume('Mp',60,true);
					else player.ykConsume('Mp',50,true);
					lib.card['yk_天医 · '+links[0][2]]=lib.card[links[0][2]];
					lib.translate['yk_天医 · '+links[0][2]]='天医 · '+lib.translate[links[0][2]];
					return {
						popname:true,
						viewAs:{name:'yk_天医 · '+links[0][2],nature:links[0][3]},
						filterCard:{suit:"heart"},
						selectCard:1,
						position:'h',
					}
				}
				if(links[0][2]=='jiu'){
					if((lib.config['yk_yktianyi_rank']||0)<1) player.ykConsume('Mp',60,true);
					else player.ykConsume('Mp',50,true);
					lib.card['yk_天医 · '+links[0][2]]=lib.card[links[0][2]];
					lib.translate['yk_天医 · '+links[0][2]]='天医 · '+lib.translate[links[0][2]];
					return {
						popname:true,
						viewAs:{name:'yk_天医 · '+links[0][2],nature:links[0][3]},
						filterCard:{suit:"spade"},
						selectCard:1,
						position:'h',
					}
				}
			},
		},
		hiddenCard:function(player,name){
			return name!='du'&&get.type(name,player)=='basic'&&player.countCards('h')>0;
		},
		ai:{
			respondSha:true,
			respondShan:true,
			skillTagFilter:function(player){
				return player.countCards('h')>0;
			},
			order:0.5,
			result:{
				player:function(player){
					if(_status.event.dying){
						if(player!=_status.event.dying) return get.attitude(player,_status.event.dying);
						else if(player.countCards('h',{name:'tao'})+player.countCards('h',{name:'jiu'})>0) return -1;
						else return 1;
					}
					if(player.hp==player.maxHp&&player.countCards('h')<player.hp) return -1;
					return 1;
				},
			},
		},
	};
	lib.skill.ykwuji={
		init:function(player){
			player.ykwuji_guessBool=[];
			player.ykwuji_record=[];
			player.ykwuji_record2=[];
		},
		enable:"phaseUse",
		usable:3,
		selectTarget:1,
		charlotte:true,
		superCharlotte:true,
		fixed:true,
		filterTarget:function(card,player,target){
			if((lib.config['yk_ykwuji_rank']||0)<2) return !player.ykwuji_record.contains(target)&&target.hp<target.maxHp;
			else return !player.ykwuji_record.contains(target)&&!player.ykwuji_record2.contains(target)&&target.hp<target.maxHp;
		},
		filter:function(event,player){
			if((lib.config['yk_ykwuji_rank']||0)<1) return player.ykCheckConsume('Mp',40);
			else return player.ykCheckConsume('Mp',35);
		},
		content:function(){
			'step 0'
			player.chooseControl('红桃','方块','梅花','黑桃',true).set('prompt','请选择一种花色').ai=function(event,player){
				return ['红桃','方块','梅花','黑桃'].randomGet();
			};
			'step 1'
			if(result.control=='红桃'){
				event.suit='heart';
			}
			else if(result.control=='方块'){
				event.suit='diamond';
			}
			else if(result.control=='梅花'){
				event.suit='club';
			}
			else if(result.control=='黑桃'){
				event.suit='spade';
			}
			else game.log(event.suit);
			'step 2'
			if((lib.config['yk_ykwuji_rank']||0)<1) player.ykConsume('Mp',40,true);
			else return player.ykConsume('Mp',35,true);
			if((lib.config['yk_ykwuji_rank']||0)<2) player.ykwuji_record.push(target);
			else{
				if(player.ykwuji_record.contains(target)) player.ykwuji_record2.push(target);
				else player.ykwuji_record.push(target);
			}
			var cards=target.getCards('h');
			player.showCards(cards,'卡牌结果');
			event.bool=true;
			for(var card of cards) if(get.suit(card,player)==event.suit) event.bool=false;
			if(event.bool){
				player.draw();
				var word=['哼哼，我就说我可以治好你的吧！[#得意][#得意]','你们都不相信本小姐的医术？真是不识好歹！！！[#生气][#不屑]','谢谢惠顾，欢迎下次光临哦！！[#开心][#开心]'].randomGet();
				player.say(word);
				event.pl=target;
				event.goto(3);
			}
			else{
				var word=['小失误小失误……[#捂脸][#捂脸]','咳咳……等我看一下书再来救你。[#抱歉][#抱歉]','真的不是故意的。[#抱歉][#抱歉]'].randomGet();
				player.say(word);
				player.chooseToDiscard('he',1,true);
				var card=get.cardPile2(function(card){
					return get.suit(card)==event.suit;
				});
				if(card) target.gain(card,'gain2');
				event.finish();
			}
			'step 3'
			if((lib.config['yk_ykwuji_rank']||0)>=3) player.ykRecover('Mp',35,true);
			if((lib.config['yk_ykwuji_rank']||0)>=4){
				if(player.ykwuji_guessBool.contains(target)) player.draw(2);
				else player.ykwuji_guessBool.push(target);
			}
			if((lib.config['yk_ykwuji_rank']||0)>=5){player.recover();}
			event.pl.chooseControl('摸牌','回复体力',true).ai=function(event,player){
				if(event.pl.countCards('h',{name:'shan'})==0||player.countCards('h')<player.hp) return '摸牌';
				return '回复体力';
			}
			'step 4'
			if(result.control=='摸牌'){
				target.draw();
			}
			else{
				target.recover();
			}
		},
		ai:{
			order:Infinity,
			result:{
				target:function(player,target){
					if(target.countCards('h')==0) return Infinity;
					else return 1/target.countCards('h');
				},
			},
		},
		group:["ykwuji_clear"],
		subSkill:{
			clear:{
				trigger:{
					player:"phaseBegin",
				},
				forced:true,
				silent:true,
				popup:false,
				content:function(){
					player.ykwuji_record=[];
					player.ykwuji_record2=[];
					player.ykwuji_guessBool=[];
				},
			},
		},
	};
	
	lib.tarot_group={
		//三件套
		ssry:{
			condition:['3','4','7'],
			onEquip:function(player){
				if(!player) return ;
				lib.skill.yk_ssry={
					mode:["identity"],
					trigger:{
						global:"phaseDrawBefore",
					},
					filter:function(event,player){
						return player.identity=='zhu'&&player==game.zhu;
					},
					forced:true,
					silent:true,
					popup:false,
					content:function(){
						if(trigger.player.identity=='fan'&&Math.random()<0.5) trigger.num--;
						if(trigger.player.identity!='fan'&&Math.random()<0.5) trigger.num++;
					},
				}
				lib.translate['yk_ssry']='殊胜荣耀';
				lib.translate['yk_ssry_info']='你拥有此套装且你为主公时，所有反贼摸牌阶段摸牌数有50%概率-1，其他角色有50%概率+1（仅身份模式生效）';
				player.addSkill('yk_ssry');
			},
			onLose:function(player){
				if(!player) return ;
				player.removeSkill('yk_ssry');
			},
			translation:'殊胜荣耀',
			info:'你拥有此套装且你为主公时，所有反贼摸牌阶段摸牌数有50%概率-1，其他角色有50%概率+1（仅身份模式生效）',
		},
		zejl:{
			condition:['12','13','15'],
			onEquip:function(player){
				if(!player) return ;
				lib.skill.yk_zejl={
					trigger:{
						source:"damageEnd",
					},
					filter:function(event,player){
						return event.player!=player&&event.source==player&&player.hujia>0;
					},
					content:function(){
						var hujia=player.hujia;
						game.log(player,'移除了',hujia,'点护甲！');
						player.changeHujia(-player.hujia);
						trigger.player.hp=player.hp;
						trigger.player.update();
						if(hujia>2){
							var changeMaxHp=trigger.player.maxHp-player.maxHp;
							trigger.player.maxHp=player.maxHp;
							trigger.player.update();
							if(changeMaxHp>0) player.changeHujia(changeMaxHp);
							game.log(player,'获得了',changeMaxHp,'点护甲！');
						}
						var changeHp=trigger.player.hp-player.hp;
						if(changeHp>0) player.draw(changeHp);
					},
				}
				lib.translate['yk_zejl']='灾厄将临';
				lib.translate['yk_zejl_info']='你拥有此套装并造成伤害时，若你有护甲，则可移除所有护甲，将目标体力变为与你相同，若移除护甲值超过两点，则将目标体力上限变为与你相同，目标每因此减少一点体力，你摸一张牌，每因此减少一点体力上限，你获得一点护甲。';
				player.addSkill('yk_zejl');
			},
			onLose:function(player){
				if(!player) return ;
				player.removeSkill('yk_zejl');
			},
			translation:'灾厄将临',
			info:'你拥有此套装并造成伤害时，若你有护甲，则可移除所有护甲，将目标体力变为与你相同，若移除护甲值超过两点，则将目标体力上限变为与你相同，目标每因此减少一点体力，你摸一张牌，每因此减少一点体力上限，你获得一点护甲。',
		},
		sjsj:{
			condition:['17','18','19','21'],
			onEquip:function(player){
				if(!player) return ;
				lib.skill.yk_sjsj={
					enable:"phaseUse",
					usable:1,
					filter:function(event,player){
						return player.ykCheckConsume('Soul',35);
					},
					content:function(){
						'step 0'
						player.ykConsume('Soul',35,true);
						if(!player.ykadd_skill) player.ykadd_skill=[];
						event.skills=[];
						event.skillnum=0;
						for(var character in lib.character){
							if(lib.character[character][1]!='qxq_yk') event.skills=event.skills.concat(lib.character[character][3]);
						}
						event.skills=event.skills.randomGets(5);
						'step 1'
						event.controlList=event.skills;
						var tips="请选择获取一项临时技能，'取消'不返还次数</b><br>";
						for(var skill of event.skills){
							if(skill!='取消') tips+="<li>"+get.translation(skill)+"："+(lib.translate[skill+'_info']==undefined?'':get.translation(skill+'_info'))+"</li><br>";
						}
						if(event.controlList.indexOf('取消')==-1) event.controlList.push('取消');
						player.chooseControl(event.controlList).set('prompt',tips);
						'step 2'
						if(result.control!='取消'){
							event.skillnum++;
							event.skills.remove(result.control);
							player.addTempSkill(result.control,{player:"phaseBefore"});
							player.ykadd_skill.push(result.control);
							if(event.skills.length>1&&event.skillnum<3) event.goto(1);
						}
					},
				}
				lib.translate['yk_sjsj']='世间盛景';
				lib.translate['yk_sjsj_info']='你拥有此套装时，每个回合的出牌阶段，你可以消耗35元力值，从除云空武将外的其他武将池中抽取五个武将的技能并选择其中三个作为临时技能直到你的下个回合开始前。';
				player.addSkill('yk_sjsj');
			},
			onLose:function(player){
				if(!player) return ;
				player.removeSkill('yk_sjsj');
			},
			translation:'世间盛景',
			info:'你拥有此套装时，每个回合的出牌阶段，你可以消耗35元力值，从除云空武将外的其他武将池中抽取五个武将的技能并选择其中三个作为临时技能直到你的下个回合开始前。',
		},
		jzzh:{
			condition:['1','7','9','11'],
			onEquip:function(player){
				if(!player) return ;
				lib.skill.yk_jzzh={
					equipSkill:true,
					noHidden:true,
					inherit:"bagua_skill",
					filter:function(event,player){
						if(!lib.skill.bagua_skill.filter(event,player)) return false;
						if(player.countCards('e')<2) return false;
						return true;
					},
					ai:{
						respondShan:true,
						effect:{
							target:function(card,player,target){
								if(player==target&&get.subtype(card,player)=='equip2'){
									if(get.equipValue(card,player)<=7.5) return 0;
								}
								if(!target.isEmpty(2)) return;
								return lib.skill.bagua_skill.ai.effect.target.apply(this,arguments);
							},
						},
					},
					trigger:{
						player:["chooseToRespondBegin","chooseToUseBegin"],
					},
					check:function(event,player){
						if(event&&(event.ai||event.ai1)){
							var ai=event.ai||event.ai1;
							var tmp=_status.event;
							_status.event=event;
							var result=ai({name:'shan'},_status.event.player,event);
							_status.event=tmp;
							return result>0;
						}
						return true;
					},
					content:function(){
						"step 0"
						trigger.bagua_skill=true;
						player.judge('bagua',function(card){return (get.color(card,player)=='red')?1.5:-0.5}).judge2=function(result){
							return result.bool;
						};
						"step 1"
						if(result.judge>0){
							trigger.untrigger();
							trigger.set('responded',true);
							trigger.result={bool:true,card:{name:'shan',isCard:true}}
						}
					},
				}
				lib.translate['yk_jzzh']='交织之护';
				lib.translate['yk_jzzh_info']='你拥有此套装时，若你的装备区内牌数超过2张，则你视为装备【八卦阵】。';
				player.addSkill('yk_jzzh');
			},
			onLose:function(player){
				if(!player) return ;
			},
			translation:'交织之护',
			info:'你拥有此套装时，若你的装备区内牌数超过2张，则你视为装备【八卦阵】。',
		},
		hczy:{
			condition:['0','6','8','10','14'],
			onEquip:function(player){
				if(!player) return ;
				lib.skill.yk_hczy={
					onremove:function(player){
						player.removeSkill('yk_hczy_add');
						player.removeSkill('yk_hczy_add_effect');
					},
					trigger:{
						player:"useCardAfter",
					},
					filter:function(event,player){
						if(event.parent.name=='hczy') return false;
						if(_status.currentPhase!=player) return false;
						if(event.parent.parent.name!='phaseUse') return false;
						if(!event.targets||!event.card) return false;
						if(get.info(event.card,player).complexTarget) return false;
						if(!lib.filter.cardEnabled(event.card,player,event.parent)) return false;
						var type=get.type(event.card,player);
						if(type!='basic'&&type!='trick') return false;
						var card=game.createCard(event.card.name,event.card.suit,event.card.number,event.card.nature);
						var targets=event._targets||event.targets;
						for(var i=0;i<targets.length;i++){
							if(!targets[i].isIn()) return false;
							if(!player.canUse({name:event.card.name},targets[i],false,false)){
								return false;
							}
						}
						if(Math.random()<0.15) return true;
					},
					forced:true,
					check:function(event,player){
						if(get.tag({name:event.card.name},'norepeat')) return false;
						return true;
					},
					content:function(){
						var card=game.createCard(trigger.card.name,trigger.card.suit,trigger.card.number,trigger.card.nature);
						player.useCard(card,(trigger._targets||trigger.targets).slice(0));
					},
				}
				lib.skill.yk_hczy_add={
					enable:["chooseToUse","chooseToRespond"],
					silent:true,
					filter:function(event,player){
						if(event.type=='wuxie') return false;
						if(!player.ykCheckConsume('Soul',75)) return false;
						var hs=player.getCards('h');
						if(!hs.length) return false;
						for(var i of hs){
							if(game.checkMod(i,player,'unchanged','cardEnabled2',player)===false) return false;
						}
						for(var i of lib.inpile){
							if(i!='du'&&get.type(i,player)=='basic'&&event.filterCard({name:i,cards:hs},player,event)&&player.countCards('h',{type:'basic'})>=2) return true;
							if(i=='sha'){
								var list=['fire','thunder','ice'];
								for(var j of list){
									if(event.filterCard({name:i,nature:j,cards:hs},player,event)&&player.countCards('h',{type:'basic'})>=2) return true;
								}
							}
							if(get.type(i,player)=='trick'&&event.filterCard({name:i,cards:hs},player,event)&&player.countCards('h',{type:'trick'})>=2) return true;
							if(get.type(i,player)=='delay'&&event.filterCard({name:i,cards:hs},player,event)&&player.countCards('h',{type:'delay'})>=2) return true;
						}
						return false;
					},
					chooseButton:{
						dialog:function(event,player){
							var vcards=[],hs=player.getCards('h');
							for(var i of lib.inpile){
								if(i!='du'&&get.type(i,player)=='basic'&&event.filterCard({name:i,cards:hs},player,event)&&player.countCards('h',{type:'basic'})>=2) vcards.push(['基本','',i]);
								if(i=='sha'){
									for(var j of lib.inpile_nature){
										if(event.filterCard({name:i,nature:j,cards:hs},player,event)&&player.countCards('h',{type:'basic'})>=2) vcards.push(['基本','',i,j]);
									}
								}
								if(get.type(i,player)=='trick'&&event.filterCard({name:i,cards:hs},player,event)&&player.countCards('h',{type:'trick'})>=2) vcards.push(['锦囊','',i]);
								if(get.type(i,player)=='delay'&&event.filterCard({name:i,cards:hs},player,event)&&player.countCards('h',{type:'delay'})>=2) vcards.push(['延时锦囊','',i]);
							}
							return ui.create.dialog('红尘之意',[vcards,'vcard']);
						},
						check:function(button,player){
							if(_status.event.getParent().type!='phase') return 1;
							return _status.event.player.getUseValue({name:button.link[2],nature:button.link[3]});
						},
						backup:function(links,player){
							player.ykConsume('Soul',75,true);
							player.popup('红尘之意');
							return {
								popname:true,
								viewAs:{name:links[0][2],nature:links[0][3]},
								filterCard:{type:get.type(links[0][2],player)},
								selectCard:2,
								position:'h',
							}
						},
						backup:{
							sub:true,
						},
					},
					hiddenCard:function(player,name){
						return name!='du'&&get.type(name,player)=='basic'&&player.countCards('h')>0;
					},
					ai:{
						respondSha:true,
						respondShan:true,
						skillTagFilter:function(player){
							return player.countCards('h')>0;
						},
						order:0.5,
						result:{
							player:function(player){
								if(_status.event.dying){
									return get.attitude(player,_status.event.dying);
								}
								if(_status.event.type=='respondShan') return 1;
								var val=0,hs=player.getCards('h'),max=0;
								for(var i of hs){
									val+=get.value(i,player);
									if(get.type(i,player)=='trick') max+=5;
								}
								if(player.hasSkill('zhenjue')) max+=7;
								return val<=max?1:0;
							},
						},
					},
				},
				lib.skill.yk_hczy_add_effect={
					trigger:{
						player:["useCard","respond"],
					},
					forced:true,
					charlotte:true,
					popup:false,
					silent:true,
					filter:function(event,player){
						if(event.skill!='hczy_add_backup') return false;
						for(var i of event.cards){
							var color=get.color2(i,player);
							if(color=='red') return true;
						}
						return false;
					},
					content:function(){
						player.draw();
						player.popup('红尘之意');
					},
					sub:true,
				},
				lib.translate['yk_hczy']='红尘之意';
				lib.translate['yk_hczy_info']='你拥有此套装时，你可以消耗75元力值，将两张相同类型的非装备牌当作任意一张该类型的牌打出，若对应的实体牌中有红色牌，你摸一张牌，你于出牌阶段内使用锦囊牌时，有15%概率额外结算一次。';
				player.addSkill('yk_hczy');
				player.addSkill('yk_hczy_add');
				player.addSkill('yk_hczy_add_effect');
			},
			onLose:function(player){
				if(!player) return ;
				player.removeSkill('yk_hczy');
				player.removeSkill('yk_hczy_add');
				player.removeSkill('yk_hczy_add_effect');
			},
			translation:'红尘之意',
			info:'你拥有此套装时，你可以消耗75元力值，将两张相同类型的非装备牌当作任意一张该类型的牌打出，若对应的实体牌中有红色牌，你摸一张牌，你于出牌阶段内使用锦囊牌时，有15%概率额外结算一次。',
		},
		csxw:{
			condition:['10','16','17'],
			onEquip:function(player){
				if(!player) return ;
				lib.skill.yk_csxw={
					trigger:{
						player:["dying","dieBegin"],
					},
					filter:function(event,player){
						return Math.random()<0.35;
					},
					forced:true,
					content:function(){
						trigger.cancel();
						var hp=lib.character[player.name][2];
						if(typeof hp=='string'){
							var maxHp=parseInt(hp.slice(hp.indexOf('/')+1,hp.length));
							hp=parseInt(hp.slice(0,hp.indexOf('/')));
						}
						player.maxHp=(maxHp||hp);
						player.hp=hp;
						var num=player.maxHp-player.countCards('h');
						if(num>0) player.draw(num);
						player.changeHujia(Math.floor(num/2));
						player.update();
					},
				}
				lib.translate['yk_csxw']='重拾希望';
				lib.translate['yk_csxw_info']='你拥有此套装时，你进入濒死状态或即将阵亡时，有35%概率修复体力值和体力上限并将手牌摸至上限，每摸两张牌，你获得一点护甲。';
				player.addSkill('yk_csxw');
			},
			onLose:function(player){
				if(!player) return ;
				player.removeSkill('yk_csxw');
			},
			translation:'重拾希望',
			info:'你拥有此套装时，你进入濒死状态或即将阵亡时，有35%概率修复体力值和体力上限并将手牌摸至上限，每摸两张牌，你获得一点护甲。',
		},
		
		//两件套
		zgbc:{
			condition:['2','5'],
			onEquip:function(player){
				if(!player) return ;
				lib.skill.yk_zgbc={
					init:function(player){
						player.storage.zgbc=false;
						player.storage.zgbc_time=0;
					},
					onremove:function(player){
						player.storage.zgbc=undefined;
						player.storage.zgbc_time=undefined;
					},
					mark:true,
					marktext:"卜",
					intro:{
						name:"贞龟卜辞",
						mark:function(dialog,content,player){
							dialog.addText('卜辞的目标');
							if(player.storage.zgbc!=undefined&&player.storage.zgbc!=false){
								dialog.addSmall([[player.storage.zgbc[2]],'vcard']);
								if(player.storage.zgbc_time<3) dialog.addText('当前获取此塔罗牌概率增加'+(15+5*player.storage.zgbc_time)+'%');
								else dialog.addText('下次扶乩必定获得此塔罗牌！');
							}
							else dialog.addText('无');
						},
					},
					enable:"phaseUse",
					filter:function(event,player){
						return player.storage.zgbc==false;
					},
					content:function(){
						'step 0'
						event.cardList=[];
						var num=0;
						while(num<21){
							event.cardList.push(['','','tarot_'+num]);
							num++;
						}
						while(num<25){
							event.cardList.push(['','','tarot_special'+(num-21)]);
							num++;
						}
						var dialog=ui.create.dialog('贞龟卜辞<br><small>请选择一张目标塔罗牌</small>',[event.cardList,'vcard']);
						player.chooseButton(dialog,true).ai=function(button){
							var name=button.link[2];
							return ['12','13','15'].indexOf(lib.card[name].tarotNumber)==-1;
							return 0;
						}
						'step 1'
						if(result.bool){
							player.storage.zgbc=result.links[0];
							if(lib.yk_tarotList.indexOf(player.storage.zgbc)==-1) game.yk_washTarot();
						}
					},
				}
				lib.translate['yk_zgbc']='贞龟卜辞';
				lib.translate['yk_zgbc_info']='你拥有此套装且未指定任何塔罗牌时，你可以于出牌阶段指定任意一张塔罗牌，若牌堆中无指定牌，则立即洗切牌堆。出现指定的塔罗牌时，你摸两张牌。你【扶乩】时增加一张来自牌堆中间的塔罗牌，未获取的塔罗牌将从塔罗牌堆自动弃置，且出现指定牌的几率增加，若已有三次未出现该塔罗牌，则下次必定出现该塔罗牌，若已出现该塔罗牌，则你可于出牌阶段重新指定。';
				player.addSkill('yk_zgbc');
			},
			onLose:function(player){
				if(!player) return ;
				player.removeSkill('yk_zgbc');
			},
			translation:'贞龟卜辞',
			info:'你拥有此套装且未指定任何塔罗牌时，你可以于出牌阶段指定任意一张塔罗牌，若牌堆中无指定牌，则立即洗切牌堆。出现指定的塔罗牌时，你摸两张牌。你【扶乩】时增加一张来自牌堆中间的塔罗牌，未获取的塔罗牌将从塔罗牌堆自动弃置，且出现指定牌的几率增加，若已有三次未出现该塔罗牌，则下次必定出现该塔罗牌，若已出现该塔罗牌，则你可于出牌阶段重新指定。',
		},
		sssp:{
			condition:['11','20'],
			onEquip:function(player){
				if(!player) return ;
				lib.skill.yk_sssp={
					mod:{
						ignoredHandcard:function (card,player){
							if(get.name(card,player)=='sha'||get.type(card,player)=='equip'){
								return true;
							}
						},
					},
					trigger:{
						global:"damageAfter",
					},
					filter:function(event,player){
						return player.countCards('h',{name:"sha"})>0&&event.source!=undefined&&event.source!=player;
					},
					forced:true,
					content:function(){
						player.chooseToUse('是否对【'+get.translation(trigger.source.name)+'】使用一张【杀】？',{name:'sha'},trigger.source);
					},
				}
				lib.translate['yk_sssp']='神圣审判';
				lib.translate['yk_sssp_info']='你拥有此套装时，你的“杀”和装备牌不计入手牌上限，场上任意角色受到伤害后，你可以对伤害来源使用一张“杀”。';
				player.addSkill('yk_sssp');
			},
			onLose:function(player){
				if(!player) return ;
				player.removeSkill('yk_sssp');
			},
			translation:'神圣审判',
			info:'你拥有此套装时，你的“杀”和装备牌不计入手牌上限，场上任意角色受到伤害后，你可以对伤害来源使用一张“杀”。',
		},
		gtgw:{
			condition:['4','16'],
			onEquip:function(player){
				if(!player) return ;
				lib.skill.yk_gtgw_diwei={
					mod:{
						maxHandcard:function(player,num){
							if(get.mode()!='identity') return num+1;
						},
					},
					onremove:function(player){
						player.removeSkill('yk_gtgw_diwei_draw');
					},
					enable:"phaseUse",
					usable:1,
					filter:function(event,player){
						var bool=false;
						for(var pl of game.players) if(pl.gtgw_anfu) bool=true;
						return get.mode()=="identity"&&player.identity=='zhu'&&player==game.zhu&&bool;
					},
					selectTarget:1,
					filterTarget:true,
					content:function(){
						for(var pl of game.players){
							if(pl.gtgw_anfu){
								pl.chooseToDiscard('he',Math.min(1,player.countCards('he')),true).set('prompt','弃置一张牌，视为对【'+target.name+'】使用一张“杀”');
								pl.gtgw_anfu=false;
								pl.useCard({name:'sha'},target);
							}
						}
					},
				}
				lib.skill.yk_gtgw_diwei_draw={
					trigger:{
						player:"phaseDrawBefore",
					},
					forced:true,
					silent:true,
					content:function(){
						trigger.num++;
						player.popup('帝威');
					},
				},
				lib.translate['yk_gtgw_diwei']='帝威';
				lib.translate['yk_gtgw_diwei_info']='身份模式下，若你为主公，你的摸牌阶段摸牌数+1，你的出牌阶段限一次，你可令所有被安抚的非目标角色弃置一张牌，其各视为对你指定的一名角色使用一张“杀”，随后所有角色清空【安抚】记录。非身份模式下，你的摸牌阶段摸牌数+1，你的手牌上限+1。';
				player.addSkill('yk_gtgw_diwei');
				player.addSkill('yk_gtgw_diwei_draw');
				lib.skill.yk_gtgw_anfu={
					trigger:{
						global:"damageAfter",
					},
					filter:function(event,player){
						return player!=event.player&&player.countCards('h')>0;
					},
					prompt:'身份模式下，一名其他角色受到伤害后，你可弃置一张手牌，若如此做，其摸一张牌并被标记为安抚角色。非身份模式下，不会标记安抚角色。',
					content:function(){
						player.chooseToDiscard('h',Math.min(1,player.countCards('he')),true).set('prompt','弃置一张手牌对【'+get.translation(trigger.player.name)+'】进行安抚（令其摸一张牌）');
						trigger.player.gtgw_anfu=true;
						trigger.player.draw();
					},
				}
				lib.translate['yk_gtgw_anfu']='安抚';
				lib.translate['yk_gtgw_anfu_info']='身份模式下，一名其他角色受到伤害后，你可弃置一张手牌，若如此做，其摸一张牌并被标记为安抚角色。非身份模式下，不会标记安抚角色。';
				player.addSkill('yk_gtgw_anfu');
			},
			onLose:function(player){
				if(!player) return ;
				player.removeSkill('yk_gtgw_diwei');
				player.removeSkill('yk_gtgw_anfu');
				player.removeSkill('yk_gtgw_diwei_draw');
			},
			translation:'高塔孤王',
			info:'你拥有此套装时，你视为拥有技能【帝威】和【安抚】。<li>【帝威】：身份模式下，若你为主公，你的摸牌阶段摸牌数+1，你的出牌阶段限一次，你可令所有被安抚的非目标角色弃置一张牌，其各视为对你指定的一名角色使用一张“杀”，随后所有角色清空【安抚】记录。非身份模式下，你的摸牌阶段摸牌数+1，你的手牌上限+1。<li>【安抚】：身份模式下，一名其他角色受到伤害后，你可弃置一张手牌，若如此做，其摸一张牌并被标记为安抚角色。非身份模式下，不会标记安抚角色。',
		},
		gtgh:{
			condition:['3','16'],
			onEquip:function(player){
				if(!player) return ;
				lib.skill.yk_gtgh={
					group:["biyue"],
					trigger:{
						target:"useCardToBefore",
					},
					filter:function(event,player){
						var bool=false;
						for(var pl of game.players) if(pl.sex!=player.sex&&player.inRange(pl)) bool=true;
						return player==event.target&&bool;
					},
					content:function(){
						"step 0"
						player.chooseCardTarget({
							filterCard:true,
							filterTarget:function(card,player,target){
								return target!=player&&player.inRange(target)&&target.sex!=player.sex;
							},
							ai1:function(card,player){
								var player=_status.currentPhase;
								var value=0;
								for(var card of player.getCards('h')) 
								return Infinity-get.value(card,player);
							},
							ai2:function(target){
								var att=get.attitude(_status.event.player,target);
								if(att==0) att=0.5;
								return -att;
							},
							prompt:get.prompt('gtgh'),
							prompt2:'你可以弃置一张手牌并将此牌目标转移给指定的攻击范围内的一名其他异性角色，若如此做且你为女性角色，则有50%概率摸一张牌。',
						});
						"step 1"
						if(result.bool){
							player.logSkill('gtgh',result.targets[0]);
							trigger.target=result.targets[0];
							event.card=result.cards[0];
							if(player.sex=='female'&&Math.random()<0.75) player.draw();
							if(get.suit(event.card,player)=='heart'&&Math.random()<0.25) player.draw();
						}
					},
				}
				lib.translate['yk_gtgh']='冷艳';
				lib.translate['yk_gtgh_info']='若场上你的攻击范围内存在异性角色，则任意以你为目标的牌，你可以弃置一张手牌并将此牌目标转移给指定的攻击范围内的一名其他异性角色，若如此做且你为女性角色，则有75%概率摸一张牌，若此牌为红桃牌，有25%概率额外摸一张牌。';
				player.addSkill('yk_gtgh');
			},
			onLose:function(player){
				if(!player) return ;
				player.removeSkill('yk_gtgh');
			},
			translation:'高塔孤后',
			info:'你拥有此套装时，你视为拥有技能【闭月】和【冷艳】。<li>【冷艳】：若场上你的攻击范围内存在异性角色，则任意以你为目标的牌，你可以弃置一张手牌并将此牌目标转移给指定的攻击范围内的一名其他异性角色，若如此做且你为女性角色，则有75%概率摸一张牌，若此牌为红桃牌，有25%概率额外摸一张牌。',
		},
		
		//单件套
		xlmf:{
			condition:['special0'],
			onEquip:function(player){
				if(!player) return ;
				lib.skill.yk_xlmf={
					trigger:{
						player:"loseAfter",
					},
					filter:function(event,player){
						if(player.yk_tarot) return Math.random()<0.05*player.yk_tarot.length;
						return false;
					},
					forced:true,
					content:function(){
						player.draw();
					},
				}
				lib.translate['yk_xlmf']='绚烂魔法';
				lib.translate['yk_xlmf_info']='拥有此塔罗牌时，你每次使用或失去牌，均有（已放置塔罗牌数*5%）概率摸一张牌。';
				player.addSkill('yk_xlmf');
			},
			onLose:function(player){
				if(!player) return ;
				player.removeSkill('yk_xlmf');
			},
			translation:'绚烂魔法',
			info:'拥有此塔罗牌时，你每次使用或失去牌，均有（已放置塔罗牌数*5%）概率摸一张牌。',
		},
		gmzj:{
			condition:['special1'],
			onEquip:function(player){
				if(!player) return ;
				lib.skill.yk_gmzj={
					trigger:{
						player:"useCardAfter",
					},
					filter:function(event,player){
						if(event.card) var card=event.card;
						else if(event.cards) var card=event.cards[0];
						if(card&&get.type(card,player)=='equip'&&get.subtype(card,player)=='equip1') return true;
						if(card&&get.name(card,player)=='sha'&&Math.random()<0.15) return true;
						return false;
					},
					forced:true,
					content:function(){
						if(trigger.card) var card=trigger.card;
						else if(trigger.cards) var card=trigger.cards[0];
						if(card){
							if(get.type(card,player)=='equip'&&get.subtype(card,player)=='equip1'){
								player.gain(game.createCard('sha'),'gain2');
								player.gain(game.createCard('sha'),'gain2');
							}
							else if(get.name(card,player)=='sha') player.changeHujia();
						}
					},
				}
				lib.translate['yk_gmzj']='诡秘之剑';
				lib.translate['yk_gmzj_info']='拥有此塔罗牌时，你使用武器牌时，额外获得两张“杀”，你使用“杀”时，有15%概率获得一点护甲。';
				player.addSkill('yk_gmzj');
			},
			onLose:function(player){
				if(!player) return ;
				player.removeSkill('yk_gmzj');
			},
			translation:'诡秘之剑',
			info:'拥有此塔罗牌时，你使用武器牌时，额外获得两张“杀”，你使用“杀”时，有15%概率获得一点护甲。',
		},
		hlsb:{
			condition:['special2'],
			onEquip:function(player){
				if(!player) return ;
				lib.skill.yk_hlsb={
					trigger:{
						player:"useCardAfter",
					},
					filter:function(event,player){
						if(event.card) var card=event.card;
						else if(event.cards) var card=event.cards[0];
						if(card&&(get.name(card,player)=='tao'||get.name(card,player)=='jiu')&&Math.random()<0.3) return true;
						return false;
					},
					forced:true,
					content:function(){
						var hujia=player.hujia;
						player.changeHujia(-hujia);
						player.recover(hujia);
						if(hujia>=2) player.draw(Math.floor(hujia/2));
					},
				}
				lib.translate['yk_hlsb']='欢乐圣杯';
				lib.translate['yk_hlsb_info']='拥有此塔罗牌时，你使用“桃”或“酒”时，有30%概率将护甲值转化为等量体力值，每转化两点，你额外摸一张牌。';
				player.addSkill('yk_hlsb');
			},
			onLose:function(player){
				if(!player) return ;
				player.removeSkill('yk_hlsb');
			},
			translation:'欢乐圣杯',
			info:'拥有此塔罗牌时，你使用“桃”或“酒”时，有30%概率将护甲值转化为等量体力值，每转化两点，你额外摸一张牌。',
		},
		jxjg:{
			condition:['special3'],
			onEquip:function(player){
				if(!player) return ;
				lib.skill.yk_jxjg={
					init:function(player){
						if(!player.storage.jxjg) player.storage.jxjg=[];
						if(player.getEquip('muniu')){
							var cards=player.getEquip('muniu').cards;
							if(cards){
								for(var card of cards){
									player.storage.jxjg.push(card);
									cards.remove(card);
								}
							}
							player.discard(player.getEquip(5));
							player.draw(2);
						}
					},
					onremove:function(player){
						if(player.storage.jxjg&&player.storage.jxjg.length) player.gain(player.storage.jxjg);
						player.storage.jxjg=undefined;
						player.removeSkill('yk_jxjg_equip');
						player.removeSkill('yk_jxjg_draw');
					},
					equipSkill:true,
					enable:"phaseUse",
					usable:1,
					filterCard:true,
					check:function(card,player){
						if(card.name=='du') return 20;
						var player=_status.event.player;
						var nh=player.countCards('h');
						if(!player.needsToDiscard()){
							if(nh<3) return 0;
							if(nh==3) return 5-get.value(card,player);
							return 7-get.value(card,player);
						}
						return 10-get.useful(card,player);
					},
					discard:false,
					lose:false,
					delay:false,
					filter:function(event,player){
						return player.countCards('h')>0&&!player.getEquip('muniu');
					},
					prepare:function(cards,player){
						player.$give(1,player,false);
					},
					content:function(){
						"step 0"
						player.loseToSpecial(cards,'jxjg');
						"step 1"
						for(var i=0;i<cards.length;i++){
							if(cards[i].destroyed||!cards[i].hasGaintag('jxjg')||get.position(cards[i])!='s'){
								cards[i].remove();
								cards.splice(i--,1);
							}
						}
						if(player.storage.jxjg==undefined) player.storage.jxjg=[];
						if(!cards.length){
							for(var i=0;i<cards.length;i++){
								cards[i].discard();
							}
							event.finish();
							return;
						}
						player.storage.jxjg.push(cards[0]);
						game.broadcast(function(cards){
							player.storage.jxjg=cards;
						},player.storage.jxjg);
						game.delayx();
					},
					ai:{
						order:1,
						expose:0.1,
						result:{
							player:1,
						},
					},
					mod:{
						"cardEnabled2":function(card,player){
							if(!ui.selected.cards.length) return;
							for(var i of ui.selected.cards){
								return true;
							}
						},
					},
					mark:true,
					intro:{
						content:function(storage,player){
							if(!player.storage.jxjg||!player.storage.jxjg.length) return '共有〇张牌';
							if(player.isUnderControl(true)){
								return get.translation(player.storage.jxjg);
							}
							else{
								return '共有'+get.cnNumber(player.storage.jxjg.length)+'张牌';
							}
						},
						mark:function(dialog,storage,player){
							if(!player.storage.jxjg||!player.storage.jxjg.length) return '共有〇张牌';
							if(player.isUnderControl(true)){
								dialog.addAuto(player.storage.jxjg);
							}
							else{
								return '共有'+get.cnNumber(player.storage.jxjg.length)+'张牌';
							}
						},
						markcount:function(storage,player){
							if(player.storage.jxjg) return player.storage.jxjg.length;
							return 0;
						},
					},
				}
				lib.skill.yk_jxjg_equip={
					trigger:{
						player:"equipBegin",
					},
					filter:function(event,player){
						return (event.card&&get.name(event.card,player)=='muniu')||(event.cards&&get.name(event.cards[0],player)=='muniu');
					},
					forced:true,
					silent:true,
					content:function(){
						trigger.cancel();
						player.draw(2);
						player.popup('积蓄金罐');
					},
				},
				lib.skill.yk_jxjg_draw={
					trigger:{
						player:"phaseDrawBefore",
					},
					filter:function(event,player){
						return player.storage.jxjg&&player.storage.jxjg.length>0&&Math.random()<0.1*player.storage.jxjg.length;
					},
					forced:true,
					silent:true,
					content:function(){
						trigger.num++;
						player.popup('积蓄金罐');
					},
				},
				lib.translate['yk_jxjg']='积蓄金罐';
				lib.translate['yk_jxjg_info']='拥有此塔罗牌且未装备【木牛流马】时，视为拥有不可移动的【木牛流马】（即【积蓄金罐】），你使用【木牛流马】时，改为摸两张牌，拥有此塔罗牌时，你的摸牌阶段，有(10*a%)的概率令摸排数+1（a为【积蓄金罐】中的牌数）；若你已装备【木牛流马】，则将【木牛流马】中所有的牌转移至【积蓄金罐】中，然后你弃置【木牛流马】并摸两张牌。失去此塔罗牌时。移除【积蓄金罐】并获得所有其中的牌。';
				player.addSkill('yk_jxjg');
				player.addSkill('yk_jxjg_equip');
				player.addSkill('yk_jxjg_draw');
			},
			onLose:function(player){
				if(!player) return ;
				player.removeSkill('yk_jxjg');
				player.removeSkill('yk_jxjg_equip');
				player.removeSkill('yk_jxjg_draw');
			},
			translation:'积蓄金罐',
			info:'拥有此塔罗牌且未装备【木牛流马】时，视为拥有不可移动的【木牛流马】（即【积蓄金罐】），你使用【木牛流马】时，改为摸两张牌，拥有此塔罗牌时，你的摸牌阶段，有(10*a%)的概率令摸排数+1（a为【积蓄金罐】中的牌数）；若你已装备【木牛流马】，则将【木牛流马】中所有的牌转移至【积蓄金罐】中，然后你弃置【木牛流马】并摸两张牌。失去此塔罗牌时。移除【积蓄金罐】并获得所有其中的牌。',
		},
	}
	lib.skill.ykfuji={
		init:function(player){
			player.updateTarot=function(){
				player.node.ykTarotShow.innerHTML='塔罗牌数：'+(player.yk_tarot==undefined?0:player.yk_tarot.length)+'<br>塔罗牌堆：'+(lib.yk_tarotList==undefined?0:lib.yk_tarotList.length)+'张';
			}
			player.checkTarotGroup=function(name,returntype){
				if(lib.tarot_group[name].condition){
					var num=0;
					var list=[];
					for(var item of lib.tarot_group[name].condition){
						for(var item2 of player.yk_tarot){
							if(list.indexOf('tarot_'+item)==-1&&'tarot_'+item==item2[2]){
								num++;
								list.push('tarot_'+item);
							}
						}
					}
					if(returntype=='item') return list;
					else return num;
				}
				else return false;
			}
			player.showTarotGroupInfo=function(){
				if(!player.yk_tarot||!lib.tarot_group) return '';
				var info='';
				for(var x in lib.tarot_group){
					if(player.checkTarotGroup(x)>=Math.min((lib.tarot_group[x].condition.length==undefined?0:lib.tarot_group[x].condition.length),3)){
						info+='<br><br>套装-<b><font color=orange>已激活</font></b>-<b><font color=orange>'+lib.tarot_group[x].translation+'</font></b><br>进度（<font color=orange>'+player.checkTarotGroup(x)+'</font>/'+Math.min((lib.tarot_group[x].condition.length==undefined?0:lib.tarot_group[x].condition.length),3)+'）<br>';
						var list=player.checkTarotGroup(x,'item');
						var list2=[];
						var list3=[];
						for(var c1 of lib.tarot_group[x].condition){
							for(var c of list){
								if(list3.indexOf('tarot_'+c1)==-1){
									list3.push('tarot_'+c1);
									list2.push(('tarot_'+c1==c?'<b>':'')+'<font color='+('tarot_'+c1==c?'orange':'white')+'>'+get.translation('tarot_'+c1)+'</font>'+('tarot_'+c1==c?'</b>':''));
								}
							}
						}
						info+='卡组【'+list2+'】效果：<br>';
						info+=lib.tarot_group[x].info;
					}
				}
				for(var x in lib.tarot_group){
					if(player.checkTarotGroup(x)<Math.min((lib.tarot_group[x].condition.length==undefined?0:lib.tarot_group[x].condition.length),3)){
						if(player.checkTarotGroup(x)>0){
							info+='<br><br>套装-<b>未激活</b>-<b>'+lib.tarot_group[x].translation+'</b><br>进度（<font color=orange>'+player.checkTarotGroup(x)+'</font>/'+Math.min((lib.tarot_group[x].condition.length==undefined?0:lib.tarot_group[x].condition.length),3)+'）<br>';
							var list=player.checkTarotGroup(x,'item');
							var list2=[];
							var list3=[];
							for(var c1 of lib.tarot_group[x].condition){
								for(var c of list){
									if(list3.indexOf('tarot_'+c1)==-1){
										list3.push('tarot_'+c1);
										list2.push(('tarot_'+c1==c?'<b>':'')+'<font color='+('tarot_'+c1==c?'orange':'white')+'>'+get.translation('tarot_'+c1)+'</font>'+('tarot_'+c1==c?'</b>':''));
									}
								}
							}
							info+='卡组【'+list2+'】效果：<br>';
							info+=lib.tarot_group[x].info;
						}
					}
				}
				return info;
			}
			player.changeTargetShow=function(bool){
				if(window.yk_isFujiNow) return ;
				player.updateTarot();
				if(!window.yk_fujiResult){
					window.yk_fujiResult=ui.create.dialog('当前扶乩结果',[player.yk_tarot,'vcard'],'<small>'+player.showTarotGroupInfo()+'</small>');
				}
				else{
					if(window.yk_fujiResult){
						window.yk_fujiResult.delete();
						delete window.yk_fujiResult;
						window.yk_fujiResult=undefined;
					}
				}
				if(!bool){
					setTimeout(function(){
						if(window.yk_fujiResult){
							window.yk_fujiResult.delete();
							delete window.yk_fujiResult;
							window.yk_fujiResult=undefined;
						}
					},3000);
				};
			}
			if(!player.node.ykTarotShow){
				player.node.ykTarotShow=ui.create.dialog('hidden');
				player.node.ykTarotShow.style.cssText ="left:0%;height:40px;width:100%;bottom:0%;box-shadow:none;";
				player.node.ykTarotShow.style.opacity=0.65;
				player.node.ykTarotShow.style.backgroundColor='black';
				player.node.ykTarotShow.style.borderRadius='8px';
				player.node.ykTarotShow.style['z-index']=9999;
				player.node.ykTarotShow.innerHTML='塔罗牌数：'+(player.yk_tarot==undefined?0:player.yk_tarot.length)+'<br>塔罗牌堆：'+(lib.yk_tarotList==undefined?0:lib.yk_tarotList.length)+'张';
				player.node.ykTarotShow.onclick=player.changeTargetShow;
				player.appendChild(player.node.ykTarotShow);
			}
			lib.tarotInfo={
				'0':{
					name:'愚者',
					onEquip:function(player){
						'step 0'
						if(!player) return ;
						player.popup('愚者');
						var cards=player.getCards('h',{type:"trick"});
						cards=cards.concat(player.getCards('h',{type:"delay"}));
						var num=cards.length;
						if(num){
							player.discard(cards);
							var cards=[];
							while(cards.length<num){
								var card=get.cardPile2(function(card){
									return get.type(card)!='trick'&&get.type(card)!='delay'&&!cards.contains(card);
								});
								if(!card) break;
								else cards.push(card);
							}
							if(cards.length) player.gain(cards,'gain2');
						}
					},
					onLose:function(player){
						'step 0'
						if(!player) return ;
						player.popup('愚者');
						var cards=player.getCards('h');
						var cardsx=[];
						for(var card of cards) if(get.type(card,player)!='trick'&&get.type(card,player)!='delay') cardsx.push(card);
						var num=cardsx.length;
						if(num){
							player.discard(cardsx);
							var cards=[];
							while(cards.length<num){
								var card=get.cardPile2(function(card){
									return (get.type(card)=='trick'||get.type(card)=='delay')&&!cards.contains(card);
								});
								if(!card) break;
								else cards.push(card);
							}
							if(cards.length) player.gain(cards,'gain2');
						}
					},
					info:'获得/失去此塔罗牌时，弃置所有锦囊和延时锦囊手牌并获得等同于弃牌数量的非锦囊非延时锦囊牌/弃置所有非锦囊非延时锦囊手牌并获得等同于弃牌数量的其他牌。<br><font color=grey><i>————“智者千虑必有一失，愚者千虑必有一得。”</i></font>',
				},
				'1':{
					name:'魔法师',
					onEquip:function(player){
						if(!player) return ;
						player.popup('魔法师');
						player.changeHujia();
						player.draw();
					},
					onLose:function(player){
						if(!player) return ;
						player.popup('魔法师');
						if(player.hujia<=0) player.discard(player.getCards('he').randomGet());
						else player.changeHujia(-1);
					},
					info:'获得此塔罗牌时，获得一点护甲并摸一张牌；失去此塔罗牌时，移除一点护甲，若没有护甲，你随机弃一张牌。<br><font color=grey><i>————“魔法的顶端，也不能创造生命。”</i></font>',
				},
				'2':{
					name:'大祭司',
					onEquip:function(player){
						if(!player) return ;
						player.popup('大祭司');
						if(typeof player.ykfuji_ming!='number') player.ykfuji_ming=0;
						player.ykfuji_ming++;
						if(typeof player.ykfuji_time=='number'&&player.ykfuji_time>0) player.ykfuji_time--;
					},
					onLose:function(player){
						if(!player) return ;
						player.popup('大祭司');
						if(typeof player.ykfuji_ming!='number') player.ykfuji_ming=0;
						player.ykfuji_ming++;
					},
					info:'获得此塔罗牌时，本次【扶乩】命值+1，且不计入次数；弃置此塔罗牌时，命值+1。<br><font color=grey><i>————“我看见了未来，在璀璨的火光中，在时间的缝隙中，在命运的尽头中。”</i></font>',
				},
				'3':{
					name:'皇后',
					onEquip:function(player){
						if(!player) return ;
						if(player.sex=='female'){
							var list=[];
							for(var pl of game.players){
								if(pl.sex!=player.sex) list.push(pl);
							}
							if(list.length>0){
								player.popup('皇后');
								var plx=list.randomGet();
								plx.goMad({player:'phaseAfter'});
								plx.popup('混乱');
								player.line(plx,'yellow');
							}
						}
					},
					onLose:function(player){
						if(!player) return ;
						player.popup('皇后');
						var list=[];
						for(var pl of game.players){
							if(pl.sex!=player.sex) list.push(pl);
						}
						if(list.length>0) var plx=list.randomGet();
						if(plx){
							player.popup('皇后');
							if(player.countGainableCards(plx,'he')){
								plx.gainPlayerCard('he',player,true);
							}
							plx.line(player,'orange');
						}
					},
					info:'获得此塔罗牌时，若你为女性角色，令场上随机一名异性陷入混乱状态直到其回合结束；失去此塔罗牌时，场上随机一名异性角色获得你的一张手牌。<br><font color=grey><i>————“六宫粉黛无颜色，回眸一笑百媚生。”</i></font>',
				},
				'4':{
					name:'帝君',
					onEquip:function(player){
						if(!player) return ;
						player.popup('帝君');
						if(player==game.zhu||get.mode()!='identity'){
							player.gainMaxHp();
							player.draw(2);
						}
						else{
							player.old_zhu=game.zhu;
							game.zhu=player;
							player.old_zhu.identity=player.identity;
							player.old_zhu.setIdentity('猜');
							player.identity='zhu';
							player.setIdentity('<span class="redtext">主</span>');
							player.identityShown=true;
							player.gainMaxHp();
							player.recover();
							player.draw();
						}
					},
					onLose:function(player){
						if(!player) return ;
						player.popup('帝君');
						if(!player.old_zhu||get.mode()!='identity'){
							player.loseMaxHp();
							player.chooseToDiscard('he',Math.min(1,player.countCards('he')),true);
						}
						else{
							player.identity=player.old_zhu.identity;
							player.setIdentity('猜');
							game.zhu=player.old_zhu;
							player.old_zhu.identity='zhu';
							player.old_zhu.setIdentity('<span class="redtext">主</span>');
							player.loseHp();
							player.loseMaxHp();
							var cards=player.getCards('h');
							var suitList=[];
							for(var card of cards){
								if(suitList.indexOf(get.suit(card,player))==-1) suitList.push(get.suit(card,player));
							}
							var suit=suitList.randomGet();
							var list=[];
							for(var card of cards) if(get.suit(card,player)==suit) list.push(card);
							player.discard(list);
							player.old_zhu=undefined;
						}
					},
					info:'获得此塔罗牌时，若你不为主公，则你与主公互换身份并获得一点体力值和体力上限，摸一张牌；失去此塔罗牌时，你与以此法失去主公身份的角色换回身份（若已阵亡则随机选取），失去一点体力值和体力上限，弃置手牌中随机一种花色的所有牌。若你为主公或非身份模式下，则你增加一点体力上限并摸两张牌，失去此塔罗牌时，失去一点体力上限并弃一张牌。<br><font color=grey><i>————“天子之怒，伏尸百万，流血千里。”</i></font>',
				},
				'5':{
					name:'圣职者',
					onEquip:function(player){
						"step 0"
						if(!player) return ;
						player.popup('圣职者');
						var target=game.players.randomGet();
						target.draw();
						if(target!=player){
							target.recover();
						}
						else{
							player.draw();
						}
					},
					onLose:function(player){
						if(!player) return ;
						player.popup('圣职者');
						player.draw();
					},
					info:'获得此塔罗牌时，随机选择一名角色，其摸一张牌，若该角色不为你自己，则其再回复一点体力，否则你摸一张牌；弃置此塔罗牌时，你摸一张牌。<br><font color=grey><i>————“光明不灭，天道永存。”</i></font>',
				},
				'6':{
					name:'情侣',
					onEquip:function(player){
						if(!player) return ;
						lib.skill.yk_qinglv={
							enable:"phaseUse",
							filter:function(event,player){
								if(!player.yk_qinglv_selected) return false;
								player.storage.yk_qinglv=player.yk_qinglv_selected.getCards('hs');
								player.storage.yk_qinglv_evt=event;
								for(var card of player.storage.yk_qinglv) if(event.filterCard(card,player,event)){
									return true;
								}
								return false;
							},
							content:()=>{
								'step 0'
								var list=[];
								for(var cardx of player.yk_qinglv_selected.getCards('hs')){
									if(player.storage.yk_qinglv_evt.filterCard({name:cardx.name},player,player.storage.yk_qinglv_evt)) list.push(cardx);
								}
								var dialog=ui.create.dialog('【情侣】：使用结姻目标的卡牌',[list,'vcard']);
								if(list.length) player.chooseButton(dialog).set('ai',button=>{
									if(get.attitude(player,player.yk_qinglv_selected)>0) return -get.value(button.link,player.yk_qinglv_selected);
									else return get.value(button.link,player.yk_qinglv_selected);
								});
								'step 1'
								if(result.bool){
									result.bool=null;
									event.card=result.links[0];
									if(lib.card[event.card.name].selectTarget!=-1) player.chooseTarget((lib.card[event.card.name].selectTarget||1),'请选择使用【'+get.translation(get.name(event.card,player))+'】的目标',function(card,player,target){
										if(typeof lib.card[event.card.name].filterTarget=='function') return lib.card[event.card.name].filterTarget(event.card,player,target);
										else if(lib.card[event.card.name].filterTarget==true||lib.card[event.card.name].filterTarget==undefined) return true;
										return false;
									});
									else{
										event.target=[];
										if(typeof lib.card[event.card.name].filterTarget=='function'){for(var target of game.players) if(lib.card[event.card.name].filterTarget(event.card,player,target)) event.target.push(target);}
										else event.target=game.players;
										result.bool=true;
									}
								}
								'step 2'
								if(result.bool){
									if(!event.target) event.target=result.targets;
									var owner=get.owner(event.card);
									if(owner){
										owner.lose(event.card,ui.special);
									}
									player.useCard(event.card,event.target).animate=true;
								}
							},
							group:["yk_qinglv_respond"],
							subSkill:{
								respond:{
									trigger:{
										player:"chooseToRespondBefore",
									},
									filter:(event,player)=>{
										if(event.responded) return false;
										if(!player.yk_qinglv_selected) return false;
										player.storage.yk_qinglv=player.yk_qinglv_selected.getCards('hs');
										player.storage.yk_qinglv_evt=event;
										for(var card of player.storage.yk_qinglv) if(event.filterCard({name:card.name},player,event)){
											return true;
										}
										return false;
									},
									content:()=>{
										'step 0'
										var list=[];
										for(var cardx of player.yk_qinglv_selected.getCards('hs')){
											if(trigger.filterCard({name:cardx.name},player,trigger)) list.push(cardx);
										}
										var dialog=ui.create.dialog('【情侣】：使用结姻目标的卡牌',[list,'vcard']);
										if(list.length) player.chooseButton(dialog).set('ai',button=>{
											if(get.attitude(player,player.yk_qinglv_selected)>0) return -get.value(button.link,player.yk_qinglv_selected);
											else return get.value(button.link,player.yk_qinglv_selected);
										});
										'step 1'
										if(result.bool){
											var owner=get.owner(result.links[0]);
											if(owner){
												owner.lose(result.links[0],ui.special);
											}
											event.card=result.links[0];
											player.$throw(result.links[0]);
											event.finish();
											trigger.result={bool:true,card:event.card};
											trigger.responded=true;
											trigger.animate=false;
											trigger.untrigger();
										}
									},
								},
							},
							ai:{
								order:8,
								result:{
									target:function(player,target){
										var list=[];
										for(var card of player.storage.yk_qinglv) list.push(get.effect(target,card,player,target));
										if(get.attitude(player,target)>0) return Math.min(list);
										else return Math.max(list);
									},
									player:1,
								},
							},
						}
						lib.translate.yk_qinglv='情侣';
						lib.translate.yk_qinglv_info='你与结姻的目标共享手牌';
						var next = game.createEvent('yk_qinglv');
						next.setContent(function(){
							'step 0'
							player.chooseTarget('请选择【结姻】的目标',function(card,player,target){
								return player.sex!=target.sex;
							});
							'step 1'
							if(result.bool){
								var target=result.targets[0];
								player.popup('情侣');
								target.popup('情侣');
								player.line(target,'green');
								player.recover();
								target.recover();
								target.yk_qinglv_selected=player;
								player.yk_qinglv_selected=target;
								target.addSkill('yk_qinglv');
								player.addSkill('yk_qinglv');
							}
						});
						next.set('player',player);
						return next;
					},
					onLose:function(player){
						if(!player) return ;
						var target=player.yk_qinglv_selected;
						target.damage(1,player);
						player.damage(1,target);
						target.removeSkill('yk_qinglv');
						player.removeSkill('yk_qinglv');
						delete target.yk_qinglv_selected;
						target.yk_qinglv_selected=null;
						delete player.yk_qinglv_selected;
						player.yk_qinglv_selected=null;
						delete lib.skill.yk_qinglv_respond;
						lib.skill.yk_qinglv_respond=null;
						delete lib.skill.yk_qinglv;
						lib.skill.yk_qinglv=null;
					},
					info:'获得此塔罗牌时，如果场上存在异性角色，则随机选择一个异性角色，视为对其发动不弃牌的【结姻】（优先对友方角色使用）：你与其各回复一点体力；结姻期间，你与目标共享手牌。失去此塔罗牌时失去此效果，同时你与其各自受到一点来自对方的伤害。<br><font color=grey><i>————“夜月一帘幽梦，春风十里柔情。”</i></font>',
				},
				'7':{
					name:'骑士',
					onEquip:function(player){
						if(!player) return ;
						player.popup('骑士');
						player.changeHujia();
					},
					onLose:function(player){
						if(!player) return ;
						player.popup('骑士');
						var num=player.hujia;
						player.changeHujia(-num);
						player.draw(num);
					},
					info:'获得此塔罗牌时，你获得一点护甲；失去此塔罗牌时，你失去所有护甲，并摸等量手牌。<br><font color=grey><i>————“朔气传金柝，寒光照铁衣。”</i></font>',
				},
				'8':{
					name:'力量',
					onEquip:function(player){
						if(!player) return ;
						player.popup('力量');
						player.draw(3);
						player.changeHujia(2);
						player.recover();
					},
					onLose:function(player){
						if(!player) return ;
						player.popup('力量');
						var numc=player.countCards('h');
						var hujia=player.hujia;
						if(numc<2){
							if(numc>0) player.chooseToDiscard('he',numc,true);
							player.damage(2-numc,'nosource');
						}
						else{
							player.chooseToDiscard('he',2,true);
						}
						if(hujia<2){
							if(hujia>0) player.changeHujia(-hujia);
							player.damage(2-hujia,'nosource');
						}
						else{
							player.changeHujia(-hujia);
						}
					},
					info:'获得此塔罗牌时，你摸三张牌并获得两点护甲，回复一点生命值；失去此塔罗牌时，你弃置两张牌并移除两点护甲，每少一张牌/一点护甲，你受到一点无来源伤害。<br><font color=grey><i>————“透支的力量总是有代价的。”</i></font>',
				},
				'9':{
					name:'隐士',
					onEquip:function(player){
						if(!player) return ;
						player.popup('隐士');
						var cards=player.getCards('he',{type:"equip"});
						player.discard(cards);
						player.addTempSkill('qianxing',{player:["phaseBefore","equipBegin"]});
					},
					onLose:function(player){
						if(!player) return ;
						player.popup('隐士');
						var list=[];
						for(var i in lib.card){
							if(lib.card[i].type='equip') list.push(i);
						}
						if(list.length) player.gain(game.createCard(list.randomGet()),'gain2');
					},
					info:'获得此塔罗牌时，你弃置所有装备牌，然后直到你下一回合开始或下一次使用装备牌前，获得【潜行】，失去此塔罗牌时，你获得一张装备牌。<br><font color=grey><i>————“鸟尽弓藏，兔死狗烹，解甲归田，马放南山。”</i></font>',
				},
				'10':{
					name:'幸运之轮',
					onEquip:function(player){
						if(!player) return ;
						player.popup('幸运之轮');
						if(_status.event.name!='tarot_10'){
							var name=_status.event.name;
							_status.event.name='tarot_10';
						}
						player.judge(function(card){
							var num=Math.ceil(get.number(card)/2);
							if(num-player.countCards('h')>0){player.draw(num-player.countCards('h'));}
							else if(num-player.countCards('h')<0){player.discard(player.getCards('h').randomGets(player.countCards('h')-num));}
							return num;
						});
						if(name) _status.event.name=name;
					},
					onLose:function(player){
						if(!player) return ;
						player.popup('幸运之轮');
					},
					info:'获得此塔罗牌时，进行一次判定，然后将手牌数变为此判定牌点数的一半（向上取整）。<br><font color=grey><i>————“是时候展现真正的欧气了！”</i></font>',
				},
				'11':{
					name:'审判者',
					onEquip:function(player){
						if(!player) return ;
						player.popup('审判者');
						var num=player.countCards('h',{name:"sha"});
						if(num<2) for(var i=0;i<2-num;i++) player.gain(game.createCard('sha'));
						var num=player.countCards('h');
						if(num<3) player.draw(3-num);
					},
					onLose:function(player){
						if(!player) return ;
						player.popup('审判者');
						var sha=player.getCards('h',{name:"sha"});
						player.discard(sha);
					},
					info:'获得此塔罗牌时，若你手中的“杀”小于两张，则你将“杀”补至两张，之后若你的手牌数小于三张，则你将手牌补至三张，失去此塔罗牌时，弃置所有“杀”。<br><font color=grey><i>————“开天眼，明是非，断善恶。”</i></font>',
				},
				'12':{
					name:'吊死鬼',
					onEquip:function(player){
						if(!player) return ;
						player.popup('吊死鬼');
						var hp=player.hp-1;
						if(hp>0){
							var gainList=[];
							for(var i=0;i<hp;i++){
								var card=game.createCard('sha');
								gainList.push(card);
							}
							player.gain(gainList);
							player.loseHp(hp);
						}
						lib.skill.yk_nobanned={
							mod:{
								targetInRange:function(card,player){
									return true;
								},
								cardUsable:function(card,player){
									return Infinity;
								},
							},
						}
						lib.translate['yk_nobanned']='吊死鬼';
						lib.translate['yk_nobanned_info']='本回合用牌无距离和次数限制';
						player.addTempSkill('yk_nobanned',{player:"phaseAfter"});
						lib.skill.yk_ghost={
							init:function(player){
								player.loseMaxHp();
							},
							onremove:function(player){
								player.gainMaxHp();
							},
							trigger:{
								source:"damageEnd",
							},
							filter:function(event,player){
								return event.player!=player;
							},
							forced:true,
							content:function(){
								player.removeSkill('yk_ghost');
								trigger.player.addSkill('yk_ghost');
							},
						}
						lib.translate['yk_ghost']='厉鬼';
						lib.translate['yk_ghost_info']='厉鬼状态，减少一点体力上限直到你造成伤害；你造成伤害的目标，若其未处于【厉鬼】状态，则其进入【厉鬼】状态';
						player.addSkill('yk_ghost');
					},
					onLose:function(player){
						if(!player) return ;
						player.popup('吊死鬼');
						player.removeSkill('yk_ghost');
					},
					info:'获得此塔罗牌时，流失体力值至一，并获得等同于流失体力值数量的“杀”（向下取整），本回合使用牌无距离和次数限制，且你进入【厉鬼】状态：减少一点体力上限直到造成伤害；造成伤害的目标，若其未处于【厉鬼】状态，则其进入【厉鬼】状态。移除该塔罗牌时，退出【厉鬼】状态，退出此状态的角色增加一点体力上限。<br><font color=grey><i>————“从来都没有魔鬼，又或者，每个人都是魔鬼。”</i></font>',
				},
				'13':{
					name:'死神',
					onEquip:function(player){
						if(!player) return ;
						player.popup('死神');
						var maxHp=player.maxHp-1;
						if(maxHp>0){
							var gainList=[];
							for(var i=0;i<maxHp;i++){
								var card=game.createCard('sha');
								var card=game.createCard('sha');
								gainList.push(card);
							}
							player.gain(gainList);
							player.loseMaxHp(maxHp);
						}
						else if(maxHp==0){
							var maxHp=player.maxHp;
							var gainList=[];
							for(var i=0;i<maxHp;i++){
								var card=game.createCard('sha');
								var card=game.createCard('sha');
								gainList.push(card);
							}
							player.gain(gainList);
							player.maxHp=0;
							player.update();
						}
						lib.skill.yk_nobanned2={
							mod:{
								ignoredHandcard:function (card,player){
									if(get.name(card,player)=='sha'){
										return true;
									}
								},
							},
							trigger:{
								player:"useCard2",
							},
							forced:true,
							content:function(){
								trigger.directHit.addArray(game.players);
							},
						}
						lib.translate['yk_nobanned2']='死神';
						lib.translate['yk_nobanned2_info']='本回合使用牌不可被响应且“杀”不计入手牌上限';
						player.addTempSkill('yk_nobanned2',{player:"phaseAfter"});
						lib.skill.yk_tarot_sishen={
							onremove:function(player){
								if(player.yk_tarot_sishenDamage){
									player.yk_tarot_sishenDamage=undefined;
									var maxHp=lib.character[player.name][2];
									if(typeof maxHp=='string'){
										var maxHp=maxHp.slice(maxHp.indexOf('/')+1,maxHp.length);
									}
									player.maxHp=maxHp;
									player.update();
									player.draw(player.hujia);
									player.changeHujia(-player.hujia);
								}
							},
							trigger:{
								global:"phaseBegin",
							},
							filter:function(event,player){
								if(event.player!=player) return player.hujia>0;
								else return true;
							},
							forced:true,
							content:function(){
								"step 0"
								if(trigger.player==player){
									player.removeSkill('yk_nobanned2');
									return ;
								}
								player.chooseControl('出杀','取消').set('prompt','是否移除一点护甲，对'+get.translation(_status.currentPhase.name)+'使用一张“杀”？');
								"step 1"
								if(result.control=='出杀'){
									player.changeHujia(-1);
									player.useCard(game.createCard('sha'),trigger.player);
								}
							},
						}
						lib.translate['yk_tarot_sishen']='死神';
						lib.translate['yk_tarot_sishen_info']='其他角色的回合开始时，你可以移除一点护甲视为其使用一张杀，你的下个回合开始时，弃置所有护甲并摸等量的牌，然后移除【死神】效果，若在此期间你有因【死神】效果造成过伤害，则你修复体力上限。';
						player.addSkill('yk_nobanned2');
						lib.skill.yk_tarot_sishen2={
							trigger:{
								source:"damageAfter",
							},
							filter:function(event,player){
								return event.card&&event.card.name=='sha'&&player.countCards('e');
							},
							forced:true,
							content:function(){
								player.changeHujia(2);
								player.draw();
								player.yk_tarot_sishenDamage=true;
							},
						}
						
					},
					onLose:function(player){
						if(!player) return ;
						player.popup('死神');
						player.removeSkill('yk_nobanned2');
					},
					info:'获得此塔罗牌时，将体力上限减少至一（若为一则减少至零），每减少一点体力上限，你获得两张“杀”。你本回合内使用牌不可被响应且“杀”不计入手牌上限。【死神】：你拥有此塔罗牌时，其他角色的回合开始时，你可以移除一点护甲视为对其使用一张杀。在此期间你的“杀”造成伤害时，你获得两点护甲并摸两张牌。你的下个回合开始时，弃置所有护甲并摸等量的牌，然后移除【死神】效果，若在此期间你有因【死神】效果造成过伤害，则你修复体力上限。<br><font color=grey><i>————“你既能忍受强烈的死寂来到我的面前，内心一定有永不熄灭的愿望吧。”</i></font>',
				},
				'14':{
					name:'节制',
					onEquip:function(player){
						if(!player) return ;
						player.popup('节制');
						lib.skill.yk_tarot_jiezhi={
							trigger:{
								player:["phaseAfter","useCardBegin"],
							},
							direct:true,
							forced:true,
							silent:true,
							filter:function(event,player){
								if(event.name=='useCard'){
									var card=event.card;
									if(!card&&event.cards) card=event.cards[0];
									if(card&&get.name(card,player)=='sha'){
										if(!player.yk_tarot_useShaRecord) player.yk_tarot_useShaRecord=0;
										player.yk_tarot_useShaRecord++;
										return false;
									}
									else if(get.type(card,player)=='trick'){
										if(!player.yk_tarot_useTrickRecord) player.yk_tarot_useTrickRecord=0;
										player.yk_tarot_useTrickRecord++;
										return false;
									}
								}
								else return true;
							},
							content:function(){
								if(!player.yk_tarot_useTrickRecord) player.draw(2);
								if(!player.yk_tarot_useShaRecord) player.draw();
							},
						}
						lib.translate['yk_tarot_jiezhi']='节制';
						lib.translate['yk_tarot_jiezhi_info']='每个回合结束时，若你的回合内未使用锦囊牌时，额外摸两张牌，未使用杀时，则你额外摸一张牌。';
						player.addSkill('yk_tarot_jiezhi');
					},
					onLose:function(player){
						if(!player) return ;
						player.popup('节制');
						player.removeSkill('yk_tarot_jiezhi');
					},
					info:'拥有此塔罗牌时，每个回合结束时，若你的回合内未使用锦囊牌时，额外摸两张牌，未使用杀时，则你额外摸一张牌。<br><font color=grey><i>————“卧薪尝胆，忍辱前行。”</i></font>',
				},
				'15':{
					name:'恶魔',
					onEquip:function(player){
						if(!player) return ;
						player.popup('恶魔');
						lib.skill.yktarot_emo1={
							init:function(player){
								player.popup('恶魔');
								var nh=player.countCards('h');
								if(nh>player.yk_old_maxHp) player.chooseToDiscard('he',nh-player.yk_old_maxHp,true)._triggered=null;
								else player.draw('he',player.yk_old_maxHp-nh,true)._triggered=null;
							},
							trigger:{
								player:["gainAfter","loseAfter"],
							},
							forced:true,
							content:function(){
								player.popup('恶魔');
								var nh=player.countCards('h');
								if(nh>player.yk_old_maxHp) player.chooseToDiscard('he',nh-player.yk_old_maxHp,true)._triggered=null;
								else player.draw('he',player.yk_old_maxHp-nh,true)._triggered=null;
							},
						};
						lib.skill.yktarot_emo2={
							init:function(player){
								player.popup('恶魔');
								var nh=player.countCards('h');
								if(nh>player.maxHp) player.chooseToDiscard('he',nh-player.maxHp,true)._triggered=null;
								else player.draw('he',player.maxHp-nh,true)._triggered=null;
							},
							trigger:{
								player:["gainAfter","loseAfter"],
							},
							forced:true,
							content:function(){
								player.popup('恶魔');
								var nh=player.countCards('h');
								if(nh>player.maxHp) player.chooseToDiscard('he',nh-player.maxHp,true)._triggered=null;
								else player.draw('he',player.maxHp-nh,true)._triggered=null;
							},
						}
						lib.skill.yktarot_emo={
							init:function(player){
								player.yk_old_maxHp=player.maxHp;
								player.loseMaxHp(player.maxHp-1);
								if(_status.currentPhase!=player) player.addSkill('yktarot_emo1');
								else player.addSkill('yktarot_emo2');
							},
							onremove:function(player){
								player.maxHp=player.yk_old_maxHp;
								player.update();
							},
							trigger:{
								player:["phaseZhunbeiBegin","phaseAfter"],
							},
							forced:true,
							content:function(){
								if(trigger.name=='phase'){
									player.addSkill('yktarot_emo1');
									if(player.hasSkill('yktarot_emo2')) player.removeSkill('yktarot_emo2');
									var hujia=Math.abs(player.yk_old_maxHp-player.maxHp);
									if(!player.hujia||player.hujia<hujia) player.changeHujia(hujia-player.hujia);
								}
								else{
									player.addSkill('yktarot_emo2');
									if(player.hasSkill('yktarot_emo1')) player.removeSkill('yktarot_emo1');
								}
							},
						}
						lib.translate['yktarot_emo']='恶魔';
						lib.translate['yktarot_emo_info']='拥有此塔罗牌时，体力上限减少至一（若为一则减少至零），你的回合内的手牌数始终等于体力上限，你的回合外的手牌数始终为原体力上限，每个回合结束时，你的护甲值重置为两体力上限之间的差值，当你移除最后一点护甲时，你流失一点体力；失去此塔罗牌时，你恢复原体力上限（不恢复体力）';
						player.addSkill('yktarot_emo');
						var nh=player.countCards('h');
						if(nh>player.maxHp) player.chooseToDiscard('he',nh-player.maxHp,true)._triggered=null;
						else player.draw('he',player.maxHp-nh,true)._triggered=null;
					},
					onLose:function(player){
						if(!player) return ;
						player.popup('恶魔');
						player.removeSkill('yktarot_emo');
						if(player.hasSkill('yktarot_emo1')) player.removeSkill('yktarot_emo1');
						if(player.hasSkill('yktarot_emo2')) player.removeSkill('yktarot_emo2');
					},
					info:'获得此塔罗牌时，体力上限减少至一，你的回合内的手牌数始终等于体力上限，你的回合外的手牌数始终为原体力上限，每个回合结束时，你的护甲值重置为两体力上限之间的差值，当你移除最后一点护甲时，你流失一点体力；失去此塔罗牌时，你恢复原体力上限（不恢复体力）<br><font color=grey><i>————“先帝将死，新君未立，但帝国不会崩毁，因为你将踏着诸王的白骨，登上皇之座。”</i></font>',
				},
				'16':{
					name:'高塔',
					onEquip:function(player){
						if(!player) return ;
						player.popup('高塔');
						lib.skill.yktarot_gaota={
							mod:{
								globalFrom:function(from,to,distance){
									return -Infinity;
								},
								globalTo:function(from,to,distance){
									return Infinity;
								},
							},
							trigger:{
								player:"phaseDrawBefore",
							},
							forced:true,
							silent:true,
							content:function(){
								trigger.num=1;
							},
						}
						lib.translate['yktarot_gaota']='高塔';
						lib.translate['yktarot_gaota_info']='拥有此塔罗牌时，你的摸牌阶段的摸牌数变为一，你的攻击和防御距离变为无限。';
						player.addSkill('yktarot_gaota');
					},
					onLose:function(player){
						if(!player) return ;
						player.popup('高塔');
						player.removeSkill('yktarot_gaota');
					},
					info:'拥有此塔罗牌时，你的摸牌阶段的摸牌数变为一，你的攻击和防御距离变为无限。<br><font color=grey><i>————“我站在高塔上。我看不到世界的尽头。”</i></font>',
				},
				'17':{
					name:'繁星',
					onEquip:function(player){
						if(!player) return ;
						player.popup('繁星');
						player.loseMaxHp();
						player.addSkill('guanxing');
					},
					onLose:function(player){
						if(!player) return ;
						player.popup('繁星');
						player.gainMaxHp();
						player.removeSkill('guanxing');
					},
					info:'获得此塔罗牌时，你减少一点体力上限，获得技能【观星】；失去此塔罗牌时，你获得一点体力上限，移除技能【观星】。<br><font color=grey><i>————“他们的身后，是光也照不亮的黑暗。”</i></font>',
				},
				'18':{
					name:'皎月',
					onEquip:function(player){
						if(!player) return ;
						player.popup('皎月');
						for(var pl of game.players){pl.loseHp();pl.draw(2);}
						if(Math.random()<0.5) player.recover();
					},
					onLose:function(player){
						if(!player) return ;
						player.popup('皎月');
					},
					info:'获得此塔罗牌时，场上所有角色失去一点体力值，并摸两张牌，之后你有50%概率回复一点体力。<br><font color=grey><i>————“月色真美。”</i></font>',
				},
				'19':{
					name:'曜日',
					onEquip:function(player){
						if(!player) return ;
						player.popup('曜日');
						for(var pl of game.players){pl.recover();pl.chooseToDiscard('he',Math.min(2,pl.countCards('he')),true)}
						player.draw();
					},
					onLose:function(player){
						if(!player) return ;
						player.popup('曜日');
					},
					info:'获得此塔罗牌时，场上所有角色回复一点体力值，并弃置两张牌，之后你摸一张牌。<br><font color=grey><i>————“阳光，会带来温暖。”</i></font>',
				},
				'20':{
					name:'审判',
					onEquip:function(player){
						if(!player) return ;
						player.popup('审判');
						var list=[];
						for(var i in lib.card){
							if(lib.card[i].type=='equip'&&lib.card[i].subtype=='equip1') list.push(i);
						}
						if(list.length) player.gain(game.createCard(list.randomGet()),'gain2');
					},
					onLose:function(player){
						if(!player) return ;
						player.popup('审判');
						var card=player.getCards('he',{type:"equip",subtype:"equip1"});
						if(card.length>0) var card=card.randomGet();
						if(card) player.discard(card);
					},
					info:'获得此塔罗牌时，获得一张武器牌；失去此塔罗牌时，随机弃置一张武器牌。<br><font color=grey><i>————“那么所谓的神明，又该由谁来审判呢？”</i></font>',
				},
				'21':{
					name:'世界',
					onEquip:function(player){
						if(!player) return ;
						player.popup('世界');
						player.loseMaxHp();
						var skills=[];
						for(var c in lib.character) if(lib.character[c][1]!='qxq_yk') skills=skills.concat(lib.character[c][3]);
						if(skills.length) var skill=skills.randomGet();
						if(skill) player.addTempSkill(skill,{player:"phaseAfter"});
						if(player.ykCheckConsume('Soul',50)){
							player.ykConsume('Soul',50,true);
							var skills=[];
							for(var c in lib.character) if(lib.character[c][1]!='qxq_yk') skills=skills.concat(lib.character[c][3]);
							if(skills.length) var skill=skills.randomGet();
							if(skill) player.addTempSkill(skill,{player:"phaseAfter"});
						}
					},
					onLose:function(player){
						if(!player) return ;
						player.popup('世界');
						player.draw();
						player.gainMaxHp();
					},
					info:'获得此塔罗牌时，你失去一点体力上限，从武将技能池中随机获得一个非云空武将的技能直到回合结束，若你此时元力值超过50，则消耗50元力值再获得一个随机的临时技能；失去此塔罗牌时，你摸一张牌并增加一点体力上限。<br><font color=grey><i>————“当你不放弃前行，整个世界都会向你敞开。”</i></font>',
				},
				'special0':{
					name:'绚烂魔法',
					onEquip:function(player){
						if(!player) return ;
						player.popup('绚烂魔法');
					},
					onLose:function(player){
						if(!player) return ;
						player.popup('绚烂魔法');
					},
					info:'拥有此塔罗牌时，你每弃一张牌，均有5%概率摸一张牌。<br><font color=grey><i>————“总有一天，我会向世人证明，魔法并没有他们想得那般阴暗！”</i></font>',
				},
				'special1':{
					name:'诡秘之剑',
					onEquip:function(player){
						if(!player) return ;
						player.popup('诡秘之剑');
					},
					onLose:function(player){
						if(!player) return ;
						player.popup('诡秘之剑');
					},
					info:'拥有此塔罗牌时，你使用武器牌时，额外获得一张“杀”，你使用“杀”时，有20%概率获得一点护甲。<br><font color=grey><i>————“既来者，执此剑，与吾一战吧。”</i></font>',
				},
				'special2':{
					name:'欢乐圣杯',
					onEquip:function(player){
						if(!player) return ;
						player.popup('欢乐圣杯');
					},
					onLose:function(player){
						if(!player) return ;
						player.popup('欢乐圣杯');
					},
					info:'拥有此塔罗牌时，你使用“桃”或“酒”时，有30%概率将护甲值转化为等量体力值，每转化两点，你额外摸一张牌。<br><font color=grey><i>————“这杯里有什么？”<br>————“快乐。”</i></font>',
				},
				'special3':{
					name:'积蓄金罐',
					onEquip:function(player){
						if(!player) return ;
						player.popup('积蓄金罐');
					},
					onLose:function(player){
						if(!player) return ;
						player.popup('积蓄金罐');
					},
					info:'拥有此塔罗牌且未装备【木牛流马】时，视为拥有不可移动的【木牛流马】（即【积蓄金罐】），你使用【木牛流马】时，改为摸两张牌，拥有此塔罗牌时，你的摸牌阶段，有(10*a%)的概率令摸排数+1（a为【积蓄金罐】中的牌数）；若你已装备【木牛流马】，则将【木牛流马】中所有的牌转移至【积蓄金罐】中，然后你弃置【木牛流马】并摸两张牌。<br><font color=grey><i>————“不积跬步无以至千里，不积小流无以成江海”</i></font>',
				},
			};
			for(var i in lib.tarotInfo){
				lib.card['tarot_'+i]={
					type:"tarot",
					image:'',
					enable:function(card,player){
						return false;
					},
					tarotNumber:i,
					usable:Infinity,
					updateUsable:"phaseUse",
					vanish:true,
					suitList:['spade', 'heart', 'club', 'diamond'].randomGet(),
					numberList:get.rand(1,13),
					distance:{},
					filterTarget:function(card,player,target){
						return target==player&&target.hp<target.maxHp;
					},
					modTarget:function(card,player,target){
						return target.hp<target.maxHp;
					},
					content:function(){
					},
					selectTarget:-1,
					toself:true,
					savable:true,
					onEquip:[],
					onLose:[],
					ai:lib.card['tao'].ai,
				};
				if(lib.device||lib.node) lib.card['tarot_'+i].image='ext:云空/qxq_yk_kongshanlingxue/tarot_'+i+'.jpg';
				else lib.card['tarot_'+i].image='db:extension-云空-qxq_yk_kongshanlingxue:tarot_'+i+'.jpg';
				lib.translate['tarot']='塔罗';
				lib.translate['tarot_'+i]=lib.tarotInfo[i].name;
				lib.translate['tarot_'+i+'_info']=lib.tarotInfo[i].info;
			}
			game.yk_washTarot=function(){
				var num=0;
				lib.yk_tarotList=[];
				while(num<21){
					lib.yk_tarotList.push(['','','tarot_'+num]);
					num++;
				}
				while(num<25){
					lib.yk_tarotList.push(['','','tarot_special'+(num-21)]);
					num++;
				}
				while(lib.yk_tarotList.length<78){
					var number=get.rand(0,21);
					lib.yk_tarotList.push(['','','tarot_'+number]);
				}
				lib.yk_tarotList.randomSort();
				lib.yk_tarotList_removeChild=lib.yk_tarotList.removeChild=function(child,type){
					if(type=='list'){
						for(var c of child) lib.yk_tarotList.removeChild(c);
					}
					else{
						if(lib.yk_tarotList.indexOf(child)==-1) return ;
						lib.yk_tarotList1=lib.yk_tarotList.slice(0,lib.yk_tarotList.indexOf(child));
						lib.yk_tarotList2=lib.yk_tarotList.slice(lib.yk_tarotList.indexOf(child)+1,lib.yk_tarotList.length);
						lib.yk_tarotList=lib.yk_tarotList1.concat(lib.yk_tarotList2);
						lib.yk_tarotList.removeChild=lib.yk_tarotList_removeChild;
					}
				};
				player.updateTarot();
			}
			player.yk_gainTarot=function(cardList,type){
				if(!cardList) return ;
				if(type=='list'){//同时两张以上
					for(var tarot of cardList) player.yk_gainTarot([tarot]);
					return ;
				}
				if(!player.yk_tarot){
					player.yk_tarot=[];
				}
				if(!player.yk_tarot.removeChild){
					player.yk_tarot_removeChild=player.yk_tarot.removeChild=function(child){
						if(player.yk_tarot.indexOf(child)==-1) return ;
						player.yk_tarot1=player.yk_tarot.slice(0,player.yk_tarot.indexOf(child));
						player.yk_tarot2=player.yk_tarot.slice(player.yk_tarot.indexOf(child)+1,player.yk_tarot.length);
						player.yk_tarot=player.yk_tarot1.concat(player.yk_tarot2);
						player.yk_tarot.removeChild=player.yk_tarot_removeChild;
						game.log(player,'移除塔罗牌<span class="yellowtext">'+get.translation(child[2])+'</span>！');
					};
				}
				for(var tarot of cardList){
					for(var t of player.yk_tarot){
						if(t[2]==tarot[2]){
							lib.yk_tarotList.removeChild(tarot);
							game.log(player,'已拥有塔罗牌<span class="yellowtext">'+get.translation(tarot[2])+'</span>，自动将本次【扶乩】结果置入塔罗牌弃牌堆！');
							game.log('塔罗牌堆失去塔罗牌<span class="yellowtext">'+get.translation(tarot[2])+'</span>！');
							return ;
						}
					}
				}
				player.yk_tarot=player.yk_tarot.concat(cardList);
				var word='';
				for(var card of cardList){
					word+='<span class="yellowtext">'+get.translation(card[2])+'</span>';
					game.log(player,'将塔罗牌'+word+'置于其武将牌上！');
					var number=card[2].slice(card[2].indexOf('tarot_')+6,card[2].length);
					if(lib.tarotInfo[number]&&typeof lib.tarotInfo[number].onEquip=='function') lib.tarotInfo[number].onEquip(player);
				}
				for(var card of cardList){
					lib.yk_tarotList.removeChild(card);
					game.log('塔罗牌堆失去塔罗牌<span class="yellowtext">'+get.translation(card[2])+'</span>！');
				}
				player.changeTargetShow(false);
				//检测套装
				for(var x in lib.tarot_group){
					if(player.checkTarotGroup(x)>=Math.min((lib.tarot_group[x].condition.length==undefined?0:lib.tarot_group[x].condition.length),3)){
						if(typeof lib.tarot_group[x].onEquip=='function') lib.tarot_group[x].onEquip(player);
					}
				}
				player.updateTarot();
			}
			player.yk_loseTarot=function(tarot,type,position){
				if(!tarot) return ;
				if(type&&type=='list'){
					if(position==lib) for(var t of tarot) lib.yk_tarotList.removeChild(t);
					else for(var t of tarot) player.yk_loseTarot(t);
					return ;
				}
				else{
					if(position==lib){
						lib.yk_tarotList.removeChild(tarot);
						game.log(player,'将塔罗牌<span class="yellowtext">'+get.translation(tarot[2])+'</span>置入塔罗牌弃牌堆！');
					}
					else{
						//套装移除前
						var list1=[];
						for(var x in lib.tarot_group){
							if(player.checkTarotGroup(x)>=Math.min((lib.tarot_group[x].condition.length==undefined?0:lib.tarot_group[x].condition.length),3)){
								list1.push(x);
							}
						}
						//移除
						if(!tarot) return ;
						if(!player.yk_tarot){
							player.yk_tarot=[];
						}
						if(!player.yk_tarot.removeChild){
							player.yk_tarot_removeChild=player.yk_tarot.removeChild=function(child){
								if(player.yk_tarot.indexOf(child)==-1) return ;
								player.yk_tarot1=player.yk_tarot.slice(0,player.yk_tarot.indexOf(child));
								player.yk_tarot2=player.yk_tarot.slice(player.yk_tarot.indexOf(child)+1,player.yk_tarot.length);
								player.yk_tarot=player.yk_tarot1.concat(player.yk_tarot2);
								player.yk_tarot.removeChild=player.yk_tarot_removeChild;
								game.log(player,'移除塔罗牌<span class="yellowtext">'+get.translation(child[2])+'</span>！');
							};
						}
						player.yk_tarot.removeChild(tarot);
						//套装移除后
						var list2=[];
						for(var x in lib.tarot_group){
							if(player.checkTarotGroup(x)>=Math.min((lib.tarot_group[x].condition.length==undefined?0:lib.tarot_group[x].condition.length),3)){
								list2.push(x);
							}
						}
						//对比
						if(list1!=list2){
							for(var item of list1) if(list2.indexOf(item)==-1){
								lib.tarot_group[item].onLose(player);
							}
						}
						var number=tarot[2].slice(tarot[2].indexOf('tarot_')+6,tarot[2].length);
						if(lib.tarotInfo[number]&&typeof lib.tarotInfo[number].onLose=='function') lib.tarotInfo[number].onLose(player);
						player.updateTarot();
					}
				}
				player.updateTarot();
			}
			player.yk_clearTarot=function(){
				player.yk_loseTarot(player.yk_tarot,'list');
			}
		},
		trigger:{
			global:"gameStart",
			player:["phaseDrawBegin","phaseBegin"],
		},
		mod:{
			maxHandcard:function(player,num){
				if((lib.config['yk_ykfuji_rank']||0)>=2&&player.yk_tarot) return num+player.yk_tarot.length;
				return num;
			},
		},
		forced:true,
		charlotte:true,
		superCharlotte:true,
		fixed:true,
		filter:function(event,player){
			if(event.name=='phaseDraw') return event.num>0;
			else if(event.name=='phase'){
				if(game.roundNumber>0&&game.roundNumber%7==0){
					player.popup('扶乩');
					player.yk_clearTarot();
					game.yk_washTarot();
				}
				return false;
			}
			else{
				if(!player.yk_tarot) player.yk_tarot=[];
				player.popup('扶乩');
				game.yk_washTarot();
				return false;
			}
		},
		content:function(){
			'step 0'
			window.yk_isFujiNow=true;
			player.ykfuji_ming=trigger.num*2+2+((lib.config['yk_ykfuji_rank']||0)>=5?1:0);
			player.ykfuji_time=0;
			if(lib.yk_tarotList.length<=5) game.yk_washTarot();
			'step 1'
			if(player.ykfuji_time<=((lib.config['yk_ykfuji_rank']||0)>=3?6:5)&&player.ykCheckConsume('Mp',15+10*player.ykfuji_time)) player.chooseControl('扶乩','取消').set('prompt','每次扶乩均消耗1命值，可连续扶乩。<br>当前拥有命值：'+player.ykfuji_ming+'。<br>（取消后，获得 剩余命值/2 的卡牌数，向下取整）');
			'step 2'
			if(result==undefined||(result&&result.control==undefined)||result.control!='扶乩'||player.ykfuji_time>((lib.config['yk_ykfuji_rank']||0)>=3?6:5)){
				trigger.num=Math.floor(player.ykfuji_ming/2);
				window.yk_isFujiNow=false;
				event.finish();
			}
			'step 3'
			player.ykConsume('Mp',15+10*player.ykfuji_time,true);
			player.ykfuji_time++;
			event.pos=get.rand(0,lib.yk_tarotList.length-1);
			event.card0=lib.yk_tarotList[0];
			if(player.hasSkill('zgbc')) event.card1=lib.yk_tarotList[event.pos];
			if(player.storage.zgbc&&typeof player.storage.zgbc_time=='number'&&Math.random()<(0.15+0.05*player.storage.zgbc_time)){event.card1=player.storage.zgbc;player.storage.zgbc_time=0;player.storage.zgbc=false;player.popup('贞龟卜辞');}
			if(player.storage.zgbc&&player.storage.zgbc_time==3){
				player.storage.zgbc_time=0;
				player.storage.zgbc=false;
				event.card1=player.storage.zgbc;
				player.popup('贞龟卜辞');
			}
			event.card2=lib.yk_tarotList[lib.yk_tarotList.length-1];
			event.cardList=[];
			if((lib.config['yk_ykfuji_rank']||0)>=1){event.cardList.push(event.card0);event.cardList.push(event.card2);}
			else{event.cardx=[event.card0,event.card2].randomGet();event.cardList.push(event.cardx);}
			if(player.hasSkill('zgbc')){player.popup('贞龟卜辞');event.cardList.push(event.card1);}
			if(player.storage.zgbc&&event.cardList.indexOf(player.storage.zgbc)==-1) player.storage.zgbc_time++;
			var dialog=ui.create.dialog('扶乩<br><small>请选择一张塔罗牌作为占卜的结果</small>',[event.cardList,'vcard']);
			dialog.addSmall('<small>当前已拥有的塔罗牌：</small>');
			var showList=[];
			for(var pltarot of player.yk_tarot) showList.push(pltarot[2]);
			if(showList.length>0){dialog.addSmall('<b>【<font color=orange>'+get.translation(showList)+'</font>】</b>');dialog.addSmall(player.showTarotGroupInfo());}
			else dialog.addSmall('<small>无</small>');
			player.chooseButton(dialog,true).ai=function(button){
				var name=button.link[2];
				return ['12','13','15'].indexOf(lib.card[name].tarotNumber)==-1;
				return 0;
			}
			'step 4'
			if(result.bool){
				player.ykfuji_ming--;
				if(player.hasSkill('zgbc')&&result.links[0]==player.storage.zgbc){player.popup('贞龟卜辞');player.draw(2);}
				var aminiation=game.createCard(result.links[0][2],result.links[0][1],result.links[0][0]);
				
				if(result.links[0]==event.card0){event.notChoose=[event.card1,event.card2];player.yk_loseTarot(event.notChoose,'list',lib);}
				else if(result.links[0]==event.card1){event.notChoose=[event.card0,event.card2];player.yk_loseTarot(event.notChoose,'list',lib);}
				else if(result.links[0]==event.card2){event.notChoose=[event.card0,event.card1];player.yk_loseTarot(event.notChoose,'list',lib);}
				
				player.$gain2(aminiation);
				if(player.yk_tarot.length>=((lib.config['yk_ykfuji_rank']||0)>=4?4:3)){
					event.cardx=result.links[0];
					event.result2=true;
					var dialog=ui.create.dialog('扶乩<br><small>请选择要替换掉的塔罗牌</small>',[player.yk_tarot,'vcard']);
					player.chooseButton(dialog).ai=function(button){
						var name=button.link[2];
						return ['2','12','13','15'].indexOf(lib.card[name].tarotNumber)!=-1;
						return 0;
					}
					event.goto(5);
				}
				else{
					player.yk_gainTarot([result.links[0]]);
					if((lib.config['yk_ykfuji_rank']||0)>=2&&Math.random()<0.2) player.draw();
				}
			}
			if(lib.yk_tarotList.length<=5) game.yk_washTarot();
			'step 5'
			if(event.result2&&result.bool){
				player.yk_loseTarot(result.links[0]);
				player.yk_gainTarot([event.cardx]);
				if((lib.config['yk_ykfuji_rank']||0)>=2&&Math.random()<0.2) player.draw();
				if(lib.yk_tarotList.length<=5) game.yk_washTarot();
			}
			if(player.ykfuji_ming>0){
				event.goto(1);
			}
			'step 6'
			window.yk_isFujiNow=false;
		},
		ai:{
			order:10,
			result:{
				player:function(player){
					if(player.yk_tarot.length>=3) return player.ykfuji_time<2;
					else return 3-player.yk_tarot.length;
				},
			},
		},
	}
	lib.skill.ykwujian={
		enable:["chooseToUse","chooseToRespond"],
		filterCard:true,
		viewAs:{
			name:"sha",
		},
		viewAsFilter:function(player){
			if(!player.hasSkill('ykwujian_use')) player.addSkill('ykwujian_use');
			if(!player.hasSkill('ykwujian_end')) player.addSkill('ykwujian_end');
			if(player.countCards('h','sha')||player.getEquip(1)) return false;
			if(player.ykCheckConsume('Mp',35)) return true;
			return false;
		},
		position:"hs",
		charlotte:true,
		superCharlotte:true,
		fixed:true,
		unique:true,
		prompt:"将任意牌当杀使用或打出",
		check:function(){return 1},
		group:['ykwujian_use','ykwujian_end'],
		subSkill:{
			use:{
				trigger:{
					player:"useCardBefore",
				},
				filter:function(event,player){
					return event.skill=='ykwujian';
				},
				charlotte:true,
				superCharlotte:true,
				fixed:true,
				unique:true,
				forced:true,
				content:function(){
					if(!player.hasSkill('ykwujian_end')) player.addSkill('ykwujian_end');
					player.ykConsume('Mp',35,true);
					if(!player.getEquip(1)){
						if((lib.config['yk_ykwujian_rank']||0)>=1) player.ykRecover('Defend',50,true);
						if((lib.config['yk_ykwujian_rank']||0)>=2&&Math.random()<0.1) player.changeHujia();
						if((lib.config['yk_ykwujian_rank']||0)>=3&&Math.random()<0.35) player.draw();
						else if((lib.config['yk_ykwujian_rank']||0)>=4&&Math.random()<0.2) player.gain(game.createCard('sha'),'gain2');
						if((lib.config['yk_ykwujian_rank']||0)>=5&&player.countCards('h')==0) player.draw(); 
						var card=get.cardPile2(function(card){
							return get.type(card)=='equip'&&get.subtype(card)=='equip1';
						});
						if(!card) var card=get.discardPile(function(card){
							return get.type(card)=='equip'&&get.subtype(card)=='equip1';
						});
						if(!card) return ;
						player.equip(card,'equip2')._triggered=null;
						if(player.hasSkill('ykjuejian')) player.useSkill('ykjuejian');
						if(!player.ykwujianEquip) player.ykwujianEquip=[];
						player.ykwujianEquip.push(card);
					}
				},
			},
			end:{
				trigger:{
					player:"useCardAfter",
				},
				filter:function(event,player){
					return player.ykwujianEquip&&player.ykwujianEquip.length;
				},
				charlotte:true,
				superCharlotte:true,
				fixed:true,
				unique:true,
				forced:true,
				content:function(){
					while(player.ykwujianEquip.length){
						var card=player.ykwujianEquip[0];
						if(player.getCards('e').contains(card)) player.discard(card);
						player.ykwujianEquip.remove(player.ykwujianEquip[0]);
					}
				},
			},
		},
	}
	lib.skill.ykjuejian={
		trigger:{
			player:"useCardBegin",
		},
		charlotte:true,
		superCharlotte:true,
		fixed:true,
		unique:true,
		frequent:true,
		filter:function(event,player){
			var card;
			if(event.cards) card=event.cards[0];
			else card=event.card;
			return card&&get.name(card,player)=='sha'&&player.ykCheckConsume('Mp',35)&&player.getEquip(1);
		},
		content:function(){
			player.ykConsume('Mp',35,true);
			if((lib.config['yk_ykjuejian_rank']||0)>=1) player.ykRecover('Mp',10,true);
			if((lib.config['yk_ykjuejian_rank']||0)>=2) player.ykRecover('Defend',35,true);
			if((lib.config['yk_ykjuejian_rank']||0)>=3&&Math.random()<0.15) player.draw();
			else if((lib.config['yk_ykjuejian_rank']||0)>=4&&Math.random()<0.2) player.gain(game.createCard('sha'),'gain2');
			if((lib.config['yk_ykjuejian_rank']||0)>=5){
				var card=trigger.card;
				if(!card&&trigger.cards) card=trigger.cards[0];
				if(card&&get.color(card,player)=='black'&&Math.random()<0.2) player.changeHujia();
			}
			player.addTempSkill('unequip',{player:'useCardAfter'});
		},
	}
	lib.skill.ykshilie={
		enable:"phaseUse",
		usable:1,
		filterCard:{
			name:"sha",
		},
		selectCard:1,
		filterTarget:function(card,player,target){
			return target!=player;
		},
		selectTarget:1,
		filter:function(event,player){
			if(window.ykshilie_button!=undefined) return false;
			return player.countCards('h',{name:"sha"})>0&&player.ykCheckConsume('Mp',300);
		},
		content:function(){
			player.ykConsume('Mp',300,true);
			if((lib.config['yk_ykshilie_rank']||0)>=1) player.ykRecover('Defend',75,true);
			if((lib.config['yk_ykshilie_rank']||0)>=2) player.ykRecover('Mp',50,true);
			lib.skill.ykshilieDamage={
				trigger:{
					source:"damageBefore",
				},
				filter:function(event,player){
					var card;
					if(event.cards) card=event.cards[0];
					else card=event.card;
					return card&&get.name(card,player)=='sha';
				},
				forced:true,
				content:function(){
					lib.skill.ykshilie2={
						nobracket:true,
						mod:{
							playerEnabled:function(card,player,target){
								return false;
							},
							cardEnabled:function (card,player){
								return false;
							},
							"cardEnabled2":function (card,player){
								return false;
							},
							cardUsable:function (card,player){
								return 0;
							},
							cardRespondable:function (card,player){
								return false;
							},
							cardSavable:function (card,player){
								return false;
							},
							targetInRange:function (card){
								return false;
							},
						},
						init:function(player){
							player.ykshilie_trullyRemove=false;
							var func=function(){};
							player.skills.add=func;
							player.skills.push=func;
						},
						onremove:function(player){
							if(typeof player.ykshilie2_onremoveSkill=='function') player.ykshilie2_onremoveSkill(player);
						},
						trigger:{
							player:["phaseBegin","damageBegin","loseHpBegin","recoverBegin","changeHujiaBegin","loseBegin","gainBegin","gainMaxHpBegin","loseMaxHpBegin","useCardBegin"],
						},
						lastDo:true,
						forced:true,
						silent:true,
						popup:false,
						filter:function(event,player){
							if(event.name!='phase') return event.cards2||event.cards||event.card||event.num;
							else return true;
						},
						content:function(){
							player.popup('时之裂隙');
							if(trigger.name=='phase'){
								player.ykshilie_trullyRemove=true;
								player.removeSkill('ykshilie2');
							}
							else{
								if(!player.ykshilie_shiji) player.ykshilie_shiji={};
								if(!player.ykshilie_shiji[trigger.name]) player.ykshilie_shiji[trigger.name]={};
								if(trigger.name=='damage'){
									var id;
									if(trigger.source) id=trigger.source.playerid;
									var source=(id||'nosource');
									var nature=(trigger.nature||'nonature');
									if(!player.ykshilie_shiji[trigger.name][source]) player.ykshilie_shiji[trigger.name][source]={};
									if(!player.ykshilie_shiji[trigger.name][source][nature]) player.ykshilie_shiji[trigger.name][source][nature]=0;
									player.ykshilie_shiji[trigger.name][source][nature]+=trigger.num;
								}
								else if(["loseHp","recover","changeHujia","gainMaxHp","loseMaxHp"].indexOf(trigger.name)!=-1){
									if(typeof player.ykshilie_shiji[trigger.name]!='number') player.ykshilie_shiji[trigger.name]=0;
									player.ykshilie_shiji[trigger.name]+=trigger.num;
								}
								else{
									if(!player.ykshilie_shiji[trigger.name].cards) player.ykshilie_shiji[trigger.name].cards=[];
									var cards;
									if(trigger.cards) cards=trigger.cards;
									else if(trigger.card) cards=[trigger.card];
									else if(trigger.cards2) cards=trigger.cards2;
									if(!player.ykshilie_shiji[trigger.name].cards) player.ykshilie_shiji[trigger.name].cards=[];
									player.ykshilie_shiji[trigger.name].cards=player.ykshilie_shiji[trigger.name].cards.concat(cards);
								}
								trigger.finish();
							}
						},
					}
					lib.translate.ykshilie2='时之裂隙';
					lib.translate.ykshilie2_info='迟滞状态：该角色不能打出和响应任何牌，暂时失去所有技能且在此效果结束前迟滞所有伤害、回复/流失体力、摸/弃牌、增/减体力上限事件的结算直到其回合开始时或你发动第二段斩击【时裂·断绝】时消除此效果，消除时统一结算迟滞期间累积的所有事件。';
					trigger.player.yk_shilie_oldSkill=[];
					for(var skill of trigger.player.skills) trigger.player.yk_shilie_oldSkill.push(skill);
					trigger.player.skills=[];
					trigger.player.addSkill('ykshilie2');
					trigger.player.ykshilie2_onremoveSkill=function(player){
						if(!player.ykshilie_trullyRemove){
							player.addSkill('shilie2');
						}
						else if(player.ykshilie_shiji){
							for(var triggerNamex in player.ykshilie_shiji){
								if(triggerNamex=='damage'){
									for(var source in player.ykshilie_shiji[triggerNamex]){
										if(source!='nosource'){
											var sourcepl;
											for(var pl of game.players) if(pl.playerid==source) sourcepl=pl;
											for(var nature in player.ykshilie_shiji[triggerNamex][source]){
												if(typeof player.ykshilie_shiji[triggerNamex][source][nature]=='number'){
													if(nature!='nonature') player.damage(player.ykshilie_shiji[triggerNamex][source][nature],sourcepl);
													else player.damage(player.ykshilie_shiji[triggerNamex][source][nature],nature,sourcepl);
												}
											}
										}
										else for(var nature in player.ykshilie_shiji[triggerNamex][source]){
											if(typeof player.ykshilie_shiji[triggerNamex][source][nature]=='number'){
												if(nature!='nonature') player.damage(player.ykshilie_shiji[triggerNamex][source][nature],'nosource');
												else player.damage(player.ykshilie_shiji[triggerNamex][source][nature],nature,'nosource');
											}
										}
									}
								}
								else if(["recover","changeHujia","gainMaxHp","loseMaxHp"].indexOf(triggerNamex)!=-1){
									player[triggerNamex](player.ykshilie_shiji[triggerNamex]);
								}
								else player[triggerNamex](player.ykshilie_shiji[triggerNamex].cards);
							}
							delete player.ykshilie_shiji;
						}
						player.ykshilie_shiji=undefined;
						player.skills=[];
						for(var skill of player.yk_shilie_oldSkill) player.addSkill(skill);
						player.ykshilie2_onremoveSkill=undefined;
						if(window.ykshilie_button){
							window.ykshilie_button.redelete();
							window.ykshilie_button=undefined;
						}
					}
					if((lib.config['yk_ykshilie_rank']||0)>=3&&Math.random()<0.5&&trigger.player.hujia) trigger.player.changeHujia(-trigger.player.hujia);
					if((lib.config['yk_ykshilie_rank']||0)>=4&&Math.random()<0.3&&trigger.player.countCards('he')) trigger.player.discard(trigger.player.getCards('he'));
					if((lib.config['yk_ykshilie_rank']||0)>=4&&Math.random()<0.25) trigger.player.turnOver(true);
					if(event.isMine()){
						window.ykshilie_button=ui.create.control('时裂·断绝',function(){
							window.ykshilie_button.source.line(window.ykshilie_button.target,'yellow');
							if(game.players.contains(window.ykshilie_button.target)){
								window.ykshilie_button.target.ykshilie_trullyRemove=true;
								window.ykshilie_button.target.removeSkill('ykshilie2');
							}
							if(window.ykshilie_button){
								window.ykshilie_button.redelete();
								window.ykshilie_button=undefined;
							}
						});
						window.ykshilie_button.source=player;
						window.ykshilie_button.target=trigger.player;
						window.ykshilie_button.redelete=window.ykshilie_button.delete;
						window.ykshilie_button.delete=function(){};
						window.ykshilie_button.rehide=window.ykshilie_button.hide;
						window.ykshilie_button.hide=function(){};
						window.ykshilie_button.reclose=window.ykshilie_button.close;
						window.ykshilie_button.close=function(){};
					}
				},
			}
			player.addTempSkill('ykshilieDamage',{player:"useCardAfter"});
			lib.skill.ykshilienoTrigger={
				trigger:{
					player:"useCard",
				},
				firstDo:true,
				silent:true,
				forced:true,
				popup:false,
				filter:function(event,player,name){
					if(name=='useCard') return game.hasPlayer(function(current){
						return current!=player&&event.targets.contains(current);
					});
				},
				content:function(){
					trigger.directHit.addArray(game.filterPlayer(function(current){
						return current!=player&&trigger.targets.contains(current);
					}));
				},
			}
			player.addTempSkill('ykshilienoTrigger',{player:"useCardAfter"});
			player.useCard(game.createCard(cards[0].name,cards[0].suit,cards[0].number,cards[0].nature),target,false).addCount=false;
		},
	}
	lib.skill.ykshenming={
		group:['ykshenming_useCard'],
		enable:"phaseUse",
		init:player=>{
			if(!player.yk_mingyun) player.yk_mingyun=0;
			if(player==game.me){
				window.updateDiv=num=>{
					if(window.updateDiv_destinyDiv){
						window.updateDiv_destinyDiv.delete();
						delete window.updateDiv_destinyDiv;
						window.updateDiv_destinyDiv=null;
					}
					if(!num) num=game.me.yk_mingyun;
					var listx=[];
					for(var i=0;i<num;i++) listx.push(ui.cardPile.childNodes[i]);
					window.updateDiv_destinyDiv=ui.create.div('','',function(){window.updateDiv(game.me.yk_mingyun);});
					window.updateDiv_destinyDiv.style.cssText='top:-45px;left:0px;width:100%;height:45px;z-index:999;background-color:black;overflow-y:scroll;';
					lib.setScroll(window.updateDiv_destinyDiv);
					player.appendChild(window.updateDiv_destinyDiv);
					window.updateDiv_destinyDiv.innerHTML='牌堆顶的牌：'+get.translation(listx);
				}
				game.ykold_updateRoundNumber=game.updateRoundNumber;
				game.updateRoundNumber= ()=>{
					window.updateDiv(game.me.yk_mingyun);
					game.ykold_updateRoundNumber();
				}
				ui.create.ykold_cards=ui.create.cards;
				ui.create.cards= ordered =>{
					window.updateDiv(game.me.yk_mingyun);
					ui.create.ykold_cards(ordered);
				}
				player.ykgainMark_ming=num=>{
					if(!num) num=1;
					player.yk_mingyun+=num;
					window.updateDiv(game.me.yk_mingyun);
				}
			}
			else{
				window.updateDiv_destinyDiv=ui.create.div('','牌堆顶的牌：未知',function(){});
				window.updateDiv_destinyDiv.style.cssText='top:-25px;left:0px;width:100%;height:25px;z-index:999;background-color:black;overflow-y:scroll;';
				player.appendChild(window.updateDiv_destinyDiv);
			}
			if((lib.config['yk_ykshenming_rank']||0)>=1) player.ykChange('MaxMp',100);
			if((lib.config['yk_ykshenming_rank']||0)>=2) player.ykChange('MaxDefend',100);
			if((lib.config['yk_ykshenming_rank']||0)>=3) player.draw();
			if((lib.config['yk_ykshenming_rank']||0)>=4) player.changeHujia(2);
			delete lib.skill.ykshenming.init;
			lib.skill.ykshenming.init=()=>{};
		},
		trigger:{
			global:["phaseZhunbeiBegin","phaseAfter"],
		},
		filter:(event,player)=>{
			if(player.ykCheckConsume('Mp',25)) return event.player!=player;
		},
		forced:true,
		content:()=>{
			"step 0"
			window.yk_findCard=()=>{
				event.value=input.value;
				alert('输入关键词【'+event.value+'】成功！');
			};
			var dialog=ui.create.dialog('<br>【神命】<br>猜测【'+get.translation(_status.currentPhase)+'】会使用的卡牌',[[['','','基本牌'],['','','锦囊牌'],['','','延时锦囊牌'],['','','装备牌'],['','','其他牌']],'vcard']);
			dialog.add('<br>输入卡牌名称关键词并确定（关键词可为空）');
			var div=ui.create.div();
			div.style.height='35px';
			div.style.width='calc(90%)';
			div.style.top='-2px';
			div.style.left='0px';
			div.style['white-space']='nowrap';
			div.style['text-align']='center';
			div.style['line-height']='26px';
			div.style['font-size']='24px';
			div.style['font-family']='xinwei';
			div.style['z-index']=2499;
			div.innerHTML='搜索→<input type="text" style="width:150px;"></input>←</select><button type="button" onclick="window.yk_findCard()">确定</button>';
			var input=div.querySelector('input');
			if(!input) input.value='如需精确搜索请在此输入并确定';
			input.onkeydown=function(e){
				if(this.value=='如需精确搜索请在此输入并确定') this.value='';
				e.stopPropagation();
				if(e.keyCode==13){
					window.yk_findCard();
				};
			};
			input.onmousedown=function(e){
				e.stopPropagation();
			};
			dialog.insertBefore(div,dialog.firstChild);
			player.chooseButton(dialog).set('ai',button=>{
				if(Math.random()>player.yk_mingyun/7){
					if(['锦囊牌','装备牌'].indexOf(button.link[2])!=-1) return 1;
					else return -1;
				}
				else{
					if(['基本牌'].indexOf(button.link[2])!=-1) return 1;
					else return -1;
				}
			});
			"step 1"
			if(result.bool){
				var typeC=result.links[0][2],type;
				if(typeC=='基本牌') type='basic';
				else if(typeC=='锦囊牌') type='trick';
				else if(typeC=='延时锦囊牌') type='delay';
				else if(typeC=='装备牌') type='equip';
				else type='others';
				var yk_compareStr=function(str1,str2){//相似度
					var sameNum=0;
					for (var i = 0; i < str1.length; i++) {
						for(var j =0;j<str2.length;j++){
							if(str1[i]===str2[j]){
								sameNum++;
							}
						}
					}
					sameNum=(sameNum/str1.length)/str2.length;
					return sameNum;
				}
				var cardList=[],cardList2,cardList3=[];
				for(var card in lib.card) if(lib.card[card].type==type&&cardList.indexOf(card)==-1) cardList.push(['','',card]);
				if(event.value&&event.value.length){
					cardList2=[];
					for(var cardx of cardList) if(lib.card[cardx[2]].type==type&&(yk_compareStr(cardx[2],event.value)||yk_compareStr(get.translation(cardx[2]),get.translation(event.value)))) cardList2.push({name:cardx[2],similar:(yk_compareStr(cardx[2],event.value)||yk_compareStr(get.translation(cardx[2]),get.translation(event.value)))});
					cardList2.sort(function (x, y) {
						var a = x.similar;
						var b = y.similar;
						if(a<b) return 1;
						if(a>b) return -1;
						return 0;
					});
					for(var cardi of cardList2) cardList3.push(['','',cardi.name]);
				}
				var dialog=ui.create.dialog('<br>【神命】<br>猜测【'+get.translation(_status.currentPhase)+'】会使用的卡牌',[cardList3.length?cardList3:cardList,'vcard']);
				dialog.forcebutton=true;
				dialog.classList.add('forcebutton');
				event.trigger_namex=trigger.name;
				event.target=trigger.player;
				player.chooseButton(dialog).set('ai',button=>{
					if(button.link[2]=='sha'&&event.trigger_namex=='phaseZhunbei') return 5;
					if(button.link[2]=='shan'&&event.trigger_namex=='phase') return 5;
					if(button.link[2]=='tao'&&event.target.hp<event.target.maxHp) return 3+event.target.maxHp-event.target.hp;
					return 1;
				});
			}
			"step 2"
			if(result.bool){
				player.ykConsume('Mp',25);
				trigger.player.ykshenming_card=result.links[0][2];
			}
		},
		subSkill:{
			useCard:{
				init:player=>{
					lib.translate['ykshenming_useCard']='神命';
					lib.translate['ykshenming_useCard_info']='你使用指定牌时无效化';
				},
				trigger:{
					global:["phaseBefore","phaseEnd","useCard"],
				},
				filter:(event,player)=>{
					if(!event.player.ykshenming_card) return false;
					if(event.name=='useCard'){
						var card;
						if(event.cards) card=event.cards[0];
						else card=event.card;
						return card&&card.name==event.player.ykshenming_card;
					}
					else return true;
				},
				forced:true,
				silent:true,
				popup:false,
				content:()=>{
					'step 0'
					var use_card;
					if(trigger.cards) use_card=trigger.cards[0];
					else use_card=trigger.card;
					if(trigger.name=='useCard'&&trigger.player.ykshenming_card&&use_card&&trigger.player.ykshenming_card==use_card.name){
						event.target=trigger.player;
						event.choose1='令【'+get.translation(trigger.player.name)+'】的【'+get.translation(trigger.player.ykshenming_card)+'】无效';
						event.choose2='令【'+get.translation(trigger.player.name)+'】的【'+get.translation(trigger.player.ykshenming_card)+'】继续生效';
						player.chooseControl(event.choose1,event.choose2,function(event,player){
							if(get.attitude(player,event.target)<0) return event.choose1;
							else return event.choose2;
						});
					}
					else if(trigger.name!='useCard'){
						if(trigger.player.ykshenming_card){
							delete trigger.player.ykshenming_card;
							trigger.player.ykshenming_card=null;
							player.yk_mingyun=(player.yk_mingyun||0);
							player.loseHp();
							player.draw(2);
							player.yk_mingyun=Math.max(player.yk_mingyun,0);
						}
						return ;
					}
					if(!event.choose1){event.finish();return ;}
					'step 1'
					if(result.control==event.choose1){
						trigger.cancel();
						trigger._triggered=null;
						if(lib.card[trigger.player.ykshenming_card]&&lib.card[trigger.player.ykshenming_card].type=='basic'){
							player.chooseToDiscard('he',1,true);
							player.draw();
						}
						else if(lib.card[trigger.player.ykshenming_card]){
							player.draw();
						}
						else{
							event.finish();
							return ;
						}
					}
					else if(result.control==event.choose2){
						if(lib.card[trigger.player.ykshenming_card]&&lib.card[trigger.player.ykshenming_card].type=='basic'){
							player.draw();
						}
						else if(lib.card[trigger.player.ykshenming_card]){
							player.recover();
						}
						else{
							event.finish();
							return ;
						}
						if(!trigger.player.ykshenming_beGuessed){
							trigger.player.ykshenming_beGuessed=true;
							player.yk_mingyun=(player.yk_mingyun||0);
							player.ykgainMark_ming(1);
							player.yk_mingyun=Math.min(player.yk_mingyun,7);
						}
					}
					game.log('<span class="bluetext">'+get.translation(trigger.player.name)+'</span>的用牌<span class="yellowtext">'+get.translation(trigger.player.ykshenming_card)+'</span>被猜测成功，本次出牌无效！');
					player.popup('神命');
					delete trigger.player.ykshenming_card;
					trigger.player.ykshenming_card=null;
					"step 2"
					if((lib.config['yk_ykshenming_rank']||0)<5){
						event.finish();
						return ;
					}
					var dialog=ui.create.dialog('<br>【神命】<br>猜测【'+get.translation(_status.currentPhase)+'】会使用的卡牌',[[['','','基本牌'],['','','锦囊牌'],['','','延时锦囊牌'],['','','装备牌'],['','','其他牌']],'vcard']);
					dialog.add('<br>输入卡牌名称关键词并确定（关键词可为空）');
					var div=ui.create.div();
					div.style.height='35px';
					div.style.width='calc(90%)';
					div.style.top='-2px';
					div.style.left='0px';
					div.style['white-space']='nowrap';
					div.style['text-align']='center';
					div.style['line-height']='26px';
					div.style['font-size']='24px';
					div.style['font-family']='xinwei';
					div.style['z-index']=2499;
					div.innerHTML='搜索→<input type="text" style="width:150px;"></input>←</select><button type="button" onclick="window.yk_findCard()">确定</button>';
					var input=div.querySelector('input');
					if(!input) input.value='如需精确搜索请在此输入并确定';
					input.onkeydown=function(e){
						if(this.value=='如需精确搜索请在此输入并确定') this.value='';
						e.stopPropagation();
						if(e.keyCode==13){
							window.yk_findCard();
						};
					};
					input.onmousedown=function(e){
						e.stopPropagation();
					};
					dialog.insertBefore(div,dialog.firstChild);
					player.chooseButton(dialog).set('ai',button=>{
						if(Math.random()>player.yk_mingyun/7){
							if(['锦囊牌','装备牌'].indexOf(button.link[2])!=-1) return 1;
							else return -1;
						}
						else{
							if(['基本牌'].indexOf(button.link[2])!=-1) return 1;
							else return -1;
						}
					});
					"step 3"
					if(result.bool){
						var typeC=result.links[0][2],type;
						if(typeC=='基本牌') type='basic';
						else if(typeC=='锦囊牌') type='trick';
						else if(typeC=='延时锦囊牌') type='delay';
						else if(typeC=='装备牌') type='equip';
						else type='others';
						var yk_compareStr=function(str1,str2){//相似度
							var sameNum=0;
							for (var i = 0; i < str1.length; i++) {
								for(var j =0;j<str2.length;j++){
									if(str1[i]===str2[j]){
										sameNum++;
									}
								}
							}
							sameNum=(sameNum/str1.length)/str2.length;
							return sameNum;
						}
						var cardList=[],cardList2,cardList3=[];
						for(var card in lib.card) if(lib.card[card].type==type&&cardList.indexOf(card)==-1) cardList.push(['','',card]);
						if(event.value&&event.value.length){
							cardList2=[];
							for(var cardx of cardList) if(lib.card[cardx[2]].type==type&&(yk_compareStr(cardx[2],event.value)||yk_compareStr(get.translation(cardx[2]),get.translation(event.value)))) cardList2.push({name:cardx[2],similar:(yk_compareStr(cardx[2],event.value)||yk_compareStr(get.translation(cardx[2]),get.translation(event.value)))});
							cardList2.sort(function (x, y) {
								var a = x.similar;
								var b = y.similar;
								if(a<b) return 1;
								if(a>b) return -1;
								return 0;
							});
							for(var cardi of cardList2) cardList3.push(['','',cardi.name]);
						}
						var dialog=ui.create.dialog('<br>【神命】<br>猜测【'+get.translation(_status.currentPhase)+'】会使用的卡牌',[cardList3.length?cardList3:cardList,'vcard']);
						dialog.forcebutton=true;
						dialog.classList.add('forcebutton');
						event.trigger_namex=trigger.name;
						event.target=trigger.player;
						player.chooseButton(dialog).set('ai',button=>{
							if(button.link[2]=='sha'&&event.trigger_namex=='phaseZhunbei') return 5;
							if(button.link[2]=='shan'&&event.trigger_namex=='phase') return 5;
							if(button.link[2]=='tao'&&event.target.hp<event.target.maxHp) return 3+event.target.maxHp-event.target.hp;
							return 1;
						});
					}
					"step 4"
					if(result.bool){
						trigger.player.ykshenming_card=result.links[0][2];
					}
				},
			},
		},
	}
	lib.skill.yktiansuan={
		trigger:{
			global:["gainBegin","phaseDrawBefore"],
		},
		filter:(event,player)=>{
			if(!player.ykCheckConsume('Mp',40)) return ;
			if(event.name=='gain'){
				return event.getParent().getParent().name=='phaseDraw'&&event.player!=player;
			}
			else return event.player!=player;
		},
		forced:true,
		content:()=>{
			"step 0"
			if(trigger.name=='gain') event.goto(4);
			"step 1"
			if(!trigger.num) return ;
			var dialog=ui.create.dialog('<br>【天算】<br>猜测【'+get.translation(_status.currentPhase)+'】会抽到的卡牌',[[['','','基本牌'],['','','锦囊牌'],['','','延时锦囊牌'],['','','装备牌'],['','','其他牌']],'vcard']);
			dialog.add('<br>输入卡牌名称关键词并确定（关键词可为空）');
			var div=ui.create.div();
			div.style.height='35px';
			div.style.width='calc(90%)';
			div.style.top='-2px';
			div.style.left='0px';
			div.style['white-space']='nowrap';
			div.style['text-align']='center';
			div.style['line-height']='26px';
			div.style['font-size']='24px';
			div.style['font-family']='xinwei';
			div.style['z-index']=2499;
			div.innerHTML='搜索→<input type="text" style="width:150px;"></input>←</select><button type="button" onclick="window.yk_findCard()">确定</button>';
			var input=div.querySelector('input');
			if(!input) input.value='如需精确搜索请在此输入并确定';
			input.onkeydown=function(e){
				if(this.value=='如需精确搜索请在此输入并确定') this.value='';
				e.stopPropagation();
				if(e.keyCode==13){
					window.yk_findCard();
				};
			};
			input.onmousedown=function(e){
				e.stopPropagation();
			};
			dialog.insertBefore(div,dialog.firstChild);
			player.chooseButton(dialog).set('ai',button=>{
				return button.link[2]=='基本牌';
			});
			"step 2"
			if(result.bool){
				var typeC=result.links[0][2],type;
				if(typeC=='基本牌') type='basic';
				else if(typeC=='锦囊牌') type='trick';
				else if(typeC=='延时锦囊牌') type='delay';
				else if(typeC=='装备牌') type='equip';
				else type='others';
				var yk_compareStr=function(str1,str2){//相似度
					var sameNum=0;
					for (var i = 0; i < str1.length; i++) {
						for(var j =0;j<str2.length;j++){
							if(str1[i]===str2[j]){
								sameNum++;
							}
						}
					}
					sameNum=(sameNum/str1.length)/str2.length;
					return sameNum;
				}
				var cardList=[],cardList2,cardList3=[];
				for(var card in lib.card) if(lib.card[card].type==type&&cardList.indexOf(card)==-1) cardList.push(['','',card]);
				if(event.value&&event.value.length){
					cardList2=[];
					for(var cardx of cardList) if(lib.card[cardx[2]].type==type&&(yk_compareStr(cardx[2],event.value)||yk_compareStr(get.translation(cardx[2]),get.translation(event.value)))) cardList2.push({name:cardx[2],similar:(yk_compareStr(cardx[2],event.value)||yk_compareStr(get.translation(cardx[2]),get.translation(event.value)))});
					cardList2.sort(function (x, y) {
						var a = x.similar;
						var b = y.similar;
						if(a<b) return 1;
						if(a>b) return -1;
						return 0;
					});
					for(var cardi of cardList2) cardList3.push(['','',cardi.name]);
				}
				var dialog=ui.create.dialog('<br>【天算】<br>猜测【'+get.translation(_status.currentPhase.name)+'】会抽到的卡牌',[cardList3.length?cardList3:cardList,'vcard']);
				dialog.forcebutton=true;
				dialog.classList.add('forcebutton');
				player.chooseButton(dialog).set('ai',button=>{
					var cho=['sha','shan'].randomGet();
					if(button.link[2]==cho) return 1;
					return 0;
				}).selectButton=()=>{
					return [0,trigger.num];
				};
			}
			"step 3"
			if(result.bool){
				var list=[];
				for(var res of result.links) list.push(res[2]);
				trigger.player.ykshenming_phaseDraw=list;
				player.ykConsume('Mp',40);
			}
			event.finish();
			return ;
			"step 4"
			if(!trigger.player.ykshenming_phaseDraw){
				event.finish();
				return ;
			}
			event.list=[];
			event.rest=[];
			for(var card of trigger.cards){
				if(trigger.player.ykshenming_phaseDraw.indexOf(card.name)!=-1) event.list.push([card.suit,card.number,card.name,card.nature]);
				else event.rest.push(card);
			}
			if(event.list.length){
				if(!trigger.player.ykshenming_beGuessed){
					trigger.player.ykshenming_beGuessed=true;
					player.yk_mingyun=(player.yk_mingyun||0);
					player.ykgainMark_ming(1);
					player.yk_mingyun=Math.min(player.yk_mingyun,7);
				}
				event.target=trigger.player;
				event.choose1='弃置等量牌，立即获得这些牌并摸一张牌（不足则全弃）';
				event.choose2='用任意一张手牌代替其中一张牌并对其造成一点伤害';
				if(player.countCards('h')>0) player.chooseControl(event.choose1,event.choose2,function(event,player){
					if(get.attitude(player,event.target)<0) return event.choose2;
					else return event.choose1;
				});
				else player.chooseControl(event.choose1,function(event,player){
					return event.choose1;
				});
			}
			else{
				event.finish();
				return ;
			}
			"step 5"
			if(!result){
				event.finish();
				return ;
			}
			if(result.control==event.choose1){
				player.chooseToDiscard('he',event.list.length,true);
				var listx=[];
				for(var m of event.list) listx.push(game.createCard(m[2],m[0],m[1],m[3]));
				player.gain(listx)._triggered=null;
				if((lib.config['yk_yktiansuan_rank']||0)>=1) player.ykRecover('Mp',20);
				if((lib.config['yk_yktiansuan_rank']||0)>=2) player.ykRecover('Defend',50);
				if((lib.config['yk_yktiansuan_rank']||0)>=3) player.draw();
				trigger.cards=event.rest;
				event.finish();
				return ;
			}
			else if(result.control==event.choose2){
				var dialog=ui.create.dialog('<br>【天算】<br>选择要替换的卡牌',[event.list,'vcard']);
				dialog.forcebutton=true;
				dialog.classList.add('forcebutton');
				if(!event.list.length) return ;
				player.chooseButton(dialog).selectButton=()=>{
					return 1;
				};
			}
			"step 6"
			if(result&&result.bool){
				event.r=result.links[0];
				event.list=event.list.slice(0,event.list.indexOf(event.r)).concat(event.list.slice(event.list.indexOf(event.r)+1,event.list.length));
				var color='white';
				if(['heart','diamond'].indexOf(event.r[0])!=-1) color='red';
				else if(['club','spade'].indexOf(event.r[0])!=-1) color='black';
				var dialog=ui.create.dialog('<br>【天算】<br>选择一张手牌以替换<span class="yellowtext">'+get.translation(event.r[2])+'</span><font color="'+color+'">'+get.translation(event.r[0])+'</font>'+event.r[1],[player.getCards('h'),'vcard']);
				dialog.forcebutton=true;
				dialog.classList.add('forcebutton');
				if(!player.getCards('h').length) return ;
				player.chooseButton(dialog).selectButton=()=>{
					return 1;
				};
			}
			else{
				event.finish();
				return ;
			}
			"step 7"
			if(result&&result.bool){
				player.ykConsume('Mp',40);
				player.lose(result.links[0])._triggered=null;
				for(var card of event.list) event.rest.push(game.createCard(card[2],card[0],card[1],(card[3]?card[3]:null)));
				event.rest.push(result.links[0]);
				game.log(player,'用<span class="yellowtext">'+get.translation(result.links[0][2])+'</span>替换了<span class="yellowtext">'+get.translation(event.r[2])+'</span>');
				trigger.cards=event.rest;
				trigger.player.damage();
				if((lib.config['yk_yktiansuan_rank']||0)>=4) player.draw();
				if((lib.config['yk_yktiansuan_rank']||0)>=5&&Math.random()<0.25) player.recover();
			}
		},
	}
	lib.skill.ykmingyunInterweave={
		trigger:{
			player:"dying",
		},
		forced:true,
		content:()=>{
			player.loseMaxHp();
			player.awakenSkill('ykmingyunInterweave');
			if(player.yk_mingyun>5){
				lib.skill.ykinterweave={
					init:player=>{
						if(player==game.me){
							window['ykinterweave_actual_'+player.name]=ui.create.div('.menubutton.round','织');
							window['ykinterweave_actual_'+player.name].style.cssText='bottom:5px;right:calc(100% - 55px);z-index:999;';
							window['ykinterweave_actual_'+player.name].style.backgroundSize='cover';
							window['ykinterweave_actual_'+player.name].owner=player.name;
							window['ykinterweave_actual_'+player.name].owner_pl=player;
							window['ykinterweave_actual_'+player.name].onclick=function(){
								if(!this.owner_pl.ykConsume('Mp',75)){
									alert('术法值不足！');
									return ;
								}
								if(window['ykinterweave_actual_'+this.owner].target&&window['ykinterweave_actual_'+this.owner].target.playerid==_status.currentPhase.playerid){
									alert('不可连续对【'+get.translation(_status.currentPhase.name)+'】发动');
									return ;
								}
								if(_status.currentPhase.playerid==this.owner_pl.playerid){
									alert('不可对自己发动');
									return ;
								}
								window['ykinterweave_actual_'+this.owner].target=_status.currentPhase;
								window['ykinterweave_actual_'+this.owner].setBackground(_status.currentPhase.name,'character');
								var next = game.createEvent('interweave');
								next.setContent(function(){
									var current=_status.currentPhase,cards=current.getCards('he'),equip_num=0;
									current.discard(cards);
									current.draw(cards.length);
									for(var i of cards) if(i.type=='equip') equip_num++;
									player.ykConsume('Mp',75);
									if(equip_num>=2){
										player.loseHp();
										player.draw(2);
									}
									else{
										player.chooseToDiscard('he',2,true);
										player.recover();
									}
								});
								next.set('player',this.owner_pl);
								return next;
							};
							player.appendChild(window['ykinterweave_actual_'+player.name]);
						}
						else{//ai
							game.ykAI_think=(player,time)=>{
								ykAI_thinkInterVal={};
								ykAI_thinkInterVal.player=player;
								ykAI_thinkInterVal.interval=setTimeout(function(){
									if(!ykAI_thinkInterVal.player) return ;
									game.ykAI_think(ykAI_thinkInterVal.player,get.rand(60,360)*1000);
									if((get.attitude(ykAI_thinkInterVal.player,_status.currentPhase)<0&&_status.currentPhase.getCards('e')>=2)||(get.attitude(ykAI_thinkInterVal.player,_status.currentPhase)>0&&_status.currentPhase.getCards('e')==0)){
										if(ykAI_thinkInterVal.player.ykCheckConsume('Mp',player.ykMaxMp/2)&&ykAI_thinkInterVal.player.ykCheckConsume('Mp',75)){
											var next = game.createEvent('interweave');
											next.setContent(function(){
												var current=_status.currentPhase,cards=current.getCards('he'),equip_num=0;
												current.discard(cards);
												current.draw(cards.length);
												player.ykConsume('Mp',75);
												for(var i of cards) if(i.type=='equip') equip_num++;
												if(equip_num>=2){
													player.loseHp();
													player.draw(2);
												}
												else{
													player.chooseToDiscard('he',2,true);
													player.recover();
												}
											});
											next.set('player',ykAI_thinkInterVal.player);
											return next;
										}
									}
								},time);
							}
						}
						delete lib.skill.ykinterweave.init;
						lib.skill.ykinterweave.init=null;
					},
					trigger:{
						global:["phaseBegin","loseAfter","phaseJieshuAfter"],
					},
					filter:(event,player)=>{
						if(event.name=='phaseJieshu'&&!player.ykCheckConsume('Mp',15)){
							event.player.yk_mingyun_cardRecord=[];
							return ;
						}
						if(event.name=='lose') return event.player!=player&&_status.currentPhase==event.player;
						else{
							if(!event.player.yk_mingyun_cardRecord) return ;
							if(event.name=='phaseJieshu'&&!event.player.yk_mingyun_cardRecord.length) return ;
						}
						return event.player!=player;
					},
					forced:true,
					silent:true,
					popup:false,
					content:()=>{
						"step 0"
						if(!trigger.player.yk_mingyun_cardRecord||trigger.name=='phase') trigger.player.yk_mingyun_cardRecord=[];
						else if(trigger.name=='lose'){
							for(var i of trigger.cards) trigger.player.yk_mingyun_cardRecord.push(i);
						}
						if(trigger.name=='phaseJieshu'&&trigger.player.yk_mingyun_cardRecord.length){
							player.ykConsume('Mp',15);
							event.list=[];
							for(var i of trigger.player.yk_mingyun_cardRecord) if(get.position(i)=='d') event.list.push(i);
							game.cardsGotoOrdering(event.list);
							var next=player.chooseToMove('<br>【交织】<br>选择要获得的一张牌并排列其他牌');
							next.set('list',[
								['牌堆顶'],
								['牌堆底'],
								['弃牌堆',event.list],
								['获得'],
							]);
							next.set('filterMove',function(from,to,moved){
								if(from.link){
									if(typeof to=='number'){
										if(to==3&&moved[3].length) return false;
										return true;
									}
									if(moved[3].contains(to.link)) return true;
									return true;
								}
								else return true;
							});
							next.set('processAI',function(list){
								var cards=list[2][1].slice(0).sort(function(a,b){
									return get.value(b)-get.value(a);
								}),gains=[];
								for(var i of cards){
									cards.remove(i);
									gains.push(i);
								}
								return [cards,gains];
							});
						}
						"step 1"
						if(result.bool){
							var list=result.moved;
							if(list[3].length) player.gain(list[3],'gain2');
							while(list[0].length){
								ui.cardPile.insertBefore(list[0].pop(),ui.cardPile.firstChild);
							}
							while(list[1].length){
								ui.cardPile.appendChild(list[0].pop(),ui.cardPile.firstChild);
							}
							game.updateRoundNumber();
						}
					},
				};
				lib.translate.ykinterweave='交织';
				lib.translate.ykinterweave_info='即时技，一名其他角色回合结束后，你从因其打出或丢弃进入弃牌堆的牌中获得一张牌，然后将剩余牌以任意顺序置于牌堆顶或牌堆底或置入弃牌堆，即时效果：无法对同一角色连续使用此技能，你可以于一名其他角色回合内的任意时刻发动，令其弃置身上所有牌并摸等量牌，若其因此而弃置的装备牌数不少于两张，你流失一点体力并摸两张牌，否则你弃置两张牌并回复一点体力。即时效果：每名角色回合内限一次，你可以于一名该回合内的任意时刻发动，选择获得或弃置其一张手牌。';
				player.addSkill('ykinterweave');
				if((lib.config['yk_ykmingyunInterweave_rank']||0)>=5) player.gainMaxHp();
				if((lib.config['yk_ykmingyunInterweave_rank']||0)>=4) player.recover(player.maxHp-player.hp);
			}
			else{
				player.recover(1-player.hp);
				if(player.countCards('h')<player.maxHp) player.draw(player.maxHp-player.countCards('h'));
				player.ykgainMark_ming(7);
				player.yk_mingyun=Math.max(player.yk_mingyun,7);
			}
			if((lib.config['yk_ykmingyunInterweave_rank']||0)>=3) player.ykRecover('Mp',200);
			if((lib.config['yk_ykmingyunInterweave_rank']||0)>=2) player.ykRecover('Defend',400);
			if((lib.config['yk_ykmingyunInterweave_rank']||0)>=1) player.draw();
		}
	}
	
	//阿卡莱
	lib.skill.ykchashi={
		enable:"phaseUse",
		usable:1,
		selectTarget:1,
		filterTarget:(event,player,target)=>{
			return player!=target&&target.countCards('h');
		},
		filter:(event,player)=>{
			if((lib.config['yk_ykchashi_rank']||0)>=5) return true;
			else return player.ykCheckConsume('Mp',175);
		},
		content:()=>{
			'step 0'
			if((lib.config['yk_ykchashi_rank']||0)<5) player.ykConsume('Mp',175);
			if((lib.config['yk_ykchashi_rank']||0)>=1) player.ykRecover('Defend',50);
			if((lib.config['yk_ykchashi_rank']||0)>=2) player.ykRecover('Mp',30);
			if((lib.config['yk_ykchashi_rank']||0)>=3&&Math.random()<0.25) player.draw();
			event.target=target;
			var cards=target.getCards('h');
			target.showCards(cards);
			var list=[],list1=[],list2=[];
			for(var cardx of cards){
				list1.push(cardx.type);
				list2.push(cardx.suit);
			}
			for(var card of player.getCards('h')){
				if(list1.indexOf(card.type)==-1||list2.indexOf(card.suit)==-1) list.push(card);
			}
			if(list.length) player.chooseButton(['请选择弃置一张牌',list]).set('ai',button=>{
				return -get.value(button,player);
			});
			'step 1'
			if(result.bool){
				player.discard(result.links[0]);
				if(player.hasSkill('ykchashi_check')) player.storage.ykchashi_ckzm++;
				if((lib.config['yk_ykchashi_rank']||0)>=4&&Math.random()<0.25) player.storage.ykchashi_ckzm++;
				event.target.damage();
				player.draw();
				event.target.draw();
			}
		},
		ai:{
			order:1,
			result:{
				draw:1,
				damage:1,
				target:function(player,target){
					return -1;
				},
			},
		},
		group:['ykchashi_ckzm','ykchashi_check'],
		subSkill:{
			ckzm:{
				init:player=>{
					if(typeof player.storage.ykchashi_ckzm!='number') player.storage.ykchashi_ckzm=0;
				},
				mod:{
					attackRange:function(player,num){
						return num+player.countMark('ykchashi_ckzm');
					},
				},
				intro:{
					content:"【苍空之明】：攻击范围+#",
				},
				mark:true,
				marktext:'明',
				equipSkill:true,
				trigger:{
					source:"damageBegin",
					player:"useCard",
				},
				filter:(event,player)=>{
					if(event.name=='damage') return event.source==player&&event.player!=event.source&&event.source.isEmpty(1)&&!event.source.isDisabled(1);
					else{
						var card=event.card;
						if(!card&&event.cards) card=event.cards[0];
						if(!card) return false;
						if(card.subtype=='equip1') return true;
						return false;
					}
				},
				forced:true,
				silent:true,
				popup:false,
				content:()=>{
					if(trigger.name=='damage'){
						if(Math.random()<0.1) trigger.player.yk_addElement('yk_light');
						if(Math.random()<0.5) trigger.source.storage.ykchashi_ckzm++;
						trigger.source.popup('苍空之明');
					}
					else{
						player.removeSkill('ykchashi_ckzm');
					}
				},
			},
			check:{
				trigger:{
					player:"phaseBegin",
				},
				filter:(event,player)=>{
					return player.isEmpty(1)&&!player.isDisabled(1);
				},
				forced:true,
				silent:true,
				popup:false,
				content:()=>{
					if(player.isEmpty(1)&&!player.isDisabled(1)) player.addSkill('ykchashi_ckzm');
					else player.removeSkill('ykchashi_ckzm');
				},
			},
		},
	}
	lib.skill.ykzhiyi={
		trigger:{
			global:["damageAfter","juedouAfter"],
		},
		filter:(event,player)=>{
			if(event.name=='damage'&&!player.ykCheckConsume('Mp',100)) return false;
			if(event.name=='damage') return event.player!=player&&(event.player.hp<=player.hp||event.player.countCards('h')<player.countCards('h'))&&event.source&&event.source!=player;
			else return true;
		},
		forced:true,
		content:()=>{
			'step 0'
			player.ykConsume('Mp',100);
			if(trigger.name=='damage') player.chooseToDiscard('将一张牌当作【决斗】，对'+get.translation(trigger.source.name)+'使用');
			else{
				var evt=_status.event,bool;
				while(evt.name!='game'){
					evt=evt.getParent();
					if(evt.skill=='ykzhiyi') bool=true;
				}
				if(bool){
					if(trigger.turn!=player){
						player.draw(2);
						if(player.ykzhiyi_target){
							player.ykzhiyi_target.recover();
							player.ykzhiyi_target.draw();
							if(player.ykzhiyi_target.sex=='female') player.ykzhiyi_target.chooseToDiscard('是否弃置一张红桃/方块/梅花/黑桃牌，令其回复一点体力/令其摸两张牌/令原伤害来源弃置两张牌/令原伤害来源翻面？');
						}
					}
					else{
						player.ykzhiyi_target.draw();
						if((lib.config['yk_ykzhiyi_rank']||0)>=4) player.draw(2);
						if((lib.config['yk_ykzhiyi_rank']||0)>=5) player.recover();
					}
				}
			}
			'step 1'
			if(trigger.name=='damage'&&result.bool){
				if((lib.config['yk_ykzhiyi_rank']||0)>=1) player.ykRecover('Defend',50);
				if((lib.config['yk_ykzhiyi_rank']||0)>=2) player.ykRecover('Mp',50);
				if((lib.config['yk_ykzhiyi_rank']||0)>=3&&Math.random()<0.25) player.draw();
				player.useCard(false,{name:'juedou',isCard:true},trigger.source);
				_status.event.skill='ykzhiyi';
				player.ykzhiyi_target=trigger.player;
				player.ykzhiyi_source=trigger.source;
			}
			else if(trigger.name=='juedou'&&result.bool&&result.cards.length){
				if(result.cards[0].suit=='heart') player.ykzhiyi_target.recover();
				else if(result.cards[0].suit=='diamond') player.ykzhiyi_target.draw(2);
				else if(result.cards[0].suit=='club') player.ykzhiyi_source.chooseToDiscard('he',2,true);
				else if(result.cards[0].suit=='spade') player.ykzhiyi_source.turnOver(true);
			}
		},
	}
	//SkillTranslate
	if(!window.YK_getNodeIntro) window.YK_getNodeIntro=get.nodeintro;
	get.nodeintro=function(node,simple,evt){
		var uiintro=window.YK_getNodeIntro(node,simple,evt);
		if(node.classList.contains('character')){
			var character=node.link;
		}
		else{
			var character=node.name;
		}
		if(!character) return uiintro;
		var ykCharacter=[];
		for(var i in window.yunkong_Character.character){
			ykCharacter.push(i);
		}
		if(ykCharacter&&ykCharacter.indexOf(character)!=-1){
			var introduce=lib.characterIntro[character];
			if(!uiintro._place_text||(uiintro._place_text.indexOf(lib.translate[character+'_ykIntroduce'])==-1&&uiintro._place_text.indexOf(introduce)==-1)){uiintro._place_text=uiintro.add('<div class="text">'+(lib.translate[character+'_ykIntroduce']||introduce||'')+'</div>');}//lib.translate['qxq_yk_tian_ykIntroduce']='测试测试测试';
			if(lib.qxq_yk_bossList&&lib.qxq_yk_bossList.indexOf(character)==-1){
				//显示装备、秘籍
				var hasBook=false;
				uiintro._place_text=uiintro.add('<br><b>————秘籍————</b>');
				if(lib.config[character+'_book']!=undefined&&typeof lib.config[character+'_book']=='string'){
					uiintro._place_text=uiintro.add('<small>（点击秘籍图片查看该秘籍详细信息）</small>');
					if(lib.ykBook&&lib.ykBook[lib.config[character+'_book']]&&lib.ykBook[lib.config[character+'_book']].image) uiintro._place_text=uiintro.add('<a style="color:black" href=\'javascript:window.ykIntroduceEquip("'+lib.config[character+'_book']+'",false,"Book");\'><img style=width:50px height:50px src="'+lib.assetURL+'extension/云空/'+lib.ykBook[lib.config[character+'_book']].image+'"></a>');
					else uiintro._place_text=uiintro.add('<a style="color:black" href=\'javascript:window.ykIntroduceEquip("'+lib.config[character+'_book']+'",false,"Book");\'><img style=width:50px height:50px src="'+lib.assetURL+'extension/云空/'+lib.config[character+'_book']+'.jpg"></a>');
				}else if(lib.config[character+'_book']!=undefined&&typeof lib.config[character+'_book']!='string'){
					uiintro._place_text=uiintro.add('数据错误！');
				}
				
				if(!hasBook) uiintro._place_text=uiintro.add('无');
				
				var hasEquip=false;
				uiintro._place_text=uiintro.add('<br><b>————装备————</b>');
				var equipTypeList=['equip1','equip2','equip3','equip4'];//武器、防具、饰品、其他
				for(var item of equipTypeList) if(lib.config[character+'_'+item]!=undefined&&typeof lib.config[character+'_'+item]=='string'){
					hasEquip=true;
					var word='';
					switch(item){
						case 'equip1':word='武器';break;
						case 'equip2':word='防具';break;
						case 'equip3':word='饰品';break;
						case 'equip4':word='其他';break;
					}
					uiintro._place_text=uiintro.add('<small>（点击装备图片查看该装备详细信息）</small>');
					uiintro._place_text=uiintro.add('<small>———— '+word+' ————</small>');
					if(lib.ykEquip&&lib.ykEquip[lib.config[character+'_'+item]]&&lib.ykEquip[lib.config[character+'_'+item]].image) uiintro._place_text=uiintro.add('<a style="color:black" href=\'javascript:window.ykIntroduceEquip("'+lib.config[character+'_'+item]+'");\'><img style=width:50px height:50px backgroundSize:cover src="'+lib.assetURL+'extension/云空/'+lib.ykEquip[lib.config[character+'_'+item]].image+'"></a>');
					else uiintro._place_text=uiintro.add('<a style="color:black" href=\'javascript:window.ykIntroduceEquip("'+lib.config[character+'_'+item]+'");\'><img style=width:50px height:50px backgroundSize:cover src="'+lib.assetURL+'extension/云空/'+lib.config[character+'_'+item]+'.jpg"></a>');
					uiintro._place_text=uiintro.add('<small>'+(lib.translate[lib.config[character+'_'+item]]==undefined?'未知装备':get.translation(lib.config[character+'_'+item]))+'</small>');
				}else if(lib.config[character+'_'+item]!=undefined&&typeof lib.config[character+'_'+item]!='string'){
					uiintro._place_text=uiintro.add('数据错误！');
				}
				if(!hasEquip) uiintro._place_text=uiintro.add('无');
			}
		}
		return uiintro;
	}
	//lib.translate['qxq_yk_tian_ykIntroduce']=window.yunkong_Character.characterIntro['qxq_yk_tian'];
	//天
	lib.translate['fazetiandingx']=window.fazetiandingx='法则天定';
	lib.translate['fazetiandingx_info']=window.fazetiandingx_info='出牌阶段限一次，你可以选择一名其他角色的一个指定技能，选择修改该技能的时机、条件、效果或其他项目。';
	lib.translate['fazetianding']=window.fazetianding='法则天定';
	lib.translate['tiandaowuchang']=window.tiandaowuchang='天道无常';
	lib.translate['tiandaowuchang_info']=window.tiandaowuchang_info='【“天”专属效果】你使用特定卡牌时，根据卡牌执行如下效果：<br>&nbsp&nbsp①春生：摸X张牌，每摸两张回复一点体力（X为已损体力值）<br>&nbsp&nbsp②夏荣：手牌上限+X直到你的下一回合开始，每加两点，你额外摸一张牌（X为已损体力值）<br>&nbsp&nbsp③秋枯：场上除你外的所有其他角色需将一半的手牌或者当前体力值的一半（均向下取整）交予你<br>&nbsp&nbsp④冬寂：场上除你外的所有角色选择一项：翻面或受到两点无来源的冰属性伤害。<br>你手中的“春生”、“夏荣”、“秋枯”、“冬寂”均不计入手牌上限。';
	lib.translate['shengmieshenyu']=window.shengmieshenyu='生灭神域';
	lib.translate['shengmieshenyu_info']=window.shengmieshenyu_info='你成为任意伤害的目标时，场上除你外的所有角色各从“春生”、“夏荣”、“秋枯”、“冬寂”中选择一种卡牌中置于堆顶（至少为五张，不足则由系统随机补充），随后亮出所有以此法置于堆顶的卡牌，若其中“春生”和“夏荣”总数大于“秋枯”和“冬寂”，则你立即将手牌摸至上限，然后增加等同于场上血量最多的一名角色的血量上限并立即回复满血，若其中“春生”和“夏荣”总数小于“秋枯”和“冬寂”，场上除你外的已损体力值最多的角色将血量上限减至与当前血量相等；若四种牌中“春生”最多，则你清除自身翻面状态并获得一张“春生”；若四种牌中“夏荣”最多，则你获得一张“夏荣”，且每拥有一张“夏荣”，便额外摸一张牌并增加一点手牌上限直到你的下回合开始；若四种牌中“秋枯”最多，则你获得一张“秋枯”，且全场除你外的手牌最多的角色弃置其一半的手牌；若四种牌中“冬寂”最多，则你获得一张“冬寂”，且全场除你外的体力值最少的角色将武将牌翻面并受到一点无来源伤害。';
	
	//魇梦月见
	lib.translate['ykshimeng']='蚀梦';
	lib.translate['ykshimeng_info']='游戏开始时，释放梦境，令场上所有人进入“蚀梦”状态，你的出牌阶段再次发动此次技能时，或当你在创造的梦境中死亡或失去此技能时，令所有人退出“蚀梦”状态，退出的角色将武将牌复原至进入梦境前的状态，然后你将梦境中除你外阵亡的第一名角色魂魄侵蚀，使之为你的随从，若无人阵亡，则使梦境中除你外受伤次数最多的角色侵蚀为你的随从<b>（此侵蚀效果对【魁首】失效）</b>。';
	lib.translate['ykshimeng_shijix']='蚀梦';
	lib.translate['ykshimeng_shijix1']='蚀梦';
	lib.translate['qxq_yk_yanmengyuejian_ykIntroduce']=((lib.config['yk_ykshimeng_rank']||0)>=1?'<font color=orange>':'<font color=grey>')+'蚀梦</font>';
	lib.translate['qxq_yk_yanmengyuejian_ykIntroduce']+='<br>'+((lib.config['yk_ykshimeng_rank']||0)>=1?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'蚀梦Lv1.梦境破碎时额外摸一张牌</font>';
	lib.translate['qxq_yk_yanmengyuejian_ykIntroduce']+='<br>'+((lib.config['yk_ykshimeng_rank']||0)>=2?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'蚀梦Lv2.梦境随从阵亡时额外摸一张牌</font>';
	lib.translate['qxq_yk_yanmengyuejian_ykIntroduce']+='<br>'+((lib.config['yk_ykshimeng_rank']||0)>=3?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'蚀梦Lv3.梦境随从阵亡时回复100点术法值</font>';
	lib.translate['qxq_yk_yanmengyuejian_ykIntroduce']+='<br>'+((lib.config['yk_ykshimeng_rank']||0)>=4?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'蚀梦Lv4.梦境随从阵亡时回复100点元力值</font>';
	lib.translate['qxq_yk_yanmengyuejian_ykIntroduce']+='<br>'+((lib.config['yk_ykshimeng_rank']||0)>=5?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'蚀梦Lv5.梦境破碎时立即获得一个回合，梦境随从阵亡时立即将真气值回复至上限</font>';
	lib.translate['ykyueyan']='月魇';
	lib.translate['ykyueyan_info']='<li>被动效果：除你外的任意角色各限一次，其出牌阶段可以响应你并成为三回合的【梦魇尤物】，将手牌摸至体力上限，若此时处于梦境之中，则你修复体力上限并回复满体力。场上同时只能存在一名【梦魇尤物】。所有角色退出梦境时重置变身记录。<br><li>【梦魇尤物】： 体力和体力上限为5，继承变身前的所有技能，额外获得技能【恐惧】和【失魂】，三回合后变回原武将，恢复变身前的技能、体力值和体力上限。<br><li>【恐惧】：成为【梦魇尤物】卡牌目标的角色暂时成为白板直到场上任意角色回合结束。<br><li>【失魂】：锁定技，其变身的最后一回合的出牌阶段将由【魇梦月见】控制。<br><li>场上存在【梦魇尤物】时，你不能被卡牌和技能选中，成为卡牌的目标时取消该卡牌对自己的效果（对自己使用“桃”和“酒”除外）。<br><li>主动效果：任意角色响应时，你可以消耗300点术法值，获取两张无花色和点数的“梦魇”牌，你的梦魇牌可以消耗35/60/45/100元力值当作任意基本牌/锦囊牌/延时锦囊牌/装备牌使用或打出，或消耗50元力值并重铸为其他牌。';
	lib.translate['qxq_yk_yanmengyuejian_ykIntroduce']+='<br><br>'+((lib.config['yk_ykyueyan_rank']||0)>=1?'<font color=orange>':'<font color=grey>')+'月魇</font>';
	lib.translate['qxq_yk_yanmengyuejian_ykIntroduce']+='<br>'+((lib.config['yk_ykyueyan_rank']||0)>=1?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'月魇Lv1.任意其他角色响应时，你立即获得一张“梦魇”牌</font>';
	lib.translate['qxq_yk_yanmengyuejian_ykIntroduce']+='<br>'+((lib.config['yk_ykyueyan_rank']||0)>=2?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'月魇Lv2.任意其他角色响应时，你立即回复50点真气值</font>';
	lib.translate['qxq_yk_yanmengyuejian_ykIntroduce']+='<br>'+((lib.config['yk_ykyueyan_rank']||0)>=3?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'月魇Lv3.任意其他角色响应时，你立即回复100点术法值</font>';
	lib.translate['qxq_yk_yanmengyuejian_ykIntroduce']+='<br>'+((lib.config['yk_ykyueyan_rank']||0)>=4?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'月魇Lv4.进入游戏时，你获得两张“梦魇”牌；任意其他角色响应时，你立即回复50点元力值，且重铸和打出“梦魇”牌的元力值消耗均降低50点</font>';
	lib.translate['qxq_yk_yanmengyuejian_ykIntroduce']+='<br>'+((lib.config['yk_ykyueyan_rank']||0)>=5?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'月魇Lv5.任意其他角色响应时，你装备一张拥有该角色武将牌的技能的宝物</font>';
	
	//小乔
	lib.translate['yktianxiang']='天香';
	lib.translate['yktianxiang_info']='你受到伤害后，可将一张非红桃手牌替换为红桃手牌(数字、牌名均不变)并猜测一次判定牌花色，若正确，你回复一点体力，否则摸一张与猜测花色相同的牌。<li>出牌阶段每种花色各限一次，消耗(75+本回合使用次数x25)术法值，弃置一张牌，选择一个目标：1、若为你，返还术法值并回复50元力值和25真气值；2、若不为你，进行判定，若其手牌中有与判定牌或所弃牌花色相同，你摸两张。若你已弃置全部非黑桃花色，则回复200元力值，激活【朱颜·辞镜】直到任意角色回合结束。';
	lib.translate['qxq_yk_xiaoqiao_ykIntroduce']=((lib.config['yk_yktianxiang_rank']||0)>=1?'<font color=orange>':'<font color=grey>')+'天香</font>';
	lib.translate['qxq_yk_xiaoqiao_ykIntroduce']+='<br>'+((lib.config['yk_yktianxiang_rank']||0)>=1?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'天香Lv1.弃置所有非黑桃花色后，你额外摸一张牌</font>';
	lib.translate['qxq_yk_xiaoqiao_ykIntroduce']+='<br>'+((lib.config['yk_yktianxiang_rank']||0)>=2?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'天香Lv2.若目标为你，额外回复50术法值</font>';
	lib.translate['qxq_yk_xiaoqiao_ykIntroduce']+='<br>'+((lib.config['yk_yktianxiang_rank']||0)>=3?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'天香Lv3.此技能弃置一张牌时回复的真气值增加50点</font>';
	lib.translate['qxq_yk_xiaoqiao_ykIntroduce']+='<br>'+((lib.config['yk_yktianxiang_rank']||0)>=4?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'天香Lv4.若目标为你，你摸一张牌</font>';
	lib.translate['qxq_yk_xiaoqiao_ykIntroduce']+='<br>'+((lib.config['yk_yktianxiang_rank']||0)>=5?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'天香Lv5.当你以此技能弃置最后一张手牌时，你立即摸两张牌</font>';
	lib.translate['ykzhuyan']='朱颜';
	lib.translate['ykzhuyan_info']='锁定技，你的黑桃牌均视为红桃，若一名角色的判定牌为黑色，则你可以消耗20术法值并打出红色牌代替之，若你打出红桃牌，则你获得技能【朱颜·辞镜】直到任意角色回合结束。<br><b>【朱颜·辞镜】</b>：<br>消耗80/140/100/200元力值，将一张红桃手牌当作任意基本牌/锦囊牌/延时锦囊牌/装备牌使用或打出。';
	lib.translate['qxq_yk_xiaoqiao_ykIntroduce']+='<br><br>'+((lib.config['yk_ykzhuyan_rank']||0)>=1?'<font color=orange>':'<font color=grey>')+'朱颜</font>';
	lib.translate['qxq_yk_xiaoqiao_ykIntroduce']+='<br>'+((lib.config['yk_ykzhuyan_rank']||0)>=1?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'朱颜Lv1.打出判定替代牌时，立即回复50点真气值</font>';
	lib.translate['qxq_yk_xiaoqiao_ykIntroduce']+='<br>'+((lib.config['yk_ykzhuyan_rank']||0)>=2?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'朱颜Lv2.【朱颜·辞镜】的元力值消耗降低30点</font>';
	lib.translate['qxq_yk_xiaoqiao_ykIntroduce']+='<br>'+((lib.config['yk_ykzhuyan_rank']||0)>=3?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'朱颜Lv3.你打出判定替代牌后，该角色判定结果不可更改</font>';
	lib.translate['qxq_yk_xiaoqiao_ykIntroduce']+='<br>'+((lib.config['yk_ykzhuyan_rank']||0)>=4?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'朱颜Lv4.打出判定替代牌前，立即获得原判定牌</font>';
	lib.translate['qxq_yk_xiaoqiao_ykIntroduce']+='<br>'+((lib.config['yk_ykzhuyan_rank']||0)>=5?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'朱颜Lv5.若你打出的判定替代牌为红桃，则你回复一点体力</font>';
	lib.translate['ykpiaoling']='飘零';
	lib.translate['ykpiaoling_info']='出牌阶段，将任意张红桃牌交给一名其他角色，每交出一张牌，回复60术法值和30元力值，若牌数超过你当前的体力值，则你获得【寄篱】直到你的下个回合开始前。<br><b>【寄篱】</b>：锁定技，任意以你为目标的牌，将此牌的目标转移给该角色；该角色获得牌时，需将牌数量的一半（向下取整）分给你。';
	lib.translate['qxq_yk_xiaoqiao_ykIntroduce']+='<br><br>'+((lib.config['yk_ykpiaoling_rank']||0)>=1?'<font color=orange>':'<font color=grey>')+'飘零</font>';
	lib.translate['qxq_yk_xiaoqiao_ykIntroduce']+='<br>'+((lib.config['yk_ykpiaoling_rank']||0)>=1?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'飘零Lv1.每交出一张牌，额外回复20术法值</font>';
	lib.translate['qxq_yk_xiaoqiao_ykIntroduce']+='<br>'+((lib.config['yk_ykpiaoling_rank']||0)>=2?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'飘零Lv2.交出最后一张手牌时，立即从该角色获得一张牌</font>';
	lib.translate['qxq_yk_xiaoqiao_ykIntroduce']+='<br>'+((lib.config['yk_ykpiaoling_rank']||0)>=3?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'飘零Lv3.交出最后一张红桃牌时，立即摸一张牌</font>';
	lib.translate['qxq_yk_xiaoqiao_ykIntroduce']+='<br>'+((lib.config['yk_ykpiaoling_rank']||0)>=4?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'飘零Lv4.交出最后一张红桃牌时，获得一点护甲</font>';
	lib.translate['qxq_yk_xiaoqiao_ykIntroduce']+='<br>'+((lib.config['yk_ykpiaoling_rank']||0)>=5?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'飘零Lv5.你获得【寄篱】时，可选择将武将牌翻面</font>';
	
	//茯苓
	lib.translate['yktianyi']='天医';
	lib.translate['yktianyi_info']='你可以消耗60术法值将红桃牌当作桃、黑桃牌当作酒使用或打出，每次使用此技能，你失去一点体力并摸一张牌，然后获得一点护甲，并立即回复50真气值；';
	lib.translate['qxq_yk_fuling_ykIntroduce']=((lib.config['yk_yktianyi_rank']||0)>=1?'<font color=orange>':'<font color=grey>')+'天医</font>';
	lib.translate['qxq_yk_fuling_ykIntroduce']+='<br>'+((lib.config['yk_yktianyi_rank']||0)>=1?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'天医Lv1.消耗术法值减少10点</font>';
	lib.translate['qxq_yk_fuling_ykIntroduce']+='<br>'+((lib.config['yk_yktianyi_rank']||0)>=2?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'天医Lv2.每次使用此技能，额外摸一张牌</font>';
	lib.translate['qxq_yk_fuling_ykIntroduce']+='<br>'+((lib.config['yk_yktianyi_rank']||0)>=3?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'天医Lv3.每次使用此技能，回复75真气值</font>';
	lib.translate['qxq_yk_fuling_ykIntroduce']+='<br>'+((lib.config['yk_yktianyi_rank']||0)>=4?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'天医Lv4.每次使用此技能，额外获得一点护甲</font>';
	lib.translate['qxq_yk_fuling_ykIntroduce']+='<br>'+((lib.config['yk_yktianyi_rank']||0)>=5?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'天医Lv5.消除此技能的失去体力的效果</font>';
	lib.translate['ykwuji']='无疾';
	lib.translate['ykwuji_info']='出牌阶段限三次，回合内对同一名角色限一次，你可消耗40术法值，选择一个已受伤的目标并猜测其手牌中没有的一种花色，若猜测成功，则你摸一张牌且其选择回复一点体力或摸一张牌，若猜测失败，则你弃置一张牌，其从牌堆中获得一张与你猜测花色相同的牌。';
	lib.translate['qxq_yk_fuling_ykIntroduce']+='<br><br>'+((lib.config['yk_ykwuji_rank']||0)>=1?'<font color=orange>':'<font color=grey>')+'无疾</font>';
	lib.translate['qxq_yk_fuling_ykIntroduce']+='<br>'+((lib.config['yk_ykwuji_rank']||0)>=1?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'无疾Lv1.术法值消耗减少5点</font>';
	lib.translate['qxq_yk_fuling_ykIntroduce']+='<br>'+((lib.config['yk_ykwuji_rank']||0)>=2?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'无疾Lv2.回合内对同一名角色改为可使用两次</font>';
	lib.translate['qxq_yk_fuling_ykIntroduce']+='<br>'+((lib.config['yk_ykwuji_rank']||0)>=3?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'无疾Lv3.若猜测成功，返还本次术法值消耗</font>';
	lib.translate['qxq_yk_fuling_ykIntroduce']+='<br>'+((lib.config['yk_ykwuji_rank']||0)>=4?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'无疾Lv4.回合内对同一名角色猜测成功后，再次对该角色发动此技能时你摸两张牌</font>';
	lib.translate['qxq_yk_fuling_ykIntroduce']+='<br>'+((lib.config['yk_ykwuji_rank']||0)>=5?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'无疾Lv5.若猜测成功，你回复一点体力</font>';
	
	//空山泠雪
	lib.translate['ykfuji']='扶乩';
	lib.translate['ykfuji_info']='锁定技，游戏开始时，你视为拥有额外塔罗牌堆，你的摸牌阶段按以下规则摸牌：每个摸牌阶段，你均拥有(2n+2)命值（n为原摸牌数）。你可以消耗命值和术法值获取塔罗牌，每摸一张塔罗牌，消耗1命值和（15+10*连续扶乩次数）术法值，最多连续抽取五次塔罗牌，同时最多放置三张不同塔罗牌于武将牌上，【扶乩】结束后，你获得等同于命值数一半数量的普通卡牌（向下取整）。每当游戏轮数为7的倍数时，移除武将牌上的所有塔罗牌并重置塔罗牌堆。<li><b>塔罗牌堆牌数为78张，牌堆中的塔罗牌数小于5张时自动重置塔罗牌堆，每次获取塔罗牌，均从牌堆顶或牌堆底抽取一张作为选项。（在武将牌上放置多张相同塔罗牌时，自动弃置此牌且不会产生相应塔罗牌效果）</b>';
	lib.translate['qxq_yk_kongshanlingxue_ykIntroduce']=((lib.config['yk_ykfuji_rank']||0)>=1?'<font color=orange>':'<font color=grey>')+'扶乩</font>';
	lib.translate['qxq_yk_kongshanlingxue_ykIntroduce']+='<br>'+((lib.config['yk_ykfuji_rank']||0)>=1?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'扶乩Lv1.每次抽取，分别从牌堆顶和牌堆底抽取一张作为选项，未获取的塔罗牌自动弃置</font>';
	lib.translate['qxq_yk_kongshanlingxue_ykIntroduce']+='<br>'+((lib.config['yk_ykfuji_rank']||0)>=2?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'扶乩Lv2.每获得一张塔罗牌，有20%概率额外摸一张牌，你的手牌上限增加等同于已放置的塔罗牌数</font>';
	lib.translate['qxq_yk_kongshanlingxue_ykIntroduce']+='<br>'+((lib.config['yk_ykfuji_rank']||0)>=3?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'扶乩Lv3.抽取次数上限+1</font>';
	lib.translate['qxq_yk_kongshanlingxue_ykIntroduce']+='<br>'+((lib.config['yk_ykfuji_rank']||0)>=4?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'扶乩Lv4.放置塔罗牌上限+1</font>';
	lib.translate['qxq_yk_kongshanlingxue_ykIntroduce']+='<br>'+((lib.config['yk_ykfuji_rank']||0)>=5?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'扶乩Lv5.初始命值增加1点</font>';
	
	//巫王玄月
	lib.translate['ykwujian']='无剑';
	lib.translate['ykwujian_info']='<small><i>————手中无剑，心中无剑。</i></small><br>你没有“杀”且没有武器牌时，你可以消耗35术法值，将任何一张牌当作“杀”使用或打出，每次发动此技能，若你没有装备牌，则你自动从牌堆或弃牌堆中装备一张装备牌直到本次出杀结束。';
	lib.translate['qxq_yk_wuwangxuanyue_ykIntroduce']=((lib.config['yk_ykwujian_rank']||0)>=1?'<font color=orange>':'<font color=grey>')+'无剑</font>';
	lib.translate['qxq_yk_wuwangxuanyue_ykIntroduce']+='<br>'+((lib.config['yk_ykwujian_rank']||0)>=1?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'无剑Lv1.未装备武器时，每次发动此技能，你回复50真气值</font>';
	lib.translate['qxq_yk_wuwangxuanyue_ykIntroduce']+='<br>'+((lib.config['yk_ykwujian_rank']||0)>=2?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'无剑Lv2.未装备武器时，每次发动有10%概率获得一点护甲</font>';
	lib.translate['qxq_yk_wuwangxuanyue_ykIntroduce']+='<br>'+((lib.config['yk_ykwujian_rank']||0)>=3?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'无剑Lv3.未装备武器时，每次发动此技能，你有35%概率摸一张牌</font>';
	lib.translate['qxq_yk_wuwangxuanyue_ykIntroduce']+='<br>'+((lib.config['yk_ykwujian_rank']||0)>=4?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'无剑Lv4.未装备武器时，每次发动此技能，若未触发无剑Lv3的效果，则你有20%概率获得一张“杀”</font>';
	lib.translate['qxq_yk_wuwangxuanyue_ykIntroduce']+='<br>'+((lib.config['yk_ykwujian_rank']||0)>=5?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'无剑Lv5.未装备武器时，每当你因此技能失去最后一张手牌，你立即摸一张</font>';
	lib.translate['ykjuejian']='绝剑';
	lib.translate['ykjuejian_info']='<small><i>————剑既出，断无收回之理。</i></small><br>你有武器牌且使用“杀”时，自动消耗35术法值，令此“杀”无视防具。';
	lib.translate['qxq_yk_wuwangxuanyue_ykIntroduce']+='<br><br>'+((lib.config['yk_ykjuejian_rank']||0)>=1?'<font color=orange>':'<font color=grey>')+'绝剑</font>';
	lib.translate['qxq_yk_wuwangxuanyue_ykIntroduce']+='<br>'+((lib.config['yk_ykjuejian_rank']||0)>=1?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'绝剑Lv1.每次发动此技能，回复10术法值</font>';
	lib.translate['qxq_yk_wuwangxuanyue_ykIntroduce']+='<br>'+((lib.config['yk_ykjuejian_rank']||0)>=2?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'绝剑Lv2.每次发动此技能，回复35真气值</font>';
	lib.translate['qxq_yk_wuwangxuanyue_ykIntroduce']+='<br>'+((lib.config['yk_ykjuejian_rank']||0)>=3?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'绝剑Lv3.每次发动此技能，有15%概率摸一张牌</font>';
	lib.translate['qxq_yk_wuwangxuanyue_ykIntroduce']+='<br>'+((lib.config['yk_ykjuejian_rank']||0)>=4?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'绝剑Lv4.每次发动此技能，若未触发绝剑Lv3的效果，则你有20%概率获得一张“杀”</font>';
	lib.translate['qxq_yk_wuwangxuanyue_ykIntroduce']+='<br>'+((lib.config['yk_ykjuejian_rank']||0)>=5?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'绝剑Lv5.若你打出的“杀”为黑色，则有20%概率获得一点护甲</font>';
	lib.translate['ykshilie']='时裂';
	lib.translate['ykshilie_info']='<small><i>————此乃超越天道之一剑，惊艳万古，即便是道则亦不能阻之！<br>巫王玄月集精气神，斩出超越常理的一剑，甚至割裂了时空！</i></small><br>出牌阶段限一次，消耗300术法值打出一张不计入出杀次数且不可被响应的“杀”，此杀造成伤害时为目标附加【时之裂隙】效果：该角色不能打出和响应任何牌，暂时失去所有技能且在此效果结束前迟滞所有伤害、回复/流失体力、摸/弃牌、增/减体力上限事件的结算直到其回合开始时或你发动第二段斩击【时裂·断绝】时消除此效果，消除时统一结算迟滞期间累积的所有事件。直到该角色回合开始前，你可于任意事件发生时发动【时裂·断绝】';
	lib.translate['qxq_yk_wuwangxuanyue_ykIntroduce']+='<br><br>'+((lib.config['yk_ykshilie_rank']||0)>=1?'<font color=orange>':'<font color=grey>')+'时裂</font>';
	lib.translate['qxq_yk_wuwangxuanyue_ykIntroduce']+='<br>'+((lib.config['yk_ykshilie_rank']||0)>=1?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'时裂Lv1.每次发动此技能时，回复75真气值</font>';
	lib.translate['qxq_yk_wuwangxuanyue_ykIntroduce']+='<br>'+((lib.config['yk_ykshilie_rank']||0)>=2?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'时裂Lv2.每次发动此技能时，回复50术法值</font>';
	lib.translate['qxq_yk_wuwangxuanyue_ykIntroduce']+='<br>'+((lib.config['yk_ykshilie_rank']||0)>=3?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'时裂Lv3.此杀造成伤害时，有50%概率清除目标所有护甲</font>';
	lib.translate['qxq_yk_wuwangxuanyue_ykIntroduce']+='<br>'+((lib.config['yk_ykshilie_rank']||0)>=4?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'时裂Lv4.此杀造成伤害时，有30%概率弃置目标所有牌</font>';
	lib.translate['qxq_yk_wuwangxuanyue_ykIntroduce']+='<br>'+((lib.config['yk_ykshilie_rank']||0)>=5?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'时裂Lv5.此杀造成伤害时，有25%概率为目标附加翻面效果</font>';
	
	//命运
	lib.translate['ykshenming']='神命';
	lib.translate['ykshenming_info']='牌堆顶的x张牌始终对你可见（x为“命”的数量，“命”上限为7个），其他角色的回合开始/回合结束后，你可以消耗25术法值，猜测一种牌名，若目标在直到其回合结束/回合开始前期间使用此牌，则你可执行以下一项：1、基本牌：令此牌失效，你弃置一张牌并摸一张牌，或令此牌继续生效，你摸一张牌；2、非基本牌：令此牌失效，你摸一张牌，或令此牌继续生效，你回复一点体力；若期间目标未使用此牌，则你失去一点体力并摸两张牌；猜中非基本牌名时，若该角色此前未被猜中过任何非基本牌型且未被【天算】猜中过任何牌，则你获得一个“命”。';
	lib.translate['qxq_yk_mingyun_ykIntroduce']=((lib.config['yk_ykshenming_rank']||0)>=1?'<font color=orange>':'<font color=grey>')+'神命</font>';
	lib.translate['qxq_yk_mingyun_ykIntroduce']+='<br>'+((lib.config['yk_ykshenming_rank']||0)>=1?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'神命Lv1.游戏开始时增加100点术法值上限</font>';
	lib.translate['qxq_yk_mingyun_ykIntroduce']+='<br>'+((lib.config['yk_ykshenming_rank']||0)>=2?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'神命Lv2.游戏开始时增加100点真气值上限</font>';
	lib.translate['qxq_yk_mingyun_ykIntroduce']+='<br>'+((lib.config['yk_ykshenming_rank']||0)>=3?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'神命Lv3.游戏开始时额外摸一张牌</font>';
	lib.translate['qxq_yk_mingyun_ykIntroduce']+='<br>'+((lib.config['yk_ykshenming_rank']||0)>=4?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'神命Lv4.游戏开始时获得两点护甲</font>';
	lib.translate['qxq_yk_mingyun_ykIntroduce']+='<br>'+((lib.config['yk_ykshenming_rank']||0)>=5?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'神命Lv5.猜测目标用牌成功时可再次猜测</font>';
	lib.translate['yktiansuan']='天算';
	lib.translate['yktiansuan_info']='其他角色的摸牌阶段开始时，你可以消耗40术法值，选择猜测其即将获得的牌名，若其中有与你猜测相同牌名的牌，你可以弃置等量牌，立即获得这些牌，或选择用任意一张手牌代替其中一张牌并对其造成一点伤害；若该角色此前未被【神命】猜中过任何非基本牌型且未被【天算】猜中过任何牌，则你获得一个“命”。';
	lib.translate['qxq_yk_mingyun_ykIntroduce']+='<br><br>'+((lib.config['yk_yktiansuan_rank']||0)>=1?'<font color=orange>':'<font color=grey>')+'天算</font>';
	lib.translate['qxq_yk_mingyun_ykIntroduce']+='<br>'+((lib.config['yk_yktiansuan_rank']||0)>=1?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'天算Lv1.选择获得牌时，额外回复术法值20点</font>';
	lib.translate['qxq_yk_mingyun_ykIntroduce']+='<br>'+((lib.config['yk_yktiansuan_rank']||0)>=2?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'天算Lv2.选择获得牌时，额外回复真气值50点</font>';
	lib.translate['qxq_yk_mingyun_ykIntroduce']+='<br>'+((lib.config['yk_yktiansuan_rank']||0)>=3?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'天算Lv3.选择获得牌时，额外摸一张牌</font>';
	lib.translate['qxq_yk_mingyun_ykIntroduce']+='<br>'+((lib.config['yk_yktiansuan_rank']||0)>=4?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'天算Lv4.选择替换牌时，额外摸一张牌</font>';
	lib.translate['qxq_yk_mingyun_ykIntroduce']+='<br>'+((lib.config['yk_yktiansuan_rank']||0)>=5?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'天算Lv5.选择替换牌时，50%概率回复一点体力</font>';
	lib.translate['ykmingyunInterweave']='命运';
	lib.translate['ykmingyunInterweave_info']='使命技，当你首次进入濒死状态时失去此技能并减一点体力上限，若此时你的“命”数量超过5，则你增加一点体力上限并回复至满体力，获得技能「交织」，否则你回复体力值至1并将手牌摸至体力上限，获得7个“命”。「交织」：即时技，一名其他角色回合结束后，你可以消耗15术法值，从因其打出或丢弃进入弃牌堆的牌中获得一张牌，然后将剩余牌以任意顺序置于牌堆顶或牌堆底或置入弃牌堆，即时效果：无法对同一角色连续使用此技能，你可以消耗75术法值，于一名其他角色回合内的任意时刻发动，令其弃置身上所有牌并摸等量牌，若其因此而弃置的装备牌数不少于两张，你流失一点体力并摸两张牌，否则你弃置两张牌并回复一点体力。';
	lib.translate['qxq_yk_mingyun_ykIntroduce']+='<br><br>'+((lib.config['yk_ykmingyunInterweave_rank']||0)>=1?'<font color=orange>':'<font color=grey>')+'命运</font>';
	lib.translate['qxq_yk_mingyun_ykIntroduce']+='<br>'+((lib.config['yk_ykmingyunInterweave_rank']||0)>=1?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'命运Lv1.触发使命技时，摸一张牌</font>';
	lib.translate['qxq_yk_mingyun_ykIntroduce']+='<br>'+((lib.config['yk_ykmingyunInterweave_rank']||0)>=2?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'命运Lv2.触发使命技时，回复400点真气值</font>';
	lib.translate['qxq_yk_mingyun_ykIntroduce']+='<br>'+((lib.config['yk_ykmingyunInterweave_rank']||0)>=3?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'命运Lv3.触发使命技时，回复200点术法值</font>';
	lib.translate['qxq_yk_mingyun_ykIntroduce']+='<br>'+((lib.config['yk_ykmingyunInterweave_rank']||0)>=4?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'命运Lv4.触发使命技成功时，回复体力值至上限</font>';
	lib.translate['qxq_yk_mingyun_ykIntroduce']+='<br>'+((lib.config['yk_ykmingyunInterweave_rank']||0)>=5?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'命运Lv5.触发使命技成功时，增加一点体力上限</font>';
	
	//阿卡莱
	lib.translate['ykchashi']='察识';
	lib.translate['ykchashi_info']='当你未装备武器时，你视为装备【苍空之明】，出牌阶段限一次，消耗175术法值，令一名其他角色展示其手牌并弃置一张与其手牌花色或类型各不同的牌使其受到一点伤害，若如此做，你与其各摸一张牌，然后若你有【苍空之明】，你的攻击范围+1。<br><br><li>「<font color=yellow>苍空之明</font>」：<br>初始攻击范围：1<br>锁定技，你造成的伤害有10%概率给目标附加光元素，你装备该武器时，每次造成伤害，均有50%概率增加1攻击范围，失去武器时，此效果不生效。';
	lib.translate['qxq_yk_akalai_ykIntroduce']=((lib.config['yk_ykchashi_rank']||0)>=1?'<font color=orange>':'<font color=grey>')+'察识</font>';
	lib.translate['qxq_yk_akalai_ykIntroduce']+='<br>'+((lib.config['yk_ykchashi_rank']||0)>=1?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'察识Lv1.发动此技能的主动效果时，回复50点真气值</font>';
	lib.translate['qxq_yk_akalai_ykIntroduce']+='<br>'+((lib.config['yk_ykchashi_rank']||0)>=2?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'察识Lv2.发动此技能的主动效果时，回复30点术法值</font>';
	lib.translate['qxq_yk_akalai_ykIntroduce']+='<br>'+((lib.config['yk_ykchashi_rank']||0)>=3?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'察识Lv3.发动此技能的主动效果时，25%概率额外摸一张牌</font>';
	lib.translate['qxq_yk_akalai_ykIntroduce']+='<br>'+((lib.config['yk_ykchashi_rank']||0)>=4?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'察识Lv4.发动此技能的主动效果时，25%概率使增加的攻击范围效果额外+1</font>';
	lib.translate['qxq_yk_akalai_ykIntroduce']+='<br>'+((lib.config['yk_ykchashi_rank']||0)>=5?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'察识Lv5.取消此技能的主动效果的术法值消耗</font>';
	lib.translate['ykzhiyi']='直义';
	lib.translate['ykzhiyi_info']='场上任意一名其他体力值或手牌数小于等于你的角色受到伤害时，你可以消耗100术法值，将一张牌当作“决斗”对伤害来源使用或打出，你使用此“决斗”胜利后，你摸两张牌并使该角色回复一点体力并摸一张牌，若该角色为女性，其弃置一张红桃/方块/梅花/黑桃牌，令其回复一点体力/令其摸两张牌/令原伤害来源弃置两张牌/令原伤害来源翻面；若决斗未胜利，该角色摸一张牌。';
	lib.translate['qxq_yk_akalai_ykIntroduce']+='<br><br>'+((lib.config['yk_ykzhiyi_rank']||0)>=1?'<font color=orange>':'<font color=grey>')+'直义</font>';
	lib.translate['qxq_yk_akalai_ykIntroduce']+='<br>'+((lib.config['yk_ykzhiyi_rank']||0)>=1?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'直义Lv1.发动此技能时，回复50点真气值</font>';
	lib.translate['qxq_yk_akalai_ykIntroduce']+='<br>'+((lib.config['yk_ykzhiyi_rank']||0)>=2?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'直义Lv2.发动此技能时，回复50点术法值</font>';
	lib.translate['qxq_yk_akalai_ykIntroduce']+='<br>'+((lib.config['yk_ykzhiyi_rank']||0)>=3?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'直义Lv3.发动此技能时，25%概率额外摸一张牌</font>';
	lib.translate['qxq_yk_akalai_ykIntroduce']+='<br>'+((lib.config['yk_ykzhiyi_rank']||0)>=4?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'直义Lv4.此“决斗”失败时，你摸两张牌</font>';
	lib.translate['qxq_yk_akalai_ykIntroduce']+='<br>'+((lib.config['yk_ykzhiyi_rank']||0)>=5?'<font color=orange>（已激活）':'<font color=grey>（未激活）')+'直义Lv5.此“决斗”失败时，你回复一点体力</font>';
	
	//没有获得武将时，清空武将对应技能
	if(!game.ykHasCharacter('qxq_yk_yanmengyuejian')){
		lib.skill.ykshimeng={};
		lib.skill.ykyueyan={};
		delete lib.skill.ykshimeng;
		delete lib.skill.ykyueyan;
	}
	if(!game.ykHasCharacter('qxq_yk_xiaoqiao')){
		lib.skill.yktianxiang={};
		lib.skill.ykzhuyan={};
		lib.skill.ykpiaoling={};
		delete lib.skill.yktianxiang;
		delete lib.skill.ykzhuyan;
		delete lib.skill.ykpiaoling;
	}
	if(!game.ykHasCharacter('qxq_yk_fuling')){
		lib.skill.yktianyi={};
		lib.skill.ykwuji={};
		delete lib.skill.yktianyi;
		delete lib.skill.ykwuji;
	}
	if(!game.ykHasCharacter('qxq_yk_kongshanlingxue')){
		lib.skill.ykfuji={};
		delete lib.skill.ykfuji;
	}
	if(!game.ykHasCharacter('qxq_yk_wuwangxuanyue')){
		lib.skill.ykwujian={};
		delete lib.skill.ykwujian;
		lib.skill.ykjuejian={};
		delete lib.skill.ykjuejian;
		lib.skill.ykshilie={};
		delete lib.skill.ykshilie;
	}
	if(!game.ykHasCharacter('qxq_yk_mingyun')){
		lib.skill.ykshenming={};
		delete lib.skill.ykshenming;
		lib.skill.yktiansuan={};
		delete lib.skill.yktiansuan;
		lib.skill.ykmingyunInterweave={};
		delete lib.skill.ykmingyunInterweave;
	}
	if(!game.ykHasCharacter('qxq_yk_akalai')){
		lib.skill.ykchashi={};
		delete lib.skill.ykchashi;
		lib.skill.ykzhiyi={};
		delete lib.skill.ykzhiyi;
	}
});
