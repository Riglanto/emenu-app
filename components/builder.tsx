import { useState } from "react";
import { animateScroll } from "react-scroll";

import { DEFAULT_SECTIONS, DEFAULT_TITLE, splitSectons, swapElements } from "../utils";

import * as api from "../pages/api"
import { Sections } from "./sections";
import styles from "../styles/builder.module.scss";
import { Button } from "react-bootstrap";



export default function Builder() {
  const [sections, setSections] = useState(DEFAULT_SECTIONS);
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [highlightedId, setHighlightedId] = useState(null);

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
    setSections(data);
  }

  const saveSections = async () => {
    await api.putSections(sections);
  }

  const publish = async () => {
    await api.publishMenu(title, sections);
  }

  const MButton = (props) => <Button size="sm"
    className={styles.action_button}
    onClick={props.onClick}
  >
    {props.text}
  </Button>

  return (
    <section>
      <div className="sections container-fluid">
        <div className="row">
          <div className="mr-auto">
            <MButton text="Load example" onClick={() => setSections(DEFAULT_SECTIONS)} />
            <MButton text="Start from scratch" onClick={() => setSections([])} />
          </div>
          <MButton text="Load" onClick={loadSections} />
          <MButton text="Save" onClick={saveSections} />
          <MButton text="Publish" onClick={publish} />
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

