import {currentAgent} from 'common/js/config.js'
export default {
	spreadFilterHtml: function(html) {
		if(!html) return '';
		return html.replace(/<[^>]+>/g, '');
	},
	//检测session内的login信息  不为空返回
	spreadLogined: function() {
		var logined = sessionStorage.spread_domain && sessionStorage.spread_user;
		if(!logined) {
//			location.replace('/');
//			this.$router.back();
			location.pathname = '/dist/login/'+currentAgent+'/login.html';
		}
		return logined;
	},
	//检测session内的user信息  不为空返回
	spreadUser: function() {
		var user;
		try {
			user = JSON.parse(sessionStorage.spread_user);
		} catch(e) {
			//TODO handle the exception
			console.warn(sessionStorage.spread_user, e);
			user = null;
		}

		return user;
	},
	spreadParam: function(key, url) {
		url = url || this.$router.url;
		if(!key || !url) return null;
		var item = url.match(new RegExp("[\?\&]" + key + "=([^\&]*)(\&?)", "i"));
		return item && decodeURIComponent(item[1]);
	},
	addStar: function(str, substr) {
		var length = str.length;
		if(length < 2) {
			return str;
		}
		if(length === 2) {
			substr = substr.substr(0, 1);
		}
		var starStr = '';
		for(var i = 0; i < substr.length; i++) {
			starStr += '*';
		}
		return str.replace(substr, starStr);
	},
	interceptStrAccordByte: function(str, len) {
		var regexp = /[^\x00-\xff]/g;
		if(str.replace(regexp, "aa").length <= len) {
			return str;
		}
		var m = Math.floor(len / 2);
		for(var i = m, j = str.length; i < j; i++) {
			// 当截取字符串字节长度满足指定的字节长度
			if(str.substring(0, i).replace(regexp, "aa").length >= len) {
				return str.substring(0, i);
			}
		}
		return str;
	},
	spreadUrl: function(path) {
		return sessionStorage.spread_domain + (path || "");
	},

}