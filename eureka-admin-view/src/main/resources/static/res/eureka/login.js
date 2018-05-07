$(function(){
	$("#mobilePhone").focus();
});

$("#loginBtn").on("click", function(){
//	if(!loginFormValidate()){
//		return false;
//	}
//	$("#loginForm").ajaxSubmit({
//		url: basePath + "login",
//		type: "post",
//		dataType: "json",
//		success: function(data){
//			location.href = basePath + 'waybill/index';
//		}
//	});
	
	
	$.ajax({
		url: 'http://mosslocal.yuanqu56.com:8081/memcached/jsonp',
		type: "get",
		dataType: "jsonp",
		async: false,
		jsonp: "callback",
//		data: {callback: "callback"},
//		jsonpCallback: "success_jsonpCallback",
		success: function(data){
			console.log(data);
		}
	});
	
});

var loginFormValidate = $("#loginForm").bindvalidate({
	rules: {
		"#mobilePhone": [ITReg.required,ITReg.mobilePhoneReg],
		"#loginPwd": [ITReg.required,ITReg.loginPwd]
	},
	messages: {
		"#mobilePhone": ["请输入登录手机号", "手机号长度为11位"],
		"#loginPwd": ["请输入密码", "密码长度为6-20位字符"]
	}
});

//表单绑定keyup事件，回车键登录
$("#loginForm").on("keyup", function(event){
	if(event.keyCode == 13){
		$("#loginBtn").trigger("click");
	}
});