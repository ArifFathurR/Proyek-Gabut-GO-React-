import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function Edit() {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [year, setYear] = useState('');
    const [image_url, setImageUrl] = useState('');
    const [status, setStatus] = useState('on_hold');
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
            setImageUrl(book.image_url || '');
            setStatus(book.status || 'on_hold');
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch book details');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setImageUrl(response.data.url);
            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error('Failed to upload image');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/books/${id}`, {
                title,
                author,
                year: parseInt(year),
                image_url,
                status
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
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Book Cover Image</label>
                        <input
                            type="file"
                            className="form-input"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        {image_url && (
                            <div className="mt-2">
                                <p className="text-xs text-slate-500 mb-1">Preview:</p>
                                <img src={image_url} alt="Preview" className="h-32 rounded border border-slate-600" />
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Status</label>
                        <select
                            className="form-input"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="on_hold">On Hold</option>
                            <option value="reading">Reading</option>
                            <option value="finished">Finished</option>
                        </select>
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
