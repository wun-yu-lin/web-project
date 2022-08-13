const { find } = require("../models/user-model");

const router = require("express").Router();
const courseValidation = require("../validation").courseValidation;
const Course = require("../models").courseModel;

router.use((req, res, next) => {
  console.log("A request is coming in auth.js");
  next();
});

router.get("/testAPI", (req, res) => {
  const msgObj = {
    message: "test API is working",
  };
  return res.json(msgObj);
});

//search course
router.get("/:_id", async (req, res) => {
  let { _id } = req.params;
  await Course.findOne({ _id })
    .populate("instructor", ["email"])
    .then((course) => {
      res.send(course);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
});

//search course need update
// router.patch("/:_id", async (req, res) => {
//   let { _id } = req.params;
//   let course = await Course.findOne({ _id }).populate("instructor", ["email"]);
//   if (!course) {
//     res.status(404);
//     return res.json({
//       success: false,
//       message: "Course not found.",
//     });
//   }
//   if (course.instructor.equals(req.user._id) || req.user.inAdmin()){
//     Course.findOneAndUpdate({_id})
//   }
// });

//get all course data
router.get("/", async (req, res) => {
  try {
    //populate 可使model取得其他referene model中的資料
    await Course.find({})
      .populate("instructor", ["username", "email"])
      .then((course) => {
        res.send(course);
      })
      .catch((err) => {
        res.status(400).send("error can not get courses");
      });
  } catch (err) {
    console.log("can not find coures in course model");
    res.status(400).send(err);
  }
});

router.post("/", async (req, res) => {
  //vdlidation posted data
  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { title, description, price } = req.body;
  //validation poster
  if (req.user.isStudent()) {
    return res.status(400).send("only instructor can post a new course.");
  }

  //update new course
  let newCourse = new Course({
    title: title,
    description: description,
    price,
    instructor: req.user._id,
  });
  try {
    await newCourse.save();
    res.status(200).send("New course has been saved.");
  } catch (err) {
    res.status(400).send("Cannot save course.");
  }
});

module.exports = router;
