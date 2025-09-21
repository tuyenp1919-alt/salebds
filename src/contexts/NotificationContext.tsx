import React, { createContext, useContext, useEffect, useState } from 'react';
import { Notification } from '@/types';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    // Load notifications from localStorage on init
    const stored = localStorage.getItem('notifications');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt),
          expiresAt: n.expiresAt ? new Date(n.expiresAt) : undefined,
        }));
      } catch {
        return [];
      }
    }
    return [];
  });

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Clean up expired notifications
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = new Date();
      setNotifications(prev => 
        prev.filter(notification => 
          !notification.expiresAt || notification.expiresAt > now
        )
      );
    }, 60000); // Check every minute

    return () => clearInterval(cleanupInterval);
  }, []);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const addNotification = (notificationData: Omit<Notification, 'id' | 'createdAt'>) => {
    const notification: Notification = {
      ...notificationData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      read: false,
    };

    setNotifications(prev => [notification, ...prev]);

    // Show browser notification if permission granted and high priority
    if (
      'Notification' in window && 
      Notification.permission === 'granted' && 
      (notification.priority === 'high' || notification.priority === 'urgent')
    ) {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon-32x32.png',
        badge: '/favicon-32x32.png',
        tag: notification.id,
        requireInteraction: notification.priority === 'urgent',
      });

      // Auto close after 5 seconds for non-urgent notifications
      if (notification.priority !== 'urgent') {
        setTimeout(() => {
          browserNotification.close();
        }, 5000);
      }

      // Handle click on browser notification
      browserNotification.onclick = () => {
        window.focus();
        if (notification.actionUrl) {
          window.location.href = notification.actionUrl;
        }
        markAsRead(notification.id);
        browserNotification.close();
      };
    }

    // Auto-remove low priority notifications after 5 minutes
    if (notification.priority === 'low') {
      setTimeout(() => {
        removeNotification(notification.id);
      }, 5 * 60 * 1000);
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Hook for creating different types of notifications
export const useNotificationHelpers = () => {
  const { addNotification } = useNotifications();

  return {
    notifySuccess: (title: string, message: string, actionUrl?: string) => {
      addNotification({
        userId: 'current-user', // This would come from auth context
        title,
        message,
        type: 'system',
        priority: 'medium',
        actionUrl,
      });
    },

    notifyError: (title: string, message: string) => {
      addNotification({
        userId: 'current-user',
        title,
        message,
        type: 'system',
        priority: 'high',
      });
    },

    notifyReminder: (title: string, message: string, actionUrl?: string) => {
      addNotification({
        userId: 'current-user',
        title,
        message,
        type: 'reminder',
        priority: 'medium',
        actionUrl,
      });
    },

    notifyLeadAssigned: (leadName: string, actionUrl?: string) => {
      addNotification({
        userId: 'current-user',
        title: 'Khách hàng mới được phân công',
        message: `Bạn đã được phân công phụ trách khách hàng: ${leadName}`,
        type: 'lead_assigned',
        priority: 'high',
        actionUrl,
      });
    },

    notifyDealUpdate: (dealInfo: string, actionUrl?: string) => {
      addNotification({
        userId: 'current-user',
        title: 'Cập nhật giao dịch',
        message: dealInfo,
        type: 'deal_update',
        priority: 'medium',
        actionUrl,
      });
    },

    notifyAchievement: (achievement: string) => {
      addNotification({
        userId: 'current-user',
        title: '🎉 Chúc mừng!',
        message: achievement,
        type: 'achievement',
        priority: 'medium',
      });
    },
  };
};