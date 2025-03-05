import React, {useState, useEffect} from 'react';
import {useAuth} from '../contexts/AuthContext';
import {getTransactions, createTransaction} from '../services/transactionService';
import {getCategories} from '../services/categoryService';
import {getPaymentMethods} from '../services/paymentMethodService';
import Modal from './Modal';
import {useLocation, useNavigate} from "react-router-dom";

export default function TransactionList() {
    const {auth} = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [showNewForm, setShowNewForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        amount: null,
        date: new Date().toISOString().split('T')[0],
        categoryId: null,
        paymentMethodId: null
    });
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (auth) {
            Promise.all([
                getTransactions(auth),
                getCategories(auth),
                getPaymentMethods(auth)
            ]).then(([transactionsData, categoriesData, paymentMethodsData]) => {
                setTransactions(transactionsData);
                setCategories(categoriesData);
                setPaymentMethods(paymentMethodsData);
            });
        }
    }, [auth]);

    useEffect(() => {
        if (location.state?.openTransactionModal) {
            setFormData(location.state?.originForm)
            setShowNewForm(true)
        }
    }, [location.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createTransaction(auth, formData);
            const updatedTransactions = await getTransactions(auth);
            setTransactions(updatedTransactions);
            setShowNewForm(false);
            setFormData({
                title: '',
                description: '',
                amount: null,
                date: new Date().toISOString().split('T')[0],
                categoryId: null,
                paymentMethodId: null
            });
        } catch (error) {
            console.error('Failed to create transaction:', error);
        }
    };

    const formatAmount = (amount) => {
        return Number(amount).toLocaleString('en-EU', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const groupedTransactions = transactions.reduce((groups, transaction) => {
        const date = transaction.date.substring(0, 10);
        if (!groups[date]) groups[date] = [];
        groups[date].push(transaction);
        return groups;
    }, {});

    const getCategoryColor = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.color : '#gray';
    };

    const handleChangePayementMethod = (e) => {
        if (e.target.value === "add-new") {
            navigate('/payment-methods', {
                state: {
                    openAddPayementModal: true,
                    from: location.pathname,
                    originForm: formData
                }
            })
        } else {
            setFormData({...formData, paymentMethodId: Number(e.target.value)})
        }
    }

    const handleChangeCategory = (e) => {
        if (e.target.value === "add-new") {
            navigate('/categories', {
                state: {
                    openAddCategoryModal: true,
                    from: location.pathname,
                    originForm: formData
                }
            })
        } else {
            setFormData({...formData, categoryId: Number(e.target.value)})
        }
    }

    return (
        <div className="transaction-list">
            <h2>Transactions</h2>
            <button className="fab-button" onClick={() => setShowNewForm(true)}>Add a Transaction</button>

            {Object.entries(groupedTransactions).map(([date, transactions]) => (
                <div key={date} className="date-group">
                    <h3>{date}</h3>
                    {transactions.map(transaction => (
                        <div key={transaction.id} className="transaction-item">
                            <div
                                className="category-color-indicator"
                                style={{backgroundColor: getCategoryColor(transaction.categoryId)}}
                            />
                            <div className="transaction-content">
                                <div className="transaction-title">{transaction.title}</div>
                                <div className="transaction-amount">{formatAmount(transaction.amount)}€</div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}

            <Modal
                isOpen={showNewForm}
                onClose={() => setShowNewForm(false)}
                title="New Transaction"
            >
                <form onSubmit={handleSubmit} className="transaction-form">
                    <input
                        type="text"
                        placeholder="Title"
                        value={formData?.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={formData?.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                    <input
                        type="number"
                        placeholder="Amount"
                        value={formData?.amount || ''}
                        step="0.01"
                        onChange={e => setFormData({...formData, amount: Number(e.target.value)})}
                        required
                    />
                    <input
                        type="date"
                        value={formData?.date}
                        onChange={e => setFormData({...formData, date: e.target.value})}
                        required
                    />
                    <select
                        value={formData?.categoryId}
                        onChange={handleChangeCategory}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                        <option value="add-new">
                            ➕ Add new category
                        </option>
                    </select>
                    <select
                        value={formData?.paymentMethodId}
                        onChange={handleChangePayementMethod}
                        required
                    >
                        <option value="">Select Payment Method</option>
                        {paymentMethods.map(method => (
                            <option key={method.id} value={method.id}>
                                {method.name} (**** **** **** {method.lastDigits})
                            </option>
                        ))}
                        <option value="add-new">
                            ➕ Ajouter a new payement method
                        </option>
                    </select>
                    <button type="submit">Create Transaction</button>
                </form>
            </Modal>
        </div>
    );
}
