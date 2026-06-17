import { useEffect, useState } from "react";
import { supabase } from "../../Shared";

interface GroupData {
  id: string;
  title: string;
  created_at?: string;
}

// test page
const Main = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [groups, setGroups] = useState<GroupData[]>([]);

  useEffect(() => {
    const fetchAllGroup = async () => {
      const { data, error: supabaseError } = await supabase
        .from("groups")
        .select("*");

      if (supabaseError) {
        console.error("[Main] Error fetching groups:", supabaseError);
        return;
      }

      setGroups(data || []);
      setLoading(false);
    };

    fetchAllGroup();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <main className="flex flex-col w-full h-full">
      <h1>전체 그룹</h1>
      {groups.map((group) => (
        <div key={group.id}>{group.title}</div>
      ))}
    </main>
  );
};
export default Main;
