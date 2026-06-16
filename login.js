import {auth}
from "./firebase.js";


import {

signInWithEmailAndPassword

}

from

"https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";



window.login=async()=>{


await signInWithEmailAndPassword(

auth,

email.value,

password.value

);



window.location="dashboard.html";


}