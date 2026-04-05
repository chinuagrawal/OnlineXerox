import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import axios from "axios";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Link,
  Navigate,
} from "react-router-dom";
import { storage, db } from "./firebase.ts";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

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
  X,
} from "lucide-react";

// --- Components ---

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors lg:hidden">
            <Menu className="w-5 h-5 text-slate-500" />
          </button>
          <span
            className="text-2xl font-black text-slate-900 tracking-tighter cursor-pointer"
            onClick={() => navigate("/")}
          >
            Bindal Computers Xerox
          </span>
        </div>
        <nav className="hidden lg:flex items-center gap-8">
          {[
            { id: "/", label: "Home" },
            { id: "/upload", label: "Upload" },
            { id: "/status", label: "Orders" },
            { id: "/admin", label: "Admin" },
          ].map((item) => (
            <Link
              key={item.id}
              to={item.id}
              className={`text-sm font-semibold transition-all ${
                currentPath === item.id
                  ? "text-primary border-b-2 border-primary pb-1"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {item.label}
            </Link>
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
};

const Footer = () => (
  <footer className="bg-slate-50 border-t border-slate-200 py-12 px-6">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="text-center md:text-left">
        <span className="text-lg font-bold text-slate-900">
          Bindal Computers Xerox
        </span>
        <p className="text-sm text-slate-500 mt-1">
          © 2024 Bindal Computers Xerox. Crafted for Clarity.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-500">
        <a href="#" className="hover:text-slate-900 transition-colors">
          Privacy Policy
        </a>
        <a href="#" className="hover:text-slate-900 transition-colors">
          Terms of Service
        </a>
        <a href="#" className="hover:text-slate-900 transition-colors">
          Help Center
        </a>
        <a href="#" className="hover:text-slate-900 transition-colors">
          Contact Us
        </a>
      </div>
    </div>
  </footer>
);

const MobileNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-lg border-t border-slate-200/50 px-6 py-3 z-50 flex justify-around items-center rounded-t-3xl shadow-2xl">
      {[
        { id: "/", label: "Home", icon: Menu },
        { id: "/upload", label: "Upload", icon: CloudUpload },
        { id: "/status", label: "Orders", icon: ReceiptText },
        { id: "/admin", label: "Admin", icon: Settings },
      ].map((item) => (
        <Link
          key={item.id}
          to={item.id}
          className={`flex flex-col items-center gap-1 transition-all ${
            currentPath === item.id ? "text-primary" : "text-slate-400"
          }`}
        >
          <item.icon className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            {item.label}
          </span>
        </Link>
      ))}
    </nav>
  );
};

// --- Views ---

const LandingView = () => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-24 pb-32"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4 block">
              Next-Generation Printing
            </span>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]">
              Print Your <span className="text-primary">Documents</span> Online
              – Fast & Easy
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-xl leading-relaxed">
              Experience the tactile precision of high-end print with the fluid
              efficiency of modern software. Upload, customize, and receive.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/upload")}
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
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Bindal Xerox Editor v2.4
                  </span>
                </div>
                <div className="flex-1 p-8 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 m-4 rounded-lg">
                  <ReceiptText className="w-12 h-12 text-primary/20 mb-4" />
                  <p className="text-sm font-medium text-slate-400">
                    Drag & drop your files here
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl -z-10" />
          </div>
        </div>

        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-16">
            Bindal Computers Xerox - More than just a printer.
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Wifi,
                title: "Fast WiFi",
                desc: "Ultra-fast gigabit connection for large assets.",
              },
              {
                icon: Droplets,
                title: "RO Water",
                desc: "Complimentary purified water stations.",
              },
              {
                icon: ShieldCheck,
                title: "CCTV Security",
                desc: "24/7 surveillance for your documents.",
              },
              {
                icon: Armchair,
                title: "Comfort Seating",
                desc: "Ergonomic lounge for your wait.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-24">
          <h2 className="text-4xl font-extrabold text-center mb-16">
            Transparent Pricing
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Standard",
                price: "0.10",
                features: [
                  "80gsm White Paper",
                  "High-Res Laser",
                  "Standard Binding",
                ],
              },
              {
                name: "Professional",
                price: "0.25",
                features: [
                  "100gsm Silk Paper",
                  "Full Color Accuracy",
                  "Stapling & Punching",
                ],
                popular: true,
              },
              {
                name: "Elite",
                price: "0.75",
                features: [
                  "300gsm Cardstock",
                  "Hardcover Binding",
                  "1-Hr Delivery",
                ],
              },
            ].map((tier, i) => (
              <div
                key={i}
                className={`p-8 rounded-2xl border ${tier.popular ? "border-primary bg-white ambient-shadow relative" : "border-slate-200 bg-slate-50"}`}
              >
                {tier.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 signature-gradient text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-tighter">
                    Most Popular
                  </span>
                )}
                <h3
                  className={`text-xs font-bold uppercase tracking-widest mb-4 ${tier.popular ? "text-primary" : "text-slate-400"}`}
                >
                  {tier.name}
                </h3>
                <div className="text-4xl font-black mb-8">
                  ${tier.price}
                  <span className="text-sm font-normal text-slate-500">
                    /page
                  </span>
                </div>
                <ul className="space-y-4 mb-10">
                  {tier.features.map((f, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-3 text-sm font-medium text-slate-600"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-4 rounded-xl font-bold transition-all ${tier.popular ? "signature-gradient text-white shadow-lg shadow-primary/20" : "border-2 border-primary text-primary hover:bg-primary/5"}`}
                >
                  Select {tier.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const UploadView = ({ onNext }: { onNext: (data: any) => void }) => {
  const [copies, setCopies] = useState(1);
  const [colorMode, setColorMode] = useState<"color" | "bw">("color");
  const [paper, setPaper] = useState<"a4" | "a3">("a4");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    const orderId = `ORD-${uuidv4().slice(0, 8).toUpperCase()}`;
    const storageRef = ref(storage, `prints/${orderId}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.error(error);
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const orderData = {
          orderId,
          fileName: file.name,
          fileUrl: downloadURL,
          copies,
          colorMode,
          paper,
          status: "pending",
          paymentStatus: "pending",
          createdAt: serverTimestamp(),
          amount: (2.4 * copies + 1.2 * copies + 0.5).toFixed(2),
        };

        onNext(orderData);
        setUploading(false);
      },
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="pt-24 pb-32 px-6 max-w-7xl mx-auto grid lg:grid-cols-12 gap-8"
    >
      <div className="lg:col-span-8 space-y-8">
        <section>
          <span className="text-primary font-bold tracking-widest uppercase text-xs mb-2 block">
            New Project
          </span>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Precision Printing.
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
            Transform your digital files into physical masterpieces. Our atelier
            uses high-grade stock and thermal precision.
          </p>
        </section>

        <div className="bg-slate-50 rounded-2xl p-1 border border-slate-200">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            accept=".pdf,.docx,.jpg,.jpeg"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center text-center group hover:border-primary transition-colors cursor-pointer"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <CloudUpload className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">
              {file ? file.name : "Drag and drop your file"}
            </h3>
            <p className="text-slate-400 mb-8 max-w-xs">
              PDF, DOCX, or High-Res JPG (Max 50MB)
            </p>
            {uploading && (
              <div className="w-full max-w-xs bg-slate-100 rounded-full h-2 mb-4">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
            <button className="px-8 py-3 signature-gradient text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all">
              {file ? "Change File" : "Browse Files"}
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
                  <p className="text-xs text-slate-400">
                    Full spectrum or monochrome
                  </p>
                </div>
                <div className="flex bg-slate-200 p-1 rounded-full">
                  <button
                    onClick={() => setColorMode("color")}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${colorMode === "color" ? "bg-white shadow-sm text-primary" : "text-slate-500"}`}
                  >
                    Color
                  </button>
                  <button
                    onClick={() => setColorMode("bw")}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${colorMode === "bw" ? "bg-white shadow-sm text-primary" : "text-slate-500"}`}
                  >
                    B&W
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Number of Copies
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setCopies(Math.max(1, copies - 1))}
                    className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full hover:bg-slate-200 transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-xl">
                    {copies}
                  </span>
                  <button
                    onClick={() => setCopies(copies + 1)}
                    className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-full hover:bg-primary-container transition-all shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Paper Dimension
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaper("a4")}
                    className={`p-4 rounded-xl border-2 transition-all font-bold ${paper === "a4" ? "border-primary bg-primary/5 text-primary" : "border-transparent bg-slate-50 text-slate-400"}`}
                  >
                    A4 Standard
                  </button>
                  <button
                    onClick={() => setPaper("a3")}
                    className={`p-4 rounded-xl border-2 transition-all font-bold ${paper === "a3" ? "border-primary bg-primary/5 text-primary" : "border-transparent bg-slate-50 text-slate-400"}`}
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
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Selection Type
                </label>
                <select className="w-full p-4 bg-slate-50 border-none rounded-xl font-bold text-sm focus:ring-2 focus:ring-primary/20">
                  <option>Print All Pages</option>
                  <option>Current Page Only</option>
                  <option>Custom Selection</option>
                </select>
              </div>
              <div className="p-4 bg-primary/5 rounded-xl border-l-4 border-primary">
                <p className="text-xs text-primary font-bold mb-1 uppercase tracking-widest">
                  Quick Note
                </p>
                <p className="text-sm font-medium text-slate-600 leading-relaxed">
                  Standard 80gsm paper will be used for A4 prints unless
                  otherwise specified.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside className="lg:col-span-4 lg:sticky lg:top-24 h-fit space-y-6">
        <div className="bg-slate-200 p-8 rounded-2xl relative overflow-hidden">
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter z-10 shadow-sm">
            Live Preview
          </div>
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
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-8">
            Cost Estimation
          </h3>
          <div className="space-y-4 mb-10">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-slate-500">
                A4 Prints (12 pgs x {copies})
              </span>
              <span className="font-bold">${(2.4 * copies).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-slate-500">Color Surcharge</span>
              <span className="font-bold">${(1.2 * copies).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-slate-500">Service Fee</span>
              <span className="font-bold">$0.50</span>
            </div>
            <div className="pt-6 border-t border-slate-100 flex justify-between items-end">
              <span className="font-bold text-slate-900">Total Estimated</span>
              <span className="text-4xl font-extrabold text-primary">
                ${(2.4 * copies + 1.2 * copies + 0.5).toFixed(2)}
              </span>
            </div>
          </div>
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`w-full py-5 signature-gradient text-white font-bold rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 ${!file || uploading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {uploading ? "Uploading..." : "Confirm & Send to Printer"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </aside>
    </motion.div>
  );
};

const CheckoutView = ({
  orderData,
  onNext,
}: {
  orderData: any;
  onNext: () => void;
}) => {
  const [paying, setPaying] = useState(false);

  const handlePayment = async () => {
    if (!orderData) return;
    setPaying(true);

    try {
      // Call PhonePe V2 Backend API
      const response = await axios.post(`${BACKEND_URL}/api/pay`, {
        amount: orderData.amount,
        merchantUserId: "USER-" + uuidv4().slice(0, 8),
        orderData: orderData,
      });

      if (response.data.success && response.data.redirectUrl) {
        // Redirect to PhonePe Payment Page
        window.location.href = response.data.redirectUrl;
      } else {
        alert("Payment initiation failed. Please try again.");
        setPaying(false);
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Something went wrong. Please check your connection.");
      setPaying(false);
    }
  };

  if (!orderData)
    return (
      <div className="pt-32 text-center">
        <h2 className="text-2xl font-bold">No order data found</h2>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-primary font-bold underline"
        >
          Go Back
        </button>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="pt-24 pb-32 px-6 max-w-6xl mx-auto grid lg:grid-cols-12 gap-12"
    >
      <div className="lg:col-span-7 space-y-8">
        <section>
          <p className="text-primary font-bold uppercase tracking-widest text-[10px] mb-2">
            Secure Checkout
          </p>
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-6">
            Complete your order
          </h2>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold">Select Payment Method</h3>
          <div className="space-y-3">
            {[
              {
                id: "phonepe",
                title: "PhonePe",
                desc: "Pay via PhonePe UPI or Wallet",
                icon: Wallet,
                active: true,
              },
              {
                id: "upi",
                title: "Other UPI",
                desc: "Google Pay, Paytm, etc.",
                icon: CreditCard,
              },
              {
                id: "net",
                title: "Net Banking",
                desc: "All major Indian banks supported",
                icon: Building2,
              },
            ].map((method) => (
              <label
                key={method.id}
                className="group flex items-center justify-between p-5 bg-white rounded-2xl cursor-pointer border-2 border-transparent hover:border-primary/20 transition-all ambient-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center">
                    <method.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{method.title}</p>
                    <p className="text-xs text-slate-400 font-medium">
                      {method.desc}
                    </p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  defaultChecked={method.active}
                  className="w-5 h-5 text-primary focus:ring-primary"
                />
              </label>
            ))}
          </div>
        </section>
      </div>

      <div className="lg:col-span-5">
        <aside className="sticky top-32 space-y-6">
          <div className="bg-white p-8 rounded-2xl ambient-shadow border border-slate-100">
            <h3 className="text-xl font-bold mb-8">Order Summary</h3>
            <div className="flex items-start gap-4 mb-8">
              <div className="w-16 h-20 bg-slate-50 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                <ReceiptText className="w-8 h-8 text-slate-300" />
              </div>
              <div className="flex-grow">
                <p className="font-bold text-slate-900 leading-tight">
                  {orderData.fileName}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  {orderData.paper.toUpperCase()} •{" "}
                  {orderData.colorMode === "color" ? "Color" : "B&W"}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm font-bold text-slate-400">
                    Qty: {orderData.copies} Units
                  </span>
                  <span className="font-bold text-slate-900">
                    ₹{orderData.amount}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-8 border-t border-slate-100">
              <div className="flex justify-between text-sm font-medium text-slate-500">
                <span>Subtotal</span>
                <span>₹{orderData.amount}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-slate-500">
                <span>Shipping & Handling</span>
                <span className="text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between items-center pt-6 mt-2">
                <span className="font-bold text-lg">Total Amount</span>
                <span className="text-3xl font-black text-primary">
                  ₹{orderData.amount}
                </span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={paying}
              className={`w-full mt-10 signature-gradient text-white font-bold py-5 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 ${paying ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {paying ? "Processing..." : `Pay ₹${orderData.amount}`}
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-center text-[10px] text-slate-400 mt-6 uppercase tracking-[0.2em] font-bold">
              Encrypted & Secure Payment
            </p>
          </div>
        </aside>
      </div>
    </motion.div>
  );
};

const StatusView = ({ orderData }: { orderData: any }) => {
  if (!orderData) return null;

  return (
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
          <span className="text-slate-900">#{orderData.orderId}</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 mb-2">
              Order Confirmed
            </h1>
            <p className="text-slate-400 font-medium">
              Order ID:{" "}
              <span className="font-mono font-bold text-slate-900">
                #{orderData.orderId}
              </span>{" "}
              • Placed Just Now
            </p>
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
              <div className="h-full bg-primary w-[25%]" />
            </div>
            <div className="space-y-16 mt-4">
              {[
                {
                  title: "Order Received",
                  time: "Just Now",
                  desc: "System verified files and technical specifications.",
                  done: true,
                },
                {
                  title: "Queued for Printing",
                  time: "Pending",
                  desc: "Your document is in the local print queue.",
                  active: true,
                },
                {
                  title: "Printing",
                  time: "Waiting...",
                  desc: "Local agent will start printing soon.",
                  pending: true,
                },
                {
                  title: "Quality Control",
                  time: "Waiting...",
                  desc: "Final inspection and pickup ready.",
                  pending: true,
                },
              ].map((step, i) => (
                <div key={i} className="flex gap-8 relative">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all ${
                        step.done
                          ? "bg-primary text-white"
                          : step.active
                            ? "bg-primary-container text-white ring-8 ring-primary/10"
                            : "bg-slate-100 text-slate-300"
                      }`}
                    >
                      {step.done ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : step.active ? (
                        <Printer className="w-6 h-6 animate-pulse" />
                      ) : (
                        <Package className="w-6 h-6" />
                      )}
                    </div>
                    {i < 3 && (
                      <div
                        className={`w-0.5 h-20 absolute top-12 left-6 -z-0 ${step.done ? "bg-primary" : "bg-slate-100"}`}
                      />
                    )}
                  </div>
                  <div
                    className={`pb-4 ${step.pending ? "opacity-40" : "opacity-100"}`}
                  >
                    <h3
                      className={`text-xl font-bold ${step.active ? "text-primary" : "text-slate-900"}`}
                    >
                      {step.title}
                    </h3>
                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
                      {step.time}
                    </p>
                    <p className="text-slate-500 mt-3 max-w-md leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm space-y-6">
            <h4 className="text-lg font-bold">Specifications</h4>
            <div className="space-y-4">
              {[
                { label: "File Name", value: orderData.fileName },
                { label: "Paper Size", value: orderData.paper.toUpperCase() },
                { label: "Quantity", value: orderData.copies },
                {
                  label: "Color Mode",
                  value: orderData.colorMode === "color" ? "Full Color" : "B&W",
                },
              ].map((spec, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-slate-400 font-medium">
                    {spec.label}
                  </span>
                  <span className="font-bold text-slate-900">{spec.value}</span>
                </div>
              ))}
            </div>
            <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
              <span className="font-bold text-slate-900">Paid Amount</span>
              <span className="text-3xl font-black text-primary">
                ₹{orderData.amount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AdminView = () => {
  const [activeTab, setActiveTab] = useState("jobs");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-screen bg-slate-50"
    >
      <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col fixed h-full">
        <div className="px-8 py-10">
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter">
            Bindal Computers Xerox
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: "jobs", icon: ReceiptText, label: "Jobs" },
            { id: "analytics", icon: BarChart3, label: "Analytics" },
            { id: "settings", icon: Settings, label: "Settings" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all ${
                activeTab === item.id
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-slate-400 hover:bg-slate-50"
              }`}
            >
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
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Production Lead
              </p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 lg:ml-72 p-8 lg:p-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Print Queue
            </h2>
            <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase">
              12 Active
            </span>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                className="w-full md:w-64 bg-white border-none rounded-full pl-12 pr-6 py-3 text-sm shadow-sm focus:ring-2 focus:ring-primary/20"
                placeholder="Search files..."
              />
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
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
                  Workflow Management
                </p>
                <h3 className="text-4xl font-extrabold tracking-tight">
                  Job Processing
                </h3>
              </div>
              <div className="flex gap-2">
                {["All Jobs", "Pending", "Printed"].map((tab, i) => (
                  <button
                    key={i}
                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                      i === 0
                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                        : "bg-white text-slate-400 hover:bg-slate-100"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      ID
                    </th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      User
                    </th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      File Name
                    </th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Status
                    </th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    {
                      id: "#PA-7821",
                      user: "Eleanor Lewis",
                      file: "brand_identity_v2.pdf",
                      status: "Pending",
                      color: "amber",
                    },
                    {
                      id: "#PA-7819",
                      user: "Marcus Kane",
                      file: "portrait_gallery_01.jpg",
                      status: "Printed",
                      color: "emerald",
                    },
                    {
                      id: "#PA-7815",
                      user: "Anna Smith",
                      file: "quarterly_report_final.pdf",
                      status: "Failed",
                      color: "red",
                    },
                  ].map((job, i) => (
                    <tr
                      key={i}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-8 py-6 font-mono text-xs font-bold text-slate-400">
                        {job.id}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                            {job.user
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <span className="text-sm font-bold text-slate-900">
                            {job.user}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <ReceiptText className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-slate-600">
                            {job.file}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                            job.color === "amber"
                              ? "bg-amber-50 text-amber-600"
                              : job.color === "emerald"
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-red-50 text-red-600"
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right space-x-2">
                        <button className="px-4 py-2 bg-primary text-white text-[10px] font-bold rounded-lg hover:shadow-lg active:scale-95 transition-all">
                          Print
                        </button>
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
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Efficiency
                </p>
                <p className="text-4xl font-black text-primary">98.4%</p>
              </div>
              <div className="flex items-end gap-1 h-12">
                {[40, 70, 50, 90, 60, 80].map((h, i) => (
                  <div
                    key={i}
                    className="w-2 bg-primary/20 rounded-full"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-2xl text-white shadow-2xl shadow-slate-900/20">
              <h4 className="text-lg font-bold mb-6">System Health</h4>
              <div className="space-y-6">
                {[
                  {
                    label: "Press Temperature",
                    value: "184°C",
                    status: "Optimal",
                  },
                  { label: "Ink Levels (CMYK)", value: "82%", status: "Good" },
                  { label: "Queue Load", value: "High", status: "Managing" },
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
};

// --- Main App ---

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderData, setOrderData] = useState<any>(null);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Handle return from PhonePe
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const txnId = urlParams.get("txnId");
    const storedOrder = localStorage.getItem("pendingOrder");

    if (txnId && storedOrder) {
      const order = JSON.parse(storedOrder);
      const saveOrder = async () => {
        try {
          const ordersRef = collection(db, "orders");
          await addDoc(ordersRef, {
            ...order,
            txnId,
            paymentStatus: "paid",
            status: "queued",
            paidAt: serverTimestamp(),
          });
          setOrderData({ ...order, orderId: txnId });
          navigate("/status", { replace: true });
          localStorage.removeItem("pendingOrder");
        } catch (err) {
          console.error("Firestore Error:", err);
        }
      };
      saveOrder();
    }
  }, [navigate]);

  const handleUploadComplete = (data: any) => {
    setOrderData(data);
    localStorage.setItem("pendingOrder", JSON.stringify(data));
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {location.pathname !== "/admin" && <Header />}

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location}>
            <Route path="/" element={<LandingView />} />
            <Route
              path="/upload"
              element={<UploadView onNext={handleUploadComplete} />}
            />
            <Route
              path="/checkout"
              element={
                orderData ? (
                  <CheckoutView
                    orderData={orderData}
                    onNext={() => navigate("/status")}
                  />
                ) : (
                  <Navigate to="/upload" replace />
                )
              }
            />
            <Route
              path="/status"
              element={
                orderData ? (
                  <StatusView orderData={orderData} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route path="/admin" element={<AdminView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>

      {location.pathname !== "/admin" && <Footer />}
      {location.pathname !== "/admin" && <MobileNav />}
    </div>
  );
}
