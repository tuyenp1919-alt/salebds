import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import CustomerList from '@/features/customers/components/CustomerList';
import CustomerForm from '@/features/customers/components/CustomerForm';
import { customerService } from '@/features/customers/services/customerService';
import { Customer } from '@/types';
import { LoadingSpinner } from '@/components/common';

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Load customers on component mount
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerService.getCustomers({
        limit: 100, // Load all for now, implement pagination later
        sortBy: 'created',
        sortOrder: 'desc',
      });
      setCustomers(response.customers);
    } catch (error) {
      console.error('Error loading customers:', error);
      toast.error('Không thể tải danh sách khách hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setShowForm(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
      return;
    }

    try {
      await customerService.deleteCustomer(id);
      setCustomers(prev => prev.filter(c => c.id !== id));
      toast.success('Đã xóa khách hàng thành công');
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Không thể xóa khách hàng');
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      setFormLoading(true);

      if (editingCustomer) {
        // Update existing customer
        const updatedCustomer = await customerService.updateCustomer(
          editingCustomer.id,
          data
        );
        setCustomers(prev =>
          prev.map(c => c.id === editingCustomer.id ? updatedCustomer : c)
        );
        toast.success('Đã cập nhật thông tin khách hàng');
      } else {
        // Create new customer
        const newCustomer = await customerService.createCustomer(data);
        setCustomers(prev => [newCustomer, ...prev]);
        toast.success('Đã thêm khách hàng mới thành công');
      }

      setShowForm(false);
      setEditingCustomer(null);
    } catch (error) {
      console.error('Error saving customer:', error);
      toast.error(
        editingCustomer 
          ? 'Không thể cập nhật thông tin khách hàng' 
          : 'Không thể thêm khách hàng mới'
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCustomer(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <CustomerList
          customers={customers}
          onAddCustomer={handleAddCustomer}
          onEditCustomer={handleEditCustomer}
          onDeleteCustomer={handleDeleteCustomer}
        />
      </motion.div>

      {/* Customer Form Modal */}
      <AnimatePresence>
        {showForm && (
          <CustomerForm
            customer={editingCustomer}
            onSubmit={handleFormSubmit}
            onClose={handleFormClose}
            isLoading={formLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Customers;