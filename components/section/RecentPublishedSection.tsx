import { recentPosts } from "@/lib/mock-data";
import PostRow from "@/components/cards/PostRow";
import EditorialSection from "./EditorialSection";

export default function RecentPublishedSection() {
  return (
    <EditorialSection title="Recently published" className="flex flex-col gap-3">
      <div className="flex flex-col">
        {recentPosts.map((p, i) => (
          <PostRow
            key={i}
            post={p}
            wrapperClassName="flex gap-4 items-start justify-between py-4 border-b border-border-hairline no-underline"
            titleClassName="heading-serif text-xl leading-snug mb-1.5 text-pretty"
            thumbnailClassName="w-18 h-13.5 lg:w-24 lg:h-17 shrink-0 placeholder-asset rounded-sm text-2xs text-text-subtle font-mono flex items-center justify-center text-center"
          />
        ))}
      </div>
    </EditorialSection>
  );
}
