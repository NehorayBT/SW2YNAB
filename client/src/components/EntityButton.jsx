import { useContext } from "react";
import { GlobalContext } from "../App";

export default function EntityButton({ type, entity }) {
  const { setStep, setSwType, setSwId } = useContext(GlobalContext);

  const name =
    type === "friend"
      ? entity.first_name + " " + entity.last_name
      : entity.name;

  const onClick = () => {
    console.log("type: " + type + "\nid: " + entity.id);
    setSwType(type);
    setSwId(entity.id);
    setStep("splitwise_transactions");
  };

  return (
    <li>
      <button onClick={onClick}>{name}</button>
    </li>
  );
}
