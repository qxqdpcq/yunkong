'use strict';
window.YKimport(function(lib,game,ui,get,ai,_status){
	window.ykChallengeUrlList={
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
	window.ykChallenge_imgUrlList=[];
	for(var url in window.ykChallengeUrlList){
		var imgUrl,num=window.ykChallengeUrlList[url];
		if(!num){
			imgUrl='https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/'+url+'.png';
			if(lib.config.ykImageCache[imgUrl]&&lib.config.ykImageCache[imgUrl+'_src']) continue;
			window.ykChallenge_imgUrlList.push(imgUrl);
		}
		else{
			for(var i=0;i<num;i++){
				imgUrl='https://raw.githubusercontent.com/qxqdpcq/yunkong/main/ykChallengesucai/'+url+'/'+num+'.png';
				if(lib.config.ykImageCache[imgUrl]&&lib.config.ykImageCache[imgUrl+'_src']) continue;
				window.ykChallenge_imgUrlList.push(imgUrl);
			}
		}
	}
			window.ykChallenge_preLoad=function(imgUrlList){
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
							window.ykChallenge_preLoad.download_num++;
							window.ykChallenge_preLoad.div.innerHTML='<span class="yellowtext">启动游戏前需要加载所有素材，已加载的素材下次启动时无需重复加载，当前正在加载素材…<br>('+window.ykChallenge_preLoad.download_num+'/'+window.ykChallenge_preLoad.pict_num+')</span>';
							if(imgUrlList.length) window.ykChallenge_preLoad(imgUrlList);
							else{
								window.ykChallenge_preLoad.div.delete();
								delete window.ykChallenge_preLoad.div;
								window.ykChallenge_preLoad.div=null;
								if(typeof game.ykmodeStart=='function') game.ykmodeStart();
							}
						}
					}
					xhr.send(null);
				},function(e){
					console.log(e);
				},true);
			}
			window.ykChallenge_preLoad.div=ui.create.div();
			window.ykChallenge_preLoad.div.style.cssText='left:calc( 50% - 100px );top:calc( 50% - 50px );height:100px;width:200px;background-color:purple;opacity:0.85;z-index:999999;text-align:center;';
			ui.window.appendChild(window.ykChallenge_preLoad.div);
			window.ykChallenge_preLoad.div.innerHTML='<span class="yellowtext">读取加载列表中…</span>';
			window.ykChallenge_preLoad.download_num=0;
	window.ykChallenge_preLoad.pict_num=window.ykChallenge_imgUrlList.length;
	if(window.ykChallenge_imgUrlList.length) window.ykChallenge_preLoad(window.ykChallenge_imgUrlList);
});