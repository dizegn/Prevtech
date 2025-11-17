import { useState } from "react";
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Users, MoreVertical } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar } from "./ui/calendar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Breadcrumb } from "./Breadcrumb";
import { EditarEventoModal } from "./EditarEventoModal";
import { ExcluirEventoModal } from "./ExcluirEventoModal";
import { DetalhesProcessoPanel } from "./DetalhesProcessoPanel";
import { toast } from "sonner@2.0.3";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  attendees: string[];
  type: "audiencia" | "reuniao" | "prazo" | "compromisso";
  color: string;
};

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Audiência - Processo 0001234-56.2024",
    description: "Audiência de instrução e julgamento",
    date: "2025-10-09",
    time: "10:00",
    duration: 120,
    location: "2ª Vara Cível - SP",
    attendees: ["Dra. Maria Santos", "Cliente ABC"],
    type: "audiencia",
    color: "red"
  },
  {
    id: "2",
    title: "Reunião - Estratégia Processual",
    description: "Discussão sobre andamento do caso",
    date: "2025-10-10",
    time: "14:00",
    duration: 60,
    location: "Escritório - Sala 3",
    attendees: ["Dr. João Silva", "Equipe Jurídica"],
    type: "reuniao",
    color: "gray"
  },
  {
    id: "3",
    title: "Prazo - Recurso Especial",
    description: "Prazo final para protocolo",
    date: "2025-10-11",
    time: "17:00",
    duration: 0,
    location: "STJ",
    attendees: ["Dra. Ana Costa"],
    type: "prazo",
    color: "orange"
  },
  {
    id: "4",
    title: "Audiência - Processo 0002345-67.2024",
    description: "Audiência inicial",
    date: "2025-10-14",
    time: "09:00",
    duration: 90,
    location: "1ª Vara do Trabalho - RJ",
    attendees: ["Dr. Pedro Lima", "Empresa XYZ"],
    type: "audiencia",
    color: "red"
  },
  {
    id: "5",
    title: "Audiência - Processo 0005678-90.2024",
    description: "Audiência de conciliação",
    date: "2025-10-15",
    time: "15:00",
    duration: 60,
    location: "4ª Vara Cível - SP",
    attendees: ["Dr. João Silva", "Indústria Gamma"],
    type: "audiencia",
    color: "red"
  },
  {
    id: "6",
    title: "Compromisso - Visita ao Cliente",
    description: "Visita técnica às instalações",
    date: "2025-10-12",
    time: "11:00",
    duration: 180,
    location: "Sede do Cliente - Campinas",
    attendees: ["Dra. Ana Costa", "Equipe Técnica"],
    type: "compromisso",
    color: "green"
  },
];

interface AgendaScreenProps {
  onNewEvent?: () => void;
  onNavigateHome?: () => void;
}

export function AgendaScreen({ onNewEvent, onNavigateHome }: AgendaScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("week");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Estados para os modais e painel
  const [editarEventoOpen, setEditarEventoOpen] = useState(false);
  const [excluirEventoOpen, setExcluirEventoOpen] = useState(false);
  const [detalhesProcessoOpen, setDetalhesProcessoOpen] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>(mockEvents);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "audiencia": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "reuniao": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
      case "prazo": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      case "compromisso": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "audiencia": return "Audiência";
      case "reuniao": return "Reunião";
      case "prazo": return "Prazo";
      case "compromisso": return "Compromisso";
      default: return type;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const handlePreviousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  const getMonthYearLabel = () => {
    return currentMonth.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric"
    });
  };

  // Funções de ação do dropdown
  const handleEditarEvento = (evento: Event) => {
    setEventoSelecionado(evento);
    setEditarEventoOpen(true);
  };

  const handleExcluirEvento = (evento: Event) => {
    setEventoSelecionado(evento);
    setExcluirEventoOpen(true);
  };

  const handleVisualizarProcesso = (evento: Event) => {
    setEventoSelecionado(evento);
    setDetalhesProcessoOpen(true);
  };

  // Callbacks para os modais
  const handleSalvarEvento = (eventoAtualizado: Event) => {
    setEvents(events.map(e => e.id === eventoAtualizado.id ? eventoAtualizado : e));
    toast.success("Evento atualizado com sucesso!");
  };

  const handleConfirmarExclusao = (eventoId: string) => {
    setEvents(events.filter(e => e.id !== eventoId));
    toast.success("Evento excluído com sucesso!");
  };

  // Simular loading
  if (isLoading) {
    return (
      <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { label: "Agenda", onClick: onNavigateHome }
          ]}
        />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 dark:text-white">Agenda</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gerencie seus compromissos e prazos judiciais
            </p>
          </div>
          <Button 
            className="gap-2 bg-black hover:bg-black/90 text-white"
            onClick={onNewEvent}
          >
            <Plus className="w-4 h-4" />
            Novo Evento
          </Button>
        </div>

        {/* Calendar and Events */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900 dark:text-white capitalize">
                  {getMonthYearLabel()}
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8"
                    onClick={handlePreviousMonth}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8"
                    onClick={handleNextMonth}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                className="rounded-md"
              />
            </div>

            {/* Legend */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mt-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm mb-3 text-gray-900 dark:text-white">Legenda</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Audiência</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Reunião</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Prazo</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Compromisso</span>
                </div>
              </div>
            </div>
          </div>

          {/* Events List */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              {/* Tabs */}
              <Tabs defaultValue="all" className="w-full">
                <div className="border-b border-gray-200 dark:border-gray-700 px-6">
                  <TabsList className="bg-transparent">
                    <TabsTrigger value="all">Todos</TabsTrigger>
                    <TabsTrigger value="audiencia">Audiências</TabsTrigger>
                    <TabsTrigger value="reuniao">Reuniões</TabsTrigger>
                    <TabsTrigger value="prazo">Prazos</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="all" className="p-6 mt-0">
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className={`w-1 h-full rounded-full bg-${event.color}-500`}></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="text-gray-900 dark:text-white mb-1">
                                {event.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {event.description}
                              </p>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                  <CalendarIcon className="w-4 h-4" />
                                  {formatDate(event.date)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {event.time} {event.duration > 0 && `(${event.duration}min)`}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {event.location}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getTypeColor(event.type)}>
                                {getTypeLabel(event.type)}
                              </Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="w-8 h-8">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleVisualizarProcesso(event)}>
                                    Visualizar Processo
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEditarEvento(event)}>
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleExcluirEvento(event)}
                                    className="text-red-600"
                                  >
                                    Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="audiencia" className="p-6 mt-0">
                  <div className="space-y-4">
                    {events.filter(e => e.type === "audiencia").map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="w-1 h-full rounded-full bg-red-500"></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="text-gray-900 dark:text-white mb-1">
                                {event.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {event.description}
                              </p>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                  <CalendarIcon className="w-4 h-4" />
                                  {formatDate(event.date)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {event.time} ({event.duration}min)
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {event.location}
                                </div>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="w-8 h-8">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleVisualizarProcesso(event)}>
                                  Visualizar Processo
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditarEvento(event)}>
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleExcluirEvento(event)}
                                  className="text-red-600"
                                >
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="reuniao" className="p-6 mt-0">
                  <div className="space-y-4">
                    {events.filter(e => e.type === "reuniao").map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="w-1 h-full rounded-full bg-gray-500"></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="text-gray-900 dark:text-white mb-1">
                                {event.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {event.description}
                              </p>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                  <CalendarIcon className="w-4 h-4" />
                                  {formatDate(event.date)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {event.time} ({event.duration}min)
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {event.location}
                                </div>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="w-8 h-8">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleVisualizarProcesso(event)}>
                                  Visualizar Processo
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditarEvento(event)}>
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleExcluirEvento(event)}
                                  className="text-red-600"
                                >
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="prazo" className="p-6 mt-0">
                  <div className="space-y-4">
                    {events.filter(e => e.type === "prazo").map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="w-1 h-full rounded-full bg-orange-500"></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="text-gray-900 dark:text-white mb-1">
                                {event.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {event.description}
                              </p>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                  <CalendarIcon className="w-4 h-4" />
                                  {formatDate(event.date)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {event.time}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {event.location}
                                </div>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="w-8 h-8">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleVisualizarProcesso(event)}>
                                  Visualizar Processo
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditarEvento(event)}>
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleExcluirEvento(event)}
                                  className="text-red-600"
                                >
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Modais e Painéis */}
      <EditarEventoModal
        open={editarEventoOpen}
        onOpenChange={setEditarEventoOpen}
        evento={eventoSelecionado}
        onSalvar={handleSalvarEvento}
      />

      <ExcluirEventoModal
        open={excluirEventoOpen}
        onOpenChange={setExcluirEventoOpen}
        evento={eventoSelecionado}
        onConfirmar={handleConfirmarExclusao}
      />

      <DetalhesProcessoPanel
        open={detalhesProcessoOpen}
        onOpenChange={setDetalhesProcessoOpen}
        processo={eventoSelecionado ? {
          id: "1",
          number: eventoSelecionado.title.includes("Processo") 
            ? eventoSelecionado.title.match(/\d{7}-\d{2}\.\d{4}/)?.[0] || "0001234-56.2024"
            : "0001234-56.2024",
          title: eventoSelecionado.type === "audiencia" ? "Aposentadoria por Tempo de Contribuição" : "Revisão de Benefício",
          client: "Cliente Exemplo",
          court: eventoSelecionado.location,
          status: "ativo",
          phase: "Em Andamento",
          value: 0,
          lastUpdate: eventoSelecionado.date,
          nextHearing: eventoSelecionado.type === "audiencia" ? `${eventoSelecionado.date} às ${eventoSelecionado.time}` : undefined,
          responsible: eventoSelecionado.attendees[0] || "Dr. João Silva"
        } : null}
        onEditar={() => console.log("Editar processo")}
        onExcluir={() => console.log("Excluir processo")}
        onCriarTarefa={() => console.log("Criar tarefa")}
      />
    </div>
  );
}