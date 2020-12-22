
import { useState } from "react";
import { FormControl, InputGroup } from "react-bootstrap";

import { toDomain } from "~/utils";

export default function DomainForm(props) {
    const [data, setData] = useState({ domain: props?.domain || toDomain(props?.title), title: props?.title })
    const update = (title: string) => {
        const domain = toDomain(title);
        setData({ title, domain })
    }
    return (
        <>
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
                    <InputGroup.Text id="basic-addon2">www.</InputGroup.Text>
                </InputGroup.Append>
                <FormControl
                    placeholder="Recipient's username"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                    value={data.domain}
                    readOnly
                />
                <InputGroup.Append>
                    <InputGroup.Text id="basic-addon2">.emenu.today</InputGroup.Text>
                </InputGroup.Append>
            </InputGroup>

            <InputGroup className="mb-3">
                <InputGroup.Append>
                    <InputGroup.Text id="basic-addon2">=></InputGroup.Text>
                </InputGroup.Append>
                <InputGroup.Append>
                    <InputGroup.Text id="basic-addon2">{`www.${data.domain}.emenu.today`}</InputGroup.Text>
                </InputGroup.Append>
            </InputGroup>
        </>
    )
}