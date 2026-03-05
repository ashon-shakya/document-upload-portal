import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import apiProcessor from '../../api/apiProcessor';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            setLoading(true);
            setError('');

            await apiProcessor.post('/auth/signup', {
                fullName: formData.fullName,
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            setSuccess('Account created successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);

        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred during registration. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex flex-col items-center pb-12">
            {/* Header Text */}
            <div className="text-center mb-8">
                <p className="text-sm text-gray-text mb-2 font-medium">Join to upload documents</p>
                <h1 className="text-[28px] font-bold text-dark-text mb-2">Create an account</h1>
                <p className="text-sm text-gray-text">Enter your details to register for the portal</p>
            </div>

            {/* Signup Box */}
            <div className="w-full max-w-[440px] bg-white p-8 rounded-2xl border border-gray-200">
                <form className="space-y-6" onSubmit={handleSignup}>
                    {/* Status Messages */}
                    {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100 text-center">{error}</div>}
                    {success && <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-200 text-center">{success}</div>}

                    {/* Full Name */}
                    <div>
                        <label className="block text-[13px] font-bold text-dark-text mb-2">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User size={18} className="text-gray-400" strokeWidth={1.5} />
                            </div>
                            <input
                                type="text"
                                name="fullName"
                                required
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className="w-full pl-[42px] pr-4 py-3 text-sm text-dark-text placeholder:text-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-colors"
                            />
                        </div>
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block text-[13px] font-bold text-dark-text mb-2">Username</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User size={18} className="text-gray-400" strokeWidth={1.5} />
                            </div>
                            <input
                                type="text"
                                name="username"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Choose a username"
                                className="w-full pl-[42px] pr-4 py-3 text-sm text-dark-text placeholder:text-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-colors"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-[13px] font-bold text-dark-text mb-2">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail size={18} className="text-gray-400" strokeWidth={1.5} />
                            </div>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email address"
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
                                type="password"
                                name="password"
                                required
                                minLength={6}
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                className="w-full pl-[42px] pr-4 py-3 text-sm text-dark-text placeholder:text-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-colors"
                            />
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-[13px] font-bold text-dark-text mb-2">Confirm Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock size={18} className="text-gray-400" strokeWidth={1.5} />
                            </div>
                            <input
                                type="password"
                                name="confirmPassword"
                                required
                                minLength={6}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                className="w-full pl-[42px] pr-4 py-3 text-sm text-dark-text placeholder:text-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-colors"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        disabled={loading || !!success}
                        type="submit"
                        className="w-full flex justify-center items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold py-3.5 rounded-lg transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
                        {loading && <Loader2 size={18} className="animate-spin" />}
                        {loading ? 'Signing up...' : 'Sign up'}
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
                        <Link to="/login" className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:text-brand-dark transition-colors">
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
                Already have an account?{' '}
                <Link to="/login" className="text-brand font-bold hover:text-brand-dark">
                    Sign in
                </Link>
            </p>
        </div>
    );
};

export default Signup;
