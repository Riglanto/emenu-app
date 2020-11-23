import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import styles from '../styles/builder.module.scss'
import { getSortedPostsData } from '../lib/posts'
import { GetStaticProps } from 'next'
import { useState } from 'react'
import { v4 as uuid4 } from 'uuid';
import { FaRegArrowAltCircleDown, FaRegArrowAltCircleUp, FaRegPlusSquare } from 'react-icons/fa';

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

const DEFAULT_SECTIONS = [{
  id: uuid4(),
  title: "Appetizers",
  items: [
    {
      id: uuid4(),
      title: "Chorizo fries",
      desc: "French fries with melted cheese and chorizo",
      price: 9
    },
    {
      id: uuid4(),
      title: "Chorizo fries 2",
      desc: "French fries with melted cheese and chorizo",
      price: 9
    }
  ]
}]

const swapElements = (arr, from, to) => {
  const tmp = arr[from];
  arr[from] = arr[to];
  arr[to] = tmp;
  return [...arr];
}

export default function Home({
  allPostsData
}: {
  allPostsData: {
    date: string
    title: string
    id: string
  }[]
}) {
  const [sections, setSections] = useState(DEFAULT_SECTIONS);
  const [title, setTitle] = useState("~ Three Amigos Restaurante ~")
  const [editing, setEditing] = useState(false);
  const adjustItems = (index, items) => setSections([
    ...sections.slice(0, index),
    { ...sections[index], items },
    ...sections.slice(index + 1)])
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
                  <div className={`row ${styles.button_wrapper}`}>
                    {index > 0 && <FaRegArrowAltCircleUp className={styles.clickable} onClick={() => setSections(swapElements(sections, index, index - 1))} />}
                    {index < sections.length - 1 && <FaRegArrowAltCircleDown className={styles.clickable} onClick={() => setSections(swapElements(sections, index, index + 1))} />}
                  </div>
                  <input className={styles.section_title}
                    value={section.title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  {section.items.map((item, i) => (
                    <div key={item.id} className={`row ${styles.row}`}>
                      <div className="col">
                        <input className={styles.title}
                          value={item.title}
                          onChange={(e) => setTitle(e.target.value)}
                        />

                        <input className={styles.desc}
                          value={item.desc}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>
                      <div className={`row ${styles.button_wrapper}`}>
                        {i > 0 && <FaRegArrowAltCircleUp className={styles.clickable} onClick={() => adjustItems(index, swapElements(section.items, i, i - 1))} />}
                        {i < section.items.length - 1 && <FaRegArrowAltCircleDown className={styles.clickable} onClick={() => adjustItems(index, swapElements(section.items, i, i - 1))} />}
                      </div>
                      <div className="col-auto">
                        <input className={styles.price}
                          value={item.price}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                  <div className={`row ${styles.button_wrapper}`}>
                    <FaRegPlusSquare title="Create new item" className={styles.clickable}
                      onClick={() => adjustItems(index, [...sections[index].items, createItem()])} />
                  </div>
                </div>
              ))}
              <div className={`row ${styles.button_wrapper}`}>
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
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}