import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Dashboard() {
    const [books, setBooks] = useState([]);
    const [stats, setStats] = useState({ total: 0, finished: 0, reading: 0, on_hold: 0 });
    const { logout, user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await api.get('/books');
            const bookList = response.data || [];
            setBooks(bookList);
            calculateStats(bookList);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch books');
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (bookList) => {
        const stats = { total: bookList.length, finished: 0, reading: 0, on_hold: 0 };
        bookList.forEach(book => {
            const status = book.status ? book.status.toLowerCase() : 'on_hold';
            if (status === 'finished' || status === 'selesai') stats.finished++;
            else if (status === 'reading' || status === 'sedang_dibaca') stats.reading++;
            else stats.on_hold++;
        });
        setStats(stats);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this book?')) return;
        try {
            await api.delete(`/books/${id}`);
            toast.success('Book deleted successfully');
            fetchBooks();
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete book');
        }
    };

    const getStatusBadge = (status) => {
        const s = status ? status.toLowerCase() : 'on_hold';
        let colorClass = 'bg-slate-700/80 text-slate-300';
        let label = 'On Hold';
        if (s === 'finished' || s === 'selesai') { colorClass = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'; label = 'Finished'; }
        else if (s === 'reading' || s === 'sedang_dibaca') { colorClass = 'bg-blue-500/20 text-blue-300 border border-blue-500/30'; label = 'Reading'; }
        return <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide ${colorClass}`}>{label}</span>;
    };

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const readingBooks = books.filter(book => book.status === 'reading' || book.status === 'sedang_dibaca');

    if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading...</div>;

    return (
        <div className="min-h-screen bg-background text-slate-100 pb-24 md:pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="relative flex-1 max-w-lg">
                        <input
                            type="text"
                            placeholder="Search your library..."
                            className="w-full bg-slate-800/50 border border-white/10 rounded-full py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder-slate-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <svg className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <div className="flex items-center gap-4 self-end md:self-auto">
                        <Link to="/create" className="hidden md:flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors shadow-lg shadow-primary/20">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Book
                        </Link>
                        <Link to="/profile" className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-semibold">{user?.username || 'User'}</p>
                                <p className="text-xs text-slate-400">Member</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px]">
                                <div className="h-full w-full rounded-full bg-slate-800 overflow-hidden">
                                    {user?.avatar_url ? (
                                        <img src={user.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-white font-bold text-sm">
                                            {user?.username?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Quote Banner */}
                        <div className="relative overflow-hidden rounded-3xl bg-slate-800 p-8 md:p-10 shadow-xl border border-white/5">
                            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-secondary/10 blur-3xl"></div>
                            <div className="relative z-10">
                                <span className="inline-block px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 text-xs font-semibold mb-4 border border-blue-500/20">Quote Today</span>
                                <h2 className="text-2xl md:text-3xl font-serif italic text-slate-100 leading-relaxed mb-4">
                                    "I have always imagined that Paradise will be a kind of library."
                                </h2>
                                <p className="text-slate-400 font-medium">— Jorge Luis Borges</p>
                            </div>
                        </div>

                        {/* Continue Reading Section */}
                        {readingBooks.length > 0 && (
                            <div>
                                <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                                    Continue Reading
                                    <span className="h-[1px] flex-grow bg-slate-800 ml-4"></span>
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {readingBooks.map(book => (
                                        <div key={book.id} className="bg-slate-800/50 hover:bg-slate-800 border border-white/5 rounded-xl p-4 flex gap-4 transition-all group cursor-pointer" title={book.title}>
                                            <div className="h-32 w-24 flex-shrink-0 bg-slate-700 rounded-lg overflow-hidden shadow-md">
                                                {book.image_url ? (
                                                    <img src={book.image_url} alt={book.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-slate-500 text-xs">No Cover</div>
                                                )}
                                            </div>
                                            <div className="flex flex-col justify-between py-1 flex-grow">
                                                <div>
                                                    <h4 className="font-bold text-lg text-slate-100 line-clamp-1 group-hover:text-primary transition-colors">{book.title}</h4>
                                                    <p className="text-sm text-slate-400">{book.author}</p>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                                                        <div className="h-full bg-gradient-to-r from-primary to-secondary w-2/3 rounded-full"></div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-slate-500">64% Completed</span>
                                                        <Link to={`/edit/${book.id}`} className="text-xs text-primary hover:text-white font-medium">Update</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { label: 'Total Books', value: stats.total, icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', color: 'text-primary', bg: 'bg-primary/10' },
                                { label: 'On Hold', value: stats.on_hold, icon: 'M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
                                { label: 'Reading', value: stats.reading, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-blue-400', bg: 'bg-blue-400/10' },
                                { label: 'Finished', value: stats.finished, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-green-400', bg: 'bg-green-400/10' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                                        <div className="text-xs text-slate-400">{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* All Books Grid */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-slate-100">My Collection</h3>
                                <Link to="/create" className="text-sm text-primary hover:text-white md:hidden">Add New</Link>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredBooks.map((book) => (
                                    <div key={book.id} className="group relative bg-slate-800/40 hover:bg-slate-800 rounded-xl p-3 border border-white/5 hover:border-white/10 transition-all">
                                        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {getStatusBadge(book.status)}
                                        </div>
                                        <div className="aspect-[2/3] bg-slate-900 rounded-lg overflow-hidden mb-3 relative shadow-lg">
                                            {book.image_url ? (
                                                <img src={book.image_url} alt={book.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <div className="h-full w-full flex flex-col items-center justify-center text-slate-600 p-2 text-center">
                                                    <svg className="h-8 w-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="text-[10px]">No Cover</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                                <Link to={`/edit/${book.id}`} className="px-4 py-1.5 bg-white text-slate-900 rounded-full text-xs font-bold hover:bg-slate-100 transform translate-y-2 group-hover:translate-y-0 transition-transform">Edit</Link>
                                                <button onClick={() => handleDelete(book.id)} className="px-4 py-1.5 bg-red-500/20 text-red-300 border border-red-500/30 rounded-full text-xs font-bold hover:bg-red-500/30 transform translate-y-2 group-hover:translate-y-0 transition-transform delay-75">Delete</button>
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-slate-200 text-sm line-clamp-1 mb-0.5" title={book.title}>{book.title}</h4>
                                        <p className="text-xs text-slate-500 line-clamp-1">{book.author}</p>
                                    </div>
                                ))}
                            </div>
                            {filteredBooks.length === 0 && (
                                <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-dashed border-white/10">
                                    <p className="text-slate-400 mb-4">No books found matching your search.</p>
                                    <button onClick={() => setSearchQuery('')} className="text-primary hover:underline">Clear Search</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar (Hidden on Mobile) */}
                    <div className="hidden lg:block space-y-8">

                        {/* Highlight Card */}
                        <div className="bg-white text-slate-900 rounded-2xl p-6 relative overflow-hidden shadow-xl">
                            <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                                <div>
                                    <h3 className="text-xl font-bold mb-1 font-serif">The Lost World</h3>
                                    <p className="text-sm text-slate-600 italic">by Arthur Conan Doyle</p>
                                </div>
                                <div className="flex gap-1 text-yellow-500">
                                    {[1, 2, 3, 4, 5].map(i => <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                                </div>
                                <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium text-sm hover:bg-slate-800 transition-colors shadow-lg">
                                    Read Today
                                </button>
                            </div>
                            <img src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300" alt="Book" className="absolute top-0 right-0 w-32 h-full object-cover opacity-20 transform translate-x-10" />
                        </div>

                        {/* Community Card */}
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white text-center shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                            <h3 className="text-xl font-bold mb-3 relative z-10">Join a community of over 5000 Book Lovers</h3>
                            <button className="bg-white text-blue-600 px-6 py-2 rounded-full text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all relative z-10">
                                Join Now
                            </button>
                            <div className="mt-6 flex justify-center -space-x-3 relative z-10">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-8 w-8 rounded-full bg-slate-200 border-2 border-indigo-500"></div>
                                ))}
                            </div>
                        </div>

                        {/* Subscribe */}
                        <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
                            <h3 className="font-bold text-lg mb-4 text-center">Subscribe to Our Blog</h3>
                            <div className="flex gap-2">
                                <input type="email" placeholder="Email address" className="bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm w-full outline-none focus:border-primary" />
                                <button className="bg-primary p-2 rounded-lg text-white hover:bg-primary/90">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
