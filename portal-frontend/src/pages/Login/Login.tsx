import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import apiProcessor from '../../api/apiProcessor';

const Login = () => {
    const navigate = useNavigate();

    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        const storedIdentifier = localStorage.getItem('rememberedIdentifier');
        if (storedIdentifier) {
            setIdentifier(storedIdentifier);
            setRememberMe(true);
        }
    }, []);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!identifier || !password) {
            setError('Please fill in both fields');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const response = await apiProcessor.post('/auth/login', {
                identifier,
                password,
                rememberMe
            });

            if (rememberMe) {
                localStorage.setItem('rememberedIdentifier', identifier);
            } else {
                localStorage.removeItem('rememberedIdentifier');
            }

            // If login succeeds, the browser stores the HTTP-only cookie automatically
            navigate('/document-upload');

        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid credentials or network issue. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex flex-col items-center pb-12">
            {/* Header Text */}
            <div className="text-center mb-8">
                <p className="text-sm text-gray-text mb-2 font-medium">Sign in to upload documents</p>
                <h1 className="text-[28px] font-bold text-dark-text mb-2">Sign in to your account</h1>
                <p className="text-sm text-gray-text">Enter your credentials to access the portal</p>
            </div>

            {/* Login Box */}
            <div className="w-full max-w-[440px] bg-white p-8 rounded-2xl border border-gray-200">
                <form className="space-y-6" onSubmit={handleLogin}>
                    {/* Error Message Section */}
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100 text-center">
                            {error}
                        </div>
                    )}

                    {/* Username or Email */}
                    <div>
                        <label className="block text-[13px] font-bold text-dark-text mb-2">Username or Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User size={18} className="text-gray-400" strokeWidth={1.5} />
                            </div>
                            <input
                                type="text"
                                required
                                value={identifier}
                                onChange={(e) => { setIdentifier(e.target.value); setError(''); }}
                                placeholder="Enter your username or email"
                                className="w-full pl-[42px] pr-4 py-3 text-sm text-dark-text placeholder:text-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-colors"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-[13px] font-bold text-dark-text mb-2">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock size={18} className="text-gray-400" strokeWidth={1.5} />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                placeholder="Enter your password"
                                className="w-full pl-[42px] pr-12 py-3 text-sm text-dark-text placeholder:text-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-dark-text transition-colors">
                                {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                            </button>
                        </div>
                    </div>

                    {/* Options */}
                    <div className="flex items-center justify-between pt-1 pb-1">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 border-gray-300 rounded text-brand focus:ring-brand cursor-pointer accent-brand"
                            />
                            <span className="text-xs font-medium text-gray-500 group-hover:text-dark-text transition-colors">Remember me</span>
                        </label>
                        <Link to="#" className="text-xs font-bold text-brand hover:text-brand-dark transition-colors">
                            Forgot password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold py-3.5 rounded-lg transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
                        {loading && <Loader2 size={18} className="animate-spin" />}
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>

                    {/* Divider */}
                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-white px-4 text-xs font-medium text-gray-400">Alternative access</span>
                        </div>
                    </div>

                    {/* Submitter */}
                    <div className="text-center">
                        <p className="text-xs font-medium text-gray-500 mb-2.5">Submitting documents on behalf of an applicant?</p>
                        <Link to="#" className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:text-brand-dark transition-colors">
                            Sign in as a submitter <ArrowRight size={14} strokeWidth={2.5} />
                        </Link>
                    </div>
                </form>
            </div>

            {/* Secure connection text */}
            <div className="flex items-center justify-center gap-2 mt-8 text-xs text-[#b88cff] font-medium w-[440px]">
                <ShieldCheck size={16} strokeWidth={2} /> Your connection is secure and encrypted
            </div>

            <p className="text-center text-sm text-gray-text mt-8">
                Don't have an account?{' '}
                <Link to="/signup" className="text-brand font-bold hover:text-brand-dark">
                    Sign up
                </Link>
            </p>
        </div>
    );
};

export default Login;
