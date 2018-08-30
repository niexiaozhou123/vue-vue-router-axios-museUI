export default function spreadFormat(money, places, symbol, thousand, decimal) {
	if(typeof money == "string") {
		money = parseFloat(money);
	}
	money = money || 0;
	places = !isNaN(places = Math.abs(places)) ? places : 2;
	symbol = symbol !== undefined ? symbol : "" //"￥";
	thousand = thousand || ",";
	decimal = decimal || ".";
	var negative = money < 0 ? "-" : "",
		i = parseInt(money = Math.abs(+money || 0).toFixed(places), 10) + "",
		j = (j = i.length) > 3 ? j % 3 : 0;
	var out = symbol + negative + (j ? i.substr(0, j) + thousand : "");
	out += i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand);
	if(places) {
		out += decimal;
		out += Math.abs(money - i).toFixed(places + 1).slice(2).substr(0, places);
	}
	return out;
}

