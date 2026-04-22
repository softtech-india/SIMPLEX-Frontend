import Head from "next/head";

export async function GetFinancialYears(accessToken) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', "Bearer " + accessToken);
    
    const options = {
        method: "GET",
        mode: 'cors',
        headers: headers
    };
    return fetch(process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'FinancialYear', options)
            .then(function (response) {
                if(!response.ok) {
                    throw new Error("HTTP status : " + response.status);
                }
                return response.json();
            })
            .catch(error => console.log(error));
}