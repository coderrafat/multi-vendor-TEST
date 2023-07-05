const slugify = require('slugify');
const ProductsModel = require("../models/ProductsModel");
const multer = require('multer');
const path = require('path');
const SellerModel = require('../models/SellersModel');


//Create New Product
exports.ProductCreate = async (req, res) => {
    try {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, 'public/images/products')
            },
            filename: (req, file, cb) => {
                const fileExt = path.extname(file.originalname);
                const fileName = file.originalname
                    .replace(fileExt, "")
                    .toLowerCase()
                    .split(" ")
                    .join("-") + "-" + Date.now()

                cb(null, fileName + fileExt)
            }
        })

        const upload = multer({
            storage: storage,
            limits: {
                fileSize: 5000000  //5MB
            },
        }).single('ProductImage');

        upload(req, res, async (error) => {
            if (error) {
                res.json({ error: "File Upload Fail" })
            }
            else {
                const { sellerId, name, description, price, brand, category, quantity, discount, shopName } = req.body;

                //Validetion
                if (!sellerId) {
                    return res.json({ error: "Seller Id is required" })
                }
                if (!name) {
                    return res.json({ error: "Name is required" })
                }
                if (!description) {
                    return res.json({ error: "Description is required" })
                }
                if (!price) {
                    return res.json({ error: "Price is required" })
                }
                if (!category) {
                    return res.json({ error: "Category is required" })
                }
                if (!quantity) {
                    return res.json({ error: "Quantity is required" })
                }

                //Create New Product
                const product = await ProductsModel.create({
                    sellerId, name, description, price, brand, category, shopName, quantity, discount, slug: slugify(name), image: req.file.path

                });

                res.json({ status: 'Success', massage: "Product has been Created!", Data: product });
            }
        });

    } catch (error) {
        console.log(error)
    }
};

//Update Product
exports.UpdateProduct = async (req, res) => {
    try {
        const { name, description, price, brand, category, quantity, discount, shopName } = req.body;


        const product = await ProductsModel.findById(req.params.productId);

        if (!product) {
            return res.json({ error: 'Product not found' })
        }


        await ProductsModel.findByIdAndUpdate(product, {
            name: name || product.name,
            slug: slugify(name) || product.slug,
            description: description || product.description,
            price: price || product.price,
            brand: brand || product.brand,
            category: category || product.category,
            quantity: quantity || product.quantity,
            discount: discount || product.discount,
            shopName: shopName || product.shopName
        })

        res.json({ status: 'Success', massage: 'Product has been Updated!' })

    } catch (error) {
        console.log(error)
    }
};

//Read Product
exports.ReadProduct = async (req, res) => {
    try {
        const product = await SellerModel.findById(req.params.productId);

        if (!product) {
            return res.json({ error: 'Product not found' })
        }


        res.json(product);

    } catch (error) {
        console.log(error)
    }
};

//Delete Product
exports.DeleteProduct = async (req, res) => {
    try {
        const product = await SellerModel.findByIdAndDelete(req.params.productId);

        if (!product) {
            return res.json({ error: 'Product not found' })
        }

        res.json(product);

    } catch (error) {
        console.log(error)
    }
};
