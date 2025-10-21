'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import Link from 'next/link';
import {
  Building2,
  Users,
  GraduationCap,
  TrendingUp,
  Clock,
  Settings,
  LogOut,
  Menu,
  X,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Target,
  ShoppingCart,
  Star,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase';
import { colors, cardStyles } from '@/lib/design-tokens-premium';
import { Company, CompanyAdmin, DashboardStats } from '@/types/company';

export default function CompanyDashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, logout } = useAuthStore();
  const [company, setCompany] = useState<Company | null>(null);
  const [admin, setAdmin] = useState<CompanyAdmin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    activeEmployees: 0,
    invitedEmployees: 0,
    totalMasterclasses: 0,
    atRiskCount: 0,
    completedCourses: 0,
    averageProgress: 0,
  });
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!user) {
        router.push('/auth?redirect=/company/dashboard');
        return;
      }

      try {
        const db = getFirestore();

        // Get companyId from user custom claims
        const companyId = user.companyId;

        if (!companyId) {
          setError('Nem található vállalati fiók');
          return;
        }

        // Get company document
        const companyRef = doc(db, 'companies', companyId);
        const companySnap = await getDoc(companyRef);

        if (!companySnap.exists()) {
          setError('Nem található vállalati fiók');
          return;
        }

        const userCompany: Company = {
          id: companySnap.id,
          ...companySnap.data() as Omit<Company, 'id'>
        };

        // Get admin document
        const adminRef = doc(db, 'companies', companyId, 'admins', user.uid);
        const adminSnap = await getDoc(adminRef);

        if (!adminSnap.exists()) {
          setError('Nincs admin jogosultságod');
          return;
        }

        const userAdmin = adminSnap.data() as CompanyAdmin;

        setCompany(userCompany);
        setAdmin(userAdmin);

        // Fetch basic stats
        const employeesRef = collection(db, 'companies', userCompany.id, 'employees');
        const employeesSnapshot = await getDocs(employeesRef);

        const activeCount = employeesSnapshot.docs.filter(doc => doc.data().status === 'active').length;
        const invitedCount = employeesSnapshot.docs.filter(doc => doc.data().status === 'invited').length;

        const masterclassesRef = collection(db, 'companies', userCompany.id, 'masterclasses');
        const masterclassesSnapshot = await getDocs(masterclassesRef);

        // Fetch progress analytics from Cloud Function
        try {
          const getDashboard = httpsCallable(functions, 'getCompanyDashboard');
          const result = await getDashboard({ companyId: userCompany.id });
          const dashboardData = result.data as any;

          setStats({
            totalEmployees: employeesSnapshot.size,
            activeEmployees: activeCount,
            invitedEmployees: invitedCount,
            totalMasterclasses: masterclassesSnapshot.size,
            atRiskCount: dashboardData.stats?.atRiskCount || 0,
            completedCourses: dashboardData.stats?.completedCourses || 0,
            averageProgress: Math.round(dashboardData.stats?.averageProgress || 0),
          });
        } catch (err) {
          console.error('Error fetching dashboard analytics:', err);
          // Fallback to basic stats if analytics fail
          setStats({
            totalEmployees: employeesSnapshot.size,
            activeEmployees: activeCount,
            invitedEmployees: invitedCount,
            totalMasterclasses: masterclassesSnapshot.size,
            atRiskCount: 0,
            completedCourses: 0,
            averageProgress: 0,
          });
        }

        // Fetch available courses for purchase
        try {
          setCoursesLoading(true);
          const coursesSnapshot = await getDocs(collection(db, 'course-content'));
          const courses = coursesSnapshot.docs
            .map(doc => ({
              id: doc.id,
              ...doc.data()
            }))
            .filter((course: any) => course.isPublished !== false);

          console.log(`Loaded ${courses.length} available courses for company dashboard`);
          setAvailableCourses(courses);
        } catch (err) {
          console.error('Error fetching courses:', err);
        } finally {
          setCoursesLoading(false);
        }

      } catch (err: any) {
        console.error('Error fetching company data:', err);
        setError('Hiba történt az adatok betöltése során');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchCompanyData();
    }
  }, [user, authLoading, router]);

  const getDaysRemaining = () => {
    if (!company || !company.trialEndsAt) return 0;
    const now = new Date();
    const trialEnd = company.trialEndsAt.toDate();
    const diff = trialEnd.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-gray-900"></div>
      </div>
    );
  }

  if (error || !company || !admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {error || 'Nincs vállalati fiók'}
          </h2>
          <p className="text-gray-600 mb-6">
            Úgy tűnik, még nincs vállalati fiókod, vagy nem vagy admin.
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-black transition-colors"
          >
            Vállalat regisztrálása
          </Link>
        </div>
      </div>
    );
  }

  const daysRemaining = getDaysRemaining();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Company Name */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex-shrink-0">
                <img
                  src="/navbar-icon.png"
                  alt="Elira"
                  className="h-8"
                />
              </Link>
              <div className="hidden md:block h-6 w-px bg-gray-300"></div>
              <div className="hidden md:flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">{company.name}</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/company/dashboard" className="text-sm text-gray-900 font-medium">
                Áttekintés
              </Link>
              <Link href="/company/dashboard/employees" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Alkalmazottak
              </Link>
              <Link href="/company/dashboard/masterclasses" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Masterclassok
              </Link>
              <Link href="/company/dashboard/progress" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Haladás
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-1"
              >
                <LogOut className="w-4 h-4" />
                <span>Kijelentkezés</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 bg-white"
            >
              <div className="px-4 py-4 space-y-3">
                <div className="flex items-center space-x-2 pb-3 border-b border-gray-200">
                  <Building2 className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">{company.name}</span>
                </div>
                <Link href="/company/dashboard" className="block w-full text-left px-3 py-2 text-sm text-gray-900 font-medium bg-gray-50 rounded-lg">
                  Áttekintés
                </Link>
                <Link href="/company/dashboard/employees" className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                  Alkalmazottak
                </Link>
                <Link href="/company/dashboard/masterclasses" className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                  Masterclassok
                </Link>
                <Link href="/company/dashboard/progress" className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                  Haladás
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Kijelentkezés</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Üdv, {admin.name}!
          </h1>
          <p className="mt-2 text-gray-600">
            Itt kezelheted a vállalat alkalmazottait és követheted a tanulási előrehaladást
          </p>
        </div>

        {/* Trial Banner */}
        {company.plan === 'trial' && daysRemaining > 0 && (
          <div className="mb-8 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-amber-600" />
              <div>
                <p className="font-medium text-amber-900">Próbaidőszak</p>
                <p className="text-sm text-amber-700">Még {daysRemaining} nap van hátra a próbaidőszakból</p>
              </div>
            </div>
            <Link
              href="/company/dashboard/billing"
              className="px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors text-sm"
            >
              Frissítés
            </Link>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Employees */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={cardStyles.flat + " p-6"}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Összes alkalmazott</p>
                <p className="text-3xl font-semibold text-gray-900">{stats.totalEmployees}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '20' }}>
                <Users className="w-6 h-6" style={{ color: colors.primary }} />
              </div>
            </div>
          </motion.div>

          {/* Active Employees */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={cardStyles.flat + " p-6"}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aktív</p>
                <p className="text-3xl font-semibold" style={{ color: colors.success }}>{stats.activeEmployees}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.success + '20' }}>
                <TrendingUp className="w-6 h-6" style={{ color: colors.success }} />
              </div>
            </div>
          </motion.div>

          {/* Invited Employees */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={cardStyles.flat + " p-6"}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Meghívott</p>
                <p className="text-3xl font-semibold text-amber-600">{stats.invitedEmployees}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </motion.div>

          {/* Total Masterclasses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={cardStyles.flat + " p-6"}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Masterclassok</p>
                <p className="text-3xl font-semibold" style={{ color: colors.accent }}>{stats.totalMasterclasses}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.accent + '20' }}>
                <GraduationCap className="w-6 h-6" style={{ color: colors.accent }} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className={cardStyles.flat + " p-6 mb-8"}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Gyors műveletek
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/company/dashboard/employees" className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-gray-900 hover:shadow-md transition-all text-left">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Alkalmazott hozzáadása</p>
                <p className="text-xs text-gray-600">Új munkatárs meghívása</p>
              </div>
            </Link>

            <Link href="/company/dashboard/masterclasses" className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-gray-900 hover:shadow-md transition-all text-left">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Masterclass kezelése</p>
                <p className="text-xs text-gray-600">Képzések és hozzárendelések</p>
              </div>
            </Link>

            <Link href="/company/dashboard/progress" className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-gray-900 hover:shadow-md transition-all text-left">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Riportok megtekintése</p>
                <p className="text-xs text-gray-600">Előrehaladás követése</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
