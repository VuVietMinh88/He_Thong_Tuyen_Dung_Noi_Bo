// backend/src/controllers/roleController.js

// Giả lập danh sách Role (hoặc gọi query từ Database nếu dự án đã có DB)
const getRoles = async (req, res) => {
  try {
    const roles = [
      { id: 1, name: 'ADMIN', description: 'Quản trị viên hệ thống' },
      { id: 2, name: 'RECRUITER', description: 'Chuyên viên tuyển dụng' },
      { id: 3, name: 'CANDIDATE', description: 'Ứng viên' }
    ];

    return res.status(200).json({
      success: true,
      message: 'Lấy danh sách Role thành công',
      data: roles
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách Role',
      error: error.message
    });
  }
};

module.exports = {
  getRoles
};