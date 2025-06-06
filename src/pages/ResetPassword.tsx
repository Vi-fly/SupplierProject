import ResetPassword from '@/components/auth/ResetPassword';
import Layout from '@/components/layout/Layout';

const ResetPasswordPage = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="text-center text-3xl font-bold text-navy">
            Set New Password
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter your new password below
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <ResetPassword />
        </div>
      </div>
    </Layout>
  );
};

export default ResetPasswordPage; 