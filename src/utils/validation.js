const validator = require("validator")

const validateSignupData = (req) => {


    const {firstName,lastName,emailId ,password} = req.body;
    
    if(!firstName || !lastName){
        throw new Error ("name is not valid")
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email id is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("please enter a strong password!")
    }
}; 
const validateProfileEditData = (req)=>{
    const allowedEditFields = [
        "age","gender","photoUrl","about","skills" 
    ];


const isEditAllowed = Object.keys(req.body).every((field)=>
    allowedEditFields.includes(field)
);
return isEditAllowed;
};
module.exports = {
    validateSignupData,
    validateProfileEditData,
}