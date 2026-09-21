import PostRow from "@/components/cards/PostRow";
import EditorialSection from "./EditorialSection";
import EmptyState from "./EmptyState";
import type { PostTeaser } from "@/lib/types";

export default function RecentPublishedSection({
  register,
  posts,
}: {
  register: "editorial" | "comparison";
  posts: PostTeaser[];
}) {
  return (
    <EditorialSection title="Recently published" register={register}>
      {posts.length === 0 ? (
        <EmptyState
          title="Nothing published yet"
          body="Articles appear here once they are published in the admin panel."
        />
      ) : (
        <ul role="list" className="flex flex-col gap-3">
          {posts.map((post) => (
            <li key={post.href}>
              <PostRow post={post} />
            </li>
          ))}
        </ul>
      )}
    </EditorialSection>
  );
}
