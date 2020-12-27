import Axios from "axios";

export async function initialFetchSections(options) {
    try {
        const res = await Axios.get(`${process.env.NEXTAUTH_URL}/api/hello`, options)
        return res.data;
    } catch (e) {
        return null;
    }
}

export async function fetchSections() {
    try {
        const res = await Axios.get(`/api/hello`)
        return res.data;
    } catch (e) {
        return null;
    }
}

export async function putSections(data) {
    const { title, sections, domain } = data
    const result = await fetch(`/api/hello`, {
        method: "POST", headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify({ title, sections, domain })
    })
    return result.status === 201;
}

export async function publishMenu(title, sections) {
    const res = await Axios.post(`/api/publish`, { title, sections })
    return res.data.invalidationId;
}

export async function checkStatus(id) {
    const res = await Axios.get(`/api/publish/${id}`)
    return res.data.status;
}