// ==========================
// CALICO PHYSICS
// Version 1
// ==========================

// Fade in sections

const observer = new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

});

document.querySelectorAll("section").forEach(section=>{

section.classList.add("fade-in");

observer.observe(section);

});

// ==========================
// Shooting Stars
// ==========================

const stars=document.getElementById("stars");

function shootingStar(){

const star=document.createElement("div");

star.style.position="fixed";

star.style.width="3px";

star.style.height="3px";

star.style.background="white";

star.style.borderRadius="50%";

star.style.boxShadow="0 0 15px white";

star.style.left=Math.random()*window.innerWidth+"px";

star.style.top="-20px";

star.style.zIndex="-1";

star.style.pointerEvents="none";

document.body.appendChild(star);

let x=parseFloat(star.style.left);

let y=-20;

const speed=4+Math.random()*4;

const drift=2+Math.random()*2;

const interval=setInterval(()=>{

x-=drift;

y+=speed;

star.style.left=x+"px";

star.style.top=y+"px";

if(y>window.innerHeight+50){

clearInterval(interval);

star.remove();

}

},16);

}

setInterval(shootingStar,2500);

// ==========================
// Floating Navigation
// ==========================

window.addEventListener("scroll",()=>{

const nav=document.querySelector("nav");

if(window.scrollY>60){

nav.style.background="rgba(5,8,22,.82)";

}else{

nav.style.background="rgba(5,8,22,.55)";

}

});

// ==========================
// Button Ripple
// ==========================

document.querySelectorAll("button,a").forEach(btn=>{

btn.addEventListener("mouseenter",()=>{

btn.style.transform="translateY(-2px)";

});

btn.addEventListener("mouseleave",()=>{

btn.style.transform="translateY(0px)";

});

});

// ==========================
// Console Message
// ==========================

console.log(
"%cWelcome to Calico Physics",
"color:#ffd166;font-size:20px;font-weight:bold;"
);