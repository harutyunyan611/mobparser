var request = require('request');
var cheerio = require('cheerio');
request({url: "https://www.gsmarena.com/makers.php3"}, function(err, resp, body){
	var $ = cheerio.load(body);
	let n = 0;
	$("table a span").each(function(){
		n += parseInt($(this).html().split(" ")[0]);
	});
	console.log(n);
});