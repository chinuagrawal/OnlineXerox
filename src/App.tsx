import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  CloudUpload, 
  ReceiptText, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  Settings2, 
  BookOpen, 
  Minus, 
  Plus, 
  ShieldCheck, 
  Lock, 
  Truck, 
  CreditCard, 
  Wallet, 
  Building2, 
  ChevronRight, 
  Printer, 
  Package, 
  Search, 
  Bell, 
  BarChart3, 
  Settings, 
  Eye, 
  Wifi, 
  Droplets, 
  Armchair,
  X
} from 'lucide-react';

// --- Types ---
type View = 'landing' | 'upload' | 'checkout' | 'status' | 'admin';

// --- Components ---

const Header = ({ setView, currentView }: { setView: (v: View) => void, currentView: View }) => (
  <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
    <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors lg:hidden">
          <Menu className="w-5 h-5 text-slate-500" />
        </button>
        <span 
          className="text-2xl font-black text-slate-900 tracking-tighter cursor-pointer"
          onClick={() => setView('landing')}
        >
          The Precision Atelier
        </span>
      </div>
      <nav className="hidden lg:flex items-center gap-8">
        {[
          { id: 'landing', label: 'Home' },
          { id: 'upload', label: 'Upload' },
          { id: 'status', label: 'Orders' },
          { id: 'admin', label: 'Admin' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as View)}
            className={`text-sm font-semibold transition-all ${
              currentView === item.id 
                ? 'text-primary border-b-2 border-primary pb-1' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
          alt="Profile" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  </header>
);

const Footer = () => (
  <footer className="bg-slate-50 border-t border-slate-200 py-12 px-6">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="text-center md:text-left">
        <span className="text-lg font-bold text-slate-900">The Precision Atelier</span>
        <p className="text-sm text-slate-500 mt-1">© 2024 The Precision Atelier. Crafted for Clarity.</p>
      </div>
      <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-500">
        <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
        <a href="#" className="hover:text-slate-900 transition-colors">Help Center</a>
        <a href="#" className="hover:text-slate-900 transition-colors">Contact Us</a>
      </div>
    </div>
  </footer>
);

const MobileNav = ({ setView, currentView }: { setView: (v: View) => void, currentView: View }) => (
  <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-lg border-t border-slate-200/50 px-6 py-3 z-50 flex justify-around items-center rounded-t-3xl shadow-2xl">
    {[
      { id: 'landing', label: 'Home', icon: Menu },
      { id: 'upload', label: 'Upload', icon: CloudUpload },
      { id: 'status', label: 'Orders', icon: ReceiptText },
      { id: 'admin', label: 'Admin', icon: Settings }
    ].map((item) => (
      <button
        key={item.id}
        onClick={() => setView(item.id as View)}
        className={`flex flex-col items-center gap-1 transition-all ${
          currentView === item.id ? 'text-primary' : 'text-slate-400'
        }`}
      >
        <item.icon className="w-6 h-6" />
        <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
      </button>
    ))}
  </nav>
);

// --- Views ---

const LandingView = ({ onStart }: { onStart: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="pt-24 pb-32"
  >
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4 block">Next-Generation Printing</span>
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]">
            Print Your <span className="text-primary">Documents</span> Online – Fast & Easy
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-xl leading-relaxed">
            Experience the tactile precision of high-end print with the fluid efficiency of modern software. Upload, customize, and receive.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onStart}
              className="signature-gradient text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <CloudUpload className="w-5 h-5" />
              Upload & Print Now
            </button>
            <button className="bg-slate-100 text-slate-900 font-bold px-8 py-4 rounded-xl hover:bg-slate-200 transition-colors">
              View Pricing
            </button>
          </div>
        </div>
        <div className="relative group">
          <div className="bg-white rounded-2xl ambient-shadow p-6 border border-slate-100">
            <div className="bg-slate-50 rounded-xl overflow-hidden aspect-[4/3] flex flex-col">
              <div className="p-4 flex items-center justify-between border-b border-slate-200/50">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Atelier Editor v2.4</span>
              </div>
              <div className="flex-1 p-8 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 m-4 rounded-lg">
                <ReceiptText className="w-12 h-12 text-primary/20 mb-4" />
                <p className="text-sm font-medium text-slate-400">Drag & drop your files here</p>
              </div>
            </div>
          </div>
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl -z-10" />
        </div>
      </div>

      <div className="mb-24">
        <h2 className="text-3xl font-bold text-center mb-16">More than just a printer.</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Wifi, title: 'Fast WiFi', desc: 'Ultra-fast gigabit connection for large assets.' },
            { icon: Droplets, title: 'RO Water', desc: 'Complimentary purified water stations.' },
            { icon: ShieldCheck, title: 'CCTV Security', desc: '24/7 surveillance for your documents.' },
            { icon: Armchair, title: 'Comfort Seating', desc: 'Ergonomic lounge for your wait.' }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-24">
        <h2 className="text-4xl font-extrabold text-center mb-16">Transparent Pricing</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: 'Standard', price: '0.10', features: ['80gsm White Paper', 'High-Res Laser', 'Standard Binding'] },
            { name: 'Professional', price: '0.25', features: ['100gsm Silk Paper', 'Full Color Accuracy', 'Stapling & Punching'], popular: true },
            { name: 'Elite', price: '0.75', features: ['300gsm Cardstock', 'Hardcover Binding', '1-Hr Delivery'] }
          ].map((tier, i) => (
            <div key={i} className={`p-8 rounded-2xl border ${tier.popular ? 'border-primary bg-white ambient-shadow relative' : 'border-slate-200 bg-slate-50'}`}>
              {tier.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 signature-gradient text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-tighter">Most Popular</span>
              )}
              <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 ${tier.popular ? 'text-primary' : 'text-slate-400'}`}>{tier.name}</h3>
              <div className="text-4xl font-black mb-8">${tier.price}<span className="text-sm font-normal text-slate-500">/page</span></div>
              <ul className="space-y-4 mb-10">
                {tier.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-4 rounded-xl font-bold transition-all ${tier.popular ? 'signature-gradient text-white shadow-lg shadow-primary/20' : 'border-2 border-primary text-primary hover:bg-primary/5'}`}>
                Select {tier.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

const UploadView = ({ onNext }: { onNext: () => void }) => {
  const [copies, setCopies] = useState(1);
  const [colorMode, setColorMode] = useState<'color' | 'bw'>('color');
  const [paper, setPaper] = useState<'a4' | 'a3'>('a4');

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="pt-24 pb-32 px-6 max-w-7xl mx-auto grid lg:grid-cols-12 gap-8"
    >
      <div className="lg:col-span-8 space-y-8">
        <section>
          <span className="text-primary font-bold tracking-widest uppercase text-xs mb-2 block">New Project</span>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 mb-4">Precision Printing.</h1>
          <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
            Transform your digital files into physical masterpieces. Our atelier uses high-grade stock and thermal precision.
          </p>
        </section>

        <div className="bg-slate-50 rounded-2xl p-1 border border-slate-200">
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center text-center group hover:border-primary transition-colors cursor-pointer">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <CloudUpload className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Drag and drop your file</h3>
            <p className="text-slate-400 mb-8 max-w-xs">PDF, DOCX, or High-Res JPG (Max 50MB)</p>
            <button className="px-8 py-3 signature-gradient text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all">
              Browse Files
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <Settings2 className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold">Print Configuration</h3>
            </div>
            <div className="space-y-8">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-bold text-sm">Color Mode</p>
                  <p className="text-xs text-slate-400">Full spectrum or monochrome</p>
                </div>
                <div className="flex bg-slate-200 p-1 rounded-full">
                  <button 
                    onClick={() => setColorMode('color')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${colorMode === 'color' ? 'bg-white shadow-sm text-primary' : 'text-slate-500'}`}
                  >
                    Color
                  </button>
                  <button 
                    onClick={() => setColorMode('bw')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${colorMode === 'bw' ? 'bg-white shadow-sm text-primary' : 'text-slate-500'}`}
                  >
                    B&W
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Number of Copies</label>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setCopies(Math.max(1, copies - 1))}
                    className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full hover:bg-slate-200 transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-xl">{copies}</span>
                  <button 
                    onClick={() => setCopies(copies + 1)}
                    className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-full hover:bg-primary-container transition-all shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Paper Dimension</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setPaper('a4')}
                    className={`p-4 rounded-xl border-2 transition-all font-bold ${paper === 'a4' ? 'border-primary bg-primary/5 text-primary' : 'border-transparent bg-slate-50 text-slate-400'}`}
                  >
                    A4 Standard
                  </button>
                  <button 
                    onClick={() => setPaper('a3')}
                    className={`p-4 rounded-xl border-2 transition-all font-bold ${paper === 'a3' ? 'border-primary bg-primary/5 text-primary' : 'border-transparent bg-slate-50 text-slate-400'}`}
                  >
                    A3 Premium
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <BookOpen className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold">Page Scope</h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Selection Type</label>
                <select className="w-full p-4 bg-slate-50 border-none rounded-xl font-bold text-sm focus:ring-2 focus:ring-primary/20">
                  <option>Print All Pages</option>
                  <option>Current Page Only</option>
                  <option>Custom Selection</option>
                </select>
              </div>
              <div className="p-4 bg-primary/5 rounded-xl border-l-4 border-primary">
                <p className="text-xs text-primary font-bold mb-1 uppercase tracking-widest">Quick Note</p>
                <p className="text-sm font-medium text-slate-600 leading-relaxed">Standard 80gsm paper will be used for A4 prints unless otherwise specified.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside className="lg:col-span-4 lg:sticky lg:top-24 h-fit space-y-6">
        <div className="bg-slate-200 p-8 rounded-2xl relative overflow-hidden">
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter z-10 shadow-sm">Live Preview</div>
          <div className="aspect-[3/4] bg-white ambient-shadow rounded-sm mx-auto p-8 flex flex-col gap-4 opacity-40 select-none">
            <div className="h-4 bg-slate-200 w-3/4 rounded" />
            <div className="h-2 bg-slate-100 w-full rounded" />
            <div className="h-2 bg-slate-100 w-full rounded" />
            <div className="h-2 bg-slate-100 w-5/6 rounded" />
            <div className="flex-1 w-full bg-slate-50 rounded-lg flex items-center justify-center">
              <ReceiptText className="w-12 h-12 text-slate-200" />
            </div>
            <div className="h-2 bg-slate-100 w-full rounded" />
          </div>
          <div className="mt-6 flex justify-between items-center text-xs font-bold text-slate-500">
            <span>annual_report_2024.pdf</span>
            <span>12 Pages</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-8">Cost Estimation</h3>
          <div className="space-y-4 mb-10">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-slate-500">A4 Prints (12 pgs x {copies})</span>
              <span className="font-bold">${(2.40 * copies).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-slate-500">Color Surcharge</span>
              <span className="font-bold">${(1.20 * copies).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-slate-500">Service Fee</span>
              <span className="font-bold">$0.50</span>
            </div>
            <div className="pt-6 border-t border-slate-100 flex justify-between items-end">
              <span className="font-bold text-slate-900">Total Estimated</span>
              <span className="text-4xl font-extrabold text-primary">${(2.40 * copies + 1.20 * copies + 0.50).toFixed(2)}</span>
            </div>
          </div>
          <button 
            onClick={onNext}
            className="w-full py-5 signature-gradient text-white font-bold rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            Confirm & Send to Printer
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </aside>
    </motion.div>
  );
};

const CheckoutView = ({ onNext }: { onNext: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="pt-24 pb-32 px-6 max-w-6xl mx-auto grid lg:grid-cols-12 gap-12"
  >
    <div className="lg:col-span-7 space-y-8">
      <section>
        <p className="text-primary font-bold uppercase tracking-widest text-[10px] mb-2">Secure Checkout</p>
        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-6">Complete your order</h2>
        <div className="flex items-center gap-4 p-4 bg-red-50 text-red-800 rounded-2xl border border-red-100">
          <HelpCircle className="w-5 h-5" />
          <p className="text-sm font-medium">Payment verification failed. Please try a different method.</p>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-bold">Select Payment Method</h3>
        <div className="space-y-3">
          {[
            { id: 'upi', title: 'UPI Transfer', desc: 'Google Pay, PhonePe, Paytm', icon: Wallet },
            { id: 'card', title: 'Credit / Debit Cards', desc: 'Visa, Mastercard, AMEX', icon: CreditCard, active: true },
            { id: 'net', title: 'Net Banking', desc: 'All major Indian banks supported', icon: Building2 }
          ].map((method) => (
            <label key={method.id} className="group flex items-center justify-between p-5 bg-white rounded-2xl cursor-pointer border-2 border-transparent hover:border-primary/20 transition-all ambient-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center">
                  <method.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{method.title}</p>
                  <p className="text-xs text-slate-400 font-medium">{method.desc}</p>
                </div>
              </div>
              <input type="radio" name="payment" defaultChecked={method.active} className="w-5 h-5 text-primary focus:ring-primary" />
            </label>
          ))}
        </div>
      </section>

      <div className="p-8 bg-slate-50 rounded-2xl space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Card Number</label>
            <input className="w-full p-4 bg-white border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-mono" placeholder="0000 0000 0000 0000" type="text" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Expiry Date</label>
            <input className="w-full p-4 bg-white border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all" placeholder="MM / YY" type="text" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">CVV</label>
            <input className="w-full p-4 bg-white border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all" placeholder="***" type="password" />
          </div>
        </div>
      </div>
    </div>

    <div className="lg:col-span-5">
      <aside className="sticky top-32 space-y-6">
        <div className="bg-white p-8 rounded-2xl ambient-shadow border border-slate-100">
          <h3 className="text-xl font-bold mb-8">Order Summary</h3>
          <div className="flex items-start gap-4 mb-8">
            <div className="w-16 h-20 bg-slate-50 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=200&q=80" 
                alt="Preview" 
                className="w-full h-full object-cover opacity-80"
              />
            </div>
            <div className="flex-grow">
              <p className="font-bold text-slate-900 leading-tight">Brand_Lookbook_Final.pdf</p>
              <p className="text-sm text-slate-500 mt-1">A4 • Matte Finish • 120 GSM</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm font-bold text-slate-400">Qty: 25 Units</span>
                <span className="font-bold text-slate-900">₹2,450.00</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-8 border-t border-slate-100">
            <div className="flex justify-between text-sm font-medium text-slate-500">
              <span>Subtotal</span>
              <span>₹2,450.00</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-slate-500">
              <span>Shipping & Handling</span>
              <span className="text-emerald-600">Free</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-slate-500">
              <span>GST (18%)</span>
              <span>₹441.00</span>
            </div>
            <div className="flex justify-between items-center pt-6 mt-2">
              <span className="font-bold text-lg">Total Amount</span>
              <span className="text-3xl font-black text-primary">₹2,891.00</span>
            </div>
          </div>

          <button 
            onClick={onNext}
            className="w-full mt-10 signature-gradient text-white font-bold py-5 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            Pay ₹2,891.00
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-center text-[10px] text-slate-400 mt-6 uppercase tracking-[0.2em] font-bold">
            Encrypted & Secure Payment
          </p>
        </div>

        <div className="flex justify-around items-center px-4 opacity-30">
          <ShieldCheck className="w-8 h-8" />
          <Lock className="w-8 h-8" />
          <Truck className="w-8 h-8" />
        </div>
      </aside>
    </div>
  </motion.div>
);

const StatusView = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.05 }}
    className="pt-28 pb-32 px-6 max-w-7xl mx-auto"
  >
    <div className="mb-12">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">
        <span>Orders</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-900">#ORD-2024-8842</span>
      </div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 mb-2">Printing in progress</h1>
          <p className="text-slate-400 font-medium">Order ID: <span className="font-mono font-bold text-slate-900">#ORD-2024-8842</span> • Placed Oct 24, 2024</p>
        </div>
        <button className="flex items-center gap-2 px-8 py-4 signature-gradient text-white rounded-xl font-bold shadow-xl shadow-primary/20 active:scale-95 transition-all">
          <ReceiptText className="w-5 h-5" />
          Download Receipt
        </button>
      </div>
    </div>

    <div className="grid lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8">
        <div className="bg-white rounded-2xl p-10 shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
            <div className="h-full bg-primary w-[65%]" />
          </div>
          <div className="space-y-16 mt-4">
            {[
              { title: 'Order Received', time: 'Oct 24, 09:12 AM', desc: 'System verified files and technical specifications.', done: true },
              { title: 'File Optimization', time: 'Oct 24, 10:45 AM', desc: 'Colors normalized to CMYK Fogra39 standards.', done: true },
              { title: 'Printing', time: 'In progress since 11:30 AM', desc: 'Documents are on the Heidelberg XL-106 press.', active: true },
              { title: 'Quality Control', time: 'Pending phase', desc: 'Final inspection and premium packaging.', pending: true }
            ].map((step, i) => (
              <div key={i} className="flex gap-8 relative">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all ${
                    step.done ? 'bg-primary text-white' : 
                    step.active ? 'bg-primary-container text-white ring-8 ring-primary/10' : 
                    'bg-slate-100 text-slate-300'
                  }`}>
                    {step.done ? <CheckCircle2 className="w-6 h-6" /> : 
                     step.active ? <Printer className="w-6 h-6 animate-pulse" /> : 
                     <Package className="w-6 h-6" />}
                  </div>
                  {i < 3 && (
                    <div className={`w-0.5 h-20 absolute top-12 left-6 -z-0 ${step.done ? 'bg-primary' : 'bg-slate-100'}`} />
                  )}
                </div>
                <div className={`pb-4 ${step.pending ? 'opacity-40' : 'opacity-100'}`}>
                  {step.active && (
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full mb-3 uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      Current Phase
                    </span>
                  )}
                  <h3 className={`text-xl font-bold ${step.active ? 'text-primary' : 'text-slate-900'}`}>{step.title}</h3>
                  <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{step.time}</p>
                  <p className="text-slate-500 mt-3 max-w-md leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 space-y-6">
        <div className="bg-slate-100 rounded-2xl p-1 overflow-hidden">
          <div className="relative aspect-[3/4] bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
            <img 
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80" 
              alt="Preview" 
              className="w-full h-full object-cover grayscale opacity-80"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur p-5 rounded-xl shadow-xl">
              <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Preview</p>
              <h4 className="font-bold text-slate-900 truncate">Atelier_Lookbook_Final_V4.pdf</h4>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm space-y-6">
          <h4 className="text-lg font-bold">Specifications</h4>
          <div className="space-y-4">
            {[
              { label: 'Paper Stock', value: '240gsm Matte Silk' },
              { label: 'Dimensions', value: 'A4 (210 x 297mm)' },
              { label: 'Quantity', value: '250 Units' },
              { label: 'Binding', value: 'Perfect Bound' }
            ].map((spec, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span className="text-slate-400 font-medium">{spec.label}</span>
                <span className="font-bold text-slate-900">{spec.value}</span>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
            <span className="font-bold text-slate-900">Total Amount</span>
            <span className="text-3xl font-black text-primary">$492.50</span>
          </div>
        </div>

        <div className="bg-primary/5 rounded-2xl p-8 flex items-start gap-5">
          <HelpCircle className="w-8 h-8 text-primary shrink-0" />
          <div>
            <h4 className="font-bold text-primary">Need help?</h4>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">Our concierges are available 24/7 for print adjustments.</p>
            <button className="mt-4 text-primary font-bold text-sm hover:underline">Contact Support</button>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const AdminView = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex min-h-screen bg-slate-50"
  >
    <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col fixed h-full">
      <div className="px-8 py-10">
        <h1 className="text-2xl font-black text-slate-900 tracking-tighter">The Precision Atelier</h1>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {[
          { icon: ReceiptText, label: 'Jobs', active: true },
          { icon: BarChart3, label: 'Analytics' },
          { icon: Settings, label: 'Settings' }
        ].map((item, i) => (
          <button key={i} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all ${
            item.active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-slate-50'
          }`}>
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-6">
        <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4">
          <img 
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
            className="w-10 h-10 rounded-full object-cover" 
            alt="Admin" 
          />
          <div>
            <p className="text-sm font-bold text-slate-900">Admin User</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Production Lead</p>
          </div>
        </div>
      </div>
    </aside>

    <main className="flex-1 lg:ml-72 p-8 lg:p-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Print Queue</h2>
          <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase">12 Active</span>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input className="w-full md:w-64 bg-white border-none rounded-full pl-12 pr-6 py-3 text-sm shadow-sm focus:ring-2 focus:ring-primary/20" placeholder="Search files..." />
          </div>
          <button className="p-3 bg-white rounded-full shadow-sm text-slate-400 hover:text-slate-900 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Workflow Management</p>
              <h3 className="text-4xl font-extrabold tracking-tight">Job Processing</h3>
            </div>
            <div className="flex gap-2">
              {['All Jobs', 'Pending', 'Printed'].map((tab, i) => (
                <button key={i} className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                  i === 0 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-slate-400 hover:bg-slate-100'
                }`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">ID</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">User</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">File Name</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { id: '#PA-7821', user: 'Eleanor Lewis', file: 'brand_identity_v2.pdf', status: 'Pending', color: 'amber' },
                  { id: '#PA-7819', user: 'Marcus Kane', file: 'portrait_gallery_01.jpg', status: 'Printed', color: 'emerald' },
                  { id: '#PA-7815', user: 'Anna Smith', file: 'quarterly_report_final.pdf', status: 'Failed', color: 'red' }
                ].map((job, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6 font-mono text-xs font-bold text-slate-400">{job.id}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                          {job.user.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm font-bold text-slate-900">{job.user}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <ReceiptText className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-slate-600">{job.file}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                        job.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                        job.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                        'bg-red-50 text-red-600'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right space-x-2">
                      <button className="px-4 py-2 bg-primary text-white text-[10px] font-bold rounded-lg hover:shadow-lg active:scale-95 transition-all">Print</button>
                      <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Efficiency</p>
              <p className="text-4xl font-black text-primary">98.4%</p>
            </div>
            <div className="flex items-end gap-1 h-12">
              {[40, 70, 50, 90, 60, 80].map((h, i) => (
                <div key={i} className="w-2 bg-primary/20 rounded-full" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-2xl text-white shadow-2xl shadow-slate-900/20">
            <h4 className="text-lg font-bold mb-6">System Health</h4>
            <div className="space-y-6">
              {[
                { label: 'Press Temperature', value: '184°C', status: 'Optimal' },
                { label: 'Ink Levels (CMYK)', value: '82%', status: 'Good' },
                { label: 'Queue Load', value: 'High', status: 'Managing' }
              ].map((stat, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                    <span className="text-slate-500">{stat.label}</span>
                    <span className="text-emerald-400">{stat.status}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  </motion.div>
);

// --- Main App ---

export default function App() {
  const [view, setView] = useState<View>('landing');

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header setView={setView} currentView={view} />
      
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LandingView onStart={() => setView('upload')} />
            </motion.div>
          )}
          {view === 'upload' && (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <UploadView onNext={() => setView('checkout')} />
            </motion.div>
          )}
          {view === 'checkout' && (
            <motion.div key="checkout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CheckoutView onNext={() => setView('status')} />
            </motion.div>
          )}
          {view === 'status' && (
            <motion.div key="status" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <StatusView />
            </motion.div>
          )}
          {view === 'admin' && (
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AdminView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {view !== 'admin' && <Footer />}
      {view !== 'admin' && <MobileNav setView={setView} currentView={view} />}
    </div>
  );
}
