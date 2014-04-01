//1 - body
//2 - legs
//3 - arms
//Current rules are:
//    - 3 minutes is a year
//    - After 16 minutes they will die without food
//    - A unit of food lasts 30 seconds
//    - There are 32 units of food (hence 16 mins)



var Engine = {
    Canvas: null,
    CTX: null,
    Canvas2: null,
    CTX2: null,
    GameLooper: null,
    Frames: 0,

    /** Global Vars **/
    Year: 50, //180000 - 3mins
    Pet: {
		DayTimer: null,
		Day: 1,
        AgeTimer: null,
        Age: 0,
		AnimFrame: 0,
		Strength: 0,
		Dexterity: 0,
		Wisdom: 0,
		Hunger: 0,
		HungerTime: 30000, //30000 - 1/2 min. 32 x 30sec = Will die after 16 minutes of neglect
		HungerTimer: null,
    },
    mx: 0,
    my: 0,
    EyeDirX: 3,
    EyeDirY: 3,
    /*****************/

    Init: function (theSize) {
		Engine.Canvas = document.createElement('canvas');
		Engine.Canvas.id = "display";
        document.body.appendChild(Engine.Canvas);
        Engine.CTX = Engine.Canvas.getContext('2d');
        Engine.Canvas.width = (10*theSize);
        Engine.Canvas.height = (10*theSize);
		
		Engine.Canvas2 = document.createElement('canvas');
		Engine.Canvas2.id = "display2";
        document.body.appendChild(Engine.Canvas2);
        Engine.CTX2 = Engine.Canvas2.getContext('2d');
        Engine.Canvas2.width = (10*theSize);
        Engine.Canvas2.height = (10*theSize);

		for (var x = 0; x < theSize; x++) {
			Pet[x] = [];    
			for (var y = 0; y < theSize; y++) { 
				Pet[x][y] = 0;    
			}    
		}
		
		Engine.Pet.Hunger = (10*theSize);
		
        /*************INITIALISE_CODE_HERE*************/
		
		PetMethods.AgeThreshold = Math.floor(Math.random() * 50) + 20; //25 -> 70 years old
		PetMethods.ThisType = 0; //random types?
		
        Engine.Canvas2.addEventListener('mousemove', function (m) {
            Engine.mx = m.pageX;
            Engine.my = m.pageY;
            if (Engine.mx < Math.floor(Engine.Canvas.width / 2)) {
                Engine.EyeDirX = 1;
            } else {
                Engine.EyeDirX = 5;
            }
            if (Engine.my < Math.floor(Engine.Canvas.height / 2)) {
                Engine.EyeDirY = 1;
            } else {
                Engine.EyeDirY = 5;
            }
        });

        Engine.Canvas2.addEventListener('mouseout', function () {
            Engine.EyeDirX = 3;
            Engine.EyeDirY = 3;
        });

        /*btns
		Engine.Canvas2.addEventListener('click', function () {
            if (Engine.mx > 2 && Engine.mx < 66 && Engine.my > 286 && Engine.my < 318) {
                window.localStorage.setItem('EPet', JSON.stringify(Pet));
                window.localStorage.setItem('EPetInfo', JSON.stringify(Engine.Pet));
                alert("Saved");
            } else if (Engine.mx > 68 && Engine.mx < 132 && Engine.my > 286 && Engine.my < 318) {
                if (window.localStorage.getItem('EPet')) {
                    Pet = JSON.parse(window.localStorage.getItem('EPet'));
                    Engine.Pet = JSON.parse(window.localStorage.getItem('EPetInfo'));
                    alert("Loaded");
                } else {
                    alert("Can't load what doesn't exist!");
                }
            }
        });

        /**********************************************/

        //start of pet
		//top layer
        for (var a = 18; a >= 13; a--) {
			Pet[a][13] = 1;
		}

		//main area
        for (var b = 19; b >= 12; b--) {
			Pet[b][14] = 1;
			Pet[b][15] = 1;
			Pet[b][16] = 1;
		}

		//bottom layer
        Pet[18][17] = 1;
        Pet[17][17] = 1;
        Pet[16][17] = 1;
        Pet[15][17] = 1;
        Pet[14][17] = 1;
        Pet[13][17] = 1;
		
		PetMethods.EyeColour = "rgba("+(Math.floor(Math.random() * 100)+50)+","+(Math.floor(Math.random() * 100)+50)+","+(Math.floor(Math.random() * 100)+50)+",1.0)";
		PetMethods.PrimaryColour = "rgba("+(Math.floor(Math.random() * 100)+50)+","+(Math.floor(Math.random() * 100)+50)+","+(Math.floor(Math.random() * 100)+50)+",1.0)";
		PetMethods.SecondaryColour = "rgba("+(Math.floor(Math.random() * 100)+50)+","+(Math.floor(Math.random() * 100)+50)+","+(Math.floor(Math.random() * 100)+50)+",1.0)";
		
        Engine.GameLoop();
		
        Engine.Pet.AgeTimer = setInterval(function () {
            Engine.Pet.Age++;
            PetMethods.CheckAge();
        }, Engine.Year);
		
        Engine.Pet.DayTimer = setInterval(function () {
            Engine.Pet.Day++;
			if (Engine.Pet.Day > 365) {
				Engine.Pet.Day = 1;
			}
        }, Math.floor(Engine.Year/365));
		
		Engine.Pet.HungerTimer = setInterval(function() {
			if (Engine.Pet.Hunger >= 10) {
				Engine.Pet.Hunger -= 10;
				if (Engine.Pet.Hunger <= 10) {
					clearInterval(Engine.Pet.AgeTimer);
					clearInterval(Engine.Pet.HungerTimer);
					PetMethods.Elderly = true;
					alert("Your pet died because you didn't feed it");
				}
			}
		}, Engine.Pet.HungerTime);

    },
    Update: function () {

        /*************UPDATE_LOGIC_HERE****************/
        Engine.Frames++;
        /**********************************************/

        Engine.Draw();
    },
    Draw: function () {
        Engine.CTX.clearRect(0, 0, 320, 320);
        /**************DRAW_SCENE_HERE*****************/
        Engine.Rect(0, 0, Engine.Canvas.width, Engine.Canvas.height, 'lightblue');
        //Engine.Rect(45, 100, 64, 48, '#fff'); //cloud 1
        //Engine.Rect(210, 80, 84, 28, '#fff'); //cloud 2
        //Engine.Rect(0, 200, Engine.Canvas.width, 120, '#2E4722');

        for (var x = 0; x < Pet.length; x++) {
            for (var y = 0; y < Pet[x].length; y++) {
				
				Engine.CTX2.globalCompositeOperation = "source-over";
				PetMethods.Shade = Math.floor(Math.random() * 254);
				
                if (Pet[x][y] === 1) {
                    Engine.Rect2(10 * x, 10 * y, 10, 10, PetMethods.PrimaryColour);
                } else if (Pet[x][y] === 2) {
                    Engine.Rect2(10 * x, 10 * y, 10, 10, PetMethods.SecondaryColour);
                } else if (Pet[x][y] === 3) {
                    Engine.Rect2(10 * x, 10 * y, 10, 10, PetMethods.SecondaryColour);
                } else {
                    //Engine.Rect(10 * x, 10 * y, 10, 10, '#f4f4f4');
                }
								
				if (Pet[x][y] > 0) {
					Engine.CTX2.globalCompositeOperation = "lighten";
					Engine.Rect2(10 * x, 10 * y, 10, 10, 'rgba('+PetMethods.Shade+','+PetMethods.Shade+','+PetMethods.Shade+',0.1)');
				}
				
				//hunger
				Engine.Rect(0, 0, 320, 5, 'black');
				Engine.Rect(1, 1, Engine.Pet.Hunger, 3, 'green');
            }
        }

        //fillstyles
		Engine.CTX.fillStyle = "#222";
		
		//debug
        //Engine.CTX.fillText("Frame #" + Engine.Frames, 230, 16);
		
        //age
        Engine.CTX.fillText("Day " + Engine.Pet.Day + ". " + Engine.Pet.Age + " years.", 2, 16);
        Engine.CTX.fillText("Strength: " + Engine.Pet.Strength, 2, 32);
        Engine.CTX.fillText("Dexterity: " + Engine.Pet.Dexterity, 2, 42);
        Engine.CTX.fillText("Wisdom: " + Engine.Pet.Wisdom, 2, 52);
		
        //eyes			
        //x:14 y:15
        //x:17 y:15
		Engine.Rect2((10 * 14), (10 * 14), 10, 10, '#fff');
		Engine.Rect2((10 * 17), (10 * 14), 10, 10, '#fff');
		Engine.Rect2((10 * 14) + Engine.EyeDirX, (10 * 14) + Engine.EyeDirY, 4, 4, PetMethods.EyeColour);
		Engine.Rect2((10 * 17) + Engine.EyeDirX, (10 * 14) + Engine.EyeDirY, 4, 4, PetMethods.EyeColour);

		//mouth
        Engine.Rect2((10 * 14), (10 * 16), 40, 10, 'darkred');
		
		
        /*btns
        Engine.Rect(2, 286, 64, 32, '#222');
        Engine.CTX.fillStyle = "#fff";
        Engine.CTX.fillText("Save", 19, 305);

        Engine.Rect(68, 286, 64, 32, '#222');
        Engine.CTX.fillStyle = "#fff";
        Engine.CTX.fillText("Load", 87, 305);
		
        Engine.Rect(134, 286, 64, 32, '#222');
        Engine.CTX.fillStyle = "#fff";
        Engine.CTX.fillText("Feed", 153, 305);
        /**********************************************/
		
		Engine.CTX2.fillStyle = "rgba(0,0,0,0.75)";
		Engine.CTX2.font = '24pt Calibri';
		Engine.CTX2.fillText(document.getElementById("seed").value, 16, 300);

        Engine.GameLoop();
    },
    GameLoop: function () {
        Engine.GameLooper = setTimeout(function () {
            requestAnimFrame(Engine.Update, Engine.Canvas);
        }, 10);
    },
    Rect: function (x, y, w, h, col) {
        if (col.length > 0) {
            Engine.CTX.fillStyle = col;
        }
        Engine.CTX.fillRect(x, y, w, h);
    },
    Rect2: function (x, y, w, h, col) {
        if (col.length > 0) {
            Engine.CTX2.fillStyle = col;
        }
        Engine.CTX2.fillRect(x, y, w, h);
    }
};

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback, element) {
            fpsLoop = window.setTimeout(callback, 1000 / 60);
    };
}());

var Pet = [];

var Count = {
	u:0,
	d:0,
	l:0,
	r:0
};

var PetMethods = {
	ThisType: 0,
    Mutate: function () {
        var bufferedPet = [];
        for (var x = 0; x < 32; x++) {
            for (var y = 0; y < 32; y++) {
                if (Pet[x][y] === 1) {
                    bufferedPet.push([
                        [x, y]
                    ]);
                }
            }
        }
		
		if (PetMethods.ThisType === 0) {
			var dirChance = Math.floor(Math.random() * 4); //0-4
		}
		
        var whichBuffer = Math.floor(Math.random() * bufferedPet.length);
		var removeChance = Math.floor(Math.random() * 100);
		
        switch (dirChance) {
			case 0: //up
				if (Pet[bufferedPet[whichBuffer][0][0]][bufferedPet[whichBuffer][0][1] - 1] === 0) {
					PetMethods.MirrorArray(Pet, bufferedPet[whichBuffer][0][0], bufferedPet[whichBuffer][0][1] - 1, 1);
					Pet[bufferedPet[whichBuffer][0][0]][bufferedPet[whichBuffer][0][1] - 1] = 1;
					Count.u++;
				} else {
					PetMethods.Mutate();
				}
				break;
			case 1: //down
				if (Pet[bufferedPet[whichBuffer][0][0]][bufferedPet[whichBuffer][0][1] + 1] === 0) {
					PetMethods.MirrorArray(Pet, bufferedPet[whichBuffer][0][0], bufferedPet[whichBuffer][0][1] + 1, 1);
					Pet[bufferedPet[whichBuffer][0][0]][bufferedPet[whichBuffer][0][1] + 1] = 1;
					Count.d++;
				} else {
					PetMethods.Mutate();
				}
				break;
			case 2: //left
				if (Pet[bufferedPet[whichBuffer][0][0] - 1][bufferedPet[whichBuffer][0][1]] === 0) {
					PetMethods.MirrorArray(Pet, bufferedPet[whichBuffer][0][0] - 1, bufferedPet[whichBuffer][0][1], 1);
					Pet[bufferedPet[whichBuffer][0][0] - 1][bufferedPet[whichBuffer][0][1]] = 1;
					Count.l++;
				} else {
					PetMethods.Mutate();
				}
				break;
			case 3: //right
				if (Pet[bufferedPet[whichBuffer][0][0] + 1][bufferedPet[whichBuffer][0][1]] === 0) {
					PetMethods.MirrorArray(Pet, bufferedPet[whichBuffer][0][0] + 1, bufferedPet[whichBuffer][0][1], 1);
					Pet[bufferedPet[whichBuffer][0][0] + 1][bufferedPet[whichBuffer][0][1]] = 1;
					Count.r++;
				} else {
					PetMethods.Mutate();
				}
				break;
			default:
				break;
        }
		
		Engine.Pet.Strength = Count.l * 10;
		Engine.Pet.Dexterity = Count.r * 10;
		Engine.Pet.Wisdom = Count.d * 10;
		
        //eyes
        Pet[14][14] = 0;
        Pet[17][14] = 0;
        //mouth
        Pet[14][16] = 0;
        Pet[15][16] = 0;
        Pet[16][16] = 0;
        Pet[17][16] = 0;
    },
    MirrorArray: function (arr, x, y, v) {
        arr[x][y] = v;
        var newX = arr.length - 1 - x;
        arr[newX][y] = v;
    },
	EyeColour: "rgba(200,200,200,1.0)",
	PrimaryColour: "rgba(10,10,10,1.0)",
	SecondaryColour: "rgba(100,100,100,1.0)",
	Shade: "rgba(100,100,100,1.0)",
	Threshold: 1,
    GetLimbs: function () {
        var wArms = Math.floor(Math.random() * 3);
		switch(wArms) {
			case 0:
				for (var arms = 8; arms <= 11; arms++) {
					Pet[arms][16] = 2;
				}
				for (var arms = 19; arms <= 22; arms++) {
					Pet[arms][16] = 2;
				}
				break;
			case 1:
				Pet[11][15] = 2;
				Pet[10][15] = 2;
				Pet[20][15] = 2;
				Pet[21][15] = 2;
				break;
			case 2:
				Pet[11][15] = 2;
				Pet[20][15] = 2;
				Pet[11][16] = 2;
				Pet[20][16] = 2;
				Pet[11][17] = 2;
				Pet[20][17] = 2;
				break;
			default:
				break;
		}
    },
    Elderly: false,
	AgeThreshold: 50,
    CheckAge: function () {
        if (Engine.Pet.Age < PetMethods.AgeThreshold) {
            PetMethods.Mutate();
        } else {
            //mutation end
            clearInterval(Engine.Pet.AgeTimer);
            if (PetMethods.Elderly === false) {
                PetMethods.GetLimbs();
				setTimeout(function() {
					PetMethods.Elderly = true;
					clearInterval(Engine.Pet.DayTimer);
					var thePet = Engine.Canvas2.toDataURL("image/png");
					thePet = thePet.replace(/\"/g, "");
					$.ajax({
						url: "data.php",
						data: {
							'action': "save",
							'data': JSON.stringify(thePet),
							'seed': document.getElementById("seed").value
						},
						error: function(e) {
							alert("Error!");
						},
						success: function(d) {
							if (d === "200ok") {
								alert("Your pet was added to the database");
							} else {
								alert("Error!");
							}
						}
					});
				}, 100);
            }
        }
    }
}


window.onload = function () {
	document.getElementById("again").addEventListener("click", function() {
		window.location.reload();
	});	
    document.getElementById("seedBtn").addEventListener("click", function () {
		//$('canvas').remove();
		var theSeed = document.getElementById("seed").value;
		if (theSeed.length > 3 && theSeed.length < 21) {
			Math.seedrandom(theSeed);
			document.body.removeChild(document.getElementById("seedBtn"));
			document.getElementById("seed").disabled = true;
			Engine.Init(32);
		} else {
			alert("The name needs to be between 4 and 20 characters long!");
		}
	});
    //document.getElementById("getImage").addEventListener("click", function () {
    //    window.open(Engine.Canvas2.toDataURL("image/png"));
    //});
    //document.getElementById("feed").addEventListener("click", function () {
    //    if (Engine.Pet.Hunger <= 310) {
	//		Engine.Pet.Hunger += 10;
	//	}
    //});
    return false;
};