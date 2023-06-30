const CategoryModel = require("../models/CategoryModel");
const slugify = require('slugify');


//Create New Category
exports.CreateCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.json({ error: 'Name is required' })
        }

        const existingCategory = await CategoryModel.findOne({ name });

        if (existingCategory) {
            return res.json({ error: 'Category Name is taken' })
        }

        const newCategory = await CategoryModel.create({ name, slug: slugify(name) });

        res.status(201).json({
            status: 'Success',
            massage: 'New Category has been Created!😊😊',
            Data: newCategory
        })

    } catch (error) {
        console.log(error)
    }
};

//Update Category
exports.UpdateCategory = async (req, res) => {
    try {

        const { name } = req.body;

        const category = await CategoryModel.findById(req.params.categoryId);

        if (!category) {
            return res.json({ error: 'Category not found' })
        }

        const findCategory = await CategoryModel.findOne({ name });

        if (findCategory) {
            return res.json({ error: 'Category is taken' })
        }

        const updateCategory = await CategoryModel.findByIdAndUpdate(category,
            {
                name,
                slug: slugify(name)
            })

        res.json({ status: 'Success', massage: 'Category has been Updated!', Data: updateCategory })

    } catch (error) {
        console.log(error)
    }
};

//Read Category
exports.ReadCategory = async (req, res) => {
    try {

        const categorySlug = await CategoryModel.findOne({ slug: req.params.slug }, 'name')

        if (!categorySlug) {
            return res.json({ error: 'Category not found' });
        }

        res.json(categorySlug)

    } catch (error) {
        console.log(error)
    }
};

//Delete Category
exports.DeleteCategory = async (req, res) => {
    try {
        const category = await CategoryModel.findByIdAndDelete(req.params.categoryId);

        if (!category) {
            return res.json({ error: 'Category not found' })
        };

        res.json({ status: 'Success', massage: 'Category has been Deleted!', Data: category })
    } catch (error) {
        console.log(error)
    }
};

//List Category
exports.ListCategory = async (req, res) => {
    try {
        const categories = await CategoryModel.find();

        if (!categories) {
            return res.json({ error: 'Category is empty' })
        }

        res.json(categories)
    } catch (error) {
        console.log(error)
    }
};