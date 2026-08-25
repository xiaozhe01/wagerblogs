import ChipList from "@/components/ui/ChipList";

type LatestNewsCategoryProps = {
  items: { label: string; key: string; href: string; active: boolean }[];
};

export default function LatestNewsCategory({ items }: LatestNewsCategoryProps) {
  return (
    <nav aria-label="News categories" className="-mt-2">
      <ul role="list" className="flex gap-2 flex-wrap">
        <ChipList
          as="Link"
          inList
          items={items}
          activeClassName="btn-primary"
          inactiveClassName="btn-secondary"
        />
      </ul>
    </nav>
  );
}
