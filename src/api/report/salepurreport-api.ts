import axios, { AxiosResponse } from 'axios';

// helper to format date
const formatDate = (date: string | Date): string => {
    const d = new Date(date);
    return isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-CA'); // 'YYYY-MM-DD'
};

// define return type as 'any' for now (you can refine later)
export async function GetPurRegister(
    accessToken: string,
    compId: string | number,
    fromdate: string | Date,
    todate: string | Date,
    prodCode: string,
    reporttype: string
): Promise<any> {
    try {
        const endpoint =
            process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT +
            (reporttype === '0' ? 'SalePurReport/purchasereg' : 'SalePurReport/receivereg');

        const response: AxiosResponse<any> = await axios.get(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
                'CompId': String(compId),
                'fromdate': formatDate(fromdate),
                'todate': formatDate(todate),
                'Prodcode': prodCode,
            }
        });

        return response.data;
    } catch (error) {
        return { error: "Failed to connect to server. Please try again later." };
    }
}

export async function GetSaleRegister(
    accessToken: string,
    compId: string | number,
    fromdate: string | Date,
    todate: string | Date,
    prodCode?: string
): Promise<any> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'SalePurReport/salereg',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                    'CompId': String(compId),
                    'fromdate': formatDate(fromdate),
                    'todate': formatDate(todate),
                    'Prodcode': prodCode,
                }
            }
        );

        return response.data;
    } catch (error) {
        return { error: "Failed to connect to server. Please try again later." };
    }
}

export async function GetSaleRegisterPaging(
    accessToken: string,
    compId: string | number,
    fromdate: string | Date,
    todate: string | Date,
    prodCode?: string,
    skip?: number,
    take?: number
): Promise<any> {
    try {
        const response = await axios.get(
            process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'SalePurReport/saleregpaging',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                    'CompId': String(compId),
                    'fromdate': formatDate(fromdate),
                    'todate': formatDate(todate),
                    'Prodcode': prodCode,
                    'skip': skip?.toString() || '0',
                    'take': take?.toString() || '50', // default 50 rows per page
                }
            }
        );
        return response.data;
    } catch (error) {
        return { error: "Failed to connect to server. Please try again later." };
    }
}

