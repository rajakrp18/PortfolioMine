import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowRight, CheckCircle, ShieldCheck, Truck, Droplets, Sparkles, Star } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useCart } from '../../context/CartContext';
import { currency } from '../../components/UI';

const CATEGORY_ICONS = { Milk:'🥛', Ghee:'🫙', Paneer:'🧀', Yogurt:'🍦', Butter:'🧈', Cream:'🥣', 'Ice Cream':'🍨', Cheese:'🧀' };

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const { items, addItem }      = useCart();
  const navigate                = useNavigate();

  useEffect(() => {
    api.get('/products')
       .then(res => setProducts(res.data.slice(0, 8)))
       .catch(() => toast.error('Failed to load products'))
       .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (product) => {
    addItem(product, 1);
    toast.success(`${product.name} added to cart`, {
      icon: '✨',
      style: { borderRadius: '12px', background: '#333', color: '#fff' }
    });
  };

  const cartItemsCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-emerald-200">
      
      {/* ── Navbar ── */}
      <nav className="absolute top-0 w-full z-50 border-b border-white/10 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-lg shadow-lg shadow-emerald-900/20">🥛</div>
            <span className="font-extrabold text-2xl tracking-tight text-white">DairyFresh</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#products" className="text-sm font-semibold text-emerald-50 hover:text-emerald-300 hidden md:block transition-colors">Premium Catalog</a>
            <a href="#about" className="text-sm font-semibold text-emerald-50 hover:text-emerald-300 hidden md:block transition-colors">Our Promise</a>
            <Link to="/contact" className="text-sm font-semibold text-emerald-50 hover:text-emerald-300 hidden md:block transition-colors">Contact Us</Link>
            <Link to="/login" className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300 hover:opacity-80 transition-opacity">Sign In</Link>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/shop/cart')}
              className="relative p-2.5 glass-panel-dark rounded-full text-emerald-100 hover:bg-white/10 transition border border-white/10"
            >
              <ShoppingCart size={20} strokeWidth={2.5} />
              {cartItemsCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                >
                  {cartItemsCount}
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>
      </nav>

      {/* ── Hero Section (Rich Gradients & Abstract Shapes) ── */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#022c22]">
        {/* Abstract Background Elements */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial="hidden" animate="visible" variants={staggerContainer}
            className="lg:w-[55%] text-center lg:text-left"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel-dark text-emerald-300 text-xs font-bold mb-8 uppercase tracking-widest border border-emerald-500/30">
              <Sparkles size={14} className="text-emerald-400" /> State-of-the-art Dairy
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
              Pure milk.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                Zero compromise.
              </span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-emerald-100/80 mb-10 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
              Experience artisanal dairy products sourced daily from heritage farms. Delivered chilled to your doorstep before the sun rises.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a href="#products" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-2xl hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2">
                Explore Catalog <ArrowRight size={18} />
              </a>
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 glass-panel-dark text-white font-bold rounded-2xl hover:bg-white/10 transition-all text-center border border-white/20">
                Partner With Us
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-[45%] relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-emerald-900/50 border border-white/10 aspect-[4/5]">
              <img 
                src="https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Fresh Milk" 
                className="object-cover w-full h-full scale-105 hover:scale-100 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#022c22] via-transparent to-transparent opacity-80"></div>
            </div>
            
            {/* Floating Glass Badge */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -bottom-8 -left-8 glass-panel-dark p-5 rounded-2xl shadow-2xl z-20 flex items-center gap-4 w-64 border border-white/20"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white shadow-lg">
                <CheckCircle size={28} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Lab Tested</p>
                <div className="flex gap-1 mt-1 text-emerald-400">
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 bg-white" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="grid md:grid-cols-3 gap-12"
          >
            {[
              { icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', title: 'Uncompromised Quality', desc: 'Every drop undergoes 24 strict quality parameters before reaching you.' },
              { icon: Droplets, color: 'text-teal-600', bg: 'bg-teal-50', title: 'Farm to Glass in 24h', desc: 'Sourced daily and delivered at peak freshness. No old stock, ever.' },
              { icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50', title: 'Cold Chain Delivery', desc: 'Our smart logistics maintain exactly 4°C from farm to your refrigerator.' }
            ].map((f, i) => (
              <motion.div key={i} variants={fadeInUp} className="text-center group">
                <div className={`w-20 h-20 mx-auto ${f.bg} rounded-3xl flex items-center justify-center ${f.color} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                  <f.icon size={36} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-24 bg-[#f8fafc]" id="products">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-emerald-600 tracking-widest uppercase mb-2">Our Collection</h2>
            <h3 className="text-4xl font-extrabold text-gray-900">Premium Dairy Selection</h3>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {products.map(p => (
                <motion.div 
                  key={p.id} variants={fadeInUp}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-900/5 overflow-hidden transition-all duration-300 group"
                >
                  <div className="h-48 bg-gradient-to-br from-gray-50 to-emerald-50/50 flex items-center justify-center text-7xl group-hover:scale-110 transition duration-500 relative">
                    {CATEGORY_ICONS[p.category] || '📦'}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <div className="text-[10px] font-bold text-emerald-600 mb-2 tracking-widest uppercase">{p.category}</div>
                    <h3 className="font-extrabold text-gray-900 mb-1 text-lg truncate">{p.name}</h3>
                    <p className="text-xs text-gray-500 mb-5 font-medium line-clamp-2">{p.description}</p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div>
                        <p className="text-xs text-gray-400 font-medium mb-0.5">Per {p.unit}</p>
                        <p className="text-xl font-extrabold text-gray-900">{currency(p.price)}</p>
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleAddToCart(p)}
                        className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center hover:bg-emerald-600 shadow-lg transition-colors"
                      >
                        <ShoppingCart size={20} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
          
          <div className="text-center mt-16">
            <Link to="/login" className="inline-flex items-center gap-2 font-bold text-emerald-600 hover:text-emerald-700 hover:gap-3 transition-all">
              View Complete Catalog <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="footer" className="bg-[#0f172a] text-gray-400 py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-lg">🥛</div>
              <span className="font-extrabold text-2xl tracking-tight text-white">DairyFresh</span>
            </div>
            <p className="text-sm max-w-sm mb-6 leading-relaxed">Redefining the dairy supply chain. Connecting artisanal farmers directly with consumers through state-of-the-art cold-chain logistics.</p>
            <p className="text-sm max-w-sm font-bold text-emerald-300">Contact Us: hello@dairyfresh.com</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">Explore</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><a href="#products" className="hover:text-emerald-400 transition-colors">Premium Catalog</a></li>
              <li><Link to="/login" className="hover:text-emerald-400 transition-colors">Wholesale Portal</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">Company</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><a href="#about" className="hover:text-emerald-400 transition-colors">Our Promise</a></li>
              <li><Link to="/register" className="hover:text-emerald-400 transition-colors">Partner with Us</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
