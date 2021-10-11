
//import libraries
import * as GameTest from "mojang-gametest";
import {Commands, World} from 'mojang-minecraft';


//prefix
var commandPrefix = '=';
let requestList = new Map();


//this event is fired before a chat message is sent.
World.events.beforeChat.subscribe(msg => {
    
    if (msg.message.substr(0, commandPrefix.length) == commandPrefix) {
        msg.cancel = true;
        
        //stole this from my discord bot code
        let args_ = msg.message.slice(commandPrefix.length).trim().split(' '); //get arguments
        let command = args_.shift().toLowerCase(); //gets base command
        let args__ = args_.join('');
        var args = args_.join('').toLowerCase().replace(/[ ]/, '_');

        

        Commands.run(`say ${args_}`, World.getDimension("overworld"));
        Commands.run(`say ${args__}`, World.getDimension("overworld"));
        Commands.run(`say ${args}`, World.getDimension("overworld"));

        //switch statements are faster than if else blocks. This is for performance
        switch (command) {
            case 'tparequest':
            case 'tpa':
            case 'tprequest':
                try {
                    let playerList = Commands.run(`list`, World.getDimension("overworld")).statusMessage.toLowerCase();

                    if (playerList.search(args__.toLowerCase()) != -1 && args__ != msg.sender.name && requestList.get(msg.sender.name.toLowerCase()) == null) {
                        //var estimatablePlayer = tryEstimatePlayer(args);
                        requestList.set(msg.sender.name.toLowerCase(), args);
                        Commands.run(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§bYou are sending the teleport request to ${args__}!" } ] }`, World.getDimension("overworld"));
                        Commands.run(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§bDo §e${commandPrefix}cancelrequest §bto cancel the teleport request!" } ] }`, World.getDimension("overworld"));

                        //messages to the reciever
                        Commands.run(`tellraw ${args__} { "rawtext": [ { "text": "§bYou have recieved a teleport request from ${msg.sender.name}!" } ] }`, World.getDimension("overworld"));
                        Commands.run(`tellraw ${args__} { "rawtext": [ { "text": "§bDo §e${commandPrefix}tpaccept §bto accept the request or §e${commandPrefix}tpreject §bto reject the request." } ] }`, World.getDimension("overworld"));
                    }
                    //throws errors
                    else if (playerList.search(args__) == -1) Commands.run(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§4That player does not exist!" } ] }`, World.getDimension("overworld"));
                    else if (args == msg.sender.name.toLowerCase()) Commands.run(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§4Cannot send request to self!" } ] }`, World.getDimension("overworld"));
                    else if (requestList.get(msg.sender.name.toLowerCase()) != null) Commands.run(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§4You already have an outgoing request!" } ] }`, World.getDimension("overworld"));
                    else Commands.run(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§4Error!" } ] }`);
                }
                catch (e) {
                    Commands.run(`say ${e.stack}`, World.getDimension("overworld"));
                }
            break;

            case 'tpac':
            case 'tpcancel':
            case 'cancelrequest':
                var sentPlayer = getByValue(requestList, args);

                if (requestList.get(msg.sender.name.toLowerCase()) != null && sentPlayer == msg.sender.name.toLowerCase()) {
                    Commands.run(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§bCancelled request to ${args}!" } ] }`, World.getDimension("overworld"));
                    Commands.run(`tellraw ${args} { "rawtext": [ { "text": "§b${msg.sender.name} cancelled their teleport request to you!" } ] }`, World.getDimension("overworld"));
                    requestList.delete(msg.sender.name.toLowerCase());
                }
                else if (requestList.get(msg.sender.name.toLowerCase()) == null) Commands.run(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§4You do not have an outgoing request!" } ] }`, World.getDimension("overworld"));
                else if (sentPlayer != msg.sender.name.toLowerCase()) Commands.run(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§4You do not have a request to that player!" } ] }`, World.getDimension("overworld"));
            break;

            case 'tpaa':
            case 'tpaccept':
                /*
                var sentTest = requestList.get(args);

                if (msg.sender.name.toLowerCase() == sentTest) {
                    Commands.run(`tp "${args}" "${msg.sender.name}"`, World.getDimension("overworld"));
                    Commands.run(`tellraw ${args} { "rawtext": [ { "text": "§bYou have been teleported to ${msg.sender.name}!" } ] }`, World.getDimension("overworld"));
                    Commands.run(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§b${args} has been teleported to you!" } ] }`, World.getDimension("overworld"));
                    requestList.delete(args);
                }
                else Commands.run(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§4Invalid!" } ] }`, World.getDimension("overworld"));
                */
               tryCatchableThing(msg, args, args__);
            break;

            case 'tpar':
            case 'tpreject':
                var sentTest_ = requestList.get(args);

                if (msg.sender.name.toLowerCase() == sentTest_) {
                    Commands.run(`tellraw ${args__} { "rawtext": [ { "text": "§bTeleport request to ${msg.sender.name} was rejected." } ] }`, World.getDimension("overworld"));
                    Commands.run(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§bRejected teleport from ${args__}." } ] }`, World.getDimension("overworld"));
                    requestList.delete(args);
                }
                else Commands.run(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§4Invalid!" } ] }`, World.getDimension("overworld"));
            break;

            default:
                Commands.run(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§4Invalid!" } ] }`, World.getDimension("overworld"));
            break;
        }
    }
})

function getByValue(map, searchValue) {
    for (let [key, value] of map.entries()) {
        if (value === searchValue) return key;
    }
}

function tryCatchableThing (msg, args, args___) {
    try {
        var sentTest = requestList.get(args);

        if (msg.sender.name.toLowerCase() == sentTest) {
            //Commands.run(`tp @a[name="${args}"] @a[name="${msg.sender.name}"]`);
            Commands.run(`execute "${args___}" ~ ~ ~ tp @s ${msg.sender.name}`, World.getDimension("overworld"));
            Commands.run(`tellraw ${args___} { "rawtext": [ { "text": "§bYou have been teleported to ${msg.sender.name}!" } ] }`, World.getDimension("overworld"));
            Commands.run(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§b${args} has been teleported to you!" } ] }`, World.getDimension("overworld"));                
            requestList.delete(args);
        }
        else Commands.run(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§4Invalid!" } ] }`, World.getDimension("overworld"));
    }
    catch (e) {
        Commands.run(`say ${e}`);
    }
}

function testtest1(msg) {
    try {
        let args_ = msg.message.slice(commandPrefix.length).trim().split(' '); //get arguments
        let args__ = args_.join('');
        let command = args_.shift().toLowerCase(); //gets base command
        let args = args_.join('').toLowerCase().replace(/[ ]/, '_');

        Commands.run(`say ${args_} ${command} ${args} ${args__}`, World.getDimension("overworld"));
    }
    catch (e) {
        Commands.run(`say ${e}; ${e.stack}`, World.getDimension("overworld"));
    }
}

function tryGetPlayerDimension() {
    //I'll make this in the future...
    //So uh for anyone who is looking at my spagetti
    //
    //why?
}

/*
function tryEstimatePlayer(inputGuessName) {
    var playerList_ = Commands.run(`list`).statusMessage;
    var finalNameOutput;

    return finalNameOutput;
}
*/


/*
* map is formatted as
* 
* requester: reciever
*/

//help from thedarkcarnage
