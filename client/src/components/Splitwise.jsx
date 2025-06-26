import { useQuery } from "@tanstack/react-query";
import EntityButton from "./EntityButton";

const fetchFriends = async () => {
  const res = await fetch("http://localhost:5000/api/splitwise/friends");
  if (!res.ok) throw new Error("Failed to fetch entities");
  return res.json();
};

const fetchGroups = async () => {
  const res = await fetch("http://localhost:5000/api/splitwise/groups");
  if (!res.ok) throw new Error("Failed to fetch entities");
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

  if (loadingFriends || loadingGroups)
    return (
      <div className="main-col-container">
        <h1>Loading entities</h1>
      </div>
    );
  if (friendsError)
    return (
      <div className="main-col-container">
        <h1>Error</h1>
        <h2>{friendsError.message}</h2>
      </div>
    );
  if (groupsError)
    return (
      <div className="main-col-container">
        <h1>Error</h1>
        <h2>{groupsError.message}</h2>
      </div>
    );

  return (
    <div className="main-col-container">
      <h1>Choose entity</h1>
      <div className="row-container">
        <div className="col-container entity-container">
          <h2 className="entity-type-header">Friends</h2>
          <ul>
            {friendsData.friends.map((friend) => (
              <EntityButton key={friend.id} type="friend" entity={friend} />
            ))}
          </ul>
        </div>
        <div className="col-container entity-container">
          <h2 className="entity-type-header">Groups</h2>
          <ul>
            {groupsData.groups.map((group) => (
              <EntityButton key={group.id} type="group" entity={group} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
