var request = require('request');
var rp = require('request-promise');
var cheerio = require('cheerio');
var monthNames = [ "January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December" ];
const Sequelize = require('sequelize');
const sequelize = new Sequelize('phone_project', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    acquire: 3000000,
    idle: 1000000
  },
  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
  operatorsAliases: false,
  logging: false
});
// { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
const baseURL = "https://www.gsmarena.com/";
const options = {
    uri: 'http://www.google.com',
    transform: function (body) {
        return cheerio.load(body);
    }
};
(async function scrap() {
	const Brands = sequelize.define('brands', {
		name: Sequelize.STRING
	},{
		timestamps: false
	})
	const Phone = sequelize.define('phone', {
	  brand_id: Sequelize.INTEGER,
	  model: Sequelize.STRING
	});
	const Info = sequelize.define("phone_info", {
		model_id: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},
		network: Sequelize.JSON,
		announcedYear: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},
		announcedMonth: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},
		status: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
		dimensionX: {type: Sequelize.FLOAT, allowNull: false, defaultValue: 0.0},
		dimensionY: {type: Sequelize.FLOAT, allowNull: false, defaultValue: 0.0},
		dimensionZ: {type: Sequelize.FLOAT, allowNull: false, defaultValue: 0.0},
		weight: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},
		buildCase: {type: Sequelize.STRING,allowNull: false, defaultValue: "0"},
		displayType: {type: Sequelize.STRING,allowNull: false, defaultValue: "0"},
		displaySizeInch: {type: Sequelize.FLOAT, allowNull: false, defaultValue: 0.0},
		displaySizeCm: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},
		displayResolutionX: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},
		displayResolutionY: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},
		displayResolutionXRatio: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},
		displayResolutionYRatio: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},
		displayResolutionDensity: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},
		displayMultitouch: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
		displayOther: Sequelize.JSON,
		platformOs: {type: Sequelize.STRING,allowNull: false, defaultValue: "0"},
		platformOsVersion: {type: Sequelize.STRING,allowNull: false, defaultValue: "0"},
		platformChipset: {type: Sequelize.STRING,allowNull: false, defaultValue: "0"},
		platformCPU: {type: Sequelize.STRING,allowNull: false, defaultValue: "0"},
		platformCPUGhz: {type: Sequelize.STRING,allowNull: false, defaultValue: "0"},
		platformGPU: {type: Sequelize.STRING,allowNull: false, defaultValue: "0"},
		memoryCardSlot: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
		memoryInternal: Sequelize.JSON,
		memoryRAM: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},
		cameraPrimaryMP: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},
		cameraPrimaryOther: {type: Sequelize.STRING,allowNull: false, defaultValue: "0"},
		cameraPrimaryFeatures: Sequelize.JSON,
		videoP: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},
		videoFPS: {type: Sequelize.STRING,allowNull: false, defaultValue: "0"},
		cameraSecondaryMP: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},
		cameraSecondaryOther: {type: Sequelize.STRING,allowNull: false, defaultValue: "0"},
		url: Sequelize.STRING,
		// soundAlert: Sequelize.STRING,
		// soundLoudspeaker: Sequelize.BOOLEAN,
		// soundLoudspeakerStereo: Sequelize.BOOLEAN,
		// soundJack: Sequelize.BOOLEAN,
		// soundAdapter: Sequelize.BOOLEAN,
		// commsWLAN: Sequelize.STRING,
		// commsBluetoothVersion: Sequelize.INTEGER,
		// commsGPS: Sequelize.STRING,
		// commsNFC: Sequelize.BOOLEAN,
		// commsRadio: Sequelize.BOOLEAN,
		// commsUsbVersion: Sequelize.FLOAT,
		// commsUsbReversible: Sequelize.BOOLEAN,
		// sensors: Sequelize.JSON,
		// messaging: Sequelize.JSON,
		// browser: Sequelize.STRING,
		// features: Sequelize.JSON,
		// batterymAh: Sequelize.INTEGER,
		// battery: Sequelize.STRING,
		// batteryTalkTime2g: Sequelize.INTEGER,
		// batteryTalkTime3g: Sequelize.INTEGER,
		// batteryMusicPlay: Sequelize.INTEGER,
		// batteryStandBy: Sequelize.INTEGER,
		// colors: Sequelize.JSON,
	});
	await sequelize.sync({force: true});
	options.uri = "https://www.gsmarena.com/makers.php3";
	let start = new Date();
	let $ = await rp(options);
	let b;
	let n = 0;
	async function getModelsInsertDb(brandId, options) {
		return new Promise(async resolve => {
			let $ = await rp(options);
			$(".makers li").map(async function(key, val){
				let phoneId = await Phone.create({
					"brand_id": brandId,
					"model": $(val).find("span").html(),
				}).get("id");
				console.log(n);
				if (n++ >= 8896) {
					console.log("Finished!", new Date - start/1000, " seconds");
				}
				options.uri = baseURL + $(val).find("a").attr("href");
				let $2 = await rp(options);
				let a = {
									model_id: phoneId,
									network: JSON.stringify($2(".link-network-detail").html().split(" / ")),
									announcedYear: Number.isNaN(parseInt($2('td[data-spec="year"]').html().split(",")[0]))?0:parseInt($2('td[data-spec="year"]').html().split(",")[0]),
									announcedMonth: $2('td[data-spec="year"]').html().split(",")[1]?monthNames.indexOf($2('td[data-spec="year"]').html().split(",")[1].trim())+1 || 0 : 0,
									status: ($2('td[data-spec="status"]').html().search("Available")>=0?1:0),
									dimensionX: parseFloat($2('td[data-spec="dimensions"]').html().split("mm")[0].split(" x ")[0]) || 0,
									dimensionY: parseFloat($2('td[data-spec="dimensions"]').html().split("mm")[0].split(" x ")[1]) || 0,
									dimensionZ: parseFloat($2('td[data-spec="dimensions"]').html().split("mm")[0].split(" x ")[2]) || 0,
									weight: Number.isNaN(parseInt($2('td[data-spec="weight"]').html()))?0:parseInt($2('td[data-spec="weight"]').html()),
									buildCase: $2('td[data-spec="build"]').html() || "None",
									displayType: $2('td[data-spec="displaytype"]').html() || "0",
									displaySizeInch: parseFloat($2('td[data-spec="displaysize"]').html().split(",")),
									displaySizeCm: parseFloat($2('td[data-spec="displaysize"]').html().split(",")[1]),
									displayFit:  parseFloat($2('td[data-spec="displaysize"]').html().split("~")[1]) || 0.0,
									displayResolutionX: parseInt($2('td[data-spec="displayresolution"]').html().split(",")[0].split(" x ")[0]),
									displayResolutionY: parseInt($2('td[data-spec="displayresolution"]').html().split(",")[0].split(" x ")[1]),
									displayResolutionXRatio: 0,
									displayResolutionYRatio: 0,
									// displayResolutionXRatio: parseInt($2('td[data-spec="displayresolution"]').html().split(",")[1].trim().split(" ")[0].split(":")[0]),
									// displayResolutionYRatio: parseInt($2('td[data-spec="displayresolution"]').html().split(",")[1].trim().split(" ")[0].split(":")[1]),
									displayResolutionDensity: parseInt($2('td[data-spec="displayresolution"]').html().split("~")[1]) || 0,
									displayMultitouch: ($2("td:contains('Multitouch')"))?(($2("td:contains('Multitouch')").parent().children(".nfo").html() == "Yes")?true:false):false,
									displayOther: $2('td[data-spec="displayother"]').html()?$2('td[data-spec="displayother"]').html().split("<br>").map(function(key, val){
										return key.split("- ")[1];
									}) || 0 : 0,
									platformOs: $2('td[data-spec="os"]').html() || 0,
									platformOsVersion: $2('td[data-spec="os"]').html()?$2('td[data-spec="os"]').html().split(" ")[1]:0,
									platformChipset: $2('td[data-spec="chipset"]').html() || "0",
									platformCPU: $2('td[data-spec="cpu"]').html() || "0",
									platformCPUGhz: $2('td[data-spec="cpu"]').html()?(Number.isNaN(parseFloat($2('td[data-spec="cpu"]').html().split(" ")[1]))?-1:parseFloat($2('td[data-spec="cpu"]').html().split(" ")[1])):0,
									platformGPU: $2('td[data-spec="gpu"]').html() || "0",
									memoryCardSlot: $2('td[data-spec="memoryslot"]').html().search("microSD")!=-1?true:false,
									memoryInternal: $2('td[data-spec="internalmemory"]').html()?JSON.stringify($2('td[data-spec="internalmemory"]').html().split(", ")[0].split(" ")[0].split("/")):"0",
									memoryRAM: $2('td[data-spec="internalmemory"]').html()?(Number.isNaN(parseInt($2('td[data-spec="internalmemory"]').html().split(", ")[1]))?-1:parseInt($2('td[data-spec="internalmemory"]').html().split(", ")[1])):"0",
									cameraPrimaryMP: ($2('td[data-spec="cameraprimary"]').html() && $2('td[data-spec="cameraprimary"]').html() != "No")?((Number.isNaN(parseInt($2('td[data-spec="cameraprimary"]').html().split(",")[0])))?9999:parseInt($2('td[data-spec="cameraprimary"]').html().split(",")[0])):0,
									cameraPrimaryOther: ($2('td[data-spec="cameraprimary"]').html() && $2('td[data-spec="cameraprimary"]').html() != "No")?$2('td[data-spec="cameraprimary"]').html().split(" <a")[0]:0,
									cameraPrimaryFeatures: $2('td[data-spec="camerafeatures"]').html()?JSON.stringify($2('td[data-spec="camerafeatures"]').html().split(", ")):0,
									videoP: $2('td[data-spec="cameravideo"]').html()?($2('td[data-spec="cameravideo"]').html() == "Yes")?1:parseInt($2('td[data-spec="cameravideo"]').html().split(",")[0].split("@")[0]):0,
									videoFPS: $2('td[data-spec="cameravideo"]').html()?($2('td[data-spec="cameravideo"]').html() == "Yes")?1:($2('td[data-spec="cameravideo"]').html().split(",")[0].split("@")[1]):0,
									cameraSecondaryMP: $2('td[data-spec="camerasecondary"]').html()?(Number.isNaN(parseInt($2('td[data-spec="camerasecondary"]').html()))?1:parseInt($2('td[data-spec="camerasecondary"]').html())):0,
									cameraSecondaryOther: $2('td[data-spec="camerasecondary"]').html()?($2('td[data-spec="camerasecondary"]').html()):0,
									url: $(val).find("a").attr("href"),
								};
					let b = Info.create(a).then(function(a){
						resolve($);
					}, function($E){
						console.log($E)
						console.log("=======================================");
					});
			});
		});
	}
	$("table a").map(async function(key, value){
		let brandUrl = $(value).attr("href");
			let brandId = await Brands.create({
				name: $(value).html().split("<br>")[0],
			}).get("id");
			options.uri = baseURL + brandUrl;
			let $2 = await getModelsInsertDb(brandId, options);
			if ($2(".nav-pages").length === 1) {
				$2(".nav-pages a").map(async function(key, val){
					options.uri = baseURL + $2(val).attr("href");
					await getModelsInsertDb(brandId, options);
				});
			}
	})
})();
