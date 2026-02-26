import {
  FaCloudUploadAlt,
  FaLock,
  FaBell,
  FaFileInvoiceDollar,
  FaMobileAlt,
  FaUserShield,
} from "react-icons/fa";

const features = [
  {
    title: "Digital Storage",
    description:
      "Keep all your contracts in one secure place. Accessible anytime, anywhere.",
    icon: <FaCloudUploadAlt className="text-3xl text-blue-600" />,
  },
  {
    title: "Military-Grade Security",
    description:
      "Your data is encrypted and protected with the highest industry standards.",
    icon: <FaLock className="text-3xl text-blue-600" />,
  },
  {
    title: "Smart Notifications",
    description:
      "Get alerts before contracts expire. Never miss a renewal date again.",
    icon: <FaBell className="text-3xl text-blue-600" />,
  },
  {
    title: "Payment Tracking",
    description:
      "Monitor 'In-Kind' or 'Cash' payments easily with our integrated ledger.",
    icon: <FaFileInvoiceDollar className="text-3xl text-blue-600" />,
  },
  {
    title: "Mobile Friendly",
    description:
      "Manage your farm or business from the field with our fully responsive interface.",
    icon: <FaMobileAlt className="text-3xl text-blue-600" />,
  },
  {
    title: "Role Management",
    description:
      "Assign specific employees to contracts and control access levels.",
    icon: <FaUserShield className="text-3xl text-blue-600" />,
  },
];

const FeaturedContracts = () => {
  return (
    <section className="bg-white py-24 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header de la sección */}
        <div className="text-center mb-16">
          <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-3">
            Platform Benefits
          </h2>
          <p className="text-4xl font-black text-slate-900">
            Everything you need to manage <br />
            <span className="text-slate-400">your agro-business.</span>
          </p>
        </div>

        {/* Grid de Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 rounded-[32px] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group"
            >
              <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedContracts;
