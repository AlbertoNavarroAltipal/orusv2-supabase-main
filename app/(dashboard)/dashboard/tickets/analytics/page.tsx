"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, DonutChart, Legend, type CustomTooltipProps as ChartTooltipProps } from "@tremor/react";
import {
  Edit2,
  Users,
  Award,
  ShieldCheck,
  ShieldOff,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  XCircle,
  ListChecks,
  Hourglass,
  TrendingUp,
  Activity,
  Annoyed,
  PieChart,
  BarChart2,
  Palette,
} from "lucide-react";

// Datos de ejemplo para los gráficos y KPIs
const kpiData = {
  overdueTickets: 6,
  ticketsDueToday: 0,
  openTickets: 11,
  ticketsOnHold: 57,
  unassignedTickets: 11,
  ticketsImWatching: 0,
};

const ticketsByPriorityData = [
  { name: "Baja", value: 13 },
  { name: "Media", value: 2 },
  { name: "Alta", value: 4 },
];
const totalPriorityTickets = ticketsByPriorityData.reduce(
  (sum, item) => sum + item.value,
  0
);

const ticketsByStatusDonutData = [
  { name: "Abierto", value: 11 },
  { name: "Pendiente", value: 2 },
  { name: "Cerrado", value: 2 },
  { name: "En Progreso", value: 5 },
];
const totalStatusDonutTickets = ticketsByStatusDonutData.reduce(
  (sum, item) => sum + item.value,
  0
);

const ticketsByStatusBarData = [
  { name: "Abierto", value: 11, fill: "var(--color-blue-600)" },
  { name: "Pendiente", value: 2, fill: "var(--color-yellow-500)" },
  { name: "Cerrado", value: 2, fill: "var(--color-emerald-500)" },
  { name: "Resuelto", value: 0, fill: "var(--color-slate-400)" }, // Usar un color neutro para cero
  { name: "En Progreso", value: 5, fill: "var(--color-purple-500)" },
];

const achievementsData = {
  score: 10,
  level: "Principiante",
  nextLevelScore: 90,
  badges: false,
};

const supplierManagementData = {
  available: 1,
  notAvailable: 1,
};

const valueFormatter = (number: number) =>
  `${Intl.NumberFormat("us").format(number).toString()}`;

// Componente para las tarjetas KPI con iconos y colores
const KpiCard = ({
  title,
  value,
  icon: Icon,
  colorClass,
  description,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  colorClass: string;
  description?: string;
}) => (
  <Card
    className={`shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 ${colorClass}`}
  >
    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon
        className={`h-5 w-5 ${colorClass
          .replace("border-l-4", "")
          .replace("border-", "text-")}`}
      />
    </CardHeader>
    <CardContent>
      <div className="text-4xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground pt-1">{description}</p>
      )}
    </CardContent>
  </Card>
);

// Tooltip personalizado para gráficos de dona
const customDonutTooltip = ({ active, payload }: ChartTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const percentage = (
      (data.value /
        (data.name === "Baja" || data.name === "Media" || data.name === "Alta"
          ? totalPriorityTickets
          : totalStatusDonutTickets)) *
      100
    ).toFixed(1);
    return (
      <div className="bg-white p-3 shadow-lg rounded-md border border-gray-200">
        <p className="text-sm font-semibold text-gray-700">{data.name}</p>
        <p className="text-sm text-gray-500">
          Tickets: {valueFormatter(data.value)} ({percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

// Tooltip personalizado para gráfico de barras
const customBarTooltip = ({ active, payload, label }: ChartTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-lg rounded-md border border-gray-200">
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        <p className="text-sm text-gray-500">
          Tickets: {valueFormatter(payload[0].value as number)}
        </p>
      </div>
    );
  }
  return null;
};

export default function TicketsAnalyticsPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8 bg-slate-50 min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 mb-8">
        <div className="flex items-center space-x-3">
          <Activity className="h-8 w-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
            Análisis de Tickets
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-white"
          >
            <Edit2 className="h-4 w-4 mr-2" /> Personalizar Dashboard
          </Button>
          <Button variant="ghost" className="text-slate-600 hover:text-primary">
            Actividad Reciente
          </Button>
          <Button variant="ghost" className="text-slate-600 hover:text-primary">
            Anuncios
          </Button>
        </div>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        <KpiCard
          title="Tickets Vencidos"
          value={kpiData.overdueTickets}
          icon={AlertTriangle}
          colorClass="border-red-500 text-red-500"
          description="Requieren atención urgente"
        />
        <KpiCard
          title="Tickets para Hoy"
          value={kpiData.ticketsDueToday}
          icon={Clock}
          colorClass="border-amber-500 text-amber-500"
          description="Plazo vence hoy"
        />
        <KpiCard
          title="Tickets Abiertos"
          value={kpiData.openTickets}
          icon={ListChecks}
          colorClass="border-blue-600 text-blue-600"
          description="Actualmente sin resolver"
        />
        <KpiCard
          title="Tickets en Espera"
          value={kpiData.ticketsOnHold}
          icon={Hourglass}
          colorClass="border-purple-500 text-purple-500"
          description="Pausados o esperando respuesta"
        />
        <KpiCard
          title="Sin Asignar"
          value={kpiData.unassignedTickets}
          icon={Annoyed}
          colorClass="border-orange-500 text-orange-500"
          description="Necesitan asignación de agente"
        />
        <KpiCard
          title="Siguiendo"
          value={kpiData.ticketsImWatching}
          icon={Eye}
          colorClass="border-teal-500 text-teal-500"
          description="Tickets que monitoreas"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 col-span-1 lg:col-span-1 rounded-lg overflow-hidden">
          <CardHeader className="p-5 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-sky-100 rounded-md">
                <Palette className="h-6 w-6 text-sky-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-slate-700">
                Tickets por Prioridad
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center pt-6 pb-6 bg-white rounded-b-lg">
            <DonutChart
              data={ticketsByPriorityData}
              category="value"
              index="name"
              valueFormatter={valueFormatter}
              colors={["cyan", "orange", "rose"]}
              className="w-60 h-60 drop-shadow-lg"
              variant="pie" // Cambiado a 'pie' para un look diferente, o mantener 'donut'
              customTooltip={customDonutTooltip}
            />
            <div className="text-center mt-5">
              <p className="text-5xl font-bold text-slate-800">
                {totalPriorityTickets}
              </p>
              <p className="text-lg text-muted-foreground">Tickets Totales</p>
            </div>
            <Legend
              categories={ticketsByPriorityData.map(
                (p) =>
                  `${p.name} (${(
                    (p.value / totalPriorityTickets) *
                    100
                  ).toFixed(0)}%)`
              )}
              colors={["cyan", "orange", "rose"]}
              className="mt-6 text-sm flex flex-wrap justify-center gap-x-4 gap-y-2"
            />
          </CardContent>
        </Card>
        <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 col-span-1 lg:col-span-1 rounded-lg overflow-hidden">
          <CardHeader className="p-5 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-100 rounded-md">
                <PieChart className="h-6 w-6 text-emerald-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-slate-700">
                Tickets por Estado (General)
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center pt-6 pb-6 bg-white rounded-b-lg">
            <DonutChart
              data={ticketsByStatusDonutData}
              category="value"
              index="name"
              valueFormatter={valueFormatter}
              colors={["indigo", "amber", "lime", "violet"]}
              className="w-60 h-60 drop-shadow-lg"
              variant="donut" // Mantener 'donut' o probar 'pie'
              customTooltip={customDonutTooltip}
            />
            <div className="text-center mt-5">
              <p className="text-5xl font-bold text-slate-800">
                {totalStatusDonutTickets}
              </p>
              <p className="text-lg text-muted-foreground">Tickets Totales</p>
            </div>
            <Legend
              categories={ticketsByStatusDonutData.map(
                (s) =>
                  `${s.name} (${(
                    (s.value / totalStatusDonutTickets) *
                    100
                  ).toFixed(0)}%)`
              )}
              colors={["indigo", "amber", "lime", "violet"]}
              className="mt-6 text-sm flex flex-wrap justify-center gap-x-4 gap-y-2"
            />
          </CardContent>
        </Card>
        <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 col-span-1 lg:col-span-1 rounded-lg overflow-hidden">
          <CardHeader className="p-5 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-md">
                <BarChart2 className="h-6 w-6 text-indigo-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-slate-700">
                Distribución de Tickets por Estado
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 pb-6 bg-white rounded-b-lg">
            <BarChart
              data={ticketsByStatusBarData}
              index="name"
              categories={["value"]}
              colors={["indigo", "amber", "lime", "slate", "violet"]}
              valueFormatter={valueFormatter}
              yAxisWidth={40}
              showLegend={false}
              className="h-80 drop-shadow-sm" // Aumentado altura y sombra sutil
              customTooltip={customBarTooltip}
              showAnimation={true}
            />
          </CardContent>
        </Card>
      </div>

      {/* Otros Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold text-slate-700">
              Mis Logros
            </CardTitle>
            <Button
              variant="link"
              size="sm"
              className="text-primary hover:text-primary-dark"
            >
              Mostrar Todos
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <svg className="w-24 h-24">
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    fill="transparent"
                    stroke="#e2e8f0"
                    strokeWidth="8"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    fill="transparent"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeDasharray={`${
                      (achievementsData.score / 100) * 2 * Math.PI * 42
                    } ${2 * Math.PI * 42}`}
                    strokeDashoffset="0"
                    transform="rotate(-90 48 48)"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1e40af" />
                    </linearGradient>
                  </defs>
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dy=".3em"
                    className="text-2xl font-bold fill-primary"
                  >
                    {achievementsData.score}
                  </text>
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xl font-semibold text-slate-800">
                  {achievementsData.level}
                </p>
                <p className="text-sm text-muted-foreground">
                  Necesitas{" "}
                  {achievementsData.nextLevelScore - achievementsData.score}{" "}
                  puntos más para{" "}
                  <span className="font-semibold text-primary">Intermedio</span>
                  .
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-2.5 rounded-full"
                    style={{
                      width: `${
                        (achievementsData.score /
                          achievementsData.nextLevelScore) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
            {!achievementsData.badges && (
              <div className="mt-6 p-4 bg-gradient-to-r from-sky-50 to-cyan-50 border border-sky-200 rounded-lg text-center text-sm text-sky-700 flex items-center justify-center space-x-2 shadow-sm">
                <Award className="h-6 w-6 text-sky-500" />
                <span>
                  ¡Sigue esforzándote! Aún no has conseguido insignias.
                </span>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold text-slate-700">
              Tabla de Líderes del Mes
            </CardTitle>
            <Button
              variant="link"
              size="sm"
              className="text-primary hover:text-primary-dark"
            >
              Más Info
            </Button>
          </CardHeader>
          <CardContent className="text-center pt-4">
            <div className="p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-lg">
              <Users className="h-20 w-20 text-indigo-400 mx-auto mb-4" />
              <p className="text-xl font-semibold text-slate-800 mb-1">
                ¡El Reto Continúa!
              </p>
              <p className="text-sm text-muted-foreground px-4">
                Tu equipo está buscando al próximo campeón de soporte.
                ¡Demuestra que eres tú!
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold text-slate-700">
              Estado del Equipo de Proveedores
            </CardTitle>
            <Button
              variant="link"
              size="sm"
              className="text-primary hover:text-primary-dark"
            >
              Más Info
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground mb-6 text-center">
              Disponibilidad del equipo de gestión de proveedores.
            </p>
            <div className="flex justify-around items-center space-x-4">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200 flex-1">
                <ShieldCheck className="h-10 w-10 text-green-500 mx-auto mb-2" />
                <p className="text-4xl font-bold text-green-600">
                  {supplierManagementData.available}
                </p>
                <p className="text-sm text-green-700 font-medium">
                  Disponibles
                </p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200 flex-1">
                <ShieldOff className="h-10 w-10 text-red-500 mx-auto mb-2" />
                <p className="text-4xl font-bold text-red-600">
                  {supplierManagementData.notAvailable}
                </p>
                <p className="text-sm text-red-700 font-medium">
                  No Disponibles
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
