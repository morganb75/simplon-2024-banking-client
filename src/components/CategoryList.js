import React, {useState, useEffect} from 'react';
import {useAuth} from '../contexts/AuthContext';
import {getCategories, createCategory, deleteCategory} from '../services/categoryService';
import Modal from './Modal';
import {useLocation, useNavigate} from "react-router-dom";

export default function CategoryList() {
    const {auth} = useAuth();
    const [categories, setCategories] = useState([]);
    const location = useLocation()
    const navigate = useNavigate()
    const [showNewForm, setShowNewForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        color: '#000000',
        limit: ''
    });
    const from = location.state?.from || ''
    const originForm = location.state?.originForm || null
    console.log (originForm)
    useEffect(() => {
        getCategories(auth).then(setCategories);
    }, [auth]);

    useEffect(() => {
        if (location.state?.openAddCategoryModal) {
            setShowNewForm(true)
        }
    }, [location.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createCategory(auth, formData);
            const updatedCategories = await getCategories(auth);
            setCategories(updatedCategories);
            setShowNewForm(false);
            setFormData({name: '', color: '#000000', limit: ''});
            navigate(from, {
                state: {
                    openTransactionModal: true,
                    originForm: originForm
                }
            });
        } catch (error) {
            console.error('Failed to create category:', error);
        }
    };

    const handleDelete = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await deleteCategory(auth, categoryId);
                setCategories(categories.filter(cat => cat.id !== categoryId));
            } catch (error) {
                console.error('Failed to delete category:', error);
            }
        }
    };

    return (
        <div className="category-list">
            <h2>Categories</h2>
            <button className="fab-button" onClick={() => setShowNewForm(true)}>Add a category</button>

            <div className="categories">
                {categories.map(category => (
                    <div key={category.id} className="category-item" style={{backgroundColor: category.color}}>
                        <div className="category-content">
                            <div className="category-name">{category.name}</div>
                            {category.limit && <div className="category-limit">Limit: ${category.limit}</div>}
                        </div>
                        <button
                            className="delete-button"
                            onClick={() => handleDelete(category.id)}
                            aria-label={`Delete ${category.name} category`}
                        >
                            🗑️
                        </button>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={showNewForm}
                onClose={() => setShowNewForm(false)}
                title="New Category"
            >
                <form onSubmit={handleSubmit} className="category-form">
                    <input
                        type="text"
                        placeholder="Category Name"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        required
                    />
                    <input
                        type="color"
                        value={formData.color}
                        onChange={e => setFormData({...formData, color: e.target.value})}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Monthly Limit (optional)"
                        value={formData.limit}
                        onChange={e => setFormData({...formData, limit: e.target.value})}
                    />
                    <button type="submit">Create Category</button>
                </form>
            </Modal>
        </div>
    );
}
