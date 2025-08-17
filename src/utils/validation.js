const validator=require('validator')
const fieldValidations=(req)=>{
    {
    const{firstName,lastName,email,password}=req
    if(!firstName||!lastName){
        throw new Error("firstname and lastname are required");
        
    }
    if(!validator.isEmail(email)){
        throw new Error("Invalid email format");

    }
    if(!validator.isStrongPassword(password)){
        throw new Error("Invalid Password");
    }

  
}
};
module.exports={fieldValidations}