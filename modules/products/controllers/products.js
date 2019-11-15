const productModel = require('../models/products');
const {errorHandler} = require('../../helpers/dbErrorHandler');
const productDao = require('../dao/products');
const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');

const productController = {
    createProduct: (req, res, next) => {
        let form = new formidable.IncomingForm();
        form.keepExtensions = true;
        form.parse(req, (err, fields, files) => {
            if (err) {
                return res
                    .status(400)
                    .json({err: "Image Cannot be uploaded"});
            }
            const {
                name,
                description,
                shipping,
                price,
                quantity,
                category
            } = fields;
            if (!name || !description || !category || !price || !shipping || !quantity) {
                return res
                    .status(400)
                    .json({err: "All fields are required!!!!"});
            }
            const product = new productModel(fields);
            if (files.photo) {
                if (files.photo.size > 1000000) {
                    return res
                        .status(400)
                        .json({err: "Image Size too large"});
                }
                product.photo.data = fs.readFileSync(files.photo.path);
                product.photo.contentType = files.photo.type;
            }
            product.save((err, product) => {
                if (err) {
                    return res
                        .status(400)
                        .json({error: errorHandler(err)});
                }
                return res
                    .status(200)
                    .json({product});
            })
        })
    },
    getProductById: (req, res, next, id) => {
        let query = {
            _id: id
        };
        productDao
            .getOneProduct(query)
            .then((result) => {
                req.product = result.product;
                next();
            })
            .catch((err) => {
                res
                    .status(400)
                    .json({err: "Product Not Found!!!"});
            });
    },
    readProduct: (req, res, next) => {
        req.product.photo = undefined;
        return res.json(req.product);
    },
    removeProduct: (req, res, next) => {
        const product = req.product;

        product.remove((err, deleteProduct) => {
            if (err) {
                return res
                    .status(400)
                    .json({error: errorHandler(err)});
            }
            return res.json({deleteProduct, "message": "Product deleted !!!"});
        });
    },
    updateProduct: (req, res, next) => {
        let form = new formidable.IncomingForm();
        form.keepExtensions = true;
        form.parse(req, (err, fields, files) => {
            if (err) {
                return res
                    .status(400)
                    .json({err: "Image Cannot be uploaded"});
            }
            const {
                name,
                description,
                shipping,
                price,
                quantity,
                category
            } = fields;
            // const product = new productModel(fields);
            let product = req.product;
            product = _.extend(product,fields);
            ///----------------------------------------///--------------------------------------///
            if (files.photo) {
                if (files.photo.size > 1000000) {
                    return res
                        .status(400)
                        .json({err: "Image Size too large"});
                }
                product.photo.data = fs.readFileSync(files.photo.path);
                product.photo.contentType = files.photo.type;
            }
            product.save((err, product) => {
                if (err) {
                    return res
                        .status(400)
                        .json({error: errorHandler(err)});
                }
                return res
                    .status(200)
                    .json({product});
            })
        });
    }
};

module.exports = productController;