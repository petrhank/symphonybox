
function init(){
    addInstruments();
    createPlayStopBtn();
    addAllBtn();
    createHintBtn();
};

function createPlayStopBtn(){                     //PŘIDÁ TLAČÍTKO PLAY/STOP
 
    let playStopBtn = document.createElement('button');
    playStopBtn.id = 'playStop';
    playStopBtn.innerHTML = text.wait;
    playStopBtn.classList.add('inactive');
    let status = "stopped";  

    document.querySelector('.topArea').appendChild(playStopBtn);

    waitForLoad(playStopBtn, status, listenPlayStopBtn);
};

// function waitForLoad(button, status, callback){ //Jednou za interval se zeptá, zda už je načteno
//     let interval =  setInterval(function(){
//         if(areTheyLoaded()){
//             clearInterval(interval);
//             callback(button,status)
//         }
//     }, 500);
// };

// function areTheyLoaded(){               //Zjistí, zda je načteno
//     let result = instruments.every(function(instrument){
//         return instrument.howl._state === "loaded";
//     });
//     return result;
// }  

// function listenPlayStopBtn(button,status){      //Přidá event listener a změní nápis tlačítka
//     button.innerHTML = '<i class="far fa-play-circle"></i> ' + text.play;
//     button.classList.remove('inactive');
//     button.addEventListener('click', function (){
//         if(status === "stopped"){
//             playEverything();
//             status = "playing";
//             this.innerHTML = '<i class="far fa-stop-circle"></i> ' + text.stop;
//             this.classList.add('active');
//         }
//         else{
//             stopEverything();
//             status = "stopped";
//             this.innerHTML = '<i class="far fa-play-circle"></i> ' + text.play;
//             this.classList.remove('active');
//         }
//     });
// }; 

function playEverything(){
    instruments.forEach(function(instrument){
        instrument.howl.play();
        if(instrument.howl._volume === 1){
            instrument.howl.fade(0,1,200);
        }
    });
}

function stopEverything(){
    instruments.forEach(function(instrument){
        instrument.howl.stop();
    });
};

////////////////////////////////////////////////////////////////////////

function createHintBtn(){       // VYTVOŘÍ TLAČÍTKO NÁPOVĚDY 
    let hint = document.createElement('button');
    hint.id = 'hint';
    hint.innerHTML = '<i class="far fa-question-circle"></i>';

    let overlay = document.querySelector('.overlay');

    hint.addEventListener('click', function(){
        overlay.classList.toggle('display');
    });

    document.querySelector('.topArea').appendChild(hint);
}

////////////////////////////////////////////////////////////////////

function addAllBtn(){                   //TLAČÍTKO NA ZAPNUTÍ VŠECH NÁSTROJŮ
    let allBtn = document.getElementById('all'); 

    allBtn.addEventListener('click', function(){    
        if(isAllOn() !== true){         
            changeAllVolume(1); //Pokud nejsou všechny nástroje zapnuty, zapnou se
            this.classList.add('active');
        }
        else{
            changeAllVolume(0); //Pokud jsou všechny nástroje zapnuty vypnou se
            this.classList.remove('active');
        }
    });
};

function isAllOn(){         //Kontroluje, zda jsou všechny nástroje zapnuty. Pokud ano, vrátí true
    let result = instruments.every(function(instrument){
        return instrument.howl._volume === 1;
    });
    return result;
};

function changeAllVolume(desiredVolume){    //Změní hlasitost všech nástrojů dle zadaného argumentu a přidá nebo odebere tlačítkům třídu active
    instruments.forEach(function(instrument){   
        let currentButton = document.getElementById(instrument.id);

        desiredVolume === 1 ? currentButton.classList.add('active'):currentButton.classList.remove('active');

        let currentVolume = instrument.howl._volume;
        instrument.howl.fade(currentVolume, desiredVolume, 200);
    });
};

/////////////////////////////////////////////////////////////////////

function addInstruments(){                      // PŘIDÁ NÁSTROJE Z POLE
    instruments.forEach(function(instrument){
        addHowl(instrument);   
        createInstrumentButton(instrument);
    });
};

function addHowl(currentInstrument){    //Vytvoří howl
    currentInstrument.howl = new Howl({
        src: [currentInstrument.path],
        loop: true,
    });
    currentInstrument.initial === true ? currentInstrument.howl._volume : currentInstrument.howl._volume = 0;
};

function createInstrumentButton(currentInstrument){    //Vytvoří tlačítko pro každý nástroj

    let instrumentsSection = document.querySelector("." + currentInstrument.category);   //vybere Section podle kategorie
    let btn = document.createElement("button");

    btn.id = currentInstrument.id;
    btn.innerHTML= currentInstrument.icon + currentInstrument.textContent;

    if (currentInstrument.initial === true){
        btn.classList.add('active');
    }

    btn.addEventListener('click',function(){
        if(currentInstrument.howl._volume === 0){
            currentInstrument.howl.fade(0, 1, 100);
            this.classList.add('active');
        }
        else{
            currentInstrument.howl.fade(1, 0, 100);
            this.classList.remove('active');
            document.getElementById('all').classList.remove('active');
        }
    });

    instrumentsSection.appendChild(btn);
};

///////////////////////////////////////////////////////////////////

function scrollFunction() {
    let header = document.getElementById('header');
    if (document.body.scrollTop > 350 || document.documentElement.scrollTop > 350) {
     header.classList.add("scrolled");
    } else {
     header.classList.remove("scrolled");
    }
} 

window.addEventListener('scroll', function(){
    scrollFunction();
});

init();