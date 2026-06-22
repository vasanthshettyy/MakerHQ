export const creators = [
  { id: "c1", name: "Ananya Rao", niche: "Beauty", city: "Mumbai", followers: 84200, engagement: 6.4, verified: true,  rate: 18000 },
  { id: "c2", name: "Rohit Mehta", niche: "Tech", city: "Bengaluru", followers: 152000, engagement: 4.1, verified: true,  rate: 32000 },
  { id: "c3", name: "Sana Iqbal", niche: "Fashion", city: "Delhi", followers: 46300, engagement: 8.2, verified: false, rate: 9500 },
  { id: "c4", name: "Vikram Singh", niche: "Fitness", city: "Pune", followers: 61800, engagement: 5.9, verified: true,  rate: 14000 },
];

export const niches = ["All", "Beauty", "Tech", "Fashion", "Fitness"];

export const campaign = {
  id: "camp-01",
  brand: "Lumora Skincare",
  title: "Festive Glow — Reels Campaign",
  budgetRange: [8000, 25000],
  briefLine: "3 reels showcasing the new vitamin-C serum, festive aesthetic, 30–45s each.",
};

export const milestoneSteps = [
  { key: "script", label: "Script", description: "Outline + hook approved" },
  { key: "draft",  label: "Draft",  description: "First cut shared for review" },
  { key: "final",  label: "Final",  description: "Delivered, ready to post" },
];

export const contractStages = [
  { key: "sent",      label: "Offer sent" },
  { key: "accepted",  label: "Accepted by creator" },
  { key: "escrow",    label: "Payment in escrow" },
  { key: "delivered", label: "Content delivered" },
  { key: "released",  label: "Payment released" },
];
