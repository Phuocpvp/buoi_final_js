var express = require('express');
var router = express.Router();
let productModel = require('../schemas/products')
let categoryModel = require('../schemas/category')
let {CreateErrorRes,
  CreateSuccessRes} = require('../utils/responseHandler')
const slugify = require('../utils/slugify');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let products = await productModel.find({
    isDeleted:false
  }).populate("category")
  CreateSuccessRes(res,products,200);
});

// Route seeding data cho products
router.post('/seed', async function(req, res, next) {
  try {
    const products = [
      {
        name: "iPhone 13",
        slug: slugify("iPhone 13"),
        price: 15990000,
        quantity: 50,
        description: "iPhone 13 128GB chính hãng VN/A",
        urlImg: "https://example.com/iphone13.jpg",
        category: await categoryModel.findOne({ name: "Điện Thoại" }).select('_id')
      },
      {
        name: "MacBook Pro M1",
        slug: slugify("MacBook Pro M1"),
        price: 29990000,
        quantity: 30,
        description: "MacBook Pro M1 14 inch 2021",
        urlImg: "https://example.com/macbook.jpg",
        category: await categoryModel.findOne({ name: "Laptop" }).select('_id')
      },
      {
        name: "iPad Pro 2022",
        slug: slugify("iPad Pro 2022"),
        price: 19990000,
        quantity: 40,
        description: "iPad Pro 12.9 inch 2022",
        urlImg: "https://example.com/ipad.jpg",
        category: await categoryModel.findOne({ name: "Máy Tính Bảng" }).select('_id')
      }
    ];

    for (const product of products) {
      const existingProduct = await productModel.findOne({ name: product.name });
      if (!existingProduct) {
        await productModel.create(product);
        console.log(`Đã tạo product: ${product.name}`);
      }
    }
    CreateSuccessRes(res, "Đã tạo dữ liệu mẫu cho products thành công", 200);
  } catch (error) {
    next(error);
  }
});

// Lấy sản phẩm theo slug của category và product
router.get('/:categorySlug/:productSlug', async function(req, res, next) {
  try {
    const category = await categoryModel.findOne({ 
      slug: req.params.categorySlug,
      isDeleted: false 
    });
    
    if (!category) {
      return CreateErrorRes(res, "Không tìm thấy danh mục", 404);
    }
    
    const product = await productModel.findOne({
      slug: req.params.productSlug,
      category: category._id,
      isDeleted: false
    }).populate('category');
    
    if (!product) {
      return CreateErrorRes(res, "Không tìm thấy sản phẩm", 404);
    }
    
    CreateSuccessRes(res, product, 200);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async function(req, res, next) {
  try {
    let product = await productModel.findOne({
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
    let category = await categoryModel.findOne({
      name:body.category
    })
    if(category){
      let newProduct = new productModel({
        name:body.name,
        price:body.price,
        quantity:body.quantity,
        category:category._id
      })
      await newProduct.save();
      CreateSuccessRes(res,newProduct,200);
    }else{
      throw new Error("cate khong ton tai")
    } 
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
    if(body.price){
      updatedInfo.price = body.price;
    }
    if(body.quantity){
      updatedInfo.quantity = body.quantity;
    }
    if(body.category){
      updatedInfo.category = body.category;
    }
    let updateProduct = await productModel.findByIdAndUpdate(
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
    let body = req.body
    let updateProduct = await productModel.findByIdAndUpdate(
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
