import { useQuery } from "@tanstack/react-query";
import EntityButton from "./EntityButton";
import ErrorComponent from "./ErrorComponent";
import LoadingComponent from "./LoadingComponent";

// a function to fetch splitwise friends
const fetchFriends = async () => {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/splitwise/friends`
  );
  if (!res.ok) throw new Error("Failed to fetch entities");
  return res.json();
};

// a function to fetch splitwise groups
const fetchGroups = async () => {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/splitwise/groups`
  );
  if (!res.ok) throw new Error("Failed to fetch entities");
  return res.json();
};

export default function Splitwise() {
  // react-query request to fetch friends
  const {
    data: friendsData,
    isLoading: loadingFriends,
    error: friendsError,
  } = useQuery({
    queryKey: ["friends"],
    queryFn: fetchFriends,
  });

  // react-query request to fetch groups
  const {
    data: groupsData,
    isLoading: loadingGroups,
    error: groupsError,
  } = useQuery({
    queryKey: ["groups"],
    queryFn: fetchGroups,
  });

  // return Loading/Error components, depends on query's state
  if (loadingFriends || loadingGroups) return <LoadingComponent />;
  if (friendsError) return <ErrorComponent message={friendsError.message} />;
  if (groupsError) return <ErrorComponent message={groupError.message} />;

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
