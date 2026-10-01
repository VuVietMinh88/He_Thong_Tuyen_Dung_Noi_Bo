import { Link } from 'react-router-dom';

export const UnauthorizedPage = (): React.JSX.Element => (
	<main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
		<section className="max-w-lg text-center">
			<p className="text-sm font-semibold uppercase text-red-700">Lỗi 403</p>
			<h1 className="mt-3 text-3xl font-bold text-gray-900">
				Bạn không có quyền truy cập
			</h1>
			<p className="mt-3 text-gray-600">
				Tài khoản hiện tại không được phép xem nội dung này.
			</p>
			<Link
				to="/login"
				className="mt-6 inline-flex rounded-md bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800"
			>
				Quay lại đăng nhập
			</Link>
		</section>
	</main>
);
