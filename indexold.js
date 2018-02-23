var request = require('request');
var cheerio = require('cheerio');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('phone_project', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
  operatorsAliases: false,
  logging: false
});

(async function scrap() {
	const Phone = sequelize.define('phone', {
	  brand: Sequelize.STRING,
	  model: Sequelize.STRING
	});

	// await sequelize.sync();
	Phone.create({
		brand: "Iphone",
		model: "4s",
	});
	  // .then(() => User.create({
	  //   username: 'janedoe',
	  //   birthday: new Date(1980, 6, 20)
	  // }))
	  // .then(jane => {
	  //   console.log(jane.toJSON());
	  // });

	// var j = request.jar();
	// var cookie = request.cookie('u=NjM5NzAxOmFub24uYW5vbnltb3VzLjE5OTlAbWFpbC5ydQ%3D%3D129debd199002f7d3f6df9c6664b4bb28');
	var url = 'https://www.gsmarena.com/apple-phones-48.php';
	// j.setCookie(cookie, url);
	console.log("Req start");
	request({url: url}, function(err, resp, body){
		if (!err && resp.statusCode == 200)
		{
			console.log("Req recieved");
			var $ = cheerio.load(body);
			$(".makers").find("a").find("strong").find("span").each(function(){
				console.log($(this).html());
			});
			$(".makers").find("a").each(function(){
				// console.log($(this).attr("href"));
				request({url:'https://www.gsmarena.com/'+$(this).attr("href")}, function(err, resp, body){
						var $ = cheerio.load(body);
						// console.log(body);
						$("h1").each(function(){
							// console.log($(this).html());
						});
						$('*[data-spec~="os-hl"]').each(function(){
							// console.log($(this).html());
						});
						$(".help-camera").find("strong").find("span").eq(0).each(function(){
							// console.log($(this).html());
						});
				})
			});
		}
	});
})();
/*
		var $ = cheerio.load(body);
		var n = 1;
		$("li.article-list-block h3 a").each(function(){
			console.log(n++ + ". " + this.children[0]["data"]);
		})
*/
