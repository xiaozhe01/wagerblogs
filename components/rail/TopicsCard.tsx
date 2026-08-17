import { Button } from "../ui/button";

export default function TopicsCard() {
  return (
    <div className="card">
      <div className="font-bold text-sm text-text-primary mb-1">Help Me Choose</div>
      <div className="text-sm text-text-body mb-2.5">What do you want to bet on?</div>
      <div className="flex flex-col gap-2 mb-3">
        {["Sports", "Casino games", "Esports"].map((o) => (
          <Button key={o} variant="outline" className="justify-start">
            {o}
          </Button>
        ))}
      </div>
    </div>
  );
}
