import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-bg px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-border">
                <div className="text-center mb-8">
                    <div className="text-3xl font-bold tracking-tighter text-dark-text flex items-center justify-center mb-2">
                        tr<span className="text-brand">uu</span>th
                    </div>
                    <h1 className="text-2xl font-bold text-dark-text mt-4">Welcome back</h1>
                    <p className="text-sm text-gray-text mt-1">Please enter your details to sign in.</p>
                </div>

                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label className="block text-sm font-medium text-dark-text mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 border border-gray-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-dark-text">Password</label>
                            <a href="#" className="text-xs font-semibold text-brand hover:text-brand-dark">Forgot password?</a>
                        </div>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-2 border border-gray-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                        />
                    </div>

                    <button className="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-3 rounded-xl transition-colors mt-6">
                        Sign in
                    </button>
                </form>

                <p className="text-center text-sm text-gray-text mt-6">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-brand font-semibold hover:text-brand-dark">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
