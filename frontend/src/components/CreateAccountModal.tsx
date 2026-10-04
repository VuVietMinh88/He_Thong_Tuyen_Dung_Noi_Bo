import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

// Định nghĩa các Role hợp lệ trong hệ thống
export type UserRole = 'ADMIN' | 'HR' | 'INTERVIEWER' | 'EMPLOYEE';

// Interface chứa dữ liệu của form tạo tài khoản
export interface CreateAccountFormData {
  fullName: string;
  email: string;
  role: UserRole;
}

// Interface định nghĩa các Props truyền vào Modal
export interface CreateAccountModalProps {
  // Trạng thái hiển thị Modal
  isOpen: boolean;
  // Hàm gọi khi muốn đóng Modal
  onClose: () => void;
  // Hàm gọi khi form được submit thành công (nhận vào data và trả về Promise để xử lý loading)
  onSubmit: (data: CreateAccountFormData) => Promise<void>;
}

/**
 * Component CreateAccountModal: Dialog chứa form tạo tài khoản mới.
 * Hỗ trợ validate cơ bản, trạng thái loading và responsive.
 */
export const CreateAccountModal: React.FC<CreateAccountModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  // Trạng thái lưu trữ dữ liệu form
  const [formData, setFormData] = useState<CreateAccountFormData>({
    fullName: '',
    email: '',
    role: 'EMPLOYEE', // Giá trị mặc định
  });

  // Trạng thái lưu trữ lỗi validate form
  const [errors, setErrors] = useState<{ fullName?: string; email?: string }>({});
  
  // Trạng thái loading khi đang submit API
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Nếu Modal không mở thì không render gì cả (trả về null)
  if (!isOpen) return null;

  // Hàm xử lý khi người dùng nhập liệu vào form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Xóa lỗi của field đó khi người dùng bắt đầu gõ lại
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Hàm validate dữ liệu trước khi submit
  const validateForm = (): boolean => {
    const newErrors: { fullName?: string; email?: string } = {};
    let isValid = true;

    // Kiểm tra Họ và Tên
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ và tên không được để trống';
      isValid = false;
    }

    // Kiểm tra Email bằng biểu thức chính quy (Regex) cơ bản
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email công ty không được để trống';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Định dạng email không hợp lệ';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Hàm xử lý sự kiện Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Ngăn trình duyệt reload lại trang

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      // Gọi hàm onSubmit truyền từ props (thường là API call)
      await onSubmit(formData);
      
      // Nếu thành công, reset form và đóng modal
      setFormData({ fullName: '', email: '', role: 'EMPLOYEE' });
      onClose();
    } catch (error) {
      console.error('Lỗi khi tạo tài khoản:', error);
    } finally {
      setIsSubmitting(false); // Tắt trạng thái loading
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity p-4">
      {/* Khối Dialog chính của Modal */}
      <div 
        className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng (X) ở góc phải trên cùng */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1 transition-colors disabled:opacity-50"
          title="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tiêu đề Modal */}
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Tạo Tài Khoản Mới</h2>
        </div>

        {/* Form nhập liệu */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Cụm input Họ và Tên */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Họ và Tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Ví dụ: Nguyễn Văn A"
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all ${
                errors.fullName 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200 text-red-900' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
              }`}
            />
            {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
          </div>

          {/* Cụm input Email công ty */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email công ty <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="nguyenvana@company.com"
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all ${
                errors.email 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200 text-red-900' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
              }`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Cụm select Vai trò (Role) */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Phân quyền vai trò <span className="text-red-500">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
            >
              <option value="ADMIN">Quản trị viên (Admin)</option>
              <option value="HR">Nhân sự (HR)</option>
              <option value="INTERVIEWER">Phỏng vấn viên</option>
              <option value="EMPLOYEE">Nhân viên</option>
            </select>
          </div>

          {/* Cụm nút hành động (Hủy / Lưu) */}
          <div className="pt-4 mt-2 flex justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                'Tạo tài khoản'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

