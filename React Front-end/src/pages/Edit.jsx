import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function Edit() {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [year, setYear] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        fetchBook();
    }, [id]);

    const fetchBook = async () => {
        try {
            const response = await api.get(`/books/${id}`);
            const book = response.data;
            setTitle(book.title);
            setAuthor(book.author);
            setYear(book.year);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch book details');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/books/${id}`, {
                title,
                author,
                year: parseInt(year)
            });
            toast.success('Book updated successfully');
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update book');
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center pt-20 text-center text-slate-400">Loading...</div>;

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Edit Book</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Title</label>
                        <input
                            type="text"
                            className="form-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="Book Title"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Author</label>
                        <input
                            type="text"
                            className="form-input"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            required
                            placeholder="Author Name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Year</label>
                        <input
                            type="number"
                            className="form-input"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            required
                            placeholder="Publication Year"
                        />
                    </div>
                    <div className="flex gap-4 pt-4">
                        <Link to="/dashboard" className="btn btn-link flex-1">
                            Cancel
                        </Link>
                        <button type="submit" className="btn btn-primary flex-1">
                            Update Book
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
