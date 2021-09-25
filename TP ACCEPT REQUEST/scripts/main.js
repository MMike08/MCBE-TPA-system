
//import libraries
import * as GameTest from "mojang-gametest";
import {Commands, World} from 'mojang-minecraft';


//prefix
var commandPrefix = '!';
let requestList = new Map();

//this event is fired before a chat message is sent.
World.events.beforeChat.subscribe(msg => {
    
    if (msg.message.substr(0, commandPrefix.length) == commandPrefix) {
        msg.cancel = true;
        
        //stole this from my discord bot code
        let args_ = msg.message.slice(commandPrefix.length).trim().split(' '); //get arguments
        let args__ = args_.join('');
        let command = args_.shift().toLowerCase(); //gets base command
        var args = args_.join('').toLowerCase().replace(/[ ]/, '_');
        //args.join('');

        //switch statements are faster than if else blocks. This is for performance
        switch (command) {
            case 'tparequest':
            case 'tpa':
            case 'tprequest':
                let playerList = runCMD(`list`).statusMessage.toLowerCase();

                if (playerList.search(args__) != -1 && args__ != msg.sender.name && requestList.get(msg.sender.name.toLowerCase()) == null) {
                    //var estimatablePlayer = tryEstimatePlayer(args);
                    requestList.set(msg.sender.name.toLowerCase(), args);
                    runCMD(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§bYou are sending the teleport request to ${args__}!" } ] }`);
                    runCMD(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§bDo §e${commandPrefix}cancelrequest §bto cancel the teleport request!" } ] }`);

                    //messages to the reciever
                    runCMD(`tellraw ${args__} { "rawtext": [ { "text": "§bYou have recieved a teleport request from ${msg.sender.name}!" } ] }`);
                    runCMD(`tellraw ${args__} { "rawtext": [ { "text": "§bDo §e${commandPrefix}tpaccept §bto accept the request or §e${commandPrefix}tpreject §bto reject the request." } ] }`);
                }
                //throws errors
                else if (args == msg.sender.name.toLowerCase()) runCMD(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§4Cannot send request to self!" } ] }`);
                else if (playerList.search(args__) == -1) runCMD(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§4That player does not exist!" } ] }`);
                else if (requestList.get(msg.sender.name.toLowerCase()) != null) runCMD(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§4You already have an outgoing request!" } ] }`);
                else runCMD(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§4Error!" } ] }`);
            break;

            case 'tpac':
            case 'tpcancel':
            case 'cancelrequest':
                var sentPlayer = getByValue(requestList, args);

                if (requestList.get(msg.sender.name.toLowerCase()) != null && sentPlayer == msg.sender.name.toLowerCase()) {
                    runCMD(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§bCancelled request to ${args}!" } ] }`);
                    runCMD(`tellraw ${args} { "rawtext": [ { "text": "§b${msg.sender.name} cancelled their teleport request to you!" } ] }`);
                    requestList.delete(msg.sender.name.toLowerCase());
                }
                else if (requestList.get(msg.sender.name.toLowerCase()) == null) runCMD(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§You do not have an outgoing request!" } ] }`);
                else if (sentPlayer != msg.sender.name.toLowerCase()) runCMD(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§4You do not have a request to that player!" } ] }`);
            break;

            case 'tpaa':
            case 'tpaccept':
                /*
                var sentTest = requestList.get(args);

                if (msg.sender.name.toLowerCase() == sentTest) {
                    runCMD(`tp "${args}" "${msg.sender.name}"`);
                    runCMD(`tellraw ${args} { "rawtext": [ { "text": "§bYou have been teleported to ${msg.sender.name}!" } ] }`);
                    runCMD(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§b${args} has been teleported to you!" } ] }`);
                    requestList.delete(args);
                }
                else runCMD(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§4Invalid!" } ] }`);
                */
               tryCatchableThing(msg, args, args__);
            break;

            case 'tpar':
            case 'tpreject':
                var sentTest_ = requestList.get(args);

                if (msg.sender.name.toLowerCase() == sentTest_) {
                    runCMD(`tellraw ${args__} { "rawtext": [ { "text": "§bTeleport request to ${msg.sender.name} was rejected." } ] }`);
                    runCMD(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§bRejected teleport from ${args__}." } ] }`);
                    requestList.delete(args);
                }
                else runCMD(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§4Invalid!" } ] }`);
            break;

            default:
                runCMD(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§4Invalid!" } ] }`);
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
            //runCMD(`tp @a[name="${args}"] @a[name="${msg.sender.name}"]`);
            runCMD(`execute "${args___}" ~ ~ ~ tp @s ${msg.sender.name}`);
            runCMD(`tellraw ${args___} { "rawtext": [ { "text": "§bYou have been teleported to ${msg.sender.name}!" } ] }`);
            runCMD(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§b${args} has been teleported to you!" } ] }`);                
            requestList.delete(args);
        }
        else runCMD(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§4Invalid!" } ] }`);
    }
    catch (e) {
        runCMD(`say ${e}`);
    }
}

function testtest1(msg) {
    try {
        let args_ = msg.message.slice(commandPrefix.length).trim().split(' '); //get arguments
        let args__ = args_.join('');
        let command = args_.shift().toLowerCase(); //gets base command
        let args = args_.join('').toLowerCase().replace(/[ ]/, '_');

        runCMD(`say ${args_} ${command} ${args} ${args__}`);
    }
    catch (e) {
        runCMD(`say ${e}; ${e.stack}`);
    }
}

function runCMD(cmd) {
    try { 
        return Commands.run(cmd,World.getDimension("overworld")) 
    } catch(e) {
        return false;
    }
}

/*
function tryEstimatePlayer(inputGuessName) {
    var playerList_ = runCMD(`list`).statusMessage;
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
