const Category = require('../schemas/category');
const Product = require('../schemas/products');
const slugify = require('./slugify');

// Hàm tạo dữ liệu mẫu cho Category
const seedCategories = async () => {
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
            const existingCategory = await Category.findOne({ name: category.name });
            if (!existingCategory) {
                await Category.create(category);
                console.log(`Đã tạo category: ${category.name}`);
            }
        }
        console.log('Hoàn thành tạo dữ liệu categories');
    } catch (error) {
        console.error('Lỗi khi tạo dữ liệu categories:', error);
        throw error;
    }
};

// Hàm tạo dữ liệu mẫu cho Product
const seedProducts = async () => {
    try {
        const products = [
            {
                name: "iPhone 13",
                slug: slugify("iPhone 13"),
                price: 15990000,
                quantity: 50,
                description: "iPhone 13 128GB chính hãng VN/A",
                urlImg: "https://example.com/iphone13.jpg",
                category: await Category.findOne({ name: "Điện Thoại" }).select('_id')
            },
            {
                name: "MacBook Pro M1",
                slug: slugify("MacBook Pro M1"),
                price: 29990000,
                quantity: 30,
                description: "MacBook Pro M1 14 inch 2021",
                urlImg: "https://example.com/macbook.jpg",
                category: await Category.findOne({ name: "Laptop" }).select('_id')
            },
            {
                name: "iPad Pro 2022",
                slug: slugify("iPad Pro 2022"),
                price: 19990000,
                quantity: 40,
                description: "iPad Pro 12.9 inch 2022",
                urlImg: "https://example.com/ipad.jpg",
                category: await Category.findOne({ name: "Máy Tính Bảng" }).select('_id')
            }
        ];

        for (const product of products) {
            const existingProduct = await Product.findOne({ name: product.name });
            if (!existingProduct) {
                await Product.create(product);
                console.log(`Đã tạo product: ${product.name}`);
            }
        }
        console.log('Hoàn thành tạo dữ liệu products');
    } catch (error) {
        console.error('Lỗi khi tạo dữ liệu products:', error);
        throw error;
    }
};

// Hàm chạy tất cả các hàm seed
const seedAll = async () => {
    try {
        await seedCategories();
        await seedProducts();
        console.log('Hoàn thành tạo tất cả dữ liệu mẫu');
    } catch (error) {
        console.error('Lỗi khi tạo dữ liệu mẫu:', error);
        throw error;
    }
};

module.exports = {
    seedCategories,
    seedProducts,
    seedAll
}; 