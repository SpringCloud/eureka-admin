var basePath = "http://localhost:8080/";

$.extend({
	formatNumber: function(num, n){
		return Array(n > num ? (n - ('' + num).length + 1) : 0).join(0) + num;
	},
	objKeySort: function(obj){
		var newkey = Object.keys(obj).sort();
	　　//先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
	    var newObj = {};//创建一个新的对象，用于存放排好序的键值对
	    for (var i = 0; i < newkey.length; i++) {//遍历newkey数组
	        newObj[newkey[i]] = obj[newkey[i]];//向新创建的对象中按照排好的顺序依次增加键值对
	    }
	    return newObj;//返回排好序的新对象
	},
	/**
	 * 字符串格式化
	 * 1. 参数长度小于2时，直接返回字符串
	 * 2. 参数长度等于2时，认为第一个参数为需要格式化的字符串，第二个参数为对象
	 * 3. 参数长度大于2时，认为第一个参数为需要格式化的字符串，后面的参数都是需要替换的变量
	 */
	format: function(str, args){
		if (arguments.length < 2){
	        return str;
		}
		if (arguments.length == 2 && typeof (args) == "object") {
			for (var key in args) {
				if(args[key]!=undefined){
					var reg = new RegExp("({{" + key + "}})", "g");
					str = str.replace(reg, this.getjson(args, key));
				}
			}
		} else{
		    var str = arguments[0];
		    for (var i = 1; i < arguments.length; i++) {
		        var re = new RegExp('\\{{' + (i - 1) + '\\}}', 'gm');
		        str = str.replace(re, arguments[i]);
		    }
		}
		
	    return str;
	},
	/**
	 * 从js对象里通过key获取value
	 * @param obj js对象
	 * @param key key，多层key使用.分隔
	 */
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
 	enums: function(key){
 		var data = {
 			"resultCode": {
 				"success": "000001"
 			},
 			"integralProj": {
 				"status": {
 					"1": "启用",
 					"0": "停用"
 				}
 			},
 			"integralRule": {
 				"status": {
 					"1": "启用",
 					"0": "停用"
 				},
 				"integralMode": {
 					"1": "+",
 					"2": "-"
 				}
 			}
 		}
 		return this.getjson(data, key);
 	},
 	confirm : function(title, msg, callback) {
 		if($('#confirmModal').length < 1){
 			var confirmModal = '<div class="modal fade" tabindex="-1" role="dialog" id="confirmModal">'
 				+ '<div class="modal-dialog" role="document">'
 				+ '<div class="modal-content">'
 				+ '<div class="modal-header">'
 				+ '<button type="button" class="close" data-dismiss="modal" aria-label="Close">'
 				+ '<span aria-hidden="true">&times;</span></button>'
 				+ '<h4 class="modal-title"></h4></div>'
 				+ '<div class="modal-body text-md"></div>'
 				+ '<div class="modal-footer">'
 				+ '<button type="button" class="btn btn-primary btn-sm confirmBtn">确认</button>'
 				+ '<button type="button" class="btn btn-default btn-sm" data-dismiss="modal">取消</button>'
 				+ '</div></div></div></div>';
 			$('body').append(confirmModal);
 		}
 		
 		$('#confirmModal').find('.modal-title').html(title);
 		$('#confirmModal').find('.modal-body').html(msg);
 		$('#confirmModal').off('click').on('click', '.confirmBtn', function(){
 			$('#confirmModal').modal('hide');
 			if(callback){
 				callback();
 			}
 		});
 		$('#confirmModal').modal('show');
	},
	alert: function(title, msg, callback){
		if($('#alertModal').length < 1){
 			var alertModal = '<div class="modal fade" tabindex="-1" role="dialog" id="alertModal">'
 				+ '<div class="modal-dialog" role="document">'
 				+ '<div class="modal-content">'
 				+ '<div class="modal-header">'
 				+ '<button type="button" class="close" data-dismiss="modal" aria-label="Close">'
 				+ '<span aria-hidden="true">&times;</span></button>'
 				+ '<h4 class="modal-title"></h4></div>'
 				+ '<div class="modal-body text-md"></div>'
 				+ '<div class="modal-footer">'
 				+ '<button type="button" class="btn btn-primary btn-sm confirmBtn">确认</button>'
 				+ '<button type="button" class="btn btn-default btn-sm" data-dismiss="modal">取消</button>'
 				+ '</div></div></div></div>';
 			$('body').append(alertModal);
 		}
 		
 		$('#alertModal').find('.modal-title').html(title);
 		$('#alertModal').find('.modal-body').html(msg);
 		$('#alertModal').off('click').on('click', '.confirmBtn', function(){
 			$('#alertModal').modal('hide');
 			if(callback){
 				callback();
 			}
 		});
 		$('#alertModal').modal('show');
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
	}
});

$.fn.extend({
	/**
	 * 去掉表单里input/textarea数据两边的空格
	 */
	trimForm: function(){
		$(this).find("input, textarea").each(function(){
			$(this).val($.trim($(this).val())); 
		});
		return $(this);
	},
	
	/**
		obj: {
			page: 当前页数,
			pageSize: 每页数量,
			totalCount: 总记录数,
			totalPage: 总页数,
			callback: function(pageNum, pageSize)，查询数据的函数，参数分别是：页数、每页数量
		}
	*/
	paging: function(obj){
		var pagingDiv = $(this);
		pagingDiv.html('');
		var tmpl = '<form class="am-form am-form-horizontal am-margin-right-sm" role="form">';
		tmpl += '<div class="am-form-group am-form-group-sm am-margin-bottom-xs">';
//		tmpl += '<label for="name" class="am-u-sm-1 am-form-label am-text-right am-padding-left-0 am-padding-right-0">每页：</label>';
		tmpl += '<div class="am-u-sm-1 am-padding-right-0">';
		tmpl += '<select class="am-input-sm pageSize">';
		if(!obj.pageSize || obj.pageSize == 15){
			tmpl += '<option value="15">15</option>';
		} else{
			tmpl += '<option value="{{pageSize}}">{{pageSize}}</option>';
		}
		tmpl += '</select></div>条/页，当前第{{page}}/{{totalPage}}页，共{{totalCount}}条';
		tmpl += '<input type="hidden" class="currPage" value="{{page}}" />';
		tmpl += '<button type="button" class="am-btn am-btn-xs am-btn-primary prePageBtn">上一页</button>&nbsp;';
		tmpl += '<button type="button" class="am-btn am-btn-xs am-btn-primary nextPageBtn">下一页</button></div></form>';
		pagingDiv.html($.format(tmpl, obj));
		pagingDiv.off('click', '.prePageBtn');
		pagingDiv.on('click', '.prePageBtn', function(){
			var currPage = pagingDiv.find('input.currPage').val();
			var pageNum = parseInt(currPage) - 1;
			if(pageNum < 1){
				$.alert('提示', '已经是第一页');
				return false;
			}
			var pageSize = parseInt(pagingDiv.find('.pageSize').val());
			obj.callback(pageNum, pageSize);
		});
		pagingDiv.off('click', '.nextPageBtn');
		pagingDiv.on('click', '.nextPageBtn', function(){
			var pageNum = parseInt(pagingDiv.find('input.currPage').val()) + 1;
			if(pageNum > obj.totalPage){
				$.alert('提示', '已经是最后一页');
				return false;
			}
			var pageSize = parseInt(pagingDiv.find('.pageSize').val());
			obj.callback(pageNum, pageSize);
		});
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
        	beforeSend: function(xhr){
        		if(_option.shade == 1){
        			loadDialogIndex = layer.load(1, {shade:[0.3, '#000']});
        		}
        		_option.beforeSend();
        	},
            error: function(xhr, textStatus, errorThrown){  
                //错误方法增强处理  
            	if(_option.shade == 1){
            		layer.close(loadDialogIndex);
            	}
            	console.log("XMLHttpRequest:" + JSON.stringify(xhr));
            	console.log("textStatus:" + JSON.stringify(textStatus));
            	console.log("errorThrown:" + JSON.stringify(errorThrown));
            	_option.error(XMLHttpRequest, textStatus, errorThrown);  
            },  
            success: function(data){  
            	if(_option.shade == 1){
            		layer.close(loadDialogIndex);
            	}
            	if(typeof data == "object" && data.flag != 'success'){
            		layer.msg(data.msg);
            		return false;
            	}
            	_option.success(data);  
            }  
        });  
        return _ajax(_opt);  
    };  
})(jQuery);

//table列表全选控制
$('#contentBody').on('change', 'table.am-table-check thead input[type="checkbox"]', function(){
	var checked = $(this).prop('checked');
	$(this).parents('table').find('tbody input[type="checkbox"]').each(function(){
		$(this).prop('checked', checked);
	});
});
$('#contentBody').on('change', 'table.am-table-check tbody input[type="checkbox"]', function(){
	var table = $(this).parents('table');
	var inputCheckLength = table.find('tbody input[type="checkbox"]').length;
	var checkedLength = table.find('tbody input[type="checkbox"]:checked').length;
	table.find('thead input[type="checkbox"]').prop('checked', inputCheckLength == checkedLength);
});