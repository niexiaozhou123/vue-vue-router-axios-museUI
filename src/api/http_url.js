//使用时，需在vue页面下引入
var localhostDev = true;
//var localhostDev = false;
//如果是本地开发，就把localhostDev 设置成true，
//生产环境，就把localhostDev 设置成false
//npm run build 之前先修改此变量
//使用方式    httpUrl+'api/xxx/xxx' 做拼接
var httpUrl = localhostDev ?'http://spread.jndsfs.com/':'http://bxspread.company.com/';

export {httpUrl}
