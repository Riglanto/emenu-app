import ReactDOMServer from 'react-dom/server';
import styled from 'styled-components'

const Div = styled.div`
    background-color: blue;
`

export const Content = (props) => <Div className="test">
    {props.x}
    {false && <div>{props.x}</div>}
</Div>

export const getSections = (x) => ReactDOMServer.renderToStaticMarkup(<Content x={x} />)
