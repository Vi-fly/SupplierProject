import ForgotPassword from '@/components/auth/ForgotPassword';
import Layout from '@/components/layout/Layout';

const ForgotPasswordPage = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="text-center text-3xl font-bold text-navy">
            Reset Your Password
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you instructions to reset your password
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <ForgotPassword />
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPasswordPage; 