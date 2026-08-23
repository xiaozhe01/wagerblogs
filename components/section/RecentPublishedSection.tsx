import { recentPosts } from "@/lib/mock-data";
import PostRow from "@/components/cards/PostRow";
import EditorialSection from "./EditorialSection";

export default function RecentPublishedSection() {
  return (
    <EditorialSection title="Recently published">
      <div className="flex flex-col">
        {recentPosts.map((p, i) => (
          <PostRow key={i} post={p} />
        ))}
      </div>
    </EditorialSection>
  );
}
