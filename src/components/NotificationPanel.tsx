import { X, Bell, CheckCircle2, AlertCircle, Info, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

type Notification = {
  id: string;
  type: "success" | "warning" | "info" | "alert";
  title: string;
  message: string;
  time: string;
  read: boolean;
};

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "alert",
    title: "Nova Intimação",
    message: "Intimação para apresentação de memoriais - Processo 0001234-56.2024",
    time: "Há 5 minutos",
    read: false
  },
  {
    id: "2",
    type: "warning",
    title: "Prazo próximo",
    message: "Tarefa 'Revisar contrato empresa XYZ' vence em 2 dias",
    time: "Há 1 hora",
    read: false
  },
  {
    id: "3",
    type: "success",
    title: "Relatório gerado",
    message: "Relatório financeiro Q3 foi gerado com sucesso",
    time: "Há 3 horas",
    read: true
  },
  {
    id: "4",
    type: "info",
    title: "Atualização do sistema",
    message: "Nova versão disponível com melhorias de desempenho",
    time: "Ontem",
    read: true
  },
  {
    id: "5",
    type: "alert",
    title: "Nova Publicação",
    message: "Sentença publicada - Processo 0007890-12.2024",
    time: "Há 2 dias",
    read: true
  }
];

export function NotificationPanel({ open, onClose }: NotificationPanelProps) {
  if (!open) return null;

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case "warning":
        return <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      case "alert":
        return <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              <h2 className="text-gray-900 dark:text-white">Notificações</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Você tem {unreadCount} {unreadCount === 1 ? 'notificação não lida' : 'notificações não lidas'}
            </p>
          )}
        </div>

        {/* Notifications List */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {mockNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                  notification.read
                    ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    : 'bg-gray-50 dark:bg-gray-800/70 border-gray-300 dark:border-gray-600'
                }`}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <Badge className="bg-black dark:bg-white text-white dark:text-black w-2 h-2 p-0 rounded-full" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              // Mark all as read logic
              onClose();
            }}
          >
            Marcar todas como lidas
          </Button>
        </div>
      </div>
    </>
  );
}