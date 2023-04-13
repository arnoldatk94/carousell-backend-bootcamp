const express = require("express");
const router = express.Router();

class ListingsRouter {
  constructor(controller, checkJwt) {
    this.controller = controller;
    this.checkJwt = checkJwt;
  }
  routes() {
    // we will insert routes into here later on
    router.get("/", this.controller.getAll);
    router.post("/", this.checkJwt, this.controller.insertOne);
    router.get("/:listingId", this.controller.getOne);
    router.put("/:listingId", this.controller.buyItem);
    return router;
  }
}

module.exports = ListingsRouter;
