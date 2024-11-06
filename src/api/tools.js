export default {
    formatMoney(money) {
        return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },
    getColor(colorName) {
        const colors = [
            { name: 'Đen', hex: '#000000' },
            { name: 'Trắng', hex: '#FFFFFF' },
            { name: 'Xám', hex: '#808080' },
            { name: 'Xanh dương', hex: '#0000FF' },
            { name: 'Xanh lá cây', hex: '#008000' },
            { name: 'Đỏ', hex: '#FF0000' },
            { name: 'Vàng', hex: '#FFFF00' },
            { name: 'Cam', hex: '#FFA500' },
            { name: 'Tím', hex: '#800080' },
            { name: 'Nâu', hex: '#A52A2A' },
            { name: 'Hồng', hex: '#FFC0CB' },
            { name: 'Xanh da trời', hex: '#87CEEB' },
            { name: 'Xanh ngọc', hex: '#20B2AA' },
            { name: 'Vàng chanh', hex: '#FFFACD' },
            { name: 'Bạc', hex: '#C0C0C0' },
            { name: 'Xanh lục nhạt', hex: '#90EE90' },
            { name: 'Tím nhạt', hex: '#DDA0DD' },
            { name: 'Cam sáng', hex: '#FF7F50' },
            { name: 'Xanh dương nhạt', hex: '#ADD8E6' },
            { name: 'Đỏ tươi', hex: '#FF6347' },
            { name: 'Xanh lá mạ', hex: '#98FB98' },
            { name: 'Đen nhám', hex: '#4B4B4B' },
            { name: 'Trắng ngà', hex: '#FAF0E6' },
            { name: 'Nâu sáng', hex: '#D2691E' },
            { name: 'Tím than', hex: '#663399' }
        ];

        const color = colors.find((color) => color.name == colorName);
        return color.hex;
    },
}