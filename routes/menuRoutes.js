const express = require('express');
const router = express.Router();
const Menu = require('../schemas/menu');
const { CreateSuccessRes, CreateErrorRes } = require('../utils/responseHandler');

// Lấy menu theo cấu trúc cha con
router.get('/', async (req, res, next) => {
    try {
        const menus = await Menu.find({ isDeleted: false });
        
        // Tạo map để lưu trữ các menu theo ID
        const menuMap = new Map();
        
        // Khởi tạo map với tất cả các menu
        menus.forEach(menu => {
            menuMap.set(menu._id.toString(), {
                text: menu.text,
                url: menu.url,
                children: []
            });
        });
        
        // Xây dựng cấu trúc cây
        const tree = [];
        menus.forEach(menu => {
            const menuNode = menuMap.get(menu._id.toString());
            if (menu.parent) {
                const parentNode = menuMap.get(menu.parent.toString());
                if (parentNode) {
                    parentNode.children.push(menuNode);
                }
            } else {
                tree.push(menuNode);
            }
        });
        
        CreateSuccessRes(res, tree, 200);
    } catch (error) {
        next(error);
    }
});

// Route seeding data cho menu
router.post('/seed', async (req, res, next) => {
    try {
        // Xóa tất cả menu cũ
        await Menu.updateMany({}, { isDeleted: true });

        // Tạo menu cấp 1
        const gioiThieu = await Menu.create({
            text: "Giới thiệu",
            url: "/",
            parent: null
        });

        const phongBanTrungTam = await Menu.create({
            text: "Phòng ban trung tâm",
            url: "/",
            parent: null
        });

        const khoaVien = await Menu.create({
            text: "Khoa viện",
            url: "/",
            parent: null
        });

        // Tạo menu con cho Giới thiệu
        await Menu.create([
            {
                text: "Tổng quan",
                url: "/",
                parent: gioiThieu._id
            },
            {
                text: "Lịch sử phát triển",
                url: "/lich-su-phat-trien",
                parent: gioiThieu._id
            }
        ]);

        // Tạo menu con cho Phòng ban trung tâm
        await Menu.create([
            {
                text: "Phòng đào tạo",
                url: "/phong-dao-tao",
                parent: phongBanTrungTam._id
            },
            {
                text: "Phòng CTSV",
                url: "/phong-ctsv",
                parent: phongBanTrungTam._id
            },
            {
                text: "Phòng tài chính",
                url: "/phong-tai-chinh",
                parent: phongBanTrungTam._id
            }
        ]);

        // Tạo menu con cho Khoa viện
        await Menu.create([
            {
                text: "Khoa CNTT",
                url: "/khoa-cntt",
                parent: khoaVien._id
            },
            {
                text: "Viện kỹ thuật",
                url: "/vien-kt",
                parent: khoaVien._id
            }
        ]);

        CreateSuccessRes(res, "Đã tạo dữ liệu mẫu cho menu thành công", 200);
    } catch (error) {
        next(error);
    }
});

module.exports = router; 