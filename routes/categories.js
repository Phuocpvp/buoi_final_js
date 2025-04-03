var express = require('express');
var router = express.Router();
let categoryModel = require('../schemas/category')
let {CreateErrorRes,
  CreateSuccessRes} = require('../utils/responseHandler')
const slugify = require('../utils/slugify');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let products = await categoryModel.find({
    isDeleted:false
  })
  CreateSuccessRes(res,products,200);
});

// Route seeding data cho categories
router.post('/seed', async function(req, res, next) {
  try {
    const categories = [
      {
        name: "Điện Thoại",
        description: "Các sản phẩm điện thoại di động",
        slug: slugify("Điện Thoại")
      },
      {
        name: "Laptop",
        description: "Các sản phẩm máy tính xách tay",
        slug: slugify("Laptop")
      },
      {
        name: "Máy Tính Bảng",
        description: "Các sản phẩm máy tính bảng",
        slug: slugify("Máy Tính Bảng")
      }
    ];

    for (const category of categories) {
      const existingCategory = await categoryModel.findOne({ name: category.name });
      if (!existingCategory) {
        await categoryModel.create(category);
        console.log(`Đã tạo category: ${category.name}`);
      }
    }
    CreateSuccessRes(res, "Đã tạo dữ liệu mẫu cho categories thành công", 200);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async function(req, res, next) {
  try {
    let product = await categoryModel.findOne({
      _id:req.params.id, isDeleted:false
    }
    )
    CreateSuccessRes(res,product,200);
  } catch (error) {
    next(error)
  }
});
router.post('/', async function(req, res, next) {
  try {
    let body = req.body
    let newProduct = new categoryModel({
      name:body.name,
    })
    await newProduct.save();
    CreateSuccessRes(res,newProduct,200);
  } catch (error) {
    next(error)
  }
});
router.put('/:id', async function(req, res, next) {
  let id = req.params.id;
  try {
    let body = req.body
    let updatedInfo = {};
    if(body.name){
      updatedInfo.name = body.name;
    }
    let updateProduct = await categoryModel.findByIdAndUpdate(
      id,updatedInfo,{new:true}
    )
    CreateSuccessRes(res,updateProduct,200);
  } catch (error) {
    next(error)
  }
});
router.delete('/:id', async function(req, res, next) {
  let id = req.params.id;
  try {
    let updateProduct = await categoryModel.findByIdAndUpdate(
      id,{
        isDeleted:true
      },{new:true}
    )
    CreateSuccessRes(res,updateProduct,200);
  } catch (error) {
    next(error)
  }
});

module.exports = router;
