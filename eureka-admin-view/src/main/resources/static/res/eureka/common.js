$(function(){
});

//jquery对象函数扩展
$.fn.extend({
	/**
	 * 模板引擎使用
	 * @param tmpl 模板html
	 * @param data 数据
	 * @param callback 回调函数
	 */
	tmpl : function(tmpl, data, callback){
		var $this = $(this);
		$.tmpl(tmpl, data, function(render){
			$this.html(render);
			if(callback){
				callback(render);
			}
		});
	},
	
	outerHTML : function() {
	    $this = $(this);
	    var h = $this.html();
	    var s = $this.wrap("<div></div>").parent().html();
	    $this.empty().html(h);
	    return s;
	},
	
	trimForm: function(){
		$(this).find("input, textarea").each(function(){
			$(this).val($.trim($(this).val())); 
		});
		return $(this);
	}
});

//jquery函数扩展
$.extend({
	/**
	 * 使用模板引擎渲染数据
	 * @param tmpl 需要渲染的模板html
	 * @param data 要渲染的数据
	 * @param callback 回调函数，返回渲染数据之后的html以便后续处理
	 */
	tmpl: function(tmpl, data, callback){
		laytpl(tmpl).render(data, function(render){
			if(callback){
				callback(render);
			}
		});
	},
	
	getjson: function(obj, key){
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
 	},
	/**
	 * 显示分页信息
	 * @param options 自定义参数，规则与原始插件相同
	 * @param select 查询数据的js函数，参数有两个，依次是：当前页数，每页数量
	 * @param size 每页显示数量，默认为9条（为了兼容智家商城中纵向视图和横向视图的显示）
	 */
	pages: function(options, select, size){
		//每页数量默认为10条
		size = !size || size < 1 ? 10 : size;
		var pages = options.count % size == 0 ? options.count / size : Math.ceil(options.count/size);
		//默认的分页配置
		var settings = {
			cont : 'pageDiv', // 容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
			pages : pages, // 通过后台拿到的总页数
			curr : options.curr, // 初始化当前页
//			skin: "own", //皮肤
			skip: true,//是否开启跳页
			jump : function(obj, first) { // 触发分页后的回调
				if(!first){
					select(obj.curr, size);
				}
			}	
		};
		//合并分页配置
		$.extend(settings, options);
		//显示分页
		laypage(settings);
	},
	//格式化时间
	dateformat: function (date, mask, utc) {
	    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
	        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
	        timezoneClip = /[^-+\dA-Z]/g,
	        pad = function (val, len) {
	            val = String(val);
	            len = len || 2;
	            while (val.length < len) val = "0" + val;
	            return val;
	        };
	        
        var masks = {
			"default":      "yyyy-mm-dd HH:MM:ss",
			shortDate:      "m/d/yy",
			mediumDate:     "mmm d, yyyy",
			longDate:       "mmmm d, yyyy",
			fullDate:       "dddd, mmmm d, yyyy",
			shortTime:      "h:MM TT",
			mediumTime:     "h:MM:ss TT",
			longTime:       "h:MM:ss TT Z",
			isoDate:        "yyyy-mm-dd",
			isoTime:        "HH:MM:ss",
			isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
			isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
        };
        
        var i18n = {
		    dayNames: [
		        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
		    ],
		    monthNames: [
		        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
		    ]
		};
	        
	    // Regexes and supporting functions are cached through closure
	    var format = function (date, mask, utc) {
	        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
	        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
	            mask = date;
	            date = undefined;
	        }

	        // Passing date through Date applies Date.parse, if necessary
	        date = date ? new Date(date) : new Date;
	        if (isNaN(date)) throw SyntaxError("invalid date");

	        mask = String(masks[mask] || mask || masks["default"]);

	        // Allow setting the utc argument via the mask
	        if (mask.slice(0, 4) == "UTC:") {
	            mask = mask.slice(4);
	            utc = true;
	        }

	        var _ = utc ? "getUTC" : "get",
	            d = date[_ + "Date"](),
	            D = date[_ + "Day"](),
	            m = date[_ + "Month"](),
	            y = date[_ + "FullYear"](),
	            H = date[_ + "Hours"](),
	            M = date[_ + "Minutes"](),
	            s = date[_ + "Seconds"](),
	            L = date[_ + "Milliseconds"](),
	            o = utc ? 0 : date.getTimezoneOffset(),
	            flags = {
	                d:    d,
	                dd:   pad(d),
	                ddd:  i18n.dayNames[D],
	                dddd: i18n.dayNames[D + 7],
	                m:    m + 1,
	                mm:   pad(m + 1),
	                mmm:  i18n.monthNames[m],
	                mmmm: i18n.monthNames[m + 12],
	                yy:   String(y).slice(2),
	                yyyy: y,
	                h:    H % 12 || 12,
	                hh:   pad(H % 12 || 12),
	                H:    H,
	                HH:   pad(H),
	                M:    M,
	                MM:   pad(M),
	                s:    s,
	                ss:   pad(s),
	                l:    pad(L, 3),
	                L:    pad(L > 99 ? Math.round(L / 10) : L),
	                t:    H < 12 ? "a"  : "p",
	                tt:   H < 12 ? "am" : "pm",
	                T:    H < 12 ? "A"  : "P",
	                TT:   H < 12 ? "AM" : "PM",
	                Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
	                o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
	                S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
	            };

	        return mask.replace(token, function ($0) {
	            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
	        });
	    };
	    
	    return format(new Date(date), mask, utc);
	},
	//本地存储
	store: function(key, value){
		try {
			if (value == undefined) {
				return localStorage.getItem(key);
			} else {
				localStorage.setItem(key, value);
			}
		} catch (e) {
		}
	}
});

(function($){  
	var loadDialogIndex;
	//备份jquery的ajax方法  
    var _ajax = $.ajax;  
      
    //重写jquery的ajax方法  
    $.ajax = function(opt){  
        //备份opt中error和success方法  
    	//增加了shade属性，用来区分是否显示加载层，1为需要显示；2为不需要显示；默认为1
        var _option = {  
            error: function(XMLHttpRequest, textStatus, errorThrown){},  
            success: function(data, textStatus){},
            beforeSend: function(){},
            shade: 1
        }  
        if(opt.error){  
        	_option.error = opt.error;  
        }  
        if(opt.success){  
        	_option.success = opt.success;  
        }
        if(opt.beforeSend){
        	_option.beforeSend = opt.beforeSend;
        }
        if(opt.shade){
        	_option.shade = opt.shade;
        }
        
        //扩展增强处理  
        var _opt = $.extend(opt, {  
        	beforeSend: function(){
        		if(_option.shade == 1){
        			loadDialogIndex = layer.load(1, {shade:[0.3, '#000']});
        		}
        		_option.beforeSend();
        	},
            error: function(XMLHttpRequest, textStatus, errorThrown){
                //错误方法增强处理  
            	if(_option.shade == 1){
            		layer.close(loadDialogIndex);
            	}
            	//正上方
            	layer.msg('处理出错了。。。', {
            	    offset: 0,
            	    shift: 6
            	});
            	console.log("XMLHttpRequest:" + JSON.stringify(XMLHttpRequest));
            	console.log("textStatus:" + JSON.stringify(textStatus));
            	console.log("errorThrown:" + JSON.stringify(errorThrown));
            	_option.error(XMLHttpRequest, textStatus, errorThrown);  
            },  
            success: function(data){
            	if(_option.shade == 1){
            		layer.close(loadDialogIndex);
            	}
            	if(typeof data =="object" && data.flag != 'success'){
            		layer.msg(data.msg, {
                	    offset: 0,
                	    shift: 6
                	});
            		return false;
            	}
            	_option.success(data);  
            },
            complete: function(){
            	if(_option.shade == 1){
            		layer.close(loadDialogIndex);
            	}
            }
        });  
        return _ajax(_opt);  
    };  
})(jQuery);

if($.fn.datetimepicker){
	$.fn.datetimepicker.dates['zh-CN'] = {
			days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
			daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
			daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
			months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
			monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
			today: "今天",
			suffix: [],
			meridiem: ["上午", "下午"],
			rtl: false // 从右向左书写的语言你可以使用 rtl: true 来设置
	};
}

//退出
$("#logoutBtn").on("click", function(){
	layer.confirm('确定要退出吗？', function(index){
	    layer.close(index);
	    
	    $.ajax({
	    	url: basePath + 'logout',
	    	type: 'post',
	    	dataType: 'json',
	    	success: function(data){
	    		location.reload();
	    	}
	    });
	});
});

//加入收藏夹
function addFavorite(sURL, sTitle){
    try {
        window.external.addFavorite(sURL, sTitle);
    } catch (e) {
        try {
            window.sidebar.addPanel(sTitle, sURL, "");
        } catch (e) {
        	layer.alert("加入收藏失败，请按Ctrl+D进行添加",{icon : 0});
        }
    }
}

/**
 * 定义正则表达式
 */
var ITReg = {
	required: /^[\S]{1,}$/,
	//登录名：字母开头，字母和数字的组合，6-20位长度
	loginName: /^[a-zA-Z]{1}[a-zA-Z0-9]{5,19}$/,
	//密码：字母、数字、!@#$%^&*.~的组合，6到20位长度
	loginPwd: /^[A-Za-z0-9\!\@\#\$\%\^\&\*\.\~]{6,20}$/,
	mobilePhoneReg: /^(1[3-9]{1}[0-9]{9})$/,
	integer: /^[\d]+$/,
	number: /^[\d]+(\.\d+)?$/,
	allnumber: /^[\-]?[\d]+(\.\d+)?$/,
	email: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
};

$.fn.bindvalidate = function(options){
	var $this = $(this);  /*被绑定的控件文本框 */
    var _this = this;     /*当前控件对象*/
    
	var default_options = {
		rules: {},
		messages: {}
	}
	_this.option = $.extend(default_options, options);
	
	for(var key in _this.option.rules){
		var rule = _this.option.rules[key];
		for(var i=0; i<rule.length; i++){
			$this.find(key).valid({
				reg: rule,
		    	errMsg: _this.option.messages[key]
			});
		}
	}
	
	function valid(){
		var valid = true;
		for(var key in _this.option.rules){
			var rule = _this.option.rules[key];
			for(var i=0; i<rule.length; i++){
				if(!rule[i].test($.trim($this.find(key).val()))){
					valid = false;
				}
				$this.find(key).trigger("focusout");
			}
		}
		return valid;
	}
	
	return valid;
}

$.fn.valid = function(options){
	var $this = $(this);  /*被绑定的控件文本框 */
    var _this = this;     /*当前控件对象*/
    
    /**默认配置*/
    var default_options={
    	reg: [],
    	errMsg: []
    };
    _this.option = $.extend(default_options, options);
    
    _this.showErrors = function(element, errMsg){
    	layer.close(_this.tips);
    	if(errMsg){
    		element.parents(".am-form-group").addClass("am-form-error");
    		$this.attr("data-error",errMsg);
    		_this.tips = layer.tips(errMsg, element, {
				tipsMore: true,
				time: 0
			});
    	} else{
    		element.parents(".am-form-group").removeClass("am-form-error");
    		$this.attr("data-error", "");
    	}
	};
	
	_this.validateReg = function(){
		var result = true;
    	for(var i=0; i<_this.option.reg.length; i++){
    		result = _this.option.reg[i].test($this.val());
    		if(!result){
    			break;
    		}
    	}
    	
    	if(!result && _this.option.errMsg[i] != $this.attr("data-error")){
			_this.showErrors($this, _this.option.errMsg[i]);
		}
		if(result){
			_this.showErrors($this, "");
		} else{
			return false;
		}
    };
    
    $this.on("focusout", function(){
    	_this.validateReg();
    });
    
    $this.on("keyup", function(){
    	_this.validateReg();
    });
    
}
