import { useQuery } from "@tanstack/react-query";
import EntityButton from "./EntityButton";

const fetchFriends = async () => {
  const res = await fetch("http://localhost:5000/api/splitwise/friends");
  if (!res.ok) throw new Error("Not authorized");
  return res.json();
};

const fetchGroups = async () => {
  const res = await fetch("http://localhost:5000/api/splitwise/groups");
  if (!res.ok) throw new Error("Not authorized");
  return res.json();
};

export default function Splitwise() {
  const {
    data: friendsData,
    isLoading: loadingFriends,
    error: friendsError,
  } = useQuery({
    queryKey: ["friends"],
    queryFn: fetchFriends,
  });

  const {
    data: groupsData,
    isLoading: loadingGroups,
    error: groupsError,
  } = useQuery({
    queryKey: ["groups"],
    queryFn: fetchGroups,
  });

  if (loadingFriends || loadingGroups) return <p>Loading entities...</p>;
  if (friendsError) return <p>Error: {friendsError.message}</p>;
  if (groupsError) return <p>Error: {groupsError.message}</p>;

  return (
    <>
      <h1>Friends</h1>
      <ul>
        {friendsData.friends.map((friend) => (
          <EntityButton key={friend.id} type="friend" entity={friend} />
        ))}
      </ul>
      <h1>Groups</h1>
      <ul>
        {groupsData.groups.map((group) => (
          <EntityButton key={group.id} type="group" entity={group} />
        ))}
      </ul>
    </>
  );
}
