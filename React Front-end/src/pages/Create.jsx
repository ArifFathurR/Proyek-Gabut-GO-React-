import { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function Create() {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [year, setYear] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/books', {
                title,
                author,
                year: parseInt(year) // Ensure year is sent as integer
            });
            toast.success('Book created successfully');
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            toast.error('Failed to create book');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Add New Book</h2>
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
                            Create Book
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
