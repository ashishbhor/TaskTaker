import { useAuth } from "./context/AuthContext";
import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { deleteTask as deleteTaskApi } from './services/taskService';
import { login, signup, logout } from './services/authService';
import { getProfile, updateMe } from './services/userService';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} from './services/taskService';
import { User, Task, TaskPriority, TaskStatus } from './types';
import { Button } from './components/Button';
import { Input } from './components/Input';

// --- Sub-components (Stateless / Pure) ---


const LoadingScreen = () => (
  <div className="fixed inset-0 bg-white dark:bg-slate-950 flex flex-col items-center justify-center z-[100]">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-indigo-100 dark:border-slate-800 border-t-indigo-600 rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
      </div>
    </div>
    <p className="mt-4 text-slate-500 dark:text-slate-400 font-bold tracking-widest text-xs uppercase animate-pulse">Synchronizing Workspace</p>
  </div>
);

const Badge = ({ children, color = 'blue' }: { children?: React.ReactNode, color?: 'blue' | 'green' | 'red' | 'yellow' | 'gray' }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
    red: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
    yellow: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    gray: 'bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
  };
  return (
    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${colors[color]}`}>
      {children}
    </span>
  );
};

const StatItem = ({ label, value, icon, color }: { label: string, value: number, icon: React.ReactNode, color: string }) => (
  <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl ${color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
      {icon}
    </div>
    <p className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-none">{value}</p>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{label}</p>
  </div>
);

interface AuthViewProps {
  view: 'login' | 'signup';
  setView: (v: 'login' | 'signup') => void;
  authForm: any;
  setAuthForm: (f: any) => void;
  formError: string;
  isLoading: boolean;
  onAuth: (e: React.FormEvent) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ view, setView, authForm, setAuthForm, formError, isLoading, onAuth }) => (
  <div className="min-h-screen flex bg-white dark:bg-slate-950">
    <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 p-16 flex-col justify-between relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full -mr-48 -mt-48 opacity-20"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-4 text-white mb-20">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-xl">T</div>
          <span className="text-2xl font-black tracking-tighter uppercase">TaskTaker</span>
        </div>
        <h1 className="text-6xl font-black text-white leading-tight">Unlock <br />your productivity superpowers.</h1>
        <p className="mt-6 text-indigo-100 text-lg max-w-md">The modern dashboard designed to eliminate noise and empower your workflow.</p>
      </div>
    </div>
    <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50/30 dark:bg-slate-950">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center lg:text-left">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white">{view === 'signup' ? 'Get Started' : 'Welcome Back'}</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400 font-medium">Please enter your details below.</p>
        </div>
        <form className="space-y-4" onSubmit={onAuth}>
          {view === 'signup' && <Input label="Full Name" placeholder="John Doe" required value={authForm.fullName} onChange={(e) => setAuthForm({ ...authForm, fullName: e.target.value })} />}
          <Input label="Email Address" type="email" placeholder="name@company.com" required value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} />
          <Input label="Password" type="password" placeholder="••••••••" required value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} />
          {formError && <p className="text-sm text-red-500 text-center font-bold bg-rose-50 dark:bg-rose-950/20 py-3 rounded-xl">{formError}</p>}
          <Button type="submit" className="w-full py-4 text-base font-black rounded-xl" isLoading={isLoading}>{view === 'signup' ? 'Create Account' : 'Sign In'}</Button>
        </form>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 font-bold">
          {view === 'signup' ? 'Already have an account?' : "New here?"} <button type="button" className="text-indigo-600 dark:text-indigo-400 underline" onClick={() => setView(view === 'signup' ? 'login' : 'signup')}>{view === 'signup' ? 'Login' : 'Register'}</button>
        </p>
      </div>
    </div>
  </div>
);

export default function App() {
  const { user, loading, loginSuccess, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState<'login' | 'signup' | 'dashboard' | 'profile'>('login');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | TaskPriority>('ALL');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: TaskPriority.MEDIUM });
  const [profileName, setProfileName] = useState('');
  const [authForm, setAuthForm] = useState({ email: '', password: '', fullName: '' });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!user) return;

    setView("dashboard");
    fetchTasks();
  }, [user]);

  useEffect(() => {
    if (view === "profile" && user) {
      setProfileName(user.fullName);
    }
  }, [view, user]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    }
  }, []);



  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const fetchTasks = async () => {
    const data = await getTasks(page, 5, sort);
    setTasks(data.tasks);
    setTotalPages(data.totalPages);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError("");

    try {
      if (view === "signup") {
        await signup(authForm.fullName, authForm.email, authForm.password);
        setView("login");
      } else {
        await login(authForm.email, authForm.password);
        await loginSuccess(); // 🔥 key line
        setView("dashboard");
        fetchTasks();
      }
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout(); // from AuthContext
    setTasks([]);
    setView("login");
    setIsSidebarOpen(false);
  };


  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingTask) {
        await updateTask(editingTask._id, taskForm);
      } else {
        await createTask(taskForm);
      }

      await fetchTasks();
      setIsTaskModalOpen(false);
      setEditingTask(null);
      setTaskForm({ title: '', description: '', priority: TaskPriority.MEDIUM });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTaskStatus = async (task: Task) => {
    const nextStatus =
      task.status === TaskStatus.DONE
        ? TaskStatus.TODO
        : TaskStatus.DONE;

    await updateTask(task._id, { status: nextStatus });
    await fetchTasks();

    if (nextStatus === TaskStatus.DONE) {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
  };

  const deleteTask = async (id: string) => {
    if (confirm('Delete task?')) {
      await deleteTaskApi(id);
      await fetchTasks();
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedUser = await updateMe(profileName);
      loginSuccess(); // from AuthContext
      alert('Profile updated!');
      setView('dashboard');
    } finally {
      setIsLoading(false);
    }
  };


  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });
  }, [tasks, searchQuery, priorityFilter]);

  const stats = useMemo(() => ({
    total: tasks.length,
    todo: tasks.filter(t => t.status === TaskStatus.TODO).length,
    done: tasks.filter(t => t.status === TaskStatus.DONE).length,
    high: tasks.filter(t => t.priority === TaskPriority.HIGH).length
  }), [tasks]);

  if (loading) return <LoadingScreen />;
  if (!user) {
    return (
      <AuthView
        view={view as "login" | "signup"}
        setView={setView}
        authForm={authForm}
        setAuthForm={setAuthForm}
        formError={formError}
        isLoading={isLoading}
        onAuth={handleAuth}
      />
    );
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-600/20">T</div>
        <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">TaskTaker</span>
      </div>

      <nav className="flex-1 space-y-2">
        <button onClick={() => { setView('dashboard'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-5 py-3 rounded-2xl transition-all ${view === 'dashboard' ? 'bg-indigo-600 text-white shadow-md font-bold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16"></path></svg> Dashboard
        </button>
        <button onClick={() => { setView('profile'); setProfileName(user?.fullName || ''); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-5 py-3 rounded-2xl transition-all ${view === 'profile' ? 'bg-indigo-600 text-white shadow-md font-bold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg> Profile
        </button>
      </nav>

      {/* Primary Sidebar Footer for Mode Toggle and Logout - Visible on all devices within the sidebar */}
      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
        <div className="px-4 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl mb-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center font-black text-indigo-600 text-lg shadow-sm">
            {user?.fullName.charAt(0)}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-black truncate text-slate-900 dark:text-white">{user?.fullName}</p>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Workspace Pro</p>
          </div>
        </div>

        <button onClick={toggleDarkMode} className="w-full flex items-center justify-between px-5 py-3 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-bold text-sm">
          <div className="flex items-center gap-3">
            {isDarkMode ? (
              <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"></path></svg>
            ) : (
              <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
            )}
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </div>
          <div className={`w-10 h-5 rounded-full relative transition-colors ${isDarkMode ? 'bg-indigo-600' : 'bg-slate-300'}`}>
            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${isDarkMode ? 'left-6' : 'left-1'}`}></div>
          </div>
        </button>

        <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-3 rounded-2xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all font-black text-sm group">
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500">
      {/* Desktop Sidebar - Fixed Left */}
      <aside className="hidden lg:flex w-72 min-w-[288px] border-r border-slate-100 dark:border-slate-800 flex-col sticky top-0 h-screen z-50 bg-white dark:bg-slate-900">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer (Hamburger Menu) */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] animate-fade-in" onClick={() => setIsSidebarOpen(false)}>
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
          <aside className="absolute top-0 left-0 w-72 h-full bg-white dark:bg-slate-900 shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col relative min-w-0">
        {/* Simple Top Header - Logo and Hamburger ONLY (No logout/mode here per request) */}
        <header className="lg:hidden sticky top-0 left-0 right-0 z-[80] h-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-sm">T</div>
              <span className="font-black text-slate-900 dark:text-white uppercase text-sm tracking-tighter">TaskTaker</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-4 md:p-8 lg:p-12 w-full pt-8 lg:pt-12">
          <div className="max-w-5xl mx-auto w-full">
            {view === 'dashboard' ? (
              <div className="space-y-8 animate-fade-in">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="space-y-2">
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                      Hi, <span className="text-indigo-600 dark:text-indigo-400">{user?.fullName.split(' ')[0]}!</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Your workspace summary is ready.</p>
                  </div>
                  <Button onClick={() => { setEditingTask(null); setTaskForm({ title: '', description: '', priority: TaskPriority.MEDIUM }); setIsTaskModalOpen(true); }} className="px-6 py-3.5 rounded-2xl shadow-xl w-full md:w-auto font-black text-sm">
                    + New Mission
                  </Button>
                </header>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatItem label="Total" value={stats.total} icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>} color="bg-indigo-600 shadow-indigo-500/20 shadow-lg" />
                  <StatItem label="Todo" value={stats.todo} icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>} color="bg-amber-500 shadow-amber-500/20 shadow-lg" />
                  <StatItem label="Done" value={stats.done} icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>} color="bg-emerald-500 shadow-emerald-500/20 shadow-lg" />
                  <StatItem label="High" value={stats.high} icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>} color="bg-rose-500 shadow-rose-500/20 shadow-lg" />
                </div>

                <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-900 p-3 md:p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="flex-1 relative">
                    <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <input type="text" placeholder="Search tasks..." className="w-full pl-12 pr-5 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold transition-all text-sm" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                  </div>
                  <select
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value);
                      setPage(1);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 font-bold"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="priority">Priority</option>
                  </select>
                  <select className="px-5 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-black text-sm transition-all" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value as any)}>
                    <option value="ALL">All Priorities</option>
                    <option value={TaskPriority.HIGH}>High</option>
                    <option value={TaskPriority.MEDIUM}>Medium</option>
                    <option value={TaskPriority.LOW}>Low</option>
                  </select>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
                  {filteredTasks.map(task => (
                    <div key={task._id} className={`group bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 transition-all hover:shadow-xl ${task.status === TaskStatus.DONE ? 'opacity-70' : ''}`}>
                      <div className="flex items-start justify-between mb-4 md:mb-6">
                        <Badge color={task.priority === TaskPriority.HIGH ? 'red' : task.priority === TaskPriority.MEDIUM ? 'yellow' : 'blue'}>{task.priority}</Badge>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditingTask(task); setTaskForm({ title: task.title, description: task.description, priority: task.priority }); setIsTaskModalOpen(true); }} className="p-2 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/40 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>
                          <button onClick={() => deleteTask(task._id)} className="p-2 text-rose-600 bg-rose-50 dark:bg-rose-900/40 rounded-xl hover:bg-rose-600 hover:text-white transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                        </div>
                      </div>
                      <h3 className={`text-xl font-black text-slate-900 dark:text-white mb-2 leading-tight ${task.status === TaskStatus.DONE ? 'line-through text-slate-400' : ''}`}>{task.title}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium line-clamp-3 mb-8">{task.description}</p>
                      <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{new Date(task.createdAt).toLocaleDateString()}</span>
                        <button onClick={() => toggleTaskStatus(task)} className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${task.status === TaskStatus.DONE ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'}`}>{task.status === TaskStatus.DONE ? 'DONE' : 'FINISH'}</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-10 animate-fade-in pb-20">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white">Profile Settings</h1>
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 space-y-8 shadow-sm">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-white text-4xl font-black shadow-lg shadow-indigo-600/30">{user?.fullName.charAt(0)}</div>
                    <div>
                      <h3 className="text-2xl font-black dark:text-white leading-none">{user?.fullName}</h3>
                      <p className="text-indigo-600 dark:text-indigo-400 font-bold mt-1">{user?.email}</p>
                    </div>
                  </div>
                  <form onSubmit={handleUpdateProfile} className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <Input label="Full Name" value={profileName} onChange={e => setProfileName(e.target.value)} />
                    <div className="flex justify-end gap-3 pt-4"><Button variant="ghost" type="button" onClick={() => setView('dashboard')} className="font-bold">Cancel</Button><Button type="submit" isLoading={isLoading} className="font-black px-8">Save Profile</Button></div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modern Refined Modal - Compact, Centered, Responsive */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[120] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border border-slate-200/50 dark:border-slate-800 flex flex-col relative animate-slide-up shadow-2xl overflow-hidden">

            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  {editingTask ? 'Edit Mission' : 'New Mission'}
                </h3>
              </div>
              <button
                onClick={() => { setIsTaskModalOpen(false); setEditingTask(null); }}
                className="text-slate-400 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800 p-1.5 rounded-xl transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleTaskSubmit} id="task-form" className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[80vh]">
              <div className="space-y-4">
                <Input
                  label="Mission Title"
                  required
                  autoFocus
                  placeholder="Task name..."
                  value={taskForm.title}
                  onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="font-bold border-slate-100 dark:border-slate-800"
                />

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 ml-1 uppercase tracking-[0.2em]">Context Brief</label>
                  <textarea
                    className="w-full px-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 min-h-[90px] font-medium transition-all text-sm resize-none placeholder-slate-300 dark:placeholder-slate-600"
                    placeholder="Brief details or mission notes..."
                    value={taskForm.description}
                    onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 ml-1 uppercase tracking-[0.2em]">Priority Matrix</label>
                  <div className="grid grid-cols-3 gap-2 p-1 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                    {[TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH].map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setTaskForm({ ...taskForm, priority: p })}
                        className={`py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${taskForm.priority === p
                          ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-600 scale-[1.02]'
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                          }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="w-full sm:flex-1 font-black px-8 py-3.5 order-1 shadow-indigo-600/20"
                >
                  {editingTask ? 'Apply Changes' : 'Confirm Launch'}
                </Button>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => { setIsTaskModalOpen(false); setEditingTask(null); }}
                  className="w-full sm:w-auto font-bold py-3.5 order-2 text-slate-400 dark:text-slate-500"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
