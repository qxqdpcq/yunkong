'use strict';
window.YKimport(function(lib,game,ui,get,ai,_status){
	lib.ykTask={
		daily:{
			signIn:{
				name:'签到',
				info:'完成每日签到',
				filter:function(){
					if(!window.playTime) return false;
					if(window.playTime.days==undefined||window.playTime.months==undefined||window.playTime.years==undefined) return false;
					if(!lib.config.yk_signIn_date) lib.config.yk_signIn_date={days:[],};
					if(lib.config.yk_signIn_date.days.indexOf(window.playTime.days)!=-1&&lib.config.yk_signIn_date.months==window.playTime.months&&lib.config.yk_signIn_date.years==window.playTime.years) return false;
					else return true;
				},
				content:function(){
					var div=ui.create.div('.menu');
					div.style.cssText='height:400px;width:700px;left:calc(50% - 350px);top:calc(50% - 200px);z-index:999999;';
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
					for(var i=1;i<num;i++){
						var divx=ui.create.div();
						divx.source=div;
						divx.style.cssText='height:100px;width:100px;left:0px;top:0px;position:relative;text-align:center;';
						divx.innerHTML=i+'号<br>';
						if(lib.config.yk_signIn_date.days.indexOf(i)==-1&&(''+window.playTime.days)!=(''+i)) divx.innerHTML+='未签到';
						else if(lib.config.yk_signIn_date.days.indexOf(i)==-1){
							divx.innerHTML+='<font color=red><b>点击签到</b></font>';
							divx.onclick=function(){
								if(lib.config.yk_signIn_date.days.indexOf(window.playTime.days)==-1) lib.config.yk_signIn_date.days.push(window.playTime.days);
								lib.config.yk_signIn_date.months=window.playTime.months;
								lib.config.yk_signIn_date.years=window.playTime.years;
								game.saveConfig('yk_signIn_date',lib.config.yk_signIn_date);
								this.source.delete();
								alert('签到成功，测试期间暂无奖励哦！');
							}
						}
						else divx.innerHTML+='已签到';
						div.appendChild(divx);
					}
				},
			},
		},
		weekly:{
		},
		monthly:{
		},
		others:{
		},
	}
	window.ykOpenTask=function(){
			var div=ui.create.div('.menu');
			div.style.cssText='height:400px;width:500px;top:calc( 50% - 200px );left:calc( 50% - 250px );z-index:9999;';
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
				var choose=ui.create.div();
				choose.style.cssText='top:0px;height:40px;left:0px;width:100%;z-index:99999;position:relative;text-align:center;border-radius:8px;background-color:white;';
				choose.innerHTML='<b><span style="color:black;font-size:20px;font-weight:400;font-family:shousha">'+x+'</span></b>';
				choose.content=x;
				choose.onclick=function(){
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
						divt.style.cssText='height:50px;left:0px;width:100%;top:0px;position:relative;border-radius:8px;background-color:yellow;';
						window.yktaskList.appendChild(divt);
						var divt_title=ui.create.div();
						divt_title.style.cssText='height:30px;left:0px;width:calc(100% - 60px);top:0px;text-align:center;';
						divt_title.innerHTML='<b><span style="color:black;font-size:20px;font-weight:400;font-family:shousha">'+t.name+'</span></b>';
						divt.appendChild(divt_title);
						var divt_content=ui.create.div();
						divt_content.style.cssText='height:20px;left:0px;width:calc(100% - 60px);top:30px;';
						divt_content.innerHTML='<span style="color:black;font-size:18px;font-weight:400;font-family:shousha">'+t.info+'</span>（'+(t.filter()?'未完成':'已完成')+'）';
						divt.appendChild(divt_content);
						if(t.filter()) divt.onclick=t.content;
					}
				};
				taskChoose.appendChild(choose);
				window.yk_clickFK(choose);
				content.div_list.push(choose);
				if(choose.innerHTML.indexOf('每日任务')!=-1) choose.onclick();
			}
		}
	};
});