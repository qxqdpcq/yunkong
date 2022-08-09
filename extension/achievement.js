'use strict';
window.YKimport(function(lib,game,ui,get,ai,_status){
	if(!lib.config.ykMyAchievementList||lib.config.ykMyAchievementList==undefined){
		lib.config.ykMyAchievementList=[];
		game.saveConfig('ykMyAchievementList',lib.config.ykMyAchievementList);
	}
	window.finishTask=function(name){
		if(lib.config.ykMyAchievementList.indexOf(name)==-1){
			lib.config.ykMyAchievementList.push(name);
			game.saveConfig('ykMyAchievementList',lib.config.ykMyAchievementList);
		}
	}
	
	if(!lib.config.ykAchievementProcess||lib.config.ykAchievementProcess==undefined){lib.config.ykAchievementProcess={};game.saveConfig('ykAchievementProcess',lib.config.ykAchievementProcess);}
	window.updateAchievement=function(){
		lib.ykAchievementOverall={
			'“天之再世”':{
				conditionContent:"开启云空模式并仅用云空武将，使用控制台或使用武将“天”在云空任意难度的副本挑战、剧情战斗或活动挑战中获得一次胜利！",
				condition:function(){
					lib.onover.push(function(result){
						if(result==true&&window.qxq_yk_mode==true){
							if((window.ykCheatCount&&window.ykCheatCount>0||game.me.name=='qxq_yk_tian')&&window.yk_screenName!=undefined&&['juqing','challenge','Other'].indexOf(window.yk_screenName)!=-1){
								if(lib.config.ykMyAchievementList&&lib.config.ykMyAchievementList.indexOf('“天之再世”')==-1){
									lib.config.ykMyAchievementList.push('“天之再世”');
									game.saydpcq('恭喜解锁新成就：“天之再世”！可前往菜单按钮查看和领取奖励！');
									window.yk_unlockScreen('achievement','“天之再世”');
								}
							}
						};
					});
				},
				difficultRank:'凡级',
				score:10,
				award:'暂无',
				awardFunction:function(){},
				process:(lib.config.ykAchievementProcess['“天之再世”']||false),
			},
			'不讲武德':{
				conditionContent:"开启云空模式并仅用云空武将，在云空任意难度的副本挑战、剧情战斗或活动挑战中使用一次控制台。",
				condition:function(){
					lib.onover.push(function(result){
						if(window.qxq_yk_mode==true){
							if(window.ykCheatCount&&window.ykCheatCount>0&&window.yk_screenName!=undefined&&['juqing','challenge','Other'].indexOf(window.yk_screenName)!=-1){
								if(lib.config.ykMyAchievementList&&lib.config.ykMyAchievementList.indexOf('不讲武德')==-1){
									lib.config.ykMyAchievementList.push('不讲武德');
									game.saydpcq('恭喜解锁新成就：不讲武德！可前往菜单按钮查看和领取奖励！');
									window.yk_unlockScreen('achievement','不讲武德');
								}
							}
						};
					});
				},
				difficultRank:'凡级',
				score:10,
				award:'暂无',
				awardFunction:function(){},
				process:(lib.config.ykAchievementProcess['不讲武德']||false),
			},
			'神话人物':{
				conditionContent:"单个角色评分达到50000",
				condition:function(){
					
				},
				difficultRank:'天级',
				score:1000,
				award:'暂无',
				awardFunction:function(){},
				process:((lib.config.myBestScore==undefined?0:lib.config.myBestScore)+'/50000'),
			},
			'传说之影':{
				conditionContent:"单个角色评分达到30000",
				condition:function(){
					
				},
				difficultRank:'地级',
				score:800,
				award:'暂无',
				awardFunction:function(){},
				process:((lib.config.myBestScore==undefined?0:lib.config.myBestScore)+'/30000'),
			},
			'史诗颂咏':{
				conditionContent:"单个角色评分达到10000",
				condition:function(){
					
				},
				difficultRank:'玄级',
				score:400,
				award:'暂无',
				awardFunction:function(){},
				process:((lib.config.myBestScore==undefined?0:lib.config.myBestScore)+'/10000'),
			},
			'人中龙凤':{
				conditionContent:"单个角色评分达到5000",
				condition:function(){
					
				},
				difficultRank:'黄级',
				score:200,
				award:'暂无',
				awardFunction:function(){},
				process:((lib.config.myBestScore==undefined?0:lib.config.myBestScore)+'/5000'),
			},
			'平凡之客':{
				conditionContent:"单个角色评分达到1000",
				condition:function(){
					
				},
				difficultRank:'凡级',
				score:100,
				award:'暂无',
				awardFunction:function(){},
				process:((lib.config.myBestScore==undefined?0:lib.config.myBestScore)+'/1000'),
			},
			'月见之约':{
				conditionContent:"获得</font><font color=orange>【魇梦月见】</font><font color=red>并与她进行一次邀约</font>",
				condition:function(){
					
				},
				difficultRank:'玄级',
				score:150,
				award:'暂无',
				awardFunction:function(){},
				process:(lib.config.ykAchievementProcess['月见之约']||false),
			},
			'逆天而行':{
				conditionContent:"开启云空模式并在云空副本挑战中打败一次“天”",
				condition:function(){
					lib.onover.push(function(result){
						if(result==true&&window.qxq_yk_mode==true){
							if((window.ykCheatCount==undefined||window.ykCheatCount==0)&&window.yk_screenName!=undefined&&['juqing','challenge','Other'].indexOf(window.yk_screenName)!=-1){
								if(window.yk_Boss_Name=='qxq_yk_tian'&&window.dpcqxyys_BossDifficulty!=undefined)
								if(lib.config.ykMyAchievementList&&lib.config.ykMyAchievementList.indexOf('逆天而行')==-1){
									lib.config.ykMyAchievementList.push('逆天而行');
									game.saydpcq('恭喜解锁新成就：逆天而行！可前往菜单按钮查看和领取奖励！');
									window.yk_unlockScreen('achievement','逆天而行');
								}
							}
						};
					});
				},
				difficultRank:'玄级',
				score:600,
				award:'暂无',
				awardFunction:function(){},
				process:(lib.config.ykAchievementProcess['逆天而行']||false),
			},
			'逆天而行·终':{
				conditionContent:"开启云空模式并在云空副本挑战中打败一次神话难度的“天”",//新秀-宗师-绝境-梦魇-神话
				condition:function(){
					lib.onover.push(function(result){
						if(result==true&&window.qxq_yk_mode==true){
							if((window.ykCheatCount==undefined||window.ykCheatCount==0)&&window.yk_screenName!=undefined&&['juqing','challenge','Other'].indexOf(window.yk_screenName)!=-1){
								if(window.yk_Boss_Name=='qxq_yk_tian'&&window.dpcqxyys_BossDifficulty=='shenhua')
								if(lib.config.ykMyAchievementList&&lib.config.ykMyAchievementList.indexOf('逆天而行·终')==-1){
									lib.config.ykMyAchievementList.push('逆天而行·终');
									game.saydpcq('恭喜解锁新成就：逆天而行·终！可前往菜单按钮查看和领取奖励！');
									window.yk_unlockScreen('achievement','逆天而行·终');
								}
							}
						};
					});
				},
				difficultRank:'天级',
				score:1200,
				award:'暂无',
				awardFunction:function(){},
				process:(lib.config.ykAchievementProcess['逆天而行·终']||false),
			},
		};
		if(window.backgroundA&&window.backgroundA!=undefined&&window.ykcloseAC&&window.ykcloseAC!=undefined&&typeof window.ykcloseAC=='function'){
			window.ykcloseAC();
			setTimeout(window.ykCheckAchievement,200);
		} 
	}
	window.updateAchievement();
	if(lib.config.ykGetAchievementAward==undefined||typeof lib.config.ykGetAchievementAward=='string'){lib.config.ykGetAchievementAward={};game.saveConfig('ykGetAchievementAward',lib.config.ykGetAchievementAward);}
	window.getAward=function(name){//记录item是否已领取，防止重复领取
		lib.config.ykGetAchievementAward[name]='已领取';
		game.saveConfig('ykGetAchievementAward',lib.config.ykGetAchievementAward);
	}
	for(var i in lib.ykAchievementOverall){
		if(lib.config.ykGetAchievementAward[i]==undefined||lib.config.ykGetAchievementAward[i]!='已领取'){lib.config.ykGetAchievementAward[i]='未领取';game.saveConfig('ykGetAchievementAward',lib.config.ykGetAchievementAward);}
	}
	for(var i in lib.ykAchievementOverall){
		if(lib.ykAchievementOverall[i].condition&&typeof lib.ykAchievementOverall[i].condition=='function'){
			lib.ykAchievementOverall[i].condition();
		}
	}
	window.caculateAchievementScore=function(){
		var score=0;
		for(var i in lib.ykAchievementOverall){
			for(var x=0;x<lib.config.ykMyAchievementList;x++){
				if(lib.config.ykMyAchievementList[x]==i){
					var add=0;
					if(lib.ykAchievementOverall[i].difficultRank=='天级') add=1000;
					if(lib.ykAchievementOverall[i].difficultRank=='地级') add=800;
					if(lib.ykAchievementOverall[i].difficultRank=='玄级') add=400;
					if(lib.ykAchievementOverall[i].difficultRank=='黄级') add=200;
					if(lib.ykAchievementOverall[i].difficultRank=='凡级') add=100;
					score+=(lib.ykAchievementOverall[i].score||add);
				}
			}
		}
		return score;
	}
	window.caculateAchievementScoreItem=function(name){//计算单项得分
		if(!name) return ;
		var itemScore=0;
		if(lib.ykAchievementOverall[name].score&&lib.ykAchievementOverall[name].score!=undefined) itemScore=lib.ykAchievementOverall[name].score;
		else{
			if(lib.ykAchievementOverall[name].difficultRank=='天级') itemScore=1000;
			if(lib.ykAchievementOverall[name].difficultRank=='地级') itemScore=800;
			if(lib.ykAchievementOverall[name].difficultRank=='玄级') itemScore=400;
			if(lib.ykAchievementOverall[name].difficultRank=='黄级') itemScore=200;
			if(lib.ykAchievementOverall[name].difficultRank=='凡级') itemScore=100;
		}
		return itemScore;
	}
	window.caculateAchievedNum=function(){
		var num=0;
		for(var i in lib.ykAchievementOverall){
			if(lib.config.ykMyAchievementList.indexOf(i)!=-1&&lib.ykAchievementOverall[i].process==true) num++;
		}
		return num;
	}
	window.caculateAllNum=function(){
		var num=0;
		for(var i in lib.ykAchievementOverall){
			num++;
		}
		return num;
	}
	
	window.ykCheckAchievement=function(){
		alert('此版块仍在测试中，暂未开放，敬请期待！');
		if(window.ykcloseAC&&window.ykcloseAC!=null&&typeof window.ykcloseAC=='function'){window.ykcloseAC();return ;}
		var dialogA={};
		window.backgroundA=ui.create.div('hidden');
		window.backgroundA.classList.add('popped');
		window.backgroundA.classList.add('static');
		window.backgroundA.style.height='calc(100%)';
		window.backgroundA.style.width='calc(100%)';
		window.backgroundA.style.left='0px';
		window.backgroundA.style.top='0px';
		if(lib.device!='android'&&lib.device!='ios'){
			window.backgroundA.setBackgroundImage('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/extension/twinkleStar.jpg');
		}
		else{
			window.backgroundA.style.backgroundImage="url('https://raw.githubusercontent.com/qxqdpcq/yunkong/main/extension/twinkleStar.jpg')";
		}
		if(!window.backgroundA.style.backgroundImage) window.backgroundA.style.backgroundImage="url('"+lib.assetURL+"extension/斗破苍穹X阴阳师/yungkong/twinkleStar.jpg')";
		window.backgroundA.style.backgroundSize="100% 100%";
		window.backgroundA.style['overflow-y']='scroll';
		window.backgroundA.style.backgroundSize="100% 100%";
		window.backgroundA.style['z-index']=99999999;
		ui.window.appendChild(window.backgroundA);
		dialogA.background=window.backgroundA;
		
		window.menuArea=ui.create.div();
		window.menuArea.style.height='5%';
		window.menuArea.style.width='100%';
		window.menuArea.style['text-align']='center';
		window.menuArea.style['z-index']=1000;
		window.menuArea.style.position='relative';
		window.backgroundA.appendChild(window.menuArea);
		
		window.scoreShow=ui.create.div();
		window.scoreShow.style.height='5%';
		window.scoreShow.style.width='70%';
		window.scoreShow.style['text-align']='center';
		window.scoreShow.style['z-index']=1000;
		window.scoreShow.style.position='relative';
		window.scoreShow.innerHTML='<font color=orange>#拖动成就查看详细内容，拖动两侧查看所有成就，点击成就领取对应奖励#<br>当前成就总分：&nbsp'+window.caculateAchievementScore()+'&nbsp&nbsp成就完成数：'+window.caculateAchievedNum()+'/'+window.caculateAllNum()+'&nbsp&nbsp完成进度：'+Math.floor(window.caculateAchievedNum()/window.caculateAllNum())+'%</font>';
		window.backgroundA.appendChild(window.scoreShow);
		
		window.updateAllAchievement=ui.create.div('','',function(){
			window.updateAchievement();
		});
		window.updateAllAchievement.style.height='5%';
		window.updateAllAchievement.style.width='5%';
		window.updateAllAchievement.style.left='5%';
		window.updateAllAchievement.style.top='5%';
		window.updateAllAchievement.style['text-align']='center';
		window.updateAllAchievement.style['z-index']=1000;
		//window.updateAllAchievement.style.position='relative';
		window.updateAllAchievement.innerHTML='<font color=orange>刷新成就</font>';
		window.backgroundA.appendChild(window.updateAllAchievement);
		if(!window.AchievementHiddened) window.AchievementHiddened=false;
		window.changeAchievementShow=function(){
			if(!window.AchievementHiddened||window.AchievementHiddened==false){
				window.hiddenAchievement=ui.create.div('','',function(){
					window.AchievementHiddened=true;
					window.updateAchievement();
				});
				window.hiddenAchievement.style.height='5%';
				window.hiddenAchievement.style.width='10%';
				window.hiddenAchievement.style.left='85%';
				window.hiddenAchievement.style.top='5%';
				window.hiddenAchievement.style['text-align']='center';
				window.hiddenAchievement.style['z-index']=1000;
				//window.hiddenAchievement.style.position='relative';
				window.hiddenAchievement.innerHTML='<font color=orange>隐藏已领取的成就</font>';
			}
			else{
				window.hiddenAchievement=ui.create.div('','',function(){
					window.AchievementHiddened=false;
					window.updateAchievement();
				});
				window.hiddenAchievement.style.height='5%';
				window.hiddenAchievement.style.width='10%';
				window.hiddenAchievement.style.left='85%';
				window.hiddenAchievement.style.top='5%';
				window.hiddenAchievement.style['text-align']='center';
				window.hiddenAchievement.style['z-index']=1000;
				//window.hiddenAchievement.style.position='relative';
				window.hiddenAchievement.innerHTML='<font color=orange>取消隐藏成就</font>';
			}
			window.backgroundA.appendChild(window.hiddenAchievement);
		}
		window.changeAchievementShow();
		
		var pos=-1;
		if(lib.ykAchievementOverallList1==undefined&&lib.ykAchievementOverallList2==undefined&&lib.ykAchievementOverallList3==undefined&&lib.ykAchievementOverallList4==undefined&&lib.ykAchievementOverallList5==undefined){
			lib.ykAchievementOverallList1=[];
			lib.ykAchievementOverallList2=[];
			lib.ykAchievementOverallList3=[];
			lib.ykAchievementOverallList4=[];
			lib.ykAchievementOverallList5=[];
			for(var i in lib.ykAchievementOverall){
				if(!lib.ykAchievementOverall[i].difficultRank) lib.ykAchievementOverall[i].difficultRank='凡级';
				if(lib.ykAchievementOverall[i].difficultRank=='天级') lib.ykAchievementOverallList1.push(i);
				if(lib.ykAchievementOverall[i].difficultRank=='地级') lib.ykAchievementOverallList2.push(i);
				if(lib.ykAchievementOverall[i].difficultRank=='玄级') lib.ykAchievementOverallList3.push(i);
				if(lib.ykAchievementOverall[i].difficultRank=='黄级') lib.ykAchievementOverallList4.push(i);
				if(lib.ykAchievementOverall[i].difficultRank=='凡级') lib.ykAchievementOverallList5.push(i);
			}
		}
		for(var x=1;x<6;x++){
			for(var y=0;y<lib['ykAchievementOverallList'+x].length;y++){
				var i=lib['ykAchievementOverallList'+x][y];
				if((window.AchievementHiddened==false)||lib.config.ykGetAchievementAward[i]=='未领取'){
					pos++;
					var name=i;
					if((lib.ykAchievementOverall[i].process==false||lib.config.ykMyAchievementList.indexOf(i)==-1)&&typeof lib.ykAchievementOverall[i].process!='string'){var conditionContent=(lib.config.ykMyAchievementList.indexOf(name)!=-1?lib.ykAchievementOverall[i].conditionContent:'？？？');}
					else{var conditionContent=lib.ykAchievementOverall[i].conditionContent;}
					var awardContent=((lib.config.ykMyAchievementList.indexOf(name)==-1||lib.ykAchievementOverall[i].process==false)?'？？？':lib.ykAchievementOverall[i].award);
					if(lib.config.ykMyAchievementList.indexOf(i)!=-1&&lib.ykAchievementOverall[i].process==true) var process='已完成';
					if(lib.config.ykMyAchievementList.indexOf(i)==-1&&lib.ykAchievementOverall[i].process==false) var process='未完成';
					if(lib.ykAchievementOverall[i].difficultRank=='凡级') lib.ykAchievementOverall[i].difficultRank='<span style=\"color: #BEBEBE;\">'+lib.ykAchievementOverall[i].difficultRank+'</span>';
					if(lib.ykAchievementOverall[i].difficultRank=='黄级') lib.ykAchievementOverall[i].difficultRank='<span style=\"color: #FFFF00;\">'+lib.ykAchievementOverall[i].difficultRank+'</span>';
					if(lib.ykAchievementOverall[i].difficultRank=='玄级') lib.ykAchievementOverall[i].difficultRank='<span style=\"color: #00FFFF;\">'+lib.ykAchievementOverall[i].difficultRank+'</span>';
					if(lib.ykAchievementOverall[i].difficultRank=='地级') lib.ykAchievementOverall[i].difficultRank='<span style=\"color: #FF00FF;\">'+lib.ykAchievementOverall[i].difficultRank+'</span>';
					if(lib.ykAchievementOverall[i].difficultRank=='天级') lib.ykAchievementOverall[i].difficultRank='<span style=\"color: #FF0000;\">'+lib.ykAchievementOverall[i].difficultRank+'</span>';
					window['achievementList_'+pos]=ui.create.div('','',function(){
						game.saydpcq('暂未开放，无法领取奖励哦！');
						return ;
						if(lib.ykAchievementOverall[this.name]&&lib.ykAchievementOverall[this.name].awardFunction&&typeof lib.ykAchievementOverall[this.name].awardFunction=='function') lib.ykAchievementOverall[this.name].awardFunction();
						window.getAward(this.name);
					});
					window['achievementList_'+pos].style.height='15%';
					window['achievementList_'+pos].style.width='70%';
					window['achievementList_'+pos].style['text-align']='left';
					window['achievementList_'+pos].style['z-index']=1000;
					window['achievementList_'+pos].style['overflow-y']='scroll';
					window['achievementList_'+pos].style.position='relative';
					window['achievementList_'+pos].style['margin-top']='5px';
					window['achievementList_'+pos].link='all';
					window['achievementList_'+pos].style.position='relative';
					window['achievementList_'+pos].name=i;
					window['achievementList_'+pos].innerHTML='<font color=orange>'+name+'&nbsp&nbsp状态：</font>'+(lib.config.ykGetAchievementAward[i]==undefined?'<font color=orange>未知错误！</font>':(lib.config.ykGetAchievementAward[i]=='已领取'?'<font color=green>已领取</font>':'<font color=orange>未领取</font>'))+'<font color=orange>&nbsp&nbsp难度：</font>'+lib.ykAchievementOverall[i].difficultRank+'<br><font color=red>达成条件：'+conditionContent+'</font><br><font color=green>完成奖励：'+awardContent+'<br>得分：'+window.caculateAchievementScoreItem(i)+'</font><br><font color=orange>当前进度：'+((lib.ykAchievementOverall[i].process==false?'未完成':(lib.ykAchievementOverall[i].process==true?'已完成':lib.ykAchievementOverall[i].process))||'未知错误！')+'（此检测存在延迟，若出现错误请刷新成就或重启游戏后再试）'+'</font><br><br>';
					window.backgroundA.appendChild(window['achievementList_'+pos]);
				}
			}
		}
		
		var funcA=function(){
			for(var i in dialogA){
				dialogA[i].delete();
				delete dialogA[i];
			};
			game.resume2();
			window.ykcloseAC=null;
		};
		window.ykcloseAC=funcA;
		var div=ui.create.div('.menubutton.round','×',function(){
			funcA();
		});
		div.style.top='5px';
		div.style.left='calc(100% - 55px)';
		div.style['zIndex']=1000;
		window.backgroundA.appendChild(div);
	}
	window.ykClassifyAchievement=function(){
		
	}
});