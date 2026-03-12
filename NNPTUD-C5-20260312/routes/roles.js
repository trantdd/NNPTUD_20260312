var express = require("express");
var router = express.Router();
let roleModel = require("../schemas/roles");
let userModel = require("../schemas/users");

router.get("/", async function (req, res) {
  try {
    let data = await roleModel.find({
      isDeleted: false,
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
    let result = await roleModel.findOne({
      isDeleted: false,
      _id: id,
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

router.get("/:id/users", async function (req, res) {
  try {
    let id = req.params.id;
    let role = await roleModel.findOne({
      isDeleted: false,
      _id: id,
    });

    if (!role) {
      return res.status(404).send({
        message: "ROLE ID NOT FOUND",
      });
    }

    let users = await userModel
      .find({
        isDeleted: false,
        role: id,
      })
      .populate({
        path: "role",
        select: "name description",
      });

    res.send(users);
  } catch (error) {
    res.status(404).send({
      message: error.message,
    });
  }
});

router.post("/", async function (req, res) {
  try {
    let newRole = new roleModel({
      name: req.body.name,
      description: req.body.description,
    });

    await newRole.save();
    res.status(201).send(newRole);
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});

router.put("/:id", async function (req, res) {
  try {
    let id = req.params.id;
    let result = await roleModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

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
    let result = await roleModel.findOne({
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
