'use strict';
window.YKimport(function(lib,game,ui,get,ai,_status){
	lib.ykformationList={
		'yk_tianyangzhen':{
			position:[1,3,5,7,9],
			translation:'天央阵',
		},
	}
	window.ykChallenge_characterInfo={
		"qxq_yk_fuling":{
			hp:10000,
			attack_range:[3,6,9,10],
			attack_magic:600,
			defend_physics:200,
			defend_magic:250,
			cs:3,
			css:5,
			magic:350,
			strength:150,
			defend:420,
			speed:110,
			nature:"wood",
			occupation:"auxiliary",
			skills:{
				'ykChallenge_tianyi':{
					enable:"phaseUse",
					init:function(player){
						
					},
					timeValue:3,
					magic:80,
					CD:2,
					filter:function(event,player){
						return true;
					},
					content:function(event,player){
						var num=300+1.5*player.attack_magic;
						var list=player.getFriends();
						list.push(player);
						for(var plx of list) plx.changeHujia(num);
						var obj1={
							func:function(Arguments){
								var list=Arguments.pl;
								for(var pl of list) pl.changeHujia(-Arguments.num);
							},
							Arguments:{
								pl:list,
								num:num,
							},
							time:2,
						};
						player.addTempFunc(obj1);
						player.changeItem('speed',15);
						var obj2={
							func:function(Arguments){
								var player=Arguments.pl;
								player.changeItem('speed',-15);
							},
							Arguments:{
								pl:player,
							},
							time:2,
						};
						player.addTempFunc(obj2);
						for(var pl of list) pl.recoverDefend(pl.info.defend*0.2);
					},
					ai:{
						order:15,
						player:function(player){
							return 1;
						},
					},
				},
				'ykChallenge_wuji':{
					enable:"phaseUse",
					init:function(player){
						
					},
					timeValue:3,
					magic:140,
					strength:60,
					CD:3,
					filter:function(event,player){
						return true;
					},
					content:function(event,player){
						var num=200+player.attack_magic;
						var list=player.getFriends();
						list.push(player);
						for(var plx of list) plx.recover(num);
						var obj1={
							func:function(Arguments){
								var list=Arguments.pl;
								for(var pl of list) pl.recover(Arguments.recoverNum);
							},
							Arguments:{
								pl:list,
								num:num,
								recoverNum:100+player.attack_magic*0.5,
							},
							time:1,
						};
						player.addTempFunc(obj1);
						var obj2={
							func:function(Arguments){
								var list=Arguments.pl;
								for(var pl of list) pl.recover(Arguments.recoverNum);
							},
							Arguments:{
								pl:list,
								num:num,
								recoverNum:100+player.attack_magic*0.5,
							},
							time:2,
						};
						player.addTempFunc(obj2);
					},
					ai:{
						order:13,
						player:function(player){
							if(player.hp<player.maxHp*0.75) return 1;
							return 0;
						},
					},
				},
			},
			translation:{
				'ykChallenge_tianyi':'天医',
				'ykChallenge_tianyi_info':'茯苓消耗80术法值并祝福所有友方角色，使其获得持续两轮游戏的吸收(300+1.5*自身术法攻击力)伤害的护盾，并回复其真气值上限20%的真气值；同时增加自身15点移动速度，持续两轮游戏。',
				'ykChallenge_wuji':'无疾',
				'ykChallenge_wuji_info':'茯苓施展医术，消耗140术法值和60气力值，为所有友方立即回复(200+自身术法攻击力)的生命值，同时每轮游戏结束后茯苓额外为所有目标回复(100+自身术法攻击力*0.5)的生命值，该效果持续轮游戏。',
			},
		},
		"qxq_yk_kongshanlingxue":{
			hp:13000,
			attack_range:[3,6,9,10],
			attack_magic:1000,
			defend_physics:360,
			defend_magic:540,
			cs:5,
			css:7,
			magic:440,
			strength:170,
			defend:360,
			soul:200,
			speed:135,
			nature:"ice",
			occupation:"magician",
			skills:{},
		},
		"qxq_yk_tian":{
			hp:10000,
			attack_range:[3,6,9,10],
			attack_magic:1200,
			defend_physics:440,
			defend_magic:520,
			cs:5,
			css:7,
			magic:560,
			strength:140,
			defend:420,
			speed:140,
			nature:"random",
			occupation:"magician",
			skills:{},
		},
		"qxq_yk_wuwangxuanyue":{
			hp:17000,
			attack_range:[6,10,13],
			attack_physics:1000,
			defend_physics:580,
			defend_magic:560,
			cs:7,
			css:10,
			magic:280,
			strength:270,
			defend:410,
			speed:140,
			nature:"light",
			occupation:"warrior",
			skills:{},
		},
		"qxq_yk_xiaoqiao":{
			hp:12000,
			attack_range:[3,6,9,10],
			attack_physics:700,
			attack_magic:880,
			defend_physics:420,
			defend_magic:450,
			cs:5,
			css:7,
			magic:320,
			strength:170,
			defend:320,
			soul:180,
			speed:145,
			nature:"dark",
			occupation:"magician",
			skills:{
			},
		},
		"qxq_yk_yanmengyuejian":{
			hp:12000,
			attack_range:[3,6,9,10],
			attack_magic:1100,
			defend_physics:440,
			defend_magic:490,
			cs:5,
			css:7,
			magic:340,
			strength:170,
			defend:310,
			soul:250,
			speed:145,
			nature:"dark",
			occupation:"magician",
			skills:{
				'ykChallenge_shimmeng':{
					enable:"phaseUse",
					init:function(player){
						
					},
					timeValue:5,
					CD:4,
					magic:180,
					strength:80,
					content:function(event,player){
						var list=player.getFriends();
						list.push(player);
						var attack=0,target=player;
						for(var friend of list){
							var attackx=(friend.attack_magic||0)+(friend.attack_physics||0);
							if(attackx>attack){
								attack=attackx;
								target=friend;
							}
						}
						if(target!=player){
							target.shimmeng_source=player;
							var numHujia=Math.round((player.hp+(player.attack_magic||0)+(player.attack_physics||0))/2);
							target.changeHujia(numHujia);
							var attack_magic1=Math.round(target.attack_magic*0.15);
							var attack_magic2=Math.round(player.attack_magic*0.15);
							target.changeItem('attack_magic',attack_magic1);
							player.changeItem('attack_magic',attack_magic2);
							var attack_physics1=Math.round(target.attack_physics*0.15);
							var attack_physics2=Math.round(player.attack_physics*0.15);
							target.changeItem('attack_physics',attack_physics1);
							player.changeItem('attack_physics',attack_physics2);
							target.changeItem('cs',5);
							player.changeItem('cs',5);
							var shimmeng_damage={
								trigger:{
									source:"damage",
								},
								filter:function(event,player){
									return player.shimmeng_source&&event.parent&&event.parent.name=='attack'&&event.source==player;
								},
								content:function(event,player){
									var num=Math.round(event.num/4);
									if(num) player.recover(num);
								},
							}
							lib.translate.shimmeng_damage='蚀梦';
							lib.translate.shimmeng_damage_info='该角色已被【魇梦月见】附身，攻击力提升15%，暴击率提升5%，使用普通攻击时回复自身造成伤害1/4的生命值，该状态持续两回合';
							target.skills.shimmeng_damage=shimmeng_damage;
							/*var obj1={
								func:function(Arguments){
									var funcObj={
										func:function(characterList,Arguments){
											var source=Arguments.pl_source,cs=source.cs,css=source.css,attack_physics=(source.attack_physics||0),attack_magic=(source.attack_magic||0);
											for(var character of characterList){
												var defend_physics=(character.defend_physics||1),defend_magic=(character.defend_magic||1),defend=(character.defend||0),maxDefend=(character.info.defend||1),hujia=(character.hujia||0),num1=0,num2=0,num=0;
												num1=(attack_physics/defend_physics)*attack_physics/2;
												if(Math.random()<cs/100) num1=num1*(1.5+css/100);
												num2=(attack_magic/defend_magic)*attack_magic/2;
												if(Math.random()<cs/100) num2=num2*(1.5+css/100);
												num=num1+num2;
												character.damage(num);
											}
										},
										Arguments:{
											pl_source:Arguments.pl2,
										},
									};
									Arguments.pl1.attack2(Arguments.pl2.info.attack_range,funcObj,Arguments.pl2);
								},
								Arguments:{
									pl1:target,
									pl2:player,
								},
								time:1,
							};
							target.addTempFunc(obj1);*/
							var obj2={
								func:function(Arguments){
									Arguments.pl1.changeItem('attack_magic',-Arguments.num_magic1);
									Arguments.pl2.changeItem('attack_magic',-Arguments.num_magic2);
									Arguments.pl1.changeItem('attack_physics',-Arguments.num_physics1);
									Arguments.pl2.changeItem('attack_physics',-Arguments.num_physics2);
									Arguments.pl1.changeItem('cs',-5);
									Arguments.pl2.changeItem('cs',-5);
									delete Arguments.pl1.skills.shimmeng_damage;
									Arguments.pl1.skills.shimmeng_damage=null;
									delete Arguments.pl1.shimmeng_source;
									Arguments.pl1.shimmeng_source=null;
									Arguments.pl1.owner.ykChallengeCharacterList.push(Arguments.pl2);
									game.outplayers.remove(Arguments.pl2);
									player.avatar.hidden=false;
									window.yk_formationBg.appendChild(Arguments.pl2.avatar);
									Arguments.pl1.changeHujia(-Arguments.num_hujia);
									/*var funcObj={
										func:function(characterList,Arguments){
											var source=Arguments.pl_source,cs=source.cs,css=source.css,attack_physics=(source.attack_physics||0),attack_magic=(source.attack_magic||0);
											for(var character of characterList){
												var defend_physics=(character.defend_physics||1),defend_magic=(character.defend_magic||1),defend=(character.defend||0),maxDefend=(character.info.defend||1),hujia=(character.hujia||0),num1=0,num2=0,num=0;
												num1=(attack_physics/defend_physics)*attack_physics/2;
												if(Math.random()<cs/100) num1=num1*(1.5+css/100);
												num2=(attack_magic/defend_magic)*attack_magic/2;
												if(Math.random()<cs/100) num2=num2*(1.5+css/100);
												num=num1+num2;
												character.damage(num);
											}
										},
										Arguments:{
											pl_source:Arguments.pl2,
										},
									};
									Arguments.pl1.attack2(Arguments.pl2.info.attack_range,funcObj,Arguments.pl2);*/
								},
								Arguments:{
									pl1:target,
									pl2:player,
									num_magic1:attack_magic1,
									num_magic2:attack_magic2,
									num_physics1:attack_physics1,
									num_physics2:attack_physics2,
									num_hujia:numHujia,
								},
								time:2,
							};
							target.addTempFunc(obj2);
							if(player.owner==game.me) player.seatDiv.style.border='4px solid cyan';
							else player.seatDiv.style.border='4px solid red';
							player.owner.ykChallengeCharacterList.remove(player);
							game.outplayers.push(player);
							window.yk_formationBg.removeChild(player.avatar);
							player.avatar.hidden=true;
							window.ykChallenge_logDiv.innerHTML='<span class='+(target.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(target.name)+'</span>已被<span class='+(player.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(player.name)+'</span>附身<br>'+window.ykChallenge_logDiv.innerHTML;
						}
						else{
							var attack_magic=Math.round(player.attack_magic*0.2);
							player.changeItem('attack_magic',attack_magic);
							var attack_physics=Math.round(player.attack_physics*0.2);
							player.changeItem('attack_physics',attack_physics);
							player.changeItem('cs',10);
							var shimmeng_damage2={
								trigger:{
									source:"damage",
								},
								filter:function(event,player){
									return player.shimmeng_source&&event.parent&&event.parent.name=='attack';
								},
								content:function(event,player){
									var num=Math.round(event.num/3);
									if(num) player.recover(num);
								},
							}
							lib.translate.shimmeng_damage2='蚀梦';
							lib.translate.shimmeng_damage2_info='该角色攻击力提升20%，暴击率提升10%，使用普通攻击时回复自身造成伤害1/3的生命值，该状态持续两回合';
							target.skills.shimmeng_damage2=shimmeng_damage2;
							var obj={
								func:function(Arguments){
									Arguments.pl.changeItem('attack_magic',-Arguments.num_magic);
									Arguments.pl.changeItem('attack_physics',-Arguments.num_physics);
									Arguments.pl.changeItem('cs',-10);
									delete Arguments.pl.skills.shimmeng_damage2;
									Arguments.pl.skills.shimmeng_damage2=null;
									if(Arguments.pl.hp<Arguments.pl_hp) Arguments.pl.recover(Arguments.pl_hp-Arguments.pl.hp);
								},
								Arguments:{
									pl:player,
									pl_hp:player.hp,
									num_magic:attack_magic,
									num_physics:attack_physics,
								},
								time:2,
							};
							player.addTempFunc(obj);
						}
					},
				},
				'ykChallenge_yueyan':{
					enable:"phaseUse",
					init:function(player){
						
					},
					timeValue:3,
					CD:4,
					magic:180,
					strength:80,
					content:function(event,player){
						var enemies=player.getEnemies();
						var yueyanMark={
							trigger:{
								player:"die",
							},
							filter:function(event,player){
								return true;
							},
							content:function(event,player){
								var list=player.yueyan_source.getFriends();
								var num=Math.round((player.yueyan_source.attack_magic+player.yueyan_source.attack_physics)*3.6);
								for(var enemy of list){
									enemy.recover(num);
								}
								delete player.skills.yueyanMark;
								player.skills.yueyanMark=null;
							},
						};
						lib.translate.yueyanMark='梦魇';
						lib.translate.yueyanMark_info='该角色已被标记，阵亡时为标记来源所在阵营所有角色回复(标记来源攻击力*360%)的生命值，持续两回合';
						var yueyanDamaged={
							trigger:{
								player:"damage",
							},
							filter:function(event,player){
								return true;
							},
							content:function(event,player){
								event.num+=Math.round(event.num*0.1);
							},
						};
						lib.translate.yueyanDamaged='梦魇';
						lib.translate.yueyanDamaged_info='该角色已被标记，受到伤害增加10%，持续两回合';
						var obj={
							func:function(Arguments){
								delete Arguments.pl.skills.yueyanMark;
								Arguments.pl.skills.yueyanMark=null;
								delete Arguments.pl.skills.yueyanDamaged;
								Arguments.pl.skills.yueyanDamaged=null;
							},
							Arguments:{
								pl:player,
							},
							time:2,
						};
						for(var enemy of enemies){
							enemy.yueyan_source=player;
							enemy.skills.yueyanMark=yueyanMark;
							enemy.skills.yueyanDamaged=yueyanDamaged;
							enemy.addTempFunc(obj);
						}
					},
				},
			},
			translation:{
				'ykChallenge_shimmeng':'蚀梦',
				'ykChallenge_shimmeng_info':'魇梦月见消耗180术法值和80气力值，发动蚀梦之术，附身我方攻击最高的队友并为其附加两回合等同于魇梦月见自身(生命值+攻击力)/2的护盾，此期间提升自身和其15%攻击力和5%暴击率，同时本体消失，被附身目标使用普通攻击时，回复(伤害量/4)的生命值，此状态持续两轮游戏；若释放目标为自身，则提升自身两轮游戏20%攻击力和10%暴击率，期间使用普通攻击时，回复(伤害量/3)的生命值，且两轮后若血量小于释放此技能时血量，则恢复至释放此技能时的血量。【附身】：附身目标阵亡时，该施法者亦视为阵亡。',
				'ykChallenge_yueyan':'月魇',
				'ykChallenge_yueyan_info':'魇梦月见为所有敌方角色附加持续两轮游戏的【梦魇】：被标记的角色受到伤害增加10%，被标记的角色被击杀时移除标记，同时标记来源所在阵营的所有角色回复(标记来源攻击力*360%)的生命值。',
			},
		},
	}
	for(var i in window.ykChallenge_characterInfo){
		if(window.ykChallenge_characterInfo[i].translation) for(var j in window.ykChallenge_characterInfo[i].translation) lib.translate[j]=window.ykChallenge_characterInfo[i].translation[j];
	}
	window.ykChallenge_funcsList={
		phase:function(){
			delete _status.seat;
			delete _status.moveTime;
			delete _status.timeValue;
			delete _status.charactermove;
			delete _status.ykOK;
			delete _status.ykCancel;
			this.action=[];
			if(!Array.isArray(this.skillCDList)) this.skillCDList=[];
			if(!this.timeValue) this.timeValue=0;
			_status.moveTime=0;
			this.timeValue=Math.min(10,this.timeValue+6);
			_status.timeValue=this.timeValue;
			var event={name:"phase"},evt;
			var listSkill=this.arrangeSkills('phase');
			for(var info of listSkill) if(event._triggered!==null){
				evt=info.content(event,(info.useTarget||info.user));
				if(evt) event=evt;
				if(info.user.skills[info.name].CD) info.user.skills[info.name].CD.push({name:info.name,CD:info.CD});
			}
			window.ykChallenge_logDiv.innerHTML='<span class='+(this.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(this.name)+'</span>的回合开始<br>'+window.ykChallenge_logDiv.innerHTML;
			this.chooseAct();
		},
		chooseAct:function(){
			this.timeValue=_status.timeValue;
			if(this.owner==game.me){
				var chooseDialog=ui.create.dialog('hidden');
				chooseDialog.style.cssText='left:calc( 50% - 160px );top:calc( 50% - 170px );width:320px;height:340px;background-color:pink;z-index:999999;border-radius:8px;';
				document.body.appendChild(chooseDialog);
				var title=ui.create.div();
				title.style.cssText='left:0px;top:0px;height:40px;width:100%;text-align:center;';
				title.innerHTML='<font color=black>消耗一定时间值并选择以下一项<br>当前时间值：'+this.timeValue+'/10</font>';
				chooseDialog.appendChild(title);
				var characterImg=ui.create.div();
				characterImg.style.cssText='left:calc( 12.5% + 37.5px );top:45px;height:calc( 100% - 160px );width:calc( 75% - 75px );background-size:cover;background-position:none center;';
				characterImg.setBackground(this.name,'character');
				chooseDialog.appendChild(characterImg);
				var help=ui.create.div();
				help.style.cssText='left:calc( 100% - 50px);top:0px;height:50px;width:50px;background-size:cover;';
				help.onclick=function(){
					var introduce=ui.create.div();
					introduce.style.cssText='left:calc( 50% - 337px );top:calc( 50% - 287px );width:675px;height:555px;z-index:99999999;border-radius:30px;';
					introduce.onclick=function(){
						introduce.delete();
						introduce=null;
					}
					introduce.style['overflow-y']='hidden';
					introduce.style['overflow-x']='hidden';
					document.body.appendChild(introduce);
					window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/alert.png',introduce,true,'100% 100%');
					var content=ui.create.div();
					content.style.cssText='left:10%;top:12%;width:80%;height:80%;z-index:99999999;text-align:left;';
					content.innerHTML='<span style="font-size:30px;font-weight:400;font-family:shousha"><font color=black><b>游戏说明</b></span><br>击杀所有敌方角色时获得本局游戏胜利，使用技能或普通攻击时将对一定范围内的敌方角色造成伤害，当场上某一角色生命值为零或低于零时，若无特殊情况，该角色阵亡并将其移出本局游戏。<br><br>时间值：每个角色回合开始时获得6点时间值，时间值上限为10点，本回合未使用完的部分将在该角色的下一回合开始时继承。采取移动、技能或攻击行动时，均消耗一定时间值。<br><br>移动：回合内移动第1/2/3个单位距离时，消耗3/3/4点时间值。<br><br>技能：选择释放该角色的一个技能，不同技能消耗不同，释放技能后，该技能将进入冷却；如无特殊情况，每名角色在其回合内最多释放一个技能。<br><br>攻击：消耗3点时间值，令该角色对其攻击范围内的所有单位执行一次普通攻击；如无特殊情况，每名角色在其回合内最多执行一次普通攻击。<br><br>每个回合开始时，所有角色回复一定的术法值、气力值、真气值，拥有元力值的角色回复一定的元力值。<br><br>术法值&气力值&元力值：释放某些技能所需消耗的特定属性值。<br><br>真气值：真气值越高，受到伤害时减少伤害的概率越高，受到伤害且触发真气值减伤时，真气值减少。</font>';
					content.parent=introduce;
					content.onclick=function(){
						this.parent.delete();
						this.parent=null;
					}
					content.style['overflow-y']='scroll';
					content.style['overflow-x']='hidden';
					lib.setScroll(content);
					introduce.appendChild(content);
				}
				window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/help.png',help,true,'cover');
				window.yk_clickFK(help);
				chooseDialog.appendChild(help);
				var move=ui.create.div();
				move.style.cssText='left:0px;top:calc( 100% - 115px );height:50px;width:90px;background-size:cover;text-align:center;';
				window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/chooseButton1.png',move,true,'cover');
				move.character=this;
				move.onclick=function(){
					chooseDialog.delete();
					chooseDialog=null;
					this.character.move();
				}
				move.innerHTML='<br><font color=black><b>移动</b></font>';
				window.yk_clickFK(move);
				chooseDialog.appendChild(move);
				var useSkill=ui.create.div();
				useSkill.style.cssText='left:110px;top:calc( 100% - 115px );height:50px;width:90px;background-size:cover;text-align:center;';
				window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/chooseButton1.png',useSkill,true,'cover');
				useSkill.character=this;
				useSkill.onclick=function(){
					var skill;
					for(var i of this.character.action) if(i.name=="useSkill") skill=i.skillname;
					if(skill){
						alert('该角色已选择技能：【'+get.translation(skill)+'】');
					}
					else{
						chooseDialog.delete();
						chooseDialog=null;
						this.character.chooseSkill();
					}
				}
				useSkill.innerHTML='<br><font color=black><b>技能</b></font>';
				window.yk_clickFK(useSkill);
				chooseDialog.appendChild(useSkill);
				var attack=ui.create.div();
				attack.style.cssText='left:220px;top:calc( 100% - 115px );height:50px;width:90px;background-size:cover;text-align:center;';
				window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/chooseButton1.png',attack,true,'cover');
				attack.character=this;
				attack.onclick=function(){
					var bool;
					for(var i of this.character.action) if(i.name=="attack") bool=true;
					if(bool){
						if(confirm('已选择普通攻击，每个角色回合内只能普通攻击一次！是否取消攻击？')){
							for(var i of this.character.action) if(i.name=="attack") this.character.action.remove(i);
							this.character.timeValue+=3;
							_status.timeValue=this.character.timeValue;
							title.innerHTML='<font color=black>消耗一定时间值并选择以下一项<br>当前时间值：'+this.character.timeValue+'/10</font>';
						}
					}
					else{
						if(confirm('选择普通攻击？')){
							var act={
								name:"attack",
								result:true,
							};
							this.character.timeValue-=3;
							_status.timeValue=this.character.timeValue;
							this.character.action.push(act);
							title.innerHTML='<font color=black>消耗一定时间值并选择以下一项<br>当前时间值：'+this.character.timeValue+'/10</font>';
						}
					}
				}
				attack.character=this;
				attack.innerHTML='<br><font color=black><b>攻击</b></font>';
				window.yk_clickFK(attack);
				chooseDialog.appendChild(attack);
				var act=ui.create.div();
				act.style.cssText='left:110px;top:calc( 100% - 55px );height:50px;width:90px;background-size:cover;text-align:center;';
				window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/chooseButton1.png',act,true,'cover');
				act.character=this;
				act.onclick=function(){
					chooseDialog.delete();
					chooseDialog=null;
					this.character.actMove();
				}
				act.innerHTML='<br><font color=black><b>结束选择</b></font>';
				window.yk_clickFK(act);
				chooseDialog.appendChild(act);
			}
			else{//ai
				this.action=[];
				_status.moveTime=0;
				_status.seatAi=this.seatNumber;
				var skillCDList=this.skillCDList,skillList=[],lists=[];
				for(var skill in this.skills) if(this.skills[skill]&&this.skills[skill].enable=='phaseUse'){
					var bM,bT,bS1,bS2,bAI,funcAI;
					if(this.timeValue>=(this.skills[skill].timeValue||0)) bT=true;
					if(this.magic>=(this.skills[skill].magic||0)||this.magic==undefined) bM=true;
					if(this.strength>=(this.skills[skill].strength||0)||this.strength==undefined) bS1=true;
					if(this.soul>=(this.skills[skill].soul||0)||this.soul==undefined) bS2=true;
					if(this.skills[skill].ai) funcAI=(this.skills[skill].ai.player||this.skills[skill].ai.target);
					if((typeof funcAI=='function'&&funcAI(this))||funcAI==undefined||funcAI==true) bAI=true;
					if(bM&&bT&&bS1&&bS2&&bAI) skillList.push(skill);
				}
				for(var CD of skillCDList) skillList.remove(CD.name);
				var order=0;
				for(var skill of skillList){
					if(skill.ai&&skill.ai.order) order=skill.ai.order;
					lists.push({name:skill,order:order});
				}
				lists.sort(function(x,y){
					var a=0,b=0;
					if(x.ai&&x.ai.order) a=x.ai.order;
					if(y.ai&&y.ai.order) b=y.ai.order;
					if(a<b) return 1;
					if(a>b) return -1;
					return 0;
				});
				skillList=lists;
				if(skillList.length>0){
					var result=skillList[0];
					var act={name:"useSkill",skillname:result.name};
					this.action.push(act);
					if(this.skills[result.name].CD){
						var CD={
							name:result.name,
							CD:this.skills[result.name].CD,
						};
						this.skillCDList.push(CD);
					}
					this.timeValue-=(this.skills[result.name].timeValue||0);
					this.consumeMagic-=(this.skills[result.name].magic||0);
					this.consumeStrength-=(this.skills[result.name].strength||0);
					if(this.info.soul) this.consumeSoul-=(this.skills[result.name].soul||0);
				}
				var toward;
				var boolx,list=this.getRange(null,_status.seatAi);
				for(var character of game.me.ykChallengeCharacterList) if(list.indexOf(character.seatNumber)!=-1) boolx=true;
				var act={
					name:"attack",
					result:true,
				};
				if(this.timeValue>=3&&boolx){this.action.push(act);this.timeValue-=3;}
				var chooseMove=function(character){
					var act={
						name:"move",
						distance:[],
					};
					var seat=_status.seatAi;
					var result=[],consume;
					if(window.ykformationList[seat-8]&&window.ykformationList[seat-8].style.border=='4px solid white'){
						result.push('top');
					}
					if(window.ykformationList[seat-1]&&window.ykformationList[seat-1].style.border=='4px solid white'){
						result.push('left');
					}
					if(window.ykformationList[seat+8]&&window.ykformationList[seat+8].style.border=='4px solid white'){
						result.push('bottom');
					}
					if(window.ykformationList[seat+1]&&window.ykformationList[seat+1].style.border=='4px solid white'){
						result.push('right');
					}
					if([1,2,3,4,5,6,7,8].indexOf(seat)!=-1){
						result.remove('top');
					}
					if([1,9,17,25,33].indexOf(seat)!=-1){
						result.remove('left');
					}
					if([33,34,35,36,37,38,39,40].indexOf(seat)!=-1){
						result.remove('bottom');
					}
					if([8,16,24,32,40].indexOf(seat)!=-1){
						result.remove('right');
					}
					if(result.length){
						result=result.randomGet();
						if(result=='top'){act.distance.push({top:1});_status.seatAi-=8;}
						if(result=='left'){act.distance.push({left:1});_status.seatAi-=1;toward='left';}
						if(result=='bottom'){act.distance.push({bottom:1});_status.seatAi+=8;}
						if(result=='right'){act.distance.push({right:1});_status.seatAi+=1;toward='right';}
						if(_status.moveTime<2) consume=3;
						else consume=4;
						character.timeValue-=consume;
						_status.moveTime++;
						character.action.push(act);
						if(character.timeValue>=6&&_status.moveTime<2&&Math.random()<0.75) chooseMove(character);
						else if(character.timeValue>=3&&_status.moveTime<2&&character.hp<character.maxHp*0.75&&Math.random()<0.35) chooseMove(character);
					}
				}
				chooseMove(this);
				var bool,seat=_status.seatAi,list=this.getRange(null,_status.seatAi);
				for(var character of game.me.ykChallengeCharacterList) if(list.indexOf(character.seatNumber)!=-1) bool=true;
				var act={
					name:"attack",
					result:true,
				};
				if(this.timeValue>=3&&bool&&!boolx){this.action.push(act);this.timeValue-=3;}
				this.actMove();
			}
		},
		actMove:function(){
			delete _status.seatAi;
			_status.seatAi=null;
			delete _status.moveTime;
			_status.moveTime=null;
			this.timeValue=_status.timeValue;
			if(!this.action||(this.action&&!this.action.length)||this.avatar.hidden){
				if(this.avatar.hidden) this.action=[];
				if(this.isDead) window.ykformationList[this.seatNumber].style.border='4px solid white';
				else if(this.owner==game.me) window.ykformationList[this.seatNumber].style.border='4px solid cyan';
				else window.ykformationList[this.seatNumber].style.border='4px solid red';
				window.ykChallenge_start(_status.characterList);
				return ;
			}
			var act=this.action[0];
			if(act.name=='move'&&act.distance.length){
				var top=0,left=0,right=0,bottom=0;
				for(var i=0;i<act.distance.length;i++){
					if(act.distance[i].top) top++;
					if(act.distance[i].left) left++;
					if(act.distance[i].right) right++;
					if(act.distance[i].bottom) bottom++;
				}
				if(top) window.ykChallenge_logDiv.innerHTML='<span class='+(this.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(this.name)+'</span>向上移动了'+window.changeNumToHan(top)+'格<br>'+window.ykChallenge_logDiv.innerHTML;
				if(bottom) window.ykChallenge_logDiv.innerHTML='<span class='+(this.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(this.name)+'</span>向下移动了'+window.changeNumToHan(bottom)+'格<br>'+window.ykChallenge_logDiv.innerHTML;
				if(left) window.ykChallenge_logDiv.innerHTML='<span class='+(this.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(this.name)+'</span>向左移动了'+window.changeNumToHan(left)+'格<br>'+window.ykChallenge_logDiv.innerHTML;
				if(right) window.ykChallenge_logDiv.innerHTML='<span class='+(this.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(this.name)+'</span>向右移动了'+window.changeNumToHan(right)+'格<br>'+window.ykChallenge_logDiv.innerHTML;
				var move=function(character){
					var seat=window.ykChallenge_getCoordinate(character.seatNumber),coordinate,act=character.action[0],action=act.distance[0];
					character.seatDiv.style.border='4px solid white';
					act.distance=act.distance.slice(1,act.distance.length);
					if(action.top){
						var othersx={
							frequency:250,
							zIndex:'Before',
							bottom:true,
							turnOverX:(character.toward=='right'?false:true),
							func:function(character){
								var coordinate=window.ykChallenge_getCoordinate(character.seatNumber);
								character.avatar.style.cssText='left:'+coordinate[0]+'px;top:'+coordinate[1]+'px;width:'+coordinate[2]+'px;height:'+coordinate[3]+'px;transition:all 1s;';
								window.yk_formationBg.appendChild(character.avatar);
								var othersx={
									react:true,
									frequency:1000,
									zIndex:'Before',
									bottom:true,
									turnOverX:(character.toward=='right'?false:true),
								}
								var urlObj=['https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/character/'+character.name+'/standby/',4,'.png'];
								window.showPlayerAnimation(character,urlObj,othersx);
								character.avatar.appendChild(character.hpDiv);
								character.avatar.appendChild(character.openInfo);
								if(character.hujiaDiv) character.avatar.appendChild(character.hujiaDiv);
								character.seatDiv=window.ykformationList[character.seatNumber];
								if(character.owner==game.me) character.seatDiv.style.border='4px solid cyan';
								else character.seatDiv.style.border='4px solid red';
								if(!act.distance.length){character.action=character.action.slice(1,character.action.length);character.actAttack();}
								else{
									_status.ykactMoveArguments=character;
									setTimeout(function(){
										var character=_status.ykactMoveArguments;
										delete _status.ykactMoveArguments;
										_status.ykactMoveArguments=null;
										move(character);
									},1000);
								}
								return ;
							},
							func_arguments:character,
						}
						if(character.owner!=game.me) othersx.turnOverX=true;
						var urlObj=['https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/character/'+character.name+'/move/',4,'.png'];
						window.showPlayerAnimation(character,urlObj,othersx);
						
						coordinate=window.ykChallenge_getCoordinate(character.seatNumber-8);
						character.avatar.style.left=coordinate[0]+'px';
						character.avatar.style.top=coordinate[1]+'px';
						character.avatar.style.width=coordinate[2]+'px';
						character.avatar.style.height=coordinate[3]+'px';
						character.seatNumber-=8;
					}
					else if(action.bottom){
						var othersx={
							frequency:250,
							zIndex:'Before',
							bottom:true,
							turnOverX:(character.toward=='right'?false:true),
							func:function(character){
								var coordinate=window.ykChallenge_getCoordinate(character.seatNumber);
								character.avatar.style.cssText='left:'+coordinate[0]+'px;top:'+coordinate[1]+'px;width:'+coordinate[2]+'px;height:'+coordinate[3]+'px;transition:all 1s;';
								window.yk_formationBg.appendChild(character.avatar);
								var othersx={
									react:true,
									frequency:1000,
									zIndex:'Before',
									turnOverX:(character.toward=='right'?false:true),
								}
								var urlObj=['https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/character/'+character.name+'/standby/',4,'.png'];
								window.showPlayerAnimation(character,urlObj,othersx);
								character.avatar.appendChild(character.hpDiv);
								character.avatar.appendChild(character.openInfo);
								if(character.hujiaDiv) character.avatar.appendChild(character.hujiaDiv);
								character.seatDiv=window.ykformationList[character.seatNumber];
								if(character.owner==game.me) character.seatDiv.style.border='4px solid cyan';
								else character.seatDiv.style.border='4px solid red';
								if(!act.distance.length){character.action=character.action.slice(1,character.action.length);character.actAttack();}
								else{
									_status.ykactMoveArguments=character;
									setTimeout(function(){
										var character=_status.ykactMoveArguments;
										delete _status.ykactMoveArguments;
										_status.ykactMoveArguments=null;
										move(character);
									},1000);
								}
								return ;
							},
							func_arguments:character,
						}
						if(character.owner!=game.me) othersx.turnOverX=true;
						var urlObj=['https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/character/'+character.name+'/move/',4,'.png'];
						window.showPlayerAnimation(character,urlObj,othersx);
						
						coordinate=window.ykChallenge_getCoordinate(character.seatNumber+8);
						character.avatar.style.left=coordinate[0]+'px';
						character.avatar.style.top=coordinate[1]+'px';
						character.avatar.style.width=coordinate[2]+'px';
						character.avatar.style.height=coordinate[3]+'px';
						character.seatNumber+=8;
					}
					else if(action.left){
						var othersx={
							frequency:250,
							zIndex:'Before',
							bottom:true,
							turnOverX:true,
							func:function(character){
								character.toward='left';
								var coordinate=window.ykChallenge_getCoordinate(character.seatNumber);
								character.avatar.style.cssText='left:'+coordinate[0]+'px;top:'+coordinate[1]+'px;width:'+coordinate[2]+'px;height:'+coordinate[3]+'px;transition:all 1s;';
								window.yk_formationBg.appendChild(character.avatar);
								var othersx={
									react:true,
									frequency:1000,
									zIndex:'Before',
									bottom:true,
									turnOverX:true,
								}
								if(character.owner!=game.me) othersx.turnOverX=true;
								var urlObj=['https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/character/'+character.name+'/standby/',4,'.png'];
								window.showPlayerAnimation(character,urlObj,othersx);
								character.avatar.appendChild(character.hpDiv);
								character.avatar.appendChild(character.openInfo);
								if(character.hujiaDiv) character.avatar.appendChild(character.hujiaDiv);
								character.seatDiv=window.ykformationList[character.seatNumber];
								if(character.owner==game.me) character.seatDiv.style.border='4px solid cyan';
								else character.seatDiv.style.border='4px solid red';
								if(!act.distance.length){character.action=character.action.slice(1,character.action.length);character.actAttack();}
								else{
									_status.ykactMoveArguments=character;
									setTimeout(function(){
										var character=_status.ykactMoveArguments;
										delete _status.ykactMoveArguments;
										_status.ykactMoveArguments=null;
										move(character);
									},1000);
								}
								return ;
							},
							func_arguments:character,
						}
						if(character.owner!=game.me) othersx.turnOverX=true;
						var urlObj=['https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/character/'+character.name+'/move/',4,'.png'];
						window.showPlayerAnimation(character,urlObj,othersx);
						
						coordinate=window.ykChallenge_getCoordinate(character.seatNumber-1);
						character.avatar.style.left=coordinate[0]+'px';
						character.avatar.style.top=coordinate[1]+'px';
						character.avatar.style.width=coordinate[2]+'px';
						character.avatar.style.height=coordinate[3]+'px';
						character.seatNumber--;
					}
					else if(action.right){
						var othersx={
							frequency:250,
							zIndex:'Before',
							bottom:true,
							turnOverX:false,
							func:function(character){
								character.toward='right';
								var coordinate=window.ykChallenge_getCoordinate(character.seatNumber);
								character.avatar.style.cssText='left:'+coordinate[0]+'px;top:'+coordinate[1]+'px;width:'+coordinate[2]+'px;height:'+coordinate[3]+'px;transition:all 1s;';
								window.yk_formationBg.appendChild(character.avatar);
								var othersx={
									react:true,
									frequency:1000,
									zIndex:'Before',
									bottom:true,
									turnOverX:false,
								}
								var urlObj=['https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/character/'+character.name+'/standby/',4,'.png'];
								window.showPlayerAnimation(character,urlObj,othersx);
								character.avatar.appendChild(character.hpDiv);
								character.avatar.appendChild(character.openInfo);
								if(character.hujiaDiv) character.avatar.appendChild(character.hujiaDiv);
								character.seatDiv=window.ykformationList[character.seatNumber];
								if(character.owner==game.me) character.seatDiv.style.border='4px solid cyan';
								else character.seatDiv.style.border='4px solid red';
								if(!act.distance.length){character.action=character.action.slice(1,character.action.length);character.actAttack();}
								else{
									_status.ykactMoveArguments=character;
									setTimeout(function(){
										var character=_status.ykactMoveArguments;
										delete _status.ykactMoveArguments;
										_status.ykactMoveArguments=null;
										move(character);
									},1000);
								}
								return ;
							},
							func_arguments:character,
						}
						if(character.owner!=game.me) othersx.turnOverX=true;
						var urlObj=['https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/character/'+character.name+'/move/',4,'.png'];
						window.showPlayerAnimation(character,urlObj,othersx);
						
						coordinate=window.ykChallenge_getCoordinate(character.seatNumber+1);
						character.avatar.style.left=coordinate[0]+'px';
						character.avatar.style.top=coordinate[1]+'px';
						character.avatar.style.width=coordinate[2]+'px';
						character.avatar.style.height=coordinate[3]+'px';
						character.seatNumber++;
					}
					character.avatar.appendChild(character.hpDiv);
					character.avatar.appendChild(character.openInfo);
				}
				move(this);
			}
			else if(this.action.length){
				this.actAttack();
			}
			else{
				if(this.isDead) window.ykformationList[this.seatNumber].style.border='4px solid white';
				else if(this.owner==game.me) window.ykformationList[this.seatNumber].style.border='4px solid cyan';
				else window.ykformationList[this.seatNumber].style.border='4px solid red';
				window.ykChallenge_start(_status.characterList);
			}
		},
		actAttack:function(){
			if(this.action==undefined||(this.action&&!this.action.length)){
				if(this.isDead) window.ykformationList[this.seatNumber].style.border='4px solid white';
				else if(this.owner==game.me) window.ykformationList[this.seatNumber].style.border='4px solid cyan';
				else window.ykformationList[this.seatNumber].style.border='4px solid red';
				window.ykChallenge_start(_status.characterList);
				return ;
			}
			var act=this.action[0];
			if(act.name=='attack'&&act.result){
				this.action=this.action.slice(1,this.action.length);
				this.attack();
			}
			else if(act.name=='useSkill'&&act.skillname){
				var skill=act.skillname;
				this.action=this.action.slice(1,this.action.length);
				var event={name:"useSkill",player:this,skill:skill,originSkill:skill};
				this.useSkill(skill,event);
			}
			else if(this.action.length){
				this.actMove();
			}
			else{
				if(this.isDead) window.ykformationList[this.seatNumber].style.border='4px solid white';
				else if(this.owner==game.me) window.ykformationList[this.seatNumber].style.border='4px solid cyan';
				else window.ykformationList[this.seatNumber].style.border='4px solid red';
				window.ykChallenge_start(_status.characterList);
			}
		},
		attack:function(triggered){
			var list=this.getRange();
			for(var number of list){
				window.ykformationList[number].style.backgroundColor='yellow';
			}
			var othersx={
				frequency:300,
				zIndex:'Before',
				bottom:true,
				turnOverX:(this.toward=='right'?false:true),
				func:function(character){
					var coordinate=window.ykChallenge_getCoordinate(character.seatNumber);
					character.avatar.style.cssText='left:'+coordinate[0]+'px;top:'+coordinate[1]+'px;width:'+coordinate[2]+'px;height:'+coordinate[3]+'px;transition:all 1s;';
					window.yk_formationBg.appendChild(character.avatar);
					var othersx={
						react:true,
						frequency:1000,
						zIndex:'Before',
						bottom:true,
						turnOverX:(character.toward=='right'?false:true),
					}
					if(character.owner!=game.me) othersx.turnOverX=true;
					var urlObj=['https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/character/'+character.name+'/standby/',4,'.png'];
					window.showPlayerAnimation(character,urlObj,othersx);
					character.avatar.appendChild(character.hpDiv);
					character.avatar.appendChild(character.openInfo);
					if(character.hujiaDiv) character.avatar.appendChild(character.hujiaDiv);
				},
				func_arguments:this,
			}
			if(this.owner!=game.me) othersx.turnOverX=true;
			var urlObj=['https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/character/'+this.name+'/attack/',6,'.png'];
			window.showPlayerAnimation(this,urlObj,othersx);
			setTimeout(function(){
				for(var number of list){
					window.ykformationList[number].style.backgroundColor='black';
				}
			},300);
			setTimeout(function(){
				for(var number of list){
					window.ykformationList[number].style.backgroundColor='yellow';
				}
			},500);
			setTimeout(function(){
				for(var number of list){
					window.ykformationList[number].style.backgroundColor='black';
				}
			},700);
			setTimeout(function(){
				for(var number of list){
					window.ykformationList[number].style.backgroundColor='yellow';
				}
			},900);
			_status.nextArguments=this;
			_status.nextArguments_list=list;
			_status.nextArguments_triggered=triggered;
			setTimeout(function(){
				var source=_status.nextArguments,list=[],characterListx,funcObj=_status.nextArguments_funcObj;
				for(var d of _status.nextArguments_list) list.push(d);
				delete _status.nextArguments;
				_status.nextArguments=null;
				delete _status.nextArguments_list;
				_status.nextArguments_list=null;
				delete _status.nextArguments_triggered;
				_status.nextArguments_triggered=undefined;
				for(var number of list){
					window.ykformationList[number].style.backgroundColor='black';
				}
				if(source.owner==game.me) characterListx=game.enemy.ykChallengeCharacterList;
				else characterListx=game.me.ykChallengeCharacterList;
				for(var character of characterListx){
					if(list.indexOf(character.seatNumber)!=-1){
						window.ykChallenge_logDiv.innerHTML='<span class='+(source.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(source.name)+'</span>对<span class='+(character.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(character.name)+'</span>使用了<span class="yellowtext">普通攻击</span><br>'+window.ykChallenge_logDiv.innerHTML;
						var cs=source.cs,css=source.css,attack_physics=(source.attack_physics||0),attack_magic=(source.attack_magic||0),defend_physics=(character.defend_physics||1),defend_magic=(character.defend_magic||1),defend=(character.defend||0),maxDefend=(character.info.defend||1),hujia=(character.hujia||0),num1=0,num2=0,num=0;
						num1=(attack_physics/defend_physics)*attack_physics/2;
						if(Math.random()<cs/100) num1=num1*(1.5+css/100);
						num2=(attack_magic/defend_magic)*attack_magic/2;
						if(Math.random()<cs/100) num2=num2*(1.5+css/100);
						num=num1+num2;
						var evt,event={name:"attack",num:num,player:character,source:source};
						event._triggered=triggered;
						if(event._triggered!==null){
							var listSkill=character.arrangeSkills('attack',source);
							for(var info of listSkill) if(event._triggered!==null){
								window.ykChallenge_logDiv.innerHTML='<span class='+(info.user.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(info.user.name)+'</span>使用了技能<span class="greentext">【'+get.translation(info.name)+'】</span><br>'+window.ykChallenge_logDiv.innerHTML;
								evt=info.content(event,(info.useTarget||info.user));
								if(evt) event=evt;
								if(info.user.skills[info.name].CD) info.user.skills[info.name].CD.push({name:info.name,CD:info.CD});
							}
						}
						if(evt) event=evt;
						if(event.num) character.damage(num,null,this,event);
					}
				}
				if(source.isDead) window.ykformationList[source.seatNumber].style.border='4px solid white';
				else if(source.owner==game.me) window.ykformationList[source.seatNumber].style.border='4px solid cyan';
				else window.ykformationList[source.seatNumber].style.border='4px solid red';
				if(source.action.length) source.actAttack();
				else window.ykChallenge_start(_status.characterList);
			},1900);
		},
		chooseSkill:function(){
			var chooseDialog=ui.create.dialog('hidden');
			chooseDialog.style.cssText='left:calc( 50% - 316px );top:calc( 50% - 206px );width:632px;height:425px;background-color:pink;z-index:999999;border-radius:8px;';
			document.body.appendChild(chooseDialog);
			var chooseDialog_title=ui.create.div('');
			chooseDialog_title.style.cssText='left:0px;top:0px;width:100%;height:25px;text-align:center;';
			chooseDialog_title.innerHTML='<span style="font-size:25px;font-weight:400;font-family:shousha"><font color=black><b>选择要发动的技能<b></font></span>';
			chooseDialog.appendChild(chooseDialog_title);
			var chooseDialog_Content=ui.create.div('');
			chooseDialog_Content.style.cssText='left:0px;top:35px;width:100%;height:calc( 100% - 60px );overflow-x:hidden;overflow-y:scroll;';
			lib.setScroll(chooseDialog_Content);
			chooseDialog.appendChild(chooseDialog_Content);
			if(this.skills) for(var skill in this.skills) if(this.skills[skill]&&this.skills[skill].enable=='phaseUse'){
				var bool=false;
				if(this.action.indexOf({name:"useSkill",skillname:skill})!=-1) continue;
				for(var skillCD of this.skillCDList) if(skillCD.name==skill) bool=true;
				if(bool) continue;
				var evtx={name:"phaseUse",player:this};
				if(this.skills[skill].filter&&!this.skills[skill].filter(evtx,this)) continue;
				var skillname=get.translation(skill),skillInfo=get.translation(skill+'_info'),div=ui.create.div();
				div.content=ui.create.div();
				div.style.cssText='left:0px;top:0px;height:250px;width:320px;position:relative;background-size:100% 100%;';
				div.content.style.cssText='left:15px;top:15px;height:calc( 100% - 30px );width:calc( 100% - 30px );text-align:left;overflow-x:hidden;overflow-y:scroll;';
				window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/showSkillInfo.png',div,true,'100% 100%');
				div.skill=skill;
				div.character=this;
				div.content.innerHTML='<span style="font-size:20px;font-weight:400;font-family:shousha"><font color=black>技能：<b>'+skillname+'<b></span><br>'+skillInfo+'</font>';
				div.onclick=function(){
					if(typeof this.character.skills[this.skill].timeValue=='number'&&this.character.timeValue<this.character.skills[this.skill].timeValue){
						alert('时间值不足！');
						return ;
					}
					else var numT=(this.character.skills[this.skill].timeValue||0);
					if(typeof this.character.skills[this.skill].magic=='number'&&this.character.magic<this.character.skills[this.skill].magic){
						alert('术法值不足！');
						return ;
					}
					else var numM=(this.character.skills[this.skill].magic||0);
					if(typeof this.character.skills[this.skill].strength=='number'&&this.character.strength<this.character.skills[this.skill].strength){
						alert('气力值不足！');
						return ;
					}
					else var numS1=(this.character.skills[this.skill].strength||0);
					if(typeof this.character.skills[this.skill].soul=='number'&&this.character.soul&&this.character.soul<this.character.skills[this.skill].soul){
						alert('元力值不足！');
						return ;
					}
					else var numS2=(this.character.skills[this.skill].soul||0);
					if(!confirm('将选择发动技能【'+get.translation(this.skill)+'】，选择后不可更改，是否继续？')) return ;
					else{
						this.character.timeValue-=numT;
						this.character.consumeMagic(numM);
						this.character.consumeStrength(numS1);
						if(this.character.soul) this.character.consumeSoul(numS2);
						if(!this.character.action) this.character.action=[];
						_status.timeValue=this.character.timeValue;
						this.character.action.push({name:"useSkill",skillname:this.skill});
						var CD={
							name:this.skill,
							CD:this.character.skills[this.skill].CD,
						};
						this.character.skillCDList.push(CD);
						chooseDialog.delete();
						chooseDialog=null;
						this.character.chooseAct();
					}
				}
				lib.setScroll(div.content);
				chooseDialog_Content.appendChild(div);
				window.yk_clickFK(div);
				div.appendChild(div.content);
			}
			var back=ui.create.div('.menu','返回');
			back.style.cssText='left:calc( 50% - 25px);width:50px;bottom:0px;height:25px;text-align:center;border-radius:8px;';
			chooseDialog.appendChild(back);
			back.character=this;
			back.onclick=function(){
				chooseDialog.delete();
				chooseDialog=null;
				back.delete();
				back=null;
				this.character.chooseAct();
			}
			window.yk_clickFK(back);
			
		},
		useSkill:function(skill,event,triggered){
			var evt;
			event={name:"useSkill",player:this,skill:skill,parent:event};
			event._triggered=triggered;
			if(event.player) window.ykChallenge_logDiv.innerHTML='<span class='+(event.player.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(event.player.name)+'</span>使用了技能<span class="greentext">【'+get.translation(event.skill)+'】</span><br>'+window.ykChallenge_logDiv.innerHTML;
			if(this.skills[skill].CD) this.skillCDList.push({name:skill,CD:this.skills[skill].CD});
			if(event._triggered!==null){
				var listSkill=this.arrangeSkills('useSkill');
				for(var info of listSkill) if(event._triggered!==null){
					window.ykChallenge_logDiv.innerHTML='<span class='+(info.user.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(info.user.name)+'</span>使用了技能<span class="greentext">【'+get.translation(info.name)+'】</span><br>'+window.ykChallenge_logDiv.innerHTML;
					evt=info.content(event,(info.useTarget||info.user));
					if(evt) event=evt;
					if(info.user.skills[info.name].CD) info.user.skills[info.name].CD.push({name:info.name,CD:info.CD});
				}
			}
			this.skills[skill].content(event,this);
			this.actAttack();
		},
		move:function(){
			if(this.owner!=game.me){
				return ;
			}
			var chooseDialog=ui.create.dialog('hidden');
			chooseDialog.style.cssText='left:calc( 50% - 316px );top:calc( 50% - 206px );width:632px;height:425px;background-color:black;z-index:999999;';
			document.body.appendChild(chooseDialog);
			for(var i=0;i<40;i++){
				var num=i+1;
				window['moveDivx_'+num]=ui.create.div();
				window['moveDivx_'+num].style.cssText='left:0%;top:0%;height:75px;width:75px;border: 2px solid white;position:relative;';
				window['moveDivx_'+num].innerHTML=''+num;
				if(num==(_status.seat||this.seatNumber)){
					window['moveDivx_'+num].style.border='2px solid orange';
					var img=ui.create.div();
					img.style.cssText='top:0px;height:75px;left:9px;width:56px;background-size:cover;background-position:none center;';
					img.setBackground(this.name,'character');
					window['moveDivx_'+num].appendChild(img);
					window['moveDivx_'+num].img=img;
				}
				else{
					for(var character of game.me.ykChallengeCharacterList) if(num==character.seatNumber&&character!=this){
						window['moveDivx_'+num].style.border='2px solid cyan';
						var img=ui.create.div();
						img.style.cssText='top:0px;height:75px;left:7.5px;width:56px;background-size:cover;background-position:none center;';
						img.setBackground(character.name,'character');
						window['moveDivx_'+num].appendChild(img);
					}
					for(var character of game.enemy.ykChallengeCharacterList) if(num==character.seatNumber&&character!=this){
						window['moveDivx_'+num].style.border='2px solid red';
						var img=ui.create.div();
						img.style.cssText='top:0px;height:75px;left:7.5px;width:56px;background-size:cover;background-position:none center;';
						img.setBackground(character.name,'character');
						window['moveDivx_'+num].appendChild(img);
					}
					for(var character of game.outplayers){
						if(game.deadplayers.contains(character)) continue;
						if(num==character.seatNumber&&character!=this){
							if(character.owner==game.me) window['moveDivx_'+num].style.border='2px solid cyan';
							else window['moveDivx_'+num].style.border='2px solid red';
							var img=ui.create.div();
							img.style.cssText='top:0px;height:75px;left:7.5px;width:56px;background-size:cover;background-position:none center;';
							img.setBackground(character.name,'character');
							window['moveDivx_'+num].appendChild(img);
						}
					}
				}
				chooseDialog.appendChild(window['moveDivx_'+num]);
			}
			var distance=[],pace1=0,pace2=0;
			chooseDialog.control=ui.create.dialog('hidden');
			chooseDialog.control.style.cssText='left:0px;top:calc( 80% - 52px );height:105px;width:105px;border-radius:100px;background-color:black;opacity:0.8;';
			document.body.appendChild(chooseDialog.control);
			var onclick=function(){
				var x=this.link,consume,seat;
				if(_status.moveTime>=3){
					alert('已达到最大移动上限！');
					return ;
				}
				if(_status.timeValue<3&&_status.moveTime<2){
					alert('时间值不足！');
					return ;
				}
				else if(_status.timeValue<4&&_status.moveTime>=2){
					alert('时间值不足！');
					return ;
				}
				else if(_status.moveTime<2) consume=3;
				else consume=4;
				seat=(_status.seat||this.character.seatNumber);
				if(x=='top'&&[1,2,3,4,5,6,7,8].indexOf(seat)!=-1){
					return ;
				}
				else if(x=='left'&&[1,9,17,25,33].indexOf(seat)!=-1){
					return ;
				}
				else if(x=='right'&&[8,16,24,32,40].indexOf(seat)!=-1){
					return ;
				}
				else if(x=='bottom'&&[33,34,35,36,37,38,39,40].indexOf(seat)!=-1){
					return ;
				}
				var img=window['moveDivx_'+seat].img;
				window['moveDivx_'+seat].removeChild(img);
				if(!_status.charactermove) _status.charactermove=[];
				if(x=='top'){
					if(window['moveDivx_'+(seat-8)]&&(window['moveDivx_'+(seat-8)].style.border=='2px solid cyan'||window['moveDivx_'+(seat-8)].style.border=='2px solid red')){
						alert('该位置已被占用！');
						_status.seat=seat;
						window['moveDivx_'+seat].appendChild(img);
						window['moveDivx_'+seat].img=img;
						return ;
					}
					seat-=8;
					_status.charactermove.push({top:1});
				}
				else if(x=='left'){
					if(window['moveDivx_'+(seat-1)]&&(window['moveDivx_'+(seat-1)].style.border=='2px solid cyan'||window['moveDivx_'+(seat-1)].style.border=='2px solid red')){
						alert('该位置已被占用！');
						_status.seat=seat;
						window['moveDivx_'+seat].appendChild(img);
						window['moveDivx_'+seat].img=img;
						return ;
					}
					seat-=1;
					_status.charactermove.push({left:1});
				}
				else if(x=='right'){
					if(window['moveDivx_'+(seat+1)]&&(window['moveDivx_'+(seat+1)].style.border=='2px solid cyan'||window['moveDivx_'+(seat+1)].style.border=='2px solid red')){
						alert('该位置已被占用！');
						_status.seat=seat;
						window['moveDivx_'+seat].appendChild(img);
						window['moveDivx_'+seat].img=img;
						return ;
					}
					seat+=1;
					_status.charactermove.push({right:1});
				}
				else if(x=='bottom'){
					if(window['moveDivx_'+(seat+8)]&&(window['moveDivx_'+(seat+8)].style.border=='2px solid cyan'||window['moveDivx_'+(seat+8)].style.border=='2px solid red')){
						alert('该位置已被占用！');
						_status.seat=seat;
						window['moveDivx_'+seat].appendChild(img);
						window['moveDivx_'+seat].img=img;
						return ;
					}
					seat+=8;
					_status.charactermove.push({bottom:1});
				}
				_status.seat=seat;
				window['moveDivx_'+seat].appendChild(img);
				window['moveDivx_'+seat].img=img;
				_status.timeValue-=consume;
				_status.moveTime++;
			}
			var top=ui.create.div();
			top.style.cssText='left:33%;top:0px;height:35px;width:35px;text-align:center;';
			top.link='top';
			top.onclick=onclick;
			top.character=this;
			chooseDialog.control.appendChild(top);
			top.innerHTML='<span style="font-size:35px;font-weight:400;font-family:shousha"><font color=white><b>↑</b></font></span>';
			window.yk_clickFK(top);
			var left=ui.create.div();
			left.style.cssText='left:0px;top:33%;height:35px;width:35px;text-align:center;';
			left.link='left';
			left.onclick=onclick;
			left.character=this;
			chooseDialog.control.appendChild(left);
			left.innerHTML='<span style="font-size:35px;font-weight:400;font-family:shousha"><font color=white><b>←</b></font></span>';
			window.yk_clickFK(left);
			var right=ui.create.div();
			right.style.cssText='left:66%;top:33%;height:35px;width:35px;text-align:center;';
			right.link='right';
			right.onclick=onclick;
			right.character=this;
			chooseDialog.control.appendChild(right);
			right.innerHTML='<span style="font-size:35px;font-weight:400;font-family:shousha"><font color=white><b>→</b></font></span>';
			window.yk_clickFK(right);
			var bottom=ui.create.div();
			bottom.style.cssText='left:33%;top:66%;height:35px;width:35px;text-align:center;';
			bottom.link='bottom';
			bottom.onclick=onclick;
			bottom.character=this;
			chooseDialog.control.appendChild(bottom);
			bottom.innerHTML='<span style="font-size:35px;font-weight:400;font-family:shousha"><font color=white><b>↓</b></font></span>';
			window.yk_clickFK(bottom);
			var ykOK=ui.create.div('.menu','确定',function(){
				if(_status.seat&&confirm('将该角色移动到位置【'+_status.seat+'】处，本次移动后剩余时间值：'+_status.timeValue)){
					var act={
						name:"move",
						distance:_status.charactermove,
					};
					ykOK.character.action.push(act);
					delete _status.charactermove;
					_status.charactermove=null;
					chooseDialog.control.delete();
					chooseDialog.control=null;
					chooseDialog.delete();
					chooseDialog=null;
					ykOK.character.chooseAct();
					ykOK.delete();
					ykOK=null;
					ykCancel.delete();
					ykCancel=null;
				}
				else if(!_status.seat) alert('您尚未移动！');
			});
			ykOK.style.cssText='left:calc( 33% - 50px );bottom:0px;width:50px;height:25px;text-align:center;border-radius:8px;';
			ykOK.character=this;
			chooseDialog.appendChild(ykOK);
			window.yk_clickFK(ykOK);
			var ykCancel=ui.create.div('.menu','返回',function(){
				if(confirm('将取消本次移动设置并返回选项')){
					delete _status.charactermove;
					_status.charactermove=null;
					chooseDialog.control.delete();
					chooseDialog.control=null;
					chooseDialog.delete();
					chooseDialog=null;
					_status.moveTime=0;
					_status.seat=ykCancel.seatNumber;
					_status.timeValue=ykCancel.timeValue;
					ykCancel.character.chooseAct();
					ykOK.delete();
					ykOK=null;
					ykCancel.delete();
					ykCancel=null;
				}
			});
			ykCancel.style.cssText='left:calc( 67% - 50px );bottom:0px;width:50px;height:25px;text-align:center;border-radius:8px;';
			ykCancel.timeValue=_status.timeValue;
			ykCancel.seatNumber=this.seatNumber;
			ykCancel.character=this;
			chooseDialog.appendChild(ykCancel);
			window.yk_clickFK(ykCancel);
		},
		damage:function(num,nature,source,event,triggered){
			num=Math.round(Math.abs(num));
			if(num<=0) return ;
			var evt;
			event={name:"damage",num:num,player:this,nature:nature,source:source,parent:event};
			event._triggered=triggered;
			if(event._triggered!==null){
				var listSkill=this.arrangeSkills('damage',event.source);
				for(var info of listSkill) if(event._triggered!==null){
					window.ykChallenge_logDiv.innerHTML='<span class='+(info.user.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(info.user.name)+'</span>使用了技能<span class="greentext">【'+get.translation(info.name)+'】</span><br>'+window.ykChallenge_logDiv.innerHTML;
					evt=info.content(event,(info.useTarget||info.user));
					if(evt&&typeof evt.num=='number') event=evt;
					if(info.user.skills[info.name].CD) info.user.skills[info.name].CD.push({name:info.name,CD:info.CD});
					if(event.num<=0) return ;
				}
			}
			if(Math.random()<this.defend/Math.max(this.info.defend,1)){
				var d=Math.round((event.num/2)*(get.rand(7,13)/10));
				this.loseDefend(d);
				event.num-=d;
			}
			if(this.hujia){
				var n=Math.min(event.num,this.hujia);
				event.num-=n;
				this.changeHujia(-n);
			}
			if(!event.num||typeof event.num!='number') return ;
			if(event.player) window.ykChallenge_logDiv.innerHTML='<span class='+(event.player.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(event.player.name)+'</span>受到了'+(event.source?('来自<span class='+(event.source.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(event.source.name)+'</span>的'):'')+event.num+'点'+(event.nature&&lib.translate[event.nature]?get.translation(event.nature)+'属性':'')+'伤害<br>'+window.ykChallenge_logDiv.innerHTML;
			if(event.player&&event.player!=this){
				event.player.damage(event.num,event.nature,event.source,event);
				return ;
			}
			else{
				this.hp-=event.num;
				this.hpDiv.style.width=Math.round(this.hp/this.maxHp*100)+'%';
				if(this.hp<=0) this.die();
			}
		},
		changeHujia:function(num,event,phaseNum,triggered){
			if(!this.hujia&&!num) return ;
			num=Math.round(num);
			var evt;
			event={name:"changeHujia",num:num,player:this,parent:event};
			event._triggered=triggered;
			if(event._triggered!==null){
				var listSkill=this.arrangeSkills('changeHujia');
				for(var info of listSkill) if(event._triggered!==null){
					window.ykChallenge_logDiv.innerHTML='<span class='+(info.user.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(info.user.name)+'</span>使用了技能<span class="greentext">【'+get.translation(info.name)+'】</span><br>'+window.ykChallenge_logDiv.innerHTML;
					evt=info.content(event,(info.useTarget||info.user));
					if(evt&&typeof evt.num=='number') event=evt;
					if(info.user.skills[info.name].CD) info.user.skills[info.name].CD.push({name:info.name,CD:info.CD});
					if(event.num<=0) return ;
				}
			}
			if(!event.num||typeof event.num!='number') return ;
			if(event.player&&event.player!=this){
				event.player.changeHujia(event.num,event);
				return ;
			}
			else{
				if(this.hujia<0||typeof this.hujia!='number') this.hujia=0;
				this.hujia+=event.num;
				if(this.hujia<=0){
					delete this.hujia;
					this.hujia=null;
					if(this.hujiaDiv){
						this.loseHujiaDiv=ui.create.div();
						this.loseHujiaDiv.style.cssText='left:0px;top:0px;width:100%;height:100%;z-index:99999;';
						this.avatar.appendChild(this.loseHujiaDiv);
						var othersx={
							frequency:200,
							zIndex:'Before',
							bottom:true,
							func:function(character){
								character.loseHujiaDiv.delete();
								delete character.loseHujiaDiv;
								character.loseHujiaDiv=null;
							},
							func_arguments:this,
						}
						window.showPictAnimation('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/loseHujia/',10,'.png',this.loseHujiaDiv,othersx);
						this.hujiaDiv.delete();
						delete this.hujiaDiv;
						this.hujiaDiv=null;
					}
				}
				else if(!this.hujiaDiv){
					this.gainHujiaDiv=ui.create.div();
					this.gainHujiaDiv.style.cssText='left:0px;top:0px;width:100%;height:100%;z-index:99999;';
					this.avatar.appendChild(this.gainHujiaDiv);
					var othersx={
						frequency:200,
						zIndex:'Before',
						bottom:true,
						func:function(character){
							character.gainHujiaDiv.delete();
							delete character.gainHujiaDiv;
							character.gainHujiaDiv=null;
						},
						func_arguments:this,
					}
					window.showPictAnimation('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/gainHujia/',5,'.png',this.gainHujiaDiv,othersx);
					this.hujiaDiv=ui.create.div();
					this.hujiaDiv.style.cssText='left:0px;top:0px;width:100%;height:100%;z-index:99999;';
					this.avatar.appendChild(this.hujiaDiv);
					var othersx={
						react:true,
						frequency:200,
						zIndex:'Before',
						bottom:true,
					}
					window.showPictAnimation('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/hujiaDiv/',65,'.png',this.hujiaDiv,othersx);
				}
			}
			if(event.player) window.ykChallenge_logDiv.innerHTML='<span class='+(event.player.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(event.player.name)+'</span>'+(event.num>=0?'获得了':'失去了')+Math.abs(event.num)+'点护盾<br>'+window.ykChallenge_logDiv.innerHTML;
		},
		addTempFunc:function(obj){
			if(!this.tempItemList) this.tempItemList=[];
			this.tempItemList.push(obj);
		},
		removeTempFunc:function(obj){
			var func=obj.func,Arguments=obj.Arguments;
			for(var i of this.tempItemList){
				if(i.func==func&&i.Arguments==Arguments){
					this.tempItemList.remove(i);
					break;
				}
			}
		},
		clearTempFunc:function(tag){
			if(!this.tempItemList) this.tempItemList=[];
			if(tag==undefined) tag='all';
			for(var i of this.tempItemList){
				if(tag=='all'){
					this.tempItemList=[];
				}
				else if(tag){//清除buff
					for(var i of this.tempItemList){
						if(i.tag&&i.tag!='debuff'){
							this.tempItemList.remove(i);
						}
					}
				}
				else if(!tag){//清除debuff
					for(var i of this.tempItemList){
						if(!i.tag||i.tag=='debuff'){
							this.tempItemList.remove(i);
						}
					}
				}
			}
		},
		recover:function(num,event,triggered){
			num=Math.round(num);
			if(typeof num!='number'||!num) return ;
			if(num<0){
				this.damage(num);
				return ;
			}
			else{
				var evt;
				event={name:"recover",num:num,player:this,parent:event};
				event._triggered=triggered;
				if(event._triggered!==null){
					var listSkill=this.arrangeSkills('recover');
					for(var info of listSkill) if(event._triggered!==null){
						window.ykChallenge_logDiv.innerHTML='<span class='+(info.user.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(info.user.name)+'</span>使用了技能<span class="greentext">【'+get.translation(info.name)+'】</span><br>'+window.ykChallenge_logDiv.innerHTML;
						evt=info.content(event,(info.useTarget||info.user));
						if(evt&&typeof evt.num=='number') event=evt;
						if(info.user.skills[info.name].CD) info.user.skills[info.name].CD.push({name:info.name,CD:info.CD});
						if(event.num<=0) return ;
					}
				}
				if(!event.num||typeof event.num!='number') return ;
				if(event.player&&event.player!=this){
					event.player.recover(event.num,event);
					return ;
				}
				else{
					this.hp+=event.num;
					this.hpDiv.style.width=Math.round(this.hp/this.maxHp*100)+'%';
				}
				if(event.player) window.ykChallenge_logDiv.innerHTML='<span class='+(event.player.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(event.player.name)+'</span>回复了'+event.num+'点生命值<br>'+window.ykChallenge_logDiv.innerHTML;
			}
			this.recoverAnimation();
		},
		getFriends:function(){
			var list=[];
			for(var character of this.owner.ykChallengeCharacterList) if(character!=this) list.push(character);
			return list;
		},
		getEnemies:function(){
			var list=[],owner;
			if(this.owner==game.me) owner=game.enemy;
			else owner=game.me;
			for(var character of owner.ykChallengeCharacterList) list.push(character);
			return list;
		},
		getRange:function(range,seat,toward){
			if(!range) range=this.info.attack_range;
			if(!seat) seat=this.seatNumber;
			if(['left','right'].indexOf(toward)==-1) toward=this.toward;
			var list=[];
			if(toward=='left'){
				if(range.indexOf(1)!=-1){
					var pos=seat-7;
					if(pos>=1&&[1,2,3,4,5,6,7,8,16,24,32,40].indexOf(seat)==-1) list.push(pos);
				}
				if(range.indexOf(2)!=-1){
					var pos=seat-8;
					if(pos>=1&&[1,2,3,4,5,6,7,8].indexOf(seat)==-1) list.push(pos);
				}
				if(range.indexOf(3)!=-1){
					var pos=seat-9;
					if(pos>=1&&[1,2,3,4,5,6,7,8,9,17,25,33].indexOf(seat)==-1) list.push(pos);
				}
				if(range.indexOf(4)!=-1){
					var pos=seat+1;
					if(pos<=40&&[8,16,24,32,40].indexOf(seat)==-1) list.push(pos);
				}
				if(range.indexOf(6)!=-1){
					var pos=seat-1;
					if(pos>=1&&[1,9,17,25,33].indexOf(seat)==-1) list.push(pos);
				}
				if(range.indexOf(7)!=-1){
					var pos=seat+9;
					if(pos<=40&&[8,16,24,32,33,34,35,36,37,38,39,40].indexOf(seat)==-1) list.push(pos);
				}
				if(range.indexOf(8)!=-1){
					var pos=seat+8;
					if(pos<=40&&[33,34,35,36,37,38,39,40].indexOf(seat)==-1) list.push(pos);
				}
				if(range.indexOf(9)!=-1){
					var pos=seat+7;
					if(pos<=40&&[1,9,17,25,33,34,35,36,37,38,39,40].indexOf(seat)==-1) list.push(pos);
				}
				if(range.indexOf(10)!=-1){
					var pos=seat-2;
					if(pos<=40&&[1,2,9,10,17,18,25,26,33,34].indexOf(seat)==-1) list.push(pos);
				}
				if(range.indexOf(11)!=-1){
					var pos=seat-16;
					if(pos>=1&&[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].indexOf(seat)==-1) list.push(pos);
				}
				if(range.indexOf(12)!=-1){
					var pos=seat+16;
					if(pos<=40&&[25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40].indexOf(seat)==-1) list.push(pos);
				}
				if(range.indexOf(13)!=-1){
					var pos=seat-3;
					if(pos<=40&&[1,2,3,9,10,11,17,18,19,25,26,27,33,34,35].indexOf(seat)==-1) list.push(pos);
				}
			}
			else{
				if(range.indexOf(1)!=-1){
					var pos=seat-9;
					if(pos>=1&&[1,2,3,4,5,6,7,8,9,17,25,33].indexOf(seat)==-1) list.push(pos);
				}
				if(range.indexOf(2)!=-1){
					var pos=seat-8;
					if(pos>=1&&[1,2,3,4,5,6,7,8].indexOf(seat)==-1) list.push(pos);
				}
				if(range.indexOf(3)!=-1){
					var pos=seat-7;
					if(pos>=1&&[1,2,3,4,5,6,7,8,16,24,32,40].indexOf(seat)==-1) list.push(pos);
				}
				if(range.indexOf(4)!=-1){
					var pos=seat-1;
					if(pos>=1&&[1,9,17,25,33].indexOf(seat)==-1) list.push(pos);
				}
				if(range.indexOf(6)!=-1){
					var pos=seat+1;
					if(pos<=40&&[8,16,24,32,40].indexOf(seat)==-1) list.push(pos);
				}
				if(range.indexOf(7)!=-1){
					var pos=seat+7;
					if(pos<=40&&[1,9,17,25,33,34,35,36,37,38,39,40].indexOf(seat)==-1) list.push(pos);
				}
				if(range.indexOf(8)!=-1){
					var pos=seat+8;
					if(pos<=40&&[33,34,35,36,37,38,39,40].indexOf(seat)==-1) list.push(pos);
				}
				if(range.indexOf(9)!=-1){
					var pos=seat+9;
					if(pos<=40&&[8,16,24,32,33,34,35,36,37,38,39,40].indexOf(seat)==-1) list.push(pos);
				}
				if(range.indexOf(10)!=-1){
					var pos=seat+2;
					if(pos<=40&&[7,8,15,16,23,24,31,32,39,40].indexOf(seat)==-1) list.push(pos);
				}
				if(range.indexOf(11)!=-1){
					var pos=seat-16;
					if(pos>=1&&[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].indexOf(seat)==-1) list.push(pos);
				}
				if(range.indexOf(12)!=-1){
					var pos=seat+16;
					if(pos<=40&&[25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40].indexOf(seat)==-1) list.push(pos);
				}
				if(range.indexOf(13)!=-1){
					var pos=seat+3;
					if(pos<=40&&[6,7,8,14,15,16,22,23,24,30,31,32,38,39,40].indexOf(seat)==-1) list.push(pos);
				}
			}
			return list;
		},
		recoverDefend:function(num,event,triggered){
			if(typeof num!='number') return ;
			num=Math.round(num);
			if(num<=0) return ;
			var evt;
			event={name:"recoverDefend",num:num,parent:event};
			event._triggered=triggered;
			if(event._triggered!==null){
				var listSkill=this.arrangeSkills('recoverDefend');
				for(var info of listSkill) if(event._triggered!==null){
					window.ykChallenge_logDiv.innerHTML='<span class='+(info.user.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(info.user.name)+'</span>使用了技能<span class="greentext">【'+get.translation(info.name)+'】</span><br>'+window.ykChallenge_logDiv.innerHTML;
					evt=info.content(event,(info.useTarget||info.user));
					if(evt&&typeof evt.num=='number') event=evt;
					if(info.user.skills[info.name].CD) info.user.skills[info.name].CD.push({name:info.name,CD:info.CD});
					if(evt.num<=0) return ;
				}
			}
			this.defend=Math.min(this.defend+event.num,this.info.defend);
			this.defend=Math.max(this.defend,0);
			if(event.num) window.ykChallenge_logDiv.innerHTML='<span class='+(this.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(this.name)+'</span>回复了'+event.num+'点<font color=grey>真气值</font><br>'+window.ykChallenge_logDiv.innerHTML;
		},
		recoverMagic:function(num,event,triggered){
			if(typeof num!='number') return ;
			num=Math.round(num);
			if(num<=0) return ;
			var evt;
			event={name:"recoverMagic",num:num,parent:event};
			event._triggered=triggered;
			if(event._triggered!==null){
				var listSkill=this.arrangeSkills('recoverMagic');
				for(var info of listSkill) if(event._triggered!==null){
					window.ykChallenge_logDiv.innerHTML='<span class='+(info.user.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(info.user.name)+'</span>使用了技能<span class="greentext">【'+get.translation(info.name)+'】</span><br>'+window.ykChallenge_logDiv.innerHTML;
					evt=info.content(event,(info.useTarget||info.user));
					if(evt&&typeof evt.num=='number') event=evt;
					if(info.user.skills[info.name].CD) info.user.skills[info.name].CD.push({name:info.name,CD:info.CD});
					if(event.num<=0) return ;
				}
			}
			this.magic=Math.min(this.magic+event.num,this.info.magic);
			this.magic=Math.max(this.magic,0);
			if(event.num) window.ykChallenge_logDiv.innerHTML='<span class='+(this.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(this.name)+'</span>回复了'+event.num+'点<font color=cyan>术法值</font><br>'+window.ykChallenge_logDiv.innerHTML;
		},
		recoverStrength:function(num,event,triggered){
			if(typeof num!='number') return ;
			num=Math.round(num);
			if(num<=0) return ;
			var evt;
			event={name:"recoverStrength",num:num,parent:event};
			event._triggered=triggered;
			if(event._triggered!==null){
				var listSkill=this.arrangeSkills('recoverStrength');
				for(var info of listSkill) if(event._triggered!==null){
					window.ykChallenge_logDiv.innerHTML='<span class='+(info.user.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(info.user.name)+'</span>使用了技能<span class="greentext">【'+get.translation(info.name)+'】</span><br>'+window.ykChallenge_logDiv.innerHTML;
					evt=info.content(event,(info.useTarget||info.user));
					if(evt&&typeof evt.num=='number') event=evt;
					if(info.user.skills[info.name].CD) info.user.skills[info.name].CD.push({name:info.name,CD:info.CD});
					if(event.num<=0) return ;
				}
			}
			this.strength=Math.min(this.strength+event.num,this.info.strength);
			this.strength=Math.max(this.strength,0);
			if(event.num) window.ykChallenge_logDiv.innerHTML='<span class='+(this.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(this.name)+'</span>回复了'+event.num+'点<font color=yellow>气力值</font><br>'+window.ykChallenge_logDiv.innerHTML;
		},
		recoverSoul:function(num,event,triggered){
			if(!this.info.soul) return ;
			if(typeof num!='number') return ;
			num=Math.round(num);
			if(num<=0) return ;
			var evt;
			event={name:"recoverSoul",num:num,parent:event};
			event._triggered=triggered;
			if(event._triggered!==null){
				var listSkill=this.arrangeSkills('recoverSoul');
				for(var info of listSkill) if(event._triggered!==null){
					window.ykChallenge_logDiv.innerHTML='<span class='+(info.user.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(info.user.name)+'</span>使用了技能<span class="greentext">【'+get.translation(info.name)+'】</span><br>'+window.ykChallenge_logDiv.innerHTML;
					evt=info.content(event,(info.useTarget||info.user));
					if(evt&&typeof evt.num=='number') event=evt;
					if(info.user.skills[info.name].CD) info.user.skills[info.name].CD.push({name:info.name,CD:info.CD});
					if(event.num<=0) return ;
				}
			}
			this.soul=Math.min(this.soul+event.num,this.info.soul);
			this.soul=Math.max(this.soul,0);
			if(event.num) window.ykChallenge_logDiv.innerHTML='<span class='+(this.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(this.name)+'</span>回复了'+event.num+'点<font color=yellow>气力值</font><br>'+window.ykChallenge_logDiv.innerHTML;
		},
		loseDefend:function(num,event,triggered){
			if(typeof num!='number') return ;
			num=Math.abs(Math.round(num));
			if(num<=0) return ;
			var evt;
			event={name:"loseDefend",num:num,parent:event};
			event._triggered=triggered;
			if(event._triggered!==null){
				var listSkill=this.arrangeSkills('loseDefend');
				for(var info of listSkill) if(event._triggered!==null){
					window.ykChallenge_logDiv.innerHTML='<span class='+(info.user.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(info.user.name)+'</span>使用了技能<span class="greentext">【'+get.translation(info.name)+'】</span><br>'+window.ykChallenge_logDiv.innerHTML;
					evt=info.content(event,(info.useTarget||info.user));
					if(evt&&typeof evt.num=='number') event=evt;
					if(info.user.skills[info.name].CD) info.user.skills[info.name].CD.push({name:info.name,CD:info.CD});
					if(event.num<=0) return ;
				}
			}
			this.defend=Math.min(this.defend,this.info.defend);
			this.defend=Math.max(this.defend-event.num,0);
			if(event.num) window.ykChallenge_logDiv.innerHTML='<span class='+(this.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(this.name)+'</span>失去了'+event.num+'点<font color=grey>真气值</font><br>'+window.ykChallenge_logDiv.innerHTML;
		},
		consumeMagic:function(num,event,triggered){
			if(typeof num!='number') return ;
			num=Math.abs(Math.round(num));
			if(num<=0) return ;
			var evt;
			event={name:"consumeMagic",num:num,parent:event};
			event._triggered=triggered;
			if(event._triggered!==null){
				var listSkill=this.arrangeSkills('consumeMagic');
				for(var info of listSkill) if(event._triggered!==null){
					window.ykChallenge_logDiv.innerHTML='<span class='+(info.user.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(info.user.name)+'</span>使用了技能<span class="greentext">【'+get.translation(info.name)+'】</span><br>'+window.ykChallenge_logDiv.innerHTML;
					evt=info.content(event,(info.useTarget||info.user));
					if(evt&&typeof evt.num=='number') event=evt;
					if(info.user.skills[info.name].CD) info.user.skills[info.name].CD.push({name:info.name,CD:info.CD});
					if(event.num<=0) return ;
				}
			}
			this.magic=Math.min(this.magic,this.info.magic);
			this.magic=Math.max(this.magic-event.num,0);
			if(event.num) window.ykChallenge_logDiv.innerHTML='<span class='+(this.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(this.name)+'</span>失去了'+event.num+'点<font color=cyan>术法值</font><br>'+window.ykChallenge_logDiv.innerHTML;
		},
		consumeStrength:function(num,event,triggered){
			if(typeof num!='number') return ;
			num=Math.abs(Math.round(num));
			if(num<=0) return ;
			var evt;
			event={name:"consumeStrength",num:num,parent:event};
			event._triggered=triggered;
			if(event._triggered!==null){
				var listSkill=this.arrangeSkills('consumeStrength');
				for(var info of listSkill) if(event._triggered!==null){
					window.ykChallenge_logDiv.innerHTML='<span class='+(info.user.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(info.user.name)+'</span>使用了技能<span class="greentext">【'+get.translation(info.name)+'】</span><br>'+window.ykChallenge_logDiv.innerHTML;
					evt=info.content(event,(info.useTarget||info.user));
					if(evt&&typeof evt.num=='number') event=evt;
					if(info.user.skills[info.name].CD) info.user.skills[info.name].CD.push({name:info.name,CD:info.CD});
					if(event.num<=0) return ;
				}
			}
			this.strength=Math.min(this.strength,this.info.strength);
			this.strength=Math.max(this.strength-event.num,0);
			if(event.num) window.ykChallenge_logDiv.innerHTML='<span class='+(this.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(this.name)+'</span>失去了'+event.num+'点<font color=yellow>气力值</font><br>'+window.ykChallenge_logDiv.innerHTML;
		},
		consumeSoul:function(num,event,triggered){
			if(!this.info.soul) return ;
			if(typeof num!='number') return ;
			num=Math.abs(Math.round(num));
			if(num<=0) return ;
			var evt;
			event={name:"consumeSoul",num:num,parent:event};
			event._triggered=triggered;
			if(event._triggered!==null){
				var listSkill=this.arrangeSkills('consumeSoul');
				for(var info of listSkill) if(event._triggered!==null){
					window.ykChallenge_logDiv.innerHTML='<span class='+(info.user.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(info.user.name)+'</span>使用了技能<span class="greentext">【'+get.translation(info.name)+'】</span><br>'+window.ykChallenge_logDiv.innerHTML;
					evt=info.content(event,(info.useTarget||info.user));
					if(evt&&typeof evt.num=='number') event=evt;
					if(info.user.skills[info.name].CD) info.user.skills[info.name].CD.push({name:info.name,CD:info.CD});
					if(event.num<=0) return ;
				}
			}
			this.soul=Math.min(this.soul,this.info.soul);
			this.soul=Math.max(this.soul-event.num,0);
			if(event.num) window.ykChallenge_logDiv.innerHTML='<span class='+(this.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(this.name)+'</span>回复了'+event.num+'点<font color=yellow>气力值</font><br>'+window.ykChallenge_logDiv.innerHTML;
		},
		die:function(event,triggered){
			var evt;
			event={name:"die",player:this,parent:event};
			event._triggered=triggered;
			if(event._triggered!==null){
				var listSkill=this.arrangeSkills('die');
				for(var info of listSkill) if(event._triggered!==null){
					window.ykChallenge_logDiv.innerHTML='<span class='+(info.user.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(info.user.name)+'</span>使用了技能<span class="greentext">【'+get.translation(info.name)+'】</span><br>'+window.ykChallenge_logDiv.innerHTML;
					evt=info.content(event,(info.useTarget||info.user));
					if(evt) event=evt;
					if(info.user.skills[info.name].CD) info.user.skills[info.name].CD.push({name:info.name,CD:info.CD});
				}
			}
			if(event.player&&event.player!=this){
				event.player.die(event);
				return ;
			}
			else{
				this.seatDiv.style.border='4px solid white';
				this.avatar.delete();
				this.isDead=true;
				this.owner.ykChallengeCharacterList.remove(this);
				game.deadplayers.push(this);
				_status.currentPlayer.remove(this);
				if(_status.currentPlayer==this){
					delete _status.currentPlayer;
					window.ykChallenge_start(_status.characterList);
				}
				var list1=[],list2=[];
				for(var character of game.me.ykChallengeCharacterList) if(!character.isDead) list1.push(character);
				for(var character of game.enemy.ykChallengeCharacterList) if(!character.isDead) list2.push(character);
				if(!list1.length||!list2.length){
					var result;
					if(!list1.length) result=false;
					else result=true;
					for(var func of lib.ykonover) func(result);
				}
			}
			if(event.player) window.ykChallenge_logDiv.innerHTML='<span class='+(event.player.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(event.player.name)+'</span>阵亡！<br>'+window.ykChallenge_logDiv.innerHTML;
		},
		changeItem:function(item,num){
			if(!num||typeof num!='number') return ;
			var translate={
				attack_physics:'物理攻击',
				attack_magic:'术法攻击',
				defend_physics:'物理防御',
				defend_magic:'术法防御',
				cs:'暴击',
				css:'暴击伤害',
				maxMagic:'术法值上限',
				maxStrength:'气力值上限',
				maxDefend:'真气值上限',
				maxSoul:'元力值上限',
				speed:'速度',
			}
			if(!translate[item]) return ;
			if(['maxMagic','maxStrength','maxDefend','maxSoul'].indexOf(item)==-1){
				this[item]+=num;
			}
			else{
				if(item=='maxMagic') this.info.magic+=num;
				if(item=='maxStrength') this.info.strength+=num;
				if(item=='maxDefend') this.info.defend+=num;
				if(item=='maxSoul') this.info.soul+=num;
			}
			if(num) window.ykChallenge_logDiv.innerHTML='<span class='+(this.owner==game.me?'"bluetext"':'"firetext"')+'>'+get.translation(this.name)+'</span>'+(num>0?'增加了':'减少了')+num+'点<span class="yellowtext">'+translate[item]+'</span><br>'+window.ykChallenge_logDiv.innerHTML;
		},
		attack2:function(range,funcObj,source){
			if(!source) source=this;
			var list=this.getRange(range);
			for(var number of list){
				window.ykformationList[number].style.backgroundColor='yellow';
			}
			var othersx={
				frequency:300,
				zIndex:'Before',
				bottom:true,
				turnOverX:(this.toward=='right'?false:true),
				func:function(character){
					var coordinate=window.ykChallenge_getCoordinate(character.seatNumber);
					character.avatar.style.cssText='left:'+coordinate[0]+'px;top:'+coordinate[1]+'px;width:'+coordinate[2]+'px;height:'+coordinate[3]+'px;transition:all 1s;';
					window.yk_formationBg.appendChild(character.avatar);
					var othersx={
						react:true,
						frequency:1000,
						zIndex:'Before',
						bottom:true,
						turnOverX:(character.toward=='right'?false:true),
					}
					if(character.owner!=game.me) othersx.turnOverX=true;
					var urlObj=['https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/character/'+character.name+'/standby/',4,'.png'];
					window.showPlayerAnimation(character,urlObj,othersx);
					character.avatar.appendChild(character.hpDiv);
					character.avatar.appendChild(character.openInfo);
					if(character.hujiaDiv) character.avatar.appendChild(character.hujiaDiv);
				},
				func_arguments:this,
			}
			if(this.owner!=game.me) othersx.turnOverX=true;
			var urlObj=['https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/character/'+this.name+'/attack/',6,'.png'];
			window.showPlayerAnimation(this,urlObj,othersx);
			setTimeout(function(){
				for(var number of list){
					window.ykformationList[number].style.backgroundColor='black';
				}
			},300);
			setTimeout(function(){
				for(var number of list){
					window.ykformationList[number].style.backgroundColor='yellow';
				}
			},500);
			setTimeout(function(){
				for(var number of list){
					window.ykformationList[number].style.backgroundColor='black';
				}
			},700);
			setTimeout(function(){
				for(var number of list){
					window.ykformationList[number].style.backgroundColor='yellow';
				}
			},900);
			_status.nextArguments2=this;
			_status.nextArguments2_list=list;
			if(!_status.nextArguments2_funcObj) _status.nextArguments2_funcObj=funcObj;
			setTimeout(function(){
				var source=_status.nextArguments2,list=[],characterListx,funcObj=_status.nextArguments2_funcObj;
				for(var d of _status.nextArguments2_list) list.push(d);
				delete _status.nextArguments;
				_status.nextArguments=null;
				delete _status.nextArguments_list;
				_status.nextArguments_list=null;
				delete _status.nextArguments_funcObj;
				_status.nextArguments_funcObj=null;
				for(var number of list){
					window.ykformationList[number].style.backgroundColor='black';
				}
				if(source.owner==game.me) characterListx=game.enemy.ykChallengeCharacterList;
				else characterListx=game.me.ykChallengeCharacterList;
				if(funcObj&&typeof funcObj.func=='function') funcObj.func(characterListx,funcObj.Arguments);
			},1900);
		},
		arrangeSkills:function(triggername,source){
			var listSkill=[];
			for(var skill in this.skills){
				var skip=null;
				for(var s of this.skillCDList) if(s.name==skill) skip=true;
				if(skip) continue;
				if(this.skills[skill]&&this.skills[skill].trigger){
					for(var i in this.skills[skill].trigger) if(i=='player'&&this.skills[skill].trigger[i]==triggername&&(this.skills[skill].filter==undefined||(this.skills[skill].filter&&this.skills[skill].filter(event,this)))){
						listSkill.push({name:skill,CD:this.skills[skill].CD,priority:(this.skills[skill].priority||0.1),content:this.skills[skill].content,user:this,useTarget:this});
					}
				}
			}
			if(source) for(var skill in source.skills){
				var skip=null;
				for(var s of source.skillCDList) if(s.name==skill) skip=true;
				if(skip) continue;
				if(source.skills[skill]&&source.skills[skill].trigger){
					for(var i in this.skills[skill].trigger) if(source&&i=='source'&&source.skills[skill].trigger[i]==triggername&&(source.skills[skill].filter==undefined||(source.skills[skill].filter&&source.skills[skill].filter(event,source)))){
						listSkill.push({name:skill,CD:source.skills[skill].CD,priority:(source.skills[skill].priority||0.1),content:source.skills[skill].content,user:source,useTarget:source});
					}
				}
			}
			var characterLists=game.me.ykChallengeCharacterList.concat(game.enemy.ykChallengeCharacterList);
			for(var character of characterLists){
				for(var skillx in character.skills){
					var skip=null;
					for(var s of character.skillCDList) if(s.name==skillx) skip=true;
					if(skip) continue;
					if(character.skills[skillx]&&character.skills[skillx].trigger){
						for(var i in character.skills[skillx].trigger) if(i=='global'&&character.skills[skillx].trigger[i]==triggername&&(character.skills[skillx].filter==undefined||(character.skills[skillx].filter&&character.skills[skillx].filter(event,character)))){
							listSkill.push({name:skillx,CD:character.skills[skillx].CD,priority:(character.skills[skillx].priority||0.1),content:character.skills[skillx].content,user:character,useTarget:character});
						}
					}
				}
			}
			listSkill.randomSort();
			listSkill.sort(function(skillx,skilly){
				var a = skillx.priority;
				var b = skilly.priority;
				if(a<b) return 1;
				if(a>b) return -1;
				return 0;
			});
			return listSkill;
		},
		loseDefendAnimation:function(){
			if(this.defendDeBuffAnimation_showing) return ;
			this.defendDeBuffAnimation_showing=true;
			this.defendDeBuffAnimation=ui.create.div();
			this.defendDeBuffAnimation.style.cssText='left:0px;top:0px;width:100%;height:100%;z-index:99999;';
			this.avatar.appendChild(this.defendDeBuffAnimation);
			var othersx={
				frequency:200,
				zIndex:'Before',
				bottom:true,
				func:function(character){
					character.defendDeBuffAnimation.delete();
					delete character.defendDeBuffAnimation;
					character.defendDeBuffAnimation=null;
					character.defendDeBuffAnimation_showing=false;
				},
				func_arguments:this,
			}
			window.showPictAnimation('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/loseDefend/',10,'.png',this.defendDeBuffAnimation,othersx);
		},
		recoverAnimation:function(){
			if(this.recoverAnimation_showing) return ;
			this.recoverAnimation_showing=true;
			this.recoverAnimationDiv=ui.create.div();
			this.recoverAnimationDiv.style.cssText='left:0px;top:0px;width:100%;height:100%;z-index:99999;';
			this.avatar.appendChild(this.recoverAnimationDiv);
			var othersx={
				frequency:200,
				zIndex:'Before',
				bottom:true,
				func:function(character){
					character.recoverAnimationDiv.delete();
					delete character.recoverAnimationDiv;
					character.recoverAnimationDiv=null;
					character.recoverAnimation_showing=false;
				},
				func_arguments:this,
			}
			window.showPictAnimation('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/recover/',11,'.png',this.recoverAnimationDiv,othersx);
		},
	};
	window.ykChallenge_getCoordinate=function(pos,type){
		if(type=='left') type=0;
		else if(type=='top') type=1;
		else if(type=='width') type=2;
		else if(type=='height') type=3;
		if(typeof type!='number') type=null;
		var posList={
			'1':[113,0,75,100],//left,top,width,height
			'2':[188,0,75,100],
			'3':[266,0,75,100],
			'4':[344,0,75,100],
			'5':[422,0,75,100],
			'6':[500,0,75,100],
			'7':[577,0,75,100],
			'8':[654,0,75,100],
			'9':[92,56,78,104],
			'10':[173,56,79,104],
			'11':[255,56,82,104],
			'12':[339,56,81,104],
			'13':[420,56,81,104],
			'14':[503,56,81,104],
			'15':[585,56,81,104],
			'16':[668,56,80,104],
			'17':[67,111,85,113],
			'18':[155,111,87,113],
			'19':[245,111,86,113],
			'20':[333,111,86,113],
			'21':[421,111,86,113],
			'22':[509,111,87,113],
			'23':[598,111,87,113],
			'24':[687,111,87,113],
			'25':[40,173,94,125],
			'26':[136,173,94,125],
			'27':[232,173,94,125],
			'28':[327,173,94,125],
			'29':[421,173,94,125],
			'30':[516,173,94,125],
			'31':[611,173,94,125],
			'32':[706,173,94,125],
			'33':[10,253,99,132],
			'34':[112,253,99,132],
			'35':[215,253,100,132],
			'36':[318,253,100,132],
			'37':[420,253,100,132],
			'38':[524,253,100,132],
			'39':[626,253,101,132],
			'40':[730,253,101,132],
		}
		if(type||type==0) return posList[''+pos][type];
		else return posList[''+pos];
	}
	window.ykChallenge_getInfo=function(character){
		if(_status.ykChallenge_showInfo){_status.ykChallenge_showInfo.close();return ;}
		_status.ykChallenge_showInfo=ui.create.dialog();
		_status.ykChallenge_showInfo.style.cssText='top:calc( 50% - 195px );left:calc( 50% - 180px );height:390px;width:360px;background-size:100% 100%;';
		window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/characterInfo.png',_status.ykChallenge_showInfo,true,'100% 100%');
		_status.ykChallenge_showInfo.close=function(){
			_status.ykChallenge_showInfo.delete();
			delete _status.ykChallenge_showInfo;
			_status.ykChallenge_showInfo=null;
		}
		var div=ui.create.div('.menu','<span style="font-size:35px;font-weight:400;color:black;">×</span>',_status.ykChallenge_showInfo.close);
		div.style.cssText='top:0px;right:40px;height:40px;width:40px;z-index:9999;';
		_status.ykChallenge_showInfo.appendChild(div);
		window.yk_clickFK(div);
		_status.ykChallenge_showInfo.content=ui.create.div();
		_status.ykChallenge_showInfo.content.style.cssText='left:20%;top:10%;width:60%;height:83%;z-index:9999;';
		_status.ykChallenge_showInfo.appendChild(_status.ykChallenge_showInfo.content);
		_status.ykChallenge_showInfo.content.characterImgBg=ui.create.div();
		_status.ykChallenge_showInfo.content.characterImgBg.style.cssText='left:0px;width:100%;top:0px;height:180px;';
		_status.ykChallenge_showInfo.content.appendChild(_status.ykChallenge_showInfo.content.characterImgBg);
		_status.ykChallenge_showInfo.content.characterImg=ui.create.div();
		_status.ykChallenge_showInfo.content.characterImg.style.cssText='left:calc( 50% - 75px );width:150px;top:0px;height:100%;background-size:cover;';
		_status.ykChallenge_showInfo.content.characterImg.setBackground(character.name,'character');
		_status.ykChallenge_showInfo.content.characterImgBg.appendChild(_status.ykChallenge_showInfo.content.characterImg);
		_status.ykChallenge_showInfo.content.characterInfo=ui.create.div();
		_status.ykChallenge_showInfo.content.characterInfo.style.cssText='left:0px;width:100%;top:180px;height:calc( 100% - 180px );overflow-x:hidden;overflow-y:scroll;';
		var hujia,magic,strength,defend,soul,skillstr='<br>【技能】<br>',attack_magic,attack_physics,occupationT={
			auxiliary:'辅助',
			magician:'法师',
			warrior:'战士',
		};
		if(character.hujia) hujia='<br>护盾：'+character.hujia;
		if(character.info.magic) magic='<br>术法值：'+character.magic+'/'+character.info.magic;
		if(character.info.strength) strength='<br>气力值：'+character.strength+'/'+character.info.strength;
		if(character.info.defend) defend='<br>真气值：'+character.defend+'/'+character.info.defend;
		if(character.info.soul) soul='<br>元力值：'+character.soul+'/'+character.info.soul;
		if(character.info.attack_magic) attack_magic='<br>术法攻击：'+(character.attack_magic||0);
		if(character.info.attack_physics) attack_physics='<br>物理攻击：'+(character.attack_physics||0);
		for(var skill in character.skills){
			var cd;
			for(var CD of character.skillCDList){
				if(CD.name==skill&&CD.CD){
					cd='(冷却剩余'+CD.CD+'轮)';
					//break;
				}
			}
			skillstr+=(lib.translate[skill+'_info']==undefined?'':(get.translation(skill)+(cd||'')+'：'+get.translation(skill+'_info')+'<br>'));
		}
		_status.ykChallenge_showInfo.content.characterInfo.innerHTML='<font color=black>'+get.translation(character.name)+'<br>HP：'+character.hp+'/'+character.maxHp+(hujia||'')+(magic||'')+(strength||'')+(defend||'')+(soul||'')+(attack_magic||'')+(attack_physics||'')+'<br>术法防御：'+character.defend_magic+'<br>物理防御：'+character.defend_physics+'<br>暴击率：'+character.cs+'%<br>暴击伤害：'+(150+character.css)+'%<br>速度：'+(character.speed||0)+'<br>定位：'+(occupationT[character.info.occupation]||'未知')+(skillstr||'')+'</font>';
		lib.setScroll(_status.ykChallenge_showInfo.content.characterInfo);
		_status.ykChallenge_showInfo.content.appendChild(_status.ykChallenge_showInfo.content.characterInfo);
	}
	window.showPlayerAnimation=function(character,urlObj,othersx){
		if(!character.seatNumber){alert('animation：角色信息错误！');return ;}
		if(character.avatar){character.avatar.delete();character.avatar=null;}
		var url,num,pictType;
		if(Array.isArray(urlObj)){
			url=urlObj[0];
			num=urlObj[1];
			pictType=urlObj[2];
		}
		else{
			url=urlObj.url;
			num=urlObj.num;
			pictType=urlObj.pictType;
		}
		character.avatar=ui.create.div();
		var coordinate=window.ykChallenge_getCoordinate(character.seatNumber);
		character.avatar.style.cssText='left:'+coordinate[0]+'px;top:'+coordinate[1]+'px;width:'+coordinate[2]+'px;height:'+coordinate[3]+'px;';
		window.yk_formationBg.appendChild(character.avatar);
		window.showPictAnimation(url,num,pictType,character.avatar,othersx);
	}
	window.yk_enemyChooseCharacter=function(){
		game.enemy={};
		game.enemy.ykChallengeCharacterList=[];
		window.yk_enemyCharacterPhaseImg={}
		var characterList=[],chooseList=[];
		for(var character in window.ykChallenge_characterInfo){
			var info=window.ykChallenge_characterInfo[character],score=0;
			score+=Math.round(info.hp*1.5+(info.attack_physics||0)*3+(info.attack_magic||0)*3+(info.defend_physics||0)*2.5+(info.defend_magic||0)*2.5+(info.cs||0)*600+(info.css||0)*300+(info.magic||0)*1.5+(info.strength||0)*1.2+(info.defend||0)*1.5+(info.soul||0)*2+info.speed*500+info.attack_range.length*300);
			chooseList.push({
				name:character,
				score:score,
				occupation:info.occupation,
			});
		}
		chooseList.randomSort();
		chooseList.sort(function (x, y) {
			var chs=chooseList.slice(0,5),occupation=[],a=x.score,b=y.score;
			for(var i of chs) occupation.push(i.occupation);
			if(occupation.indexOf(a.occupation)!=-1) return 1;
			if(Math.random()<a/(a+b)) return -1;
			if(Math.random()<b/(a+b)) return 1;
			return 0;
		});
		chooseList=chooseList.slice(0,5);
		for(var character of chooseList) characterList.push(character.name);
		for(var name of characterList){
			window.yk_enemyCharacterPhaseImg[name]=ui.create.div();
			window.yk_enemyCharacterPhaseImg[name].style.cssText='left:100%;top:20%;width:80%;height:80%;opacity:0.8;z-index:9999999;transition:all 1s;';
			ui.window.appendChild(window.yk_enemyCharacterPhaseImg[name]);
			window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/characterImg/'+name+'.jpg',window.yk_enemyCharacterPhaseImg[name],true,'cover');
		}
		var list=[],formationList=[];
		for(var i in lib.ykformationList) formationList.push(lib.ykformationList[i].position);
		formationList=formationList.randomGet();
		for(var num of formationList){
			if(num==1) num=16;
			else if(num==2) num=15;
			else if(num==3) num=14;
			else if(num==4) num=24;
			else if(num==5) num=23;
			else if(num==6) num=22;
			else if(num==7) num=32;
			else if(num==8) num=31;
			else if(num==9) num=30;
			list.push(num);
			window.ykformationList[num].style.border='4px solid red';
		}
		window.yk_enemyformationNumberList=list;
		for(var i=0;i<characterList.length;i++){
			var character={
				name:characterList[i],
				seatNumber:window.yk_enemyformationNumberList[i],
				seatDiv:window.ykformationList[window.yk_enemyformationNumberList[i]],
				info:window.ykChallenge_characterInfo[characterList[i]],
				hp:window.ykChallenge_characterInfo[characterList[i]].hp,
				speed:window.ykChallenge_characterInfo[characterList[i]].speed,
				maxHp:(window.ykChallenge_characterInfo[characterList[i]].maxHp||window.ykChallenge_characterInfo[characterList[i]].hp),
				owner:game.enemy,
				attack_physics:window.ykChallenge_characterInfo[characterList[i]].attack_physics,
				attack_magic:window.ykChallenge_characterInfo[characterList[i]].attack_magic,
				defend_physics:window.ykChallenge_characterInfo[characterList[i]].defend_physics,
				defend_magic:window.ykChallenge_characterInfo[characterList[i]].defend_magic,
				cs:window.ykChallenge_characterInfo[characterList[i]].cs,
				css:window.ykChallenge_characterInfo[characterList[i]].css,
				magic:window.ykChallenge_characterInfo[characterList[i]].magic,
				strength:window.ykChallenge_characterInfo[characterList[i]].strength,
				defend:window.ykChallenge_characterInfo[characterList[i]].defend,
				soul:window.ykChallenge_characterInfo[characterList[i]].soul,
			};
			character.avatar=ui.create.div();
			var coordinate=window.ykChallenge_getCoordinate(window.yk_enemyformationNumberList[i]);
			character.avatar.style.cssText='left:'+coordinate[0]+'px;top:'+coordinate[1]+'px;width:'+coordinate[2]+'px;height:'+coordinate[3]+'px;transition:all 1s;';
			window.yk_formationBg.appendChild(character.avatar);
			character.hpDiv=ui.create.div();
			character.hpDiv.style.cssText='left:0px;top:0px;width:0%;height:15px;background-color:red;transition:all 1s;z-index:9999;border-radius:8px;';
			character.hpDiv.style.width=Math.round(character.hp/character.maxHp*100)+'%';
			game.enemy.ykChallengeCharacterList.push(character);
			character.openInfo=ui.create.div();
			character.openInfo.style.cssText='top:15px;right:0px;height:15px;width:15px;z-index:999999;';
			character.openInfo.character=character;
			character.openInfo.onclick=function(){
				window.ykChallenge_getInfo(this.character);
			};
			window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/openInfo.png',character.openInfo,true,'100% 100%');
			
			var othersx={
				frequency:100,
				zIndex:'Before',
				bottom:true,
				turnOverX:true,
				func:function(character){
					var othersx={
						react:true,
						frequency:1000,
						zIndex:'Before',
						bottom:true,
						turnOverX:true,
					}
					var urlObj=['https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/character/'+character.name+'/standby/',4,'.png'];
					window.showPlayerAnimation(character,urlObj,othersx);
					character.avatar.appendChild(character.hpDiv);
					character.avatar.appendChild(character.openInfo);
				},
				func_arguments:character,
			}
			var urlObj=['https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/shouUpTime/',22,'.png'];
			window.showPlayerAnimation(character,urlObj,othersx);
		}
		
	}
	window.yk_skillAnimation=function(targetList,urlObj,others){
		var list=[],left=[],top=[],right=[],bottom=[],url,num,type;
		for(var target of targetList){
			list.push(window.ykChallenge_getCoordinate(target.seatNumber));
		}
		for(var coordinate of list){
			left.push(coordinate[0]);
			top.push(coordinate[1]);
			right.push(coordinate[0]+coordinate[2]);
			bottom.push(coordinate[1]+coordinate[3]);
		}
		left=Math.min(left);
		top=Math.min(top);
		var skillAnimationBg=ui.create.div();
		skillAnimationBg.style.cssText='left:'+left+'px;top:'+top+'px;width:'+(Math.max(right)-left)+'px;height:'+(Math.max(bottom)-top)+'px;';
		window.yk_formationBg.appendChild(skillAnimationBg);
		if(Array.isArray(urlObj)){
			url=urlObj[0];
			num=urlObj[1];
			type=urlObj[2];
		}
		else{
			url=urlObj.url;
			num=urlObj.num;
			type=urlObj.type;
		}
		others.react=false;
		window.showPictAnimation(url,num,pictType,skillAnimationBg,others);
	}
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
		return result
	}
	window.ykChallenge_start=function(characterList){
		if(typeof game.roundNumber!='number') game.roundNumber=0;
		if(!game.outplayers) game.outplayers=[];
		if(!game.deadplayers) game.deadplayers=[];
		if(!characterList||(characterList&&!characterList.length)){
			characterList=game.me.ykChallengeCharacterList.concat(game.enemy.ykChallengeCharacterList);
			characterList.randomSort();
			game.roundNumber++;
			if(window.ykChallenge_logDiv) window.ykChallenge_logDiv.innerHTML='第'+window.changeNumToHan(game.roundNumber)+'轮游戏<br>'+window.ykChallenge_logDiv.innerHTML;
			for(var character of characterList){
				if(!character.toward){
					if(character.owner==game.me) character.toward='right';
					else character.toward='left';
				}
				if(!Array.isArray(character.tempItemList)) character.tempItemList=[];
				for(var temp of character.tempItemList){
					if(temp.time) temp.time--;
					if(temp.time<=0||!temp.time){
						var func=temp.func,Arguments=temp.Arguments;
						func(Arguments);
						character.tempItemList.remove(temp);
					}
				}
				if(!Array.isArray(character.skillCDList)) character.skillCDList=[];
				for(var CD of character.skillCDList){
					if(CD.CD) CD.CD--;
					if(CD.CD<=0||!CD.CD){
						character.skillCDList.remove(CD);
					}
				}
			}
			if(game.roundNumber>1){
				character.recoverMagic(50,null,null);
				character.recoverStrength(30,null,null);
				if(character.soul&&character.maxSoul) character.recoverSoul(40,null,null);
				character.recoverDefend(100,null,null);
			}
		}
		for(var func in window.ykChallenge_funcsList){
			if(game.roundNumber==1) for(var character of characterList){
				character[func]=window.ykChallenge_funcsList[func];
				character.skills=character.info.skills;
				for(var skill in character.skills){
					if(character.skills[skill]&&character.skills[skill].init){
						character.skills[skill].init(character);
					}
				}
			}
		}
		characterList.sort(function(x,y){
			var a=x.speed;
			var b=y.speed;
			if(a<b) return 1;
			if(a>b) return -1;
			return 0;
		});
		var next_character=characterList[0];
		characterList=characterList.slice(1,characterList.length);
		_status.characterList=characterList;
		setTimeout(function(){if(window.yk_characterPhaseImg[next_character.name]) window.yk_characterPhaseImg[next_character.name].style.left='20%';},100);
		setTimeout(function(){
			if(window.yk_characterPhaseImg[next_character.name]){
				window.yk_characterPhaseImg[next_character.name].delete();
				window.yk_characterPhaseImg[next_character.name]=null;
				window.yk_characterPhaseImg[next_character.name]=ui.create.div();
				window.yk_characterPhaseImg[next_character.name].style.cssText='left:100%;top:20%;width:80%;height:80%;opacity:0.8;z-index:9999999;transition:all 1s;';
				ui.window.appendChild(window.yk_characterPhaseImg[next_character.name]);
				window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/characterImg/'+next_character.name+'.jpg',window.yk_characterPhaseImg[next_character.name],true,'cover');
			}
		},2100);
		window.ykformationList[next_character.seatNumber].style.border='4px solid orange';
		
		//战斗记录
		if(!window.ykChallenge_logDiv){
			window.ykChallenge_logDiv=ui.create.div();
			window.ykChallenge_logDiv.style.cssText='left:0px;bottom:0px;width:200px;height:150px;opacity:0.15;';
			window.ykChallenge_logDiv.style['overflow-y']='scroll';
			window.ykChallenge_logDiv.style['overflow-x']='hidden';
			lib.setScroll(window.ykChallenge_logDiv);
			if(lib.device==undefined){
				window.ykChallenge_logDiv.onmouseover=function(){
					window.ykChallenge_logDiv.style.opacity=0.8;
				};
				window.ykChallenge_logDiv.onmouseout=function(){
					window.ykChallenge_logDiv.style.opacity=0.15;
				};
			}
			else{
				window.ykChallenge_logDiv.onclick=function(){
					if(window.ykChallenge_logDiv.style.opacity==0.15) window.ykChallenge_logDiv.style.opacity=0.8;
					else window.ykChallenge_logDiv.style.opacity=0.15;
				}
			}
			document.body.appendChild(window.ykChallenge_logDiv);
			window.ykChallenge_logDiv.innerHTML='战斗开始<br>第'+window.changeNumToHan(game.roundNumber)+'轮游戏';
		}
		window.nextArguments_ykChallengeStart=next_character;
		setTimeout(function(){
			var next_character=window.nextArguments_ykChallengeStart;
			delete window.nextArguments_ykChallengeStart;
			window.nextArguments_ykChallengeStart=null;
			next_character.phase();
		},4000);
	}
	game.ykmodeStart=function(){
		var ykChallengeUrlList={
			alert:0,
			help:0,
			chooseButton1:0,
			'character/qxq_yk_xiaoqiao/standby/':4,
			'character/qxq_yk_yanmengyuejian/standby/':4,
			'character/qxq_yk_wuwangxuanyue/standby/':4,
			'character/qxq_yk_kongshanlingxue/standby/':4,
			'character/qxq_yk_tian/standby/':4,
			'character/qxq_yk_fuling/standby/':4,
			'character/qxq_yk_xiaoqiao/move/':4,
			'character/qxq_yk_yanmengyuejian/move/':4,
			'character/qxq_yk_wuwangxuanyue/move/':4,
			'character/qxq_yk_kongshanlingxue/move/':4,
			'character/qxq_yk_tian/move/':4,
			'character/qxq_yk_fuling/move/':4,
			'character/qxq_yk_xiaoqiao/attack/':6,
			'character/qxq_yk_yanmengyuejian/attack/':6,
			'character/qxq_yk_wuwangxuanyue/attack/':6,
			'character/qxq_yk_kongshanlingxue/attack/':6,
			'character/qxq_yk_tian/attack/':6,
			'character/qxq_yk_fuling/attack/':6,
			showSkillInfo:0,
			'loseHujia/':10,
			'gainHujia/':5,
			'hujiaDiv/':65,
			'loseDefend/':10,
			'recover/':11,
			openInfo:0,
			'shouUpTime/':22,
		};
		if(!lib.config.ykImageCache) game.saveConfig('ykImageCache',{});
		var imgUrlList=[];
		for(var url in ykChallengeUrlList){
			var imgUrl,num=ykChallengeUrlList[url];
			if(!num){
				imgUrl='https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/'+url+'.png';
				if(lib.config.ykImageCache[imgUrl]&&lib.config.ykImageCache[imgUrl+'_src']) continue;
				imgUrlList.push(imgUrl);
			}
			else{
				for(var i=0;i<num;i++){
					imgUrl='https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/'+url+num+'.png';
					if(lib.config.ykImageCache[imgUrl]&&lib.config.ykImageCache[imgUrl+'_src']) continue;
					imgUrlList.push(imgUrl);
				}
			}
		}
		var preLoad=function(imgUrlList){
			if(imgUrlList.length){
				var imgUrl=imgUrlList[0];
				imgUrlList=imgUrlList.slice(1,imgUrlList.length);
			}
			else if(!imgUrlList.length) return ;
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
						game.saveConfig('ykImageCache',lib.config.ykImageCache);
						preLoad.download_num++;
						preLoad.div.innerHTML='<span class="yellowtext">启动游戏前需要加载所有素材，已加载的素材下次启动时无需重复加载，当前正在加载素材…<br>('+preLoad.download_num+'/'+preLoad.pict_num+')</span>';
						if(imgUrlList.length) preLoad(imgUrlList);
						else{
							preLoad.div.innerHTML='<span class="yellowtext">素材加载完毕，即将重启游戏</span>';
							setTimeout(game.reload,2000);
						}
					}
				}
				xhr.send(null);
			},function(e){
				alert('网络状况不稳定！');
				console.log(e);
			},true);
		}
		preLoad.div=ui.create.div();
		preLoad.div.style.cssText='left:calc( 50% - 125px );top:calc( 50% - 75px );height:150px;width:250px;background-color:purple;opacity:0.85;z-index:999999;text-align:center;';
		ui.window.appendChild(preLoad.div);
		preLoad.div.innerHTML='<span class="yellowtext">读取加载列表中…</span>';
		preLoad.download_num=0;
		preLoad.pict_num=imgUrlList.length;
		if(imgUrlList.length) preLoad(imgUrlList);
		else{
			preLoad.div.delete();
			delete preLoad.div;
			preLoad.div=null;
			if(typeof game.ykmodeStart=='function') game.ykmodeStart2();
		}
	}
	game.ykmodeStart2=function(){
		var formationList=[];
		for(var f in lib.ykformationList) formationList.push(lib.ykformationList[f]);
		lib.translate[f]=lib.ykformationList[f].translation;
		window.ykformationListDivBg=ui.create.div();
		window.ykformationListDivBg.style.cssText='left:20%;top:20%;height:60%;width:60%;background-color:black;opacity:0.75;border-radius:8px;';
		ui.window.appendChild(window.ykformationListDivBg);
		window.ykformationListDivTitle=ui.create.div();
		window.ykformationListDivTitle.style.cssText='left:0%;top:0%;height:40px;width:100%;text-align:center;';
		window.ykformationListDivTitle.innerHTML='<span style="font-size:35px;font-weight:400;font-family:shousha;color:white;"><b>请选择一个阵型</b></span>';
		window.ykformationListDivBg.appendChild(window.ykformationListDivTitle);
		window.ykformationListDiv=ui.create.div();
		window.ykformationListDiv.style.cssText='left:0%;top:40px;height:calc( 100% - 40px );width:100%;overflow-x:hidden;overflow-y:scroll;';
		lib.setScroll(window.ykformationListDiv);
		window.ykformationListDivBg.appendChild(window.ykformationListDiv);
		for(var formation in lib.ykformationList){
			var divx=ui.create.div('','',function(){
				window.ykformationListDivBg.delete();
				delete window.ykformationListDivBg;
				window.ykformationListDivBg=undefined;
				window.yk_chooseCharacter(this.name);
			});
			divx.style.cssText='left:0px;top:0px;width:162px;height:188px;position:relative;';
			divx.name=formation;
			window.ykformationListDiv.appendChild(divx);
			var divx_name=ui.create.div();
			divx_name.style.cssText='left:0px;bottom:0px;width:100%;height:20px;text-align:center;';
			divx_name.innerHTML='<span style="font-size:20px;font-weight:400;font-family:shousha;color:white;"><b>'+lib.ykformationList[formation].translation+'</b></span>';
			divx.appendChild(divx_name);
			for(var a=0;a<9;a++){
				var list=lib.ykformationList[formation].position;
				var divm=ui.create.div();
				divm.style.cssText='left:0px;top:0px;height:50px;width:50px;position:relative;border: 2px solid '+(list.indexOf(a+1)!=-1?'orange':'white')+';';
				divx.appendChild(divm);
			}
		}
	}
	window.yk_chooseCharacter=function(formation){
		window.yk_formationResult=ui.create.div();
		window.yk_formationResult.style.cssText='left:calc( 50% - 162px );top:0px;height:318px;width:312px;background-color:black;opacity:0.75;transition:all 2s;';
		ui.window.appendChild(window.yk_formationResult);
		var pos=0;
		window.formationPosList=[];
		window.yk_divShowList=[];
		for(var a=0;a<9;a++){
			var list=lib.ykformationList[formation].position;
			window['divm'+(a+1)]=ui.create.div();
			window['divm'+(a+1)].style.cssText='left:0px;top:0px;height:100px;width:100px;position:relative;border: 2px solid '+(list.indexOf(a+1)!=-1?'orange':'white')+';';
			if(list.indexOf(a+1)!=-1){window.formationPosList.push(a+1);window.yk_divShowList.push(window['divm'+(a+1)]);}
			window['divm'+(a+1)].number=a+1;
			window.yk_formationResult.appendChild(window['divm'+(a+1)]);
			var num=ui.create.div();
			num.style.cssText='left:calc( 50% - 10px );top:calc( 50% - 10px );height:10px;width:10px;text-align:center;';
			if(list.indexOf(a+1)!=-1){
				pos++;
				num.innerHTML='<span style="font-size:20px;font-weight:400;font-family:shousha;color:white;"><b>'+pos+'</b></span>';
			}
			window['divm'+(a+1)].appendChild(num);
		}
		window.yk_chooseCharacterBg=ui.create.div();
		window.yk_chooseCharacterBg.style.cssText='left:0%;top:368px;height:calc( 100% - 368px );width:100%;background-color:black;opacity:0.65;border-radius:8px;text-align:center;';
		ui.window.appendChild(window.yk_chooseCharacterBg);
		window.yk_chooseCharacterTitle=ui.create.div();
		window.yk_chooseCharacterTitle.style.cssText='left:0%;top:0%;height:40px;width:100%;text-align:center;';
		window.yk_chooseCharacterTitle.innerHTML='<span style="font-size:25px;font-weight:400;font-family:shousha;color:white;"><b>请选择至多5名武将</b></span><br><span style="font-size:15px;font-weight:400;font-family:shousha;color:white;">（点击选择该武将，再次点击取消选择）</span>';
		window.yk_chooseCharacterBg.appendChild(window.yk_chooseCharacterTitle);
		window.yk_chooseCharacterContent=ui.create.div();
		window.yk_chooseCharacterContent.style.cssText='left:0%;top:40px;height:calc( 100% - 40px );width:100%;text-align:center;overflow-x:hidden;overflow-y:scroll;';
		lib.setScroll(window.yk_chooseCharacterContent);
		window.yk_chooseCharacterBg.appendChild(window.yk_chooseCharacterContent);
		for(var i in window.yunkong_Character.character){
			window['character_'+i+'_Bg']=ui.create.div();
			window['character_'+i+'_Bg'].style.cssText='left:0px;top:0px;height:200px;width:130px;background-color:black;opacity:0.75;position:relative;';
			window.yk_chooseCharacterContent.appendChild(window['character_'+i+'_Bg']);
			window['character_'+i+'_Title']=ui.create.div();
			window['character_'+i+'_Title'].style.cssText='left:0px;bottom:0px;height:20px;width:100%;text-align:center;';
			window['character_'+i+'_Title'].innerHTML='<span style="font-size:20px;font-weight:400;font-family:shousha;color:white;"><b>'+get.translation(i)+'</b></span>';
			window['character_'+i+'_Bg'].appendChild(window['character_'+i+'_Title']);
			window['character_'+i]=ui.create.div();
			window['character_'+i].style.cssText='left:0px;top:0px;height:calc( 100% - 20px );width:100%;background-size:cover;background-position:center center;';
			window['character_'+i].name=i;
			window['character_'+i+'_Bg'].appendChild(window['character_'+i]);
			window['character_'+i].onclick=function(){
				if(typeof window.ykchooseCharacterNum!='number') window.ykchooseCharacterNum=0;
				var posList=lib.ykformationList[formation].position;
				var bool;
				for(var p of posList) if(!window['divm'+p+'_img']){bool=true;break;}
				for(var x of posList) if(window['divm'+x+'_img']&&window['divm'+x+'_img'].character==this.name){bool=false;break;}
				if(bool){
					window['divm'+p+'_img']=ui.create.div();
					window['divm'+p+'_img'].style.cssText='left:14px;top:0px;height:100px;width:72px;background-size:cover;background-position:center center;';
					window['divm'+p+'_img'].setBackground(this.name,'character');
					window['divm'+p+'_img'].character=this.name;
					if(window['divm'+p]) window['divm'+p].appendChild(window['divm'+p+'_img']);
				}
				else{
					for(var p=0;p<9;p++)if(window['divm'+(p+1)+'_img']&&window['divm'+(p+1)+'_img'].character==this.name){
						window['divm'+(p+1)+'_img'].delete();
						delete window['divm'+(p+1)+'_img'];
						window['divm'+(p+1)+'_img']=undefined;
					}
				}
				window.yk_challengelist=[];
				for(var a=0;a<9;a++) if(window['divm'+(a+1)+'_img']&&window['divm'+(a+1)+'_img'].character) window.yk_challengelist.push(window['divm'+(a+1)+'_img'].character);
				if(window.yk_challengelist.length){
					if(!ui.ykCheckOK) ui.ykCheckOK=ui.create.control('确定',function(){
						window['character_'+i+'_Bg'].delete();
						delete window['character_'+i+'_Bg'];
						window['character_'+i+'_Bg']=undefined;
						window.yk_chooseCharacterBg.delete();
						delete window.yk_chooseCharacterBg;
						window.yk_chooseCharacterBg=undefined;
						window.ykChallengeGamepreStart(window.yk_challengelist);
						this.delete();
					});
				}
				else{
					if(ui.ykCheckOK){
						ui.ykCheckOK.delete();
						delete ui.ykCheckOK;
						ui.ykCheckOK=undefined;
					}
				}
			}
			window['character_'+i].setBackground(i,'character');
		}
	}
	window.ykChallengeGamepreStart=function(characterList){
		game.me={};
		game.me.ykChallengeCharacterList=[];
		if(!characterList) return ;
		if(!characterList.length) return ;
		window.yk_characterPhaseImg={}
		for(var name of characterList){
			window.yk_characterPhaseImg[name]=ui.create.div();
			window.yk_characterPhaseImg[name].style.cssText='left:100%;top:20%;width:80%;height:80%;opacity:0.8;z-index:9999999;transition:all 1s;';
			ui.window.appendChild(window.yk_characterPhaseImg[name]);
			window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/characterImg/'+name+'.jpg',window.yk_characterPhaseImg[name],true,'cover');
		}
		
		var width=ui.window.offsetWidth,height=ui.window.offsetHeight;
		window.yk_formationResult.delete();
		window.yk_formationResult=null;
		window.yk_formationResult=ui.create.div();
		window.yk_formationResult.style.cssText='left:calc( 50% - 432px );top:calc( 50% - 270px );width:864px;height:540px;transform:perspective(800px) rotateX(40deg) scale(0.8) scaleX(1) scaleY(1);opacity:0.55;background-color:black;';
		document.body.appendChild(window.yk_formationResult);
		window.ykformationList={};
		for(var i=0;i<40;i++){
			window.ykformationList[i+1]=ui.create.div();
			window.ykformationList[i+1].style.cssText='left:0%;top:0%;height:100px;width:100px;position:relative;';
			window.ykformationList[i+1].style.border='4px solid white';
			window.yk_formationResult.appendChild(window.ykformationList[i+1]);
			window.ykformationList[i+1].innerHTML=''+(i+1);
		}
		var list=[];
		for(var num of window.formationPosList){
			if(num==1) num=9;
			else if(num==2) num=10;
			else if(num==3) num=11;
			else if(num==4) num=17;
			else if(num==5) num=18;
			else if(num==6) num=19;
			else if(num==7) num=25;
			else if(num==8) num=26;
			else if(num==9) num=27;
			list.push(num);
			window.ykformationList[num].style.border='4px solid cyan';
		}
		window.yk_formationNumberList=list;
		window.yk_formationBg=ui.create.div();
		window.yk_formationBg.style.cssText='left:calc( 50% - 420px );top:calc( 50% - 200px );width:840px;height:400px;';
		document.body.appendChild(window.yk_formationBg);
		
		for(var i=0;i<characterList.length;i++){
			var character={
				name:characterList[i],
				seatNumber:window.yk_formationNumberList[i],
				seatDiv:window.ykformationList[window.yk_formationNumberList[i]],
				info:window.ykChallenge_characterInfo[characterList[i]],
				hp:window.ykChallenge_characterInfo[characterList[i]].hp,
				speed:window.ykChallenge_characterInfo[characterList[i]].speed,
				maxHp:(window.ykChallenge_characterInfo[characterList[i]].maxHp||window.ykChallenge_characterInfo[characterList[i]].hp),
				owner:game.me,
				attack_physics:window.ykChallenge_characterInfo[characterList[i]].attack_physics,
				attack_magic:window.ykChallenge_characterInfo[characterList[i]].attack_magic,
				defend_physics:window.ykChallenge_characterInfo[characterList[i]].defend_physics,
				defend_magic:window.ykChallenge_characterInfo[characterList[i]].defend_magic,
				cs:window.ykChallenge_characterInfo[characterList[i]].cs,
				css:window.ykChallenge_characterInfo[characterList[i]].css,
				magic:window.ykChallenge_characterInfo[characterList[i]].magic,
				strength:window.ykChallenge_characterInfo[characterList[i]].strength,
				defend:window.ykChallenge_characterInfo[characterList[i]].defend,
				soul:window.ykChallenge_characterInfo[characterList[i]].soul,
			};
			character.avatar=ui.create.div();
			var coordinate=window.ykChallenge_getCoordinate(window.yk_formationNumberList[i]);
			character.avatar.style.cssText='left:'+coordinate[0]+'px;top:'+coordinate[1]+'px;width:'+coordinate[2]+'px;height:'+coordinate[3]+'px;transition:all 1s;';
			window.yk_formationBg.appendChild(character.avatar);
			character.hpDiv=ui.create.div();
			character.hpDiv.style.cssText='left:0px;top:0px;width:0%;height:15px;background-color:green;transition:all 1s;z-index:9999;border-radius:8px;';
			character.hpDiv.style.width=Math.round(character.hp/character.maxHp*100)+'%';
			game.me.ykChallengeCharacterList.push(character);
			character.openInfo=ui.create.div();
			character.openInfo.style.cssText='top:15px;right:0px;height:15px;width:15px;z-index:999999;';
			character.openInfo.character=character;
			character.openInfo.onclick=function(){
				window.ykChallenge_getInfo(this.character);
			};
			window.ykCacheSetImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/openInfo.png',character.openInfo,true,'100% 100%');
			
			var othersx={
				frequency:100,
				zIndex:'Before',
				bottom:true,
				func:function(character){
					var othersx={
						react:true,
						frequency:1000,
						zIndex:'Before',
						bottom:true,
					}
					var urlObj=['https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/character/'+character.name+'/standby/',4,'.png'];
					window.showPlayerAnimation(character,urlObj,othersx);
					character.avatar.appendChild(character.hpDiv);
					character.avatar.appendChild(character.openInfo);
				},
				func_arguments:character,
			}
			var urlObj=['https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/shouUpTime/',22,'.png'];
			window.showPlayerAnimation(character,urlObj,othersx);
		}
		setTimeout(function(){window.ykChallenge_start();},3000);
		window.yk_enemyChooseCharacter();
	}
});