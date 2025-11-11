import React, { useState, useMemo } from 'react';
import { Job, ServiceType } from '../types';
import { parseDateString } from '../utils/dateUtils';

interface IncomeReportScreenProps {
  onBack: () => void;
  historyJobs: Job[];
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN').format(Math.round(amount));

const BarChart: React.FC<{ data: { label: string; value: number }[] }> = ({ data }) => {
    const maxValue = useMemo(() => Math.max(...data.map(d => d.value), 1), [data]);
    if (data.every(d => d.value === 0)) {
        return <div className="text-center text-gray-400 py-10">Không có dữ liệu thu nhập cho giai đoạn này.</div>;
    }
    return (
        <div className="flex items-end h-64 border-l border-b border-gray-200 pl-2 pb-1 space-x-2">
            {data.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center justify-end">
                    <div 
                        className="w-full bg-primary hover:bg-primary-600 transition-all"
                        style={{ height: `${(item.value / maxValue) * 100}%` }}
                        title={`${item.label}: ${formatCurrency(item.value)}đ`}
                    />
                    <div className="text-xs text-gray-500 mt-1">{item.label}</div>
                </div>
            ))}
        </div>
    );
};

const PIE_CHART_COLORS = ['#0a5c98', '#55a0d1', '#77b9dd', '#a6d0e8', '#cce2f1', '#e5f0f8'];

const PieChart: React.FC<{ data: { name: string; value: number }[] }> = ({ data }) => {
    const total = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data]);
    if (total === 0) {
        return <div className="text-center text-gray-400 py-10">Không có dữ liệu công việc cho giai đoạn này.</div>;
    }
    
    let cumulativePercentage = 0;
    const gradientParts = data.map((item, index) => {
        const percentage = (item.value / total) * 100;
        const color = PIE_CHART_COLORS[index % PIE_CHART_COLORS.length];
        const part = `${color} ${cumulativePercentage}% ${cumulativePercentage + percentage}%`;
        cumulativePercentage += percentage;
        return part;
    });
    
    const conicGradient = `conic-gradient(${gradientParts.join(', ')})`;
    
    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="w-40 h-40 rounded-full" style={{ background: conicGradient }}></div>
            <div className="flex-shrink-0 space-y-2">
                {data.map((item, index) => (
                    <div key={item.name} className="flex items-center">
                        <div className="w-4 h-4 rounded-sm mr-2" style={{ backgroundColor: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length] }}></div>
                        <span className="text-sm text-gray-700">{item.name} ({(item.value / total * 100).toFixed(1)}%)</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const IncomeReportScreen: React.FC<IncomeReportScreenProps> = ({ onBack, historyJobs }) => {
    const currentYear = new Date().getFullYear();
    const [filterMode, setFilterMode] = useState<'month' | 'quarter' | 'year'>('year');
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedQuarter, setSelectedQuarter] = useState(1);
    const [selectedMonth, setSelectedMonth] = useState(1);

    const yearOptions = Array.from({ length: currentYear - 2024 + 1 }, (_, i) => 2024 + i).reverse();

    const getPeriodRange = (mode: typeof filterMode, year: number, month?: number, quarter?: number): [Date, Date] => {
        if (mode === 'year') {
            return [new Date(year, 0, 1), new Date(year, 11, 31, 23, 59, 59)];
        }
        if (mode === 'quarter' && quarter) {
            const startMonth = (quarter - 1) * 3;
            const endMonth = startMonth + 2;
            return [new Date(year, startMonth, 1), new Date(year, endMonth + 1, 0, 23, 59, 59)];
        }
        if (mode === 'month' && month) {
            return [new Date(year, month - 1, 1), new Date(year, month, 0, 23, 59, 59)];
        }
        return [new Date(), new Date()];
    };

    const getPreviousPeriodRange = (mode: typeof filterMode, year: number, month?: number, quarter?: number): [Date, Date] => {
        if (mode === 'year') return getPeriodRange('year', year - 1);
        if (mode === 'quarter' && quarter) {
            return quarter > 1 ? getPeriodRange('quarter', year, quarter - 1) : getPeriodRange('quarter', year - 1, 4);
        }
        if (mode === 'month' && month) {
            return month > 1 ? getPeriodRange('month', year, month - 1) : getPeriodRange('month', year - 1, 12);
        }
        return [new Date(), new Date()];
    }

    const reportData = useMemo(() => {
        const [currentStart, currentEnd] = getPeriodRange(filterMode, selectedYear, selectedMonth, selectedQuarter);
        const [prevStart, prevEnd] = getPreviousPeriodRange(filterMode, selectedYear, selectedMonth, selectedQuarter);
        
        const getFinalPayment = (job: Job) => job.penalty ? job.payment * (1 - job.penalty.percentage / 100) : job.payment;

        const currentPeriodJobs = historyJobs.filter(job => {
            const jobDate = parseDateString(job.date);
            return job.status === 'completed' && jobDate >= currentStart && jobDate <= currentEnd;
        });
        
        const prevPeriodJobs = historyJobs.filter(job => {
            const jobDate = parseDateString(job.date);
            return job.status === 'completed' && jobDate >= prevStart && jobDate <= prevEnd;
        });

        const totalIncome = currentPeriodJobs.reduce((sum, job) => sum + getFinalPayment(job), 0);
        const jobCount = currentPeriodJobs.length;
        const avgIncome = jobCount > 0 ? totalIncome / jobCount : 0;
        
        const prevTotalIncome = prevPeriodJobs.reduce((sum, job) => sum + getFinalPayment(job), 0);
        const growthRate = prevTotalIncome > 0 ? ((totalIncome - prevTotalIncome) / prevTotalIncome) * 100 : (totalIncome > 0 ? 100 : 0);

        const pieChartData = Object.entries(
            currentPeriodJobs.reduce((acc, job) => {
                acc[job.serviceType] = (acc[job.serviceType] || 0) + 1;
                return acc;
            }, {} as Record<ServiceType, number>)
        ).map(([name, value]) => ({ name: name as ServiceType, value }));

        let barChartData: { label: string; value: number }[] = [];
        if (filterMode === 'year') {
            barChartData = Array.from({ length: 12 }, (_, i) => {
                const month = i + 1;
                const monthIncome = currentPeriodJobs
                    .filter(job => parseDateString(job.date).getMonth() === i)
                    .reduce((sum, job) => sum + getFinalPayment(job), 0);
                return { label: `T${month}`, value: monthIncome };
            });
        } else if (filterMode === 'quarter') {
             const startMonth = (selectedQuarter - 1) * 3;
             barChartData = Array.from({ length: 3 }, (_, i) => {
                const monthIndex = startMonth + i;
                const monthIncome = currentPeriodJobs
                    .filter(job => parseDateString(job.date).getMonth() === monthIndex)
                    .reduce((sum, job) => sum + getFinalPayment(job), 0);
                return { label: `T${monthIndex + 1}`, value: monthIncome };
             });
        } else if (filterMode === 'month') {
            const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
            barChartData = Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const dayIncome = currentPeriodJobs
                    .filter(job => parseDateString(job.date).getDate() === day)
                    .reduce((sum, job) => sum + getFinalPayment(job), 0);
                return { label: `${day}`, value: dayIncome };
            });
        }

        return { totalIncome, avgIncome, jobCount, growthRate, pieChartData, barChartData };

    }, [filterMode, selectedYear, selectedMonth, selectedQuarter, historyJobs]);

    const GrowthIndicator = ({ rate }: { rate: number }) => {
        const isPositive = rate > 0;
        const isZero = Math.abs(rate) < 0.01;
        const color = isZero ? 'text-gray-500' : (isPositive ? 'text-green-500' : 'text-red-500');
        const icon = isZero ? null : (isPositive ? '▲' : '▼');
        return <span className={`font-bold ${color}`}>{icon} {Math.abs(rate).toFixed(1)}%</span>;
    };

    return (
        <div className="min-h-screen font-sans bg-gray-100">
            <header className="bg-white shadow p-4 flex items-center space-x-3 fixed top-0 left-0 right-0 z-20">
                <button onClick={onBack} className="text-primary hover:bg-gray-100 p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h1 className="text-xl font-bold text-primary">Báo cáo Thu nhập</h1>
            </header>
            <main className="pt-20 p-4 space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border space-y-3">
                    <div className="grid grid-cols-3 gap-1 rounded-lg bg-gray-200 p-1">
                        <button onClick={() => setFilterMode('month')} className={`py-1.5 rounded-md text-sm font-semibold transition-all ${filterMode === 'month' ? 'bg-primary text-white shadow' : 'text-gray-500'}`}>Tháng</button>
                        <button onClick={() => setFilterMode('quarter')} className={`py-1.5 rounded-md text-sm font-semibold transition-all ${filterMode === 'quarter' ? 'bg-primary text-white shadow' : 'text-gray-500'}`}>Quý</button>
                        <button onClick={() => setFilterMode('year')} className={`py-1.5 rounded-md text-sm font-semibold transition-all ${filterMode === 'year' ? 'bg-primary text-white shadow' : 'text-gray-500'}`}>Năm</button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} className="w-full p-2 col-span-1 bg-white border border-gray-300 rounded-md text-sm text-gray-900">
                            {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        {filterMode === 'quarter' && (
                            <select value={selectedQuarter} onChange={e => setSelectedQuarter(Number(e.target.value))} className="w-full p-2 col-span-2 bg-white border border-gray-300 rounded-md text-sm text-gray-900">
                                {Array.from({ length: 4 }, (_, i) => i + 1).map(q => <option key={q} value={q}>Quý {q}</option>)}
                            </select>
                        )}
                        {filterMode === 'month' && (
                            <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))} className="w-full p-2 col-span-2 bg-white border border-gray-300 rounded-md text-sm text-gray-900">
                                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => <option key={m} value={m}>Tháng {m}</option>)}
                            </select>
                        )}
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border"><p className="text-sm text-gray-500">Tổng thu nhập</p><p className="text-2xl font-bold text-primary mt-1">{formatCurrency(reportData.totalIncome)}đ</p></div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border"><p className="text-sm text-gray-500">Thu nhập/việc</p><p className="text-2xl font-bold text-primary mt-1">{formatCurrency(reportData.avgIncome)}đ</p></div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border"><p className="text-sm text-gray-500">Số việc đã làm</p><p className="text-2xl font-bold text-primary mt-1">{reportData.jobCount}</p></div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border"><p className="text-sm text-gray-500">Tăng trưởng</p><p className="text-2xl mt-1"><GrowthIndicator rate={reportData.growthRate} /></p></div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <h3 className="font-bold text-gray-800 mb-2">Biểu đồ thu nhập</h3>
                    <BarChart data={reportData.barChartData} />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <h3 className="font-bold text-gray-800 mb-4">Phân bổ loại công việc</h3>
                    <PieChart data={reportData.pieChartData} />
                </div>
            </main>
        </div>
    );
};

export default IncomeReportScreen;
