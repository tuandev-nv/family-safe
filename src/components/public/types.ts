export interface RecentActivity {
  points: number;
  createdAt: string;
  categoryName: string;
  categoryIcon: string;
  categoryType: string;
  levelLabel: string;
}

export interface ChildPublic {
  id: string;
  name: string;
  emoji: string;
  avatarUrl?: string | null;
  monthlyPoints: number;
  allTimePoints: number;
  totalPoints: number;
  recentActivities: RecentActivity[];
}
