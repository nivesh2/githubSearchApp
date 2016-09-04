/*
ngprogress 1.1.2 - slim, site-wide progressbar for AngularJS
(C) 2013 - Victor Bjelkholm
License: MIT
Source: https://github.com/VictorBjelkholm/ngProgress
Date Compiled: 2015-07-27
*/
angular.module("ngProgress.provider",["ngProgress.directive"]).service("ngProgress",function(){"use strict";return["$document","$window","$compile","$rootScope","$timeout",function(a,b,c,d,e){this.autoStyle=!0,this.count=0,this.height="2px",this.$scope=d.$new(),this.color="#18D948",this.parent=a.find("body")[0],this.count=0,this.progressbarEl=c("<ng-progress></ng-progress>")(this.$scope),this.parent.appendChild(this.progressbarEl[0]),this.$scope.count=this.count,void 0!==this.height&&this.progressbarEl.eq(0).children().css("height",this.height),void 0!==this.color&&(this.progressbarEl.eq(0).children().css("background-color",this.color),this.progressbarEl.eq(0).children().css("color",this.color)),this.intervalCounterId=0,this.start=function(){this.show();var a=this;clearInterval(this.intervalCounterId),this.intervalCounterId=setInterval(function(){isNaN(a.count)?(clearInterval(a.intervalCounterId),a.count=0,a.hide()):(a.remaining=100-a.count,a.count=a.count+.15*Math.pow(1-Math.sqrt(a.remaining),2),a.updateCount(a.count))},200)},this.updateCount=function(a){this.$scope.count=a,this.$scope.$$phase||this.$scope.$apply()},this.setHeight=function(a){return void 0!==a&&(this.height=a,this.$scope.height=this.height,this.$scope.$$phase||this.$scope.$apply()),this.height},this.setColor=function(a){return void 0!==a&&(this.color=a,this.$scope.color=this.color,this.$scope.$$phase||this.$scope.$apply()),this.color},this.hide=function(){this.progressbarEl.children().css("opacity","0");var a=this;a.animate(function(){a.progressbarEl.children().css("width","0%"),a.animate(function(){a.show()},500)},500)},this.show=function(){var a=this;a.animate(function(){a.progressbarEl.children().css("opacity","1")},100)},this.animate=function(a,b){void 0!==this.animation&&e.cancel(this.animation),this.animation=e(a,b)},this.status=function(){return this.count},this.stop=function(){clearInterval(this.intervalCounterId)},this.set=function(a){return this.show(),this.updateCount(a),this.count=a,clearInterval(this.intervalCounterId),this.count},this.css=function(a){return this.progressbarEl.children().css(a)},this.reset=function(){return clearInterval(this.intervalCounterId),this.count=0,this.updateCount(this.count),0},this.complete=function(){this.count=100,this.updateCount(this.count);var a=this;return clearInterval(this.intervalCounterId),e(function(){a.hide(),e(function(){a.count=0,a.updateCount(a.count)},500)},1e3),this.count},this.setParent=function(a){if(null===a||void 0===a)throw new Error("Provide a valid parent of type HTMLElement");null!==this.parent&&void 0!==this.parent&&this.parent.removeChild(this.progressbarEl[0]),this.parent=a,this.parent.appendChild(this.progressbarEl[0])},this.getDomElement=function(){return this.progressbarEl},this.setAbsolute=function(){this.progressbarEl.css("position","absolute")}}]}).factory("ngProgressFactory",["$injector","ngProgress",function(a,b){var c={createInstance:function(){return a.instantiate(b)}};return c}]),angular.module("ngProgress.directive",[]).directive("ngProgress",["$window","$rootScope",function(a,b){var c={replace:!0,restrict:"E",link:function(a,b,c,d){a.$watch("count",function(c){(void 0!==c||null!==c)&&(a.counter=c,b.eq(0).children().css("width",c+"%"))}),a.$watch("color",function(c){(void 0!==c||null!==c)&&(a.color=c,b.eq(0).children().css("background-color",c),b.eq(0).children().css("color",c))}),a.$watch("height",function(c){(void 0!==c||null!==c)&&(a.height=c,b.eq(0).children().css("height",c))})},template:'<div id="ngProgress-container"><div id="ngProgress"></div></div>'};return c}]),angular.module("ngProgress",["ngProgress.directive","ngProgress.provider"]);


angular.module('gitAPP',['ngProgress','rzModule'])
  .controller('gitController', function($scope,$http,ngProgressFactory){

    var that = this;

    //to store search bar data
    that.search = null;
    that.ratelimit = null;

    $scope.progressbar = ngProgressFactory.createInstance();
    $scope.slider = {
      value: 500,
      options: {
        floor: 0,
        ceil: 5000
      }
    };

    //function for search
    that.loadSearch = function(){
      $scope.progressbar.start();

      var url = "https://api.github.com/search/repositories?q=stars:>=500+language:"+that.search+"&sort=stars&order=desc";
      $http.get(url)
        .then(function(res) {

            that.data = res.data;
            that.items = res.data.items;

            that.ratelimit = {
              remaining: res.headers("X-RateLimit-Remaining"),
              limit: res.headers("X-RateLimit-Limit"),
              resetTime:res.headers("X-RateLimit-Reset")
            };

            $scope.progressbar.complete();
        },function(res){
            console.log('Error while http request',res);
            $scope.progressbar.complete();
        });

    };

    //funciton to load initial data with q=stars>=500+language:php
    that.init = function(){
      $scope.progressbar.start();

      var url = "https://api.github.com/search/repositories?q=stars:>=500+language:php&sort=stars&order=desc";

      $http.get(url)
        .then(function(res) {
            that.data = res.data;
            that.items = res.data.items;

            that.ratelimit = {
              remaining: res.headers("X-RateLimit-Remaining"),
              limit: res.headers("X-RateLimit-Limit"),
              resetTime:res.headers("X-RateLimit-Reset")
            }

            $scope.progressbar.complete();
        },function(res){
            console.log('Error while http request',res);
            $scope.progressbar.complete();
        });
    };

    //function to filter the data as per ther slider value
    that.loadFilter = function(){

      $scope.progressbar.start();

      var language = that.search || "php";
      var value = $scope.slider.value;
      console.log(value);
      var url = "https://api.github.com/search/repositories?q=stars:<="+value+"+language:"+language+"&sort=stars&order=desc";
      console.log(url);
      $http.get(url)
        .then(function(res) {
            that.data = res.data;
            that.items = res.data.items;

            that.ratelimit = {
              remaining: res.headers("X-RateLimit-Remaining"),
              limit: res.headers("X-RateLimit-Limit"),
              resetTime:res.headers("X-RateLimit-Reset")
            }

            $scope.progressbar.complete();
        },function(res){
            console.log('Error while http request',res);
            $scope.progressbar.complete();
        });


    }


  });
