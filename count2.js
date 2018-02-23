var request = require('request');
var cheerio = require('cheerio');
var monthNames = [ "January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December" ];
phoneId = 0;
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
sequelize.sync({force:true});
	const Info = sequelize.define("phone_info", {
		model_id: Sequelize.INTEGER,
		network: Sequelize.JSON,
		announcedYear: Sequelize.INTEGER,
		announcedMonth: Sequelize.INTEGER,
		status: Sequelize.BOOLEAN,
		dimensionX: Sequelize.FLOAT,
		dimensionY: Sequelize.FLOAT,
		dimensionZ: Sequelize.FLOAT,
		weight: Sequelize.INTEGER,
		buildCase: Sequelize.STRING,
		displayType: Sequelize.STRING,
		displaySizeInch: Sequelize.FLOAT,
		displaySizeCm: Sequelize.INTEGER,
		displayResolutionX: Sequelize.INTEGER,
		displayResolutionY: Sequelize.INTEGER,
		displayResolutionXRatio: Sequelize.INTEGER,
		displayResolutionYRatio: Sequelize.INTEGER,
		displayResolutionDensity: Sequelize.INTEGER,
		displayMultitouch: Sequelize.BOOLEAN,
		displayOther: Sequelize.JSON,
		platformOs: Sequelize.STRING,
		platformOsVersion: Sequelize.STRING,
		platformChipset: Sequelize.STRING,
		platformCPU: Sequelize.STRING,
		platformCPUGhz: Sequelize.STRING,
		platformGPU: Sequelize.STRING,
		memoryCardSlot: Sequelize.BOOLEAN,
		memoryInternal: Sequelize.JSON,
		memoryRAM: Sequelize.INTEGER,
		cameraPrimaryMP: Sequelize.INTEGER,
		cameraPrimaryOther: Sequelize.STRING,
		cameraPrimaryFeatures: Sequelize.JSON,
		videoP: Sequelize.INTEGER,
		videoFPS: Sequelize.STRING,
		cameraSecondaryMP: Sequelize.INTEGER,
		cameraSecondaryOther: Sequelize.STRING,
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
 function asd(err, resp, body){
	var $2 = cheerio.load(body);
	let nfo = 
	{
		model_id: phoneId,
		network: JSON.stringify($2(".link-network-detail").html().split(" / ")),
		announcedYear: parseInt($2('td[data-spec="year"]').html().split(",")[0]),
		announcedMonth: $2('td[data-spec="year"]').html().split(",")[1]?monthNames.indexOf($2('td[data-spec="year"]').html().split(",")[1].trim())+1 || 0 : 0,
		status: ($2('td[data-spec="status"]').html().search("Available")>=0?1:0),
		dimensionX: parseFloat($2('td[data-spec="dimensions"]').html().split("mm")[0].split(" x ")[0]) || 0,
		dimensionY: parseFloat($2('td[data-spec="dimensions"]').html().split("mm")[0].split(" x ")[1]) || 0,
		dimensionZ: parseFloat($2('td[data-spec="dimensions"]').html().split("mm")[0].split(" x ")[2]) || 0,
		weight: parseInt($2('td[data-spec="weight"]').html()),
		buildCase: $2('td[data-spec="build"]').html() || "None",
		displayType: $2('td[data-spec="displaytype"]').html() || "0",
		displaySizeInch: parseFloat($2('td[data-spec="displaysize"]').html().split(",")),
		displaySizeCm: parseFloat($2('td[data-spec="displaysize"]').html().split(",")[1]),
		displayFit:  parseFloat($2('td[data-spec="displaysize"]').html().split("~")[1]) || 0.0,
		displayResolutionX: parseInt($2('td[data-spec="displayresolution"]').html().split(",")[0].split(" x ")[0]),
		displayResolutionY: parseInt($2('td[data-spec="displayresolution"]').html().split(",")[0].split(" x ")[1]),
		displayResolutionXRatio: parseInt($2('td[data-spec="displayresolution"]').html().split(",")[1].trim().split(" ")[0].split(":")[0]),
		displayResolutionYRatio: parseInt($2('td[data-spec="displayresolution"]').html().split(",")[1].trim().split(" ")[0].split(":")[1]),
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
	}
	async function insertDB() {
		try
		{
			Info.create(nfo).then(function(e){
				console.log(e);
				console.log("Done");
			});
		}
		catch($E)
		{
			console.log($E);
		}
		console.log("=======================================");
	}
	insertDB();
	console.log("=====================================");
	console.log(nfo);
	console.log("=====================================");
	console.log($2('td[data-spec="cameravideo"]').html());
}
// request({url: "https://www.gsmarena.com/apple_iphone_x-8858.php"}, asd);
// request({url: "https://www.gsmarena.com/acer_liquid_z6-8304.php"}, asd);
request({url: "https://www.gsmarena.com/acer_dx900-2718.php"}, asd);
// request({url: "https://www.gsmarena.com/micromax_x100-3505.php"}, asd);