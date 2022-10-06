'use strict';
window.YKimport(function(lib,game,ui,get,ai,_status){
	//防止反复加载
	if(window.ykloadJSON_element) return ;
	window.ykloadJSON_element=true;
	lib.yk_element=['yk_soil','yk_wind','yk_water','yk_fire','yk_light','yk_dark','yk_ice','yk_stone','yk_thunder','yk_wood'];
	lib.yk_elementTranslate={
		'yk_soil':'地',
		'yk_wind':'风',
		'yk_water':'水',
		'yk_fire':'火',
		'yk_light':'光',
		'yk_dark':'暗',
		'yk_ice':'冰',
		'yk_stone':'岩',
		'yk_thunder':'雷',
		'yk_wood':'草',
		'yk_soul':'元',
	}
	for(var i in lib.yk_elementTranslate) lib.translate[i]=lib.yk_elementTranslate[i];
	lib.element.player.yk_addElement=function(element){
		if(lib.yk_element&&lib.yk_element.indexOf(element)==-1) return ;
		if(!element) return ;
		else if(Array.isArray(element)){
			for(var ele of element){
				player.yk_addElement(ele);
				return ;
			}
		}
		else if(typeof element!='string') return ;
		var player=this;
		var color='';
		if(element=='yk_fire') color='#FF0000';
		if(element=='yk_water') color='#0000FF';
		if(element=='yk_soil') color='#FFEC8B';
		if(element=='yk_wind') color='#00FF00';
		if(element=='yk_ice') color='#00FFFF';
		if(element=='yk_stone') color='#FFEC8B';
		if(element=='yk_thunder') color='#FF00FF';
		if(element=='yk_light') color='#FFFF00';
		if(element=='yk_dark') color='#000000';
		if(element=='yk_wood') color='#00FF00';
		if(lib.config.extensions && lib.config.extensions.contains('十周年UI') && lib.config['extension_十周年UI_enable']) player.popup(get.translation(element));
		else player.popup('<span style=\"color: '+color+';\">'+get.translation(element)+'</span>');
		game.log(player,'被附着上了<span class="yellowtext">'+get.translation(element)+'元素</span>');
		if(player[element]) return ;
		player[element]=true;
		player.yk_elementReact();
	}
	lib.element.player.yk_removeElement=function(element){
		if(!element) return ;
		var player=this;
		if(typeof element=='string'){
			player[element]=false;
		}
		else if(Array.isArray(element)){
			for(var ele of element) player[ele]=false;
		}
	}
	lib.element.player.yk_elementReact=function(){//每轮同种反应只能执行一次
		var player=this;
		if((!player.ykreact_shihua)&&player.yk_soil&&(player.yk_fire||player.yk_ice)){
			player.yk_removeElement(['yk_soil','yk_fire','yk_ice']);
			player.yk_addElement('yk_stone');
			player.changeHujia(get.rand(2,5));
			if(lib.config.extensions && lib.config.extensions.contains('十周年UI') && lib.config['extension_十周年UI_enable']) player.popup('石化');
			else player.popup('<span style=\"color: #FFEC8B;\">石化</span>');
			//内置CD
			player.ykreact_shihua=2;
		}
		else if((!player.ykreact_liejie)&&player.yk_stone&&(player.yk_water||player.yk_thunder||player.yk_wood)){
			player.yk_removeElement(['yk_stone','yk_water','yk_thunder','yk_wood']);
			player.yk_addElement('yk_soil');
			player.changeHujia(-player.hujia);
			if(lib.config.extensions && lib.config.extensions.contains('十周年UI') && lib.config['extension_十周年UI_enable']) player.popup('裂解');
			else player.popup('<span style=\"color: #FFEC8B;\">裂解</span>');
			//内置CD
			player.ykreact_liejie=2;
		}
		else if((!player.ykreact_cuihua)&&player.yk_wood&&player.yk_thunder){
			player.yk_removeElement(['yk_wood','yk_thunder']);
			lib.skill.yk_elementReactCuiHua={
				trigger:{
					global:["phaseAfter"],
					player:"damageBegin",
				},
				silent:true,
				forced:true,
				content:function(){
					if(trigger.name=='damage') trigger.num++;
					player.removeSkill('yk_elementReactCuiHua');
				},
			}
			lib.translate['yk_elementReactCuiHua']='脆化';
			lib.translate['yk_elementReactCuiHua_info']='直到任意角色回合结束前，下一次受到的伤害+1。';
			if(lib.config.extensions && lib.config.extensions.contains('十周年UI') && lib.config['extension_十周年UI_enable']) player.popup('脆化');
			else player.popup('<span style=\"color: #FF00FF;\">脆化</span>');
			player.addSkill('yk_elementReactCuiHua');
			//内置CD
			player.ykreact_cuihua=2;
		}
		else if((!player.ykreact_ronghua)&&player.yk_ice&&(player.yk_fire||player.yk_light)){
			player.yk_removeElement(['yk_ice','yk_fire','yk_light']);
			player.yk_addElement('yk_water');
			player.turnOver(false);
			if(lib.config.extensions && lib.config.extensions.contains('十周年UI') && lib.config['extension_十周年UI_enable']) player.popup('融化');
			else player.popup('<span style=\"color: #0000FF;\">融化</span>');
			//内置CD
			player.ykreact_ronghua=1;
		}
		else if((!player.ykreact_zhengfa)&&player.yk_water&&player.yk_fire){
			player.yk_removeElement(['yk_water','yk_fire']);
			lib.skill.yk_elementReactZhengFa={
				trigger:{
					global:["phaseAfter"],
					player:"damageBegin",
				},
				filter:function(event,player){
					if(event.name=='damage') return event.nature&&event.nature=='yk_thunder';
					else return true;
				},
				silent:true,
				forced:true,
				content:function(){
					if(trigger.name=='damage') trigger.num+=get.rand(1,2);
					player.removeSkill('yk_elementReactZhengFa');
				},
			}
			lib.translate['yk_elementReactZhengFa']='蒸发';
			lib.translate['yk_elementReactZhengFa_info']='直到任意角色回合结束前，下一次受到的云空雷属性伤害随机+1或+2。';
			if(lib.config.extensions && lib.config.extensions.contains('十周年UI') && lib.config['extension_十周年UI_enable']) player.popup('蒸发');
			else player.popup('<span style=\"color: #0000FF;\">蒸发</span>');
			player.addSkill('yk_elementReactZhengFa');
			//内置CD
			player.ykreact_zhengfa=1;
		}
		else if((!player.ykreact_dongjie)&&player.yk_ice&&player.yk_water){
			player.yk_removeElement('yk_water');
			player.turnOver(true);
			player.changeHujia();
			lib.skill.yk_elementReactDongJie={
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
				onremove:function(player){
					if(player.hujia) player.changeHujia(-1);
				},
				trigger:{
					player:["turnOverBefore","damageAfter"],
				},
				forced:true,
				content:function(){
					if(trigger.name=='turnOver'){
						player.removeSkill('yk_elementReactDongJie');
					}
					else{
						player.turnOver(false);
						var source=(trigger.source||'nosource');
						player.damage(1,source);
					}
				},
			}
			lib.translate.yk_elementReactDongJie='冻结';
			lib.translate.yk_elementReactDongJie_info='此状态下，你不能使用或打出牌，受到伤害时额外受到一点伤害并退出此状态，退出时移除一点护甲。';
			player.addSkill('yk_elementReactDongJie');
			if(lib.config.extensions && lib.config.extensions.contains('十周年UI') && lib.config['extension_十周年UI_enable']) player.popup('冻结');
			else player.popup('<span style=\"color: #00FFFF;\">冻结</span>');
			//内置CD
			player.ykreact_dongjie=2;
		}
		else if((!player.ykreact_kuosan)&&player.yk_wind){
			player.yk_removeElement('yk_wind');
			var plElement=[];
			for(var element of lib.yk_element) if(player[element]){
				plElement.push(element);
			}
			if(lib.config.extensions && lib.config.extensions.contains('十周年UI') && lib.config['extension_十周年UI_enable']) player.popup('扩散');
			else player.popup('<span style=\"color: #00FF00;\">扩散</span>');
			for(var pl of game.players) if(pl.inRange(player)&&plElement.length){
				var ele=plElement.randomGet();
				if(lib.config.extensions && lib.config.extensions.contains('十周年UI') && lib.config['extension_十周年UI_enable']) pl.popup('扩散');
				else pl.popup('<span style=\"color: #00FF00;\">扩散</span>');
				pl.yk_addElement(ele);
			}
			//内置CD
			player.ykreact_kuosan=1;
		}
		else if((!player.ykreact_chaozai)&&player.yk_thunder&&player.yk_fire){
			player.yk_removeElement(['yk_thunder','yk_fire']);
			player.yk_addElement('yk_light');
			if(lib.config.extensions && lib.config.extensions.contains('十周年UI') && lib.config['extension_十周年UI_enable']) player.popup('超载');
			else player.popup('<span style=\"color: #FF0000;\">超载</span>');
			if(lib.config.extensions && lib.config.extensions.contains('十周年UI') && lib.config['extension_十周年UI_enable']) player.popup('失明');
			else player.popup('<span style=\"color: #FFFF00;\">失明</span>');
			if(player.countCards('he')>0) player.discard(player.getCards('he').randomGet());
			lib.skill.yk_elementReactShiMing={
				trigger:{
					player:["useCardBefore","phaseAfter"],
				},
				filter:function(event,player){
					if(Math.random()<0.5) return event.name=='useCard'&&(event.target!=undefined||(event.targets&&event.targets[0]!=undefined));
					else return true;
				},
				forced:true,
				content:function(){
					if(trigger.name=='useCard'){
						if(lib.config.extensions && lib.config.extensions.contains('十周年UI') && lib.config['extension_十周年UI_enable']) player.popup('失明');
						else player.popup('<span style=\"color: #FFFF00;\">失明</span>');
						if(trigger.target) trigger.target=game.players.randomGet();
						else if(trigger.targets[0]) trigger.targets[0]=game.players.randomGet();
					}
					player.removeSkill('yk_elementReactShiMing');
				},
			}
			lib.translate['yk_elementReactShiMing']='失明';
			lib.translate['yk_elementReactShiMing_info']='你使用卡牌时，有一定几率将此牌的目标重置并移除此状态；或回合结束后自动移除';
			player.addSkill('yk_elementReactShiMing');
			//内置CD
			player.ykreact_chaozai=2;
		}
		else if((!player.ykreact_gandian)&&player.yk_thunder&&player.yk_water){
			player.yk_removeElement(['yk_water']);
			player.damage(1,'thunder','nosource');
			for(var pl of game.players) if(get.distance(player,pl)==1){
				player.line(pl,'thunder');
				pl.damage(1,'thunder','nosource');
				pl.yk_addElement('thunder');
			}
			lib.skill.yk_elementReactGanDian={
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
				trigger:{
					global:["phaseAfter"],
				},
				silent:true,
				forced:true,
				content:function(){
					if(lib.config.extensions && lib.config.extensions.contains('十周年UI') && lib.config['extension_十周年UI_enable']) player.popup('麻痹解除');
					else player.popup('<span style=\"color: #FF00FF;\">麻痹解除</span>');
					player.removeSkill('yk_elementReactGanDian');
				},
			}
			lib.translate['yk_elementReactGanDian']='麻痹';
			lib.translate['yk_elementReactGanDian_info']='你无法使用任何卡牌直到任意角色回合结束';
			if(lib.config.extensions && lib.config.extensions.contains('十周年UI') && lib.config['extension_十周年UI_enable']) player.popup('感电');
			else player.popup('<span style=\"color: #FF00FF;\">感电</span>');//附加麻痹效果，同时对距离为1以内的其他角色造成雷元素伤害并附加雷元素
			if(lib.config.extensions && lib.config.extensions.contains('十周年UI') && lib.config['extension_十周年UI_enable']) player.popup('麻痹');
			else player.popup('<span style=\"color: #FF00FF;\">麻痹</span>');
			player.addSkill('yk_elementReactGanDian');
			//内置CD
			player.ykreact_gandian=get.rand(1,2);
		}
		else if((!player.ykreact_chaodao&&player.yk_thunder)&&player.yk_ice){
			player.yk_removeElement('yk_thunder');
			lib.skill.yk_elementReactPoFang={
				trigger:{
					global:["phaseAfter"],
					player:"damageBegin",
				},
				filter:function(event,player){
					if(event.name=='damage') return event.nature&&event.nature=='yk_thunder';
					else return true;
				},
				silent:true,
				forced:true,
				content:function(){
					if(trigger.name=='damage') trigger.num++;
					if(lib.config.extensions && lib.config.extensions.contains('十周年UI') && lib.config['extension_十周年UI_enable']) player.popup('破防解除');
					else player.popup('<span style=\"color: #FF00FF;\">破防解除</span>');
					player.removeSkill('yk_elementReactPoFang');
				},
			}
			lib.translate['yk_elementReactPoFang']='破防';
			lib.translate['yk_elementReactPoFang_info']='直到任意角色回合结束前，下一次受到的云空雷属性伤害+1。';
			if(lib.config.extensions && lib.config.extensions.contains('十周年UI') && lib.config['extension_十周年UI_enable']) player.popup('超导');
			else player.popup('<span style=\"color: #00FFFF;\">超导</span>');
			if(lib.config.extensions && lib.config.extensions.contains('十周年UI') && lib.config['extension_十周年UI_enable']) player.popup('破防');
			else player.popup('<span style=\"color: #00FFFF;\">破防</span>');
			player.addSkill('yk_elementReactPoFang');
			//内置CD
			player.ykreact_chaodao=1;
		}
		else if((!player.ykreact_ranshao)&&player.yk_wood&&player.yk_fire){
			player.yk_removeElement('yk_wood');
			player.yk_addElement('yk_light');
			if(lib.config.extensions && lib.config.extensions.contains('十周年UI') && lib.config['extension_十周年UI_enable']) player.popup('燃烧');
			else player.popup('<span style=\"color: #FF0000;\">燃烧</span>');
			lib.skill.yk_elementReactRanShao={
				trigger:{
					player:["useCardBefore","phaseAfter"],
				},
				filter:function(event,player){
					if(event.name=='useCard') return Math.random()<player.countCard('h')-player.getHandcardLimit();
					else return true;
				},
				forced:true,
				content:function(){
					if(trigger.name=='useCard'){
						player.damage(1,'fire','nosource');
						if(lib.config.extensions && lib.config.extensions.contains('十周年UI') && lib.config['extension_十周年UI_enable']) player.popup('燃烧');
						else player.popup('<span style=\"color: #FF0000;\">燃烧</span>');
					}
					player.removeSkill('yk_elementReactRanShao');
				},
			}
			lib.translate['yk_elementReactRanShao']='燃烧';
			lib.translate['yk_elementReactRanShao_info']='你使用卡牌时，有一定几率受到一点火属性伤害并移除此状态，手牌数相对上限越多，此概率越大；或回合结束后自动移除';
			//内置CD
			player.ykreact_ranshao=1;
		}
		else if((!player.ykreact_shengzhang)&&player.yk_wood&&player.yk_light){
			player.yk_removeElement('yk_light');
			if(lib.config.extensions && lib.config.extensions.contains('十周年UI') && lib.config['extension_十周年UI_enable']) player.popup('生长');
			else player.popup('<span style=\"color: #00FF00;\">生长</span>');
			player.recover();
			player.draw();
			//内置CD
			player.ykreact_shengzhang=1;
		}
		else if((!player.ykreact_shengji)&&player.yk_wood&&player.yk_water){
			player.yk_removeElement('yk_water');
			if(lib.config.extensions && lib.config.extensions.contains('十周年UI') && lib.config['extension_十周年UI_enable']) player.popup('生机');
			else player.popup('<span style=\"color: #00FF00;\">生机</span>');
			player.draw(2);
			//内置CD
			player.ykreact_shengji=2;
		}
		else if((!player.ykreact_kuwei)&&player.yk_wood&&player.yk_dark){
			player.yk_removeElement('yk_dark');
			if(lib.config.extensions && lib.config.extensions.contains('十周年UI') && lib.config['extension_十周年UI_enable']) player.popup('枯萎');
			else player.popup('<span style=\"color: #00FF00;\">枯萎</span>');
			player.loseHp();
			if(player.countCards('h')>0&&Math.random()<0.5) player.discard(player.getCards('h').randomGet());
			//内置CD
			player.ykreact_kuwei=1;
		}
		else if((!player.ykreact_yanmie)&&player.yk_dark&&(player.yk_light||player.yk_fire||player.yk_thunder)){
			player.yk_removeElement(['yk_dark','yk_light','yk_fire','yk_thunder']);
			if(lib.config.extensions && lib.config.extensions.contains('十周年UI') && lib.config['extension_十周年UI_enable']) player.popup('湮灭');
			else player.popup('<span style=\"color: #A9A9A9;\">湮灭</span>');
			//内置CD
			player.ykreact_yanmie=1;
		}
		else if((!player.ykreact_ningjie)&&player.yk_dark&&player.yk_water){
			player.yk_removeElement(['yk_dark','yk_water']);
			player.yk_addElement('yk_ice');
			if(lib.config.extensions && lib.config.extensions.contains('十周年UI') && lib.config['extension_十周年UI_enable']) player.popup('凝结');
			else player.popup('<span style=\"color: #0000FF;\">凝结</span>');
			//内置CD
			player.ykreact_ningjie=1;
		}
		player.update();
		player.updateMark();
		player.updateMarks();
	}
	lib.skill._ykClearElement={
		trigger:{
			player:'phaseBefore',
		},
		silent:true,
		forced:true,
		content:function(){
			if(game.roundNumber>0&&game.roundNumber%4==0){
				var plElement=[];
				for(var element of lib.yk_element) if(player[element]){
					plElement.push(element);
				}
				player.yk_removeElement(plElement);
				player.update();
			}
		},
	}
	lib.skill._ykClearElementAct={
		trigger:{
			global:'roundStart',
		},
		silent:true,
		forced:true,
		content:function(){
			var reactList=['shihua','liejie','cuihua','ronghua','zhengfa','dongjie','kuosan','chaozai','chaodao','ranshao','shengzhang','shengji','kuwei','yanmie','ningjie'];
			for(var item of reactList){
				if(player['ykreact_'+item]!=undefined){
					if(player['ykreact_'+item]<0||typeof player['ykreact_'+item]!='number') player['ykreact_'+item]=0;
					else if(player['ykreact_'+item]>0) player['ykreact_'+item]--;
				}
			}
		},
	}
	lib.skill._ykShowElement={
		trigger:{
			global:"gameStart",
		},
		forced:true,
		silent:true,
		popup:false,
		content:function(){
			player.yk_addshowElementButton=function(){
				if(!player.node.ykShowElement){
					player.node.ykShowElement=ui.create.dialog('hidden');
					player.node.ykShowElement.style.cssText ="left:calc( 0% - 40px );height:40px;width:40px;top:calc( 100% - 40px );box-shadow:none;";
					player.node.ykShowElement.style.opacity=0.85;
					player.node.ykShowElement.style.backgroundColor='brown';
					player.node.ykShowElement.style.borderRadius='8px';
					player.node.ykShowElement.style['z-index']=4999;
					player.node.ykShowElement.innerHTML='附着<br>元素';
					player.node.ykShowElement.player=player;
					player.node.ykShowElement.onclick=function(){
						var player=this.player;
						var dialog=ui.create.dialog('hidden');
						dialog.addText('<span style="font-size:20px;font-weight:400;font-family:shousha"><b>附着的元素</b></span>');
						var str='';
						for(var ele of lib.yk_element){
							if(player[ele]) str+='<img style=width:40px src="'+lib.assetURL+'extension/云空/'+(ele=='yk_soil'?'yk_stone':ele)+'.jpg" >';
						}
						if(str.length) dialog.add(str);
						else dialog.addText('无');
						dialog.style.cssText ="left:0%;width:100%;height:100%;top:0%;box-shadow:none;opacity:0.8;";
						dialog.style.backgroundColor='black';
						dialog.style['z-index']=9999999;
						dialog.style['overflow-x']='hidden';
						dialog.style['overflow-y']='scroll';
						lib.setScroll(dialog);
						player.appendChild(dialog);
						setTimeout(function(){if(dialog){dialog.delete();dialog=null;}},5000);
					};
					window.yk_clickFK(player.node.ykShowElement);
					player.appendChild(player.node.ykShowElement);
				}
			}
			player.yk_addshowElementButton();
			player.update();
		},
	};
	window.ykElementIntro=function(){
		if(typeof window.ykcloseBgM=='function') window.ykcloseBgM();
		if(window.ykCloseELE&&window.ykCloseELE!=null&&typeof window.ykCloseELE=='function'){window.ykCloseELE();return ;}
		var dialogele={};
		window.backgroundELE=ui.create.div('hidden');
		window.backgroundELE.classList.add('popped');
		window.backgroundELE.classList.add('static');
		window.backgroundELE.style.height='calc(100%)';
		window.backgroundELE.style.width='calc(100%)';
		window.backgroundELE.style.left='0px';
		window.backgroundELE.style.top='0px';
		window.backgroundELE.style.backgroundColor='black';
		window.backgroundELE.style.opacity=0.8;
		window.backgroundELE.style['z-index']=99999;
		window.backgroundELE.style['text-align']='center';
		ui.window.appendChild(window.backgroundELE);
		dialogele.background=window.backgroundELE;
		
		window.backgroundELETitle=ui.create.div('hidden');
		window.backgroundELETitle.style.height='20px';
		window.backgroundELETitle.style.width='100%';
		window.backgroundELETitle.style.left='0px';
		window.backgroundELETitle.style.top='0px';
		window.backgroundELETitle.innerHTML='<span style="font-size:20px;font-weight:400;font-family:shousha"><b>点击元素查看相应反应</b></span><br><br><span style="font-size:15px;font-weight:400;font-family:shousha">每当游戏轮数为4的倍数时，你的回合开始时清除所有附着元素。</span>';
		window.backgroundELETitle.style['z-index']=99999;
		window.backgroundELETitle.style['text-align']='center';
		window.backgroundELE.appendChild(window.backgroundELETitle);
		
		window.backgroundELEContent=ui.create.div('hidden');
		window.backgroundELEContent.style.height='calc( 50% + 60px )';
		window.backgroundELEContent.style.width='100%';
		window.backgroundELEContent.style.left='0px';
		window.backgroundELEContent.style.top='calc( 50% - 60px )';
		window.backgroundELEContent.style['z-index']=99999;
		window.backgroundELEContent.style['text-align']='center';
		window.backgroundELEContent.style['overflow-x']='hidden';
		window.backgroundELEContent.style['overflow-y']='scroll';
		lib.setScroll(window.backgroundELEContent);
		window.backgroundELE.appendChild(window.backgroundELEContent);
		
		for(var ele of lib.yk_element.concat(['yk_soul'])) if(ele!='yk_soil') {
			var diveleBg=ui.create.div('');
			diveleBg.style.height='120px';
			diveleBg.style.width='100px';
			diveleBg.style.left='0%';
			diveleBg.style.top='0%';
			diveleBg.style.position='relative';
			window.backgroundELEContent.appendChild(diveleBg);
			var diveleName=ui.create.div('');
			diveleName.style.height='20px';
			diveleName.style.width='100%';
			diveleName.style.left='0%';
			diveleName.style.bottom='0%';
			diveleName.style['text-align']='center';
			diveleName.innerHTML='<span style="font-size:20px;font-weight:400;font-family:shousha"><b>'+get.translation(ele)+'</b></span>';
			diveleBg.appendChild(diveleName);
			var divele=ui.create.div('','',function(){
				window.yk_getEleInfo(this.name);
			});
			divele.style.height='100px';
			divele.style.width='100px';
			divele.style.left='0%';
			divele.style.top='0%';
			divele.name=ele;
			divele.setBackgroundImage('extension/云空/'+ele+'.jpg');
			divele.style.backgroundSize='cover';
			diveleBg.appendChild(divele);
			window.yk_clickFK(divele);
		}
		
		var funcele=function(){
			for(var i in dialogele){
				dialogele[i].delete();
				delete dialogele[i];
			};
			window.ykCloseELE=null;
		};
		window.ykCloseELE=funcele;
		var div=ui.create.div('.menubutton.round','×',function(){
			funcele();
		});
		div.style.top='5px';
		div.style.left='calc(100% - 55px)';
		div.style['zIndex']=1000;
		window.backgroundELE.appendChild(div);
	}
	window.yk_getEleInfo=function(ele){
		if(window.backgroundELEInfo&&typeof window.ykCloseELEInfo=='function') window.ykCloseELEInfo();
		var dialogeleInfo={};
		window.backgroundELEInfo=ui.create.div('hidden');
		window.backgroundELEInfo.classList.add('popped');
		window.backgroundELEInfo.classList.add('static');
		window.backgroundELEInfo.style.height='calc(100%)';
		window.backgroundELEInfo.style.width='calc(100%)';
		window.backgroundELEInfo.style.left='0px';
		window.backgroundELEInfo.style.top='0px';
		window.backgroundELEInfo.style.backgroundColor='black';
		window.backgroundELEInfo.style.opacity=0.8;
		window.backgroundELEInfo.style['z-index']=99999;
		window.backgroundELEInfo.style['text-align']='center';
		window.backgroundELEInfo.style['overflow-x']='hidden';
		window.backgroundELEInfo.style['overflow-y']='scroll';
		lib.setScroll(window.backgroundELEInfo);
		ui.window.appendChild(window.backgroundELEInfo);
		dialogeleInfo.background=window.backgroundELEInfo;
		
		var str='';
		var act=function(list1,list2,result,resultEle,resultEleType){
			var element={};
			element.fire='<img style=width:40px src="'+lib.assetURL+'extension/云空/yk_fire.jpg" >';
			element.water='<img style=width:40px src="'+lib.assetURL+'extension/云空/yk_water.jpg" >';
			element.wood='<img style=width:40px src="'+lib.assetURL+'extension/云空/yk_wood.jpg" >';
			element.wind='<img style=width:40px src="'+lib.assetURL+'extension/云空/yk_wind.jpg" >';
			element.thunder='<img style=width:40px src="'+lib.assetURL+'extension/云空/yk_thunder.jpg" >';
			element.ice='<img style=width:40px src="'+lib.assetURL+'extension/云空/yk_ice.jpg" >';
			element.stone='<img style=width:40px src="'+lib.assetURL+'extension/云空/yk_stone.jpg" >(岩)';
			element.soil='<img style=width:40px src="'+lib.assetURL+'extension/云空/yk_stone.jpg" >(地)';
			element.light='<img style=width:40px src="'+lib.assetURL+'extension/云空/yk_light.jpg" >';
			element.dark='<img style=width:40px src="'+lib.assetURL+'extension/云空/yk_dark.jpg" >';
			var strx='';
			if(Array.isArray(list1)){
				for(var ele of list1){
					strx+=element[ele]+' / ';
				}
				strx=strx.slice(0,strx.length-3);
			}
			else if(typeof list1=='string'){
				strx+=element[list1];
			}
			strx+=' + ';
			if(Array.isArray(list2)){
				for(var ele of list2){
					strx+=element[ele]+' / ';
				}
				strx=strx.slice(0,strx.length-3);
			}
			else if(typeof list2=='string'){
				strx+=element[list2];
			}
			var strR='';
			if(!resultEleType) resultEleType='';
			if(Array.isArray(resultEle)){
				for(var ele of resultEle){
					strR+=element[ele]+(resultEleType.indexOf('/')==-1?' + ':' / ');
				}
				strR=strR.slice(0,strR.length-3);
				strR+=' + ';
			}
			else if(typeof resultEle=='string'){
				strR+=element[resultEle]+(resultEleType.indexOf('/')==-1?' + ':' / ');
				strR=strR.slice(0,strR.length-3);
				strR+=' + ';
			}
			if(result) strx+='  ==>  '+strR+result;
			return strx;
		}
		if(ele=='yk_fire'){
			str+='<img style=width:80px src="'+lib.assetURL+'extension/云空/yk_fire.jpg" ><br>火<br>'+act(['fire','ice'],'soil','<span style=\"color: #FFEC8B;\">石化</span>','stone');
			str+='<br><span style=\"color: #FFEC8B;\">石化</span>：<span style=\"color: #FFEC8B;\">该角色获得随机2至5点护甲。</span>冷却：2轮';
			str+='<br><br>'+act(['fire','light'],'ice','<span style=\"color: #0000FF;\">融化</span>','water');
			str+='<br><span style=\"color: #0000FF;\">融化</span>：<span style=\"color: #0000FF;\">清除翻面效果。</span>冷却：1轮';
			str+='<br><br>'+act('fire','water','<span style=\"color: #0000FF;\">蒸发</span>');
			str+='<br><span style=\"color: #0000FF;\">蒸发</span>：<span style=\"color: #0000FF;\">直到任意角色回合结束前，下一次受到的云空雷属性伤害随机+1或+2。</span>冷却：1轮';
			str+='<br><br>'+act('wind',['soil','water','fire','light','dark','ice','stone','thunder','wood'],'<span style=\"color: #00FF00;\">扩散</span>',['soil','water','fire','light','dark','ice','stone','thunder','wood'],'/');
			str+='<br><span style=\"color: #00FF00;\">扩散</span>：<span style=\"color: #00FF00;\">为处于目标攻击范围内的其他角色附加相应元素。</span>冷却：1轮';
			str+='<br><br>'+act('fire','thunder','<span style=\"color: #FF0000;\">超载</span>','light');
			str+='<br><span style=\"color: #FF0000;\">超载</span>：<span style=\"color: #FF0000;\">附加【失明】效果：使用卡牌时，有一定几率将此牌的目标重置并移除此状态；或回合结束后自动移除。</span>冷却：2轮';
			str+='<br><br>'+act('fire','wood','<span style=\"color: #FF0000;\">燃烧</span>','light');
			str+='<br><span style=\"color: #FF0000;\">燃烧</span>：<span style=\"color: #FF0000;\">使用卡牌时，有一定几率受到一点火属性伤害并移除此状态，手牌数相对上限越多，此概率越大；或回合结束后自动移除。</span>冷却：1轮';
			str+='<br><br>'+act('dark',['fire','thunder','light'],'<span style=\"color: #A9A9A9;\">湮灭</span>');
			str+='<br><span style=\"color: #A9A9A9;\">湮灭</span>：<span style=\"color: #A9A9A9;\">消除相应附着元素。</span>冷却：1轮';
		}
		else if(ele=='yk_water'){
			str+='<img style=width:80px src="'+lib.assetURL+'extension/云空/yk_water.jpg" ><br>水<br>'+act('stone',['water','thunder','wood'],'<span style=\"color: #FFEC8B;\">裂解</span>','soil');
			str+='<br><span style=\"color: #FFEC8B;\">裂解</span>：<span style=\"color: #FFEC8B;\">该角色失去所有护甲。</span>冷却：2轮';
			str+='<br><br>'+act('fire','water','<span style=\"color: #0000FF;\">蒸发</span>');
			str+='<br><span style=\"color: #0000FF;\">蒸发</span>：<span style=\"color: #0000FF;\">直到任意角色回合结束前，下一次受到的云空雷属性伤害随机+1或+2。</span>冷却：1轮';
			str+='<br><br>'+act('water','ice','<span style=\"color: #00FFFF;\">冻结</span>','ice');
			str+='<br><span style=\"color: #00FFFF;\">冻结</span>：<span style=\"color: #00FFFF;\">被冻结的角色将武将牌翻面并获得一点护甲，同时翻面期间不能使用和打出牌，此期间受到伤害时【碎冰】：额外受到一点伤害并将武将牌翻回。武将牌翻回时自动退出此状态，退出时移除一点护甲。</span>冷却：2轮';
			str+='<br><br>'+act('wind',['soil','water','fire','light','dark','ice','stone','thunder','wood'],'<span style=\"color: #00FF00;\">扩散</span>',['soil','water','fire','light','dark','ice','stone','thunder','wood'],'/');
			str+='<br><span style=\"color: #00FF00;\">扩散</span>：<span style=\"color: #00FF00;\">为处于目标攻击范围内的其他角色附加相应元素。</span>冷却：1轮';
			str+='<br><br>'+act('water','thunder','<span style=\"color: #FF00FF;\">感电</span>','thunder');
			str+='<br><span style=\"color: #FF00FF;\">感电</span>：<span style=\"color: #FF00FF;\">对距离为1以内的其他角色造成雷元素伤害并附加雷元素，同时对触发感电的目标附加【麻痹】效果：无法使用任何卡牌直到任意角色回合结束。</span>冷却：1~2轮';
			str+='<br><br>'+act('water','wood','<span style=\"color: #00FF00;\">生机</span>','wood');
			str+='<br><span style=\"color: #00FF00;\">生机</span>：<span style=\"color: #00FF00;\">该角色摸两张牌。</span>冷却：2轮';
			str+='<br><br>'+act('dark','water','<span style=\"color: #0000FF;\">凝结</span>','ice');
			str+='<br><span style=\"color: #0000FF;\">凝结</span>：<span style=\"color: #0000FF;\">生成冰元素。</span>冷却：1轮';
			
		}
		else if(ele=='yk_wood'){
			str+='<img style=width:80px src="'+lib.assetURL+'extension/云空/yk_wood.jpg" ><br>草<br>'+act('thunder','wood','<span style=\"color: #FF00FF;\">脆化</span>');
			str+='<br><span style=\"color: #FF00FF;\">脆化</span>：<span style=\"color: #FF00FF;\">直到任意角色回合结束前，下一次受到的伤害+1。</span>冷却：2轮';
			str+='<br><br>'+act('stone',['water','thunder','wood'],'<span style=\"color: #FFEC8B;\">裂解</span>','soil');
			str+='<br><span style=\"color: #FFEC8B;\">裂解</span>：<span style=\"color: #FFEC8B;\">该角色失去所有护甲。</span>冷却：2轮';
			str+='<br><br>'+act('wind',['soil','water','fire','light','dark','ice','stone','thunder','wood'],'<span style=\"color: #00FF00;\">扩散</span>',['soil','water','fire','light','dark','ice','stone','thunder','wood'],'/');
			str+='<br><span style=\"color: #00FF00;\">扩散</span>：<span style=\"color: #00FF00;\">为处于目标攻击范围内的其他角色附加相应元素。</span>冷却：1轮';
			str+='<br><br>'+act('fire','wood','<span style=\"color: #FF0000;\">燃烧</span>','light');
			str+='<br><span style=\"color: #FF0000;\">燃烧</span>：<span style=\"color: #FF0000;\">使用卡牌时，有一定几率受到一点火属性伤害并移除此状态，手牌数相对上限越多，此概率越大；或回合结束后自动移除。</span>冷却：1轮';
			str+='<br><br>'+act('light','wood','<span style=\"color: #00FF00;\">生长</span>','wood');
			str+='<br><span style=\"color: #00FF00;\">生长</span>：<span style=\"color: #00FF00;\">该角色回复一点体力并摸一张牌。</span>冷却：1轮';
			str+='<br><br>'+act('water','wood','<span style=\"color: #00FF00;\">生机</span>','wood');
			str+='<br><span style=\"color: #00FF00;\">生机</span>：<span style=\"color: #00FF00;\">该角色摸两张牌。</span>冷却：2轮';
			str+='<br><br>'+act('dark','wood','<span style=\"color: #00FF00;\">枯萎</span>');
			str+='<br><span style=\"color: #00FF00;\">枯萎</span>：<span style=\"color: #00FF00;\">该角色流失一点体力并有50%概率弃一张牌。</span>冷却：1轮';
			
		}
		else if(ele=='yk_wind'){
			str+='<img style=width:80px src="'+lib.assetURL+'extension/云空/yk_wind.jpg" ><br>风<br>'+act('wind',['soil','water','fire','light','dark','ice','stone','thunder','wood'],'<span style=\"color: #00FF00;\">扩散</span>',['soil','water','fire','light','dark','ice','stone','thunder','wood'],'/');
			str+='<br><span style=\"color: #00FF00;\">扩散</span>：<span style=\"color: #00FF00;\">为处于目标攻击范围内的其他角色附加相应元素。</span>冷却：1轮';
		}
		else if(ele=='yk_thunder'){
			str+='<img style=width:80px src="'+lib.assetURL+'extension/云空/yk_thunder.jpg" ><br>雷<br>'+act('stone',['water','thunder','wood'],'<span style=\"color: #FFEC8B;\">裂解</span>','soil');
			str+='<br><span style=\"color: #FFEC8B;\">裂解</span>：<span style=\"color: #FFEC8B;\">该角色失去所有护甲。</span>冷却：2轮';
			str+='<br><br>'+act('thunder','wood','<span style=\"color: #FF00FF;\">脆化</span>');
			str+='<br><span style=\"color: #FF00FF;\">脆化</span>：<span style=\"color: #FF00FF;\">直到任意角色回合结束前，下一次受到的伤害+1。</span>冷却：2轮';
			str+='<br><br>'+act('wind',['soil','water','fire','light','dark','ice','stone','thunder','wood'],'<span style=\"color: #00FF00;\">扩散</span>',['soil','water','fire','light','dark','ice','stone','thunder','wood'],'/');
			str+='<br><span style=\"color: #00FF00;\">扩散</span>：<span style=\"color: #00FF00;\">为处于目标攻击范围内的其他角色附加相应元素。</span>冷却：1轮';
			str+='<br><br>'+act('fire','thunder','<span style=\"color: #FF0000;\">超载</span>','light');
			str+='<br><span style=\"color: #FF0000;\">超载</span>：<span style=\"color: #FF0000;\">附加【失明】效果：使用卡牌时，有一定几率将此牌的目标重置并移除此状态；或回合结束后自动移除。</span>冷却：2轮';
			str+='<br><br>'+act('water','thunder','<span style=\"color: #FF00FF;\">感电</span>','thunder');
			str+='<br><span style=\"color: #FF00FF;\">感电</span>：<span style=\"color: #FF00FF;\">对距离为1以内的其他角色造成雷元素伤害并附加雷元素，同时对触发感电的目标附加【麻痹】效果：无法使用任何卡牌直到任意角色回合结束。</span>冷却：1~2轮';
			str+='<br><br>'+act('ice','thunder','<span style=\"color: #00FFFF;\">超导</span>','ice');
			str+='<br><span style=\"color: #00FFFF;\">超导</span>：<span style=\"color: #00FFFF;\">附加【破防】效果：直到任意角色回合结束前，下一次受到的云空雷属性伤害+1。</span>冷却：1轮';
			str+='<br><br>'+act('dark',['fire','thunder','light'],'<span style=\"color: #A9A9A9;\">湮灭</span>');
			str+='<br><span style=\"color: #A9A9A9;\">湮灭</span>：<span style=\"color: #A9A9A9;\">消除相应附着元素。</span>冷却：1轮';
			
		}
		else if(ele=='yk_ice'){
			str+='<img style=width:80px src="'+lib.assetURL+'extension/云空/yk_ice.jpg" ><br>冰<br>'+act(['fire','ice'],'soil','<span style=\"color: #FFEC8B;\">石化</span>','stone');
			str+='<br><span style=\"color: #FFEC8B;\">石化</span>：<span style=\"color: #FFEC8B;\">该角色获得随机2至5点护甲。</span>冷却：2轮';
			str+='<br><br>'+act(['fire','light'],'ice','<span style=\"color: #0000FF;\">融化</span>','water');
			str+='<br><span style=\"color: #0000FF;\">融化</span>：<span style=\"color: #0000FF;\">清除翻面效果。</span>冷却：1轮';
			str+='<br><br>'+act('water','ice','<span style=\"color: #00FFFF;\">冻结</span>','ice');
			str+='<br><span style=\"color: #00FFFF;\">冻结</span>：<span style=\"color: #00FFFF;\">被冻结的角色将武将牌翻面并获得一点护甲，同时翻面期间不能使用和打出牌，此期间受到伤害时【碎冰】：额外受到一点伤害并将武将牌翻回。武将牌翻回时自动退出此状态，退出时移除一点护甲。</span>冷却：2轮';
			str+='<br><br>'+act('wind',['soil','water','fire','light','dark','ice','stone','thunder','wood'],'<span style=\"color: #00FF00;\">扩散</span>',['soil','water','fire','light','dark','ice','stone','thunder','wood'],'/');
			str+='<br><span style=\"color: #00FF00;\">扩散</span>：<span style=\"color: #00FF00;\">为处于目标攻击范围内的其他角色附加相应元素。</span>冷却：1轮';
			str+='<br><br>'+act('ice','thunder','<span style=\"color: #00FFFF;\">超导</span>','ice');
			str+='<br><span style=\"color: #00FFFF;\">超导</span>：<span style=\"color: #00FFFF;\">附加【破防】效果：直到任意角色回合结束前，下一次受到的云空雷属性伤害+1。</span>冷却：1轮';
			
		}
		else if(ele=='yk_stone'){
			str+='<img style=width:80px src="'+lib.assetURL+'extension/云空/yk_stone.jpg" ><br>岩（地）<br>'+act(['fire','ice'],'soil','<span style=\"color: #FFEC8B;\">石化</span>','stone');
			str+='<br><span style=\"color: #FFEC8B;\">石化</span>：<span style=\"color: #FFEC8B;\">该角色获得随机2至5点护甲。</span>冷却：2轮';
			str+='<br><br>'+act('stone',['water','thunder','wood'],'<span style=\"color: #FFEC8B;\">裂解</span>','soil');
			str+='<br><span style=\"color: #FFEC8B;\">裂解</span>：<span style=\"color: #FFEC8B;\">该角色失去所有护甲。</span>冷却：2轮';
			str+='<br><br>'+act('wind',['soil','water','fire','light','dark','ice','stone','thunder','wood'],'<span style=\"color: #00FF00;\">扩散</span>',['soil','water','fire','light','dark','ice','stone','thunder','wood'],'/');
			str+='<br><span style=\"color: #00FF00;\">扩散</span>：<span style=\"color: #00FF00;\">为处于目标攻击范围内的其他角色附加相应元素。</span>冷却：1轮';
		}
		else if(ele=='yk_light'){
			str+='<img style=width:80px src="'+lib.assetURL+'extension/云空/yk_light.jpg" ><br>光<br>'+act('wind',['soil','water','fire','light','dark','ice','stone','thunder','wood'],'<span style=\"color: #00FF00;\">扩散</span>',['soil','water','fire','light','dark','ice','stone','thunder','wood'],'/');
			str+='<br><span style=\"color: #00FF00;\">扩散</span>：<span style=\"color: #00FF00;\">为处于目标攻击范围内的其他角色附加相应元素。</span>冷却：1轮';
			str+='<br><br>'+act(['fire','light'],'ice','<span style=\"color: #0000FF;\">融化</span>','water');
			str+='<br><span style=\"color: #0000FF;\">融化</span>：<span style=\"color: #0000FF;\">清除翻面效果。</span>冷却：1轮';
			str+='<br><br>'+act('light','wood','<span style=\"color: #00FF00;\">生长</span>','wood');
			str+='<br><span style=\"color: #00FF00;\">生长</span>：<span style=\"color: #00FF00;\">该角色回复一点体力并摸一张牌。</span>冷却：1轮';
			str+='<br><br>'+act('dark',['fire','thunder','light'],'<span style=\"color: #A9A9A9;\">湮灭</span>');
			str+='<br><span style=\"color: #A9A9A9;\">湮灭</span>：<span style=\"color: #A9A9A9;\">消除相应附着元素。</span>冷却：1轮';
			
		}
		else if(ele=='yk_dark'){
			str+='<img style=width:80px src="'+lib.assetURL+'extension/云空/yk_dark.jpg" ><br>暗<br>'+act('wind',['soil','water','fire','light','dark','ice','stone','thunder','wood'],'<span style=\"color: #00FF00;\">扩散</span>',['soil','water','fire','light','dark','ice','stone','thunder','wood'],'/');
			str+='<br><span style=\"color: #00FF00;\">扩散</span>：<span style=\"color: #00FF00;\">为处于目标攻击范围内的其他角色附加相应元素。</span>冷却：1轮';
			str+='<br><br>'+act('dark','wood','<span style=\"color: #00FF00;\">枯萎</span>');
			str+='<br><span style=\"color: #00FF00;\">枯萎</span>：<span style=\"color: #00FF00;\">该角色流失一点体力并有50%概率弃一张牌。</span>冷却：1轮';
			str+='<br><br>'+act('dark',['fire','thunder','light'],'<span style=\"color: #A9A9A9;\">湮灭</span>');
			str+='<br><span style=\"color: #A9A9A9;\">湮灭</span>：<span style=\"color: #A9A9A9;\">消除相应附着元素。</span>冷却：1轮';
			str+='<br><br>'+act('dark','water','<span style=\"color: #0000FF;\">凝结</span>','ice');
			str+='<br><span style=\"color: #0000FF;\">凝结</span>：<span style=\"color: #0000FF;\">生成冰元素。</span>冷却：1轮';
			
		}
		else if(ele=='yk_soul'){
			str+='<img style=width:80px src="'+lib.assetURL+'extension/云空/yk_soul.jpg" ><br>元<br><br><br><span style=\"color: #FF00FF;\">特殊的元素，不与其他元素发生反应</span>';
		}
		window.backgroundELEInfo.innerHTML='<span style="font-size:20px;font-weight:400;font-family:shousha"><b>'+str+'</b></span>';
		
		var funceleInfo=function(){
			for(var i in dialogeleInfo){
				dialogeleInfo[i].delete();
				delete dialogeleInfo[i];
			};
			window.ykCloseELEInfo=null;
			window.backgroundELEInfo=undefined;
		};
		window.ykCloseELEInfo=funceleInfo;
		var div=ui.create.div('.menubutton.round','×',function(){
			funceleInfo();
		});
		div.style.top='5px';
		div.style.left='calc(100% - 55px)';
		div.style['zIndex']=1000;
		window.backgroundELEInfo.appendChild(div);
	}
});
