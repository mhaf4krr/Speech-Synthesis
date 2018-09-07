'use strict'
let synth = window.speechSynthesis; 

let textItem = document.querySelector('#text-item')
 
let voices = [];

const getVoices = () => {
    voices = synth.getVoices();   
}

getVoices();

if(synth.onvoiceschanged !== undefined){
synth.onvoiceschanged = getVoices;
}

console.log(voices)

// making a new promise

let weatherPromise = new Promise( (resolve , reject) => {
        
    const req = new XMLHttpRequest();

    req.addEventListener('readystatechange',(e)=>{

     if(e.target.readyState == 4 && e.target.status === 200)
     {
         let data = JSON.parse(e.target.responseText);
          resolve(data);
     }

     else if(e.target.readyState === 4)
     {
         reject('error has occured')
     }

    })
     req.open('GET','https://api.apixu.com/v1/current.json?key=11de647993324c438fe175647181204&q=srinagar');
    req.send();
       
 })


//making another promise for jokes




const speak = (argument) => {

    let speakText = new SpeechSynthesisUtterance(argument);
    
    speakText.voice = voices[7];

    console.log(speakText.voice)

     speakText.rate = 0.85;

     synth.speak(speakText);

     speakText.onend = function (event){
        
        document.querySelector('#waves').setAttribute('src','')
     }
}





let speakThis




    document.querySelector('#mic-img').addEventListener('click', ()=> {
        
      let  textItem = document.querySelector('#text-item').value;

      showImage();


        //< ==================== commands ===============>
        if(textItem.toLowerCase() === 'weather')
        {
               weatherPromise.then( (successData) =>  {
                 
                speakThis =`Hi! Weather in ${successData.location.name} is ${successData.current.temp_c} degree celcius but feels like ${successData.current.feelslike_c} degree . Forecast is ${successData.current.condition.text} `
                speak(speakThis);

                console.log(speakThis);
               }
               , (error)=>{ console.log(error)})
        }

        else if( textItem.toLowerCase() === 'joke')
        {
                 getNewJoke();
        }

        else {

            speak(textItem);  
            
        
        }

        
    });





   


// generates a new request each time

let getNewJoke = ()=> {

    var jokesPromise = new Promise( (resolve,request) => {
        const req = new XMLHttpRequest();
    
        req.addEventListener('readystatechange',(e)=>{
    
         if(e.target.readyState == 4 && e.target.status === 200)
         {
             let data = (e.target.responseText);
              resolve(data);
              console.log('seeked new data')
         }
    
         else if(e.target.readyState === 4)
         {
             reject('error has occured')
         }
    
        })
         req.open('GET','https://geek-jokes.sameerkumar.website/api');
        req.send();
           
     })
    
    
     jokesPromise.then( (successData) =>  {
                         
        speakThis = successData;
        speak(speakThis);
        
       }
       , (error)=>{ console.log(error)})
    
    }


    let showImage = () => {
        document.querySelector('#waves').setAttribute('src','voice.gif')
    }

