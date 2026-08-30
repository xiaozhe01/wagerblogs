import { recentPosts } from "@/lib/mock-data";
import PostRow from "@/components/cards/PostRow";
import EditorialSection from "./EditorialSection";

export default function RecentPublishedSection({
  register,
}: {
  register: "editorial" | "comparison";
}) {
  return (
    <EditorialSection title="Recently published" register={register}>
      <ul role="list" className="flex flex-col gap-3">
        {recentPosts.map((p, i) => (
          <li key={i}>
            <PostRow post={p} />
          </li>
        ))}
      </ul>
    </EditorialSection>
  );
}
