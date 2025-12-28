'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, TrendingUp, Users, MousePointer, Eye } from 'lucide-react';

interface DailyStat {
    date: string;
    views: number;
    clicks: number;
}

interface TopHotel {
    name: string;
    count: number;
}

interface DashboardStats {
    totalViews: number;
    totalClicks: number;
    topHotels: TopHotel[];
    dailyStats: DailyStat[];
}

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats>({
        totalViews: 0,
        totalClicks: 0,
        topHotels: [],
        dailyStats: []
    });
    const [timeRange, setTimeRange] = useState('30_days');

    useEffect(() => {
        fetchStats();
    }, [timeRange]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            // Fetch total views (page_view)
            const { count: viewsCount } = await supabase
                .from('analytics_events')
                .select('*', { count: 'exact', head: true })
                .eq('event_type', 'page_view');

            // Fetch total clicks (website_click, instagram_click, etc.)
            const { count: clicksCount } = await supabase
                .from('analytics_events')
                .select('*', { count: 'exact', head: true })
                .in('event_type', ['website_click', 'instagram_click', 'whatsapp_click', 'phone_click']);

            // Fetch daily stats for chart
            const { data: events } = await supabase
                .from('analytics_events')
                .select('created_at, event_type')
                .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
                .order('created_at', { ascending: true });

            // Process daily stats
            const dailyData = processDailyStats(events || []);

            // Fetch top hotels - Client side processing for MVP
            const { data: allEvents } = await supabase
                .from('analytics_events')
                .select('hotel_id, hotels(name)')
                .not('hotel_id', 'is', null);

            const hotelCounts: Record<string, number> = {};
            allEvents?.forEach((e: any) => {
                const name = e.hotels?.name?.tr || e.hotels?.name || 'Unknown Hotel';
                hotelCounts[name] = (hotelCounts[name] || 0) + 1;
            });

            const topHotels = Object.entries(hotelCounts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([name, count]) => ({ name, count }));

            setStats({
                totalViews: viewsCount || 0,
                totalClicks: clicksCount || 0,
                topHotels,
                dailyStats: dailyData
            });

        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const processDailyStats = (events: any[]): DailyStat[] => {
        const days: Record<string, DailyStat> = {};
        events.forEach(e => {
            const date = new Date(e.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
            if (!days[date]) days[date] = { date, views: 0, clicks: 0 };

            if (e.event_type === 'page_view') {
                days[date].views++;
            } else {
                days[date].clicks++;
            }
        });
        return Object.values(days);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Zaman Aralığı" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7_days">Son 7 Gün</SelectItem>
                        <SelectItem value="30_days">Son 30 Gün</SelectItem>
                        <SelectItem value="90_days">Son 3 Ay</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Görüntülenme</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalViews}</div>
                        <p className="text-xs text-muted-foreground">+20.1% geçen aya göre</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Tıklama</CardTitle>
                        <MousePointer className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalClicks}</div>
                        <p className="text-xs text-muted-foreground">+15% geçen aya göre</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">En Popüler Otel</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold truncate">{stats.topHotels[0]?.name || '-'}</div>
                        <p className="text-xs text-muted-foreground">{stats.topHotels[0]?.count || 0} etkileşim</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Etkileşim Grafiği</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={stats.dailyStats}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} />
                                    <YAxis tickLine={false} axisLine={false} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="views" stroke="#2563eb" strokeWidth={2} name="Görüntülenme" />
                                    <Line type="monotone" dataKey="clicks" stroke="#16a34a" strokeWidth={2} name="Tıklama" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>En Çok Tıklanan Oteller</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.topHotels.map((hotel: any, index) => (
                                <div key={index} className="flex items-center">
                                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-4">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{hotel.name}</p>
                                        <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{ width: `${(hotel.count / stats.topHotels[0].count) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="text-sm font-bold text-gray-900 ml-4">{hotel.count}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
