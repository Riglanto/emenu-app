import { useEffect, useState } from "react";
import { scroller } from "react-scroll";
import {
  Button,
  Card,
  Dropdown,
  Modal,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import TextareaAutosize from "react-textarea-autosize";
import * as ls from "local-storage";
import hash from "object-hash";
import { signin } from "next-auth/client";

import * as api from "~/api";
import { Sections } from "./sections";
import {
  DEFAULT_SECTIONS,
  DEFAULT_TITLE,
  httpsDomain,
  splitSectons,
  swapElements,
  wwwDomain,
} from "../utils";

import styles from "../styles/builder.module.scss";
import DomainForm from "./form";
import { useTranslation, Trans } from "~/i18n";

const scrollTo = (loc: string) =>
  scroller.scrollTo(loc, {
    duration: 1500,
    delay: 100,
    smooth: true,
  });

const SignInTooltip = () => {
  return (
    <Tooltip className={styles.clickable} onClick={() => signin} id="tooltip">
      <Trans i18nKey="builder.sign-in-to-cont">
        <strong>Sign in</strong> to continue.
      </Trans>
    </Tooltip>
  );
};
const ProtectedTooltipWrapper = (component, loggedIn) =>
  loggedIn ? (
    component
  ) : (
    <OverlayTrigger placement="left" overlay={<SignInTooltip />}>
      {component}
    </OverlayTrigger>
  );

type ConfirmModalProps = {
  show: boolean;
  onSuccess: () => boolean;
  onHide: () => void;
  title: string;
  body: any;
  skipFooter?: boolean;
};

const CONTINUE_TITLE = {
  title: "Continue?",
  body: "All local changes will be lost.",
};
const ConfirmModal = (props: ConfirmModalProps) => (
  <Modal
    show={props.show}
    onHide={props.onHide}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
  >
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter">
        {props.title}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>{props.body}</Modal.Body>
    {!props.skipFooter && (
      <Modal.Footer>
        <MButton
          className={styles.action_button_nm}
          onClick={() => {
            props.onSuccess();
            props.onHide();
          }}
          text="Ok"
        />
      </Modal.Footer>
    )}
  </Modal>
);

const MButton = (props) => (
  <Button
    size="sm"
    className={props.className || styles.action_button}
    onClick={props.onClick}
    disabled={props.disabled}
  >
    {props.text}
  </Button>
);

const MCard = (props) => (
  <Card style={{ width: "18rem" }}>
    <Card.Img variant="top" src={props.img} />
    <Card.Body style={{ display: "flex", flexDirection: "column" }}>
      <Card.Text>{props.text}</Card.Text>
      {props.action}
    </Card.Body>
  </Card>
);

export default function Builder(props) {
  const { notify, loggedIn } = props;
  useEffect(() => {
    const localData: any = ls.get("sections");
    if (
      localData &&
      hash({ title: localData?.title, sections: localData?.sections }) !==
        hash({ title: props.data?.title, sections: props.data?.sections })
    ) {
      setDataState(localData);
      notify("Local draft restored.");
    }
  }, []);

  const publish = async () => {
    notify("Your menu is being published...", 0);
    const invalidationId = await api.publishMenu(title, sections);
    setTimeout(() => notifyOnPublish(invalidationId), 5000);
  };

  const [data, setDataState] = useState({
    title: props.data?.title,
    sections: props.data?.sections,
    domain: props.data?.domain,
  });
  const [modalAction, setModalAction] = useState(null);
  const [domainUpdated, setDomainUpdated] = useState(false);
  const [highlightedId, setHighlightedId] = useState(null);

  useEffect(() => {
    if (domainUpdated) {
      publish();
      setDomainUpdated(false);
    }
  }, [domainUpdated]);

  const setData = (x) => {
    ls.set("sections", x);
    setDataState(x);
  };

  const setTitle = (x) => setData({ ...data, title: x });
  const setDomain = (x) => setData({ ...data, domain: x });
  const setSections = (x) => setData({ ...data, sections: x });

  const { t } = useTranslation();

  if (!data?.sections) {
    return (
      <div className={styles.starter}>
        <MCard
          text={
            <Trans i18nKey="builder.start-with-example">
              a<b>b</b>c
            </Trans>
          }
          img="images/example2.png"
          action={
            <MButton
              text={t("builder.load-example")}
              onClick={() =>
                setData({ title: DEFAULT_TITLE, sections: DEFAULT_SECTIONS })
              }
            />
          }
        />
        <MCard
          text={
            <Trans i18nKey="builder.start-with-empty">
              a<b>b</b>c
            </Trans>
          }
          img="images/example5.png"
          action={
            <MButton
              text={t("builder.start-from-scratch")}
              onClick={() =>
                setData({ title: t("click-to-add-title"), sections: [] })
              }
            />
          }
        />
      </div>
    );
  }

  const { title, sections, domain } = data;

  const { leftSections, rightSections } = splitSectons(sections);
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
    scrollTo(x.loc);
    setTimeout(() => {
      setHighlightedId(id);
      setTimeout(() => {
        setHighlightedId(null);
      }, 1600);
    }, 1200);
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

  const swapSections = (a, b) => setSections(swapElements(sections, a, b));

  const loadSections = async () => {
    const data = await api.fetchSections();
    if (data) {
      setData(data);
      notify("Your menu has been loaded.");
    } else {
      notify("No data found.");
    }
  };

  const saveSections = async () => {
    await api.putSections({ title: data.title, sections: data.sections });
    notify("Your menu has been saved.");
  };

  const notifyOnPublish = async (invalidationId) => {
    const status = await api.checkStatus(invalidationId);
    console.log(status);
    if (status === "Completed") {
      const component = (
        <>
          <b>Your menu has been published!</b>
          <br />
          Check it out:&nbsp;
          <a href={httpsDomain(domain)} target="_blank">
            {wwwDomain(domain)}
          </a>
        </>
      );
      notify(component, 10000);
    } else {
      setTimeout(() => notifyOnPublish(invalidationId), 5000);
    }
  };

  const onPublish = () => {
    if (!props.data?.domain) {
      const form = (
        <DomainForm
          title={title}
          domain={domain}
          notify={notify}
          onUpdate={setDomain}
          onSucess={() => {
            setModalAction(null);
            setDomainUpdated(true);
          }}
        />
      );
      setModalAction({
        title: "Domain reservation",
        body: form,
        onSuccess: () => publish(),
        skipFooter: true,
      });
    } else {
      publish();
    }
  };

  return (
    <section>
      <div className="sections container-fluid">
        <div className="row">
          <div className="mr-auto">
            <MButton
              text="Start over"
              onClick={() =>
                setModalAction({
                  ...CONTINUE_TITLE,
                  onSuccess: () => setData(null),
                })
              }
            />
          </div>
          {ProtectedTooltipWrapper(
            <div className="ml-auto d-none d-sm-block">
              <MButton
                text="Load"
                disabled={!loggedIn}
                onClick={() =>
                  setModalAction({
                    ...CONTINUE_TITLE,
                    onSuccess: () => loadSections(),
                  })
                }
              />
              <MButton
                text="Save"
                disabled={!loggedIn}
                onClick={saveSections}
              />
              <MButton
                text="Publish"
                disabled={!loggedIn}
                onClick={onPublish}
              />
            </div>,
            loggedIn
          )}
          <OverlayTrigger placement="top" overlay={<SignInTooltip />}>
            <Dropdown className="d-block d-sm-none">
              <Dropdown.Toggle
                className={styles.action_toggle}
                id="dropdown-basic"
              >
                Actions
              </Dropdown.Toggle>
              <Dropdown.Menu className={styles.action_menu}>
                <MButton
                  className={styles.action_button_nm}
                  text="Load"
                  disabled={!loggedIn}
                  onClick={() =>
                    setModalAction({
                      ...CONTINUE_TITLE,
                      onSuccess: () => loadSections(),
                    })
                  }
                />
                <MButton
                  className={styles.action_button_nm}
                  text="Save"
                  disabled={!loggedIn}
                  onClick={saveSections}
                />
                <MButton
                  className={styles.action_button_nm}
                  text="Publish"
                  disabled={!loggedIn}
                  onClick={onPublish}
                />
              </Dropdown.Menu>
            </Dropdown>
          </OverlayTrigger>
        </div>
        <div className="row">
          <TextareaAutosize
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
            swapSectionLoc,
          }}
        />
      </div>
      <ConfirmModal
        show={!!modalAction}
        onHide={() => setModalAction(null)}
        onSuccess={modalAction?.onSuccess}
        title={modalAction?.title}
        body={modalAction?.body}
        skipFooter={modalAction?.skipFooter}
      />
    </section>
  );
}
