import Head from "next/head";
import axios from 'axios';

export async function GetUsers(accessToken) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', "Bearer " + accessToken);
    
    const options = {
        method: "GET",
        mode: 'cors',
        headers: headers
    };
    return fetch(process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'Users', options)
            .then(function (response) {
                if(!response.ok) {
                    throw new Error("HTTP status : " + response.status);
                }
                return response.json();
            })
            .catch(error => console.log(error));
}


export async function GetRoles(accessToken) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', "Bearer " + accessToken);
    
    const options = {
        method: "GET",
        mode: 'cors',
        headers: headers
    };
    return fetch(process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'user', options)
            .then(function (response) {
                if(!response.ok) {
                    throw new Error("HTTP status : " + response.status);
                }
                return response.json();
            })
            .catch(error => console.log(error));
}

export async function GetMenus(accessToken) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', "Bearer " + accessToken);
    
    const options = {
        method: "GET",
        mode: 'cors',
        headers: headers
    };
    return fetch(process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'Menus', options)
            .then(function (response) {
                if(!response.ok) {
                    throw new Error("HTTP status : " + response.status);
                }
                return response.json();
            })
            .catch(error => console.log(error));
}

export async function GetRoleMenuPriviledges(roleId, accessToken) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', "Bearer " + accessToken);
    
    const options = {
        method: "GET",
        mode: 'cors',
        headers: headers
    };
    return fetch(process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'userpreviledge/' + roleId, options)
            .then(function (response) {
                if(!response.ok) {
                    throw new Error("HTTP status : " + response.status);
                }
                return response.json();
            })
            .catch(error => console.log(error));
}


export async function SaveRoleMenuPriviledges(data, accessToken) {
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
    return fetch(process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'RoleMenuPriviledges/SaveRoleMenuPriviledges', options)
            .then(function (response) {
                if(!response.ok) {
                    throw new Error("HTTP status : " + response.status);
                }
                return response.json();
            })
            .catch(error => console.log(error));
}

export async function GetLogin(username, password) {
    try {
        const response = await axios.get(
            process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'login',
            {
                params: {
                    username: username,
                    password: password
                }
            }
        );

        return response.data;

    } catch (error) {
        return { error: "Failed to connect to server. Please try again later." };
    }
}

// export async function GetLogin(data, accessToken) {
//     const headers = new Headers();
//     headers.append('Content-Type', 'application/json');
//     headers.append('Authorization', accessToken);

//     const options = {
//         method: "POST",
//         mode: 'cors',
//         headers: headers,
//         body: JSON.stringify(data)
//     };

//     try {
//         const response = await fetch(
//             process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'login',
//             options
//         );
//         if (!response.ok) {
//             // API responded with 4xx or 5xx
//             return { error: `Server error: ${response.status}` };
//         }

//         return await response.json();
//     } catch (error) {
//         // Network / API not reachable
//         return { error: "Failed to connect to server. Please try again later." };
//     }
// }

export async function GetAccessToken(data, accessToken) {
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
    return fetch(process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'security/createToken', options)
            .then(function (response) {
                if(!response.ok) {
                    throw new Error("HTTP status : " + response.status);
                }
                return response.json();
            })
            .catch(error => console.log(error));
}

export async function SaveUsers(data, accessToken) {
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
    return fetch(process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'Users', options)
            .then(function (response) {
                if(!response.ok) {
                    throw new Error("HTTP status : " + response.status);
                }
                return response.json();
            })
            .catch(error => console.log(error));
}

export async function SaveRoles(data, accessToken) {
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
    return fetch(process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'Roles', options)
            .then(function (response) {
                if(!response.ok) {
                    throw new Error("HTTP status : " + response.status);
                }
                return response.json();
            })
            .catch(error => console.log(error));
}