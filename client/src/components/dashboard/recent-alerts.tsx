import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock, Info } from "lucide-react";

export default function RecentAlerts() {
  const alerts = [
    {
      id: 1,
      type: 'error',
      title: 'Payment Overdue',
      message: '5 members have overdue payments',
      time: '2 hours ago',
      icon: AlertTriangle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-500'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Auction Reminder',
      message: 'Gold Group A auction in 2 days',
      time: '1 day ago',
      icon: Clock,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-500'
    },
    {
      id: 3,
      type: 'info',
      title: 'New Member Added',
      message: 'John Doe joined Silver Group C',
      time: '3 days ago',
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-500'
    }
  ];

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Recent Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => {
            const IconComponent = alert.icon;
            return (
              <div
                key={alert.id}
                className={`flex items-start space-x-3 p-3 ${alert.bgColor} border ${alert.borderColor} rounded-lg`}
              >
                <IconComponent className={`${alert.iconColor} text-sm mt-1`} size={16} />
                <div>
                  <p className={`text-sm font-medium ${alert.textColor}`}>{alert.title}</p>
                  <p className={`text-xs ${alert.textColor.replace('800', '600')}`}>{alert.message}</p>
                  <p className={`text-xs ${alert.textColor.replace('800', '500')} mt-1`}>{alert.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
