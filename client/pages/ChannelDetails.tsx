import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";

interface ChannelData {
  id: string;
  name: string;
  verified: boolean;
  subscribers: number;
  averageViews: number;
  language: string;
  pricePerPost: number;
  description: string;
}

// Mock data
const channelData: Record<string, ChannelData> = {
  "1": {
    id: "1",
    name: "CryptoNews Daily",
    verified: true,
    subscribers: 125000,
    averageViews: 45000,
    language: "English",
    pricePerPost: 2.5,
    description:
      "Daily cryptocurrency news and market updates. Trusted by 125K+ followers.",
  },
  "2": {
    id: "2",
    name: "Tech Updates",
    verified: true,
    subscribers: 89000,
    averageViews: 32000,
    language: "English",
    pricePerPost: 1.8,
    description: "Latest technology and innovation news.",
  },
  "3": {
    id: "3",
    name: "Web3 Insights",
    verified: false,
    subscribers: 54000,
    averageViews: 18000,
    language: "English",
    pricePerPost: 1.2,
    description: "Deep dives into Web3 and blockchain technology.",
  },
};

export default function ChannelDetails() {
  const { id } = useParams<{ id: string }>();
  const channel = id ? channelData[id] : null;

  if (!channel) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-6">
        <p className="text-muted-foreground">Channel not found</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header with back button */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-glass border-b border-border/50 z-10">
        <div className="flex items-center gap-3 px-4 py-4">
          <Link to="/">
            <ArrowLeft size={24} className="text-foreground" />
          </Link>
          <div>
            <h1 className="font-semibold text-foreground">{channel.name}</h1>
            <p className="text-xs text-muted-foreground">Channel details</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 py-6 space-y-4">
        {/* Channel Header */}
        <div className="glass p-6 text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
            <div className="text-4xl">📢</div>
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <h2 className="text-2xl font-bold text-foreground">
              {channel.name}
            </h2>
            {channel.verified && (
              <div className="inline-flex items-center justify-center bg-primary/20 rounded-full p-1">
                <Check size={16} className="text-primary" />
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{channel.description}</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass p-4 text-center rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Subscribers</p>
            <p className="text-lg font-bold text-primary">
              {(channel.subscribers / 1000).toFixed(0)}K
            </p>
          </div>
          <div className="glass p-4 text-center rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Avg. Views</p>
            <p className="text-lg font-bold text-primary">
              {(channel.averageViews / 1000).toFixed(0)}K
            </p>
          </div>
          <div className="glass p-4 text-center rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Language</p>
            <p className="text-sm font-bold text-foreground">
              {channel.language}
            </p>
          </div>
        </div>

        {/* Offer Card */}
        <div className="glass p-6 rounded-lg border-2 border-primary/30">
          <p className="text-xs text-muted-foreground mb-2">Price per post</p>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-4xl font-bold text-primary">
              {channel.pricePerPost}
            </span>
            <span className="text-lg text-muted-foreground">TON</span>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            One-time payment for a single sponsored post
          </p>
          <div className="flex items-center gap-2 text-sm text-primary mb-4">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
              <Check size={14} className="text-primary" />
            </div>
            <span>Immediate posting available</span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/create-deal?channel=${channel.id}`}
          className="button-primary mt-2 text-center py-4 text-base font-semibold"
        >
          Request Placement
        </Link>

        {/* Additional Info */}
        <div className="glass p-4 rounded-lg mb-12">
          <h3 className="font-semibold text-foreground mb-3">About</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {channel.description}
          </p>
        </div>
      </div>
    </div>
  );
}
