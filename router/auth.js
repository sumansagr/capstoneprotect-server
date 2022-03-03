const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");


const cookieParser = require("cookie-parser");
const authenticate = require("../middleware/authenticate");

require("../db/conn");

const User = require("../model/dataSchema");

router.use(cookieParser());

//Home routes
router.get("/", (req, res) => {
  res.send("home");
});



//register routes
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  if ((!name, !email, !password, !role)) {
    return res.status(422).json({
      errors: "Fill the all details",
    });
  }

  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "User already exists" });
    } else {
      const user = new User({
        name,
        email,
        password,
        role,
      });

      const userRegister = await user.save();

      if (userRegister) {
        return res
          .status(201)
          .json({ message: "User registered successfully" });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "fill the data",
      });
    }

    const userLogin = await User.findOne({ email: email });
console.log(userLogin._id)
    let token = jwt.sign(
      {
        _id: userLogin._id,
      },
      process.env.SECRET_KEY
    );


    //storing cookie
    res.cookie("jwtoken", token, {
      expires: new Date(Date.now() + 8640000),
      httpOnly: true,
    });

    if (!userLogin || userLogin.password !== password) {
      res.status(400).json({ message: "user error" });
    } else {
      res.status(200).json({
        message: "user signed in successfully",
        role: userLogin.role,
        token:token,
      });
    }
  } catch (err) {
    console.log(err);
  }
});





router.get("/details", authenticate, (req, res) => {

});



// router.get("/sample",  (req, res) => {
  

// });



//logout
router.get("/logout", (req, res) => {
  console.log("hello logout");
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("user logout");
});

router.post("/entersample", async (req, res) => {
  const { heamatology, glucometry, thyroid, id, editId } = req.body;
  try {
    let updatedUser;

    if (editId === 1) {
      updatedUser = await User.updateOne(
        { _id: id },
        {
          $set: {
            heamatology: {
              haemoglobin: heamatology?.haemoglobin,
              neutrophils: heamatology?.neutrophils,
              eosinophiles: heamatology?.eosinophiles,
              basophills: heamatology?.basophills,
              pcv: heamatology?.pcv,
              wbc: heamatology?.wbc,
              lymphocytes: heamatology?.wbc,
              monocytes: heamatology?.lymphocytes,
              rbc: heamatology?.rbc,
              mcv: heamatology?.mcv,
            },
          },
        }
      );
    } else if (editId === 2) {
      updatedUser = await User.updateOne(
        { _id: id },
        {
          $set: {
            glucometry: {
              fbs: glucometry?.fbs,
              ppbs: glucometry?.ppbs,
              gh: glucometry?.gh,
              calcium: glucometry?.calcium,
            },
          },
        }
      );
    } else if (editId === 3) {
      console.log("3-====>");

      updatedUser = await User.updateOne(
        { _id: id },
        {
          $set: {
            thyroid: {
              tri: thyroid?.tri,
              thyroxine: thyroid?.thyroxine,
              tsh: thyroid?.tsh,
            },
          },
        }
      );
    }
    // if(glucometry)

    //  if(Thyroid)

    if (updatedUser) {
      return res.status(200).json({
        message: "updated successfully ",
        output: updatedUser,
      });
    }
  } catch (err) {
    console.log("error =======================>", err);

    res
      .status(500)
      .json({ details: err.message, message: "Something went wrong" });
  }
});

// router.get("/admin") , (req, res) => {

// }

module.exports = router;
