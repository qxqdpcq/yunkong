'use strict';
window.YKimport(function(lib,game,ui,get,ai,_status){
	lib.ykTask={
		daily:{
			signIn:{
				name:'签到',
				info:'完成每日签到',
				filter:()=>{
					if(!window.playTime) return false;
					if(window.playTime.days==undefined||window.playTime.months==undefined||window.playTime.years==undefined) return false;
					if(!lib.config.yk_signIn_date) lib.config.yk_signIn_date={days:[],};
					if(lib.config.yk_signIn_date.days.indexOf(window.playTime.days)!=-1&&lib.config.yk_signIn_date.months==window.playTime.months&&lib.config.yk_signIn_date.years==window.playTime.years) return true;
					else return false;
				},
				content:()=>{
					var div=ui.create.div('.menu');
					div.style.cssText='height:400px;width:700px;left:calc(50% - 350px);top:calc(50% - 200px);z-index:999999;overflow-y:scroll;';
					lib.setScroll(div);
					ui.window.appendChild(div);
					var num,closeS=function(){
						div.delete();
					};
					var button=ui.create.div('.menubutton.round','×',closeS);
					button.style.cssText='top:5px;left:calc(100% - 55px);z-index:99999;';
					div.appendChild(button);
					window.yk_clickFK(button);
					if(['1','3','5','7','8','10','12'].indexOf(''+window.playTime.months)!=-1) num=31;
					else if(['4','6','9','11'].indexOf(''+window.playTime.months)!=-1) num=30;
					if((''+window.playTime.months)=='2'){
						if(window.playTime.years%4==0) num=29;
						else num=28;
					}
					if(!lib.config.yk_signIn_date) lib.config.yk_signIn_date={};
					if(window.playTime.months!=lib.config.yk_signIn_date.months||window.playTime.years!=window.playTime.years) lib.config.yk_signIn_date={};
					if(!lib.config.yk_signIn_date.days) lib.config.yk_signIn_date.days=[];
					game.saveConfig('yk_signIn_date',lib.config.yk_signIn_date);
					for(var i=1;i<num+1;i++){
						var divx=ui.create.div();
						divx.source=div;
						divx.style.cssText='height:100px;width:100px;left:0px;top:0px;position:relative;text-align:center;';
						divx.innerHTML=i+'号<br>';
						if(lib.config.yk_signIn_date.days.indexOf(i)==-1&&(''+window.playTime.days)!=(''+i)){
							divx.innerHTML+='未签到';
							divx.style.border='1px solid purple';
						}
						else if(lib.config.yk_signIn_date.days.indexOf(i)==-1){
							divx.innerHTML+='<font color=red><b>点击签到</b></font>';
							divx.onclick=function(){
								if(lib.config.yk_signIn_date.days.indexOf(window.playTime.days)==-1) lib.config.yk_signIn_date.days.push(window.playTime.days);
								lib.config.yk_signIn_date.months=window.playTime.months;
								lib.config.yk_signIn_date.years=window.playTime.years;
								game.saveConfig('yk_signIn_date',lib.config.yk_signIn_date);
								this.source.delete();
								game.yk_gainItem('sky_crying',30);
								alert('签到成功，获得【虚空之泪】x30！');
								window['choose_每日任务'].onclick();
							}
							divx.style.border='1px solid red';
						}
						else{
							divx.innerHTML+='已签到';
							divx.style.border='1px solid cyan';
						}
						div.appendChild(divx);
					}
				},
				onover_func:result=>{
				},
			},
			play:{
				name:'对局',
				info:'参与一场对局',
				filter:()=>{
					if(!lib.config.ykDaily_pre_play) lib.config.ykDaily_pre_play={};
					if(!window.playTime.days||!window.playTime.months||!window.playTime.years) return false;
					return lib.config.ykDaily_pre_play[window.playTime.years+'/'+window.playTime.months+'/'+window.playTime.days]==true;
				},
				content:()=>{
					if(!lib.config.ykDaily_pre_play) lib.config.ykDaily_pre_play={};
					if(!lib.config.ykDaily_pre_play[window.playTime.years+'/'+window.playTime.months+'/'+window.playTime.days]){
						if(typeof game.sayyk=='function') game.sayyk('未完成任务，不能领取奖励！');
						else alert('未完成任务，不能领取奖励！');
						return ;
					}
					if(!lib.config.ykDaily_play) lib.config.ykDaily_play={};
					if(!lib.config.ykDaily_play[window.playTime.years+'/'+window.playTime.months+'/'+window.playTime.days]){
						game.yk_gainItem('sky_crying',30);
						alert('领取成功，获得【虚空之泪】x30！');
						window['choose_每日任务'].onclick();
						lib.config.ykDaily_play[window.playTime.years+'/'+window.playTime.months+'/'+window.playTime.days]=true;
						game.saveConfig('ykDaily_play',lib.config.ykDaily_play);
					}
					else{
						if(typeof game.sayyk=='function') game.sayyk('今日已领取');
						else alert('今日已领取');
					}
				},
				onover_func:result=>{
					if(!window.playTime.days||!window.playTime.months||!window.playTime.years){
						if(typeof game.sayyk=='function') game.sayyk('请检查网络！');
						return ;
					}
					if(!lib.config.ykDaily_pre_play) lib.config.ykDaily_pre_play={};
					if(!lib.config.ykDaily_pre_play[window.playTime.years+'/'+window.playTime.months+'/'+window.playTime.days]){
						lib.config.ykDaily_pre_play[window.playTime.years+'/'+window.playTime.months+'/'+window.playTime.days]=true;
					}
					if(typeof game.sayyk=='function') game.sayyk('已完成今日对局任务，前往任务可获取奖励！');
					game.saveConfig('ykDaily_pre_play',lib.config.ykDaily_pre_play);
				},
			},
			success:{
				name:'对局胜利',
				info:'取得一场对局胜利',
				filter:()=>{
					if(!lib.config.ykDaily_pre_success) lib.config.ykDaily_pre_success={};
					if(!window.playTime.days||!window.playTime.months||!window.playTime.years) return false;
					return lib.config.ykDaily_pre_success[window.playTime.years+'/'+window.playTime.months+'/'+window.playTime.days]==true;
				},
				content:()=>{
					if(!lib.config.ykDaily_pre_success) lib.config.ykDaily_pre_success={};
					if(!lib.config.ykDaily_pre_success[window.playTime.years+'/'+window.playTime.months+'/'+window.playTime.days]){
						if(typeof game.sayyk=='function') game.sayyk('未完成任务，不能领取奖励！');
						else alert('未完成任务，不能领取奖励！');
						return ;
					}
					if(!lib.config.ykDaily_success) lib.config.ykDaily_success={};
					if(!lib.config.ykDaily_success[window.playTime.years+'/'+window.playTime.months+'/'+window.playTime.days]){
						game.yk_gainItem('sky_crying',30);
						alert('领取成功，获得【虚空之泪】x30！');
						window['choose_每日任务'].onclick();
						lib.config.ykDaily_success[window.playTime.years+'/'+window.playTime.months+'/'+window.playTime.days]=true;
						game.saveConfig('ykDaily_success',lib.config.ykDaily_success);
					}
					else{
						if(typeof game.sayyk=='function') game.sayyk('今日已领取');
						else alert('今日已领取');
					}
				},
				onover_func:result=>{
					if(!window.playTime.days||!window.playTime.months||!window.playTime.years){
						if(typeof game.sayyk=='function') game.sayyk('请检查网络！');
						return ;
					}
					if(!lib.config.ykDaily_pre_success) lib.config.ykDaily_pre_success={};
					if(!lib.config.ykDaily_pre_success[window.playTime.years+'/'+window.playTime.months+'/'+window.playTime.days]){
						lib.config.ykDaily_pre_success[window.playTime.years+'/'+window.playTime.months+'/'+window.playTime.days]=true;
					}
					if(typeof game.sayyk=='function') game.sayyk('已完成今日对局任务，前往任务可获取奖励！');
					game.saveConfig('ykDaily_pre_success',lib.config.ykDaily_pre_success);
				},
			},
		},
		weekly:{
			challenge:{
				name:'挑战胜利',
				info:'取得一场BOSS挑战胜利',
				filter:()=>{
					if(!window.playTime.days||!window.playTime.months||!window.playTime.years){
						if(typeof game.sayyk=='function') game.sayyk('请检查网络！');
						return false;
					}
					var last=new Date(window.playTime.years+'/'+window.playTime.months+'/'+window.playTime.days),oneDayTime = 1000*60*60*24,last_other =parseInt(last.getTime()/oneDayTime);
					var order=parseInt((last_other+4)/7);
					if(!lib.config.weeklyChallenge_gainReward) lib.config.weeklyChallenge_gainReward={};
					return lib.config.weeklyChallenge_gainReward[order];
				},
				content:()=>{
					var last=new Date(window.playTime.years+'/'+window.playTime.months+'/'+window.playTime.days),oneDayTime = 1000*60*60*24,last_other =parseInt(last.getTime()/oneDayTime);
					var order=parseInt((last_other+4)/7);
					if(!lib.config.weeklyChallenge_gainReward) lib.config.weeklyChallenge_gainReward={};
					if(!lib.config.weeklyChallenge_Bool) lib.config.weeklyChallenge_Bool={};
					if(!lib.config.weeklyChallenge_gainReward[order]&&lib.config.weeklyChallenge_Bool[order]){
						lib.config.weeklyChallenge_gainReward[order]=true;
						game.saveConfig('weeklyChallenge_gainReward',lib.config.weeklyChallenge_gainReward);
						game.yk_gainItem('sky_crying',150);
						alert('领取成功，获得【虚空之泪】x150！');
						window['choose_每日任务'].onclick();
					}
					else if(typeof game.sayyk=='function') game.sayyk('您未完成任务！');
				},
				onover_func:result=>{
					if(lib.config.mode!='boss') return ;
					if(!window.playTime.days||!window.playTime.months||!window.playTime.years){
						if(typeof game.sayyk=='function') game.sayyk('请检查网络！');
						return ;
					}
					if(!lib.config.weeklyChallenge_Bool) lib.config.weeklyChallenge_Bool={};
					var last=new Date(window.playTime.years+'/'+window.playTime.months+'/'+window.playTime.days),oneDayTime = 1000*60*60*24,last_other =parseInt(last.getTime()/oneDayTime);
					var order=parseInt((last_other+4)/7);
					if(!lib.config.weeklyChallenge_Bool[order]){
						lib.config.weeklyChallenge_Bool[order]=true;
					}
					if(typeof game.sayyk=='function') game.sayyk('已完成每周挑战任务，前往任务可获取奖励！');
					game.saveConfig('weeklyChallenge_Bool',lib.config.weeklyChallenge_Bool);
				},
			},
		},
		monthly:{
		},
		others:{
		},
	}
	for(var type in lib.ykTask){
		for(var t in lib.ykTask[type]){
			if(typeof lib.ykTask[type][t].onover_func=='function') lib.onover.push(lib.ykTask[type][t].onover_func);
		}
	}
	window.ykOpenTask=function(){
		var div=ui.create.div('.menu');
		div.style.cssText='height:400px;width:500px;top:calc( 50% - 200px );left:calc( 50% - 250px );z-index:9999;border-radius:8px;';
		ui.window.appendChild(div);
		var close=function(){
			div.delete();
		};
		var button=ui.create.div('.menubutton.round','×',close);
		button.style.cssText='top:5px;left:calc(100% - 55px);z-index:99999;';
		div.appendChild(button);
		window.yk_clickFK(button);
		var title=ui.create.div();
		title.style.cssText='top:5px;width:calc(100% - 55px);left:0px;z-index:99999;text-align:center;';
		title.innerHTML='<b><span style="color:black;font-size:20px;font-weight:400;font-family:shousha">任务</span></b>';
		div.appendChild(title);
		var content=ui.create.div();
		content.style.cssText='top:60px;height:calc(100% - 60px);left:0px;width:100%;z-index:99999;';
		div.appendChild(content);
		var taskChoose=ui.create.div();
		taskChoose.style.cssText='top:0px;height:100%;left:0px;width:80px;z-index:99999;overflow-y:scroll;';
		lib.setScroll(taskChoose);
		content.appendChild(taskChoose);
		content.div_list=[];
		var list=['每日任务','本周任务','本月任务','活动任务'];
		for(var x of list){
			window['choose_'+x]=ui.create.div();
			window['choose_'+x].style.cssText='top:0px;height:40px;left:0px;width:100%;z-index:99999;position:relative;text-align:center;border-radius:8px;background-color:white;';
			window['choose_'+x].innerHTML='<b><span style="color:black;font-size:20px;font-weight:400;font-family:shousha">'+x+'</span></b>';
			window['choose_'+x].content=x;
			window['choose_'+x].onclick=function(){
				if(window.yktaskList){
					window.yktaskList.delete();
					delete window.yktaskList;
				}
				window.yktaskList=ui.create.div();
				window.yktaskList.style.cssText='top:0px;height:100%;left:80px;width:calc(100% - 80px);z-index:99999;overflow-y:scroll;';
				lib.setScroll(window.yktaskList);
				content.appendChild(window.yktaskList);
				this.style.backgroundColor='black';
				this.innerHTML='<b><span style="color:white;font-size:20px;font-weight:400;font-family:shousha">'+this.content+'</span></b>';
				for(var a of content.div_list) if(a.content!=this.content){
					a.style.backgroundColor='white';
					a.innerHTML='<b><span style="color:black;font-size:20px;font-weight:400;font-family:shousha">'+a.content+'</span></b>';
				}
				var s;
				if(this.innerHTML.indexOf('每日任务')!=-1) s='daily';
				if(this.innerHTML.indexOf('本周任务')!=-1) s='weekly';
				if(this.innerHTML.indexOf('本月任务')!=-1) s='monthly';
				if(this.innerHTML.indexOf('活动任务')!=-1) s='others';
				for(var t in lib.ykTask[s]){
					var divt=ui.create.div(),t=lib.ykTask[s][t];
					divt.style.cssText='height:75px;left:0px;width:100%;top:0px;position:relative;border-radius:8px;background-color:'+(!t.filter()?'yellow':'cyan')+';';
					window.yktaskList.appendChild(divt);
					var divt_title=ui.create.div();
					divt_title.style.cssText='height:30px;left:0px;width:calc(100% - 60px);top:0px;text-align:center;';
					divt_title.innerHTML='<b><span style="color:black;font-size:20px;font-weight:400;font-family:shousha">'+t.name+'</span></b>';
					divt.appendChild(divt_title);
					var divt_content=ui.create.div();
					divt_content.style.cssText='height:45px;left:0px;width:calc(100% - 60px);top:30px;';
					divt_content.innerHTML='<span style="color:black;font-size:18px;font-weight:400;font-family:shousha">'+t.info+'</span>（'+(!t.filter()?'未领取奖励':'已领取奖励')+'）';
					divt.appendChild(divt_content);
					if(!t.filter()) divt.onclick=t.content;
				}
			};
			taskChoose.appendChild(window['choose_'+x]);
			window.yk_clickFK(window['choose_'+x]);
			content.div_list.push(window['choose_'+x]);
			if(window['choose_'+x].innerHTML.indexOf('每日任务')!=-1) window['choose_'+x].onclick();
		}
	};
});
