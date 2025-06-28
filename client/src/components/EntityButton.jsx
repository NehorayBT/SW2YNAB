import { useContext } from "react";
import { GlobalContext } from "../App";

export default function EntityButton({ type, entity }) {
  const { setStep, setSwType, setSwId } = useContext(GlobalContext);

  // displays the name, taken from friend/group object
  const name =
    type === "friend"
      ? entity.first_name + " " + entity.last_name
      : entity.name;

  // handling button click
  const onClick = () => {
    // update the splitwise-type (friend/group) and splitwise-id (of friend/group) state
    setSwType(type);
    setSwId(entity.id);
    // moving to next step
    setStep("splitwise_range");
  };

  // rendering
  return (
    <li>
      <button onClick={onClick}>{name}</button>
    </li>
  );
}
