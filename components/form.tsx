
import { useState } from "react";
import { FormControl, InputGroup, Button } from "react-bootstrap";

import * as api from "../pages/api"
import { toDomain, wwwDomain } from "~/utils";




export default function DomainForm(props) {
    const [data, setData] = useState({ domain: toDomain(props?.title), title: props?.title })
    const update = (title: string) => {
        const domain = toDomain(title);
        setData({ title, domain })
    }

    const saveDomain = async () => {
        const { domain } = data;
        const success = await api.putSections({ domain });
        if (success) {
            if (props.onUpdate) {
                props.onUpdate(domain)
            }
            props.onSucess();
        } else {
            props.notify(<><b>{wwwDomain(domain)}</b> already exists.<br />Please select different domain.</>, 5000)
        }
    }

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <InputGroup className="mb-3">
                <InputGroup.Append>
                    <InputGroup.Text id="basic-addon2">Restaurant name:</InputGroup.Text>
                </InputGroup.Append>
                <FormControl
                    value={data.title}
                    onChange={event => update(event.target.value)}
                    placeholder="Restaurant's name"
                    aria-label="Restaurant's name"
                    aria-describedby="basic-addon2"
                />
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroup.Append>
                    <InputGroup.Text id="basic-addon2">Restaurant www:</InputGroup.Text>
                </InputGroup.Append>
                <FormControl
                    readOnly
                    value={wwwDomain(data.domain)}
                    placeholder="Restaurant's www"
                    aria-label="Restaurant's www"
                    aria-describedby="basic-addon2"
                />
            </InputGroup>
            <Button style={{ marginLeft: "auto" }} onClick={saveDomain}>Publish</Button>
        </div >
    )
}