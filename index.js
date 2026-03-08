let h1=document.querySelector('.hr1 p');
let h2=document.querySelector('.hr2 p');
let m1=document.querySelector('.m1 p');
let m2=document.querySelector('.m2 p');
let confirm=document.querySelector('.start');
let totalsecs;
let intervalId=null;
let reset=document.querySelector('.reset');
let instance = 0;
let pause=document.querySelector('.pause');

h1.innerHTML='0';
h2.innerHTML='0';
m1.innerHTML='0';
m2.innerHTML='0';

confirm.addEventListener('click',()=>{
  if (intervalId)
    return;
  const hoursInput = document.getElementById('hours');
    const minutesInput = document.getElementById('minutes');
    

    // hours.value is a string type so make sure to change all to int
let hours = parseInt(hoursInput.value) || 0;
let minutes = parseInt(minutesInput.value) || 0;

hours += Math.floor(minutes / 60);
minutes = minutes % 60;
totalsecs = (hours * 3600) + (minutes * 60);


// h1.innerHTML = Math.floor(hours / 10);
// h2.innerHTML = hours % 10;
// m1.innerHTML = Math.floor(minutes / 10);
// m2.innerHTML = minutes % 10;

 intervalId = setInterval(timercont, 1000);

   
});

function timercont(){

     if(totalsecs<=0){
    clearInterval(intervalId);
    alert("session completed");
intervalId = null
   return;
}
   
    totalsecs=totalsecs-1;

    let hours=Math.floor(totalsecs/3600);
    let minutes=Math.floor((totalsecs%3600)/60);
 console.log(hours,minutes);

    h1.innerHTML = parseInt(hours/10);
    h2.innerHTML = hours%10;
    m1.innerHTML = parseInt(minutes/10);
    m2.innerHTML = minutes%10;

    instance++;

}

reset.addEventListener('click',()=>{
    clearInterval(intervalId);
    intervalId=null;
    h1.innerHTML='0';
    h2.innerHTML='0';
    m1.innerHTML='0';
    m2.innerHTML='0';});

pause.addEventListener('click',()=>{
       clearInterval(intervalId);
    intervalId=null;
});

