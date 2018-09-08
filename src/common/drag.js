import jQuery from 'jquery'

;

(function($, window, document,undefined) {
    // 定义的构造函数
    const Drag = function(ele, opt) {
        this.$ele = ele,
				this.x = 0,
				this.y = 0,
        this.defaults = {
					parent:'parent',
					randomPosition:true,
					direction:'all',
					handler:false,
					dragStart(x,y){},
					dragEnd(x,y){},
					dragMove(x,y){},
				},
				this.options = $.extend({}, this.defaults, opt)
    }
    // 定义方法
    Drag.prototype = {
        run() {
					const $this = this;
					const element = this.$ele;
					const randomPosition  = this.options.randomPosition; // 位置
					const direction = this.options.direction; // 方向
					let handler = this.options.handler;
					let parent = this.options.parent;
					let isDown = false; // 记录鼠标是否按下
					const fun = this.options; // 使用外部函数
					let X = 0;

							
let Y = 0;

							
let moveX;

							
let moveY;
					// 阻止冒泡
					element.find('*').not('img').mousedown((e) => {
						e.stopPropagation();
					});
					// 初始化判断
					if(parent == 'parent'){
						parent = element.parent();
					}else{
						parent = element.parents(parent);
					}
					if(!handler){
						handler = element; 
					}else{
						handler = element.find(handler);
					}
					// 初始化
					parent.css({position:'relative'});
					element.css({position:'absolute'});
					let boxWidth=0; let boxHeight=0; let sonWidth=0; let sonHeight=0;
					// 盒子 和 元素大小初始化
					initSize();
					if(randomPosition){randomPlace();}
					$(window).resize(() => {
						initSize();
						if(randomPosition){randomPlace();}
					});
					// 盒子 和 元素大小初始化函数
					function initSize(){
						boxWidth = parent.outerWidth();
						boxHeight = parent.outerHeight();
						sonWidth = element.outerWidth();
						sonHeight = element.outerHeight();
					}
					// 位置随机函数
					function randomPlace(){
						if(randomPosition){
							const randX = parseInt(Math.random()*(boxWidth-sonWidth));
							const randY = parseInt(Math.random()*(boxHeight-sonHeight));
							if(direction.toLowerCase() == 'x'){
								element.css({left:randX});
							}else if(direction.toLowerCase() == 'y'){
								element.css({top:randY});
							}else{
								element.css({left:randX,top:randY});
							}
						}
					}
					handler.css({cursor:'move'}).mousedown((e) => {
						isDown = true;
						X = e.pageX;
						Y = e.pageY;
						$this.x = element.position().left;
						$this.y = element.position().top;
						element.addClass('on');
						fun.dragStart(parseInt(element.css('left')),parseInt(element.css('top')));
						return false;
					});
					$(document).mouseup((e) => {fun.dragEnd(parseInt(element.css('left')),parseInt(element.css('top')));element.removeClass('on');isDown = false;});
					$(document).mousemove((e) => {
						moveX = $this.x+e.pageX-X;
						moveY = $this.y+e.pageY-Y;
						function thisXMove(){ // x轴移动
							if(isDown == true){
								element.css({left:moveX});
							}else{
								return;
							}
							if(moveX < 0){
								element.css({left:0});
							}
							if(moveX > (boxWidth-sonWidth)){
								element.css({left:boxWidth-sonWidth});
							}
							return moveX;
						}
						function thisYMove(){ // y轴移动
							if(isDown == true){
								element.css({top:moveY});
							}else{
								return;
							}
							if(moveY < 0){
								element.css({top:0});
							}
							if(moveY > (boxHeight-sonHeight)){
								element.css({top:boxHeight-sonHeight});
							}
							return moveY;
						}
						function thisAllMove(){ // 全部移动
							if(isDown == true){
								element.css({left:moveX,top:moveY});
							}else{
								return;
							}
							if(moveX < 0){
								element.css({left:0});
							}
							if(moveX > (boxWidth-sonWidth)){
								element.css({left:boxWidth-sonWidth});
							}
							if(moveY < 0){
								element.css({top:0});
							}
							if(moveY > (boxHeight-sonHeight)){
								element.css({top:boxHeight-sonHeight});
							}
						}
						if(isDown){
					  	fun.dragMove(parseInt(element.css('left')),parseInt(element.css('top')));
						}else{
							return false;
						}
						if(direction.toLowerCase() == "x"){
							thisXMove();
						}else if(direction.toLowerCase() == "y"){
							thisYMove();
						}else{
							thisAllMove();
						}
					});
        },
    }

    // 插件
    $.fn.myDrag = function(options) {
        // 创建实体
        const drag = new Drag(this, options);
        // 调用方法
        drag.run();
		return this;
    }
})(jQuery, window, document);