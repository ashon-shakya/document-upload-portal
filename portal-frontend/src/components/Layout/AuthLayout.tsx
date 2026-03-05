import { Outlet } from 'react-router-dom';
import { Fingerprint, Mail, Clock, Twitter, Linkedin, Facebook, Cloud } from 'lucide-react';
import logoLight from '../../assets/logo-light.svg';

const AuthLayout = () => {
    return (
        <div className="min-h-screen flex flex-col font-sans bg-white">
            {/* Header */}
            <div className="flex justify-center pt-12 pb-6">
                <div className="flex flex-col items-center">
                    <div className="flex items-center">
                        <img src={logoLight} alt="truuth logo" className="h-10" />
                    </div>
                    <div className="text-[10px] tracking-[0.2em] text-gray-text font-semibold uppercase mt-1">
                        User Portal
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 w-full flex flex-col items-center px-4">
                <Outlet />
            </div>

            {/* Info Section */}
            <div className="w-full bg-[#faf5f9] py-20 px-4 mt-20">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* MFA Card */}
                    <div className="bg-white p-10 rounded-3xl shadow-sm border border-pink-50/50">
                        <div className="w-12 h-12 bg-[#f4e8ff] rounded-full flex items-center justify-center text-brand mb-6">
                            <Fingerprint size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-dark-text mb-3">How the BioPass MFA Works?</h2>
                        <p className="text-sm text-gray-text mb-8 leading-relaxed">
                            Our biometric verification process is designed to be simple, secure, and fast
                        </p>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">1</div>
                                <div>
                                    <h3 className="font-bold text-dark-text text-sm mb-1">Scan the QR Code</h3>
                                    <p className="text-xs text-gray-text leading-relaxed">Scan the QR code shown on the screen (if done through desktop/laptop)</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">2</div>
                                <div>
                                    <h3 className="font-bold text-dark-text text-sm mb-1">Capture</h3>
                                    <p className="text-xs text-gray-text leading-relaxed">Allow camera access and follow on-screen instructions for facial capture</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">3</div>
                                <div>
                                    <h3 className="font-bold text-dark-text text-sm mb-1">Verify</h3>
                                    <p className="text-xs text-gray-text leading-relaxed">Receive instant confirmation once your identity has been successfully verified</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Help Card */}
                    <div className="bg-white p-10 rounded-3xl shadow-sm border border-pink-50/50 flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-[#f4e8ff] rounded-full flex items-center justify-center text-brand mb-6 mt-6">
                            <Mail size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-dark-text mb-3">Need Additional Help?</h2>
                        <p className="text-sm text-gray-text mb-10 leading-relaxed max-w-xs mx-auto">
                            Our support team is ready to assist you with any questions or concerns
                        </p>

                        <h3 className="font-bold text-dark-text mb-2 text-[15px]">Email Support</h3>
                        <p className="text-xs text-gray-text mb-6">Get detailed assistance via email from our dedicated support team</p>

                        <a href="mailto:support@portal.com" className="text-brand font-bold text-lg hover:text-brand-dark mb-10">
                            support@portal.com
                        </a>

                        <div className="flex items-center gap-2 text-xs text-gray-text mt-auto">
                            <Clock size={14} /> Response within 24 hours
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="w-full bg-[#20202e] text-white pt-16 pb-8 px-8">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <img src={logoLight} alt="truuth logo" className="h-8 filter brightness-0 invert" />
                            <span className="text-sm font-semibold text-gray-300">User Portal</span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed mb-6 pr-4">
                            Secure, compliant, and user-friendly application management platform.
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Twitter size={14} className="text-gray-300" />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Linkedin size={14} className="text-gray-300" />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Facebook size={14} className="text-gray-300" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-sm mb-4">Product</h4>
                        <ul className="space-y-3 text-xs text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Updates</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-sm mb-4">Resources</h4>
                        <ul className="space-y-3 text-xs text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Status Page</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-sm mb-4">Company</h4>
                        <ul className="space-y-3 text-xs text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">
                    <div>© 2024 User Portal. All rights reserved.</div>
                    <div className="flex items-center gap-2">
                        Powered by enterprise-grade security
                        <div className="bg-white/10 p-1.5 rounded">
                            <Cloud size={12} className="text-brand-light" fill="currentColor" />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AuthLayout;
