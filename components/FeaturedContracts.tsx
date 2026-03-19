"use client";
import {
  FaCloudUploadAlt,
  FaLock,
  FaBell,
  FaFileInvoiceDollar,
  FaMobileAlt,
  FaUserShield,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

const features = [
  {
    title: "Digital Contract Storage",
    description:
      "All your agricultural agreements in one secure, searchable place. Access any contract instantly — from the office or the field.",
    icon: <FaCloudUploadAlt className="text-2xl text-blue-600" />,
    detail: "Cloudinary-powered storage",
  },
  {
    title: "Encrypted & Secure",
    description:
      "Every contract and payment record is encrypted and stored securely. Your business data stays private and protected.",
    icon: <FaLock className="text-2xl text-blue-600" />,
    detail: "bcrypt + NextAuth protection",
  },
  {
    title: "Expiration Alerts",
    description:
      "Get automatic email notifications before contracts expire. No more missed renewals or last-minute surprises.",
    icon: <FaBell className="text-2xl text-blue-600" />,
    detail: "Powered by Resend",
  },
  {
    title: "Payment Ledger",
    description:
      "Track In-Kind and Cash payments contract by contract. See what's paid, what's pending, and what's overdue at a glance.",
    icon: <FaFileInvoiceDollar className="text-2xl text-blue-600" />,
    detail: "Cash & in-kind tracking",
  },
  {
    title: "Works on Any Device",
    description:
      "Built mobile-first so you can review contracts, check payment status, or respond to alerts right from the field.",
    icon: <FaMobileAlt className="text-2xl text-blue-600" />,
    detail: "Fully responsive design",
  },
  {
    title: "Role-Based Access",
    description:
      "Admins manage everything. Employees see only what's assigned to them. Keep sensitive data in the right hands.",
    icon: <FaUserShield className="text-2xl text-blue-600" />,
    detail: "Admin & Employee roles",
  },
];

const FeaturedContracts = () => {
  return (
    <section className="bg-white py-24 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-4">
            Platform Features
          </p>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-4">
            Built for how agro-businesses actually work.
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed">
            Every feature in ContractAdvisor comes from a real need: tracking
            payments across multiple contracts, knowing which ones are about to
            expire, and controlling who can see what.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-[28px] border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
            >
              {/* Icon */}
              <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 mb-5 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-500 leading-relaxed text-sm mb-4">
                {feature.description}
              </p>

              {/* Technical detail badge */}
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600">
                <FaCheckCircle className="text-blue-400" />
                {feature.detail}
              </div>
            </div>
          ))}
        </div>

        {/* How it works — horizontal flow */}
        <div className="bg-slate-50 rounded-[40px] p-8 md:p-14 mb-12 border border-slate-100">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-black text-slate-900 mb-2">
              How it works
            </h3>
            <p className="text-slate-500">
              From setup to full control in minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 relative">
            {[
              {
                step: "01",
                title: "Log In",
                desc: "Access with your role — Admin or Employee",
              },
              {
                step: "02",
                title: "Add Contracts",
                desc: "Upload agreements, set dates and payment terms",
              },
              {
                step: "03",
                title: "Assign & Track",
                desc: "Link employees to contracts, monitor payments",
              },
              {
                step: "04",
                title: "Get Alerts",
                desc: "Receive email notifications before expiration",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="relative flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-sm flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
                  {step.step}
                </div>
                <h4 className="font-bold text-slate-800 mb-1">{step.title}</h4>
                <p className="text-sm text-slate-500">{step.desc}</p>
                {i < 3 && (
                  <FaArrowRight className="hidden md:block absolute -right-3 top-3 text-slate-300 text-lg" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-slate-900 rounded-[40px] p-8 md:p-16 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full -mr-32 -mt-32 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-800/10 blur-[80px] rounded-full -ml-20 -mb-20 pointer-events-none" />
          <div className="relative z-10">
            <p className="text-blue-400 font-bold uppercase tracking-widest text-xs mb-4">
              Try it now — no signup needed
            </p>
            <h3 className="text-2xl md:text-4xl font-black text-white mb-4 leading-tight">
              See ContractAdvisor <br className="hidden md:block" />
              in action.
            </h3>
            <p className="text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
              Use the demo accounts at the top of the page to explore role-based
              access, contract management, the payment ledger, and more — in
              real-time.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {[
                "View contracts dashboard",
                "Track payments",
                "Test role permissions",
                "See email alerts",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-300">
                  <FaCheckCircle className="text-blue-400 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedContracts;
