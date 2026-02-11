import { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const [user, setUser] = useState({
        username: '',
        bio: '',
        avatar_url: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/profile');
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
        toast.success('Logged out successfully');
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        setUploading(true);

        try {
            const response = await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUser(prev => ({ ...prev, avatar_url: response.data.url }));
            toast.success('Avatar uploaded');
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error('Failed to upload avatar');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put('/profile', {
                bio: user.bio,
                avatar_url: user.avatar_url
            });
            toast.success('Profile updated');
            setIsEditing(false);
        } catch (error) {
            console.error('Update failed:', error);
            toast.error('Failed to update profile');
        }
    };

    if (loading) return <div className="text-center p-8">Loading...</div>;

    return (
        <div className="min-h-screen p-4 pb-24">
            <div className="glass-card max-w-md mx-auto relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary to-secondary opacity-20"></div>

                <div className="relative pt-12 flex flex-col items-center">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full border-4 border-slate-800 overflow-hidden bg-slate-700 shadow-xl">
                            {user.avatar_url ? (
                                <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl text-slate-500 font-bold">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        {isEditing && (
                            <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs font-medium">Change</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploading} />
                            </label>
                        )}
                    </div>

                    <h2 className="text-2xl font-bold mt-4 text-white">{user.username}</h2>

                    {!isEditing ? (
                        <>
                            <p className="text-slate-400 mt-2 text-center px-4">
                                {user.bio || "No bio yet."}
                            </p>
                            <div className="mt-8 flex gap-4 w-full">
                                <button onClick={() => setIsEditing(true)} className="btn btn-primary flex-1">
                                    Edit Profile
                                </button>
                                <button onClick={handleLogout} className="btn btn-danger flex-1">
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <form onSubmit={handleSubmit} className="w-full mt-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Bio</label>
                                <textarea
                                    className="form-input min-h-[100px]"
                                    value={user.bio}
                                    onChange={(e) => setUser({ ...user, bio: e.target.value })}
                                    placeholder="Tell us about yourself..."
                                />
                            </div>
                            <div className="flex gap-4 pt-2">
                                <button type="button" onClick={() => setIsEditing(false)} className="btn btn-link flex-1">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary flex-1" disabled={uploading}>
                                    Save
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
