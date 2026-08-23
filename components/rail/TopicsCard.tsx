import { Button } from "../ui/button";

export default function TopicsCard() {
  return (
    <div className="card pb-0">
      <div className="font-bold text-sm text-text-primary mb-2.5">Help Me Choose</div>
      <div className="text-xs text-text-body leading-loose mb-2.5">What do you want to bet on?</div>
      <div className="flex flex-col gap-2 mb-3">
        {["Sports", "Casino games", "Esports"].map((o) => (
          <Button key={o} variant="outline" size="xs" className="justify-start">
            {o}
          </Button>
        ))}
      </div>
    </div>
  );
}
