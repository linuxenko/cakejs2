import './index.html';

/* coundown gist from https://gist.github.com/loremipson/8834955 */
 var date    = new Date(),
      month   = date.getMonth(),
      day     = date.getDate(),
      weekDay = date.getDay();

var hours   = {
  start: new Date(date.getFullYear(), month, day),
  end: new Date(date.getFullYear(), month, day)
};

// weekDay var [0 = sun, 1 = mon, 2 = tues ... 5 = fri 6 = sat]

// If it's Monday - Friday
if(weekDay >= 1 && weekDay <= 5){

  // Start at 7am, end at 8pm
  hours.start.setHours(7);
  hours.end.setHours(20);

// If it's Saturday
} else if(weekDay == 6){

  // Start at 8am, end at 8pm
  hours.start.setHours(8);
  hours.end.setHours(20);

// If it's Sunday
} else {

  // Start at 9am, end at 6pm
  hours.start.setHours(9);
  hours.end.setHours(18);
}

function countDown(){
  var date         = new Date(),
      countHours   = ('0' + (hours.end.getHours() - date.getHours())).substr(-2),
      countMinutes = ('0' + (59 - date.getMinutes())).substr(-2),
      countSeconds = ('0' + (59 - date.getSeconds())).substr(-2);

  return { h : countHours, m : countMinutes, s : countSeconds };
}


/** @jsx h */

import {h, patch, diff} from '../../../';

var initialDom = (
  <div>
    <div><h3>Counter</h3></div>
  </div>
);

document.getElementById('application')
  .appendChild(initialDom.render());

setInterval(function() {
  var cd = countDown();
  var countDownDom = (
    <div>
      <div><h3>Day Countdown</h3></div>
      <div className="clock">
        <strong>{cd.h}</strong> :&nbsp;
        <strong>{cd.m}</strong> :&nbsp;
        <strong>{cd.s}</strong>
      </div>
    </div>
  );

  var diffs = diff(initialDom, countDownDom);
  patch(initialDom, diffs);

}, 1000);