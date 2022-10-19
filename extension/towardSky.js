'use strict';
window.YKimport(function(lib,game,ui,get,ai,_status){
	window.changeNumToHan=function(num){
		var arr1 = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
		var arr2 = ['', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千', '万', '十', '百', '千', '亿']
		if (!num || isNaN(num)) return '零'
		var english = num.toString().split('')
		var result = ''
		for (var i = 0; i < english.length; i++) {
			var des_i = english.length - 1 - i// 倒序排列设值
			result = arr2[i] + result
			var arr1_index = english[des_i]
			result = arr1[arr1_index] + result
		}
		result = result.replace(/零(千|百|十)/g, '零').replace(/十零/g, '十') // 将【零千、零百】换成【零】 【十零】换成【十】
		result = result.replace(/零+/g, '零') // 合并中间多个零为一个零
		result = result.replace(/零亿/g, '亿').replace(/零万/g, '万') // 将【零亿】换成【亿】【零万】换成【万】
		result = result.replace(/亿万/g, '亿') // 将【亿万】换成【亿】
		result = result.replace(/零+$/, '') // 移除末尾的零
		// 将【一十】换成【十】
		result = result.replace(/^一十/g, '十')
		return result;
	}
	window.ykTS_itemx={
		'sky_crying0':{
			name:'虚空之泪',
			info:'【虚空之泪】x200<br>类型：抽卡道具',
			only_once:true,
			price:4000,
			mode:'yk',
			content:(boss,player)=>{
				_status.ykTS_gainList.sky_crying=200;
			},
		},
		'sky_crying1':{
			name:'虚空之泪',
			info:'【虚空之泪】x500<br>类型：抽卡道具',
			only_once:true,
			price:10000,
			mode:'yk',
			content:(boss,player)=>{
				_status.ykTS_gainList.sky_crying=500;
			},
		},
		'sky_crying2':{
			name:'虚空之泪',
			info:'【虚空之泪】x750<br>类型：抽卡道具',
			only_once:true,
			price:15000,
			mode:'yk',
			content:(boss,player)=>{
				_status.ykTS_gainList.sky_crying=750;
			},
		},
		'sky_crying3':{
			name:'虚空之泪',
			info:'【虚空之泪】x1000<br>类型：抽卡道具',
			only_once:true,
			price:20000,
			mode:'yk',
			content:(boss,player)=>{
				_status.ykTS_gainList.sky_crying=1000;
			},
		},
		'yksha0':{
			name:'杀',
			info:'卡牌【杀】x2<br>类型：基本牌',
			price:20,
			content:(boss,player)=>{
				var cardList=[];
				cardList.push(game.createCard('sha'));
				cardList.push(game.createCard('sha'));
				game.me.gain(cardList);
				game.log(game.me,'获得了',cardList);
			},
		},
		'yktao0':{
			name:'桃',
			info:'卡牌【桃】x1<br>类型：基本牌',
			price:25,
			content:(boss,player)=>{
				var cardList=[];
				cardList.push(game.createCard('tao'));
				game.me.gain(cardList);
				game.log(game.me,'获得了',cardList);
			},
		},
		'ykshan0':{
			name:'闪',
			info:'卡牌【闪】x2<br>类型：基本牌',
			price:20,
			content:(boss,player)=>{
				var cardList=[];
				cardList.push(game.createCard('shan'));
				cardList.push(game.createCard('shan'));
				game.me.gain(cardList);
				game.log(game.me,'获得了',cardList);
			},
		},
		'ykjiu0':{
			name:'酒',
			info:'卡牌【酒】x1<br>类型：基本牌',
			price:15,
			content:(boss,player)=>{
				var cardList=[];
				cardList.push(game.createCard('jiu'));
				game.me.gain(cardList);
				game.log(game.me,'获得了',cardList);
			},
		},
		'ykdraw0':{
			name:'神手',
			info:'效果：每个摸牌阶段的摸牌数+1<br>类型：技能（短效buff）',
			price:250,
			content:(boss,player)=>{
				lib.skill.ykshenshou_draw=lib.skill.yingzi;
				delete lib.skill.ykshenshou_draw.audio;
				delete lib.skill.ykshenshou_draw.audioname;
				lib.translate.ykshenshou_draw=lib.translate.yingzi;
				lib.translate.ykshenshou_draw_info=lib.translate.yingzi_info;
				player.ykTS_addTempSkill('ykshenshou_draw',5);
			},
		},
		'ykcardLimit0':{
			name:'布衣',
			info:'效果：手牌上限+1<br>类型：技能（短效buff）',
			price:100,
			content:(boss,player)=>{
				lib.skill.ykbuyi_cardLimit={
					mod:{
						maxHandcard:function(player,num){
							return num+1;
						},
					},
				};
				lib.translate.ykbuyi_cardLimit='布衣';
				lib.translate.ykbuyi_cardLimit_info='锁定技，你的手牌上限+1';
				player.ykTS_addTempSkill('ykbuyi_cardLimit',5);
			},
		},
		'ykkongzhen0':{
			name:'空真',
			info:'卡牌【空真】x1<br>卡牌效果：立即清空目标真气值（最大不超过1500）<br>类型：基本牌',
			price:250,
			mode:'yk',
			content:(boss,player)=>{
				lib.card['ykkongzhen']={
					type:"basic",
					image:'',
					enable:function(card,player){
						return true;
					},
					usable:Infinity,
					updateUsable:"phaseUse",
					vanish:true,
					suitList:['spade', 'heart', 'club', 'diamond'].randomGet(),
					numberList:get.rand(1,13),
					distance:{},
					filterTarget:true,
					selectTarget:1,
					epic:true,
					reverseOrder:true,
					content:function(){
						target.ykConsume('Defend',1500,true);
					},
					toself:true,
					onEquip:[],
					onLose:[],
					ai:lib.card['sha'].ai,
				};
				if(lib.device||lib.node) lib.card['ykkongzhen'].image='ext:斗破苍穹X阴阳师/yunkong/kongzhen.jpg';
				else lib.card['ykkongzhen'].image='db:extension-斗破苍穹X阴阳师-yunkong:kongzhen.jpg';
				lib.translate['ykkongzhen']='“空真”';
				lib.translate['ykkongzhen_info']='立即清空目标真气值（最大不超过1500）。';
				var cardList=[];
				cardList.push(game.createCard('ykkongzhen'));
				game.me.gain(cardList);
				game.log(game.me,'获得了',cardList);
			},
		},
		'ykzhanshu0':{
			name:'湛术',
			info:'卡牌【湛术】x1<br>卡牌效果：立即回复目标术法值至上限（最大不超过1000）<br>类型：基本牌',
			price:200,
			mode:'yk',
			content:(boss,player)=>{
				lib.card['ykzhanshu']={
					type:"basic",
					image:'',
					enable:function(card,player){
						return true;
					},
					usable:Infinity,
					updateUsable:"phaseUse",
					vanish:true,
					suitList:['spade', 'heart', 'club', 'diamond'].randomGet(),
					numberList:get.rand(1,13),
					distance:{},
					filterTarget:true,
					selectTarget:1,
					epic:true,
					reverseOrder:true,
					content:function(){
						target.ykRecover('Mp',1000,true);
					},
					toself:true,
					onEquip:[],
					onLose:[],
					ai:lib.card['tao'].ai,
				};
				if(lib.device||lib.node) lib.card['ykzhanshu'].image='ext:斗破苍穹X阴阳师/yunkong/zhanshu.jpg';
				else lib.card['ykzhanshu'].image='db:extension-斗破苍穹X阴阳师-yunkong:zhanshu.jpg';
				lib.translate['ykzhanshu']='“湛术”';
				lib.translate['ykzhanshu_info']='立即回复目标术法值至上限（最大不超过1000）。';
				var cardList=[];
				cardList.push(game.createCard('ykzhanshu'));
				game.me.gain(cardList);
				game.log(game.me,'获得了',cardList);
			},
		},
		'ykshenli0':{
			name:'神力',
			info:'卡牌【神力】x1<br>卡牌效果：立即回复目标气力值至上限（最大不超过500）<br>类型：基本牌',
			price:200,
			mode:'yk',
			content:(boss,player)=>{
				lib.card['ykshenli']={
					type:"basic",
					image:'',
					enable:function(card,player){
						return true;
					},
					usable:Infinity,
					updateUsable:"phaseUse",
					vanish:true,
					suitList:['spade', 'heart', 'club', 'diamond'].randomGet(),
					numberList:get.rand(1,13),
					distance:{},
					filterTarget:true,
					selectTarget:1,
					epic:true,
					reverseOrder:true,
					content:function(){
						target.ykRecover('Strength',500,true);
					},
					toself:true,
					onEquip:[],
					onLose:[],
					ai:lib.card['tao'].ai,
				};
				if(lib.device||lib.node) lib.card['ykshenli'].image='ext:斗破苍穹X阴阳师/yunkong/shenli.jpg';
				else lib.card['ykshenli'].image='db:extension-斗破苍穹X阴阳师-yunkong:shenli.jpg';
				lib.translate['ykshenli']='“神力”';
				lib.translate['ykshenli_info']='立即回复目标气力值至上限（最大不超过500）。';
				var cardList=[];
				cardList.push(game.createCard('ykshenli'));
				game.me.gain(cardList);
				game.log(game.me,'获得了',cardList);
			},
		},
		'ykguqi0':{
			name:'固气',
			info:'卡牌【固气】x1<br>卡牌效果：立即回复目标真气值至上限（最大不超过1500）<br>类型：基本牌',
			price:250,
			mode:'yk',
			content:(boss,player)=>{
				lib.card['ykguqi']={
					type:"basic",
					image:'',
					enable:function(card,player){
						return true;
					},
					usable:Infinity,
					updateUsable:"phaseUse",
					vanish:true,
					suitList:['spade', 'heart', 'club', 'diamond'].randomGet(),
					numberList:get.rand(1,13),
					distance:{},
					filterTarget:true,
					selectTarget:1,
					epic:true,
					reverseOrder:true,
					content:function(){
						target.ykRecover('Defend',1500,true);
					},
					toself:true,
					onEquip:[],
					onLose:[],
					ai:lib.card['tao'].ai,
				};
				if(lib.device||lib.node) lib.card['ykguqi'].image='ext:斗破苍穹X阴阳师/yunkong/guqi.jpg';
				else lib.card['ykguqi'].image='db:extension-斗破苍穹X阴阳师-yunkong:guqi.jpg';
				lib.translate['ykguqi']='“固气”';
				lib.translate['ykguqi_info']='立即回复目标真气值至上限（最大不超过1500）。';
				var cardList=[];
				cardList.push(game.createCard('ykshenli'));
				game.me.gain(cardList);
				game.log(game.me,'获得了',cardList);
			},
		},
	};
	game.check_rewards=()=>{
		var date=window.playTime.years+'/'+window.playTime.months+'/'+window.playTime.days;
		if(lib.config.ykTS_record!=undefined&&window.ykisSameWeek(lib.config.ykTS_record,date)){
			if(typeof game.sayyk=='function') game.sayyk('本周奖励次数已耗尽！');
			return ;
		}
		var num=game.me.ykgetStarShellNum()-lib.config.ykStarShell;
		game.me.ykchangeStarShell(num);
		lib.config.ykStarShell=game.me.ykgetStarShellNum();
		game.saveConfig('ykStarShell',lib.config.ykStarShell);
		game.saveConfig('ykTS_record',date);
		lib.config.ykTS_maxNumber=Math.max((lib.config.ykTS_maxNumber||0),_status.ykTS_number);
		game.saveConfig('ykTS_maxNumber',lib.config.ykTS_maxNumber);
		for(var i in _status.ykTS_gainList){
			if(window.ykTS_itemx[item].only_once) game.saveConfig(item+'_buy',window.playTime.years+'/'+window.playTime.months+'/'+window.playTime.days);
			if(lib.yk_otherItemLibrary[i]) game.yk_gainItem(i,_status.ykTS_gainList[i]);
			else if(lib.ykEquip[i]) game.yk_gainEquip(i,0,_status.ykTS_gainList[i]);
			else if(lib.ykBook[i]) game.yk_gainBook(i,0,_status.ykTS_gainList[i]);
			game.sayyk('已获得【'+get.translation(i)+'】x'+_status.ykTS_gainList[i]+'！');
		}
		game.sayyk('相关物品道具已存入背包！');
	}
	_status.ykTS_number=parseInt(''+lib.config.ykTS_startnum);
	_status.ykTS_starShell=(lib.config.ykStarShell||0);
	_status.ykTS_consumeStarShell=0;
	_status.ykTS_gainList={};
	if(!_status.ykTS_number||isNaN(_status.ykTS_number)) _status.ykTS_number=(lib.config.ykTS_number||0);
	window.ykTS_item={};
	var num=0;
	while(num<(lib.config.ykTS_maxNumber||0)){
		window.ykTS_item[''+num]='第'+window.changeNumToHan(num)+'层';
		num+=10;
	}
	window.ykTS_item[''+num]='第'+window.changeNumToHan(num)+'层';
	window.ykSetTowardSky={//_status.ykTS_number
		shop:(boss,player)=>{
			'step 0'
			event.itemList=[];
			for(var item in window.ykTS_itemx){
				if(window.ykTS_itemx[item].mode=='yk'&&!lib.config.only_yk) continue;
				if(window.ykTS_itemx[item].only_once&&_status[item+'_putbool']) continue;
				if(lib.config[item+'_buy']&&window.ykTS_itemx[item].only_once&&window.ykisSameWeek(lib.config[item+'_buy'],window.playTime.years+'/'+window.playTime.months+'/'+window.playTime.days)) continue;
				lib.translate[item]=window.ykTS_itemx[item].name;
				lib.translate[item+'_info']=window.ykTS_itemx[item].info;
				event.itemList.push(item);
			}
			event.itemList=event.itemList.randomSort().randomGets(4);
			event.chooseai=function(){
				for(var item of event.itemList) if(typeof window.ykTS_itemx[item].price=='number'&&player.ykgetStarShellNum()-window.ykTS_itemx[item].price<0){
					event.itemList.remove(item);
				}
				if(player.hp<player.maxHp/2&&event.itemList.indexOf('yktao0')!=-1) return 'yktao0';
				if(player.countCards('h',{name:"sha"})<2&&event.itemList.indexOf('yksha0')!=-1) return 'yksha0';
				if(player.countCards('h',{name:"shan"})<2&&event.itemList.indexOf('ykshan0')!=-1) return 'ykshan0';
				if(!player.countCards('h',{name:"jiu"})&&event.itemList.indexOf('ykjiu0')!=-1&&player.hp==1) return 'ykjiu0';
				return event.itemList.randomGet();
			};
			if(event.isMine()){
				var dialog=ui.create.dialog('forcebutton');
				dialog.add('【商店】：选择要购买的商品<br>当前拥有金币数：'+player.ykgetStarShellNum());
				var clickItem=function(){
					_status.event._result=this.link;
					dialog.close();
					game.resume();
				};
				for(var item of event.itemList){
					if(window.ykTS_itemx[item].mode=='yk'&&!lib.config.only_yk) continue;
					if(window.ykTS_itemx[item].only_once&&_status[item+'_putbool']) continue;
					if(lib.config[item+'_buy']&&window.ykTS_itemx[item].only_once&&window.ykisSameWeek(lib.config[item+'_buy'],window.playTime.years+'/'+window.playTime.months+'/'+window.playTime.days)) continue;
					var shop_item=dialog.add('<div class="popup pointerdiv" style="width:100%;display:inline-block"><div class="skill">'+get.translation(item)+'：'+get.translation(item+'_info')+'<br>价格：'+window.ykTS_itemx[item].price+'金币<br><b>'+(window.ykTS_itemx[item].only_once?'每周限一次':'不限次数')+'</b>'+'</div></div>');
					shop_item.firstChild.addEventListener('click',clickItem);
					shop_item.firstChild.link=item;
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
			'step 1'
			_status.imchoosing=false;
			if(result){
				if(typeof window.ykTS_itemx[result].price=='number'&&player.ykgetStarShellNum()-window.ykTS_itemx[result].price<0){
					alert('金币不足！');
				}
				else{
					if(typeof window.ykTS_itemx[result].content=='function') window.ykTS_itemx[result].content(game.boss,player);
					_status.ykTS_consumeStarShell+=(window.ykTS_itemx[result].price||0);
					if(window.ykTS_itemx[result].only_once) _status[result+'_putbool']=true;
				}
			}
			'step 2'
			for(var item in window.ykTS_itemx){
				lib.card[item]=null;
				delete lib.card[item];
			}
		},
		reward1:(boss,player)=>{
			
		},
		event1:(boss,player)=>{//事件
			
		},
		'0':[],//[(boss,player)=>{},'event0','reward0',10]
	}
	window.funcList={
		'0':[(boss,player)=>{
			
		}],
	};
	window.eventList={
		'0':[],
	};
	for(var num in window.ykSetTowardSky){
		for(var t in window.ykSetTowardSky[num].translate) lib.translate[t]=window.ykSetTowardSky[num].translate[t];
	}
	for(var a in window.funcList){
		if(!window.ykSetTowardSky[a]) window.ykSetTowardSky[a]=[];
		window.ykSetTowardSky[a]=window.ykSetTowardSky[a].concat(window.funcList[a]);
	}
	for(var b in window.eventList){
		if(!window.ykSetTowardSky[b]) window.ykSetTowardSky[b]=[];
		window.ykSetTowardSky[b]=window.ykSetTowardSky[b].concat(window.eventList[b]);
	}
	game.addMode('towardSky',{
		start:function(){
			'step 0'
			if(typeof window.ykCacheSetImage!='function'){
				alert('本体文件加载失败！');
				return ;
			}
			window.ykCacheSetImage('https://raw.fastgit.org/qxqdpcq/ykStoryPictures/main/towardSky/towardSky_bgx.jpg',ui.window,true,"cover");
			lib.element.player.ykTS_addTempSkill=function(skill,type){
				var player=this;
				if((''+type)=='10'){
					if(!player.ykTS_tempSkill1) player.ykTS_tempSkill1=[];
					player.ykTS_tempSkill1.push(skill);
					player.addSkill(skill);
				}
				else{
					if(!player.ykTS_tempSkill2) player.ykTS_tempSkill2=[];
					player.ykTS_tempSkill2.push(skill);
					player.addSkill(skill);
				}
			};
			lib.element.player.ykTS_clearTempSkill=function(type){
				var player=this;
				if((''+type)=='10'){
					if(!player.ykTS_tempSkill1) player.ykTS_tempSkill1=[];
					player.removeSkill=lib.element.player.removeSkill;
					for(var skill of player.ykTS_tempSkill1) player.removeSkill(skill);
					player.ykTS_tempSkill1=[];
				}
				else{
					if(!player.ykTS_tempSkill2) player.ykTS_tempSkill2=[];
					player.removeSkill=lib.element.player.removeSkill;
					for(var skill of player.ykTS_tempSkill2) player.removeSkill(skill);
					player.ykTS_tempSkill2=[];
				}
			};
			lib.element.player.ykchangeStarShell=num=>{
				var player=this;
				if(!lib.config.ykStarShell) lib.config.ykStarShell=0;
				lib.config.ykStarShell+=num;
				lib.config.ykStarShell=Math.max(lib.config.ykStarShell,0);
				game.saveConfig('ykStarShell',lib.config.ykStarShell);
			};
			lib.element.player.ykcheckStarShell=num=>{
				var player=this;
				if(!num) num=1;
				return player.ykgetStarShellNum()>=num;
			};
			lib.element.player.ykgetStarShellNum=num=>{
				var player=this;
				if(!lib.config.ykStarShell) lib.config.ykStarShell=0;
				return _status.ykTS_starShell-_status.ykTS_consumeStarShell;
			};
			ui.handCards_dy=ui.create.system('我方手牌',null,true);
			lib.setPopped(ui.handCards_dy,function(){
				var uiintro=ui.create.dialog('hidden');
				var players=game.players.concat(game.dead);
				for(var player of players){
					if(player.side=='me'){
						uiintro.add(get.translation(player));
						var cards=player.getCards('h');
						if(cards.length){
							uiintro.addSmall(cards,true);
						}else{
							uiintro.add('（无）');
						};
					};
				};
				return uiintro;
			},220);
			ui.my_coins=ui.create.system('层数',null,true);
			lib.setPopped(ui.my_coins,function(){
				var uiintro=ui.create.dialog('hidden'),x=0;
				uiintro.add('当前挑战层数：第'+window.changeNumToHan((_status.ykTS_number||0))+'层');
				if(window.ykSetTowardSky[''+_status.ykTS_number]) for(var coin of window.ykSetTowardSky[''+_status.ykTS_number]) if(typeof coin=='number') uiintro.add('挑战奖励：'+coin);
				uiintro.add('剩余金币：'+(game.me.ykgetStarShellNum()||0));
				return uiintro;
			},220);
			ui.check_rewards=ui.create.system('结算奖励',null,true);
			lib.setPopped(ui.check_rewards,function(){
				var uiintro=ui.create.dialog('hidden');
				uiintro.add('点击按钮结算当前挑战奖励，每周仅结算一次，仅云空模式下可结算。');
				uiintro.add('当前奖励累计：<br>剩余金币：'+game.me.ykgetStarShellNum());
				for(var i in _status.ykTS_gainList) uiintro.add(get.translation(i)+'&nbspx'+_status.ykTS_gainList[i]);
				return uiintro;
			},220);
			ui.ykmode_help=ui.create.system('天空塔说明',null,true);
			lib.setPopped(ui.ykmode_help,function(){
				var uiintro=ui.create.dialog('hidden');
				uiintro.add('玩家从初始层数开始挑战，每通关1层获得相应金币数，每5层触发商店，可购买卡牌/物品/限定道具等，限定道具和挑战奖励次数每周刷新，每周仅有效结算一次奖励。');
				uiintro.add('名词-长效buff：该效果在当前十层内均有效');
				uiintro.add('名词-短效buff：该效果在当前五层内均有效');
				return uiintro;
			},220);
			if(lib.config.only_yk) ui.check_rewards.onclick=game.check_rewards;
			lib.skill._towardSky_autoswap={
				firstDo:true,
				trigger:{player:['playercontrol','chooseToUseBegin','chooseToRespondBegin','chooseToDiscardBegin','chooseToCompareBegin',
				'chooseButtonBegin','chooseCardBegin','chooseTargetBegin','chooseCardTargetBegin','chooseControlBegin',
				'chooseBoolBegin','choosePlayerCardBegin','discardPlayerCardBegin','gainPlayerCardBegin']},
				forced:true,
				priority:100,
				popup:false,
				filter:function(event,player){
					if(event.autochoose&&event.autochoose()) return false;
					if(lib.filter.wuxieSwap(event)) return false;
					if(_status.auto) return false;
					return game.me!=game.boss&&player!=game.boss&&player!=game.me&&player.side=='me';
				},
				content:function(){
					game.me.setNickname('');
					game.swapControl(player);
					game.me.setNickname('控制中');
					game.delay();
				},
			};
			_status.mode=get.config('mode');
			lib.translate.ykTowardSkyChallenger='盟';
			lib.translate.ykTowardSkyEnemy='敌';
			//game.prepareArena(5);
			//ui.arena.delete();
			ui.window.classList.remove('leftbar');
			ui.window.classList.remove('rightbar');
			var style=document.createElement('style');
			style.innerHTML='@keyframes towardSky_span {0%{transform:rotate(0deg);} 100%{transform:rotate(360deg);}}';
			style.innerHTML+='@keyframes towardSky_span1 {0%{transform:rotate(0deg);} 100%{transform:rotate(-360deg);}}';
			style.innerHTML+='@keyframes towardSky_show {0%{transform:scale(2) translate(-50px,-50px)} 100%{transform:scale(1) translate(0px,0px)}}';
			style.innerHTML+='@keyframes towardSky_show1 {0%{transform:scale(2) translate(50px,50px)} 100%{transform:scale(1) translate(0px,0px)}}';
			style.innerHTML+='@keyframes towardSky_show2 {0%{transform:scale(1.5)} 100%{transform:scale(1)}}';
			document.head.appendChild(style);
			lib.init.css(lib.assetURL+'layout/mode','boss');
			lib.onover.push(function(result){
				
			});
			var content=[{//语言content样本
				pages : 1 , //第一页,无意义,只做标记用
				say: "看，那便是整个云空大陆最高的建筑了(>>>点击继续)",//展示的文字
				//fuc: function(divList) {
					//执行的代码,divList数组保存的是在本次剧情中您创建的每个div
				//},
				//background: 'https://raw.fastgit.org/qxqdpcq/ykStoryPictures/main/towardSky/towardSky_bgx.jpg', //背景图片,读取扩展内目录下 img/第一章 文件夹内的background.png作为背景
				avatar : 'qxq_yk_yanmengyuejian' , //说话者, 读取扩展目录下img文件夹内的 name.png
				//backgroundAudio : 'xx' , //背景音乐,读取扩展目录下 audio/第一章 文件夹内 xx.mp3
				//audio : 'yyy' , //人物配音,读取扩展目录下 audio/第一章 文件夹内的 yyy.mp3
			},{
				pages : 2 ,
				say: `(好高！一眼望不到尽头！！！)`,
				background: 'https://raw.fastgit.org/qxqdpcq/ykStoryPictures/main/towardSky/towardSky_bgx.jpg',
			},{
				pages : 3 ,
				say: `它是一座塔？(世上竟有如此高的塔？！)`,
				background: 'https://raw.fastgit.org/qxqdpcq/ykStoryPictures/main/towardSky/towardSky_bgx.jpg',
			},{
				pages : 4 ,
				say: `那是天空塔，数万丈之高，传说它被建造出来是为了能够抵达神明的居所。`,
				avatar : 'qxq_yk_yanmengyuejian' ,
				background: 'https://raw.fastgit.org/qxqdpcq/ykStoryPictures/main/towardSky/towardSky_bgx.jpg',
			},{
				pages : 5 ,
				say: `那是几代帝王的心愿。`,
				avatar : 'qxq_yk_yanmengyuejian' ,
				background: 'https://raw.fastgit.org/qxqdpcq/ykStoryPictures/main/towardSky/towardSky_bgx.jpg',
			},{
				pages : 6 ,
				say: `那他们最后见到神明了吗？神明……真的在世间存在吗？`,
				background: 'https://raw.fastgit.org/qxqdpcq/ykStoryPictures/main/towardSky/towardSky_bgx.jpg',
			},{
				pages : 7 ,
				say: `你若是好奇，可以自己登上去看看，不过那里已经荒废许久了，没人知道那塔里面还有什么。`,
				avatar : 'qxq_yk_yanmengyuejian' ,
				background: 'https://raw.fastgit.org/qxqdpcq/ykStoryPictures/main/towardSky/towardSky_bgx.jpg',
			},{
				pages : 8 ,
				say: `(>>>点击结束)`,
				fuc: function(avatar,person) {
				},
			}];
			content.translation={//剧情附加翻译
				
			};
			content.end={//剧情附加翻译
				func:()=>{
					game.yk_towardSky_start();
				},
			};
			game.personChat(content);
			var ykBosslist=[];
			for(var character in lib.character) ykBosslist.push(character);
			game.boss_name=ykBosslist.randomGet();
		},
		game:{
			chooseCharacter:function(){
				game.ykreover2=game.over;
				game.ykreover=function(result){
					if(!result&&lib.config.only_yk) game.check_rewards();
					game.ykreover2(result);
				};
				game.over=()=>{};
				var next=game.createEvent('chooseCharacter',false);
				next.showConfig=true;
				next.setContent(function(){
					"step 0"
					var num=12;
					event.list=[];
					for(var i in lib.character){
						if(lib.filter.characterDisabled(i)) continue;
						if(lib.config.only_yk==true){
							if(i&&((i.indexOf('qxq_yk_')!= -1&&window.characterList.indexOf(i)!=-1)&&lib.qxq_yk_bossList.indexOf(i)==-1)) event.list.push(i);
						}
						else event.list.push(i);
					};
					var list=event.list.randomGets(num);
					var dialog=ui.create.dialog('选择角色','hidden',[list,'character']);
					dialog.setCaption('选择角色');
					game.me.chooseButton(dialog,true).set('onfree',true).selectButton=function(){
						return 1;
					};
					if(lib.config.mode_config.towardSky.change_choice==true){
						ui.create.cheat=function(){
							_status.createControl=ui.cheat2;
							ui.cheat=ui.create.control('更换',function(){
								if(ui.cheat2&&ui.cheat2.dialog==_status.event.dialog) return;
								var buttons=ui.create.div('.buttons');
								var node=_status.event.dialog.buttons[0].parentNode;
								list=event.list.randomGets(num);
								_status.event.dialog.buttons=ui.create.buttons(list,'character',buttons);
								_status.event.dialog.content.insertBefore(buttons,node);
								buttons.animate('start');
								node.remove();
								game.uncheck();
								game.check();
							});
							delete _status.createControl;
						};
						ui.create.cheat();
					};
					if(lib.config.mode_config.towardSky.free_choose==true&&lib.config.only_yk!=true){
						event.dialogxx=ui.create.characterDialog('heightset');
						ui.create.cheat2=function(){
							ui.cheat2=ui.create.control('自由选将',function(){
								if(this.dialog==_status.event.dialog){
									this.dialog.close();
									_status.event.dialog=this.backup;
									this.backup.open();
									delete this.backup;
									game.uncheck();
									game.check();
								}
								else{
									this.backup=_status.event.dialog;
									_status.event.dialog.close();
									_status.event.dialog=_status.event.parent.dialogxx;
									this.dialog=_status.event.dialog;
									this.dialog.open();
									game.uncheck();
									game.check();
								}
							});
						};
						ui.create.cheat2();
					};
					"step 1"
					for(var i=0;i<game.players.length;i++){
						var pl=game.players[i];
						if(pl==game.boss){
							pl.init(game.boss_name);
							break;
						};
					};
					window.ykTS_findSkill=()=>{
						var skillA=[],skillB=[],skillC=[],characterListA=lib.rank.rarity.legend.concat(lib.rank.rarity.epic),characterListB=lib.rank.rarity.rare.concat(lib.rank.rarity.junk),characterListC=[];
						for(var character in lib.character) if(characterListA.indexOf(character)==-1&&characterListB.indexOf(character)==-1) characterListC.push(character);
						for(var character of characterListA) if(lib.character[character]&&Array.isArray(lib.character[character][3])) skillA.addArray(lib.character[character][3]);
						for(var character of characterListB) if(lib.character[character]&&Array.isArray(lib.character[character][3])) skillB.addArray(lib.character[character][3]);
						for(var character of characterListC) if(lib.character[character]&&Array.isArray(lib.character[character][3])) skillC.addArray(lib.character[character][3]);
						return {
							skillA:skillA,
							skillB:skillB,
							skillC:skillC,
						};
					}
					window.ykTS_adjustmentBoss=()=>{
						window.ykTS_skillList=window.ykTS_findSkill();
						var funcList=[{
							func:()=>{//20
								game.boss.draw();
							},
						},{
							func:()=>{//40
								game.boss.draw(3);
							},
						},{
							func:()=>{//60
								var skill=window.ykTS_skillList.skillB.randomGet();
								game.boss.addSkill(skill);
								game.boss.draw(5);
							},
						},{
							func:()=>{//80
								var skill=window.ykTS_skillList.skillB.randomGets(2);
								for(var skillx of skill) game.boss.addSkill(skillx);
								game.log(game.boss,'获得了技能<span class="greentext">【'+get.translation(skill).replaceAll('、','】、【')+'】</span>！');
								game.boss.changeHujia();
								game.boss.draw(3);
							},
						},{
							func:()=>{//100
								var skill=window.ykTS_skillList.skillB.randomGets(4);
								for(var skillx of skill) game.boss.addSkill(skillx);
								game.log(game.boss,'获得了技能<span class="greentext">【'+get.translation(skill).replaceAll('、','】、【')+'】</span>！');
								game.boss.changeHujia(2);
								game.boss.draw(4);
							},
						},{
							func:()=>{//150
								var skill=window.ykTS_skillList.skillB.randomGets(5);
								for(var skillx of skill) game.boss.addSkill(skillx);
								game.log(game.boss,'获得了技能<span class="greentext">【'+get.translation(skill).replaceAll('、','】、【')+'】</span>！');
								game.boss.changeHujia(4);
								game.boss.draw(5);
							},
						},{
							func:()=>{//200
								var skill=window.ykTS_skillList.skillA.randomGets(2);
								game.boss.addSkill(skillx);
								game.log(game.boss,'获得了技能<span class="greentext">【'+get.translation(skill).replaceAll('、','】、【')+'】</span>！');
								var skill=window.ykTS_skillList.skillB.randomGets(4);
								for(var skillx of skill) game.boss.addSkill(skillx);
								game.log(game.boss,'获得了技能<span class="greentext">【'+get.translation(skill).replaceAll('、','】、【')+'】</span>！');
								game.boss.changeHujia(3);
								game.boss.gainMaxHp(2);
								game.boss.recover();
								game.boss.draw(2);
							},
						},{
							func:()=>{//300
								var skill=window.ykTS_skillList.skillA.randomGets(4);
								game.boss.addSkill(skillx);
								game.log(game.boss,'获得了技能<span class="greentext">【'+get.translation(skill).replaceAll('、','】、【')+'】</span>！');
								var skill=window.ykTS_skillList.skillB.randomGets(7);
								for(var skillx of skill) game.boss.addSkill(skillx);
								game.log(game.boss,'获得了技能<span class="greentext">【'+get.translation(skill).replaceAll('、','】、【')+'】</span>！');
								game.boss.changeHujia(5);
								game.boss.gainMaxHp(4);
								game.boss.recover(2);
								game.boss.draw(4);
							},
						},{
							func:()=>{//500
								var skill=window.ykTS_skillList.skillA.randomGets(7);
								for(var skillx of skill) game.boss.addSkill(skillx);
								game.log(game.boss,'获得了技能<span class="greentext">【'+get.translation(skill).replaceAll('、','】、【')+'】</span>！');
								var skill=window.ykTS_skillList.skillB.randomGets(10);
								for(var skillx of skill) game.boss.addSkill(skillx);
								game.log(game.boss,'获得了技能<span class="greentext">【'+get.translation(skill).replaceAll('、','】、【')+'】</span>！');
								game.boss.changeHujia(7);
								game.boss.gainMaxHp(6);
								game.boss.recover(4);
								game.boss.draw(6);
							},
						},{
							func:()=>{//1000
								var skill=window.ykTS_skillList.skillA.randomGets(9);
								for(var skillx of skill) game.boss.addSkill(skillx);
								game.log(game.boss,'获得了技能<span class="greentext">【'+get.translation(skill).replaceAll('、','】、【')+'】</span>！');
								var skill=window.ykTS_skillList.skillB.randomGets(15);
								for(var skillx of skill) game.boss.addSkill(skillx);
								game.log(game.boss,'获得了技能<span class="greentext">【'+get.translation(skill).replaceAll('、','】、【')+'】</span>！');
								game.boss.changeHujia(13);
								game.boss.gainMaxHp(10);
								game.boss.recover(7);
								game.boss.draw(10);
							},
						},{
							func:()=>{//else
								var skill=window.ykTS_skillList.skillA.randomGets(9+Math.floor(_status.ykTS_number/100));
								for(var skillx of skill) game.boss.addSkill(skillx);
								game.log(game.boss,'获得了技能<span class="greentext">【'+get.translation(skill).replaceAll('、','】、【')+'】</span>！');
								var skill=window.ykTS_skillList.skillB.randomGets(15+Math.ceil(_status.ykTS_number/50));
								for(var skillx of skill) game.boss.addSkill(skillx);
								game.log(game.boss,'获得了技能<span class="greentext">【'+get.translation(skill).replaceAll('、','】、【')+'】</span>！');
								game.boss.changeHujia(13+Math.floor(_status.ykTS_number/400));
								game.boss.gainMaxHp(10+Math.floor(_status.ykTS_number/100));
								game.boss.recover(7+Math.floor(_status.ykTS_number/200));
								game.boss.draw(10+Math.floor(_status.ykTS_number/100));
							},
						}];
						if(_status.ykTS_number<=500) switch(''+_status.ykTS_number){
							case '20': funcList[0].func();break;
							case '40': funcList[1].func();break;
							case '60': funcList[2].func();break;
							case '80': funcList[3].func();break;
							case '100': funcList[4].func();break;
							case '150': funcList[5].func();break;
							case '200': funcList[6].func();break;
							case '300': funcList[7].func();break;
							case '500': funcList[8].func();break;
							case '1000': funcList[9].func();break;
						}
						else funcList[10].func();
						if(lib.rank.rarity.legend.indexOf(game.boss_name)!=-1){
							var skill=window.ykTS_skillList.skillB.randomGet();
							game.boss.addSkill(skill);
						}
						else if(lib.rank.rarity.epic.indexOf(game.boss_name)!=-1){
							var skill=window.ykTS_skillList.skillB.randomGets(2);
							for(var skillx of skill) game.boss.addSkill(skillx);
						}
						else if(lib.rank.rarity.rare.indexOf(game.boss_name)!=-1){
							var skill=window.ykTS_skillList.skillA.randomGet();
							game.boss.addSkill(skill);
						}
						else{
							var skill=window.ykTS_skillList.skillA.randomGets(2);
							for(var skillx of skill) game.boss.addSkill(skillx);
						}
					}
					window.ykTS_adjustmentBoss();
					if(ui.cheat){
						ui.cheat.close();
						delete ui.cheat;
					};
					if(ui.cheat2){
						ui.cheat2.close();
						delete ui.cheat2;
					};
					var PL_character=result.buttons[0].link;
					game.me.init(PL_character);
					event.list.remove(PL_character);
					if(result.buttons.length>=2){
						var list1=[];
						var pl1=game.me;
						var num=1;
						var func=function(){
							var bool=false;
							pl1=pl1.next;
							if(pl1!=game.boss){
								pl1.init(result.buttons[num].link);
								event.list.remove(PL_character);
								list1.push(pl1);
								bool=true;
							};
							if(pl1!=game.me&&(num+1)<result.buttons.length){
								if(bool==true) num++;
								func();
							};
						};
						func();
						for(var i=0;i<game.players.length;i++){
							var pl=game.players[i];
							if(pl!=game.me&&pl!=game.boss&&!list1.contains(pl)){
								if(event.list.length>0){
									var character=event.list.randomGet();
									pl.init(character);
									event.list.remove(character);
								}
							};
						};
					}else{
						for(var i=0;i<game.players.length;i++){
							var pl=game.players[i];
							if(pl!=game.me&&pl!=game.boss){
								if(event.list.length>0){
									var character=event.list.randomGet();
									pl.init(character);
									event.list.remove(character);
								}
							};
						};
					};
					if(game.me!=game.boss&&lib.config.mode_config.towardSky.drkz==true){
						ui.handCards_dy.style.display='';
					};
					window.yk_boss=game.boss;
					setTimeout(function(){
						ui.arena.classList.remove('choose-character');
					},500);
					if(lib.config['extension_十周年UI_enable']==true){
						setTimeout(function(){
							_status.event.trigger('gameStart');
							game.addGlobalSkill('ykChallengeHelp');
						},200);
					}else{
						_status.event.trigger('gameStart');
					};
					game.me.$fullscreenpop('<font color=cyan>第'+window.changeNumToHan(_status.ykTS_number||0)+'层</font>');
					var info=window.ykSetTowardSky[''+_status.ykTS_number];
					if(!info) window.ykSetTowardSky[''+_status.ykTS_number]=[];
					window.ykSetTowardSky[''+_status.ykTS_number]=window.ykSetTowardSky[''+_status.ykTS_number].concat(window.funcList[''+_status.ykTS_number]);
					window.ykSetTowardSky[''+_status.ykTS_number]=window.ykSetTowardSky[''+_status.ykTS_number].concat(window.eventList[''+_status.ykTS_number]);
					if(Array.isArray(info)){
						for(var func of info) if(typeof func=='function'){
							var next=game.createEvent('function');
							next.set('boss',game.boss);
							next.set('player',game.me);
							next.setContent(func);
						}
					}
				});
				return next;
			},
			yk_towardSky_start:function(plNum){
				if(!plNum||isNaN(plNum)||plNum<2) plNum=2;
				game.prepareArena(plNum);
				game.me.identity='ykTowardSkyChallenger';
				game.me.side='me';
				game.me.setIdentity('盟');
				game.me.node.identity.dataset.color='fan';
				var list=[];
				for(var i=0;i<game.players.length;i++){
					if(game.players[i]!=game.me) list.push(game.players[i]);
				};
				game.boss=list.randomGet();
				game.boss.identity='ykTowardSkyEnemy';
				game.boss.side='enemy';
				game.boss.setIdentity('魁首');
				game.boss.node.identity.dataset.color='zhu';
				game.me.getId();//一定要有id，不然会报错！！！
				game.boss.getId();
				if(lib.config.show_sortcard) ui.sortCard.style.display='';
				if(ui.arena&&ui.arena.classList.contains('choose-character')) ui.arena.classList.remove('choose-character');
				if(lib.config.show_cardpile){
					ui.cardPileButton.style.display='';
				}else{
					ui.cardPileButton.style.display='none';
				};
				game.chooseCharacter();
				game.gameDraw();
				game.phaseLoop(game.boss);
				game.loop=game.yk_loop;
				game.loop();
			},
			yk_loop:game.loop,
		},
		element:{
			player:{
				dieAfter:function(source){
					if(lib.config.only_yk&&window.ykCheatCount){
						game.log('本层战斗胜利，结算中……');
						setTimeout(function(){game.log('战斗异常！');},2000);
						game.ykreover();
						return ;
					}
					if(game.players.length){
						var arrayx=(window.ykSetTowardSky[''+_status.ykTS_number]||[]),num;
						for(var itemx of arrayx) if(typeof itemx=='number') num=itemx;
						if(num==undefined) num=_status.ykTS_number*10;
						_status.ykTS_starShell+=num;
						game.log('恭喜通关，获得金币 x'+num+'！');
						_status.ykTS_number++;
						var e_num=0,m_num=0;
						for(var player of game.players){
							if(player.side=='enemy') e_num++;
							else if(player.side=='me') m_num++;
						}
						if(!e_num&&m_num){
							if(source) source.draw(2);
							var info=window.ykSetTowardSky[''+_status.ykTS_number];
							if(Array.isArray(info)&&lib.config.only_yk) for(var func of info) if(typeof func=='string'&&func.indexOf('reward')==-1){
								var next=game.createEvent('event');
								next.set('boss',game.boss);
								next.set('player',game.me);
								next.setContent(window.ykSetTowardSky[func]);
							};
							var next=game.createEvent('chooseCharacter',false);
							next.set('player',game.me);
							next.set('info',info);
							next.setContent(function(){
								'step 0'
								if(lib.config.only_yk){
									if(Array.isArray(info)){
										for(var func of info){
											if(typeof func=='string'&&func.indexOf('reward')!=-1){
												var next=game.createEvent('reward');
												next.set('boss',game.boss);
												next.set('player',game.me);
												next.setContent(window.ykSetTowardSky[func]);
											};
											if(typeof func=='number') game.ykchangeStarShell(func);
										}
									}
								}
								'step 1'
								if(_status.ykTS_number%5==0) for(var player of game.players) if(player.side=='me') player.ykTS_clearTempSkill(5);
								if(_status.ykTS_number%10==0) for(var player of game.players) if(player.side=='me') player.ykTS_clearTempSkill(10);
								var characterList=[];
								for(var character in lib.character) if(lib.character[character]) characterList.push(character);
								characterList.randomSort();
								if(_status.ykTS_number%5==0){
									var func=window.ykSetTowardSky.shop;
									var next=game.createEvent('shop');
									next.set('boss',game.boss);
									next.set('player',game.me);
									next.setContent(func);
								}
								player.chooseButton(true).set('ai',button=>{
									if(lib.rank.rarity.legend.indexOf(button.link)!=-1) return 1;
									else if(lib.rank.rarity.eqic.indexOf(button.link)!=-1) return 2;
									else if(lib.rank.rarity.rare.indexOf(button.link)!=-1) return 3;
									else if(lib.rank.rarity.junk.indexOf(button.link)!=-1) return 4;
									return 2+Math.random();
								}).set('createDialog', ['请选择一扇门', [characterList.randomGets(3), 'character']]);
								'step 2'
								game.boss_name=result.links[0];
								game.boss.clearSkills();
								game.boss.skills=[];
								game.boss.revive=lib.element.player.revive;
								game.boss.revive();
								game.boss.init=lib.element.player.init;
								game.boss.init(game.boss_name);
								game.boss.discard(game.boss.getCards('hej'))._triggered=null;
								game.boss.draw(4)._triggered=null;
								window.ykTS_adjustmentBoss();
								var info=window.ykSetTowardSky[''+_status.ykTS_number];
								if(Array.isArray(info)) for(var func of info) if(typeof func=='function'){
									var next=game.createEvent('function');
									next.set('boss',game.boss);
									next.set('player',game.me);
									next.setContent(func);
								};
							});
							return next;
						}
						else if(e_num&&!m_num) game.ykreover();
					}
					else game.ykreover();
				},
			},
			content:{
				gameDraw:function(){
					"step 0"
					if(_status.brawl&&_status.brawl.noGameDraw){
						event.finish();
						return;
					}
					var end=player;
					var numx=num;
					do{
						if(typeof num=='function'){
							numx=num(player);
						}
						player.directgain(get.cards(numx));
						if(player.singleHp===true&&get.mode()!='guozhan'){
							player.doubleDraw();
						}
						player=player.next;
					}
					while(player!=end);
					event.changeCard=get.config('change_card');
					"step 1"
					if(event.changeCard!='disabled'&&!_status.auto){
						event.dialog=ui.create.dialog('是否使用手气卡？');
						ui.create.confirm('oc');
						event.custom.replace.confirm=function(bool){
							_status.event.bool=bool;
							game.resume();
						}
					}
					else{
						event.finish();
					}
					"step 2"
					if(event.changeCard=='once'){
						event.changeCard='disabled';
					}
					else if(event.changeCard=='twice'){
						event.changeCard='once';
					}
					else if(event.changeCard=='disabled'){
						event.bool=false;
						return;
					}
					_status.imchoosing=true;
					event.switchToAuto=function(){
						_status.event.bool=false;
						game.resume();
					}
					game.pause();
					"step 3"
					_status.imchoosing=false;
					if(event.bool){
						if(game.changeCoin){
							game.changeCoin(-3);
						}
						var hs=game.me.getCards('h');
						game.addVideo('lose',game.me,[get.cardsInfo(hs),[],[]]);
						for(var i=0;i<hs.length;i++){
							hs[i].discard(false);
						}
						game.me.directgain(get.cards(hs.length));
						event.goto(2);
					}
					else{
						if(event.dialog) event.dialog.close();
						if(ui.confirm) ui.confirm.close();
						event.finish();
					}
				},
			},
		},
		ai:{
			get:{
				rawAttitude:function(from,to){
					if(from==undefined||to==undefined) return 0;
					if(from.identity==to.identity) return 5;
					return -5;
				},
			},
		},
	},{
		translate:'天空塔',
		extension:'云空',
		config:{
			only_yk:{
				name:lib.config.only_yk==true?'切换娱乐模式':'切换云空模式',
				intro:"重启以切换云空模式/娱乐模式",
				clear:true,
				onclick:function(){
					if(lib.config.only_yk==true){
						alert('已关闭云空模式和云空牌堆模式，即将重启以生效！');
						game.saveConfig('only_yk',false);
						game.saveConfig('only_ykCardPile',false);
						setTimeout(function(){game.reload();},1000);
					}
					else{
						game.saveConfig('only_yk',true);
						if(confirm('是否移除原有牌堆以继续开启云空牌堆模式？')){
							game.saveConfig('only_ykCardPile',true);
							alert('已开启云空模式和云空牌堆模式，即将重启以生效！');
							setTimeout(function(){game.reload();},1000);
						}
						else{
							alert('已开启云空模式，即将重启以生效！');
							setTimeout(function(){game.reload();},1000);
						}
					}
				},
				restart:true,
				frequent:true,
			},
			/*difficultyNumber:{
				name:'难度系数',
				init:4,
				item:{
					1:'10%',
					2:'30%',
					3:'50%',
					4:'70%',
					5:'100%',
					6:'150%',
					7:'200%',
					8:'250%',
					9:'350%',
					10:'500%',
				},
				frequent:true,
				restart:true,
			},*/
			drkz:{
				name:'单人控制',
				init:false,
				intro:"由你来控制所有队友的行动。",
				frequent:true,
				restart:true,
			},
			tdyxj:{
				name:'替队友选择武将牌',
				init:false,
				frequent:true
			},
			ykTS_startnum:{
				name:'点击选择开始层数',
				item:window.ykTS_item,
				onclick:function(item){
					game.saveConfig('ykTS_startnum',item);
				},
				restart:true,
				frequent:true,
			},
			free_choose:{
				name:'自由选将',
				init:true,
				onclick:function(bool){
					game.saveConfig('free_choose',bool,'towardSky');
				}
			},
			change_card:{
				name:'开启手气卡',
				init:'disabled',
				item:{
					disabled:'禁用',
					once:'一次',
					twice:'两次',
					unlimited:'无限',
				},
			},
		},
	});
});
