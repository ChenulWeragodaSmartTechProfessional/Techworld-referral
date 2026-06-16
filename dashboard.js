import {auth,db}
from "./firebase.js";


import {

onAuthStateChanged

}

from

"https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";


import {

doc,
getDoc

}

from

"https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";



import {

signOut

}

from

"https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";




onAuthStateChanged(

auth,

async(user)=>{


if(!user){

window.location="login.html";

return;

}



const userSnap =

await getDoc(

doc(db,"users",user.uid)

);



if(userSnap.exists()){



const data =
userSnap.data();



document
.getElementById("name")
.innerHTML =
"Welcome "+data.name;



document
.getElementById("points")
.innerHTML =
"Points: "+data.points;



document
.getElementById("link")
.value =

window.location.origin+

"/join.html?ref="+

data.refCode;



}


}

);





window.copyLink=()=>{


let input =
document.getElementById("link");


input.select();


navigator.clipboard.writeText(
input.value
);


alert(
"Referral link copied!"
);


};





window.logout=()=>{


signOut(auth);


window.location="login.html";


};