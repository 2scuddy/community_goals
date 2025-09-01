import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationBanner = ({ notifications, onDismiss }) => {
  const [visibleNotifications, setVisibleNotifications] = useState(notifications);

  const handleDismiss = (notificationId) => {
    setVisibleNotifications(prev => prev?.filter(n => n?.id !== notificationId));
    onDismiss(notificationId);
  };

  const getNotificationStyle = (type) => {
    switch (type) {
      case 'success':
        return 'bg-success/10 border-success/20 text-success';
      case 'warning':
        return 'bg-warning/10 border-warning/20 text-warning';
      case 'error':
        return 'bg-error/10 border-error/20 text-error';
      default:
        return 'bg-primary/10 border-primary/20 text-primary';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'error': return 'AlertCircle';
      default: return 'Info';
    }
  };

  if (visibleNotifications?.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      {visibleNotifications?.map((notification) => (
        <div
          key={notification?.id}
          className={`rounded-lg border p-4 ${getNotificationStyle(notification?.type)}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <Icon 
                name={getNotificationIcon(notification?.type)} 
                size={20} 
                className="flex-shrink-0 mt-0.5"
              />
              <div className="flex-1">
                <h4 className="font-medium text-sm mb-1">
                  {notification?.title}
                </h4>
                <p className="text-sm opacity-90">
                  {notification?.message}
                </p>
                {notification?.action && (
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={notification?.action?.onClick}
                    className="mt-2 p-0 h-auto text-current hover:text-current"
                  >
                    {notification?.action?.label}
                  </Button>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDismiss(notification?.id)}
              iconName="X"
              iconSize={16}
              className="text-current hover:text-current -mt-1 -mr-1"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationBanner;