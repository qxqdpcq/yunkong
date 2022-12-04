'use strict';
window.YKimport(function(lib,game,ui,get,ai,_status){
game.YK_else=[
	'skin.js',
	'ykChallenge.jpg',
	'towardSky.jpg',
	
	//元素
	'yk_fire.jpg',
	'yk_water.jpg',
	'yk_wood.jpg',
	'yk_wind.jpg',
	'yk_thunder.jpg',
	'yk_stone.jpg',
	'yk_ice.jpg',
	'yk_light.jpg',
	'yk_dark.jpg',
	'yk_soul.jpg',
	
	'qxq_yk_tian.jpg',
	'chunsheng.jpg',
	'xiarong.jpg',
	'qiuku.jpg',
	'dongji.jpg',
	'kongzhen.jpg',
	'zhanshu.jpg',
	'shenli.jpg',
	'guqi.jpg',
	'fuyuan.jpg',
	
	'01',
	'10',
	
	'boss_yk_tikui.jpg',
	'boss_yk_pohuaishen.jpg',
];
if(typeof game.ykHasCharacter=='function'&&game.ykHasCharacter('qxq_yk_yanmengyuejian')){
	game.YK_else.push('qxq_yk_mengyanyouwu_female.jpg');
	game.YK_else.push('qxq_yk_mengyanyouwu_male.jpg');
}
/*if(lib.config.yk_myBag==undefined) lib.config.yk_myBag={};
for(var item in lib.config.yk_myBag){
	if(lib.config.yk_myBag[item]!=undefined){
		if(lib.ykEquip[item]&&lib.ykEquip[item].image) game.YK_else.push(lib.ykEquip[item].image);
		else if(lib.ykBook[item]&&lib.ykBook[item].image) game.YK_else.push(lib.ykBook[item].image);
		else if(lib.yk_otherItemLibrary[item]&&lib.yk_otherItemLibrary[item].image) game.YK_else.push(lib.yk_otherItemLibrary[item].image);
		else game.YK_else.push(item+'.jpg');
	}
}*/
game.YK_qxq_yk_xiaoqiao=[
	'qxq_yk_xiaoqiao.mp3',
	'yktianxiang1.mp3',
	'ykzhuyan1.mp3',
	'ykpiaoling_jili1.mp3',
	'ykpiaoling1.mp3',
	'ykpiaoling2.mp3',
	'qxq_yk_xiaoqiao_huanhongzhuang.jpg',
	'qxq_yk_xiaoqiao_yixianglvren.jpg',
	'qxq_yk_xiaoqiao_chunricaizhuang.jpg',
	'qxq_yk_xiaoqiao_jindengyezhu.jpg',
];
game.YK_qxq_yk_fuling=[
	'qxq_yk_fuling_churuhongchen.jpg',
];
game.YK_qxq_yk_yanmengyuejian=[
	'qxq_yk_yanmengyuejian.mp3',
	'qxq_yk_yanmengyuejian_heizhishi.jpg',
	'qxq_yk_yanmengyuejian_zhumengzhe.jpg',
];
game.YK_qxq_yk_kongshanlingxue=[
	'qxq_yk_kongshanlingxue_zhijianren.jpg',
	//塔罗牌
	'tarot_0.jpg',
	'tarot_1.jpg',
	'tarot_2.jpg',
	'tarot_3.jpg',
	'tarot_4.jpg',
	'tarot_5.jpg',
	'tarot_6.jpg',
	'tarot_7.jpg',
	'tarot_8.jpg',
	'tarot_9.jpg',
	'tarot_10.jpg',
	'tarot_11.jpg',
	'tarot_12.jpg',
	'tarot_13.jpg',
	'tarot_14.jpg',
	'tarot_15.jpg',
	'tarot_16.jpg',
	'tarot_17.jpg',
	'tarot_18.jpg',
	'tarot_19.jpg',
	'tarot_20.jpg',
	'tarot_21.jpg',
	'tarot_special0.jpg',
	'tarot_special1.jpg',
	'tarot_special2.jpg',
	'tarot_special3.jpg',
];
game.YK_qxq_yk_tian=[
	'qxq_yk_tian_huayanxiaozhu.jpg',
	'qxq_yk_tian_guanghanzhexian.jpg',
];
game.YK_qxq_yk_mingyun=[
	'qxq_yk_mingyun_moouyuezhang.jpg'
];
	var YK_Text=document.createElement("div");
	var YK_Text_style={
		width:"calc(25%)",
		height:"calc(5%)",
		display:"table",
		background:'rgba(0,0,0,0.5)',
		position:"absolute",
		top:"0px",
		left:"calc(38%)",
		zIndex:"10",
		textAlign:"center",
		'font-size':'30px',
		'font-family':"'STXinwei','xinwei'",
	};
	for(var k in YK_Text_style){
		YK_Text.style[k]=YK_Text_style[k];
	};
	game.ykdownload=function(){
		"step 0"
		window.yk_personlistList=[];
		if(!lib.config.YKcharacterNameList){lib.config.YKcharacterNameList=[];game.saveConfig('YKcharacterNameList',lib.config.YKcharacterNameList);}
		for(var i=0;i<lib.config.YKcharacterNameList.length;i++){
			var character=lib.config.YKcharacterNameList[i];
			var name=character.slice(0,character.indexOf('-'));
			if(game['YK_'+name]!=undefined&&game['YK_'+name].length>0){
				window.yk_personlistList.push(name);
			}
		}
		if(!lib.qxq_yk_bossList) lib.qxq_yk_bossList=[];
		for(var i=0;i<lib.qxq_yk_bossList.length;i++){
			var name=lib.qxq_yk_bossList[i];
			if(game['YK_'+name]!=undefined&&game['YK_'+name].length>0){
				window.yk_personlistList.push(name);
			}
		}
		game.ykdownload_Button=false;
		game.ykdownloadsucai_Button=false;
		game.ykdownloadelse_Button=false;
		window.picturelist=game.YK_else;
		if(!lib.config.YKcharacterNameList){lib.config.YKcharacterNameList=[];game.saveConfig('YKcharacterNameList',lib.config.YKcharacterNameList);}
		for(var i=0;i<lib.config.YKcharacterNameList.length;i++){
			var character=lib.config.YKcharacterNameList[i];
			var name=character.slice(0,character.indexOf('-'));
			window.picturelist.push(name+'.jpg');
		}
		var num=0;
		var num5=window.picturelist.length;
		document.body.appendChild(YK_Text);
		var download=function(){
			var httpRequest = new XMLHttpRequest();
			httpRequest.open("GET",'https://raw.fastgit.org/qxqdpcq/yunkong/main/extension/'+window.picturelist[0],true);
			httpRequest.send(null);
			httpRequest.onreadystatechange=function(){
				if (httpRequest.readyState==4&&httpRequest.status==200){
					game.download('https://raw.fastgit.org/qxqdpcq/yunkong/main/extension/'+window.picturelist[0],'extension/云空/'+window.picturelist[0],function(){
						num++
						window.picturelist.remove(window.picturelist[0]);
						if(window.picturelist.length>0){
							YK_Text.innerHTML='正在下载云空世界素材（补充部分）（'+num+'/'+num5+'）';
							download();
						}else{
							if(window.yk_personlistList.length>0) game.ykdownload_add();
							else{
								YK_Text.innerHTML='下载完毕';
								if(game.sayyk&&typeof game.sayyk=='function') game.sayyk('云空世界素材下载完毕！');
								document.body.removeChild(YK_Text);
								if(game.sayyk&&typeof game.sayyk=='function') game.sayyk('请稍候，即将自动为您重启游戏！');
								setTimeout(function(){
									game.reload();
								},3000);
							}
						};
					},function(){
						if(confirm('下载'+window.picturelist[0]+'失败，是否继续下载？（取消则关闭扩展包并刷新游戏）')){
							download();
						}else{
							if(game.sayyk&&typeof game.sayyk=='function') game.sayyk('部分文件下载失败。');
							num++;
							window.picturelist.remove(window.picturelist[0]);
							download();
						};
					})
				}
			};
		}
		download();
	};
	game.ykdownload();
	game.ykdownload_add=function(){
		"step 0"
		game.ykdownload_Button=false;
		game.ykdownloadsucai_Button=false;
		game.ykdownloadelse_Button=false;
		document.body.appendChild(YK_Text);
		window.picturelist=game['YK_'+window.yk_personlistList[0]];
		window.num=0;
		window.numx=game['YK_'+window.yk_personlistList[0]].length;
		var download=function(){
			var httpRequest = new XMLHttpRequest();
			httpRequest.open("GET",'https://raw.fastgit.org/qxqdpcq/yunkong/main/extension/'+window.picturelist[0],'extension/云空/'+window.yk_personlistList[0]+'/'+window.picturelist[0],true);
			httpRequest.send(null);
			httpRequest.onreadystatechange=function(){
				if (httpRequest.readyState==4&&httpRequest.status==200){
					game.download('https://raw.fastgit.org/qxqdpcq/yunkong/main/extension/'+window.picturelist[0],'extension/云空/'+window.yk_personlistList[0]+'/'+window.picturelist[0],function(){
						window.num++
						window.picturelist.remove(window.picturelist[0]);
						if(window.picturelist.length>0){
							YK_Text.innerHTML='正在下载云空世界人物皮肤语音——【'+get.translation(window.yk_personlistList[0])+'】（'+window.num+'/'+window.numx+'）';
							download(window.picturelist);
						}else{
							window.yk_personlistList.remove(window.yk_personlistList[0]);
							if(window.yk_personlistList.length>0){
								window.num=0;
								window.numx=game['YK_'+window.yk_personlistList[0]].length;
								window.picturelist=game['YK_'+window.yk_personlistList[0]];
								download();
							}
							else{
								YK_Text.innerHTML='下载完毕';
								if(game.sayyk&&typeof game.sayyk=='function') game.sayyk('云空世界人物皮肤语音下载完毕！');
								document.body.removeChild(YK_Text);
								if(game.sayyk&&typeof game.sayyk=='function') game.sayyk('请稍候，即将自动为您重启游戏！');
								setTimeout(function(){
									game.reload();
								},3000);
							}
						};
					},function(){
						if(confirm('下载'+window.picturelist[0]+'失败，是否继续下载？（取消则关闭扩展包并刷新游戏）')){
							download();
						}else{
							if(game.sayyk&&typeof game.sayyk=='function') game.sayyk('部分文件下载失败。');
							window.num++;
							window.picturelist.remove(window.picturelist[0]);
							download();
						};
					})
				}
			};
		}
		download();
	};
});
