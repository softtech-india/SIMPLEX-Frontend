import axios from 'axios';

const formatDate = (date) => {
    const d = new Date(date);
    return isNaN(d) ? '' : d.toLocaleDateString('en-CA'); // 'YYYY-MM-DD'
};

export async function GetGPReportSummary(accessToken, compId, fromdate, todate, summarytag, roitag) {
    try {
        // const baseUrl = await getApiBaseUrl();
        const endpoint =
            process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT +
            (summarytag === 'M' ? 'GPReport/Summary2' : 'GPReport/Summary1');
        const response = await axios.get(
            endpoint,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                    'CompId': compId,
                    'fromdate': formatDate(fromdate),
                    'todate': formatDate(todate),
                    'ROILogic': roitag,

                    // You typically **do not need** to set 'Access-Control-Allow-Origin' in requests
                }
                // ,
                // params: {
                //     CompId: compId,
                //     fromdate: formatDate(fromdate), // 'YYYY-MM-DD'
                //     todate: formatDate(todate)
                // }
            }
        );

        return response.data;

    } catch (error) {
        return { error: "Failed to connect to server. Please try again later." };
    }
}

export async function GetGpWithBillDtl(accessToken, compId, fromdate, todate, gplogic, roitag) {
    try {
        debugger;
        const response = await axios.get(
            process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'GPReport/Detail',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                    'CompId': compId,
                    'fromdate': formatDate(fromdate),
                    'todate': formatDate(todate),
                    'GpLogic': gplogic,
                    'ROILogic': roitag,
                }
                // params: {
                //     CompId: compId,
                //     fromdate: formatDate(fromdate), // 'YYYY-MM-DD'
                //     todate: formatDate(todate)
                // }
            }
        );

        return response.data;

    } catch (error) {
        return { error: "Failed to connect to server. Please try again later." };
    }
}

export async function GetGPBillDtlByProd(accessToken, compId, fromdate, todate, prodCode, gplogic, roitag, mrp) {
    try {
        debugger
        const response = await axios.get(
            process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'GPReport/BillByProd',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                    'CompId': compId,
                    'fromdate': formatDate(fromdate),
                    'todate': formatDate(todate),
                    'Prodcode': prodCode,
                    'GpLogic': gplogic,
                    'ROILogic': roitag,
                    'Mrp': mrp,
                }
                // params: {
                //     CompId: compId,
                //     fromdate: formatDate(fromdate), // 'YYYY-MM-DD'
                //     todate: formatDate(todate),
                //     Prodcode: prodCode
                // }
            }
        );

        return response.data;

    } catch (error) {
        return { error: "Failed to connect to server. Please try again later." };
    }
}

export async function GetGPRecvDtlByProd(accessToken, compId, fromdate, todate, prodCode) {
    try {
        debugger
        const response = await axios.get(
            process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'GPReport/RecvDtlByProd',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                    'CompId': compId,
                    'fromdate': formatDate(fromdate),
                    'todate': formatDate(todate),
                    'Prodcode': prodCode,
                }
                // params: {
                //     CompId: compId,
                //     fromdate: formatDate(fromdate), // 'YYYY-MM-DD'
                //     todate: formatDate(todate),
                //     Prodcode: prodCode
                // }
            }
        );

        return response.data;

    } catch (error) {
        return { error: "Failed to connect to server. Please try again later." };
    }
}