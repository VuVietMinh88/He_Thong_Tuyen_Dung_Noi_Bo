import { ArrowLeft, House, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UnauthorizedPage = (): React.JSX.Element => {
	const navigate = useNavigate();

	const handleGoBack = (): void => {
		navigate(-1);
	};

	const handleGoHome = (): void => {
		navigate('/dashboard', { replace: true });
	};

	return (
		<main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
			<section className="w-full max-w-2xl text-center">
				<div className="mx-auto flex size-20 items-center justify-center rounded-full bg-rose-100 text-rose-700">
					<ShieldAlert aria-hidden="true" size={42} strokeWidth={1.7} />
				</div>
				<p className="mt-8 text-sm font-bold uppercase text-rose-700">Lỗi 403</p>
				<h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
					Bạn chưa được cấp quyền truy cập
				</h1>
				<p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600">
					Tài khoản hiện tại không có quyền xem trang hoặc thực hiện thao tác này.
					Dữ liệu của bạn vẫn an toàn; hãy quay lại hoặc trở về trang chủ để tiếp tục.
				</p>
				<div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
					<button
						type="button"
						onClick={handleGoBack}
						className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500"
					>
						<ArrowLeft aria-hidden="true" size={18} />
						Quay lại
					</button>
					<button
						type="button"
						onClick={handleGoHome}
						className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-slate-900 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
					>
						<House aria-hidden="true" size={18} />
						Về trang chủ
					</button>
				</div>
			</section>
		</main>
	);
};
