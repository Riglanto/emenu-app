import ReactDOMServer from 'react-dom/server';
import {
    FaRegArrowAltCircleDown,
    FaRegArrowAltCircleLeft,
    FaRegArrowAltCircleRight,
    FaRegArrowAltCircleUp,
    FaRegPlusSquare,
    FaTrashAlt,
} from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import { Element } from "react-scroll";

import { createItem, createSection, isCollapsed, isVisible, splitSectons } from "../utils"
import styles from "../styles/builder.module.scss";

export const Content = (props) => <div className="test">
    {props.x}
    {false && <div>{props.x}</div>}
</div>

export const getSections = (sections) => {
    const { leftSections, rightSections } = splitSectons(sections)
    return ReactDOMServer.renderToStaticMarkup(
        <Sections
            leftSections={leftSections}
            rightSections={rightSections}
            editable={false}
            highlightedId={null}
            functions={[]}
        />)
}

type SectionProps = {
    rightSections: any,
    leftSections: any,
    highlightedId: boolean,
    functions: any,
    editable: boolean
}

const SwapIcon = (props) => {
    const isRight = props.loc === "right";
    const SwapIcon = isRight
        ? FaRegArrowAltCircleLeft
        : FaRegArrowAltCircleRight;
    return (
        <div
            className={styles.clickable}
            onClick={() => props.swapSectionLoc(props.index, props.id)}
        >
            <SwapIcon />
        </div>
    );
};

const isHighlighted = (cond) => ({
    // borderColor: highlightedId === id ? "palegreen" : "initial",
    boxShadow: cond ? "8px 8px palegreen" : "none",
});

export const Sections = ({ rightSections, leftSections, highlightedId, functions, editable }: SectionProps) => (
    <div className="sections">
        <div className="row">
            <Section
                info="Click to add section..."
                loc="left"
                modifier={0}
                sections={leftSections}
                highlightedId={highlightedId}
                editable={editable}
                {...functions}
            />
            <Section
                loc="right"
                modifier={leftSections.length}
                sections={rightSections}
                highlightedId={highlightedId}
                editable={editable}
                {...functions}
            />
        </div>
    </div>
)

const Section = (props) => (
    <div className="col-md-6">
        {props.sections.map((section, index) => (
            <div
                key={section.id}
                className="section"
                style={isHighlighted(props.highlightedId === section.id)}
            >
                {props.editable && <div className={styles.button_wrapper}>
                    {props.sections.length - 1 === index && <Element name={props.loc} />}
                    {index > 0 && (
                        <div
                            className={styles.clickable}
                            onClick={() => props.swapSections(
                                index - 1 + props.modifier,
                                index + props.modifier)
                            }
                        >
                            <FaRegArrowAltCircleUp />
                        </div>
                    )}
                    {index < props.sections.length - 1 && (
                        <div
                            className={styles.clickable}
                            onClick={() => props.swapSections(
                                index + props.modifier,
                                index + 1 + props.modifier)
                            }
                        >
                            <FaRegArrowAltCircleDown />
                        </div>
                    )}
                    <SwapIcon
                        id={section.id}
                        index={index + props.modifier}
                        loc={section.loc}
                        swapSectionLoc={props.swapSectionLoc}
                    />
                    <div
                        className={styles.clickable}
                        onClick={() => props.deleteSection(index + props.modifier)}
                    >
                        <FaTrashAlt />
                    </div>
                </div>}
                {props.editable ? <input
                    className={`section_title ${styles.editable}`}
                    value={section.title}
                    onChange={(e) => props.updateTitle(index + props.modifier, e.target.value)}
                /> : <div className="section_title">{section.title}</div>}
                {section.items.map((item, subindex) => (
                    <div key={item.id} className="row xrow">
                        <div className="col">
                            {props.editable ? <TextareaAutosize
                                className={`title ${styles.editable}`}
                                style={isCollapsed(item.title)}
                                value={item.title}
                                onChange={(e) =>
                                    props.updateItemProps(index + props.modifier, subindex, { title: e.target.value })
                                }
                            /> : <div className="title">{item.title}</div>}

                            {props.editable ? <TextareaAutosize
                                className={`desc ${styles.editable}`}
                                value={item.desc}
                                onChange={(e) =>
                                    props.updateItemProps(index + props.modifier, subindex, { desc: e.target.value })
                                }
                            /> : <div className="desc">{item.desc}</div>}
                        </div>
                        <div className="col-auto">
                            {props.editable ? <input
                                className={`price ${styles.editable}`}
                                style={isCollapsed(item.price)}
                                value={item.price}
                                onChange={(e) =>
                                    props.updateItemProps(index + props.modifier, subindex, { price: e.target.value })
                                }
                                type="number"
                                min="0"
                                step="0.01"
                            /> : <div className="price">{item.price}</div>}
                            {props.editable && <div className={styles.button_wrapper}>
                                <div
                                    style={isVisible(subindex > 0)}
                                    className={styles.clickable}
                                    onClick={() =>
                                        props.adjustItems(
                                            index + props.modifier,
                                            props.swapElements(section.items, subindex - 1, subindex)
                                        )
                                    }
                                >
                                    <FaRegArrowAltCircleUp />
                                </div>
                                <div
                                    style={isVisible(subindex < section.items.length - 1)}
                                    className={styles.clickable}
                                    onClick={() =>
                                        props.adjustItems(
                                            index + props.modifier,
                                            props.swapElements(section.items, subindex, subindex + 1)
                                        )
                                    }
                                >
                                    <FaRegArrowAltCircleDown />
                                </div>
                                <div
                                    className={styles.clickable}
                                    onClick={() => props.deleteItem(index + props.modifier, subindex)}
                                >
                                    <FaTrashAlt />
                                </div>
                            </div>}
                        </div>
                    </div>
                ))}
                {props.editable && <div className={styles.button_wrapper}>
                    <div
                        title="Create new item"
                        className={styles.clickable}
                        onClick={() =>
                            props.adjustItems(index + props.modifier, [
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
                </div>}
            </div>
        ))}
        <br />

        {props.editable && <div className={styles.button_wrapper}>
            <div
                title="Create new section"
                className={styles.clickable}
                onClick={() =>
                    props.setSections(
                        props.insertSectionAt(
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
        </div>}
    </div>
);