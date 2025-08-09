const AuthAdmin = (req, res, next) => {
  const isAuth = "yes";
  if (isAuth === "yes") {
    next();
  } else {
    res.status(404).send("you are not a admin");
  }
};

const UserAuth = (req, res, next) => {
  const token = "anil";
  try {
    if (token === "anil") {
      next();
    }
  } catch (err) {
    console.log("errr",err)
    const  errr= new Error("you are not able to get the user data");
    res.send(errr)
  }
};
module.exports = {
  AuthAdmin,
  UserAuth
};
