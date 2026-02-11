import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Dashboard() {
    const [books, setBooks] = useState([]);
    const { logout, user } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await api.get('/books');
            // Ensure we handle both null (if API returns null for empty list) and array
            setBooks(response.data || []);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch books');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this book?')) return;

        try {
            await api.delete(`/books/${id}`);
            toast.success('Book deleted successfully');
            fetchBooks(); // Refresh list
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete book');
        }
    };

    if (loading) return <div className="container min-h-screen flex items-center justify-center pt-20 text-center text-slate-400">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <header className="glass-card flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div className="text-center md:text-left">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">Dashboard</h1>
                    <p className="text-slate-400">Welcome back, manage your library.</p>
                </div>
                <div className="flex gap-4">
                    <Link to="/create" className="btn btn-primary">
                        + Add Book
                    </Link>
                    <button onClick={logout} className="btn btn-danger">
                        Logout
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.length === 0 ? (
                    <div className="glass-card col-span-full text-center py-12">
                        <p className="text-lg text-slate-300">No books found. Start by adding one!</p>
                    </div>
                ) : (
                    books.map((book) => (
                        <div key={book.id} className="glass-card flex flex-col h-full hover:bg-slate-800/80 transition-colors">
                            <div className="text-xl font-bold text-slate-100 mb-2">{book.title}</div>
                            <div className="text-slate-400 mb-4">by {book.author}</div>
                            <div className="text-sm text-slate-500 mb-6">
                                Published: {book.year}
                            </div>
                            <div className="mt-auto flex gap-3 pt-4 border-t border-white/10">
                                <Link to={`/edit/${book.id}`} className="btn btn-link text-primary hover:text-white px-0">
                                    Edit
                                </Link>
                                <button onClick={() => handleDelete(book.id)} className="btn btn-link text-red-400 hover:text-red-300 px-0 ml-auto">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
