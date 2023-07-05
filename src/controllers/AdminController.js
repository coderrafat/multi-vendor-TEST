const SendEmail = require("../config/SendEmail");
const AdminModel = require("../models/AdminModel");
const SellerModel = require("../models/SellersModel");
const UsersModel = require("../models/UsersModel");



//Seller Active
exports.SellerActive = async (req, res) => {
    try {

        const seller = await SellerModel.findById(req.params.sellerId);

        await SellerModel.findByIdAndUpdate(seller, { accountStatus: 'active' })

        await UsersModel.findOneAndUpdate({ email: seller.email }, { role: 'seller' })

        if (!seller) {
            return res.json({ error: 'Seller not found' })
        }

        //Email Data
        const data = {
            to: seller.email,
            subject: 'Seller Account Active',
            html: `<h3>Hello Seller</h3>
                    <h5>Your Seller Account has been activated!</h5>`
        }

        //Send Email
        SendEmail(data);

        res.json({ status: 'Success' })
    } catch (error) {
        console.log(error)
    }
};

//Seller Deactive
exports.SellerDeactive = async (req, res) => {
    try {
        const seller = await SellerModel.findByIdAndUpdate(req.params.sellerId, { accountStatus: 'deactive' })

        if (!seller) {
            return res.json({ error: 'Seller not found' })
        }

        //Email Data
        const data = {
            to: seller.email,
            subject: 'Seller Account Deactive',
            html: `<h3>Hello Seller</h3>
                            <h5>Your Seller Account has been Deactivated!</h5>
                            <h6>Please Contact With Admin For Active Your Account.</h6>`
        }

        //Send Email
        SendEmail(data);

        res.json({ status: 'Success' })
    } catch (error) {
        console.log(error)
    }
};

//All Active Seller
exports.ActiveSellers = async (req, res) => {
    try {
        const seller = await SellerModel.find({ accountStatus: 'active' });

        res.json(seller);
    } catch (error) {
        console.log(error)
    }
};

//All Deactive Seller
exports.DeactiveSellers = async (req, res) => {
    try {
        const seller = await SellerModel.find({ accountStatus: 'deactive' });

        res.json(seller);
    } catch (error) {
        console.log(error)
    }
};

//All Pending Seller
exports.PendingSellers = async (req, res) => {
    try {
        const seller = await SellerModel.find({ accountStatus: 'pending' });

        res.json(seller);
    } catch (error) {
        console.log(error)
    }
};





