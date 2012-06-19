var gameRules = new Object();

//grid dim
gameRules.maxX = 800;
gameRules.maxY = 500;

//ship management
gameRules.tickCounter = 0;
gameRules.ships = new Object();
gameRules.shipIds = [];


gameRules.tickArray = [];


gameRules.prepTick = function()
{
	var dataArray = gameRules.tickArray[0];
    	gameRules.tickArray.splice(0,1);

   	for (var i = 0; i < dataArray.events.length; i++)
   	{
		var data = dataArray.events[i];
		shipKeyCommands(data.userId, data.cmdVal, (data.cmdType=='d'));
	}
}

gameRules.tick = function()
{
	if (gameRules.tickArray.length > 0)
	{
		gameRules.prepTick();

		gameRules.shipTakeKeyCommands();

		gameRules.moveShip();
		gameRules.slowShip();

		gameRules.tickCounter++;
	}
	setTimeout('gameRules.tick()', 50);
}

gameRules.newExistingShip = function(ship)
{
	if (gameRules.shipIds.indexOf(ship.shipId) == -1)
	{
		$('body').append($("<div id=\"ship" + ship.shipId + "\" class=\"rocket-ship\"><img src=\"./player_" + ship.imgIndex + ".png\"/></div>"));

		ship.height = $("#ship" + ship.shipId).height();
		ship.width = $("#ship" + ship.shipId).width();
		ship.img = $("#ship" + ship.shipId + " > img")[0];

		ship.type = "existing";
		ships[ship.shipId] = ship;
		shipIds.push(ship.shipId);
	}
}

		//Create new ship
gameRules.newShip = function(shipId, xPos, yPos, imgIndex)
{
	if (gameRules.shipIds.indexOf(shipId) == -1)
	{
		var ship = new Object();
		ship.xPos = xPos;
		ship.yPos = yPos;
		ship.pointingDeg = 0;
		ship.xv = 0;
		ship.yv = 0;
		ship.height = 0;
		ship.width = 0;
		ship.leftPressed = false;
		ship.rightPressed = false;
		ship.upPressed = false;
		ship.shipId = shipId;
		ship.imgIndex = imgIndex;

		ship.type = "new";

		ships[shipId] = ship;
		shipIds.push(shipId);
	}
}


gameRules.shipKeyCommands = function(userId, key, isPressed)
{
	var ship = gameRules.ships[userId];
	if (key == 39)
	{
		ship.leftPressed = isPressed;
	}else if (key == 37)
	{
		ship.rightPressed = isPressed;
	}else if (key == 38)
	{
		ship.upPressed = isPressed;
	}
}

gameRules.shipTakeKeyCommands = function()
{

	for (var i = 0; i < gameRules.shipIds.length; i++)
	{
		var ship = gameRules.ships[shipIds[i]];
		if (ship.leftPressed)
		{
			ship.pointingDeg += 10;
		}

		if (ship.rightPressed)
		{
			ship.pointingDeg -= 10;
		}

		if (ship.upPressed)
		{
			if (tickCounter % 3 == 0)
			{
				ship.pointingDeg = ship.pointingDeg % 360;

				// convert degrees to radians
				anglexinradians = ship.pointingDeg * Math.PI / 180

				// solve for side a
				ship.xv = ship.xv + Math.sin(anglexinradians) * 3;

				// solve for side b
				ship.yv = ship.yv - Math.cos(anglexinradians) * 3;


				gameRules.renderShipCoastImage(ship);

			}
		}else
		{
			gameRules.renderShipMovingImage(ship);
			
		}
	}
}

gameRules.slowShip = function()
{
	for (var i = 0; i < gameRules.shipIds.length; i++)
	{
		var ship = gameRules.ships[shipIds[i]];
		ship.xv = ship.xv * .95;
		ship.yv = ship.yv * .95;
	}
}

gameRules.moveShip = function()
{
	for (var i = 0; i < gameRules.shipIds.length; i++)
	{
		var ship = gameRules.ships[shipIds[i]];
		ship.xPos = ship.xPos + ship.xv;
		ship.yPos = ship.yPos + ship.yv;

		if (ship.xPos < 0) { ship.xPos = 0; }
		if (ship.yPos < 0) { ship.yPos = 0; }
		if (ship.xPos > maxX - ship.width) { ship.xPos = maxX - ship.width };
		if (ship.yPos > maxY - ship.height) { ship.yPos = maxY - ship.height };

		gameRules.renderShipMove(ship);		
	}
}

gameRules.renderShipSetup = function(ship)
{
}

gameRules.renderShipMove = function(ship)
{
}

gameRules.renderShipCoastImage = function(ship)
{
}

gameRules.renderShipMovingImage = function(ship)
{
}

