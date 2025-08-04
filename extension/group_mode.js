(function(lib,game,ui,get,ai,_status){
	lib.help['云空·百战']='双方各选择5名角色入场，按一定阵型排列，双方角色以最前排开始依次交替获得回合。';
	lib.skill.group_mode_autoswap={
		firstDo:true,
		trigger:{
			player:['playercontrol','chooseToUseBegin','chooseToRespondBegin','chooseToDiscardBegin','chooseToCompareBegin','chooseButtonBegin','chooseCardBegin','chooseTargetBegin','chooseCardTargetBegin','chooseControlBegin','chooseBoolBegin','choosePlayerCardBegin','discardPlayerCardBegin','gainPlayerCardBegin'],
		},
		forced:true,
		priority:100,
		popup:false,
		silent:true,
		filter:function(event,player){
			if(event.autochoose&&event.autochoose()) return false;
			if(lib.filter.wuxieSwap(event)) return false;
			if(_status.auto) return false;
			return player.owner==game_me;
		},
		content:function(){
			game.me.setNickname('');
			game.swapControl(player);
			game.me.setNickname('控制中');
			game.delay();
		},
	};
	let game_me;
	if(!game_me) game_me={
		tag:'me',
	};
	if(!game.enemy) game.enemy={
		tag:'enemy',
	};
	lib.yk_formation={
		'天央阵':['1','3','5','7','9'],
		'据守阵':['1','4','5','6','7'],
		'灵绝阵':['1','2','6','8','9'],
		'长蛇阵':['2','3','5','7','8'],
		'十字阵':['2','4','5','6','8'],
		'半月阵':['2','3','4','5','7'],
		'两仪阵':['2','3','4','8','9'],
		'锋矢阵':['1','2','6','7','8'],
		'千机阵':['1','2','5','7','9'],
		'诛仙阵':['1','2','4','8','9'],
	};
	game.importMyPictory=function(str){
		if(str){
			if(str.length==0){alert('您未输入内容！');return ;}
			game.download('http://q1.qlogo.cn/g?b=qq&nk='+str+'&s=4','extension/云空/MyPicture.jpg',function(){},function(){});
			setTimeout(function(){
				if(game_me.myinfo_div&&game_me.myinfo_div.pict){
					game_me.myinfo_div.pict.innerHTML='';
					game_me.myinfo_div.pict.setBackgroundImage('extension/云空/MyPicture.jpg');
					game_me.myinfo_div.pict.style.backgroundSize="100% 100%";
				}
			},1000);
			alert('设置成功！');
		}
	}
	game.importMyName=function(str){
		if(str){
			if(str.length==0){alert('您未输入内容！');return ;}
			game.saveConfig('connect_nickname',str);
			if(game_me.myinfo_div&&game_me.myinfo_div.name) game_me.myinfo_div.name.innerHTML='<span style="font-size:22px;font-weight:100;font-family:shousha">昵称：'+str+'</span>';
			alert('设置成功！');
		}
	}
	game.yk_baizhan_funcList={
		start:()=>{
	        _status.mode='group_mode';
			let getQQInfo=(number,func)=>{
				window.ykgetHttpText('https://api.usuuu.com/qq/'+number,text=>{
					func((new Function('let o='+text+';return o.data;'))());
				},()=>{
					alert('xx');
					setTimeout(()=>{getQQInfo(get.rand(100000,9999999999999),func);},500);
				});
			}
			game.ykopenMyInfo=()=>{
				_status.prepareArena=true;
				game.showHistory(false);
				//ui.create.players(num);
				if(!ui.me) ui.create.me();
				game_me=ui.me;
				game_me.hide();
				ui.create.cardsAsync();
				game.finishCards();
				game_me.myinfo_div=ui.create.ykdiv('',{
					height:'400px',
					width:'250px',
					left:'calc(25% - 125px)',
					top:'calc(50% - 200px)',
					backgroundColor:'cyan',
					borderRadius:'8px',
				});
				ui.window.appendChild(game_me.myinfo_div);
				game.ykgetSize('extension/云空/MyPicture.jpg',()=>{},(exportList)=>{
					var exist=true;
					for(var file of exportList[0].concat(exportList[1])){
						if(file.size==null||file.size==0){
							exist=false;
						}
					}
					game_me.myinfo_div.pict=ui.create.div('.menubutton.round','',function(){
						game.prompt("输入您的QQ号码，使QQ头像作为此头像（设置时需要联网）",game.importMyPictory);
					});
					game_me.myinfo_div.pict.style.cssText='height:100px;width:100px;left:calc(50% - 50px);top:5%;border:2px solid orange;border-radius:8px;';
					if(exist){
						game_me.myinfo_div.pict.setBackgroundImage('extension/云空/MyPicture.jpg');
						game_me.myinfo_div.pict.style.backgroundSize="100% 100%";
					}
					else{
						game_me.myinfo_div.pict.innerHTML='设置<br>头像';
					}
					game_me.myinfo_div.appendChild(game_me.myinfo_div.pict);
				});
				game_me.myinfo_div.name=ui.create.ykdiv('',{
					height:'20px',
					width:'80%',
					top:'calc(10% + 100px)',
					left:'10%',
				});
				game_me.myinfo_div.name.innerHTML='<span style="font-size:22px;font-weight:100;font-family:shousha">昵称：'+(lib.config.connect_nickname||'无名玩家')+'</span>';
				game_me.myinfo_div.name.addEventListener('click',()=>{game.prompt("设置联机昵称",game.importMyName);});
				game_me.myinfo_div.appendChild(game_me.myinfo_div.name);
			};
			(()=>{
				var match_div=ui.create.ykdiv('',{
					height:'100px',
					width:'100px',
					top:'calc(50% - 50px)',
					left:'calc(50% - 50px)',
					borderRadius:'5px',
				},()=>{},'.menubutton.round');
				match_div.innerHTML='<span style="font-size:30px;font-weight:400;">开始<br>匹配</span>';
				match_div.addEventListener('click',()=>{
					let person_num=0;
					for(var i in window.yunkong_Character.character) if(lib.qxq_yk_bossList.indexOf(i)==-1) person_num++;
					if(person_num<5){
						alert('您的角色数暂未达到最低要求哦！先收集5个云空非boss角色吧！');
						return ;
					}
					match_div.delete();
					match_div=null;
					var text=ui.create.ykdiv('',{
						height:'100px',
						width:'100%',
						left:'0px',
						top:'calc(50% - 50px)',
						textAlign:'center',
					});
					text.innerHTML='<span style="font-size:30px;font-weight:400;">正在寻找对手</span>';
					ui.window.appendChild(text);
					var t=0,a=0;
					var interval=setInterval(()=>{
						var s='';
						t++;
						if(t>3){t=0;a++;}
						for(var count=0;count<t;count++) s+='.';
						text.innerHTML='<span style="font-size:30px;font-weight:400;">正在寻找对手'+s+'</span>';
						if(a>1&&Math.random()<0.15){
							text.innerHTML='<span style="font-size:30px;font-weight:400;">匹配成功</span>';
							clearInterval(interval);
							let QQnumberList=["1308410188","472563655","1475064354","2954700422","3117254928","1057885957","884096496","464598631","3032036215","1925745685","1409177083","2870780895","811353424","2177808337","1685121311","1284681566","1143158498","344902030","443737172","717179175","1687113490","3241490882","764235332","565351238"],QQnumber;
							if(Math.random()<0.15) QQnumber=QQnumberList.randomGet();
							else QQnumber=get.rand(100000,9999999999999);
							let translate_QQ={
								'1308410188':'群小乔',
								'472563655':'寰宇星城',
								'1475064354':'咸鱼',
								'2954700422':'诗笺',
								'2738308525':'铝宝',
								'1057885957':'辉烬',
								'884096496':'废城',
								'464598631':'短歌',
								'3032036215':'无中',
								'1925745685':'苏婆',
								'1409177083':'周子鱼yu',
								'2870780895':'刀公公',
								'811353424':'呲牙哥',
								'2177808337':'尧',
								'1685121311':'帷幕',
								'1284681566':'染柒',
								'1143158498':'Show-K',
								'344902030':'雷',
								'443737172':'Sukincen',
								'717179175':'EngJ.K',
								'1687113490':'Wall•E',
								'3241490882':'极光',
								'764235332':'茶宝',
							}
							getQQInfo(QQnumber,obj=>{
								game.enemy={
									name:(translate_QQ[''+QQnumber]||obj.name),
									qq_number:QQnumber,
									avatar:obj.avatar,
									history:{
										battle:get.rand(10,5000),
										winrate:get.rand(0,100)+'%',
									},
									formation:[].randomGet(),
								};
								setTimeout(()=>{
									text.delete();
									game.ykopenMyInfo();
									game.enemy.myinfo_div=ui.create.ykdiv('',{
										height:'400px',
										width:'250px',
										left:'calc(75% - 125px)',
										top:'calc(50% - 200px)',
										backgroundColor:'red',
										borderRadius:'8px',
									});
									ui.window.appendChild(game.enemy.myinfo_div);
									game.enemy.myinfo_div.pict=ui.create.div();
									game.enemy.myinfo_div.pict.style.cssText='height:100px;width:100px;left:calc(50% - 50px);top:5%;border:2px solid orange;border-radius:8px;background-size:100% 100%;';
									window.ykCacheSetImage('http://q1.qlogo.cn/g?b=qq&nk='+game.enemy.qq_number+'&s=4',game.enemy.myinfo_div.pict,true,"100% 100%");
									setTimeout(()=>{
										if(!lib.device){
											game.removeFile('extension/云空/yk_enemy.jpg');
										}
										else{
											game.deleteDB('image','yk_enemy');
										}
									},500);
									game.enemy.myinfo_div.appendChild(game.enemy.myinfo_div.pict);
									game.enemy.myinfo_div.name=ui.create.ykdiv('',{
										height:'20px',
										width:'80%',
										top:'calc(10% + 100px)',
										left:'10%',
									});
									game.enemy.myinfo_div.name.innerHTML='<span style="font-size:22px;font-weight:100;font-family:shousha">昵称：'+(game.enemy.name||'未知')+'</span>';
									game.enemy.myinfo_div.appendChild(game.enemy.myinfo_div.name);
									var time=ui.create.ykdiv('',{
										height:'70px',
										width:'100%',
										left:'0px',
										top:'calc(50% - 35px)',
										zIndex:999,
										textAlign:'center',
									});
									ui.window.appendChild(time);
									time.innerHTML='<span style="font-size:28px;font-weight:200;font-family:shousha">准备中……</span>';
									let x=0,intervalx=setInterval(()=>{
										x++;
										time.innerHTML=(x>3?'<span style=\"color: #FF0000;\">':'')+'<span style="font-size:28px;font-weight:200;font-family:shousha">即将进入战斗<br>'+(6-x)+'</span>';
										if(x>5){
											game_me.myinfo_div.delete();
											delete game_me.myinfo_div;
											game.enemy.myinfo_div.delete();
											delete game.enemy.myinfo_div;
											clearInterval(intervalx);
											time.delete();
											time=null;
											ui.window.hide();
											ui.yk_background=ui.create.ykdiv('',{
												height:'100%',
												width:'100%',
												left:'0px',
												top:'0px',
												zIndex:99999999,
												backgroundSize:'100% 100%',
											});
											document.body.appendChild(ui.yk_background);
											window.ykCacheSetImage('https://gitee.com/qxqdpcq/yunkong/raw/master/ykBackground/yk_Bg'+get.rand(1,16)+'.jpg',ui.yk_background,true,"cover");
											_status.ykprocess=ui.create.ykdiv('',{
												height:'50px',
												top:'calc(95% - 50px)',
												width:'80%',
												left:'10%',
												borderRadius:'50px',
												border:'3px solid orange',
												zIndex:999,
											});
											ui.yk_background.appendChild(_status.ykprocess);
											var str='@keyframes ykprocess{0%{background: linear-gradient(to left bottom,rgb(255,153,18) 0%,rgb(255,97,0) 100%,rgb(255,153,18) 200%,rgb(255,97,0) 300%);}';
											str+='5%{background: linear-gradient(to left bottom,rgb(255,153,18) -10%,rgb(255,97,0) 90%,rgb(255,153,18) 190%,rgb(255,97,0) 290%);}';
											str+='10%{background: linear-gradient(to left bottom,rgb(255,153,18) -20%,rgb(255,97,0) 80%,rgb(255,153,18) 180%,rgb(255,97,0) 280%);}';
											str+='15%{background: linear-gradient(to left bottom,rgb(255,153,18) -30%,rgb(255,97,0) 70%,rgb(255,153,18) 170%,rgb(255,97,0) 270%);}';
											str+='20%{background: linear-gradient(to left bottom,rgb(255,153,18) -40%,rgb(255,97,0) 60%,rgb(255,153,18) 160%,rgb(255,97,0) 260%);}';
											str+='25%{background: linear-gradient(to left bottom,rgb(255,153,18) -50%,rgb(255,97,0) 50%,rgb(255,153,18) 150%,rgb(255,97,0) 250%);}';
											str+='30%{background: linear-gradient(to left bottom,rgb(255,153,18) -60%,rgb(255,97,0) 40%,rgb(255,153,18) 140%,rgb(255,97,0) 240%);}';
											str+='35%{background: linear-gradient(to left bottom,rgb(255,153,18) -70%,rgb(255,97,0) 30%,rgb(255,153,18) 130%,rgb(255,97,0) 230%);}';
											str+='40%{background: linear-gradient(to left bottom,rgb(255,153,18) -80%,rgb(255,97,0) 20%,rgb(255,153,18) 120%,rgb(255,97,0) 220%);}';
											str+='45%{background: linear-gradient(to left bottom,rgb(255,153,18) -90%,rgb(255,97,0) 10%,rgb(255,153,18) 110%,rgb(255,97,0) 210%);}';
											str+='50%{background: linear-gradient(to left bottom,rgb(255,153,18) -100%,rgb(255,97,0) 0%,rgb(255,153,18) 100%,rgb(255,97,0) 200%);}';
											str+='55%{background: linear-gradient(to left bottom,rgb(255,153,18) -110%,rgb(255,97,0) -10%,rgb(255,153,18) 90%,rgb(255,97,0) 190%);}';
											str+='60%{background: linear-gradient(to left bottom,rgb(255,153,18) -120%,rgb(255,97,0) -20%,rgb(255,153,18) 80%,rgb(255,97,0) 180%);}';
											str+='65%{background: linear-gradient(to left bottom,rgb(255,153,18) -130%,rgb(255,97,0) -30%,rgb(255,153,18) 70%,rgb(255,97,0) 170%);}';
											str+='70%{background: linear-gradient(to left bottom,rgb(255,153,18) -140%,rgb(255,97,0) -40%,rgb(255,153,18) 60%,rgb(255,97,0) 160%);}';
											str+='75%{background: linear-gradient(to left bottom,rgb(255,153,18) -150%,rgb(255,97,0) -50%,rgb(255,153,18) 50%,rgb(255,97,0) 150%);}';
											str+='80%{background: linear-gradient(to left bottom,rgb(255,153,18) -160%,rgb(255,97,0) -60%,rgb(255,153,18) 40%,rgb(255,97,0) 140%);}';
											str+='85%{background: linear-gradient(to left bottom,rgb(255,153,18) -170%,rgb(255,97,0) -70%,rgb(255,153,18) 30%,rgb(255,97,0) 130%);}';
											str+='90%{background: linear-gradient(to left bottom,rgb(255,153,18) -180%,rgb(255,97,0) -80%,rgb(255,153,18) 20%,rgb(255,97,0) 120%);}';
											str+='95%{background: linear-gradient(to left bottom,rgb(255,153,18) -190%,rgb(255,97,0) -90%,rgb(255,153,18) 10%,rgb(255,97,0) 110%);}';
											str+='100%{background: linear-gradient(to left bottom,rgb(255,153,18) -200%,rgb(255,97,0) -100%,rgb(255,153,18) 0%,rgb(255,97,0) 100%);}';
											str+='}';
											game.ykaddCSSText(str);
											_status.ykprocess.text=ui.create.ykdiv('',{
												height:'20px',
												width:'100%',
												top:'calc(95% - 75px)',
												left:'0px',
												zIndex:99999,
												textAlign:'center',
											});
											_status.ykprocess.text.innerHTML='<font color=orange>正在加载游戏资源……</font>';
											ui.yk_background.appendChild(_status.ykprocess.text);
											_status.ykprocess.show=ui.create.ykdiv('',{
												height:'calc(100% + 2px)',
												top:'-1px',
												width:'0px',
												left:'-1px',
												borderRadius:'50px',
												zIndex:999,
												animation:'ykprocess 1.5s linear infinite',
												transition:'all 0.1s',
											});
											_status.ykprocess.show.text=ui.create.ykdiv('',{
												height:'calc(100% + 2px)',
												top:'-1px',
												width:'calc(100% + 2px)',
												left:'-1px',
												zIndex:99999,
												textAlign:'center',
											});
											_status.ykprocess.show.text.innerHTML='<span style="font-size:40px;font-weight:200;font-family:shousha">0%</span>';
											_status.ykprocess.appendChild(_status.ykprocess.show.text);
											_status.ykprocess.show.percent=0;
											_status.ykprocess.show.changeWidth=(num,func)=>{
												_status.ykprocess.show.percent+=num;
												if(_status.ykprocess.show.percent>1) _status.ykprocess.show.percent=1;
												if(_status.ykprocess.show.percent==1) _status.ykprocess.show.text.innerHTML='<span style="font-size:40px;font-weight:200;font-family:shousha">加载完成</span>';
												else _status.ykprocess.show.text.innerHTML='<span style="font-size:40px;font-weight:200;font-family:shousha">'+Math.floor(_status.ykprocess.show.percent*100)+'%</span>';
												_status.ykprocess.show.style.width='calc('+Math.floor(_status.ykprocess.show.percent*100)+'% + '+(_status.ykprocess.show.percent>=1?'2':'0')+'px)';
												if(_status.ykprocess.show.percent>=1){
													setTimeout(()=>{
														ui.yk_background.delete();
														delete ui.yk_background;
														ui.window.show();
														if(typeof func=='function') func();
													},500);
												}
											};
											_status.ykprocess.appendChild(_status.ykprocess.show);
											game.yk_baizhan_prepare();
										}
									},1000);
								},1500);
							});
						}
					},1000);
				});
				window.yk_clickFK(match_div);
				ui.window.appendChild(match_div);
			})();
		},
		yk_baizhan_prepare:()=>{
			let task_list=[add=>{
				let load_func=()=>{
					window.ykgetHttpText('https://gitee.com/qxqdpcq/yunkong/raw/master/extension/group_mode_resources.js',text=>{
						eval(text);
						_status.ykprocess.show.changeWidth(add);
						setTimeout(()=>{
							task_list=task_list.slice(1,task_list.length);
							if(task_list[0]) task_list[0](add);
						},500);
					},()=>{
						if(confirm('文件加载失败，是否再次加载？否则将重启游戏。')){
							load_func();
						}
						else setTimeout(()=> game.reload(),2000);
					});
				}
				load_func();
			},add=>{
				let load_func2=()=>{
					window.ykgetHttpText('https://gitee.com/qxqdpcq/yunkong/raw/master/extension/group_mode_imgList.js',text=>{
						eval(text);
						if(!lib.ykgroup_mode_imgList){
							if(confirm('文件加载失败，是否再次加载？否则将重启游戏。')){
								load_func2();
							}
							else setTimeout(()=> game.reload(),2000);
							return ;
						}
						else{
							if(!lib.ykgroup_mode_imgList.length){
								_status.ykprocess.show.changeWidth(add);
								setTimeout(()=>{
									task_list=task_list.slice(1,task_list.length);
									if(task_list[0]) task_list[0](add);
								},500);
							}
							else{
								let check_imgList=[];
								for(var pict of lib.ykgroup_mode_imgList){
									if(!pict.url||(pict.url&&pict.url.indexOf('extension/云空/')==-1)) check_imgList.push({
										url:'extension/云空/'+pict+'.jpg',
									});
									else check_imgList.push(pict);
								}
								game.ykgetSize(check_imgList,(filePath,exportList)=>{
									
								},(exportList)=>{
									let length=exportList[0].concat(exportList[1]).length,list=exportList[0].concat(exportList[1]);
									if(length){
										let add_x=add/length;
										let load_func3=list=>{
											let target=list[0];
											game.download('https://gitee.com/qxqdpcq/yunkong/raw/master/extension/'+target.url.slice(target.url.indexOf('extension/云空/')+13,target.url.length),'extension/云空/'+target.url.slice(target.url.indexOf('extension/云空/')+13,target.url.length),()=>{
												_status.ykprocess.show.changeWidth(add_x);
												if(list.length<=1){
													setTimeout(()=>{
														task_list=task_list.slice(1,task_list.length);
														if(task_list[0]) task_list[0](add);
													},500);
												}
												else{
													list=list.slice(1,list.length);
													load_func3(list);
												}
											},()=>{
												if(confirm('文件加载失败，是否再次加载？否则将重启游戏。')){
													load_func3(list);
												}
												else setTimeout(()=> game.reload(),2000);
												return ;
											});
										}
										load_func3(list);
									}
									else{
										_status.ykprocess.show.changeWidth(add);
										setTimeout(()=>{
											task_list=task_list.slice(1,task_list.length);
											if(task_list[0]) task_list[0](add);
										},500);
									}
								});
							}
						}
					},()=>{
						if(confirm('文件加载失败，是否再次加载？否则将重启游戏。')){
							load_func2();
						}
						else setTimeout(()=> game.reload(),2000);
					});
				}
				load_func2();
			},add=>{
				_status.ykprocess.show.changeWidth(add,game.yk_baizhan_start);
				setTimeout(()=>{
					task_list=task_list.slice(1,task_list.length);
					if(task_list[0]) task_list[0](add);
				},500);
			}];
			let add=1/task_list.length;
			setTimeout(()=>{
				task_list[0](add);
			},3000);
		},
		yk_baizhan_start:()=>{
			(()=>{
				let backgroundDiv=ui.create.ykdiv('',{
					height:'100%',
					width:'100%',
					left:'0px',
					top:'0px',
				});
				ui.window.appendChild(backgroundDiv);
				let info=ui.create.ykdiv('',{
					height:'350px',
					width:'calc(50% - 120px)',
					left:'0px',
					top:'10%',
					'overflow-y':'scroll',
				});
				lib.setScroll(info);
				backgroundDiv.appendChild(info);
				info.innerHTML='<span style="font-size:22px;font-weight:100;font-family:shousha">点击下方选择阵型<br><br><b>模式规则：双方各选择5名角色入场，按一定阵型排列，双方角色以最前排的角色开始依次交替获得回合。<li>名词-前排：靠近敌方的一个竖列，其相对位置为前排。<li>出手次序：前排角色次序优先于后排，若为同一竖列角色，则靠上方的角色优先。<li>我方/敌方一名角色横排上的前方每存在一名其他我方/敌方角色，该角色对敌方/我方角色防御距离+1；<li>敌方角色与我方处于不同横排且敌方与我方当前角色同排上存在其他敌方角色，则该敌方角色防御距离+3；</span>';
				let chooseList=ui.create.ykdiv('',{
					height:'312px',
					width:'312px',
					top:'10%',
					left:'calc(50% - 106px)',
					backgroundColor:'black',
				});
				backgroundDiv.appendChild(chooseList);
				let k=1;
				for(let j=1;j<10;j++){
					if(j==4||j==7) k++;
					game_me[(j-(k-1)*3)+''+k]=ui.create.ykdiv('',{
						height:'100px',
						width:'100px',
						left:104*(j-(k-1)*3-1)+'px',
						top:104*(k-1)+'px',
						border:'2px solid white',
					});
					game_me[(j-(k-1)*3)+''+k].innerHTML='<span style="font-size:24px;font-weight:140;">'+j+'</span>';
					chooseList.appendChild(game_me[(j-(k-1)*3)+''+k]);
				}
				let formationList=ui.create.ykdiv('',{
					height:'calc(90% - 320px)',
					top:'calc(10% + 320px)',
					left:'5%',
					width:'90%',
					backgroundColor:'black',
					'overflow-y':'scroll',
					'border-radius':'8px',
				});
				lib.setScroll(formationList);
				backgroundDiv.appendChild(formationList);
				for(let f in lib.yk_formation){
					let formation=ui.create.ykdiv('',{
						height:(formationList.offsetHeight-10)+'px',
						width:(formationList.offsetHeight-30)+'px',
						top:'10px',
						left:'10px',
						'margin-top':'10px',
						'margin-left':'10px',
						position:'relative',
					});
					formation.name=f;
					formation.pos=lib.yk_formation[f];
					formationList.appendChild(formation);
					formation.addEventListener('click',function(){
						if(confirm('是否选择'+this.name+'？')){
							info.innerHTML='<span style="font-size:22px;font-weight:100;font-family:shousha"><b>当前选择：'+this.name+'</b><br>点击下方选择武将<br><br><b>模式规则：双方各选择5名角色入场，按一定阵型排列，双方角色以最前排的角色开始依次交替获得回合。<li>名词-前排：靠近敌方的一个竖列，其相对位置为前排。<li>出手次序：前排角色次序优先于后排，若为同一竖列角色，则靠上方的角色优先。<li>我方/敌方一名角色横排上的前方每存在一名其他我方/敌方角色，该角色对敌方/我方角色防御距离+1；<li>敌方角色与我方处于不同横排且敌方与我方当前角色同排上存在其他敌方角色，则该敌方角色防御距离+3；</span>';
							formationList.hide();
							game_me.formation_pos=this.pos;
							for(let f_pos of this.pos){
								let translate_formation={
									'1':'11',
									'2':'21',
									'3':'31',
									'4':'12',
									'5':'22',
									'6':'32',
									'7':'13',
									'8':'23',
									'9':'33',
								};
								game_me[translate_formation[''+f_pos]].innerHTML='<font color=orange>'+f_pos+'</font>';
								game_me[translate_formation[''+f_pos]].style.border='1px solid orange';
							}
							chooseCharacter(this.name);
						}
					});
					for(let f_n=1;f_n<10;f_n++){
						formation[f_n]=ui.create.ykdiv('',{
							height:Math.floor((formationList.offsetHeight-42)/3)+'px',
							width:Math.floor((formationList.offsetHeight-42)/3)+'px',
							top:'0px',
							left:'0px',
							'margin-top':'1px',
							'margin-left':'1px',
							position:'relative',
						});
						if(formation.pos.indexOf(''+f_n)!=-1){
							formation[f_n].innerHTML='<font color=orange>'+f_n+'</font>';
							formation[f_n].style.border='1px solid orange';
						}
						else{
							formation[f_n].innerHTML=f_n;
							formation[f_n].style.border='1px solid white';
						}
						formation.appendChild(formation[f_n]);
					}
					let title=ui.create.ykdiv('',{
						height:'20px',
						width:'100%',
						left:'0px',
						bottom:'0px',
						textAlign:'center',
					});
					title.innerHTML='<span style="font-size:18px;font-weight:100;font-family:shousha">'+f+'</span>';
					formation.appendChild(title);
				}
				let chooseCharacter=formation_name=>{
					let characterList=ui.create.ykdiv('',{
						height:'calc(90% - 320px)',
						top:'calc(10% + 320px)',
						left:'5%',
						width:'90%',
						backgroundColor:'black',
						'overflow-y':'scroll',
						'border-radius':'8px',
					});
					lib.setScroll(characterList);
					backgroundDiv.appendChild(characterList);
					window.yk_chooseResult=[];
					for(var i in window.yunkong_Character.character) if(lib.qxq_yk_bossList.indexOf(i)==-1){
						let div_character=ui.create.ykdiv('',{
							left:'0px',
							top:'0px',
							height:'250px',
							width:'180px',
							'margin-top':'10px',
							'margin-left':'10px',
							position:'relative',
							'border-radius':'8px',
							backgroundSize:'cover',
							backgroundPosition:'center',
						});
						window.ykCacheSetImage('https://gitee.com/qxqdpcq/yunkong/raw/master/extension/'+i+'.jpg',div_character,true,"cover");
						characterList.appendChild(div_character);
						div_character.name=i;
						div_character.formation_name=formation_name;
						div_character.addEventListener('click',function(){
							if(!characterList.character_info){
								characterList.character_info=ui.create.ykdiv('',{
									left:'calc(50% + 220px)',
									width:'calc(45% - 220px)',
									top:'10%',
									height:'300px',
									backgroundColor:'black',
									opacity:0.8,
									'overflow-y':'scroll',
								});
								lib.setScroll(characterList.character_info);
								backgroundDiv.appendChild(characterList.character_info);
							}
							characterList.character_info.innerHTML='<img style=width:120px; src="'+lib.assetURL+'extension/云空/'+this.name+'.jpg" ><br>角色名：<b>'+get.translation(this.name)+'</b><br><br>定位：'+(lib.yk_personLocation[this.name]||'暂无')+'<br><br><font color=cyan>术法值：'+lib.config.qxq_YK_person.nature.Mp[this.name]+'</font><br><font color=yellow>气力值：'+lib.config.qxq_YK_person.nature.Strength[this.name]+'</font><br><font color=grey>真气值：'+lib.config.qxq_YK_person.nature.Defend[this.name]+'</font>'+(lib.config.qxq_YK_person.nature.Soul[this.name]?'<br><font color=purple>元力值：'+lib.config.qxq_YK_person.nature.Soul[this.name]+'</font>':'');
							for(let skill of lib.character[this.name][3]) characterList.character_info.innerHTML+='<br><br>【'+get.translation(skill)+'】：'+get.translation(skill+'_info');
							let translate_formation={
								'1':'11',
								'2':'21',
								'3':'31',
								'4':'12',
								'5':'22',
								'6':'32',
								'7':'13',
								'8':'23',
								'9':'33',
							};
							if((window.yk_chooseResult.indexOf(this.name)!=-1&&confirm('已重复选择，是否重新选择？'))||(window.yk_chooseResult.length>=5&&confirm('选择数达到上限！是否清空并重新选择？'))){
								for(let clear=1;clear<10;clear++){
									delete game_me[translate_formation[''+clear]].name;
									if(game_me[translate_formation[''+clear]].pict) game_me[translate_formation[''+clear]].pict.delete();
									delete game_me[translate_formation[''+clear]].pict;
								}
								window.yk_chooseResult=[];
								if(window.yk_baizhan_ok){
									window.yk_baizhan_ok.delete();
									delete window.yk_baizhan_ok;
								}
								return ;
							}
							else if(window.yk_chooseResult.length>=5||window.yk_chooseResult.indexOf(this.name)!=-1) return ;
							let list_fn=lib.yk_formation[this.formation_name];
							window.yk_chooseResult.push(this.name);
							for(let fn of list_fn){
								if(!game_me[translate_formation[''+fn]].name){
									game_me[translate_formation[''+fn]].name=this.name;
									game_me[translate_formation[''+fn]].pict=ui.create.ykdiv('',{
										height:'100%',
										width:'60%',
										top:'0px',
										left:'20%',
										backgroundSize:'cover',
										backgroundPosition:'center',
									});
									game_me[translate_formation[''+fn]].pict.setBackground(this.name,'character');
									game_me[translate_formation[''+fn]].appendChild(game_me[translate_formation[''+fn]].pict);
									break;
								}
							}
							if(window.yk_chooseResult.length>=5&&!window.yk_baizhan_ok){
								window.yk_baizhan_ok=ui.create.control('确定',function(){
									backgroundDiv.delete();
									backgroundDiv=null;
									this.delete();
									game.yk_baizhan_enterGame(window.yk_chooseResult);
								});
							}
						});
					}
				};
			})();
		},
		yk_baizhan_enemySelectFormationCharacter:()=>{
			let list_f=[];
			for(let f in lib.yk_formation) list_f.push(f);
			let bool=list_f.randomGet();
			game.enemy.formation_pos=lib.yk_formation[bool];
			game.enemy.formation_name=bool;
			let characters=[];
			for(var i in window.yunkong_Character.character) if(lib.qxq_yk_bossList.indexOf(i)==-1) characters.push(i);
			return characters.randomGets(5);
		},
		yk_baizhan_enterGame:characterList=>{
			game.enemy.characterList=game.yk_baizhan_enemySelectFormationCharacter();
			game.prepareArena(characterList.length+game.enemy.characterList.length);
			for(let pl of game.players){
				pl.getId();
				pl.style.transform='scale(0.8)';
			}
			game_me.characterList=characterList;
			let myFirst=get.rand(0,1);
			let enemyFirst=(myFirst?0:1);
			let translate_formation_me={
				'1':'11',
				'2':'12',
				'3':'13',
				'4':'21',
				'5':'22',
				'6':'23',
				'7':'31',
				'8':'32',
				'9':'33',
			},translate_formation_enemy={
				'1':'11',
				'2':'12',
				'3':'13',
				'4':'21',
				'5':'22',
				'6':'23',
				'7':'31',
				'8':'32',
				'9':'33',
			};
			game_me.character={};
			game_me.characterName={};
			game_me.characterNode={};
			for(let i=0;i<game_me.characterList.length;i++){
				if(game.players[myFirst]){
					game_me.character[game_me.characterList[i]]=game.players[myFirst];
					game_me.character[game_me.characterList[i]].position=game_me.formation_pos[i];
					game_me.characterName[game_me.formation_pos[i]]=game_me.characterList[i];
					game_me.characterNode[game_me.formation_pos[i]]=game_me.character[game_me.characterList[i]];
					game_me.characterNode[game_me.formation_pos[i]].side='me';
					game.players[myFirst].owner=game_me;
					game.players[myFirst].init(game_me.characterList[i]);
				}
				myFirst+=2;
			}
			game.enemy.character={};
			game.enemy.characterName={};
			game.enemy.characterNode={};
			for(let j=0;j<game.enemy.characterList.length;j++){
				if(game.players[enemyFirst]){
					game.enemy.character[game.enemy.characterList[j]]=game.players[enemyFirst];
					game.enemy.character[game.enemy.characterList[j]].position=game.enemy.formation_pos[j];
					game.enemy.characterName[game.enemy.formation_pos[j]]=game.enemy.characterList[j];
					game.enemy.characterNode[game.enemy.formation_pos[j]]=game.enemy.character[game.enemy.characterList[j]];
					game.enemy.characterNode[game.enemy.formation_pos[j]].side='enemy';
					game.players[enemyFirst].owner=game.enemy;
					game.players[enemyFirst].init(game.enemy.characterList[j]);
				}
				enemyFirst+=2;
			}
			let all_width=ui.window.offsetWidth,all_height=ui.window.offsetHeight,player_width=game.players[0].node.avatar.offsetWidth,player_height=game.players[0].node.avatar.offsetHeight;
			let pos_me={
				'11':{
					top:'calc(50% - '+player_height*3/2+'px)',
					left:'calc(25% - '+player_width*3/2+'px)',
				},
				'12':{
					top:'calc(50% - '+player_height*3/2+'px)',
					left:'calc(25% - '+player_width/2+'px)',
				},
				'13':{
					top:'calc(50% - '+player_height*3/2+'px)',
					left:'calc(25% + '+player_width*1/2+'px)',
				},
				'21':{
					top:'calc(50% - '+player_height/2+'px)',
					left:'calc(25% - '+player_width*3/2+'px)',
				},
				'22':{
					top:'calc(50% - '+player_height/2+'px)',
					left:'calc(25% - '+player_width/2+'px)',
				},
				'23':{
					top:'calc(50% - '+player_height/2+'px)',
					left:'calc(25% + '+player_width*1/2+'px)',
				},
				'31':{
					top:'calc(50% + '+player_height*1/2+'px)',
					left:'calc(25% - '+player_width*3/2+'px)',
				},
				'32':{
					top:'calc(50% + '+player_height*1/2+'px)',
					left:'calc(25% - '+player_width/2+'px)',
				},
				'33':{
					top:'calc(50% + '+player_height*1/2+'px)',
					left:'calc(25% + '+player_width*1/2+'px)',
				},
			},pos_enemy={
				'11':{
					top:'calc(50% - '+player_height*3/2+'px)',
					left:'calc(75% + '+player_width*3/2+'px)',
				},
				'12':{
					top:'calc(50% - '+player_height*3/2+'px)',
					left:'calc(75% + '+player_width/2+'px)',
				},
				'13':{
					top:'calc(50% - '+player_height*3/2+'px)',
					left:'calc(75% - '+player_width*1/2+'px)',
				},
				'21':{
					top:'calc(50% - '+player_height/2+'px)',
					left:'calc(75% + '+player_width*3/2+'px)',
				},
				'22':{
					top:'calc(50% - '+player_height/2+'px)',
					left:'calc(75% + '+player_width/2+'px)',
				},
				'23':{
					top:'calc(50% - '+player_height/2+'px)',
					left:'calc(75% - '+player_width*1/2+'px)',
				},
				'31':{
					top:'calc(50% + '+player_height*1/2+'px)',
					left:'calc(75% + '+player_width*3/2+'px)',
				},
				'32':{
					top:'calc(50% + '+player_height*1/2+'px)',
					left:'calc(75% + '+player_width/2+'px)',
				},
				'33':{
					top:'calc(50% + '+player_height*1/2+'px)',
					left:'calc(75% - '+player_width*1/2+'px)',
				},
			};
			for(let x=0;x<10;x++) if(game_me.characterNode[''+x]){
				game_me.characterNode[''+x].style.top=pos_me[translate_formation_me[''+x]].top;
				game_me.characterNode[''+x].style.left=pos_me[translate_formation_me[''+x]].left;
			}
			for(let y=0;y<10;y++) if(game.enemy.characterNode[''+y]){
				game.enemy.characterNode[''+y].style.top=pos_enemy[translate_formation_enemy[''+y]].top;
				game.enemy.characterNode[''+y].style.left=pos_enemy[translate_formation_enemy[''+y]].left;
			}
			game.addGlobalSkill('group_mode_autoswap');
			if(lib.config.show_sortcard) ui.sortCard.style.display='';
			if(ui.arena&&ui.arena.classList.contains('choose-character')) ui.arena.classList.remove('choose-character');
			if(lib.config.show_cardpile){
				ui.cardPileButton.style.display='';
			}else{
				ui.cardPileButton.style.display='none';
			};
			game.gameDraw();
			let owner=game.players[0].owner;
			game.players.sort((a,b)=>{
				let listPhase=['3','6','9','2','5','8','1','4','7'];
				let p1=listPhase.indexOf(a.position);
				let p2=listPhase.indexOf(b.position);
				if(p2<p1) return 1;
				if(p2==p1&&b.owner==owner) return 1;
				return -1;
			});
			for(let px=0;px<game.players.length;px++){
				if(game.players[px+1]){
					game.players[px].next=game.players[px+1];
					game.players[px].nextSeat=game.players[px+1];
				}
				else{
					game.players[px].next=game.players[0];
					game.players[px].nextSeat=game.players[0];
				}
				if(game.players[px-1]){
					game.players[px].previous=game.players[px-1];
					game.players[px].previousSeat=game.players[px-1];
				}
				else{
					game.players[px].previous=game.players[game.players.length-1];
					game.players[px].previousSeat=game.players[game.players.length-1];
				}
			}
			for(let pla of game.players) get.ykdefineProperty(pla.style, 'transform', {
				get:function(){
					return 'scale(0.8)';
				},
				set:function(){
					return 'scale(0.8)';
				},
			});
			game.phaseLoop(game.players[0]);
			game.loop();
			if(ui.cheat){
				ui.cheat.close();
				delete ui.cheat;
			};
			if(ui.cheat2){
				ui.cheat2.close();
				delete ui.cheat2;
			};
			setTimeout(()=>{
				ui.arena.classList.remove('choose-character');
			},500);
			if(lib.config['extension_十周年UI_enable']){
				setTimeout(()=>{
					_status.event.trigger('gameStart');
				},200);
			}else{
				_status.event.trigger('gameStart');
			};
			game.group_mode_me=game_me;
		},
		ai:{
			get:{
				rawAttitude:function(from,to){
					if(from==undefined||to==undefined) return 0;
					if(from.owner==undefined||to.owner==undefined) return 0;
					if(from.owner==to.owner) return 5;
					return -5;
				},
			},
		},
	};
	for(let game_func in game.yk_baizhan_funcList) if(game_func!='start') game[game_func]=game.yk_baizhan_funcList[game_func];
	game.addMode('yk_baizhan',game.yk_baizhan_funcList,{
		translate:'云空·百战',
		extension:'云空',
		config:{
			only_ykCardPile:{
				name:lib.config.only_ykCardPile==true?'关闭云空牌堆模式':'开启云空牌堆模式',
				intro:"重启以控制开启/关闭云空牌堆模式",
				clear:true,
				onclick:function(){
					if(confirm('是否开启云空牌堆模式？')){
						game.saveConfig('only_ykCardPile',true);
						alert('已开启云空模式和云空牌堆模式，即将重启以生效！');
						setTimeout(function(){game.reload();},1000);
					}
				},
				restart:true,
				frequent:true,
			},
			delete_dlc:{
				name:'删除此dlc',
				intro:"删除此dlc",
				clear:true,
				onclick:function(){
					if(confirm('是否删除此dlc？')){
						lib.config.yk_dlc.remove('group_mode');
						if(lib.config.ykDTSCache&&lib.config.ykDTSCache.content) lib.config.ykDTSCache.content['group_mode']=undefined;
						game.saveConfig('yk_dlc',lib.config.yk_dlc);
						game.saveConfig('ykDTSCache',lib.config.ykDTSCache);
						alert('已删除【云空·百战】，即将重启游戏');
						setTimeout(game.reload,3000);
					}
				},
				restart:true,
				frequent:true,
			},
		},
	});
})(lib,game,ui,get,ai,_status);