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
    await fetch(`/api/publish`, {
        method: "POST", headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify({ title, sections })
    })
}