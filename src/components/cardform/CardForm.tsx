import React, {
  useState,
  useRef,
  useEffect,
  useReducer,
} from "react";
import FormFace from "./FormFace";
import FormOther from "./formother/FormOther";

import CardFormStepper from "./CardFormStepper";
import Backdrop from "@mui/material/Backdrop";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import Fade from "@mui/material/Fade";
import Popper from "@mui/material/Popper";
import { useCards } from "contexts/CardsContext";

export enum FieldType {
  Text = "TEXT",
  Math = "MATH",
}

export interface Field {
  id: number;
  type: FieldType;
  htmlContent?: string;
  latex?: string;
}

export interface FrontNBackFields {
  front: Field[];
  back: Field[];
}

export interface DifficultyLevelsInterface {
  veryEasy: boolean;
  easy: boolean;
  medium: boolean;
  hard: boolean;
  veryHard: boolean;
}

export interface CardInterface {
  _id: string;
  front: Field[];
  back: Field[];
  difficultyLevels: DifficultyLevelsInterface;
  tags: string[];
}
export type OperationType = "edit" | "create";

export enum CardFormActions {
  AddTextQuill,
  AddMathQuill,
  UpdateLatex,
  UpdateHtmlContent,
  DelQuill,
  SetFields,
  ResetFields,
}

interface Props {
  operationType: OperationType;
  cardId?: string;
  cardFormOpen: boolean;
  setCardFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CardForm: React.FC<Props> = ({
  operationType,
  cardId,
  cardFormOpen,
  setCardFormOpen,
}) => {

  const cards = useCards();

  // ******************************************* FIELDS *******************************************
  function newField(id: number, fieldType: FieldType) {
    if (fieldType === FieldType.Text) {
      return {
        id,
        type: fieldType,
        htmlContent: "",
      };
    }

    if (fieldType === FieldType.Math) {
      return {
        id,
        type: fieldType,
        latex: "",
      };
    }
  }
  interface Action {
    type: CardFormActions;
    payload?: any;
  }

  function frontNBackFieldsReducer(
    frontNBackFields: FrontNBackFields,
    action: Action
  ) {
    type Face = "front" | "back";

    let face: Face = "front";
    let otherFace: Face = "back";

    if (action?.payload?.face === "back") {
      face = "back";
      otherFace = "front";
    }

    switch (action.type) {
      case CardFormActions.AddTextQuill:
        return {
          [otherFace]: frontNBackFields[otherFace],
          [face]: [
            ...frontNBackFields[face],
            newField(action.payload.id, FieldType.Text),
          ],
        };

      case CardFormActions.AddMathQuill:
        return {
          [otherFace]: frontNBackFields[otherFace],
          [face]: [
            ...frontNBackFields[face],
            newField(action.payload.id, FieldType.Math),
          ],
        };

      case CardFormActions.UpdateLatex:
        return {
          [otherFace]: [...frontNBackFields[otherFace]],
          [face]: frontNBackFields[face].map((field) => {
            if (field.id === action.payload.id) {
              return { ...field, latex: action.payload.latex };
            }
            return field;
          }),
        };

      case CardFormActions.UpdateHtmlContent:
        return {
          [otherFace]: frontNBackFields[otherFace],
          [face]: frontNBackFields[face].map((field) => {
            if (field.id === action.payload.id) {
              return { ...field, htmlContent: action.payload.htmlContent };
            }
            return field;
          }),
        };
      case CardFormActions.DelQuill:
        return {
          [otherFace]: frontNBackFields[otherFace],
          [face]: frontNBackFields[face].filter((field) => field.id !== action.payload.id)
        }
      case CardFormActions.SetFields:
        return action.payload.frontNBackFields;

      case CardFormActions.ResetFields:
        return { front: [], back: [] };

      default:
        return frontNBackFields;
    }
  }

  const [frontNBackFields, frontNBackFieldsDispatch] = useReducer(
    frontNBackFieldsReducer,
    { front: [], back: [], other: [] }
  );

  // ****************************************** Difficulty Levels ****************************************
  const [difficultyLevels, setDifficultyLevels] = useState({
    veryEasy: false,
    easy: false,
    medium: false,
    hard: false,
    veryHard: false,
  });

  // ************************************************* Tags *********************************************
  const [tags, setTags] = useState<string[]>([]);

  // *************************************** END OF NEW CARD-RELATED STATES ****************************************

  useEffect(() => {
    if (cardFormOpen === false) return;
    if (operationType === "edit") {
      const card: CardInterface = cards?.find(
        (card: CardInterface) => card?._id === cardId
      ) as CardInterface;
      frontNBackFieldsDispatch({
        type: CardFormActions.SetFields,
        payload: { frontNBackFields: { front: card?.front, back: card?.back } },
      });
      setDifficultyLevels(card.difficultyLevels);
      setTags(card.tags);
    }
  }, [cardId, cardFormOpen]);

  //TODO: what if by mistake two properties are both true !!!, must figure out a better way to do this.
  const [formState, setFormState] = useState({
    front: true,
    back: false,
    other: false,
  });

  const front = useRef<HTMLDivElement>(null);
  const back = useRef<HTMLDivElement>(null);
  const other = useRef<HTMLDivElement>(null); // other is the last form where the user adds tags and difficulty levels to the new card.

  const [activeStep, setActiveStep] = React.useState(0);

  useEffect(() => {
    if (front !== null && front.current !== null) {
      front.current.style.transform = "translate(  -50%, -150vh )";
      front.current.style.animation = "transition: transform 0.2s ease-in-out";
    } else {
      console.error("front or front.current is null");
    }
  }, []);

  //TODO: FIXME: refactor the inside of this useEffect hook (probably requires refactoring the whole page)
  useEffect(() => {
    if (
      front !== null &&
      front.current !== null &&
      back !== null &&
      back.current !== null &&
      other !== null &&
      other.current !== null
    ) {
      if (formState.front === true) {
        front.current.style.transform = "translate(  -50%, -50% )";

        back.current.style.transform = "translate( 150vw, -50% )";

        other.current.style.transform = "translate( 150vw, -50% )";
      }

      if (formState.back === true) {
        front.current.style.transform = "translate(  -150vw, -50% )";

        back.current.style.transform = "translate(  -50%, -50% )";

        other.current.style.transform = "translate( 150vw, -50% )";
      }

      if (formState.other === true) {
        front.current.style.transform = "translate(  -150vw, -50% )";

        back.current.style.transform = "translate(  -150vw,  -50% )";

        other.current.style.transform = "translate(  -50%, -50% )";
      }
    } else {
      console.error(
        "`front`, `back` or `other` refs are null (or their current property is null)"
      );
    }
  }, [formState, cardFormOpen]);

  //TODO: use useReducer instead of useState (dispatch instead of two functions)
  function next() {
    if (formState.front === true) {
      setFormState({ front: false, back: true, other: false });
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    if (formState.back === true) {
      setFormState({ front: false, back: false, other: true });
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  }

  function prev() {
    if (formState.back === true) {
      setFormState({ front: true, back: false, other: false });
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
    if (formState.other === true) {
      setFormState({ front: false, back: true, other: false });
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  }

  function handleCloseCardForm() {
    setCardFormOpen(false);
    setTimeout(() => {
      setFormState({
        front: true,
        back: false,
        other: false,
      });
      setActiveStep(0);
      frontNBackFieldsDispatch({ type: CardFormActions.ResetFields });
      setDifficultyLevels({
        veryEasy: false,
        easy: false,
        medium: false,
        hard: false,
        veryHard: false,
      });
      setTags([]);
    }, 300);
  }

  return (
    <Popper
      open={cardFormOpen}
      role={undefined}
      transition
      disablePortal
      style={{ zIndex: 1 }}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps}>
          <Backdrop open={true}>
            <ClickAwayListener onClickAway={handleCloseCardForm}>
                <div>
                  {/* <CardFormHeader > {operationType === "create" ? "New Card" : "Edit Card"}</CardFormHeader> */}
                  <FormFace
                    ref={front}
                    face="front"
                    activeStep={activeStep}
                    next={next}
                    frontNBackFields={frontNBackFields}
                    fieldsDispatch={frontNBackFieldsDispatch}
                  />
                  <FormFace
                    ref={back}
                    face="back"
                    activeStep={activeStep}
                    next={next}
                    prev={prev}
                    frontNBackFields={frontNBackFields}
                    fieldsDispatch={frontNBackFieldsDispatch}
                  />
                  <FormOther
                    operationType={operationType}
                    ref={other}
                    prev={prev}
                    activeStep={activeStep}
                    setActiveStep={setActiveStep}
                    difficultyLevels={difficultyLevels}
                    setDifficultyLevels={setDifficultyLevels}
                    tags={tags}
                    setTags={setTags}
                    frontNBackFields={frontNBackFields}
                    cardId={cardId}
                    handleCloseCardForm={handleCloseCardForm}
                  />
                  <div
                    style={{
                      position: "absolute",
                      zIndex: 1,
                      bottom: "0",
                      left: "25%",
                      right: "0",
                      width: "50%",
                    }}
                  >
                    <CardFormStepper activeStep={activeStep} />
                  </div>
                </div>
            </ClickAwayListener>
          </Backdrop>
        </Fade>
      )}
    </Popper>
  );
};

export default CardForm;
