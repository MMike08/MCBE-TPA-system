
//import libraries
import * as GameTest from "GameTest";
import {Commands, World} from 'Minecraft';


//prefix
var commandPrefix = '=';
let requestList = new Map();


//this event is fired before a chat message is sent.
World.events.beforeChat.subscribe(msg => {
    
    if (msg.message.substr(0, commandPrefix.length) == commandPrefix) {
        msg.canceled = true;

        //stole this from my discord bot code
        let args_ = msg.message.slice(commandPrefix.length).trim().split(' '); //get arguments
        let command = args_.shift().toLowerCase(); //gets base command
        var args = args_.join('').toLowerCase();

        //switch statements are faster than if else blocks. This is for performance
        switch (command) {
            case 'tparequest':
            case 'tpa':
            case 'tprequest':
                let playerList = Commands.run(`list`).statusMessage.toLowerCase();

                if (playerList.search(args) != -1 && args != msg.sender.name && requestList.get(msg.sender.name.toLowerCase()) == null) {
                    //var estimatablePlayer = tryEstimatePlayer(args);
                    requestList.set(msg.sender.name.toLowerCase(), args);
                    Commands.run(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§bYou are sending the teleport request to ${args}!" } ] }`);
                    Commands.run(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§bDo §e${commandPrefix}cancelrequest §bto cancel the teleport request!" } ] }`);

                    //messages to the reciever
                    Commands.run(`tellraw ${args} { "rawtext": [ { "text": "§bYou have recieved a teleport request from ${msg.sender.name}!" } ] }`);
                    Commands.run(`tellraw ${args} { "rawtext": [ { "text": "§bDo §e${commandPrefix}tpaccept §bto accept the request or §e${commandPrefix}tpreject §bto reject the request." } ] }`);
                }
                //throws errors
                else if (playerList.search(args) == -1) Commands.run(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§4That player does not exist!" } ] }`);
                else if (args == msg.sender.name.toLowerCase()) Commands.run(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§4Cannot send request to self!" } ] }`);
                else if (requestList.get(msg.sender.name.toLowerCase()) != null) Commands.run(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§4You already have an outgoing request!" } ] }`);
                else Commands.run(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§4Error!" } ] }`);
            break;

            case 'tpac':
            case 'tpcancel':
            case 'cancelrequest':
                var sentPlayer = getByValue(requestList, args);

                if (requestList.get(msg.sender.name.toLowerCase()) != null && sentPlayer == msg.sender.name.toLowerCase()) {
                    Commands.run(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§bCancelled request to ${args}!" } ] }`);
                    Commands.run(`tellraw ${args} { "rawtext": [ { "text": "§b${msg.sender.name} cancelled their teleport request to you!" } ] }`);
                    requestList.delete(msg.sender.name.toLowerCase());
                }
                else if (requestList.get(msg.sender.name.toLowerCase()) == null) Commands.run(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§You do not have an outgoing request!" } ] }`);
                else if (sentPlayer != msg.sender.name.toLowerCase()) Commands.run(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§4You do not have a request to that player!" } ] }`);
            break;

            case 'tpaa':
            case 'tpaccept':
                /*
                var sentTest = requestList.get(args);

                if (msg.sender.name.toLowerCase() == sentTest) {
                    Commands.run(`tp "${args}" "${msg.sender.name}"`);
                    Commands.run(`tellraw ${args} { "rawtext": [ { "text": "§bYou have been teleported to ${msg.sender.name}!" } ] }`);
                    Commands.run(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§b${args} has been teleported to you!" } ] }`);
                    requestList.delete(args);
                }
                else Commands.run(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§4Invalid!" } ] }`);
                */
               tryCatchableThing(msg, args);
            break;

            case 'tpar':
            case 'tpreject':
                var sentTest_ = requestList.get(args);

                if (msg.sender.name.toLowerCase() == sentTest_) {
                    Commands.run(`tellraw ${args} { "rawtext": [ { "text": "§bTeleport request to ${msg.sender.name} was rejected." } ] }`);
                    Commands.run(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§bRejected teleport from ${args}." } ] }`);
                    requestList.delete(args);
                }
                else Commands.run(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§4Invalid!" } ] }`);
            break;
        }
    }
})

function getByValue(map, searchValue) {
    for (let [key, value] of map.entries()) {
        if (value === searchValue) return key;
    }
}

function tryCatchableThing (msg, args) {
    try {
        var sentTest = requestList.get(args);

        if (msg.sender.name.toLowerCase() == sentTest) {
            //Commands.run(`tp @a[name="${args}"] @a[name="${msg.sender.name}"]`);
            Commands.run(`execute "${args}" ~ ~ ~ tp @s ${msg.sender.name}`);
            Commands.run(`tellraw ${args} { "rawtext": [ { "text": "§bYou have been teleported to ${msg.sender.name}!" } ] }`);
            Commands.run(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§b${args} has been teleported to you!" } ] }`);                
            requestList.delete(args);
        }
        else Commands.run(`tellraw ${msg.sender.name} { "rawtext": [ { "text": "§4Invalid!" } ] }`);
    }
    catch (e) {
        Commands.run(`say ${e}`);
    }
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