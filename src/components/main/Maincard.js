import { addStyles, StaticMathField } from "react-mathquill";
import { useState, useEffect, useRef } from "react";
import { HiLightBulb } from "react-icons/hi";
import Overlay from "../utilities/Overlay";
import { useParams } from "react-router-dom";

addStyles();

const Maincard = ({ cards }) => {
  const params = useParams();

  const chosenCard = cards.find(card => card.id === params.id)


  const [frontDisplayed, setFrontDisplayed] = useState(true);
  const divToRotate = useRef();

  useEffect(() => {
    if (frontDisplayed) {
      divToRotate.current.style.transform = "rotateY(0deg)";
    } else {
      divToRotate.current.style.transform = "rotateY(180deg)";
    }
  }, [frontDisplayed]);

  useEffect(() => {
    document.title = 'Main Card';
    return () => {
      document.title = 'Math Cards';
    }
  })

  // TODO: useEffect( ... , []) which is on mount, press <space> flips the card, addEventListener

  // const mainCardStyle = {
  //   visibility: mainCardActive ? "visible" : "hidden",
  //   opacity: mainCardActive ? "1" : "0",
  // };
  const cardIconStyle = {
    color: "yellow",
    width: "3rem",
    height: "3rem",
    position: "absolute",
    top: "-3.5rem",
  };

  return (
    <>
      <Overlay />
      <div
        id="opened-card"
        className="container-item"
        // style={mainCardStyle}
        onClick={() => {
          // setFrontIsShown((shown) => !shown);
          setFrontDisplayed((displayed) => !displayed);
        }}
      >
        <div ref={divToRotate} className="card">
          <div className="front">
            <h3>{chosenCard.front.question}</h3>
            <StaticMathField style={{ fontSize: "2rem" }}>
              {chosenCard.front.formula}
            </StaticMathField>
          </div>

          <div className="back">
            <HiLightBulb style={cardIconStyle} />
            <StaticMathField style={{ fontSize: "2rem" }}>
              {chosenCard.back.formula}
            </StaticMathField>
            <h3>{chosenCard.back.comment}</h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default Maincard;
