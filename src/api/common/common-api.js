import Head from "next/head";
import axios from 'axios';

export async function GetProductCategory(accessToken, compId) {
    try {
        const response = await axios.get(
            process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'ProductCategory',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                    // You typically **do not need** to set 'Access-Control-Allow-Origin' in requests
                },
                params: {
                    CompId: compId
                }
            }
        );

        return response.data;

    } catch (error) {
        console.error('Error fetching Data:', error);
        throw error; // Optional: rethrow for further handling
    }
}

export async function SaveProductcategorys(data, accessToken) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', "Bearer " + accessToken);

    const options = {
        method: "POST",
        mode: 'cors',
        headers: headers,
        body: JSON.stringify(data)
    };
    return fetch(process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'ProductCategory', options)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP status : " + response.status);
            }
            return response.json();
        })
        .catch(error => console.log(error));
}

export async function GetProductClass(accessToken) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', "Bearer " + accessToken);

    const options = {
        method: "GET",
        mode: 'cors',
        headers: headers
    };
    return fetch(process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'ProductClass', options)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP status : " + response.status);
            }
            return response.json();
        })
        .catch(error => console.log(error));
}

export async function GetProductGroup(accessToken) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', "Bearer " + accessToken);

    const options = {
        method: "GET",
        mode: 'cors',
        headers: headers
    };
    return fetch(process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'ProductGroups', options)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP status : " + response.status);
            }
            return response.json();
        })
        .catch(error => console.log(error));
}

export async function GetTax(accessToken) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', "Bearer " + accessToken);

    const options = {
        method: "GET",
        mode: 'cors',
        headers: headers
    };
    return fetch(process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'Tax', options)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP status : " + response.status);
            }
            return response.json();
        })
        .catch(error => console.log(error));
}

export async function GetHSN(accessToken) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', "Bearer " + accessToken);

    const options = {
        method: "GET",
        mode: 'cors',
        headers: headers
    };
    return fetch(process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'HSN', options)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP status : " + response.status);
            }
            return response.json();
        })
        .catch(error => console.log(error));
}

export async function GetUnits(accessToken) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', "Bearer " + accessToken);

    const options = {
        method: "GET",
        mode: 'cors',
        headers: headers
    };
    return fetch(process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'Units', options)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP status : " + response.status);
            }
            return response.json();
        })
        .catch(error => console.log(error));
}

export async function GetProducts(accessToken, { skip = 0, take = 20, search = "" }) {
    const params = new URLSearchParams({ skip, take, search });

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', "Bearer " + accessToken);

    const options = {
        method: "GET",
        mode: 'cors',
        headers: headers
    };

    return fetch(`${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}Products?${params.toString()}`, options)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP status : " + response.status);
            }
            return response.json();
        })
        .catch(error => console.log(error));
}

export async function GetCustomers(accessToken) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', "Bearer " + accessToken);

    const options = {
        method: "GET",
        mode: 'cors',
        headers: headers
    };
    return fetch(process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'Subledgers', options)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP status : " + response.status);
            }
            return response.json();
        })
        .catch(error => console.log(error));
}

export async function SaveCustomers(data, accessToken) {
    debugger
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', "Bearer " + accessToken);

    const options = {
        method: "POST",
        mode: 'cors',
        headers: headers,
        body: JSON.stringify(data)
    };
    return fetch(process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'Subledgers', options)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP status : " + response.status);
            }
            return response.json();
        })
        .catch(error => console.log(error));
}

export async function GetCustomerById(id, accessToken) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', "Bearer " + accessToken);

    const options = {
        method: "GET",
        mode: 'cors',
        headers: headers
    };
    debugger
    return fetch(process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'Subledgers/' + id, options)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP status : " + response.status);
            }
            return response.json();
        })
        .catch(error => console.log(error));
}

export async function SaveProducts(data, accessToken) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', "Bearer " + accessToken);

    const options = {
        method: "POST",
        mode: 'cors',
        headers: headers,
        body: JSON.stringify(data)
    };
    return fetch(process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'Products', options)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP status : " + response.status);
            }
            return response.json();
        })
        .catch(error => console.log(error));
}

export async function GetSalesmans(accessToken) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', "Bearer " + accessToken);

    const options = {
        method: "GET",
        mode: 'cors',
        headers: headers
    };
    return fetch(process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'Salesmans', options)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP status : " + response.status);
            }
            return response.json();
        })
        .catch(error => console.log(error));
}

export async function SaveSalesmans(data, accessToken) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', "Bearer " + accessToken);

    const options = {
        method: "POST",
        mode: 'cors',
        headers: headers,
        body: JSON.stringify(data)
    };
    return fetch(process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'Salesmans', options)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP status : " + response.status);
            }
            return response.json();
        })
        .catch(error => console.log(error));
}

export async function GetBranchs(accessToken) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', "Bearer " + accessToken);

    const options = {
        method: "GET",
        mode: 'cors',
        headers: headers
    };
    return fetch(process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'Branch', options)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP status : " + response.status);
            }
            return response.json();
        })
        .catch(error => console.log(error));
}

export async function Getsubledgertypes(accessToken) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', "Bearer " + accessToken);

    const options = {
        method: "GET",
        mode: 'cors',
        headers: headers
    };
    return fetch(process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'SubledgerTypes', options)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP status : " + response.status);
            }
            return response.json();
        })
        .catch(error => console.log(error));
}

export async function GetCitys(accessToken) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', "Bearer " + accessToken);

    const options = {
        method: "GET",
        mode: 'cors',
        headers: headers
    };
    return fetch(process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'City', options)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP status : " + response.status);
            }
            return response.json();
        })
        .catch(error => console.log(error));
}

export async function GetStates(accessToken) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', "Bearer " + accessToken);

    const options = {
        method: "GET",
        mode: 'cors',
        headers: headers
    };
    return fetch(process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'State', options)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP status : " + response.status);
            }
            return response.json();
        })
        .catch(error => console.log(error));
}

export async function GetVendors(accessToken) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', "Bearer " + accessToken);

    const options = {
        method: "GET",
        mode: 'cors',
        headers: headers
    };
    return fetch(process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'Vendors', options)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP status : " + response.status);
            }
            return response.json();
        })
        .catch(error => console.log(error));
}

export async function fetchBatchListByProductId(productId, accessToken) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', "Bearer " + accessToken);

    const options = {
        method: "GET",
        mode: 'cors',
        headers: headers
    };
    debugger
    return fetch(process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'ProductBatch/' + productId, options)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP status : " + response.status);
            }
            return response.json();
        })
        .catch(error => console.log(error));
}

