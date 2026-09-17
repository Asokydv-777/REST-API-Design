const express = require("express");
const ctrl = require("../controllers/notes.controller");

const router = express.Router();

// Wrap sync controller calls so thrown errors reach the error handler
const wrap = (fn) => (req, res, next) => {
  try {
    fn(req, res, next);
  } catch (err) {
    next(err);
  }
};

router.get("/", wrap(ctrl.list));
router.get("/:id", wrap(ctrl.getOne));
router.post("/", wrap(ctrl.create));
router.put("/:id", wrap(ctrl.update));
router.delete("/:id", wrap(ctrl.remove));

module.exports = router;
