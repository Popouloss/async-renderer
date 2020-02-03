var ethers = require("ethers");
const fs = require('fs');
var Jimp = require('jimp');

// Connector variants
// Override here with custom buffer connectors
const bufferConnector = require('./connectors/google_cloud_buffer.js')
// const bufferConnector = require('./connectors/read_local_image_buffer.js')

const CONTRACT_ABI = [{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"bidAmount","type":"uint256"},{"indexed":false,"internalType":"address","name":"bidder","type":"address"}],"name":"BidProposed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"BidWithdrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"}],"name":"BuyPriceSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"priorityTip","type":"uint256"},{"indexed":false,"internalType":"uint256[]","name":"leverIds","type":"uint256[]"},{"indexed":false,"internalType":"int256[]","name":"previousValues","type":"int256[]"},{"indexed":false,"internalType":"int256[]","name":"updatedValues","type":"int256[]"}],"name":"ControlLeverUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"platformAddress","type":"address"}],"name":"PlatformAddressUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"platformFirstPercentage","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"platformSecondPercentage","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"artistSecondPercentage","type":"uint256"}],"name":"RoyaltyAmountUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"TokenConfirmed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"salePrice","type":"uint256"},{"indexed":false,"internalType":"address","name":"buyer","type":"address"}],"name":"TokenSale","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"artistSecondSalePercentage","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"buyPrices","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"pendingBids","outputs":[{"internalType":"address payable","name":"bidder","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bool","name":"exists","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"permissionedControllers","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"platformAddress","outputs":[{"internalType":"address payable","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"platformFirstSalePercentage","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"platformSecondSalePercentage","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"tokenDidHaveFirstSale","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"tokenIsConfirmed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"whitelistedCreators","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"creator","type":"address"},{"internalType":"bool","name":"state","type":"bool"}],"name":"updateWhitelist","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address payable","name":"newPlatformAddress","type":"address"}],"name":"updatePlatformAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_platformFirstSalePercentage","type":"uint256"},{"internalType":"uint256","name":"_platformSecondSalePercentage","type":"uint256"},{"internalType":"uint256","name":"_artistSecondSalePercentage","type":"uint256"}],"name":"updateRoyaltyPercentages","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"artworkTokenId","type":"uint256"},{"internalType":"uint256","name":"controlTokenId","type":"uint256"},{"internalType":"string","name":"controlTokenURI","type":"string"},{"internalType":"int256[]","name":"leverMinValues","type":"int256[]"},{"internalType":"int256[]","name":"leverMaxValues","type":"int256[]"},{"internalType":"int256[]","name":"leverStartValues","type":"int256[]"}],"name":"setupControlToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"artworkTokenId","type":"uint256"},{"internalType":"string","name":"artworkTokenURI","type":"string"},{"internalType":"address payable[]","name":"controlTokenArtists","type":"address[]"}],"name":"mintArtwork","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"bid","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"withdrawBid","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"takeBuyPrice","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"acceptBid","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"makeBuyPrice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"controlTokenId","type":"uint256"}],"name":"getControlToken","outputs":[{"internalType":"int256[]","name":"","type":"int256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"permissioned","type":"address"}],"name":"grantControlPermission","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"controlTokenId","type":"uint256"},{"internalType":"uint256[]","name":"leverIds","type":"uint256[]"},{"internalType":"int256[]","name":"newValues","type":"int256[]"}],"name":"useControlToken","outputs":[],"payable":true,"stateMutability":"payable","type":"function"}]

// TODO move provider into a separate module too
const provider = new ethers.providers.JsonRpcProvider('http://localhost:7545');
// const provider = new ethers.providers.JsonRpcProvider('https://goerli.infura.io/v3/e6fbb7c91658422b8582e035657141bf');
// const provider = new ethers.providers.JsonRpcProvider('https://www.ethercluster.com/goerli');
// const provider = new ethers.providers.InfuraProvider('goerli');

async function process(tokenAddress, tokenId, blockNum) {	
	var network = await provider.getNetwork();

	var finalImage = await onNetworkLoaded(tokenAddress, tokenId, blockNum);

	return finalImage;
}

async function onNetworkLoaded(tokenAddress, tokenId, blockNum) {
	let contract = new ethers.Contract(tokenAddress, CONTRACT_ABI, provider);

	// load the token URI for the layout
	console.log("Retrieving layout URI...");
	var tokenURI = await contract.tokenURI(tokenId);

	console.log("Retrieving layout file...");
	let layoutBuffer = await bufferConnector.loadFromURI(tokenURI);

	var layout = JSON.parse(layoutBuffer.toString())

	// if no block num was provided then use the latest block number (minus 2 so we don't use a block that is pending currently)
	if (blockNum === -1) {
		blockNum = (await provider.getBlockNumber());

		console.log("Retrieved latest block number: " + blockNum);
	}

	// load the correct renderer based on layout type and version
	var renderer = require("./" + layout.type + "/v" + layout.version + ".js")

	// set the buffer connector on the renderer
	renderer.setBufferConnector(bufferConnector);
	
	// render the image
	var finalImage = await renderer.render(contract, layout, blockNum);

	// stamp the metadata
	await stampBlockNumber(finalImage, blockNum);

	return finalImage;
}

async function stampBlockNumber(image, blockNum) {
	var stampWidth = 350;
	var stampHeight = 50;

	var stampX = image.bitmap.width - stampWidth;
	var stampY = image.bitmap.height - stampHeight;

	await image.scan(stampX, stampY, stampWidth, stampHeight, function (x, y, offset) {
		var color = Jimp.rgbaToInt(255, 255, 255, 255);

		image.setPixelColor(color, x, y)
	});

	// load a font
	var font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

	// print the block number
	image.print(font, stampX + 25, stampY + 9, "Block #" + blockNum);
}

exports.process = process