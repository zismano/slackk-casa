const output = require('../../helper-bot/responder.js');

const at_Handler = require('./handlers/at.js');
const in_Handler = require('./handlers/in.js');
const next_Handler = require('./handlers/next.js');
const on_Handler = require('./handlers/on.js');
const onAt_Handler = require('./handlers/onAt.js');
const tomorrow_Handler = require('./handlers/tomorrow.js');
const tomorrowAt_Handler = require('./handlers/tomorrowAt.js');


const reminderMaker = (task, timeText, username, workspaceId, ws, wss) => {
  let maxTimeOut = 604801; //number of seconds in seven days
  let immediateBotMessageOnError;
  let timeOut;

  if (timeText.indexOf('on') > -1 && timeText.indexOf('at') > -1) {
    timeOut = onAt_Handler.timeOutCalculator(timeText);
  } else if (timeText.indexOf('tomorrow') > -1 && timeText.indexOf('at') > -1) {
  	timeOut = tomorrowAt_Handler.timeOutCalculator(timeText);
  } else if (timeText.indexOf('next') > -1 && timeText.indexOf('at') > -1) {
  	timeOut = onAt_Handler.timeOutCalculator(timeText); //**1
  } else if (timeText.indexOf('in') > -1) {
  	timeOut = in_Handler.timeOutCalculator(timeText);
  } else if (timeText.indexOf('at') > -1) {
  	timeOut = at_Handler.timeOutCalculator(timeText);
  } else if (timeText.indexOf('on') > -1) {
  	timeOut = on_Handler.timeOutCalculator(timeText);
  } else if (timeText.indexOf('tomorrow') > -1) {
  	timeOut = tomorrow_Handler.timeOutCalculator(timeText);
  } else if (timeText.indexOf('next') > -1) {
  	timeOut = next_Handler.timeOutCalculator(timeText); //**1
  } else {
  	timeOut = undefined;
  }

  if (timeOut < maxTimeOut) {
	  let immediateBotMessageOnSuccess = `Got it, ${username}. I'm going to send you a reminder to ${task} ${timeText}.`;
	  let timedBotMessageOnSuccess = `Yo ${username}, this is a reminder to ${task}.`;

	  output.responder(workspaceId, immediateBotMessageOnSuccess, ws, wss);
  	setTimeout(() => {
  		output.responder(workspaceId, timedBotMessageOnSuccess, ws, wss)
  	}, timeOut * 1000);  
  } else if (timeOut > maxTimeOut) {
  	immediateBotMessageOnError = `Wow! Sorry ${username}, but I refuse to set reminders past 7 days. I simply will not do it.`;
    output.responder(workspaceId, immediateBotMessageOnError, ws, wss);	
	} else {
	  immediateBotMessageOnError = `Hey ${username}, I couldn't work out when you wanted me to remind you to ${task}. Please try again.`;
  	output.responder(workspaceId, immediateBotMessageOnError, ws, wss);
  }
};


module.exports = {reminderMaker};

//**1: next Tuesday -- treats this as the next upcoming Tuesday (e.g. saying next Tuesday on Monday would equate to tomorrow)
