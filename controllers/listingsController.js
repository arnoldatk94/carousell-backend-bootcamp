const BaseController = require("./baseController");

class ListingsController extends BaseController {
  constructor(model, userModel) {
    super(model);
    this.userModel = userModel;
  }

  /** if a method in this extended class AND the base class has the same name, the one in the extended class will run over the base method */
  // Create listing. Requires authentication.
  insertOne = async (req, res) => {
    const {
      title,
      category,
      condition,
      price,
      description,
      shippingDetails,
      sellerEmail,
    } = req.body;
    console.log("Seller email", sellerEmail);
    try {
      // TODO: Get seller email from auth, query Users table for seller ID
      const [seller] = await this.userModel.findOrCreate({
        where: {
          email: sellerEmail,
        },
      });
      // Create new listing
      const newListing = await this.model.create({
        title: title,
        category: category,
        condition: condition,
        price: price,
        description: description,
        shippingDetails: shippingDetails,
        buyerId: null,
        sellerId: seller.id,
      });

      // Respond with new listing
      return res.json(newListing);
    } catch (err) {
      console.log("Error", err);
      return res.json(err);
      // return res.status(400).json({ error: true, msg: err });
    }
  };

  // Retrieve specific listing. No authentication required.
  getOne = async (req, res) => {
    const { listingId } = req.params;
    try {
      const output = await this.model.findByPk(listingId);
      return res.json(output);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  // Buy specific listing. Requires authentication.
  buyItem = async (req, res) => {
    const { listingId } = req.params;
    const { buyerEmail } = req.body;
    console.log("Buyer's email", buyerEmail);
    try {
      const data = await this.model.findByPk(listingId);
      const [buyer] = await this.userModel.findOrCreate({
        where: {
          email: buyerEmail,
        },
      });

      // TODO: Get buyer email from auth, query Users table for buyer ID
      await data.update({ buyerId: buyer.id }); // TODO: Replace with buyer ID of authenticated buyer
      console.log("Buyer's ID", buyer.id);

      // Respond to acknowledge update
      return res.json(data);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };
}

module.exports = ListingsController;
