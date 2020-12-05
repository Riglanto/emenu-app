import ReactDOMServer from 'react-dom/server';

export const Content = (props) => <div>
    {props.x}
    {false && <div>{props.x}</div>}
</div>

export const getSections = (x) => ReactDOMServer.renderToStaticMarkup(<Content x={x} />)

const Wrapper = (props) => (
    <>123</>
)