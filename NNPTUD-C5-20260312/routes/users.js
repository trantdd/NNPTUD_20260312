var express = require("express");
var router = express.Router();
let userModel = require("../schemas/users");

router.get("/", async function (req, res) {
  try {
    let data = await userModel
      .find({
        isDeleted: false,
      })
      .populate({
        path: "role",
        select: "name description",
      });
    res.send(data);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});

router.get("/:id", async function (req, res) {
  try {
    let id = req.params.id;
    let result = await userModel
      .findOne({
        isDeleted: false,
        _id: id,
      })
      .populate({
        path: "role",
        select: "name description",
      });

    if (result) {
      res.send(result);
    } else {
      res.status(404).send({
        message: "ID NOT FOUND",
      });
    }
  } catch (error) {
    res.status(404).send({
      message: error.message,
    });
  }
});

router.post("/", async function (req, res) {
  try {
    let newUser = new userModel({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      status: req.body.status,
      role: req.body.role,
      loginCount: req.body.loginCount,
    });

    await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});

router.post("/enable", async function (req, res) {
  try {
    let email = req.body.email;
    let username = req.body.username;

    if (!email || !username) {
      return res.status(400).send({
        message: "email and username are required",
      });
    }

    let result = await userModel
      .findOneAndUpdate(
        {
          isDeleted: false,
          email: String(email).toLowerCase(),
          username: username,
        },
        {
          status: true,
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .populate({
        path: "role",
        select: "name description",
      });

    if (result) {
      res.send(result);
    } else {
      res.status(404).send({
        message: "USER NOT FOUND",
      });
    }
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});

router.post("/disable", async function (req, res) {
  try {
    let email = req.body.email;
    let username = req.body.username;

    if (!email || !username) {
      return res.status(400).send({
        message: "email and username are required",
      });
    }

    let result = await userModel
      .findOneAndUpdate(
        {
          isDeleted: false,
          email: String(email).toLowerCase(),
          username: username,
        },
        {
          status: false,
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .populate({
        path: "role",
        select: "name description",
      });

    if (result) {
      res.send(result);
    } else {
      res.status(404).send({
        message: "USER NOT FOUND",
      });
    }
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});

router.put("/:id", async function (req, res) {
  try {
    let id = req.params.id;
    let result = await userModel
      .findOneAndUpdate(
        {
          _id: id,
          isDeleted: false,
        },
        req.body,
        {
          new: true,
          runValidators: true,
        },
      )
      .populate({
        path: "role",
        select: "name description",
      });

    if (result) {
      res.send(result);
    } else {
      res.status(404).send({
        message: "ID NOT FOUND",
      });
    }
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});

router.delete("/:id", async function (req, res) {
  try {
    let id = req.params.id;
    let result = await userModel.findOne({
      isDeleted: false,
      _id: id,
    });

    if (result) {
      result.isDeleted = true;
      await result.save();
      res.send(result);
    } else {
      res.status(404).send({
        message: "ID NOT FOUND",
      });
    }
  } catch (error) {
    res.status(404).send({
      message: error.message,
    });
  }
});

module.exports = router;
