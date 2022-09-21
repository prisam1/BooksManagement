const mongoose = require('mongoose');


const checkInputsPresent = (value) => {
    return (Object.keys(value).length > 0);
}

const isValid = function (value) {
    if (typeof value === "undefined" || typeof value === null) return false
    if (typeof value === "string" && value.trim().length == 0) return false
    return true
}

// const isTitleValid= function(value){
//     if (value == "Mr" ||value =="Miss" ||value =="Mrs") return true
//     return false
// }
const isValidTitle = function (title,inp) {
    return (inp.indexOf(title) !== -1);
  };

const validateEmail = (email) => {
    return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email));
}
const validateMobileNo = (number) => {
    return (/^[0-9]{10}$/.test(number))
    
}
const validPassword=(password)=>{
return (/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&])[a-zA-Z0-9@#$%&]{8,15}$/.test(password))
}

module.exports={checkInputsPresent,isValid,isValidTitle,validateMobileNo,validateEmail,validPassword}