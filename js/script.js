
/********************* header START ******************/
function routineListShow(element) {
    const routineList = document.querySelector('#routine-list');
    const routineListNum = routineList.querySelectorAll('li:not(#add)').length;
    const button = document.querySelector('#routine-list-show-bt');
    function toggle () { // 아마 다른곳에도 쓴다면 이 토글을 밖으로 빼서 사용해야할거같음!!!! 쉽게될듯!
        console.log('toggle 실행');
        element.classList.toggle('on'); // popup 
        element.classList.toggle('popUp'); // 열린 popup임을 표시
        routineList.classList.toggle('popUpContents'); // 열린 popupContents임을 표시
        if (button.classList.contains('on')) {
            routineList.style.height = `${88*routineListNum + 72}px`;
        } else {
            routineList.removeAttribute('style');
        }
    }
    toggle();
}
document.querySelector('html').addEventListener('click', function (event) {
    if (document.querySelector('.popUp') !== null ) {
        if (event.target.closest('.popUp') || event.target.closest('.popUpContents')) { 
            /**버튼이나 콘텐츠 클릭 시 유지*/
            return;
        } else {/*그외 클릭시 정보 닫기 */
            console.log('그외클릭');
            routineListShow(document.querySelector('.popUp'));
        }
    }
});
/********************* header END ******************/
/********************* routine-data START ******************/
const USER_ROUTINE = "userRoutine";
function saveRoutineList () {
    localStorage.setItem(USER_ROUTINE, JSON.stringify(routineArray)); // localStorage에도 반영!
}
function ReturnRoutineList (index, current) {
    current = current ? 'current' : '';
    const li = `<li class="${current} text-overflow-hidden"><h1 class="r-title text-overflow-hidden" id = "${routineArray[index]['id']}">${routineArray[index]['title']}</h1><button class="delete-bt" onclick="routineDelete(this)"><img class="icon" src="./img/ic-delete-bgcolor.svg" alt="delete-button-icon"></button></li>`;
    return li;
}
let routineArray;
if (localStorage.getItem(USER_ROUTINE) == null) { // 로컬스토리지에 저장된것이 없으면
    routineArray = [{title: 'Routine Title1', id: Date.now(), current: true}]; // 초기 기본값
    saveRoutineList ();
} else { // 로컬에 저장된것이 있으면 출력!
    routineArray = JSON.parse(localStorage.getItem(USER_ROUTINE));
    const currentTitle = document.querySelector('#routine-title #current-title');
    let currentRoutineNum = routineArray.findIndex((element) => element['current'] === true);// 현재 루틴(current: true)이 무엇인지 index로 저장
    currentTitle.innerText = `${routineArray[currentRoutineNum]['title']}`;
    const addList = document.querySelector('#routine-list #add');
    routineArray.forEach((element, index) => {
        if(index === currentRoutineNum) {
            addList.insertAdjacentHTML('beforebegin', ReturnRoutineList(index, true));
        } else {
            addList.insertAdjacentHTML('beforebegin', ReturnRoutineList(index, false));
        }
    })
}
function showRoutineForm (button, form) { // 루틴form 여닫음
    button = button == undefined ? document.querySelector('#routine-list #add #add-routine-bt') : button;
    form = form == undefined ? document.querySelector('#routine-list #add #add-routine-form') : form;
    button.classList.toggle("hidden");
    form.classList.toggle("hidden");
}
function addRoutineData (event) { //새 루틴을 생성함
    event.preventDefault();
    
    const routineList = document.querySelector('#routine-list');
    if(routineList === null) {
        return;
    }
    const addList = routineList.querySelector('#add');
    const addbutton = addList.querySelector('#add-routine-bt');
    const form = addList.querySelector('#add-routine-form');
    const input = addList.querySelector('#routine-list #add #add-routine-form > input');
    const data = input.value;
    if (data == "" || data.trim() == "") {
        alert('공백은 타이틀이 될 수 없습니다!');
        showRoutineForm (addbutton, form);
    } else {
        routineArray.forEach((element) => {
            element['current'] = false;
        })
        routineArray.push({title: data, id: Date.now(), current: true});
        const li = `<li class="current text-overflow-hidden"><h1 class="r-title text-overflow-hidden" id = "${routineArray.at(-1)['id']}">${routineArray.at(-1)['title']}</h1><button class="delete-bt" onclick="routineDelete(this)"><img class="icon" src="./img/ic-delete-bgcolor.svg" alt="delete-button-icon"></button></li>`;
        routineListShow(document.querySelector('.popUp'));
        const currentTitle = document.querySelector('#routine-title #current-title');
        currentTitle.innerText = data;
        saveRoutineList ();
        /**
         * 이 자리에 들어가야할것!
         * 1. localStorage에 새 루틴 생성 실행 ✅
         * 2. 루틴 추가/수정 페이지 여는 함수실행
         * 3. 지금 이름의 루틴을 기억해서 추가/수정된것을 localStorage에 저장하도록 하는 함수실행
         */
        setTimeout(function() {
            routineList.querySelector('li.current').classList.remove('current');
            addList.insertAdjacentHTML('beforebegin', li);
            input.value = "";
            showRoutineForm (addbutton, form);
        }, 300)
    }
    // 이 받아온 data가 routine 타이틀! 이걸 저장한다.
}

function displayCurrentTitle () { // 리스트에서 현재 타이틀 표시
    const routineListArray = document.querySelectorAll('#routine-title #routine-list > li:not(#add) > h1');
    routineListArray.forEach((element)=> {
        element.addEventListener('click', function () {
            if (element.parentNode.classList.contains('current')) {
                return;
            }
            routineListShow(document.querySelector('.popUp')); // 1. 우선 리스트를 닫는다
            const currentTitle = document.querySelector('#routine-title #current-title');
            const clickedId = element.getAttribute('id');// 클릭된 element의 id 구하기

            // 이전에 current: true였던것을 false로 돌려놓고
            let currentRoutineNum = routineArray.findIndex((element) => element['current'] === true);
            routineArray[currentRoutineNum]['current'] = false; 
            document.getElementById(`${routineArray[currentRoutineNum]['id']}`).parentNode.classList.remove('current');

            // 새로 클릭된것을 current: true로 변경 출력
            currentRoutineNum = routineArray.findIndex((element) => element['id'] == clickedId);
            routineArray[currentRoutineNum]['current'] = true;
            document.getElementById(`${routineArray[currentRoutineNum]['id']}`).parentNode.classList.add('current');
            currentTitle.innerText = routineArray[currentRoutineNum]['title']; // 클릭된 element의 타이틀 출력
            saveRoutineList ();
        })
    })
}
displayCurrentTitle ();
// 해야하는것
// 새로운 list를 만들었을때 그떄 addEventListener를 추가해줘야하는데 이문제!! 해결하자!!
/********************* routine-data END ******************/
/********************* article routine START ******************/

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
printQuaterTime(startTime);

/** TOAST UI Timepicker START */
let tpSelectbox = new tui.TimePicker('#timepicker-selectbox', {
    // localStorage에서 저장했던 시간 받아옴. 안받아오면 00: 00 AM 시작
    initialHour: startTime['hour'], //24시간 단위 0~23
    initialMinute: startTime['minutes'],
    minuteStep: 5, // 5분단위로
    format: 'hh:mm', // 2자리로
    inputType: 'selectbox',
});
tpSelectbox.on('change', (e) => { // 시간 변경시 시간을 받아와서 저장
    startTime['hour'] = e.hour;
    startTime['minutes'] = e.minute;
    localStorage.setItem(START_TIME, JSON.stringify(startTime));
    printQuaterTime(startTime);
    printGaugeWithAnimation();
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

let DoGaugeAnimation = true; // DoGaugeAnimation이 true일때 printTimeGauge 애니메이션이 실행됨
function printGaugeWithAnimation() { 
    DoGaugeAnimation = true;
}
function printTimeGauge(currentHour, currentMinutes, currentSeconds, startTime) { //깨어있는 시간/게이지를 출력한다.
    const timeLine = document.querySelector('#timetable #time-line');
    const startTimeForHour = parseInt(startTime['hour']) + (parseInt(startTime['minutes']) / 60);
    const currentTimeForHour = parseInt(currentHour) + (parseInt(currentMinutes) / 60);
    let timeGauge = startTimeForHour < 12 ? currentTimeForHour - startTimeForHour : currentTimeForHour + (24 - startTimeForHour);
    if(timeGauge < 0) {
        timeGauge += 24;
    }else if(timeGauge > 24) {
        timeGauge = timeGauge%24;
    }
    // console.log(timeGauge);
    // 시작시간으로부터 현재시간까지의 시간
    const degree = ((timeGauge/24) * 100) * 3.6;
    // 24시간을 360도로 맞춰 계산 : 시간게이지를 퍼센트로 만들고, 그 퍼센트를 각도로 만듬
    function gaugeAnimation (startDegree, motion = 'slower', acceleration = 0.1) { // 애니메이션 실행함수
        // upDegree : 게이지 시작점
        // motion : 점점빨라지는/느려지는 애니메이션 선택 'faster' or 'slower'
        // acceleration : 속도 조절
        const upDegreeArray = []; // 점점 빨라지는 애니메이션을 위한 array
        let out = 0;
        let upDegree = startDegree;
        let array;
        if (upDegree > degree) {
            for(let i = 0; out == 0; i++) {
                upDegree -= acceleration*i;
                if (upDegree < degree) {
                    upDegree = degree;
                    out = 1;
                }
                upDegreeArray.push(upDegree);
            }
        } else {
            for(let i = 0; out == 0; i++) {
                upDegree += acceleration*i;
                if (upDegree > degree) {
                    upDegree = degree;
                    out = 1;
                }
                upDegreeArray.push(upDegree);
            }
        }
        if (motion === 'faster') {
            array = upDegreeArray;
        } else if (motion === 'slower') {
            const upDegreeArrayReverse = [] // 점점 느려지는 애니메이션을 위한 array
            upDegreeArray.forEach(element => {
                upDegreeArrayReverse.unshift(degree - element + startDegree);
            })
            array = upDegreeArrayReverse;
        }

        array.forEach((element, index) => {
            setTimeout(function() {
                timeLine.style.setProperty("--deg", `${element}deg`);
            }, 10*index)
        })
    }
    if (DoGaugeAnimation) { // 처음일경우 애니메이션효과
        DoGaugeAnimation = false;
        let startDegree = parseFloat(timeLine.style.cssText.replace(/[^0-9.]/g, ""));
        gaugeAnimation(startDegree, 'slower', 0.1);
    } else {
        timeLine.style.setProperty("--deg", `${degree}deg`);
    }
    printDuringTime(timeGauge, currentSeconds);
}

// 깨어있는 시간 출력
function printDuringTime (timeGauge, currentSeconds) {
    const duringTimeSpan = document.querySelectorAll('#time #during-time span')
    duringTimeSpan[0].innerText = String(Math.floor(timeGauge)).padStart(2, '0');
    duringTimeSpan[1].innerText = String(Math.floor((timeGauge%1)*60)).padStart(2, '0');
    duringTimeSpan[2].innerText = String(currentSeconds).padStart(2, '0');
}

// 현재시간 출력
function printNowTime (hours, minutes, midday) { 
    const nowTimeSpan = document.querySelectorAll('#time #now-time span');
    nowTimeSpan[0].innerText = String(hours <= 12 ? hours : hours - 12).padStart(2, '0');
    nowTimeSpan[1].innerText = String(minutes).padStart(2, '0');
    nowTimeSpan[2].innerText = midday;
}

function printEverySecond () { //1초마다 실행될 것들 모음
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

/********************* article routine END ******************/