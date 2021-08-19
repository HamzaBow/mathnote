import Card from "./Card";
import { useTheme } from "../../ThemeContext";

const CardsList = ({ cards, dispatch }) => {
  // TODO: the container should have no visible style (except probably for margins, etc. ) to make the app style and layout SIMPLER
  //       White background (for white theme) all the way to the left & right edges of the viewport.
  const darkTheme = useTheme();
  const containerStyle = {
    backgroundColor: darkTheme ? "black" : "white",
    color: darkTheme ? "white" : "black",
  };

  return (
    <div className="container" style={containerStyle}>
      {cards.map((card, key) => (
        <Card key={key} card={card} dispatch={dispatch} />
      ))}
    </div>
  );
};

export default CardsList;
