import {auth,db}
from "./firebase.js";


import {
createUserWithEmailAndPassword
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {
doc,
setDoc
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



window.register = async()=>{


let user =
await createUserWithEmailAndPassword(

auth,

email.value,

password.value

);



let code =
Math.random()
.toString(36)
.substring(2,8);



await setDoc(

doc(db,"users",user.user.uid),

{


name:name.value,

email:email.value,

points:0,

refCode:code


}

);



alert(
"Your Referral Link:\n"+
"join.html?ref="+code
);


}