gameRule.renderShipSetup = function(ship)
{
	$('body').append($("<div id=\"ship" + shipId + "\" class=\"rocket-ship\"><img src=\"./player_" + ship.imgIndex + ".png\"/></div>"));

	ship.element = $("#ship" + shipId);
	ship.height = ship.element.height();
	ship.width = ship.element.width();
	ship.img = $("#ship" + shipId + " > img")[0];
}

gameRules.renderShipMove = function(ship)
{
	ship.element.css('left', ship.xPos  + "px");
	ship.element.css('top', ship.yPos + "px");

	ship.element.rotate(ship.pointingDeg);
}

gameRules.renderShipCoastImage = function(ship)
{
	ship.img.src = "./player_" + ship.imgIndex + ".png";
}

gameRules.renderShipMovingImage = function(ship)
{
	ship.img.src = "./player_" + ship.imgIndex + "-blasting.png";
}