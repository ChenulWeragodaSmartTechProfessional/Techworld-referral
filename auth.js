import {auth,db}
from "./firebase.js";


import {

createUserWithEmailAndPassword,

signInWithEmailAndPassword,

GoogleAuthProvider,

signInWithPopup,

signOut

}

from

"https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";



import {

doc,

setDoc,

getDoc,

query,

where,

collection,

getDocs,

updateDoc,

increment,

addDoc

}

from

"https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";




function generateCode(){

return Math.random()
.toString(36)
.substring(2,8)
.toUpperCase();

}





export async function registerUser(

email,

password,

name

){


try{


let result =

await createUserWithEmailAndPassword(

auth,

email,

password

);



let user=result.user;



let refCode =
generateCode();



let referredBy =
localStorage.getItem("referrer");




await setDoc(

doc(db,"users",user.uid),

{

uid:user.uid,

name:name,

email:email,

refCode:refCode,

points:0,

referredBy:referredBy || null,

createdAt:new Date()

}


);





if(referredBy){


let q=query(

collection(db,"users"),

where(
"refCode",
"==",
referredBy

)

);



let snap=
await getDocs(q);



snap.forEach(async(refUser)=>{


await updateDoc(

doc(
db,

"users",

refUser.id

),

{

points:
increment(10)

}


);



await addDoc(

collection(db,"referrals"),

{

referrerUid:
refUser.id,

newUserUid:
user.uid,

date:new Date()

}


);



});


}



return {

success:true

};


}


catch(e){


return{

success:false,

error:e.message

};


}


}






export async function loginUser(email,password){


return signInWithEmailAndPassword(

auth,

email,

password

);


}







export async function loginWithGoogle(){


let provider =
new GoogleAuthProvider();



let result =
await signInWithPopup(

auth,

provider

);



let user=result.user;



let check=
await getDoc(

doc(db,"users",user.uid)

);



if(!check.exists()){


await setDoc(

doc(db,"users",user.uid),

{

uid:user.uid,

name:user.displayName,

email:user.email,

points:0,

refCode:generateCode()


}

);


}



return{

success:true

};



}




export function logoutUser(){

return signOut(auth);

}