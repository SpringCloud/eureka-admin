/**
 * 城市数据源对象
 * 数据结构如下：
 * province={
 *   "id": "",
 *   "provinceName": ""
 *	}
 * area={
 *   "id": "",
 *   "cityId": "",
 *   "provinceId": "",
 *   "cityName": "",
 *   "areaName": "",
 *   "pinYin": "",
 *   "pinYinChar": ""
 *  }
 * city = {
 *   "name": "",
 *   "id": "",
 *   "provinceId": "",
 *   "cityPinyin": "",
 *   "hotCity":"",   //是否热门城市标示
 *   "cityShortPY": ""
 *	}
 * 该对象的使用说明：配置dpcity 控件使用的数据源。
 * 支持 ： 数据延迟加载 ，在使用时才加载数据
 */
var City_ds = function(options) {
	var city_ds = this;
	//数据对象
    city_ds.data = {
    	provinces: false,
        cities: false,
        areas: false,
        hotcity: false
    };
    //判断数据是否初始化
	city_ds.isinit_data = function(){
		return city_ds.data.provinces || city_ds.data.cities || city_ds.data.areas ;
    };
    //将obj中的属性替换成为 maper中配置的属性;maper{a:b} a为控件中的使用的字段名称，b为用户数据中的字段名称
    var combine = function(obj,map){
        var _obj = obj;
        for(var k in map){
            var obj_k = map[k];
            if(_obj[obj_k]){ //存在
                var tv = _obj[obj_k];
                delete _obj[obj_k] ;
                _obj[k] = tv;
            }
        }
        return _obj;
    }

    /*数据源默认配置*/
    var setting = {
    	//是否自动初始化，为true时，页面加载完即请求数据；为false时，点击文本框才请求数据
        autoinit: true,
        //域名路径
        host_path:'',
        //省份数据请求地址
        provinces_url: '/moss/web/allProvinces.x',
        //省份数据返回json的key
        porvince_property: 'values.list',
        //城市数据请求地址
        cities_url: '/moss/web/allCities.x',
        //城市数据返回json的key
        city_property: 'values.list',
        //区县数据请求地址
        areas_url: '/moss/web/allCounties.x',
        //区县数据返回json的key
        area_property: 'values.list',
        //根据城市查询区县的地址，如果已配置区县数据请求地址，则此配置无效
        areabycity_url: '',
        //根据省份查询城市的地址，如果已配置城市数据请求地址，则此配置无效
        citybyprovince_url: '',
        //自定义数据过滤器，参数为一条数据，需返回过滤后的数据对象
        data_filter: function(data){
        	//对数据进行过滤
        	return data;
        },
        //字段映射，可以把自定义的字段和城市控件中需要的字段做映射，可以不用改变使用者的数据结构,key为控件里所需字段名，value为使用者提供数据的字段名
        property_mapper: {
        	province: {
    			"id": "id",
    			"provinceName": "provinceName"
    		},
            city: {
            	"id": "id",
            	"name": "cityName",
            	"provinceId": "provinceId",
            	"cityPinyin": "pinyin",
            	"cityShortPY": "pinyinBrief",
            	"hotCity": "hotCity"
            },
            area: {
            	"id": "id",
            	"areaName": "countyName",
            	"cityId": "cityId",
            	"cityName": "cityName",
            	"provinceId": "provinceId",
            	"pinYin": "pinyin",
            	"pinYinChar": "pinyinBrief"
            }
        }
    };
    //合并配置项
    city_ds.opt = $.extend(setting,options);
    //数据过滤
    var filter = function(arr, data, filter){
    	if(filter){
			if(data = filter(data)){
				arr.push(data);
        	}
		} else{
			arr.push(data);
		}
    	return arr;
    }

    /** 设置省份数据数据*/
    city_ds.setProvinces = function(data){
    	set_data("provinces_url", "province", "provinces", data);
    };
    /** 设置城市数据*/
    city_ds.setCities = function(data){
    	set_data("cities_url", "city", "cities", data);
    	if(typeof(data) == 'object'){
    		//热门城市
            if(city_ds.data.hotcity) return;
            var hotcity = new Array();
            for(var hot in data) {
                if(data[hot].hotCity) hotcity.push(data[hot]);
            }
            city_ds.data.hotcity = hotcity;
    	}
    };
    /** 设置区县数据*/
    city_ds.setArea = function(data){
    	set_data("areas_url", "area", "areas", data);
    };
    /** 设置数据*/
    var set_data = function(url, mapper, data_key, data){
        /** 如果是字符串，设置为数据源url，否则按照数组处理*/
        if(typeof(data)=='string') city_ds.opt[url] = data;
        if(typeof(data)=='object'){
        	city_ds.data[data_key] = handle_data(mapper, data);
        }
    };
    
    /** 处理数据*/
    var handle_data = function(mapper, data){
        if(city_ds.opt.property_mapper && city_ds.opt.property_mapper[mapper]){
            /*如果配置了省份字段映射关系*/
            var p = new Array();
            for(var i in data){
            	var d = combine(data[i],city_ds.opt.property_mapper[mapper]);
            	p = filter(p, d, city_ds.opt.data_filter);
            }
            return p;
        } else if(city_ds.opt.data_filter){
        	//设置了数据筛选
        	var p = new Array();
        	for(var i in data){
        		//执行数据筛选方法
        		p = filter(p, data[i], city_ds.opt.data_filter);
        	}
        	return p;
        } else{
        	return data;
        }
    };
    
    /** 根据key获取json value，支持无限层级*/
    var get_json = function(obj, key){
		if(!key || !obj){
			return "";
		}
		if(key.indexOf(".") < 0){
			return obj[key];
		} else{
			var keyArr = key.split(".");
			for(var i=0; i<keyArr.length; i++){
				obj = obj[keyArr[i]];
			}
			return obj;
		}
 	}

    /*通过城市id查询下面所有的区县*/
    city_ds.areaByCity = function(cid){
    	var areaArr = [];
        /*数据源已经存在了所有的区县信息，则直接从中匹配；减少网络开支和服务器开支*/
        if(city_ds.data.areas) {
            for(var item in city_ds.data.areas){
                if(city_ds.data.areas[item].cityId == cid){
                	areaArr.push(city_ds.data.areas[item]);
                }
            }
        } else if(city_ds.opt.areabycity_url) {
        	/*通过ajax方式来获取数据，必须先配置url*/
        	fetch_data(city_ds.opt.areabycity_url + cid, city_ds.opt.city_property, false, function(data){
        		areaArr = handle_data("area", data);
        	});
        }
        return areaArr;
    };
    /*通过省份id获取所有的城市*/
    city_ds.cityByProvince = function(pid){
        var cityArr = [];
        /*数据源已经存在了所有的区县信息，则直接从中匹配；减少网络开支和服务器开支*/
        if(city_ds.data.cities) {
            for(var item in city_ds.data.cities){
                if(city_ds.data.cities[item].provinceId == pid){
                	cityArr.push(city_ds.data.cities[item]);
                }
            }
        } else if(city_ds.opt.citybyprovince_url) {
        	/*通过ajax方式来获取数据，必须先配置url*/
        	fetch_data(city_ds.opt.citybyprovince_url + pid, city_ds.opt.city_property, false, function(data){
        		cityArr = handle_data("city", data);
        	});
        }
        return cityArr;
    };
    /*通过省份id 查找省份信息*/
    city_ds.provinceById = function(pid){
        if(!city_ds.data.provinces)/**/{
        	console.log("省份数据源未初始化");
        	return false;
        }
        for(var i in city_ds.data.provinces){
            if(city_ds.data.provinces[i].id == pid) {
            	return city_ds.data.provinces[i];
            }
        }
    };
    /*填充数据的方法;如果ajax返回的数据格式变更，只需要修改该函数即可*/
    var fetch_data = function(url, key, is_async, callback){
        $.ajax({
            type:"get",
            url:city_ds.opt.host_path + url,
            dataType:"json",
            async: is_async,
            success:function(data){ 
            	callback(get_json(data, key));
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){/*console.log(textStatus);*/}
        });
    };

    /** 是否异步方式填充数据 */
    var fill_data = function(is_async){
        /*初始化数据*/
        if(!city_ds.data.provinces) fetch_data(city_ds.opt.provinces_url, city_ds.opt.porvince_property, is_async, city_ds.setProvinces);
        if(!city_ds.data.cities && city_ds.opt.cities_url) fetch_data(city_ds.opt.cities_url, city_ds.opt.city_property, is_async, city_ds.setCities);
        if(!city_ds.data.areas && city_ds.opt.areas_url) fetch_data(city_ds.opt.areas_url, city_ds.opt.area_property, is_async, city_ds.setArea);

    };
   
    /*初始化*/
    if(this.opt.autoinit) {
    	fill_data(true);
    }
    //todo://*提供接口，可以在外初始化数据*/
    city_ds.init_data = function(){
        fill_data(false);
    };
};

/**格式化字符串*/
var format = function(str, obj){
    for (var key in obj) {
        if(obj[key]){
            var reg = new RegExp("({" + key + "})", "g");
            str = str.replace(reg, obj[key]);
        }
    }
    return str;
};

/**
 *@description: 省市区选择控件--依赖jquery、bootstrap3
 *@author: 邓夫伟
 *@version: 2015-08-11
 */
/* 城市控件核心类 */
(function($) {
    /**键盘输入提示；模糊匹配*/
    var Key_input  = function(opt){
        var _default ={
            ds: false,/*使用的数据*/
            inhtml: [],
            show_size: 10,
            key: '',/*查询的key*/
            before_key: '',
            ispage: false, /*是否分页显示*/
            page: 1,
            need_area: true,/*是否需要支持区县,默认支持*/
            target: {}, /*目标对象*/
            top: function(){
            	return this.target.offset().top + this.target.height() + 5;
            },
            left: function(){
            	return  this.target.offset().left - 2;
            },
            height:function(){
            	return this.target.height();
            },
            click: function(){
            	console.log("im key input click:" + $(this).html());
            },
            /*清空*/
            clear: function(){
                this.page = 1;
                this.inhtml = [];
            },
            totalcount: function(){
                return this.inhtml.length;
            },
            totalpage: function(){
              return Math.ceil(this.totalcount() / this.show_size);
            },
            getpage: function(){
                return this.page < 1 ? 1 : ( this.page > this.totalpage() ? this.totalpage() : this.page);
            },
            starNo: function(){
                return (this.getpage() -1) * this.show_size;
            },
            endNo: function(){
                return this.getpage() * this.show_size;
            },
            pagehtml: function(){
                if(this.totalpage() == 1) {
                	return '';
                }
                var html = '';
                var star, end;
                if(this.page == 1){
                    star = 1;
                    end = this.totalpage() > 3 ? 3 : this.totalpage();
                }else if(this.page == this.totalpage()){
                    star =(this.totalpage() - 2) > 1 ? (this.totalpage() - 2) : 1;
                    end = this.totalpage();
                }else if(this.page > this.totalpage() - 3){
                    star = this.totalpage() - 2;
                    end = this.totalpage();
                }else{
                    star = this.page;
                    end = parseInt(this.page) + 2;
                }
                if(this.page > 1){
                    html += '<a href="javascript:void(0);" value="' + (this.getpage()-1) + '"><-</a>';
                }
                for(var i = star; i <= end; i++){
                    if(this.page == i) {
                    	html += '<a href="javascript:void(0);" class="current" value="' + i + '">' + i + '</a>';
                    } else {
                    	html += '<a href="javascript:void(0);" value="' + i + '">' + i + '</a>';
                    }
                }
                if(this.page < this.totalpage()){
                    html += '<a href="javascript:void(0);"  value="' + (parseInt(this.getpage()) + 1) + '">-></a>';
                }
                return html;
            },
            topage: function(p){
                this.page = p < 1 ? 1 : (p > this.totalpage() ? this.totalpage() : p);
                this.init_div();
            },
            pagebind: function(css){
                var _this = this;
                $("#dimCityQuery .page a").unbind().click(function(event){
                	var p = $(this).attr("value");
                    _this.topage(p);
                    _this.target.focus();
                    event.stopPropagation();
                });
                $("#dimCityQuery .page a").css(css);

            },
            /*把 inhtml中的li的html拼接成完整需要显示的html代码*/
            inhtmler: function(){
                if(!this.inhtml || this.inhtml.length < 1){
                    $("#dimCityQuery ul").html("<li class='none'>对不起,没有找到该城市</li>");
                    if(this.ispage){
                    	$("#dimCityQuery .page").html('');
                    }
                }else{/*把 inhtml 中的字符并接成html ,加入到面板结果中 */
                    var _html = '';
                    for(var i = this.starNo(); i < this.endNo(); i++){
                        if(this.inhtml[i]){
                        	_html += this.inhtml[i];
                        }
                    }
                    $("#dimCityQuery ul").html(_html).find("li:first").addClass("current");
                    if(this.ispage){
                        $("#dimCityQuery .page").html(this.pagehtml());
                        this.pagebind({'text-decoration': 'none','cursor':'pointer'});
                    }else{
                    	$("#dimCityQuery .page").html('');
                    }
                }
            },
            /*初始化*/
            init_div: function(){
                if(!$("#dimCityQuery").attr("id")){ /*/div　已经存在 todo:ie 兼容需要添加 iframe*/
                    $("body").append('<div id="dimCityQuery" style="position: absolute;border: 1px solid #d6d6d6;background: #FFF;z-index: 20000000;"><ul class="list-unstyled" style="line-height: 2;"></ul><span class="page"></span></div>');
                }
                $("#dimCityQuery").css("top", this.top() + 10).css("left", this.left()).show();
                this.inhtmler();
                /*鼠标移上效果*/
                $("#dimCityQuery li").hover(function(){
                    $(this).addClass("current").siblings().removeClass("current");
                });
                /*点击事件*/
                $("#dimCityQuery li a").unbind("click").bind("click",this.click);
                return $("#dimCityQuery");
            },
            /**/
            fill: function(dataArr){
                /*填充数据;*/
            	for(var i in dataArr) {
                    var li = this.creat_li(dataArr[i]);
                    if(li) {
                    	li = this.highlight(li, this.key);
                        this.inhtml.push(li);
                    }
                }
            },
            highlight: function(str, key){
                /*高亮搜索关键字*/
            	var reg = new RegExp("("+key+")", "i");
            	return str.replace(/<a.*>(.*?)<\/a>/, function(){
            		var args = arguments; 
            		return args[0].replace(args[1], args[1].replace(reg, "<span style='color:red'>$1</span>"));
            	});
            },
            fill_area: function(pdata){
                /*填充区县的搜索结果*/
                this.fill(pdata ? pdata : this.ds.data.areas);
            },
            fill_city: function(pdata){
                /*填充城市的搜索结果*/
                this.fill(pdata ? pdata : this.ds.data.cities);
            },
            creat_li_pinyin: function(obj){
            	if(obj.areaName){
            		//区县
            		return format('<li><a class="allcityClass" href="javascript:" provinceid="{provinceId}" cityid="{cityId}" countyid="{id}" cityname="{cityName}" countyname="{areaName}">{cityName}-{areaName}({pinYin})</a></li>', obj);
            	} else{
            		//城市
            		return format('<li><a class="allcityClass" href="javascript:" provinceid="{provinceId}" cityid="{id}" cityname="{name}">{name}({cityPinyin})</a></li>', obj);
            	}
            },
            creat_li_py: function(obj){
            	if(obj.areaName){
            		//区县
            		return format('<li><a class="allcityClass" href="javascript:" provinceid="{provinceId}" cityid="{cityId}" countyid="{id}" cityname="{cityName}" countyname="{areaName}">{cityName}-{areaName}({pinYinChar})</a></li>', obj);
            	} else{
            		//城市
            		return format('<li><a class="allcityClass" href="javascript:" provinceid="{provinceId}" cityid="{id}" cityname="{name}" >{name}({cityShortPY})</a></li>', obj);
                }
            },
            creat_li: function(obj, q){
                /*根据搜索结果生成li的html代码*/
                var q = q || this.key;
                var piny = obj.pinYin || obj.cityPinyin;
                var pychar = obj.pinYinChar || obj.cityShortPY;
                var name = obj.areaName || obj.name;
                /*汉字*/
                if(q == name.substring(0, q.length)) {
                	return this.creat_li_py(obj);
                }
                /*简拼*/
                if(pychar && (q.toUpperCase() == pychar.substring(0, q.length).toUpperCase())){
                	return this.creat_li_py(obj);
                }
                /*全拼*/
                if(piny && (q.toLowerCase() == piny.substring(0, q.length).toLowerCase())) {
                	return this.creat_li_pinyin(obj);
                }
                return false;
            }
        };
        
        this.opt = $.extend(_default,opt);
        
        /*设置查询key;对象入口，自动触发对象*/
        this.setKey = function(q){
            if (!this.opt.ds) {
            	console.log("模糊匹配数据源未初始化");
            	return false;
            }
            this.opt.key = q;
            if (!this.opt.key) {
            	return false;
            }
            //如果查询关键字没有改动，则结束
            if (this.opt.before_key == this.opt.key) {
            	this.opt.init_div(); 
            	return false;
            }
            this.opt.clear();
            if(this.opt.need_area) {
            	this.opt.fill_area();  //优先区县
            }
            this.opt.fill_city();
            this.opt.init_div();
            this.opt.before_key = this.opt.key; /*记录上一次的key*/
        };

        /*向上按键*/
        this.keyup = function(){
            var prev = $("#dimCityQuery li.current").prev();
            if(prev.size() > 0) { 
            	prev.addClass("current").siblings().removeClass("current"); 
            } else{ 
            	$("#dimCityQuery li").removeClass("current").last().addClass("current");
            }
        };
        /*向下按键*/
        this.keydown = function(){
            var next = $("#dimCityQuery li.current").next();
            if(next.size() > 0)  {
                next.addClass("current").siblings().removeClass("current");
            } else{
                $("#dimCityQuery li").removeClass("current").first().addClass("current");
            }
        };
        /*回车按键*/
        this.keyenter = function(){
            $("#dimCityQuery li.current a").triggerHandler("click");
        };
        this.close = function(){
        	$("#dimCityQuery").hide();
        }
        /*上一页*/
        this.prepage = function(){ 
        	this.opt.topage(parseInt(this.opt.page) - 1);
        }
        /*下一页*/
        this.nextpage = function(){
        	this.opt.topage(parseInt(this.opt.page) + 1);
        }
        return this;
    };

    /**城市控件选项卡对象*/
	var City_tab_control = function(setting) {
		var _this = this;
        /*城市选项卡配置*/
        var def = {
        	page: 1,
            psize: 12,
            data: [],/*数据源默认为控件的ds*/
            tab: '',/*当前tab class*/
            select_li: '',/*选中的元素*/
            tidy_data: function(data_src){
            	/*todo:这个地方需要调整，如果数据被整理过了，原始数据则无法获取*/
                /*数据过滤函数，在数据操作展示前调用;默认没有做任何处理。使用是可以用参数的方式传入，做数据展示的处理格式化等等*/
                if(!data_src) {
                	return data_src;
                }
                var data = $.extend({}, data_src);
                //省份名称处理
                if(data['provinceName']) {
                    if(data.provinceName.indexOf('内蒙古') == 0 ){
                    	data.provinceName = '内蒙古'; 
                    } else if(data.provinceName.indexOf('黑龙江') == 0){
                    	data.provinceName = '黑龙江';
                    } else{
                    	data.provinceName = data.provinceName.substr(0, 2);
                    }
                } else if(data['name']){
                	//城市名称处理
                	data.showName = data.name.substr(0, 4);
                } else if(data['areaName']){
                	//区县名称处理
                	data.showName = data.areaName.substr(0, 4);
                }
                return data;
            },
            size: function(){
                return this.data.length ? this.data.length : 0;
            },
            hasnext: function(){
                return this.getpage() < this.totalpage();
            },
            nextpage: function(){
                this.page ++;
                return this.getpage();
            },
            haspre:function(){
                return this.getpage() > 1;
            },
            prepage:function(){
                this.page --;
                return this.getpage();
            },
            totalpage:function(){
                return Math.ceil(this.size() / this.psize);
            },
            getpage:function(){
                return this.page < 1 ? 1 : (this.page > this.totalpage() ? this.totalpage() : this.page);
            },
            lihtml:'',/*该字符串在运行时回自动替换调当中的变量格式 {name}*/
            click:function() {/*绑定生成的li元素中的a的点击事件*/
                console.log($(this).html());
            },
            getstarno:function(){
                return (this.getpage() - 1) * this.psize;
            },
            getendno:function(){
                return this.getstarno() + this.psize > this.size() ? this.size() : (this.getstarno() + this.psize);
            }
        };

        _this.opt = $.extend(def,setting);

        if(!_this.opt.data || _this.opt.data.length < 1){
        //  console.log("数据源未初始化");
            return false;
        }

        var show_tab = function(arg){
            var tb = arg ? arg : _this.opt.tab;
            /*tab 栏的样式切换*/
            $(".tabs li a").each(function(){
                if($(this).attr('tb') == tb) {
                	$(this).parent().addClass("active");
                } else {
                	$(this).parent().removeClass("active");
                }
            });
            /*con 的展示*/
            $(".con .invis").removeClass("active");
            $(".con ." + tb).addClass("active");
        };

        var tab_switch = function(tb){
            tb = tb ? tb : _this.opt.tab;
            show_tab(tb);

            /*清空*/
            var clear = function(){
                $("." + tb + " .list ul").empty();
                $("." + tb + " .pre a").unbind();
                $("." + tb + " .next a").unbind();
            };

            /*添加数据*/
            var fill_html=function(tb){
                clear();
                if(_this.opt.hasnext()){
                    $("." + tb + " .next a").addClass("can").click(_this.next_page);
                } else{ 
                	$("." + tb + " .next a").removeClass("can"); 
                }

                if(_this.opt.haspre()){
                    $("." + tb + " .pre a").addClass("can").click(_this.pre_page);
                } else{ 
                	$("." + tb + " .pre a").removeClass("can");
                }

                if(!_this.opt.lihtml) {
                    console.log("cityWidget error!not found li html option"); 
                    return false;
                }

                /*loop data*/
                for(var i = _this.opt.getstarno(); i < _this.opt.getendno(); i++){
                    var obj = _this.opt.data[i];
                    obj = _this.opt.tidy_data(obj);/*整理对象中的数据格式等等*/
                    var li = format(_this.opt.lihtml, obj);
                    $("." + tb + " .list ul").append($(li));
                }
                /*bind the click event,*/
                $("." + tb + " .list ul a").each(function(){
                    if(_this.opt.select_li == $(this).attr("id")) {
                    	$(this).addClass("current");
                    }
                    $(this).click(_this.opt.click);
                })
            };
            fill_html(tb);
        };
        /*下一页*/
        _this.next_page = function(){
            _this.opt.page = _this.opt.nextpage();
            tab_switch();
        };
        /*上一页*/
        _this.pre_page = function(){
            _this.opt.page = _this.opt.prepage();
            tab_switch();
        };

        tab_switch(_this.opt.tab);
    };

    /**城市控件对象*/
	var City_ctrl = function(option){
		var _default = {
			init_panel: function(){
				/*初始化面板;todo:ie 兼容需要添加 iframe*/
				if(!$(".dpcity").attr("class")){
                	$("body").append(
                		'<div class="dpcity" style="width: 30em; position:absolute; z-index:20000000; background:#FFF;">'
                			+ '<div class="tabs">'
	    						+ '<ul class="nav nav-tabs row" style="margin:0px;">'
	    							+ (option.need_hotcity ? '<li class="col-md-3 text-center active" style="padding: 0px;"><a href="javascript:void(0);" tb="hotCity">热门城市</a></li>' : '')
	    							+ '<li class="' + (option.need_hotcity ? 'col-md-3' : 'col-md-4') + ' text-center" style="padding: 0px;"><a href="javascript:void(0);" tb="province">省份</a></li>'
	    							+ '<li class="' + (option.need_hotcity ? 'col-md-3' : 'col-md-4') + ' text-center" style="padding: 0px;"><a href="javascript:void(0);" tb="city" id="city">城市</a></li>'
	    							+ '<li class="' + (option.need_hotcity ? 'col-md-3' : 'col-md-4') + ' text-center" style="padding: 0px;"><a href="javascript:void(0);" tb="county" id="county" style="margin: 0px;">区县</a></li>'
	    						+ '</ul>'
	    					+ '</div>'
    						+ '<div class="tab-content row con" style="margin:0px; border: 1px solid #ddd; border-top-color: transparent;padding:10px 0;">'
    							+ (option.need_hotcity ? '<div class="tab-pane hotCity invis row active" style="margin:0px;">'
    								+ '<div class="pre">'
    									+ '<a></a>'
    								+ '</div>'
    								+ '<div class="list">'
	    								+ '<ul class="row list-unstyled" style="margin:0px; line-height: 2.4;">'
	    								+ '</ul>'
	    							+ '</div>'
	    							+ '<div class="next">'
										+ '<a></a>'
									+ '</div>'
    							+ '</div>' : '')
    							
    							+ '<div class="tab-pane province invis row">'
									+ '<div class="pre col-md-1">'
										+ '<a style="height: 10em;"></a>'
									+ '</div>'
									+ '<div class="list col-md-10">'
	    								+ '<ul class="row list-unstyled" style="margin:0px; line-height: 2.4;">'
	    								+ '</ul>'
	    							+ '</div>'
	    							+ '<div class="next col-md-1">'
										+ '<a style="height: 10em;"></a>'
									+ '</div>'
								+ '</div>'
    							
    							+ '<div class="tab-pane city invis row">'
	    							+ '<div class="pre col-md-1">'
										+ '<a style="height: 10em;"></a>'
									+ '</div>'
									+ '<div class="list col-md-10">'
										+ '<ul class="row list-unstyled" style="margin:0px; line-height: 2.4;">'
										+ '</ul>'
									+ '</div>'
									+ '<div class="next col-md-1">'
										+ '<a style="height: 10em;"></a>'
									+ '</div>'
    							+ '</div>'
    							+ '<div class="tab-pane county invis row">' 
    								+ '<div class="pre col-md-1">'
    									+ '<a style="height: 10em;"></a>'
    								+ '</div>'
									+ '<div class="list col-md-10">'
										+ '<ul class="row list-unstyled" style="margin:0px; line-height: 2.4;">'
										+ '</ul>'
									+ '</div>'
									+ '<div class="next col-md-1">'
										+ '<a style="height: 10em;"></a>'
									+ '</div>'
    							+ '</div>'
    						+ '</div>'
    					+ '</div>');
                }
                this.init_ctrl();
            },
            init_ctrl: function(){
                /*初始化控件，绑定事件*/
                $("a[tb='province']").unbind().click(this.province_tb_click);
                $("a[tb='city']").unbind().click(this.city_tb_click);
                $("a[tb='county']").unbind().click(this.county_tb_click);
                if(option.need_hotcity){
            		$("a[tb='hotCity']").unbind().click(this.hotcity_tb_click);
            		$("a[tb='hotCity']").trigger("click");
            	} else{
            		$("a[tb='province']").trigger("click");
            	}
            },
            show_city_ctrl: function(postion){
            	$(".dpcity").css(postion).show();
            },
            hide_city_ctrl: function(){
            	$(".dpcity").hide()
            },
            hotcity_tb_click: function(){},
            province_tb_click: function(){},
            city_tb_click: function(){},
            county_tb_click: function(){}
        }
        return $.extend(_default, option);
    };

    /**jquery 插件*/
    $.fn.dpcity = function(options){
        var $this = $(this);  /*被绑定的控件文本框 */
        var _this = this;     /*当前控件对象*/
        _this.l = function(){return $this.offset().left - 2;};
        _this.t = function(){return $this.offset().top + $this.height() + 5;};
        _this.h = function(){return $this.height();};

        _this.ID = $this.attr('id');
        /**缓存功能*/
        _this.cache = {
        	data: new Array(),
            add: function(key, value){
            	var f = false;
                for(var c in this.data){
                    if(this.data[c].k == key){ 
                    	this.data[c].v = value; 
                    	f = true;
                    }
                }
                if(!f) { 
                	this.data.push({k:key, v:value}); 
                	f = true; 
                }
                return f;
            },
            remove: function(key){
                for(var c in this.data){
                    if(this.data[c].k == key){ 
                    	this.data.splice(c, 1);
                    	return; 
                    }
                }
            },
            get: function(key){
                for(var c in this.data){
                    if(this.data[c].k == key){ 
                    	return this.data[c].v;
                    }
                }
                return false;
            }
        };
        /**默认配置*/
        var dpcity_setting={
        	//数据源配置对象
        	ds: false,
        	//是否需要选项卡式的选择省市区
            tab_ctrl: true, 
            //是否需要模糊匹配键盘输入内容
            key_ctrl: true, 
            //模糊匹配是否需要分页
            key_page: true, 
            //是否支持选择区县
            need_area: true, 
            //是否支持热门城市选项
            need_hotcity: true,
            //选中省份级别后的回调
            province_back: function(selected){},
            //选中城市级别后的回调
            city_back: function(selected){},
            //离开时的操作 即 onblur 事件
            finshed: function(txt){},
            //选择完成后的回调函数
            callback: function(selected){}
        };

        _this.option = $.extend(dpcity_setting, options);

        /**构造回调的参数，选择城市区县后，回传给调用者的数据*/
        var create_back_data = function(elem){
        	var provinceName = _this.option.ds.provinceById(elem.attr('provinceid')).provinceName;
            return {
                provinceId: elem.attr('provinceid'),
                cityId: elem.attr('cityid'),
                cityName: elem.attr('cityname'),
                countyId: elem.attr('countyid'),
                countyName: elem.attr("countyname"),
                provinceName: provinceName
            };
        }

        /*根据配置是否需要显示选项卡式控件*/
        if(_this.option.tab_ctrl){
            /**切换城市选项卡到对应的tab标签页*/
            _this.to_tab = function(tab, opt){
                var cache_sel = _this.cache.get(tab + "_selected");
                if(!opt) {
                	opt = _this.cache.get(tab + "_opt");
                }
                if(!opt) {
                	return false;
                }
                opt.select_li = cache_sel;
                City_tab_control(opt);
                _this.cache.add(tab + "_opt", opt);
            };
            /**选项卡切换到区县tab*/
            _this.switch_area_tab = function(ds){
                var areaID = "county";
                /*跳转到区县tab*/
                _this.to_tab(areaID, {
                    data: ds,
                    tab: areaID,
                    lihtml: '<li class="col-md-4 text-center"><a href="javascript:void(0);" id="{id}" provinceid="{provinceId}" cityid="{cityId}" countyid="{id}" cityname="{cityName}"  countyname="{areaName}" title="{areaName}">{showName}</a></li>',
                    psize: 12,
                    page: 1,
                    click: function(event){
                        _this.cache.add(areaID + "_selected", $(this).attr('id'));
                        var back_data = create_back_data($(this));
                        $this.val(back_data.provinceName + "-" + back_data.cityName + "-" + back_data.countyName);
                        _this.option.callback(back_data);/*回调用户处理函数*/
                        _this.city_ctrl.hide_city_ctrl();
                        event.stopPropagation();
                    }
                });
            };
            /**选项卡切换到城市tab*/
            _this.switch_city_tab = function(ds){
                var cityID = "city";
                /*跳转到城市tab*/
                _this.to_tab(cityID, {
                    data: ds,
                    tab: cityID,
                    lihtml: '<li class="col-md-4 text-center"><a href="javascript:void(0);" id="{id}" provinceid="{provinceId}" cityid="{id}" cityname="{name}" title="{name}">{showName}</a></li>',
                    psize: 12,
                    page: 1,
                    click: function(event){
                        _this.cache.add(cityID + "_selected", $(this).attr('id'));
                        _this.cache.add("hotCity_selected", $(this).attr('id'));
                        var provinceName = _this.option.ds.provinceById($(this).attr('provinceid')).provinceName;
                        var sel_data = {
                        	provinceId: $(this).attr('provinceid'),
                        	provinceName: provinceName,
                        	cityId: $(this).attr('cityid'),
                        	cityName: $(this).attr('cityname')
                        };
                        $this.val(sel_data.provinceName + "-" + sel_data.cityName);
                        _this.option.city_back(sel_data);
                        if(!_this.option.need_area){ //不支持选择区县，则选择城市后直接结束
                        	_this.option.callback(sel_data);/*回调用户处理函数*/
                        	_this.city_ctrl.hide_city_ctrl();
                            return ;
                        }
                        _this.switch_area_tab(_this.option.ds.areaByCity($(this).attr('cityId')));
                        event.stopPropagation();
                    }
                });
            };
            
            var city_ctrl_option = {
                /*省份选项卡点击事件*/
                province_tb_click: function(event){
                    var provinceID = "province";
                    _this.to_tab(provinceID, {
                        data: _this.option.ds.data.provinces,
                        tab: provinceID,
                        lihtml: '<li class="col-md-4 text-center"><a href="javascript:void(0);" id="{id}" provinceid="{id}" >{provinceName}</a></li>',
                        psize: 12,
                        page: 1,
                        click: function(){
                            _this.cache.add(provinceID + "_selected", $(this).attr("id"));
                            _this.cache.remove("county_opt");
                            var provinceName = _this.option.ds.provinceById($(this).attr("id")).provinceName;
                            $this.val(provinceName);
                            _this.option.province_back({
                                provinceId: $(this).attr('id'),
                                provinceName: provinceName
                            });
                            _this.switch_city_tab(_this.option.ds.cityByProvince($(this).attr('provinceId')))
                        }});
                    event.stopPropagation();
                },
                city_tb_click: function(event){ 
                	_this.to_tab("city", null);
                	event.stopPropagation();
                },
                county_tb_click: function(event){ 
                	_this.to_tab("county", null);
                	event.stopPropagation();
                }
            }
            
            city_ctrl_option.need_hotcity = _this.option.need_hotcity;
            if(_this.option.need_hotcity){
            	city_ctrl_option.hotcity_tb_click = function(event){/*热门城市选项卡点击事件*/
                	var hotcityID="hotCity";
                    _this.to_tab(hotcityID, {
                    	data: _this.option.ds.data.hotcity,
                        tab: hotcityID,
                        lihtml: '<li class="col-md-3 text-center"><a href="javascript:void(0);" id="{id}" provinceid="{provinceId}" cityname="{name}">{name}</a></li>',
                        psize: 16,
                        page: 1,
                        click: function(){
                            /*缓存选中的*/
                            _this.cache.remove("city_opt");
                            _this.cache.remove("county_selected");
                            var provinceName = _this.option.ds.provinceById($(this).attr('provinceid')).provinceName;
                            var sel_data = {
                            	provinceId: $(this).attr('provinceid'),
                                provinceName: provinceName,
                                cityId: $(this).attr('id'),
                                cityName: $(this).attr('cityname')
                            };
                            $this.val(sel_data.provinceName + "-" + sel_data.cityName);
                            _this.option.city_back(sel_data);
                            if(!_this.option.need_area){ //不支持选择区县，则选择城市后直接结束
                                _this.option.callback(sel_data);/*回调用户处理函数*/
                                _this.city_ctrl.hide_city_ctrl();
                                return ;
                            }
                            var ds = _this.option.ds.areaByCity($(this).attr("id"));
                            _this.switch_area_tab(ds);
                        }
                    });
                    event.stopPropagation();
                };
            }

            /**实例化城市控件*/
            _this.city_ctrl = new City_ctrl(city_ctrl_option);

            /**控件点击事件，显示城市面板*/
            $this.click(function(event){
                if(!_this.option.ds || !_this.option.ds.isinit_data()){
                    _this.option.ds.init_data(); //延迟加载数据 -同步
                    if(!_this.option.ds.isinit_data() ){
                        console.log("city_tab 数据源未绑定，无法初始化控件");
                        return false;
                    }
                }
                if(_this.key_input){
                	_this.key_input.close();
                }
                $this.select();
                _this.city_ctrl.init_panel();
                _this.city_ctrl.show_city_ctrl({
                	left: _this.l(), 
                	top:_this.t() + 10
                });
                event.stopPropagation();
            });

        };
        /*根据配置是否需要显示键盘模糊匹配控件*/
        if(_this.option.key_ctrl){
            /**实例化模糊匹配控件*/
            _this.key_input = new Key_input({
            	target: $this,
            	ds: _this.option.ds,
            	ispage: _this.option.key_page,
            	need_area: _this.option.need_area,
            	click: function(event){
            		var back_data = create_back_data($(this));
            		/*选择的是城市　-> 选择区县选项卡*/
            		if(!back_data.countyId){
            			$this.val(back_data.provinceName + "-" + back_data.cityName);
            			_this.option.city_back(back_data);
            			if(!_this.option.need_area){ //不支持选择区县，则选择城市后直接结束
            				_this.option.callback(back_data);/*回调用户处理函数*/
            				_this.key_input.close();
            				event.stopPropagation(); //阻止事件冒泡
            				return ;
            			}
            			_this.city_ctrl.show_city_ctrl({
            				left: _this.l(),
            				top: _this.t()
            			});
            			_this.switch_area_tab(_this.option.ds.areaByCity(back_data.cityId));
            		} else{
            			$this.val(back_data.provinceName + "-" + back_data.cityName + "-" + back_data.countyName);
            			_this.option.callback(back_data);
            		}
            		_this.key_input.close();
            		event.stopPropagation(); //阻止事件冒泡
            	}
            });

            /**绑定模糊匹配功能*/
            $this.keyup(function(event){
                if(!_this.option.ds || !_this.option.ds.isinit_data()){
                    _this.option.ds.init_data(); //延迟加载数据 -同步
                    if(!_this.option.ds.isinit_data() ){
                        console.log("city_tab 数据源未绑定，无法初始化控件");
                        return false;
                    }
                }
                if(_this.city_ctrl) {
                	_this.city_ctrl.hide_city_ctrl();
                }
                var lastKeyPressCode = event.keyCode;//获取键盘值
                switch(lastKeyPressCode) {
                    case 40:  //方向键下
                        _this.key_input.keydown();
                        return false;
                    case 38: //方向键上
                        _this.key_input.keyup();
                        return false;
                    case 13: //确定键
                        _this.key_input.keyenter();
                        return false;
                    case 39:// 向右 下一页
                       if(_this.option.key_page) {
                    	   _this.key_input.nextpage();
                       }
                       return false;
                    case 37: // 向左 上一页
                        if(_this.option.key_page) _this.key_input.prepage();
                        return false;
                }
                /*设置查询关键字*/
                _this.key_input.setKey($this.val());
                event.stopPropagation();
            });
        };
        /*onblur -- finshed*/
        $this.blur(function(){_this.option.finshed($this.val())});

    };

    /**点击页面其他地方隐藏掉城市控件 ----  */
	$("html").click(function(event){
		var mint, maxt, minx, maxx;
        var is_range = function(){
            return event.pageX >= minx && event.pageX <= maxx && event.pageY >= mint && event.pageY <= maxt;
        }
        if($(".dpcity").is(":visible")){
            mint = $(".dpcity").position().top;
            minx = $(".dpcity").position().left;
            maxt = mint + $(".dpcity").height();
            maxx = minx + $(".dpcity").width();
            if(!is_range()){
            	$(".dpcity").hide();
            }
        }else if($("#dimCityQuery").is(":visible")){
            mint = $("#dimCityQuery").position().top;
            minx = $("#dimCityQuery").position().left;
            maxt = mint + $("#dimCityQuery").height();
            maxx = minx + $("#dimCityQuery").width();
            if(!is_range()) {
            	$("#dimCityQuery").hide();
            }
        }
	});
})($);


