const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/authMiddleware'); // Middleware xác thực JWT/Token
const checkRole = require('../middleware/checkRole');         // Middleware 403 vừa tạo

// Ví dụ: API chỉ dành cho ADMIN hoặc HR
router.get(
  '/admin/candidates',
  verifyToken,                 // Kiểm tra đã đăng nhập chưa (Nếu chưa -> 401 Unauthorized)
  checkRole(['ADMIN', 'HR']),  // Kiểm tra đúng quyền chưa (Nếu sai -> 403 Forbidden)
  (req, res) => {
    res.status(200).json({
      success: true,
      data: 'Danh sách ứng viên...'
    });
  }
);

module.exports = router;