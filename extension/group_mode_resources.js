'use strict';
(function(lib,game,ui,get,ai,_status){
	if(!get.yk_olddistance) get.yk_olddistance=get.distance;
	get.distance=function(from,to,method){
		if(_status.mode=='group_mode'){
			let distance=1;
			if(from.side==to.side) distance=1;
			else{
				let enemy=(from.side=='me'?game.enemy:game.group_mode_me);
				if(!enemy) return Infinity;
				let hasEnemy,list=[['3','2','1'],['6','5','4'],['9','8','7']];
				let to_line=0,me_line=0,to_add=0;
				if(list[0].indexOf(to.position)!=-1){
					to_line=1;
					for(let t of list[0]) if(enemy.characterNode[t]&&game.players.indexOf(enemy.characterNode[t])+1){
						if(to!=enemy.characterNode[t]) to_add++;
						else break;
					}
				}
				if(list[1].indexOf(to.position)!=-1){
					to_line=2;
					for(let t of list[1]) if(enemy.characterNode[t]&&game.players.indexOf(enemy.characterNode[t])+1){
						if(to!=enemy.characterNode[t]) to_add++;
						else break;
					}
				}
				if(list[2].indexOf(to.position)!=-1){
					to_line=3;
					for(let t of list[2]) if(enemy.characterNode[t]&&game.players.indexOf(enemy.characterNode[t])+1){
						if(to!=enemy.characterNode[t]) to_add++;
						else break;
					}
				}
				if(list[0].indexOf(from.position)!=-1) me_line=1;
				if(list[1].indexOf(from.position)!=-1) me_line=2;
				if(list[2].indexOf(from.position)!=-1) me_line=3;
				let bool;
				for(let pos_x of list[me_line-1]) if(game.players.indexOf(enemy.characterNode[pos_x])+1) bool=true;
				if(to_line!=me_line&&bool) distance+=3;
				distance+=to_add;
			}
			if(typeof to.distance_func=='function') distance=to.distance_func.apply(get,arguments);
			if(typeof from.distance_func=='function') distance=from.distance_func.apply(get,arguments);
			return distance;
		}
		else get.yk_olddistance.apply(this,arguments);
	};
	lib.element.player.inRange=function(to){
		if(_status.mode=='group_mode'){
			var from=this;
			if(from==to||from.hasSkill('undist')||to.hasSkill('undist')) return false;
			if(!game.players.contains(from)&&!game.dead.contains(from)) return false;
			if(!game.players.contains(to)&&!game.dead.contains(to)) return false;
			var mod1=game.checkMod(from,to,'unchanged','inRange',from);
			if(mod1!='unchanged') return mod1;
			var mod2=game.checkMod(from,to,'unchanged','inRangeOf',to);
			if(mod2!='unchanged') return mod2;
			var range=from.getAttackRange();
			if(range<1) return false;
			var player=from,m,n=1,i;
			var fxy,txy;
			if(game.chess){
				fxy=from.getXY();
				txy=to.getXY();
				n=Math.abs(fxy[0]-txy[0])+Math.abs(fxy[1]-txy[1]);
			}
			else if(to.isMin(true)||from.isMin(true)){}
			else{
				var length=game.players.length;
				var totalPopulation=game.players.length+game.dead.length+1;
				for(var iwhile=0;iwhile<totalPopulation;iwhile++){
					if(player.nextSeat!=to){
						player=player.nextSeat;
						if(player.isAlive()&&!player.isOut()&&!player.hasSkill('undist')&&!player.isMin(true)) n++;
					}
					else{
						break;
					}
				}
				for(i=0;i<game.players.length;i++){
					if(game.players[i].isOut()||game.players[i].hasSkill('undist')||game.players[i].isMin(true)) length--;
				}
				if(from.isDead()) length++;
				if(to.isDead()) length++;
				var left=from.hasSkillTag('left_hand');
				var right=from.hasSkillTag('right_hand');
				if(left===right) n=Math.min(n,length-n);
				else if(left==true) n=length-n;
			}
			n=game.checkMod(from,to,n,'globalFrom',from);
			n=game.checkMod(from,to,n,'globalTo',to);
			m=n;
			m=game.checkMod(from,to,m,'attackFrom',from);
			m=game.checkMod(from,to,m,'attackTo',to);
			var equips1=from.getCards('e',function(card){
				return !ui.selected.cards||!ui.selected.cards.contains(card);
			}),equips2=to.getCards('e',function(card){
				return !ui.selected.cards||!ui.selected.cards.contains(card);
			});
			for(i=0;i<equips1.length;i++){
				var info=get.info(equips1[i]).distance;
				if(!info) continue;
				if(info.globalFrom){
					m+=info.globalFrom;
					n+=info.globalFrom;
				}
			}
			for(i=0;i<equips2.length;i++){
				var info=get.info(equips2[i]).distance;
				if(!info) continue;
				if(info.globalTo){
					m+=info.globalTo;
					n+=info.globalTo;
				}
				if(info.attaclTo){
					m+=info.attaclTo;
				}
			}
			return get.distance(this,to)<=range;
		}
		else lib.element.player.yk_oldinRange.apply(this.arguments);
	};
})(lib,game,ui,get,ai,_status);