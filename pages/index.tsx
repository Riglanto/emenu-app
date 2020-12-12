import Head from "next/head";
import { GetStaticProps } from "next";
import { useEffect, useState } from "react";
import { v4 as uuid4 } from "uuid";
import {
  useSession,
  signin,
  signout
} from 'next-auth/client'
import Axios from "axios";
import { animateScroll } from "react-scroll";

import Layout, { siteTitle } from "../components/layout";
import { DEFAULT_SECTIONS, DEFAULT_TITLE, splitSectons, swapElements } from "../utils";

import styles from "../styles/builder.module.scss";
import { Sections } from "./sections";

async function fetchSections() {
  const res = await Axios.get(`/api/hello`)
  return res.data.sections;
}

async function putSections(sections) {
  await fetch(`/api/hello`, {
    method: "POST", headers: {
      'Content-Type': 'application/json'
    }, body: JSON.stringify({ sections })
  })
}

export default function Home() {
  // useEffect(() => { get(); }, []);
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
    const data = await fetchSections();
    setSections(data);
  }

  const saveSections = async () => {
    await putSections(sections);
  }

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
      <section>
        <div className="sections container-fluid">
          <div className="row">
            <button
              className={styles.action_button}
              onClick={() => setSections(DEFAULT_SECTIONS)}
            >
              Load example
            </button>
            <button
              className={styles.action_button}
              onClick={() => setSections([])}
            >
              Start from scratch
            </button>
            <button
              className={styles.action_button}
              onClick={() => loadSections()}
            >
              Load
            </button>
            <button
              className={styles.action_button}
              onClick={() => saveSections()}
            >
              Save
            </button>
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
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};
