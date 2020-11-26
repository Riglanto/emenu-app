import Head from "next/head";
import { GetStaticProps } from "next";
import { useState } from "react";
import { v4 as uuid4 } from "uuid";
import {
  FaRegArrowAltCircleDown,
  FaRegArrowAltCircleLeft,
  FaRegArrowAltCircleRight,
  FaRegArrowAltCircleUp,
  FaRegPlusSquare,
  FaTrash,
  FaTrashAlt,
} from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";

import Layout, { siteTitle } from "../components/layout";
import { DEFAULT_MENU, DEFAULT_TITLE } from "../utils";

import styles from "../styles/builder.module.scss";

const createItem = () => ({
  id: uuid4(),
  title: "Name",
  desc: "Desc",
  price: 10,
});

const createSection = (loc) => ({
  id: uuid4(),
  loc,
  title: "Name",
  items: [],
});

const swapElements = (arr, from, to) => [
  ...arr.slice(0, from),
  ...[arr[to], arr[from]],
  ...arr.slice(to + 1),
];

const isVisible = (condition) => ({ display: condition ? "block" : "none" });
const isCollapsed = (text) => {
  const isDefined = text && text.toString().length > 0;
  return {
    height: isDefined ? "auto" : "5px",
    backgroundColor: isDefined ? "" : "lightgray",
  };
};

export default function Home({
  allPostsData,
}: {
  allPostsData: {
    date: string;
    title: string;
    id: string;
  }[];
}) {
  const [sections, setSections] = useState(DEFAULT_MENU);
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [editing, setEditing] = useState(false);

  const leftSections = sections.filter((s) => s.loc == "left");
  const rightSections = sections.filter((s) => s.loc == "right");

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
  const swapSectionLoc = (index) => {
    const isRight = sections[index].loc === "right";
    const x = {
      ...sections.splice(index, 1)[0],
      loc: isRight ? "left" : "right",
    };
    const newPosition = isRight ? leftSections.length : sections.length;
    setSections(insertSectionAt(x, newPosition));
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

  const SwapIcon = (props) => {
    const isRight = props.loc === "right";
    const SwapIcon = isRight
      ? FaRegArrowAltCircleLeft
      : FaRegArrowAltCircleRight;
    return (
      <div
        className={styles.clickable}
        onClick={() => swapSectionLoc(props.index)}
      >
        <SwapIcon />
      </div>
    );
  };

  const SECTIONS = (props) => (
    <div className="col-md-6">
      {props.sections.map((section, index) => (
        <div key={section.id} className={styles.section}>
          <div className={`${styles.button_wrapper}`}>
            <div
              className={styles.clickable}
              onClick={() => deleteSection(index + props.modifier)}
            >
              <FaTrashAlt />
            </div>
            {index > 0 && (
              <div
                className={styles.clickable}
                onClick={() =>
                  setSections(
                    swapElements(
                      sections,
                      index - 1 + props.modifier,
                      index + props.modifier
                    )
                  )
                }
              >
                <FaRegArrowAltCircleUp />
              </div>
            )}
            {index < props.sections.length - 1 && (
              <div
                className={styles.clickable}
                onClick={() =>
                  setSections(
                    swapElements(
                      sections,
                      index + props.modifier,
                      index + 1 + props.modifier
                    )
                  )
                }
              >
                <FaRegArrowAltCircleDown />
              </div>
            )}
            <SwapIcon index={index + props.modifier} loc={section.loc} />
          </div>
          <input
            className={styles.section_title}
            value={section.title}
            onChange={(e) => updateTitle(index, e.target.value)}
          />
          {section.items.map((item, subindex) => (
            <div key={item.id} className={`row ${styles.row}`}>
              <div className="col">
                <input
                  className={styles.title}
                  style={isCollapsed(item.title)}
                  value={item.title}
                  onChange={(e) =>
                    updateItemProps(index, subindex, { title: e.target.value })
                  }
                />

                <TextareaAutosize
                  className={styles.desc}
                  value={item.desc}
                  onChange={(e) =>
                    updateItemProps(index, subindex, { desc: e.target.value })
                  }
                />
              </div>
              <div className={`${styles.button_wrapper}`}>
                <div
                  style={isVisible(subindex > 0)}
                  className={styles.clickable}
                  onClick={() =>
                    adjustItems(
                      index,
                      swapElements(section.items, subindex - 1, subindex)
                    )
                  }
                >
                  <FaRegArrowAltCircleUp />
                </div>
                <div
                  style={isVisible(subindex < section.items.length - 1)}
                  className={styles.clickable}
                  onClick={() =>
                    adjustItems(
                      index,
                      swapElements(section.items, subindex, subindex + 1)
                    )
                  }
                >
                  <FaRegArrowAltCircleDown />
                </div>
              </div>
              <div className="col-auto">
                <input
                  className={styles.price}
                  style={isCollapsed(item.price)}
                  value={item.price}
                  onChange={(e) =>
                    updateItemProps(index, subindex, { price: e.target.value })
                  }
                  type="number"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          ))}
          <div className={`${styles.button_wrapper}`}>
            <div
              title="Create new item"
              className={styles.clickable}
              onClick={() =>
                adjustItems(index, [
                  ...props.sections[index].items,
                  createItem(),
                ])
              }
            >
              <FaRegPlusSquare />
            </div>
          </div>
        </div>
      ))}
      <br />
      <div className={`${styles.button_wrapper}`}>
        <div
          title="Create new section"
          className={styles.clickable}
          onClick={() =>
            setSections(
              insertSectionAt(
                createSection(props.loc),
                props.sections.length + props.modifier
              )
            )
          }
        >
          <FaRegPlusSquare />
        </div>
      </div>
    </div>
  );

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={""}>
        <div className="container-fluid">
          <div
            onClick={() => setEditing(!editing)}
            className={`row ${styles.row}`}
          >
            <input
              autoFocus
              className={styles.restaurant_title}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className={`row ${styles.row}`}>
            <SECTIONS loc="left" modifier={0} sections={leftSections} />
            <SECTIONS
              loc="right"
              modifier={leftSections.length}
              sections={rightSections}
            />
          </div>
        </div>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};
