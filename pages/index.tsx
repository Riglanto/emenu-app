import Head from "next/head";
import { GetStaticProps } from "next";
import { useEffect, useState } from "react";
import { v4 as uuid4 } from "uuid";
import {
  FaRegArrowAltCircleDown,
  FaRegArrowAltCircleLeft,
  FaRegArrowAltCircleRight,
  FaRegArrowAltCircleUp,
  FaRegPlusSquare,
  FaTrashAlt,
} from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import {
  useSession,
  signin,
  signout
} from 'next-auth/client'

import Layout, { siteTitle } from "../components/layout";
import { DEFAULT_MENU, DEFAULT_TITLE } from "../utils";

import { animateScroll } from "react-scroll";
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
  title: "Section",
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

async function hello() {
  const x = await fetch(`/api/hello`)
  console.log(x.text())
}

export default function Home({
  allPostsData,
}: {
  allPostsData: {
    date: string;
    title: string;
    id: string;
  }[];
}) {
  useEffect(() => { hello(); }, []);
  const [sections, setSections] = useState(DEFAULT_MENU);
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [editing, setEditing] = useState(false);
  const [highlightedId, setHighlightedId] = useState(null);

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

  const SwapIcon = (props) => {
    const isRight = props.loc === "right";
    const SwapIcon = isRight
      ? FaRegArrowAltCircleLeft
      : FaRegArrowAltCircleRight;
    return (
      <div
        className={styles.clickable}
        onClick={() => swapSectionLoc(props.index, props.id)}
      >
        <SwapIcon />
      </div>
    );
  };

  const isHighlighted = (id) => ({
    // borderColor: highlightedId === id ? "palegreen" : "initial",
    boxShadow: highlightedId === id ? "8px 8px palegreen" : "none",
  });

  const SECTIONS = (props) => (
    <div className="col-md-6">
      {props.sections.map((section, index) => (
        <div
          key={section.id}
          className={styles.section}
          style={isHighlighted(section.id)}
        >
          <div className={`${styles.button_wrapper}`}>
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
            <SwapIcon
              id={section.id}
              index={index + props.modifier}
              loc={section.loc}
            />
            <div
              className={styles.clickable}
              onClick={() => deleteSection(index + props.modifier)}
            >
              <FaTrashAlt />
            </div>
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
                <div
                  className={styles.clickable}
                  onClick={() => deleteItem(index + props.modifier, subindex)}
                >
                  <FaTrashAlt />
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
                adjustItems(index + props.modifier, [
                  ...props.sections[index].items,
                  createItem(),
                ])
              }
            >
              {!props.sections[index].items.length && (
                <span className={styles.tooltip_info}>Click to add item</span>
              )}
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
          {props.info && !props.sections.length && (
            <span className={styles.tooltip_info}>{props.info}</span>
          )}
          <FaRegPlusSquare />
        </div>
      </div>
    </div>
  );

  const [session, loading] = useSession()

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      {!session && <>
        Not signed in <br />
        <button onClick={signin}>Sign in</button>
      </>}
      {session && <>
        Signed in as {session.user.email} <br />
        <button onClick={signout}>Sign out</button>
      </>}
      <section className={""} id="ContainerElementID">
        <div className="container-fluid">
          <div className={`row ${styles.row}`}>
            <button
              className={styles.action_button}
              onClick={() => setSections(DEFAULT_MENU)}
            >
              Load example
            </button>
            <button
              className={styles.action_button}
              onClick={() => setSections([])}
            >
              Start from scratch
            </button>
          </div>
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
            <SECTIONS
              info="Click to add section..."
              loc="left"
              modifier={0}
              sections={leftSections}
            />
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
