import { useState } from 'react';
import { 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  Shield, 
  BarChart3, 
  Users, 
  ArrowRight, 
  Menu,
  X
} from 'lucide-react';
import logo from '../assets/complaint-logo.png'
import { Link } from 'react-router-dom';
// import { AuthService } from '../core/services/auth.service';

// Navigation Component
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <img src={logo} alt="ResolveFlow Logo" className="w-10 h-10" />
            <span className="text-xl font-bold bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              ResolveFlow
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-indigo-600 transition-colors">Features</a>
            <Link 
              to="/login" 
              className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all hover:scale-105 inline-block"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <a href="#features" className="block text-gray-600 hover:text-indigo-600">Features</a>
            <Link 
              to="/login" 
              className="w-full px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all hover:scale-105 inline-block"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, color }) => (
  <div className="group p-8 bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 hover:-translate-y-1">
    <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
      <Icon className="w-7 h-7 text-white" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

// Stat Card Component
const StatCard = ({ number, label }) => (
  <div className="text-center">
    <div className="text-4xl md:text-5xl font-bold bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent mb-2">
      {number}
    </div>
    <div className="text-gray-600 font-medium">{label}</div>
  </div>
);

export default function LandingPage() {
  // useEffect(() => {
  //   async function testAuth() {
  //     try {
  //       const response = await AuthService.test();
  //       console.log('Test API Response:', response);
  //     } catch (error) {
  //       console.error('API Test Error:', error);
  //     }
  //   }
  //   testAuth();
  // }, [])
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in">
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Turn Complaints into{' '}
                <span className="bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  Opportunities
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                Streamline your complaint management process with intelligent tracking, 
                automated workflows, and real-time analytics. Resolve issues faster, 
                every time.
              </p>

              <div className="flex flex-wrap gap-4">
                <button className="group px-8 py-4 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-all hover:scale-105 flex items-center gap-2">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-full font-semibold hover:border-indigo-600 hover:text-indigo-600 transition-all">
                  View Demo
                </button>
              </div>

            </div>

            {/* Right Content - Animated Dashboard Preview */}
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-violet-500 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 transform hover:scale-[1.02] transition-transform duration-500">
                {/* Mock Dashboard UI */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="text-sm text-gray-400">Dashboard Preview</div>
                  </div>
                  
                  {/* Mock Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'New', value: '12', color: 'bg-blue-100 text-blue-700' },
                      { label: 'In Progress', value: '8', color: 'bg-yellow-100 text-yellow-700' },
                      { label: 'Resolved', value: '156', color: 'bg-green-100 text-green-700' }
                    ].map((stat) => (
                      <div key={stat.label} className={`p-4 rounded-xl ${stat.color} text-center`}>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-xs font-medium opacity-80">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Mock Complaint List */}
                  <div className="space-y-3 mt-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <div className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                          Resolved
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard number="98%" label="Resolution Rate" />
            <StatCard number="< 2h" label="Avg Response Time" />
            <StatCard number="50K+" label="Complaints Handled" />
            <StatCard number="4.9/5" label="User Satisfaction" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Complaints
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From registration to resolution, our platform handles every step 
              of the complaint lifecycle with precision and ease.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={MessageSquare}
              title="Easy Registration"
              description="Intuitive forms for customers to submit complaints with attachments and categorization."
              color="bg-blue-500"
            />
            <FeatureCard 
              icon={Clock}
              title="Real-time Tracking"
              description="Live status updates and timeline view for both customers and support teams."
              color="bg-violet-500"
            />
            <FeatureCard 
              icon={CheckCircle}
              title="Smart Routing"
              description="AI-powered assignment to the right department based on complaint category."
              color="bg-green-500"
            />
            <FeatureCard 
              icon={BarChart3}
              title="Analytics Dashboard"
              description="Comprehensive reports on resolution times, trends, and team performance."
              color="bg-orange-500"
            />
            <FeatureCard 
              icon={Shield}
              title="Secure & Compliant"
              description="Enterprise-grade security with GDPR compliance and data encryption."
              color="bg-red-500"
            />
            <FeatureCard 
              icon={Users}
              title="Team Collaboration"
              description="Internal notes, mentions, and collaborative tools for faster resolution."
              color="bg-indigo-500"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-indigo-600 to-violet-600 p-12 md:p-20 text-center">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
            
            <h2 className="relative text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Customer Experience?
            </h2>
            <p className="relative text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
              Join thousands of companies that have streamlined their complaint 
              management and improved customer satisfaction.
            </p>
            <div className="relative flex flex-wrap justify-center gap-4">
              <button className="px-8 py-4 bg-white text-indigo-600 rounded-full font-bold hover:bg-gray-100 transition-all hover:scale-105">
                Get Started Free
              </button>
              <button className="px-8 py-4 border-2 border-white text-white rounded-full font-bold hover:bg-white/10 transition-all">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="ResolveFlow Logo" className="w-8 h-8" />
              <span className="text-xl font-bold text-white">ResolveFlow</span>
            </div>
            <p className="max-w-sm">
              Modern complaint management system designed to help businesses 
              turn customer feedback into actionable improvements.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-sm">
          © 2026 ResolveFlow. All rights reserved.
        </div>
      </footer>
    </div>
  );
}