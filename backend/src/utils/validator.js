const validator = require('validator');


const validate=(data)=>{

    const mandatoryFields = ['firstName', 'lastName', 'email', 'password'];

    const IsAllowed=mandatoryFields.every((k) => Object.keys(data).includes(k));
    if(!IsAllowed){
        throw new Error("Missing required fields");
    }

    if(!validator.isEmail(data.email)){
        throw new Error("Invalid email format");
    }
    if(!validator.isStrongPassword(data.password)){
        throw new Error("Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and symbols");
    }

}
module.exports=validate;