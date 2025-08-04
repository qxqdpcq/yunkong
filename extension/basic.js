'use strict';
window.YKimport(function(lib,game,ui,get,ai,_status){
	try{window.ykloadjs('equip');}catch(e){game.sayyk('装备文件存在错误');};
	window.ykgetHttpText=(url,response,ontimeout)=>{
		var httpRequest = new XMLHttpRequest();
		httpRequest.open("GET",url,true);
		httpRequest.send(null);
		if(!ontimeout) ontimeout=15000;
		httpRequest.timeout=(ontimeout&&typeof ontimeout=='function'?30000:ontimeout);
		httpRequest.onreadystatechange=function(){
			if (httpRequest.readyState==4&&httpRequest.status==200){
				if(typeof response=='function') response(httpRequest.responseText);
			}
		};
		httpRequest.ontimeout=function(event){
			httpRequest.abort();
			if(typeof ontimeout=='function') ontimeout();
			alert('网络请求超时！');
		};
	};
	ui.create.ykdiv=(innerHTML,style,onclick,prestyle)=>{
		var div=ui.create.div(prestyle||'');
		div.innerHTML=innerHTML;
		if(typeof style=='string') div.style.cssText=style;
		else if(typeof style=='object'&&!Array.isArray(style)) for(var s in style) div.style[s]=style[s];
		if(typeof onclick=='function') div.onclick=onclick;
		return div;
	};
	window.yk_playSkel=()=>{};
	if(lib.config.extensions&&lib.config.extensions.contains('十周年UI')&&lib.config['extension_十周年UI_enable']){
		window.ykSpineList={
			skin_xiaoqiao_HuaHaoYueYuan:{
				loop:true,
				x:[0, 0.215],
				y:[0, 0.1],
				height:[0, 0.4],
			},
		};
		Object.assign(window,{//window.yk_playSkel('extension/云空/assets/skin_xiaoqiao_HuaHaoYueYuan');
			yk_playSkel:(skel_name,style,obj)=>{//obj作为该骨骼的载体，隐藏时使用obj.deleteAnimation();
				if(typeof skel_name!='string') return ;
				let url;
				if(skel_name.indexOf('云空')!=-1){
					url='../../../云空/'+skel_name.slice(skel_name.indexOf('云空/')+3,skel_name.length);
					skel_name=skel_name.slice(skel_name.lastIndexOf('/')+1,skel_name.length);
				}
				else{
					if(url.indexOf('云空')==-1) url='../../../云空/'+url;
				}
				if(!window.ykSpineList[skel_name]&&!style) return ;
				else if(!style) style=window.ykSpineList[skel_name];
				if(!style) return ;
				style.name=url;
				if(typeof style!='object'||Array.isArray(style)) return ;
				(obj||window).ykanimation=[];
				dcdAnim.loadSpine(url,"skel",()=>{
					(obj||window).ykanimation[skel_name]=dcdAnim.playSpine(style);
					if((obj||window).ykanimation[skel_name]) (obj||window).ykanimation[skel_name].delete=function(){
						dcdAnim.stopSpine(this);
					}
					if(obj) obj.deleteAnimation=function(){
						dcdAnim.stopSpine(this.ykanimation[skel_name]);
					}
				});
			},
		});
	}
	window.turntable=(list,start_func,end_func)=>{
		var radius=ui.create.ykdiv('',{
			height:'300px',
			width:'300px',
			left:'calc(50% - 150px)',
			top:'calc(50% - 150px)',
			borderRadius:'150px',
			zIndex:99999999,
			backgroundColor:'red',
		});
		ui.window.appendChild(radius);
		var button=ui.create.ykdiv('',{
			height:'100px',
			width:'100px',
			left:'calc(50% - 50px)',
			top:'calc(50% - 50px)',
			borderRadius:'50px',
			zIndex:99,
			backgroundColor:'cyan',
		});
		window.yk_clickFK(button);
		radius.appendChild(button);
		var word=ui.create.ykdiv('<font color=black>抽奖</font>',{
			height:'20px',
			width:'40px',
			left:'calc(50% - 20px)',
			top:'calc(50% - 10px)',
			zIndex:99,
			'text-align':'center',
		},function(){
			if(window.yk_isTurning) return ;
			if(!start_func) start_func=function(){return true;};
			if(!start_func()){
				alert('抽奖次数不足！');
				return ;
			}
			word.innerHTML='<font color=black>正在抽奖</font>';
			word.style.height='40px';
			word.style.top='calc(50% - 20px)';
			var ps=0,pr=0,r=Math.random(),list=[];
			for(var ix=0;ix<button.list.length;ix++) list.push({
				item:button.list[ix],
				number:ix,
			});
			list.randomSort();
			for(var itemx of list) ps+=itemx.item.p;
			var target;
			for(var ir=0;ir<list.length;ir++){
				pr+=list[ir].item.p;
				if(r<pr/ps){
					target=list[ir].number;
					break;
				}
			}
			if(!target) return ;
			target+=button.div_max*5;
			var s=0,t=200;
			var func=()=>{
				window.yk_isTurning=true;
				for(var x=0;x<button.div_max;x++) button['div_'+x].style.border='none';
				button['div_'+(s%button.div_max)].style.border='4px solid #00FF00';
				if(s<target){
					s++;
					t+=10;
					setTimeout(func,t);
				}
				else{
					if(typeof button['div_'+(s%button.div_max)].func=='function') button['div_'+(s%button.div_max)].func();
					if(typeof end_func=='function') end_func();
					window.yk_isTurning=false;
					word.innerHTML='<font color=black>抽奖</font>';
					word.style.height='20px';
					word.style.top='calc(50% - 10px)';
				}
			}
			func();
		});
		button.appendChild(word);
		var ps=0;
		button.list=list;
		for(var i=0;i<list.length;i++){
			button['div_'+i]=ui.create.ykdiv('',{
				height:'50px',
				width:'50px',
				left:'calc(50% + '+(Math.cos(Math.PI*2*i/list.length)*100-25)+'px)',
				top:'calc(50% + '+(Math.sin(Math.PI*2*i/list.length)*100-25)+'px)',
				'z-index':9999,
			});
			button['div_'+i].item=list[i].name;
			button['div_'+i].func=list[i].func;
			window.ykCacheSetImage('https://gitee.com/qxqdpcq/yunkong/raw/master/extension/'+list[i].name+'.jpg',button['div_'+i],true,'100% 100%');
			radius.appendChild(button['div_'+i]);
			button['div_'+i].info=ui.create.div('.menu');
			button['div_'+i].text=(list[i].info||'暂无信息');
			button['div_'+i].info.style.cssText='transition:left 0s,top 0s,opacity .3s;width:312px;pointer-events:none;text-align:left;animation:fadeShow .3s;-webkit-animation:fadeShow .3s;z-index:999999999;';
			if(lib.device==undefined){
				button['div_'+i].onmouseover=function(){
					var info=this.info;
					info.innerHTML=this.text;
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
				button['div_'+i].onmousemove=function(){
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
				button['div_'+i].onmouseout=function(){
					var info=this.info;
					info.hide();
				};
			}
			else{
				button['div_'+i].onclick=function(){
					this.info2=ui.create.div('.menu');
					this.info2.innerHTML=this.text;
					this.info2.onclick=function(){
						this.hide();
						this.delete();
					};
					this.info2.style.cssText='height:40%;width:40%;top:30%;left:30%;z-index:999999999;border-radius:8px;text-align:left;';
					ui.window.appendChild(this.info2);
				}
			}
		}
		button.div_max=list.length;
		var close=ui.create.ykdiv('×',{
			height:'20px',
			width:'20px',
			'text-align':'center',
			left:'calc(100% - 20px)',
			top:'0px',
		},function(){
			if(window.yk_isTurning) return ;
			radius.hide();
			radius.delete();
		},'.menu');
		window.yk_clickFK(close);
		radius.appendChild(close);
	};
	game.ykgetSize=(filePathList,callbackx,endcall,bool,exportList)=>{//无文件返回null，空文件返回0，非空文件返回size或true
		if(!Array.isArray(filePathList)) filePathList=[filePathList];
		var filePath=filePathList[0];
		if(filePath==undefined||(filePath&&filePath.url==undefined)){
			filePathList=filePathList.slice(1,filePathList.length);
			if(!exportList) exportList=[[],[]];
			if(filePathList.length) setTimeout(function(){game.ykgetSize(filePathList,callbackx,endcall,bool,exportList);},500);
			else{
				endcall(exportList);
				return ;
			}
		}
		if(typeof filePath!='object'){
			let s=''+filePath;
			filePath={
				url:s,
				tags:{},
			};
		}
		if(!exportList) exportList=[[],[]];
		if(!filePath.url){
			alert('请输入路径');
			return ;
		}
		if(!lib.device){
			if(!window.ykFileExist(filePath.url.indexOf((__dirname+'/').replace(/\\/g,'/'))==-1?(__dirname+'/').replace(/\\/g,'/')+filePath.url:filePath.url)){
				var exp={
					url:filePath.url,
					size:null,
					parent:filePath,
				};
				exportList[1].push(exp);
				filePathList=filePathList.slice(1,filePathList.length);
				if(filePathList.length){
					if(typeof callbackx=='function') callbackx(filePath,exportList);
					setTimeout(function(){game.ykgetSize(filePathList,callbackx,endcall,bool,exportList);},500);
				}
				else endcall(exportList);
			}
			else{
				var fs = require("fs"),stat;
				try{stat=fs.statSync(filePath.url.indexOf((__dirname+'/').replace(/\\/g,'/'))==-1?(__dirname+'/').replace(/\\/g,'/')+filePath.url:filePath.url);}catch(e){}
				if(stat){
					var exp={
						url:filePath.url,
						parent:filePath,
					};
					if(stat.size==0) exp.size=0;
					else if(bool) exp.size=stat.size;
					else exp.size=true;
					exportList[1].push(exp);
					filePathList=filePathList.slice(1,filePathList.length);
					if(filePathList.length){
						if(typeof callbackx=='function') callbackx(filePath,exportList);
						setTimeout(function(){game.ykgetSize(filePathList,callbackx,endcall,bool,exportList);},500);
					}
					else endcall(exportList);
				}
				else{
					var exp={
						url:filePath.url,
						size:null,
						parent:filePath,
					};
					exportList[1].push(exp);
					filePathList=filePathList.slice(1,filePathList.length);
					if(filePathList.length){
						if(typeof callbackx=='function') callbackx(filePath,exportList);
						setTimeout(function(){game.ykgetSize(filePathList,callbackx,endcall,bool,exportList);},500);
					}
					else endcall(exportList);
				}
			}
		}
		else{
			((filePathList,callbackx,bool)=>{
				const xhrFile=new XMLHttpRequest();
				xhrFile.open("GET",(filePath.url.indexOf(lib.assetURL)==-1?lib.assetURL+filePath.url:filePath.url), true);
				xhrFile.onload=function(){
					const allText=(xhrFile.response||'');
					if(bool){
						var size=0,reg_chinese=new RegExp("[\\u4E00-\\u9FFF]+","g");
						for(var i=0;i<allText.length;i++){
							if(reg_chinese.test(allText[i])) size+=3;
							else size++;
						}
						var exp={
							url:filePath.url,
							size:size,
							parent:filePath,
						};
						exportList[0].push(exp);
					}
					else{
						if(allText&&allText.length>0) var size=true;
						else var size=0;
						var exp={
							url:filePath.url,
							size:size,
							parent:filePath,
						};
						exportList[0].push(exp);
					}
					filePathList=filePathList.slice(1,filePathList.length);
					if(filePathList.length){
						if(typeof callbackx=='function') callbackx(filePath,exportList);
						setTimeout(function(){game.ykgetSize(filePathList,callbackx,endcall,bool,exportList);},500);
					}
					else endcall(exportList);
				}
				xhrFile.onerror=function(){
					var exp={
						url:filePath.url,
						size:null,
						parent:filePath,
					};
					exportList[1].push(exp);
					filePathList=filePathList.slice(1,filePathList.length);
					if(filePathList.length){
						if(typeof callbackx=='function') callbackx(filePath,exportList);
						setTimeout(function(){game.ykgetSize(filePathList,callbackx,endcall,bool,exportList);},500);
					}
					else endcall(exportList);
				}
				xhrFile.send();
			})(filePathList,callbackx,endcall,bool,exportList);
		}
	};
	game.ykpopup=(str,parentNode)=>{
		let word=ui.create.ykdiv(str,{
			top:'50%',
			left:'50%',
			transform:'translate(-50%,-50%)',
			'-webket-transform':'translate(-50%,-50%)',
			'-ms-transform':'translate(-50%,-50%)',
			'-moz-transform':'translate(-50%,-50%)',
			height:'fit-content',
			width:'fit-content',
			'border':'solid 2px',
			'border-image':'linear-gradient('+45*[1,3,5,7].randomGet()+'deg,red 0%,orange 14%,yellow 29%,green 43%,cyan 58%,blue 72%,purple 87%) 2 2 2 2',
			zIndex:Infinity,
			backgroundColor:'black',
			opacity:0.75,
			transition:'all 0.4s',
			zIndex:999999999999,
		});
		if(!parentNode) parentNode=(ui.window||document.body);
		parentNode.appendChild(word);
		setTimeout(()=>{
			word.style.transform='translate(-50%,-150px)';
			setTimeout(()=>{
				word.delete();
				word=null;
			},1000);
		},50);
	};
	game.ykaddCSSText=cssText=>{
		lib.init.sheet().sheet.insertRule(cssText,0);
	};
	game.ykaddCSSText(`
		@font-face {
			font-family: 'Ocean';
			src: url("`+lib.assetURL+`extension/云空/word/Ocean.ttf");
		}
	`);
	let ykmp='@keyframes ykmp{0%{background: linear-gradient(to left bottom,cyan 0%,rgb(132,112,255) 100%,cyan 200%,rgb(132,112,255) 300%);}';
	ykmp+='5%{background: linear-gradient(to left bottom,cyan -10%,rgb(132,112,255) 90%,cyan 190%,rgb(132,112,255) 290%);}';
	ykmp+='10%{background: linear-gradient(to left bottom,cyan -20%,rgb(132,112,255) 80%,cyan 180%,rgb(132,112,255) 280%);}';
	ykmp+='15%{background: linear-gradient(to left bottom,cyan -30%,rgb(132,112,255) 70%,cyan 170%,rgb(132,112,255) 270%);}';
	ykmp+='20%{background: linear-gradient(to left bottom,cyan -40%,rgb(132,112,255) 60%,cyan 160%,rgb(132,112,255) 260%);}';
	ykmp+='25%{background: linear-gradient(to left bottom,cyan -50%,rgb(132,112,255) 50%,cyan 150%,rgb(132,112,255) 250%);}';
	ykmp+='30%{background: linear-gradient(to left bottom,cyan -60%,rgb(132,112,255) 40%,cyan 140%,rgb(132,112,255) 240%);}';
	ykmp+='35%{background: linear-gradient(to left bottom,cyan -70%,rgb(132,112,255) 30%,cyan 130%,rgb(132,112,255) 230%);}';
	ykmp+='40%{background: linear-gradient(to left bottom,cyan -80%,rgb(132,112,255) 20%,cyan 120%,rgb(132,112,255) 220%);}';
	ykmp+='45%{background: linear-gradient(to left bottom,cyan -90%,rgb(132,112,255) 10%,cyan 110%,rgb(132,112,255) 210%);}';
	ykmp+='50%{background: linear-gradient(to left bottom,cyan -100%,rgb(132,112,255) 0%,cyan 100%,rgb(132,112,255) 200%);}';
	ykmp+='55%{background: linear-gradient(to left bottom,cyan -110%,rgb(132,112,255) -10%,cyan 90%,rgb(132,112,255) 190%);}';
	ykmp+='60%{background: linear-gradient(to left bottom,cyan -120%,rgb(132,112,255) -20%,cyan 80%,rgb(132,112,255) 180%);}';
	ykmp+='65%{background: linear-gradient(to left bottom,cyan -130%,rgb(132,112,255) -30%,cyan 70%,rgb(132,112,255) 170%);}';
	ykmp+='70%{background: linear-gradient(to left bottom,cyan -140%,rgb(132,112,255) -40%,cyan 60%,rgb(132,112,255) 160%);}';
	ykmp+='75%{background: linear-gradient(to left bottom,cyan -150%,rgb(132,112,255) -50%,cyan 50%,rgb(132,112,255) 150%);}';
	ykmp+='80%{background: linear-gradient(to left bottom,cyan -160%,rgb(132,112,255) -60%,cyan 40%,rgb(132,112,255) 140%);}';
	ykmp+='85%{background: linear-gradient(to left bottom,cyan -170%,rgb(132,112,255) -70%,cyan 30%,rgb(132,112,255) 130%);}';
	ykmp+='90%{background: linear-gradient(to left bottom,cyan -180%,rgb(132,112,255) -80%,cyan 20%,rgb(132,112,255) 120%);}';
	ykmp+='95%{background: linear-gradient(to left bottom,cyan -190%,rgb(132,112,255) -90%,cyan 10%,rgb(132,112,255) 110%);}';
	ykmp+='100%{background: linear-gradient(to left bottom,cyan -200%,rgb(132,112,255) -100%,cyan 0%,rgb(132,112,255) 100%);}';
	ykmp+='}';
	game.ykaddCSSText(ykmp);
	let ykstrength='@keyframes ykstrength{0%{background: linear-gradient(to left bottom,white 0%,rgb(192,255,62) 100%,white 200%,rgb(192,255,62) 300%);}';
	ykstrength+='5%{background: linear-gradient(to left bottom,white -10%,rgb(192,255,62) 90%,white 190%,rgb(192,255,62) 290%);}';
	ykstrength+='10%{background: linear-gradient(to left bottom,white -20%,rgb(192,255,62) 80%,white 180%,rgb(192,255,62) 280%);}';
	ykstrength+='15%{background: linear-gradient(to left bottom,white -30%,rgb(192,255,62) 70%,white 170%,rgb(192,255,62) 270%);}';
	ykstrength+='20%{background: linear-gradient(to left bottom,white -40%,rgb(192,255,62) 60%,white 160%,rgb(192,255,62) 260%);}';
	ykstrength+='25%{background: linear-gradient(to left bottom,white -50%,rgb(192,255,62) 50%,white 150%,rgb(192,255,62) 250%);}';
	ykstrength+='30%{background: linear-gradient(to left bottom,white -60%,rgb(192,255,62) 40%,white 140%,rgb(192,255,62) 240%);}';
	ykstrength+='35%{background: linear-gradient(to left bottom,white -70%,rgb(192,255,62) 30%,white 130%,rgb(192,255,62) 230%);}';
	ykstrength+='40%{background: linear-gradient(to left bottom,white -80%,rgb(192,255,62) 20%,white 120%,rgb(192,255,62) 220%);}';
	ykstrength+='45%{background: linear-gradient(to left bottom,white -90%,rgb(192,255,62) 10%,white 110%,rgb(192,255,62) 210%);}';
	ykstrength+='50%{background: linear-gradient(to left bottom,white -100%,rgb(192,255,62) 0%,white 100%,rgb(192,255,62) 200%);}';
	ykstrength+='55%{background: linear-gradient(to left bottom,white -110%,rgb(192,255,62) -10%,white 90%,rgb(192,255,62) 190%);}';
	ykstrength+='60%{background: linear-gradient(to left bottom,white -120%,rgb(192,255,62) -20%,white 80%,rgb(192,255,62) 180%);}';
	ykstrength+='65%{background: linear-gradient(to left bottom,white -130%,rgb(192,255,62) -30%,white 70%,rgb(192,255,62) 170%);}';
	ykstrength+='70%{background: linear-gradient(to left bottom,white -140%,rgb(192,255,62) -40%,white 60%,rgb(192,255,62) 160%);}';
	ykstrength+='75%{background: linear-gradient(to left bottom,white -150%,rgb(192,255,62) -50%,white 50%,rgb(192,255,62) 150%);}';
	ykstrength+='80%{background: linear-gradient(to left bottom,white -160%,rgb(192,255,62) -60%,white 40%,rgb(192,255,62) 140%);}';
	ykstrength+='85%{background: linear-gradient(to left bottom,white -170%,rgb(192,255,62) -70%,white 30%,rgb(192,255,62) 130%);}';
	ykstrength+='90%{background: linear-gradient(to left bottom,white -180%,rgb(192,255,62) -80%,white 20%,rgb(192,255,62) 120%);}';
	ykstrength+='95%{background: linear-gradient(to left bottom,white -190%,rgb(192,255,62) -90%,white 10%,rgb(192,255,62) 110%);}';
	ykstrength+='100%{background: linear-gradient(to left bottom,white -200%,rgb(192,255,62) -100%,white 0%,rgb(192,255,62) 100%);}';
	ykstrength+='}';
	game.ykaddCSSText(ykstrength);
	let ykdefend='@keyframes ykdefend{0%{background: linear-gradient(to left bottom,grey 0%,rgb(176,224,230) 100%,grey 200%,rgb(176,224,230) 300%);}';
	ykdefend+='5%{background: linear-gradient(to left bottom,grey -10%,rgb(176,224,230) 90%,grey 190%,rgb(176,224,230) 290%);}';
	ykdefend+='10%{background: linear-gradient(to left bottom,grey -20%,rgb(176,224,230) 80%,grey 180%,rgb(176,224,230) 280%);}';
	ykdefend+='15%{background: linear-gradient(to left bottom,grey -30%,rgb(176,224,230) 70%,grey 170%,rgb(176,224,230) 270%);}';
	ykdefend+='20%{background: linear-gradient(to left bottom,grey -40%,rgb(176,224,230) 60%,grey 160%,rgb(176,224,230) 260%);}';
	ykdefend+='25%{background: linear-gradient(to left bottom,grey -50%,rgb(176,224,230) 50%,grey 150%,rgb(176,224,230) 250%);}';
	ykdefend+='30%{background: linear-gradient(to left bottom,grey -60%,rgb(176,224,230) 40%,grey 140%,rgb(176,224,230) 240%);}';
	ykdefend+='35%{background: linear-gradient(to left bottom,grey -70%,rgb(176,224,230) 30%,grey 130%,rgb(176,224,230) 230%);}';
	ykdefend+='40%{background: linear-gradient(to left bottom,grey -80%,rgb(176,224,230) 20%,grey 120%,rgb(176,224,230) 220%);}';
	ykdefend+='45%{background: linear-gradient(to left bottom,grey -90%,rgb(176,224,230) 10%,grey 110%,rgb(176,224,230) 210%);}';
	ykdefend+='50%{background: linear-gradient(to left bottom,grey -100%,rgb(176,224,230) 0%,grey 100%,rgb(176,224,230) 200%);}';
	ykdefend+='55%{background: linear-gradient(to left bottom,grey -110%,rgb(176,224,230) -10%,grey 90%,rgb(176,224,230) 190%);}';
	ykdefend+='60%{background: linear-gradient(to left bottom,grey -120%,rgb(176,224,230) -20%,grey 80%,rgb(176,224,230) 180%);}';
	ykdefend+='65%{background: linear-gradient(to left bottom,grey -130%,rgb(176,224,230) -30%,grey 70%,rgb(176,224,230) 170%);}';
	ykdefend+='70%{background: linear-gradient(to left bottom,grey -140%,rgb(176,224,230) -40%,grey 60%,rgb(176,224,230) 160%);}';
	ykdefend+='75%{background: linear-gradient(to left bottom,grey -150%,rgb(176,224,230) -50%,grey 50%,rgb(176,224,230) 150%);}';
	ykdefend+='80%{background: linear-gradient(to left bottom,grey -160%,rgb(176,224,230) -60%,grey 40%,rgb(176,224,230) 140%);}';
	ykdefend+='85%{background: linear-gradient(to left bottom,grey -170%,rgb(176,224,230) -70%,grey 30%,rgb(176,224,230) 130%);}';
	ykdefend+='90%{background: linear-gradient(to left bottom,grey -180%,rgb(176,224,230) -80%,grey 20%,rgb(176,224,230) 120%);}';
	ykdefend+='95%{background: linear-gradient(to left bottom,grey -190%,rgb(176,224,230) -90%,grey 10%,rgb(176,224,230) 110%);}';
	ykdefend+='100%{background: linear-gradient(to left bottom,grey -200%,rgb(176,224,230) -100%,grey 0%,rgb(176,224,230) 100%);}';
	ykdefend+='}';
	game.ykaddCSSText(ykdefend);
	let yksoul='@keyframes yksoul{0%{background: linear-gradient(to left bottom,purple 0%,rgb(132,112,255) 100%,purple 200%,rgb(132,112,255) 300%);}';
	yksoul+='5%{background: linear-gradient(to left bottom,purple -10%,rgb(132,112,255) 90%,purple 190%,rgb(132,112,255) 290%);}';
	yksoul+='10%{background: linear-gradient(to left bottom,purple -20%,rgb(132,112,255) 80%,purple 180%,rgb(132,112,255) 280%);}';
	yksoul+='15%{background: linear-gradient(to left bottom,purple -30%,rgb(132,112,255) 70%,purple 170%,rgb(132,112,255) 270%);}';
	yksoul+='20%{background: linear-gradient(to left bottom,purple -40%,rgb(132,112,255) 60%,purple 160%,rgb(132,112,255) 260%);}';
	yksoul+='25%{background: linear-gradient(to left bottom,purple -50%,rgb(132,112,255) 50%,purple 150%,rgb(132,112,255) 250%);}';
	yksoul+='30%{background: linear-gradient(to left bottom,purple -60%,rgb(132,112,255) 40%,purple 140%,rgb(132,112,255) 240%);}';
	yksoul+='35%{background: linear-gradient(to left bottom,purple -70%,rgb(132,112,255) 30%,purple 130%,rgb(132,112,255) 230%);}';
	yksoul+='40%{background: linear-gradient(to left bottom,purple -80%,rgb(132,112,255) 20%,purple 120%,rgb(132,112,255) 220%);}';
	yksoul+='45%{background: linear-gradient(to left bottom,purple -90%,rgb(132,112,255) 10%,purple 110%,rgb(132,112,255) 210%);}';
	yksoul+='50%{background: linear-gradient(to left bottom,purple -100%,rgb(132,112,255) 0%,purple 100%,rgb(132,112,255) 200%);}';
	yksoul+='55%{background: linear-gradient(to left bottom,purple -110%,rgb(132,112,255) -10%,purple 90%,rgb(132,112,255) 190%);}';
	yksoul+='60%{background: linear-gradient(to left bottom,purple -120%,rgb(132,112,255) -20%,purple 80%,rgb(132,112,255) 180%);}';
	yksoul+='65%{background: linear-gradient(to left bottom,purple -130%,rgb(132,112,255) -30%,purple 70%,rgb(132,112,255) 170%);}';
	yksoul+='70%{background: linear-gradient(to left bottom,purple -140%,rgb(132,112,255) -40%,purple 60%,rgb(132,112,255) 160%);}';
	yksoul+='75%{background: linear-gradient(to left bottom,purple -150%,rgb(132,112,255) -50%,purple 50%,rgb(132,112,255) 150%);}';
	yksoul+='80%{background: linear-gradient(to left bottom,purple -160%,rgb(132,112,255) -60%,purple 40%,rgb(132,112,255) 140%);}';
	yksoul+='85%{background: linear-gradient(to left bottom,purple -170%,rgb(132,112,255) -70%,purple 30%,rgb(132,112,255) 130%);}';
	yksoul+='90%{background: linear-gradient(to left bottom,purple -180%,rgb(132,112,255) -80%,purple 20%,rgb(132,112,255) 120%);}';
	yksoul+='95%{background: linear-gradient(to left bottom,purple -190%,rgb(132,112,255) -90%,purple 10%,rgb(132,112,255) 110%);}';
	yksoul+='100%{background: linear-gradient(to left bottom,purple -200%,rgb(132,112,255) -100%,purple 0%,rgb(132,112,255) 100%);}';
	yksoul+='}';
	game.ykaddCSSText(yksoul);
	window.ykFileExist= url => {
		if(window.XMLHttpRequest){
			var http = new XMLHttpRequest();
		}
		else{
			var http = new ActiveXObject("Microsoft.XMLHTTP");
		}
		http.open('HEAD', url, false);
		try{
			http.send();
		}catch (err){
			return false;
		}
		return http.status != 404;
	}
	if(!window.ykFileExist(lib.assetURL+'extension/云空/skin.js')){
		setTimeout(function(){
			try{game.download('https://gitee.com/qxqdpcq/yunkong/raw/master/extension/skin.js',function(){},function(){});}catch(e){console.log(e);};
		},10000);
	}
	lib.yk_personInfo={
		qxq_yk_dijunxuanpin:["male",4,["ykxuandao","ykzhixin"]],
		qxq_yk_xiaoqiao:["female",3,["yktianxiang","ykzhuyan","ykpiaoling"]],
		qxq_yk_yanmengyuejian:["female",3,["ykshimeng","ykyueyan"]],
		qxq_yk_kongshanlingxue:["female",3,["ykfuji"]],
		qxq_yk_lingshang:["male",4,["ykfeibing","ykduoren"]],
		qxq_yk_fuling:["female",3,["yktianyi","ykwuji"]],
		qxq_yk_wuwangxuanyue:["male",4,["ykwujian","ykjuejian","ykshilie"]],
		qxq_yk_mingyun:["female",3,["ykshenming","yktiansuan","ykmingyunInterweave"]],
		qxq_yk_akalai:["male",4,["ykchashi","ykzhiyi"]],
		qxq_yk_zhixu:["female",3,["ykxuyan","ykdingze","yktianzhi"]],
	}
	lib.yk_personLocation={
		qxq_yk_dijunxuanpin:"转化、过牌、免伤",
		qxq_yk_xiaoqiao:"转化、过牌&给牌、回复",
		qxq_yk_yanmengyuejian:"转化、增益",
		qxq_yk_kongshanlingxue:"过牌、增益",
		qxq_yk_lingshang:"菜刀、过牌",
		qxq_yk_fuling:"转化、回复",
		qxq_yk_wuwangxuanyue:"菜刀、控制",
		qxq_yk_mingyun:"过牌、增益、减益",
		qxq_yk_akalai:"菜刀、回复、增益",
		qxq_yk_zhixu:"减益、增益",
	}
	//-----------------------------------任务-----------------------------//
	var httpRequest = new XMLHttpRequest();
	httpRequest.open("GET","https://gitee.com/qxqdpcq/yunkong/raw/master/extension/tasks.js",true);
	httpRequest.send(null);
	httpRequest.onreadystatechange=function(){
		if(httpRequest.readyState==4&&httpRequest.status==200){
			eval(httpRequest.responseText);
		}
	};
// ---------------------------------------适配十周年用------------------------------------------//
	game.dpcqHasExtension=game.ykHasExtension=function(str){
		return lib.config.extensions && lib.config.extensions.contains(str) && lib.config['extension_'+str+'_enable'];
	};
// ---------------------------------------适配千幻用------------------------------------------//
	window.yk_downloadSkinJson=function(){
		lib.init.js(lib.assetURL+'extension/云空','skin',function(){},function(){
			game.download('https://gitee.com/qxqdpcq/yunkong/raw/master/extension/skin.js','extension/云空/skin.js',function(){},function(){});
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
		/*window.characterList=[];
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
		}*/
	}
	//云空牌堆
	if(lib.config.only_ykCardPile){
		let only_ykCardPileInterval=setInterval(()=>{
			if(lib.arenaReady){
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
			clearInterval('only_ykCardPileInterval');
			}
		},200);
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
	//Check时间
	window.checkOnlineTime=function(yearx1,monthx1,dayx1,yearx2,monthx2,dayx2){
		var isDuringDate=function(beginDateStr,endDateStr){
			var curDate = new Date(window.playTime.years+'/'+window.playTime.months+'/'+window.playTime.days),beginDate=new Date(beginDateStr),endDate=new Date(endDateStr);
			if (curDate>=beginDate&&curDate<=endDate){
				return true;
			}
			return false;
		}
		if(isDuringDate(yearx1+'/'+monthx1+'/'+dayx1,yearx2+'/'+monthx2+'/'+dayx2)) return true;
		else return false;
	}
	window.ykisSameWeek=(first,last)=>{//"year/month/day"
		var first=new Date(first),last=new Date(last),oneDayTime = 1000*60*60*24,first_count =parseInt(first.getTime()/oneDayTime),last_other =parseInt(last.getTime()/oneDayTime);
		return parseInt((first_count+4)/7) == parseInt((last_other+4)/7);
	}
	//兑换系统
	if(lib.arenaReady) lib.arenaReady.push(function(){
		if(window.ykshow_duihuanma) return ;
		window.ykshow_duihuanma=true;
		ui.ykSpecialCode=ui.create.system('',null,true);
		ui.ykSpecialCode.style.display='none';
		ui.ykSpecialCode.style.display='';
		ui.ykSpecialCode.innerHTML="<body><samp id='兑换码'>兑换码</samp></body><style>#兑换码{animation:change 7s linear 0s infinite;}@keyframes change{0% {color:#FF0000;}10%{color:#FF7F00;}20%{color: #FFFF00;}30%{color:#00FF00;}40% {color:#00FFFF;}50%{color: #0000FF;}60%{color: #8B00FF;}70%{color: #0000FF;}75%{color: #00FFFF ;}80%{color:#00FF00;}85%{color:#FFFF00 ;}90%{color:  #FF7F00;}100%{color: #FF0000;}}</style>";
		ui.ykSpecialCode.onclick=function(){
			var face=ui.create.dialog('hidden');
			face.style.cssText='height:100px;width:150px;left:calc( 50% - 75px );top:calc( 50% - 50px );z-index:9999;border-radius:8px;background-color:black;opacity:0.7;';
			face.add('<font color=white>兑换码</font>');
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
					var httpRequest = new XMLHttpRequest();
					httpRequest.open("GET",'https://gitee.com/qxqdpcq/yunkong/raw/master/extension/version.js',true);
					httpRequest.send(null);
					httpRequest.value=this.value;
					httpRequest.onreadystatechange=function(e){
						if (httpRequest.readyState==4&&httpRequest.status==200){
							if(!lib.config.ykDTSCache) alert('error 使用失败！');
							else if(!lib.config.ykDTSCache.content) alert('error 使用失败！');
							else if(!lib.config.ykDTSCache.content.version) alert('error 使用失败！');
							else if(lib.config.ykDTSCache.content.version!=httpRequest.responseText){
								alert('本地模块不是最新版！');
							}
							else {
								var value=this.value;
								if(typeof game['yk'+value]=='function'){
									if(typeof game['yk'+value+'_checkTime']!='function'||(typeof game['yk'+value+'_checkTime']=='function'&&!game['yk'+value+'_checkTime']())){
										alert('不在可兑换时间或网络状况不佳，请稍后再试！');
										return ;
									}
									else if(lib.config['yk'+value]!=true){
										lib.config['yk'+value]=true;
										game.saveConfig('yk'+value,lib.config['yk'+value]);
										game['yk'+value]();
									}
									else{alert('您已兑换此奖励！');return ;}
									if(window.yk_codeCloseDiv){
										window.yk_codeCloseDiv.onclick();
										window.yk_codeCloseDiv=null;
									}
								}
								else{alert('兑换码错误，请输入正确的兑换码！');return ;}
							}
						}
					};
				};
			};
			face.add(div);
			ui.window.appendChild(face);
			window.yk_codeCloseDiv=ui.create.div('.menubutton.round','×');
			window.yk_codeCloseDiv.style.top='5px';
			window.yk_codeCloseDiv.style.left='calc(100% - 55px)';
			window.yk_codeCloseDiv.style['zIndex']=1000;
			window.yk_codeCloseDiv.face=face;
			window.yk_codeCloseDiv.onclick=function(){
				this.face.delete();
				delete this.face;
				this.face=null;
			}
			face.appendChild(window.yk_codeCloseDiv);
			window.yk_clickFK(window.yk_codeCloseDiv);
		}
		lib.setPopped(ui.ykSpecialCode,function(){
			var uiintro=ui.create.dialog('hidden');
			uiintro.style.backgroundColor='black';
			uiintro.style.opacity=0.7;
			uiintro.innerHTML='<font color=white>点击按钮打开兑换界面</font>';
			return uiintro;
		});
	});
	//2022新年兑换礼
	game.ykHappyNewYear_checkTime=function(){
		if(window.checkOnlineTime(2022,1,31,2022,2,1)==true){
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
	game.ykHappyNewYear2023_checkTime=function(){
		if(window.checkOnlineTime(2023,1,22,2023,2,1)==true){
			return true;
		}
		else{
			alert('兑换码已过期或活动未开始或网络状况不佳导致获取时间失败！');
			return false;
		}
	}
	game.ykHappyNewYear2023=function(){
		game.yk_gainItem('random_upGradeSkill_stone',1);
		game.yk_gainItem('yk_coin',999);
		game.yk_gainItem('sky_crying',666);
		alert('已获得【随机技能石】x1、金铢x999、虚空之泪x666，可前往【配置角色】处查看。');
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
	//解锁角色gainNewPerson、gainNewPerson---------用法：game.YKgainNewPerson('qxq_yk_yanmengyuejian-female-3-ykshimeng-ykyueyan');
	window.yk_unlockScreen=function(content,func,funcContent){
		if(!content) return ;
		window.yk_showName=content;
		if(Array.isArray(content)){
			window.div_animationBackground_block=ui.create.div();
			window.div_animationBackground_block.style.cssText='height:100%;width:100%;left:0px;top:0px;z-index:999999999999;opacity:0;';
			ui.window.appendChild(window.div_animationBackground_block);
			window.div_animationBackground=ui.create.div();
			window.div_animationBackground.style.cssText='height:100%;width:100%;left:0px;top:0px;z-index:99999999999999;transition:all 1.5s;';
			ui.window.appendChild(window.div_animationBackground);
			window.div_animationBackground_x=ui.create.div();
			window.div_animationBackground_x.style.cssText='height:100%;width:100%;left:0px;top:0px;';
			window.div_animationBackground_x.innerHTML = "<video width='320' height='240' autoplay style='width:100%;height:100%;object-fit:fill;'><source src='"+lib.assetURL+"extension/云空/10' type='video/mp4'></video>";
			window.div_animationBackground.appendChild(window.div_animationBackground_x);
			setTimeout(function(){
				window.div_animationBackground.delete();
				window.div_animationBackground=null;
				window.div_result=ui.create.div();
				window.div_result.style.cssText='height:300px;width:80%;left:10%;top:calc(50% - 150px);z-index:99999999999999;border-radius:8px;background-color:black;opacity:0.85;';
				ui.window.appendChild(window.div_result);
				window.div_resultTitle=ui.create.div();
				window.div_resultTitle.style.cssText='height:50px;width:100%;left:0px;top:0px;text-align:center;';
				window.div_resultTitle.innerHTML='<span style="color:white;font-size:25px;font-weight:400;font-family:shousha"><b>恭喜获得</b></span>';
				window.div_result.appendChild(window.div_resultTitle);
				window.div_resultShow=ui.create.div();
				window.div_resultShow.style.cssText='height:250px;width:376px;left:calc(50% - 188px);top:calc(95% - 250px);text-align:center;';
				window.div_result.appendChild(window.div_resultShow);
				for(var item of window.yk_showName){
					var b=ui.create.div();
					b.style.cssText='height:95px;width:75px;left:0px;top:0px;position:relative;';
					window.div_resultShow.appendChild(b);
					var c=ui.create.div(),color='white',E=lib.ykEquip[item],B=lib.ykBook[item],O=lib.yk_otherItemLibrary[item],R=lib.config.qxq_YK_person.rank[item],i,img;
					i=(E||B||O);
					if(i) i=i.grade,img=i.image;
					if(i){
						if(i=='godgrade'||i=='half-godgrade') color='red';
						else if(i=='tiangrade') color='orange';
						else if(i=='digrade') color='purple';
						else if(i=='xuangrade') color='cyan';
						else if(i=='huanggrade') color='green';
						else if(i=='fangrade') color='grey';
					}
					else if(R){
						if(R.indexOf('超稀-限定')!=-1) color='red';
						else if(R.indexOf('天级')!=-1) color='orange';
						else if(R.indexOf('地级')!=-1) color='purple';
						else if(R.indexOf('玄级')!=-1) color='cyan';
						else if(R.indexOf('黄级')!=-1) color='green';
						else if(R.indexOf('凡级')!=-1) color='grey';
					}
					c.style.cssText='height:75px;width:75px;left:0px;top:0px;background-position:center;position:absolute;';
					c.style.border='1px solid '+color;
					b.appendChild(c);
					c.name=ui.create.div();
					window.ykCacheSetImage('https://gitee.com/qxqdpcq/yunkong/raw/master/extension/'+(img||item+'.jpg'),c,true,"cover");
					c.name.style.cssText='height:20px;width:100%;left:0px;bottom:0px;text-align:center;position:absolute;';
					var name_size=18;
					if(get.translation(item).length>4) name_size-=((get.translation(item).length-4)*3);
					c.name.innerHTML='<span style="color:white;font-size:'+name_size+'px;font-weight:400;font-family:shousha"><b>'+get.translation(item)+'</b></span>';
					b.appendChild(c.name);
				}
				window.div_animationBackground_block.dialog=window.div_result.dialog=window.div_resultShow.dialog;
				window.div_animationBackground_block.onclick=window.div_result.onclick=window.div_resultShow.onclick=function(){
					if(window.div_result){
						var list=window.yk_showName,listp=[];
						for(var itx of list){
							if(lib.config.qxq_YK_person.rank[itx]) listp.push(itx);
							else if(lib.ykEquip[itx]) game.yk_gainEquip(itx);
							else if(lib.ykBook[itx]) game.yk_gainBook(itx);
							else if(lib.yk_otherItemLibrary[itx]) game.yk_gainItem(itx);
						}
						game.sayyk('恭喜获得&nbsp'+get.translation(list)+'！');
						if(listp.length) game.YKgainNewPerson(listp);
						window.div_animationBackground_x.delete();
						delete window.div_animationBackground_x;
						window.div_animationBackground_x=null;
						window.div_animationBackground_block.delete();
						delete window.div_animationBackground_block;
						window.div_animationBackground_block=null;
						window.div_result.delete();
						delete window.div_result;
						window.div_result=null;
						window.div_resultShow.delete();
						delete window.div_resultShow;
						window.div_resultShow=null;
						if(window.ykDrawCardPool_div) window.ykDrawCardPool_div.show();
						else{
							window.ykOpenDrawCardPool();
						}
					}
				}
			},10000);
			
		}
		else{
			window.div_animationBackground_block=ui.create.div();
			window.div_animationBackground_block.style.cssText='height:100%;width:100%;left:0px;top:0px;z-index:999999999999;opacity:0;';
			ui.window.appendChild(window.div_animationBackground_block);
			window.div_animationBackground=ui.create.div();
			window.div_animationBackground.style.cssText='height:100%;width:100%;left:0px;top:0px;z-index:99999999999999;transition:all 1.5s;';
			ui.window.appendChild(window.div_animationBackground);
			window.div_animationBackground_x=ui.create.div();
			window.div_animationBackground_x.style.cssText='height:100%;width:100%;left:0px;top:0px;';
			window.div_animationBackground_x.innerHTML = "<video width='320' height='240' autoplay style='width:100%;height:100%;object-fit:fill;'><source src='"+lib.assetURL+"extension/云空/01' type='video/mp4'></video>";
			window.div_animationBackground.appendChild(window.div_animationBackground_x);
			window.div_animationBackgroundCharacter=ui.create.div();
			window.div_animationBackgroundCharacter.style.cssText='height:73%;width:24.5%;left:37.5%;top:10%;transition:all 2s;background-color:black;opacity:0;background-position:center center;';
			var E=lib.ykEquip[window.yk_showName],B=lib.ykBook[window.yk_showName],O=lib.yk_otherItemLibrary[window.yk_showName],R=lib.config.qxq_YK_person.rank[window.yk_showName],i,img;
			i=(E||B||O);
			window.ykCacheSetImage('https://gitee.com/qxqdpcq/yunkong/raw/master/extension/'+(i&&i.image?i.image:(content+'.jpg')),window.div_animationBackgroundCharacter,true,"cover");
			div_animationBackground.appendChild(window.div_animationBackgroundCharacter);
			setTimeout(function(){
				window.div_animationBackgroundCharacter.style.opacity=1;
			},10000);
			setTimeout(function(){
				var E=lib.ykEquip[window.yk_showName],B=lib.ykBook[window.yk_showName],O=lib.yk_otherItemLibrary[window.yk_showName],R=lib.config.qxq_YK_person.rank[window.yk_showName],i,img;
				i=(E||B||O);
				div_animationBackground_x.delete();
				div_animationBackground_x=undefined;
				div_animationBackground.style.height='450px';
				div_animationBackground.style.width='900px';
				div_animationBackground.style.left='calc( 50% - 450px)';
				div_animationBackground.style.top='calc( 50% - 225px)';
				div_animationBackground.style['border-radius']='8px';
				var div_animationBackgroundCharacterIntroTop=ui.create.div();
				div_animationBackgroundCharacterIntroTop.style.cssText='height:10%;width:24.5%;left:37.5%;top:0%;transition:all 2s;opacity:0;';
				div_animationBackground.appendChild(div_animationBackgroundCharacterIntroTop);
				var div_animationBackgroundCharacterIntroButtom=ui.create.div();
				div_animationBackgroundCharacterIntroButtom.style.cssText='height:20px;width:'+(get.translation(window.yk_showName).length*20)+'px;left:calc(50% - '+(get.translation(window.yk_showName).length*10)+'px);top:83%;transition:all 3s;opacity:0;';
				div_animationBackgroundCharacterIntroButtom.innerHTML='<span style="cursor:pointer;"><font color=red><b>'+get.translation(window.yk_showName)+'<b></font></span>';
				div_animationBackground.appendChild(div_animationBackgroundCharacterIntroButtom);
				var div_animationBackgroundCharacterIntroLeft=ui.create.div();
				div_animationBackgroundCharacterIntroLeft.style.cssText='height:73%;width:35%;left:1%;top:10%;transition:all 3s;opacity:0;background-color:white;overflow-y:scroll;';
				lib.setScroll(div_animationBackgroundCharacterIntroLeft);
				div_animationBackground.appendChild(div_animationBackgroundCharacterIntroLeft);
				var div_animationBackgroundCharacterIntroRight=ui.create.div();
				div_animationBackgroundCharacterIntroRight.style.cssText='height:73%;width:36%;left:63%;top:10%;transition:all 3s;opacity:0;background-color:white;overflow-y:scroll;';
				lib.setScroll(div_animationBackgroundCharacterIntroRight);
				div_animationBackground.appendChild(div_animationBackgroundCharacterIntroRight);
				if(i){
					var introduce,score=i.score,img=i.image,grade=i.grade;
					if(typeof game.getItemInfo=='function') introduce=(game.getItemInfo(window.yk_showName)||'暂无介绍');
					div_animationBackgroundCharacterIntroTop.innerHTML='<span style="cursor:pointer;"><font color=red>恭喜获得【'+get.translation(window.yk_showName)+'】！<br>点击关闭面板介绍</font></span>';
					div_animationBackgroundCharacterIntroLeft.innerHTML='<font color=black><span style="cursor:pointer;"><b>【'+get.translation(window.yk_showName)+'】介绍：</b></span><br>'+introduce+'</font>';
					div_animationBackgroundCharacterIntroRight.innerHTML='<font color=black><span style="cursor:pointer;"><b>物品评级：</b></span>'+(get.translation(grade)||'未知错误！')+'</font><br><br><font color=black><span style="cursor:pointer;"><b>物品评分：</b></span>'+(score||'暂无评分')+'</font>';
					if(E||B) div_animationBackgroundCharacterIntroRight.innerHTML+='<br><br><font color=black>详细信息：</font><font color=cyan>'+window.ykIntroduceEquip(window.yk_showName,'info',(B?'Book':'Equip'))+'</font>';
					else div_animationBackgroundCharacterIntroRight.innerHTML+='<br><br><font color=black>非装备/秘籍类物品！</font>';
				}
				else{
					var introduce=(lib.characterIntro[window.yk_showName]||'暂无介绍');
					div_animationBackgroundCharacterIntroTop.innerHTML='<span style="cursor:pointer;"><font color=red>恭喜解锁新角色！<br>点击关闭面板介绍</font></span>';
					div_animationBackgroundCharacterIntroLeft.innerHTML='<font color=black><span style="cursor:pointer;"><b>人物介绍：</b></span><br>'+introduce+'</font>';
					div_animationBackgroundCharacterIntroRight.innerHTML='<font color=black><span style="cursor:pointer;"><b>角色评级：</b></span>'+(lib.config.qxq_YK_person.rank[window.yk_showName]||'未知错误！')+'</font><br><br><font color=black><span style="cursor:pointer;"><b>角色评分：</b></span>'+(lib.config.qxq_YK_person.score[window.yk_showName]||'未知错误！')+'</font>';
					if(lib.config.qxq_YK_person.nature.Mp[window.yk_showName]!=undefined) div_animationBackgroundCharacterIntroRight.innerHTML+='<br><br><font color=black>角色基础术法值：</font><font color=cyan>'+lib.config.qxq_YK_person.nature.Mp[window.yk_showName]+'</font>';
					if(lib.config.qxq_YK_person.nature.Strength[window.yk_showName]!=undefined) div_animationBackgroundCharacterIntroRight.innerHTML+='<br><br><font color=black>角色基础气力值：</font><font color=yellow>'+lib.config.qxq_YK_person.nature.Strength[window.yk_showName]+'</font>';
					if(lib.config.qxq_YK_person.nature.Defend[window.yk_showName]!=undefined) div_animationBackgroundCharacterIntroRight.innerHTML+='<br><br><font color=black>角色基础真气值：</font><font color=grey>'+lib.config.qxq_YK_person.nature.Defend[window.yk_showName]+'</font>';
					if(lib.config.qxq_YK_person.nature.Soul[window.yk_showName]!=undefined) div_animationBackgroundCharacterIntroRight.innerHTML+='<br><br><font color=black>角色基础元力值：</font><font color=purple>'+lib.config.qxq_YK_person.nature.Soul[window.yk_showName]+'</font>';
				}
				setTimeout(function(){
					div_animationBackgroundCharacterIntroTop.style.opacity=1;
					div_animationBackgroundCharacterIntroButtom.style.opacity=1;
					div_animationBackgroundCharacterIntroLeft.style.opacity=1;
					div_animationBackgroundCharacterIntroRight.style.opacity=1;
					window.div_animationBackground_block.onclick=div_animationBackground.onclick=function(){
						window.div_animationBackground_block.delete();
						window.div_animationBackground_block=null;
						div_animationBackground.delete();
						div_animationBackground=null;
						if(func!=undefined&&window[func]!=undefined&&typeof window[func]=='function') window[func](funcContent);
						else if(func!=undefined&&game[func]!=undefined&&typeof game[func]=='function') game[func](funcContent);
						if(window.background_callMyCharacterBackground!=undefined){
							window.background_callMyCharacterBackground.delete();
							delete window.background_callMyCharacterBackground;
							window.background_callMyCharacterBackground=null;
						}
						if(window.ykDrawCardPool_div) window.ykDrawCardPool_div.show();
						else{
							window.ykOpenDrawCardPool();
						}
					}
				},50);
			},12000);
		}
	}
	game.YKgainNewPerson=function(characterx,bool){
		if(Array.isArray(characterx)){
			for(var i of characterx){
				if(i.indexOf('-')!=-1) i=i.slice(0,i.indexOf('-'));
				game.YKgainNewPerson(i);
			}
			return ;
		}
		else character=characterx;
		if(!character){alert('角色名错误！');return ;}
		if(typeof game.ykHasCharacter=='function'&&game.ykHasCharacter(character)){
			if(game.sayyk&&typeof game.sayyk=='function'){
				game.sayyk('您已拥有角色【'+window.yunkong_Character.translate[character]+'】，将自动为您转化为该角色技能升级石！');
				game.yk_gainItem(character+'_upGradeSkill_stone',1);
			}
			return ;
		}
		if(typeof character!='string') var character=''+character;
		if(character.indexOf('qxq_yk')==-1||character.indexOf('-')==-1){
			var skillList='';
			for(var skill of lib.yk_personInfo[character][2]) skillList+=('-'+skill);
			character=character+'-'+lib.yk_personInfo[character][0]+'-'+lib.yk_personInfo[character][1]+skillList;
		}
		else{
			var name=(character.slice(0,character.indexOf('-'))||'');
			character=character.slice(character.indexOf('-')+1,character.length);
			var sex=(character.slice(0,character.indexOf('-'))||'');
			character=character.slice(character.indexOf('-')+1,character.length);
			var hp=parseInt(character.slice(0,(character.indexOf('-')==-1?character.length:character.indexOf('-'))));
			if(name.length==0||sex.length==0||isNaN(hp)){
				alert('error 错误的角色名！读取失败！');
				return ;
			}
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
		lib.config.YKcharacterNameList.push(character);
		game.saveConfig('YKcharacterNameList',lib.config.YKcharacterNameList);
		if(characterx.length<=0&&confirm('新武将重启后才会显示于武将列表，且新武将的角色图片需要前往【自动检测版本和更新】处下载！是否立即重启？')){
			if(game.sayyk&&typeof game.sayyk=='function') game.sayyk('恭喜获得角色：【'+window.yunkong_Character.translate[name]+'】！即将重启以保存。');
			setTimeout(function(){game.reload();},3000);
		}
		else if(game.sayyk&&typeof game.sayyk=='function') game.sayyk('恭喜获得角色：【'+window.yunkong_Character.translate[name]+'】！');
	}
	window.ykDraw=function(character){
		if(game.sayyk&&typeof game.sayyk=='function') game.sayyk('按住并拖动鼠标或划动屏幕画出你喜欢的符号，召唤武将');
		window.background_callMyCharacter=ui.create.div();
		window.background_callMyCharacter.style.cssText='height:100%;width:100%;left:0%;top:0%;background-color:black;opacity:0.8;text-align:center;z-index:99999999999999';
		window.background_callMyCharacter.innerHTML='<span style="color:white;font-size:35px;font-weight:400;font-family:shousha"><b>按住并拖动鼠标或划动屏幕画出你喜欢的符号，召唤武将</b></span>';
		ui.window.appendChild(window.background_callMyCharacter);
		if(!Array.isArray(character)&&character.indexOf('-')!=-1) character=character.slice(0,str.indexOf('-'));
		window.yk_divMoveCanvas(window.background_callMyCharacter,document.body,true,'yellow',false,'yk_unlockScreen',character);
	}
	lib.ykUsualDrawCardPool={
		tian:[],
		di:[],
		xuan:[],
	};
	lib.ykDrawCardPoolSchel={
		qxq_yk_zhixu:[[2025,5,17],[2025,6,4],'<small><u>天下</u></small><span style=\"color: #00FFFF;\">人间</span>',['qxq_yk_fuling'],['qxq_yk_akalai'],[]],
		qxq_yk_dijunxuanpin:[[2025,6,21],[2025,7,19],'<small><u>君临</u></small><span style=\"color: #00FFFF;\">天下</span>',['qxq_yk_fuling'],['qxq_yk_lingshang'],[]],
		qxq_yk_kongshanlingxue:[[2025,8,6],[2025,8,24],'<small><u>既知</u></small><span style=\"color: #FF00FF;\">天命</span>',['qxq_yk_fuling'],['qxq_yk_akalai'],[]],//[开始时间，结束时间],玄级陪跑物品/角色,地级陪跑物品/角色
		qxq_yk_mingyun:[[2025,9,24],[2025,10,7],'<span style=\"color: #00FFFF;\">云端</span><small><u>遥想</u></small>',['qxq_yk_fuling'],['qxq_yk_akalai'],[]],
		yk_yongmengyixin:[[2025,10,18],[2025,11,6],'<span style=\"color: #FF00FF;\">梦想</span><small><u>花开时</u></small>',['qxq_yk_fuling'],['qxq_yk_akalai'],[]],
		qxq_yk_wuwangxuanyue:[[2025,11,23],[2025,12,12],'<span style=\"color: #FF0000;\">千古</span><small><u>一念</u></small>',['qxq_yk_fuling'],['qxq_yk_akalai'],[]],
		qxq_yk_xiaoqiao:[[2025,12,30],[2026,1,11],'<span style=\"color: #00FFFF;\">浮世</span><small><u>飘零</u></small>',['qxq_yk_fuling'],['qxq_yk_akalai'],[]],
		qxq_yk_yanmengyuejian:[[2026,1,29],[2026,2,17],'<span style=\"color: #00FFFF;\">梦与</span><small><u>君同</u></small>',['qxq_yk_fuling'],['qxq_yk_akalai'],[]],
	};
	window.ykOpenDrawCardPool=function(){
		if(!window.ykFileExist(lib.assetURL+'extension/云空/10')||!window.ykFileExist(lib.assetURL+'extension/云空/01')){
			alert('检测到有文件缺失，许愿前请先更新至最新版！若已更新或无法下载，请联系扩展作者！');
			return ;
		}
		if(typeof window.ykcloseBgM=='function') window.ykcloseBgM();
		window.ykDrawCardPool_div=ui.create.div('.menu');
		window.ykDrawCardPool_div.style.cssText='height:100%;width:100%;top:0px;left:0px;opacity:0.85;background-color:black;z-index:5000;';
		ui.window.appendChild(window.ykDrawCardPool_div);
		window.yk_closeODCP=function(){
			window.ykDrawCardPool_div.delete();
			delete window.ykDrawCardPool_div;
			window.ykDrawCardPool_div=null;
			delete window.yk_closeODCP;
			window.yk_closeODCP=null;
		};
		var button=ui.create.div('.menubutton.round','×',window.yk_closeODCP);
		button.style.cssText='top:5px;left:calc(100% - 55px);z-index:99999;';
		window.ykDrawCardPool_div.appendChild(button);
		window.yk_clickFK(button);
		var help=ui.create.div('.menubutton.round','!',function(){
			if(!window.ykDrawCardPool_Switch||window.ykDrawCardPool_Switch=='special') alert('命定之愿：许愿对应up的天级及以上级别的角色/物品概率限时提升（概率优先级：100抽保底>命定之石>10抽必紫>限时概率up>虚空之泪）！许愿概率：凡级 50%、黄级 30%、玄级 18%、地级 1.5%、天级 0.45%（限定up天级角色/物品占其中出率的50%）、其他 0.05%（限定up天级以上的角色/物品占其中出率的50%）。通常情况下，每个未进入【缘常之愿】的天级及以上级别的角色/物品均有机会进入up池。第60抽以后，获取天级/天级以上的角色/物品概率逐渐增加，当累计99抽未获取天级及以上级别的角色/物品时，下一抽必定获取天级及以上角色/物品，当本次获得天级及以上级别的角色/物品并非当期up角色/物品时，下一次获取天级及以上级别的角色或物品时必定获取该up角色/物品（点击左上角的【命定之愿】/【缘常之愿】切换许愿池，显示名称为当前许愿池名称）');
			else alert('缘常之愿——许愿概率：凡级 50%、黄级 30%、玄级 18%、地级 1.5%、天级 0.5%。（概率优先级：100抽保底>命定之石>10抽必紫>限时概率up>虚空之泪）同级别内已加入【缘常之愿】的角色和物品平分该级别的概率，第60抽以后，获取天级/天级以上的角色/物品概率逐渐增加，当第99抽未获取天级及以上级别的角色/物品时，下一抽必定获取天级及以上角色/物品（点击左上角的【命定之愿】/【缘常之愿】切换许愿池，显示名称为当前许愿池名称）');
		});
		help.style.cssText='top:5px;left:calc(100% - 115px);z-index:99999;';
		window.ykDrawCardPool_div.appendChild(help);
		window.yk_clickFK(help);
		var Switch=ui.create.div();
		Switch.style.cssText='height:50px;width:150px;top:10px;left:10px;border-radius:10px;background-color:white;text-align:center;';
		if(!window.ykDrawCardPool_Switch||window.ykDrawCardPool_Switch=='special') Switch.innerHTML='<span style="color:black;font-size:35px;font-weight:400;"><b>命定之愿</b></span>';
		else Switch.innerHTML='<span style="color:black;font-size:35px;font-weight:400;"><b>缘常之愿</b></span>';
		window.ykDrawCardPool_div.appendChild(Switch);
		Switch.onclick=function(){
			if(Switch.innerHTML.indexOf('命定之愿')!=-1){//切换缘常池
				window.ykDrawCardPool_Switch='usual';
				window.yk_closeODCP();
				setTimeout(window.ykOpenDrawCardPool,500);
			}
			else{//切换限定池
				window.ykDrawCardPool_Switch='special';
				window.yk_closeODCP();
				setTimeout(window.ykOpenDrawCardPool,500);
				
			}
		}
		
		var div_own1=ui.create.div();
		div_own1.style.cssText='height:50px;width:225px;top:65px;left:calc(100% - 285px);text-align:center;';
		window.ykDrawCardPool_div.appendChild(div_own1);
		div_own1.style.border='1px solid white';
		var div_name=ui.create.div();
		div_name.style.cssText='height:25px;width:150px;top:65px;left:calc(100% - 235px);text-align:center;';
		div_name.innerHTML='<span style="color:black;font-size:25px;font-weight:400;font-family:shousha"><b>命定之石</b></span>';
		window.ykDrawCardPool_div.appendChild(div_name);
		var divPict=ui.create.div();
		divPict.style.cssText='height:50px;width:50px;top:65px;left:calc(100% - 285px);';
		window.ykDrawCardPool_div.appendChild(divPict);
		divPict.onclick=function(){
			alert('使用【命定之石】许愿时必得玄级及以上角色/物品，【命定之石】不能用于【缘常之愿】卡池！许愿概率：玄级 60%、地级 35%、天级 4%、其他 1%。');
		}
		window.ykCacheSetImage('https://gitee.com/qxqdpcq/yunkong/raw/master/extension/predestined_fate.jpg',divPict,true,"cover");
		var divx=ui.create.div();
		divx.style.cssText='height:25px;width:150px;top:90px;left:calc(100% - 235px);border-radius:8px;text-align:center;';
		window.ykDrawCardPool_div.appendChild(divx);
		window.ykDrawCardPool_div.divx=divx;
		var div_add=ui.create.div();
		div_add.style.cssText='height:25px;width:25px;top:90px;left:calc(100% - 85px);border-radius:100px;background-color:white;text-align:center;';
		div_add.innerHTML='<span style="color:black;font-size:25px;font-weight:400;"><b>+</b></span>';
		div_add.onclick=function(){alert('【命定之石】获取途径：活动获得。');};
		window.ykDrawCardPool_div.appendChild(div_add);
		window.yk_clickFK(div_add);
		
		var div_own2=ui.create.div();
		div_own2.style.cssText='height:50px;width:225px;top:65px;left:calc(100% - 535px);text-align:center;';
		window.ykDrawCardPool_div.appendChild(div_own2);
		div_own2.style.border='1px solid white';
		var div_name2=ui.create.div();
		div_name2.style.cssText='height:25px;width:150px;top:65px;left:calc(100% - 485px);text-align:center;';
		div_name2.innerHTML='<span style="color:black;font-size:25px;font-weight:400;font-family:shousha"><b>虚空之泪</b></span>';
		window.ykDrawCardPool_div.appendChild(div_name2);
		var divPict2=ui.create.div();
		divPict2.style.cssText='height:50px;width:50px;top:65px;left:calc(100% - 535px);';
		window.ykDrawCardPool_div.appendChild(divPict2);
		divPict2.onclick=function(){
			alert('每使用【虚空之泪】许愿十次时必得玄级及以上角色/物品！此保底许愿概率：【命定之愿】：玄级 65%、地级 32%、天级 2%、其他 1%；【缘常之愿】：玄级 65%、地级 32%、天级 3%。');
		}
		window.ykCacheSetImage('https://gitee.com/qxqdpcq/yunkong/raw/master/extension/sky_crying.jpg',divPict2,true,"cover");
		var divx2=ui.create.div();
		divx2.style.cssText='height:25px;width:150px;top:90px;left:calc(100% - 485px);border-radius:8px;text-align:center;';
		window.ykDrawCardPool_div.appendChild(divx2);
		window.ykDrawCardPool_div.divx2=divx2;
		var div_add2=ui.create.div();
		div_add2.style.cssText='height:25px;width:25px;top:90px;left:calc(100% - 335px);border-radius:100px;background-color:white;text-align:center;';
		div_add2.innerHTML='<span style="color:black;font-size:25px;font-weight:400;"><b>+</b></span>';
		div_add2.onclick=function(){alert('【虚空之泪】获取途径：任务获得、活动获得。');};
		window.ykDrawCardPool_div.appendChild(div_add2);
		window.yk_clickFK(div_add2);
		if(!window.ykDrawCardPool_div) return ;
		if(!window.ykDrawCardPool_div.divx||!window.ykDrawCardPool_div.divx2) return ;
		var num;
		if(lib.config.yk_myBag&&lib.config.yk_myBag.predestined_fate&&typeof lib.config.yk_myBag.predestined_fate.num=='number') num=lib.config.yk_myBag.predestined_fate.num;
		else num=0;
		var num2;
		if(lib.config.yk_myBag&&lib.config.yk_myBag.sky_crying&&typeof lib.config.yk_myBag.sky_crying.num=='number') num2=lib.config.yk_myBag.sky_crying.num;
		else num2=0;
		window.ykDrawCardPool_div.divx.innerHTML='<b>'+num+'</b>';
		window.ykDrawCardPool_div.divx2.innerHTML='<b>'+num2+'</b>';
		//卡池
		var characterx,tagx,str;
		if(window.ykDrawCardPool_Switch=='usual'){
			characterx='usual';
			tagx='<span style="color:black;font-size:30px;font-weight:400;"><b>缘常之愿<br></b></span>&nbsp&nbsp&nbsp&nbsp<i><span style="color:black;font-size:40px;font-weight:400;"><b><span style=\"color: #FF00FF;\">悠游</span><u><small>世间</u></small></span></b>';
		}
		else{
			tagx='<span style="color:black;font-size:30px;font-weight:400;"><b>命定之愿·<br></b></span>&nbsp&nbsp&nbsp&nbsp<i><span style="color:black;font-size:40px;font-weight:400;"><b>';
			for(var character in lib.ykDrawCardPoolSchel){
				var c=lib.ykDrawCardPoolSchel[character];
				var yearx1=c[0][0],monthx1=c[0][1],dayx1=c[0][2],yearx2=c[1][0],monthx2=c[1][1],dayx2=c[1][2];
				if(window.checkOnlineTime(yearx1,monthx1,dayx1,yearx2,monthx2,dayx2)){
					characterx=character;
					tagx+=(c[2]||'')+'</b></span></i>';
				}
			}
		}
		for(var im of ['ykEquip','ykBook','yk_otherItemLibrary']) if(!lib.config[im]) game.saveConfig(im,{});
		var color='#FFA500',E=lib.ykEquip[characterx],B=lib.ykBook[characterx],O=lib.yk_otherItemLibrary[characterx],R=lib.config.qxq_YK_person.rank[characterx],i,img;
		i=(E||B||O);
		if(i) i=i.grade,img=i.image;
		if(i){
			if(i=='godgrade'||i=='half-godgrade') color='#FF0000';
			else if(i=='tiangrade') color='#FFA500';
		}
		else if(R){
			if(R.indexOf('超稀-限定')!=-1) color='#FF0000';
			else if(R.indexOf('天级')!=-1) color='#FFA500';
		}
		var div_show=ui.create.div();
		div_show.style.cssText='height:calc(100% - 325px);width:calc(100% - 60px);top:150px;left:30px;';
		window.ykDrawCardPool_div.appendChild(div_show);
		div_show.style.border='1px solid white';
		var div_t=ui.create.div();
		div_t.style.cssText='height:100px;width:200px;top:0px;left:0px;';
		div_t.innerHTML=tagx;
		div_show.appendChild(div_t);
		var div_showCharacter=ui.create.div();
		div_showCharacter.style.cssText='height:270px;width:200px;top:calc(50% - 135px);left:calc(50% - 100px);background-position:center center;';
		div_show.appendChild(div_showCharacter);
		if(characterx){
			window.ykCacheSetImage('https://gitee.com/qxqdpcq/yunkong/raw/master/extension/'+(img?img:characterx+'.jpg'),div_showCharacter,true,'cover');
		}
		var div_introduce=ui.create.div();
		div_introduce.style.cssText='height:100px;width:250px;bottom:15px;right:10px;background-color:white;';
		if(characterx!='usual'&&characterx) div_introduce.innerHTML='*命定之愿<br>————【<span style=\"color: '+color+';\">'+get.translation(characterx)+'</span>】'+(lib.ykDrawCardPoolSchel[characterx][5]&&lib.ykDrawCardPoolSchel[characterx][5].length?'，<span style=\"color: #FFA500;\">'+get.translation(lib.ykDrawCardPoolSchel[characterx][5])+'</span>':'')+(lib.ykDrawCardPoolSchel[characterx][4]&&lib.ykDrawCardPoolSchel[characterx][4].length?'，<span style=\"color: #FF00FF;\">'+get.translation(lib.ykDrawCardPoolSchel[characterx][4])+'</span>':'')+(lib.ykDrawCardPoolSchel[characterx][3]&&lib.ykDrawCardPoolSchel[characterx][3].length?'，<span style=\"color: #0000FF;\">'+get.translation(lib.ykDrawCardPoolSchel[characterx][3])+'</span>':'')+'<span style=\"color: #FF0000;\">限时</span><span style=\"color: #FFA500;\">概率up！</span>：<br><b>&nbsp&nbsp'+lib.ykDrawCardPoolSchel[characterx][0][0]+'/'+lib.ykDrawCardPoolSchel[characterx][0][1]+'/'+lib.ykDrawCardPoolSchel[characterx][0][2]+'&nbsp——&nbsp'+lib.ykDrawCardPoolSchel[characterx][1][0]+'/'+lib.ykDrawCardPoolSchel[characterx][1][1]+'/'+lib.ykDrawCardPoolSchel[characterx][1][2];
		else if(characterx) div_introduce.innerHTML='*缘常之愿<br>————常驻许愿活动';
		div_show.appendChild(div_introduce);
		
		var div_chooce1=ui.create.div(),result1=(window.ykDrawCardPool_Switch!='usual'&&num?'predestined_fate':'sky_crying'),result2=(window.ykDrawCardPool_Switch!='usual'&&num&&typeof num=='number'&&num>=10?'predestined_fate':'sky_crying');
		div_chooce1.style.cssText='height:50px;width:225px;top:calc(100% - 90px);left:calc(100% - 535px);border-radius:25px;background-color:white';
		div_chooce1.onclick=function(){
			if(!this.character){
				alert('获取卡池信息失败！');
				return ;
			}
			var tips='将使用';
			if(this.result=='predestined_fate') tips+='【命定之石】x1 ';
			else tips+='【虚空之泪】x150 ';
			tips+='进行一次许愿';
			if(this.result=='predestined_fate'&&(!lib.config.yk_myBag.predestined_fate||lib.config.yk_myBag.predestined_fate.num<1||typeof lib.config.yk_myBag.predestined_fate.num!='number')){
				alert('道具【命定之石】数量不足！');
				return ;
			}
			if(this.result!='predestined_fate'&&(!lib.config.yk_myBag.sky_crying||lib.config.yk_myBag.sky_crying.num<150||typeof lib.config.yk_myBag.sky_crying.num!='number')){
				alert('道具【虚空之泪】数量不足！');
				return ;
			}
			if(confirm(tips)){
				lib.ykSpecialDrawCardPool={
					xuan:lib.ykDrawCardPoolSchel[this.character][3],
					di:lib.ykDrawCardPoolSchel[this.character][4],
					tian:lib.ykDrawCardPoolSchel[this.character][5],
					upItem:this.character,
				};
				var r=Math.random(),resultCharacterItem;
				if(window.ykDrawCardPool_Switch=='usual'){
					game.yk_loseItem('sky_crying',150);
					if(!lib.config.yk_usual_drawCardTime||(lib.config.yk_usual_drawCardTime&&typeof lib.config.yk_usual_drawCardTime.time!='number')||(lib.config.yk_usual_drawCardTime&&typeof lib.config.yk_usual_drawCardTime.T!='number')) lib.config.yk_usual_drawCardTime={time:0,T:0};
					lib.config.yk_usual_drawCardTime.time++;
					lib.config.yk_usual_drawCardTime.T++;
					game.saveConfig('yk_usual_drawCardTime',lib.config.yk_usual_drawCardTime.time);
					if(lib.config.yk_usual_drawCardTime.time>99){
						resultCharacterItem='tian';
						lib.config.yk_usual_drawCardTime.time=0;
						game.saveConfig('yk_usual_drawCardTime',lib.config.yk_usual_drawCardTime.time);
					}
					else if(lib.config.yk_usual_drawCardTime.T>9){
						if((r>=0.1&&r<=0.3)||(r>=0.4&&r<=0.65)||(r>=0.7&&r<=0.9)) resultCharacterItem='xuan';
						else if(r<0.1||(r>0.3&&r<0.4)||(r>0.65&&r<0.7)||(r>0.9&&r<=0.97)) resultCharacterItem='di';
						else resultCharacterItem='tian';
						lib.config.yk_usual_drawCardTime.T=0;
						game.saveConfig('yk_usual_drawCardTime',lib.config.yk_usual_drawCardTime.time);
					}
					else{
						var add=0;
						if(lib.config.yk_usual_drawCardTime.time>60&&typeof lib.config.yk_usual_drawCardTime.time=='number') add=(100-0.5)/(100-lib.config.yk_usual_drawCardTime.time);
						if(r>0&&r<(0.005+add)) resultCharacterItem='tian';//0.5+add
						else if(r>=(0.005+add)&&r<=(0.02+0.75*add)) resultCharacterItem='di';//1.5-0.25*add
						else if(r>(0.02+0.75*add)&&r<=(0.2+0.5*add)) resultCharacterItem='xuan';//18-0.25*add
						else if(r>(0.2+0.5*add)&&r<=(0.5+0.25*add)) resultCharacterItem='huang';//30-0.25*add
						else resultCharacterItem='fan';//50-0.25*add
					}
				}
				else{
					game.yk_loseItem('sky_crying',150);
					if(!lib.ykSpecialDrawCardPool.tian||(lib.ykSpecialDrawCardPool.tian&&!lib.ykSpecialDrawCardPool.tian.length)) lib.ykSpecialDrawCardPool.tian=lib.ykUsualDrawCardPool.tian;
					if(!lib.config.yk_limit_drawCardTime||(lib.config.yk_limit_drawCardTime&&typeof lib.config.yk_limit_drawCardTime.time1!='number')||(lib.config.yk_limit_drawCardTime&&typeof lib.config.yk_limit_drawCardTime.T!='number')) lib.config.yk_limit_drawCardTime={time1:0,time2:false,T:0};
					lib.config.yk_limit_drawCardTime.time1++;
					game.saveConfig('yk_limit_drawCardTime',lib.config.yk_limit_drawCardTime);
					if(lib.config.yk_limit_drawCardTime.time1>99){
						if(lib.config.yk_limit_drawCardTime.time2&&window.ykDrawCardPool_Switch!='usual'&&this.character) resultCharacterItem=this.character;//大保底
						else{//小保底
							if(window.ykDrawCardPool_Switch!='usual'){
								if(Math.random()<0.5){
									resultCharacterItem='tian2';
									lib.config.yk_limit_drawCardTime.time1=0;
									lib.config.yk_limit_drawCardTime.time2=true;
									game.saveConfig('yk_limit_drawCardTime',lib.config.yk_limit_drawCardTime);
								}
								else{
									lib.config.yk_limit_drawCardTime.time1=0;
									game.saveConfig('yk_limit_drawCardTime',lib.config.yk_limit_drawCardTime);
									resultCharacterItem=this.character;
								}
							}
						}
					}
					else if(this.result=='predestined_fate'){//命定之石
						game.yk_loseItem('predestined_fate',1);
						if((r>=0.1&&r<=0.3)||(r>=0.4&&r<=0.6)||(r>=0.7&&r<=0.9)) resultCharacterItem='xuan2';
						else if(r<0.1||(r>0.3&&r<0.4)||(r>0.6&&r<0.7)||(r>0.9&&r<=0.95)) resultCharacterItem='di2';
						else if((r>0.95&&r<=0.97)||(r>=0.98&&r<=1)) resultCharacterItem='tian2';
						else resultCharacterItem='others';
					}
					else if(lib.config.yk_limit_drawCardTime.T>9){
						if((r>=0.1&&r<=0.3)||(r>=0.4&&r<=0.65)||(r>=0.7&&r<=0.9)) resultCharacterItem='xuan2';
						else if(r<0.1||(r>0.3&&r<0.4)||(r>0.65&&r<0.7)||(r>0.9&&r<=0.97)) resultCharacterItem='di2';
						else if((r>0.97&&r<=0.98)||(r>=0.99&&r<=1)) resultCharacterItem='tian2';
						else resultCharacterItem='others';
						lib.config.yk_limit_drawCardTime.T=0;
						game.saveConfig('yk_limit_drawCardTime',lib.config.yk_limit_drawCardTime);
					}
					else{
						var add=0;
						if(lib.config.yk_limit_drawCardTime.time>60&&typeof lib.config.yk_limit_drawCardTime.time=='number') add=(lib.config.yk_limit_drawCardTime.time-60)*2.4875;
						if(r>0&&r<(0.0005+0.5*add)) resultCharacterItem='others';//0.05+0.5*add
						else if(r>(0.0005+0.5*add)&&r<(0.005+add)) resultCharacterItem='tian2';//0.45+0.5*add
						else if(r>=(0.005+add)&&r<=(0.02+0.75*add)) resultCharacterItem='di2';//1.5-0.25*add
						else if(r>(0.02+0.75*add)&&r<=(0.2+0.5*add)) resultCharacterItem='xuan2';//18-0.25*add
						else if(r>(0.2+0.5*add)&&r<=(0.5+0.25*add)) resultCharacterItem='huang';//30-0.25*add
						else resultCharacterItem='fan';//50-0.25*add
					}
				}
				if(resultCharacterItem=='fan'){
					var fanListE=[],fanListB=[],fanListO=[];
					for(var item in lib.ykEquip) if(lib.ykEquip[item].grade=='fangrade'&&lib.ykEquip[item].showupRate1) fanListE.push(item);
					for(var item in lib.ykBook) if(lib.ykBook[item].grade=='fangrade'&&lib.ykBook[item].showupRate1) fanListB.push(item);
					for(var item in lib.yk_otherItemLibrary) if(lib.yk_otherItemLibrary[item].grade=='fangrade'&&lib.yk_otherItemLibrary[item].showupRate1){
						if(lib.yk_otherItemLibrary[item].subtype=='秘籍拓本'||lib.yk_otherItemLibrary[item].subtype=='秘籍手札'){
							if(Math.random()<(lib.yk_otherItemLibrary[item].showupRate4||0.01)/500) fanListO.push(item);
						}
						else fanListO.push(item);
					}
					resultCharacterItem=fanListE.concat(fanListB).concat(fanListO).concat(fanListO).concat(fanListO).concat(fanListO).concat(fanListO).concat(fanListO).concat(fanListO).concat(fanListO).randomSort().randomSort().randomGet();
				}
				else if(resultCharacterItem=='huang'){
					var huangListE=[],huangListB=[],huangListO=[];
					for(var item in lib.ykEquip) if(lib.ykEquip[item].grade=='huanggrade'&&lib.ykEquip[item].showupRate1) huangListE.push(item);
					for(var item in lib.ykBook) if(lib.ykBook[item].grade=='huanggrade'&&lib.ykBook[item].showupRate1) huangListB.push(item);
					for(var item in lib.yk_otherItemLibrary) if(lib.yk_otherItemLibrary[item].grade=='huanggrade'&&lib.yk_otherItemLibrary[item].showupRate1){
						if(lib.yk_otherItemLibrary[item].subtype=='秘籍拓本'||lib.yk_otherItemLibrary[item].subtype=='秘籍手札'){
							if(Math.random()<(lib.yk_otherItemLibrary[item].showupRate4||0.01)/500) huangListO.push(item);
						}
						else huangListO.push(item);
					}
					resultCharacterItem=huangListE.concat(huangListB).concat(huangListO).concat(huangListO).concat(huangListO).concat(huangListO).concat(huangListO).concat(huangListO).concat(huangListO).concat(huangListO).randomSort().randomSort().randomGet();
				}
				else if(resultCharacterItem=='xuan'){
					resultCharacterItem=lib.ykUsualDrawCardPool.xuan.randomGet();
				}
				else if(resultCharacterItem=='di'){
					resultCharacterItem=lib.ykUsualDrawCardPool.di.randomGet();
				}
				else if(resultCharacterItem=='tian'){
					resultCharacterItem=lib.ykUsualDrawCardPool.tian.randomGet();
				}
				else if(resultCharacterItem=='xuan2'){
					var a=Math.random();
					if((a<0.25||a>0.75)&&lib.ykSpecialDrawCardPool.xuan&&lib.ykSpecialDrawCardPool.xuan.length) resultCharacterItem=lib.ykSpecialDrawCardPool.xuan.randomGet();
					else resultCharacterItem=lib.ykUsualDrawCardPool.xuan.randomGet();
				}
				else if(resultCharacterItem=='di2'){
					var a=Math.random();
					if((a<0.25||a>0.75)&&lib.ykSpecialDrawCardPool.di&&lib.ykSpecialDrawCardPool.di.length) resultCharacterItem=lib.ykSpecialDrawCardPool.di.randomGet();
					else resultCharacterItem=lib.ykUsualDrawCardPool.di.randomGet();
				}
				else if(resultCharacterItem=='tian2'){
					var a=Math.random();
					if(a<0.25||a>0.75) resultCharacterItem=lib.ykSpecialDrawCardPool.upItem;
					else resultCharacterItem=lib.ykSpecialDrawCardPool.tian.concat(lib.ykUsualDrawCardPool.tian).randomGet();
				}
				else if(resultCharacterItem=='others'){
					var a=Math.random();
					if(a<0.25||a>0.75) resultCharacterItem=lib.ykSpecialDrawCardPool.upItem;
					else resultCharacterItem=lib.ykSpecialDrawCardPool.tian.concat(lib.ykUsualDrawCardPool.tian).randomGet();
				}
				var num;
				if(lib.config.yk_myBag&&lib.config.yk_myBag.predestined_fate&&typeof lib.config.yk_myBag.predestined_fate.num=='number') num=lib.config.yk_myBag.predestined_fate.num;
				else num=0;
				var num2;
				if(lib.config.yk_myBag&&lib.config.yk_myBag.sky_crying&&typeof lib.config.yk_myBag.sky_crying.num=='number') num2=lib.config.yk_myBag.sky_crying.num;
				else num2=0;
				window.ykDrawCardPool_div.divx.innerHTML='<b>'+num+'</b>';
				window.ykDrawCardPool_div.divx2.innerHTML='<b>'+num2+'</b>';
				window.ykDraw(resultCharacterItem);
				window.ykDrawCardPool_div.hide();
			}
		}
		window.ykDrawCardPool_div.appendChild(div_chooce1);
		window.yk_clickFK(div_chooce1);
		var div_chooce1Pict=ui.create.div();
		div_chooce1Pict.style.cssText='height:40px;width:40px;top:calc(100% - 85px);left:calc(100% - 470px);';
		window.ykCacheSetImage('https://gitee.com/qxqdpcq/yunkong/raw/master/extension/'+result1+'.jpg',div_chooce1Pict,"cover");
		window.ykDrawCardPool_div.appendChild(div_chooce1Pict);
		var div_chooce1Num=ui.create.div();
		div_chooce1Num.style.cssText='height:25px;width:110px;top:calc(100% - 77px);left:calc(100% - 420px);';
		div_chooce1Num.innerHTML='<span style="color:black;font-size:25px;font-weight:400;"><b> x'+(result1=='predestined_fate'?'1':'150')+'</b></span>';
		window.ykDrawCardPool_div.appendChild(div_chooce1Num);
		div_chooce1Num.result=div_chooce1Pict.result=div_chooce1.result1;
		div_chooce1Num.character=div_chooce1Pict.character=div_chooce1.character;
		var div_chooce1Button=ui.create.div();
		div_chooce1Button.style.cssText=div_chooce1.style.cssText;
		div_chooce1Button.style.opacity=0;
		window.ykDrawCardPool_div.appendChild(div_chooce1Button);
		div_chooce1Button.onclick=div_chooce1.onclick;
		div_chooce1Button.source=div_chooce1;
		div_chooce1Button.style.transition='opacity 0.5s';
		div_chooce1Button.addEventListener(lib.config.touchscreen?'touchstart':'mousedown',function(){
			this.source.style.transform='scale(0.95)';
		});
		div_chooce1Button.addEventListener(lib.config.touchscreen?'touchend':'mouseup',function(){
			this.source.style.transform='';
		});
		div_chooce1Button.onmouseout=function(){
			this.source.style.transform='';
		};
		div_chooce1Button.result=div_chooce1.result=result1;
		div_chooce1Button.character=div_chooce1.character=characterx;
		div_chooce1Button.divx=div_chooce1.divx=divx;
		div_chooce1Button.divx2=div_chooce1.divx2=divx2;
		
		var div_chooce2=ui.create.div(),result1=(num?'predestined_fate':'sky_crying'),result2=(num&&typeof num=='number'&&num>=10?'predestined_fate':'sky_crying');
		div_chooce2.style.cssText='height:50px;width:225px;top:calc(100% - 90px);left:calc(100% - 285px);border-radius:25px;background-color:white;';
		window.ykDrawCardPool_div.appendChild(div_chooce2);
		window.yk_clickFK(div_chooce2);
		div_chooce2.onclick=function(){
			if(!this.character){
				alert('获取卡池信息失败！');
				return ;
			}
			var tips='将使用';
			if(this.result=='predestined_fate') tips+='【命定之石】x10 ';
			else tips+='【虚空之泪】x1500 ';
			tips+='进行十次许愿';
			if(this.result=='predestined_fate'&&(!lib.config.yk_myBag.predestined_fate||lib.config.yk_myBag.predestined_fate.num<10||typeof lib.config.yk_myBag.predestined_fate.num!='number')){
				alert('道具【命定之石】数量不足！');
				return ;
			}
			if(this.result!='predestined_fate'&&(!lib.config.yk_myBag.sky_crying||lib.config.yk_myBag.sky_crying.num<1500||typeof lib.config.yk_myBag.sky_crying.num!='number')){
				alert('道具【虚空之泪】数量不足！');
				return ;
			}
			if(confirm(tips)){
				lib.ykSpecialDrawCardPool={
					xuan:lib.ykDrawCardPoolSchel[this.character][3],
					di:lib.ykDrawCardPoolSchel[this.character][4],
					tian:lib.ykDrawCardPoolSchel[this.character][5],
					upItem:this.character,
				};
				var drawx=function(character,result){
					var r=Math.random(),resultCharacterItem;
					if(window.ykDrawCardPool_Switch=='usual'){
						game.yk_loseItem('sky_crying',150);
						if(!lib.config.yk_usual_drawCardTime||(lib.config.yk_usual_drawCardTime&&typeof lib.config.yk_usual_drawCardTime.time!='number')||(lib.config.yk_usual_drawCardTime&&typeof lib.config.yk_usual_drawCardTime.T!='number')) lib.config.yk_usual_drawCardTime={time:0,T:0};
						lib.config.yk_usual_drawCardTime.time++;
						lib.config.yk_usual_drawCardTime.T++;
						game.saveConfig('yk_usual_drawCardTime',lib.config.yk_usual_drawCardTime.time);
						if(lib.config.yk_usual_drawCardTime.time>99){
							resultCharacterItem='tian';
							lib.config.yk_usual_drawCardTime.time=0;
							game.saveConfig('yk_usual_drawCardTime',lib.config.yk_usual_drawCardTime.time);
						}
						else if(lib.config.yk_usual_drawCardTime.T>9){
							if((r>=0.1&&r<=0.3)||(r>=0.4&&r<=0.65)||(r>=0.7&&r<=0.9)) resultCharacterItem='xuan';
							else if(r<0.1||(r>0.3&&r<0.4)||(r>0.65&&r<0.7)||(r>0.9&&r<=0.97)) resultCharacterItem='di';
							else resultCharacterItem='tian';
							lib.config.yk_usual_drawCardTime.T=0;
							game.saveConfig('yk_usual_drawCardTime',lib.config.yk_usual_drawCardTime.time);
						}
						else{
							var add=0;
							if(lib.config.yk_usual_drawCardTime.time>60&&typeof lib.config.yk_usual_drawCardTime.time=='number') add=(100-0.5)/(100-lib.config.yk_usual_drawCardTime.time);
							if(r>0&&r<(0.005+add)) resultCharacterItem='tian';//0.5+add
							else if(r>=(0.005+add)&&r<=(0.02+0.75*add)) resultCharacterItem='di';//1.5-0.25*add
							else if(r>(0.02+0.75*add)&&r<=(0.2+0.5*add)) resultCharacterItem='xuan';//18-0.25*add
							else if(r>(0.2+0.5*add)&&r<=(0.5+0.25*add)) resultCharacterItem='huang';//30-0.25*add
							else resultCharacterItem='fan';//50-0.25*add
						}
					}
					else{
						game.yk_loseItem('sky_crying',150);
						if(!lib.ykSpecialDrawCardPool.tian||(lib.ykSpecialDrawCardPool.tian&&!lib.ykSpecialDrawCardPool.tian.length)) lib.ykSpecialDrawCardPool.tian=lib.ykUsualDrawCardPool.tian;
						if(!lib.config.yk_limit_drawCardTime||(lib.config.yk_limit_drawCardTime&&typeof lib.config.yk_limit_drawCardTime.time1!='number')||(lib.config.yk_limit_drawCardTime&&typeof lib.config.yk_limit_drawCardTime.T!='number')) lib.config.yk_limit_drawCardTime={time1:0,time2:false,T:0};
						lib.config.yk_limit_drawCardTime.time1++;
						game.saveConfig('yk_limit_drawCardTime',lib.config.yk_limit_drawCardTime);
						if(lib.config.yk_limit_drawCardTime.time1>99){
							if(lib.config.yk_limit_drawCardTime.time2&&window.ykDrawCardPool_Switch!='usual'&&lib.ykSpecialDrawCardPool.upItem) resultCharacterItem=lib.ykSpecialDrawCardPool.upItem;//大保底
							else{//小保底
								if(window.ykDrawCardPool_Switch!='usual'){
									if(Math.random()<0.5){
										resultCharacterItem='tian2';
										lib.config.yk_limit_drawCardTime.time1=0;
										lib.config.yk_limit_drawCardTime.time2=true;
										game.saveConfig('yk_limit_drawCardTime',lib.config.yk_limit_drawCardTime);
									}
									else{
										lib.config.yk_limit_drawCardTime.time1=0;
										game.saveConfig('yk_limit_drawCardTime',lib.config.yk_limit_drawCardTime);
										resultCharacterItem=lib.ykSpecialDrawCardPool.upItem;
									}
								}
							}
						}
						else if(result=='predestined_fate'){//命定之石
							game.yk_loseItem('predestined_fate',1);
							if((r>=0.1&&r<=0.3)||(r>=0.4&&r<=0.6)||(r>=0.7&&r<=0.9)) resultCharacterItem='xuan2';
							else if(r<0.1||(r>0.3&&r<0.4)||(r>0.6&&r<0.7)||(r>0.9&&r<=0.95)) resultCharacterItem='di2';
							else if((r>0.95&&r<=0.97)||(r>=0.98&&r<=1)) resultCharacterItem='tian2';
							else resultCharacterItem='others';
						}
						else if(lib.config.yk_limit_drawCardTime.T>9){
							if((r>=0.1&&r<=0.3)||(r>=0.4&&r<=0.65)||(r>=0.7&&r<=0.9)) resultCharacterItem='xuan2';
							else if(r<0.1||(r>0.3&&r<0.4)||(r>0.65&&r<0.7)||(r>0.9&&r<=0.97)) resultCharacterItem='di2';
							else if((r>0.97&&r<=0.98)||(r>=0.99&&r<=1)) resultCharacterItem='tian2';
							else resultCharacterItem='others';
							lib.config.yk_limit_drawCardTime.T=0;
							game.saveConfig('yk_limit_drawCardTime',lib.config.yk_limit_drawCardTime);
						}
						else{
							var add=0;
							if(lib.config.yk_limit_drawCardTime.time>60&&typeof lib.config.yk_limit_drawCardTime.time=='number') add=(lib.config.yk_limit_drawCardTime.time-60)*2.4875;
							if(r>0&&r<(0.0005+0.5*add)) resultCharacterItem='others';//0.05+0.5*add
							else if(r>(0.0005+0.5*add)&&r<(0.005+add)) resultCharacterItem='tian2';//0.45+0.5*add
							else if(r>=(0.005+add)&&r<=(0.02+0.75*add)) resultCharacterItem='di2';//1.5-0.25*add
							else if(r>(0.02+0.75*add)&&r<=(0.2+0.5*add)) resultCharacterItem='xuan2';//18-0.25*add
							else if(r>(0.2+0.5*add)&&r<=(0.5+0.25*add)) resultCharacterItem='huang';//30-0.25*add
							else resultCharacterItem='fan';//50-0.25*add
						}
					}
					if(resultCharacterItem=='fan'){
						var fanListE=[],fanListB=[],fanListO=[];
						for(var item in lib.ykEquip) if(lib.ykEquip[item].grade=='fangrade'&&lib.ykEquip[item].showupRate1) fanListE.push(item);
						for(var item in lib.ykBook) if(lib.ykBook[item].grade=='fangrade'&&lib.ykBook[item].showupRate1) fanListB.push(item);
						for(var item in lib.yk_otherItemLibrary) if(lib.yk_otherItemLibrary[item].grade=='fangrade'&&lib.yk_otherItemLibrary[item].showupRate1){
							if(lib.yk_otherItemLibrary[item].subtype=='秘籍拓本'||lib.yk_otherItemLibrary[item].subtype=='秘籍手札'){
								if(Math.random()<(lib.yk_otherItemLibrary[item].showupRate4||0.01)/500) fanListO.push(item);
							}
							else fanListO.push(item);
						}
						resultCharacterItem=fanListE.concat(fanListB).concat(fanListO).concat(fanListO).concat(fanListO).concat(fanListO).concat(fanListO).concat(fanListO).concat(fanListO).concat(fanListO).randomSort().randomSort().randomGet();
					}
					else if(resultCharacterItem=='huang'){
						var huangListE=[],huangListB=[],huangListO=[];
						for(var item in lib.ykEquip) if(lib.ykEquip[item].grade=='huanggrade'&&lib.ykEquip[item].showupRate1) huangListE.push(item);
						for(var item in lib.ykBook) if(lib.ykBook[item].grade=='huanggrade'&&lib.ykBook[item].showupRate1) huangListB.push(item);
						for(var item in lib.yk_otherItemLibrary) if(lib.yk_otherItemLibrary[item].grade=='huanggrade'&&lib.yk_otherItemLibrary[item].showupRate1){
							if(lib.yk_otherItemLibrary[item].subtype=='秘籍拓本'||lib.yk_otherItemLibrary[item].subtype=='秘籍手札'){
								if(Math.random()<(lib.yk_otherItemLibrary[item].showupRate4||0.01)/500) huangListO.push(item);
							}
							else huangListO.push(item);
						}
						resultCharacterItem=huangListE.concat(huangListB).concat(huangListO).concat(huangListO).concat(huangListO).concat(huangListO).concat(huangListO).concat(huangListO).concat(huangListO).concat(huangListO).randomSort().randomSort().randomGet();
					}
					else if(resultCharacterItem=='xuan'){
						resultCharacterItem=lib.ykUsualDrawCardPool.xuan.randomGet();
					}
					else if(resultCharacterItem=='di'){
						resultCharacterItem=lib.ykUsualDrawCardPool.di.randomGet();
					}
					else if(resultCharacterItem=='tian'){
						resultCharacterItem=lib.ykUsualDrawCardPool.tian.randomGet();
					}
					else if(resultCharacterItem=='xuan2'){
						var a=Math.random();
						if((a<0.25||a>0.75)&&lib.ykSpecialDrawCardPool.xuan&&lib.ykSpecialDrawCardPool.xuan.length) resultCharacterItem=lib.ykSpecialDrawCardPool.xuan.randomGet();
						else resultCharacterItem=lib.ykUsualDrawCardPool.xuan.randomGet();
					}
					else if(resultCharacterItem=='di2'){
						var a=Math.random();
						if((a<0.25||a>0.75)&&lib.ykSpecialDrawCardPool.di&&lib.ykSpecialDrawCardPool.di.length) resultCharacterItem=lib.ykSpecialDrawCardPool.di.randomGet();
						else resultCharacterItem=lib.ykUsualDrawCardPool.di.randomGet();
					}
					else if(resultCharacterItem=='tian2'){
						var a=Math.random();
						if(a<0.25||a>0.75) resultCharacterItem=lib.ykSpecialDrawCardPool.upItem;
						else resultCharacterItem=lib.ykSpecialDrawCardPool.tian.concat(lib.ykUsualDrawCardPool.tian).randomGet();
					}
					else if(resultCharacterItem=='others'){
						var a=Math.random();
						if(a<0.25||a>0.75) resultCharacterItem=lib.ykSpecialDrawCardPool.upItem;
						else resultCharacterItem=lib.ykSpecialDrawCardPool.tian.concat(lib.ykUsualDrawCardPool.tian).randomGet();
					}
					return resultCharacterItem;
				}
				var num;
				if(lib.config.yk_myBag&&lib.config.yk_myBag.predestined_fate&&typeof lib.config.yk_myBag.predestined_fate.num=='number') num=lib.config.yk_myBag.predestined_fate.num;
				else num=0;
				var num2;
				if(lib.config.yk_myBag&&lib.config.yk_myBag.sky_crying&&typeof lib.config.yk_myBag.sky_crying.num=='number') num2=lib.config.yk_myBag.sky_crying.num;
				else num2=0;
				window.ykDrawCardPool_div.divx.innerHTML='<b>'+num+'</b>';
				window.ykDrawCardPool_div.divx2.innerHTML='<b>'+num2+'</b>';
				var resultCharacterItemList=[];
				for(var i=0;i<10;i++) resultCharacterItemList.push(drawx(this.character,this.result));
				window.ykDraw(resultCharacterItemList);
				window.ykDrawCardPool_div.hide();
			}
		}
		var div_chooce2Pict=ui.create.div();
		div_chooce2Pict.style.cssText='height:40px;width:40px;top:calc(100% - 85px);left:calc(100% - 220px);';
		window.ykCacheSetImage('https://gitee.com/qxqdpcq/yunkong/raw/master/extension/'+result2+'.jpg',div_chooce2Pict,"cover");
		window.ykDrawCardPool_div.appendChild(div_chooce2Pict);
		var div_chooce2Num=ui.create.div();
		div_chooce2Num.style.cssText='height:25px;width:110px;top:calc(100% - 77px);left:calc(100% - 170px);';
		div_chooce2Num.innerHTML='<span style="color:black;font-size:25px;font-weight:400;"><b> x'+(result2=='predestined_fate'?'10':'1500')+'</b></span>';
		window.ykDrawCardPool_div.appendChild(div_chooce2Num);
		div_chooce2Num.result=div_chooce2Pict.result=div_chooce2.result1;
		div_chooce2Num.character=div_chooce2Pict.character=div_chooce2.character;
		var div_chooce2Button=ui.create.div();
		div_chooce2Button.style.cssText=div_chooce2.style.cssText;
		div_chooce2Button.style.opacity=0;
		div_chooce2Button.style.backgroundColor='none';
		window.ykDrawCardPool_div.appendChild(div_chooce2Button);
		div_chooce2Button.onclick=div_chooce2.onclick;
		div_chooce2Button.source=div_chooce2;
		div_chooce2Button.style.transition='opacity 0.5s';
		div_chooce2Button.addEventListener(lib.config.touchscreen?'touchstart':'mousedown',function(){
			this.source.style.transform='scale(0.95)';
		});
		div_chooce2Button.addEventListener(lib.config.touchscreen?'touchend':'mouseup',function(){
			this.source.style.transform='';
		});
		div_chooce2Button.onmouseout=function(){
			this.source.style.transform='';
		};
		div_chooce2Button.result=div_chooce2.result=result2;
		div_chooce2Button.character=div_chooce2.character=characterx;
		div_chooce2Button.divx=div_chooce2.divx=divx;
		div_chooce2Button.divx2=div_chooce2.divx2=divx2;
	}
});