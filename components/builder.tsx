import { useEffect, useState } from "react";
import { animateScroll } from "react-scroll";
import { Button, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import * as ls from "local-storage";
import { confirmAlert } from 'react-confirm-alert';
// import * as hash from 'object-hash';
import hash from 'object-hash';

import * as api from "../pages/api"
import { Sections } from "./sections";
import { DEFAULT_SECTIONS, DEFAULT_TITLE, splitSectons, swapElements } from "../utils";

import styles from "../styles/builder.module.scss";
import 'react-confirm-alert/src/react-confirm-alert.css';

const confirmOverwrite = action => confirmAlert({
  title: 'Continue?',
  message: 'All local changes will be lost.',
  buttons: [
    {
      label: 'Yes',
      onClick: () => action()
    },
    {
      label: 'No',
      onClick: null
    }
  ]
})

const signInTooltip = <Tooltip id="tooltip"> <strong>Sign in</strong> to continue.</Tooltip>
const ProtectedTooltipWrapper = (component, loggedIn) => loggedIn ? component : <OverlayTrigger
  placement="right"
  overlay={signInTooltip}
>
  {component}
</OverlayTrigger >


const MButton = (props) => <Button size="sm"
  className={styles.action_button}
  onClick={props.onClick}
  disabled={props.disabled}
>
  {props.text}
</Button>

const MCard = (props) =>
  <Card style={{ width: '18rem' }}>
    <Card.Img variant="top" src={props.img} />
    <Card.Body style={{ display: "flex", flexDirection: "column" }}>
      <Card.Text>{props.text}</Card.Text>
      {props.action}
    </Card.Body>
  </Card>

export default function Builder(props) {
  const { notify, loggedIn } = props;
  useEffect(() => {
    const localData: any = ls.get("sections");
    if (localData && hash(localData) !== hash(props.data)) {
      console.log(localData, props.data)
      setDataState(localData);
      notify("Local draft restored.")
    }
  }, []);
  const [data, setDataState] = useState({
    title: props.data?.title,
    sections: props.data?.sections
  });

  const setData = x => {
    ls.set("sections", x);
    setDataState(x);
  }

  const setTitle = (x) => setData({ ...data, title: x })
  const setSections = (x) => setData({ ...data, sections: x })
  const [highlightedId, setHighlightedId] = useState(null);

  if (!data?.sections) {
    return (
      <div className={styles.starter}>
        <MCard
          text={<span>Start with our example - Mexican Restaurant <b>3 amigos</b></span>}
          img="images/example2.png"
          action={<MButton text="Load example" onClick={() => setData({ title: DEFAULT_TITLE, sections: DEFAULT_SECTIONS })} />}
        />
        <MCard
          text={<span>Start with <b>empty canvas</b> - Build anything you want</span>}
          img="images/example5.png"
          action={<MButton text="Start from scratch" onClick={() => setData({ title: "Click to add title...", sections: [] })} />}
        />
      </div>
    )
  }

  const { title, sections } = data;
  const { leftSections, rightSections } = splitSectons(sections)
  const updateSection = (section, index) =>
    setSections(
      [
        ...sections.slice(0, index),
        section,
        ...sections.slice(index + 1),
      ].filter((s) => s)
    );
  const adjustItems = (index, items) =>
    updateSection({ ...sections[index], items }, index);
  const swapSectionLoc = (index, id) => {
    const isRight = sections[index].loc === "right";
    const x = {
      ...sections.splice(index, 1)[0],
      loc: isRight ? "left" : "right",
    };
    const newPosition = isRight ? leftSections.length : sections.length;
    setSections(insertSectionAt(x, newPosition));
    animateScroll.scrollToBottom();
    setHighlightedId(id);
    setTimeout(() => setHighlightedId(null), 1500);
  };
  const insertSectionAt = (element, index) => [
    ...sections.slice(0, index),
    element,
    ...sections.slice(index),
  ];
  const deleteSection = (index) => updateSection(null, index);

  const updateItem = (items, index, props) => [
    ...items.slice(0, index),
    { ...items[index], ...props },
    ...items.slice(index + 1),
  ];
  const updateTitle = (index, title) =>
    updateSection({ ...sections[index], title }, index);
  const updateItemProps = (index, subindex, props) =>
    updateSection(
      {
        ...sections[index],
        items: updateItem(sections[index].items, subindex, props),
      },
      index
    );

  const deleteItem = (index, subindex) =>
    adjustItems(index, [
      ...sections[index].items.slice(0, subindex),
      ...sections[index].items.slice(subindex + 1),
    ]);

  const swapSections = (a, b) => setSections(swapElements(sections, a, b))

  const loadSections = async () => {
    const data = await api.fetchSections();
    if (data) {
      setData(data);
      notify("Your menu has been loaded.")
    } else {
      notify("No data found.")
    }
  }

  const saveSections = async () => {
    await api.putSections(data);
    notify("Your menu has been saved.")
  }

  const publish = async () => {
    notify("Your menu is being published...")
    const invalidationId = await api.publishMenu(title, sections);
    setTimeout(() => notifyOnPublish(invalidationId), 5000);
  }

  const notifyOnPublish = async (invalidationId) => {
    const status = await api.checkStatus(invalidationId)
    console.log(status)
    if (status === 'Completed') {
      const component = <>
        <b>Your menu has been published!</b><br />Check it out:&nbsp;
        <a href="https://test.emenu.today" target="_blank">www.test.emenu.today</a>
      </>
      notify(component, 10000)
    } else {
      setTimeout(() => notifyOnPublish(invalidationId), 5000);
    }
  }
  return (
    <section>
      <div className="sections container-fluid">
        <div className="row">
          <div className="mr-auto">
            {/* <MButton text="Load example" onClick={() => confirmOverwrite(() => setData({ title: DEFAULT_TITLE, sections: DEFAULT_SECTIONS }))} />
            <MButton text="Start from scratch" onClick={() => confirmOverwrite(() => setData({ title: "Click to add title...", sections: [] }))} /> */}
            <MButton text="Start over" onClick={() => confirmOverwrite(() => setData(null))} />
          </div>
          {ProtectedTooltipWrapper(
            <div className="ml-auto">
              <MButton text="Load" disabled={!loggedIn} onClick={() => confirmOverwrite(loadSections)} />
              <MButton text="Save" disabled={!loggedIn} onClick={saveSections} />
              <MButton text="Publish" disabled={!loggedIn} onClick={publish} />
            </div>, loggedIn)}
        </div>
        <div className="row">
          <input
            autoFocus
            className={styles.restaurant_title}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <Sections
          editable={true}
          leftSections={leftSections}
          rightSections={rightSections}
          highlightedId={highlightedId}
          functions={{
            swapSections,
            deleteSection,
            deleteItem,
            updateTitle,
            updateItemProps,
            adjustItems,
            swapElements,
            insertSectionAt,
            setSections,
            swapSectionLoc
          }}
        />
      </div>

    </section>
  );
}

