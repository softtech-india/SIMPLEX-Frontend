import Head from "next/head";
import axios from 'axios';

export async function GetCompanies(accessToken, userid) {
    try {
        const response = await axios.get(
            process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'franchiselist',
            {
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                },                
                params: {
                    userid: userid
                }
            }
        );

        return response.data;

    } catch (error) {
        return { error: "Failed to connect to server. Please try again later." };
    }
}

export async function GetCompanyById(accessToken, userid, compid) {
    try {
        const response = await axios.get(
            process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'franchiselist/id',
            {
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                },                
                params: {
                    userid: userid,
                    compid: compid
                }
            }
        );

        return response.data;

    } catch (error) {
        return { error: "Failed to connect to server. Please try again later." };
    }
}