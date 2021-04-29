var main = function(crazy, bLength){
    console.log('001');
    "use strict";
    
    $(".loadCont").remove(); // once everything loaded, remove loading animation
    
    var scoops = 0, // current number of scoops
        adjScoops = 0, // number of scoops on sold cone *necessary?
        totalScoops = 0, // number of scoops sold
        adjCones = 0, // number of cones sold
        nCones = 0, // total number of cones
        userData = [],
        adjValue, // mean number of scoops on cones sold
        // task duration
        trials = 10, // number of trials to be presented per block
        blocks = 1, // number of blocks
        
        // bucket used to determine when death occurs
        // average death = length/2 (64)
        bucket = Array.apply(null, {length: bLength}).map(Number.call, Number),
        
        // images, animation variables, sounds
        flavors = ["blue","choc","oran","pink","pist","purp","yell","vani"],
        $splat = $("<img>"),
        $cherry = $("<img>"),
        $medal = $("<img>"),
        $rewardText = $("<span>"),
        $shine = $("<img>"),
        randomIndex,
        lastIndex,
        objHeight,// = $("#ic0").css("height"),
        objWidth,// = $(".container").css("width"),
        slideDist,
        cherrySlide,
        plopSound = new Audio("./sounds/plop.mp3"),
        failSound = new Audio("./sounds/foghorn.mp3"),
        cheerSound = new Audio("./sounds/cheer.mp3"),
        
        // controllers
        dropped = false,
        canClick = true,
        goCrazy = crazy, // set to true to allow next scoop before current finishes
        wait = false,
        taskOver = false,
        optionsUp = false,
        reset = false,
        
        // counters
        j = 1,
        k = 0;
    
    
    // set up splat image
    $splat.attr({
        src:"./images/splat.svg",
        id:"splat",
        "class":"unselectable"
    });
    
    $cherry.attr({
        src:"./images/cherry.svg",
        id:"cherry",
        "class":"scoop unselectable"
    });
    
    $cherry.css({
            bottom:"90%",
            width:objWidth,
            "z-index": 99
    });
    
    $medal.attr({
       src:"./images/medal.svg",
       id:"medal",
       "class":"scoop unselectable"
    });
    
    $rewardText.attr({
        id:"rewardText",
        "class":"scoop unselectable"
    });
    
    $shine.attr({
       src:"./images/medalShine.svg",
       id:"shine",
       "class":"scoop unselectable"
    });
    
    //*****************************************************************************
    //***** FUNCTIONS ******
    //**********************
    
    // preload images
    function preloadImage(url){
        (new Image()).src = url;
    }
    
    // scoop a new scoop!
    function newScoop(i){
        var $img = $("<img>");
        $img.attr({
            src:"./images/"+flavors[getRandom(flavors)]+"IC.png",
            id:"ic"+i,
            "class":"scoop unselectable"
        });
        $img.css({
            bottom:"90%",
            width:objWidth,
            "z-index": i
        });
        $(".iceCream").append($img);
    }
    
    // plopin' scoops animation
    function plop(obj){
        if(obj[0].id == "cherry"){
            obj.animate({
                bottom:(j*cherrySlide)}, // fall into position (j)
                500, // duration
                "easeInQuart"); // easing         
        }else{
            obj.animate({
                bottom:(j*slideDist)}, // fall into position (j)
                500, // duration
                "easeInQuart", // easing 
                function(){canClick=true;}); // allow next scoop
        }
    }
    
    function reward(){
        $cherry.attr({
                    src:"./images/cherry.svg",
                    id:"cherry",
                    "class":"scoop unselectable"
                });
                $cherry.css({
                        bottom:"90%",
                        width:objWidth,
                        "z-index": 99
                });
                
                $(".iceCream").append($cherry);
                plop($("#cherry"));
                
                setTimeout(function(){
                    $(".iceCream").append($medal);
                    $(".iceCream").append($rewardText);
                    $("#rewardText").append(scoops+"<br> SCOOPS!");
                    $(".iceCream").append($shine);
                    //cheerSound.play();
                }, 750);
                
                setTimeout(function(){
                    $("#rewardText").empty();
                    $(".scoop").remove();
                    j = 1;
                    $("#nScoops").empty();
                    $("#nScoops").append(scoops);
                    $("#totalScoops").empty();
                    $("#totalScoops").append(totalScoops);
                    canClick = true;
                    scoops = 0;
                    $("#nScoops").empty();
                    $("#nScoops").append(scoops);
                },2500);
    }
    
    // string to integer
    function getStringAsInt(string){
        string += ""; // if not already string, make it one - sometimes threw error w/o
        return parseInt(string.split("p")[0]);
    }
    
    // random sample without repitition
    function getRandom(array){
        while (randomIndex === lastIndex){ // ie flavors don't repeat
            randomIndex = Math.floor(Math.random()*array.length);
        }
        lastIndex = randomIndex;
        return randomIndex;
    }
    
    // random sample without substitution
    function getRandomNoSub(array){
        var randomIndex = Math.floor(Math.random()*array.length);
        return array.splice(randomIndex, 1)[0];
    }
    
    // truncate to hundreds place
    function truncateHuns(value){
        if (Number.isInteger(value) == false){
            value = value.toString().split(".",2);
            return value[0]+"."+value[1].substring(0,2);
        } else {
            return value;
        }
    }
    
    //******************************
    //****** Behind the scenes *****
    //******************************
    
    objHeight = $(".container").height()/5;
    objWidth = objHeight*1.2;
    
    // check screen orientation
    if ($(window).height()>$(window).width()){ 
        slideDist = objHeight*0.5; // portrait / mobile
        cherrySlide = slideDist*1.1;
    } else {
        slideDist = objHeight*0.6; // landscape  / desktop/tablet
        cherrySlide = slideDist*1.05;
    }
    
    // set options button height
    $(".options").height($(".infoCont").height()+"px");
    $(".options").width($(".infoCont").height()+"px");
    
    //preload images
    flavors.forEach(function(flavor){
        preloadImage("./images/"+flavor+"IC.png");
        k++;
    });
    
    
    //****************************
    //***** USER INTERACTION *****
    //****************************
    
    $(".iceCream").click(function(){
        console.log("_"+j);
        
        if(k!=flavors.length){
            canClick = false;
        }
        
        if (taskOver === false && canClick === true){
        
            if (getRandomNoSub(bucket) != 0 && dropped == false){ // draw rando num from bucket
        
                if (j > 5){ 
                    wait = true;
                    $(".scoop").animate({bottom: "-="+(slideDist*5)+"px"},250,
                                        function(){wait=false;});
                    j=1;
                } 
        
                if (wait === false || goCrazy === true){
                    wait = true;
                    scoops++;
            
                    newScoop(scoops);
                    plop($("#ic"+scoops));
                    setTimeout(function(){
                        plopSound.play();
                        plopSound.currentTime=0;
                        wait = false;
                    },450);
                    $("#nScoops").empty();
                    $("#nScoops").append(scoops);
                    j++;
                }
                
            } else {
                scoops = 0;
                dropped = true;
                $(".iceCream").empty();
                $(".iceCream").append($splat);
                failSound.play();
                $("#cashIn").empty();
                $("#cashIn").append("Reset!");
        
        
            }
        }
    });
    
    $(".cashIn").click(function(){
        if (canClick === true){
            nCones++;
        
            if (dropped == false){
                canClick = false;
                totalScoops += scoops;
                adjCones++;
                
                setTimeout(function(){
                    cheerSound.play();
                },350);
                
                if (j > 4){
                    var k;
                    if(j>5){k=3;}else{k=2;}
                    j = 3;
                    console.log(j);                    
                    $(".scoop").animate({bottom: "-="+(slideDist*k)+"px"},250);
                    setTimeout(function(){
                        //cheerSound.play();
                    },350);
                    setTimeout(function(){
                        reward();
                    },100);
                } else {
                
                setTimeout(function(){
                    //cheerSound.play();
                    cheerSound.currentTime = 0;
                },350);
                
                reward();
                }
            } else {
                $(".scoop").remove();
                $("#splat").remove();
                j = 1;
            }
        
            if (nCones > (trials*blocks)){
                $(".iceCream").empty();
                $(".iceCream").append("<h1>No more cones!<h1>");
                taskOver = true;
                dropped = true;
                canClick = false;
                goCrazy = false;
                console.log("total scoop= "+totalScoops);
                console.log("cones= "+adjCones);
                adjValue = totalScoops/adjCones;
                console.log(userData);
                console.log(adjValue);
                $(".iceCream").append("<br><h1>Average scoops/cone sold: "+truncateHuns(adjValue)+"<h1>");
            }
            
            
            $("#cashIn").empty();
            $("#cashIn").append("Sell!");
        }
    
        userData.push([Date.now(), scoops, dropped, nCones]);
    
        dropped = false;
        bucket = Array.apply(null, {length: bLength}).map(Number.call, Number);
    
    // last cone
        if (taskOver === true){
            userData.push([adjValue]);
            $.ajax("saveData",{
                type: "POST",
                async: false,
                data: {userData},
            });
        }
    
    });
    
    /* options menu - leave out for now, would run multiple main functions 
    $(".options").click(function(){
        var crazy, bLength;
        
        if (optionsUp === false){
            optionsUp = true;
            canClick = false;
            $(".optionsMenu").css("visibility","visible");
            
            $(".startOver").click(function(){
                crazy = $("#crazyBox").is(":checked");
                bLength = $("#bLength").val();
                optionsUp = false;
                canClick = true;
                $(".optionsMenu").css("visibility","hidden");
                main(crazy, bLength);
            });
            
        } else {
            optionsUp = false;
            canClick = true;
            $(".optionsMenu").css("visibility","hidden");
            
        }
    });
    */
    
    
}

//$(document).ready(main(true, 64));

$(window).on('load', function() {
    main(true, 64);
});