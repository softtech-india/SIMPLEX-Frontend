"use client";
import React, { useEffect, useState } from "react";
import {
    Chart,
    Series,
    CommonSeriesSettings,
    ArgumentAxis,
    ValueAxis,
    Tooltip,
    Legend,
    Export,
    Grid,
    Label,
} from "devextreme-react/chart";
import PieChart, {
} from 'devextreme-react/pie-chart';
import LoadPanel from 'devextreme-react/load-panel';
import notify from 'devextreme/ui/notify';

// --- Helpers ---
function fmtINR(n) {
    return n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

function toISO(d) {
    return d.toISOString().slice(0, 10);
}
function customizeTooltip(arg) {
    return {
        text: `${arg.valueText} - ${(arg.percent * 100).toFixed(2)}%`,
    };
}
// --- Demo fallback data ---
const demoSummary = {
    totalCustomers: 150,
    totalBills: 320,
    totalQty: 1450,
    totalSalesValue: 1250000,
};

const demoDataSales = [
    { date: "2025-08-01", amount: 120000 },
    { date: "2025-08-02", amount: 135000 },
    { date: "2025-08-03", amount: 128000 },
    { date: "2025-08-04", amount: 150000 },
    { date: "2025-08-05", amount: 170000 },
];
const demoDataFastMove = [
    { product: "Demo 1", qty: 10 },
    { product: "Demo 2", qty: 9 },
    { product: "Demo 3", qty: 8 },
    { product: "Demo 4", qty: 7 },
    { product: "Demo 5", qty: 6 },
];
const demoDataSlowMove = [
    { product: "Demo 1", qty: 1 },
    { product: "Demo 2", qty: 2 },
    { product: "Demo 3", qty: 3 },
    { product: "Demo 4", qty: 4 },
    { product: "Demo 5", qty: 5 },
];

export default function Dashboard() {
    const [accessToken] = useState(localStorage.getItem("accessToken"));
    const [from, setFrom] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        return toISO(d);
    });
    const [to, setTo] = useState(() => toISO(new Date()));

    const [summary, setSummary] = useState(demoSummary);
    const [sales, setSales] = useState([]);
    const [fastmoves, setFastMoves] = useState([]);
    const [slowmoves, setSlowMoves] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function fetchData() {
        // if (navigator.onLine) {
        // } else {
        //     notify("Could not reach API, Device is offline. Showing Demo data", "error", 3000);
        // }        
        setLoading(true);
        setError(null);
        try {
            const qs = `?from=${from}&to=${to}`;

            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Access-Control-Allow-Origin', '*');
            headers.append('Authorization', "Bearer " + accessToken);

            const options = {
                method: "GET",
                mode: 'cors',
                headers: headers
            };

            const [sumRes, sRes, fmRes, smRes] = await Promise.all([
                fetch(process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + `Dashboard/summary${qs}`, options),
                fetch(process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + `Dashboard/dailysale${qs}`, options),
                fetch(process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + `Dashboard/fastmoving${qs}`, options),
                fetch(process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + `Dashboard/slowmoving${qs}`, options)

            ]);
            
            const okSum = sumRes.ok ? await sumRes.json() : null;
            const okS = sRes.ok ? await sRes.json() : null;
            const okfm = fmRes.ok ? await fmRes.json() : null;
            const oksm = smRes.ok ? await smRes.json() : null;

            if (okSum) setSummary(okSum);
            else setSummary(demoSummary);

            if (okS && Array.isArray(okS)) setSales(okS);
            else setSales(demoDataSales);

            if (okfm && Array.isArray(okfm)) setFastMoves(okfm);
            else setFastMoves(demoDataFastMove);

            if (oksm && Array.isArray(oksm)) setSlowMoves(oksm);
            else setSlowMoves(demoDataSlowMove);


        } catch (e) {
            setError("Could not reach API, showing demo data.");
            setSummary(demoSummary);
            setSales(demoDataSales);
            setFastMoves(demoDataFastMove);
            setSlowMoves(demoDataSlowMove);

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    function resetDates() {
        const d = new Date();
        setTo(toISO(d));
        d.setDate(d.getDate() - 7);
        setFrom(toISO(d));
    }

    return (
        <div className="dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <h1>Business Dashboard</h1>
                <div className="date-controls">
                    <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
                    <span>to</span>
                    <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
                    <button onClick={fetchData} className="btn-primary">Show</button>
                    {/* <button onClick={resetDates} className="btn-secondary">Reset</button> */}
                </div>
            </div>

            {/* Summary KPIs */}
            <div className="kpi-grid">
                <KpiCard title="Total Customers" value={summary.totalCustomers} />
                <KpiCard title="Total Bills" value={summary.totalBills} />
                <KpiCard title="Total Sale Qty" value={summary.totalQty} />
                <KpiCard title="Total Sales Value" value={`₹ ${fmtINR(summary.totalSalesValue)}`} />
            </div>

            {/* Charts */}
            <div className="chart-grid">
                <Card title="Last 7 days Sales">
                    <Chart dataSource={sales}>
                        <CommonSeriesSettings argumentField="date" type="bar" />
                        <Series valueField="amount" name="Sales" />
                        <ArgumentAxis><Grid visible={true} /> <Label overlappingBehavior="rotate" rotationAngle={-45} /> </ArgumentAxis>
                        <ValueAxis />
                        <Tooltip enabled={true} customizeTooltip={(arg) => ({ text: `${arg.argument}: ₹ ${fmtINR(arg.value)}` })} />
                        <Legend verticalAlignment="bottom" horizontalAlignment="center" />
                        <Export enabled={true} />
                    </Chart>
                </Card>

                <Card title="Top 5 Fast Moving Item">
                    <PieChart id="pie" dataSource={fastmoves} type="doughnut" palette="Soft Pastel">
                        <Series
                            argumentField="product"
                            valueField="qty"
                            type="doughnut"
                            innerRadius={0.6}   // controls the doughnut hole size
                        />
                        <Tooltip
                            enabled={true}
                            customizeTooltip={(arg) => ({
                                text: `${arg.argument}: ${fmtINR(arg.value)}`
                            })}
                        />
                        <Legend
                            verticalAlignment="bottom"
                            horizontalAlignment="center"
                            itemTextPosition="right"
                        />
                    </PieChart>
                </Card>


                <Card title="Top 5 Slow Moving Item">
                    <Chart dataSource={slowmoves}>
                        <CommonSeriesSettings argumentField="product" type="bar" />
                        <Series valueField="qty" name="product" />
                        <ArgumentAxis><Grid visible={true} /> <Label overlappingBehavior="none" rotationAngle={-45} /> </ArgumentAxis>
                        <ValueAxis />
                        <Tooltip enabled={true} customizeTooltip={(arg) => ({ text: ` ${fmtINR(arg.value)}` })} />
                        <Legend verticalAlignment="bottom" horizontalAlignment="center" />
                    </Chart>
                </Card>
            </div>

            <LoadPanel
                shadingColor="rgba(0,0,0,0.4)"
                visible={loading}
                showIndicator={true}
            />            

            {error && <div className="error-box">{error}</div>}
        </div>
    );
}

// --- UI bits ---
function KpiCard({ title, value }) {
    return (
        <div className="kpi-card">
            <span className="kpi-title">{title}</span>
            <span className="kpi-value">{value}</span>
        </div>
    );
}

function Card({ title, children }) {
    return (
        <div className="card">
            <div className="card-header">
                <h2>{title}</h2>
            </div>
            {children}
        </div>
    );
}
