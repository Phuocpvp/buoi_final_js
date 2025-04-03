const Menu = require('../schemas/menu');

const getMenuTree = async (req, res) => {
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
        
        res.json(tree);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMenuTree
}; 