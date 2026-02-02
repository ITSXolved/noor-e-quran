'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Users,
    Clock,
    CheckCircle,
    GraduationCap,
    LogOut,
    Search,
    Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { formatDate, formatCurrency } from '@/lib/utils';
import type { Application } from '@/types';

interface Analytics {
    total: number;
    paymentPending: number;
    paymentDone: number;
    addedToCourse: number;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [applications, setApplications] = useState<Application[]>([]);
    const [analytics, setAnalytics] = useState<Analytics>({
        total: 0,
        paymentPending: 0,
        paymentDone: 0,
        addedToCourse: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [remark, setRemark] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await fetch('/api/admin/applications');
            if (!response.ok) throw new Error('Failed to fetch');

            const data = await response.json();
            setApplications(data.applications);
            setAnalytics(data.analytics);
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        router.push('/admin/login');
    };

    const handleStatusUpdate = async (appId: string, newStatus: string) => {
        if (!remark.trim()) {
            alert('Please add a remark');
            return;
        }

        setIsUpdating(true);
        try {
            const response = await fetch(`/api/admin/applications/${appId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    application_status: newStatus,
                    remark,
                }),
            });

            if (!response.ok) throw new Error('Failed to update');

            alert('Status updated successfully');
            setSelectedApp(null);
            setRemark('');
            fetchApplications();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        } finally {
            setIsUpdating(false);
        }
    };

    const filteredApplications = applications.filter((app) => {
        const matchesSearch =
            app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.reference_number.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' || app.application_status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'payment_pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'payment_done':
                return 'bg-blue-100 text-blue-800';
            case 'added_to_course':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-zyra bg-clip-text text-transparent">
                                Admin Dashboard
                            </h1>
                            <p className="text-sm text-gray-600">Manage course applications</p>
                        </div>
                        <Button variant="outline" onClick={handleLogout}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Analytics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total Applications</p>
                                    <p className="text-3xl font-bold text-gray-900">{analytics.total}</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Users className="w-6 h-6 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Payment Pending</p>
                                    <p className="text-3xl font-bold text-yellow-600">{analytics.paymentPending}</p>
                                </div>
                                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-yellow-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Payment Done</p>
                                    <p className="text-3xl font-bold text-blue-600">{analytics.paymentDone}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Added to Course</p>
                                    <p className="text-3xl font-bold text-green-600">{analytics.addedToCourse}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <GraduationCap className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or reference number..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Filter className="w-5 h-5 text-gray-400" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white"
                                >
                                    <option value="all">All Status</option>
                                    <option value="payment_pending">Payment Pending</option>
                                    <option value="payment_done">Payment Done</option>
                                    <option value="added_to_course">Added to Course</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Applications Table */}
                <Card>
                    <CardHeader className="bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-900">Applications</h2>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Reference
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Contact
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Occupation
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredApplications.map((app) => (
                                        <tr key={app.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                                                {app.reference_number}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{app.name}</div>
                                                <div className="text-sm text-gray-500">{app.city}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{app.email}</div>
                                                <div className="text-sm text-gray-500">{app.mobile}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {app.occupation}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                                        app.application_status
                                                    )}`}
                                                >
                                                    {getStatusLabel(app.application_status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(app.created_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {app.application_status === 'payment_done' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setSelectedApp(app)}
                                                    >
                                                        Update Status
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredApplications.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No applications found</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Status Update Modal */}
            {selectedApp && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <Card className="max-w-md w-full">
                        <CardHeader className="bg-gradient-zyra text-white">
                            <h3 className="text-lg font-semibold">Update Application Status</h3>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Applicant</p>
                                    <p className="font-medium">{selectedApp.name}</p>
                                    <p className="text-sm text-gray-500">{selectedApp.reference_number}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Current Status</p>
                                    <span
                                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                            selectedApp.application_status
                                        )}`}
                                    >
                                        {getStatusLabel(selectedApp.application_status)}
                                    </span>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Remark (required)
                                    </label>
                                    <textarea
                                        value={remark}
                                        onChange={(e) => setRemark(e.target.value)}
                                        placeholder="Add notes about the call or update..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                        rows={3}
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => {
                                            setSelectedApp(null);
                                            setRemark('');
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="flex-1"
                                        onClick={() => handleStatusUpdate(selectedApp.id, 'added_to_course')}
                                        isLoading={isUpdating}
                                    >
                                        Mark as Added to Course
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
