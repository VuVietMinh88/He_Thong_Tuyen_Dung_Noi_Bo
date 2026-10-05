/**
 * Middleware kiểm tra vai trò (Role) của người dùng
 * @param {Array} allowedRoles - Danh sách các role được phép truy cập (ví dụ: ['ADMIN', 'HR'])
 */
const checkRole = (allowedRoles = []) => {
  return (req, res, next) => {
    // 1. Lấy thông tin role của user từ req.user (được gán từ middleware auth/verifyToken trước đó)
    const userRole = req.user?.role;

    // 2. Nếu không có thông tin user/role hoặc role không nằm trong danh sách được phép
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: 'Forbidden: Bạn không có quyền thực hiện thao tác này.',
        error: 'ACCESS_DENIED'
      });
    }

    // 3. Nếu hợp lệ, cho phép tiếp tục xử lý Request
    next();
  };
};

module.exports = checkRole;