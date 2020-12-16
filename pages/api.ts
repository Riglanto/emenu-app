import Axios from "axios";


export async function fetchSections() {
    const res = await Axios.get(`/api/hello`)
    return res.data.sections;
}

export async function putSections(sections) {
    await fetch(`/api/hello`, {
        method: "POST", headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify({ sections })
    })
}

export async function publishMenu(title, sections) {
    const res = await Axios.post(`/api/publish`, { title, sections })
    return res.data.invalidationId;
}

export async function checkStatus(id) {
    const res = await Axios.get(`/api/publish/${id}`)
    return res.data.status;
}