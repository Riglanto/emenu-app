import Head from 'next/head'
import { GetStaticProps } from 'next'
import { useState } from 'react'
import { v4 as uuid4 } from 'uuid';
import { FaRegArrowAltCircleDown, FaRegArrowAltCircleUp, FaRegPlusSquare } from 'react-icons/fa';
import TextareaAutosize from 'react-textarea-autosize';

import Layout, { siteTitle } from '../components/layout'
import { DEFAULT_MENU, DEFAULT_TITLE } from '../utils'

import styles from '../styles/builder.module.scss'

const createItem = () => ({
  id: uuid4(),
  title: "Name",
  desc: "Desc",
  price: 10
})

const createSection = () => ({
  id: uuid4(),
  title: "Name",
  items: []
})

const swapElements = (arr, from, to) => [...arr.slice(0, from), ...[arr[to], arr[from]], ...arr.slice(to + 1)];

const isVisible = (condition) => ({ display: condition ? 'block' : 'none' })
const isCollapsed = (text) => ({ height: text && text.length > 0 ? 'auto' : '5px' })

export default function Home({
  allPostsData
}: {
  allPostsData: {
    date: string
    title: string
    id: string
  }[]
}) {
  const [sections, setSections] = useState(DEFAULT_MENU);
  const [title, setTitle] = useState(DEFAULT_TITLE)
  const [editing, setEditing] = useState(false);
  const updateSection = (section, index) => setSections([
    ...sections.slice(0, index),
    section,
    ...sections.slice(index + 1)])
  const adjustItems = (index, items) => updateSection({ ...sections[index], items }, index);

  const updateItem = (items, index, props) => [...items.slice(0, index), { ...items[index], ...props }, ...items.slice(index + 1)]
  const updateTitle = (index, title) => updateSection({ ...sections[index], title }, index);
  const updateItemProps = (index, subindex, props) => updateSection({ ...sections[index], items: updateItem(sections[index].items, subindex, props) }, index);

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={""}>
        <div className="container-fluid">
          <div onClick={() => setEditing(!editing)} className={`row ${styles.row}`}>
            <input autoFocus className={styles.restaurant_title}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className={`row ${styles.row}`}>
            <div className="col-md-6">
              {sections.map((section, index) => (
                <div key={section.id} className={styles.section}>
                  <div className={`${styles.button_wrapper}`}>
                    {index > 0 && <FaRegArrowAltCircleUp className={styles.clickable} onClick={() => setSections(swapElements(sections, index - 1, index))} />}
                    {index < sections.length - 1 && <FaRegArrowAltCircleDown className={styles.clickable} onClick={() => setSections(swapElements(sections, index, index + 1))} />}
                  </div>
                  <input className={styles.section_title}
                    value={section.title}
                    onChange={(e) => updateTitle(index, e.target.value)}
                  />
                  {section.items.map((item, subindex) => (
                    <div key={item.id} className={`row ${styles.row}`}>
                      <div className="col">
                        <input className={styles.title}
                          style={isCollapsed(item.title)}
                          value={item.title}
                          onChange={(e) => updateItemProps(index, subindex, { title: e.target.value })}
                        />

                        <TextareaAutosize className={styles.desc}
                          value={item.desc}
                          onChange={(e) => updateItemProps(index, subindex, { desc: e.target.value })}
                        />
                      </div>
                      <div className={`row ${styles.button_wrapper}`}>
                        <FaRegArrowAltCircleUp style={isVisible(subindex > 0)} className={styles.clickable} onClick={() => adjustItems(index, swapElements(section.items, subindex - 1, subindex))} />
                        <FaRegArrowAltCircleDown style={isVisible(subindex < section.items.length - 1)} className={styles.clickable} onClick={() => adjustItems(index, swapElements(section.items, subindex, subindex + 1))} />
                      </div>
                      <div className="col-auto">
                        <input className={styles.price}
                          value={item.price}
                          onChange={(e) => updateItemProps(index, subindex, { price: e.target.value })}
                          type="number"
                          min="0" step="0.01"
                        />
                      </div>
                    </div>
                  ))}
                  <div className={`${styles.button_wrapper}`}>
                    <FaRegPlusSquare title="Create new item" className={styles.clickable}
                      onClick={() => adjustItems(index, [...sections[index].items, createItem()])} />
                  </div>
                </div>
              ))}
              <br />
              <div className={`${styles.button_wrapper}`}>
                <FaRegPlusSquare title="Create new section" className={styles.clickable}
                  onClick={() => setSections([...sections, createSection()])} />
              </div>
            </div>
          </div>
        </div>


      </section>
    </Layout >
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
    }
  }
}