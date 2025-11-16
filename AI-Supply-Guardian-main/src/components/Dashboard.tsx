import {
  Bell,
  Shield,
  LayoutDashboard,
  Users,
  Plus,
  Mail,
  Settings,
  TrendingUp,
  AlertTriangle,
  Package,
  Clock,
  LogOut,
  Home,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

type Page =
  | "dashboard"
  | "suppliers"
  | "add-supplier"
  | "alerts"
  | "analyzer"
  | "settings";

interface DashboardProps {
  onNavigateToLanding: () => void;
}

export function Dashboard({ onNavigateToLanding }: DashboardProps) {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    onNavigateToLanding();
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.user_metadata?.full_name) return "U";
    const names = user.user_metadata.full_name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#1a1f37] flex">
      <aside className="w-64 bg-[#151929] border-r border-gray-800/50 fixed h-full">
        <div className="p-6 border-b border-gray-800/50">
          <button
            onClick={onNavigateToLanding}
            className="flex items-center space-x-2 hover:opacity-80 transition"
          >
            <Shield className="w-8 h-8 text-indigo-500" />
            <span className="text-lg font-semibold text-white">
              AI Supply Guardian
            </span>
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <button
            onClick={() => setCurrentPage("dashboard")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              currentPage === "dashboard"
                ? "gradient-button text-white shadow-lg shadow-indigo-500/30"
                : "text-gray-400 hover:bg-[#1a1f37] hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentPage("suppliers")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              currentPage === "suppliers"
                ? "gradient-button text-white shadow-lg shadow-indigo-500/30"
                : "text-gray-400 hover:bg-[#1a1f37] hover:text-white"
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Suppliers</span>
          </button>

          <button
            onClick={() => setCurrentPage("add-supplier")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              currentPage === "add-supplier"
                ? "gradient-button text-white shadow-lg shadow-indigo-500/30"
                : "text-gray-400 hover:bg-[#1a1f37] hover:text-white"
            }`}
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Supplier</span>
          </button>

          <button
            onClick={() => setCurrentPage("alerts")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              currentPage === "alerts"
                ? "gradient-button text-white shadow-lg shadow-indigo-500/30"
                : "text-gray-400 hover:bg-[#1a1f37] hover:text-white"
            }`}
          >
            <Bell className="w-5 h-5" />
            <span className="font-medium">Alerts</span>
          </button>

          <button
            onClick={() => setCurrentPage("analyzer")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              currentPage === "analyzer"
                ? "gradient-button text-white shadow-lg shadow-indigo-500/30"
                : "text-gray-400 hover:bg-[#1a1f37] hover:text-white"
            }`}
          >
            <Mail className="w-5 h-5" />
            <span className="font-medium">Email Analyzer</span>
          </button>

          <button
            onClick={() => setCurrentPage("settings")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              currentPage === "settings"
                ? "gradient-button text-white shadow-lg shadow-indigo-500/30"
                : "text-gray-400 hover:bg-[#1a1f37] hover:text-white"
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>

          <div className="pt-4 mt-4 border-t border-gray-800/50 space-y-2">
            <button
              onClick={onNavigateToLanding}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition text-gray-400 hover:bg-[#1a1f37] hover:text-white"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </button>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition text-gray-400 hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </nav>
      </aside>

      <main className="ml-64 flex-1">
        <header className="bg-[#151929] border-b border-gray-800/50 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {currentPage === "dashboard" && "Dashboard"}
                {currentPage === "suppliers" && "Supplier Management"}
                {currentPage === "add-supplier" && "Add New Supplier"}
                {currentPage === "alerts" && "Risk Alerts"}
                {currentPage === "analyzer" && "AI Email Analyzer"}
                {currentPage === "settings" && "Settings"}
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {currentPage === "dashboard" &&
                  "Monitor your supply chain at a glance"}
                {currentPage === "suppliers" &&
                  "View and manage all your suppliers"}
                {currentPage === "add-supplier" &&
                  "Add a new supplier to track"}
                {currentPage === "alerts" && "View all risk notifications"}
                {currentPage === "analyzer" &&
                  "Analyze supplier communications with AI"}
                {currentPage === "settings" && "Configure your preferences"}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-white">
                  {user?.user_metadata?.full_name || "User"}
                </p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
              <button className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 hover:bg-indigo-500/20 transition">
                <span className="text-indigo-400 font-semibold">
                  {getUserInitials()}
                </span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-8">
          {currentPage === "dashboard" && <DashboardHome />}
          {currentPage === "suppliers" && <SuppliersPage />}
          {currentPage === "add-supplier" && <AddSupplierPage />}
          {currentPage === "alerts" && <AlertsPage />}
          {currentPage === "analyzer" && <AnalyzerPage />}
          {currentPage === "settings" && <SettingsPage />}
        </div>
      </main>
    </div>
  );
}

function DashboardHome() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1e2337] rounded-xl p-6 shadow-lg border border-gray-800/50 hover:border-red-500/50 transition">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <span className="text-3xl font-bold text-red-400">3</span>
          </div>
          <h3 className="text-sm font-medium text-gray-300">
            High Risk Suppliers
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Immediate attention needed
          </p>
        </div>

        <div className="bg-[#1e2337] rounded-xl p-6 shadow-lg border border-gray-800/50 hover:border-indigo-500/50 transition">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="text-3xl font-bold text-indigo-400">12</span>
          </div>
          <h3 className="text-sm font-medium text-gray-300">
            Pending Deliveries
          </h3>
          <p className="text-xs text-gray-500 mt-1">Expected this week</p>
        </div>

        <div className="bg-[#1e2337] rounded-xl p-6 shadow-lg border border-gray-800/50 hover:border-yellow-500/50 transition">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-3xl font-bold text-yellow-400">5</span>
          </div>
          <h3 className="text-sm font-medium text-gray-300">
            Price Spike Alerts
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Significant increases detected
          </p>
        </div>

        <div className="bg-[#1e2337] rounded-xl p-6 shadow-lg border border-gray-800/50 hover:border-green-500/50 transition">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-3xl font-bold text-green-400">92%</span>
          </div>
          <h3 className="text-sm font-medium text-gray-300">
            On-Time Delivery Rate
          </h3>
          <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1e2337] rounded-xl p-6 shadow-lg border border-gray-800/50">
          <h3 className="text-lg font-semibold text-white mb-4">
            Risk Level Distribution
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">
                  High Risk
                </span>
                <span className="text-sm font-bold text-red-400">
                  3 suppliers
                </span>
              </div>
              <div className="w-full bg-gray-700/30 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: "15%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">
                  Medium Risk
                </span>
                <span className="text-sm font-bold text-yellow-400">
                  7 suppliers
                </span>
              </div>
              <div className="w-full bg-gray-700/30 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: "35%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">
                  Low Risk
                </span>
                <span className="text-sm font-bold text-green-400">
                  12 suppliers
                </span>
              </div>
              <div className="w-full bg-gray-700/30 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1e2337] rounded-xl p-6 shadow-lg border border-gray-800/50">
          <h3 className="text-lg font-semibold text-white mb-4">
            Recent Alerts
          </h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">
                  Delivery Delay Detected
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Acme Corp - Steel sheets expected 5 days late
                </p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <TrendingUp className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">
                  Price Increase Warning
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Global Materials - Copper wire up 18%
                </p>
                <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">
                  Supplier Risk Alert
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  TechParts Ltd - Financial instability detected
                </p>
                <p className="text-xs text-gray-500 mt-1">1 day ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <Clock className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">
                  Late Response Pattern
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  BuildCo - Slow email responses past 2 weeks
                </p>
                <p className="text-xs text-gray-500 mt-1">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuppliersPage() {
  const suppliers = [
    {
      name: "Acme Corp",
      item: "Steel Sheets",
      quantity: 500,
      deliveryDate: "2025-11-20",
      risk: "high",
    },
    {
      name: "Global Materials",
      item: "Copper Wire",
      quantity: 1000,
      deliveryDate: "2025-11-18",
      risk: "medium",
    },
    {
      name: "TechParts Ltd",
      item: "Electronic Components",
      quantity: 200,
      deliveryDate: "2025-11-22",
      risk: "high",
    },
    {
      name: "BuildCo",
      item: "Concrete Mix",
      quantity: 2000,
      deliveryDate: "2025-11-17",
      risk: "medium",
    },
    {
      name: "SafeSupply Inc",
      item: "Safety Equipment",
      quantity: 150,
      deliveryDate: "2025-11-19",
      risk: "low",
    },
    {
      name: "QuickShip LLC",
      item: "Packaging Materials",
      quantity: 800,
      deliveryDate: "2025-11-16",
      risk: "low",
    },
  ];

  return (
    <div className="bg-[#1e2337] rounded-xl shadow-lg border border-gray-800/50">
      <div className="p-6 border-b border-gray-800/50 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">All Suppliers</h2>
        <button className="gradient-button text-white px-4 py-2 rounded-lg transition flex items-center space-x-2 shadow-lg shadow-indigo-500/30">
          <Plus className="w-4 h-4" />
          <span>Add Supplier</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#151929]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Supplier Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Delivery Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Risk Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#1e2337] divide-y divide-gray-800/50">
            {suppliers.map((supplier, index) => (
              <tr key={index} className="hover:bg-[#232840]">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-white">{supplier.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{supplier.item}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {supplier.quantity} units
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {supplier.deliveryDate}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      supplier.risk === "high"
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : supplier.risk === "medium"
                        ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                        : "bg-green-500/10 text-green-400 border border-green-500/20"
                    }`}
                  >
                    {supplier.risk.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-indigo-400 hover:text-indigo-300 font-medium">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AddSupplierPage() {
  const { accessToken, refreshToken } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!name || !email || !item || !quantity || !price || !deliveryDate) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    console.log("Access Token:", accessToken); // For testing purposes

    const webhookUrl = "https://eranclikview.app.n8n.cloud/webhook/Add_Supplier_aiSupplierGuardian";
    const apiKey = import.meta.env.VITE_AI_SUPPLY_GUARDIAN_N8N_API_KEY;

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          supplierName: name,
          supplierEmail: email,
          item,
          quantity: parseInt(quantity),
          price: parseFloat(price),
          deliveryDate,
          userAccessToken: accessToken,
          userRefreshToken: refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit supplier information.');
      }

      setSuccess("Supplier added successfully!");
      // Reset form
      setName("");
      setEmail("");
      setItem("");
      setQuantity("");
      setPrice("");
      setDeliveryDate("");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-[#1e2337] rounded-xl shadow-lg border border-gray-800/50 p-8">
        <h2 className="text-xl font-semibold text-white mb-6">
          Supplier Information
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400 font-medium">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-start space-x-3">
              <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-400 font-medium">{success}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Supplier Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-[#151929] border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white placeholder-gray-500"
              placeholder="Enter supplier name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#151929] border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white placeholder-gray-500"
              placeholder="supplier@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Item
            </label>
            <input
              type="text"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              className="w-full px-4 py-3 bg-[#151929] border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white placeholder-gray-500"
              placeholder="What are they supplying?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-3 bg-[#151929] border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white placeholder-gray-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Price
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-3 bg-[#151929] border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white placeholder-gray-500"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Expected Delivery Date
            </label>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="w-full px-4 py-3 bg-[#151929] border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-button text-white px-6 py-3 rounded-lg transition font-medium shadow-lg shadow-indigo-500/30 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Save Supplier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AlertsPage() {
  const alerts = [
    {
      type: "high",
      title: "Critical Delivery Delay",
      description:
        "Acme Corp - Steel sheets order will be 5 days late due to production issues",
      time: "2 hours ago",
      icon: AlertTriangle,
    },
    {
      type: "high",
      title: "Supplier Financial Risk",
      description:
        "TechParts Ltd - Credit rating downgraded, may affect reliability",
      time: "1 day ago",
      icon: AlertTriangle,
    },
    {
      type: "medium",
      title: "Price Increase Detected",
      description:
        "Global Materials - Copper wire price increased by 18% from last order",
      time: "5 hours ago",
      icon: TrendingUp,
    },
    {
      type: "medium",
      title: "Slow Response Pattern",
      description:
        "BuildCo - Average email response time increased to 48+ hours",
      time: "1 day ago",
      icon: Clock,
    },
    {
      type: "low",
      title: "Minor Schedule Change",
      description:
        "QuickShip LLC - Delivery moved forward by 1 day, arriving earlier",
      time: "3 days ago",
      icon: Package,
    },
    {
      type: "medium",
      title: "Quality Concern Mentioned",
      description:
        'Global Materials - Email mentioned "quality control delays", monitoring situation',
      time: "2 days ago",
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="space-y-4">
      {alerts.map((alert, index) => (
        <div
          key={index}
          className={`bg-[#1e2337] rounded-xl shadow-lg border-l-4 p-6 ${
            alert.type === "high"
              ? "border-red-500"
              : alert.type === "medium"
              ? "border-yellow-500"
              : "border-green-500"
          }`}
        >
          <div className="flex items-start space-x-4">
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                alert.type === "high"
                  ? "bg-red-500/10"
                  : alert.type === "medium"
                  ? "bg-yellow-500/10"
                  : "bg-green-500/10"
              }`}
            >
              <alert.icon
                className={`w-6 h-6 ${
                  alert.type === "high"
                    ? "text-red-400"
                    : alert.type === "medium"
                    ? "text-yellow-400"
                    : "text-green-400"
                }`}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-white">
                  {alert.title}
                </h3>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    alert.type === "high"
                      ? "bg-red-500/10 text-red-400 border border-red-500/20"
                      : alert.type === "medium"
                      ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                      : "bg-green-500/10 text-green-400 border border-green-500/20"
                  }`}
                >
                  {alert.type.toUpperCase()}
                </span>
              </div>
              <p className="text-gray-300 mb-3">{alert.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{alert.time}</span>
                <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AnalyzerPage() {
  const [showResults, setShowResults] = useState(false);

  return (
    <div className="max-w-4xl">
      <div className="bg-[#1e2337] rounded-xl shadow-lg border border-gray-800/50 p-8">
        <h2 className="text-xl font-semibold text-white mb-6">
          Analyze Supplier Communication
        </h2>
        <p className="text-gray-300 mb-6">
          Paste any email or text from your supplier below. Our AI will
          automatically extract key information and identify potential risks.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email or Text Content
          </label>
          <textarea
            className="w-full px-4 py-3 bg-[#151929] border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white placeholder-gray-500"
            rows={12}
            placeholder="Paste supplier email or message here..."
            defaultValue="Dear Valued Customer,

We wanted to update you on your steel sheets order (#12345). Unfortunately, we're experiencing some production delays due to equipment maintenance issues in our facility. We expect the shipment to be delayed by approximately 5 days from the original delivery date of Nov 20th.

We apologize for any inconvenience this may cause and will keep you updated on our progress.

Best regards,
Acme Corp Supply Team"
          />
        </div>

        <button
          onClick={() => setShowResults(!showResults)}
          className="w-full gradient-button text-white px-6 py-3 rounded-lg transition font-medium shadow-lg shadow-indigo-500/30"
        >
          Analyze with AI
        </button>

        {showResults && (
          <div className="mt-8 space-y-4">
            <div className="border-t border-gray-800/50 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Analysis Results
              </h3>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-3">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <h4 className="text-lg font-semibold text-red-300">
                  High Risk Detected
                </h4>
              </div>
              <p className="text-red-200 mb-4">
                Significant delivery delay identified. This may impact your
                production schedule.
              </p>
            </div>

            <div className="bg-[#151929] border border-gray-700 rounded-lg p-6">
              <h4 className="font-semibold text-white mb-3">
                Key Information Extracted
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">
                      Supplier
                    </p>
                    <p className="text-sm text-white">Acme Corp</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">
                      Order Number
                    </p>
                    <p className="text-sm text-white">#12345</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">Item</p>
                    <p className="text-sm text-white">Steel sheets</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">Issue</p>
                    <p className="text-sm text-white">
                      Production delays due to equipment maintenance
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">
                      Delay Duration
                    </p>
                    <p className="text-sm text-white">Approximately 5 days</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">
                      New Expected Date
                    </p>
                    <p className="text-sm text-white">November 25, 2025</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-6">
              <h4 className="font-semibold text-indigo-300 mb-3">
                Recommendations
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-indigo-200">
                    Contact alternative suppliers for urgent needs
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-indigo-200">
                    Adjust production schedule to accommodate delay
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-indigo-200">
                    Request daily updates from supplier
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-indigo-200">
                    Monitor for further delays or complications
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="max-w-3xl">
      <div className="bg-[#1e2337] rounded-xl shadow-lg border border-gray-800/50 p-8">
        <h2 className="text-xl font-semibold text-white mb-6">
          Account Settings
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-[#151929] border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white"
              defaultValue="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 bg-[#151929] border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white"
              defaultValue="john@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Company Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-[#151929] border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white"
              defaultValue="My Company Inc"
            />
          </div>

          <div className="border-t border-gray-800/50 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Notification Preferences
            </h3>

            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-indigo-600 rounded bg-[#151929] border-gray-700"
                  defaultChecked
                />
                <span className="text-sm text-gray-300">
                  Email alerts for high-risk suppliers
                </span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-indigo-600 rounded bg-[#151929] border-gray-700"
                  defaultChecked
                />
                <span className="text-sm text-gray-300">
                  Daily summary report
                </span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-indigo-600 rounded bg-[#151929] border-gray-700"
                />
                <span className="text-sm text-gray-300">
                  Weekly performance digest
                </span>
              </label>
            </div>
          </div>

          <div className="pt-4">
            <button className="gradient-button text-white px-6 py-3 rounded-lg transition font-medium shadow-lg shadow-indigo-500/30">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}
