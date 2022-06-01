const IsExist = (something) => {
    return something !== null; // something이 존재하면 true를 반환함
}
const START_TIME = 'startTime';

// 처음페이지에 들어오면 localStorage에서 저장했던 시간을 받아와야한다. 안받아오면 00: 00 AM 시작
const StartTimeinLocalStorage = localStorage.getItem(START_TIME);
let startTime = IsExist(StartTimeinLocalStorage) 
    ? JSON.parse(StartTimeinLocalStorage)
    : {
        hour: 0,
        minutes: 0
    };
printQuaterTime (startTime);

/** TOAST UI Timepicker START */
let tpSelectbox = new tui.TimePicker('#timepicker-selectbox', {
    // localStorage에서 저장했던 시간 받아옴. 안받아오면 00: 00 AM 시작
    initialHour: IsExist(StartTimeinLocalStorage) ? startTime['hour'] : 0, //24시간 단위 0~23
    initialMinute: IsExist(StartTimeinLocalStorage) ? startTime['minutes'] : 0,
    minuteStep: 5, // 5분단위로
    format: 'hh:mm', // 2자리로
    inputType: 'selectbox',
});
tpSelectbox.on('change', (e) => { // 시간 변경시 시간을 받아와서 저장
    startTime['hour'] = e.hour;
    startTime['minutes'] = e.minute;
    localStorage.setItem(START_TIME, JSON.stringify(startTime));
    printQuaterTime(startTime);
  });
/** TOAST UI Timepicker END */

// 시작시간을 받아서 타임테이블에 눈금 표시
function printQuaterTime (startTime) { 
    const quaterTimeList = document.querySelectorAll('section#timetable #quarter-time li');
    let quaterHour = startTime['hour'];
    let quaterHourArray = [];
    for(let i = 0; i < 4; i++) { // 시간에 6씩 더한다.
        quaterHour = i === 0 ? quaterHour : quaterHour += 6
        quaterHourArray.push(quaterHour);
    }
    quaterHourArray.forEach((element, index) => {
        let midday = (Math.floor(element/12))%2 == true ? 'PM' : 'AM';
        quaterTimeList[index].innerText = `${element%12}:${String(startTime['minutes']).padStart(2, '0')}${midday}`;
    });
}

// 현재시간 게이지를 타임라인에 출력
let printTimeGaugeFirstTime = true;
function printTimeGauge(currentHour, currentMinutes, currentSeconds, startTime) { 
    const timeLine = document.querySelector('#timetable #time-line');
    const startTimeForHour = parseInt(startTime['hour']) + (parseInt(startTime['minutes']) / 60);
    const currentTimeForHour = parseInt(currentHour) + (parseInt(currentMinutes) / 60);
    let timeGauge = startTimeForHour < 12 ? currentTimeForHour - startTimeForHour : currentTimeForHour + (24 - startTimeForHour);
    if(timeGauge < 0) {
        timeGauge += 24;
    }
    console.log(timeGauge);
    // 시작시간으로부터 현재시간까지의 시간
    const degree = ((timeGauge/24) * 100) * 3.6;
    // 24시간을 360도로 맞춰 계산 : 시간게이지를 퍼센트로 만들고, 그 퍼센트를 각도로 만듬
    if (printTimeGaugeFirstTime) { // 처음일경우 애니메이션효과
        printTimeGaugeFirstTime = false;
        const acceleration = 0.1; // 이값으로 속도 조절
        let upDegree = 0;
        const upDegreeArray = []; // 점점 빨라지는 애니메이션을 위한 array
        let out = 0;
        for(let i = 0; out == 0; i++) {
            upDegree += acceleration*i;
            if (upDegree > degree) {
                upDegree = degree;
                out = 1;
            }
            upDegreeArray.push(upDegree);
        }
        // 효과 반대로 하고싶다면..
        const upDegreeArrayReverse = [] // 점점 느려지는 애니메이션을 위한 array
        upDegreeArray.forEach(element => {
            upDegreeArrayReverse.unshift(degree - element);
        })

        function Printanimation (array) { // 애니메이션 실행함수
            array.forEach((element, index) => {
                setTimeout(function() {
                    timeLine.style.setProperty("--deg", `${element}deg`);
                }, 10*index)
            })
        }
        Printanimation(upDegreeArrayReverse);
    } else {
        timeLine.style.setProperty("--deg", `${degree}deg`);
    }
    printDuringTime(timeGauge, currentSeconds);
}

// 깨어있는 시간 출력
function printDuringTime (timeGauge, currentSeconds) {
    const duringTimeSpan = document.querySelectorAll('#time #during-time span')
    duringTimeSpan[0].innerText = String(Math.floor(timeGauge)).padStart(2, '0');
    duringTimeSpan[1].innerText = String(Math.ceil((timeGauge%1)*60)).padStart(2, '0');
    duringTimeSpan[2].innerText = String(currentSeconds).padStart(2, '0');
}

// 현재시간 출력
function printNowTime (hours, minutes, midday) { 
    const nowTimeSpan = document.querySelectorAll('#time #now-time span');
    nowTimeSpan[0].innerText = hours <= 12 ? hours : hours - 12;
    nowTimeSpan[1].innerText = minutes;
    nowTimeSpan[2].innerText = midday;
}

function printEverySecond () {
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const midday = hours <= 12 ? 'AM' : 'PM';
    printNowTime(hours, minutes, midday);
    printTimeGauge(hours, minutes, seconds, startTime);
}
printEverySecond();
setInterval(printEverySecond, 1000);

