import { recentPosts } from "@/lib/mock-data";
import PostRow from "@/components/cards/PostRow";
import EditorialSection from "./EditorialSection";

export default function RecentPublishedSection() {
  return (
    <EditorialSection title="Recently published">
      <ul role="list" className="flex flex-col">
        {recentPosts.map((p, i) => (
          <li key={i}>
            <PostRow post={p} />
          </li>
        ))}
      </ul>
    </EditorialSection>
  );
}
