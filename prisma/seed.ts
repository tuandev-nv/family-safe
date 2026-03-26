import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbUrl = `file:${path.join(process.cwd(), "dev.db")}`;
const adapter = new PrismaBetterSqlite3({ url: dbUrl });

async function loadPrisma() {
  const mod = await import("../src/generated/prisma/client.js");
  return new mod.PrismaClient({ adapter });
}

async function main() {
  const prisma = await loadPrisma();
  // Clean up
  await prisma.activity.deleteMany();
  await prisma.categoryLevel.deleteMany();
  await prisma.category.deleteMany();
  await prisma.child.deleteMany();

  // Create children
  const minh = await prisma.child.create({
    data: { name: "Minh", emoji: "👦", birthDate: new Date("2018-05-15") },
  });

  const linh = await prisma.child.create({
    data: { name: "Linh", emoji: "👧", birthDate: new Date("2020-09-22") },
  });

  // Create reward categories
  const homework = await prisma.category.create({
    data: {
      name: "Làm bài tập",
      type: "REWARD",
      icon: "📚",
      levels: {
        create: [
          { label: "Hoàn thành", points: 5, sortOrder: 0 },
          { label: "Tốt", points: 10, sortOrder: 1 },
          { label: "Xuất sắc", points: 15, sortOrder: 2 },
        ],
      },
    },
    include: { levels: true },
  });

  const chores = await prisma.category.create({
    data: {
      name: "Làm việc nhà",
      type: "REWARD",
      icon: "🧹",
      levels: {
        create: [
          { label: "Giúp đỡ", points: 5, sortOrder: 0 },
          { label: "Tự giác", points: 10, sortOrder: 1 },
        ],
      },
    },
    include: { levels: true },
  });

  const exercise = await prisma.category.create({
    data: {
      name: "Tập thể dục",
      type: "REWARD",
      icon: "🏃",
      levels: {
        create: [
          { label: "30 phút", points: 5, sortOrder: 0 },
          { label: "1 tiếng", points: 10, sortOrder: 1 },
        ],
      },
    },
    include: { levels: true },
  });

  // Create penalty categories
  const fighting = await prisma.category.create({
    data: {
      name: "Đánh nhau",
      type: "PENALTY",
      icon: "👊",
      levels: {
        create: [
          { label: "Nhẹ", points: -10, sortOrder: 0 },
          { label: "Nặng", points: -20, sortOrder: 1 },
        ],
      },
    },
    include: { levels: true },
  });

  const screenTime = await prisma.category.create({
    data: {
      name: "Quá giờ dùng máy",
      type: "PENALTY",
      icon: "📱",
      levels: {
        create: [
          { label: "15 phút", points: -5, sortOrder: 0 },
          { label: "30 phút", points: -10, sortOrder: 1 },
          { label: "1 tiếng+", points: -20, sortOrder: 2 },
        ],
      },
    },
    include: { levels: true },
  });

  // Create sample activities (25+ for pagination demo)
  const now = new Date();
  const activities = [
    { child: minh, cat: homework, levelIdx: 2, daysAgo: 0, note: "Toán lớp 3" },
    { child: minh, cat: homework, levelIdx: 1, daysAgo: 1 },
    { child: minh, cat: chores, levelIdx: 1, daysAgo: 1, note: "Rửa bát" },
    { child: minh, cat: fighting, levelIdx: 0, daysAgo: 2, note: "Với em gái" },
    { child: minh, cat: exercise, levelIdx: 0, daysAgo: 3 },
    { child: linh, cat: homework, levelIdx: 1, daysAgo: 0, note: "Tập viết" },
    { child: linh, cat: chores, levelIdx: 0, daysAgo: 1 },
    { child: linh, cat: screenTime, levelIdx: 1, daysAgo: 2, note: "Xem YouTube" },
    { child: linh, cat: exercise, levelIdx: 1, daysAgo: 0 },
    { child: minh, cat: screenTime, levelIdx: 0, daysAgo: 4 },
    // More activities for pagination
    { child: minh, cat: homework, levelIdx: 0, daysAgo: 4, note: "Tiếng Anh" },
    { child: linh, cat: homework, levelIdx: 2, daysAgo: 3, note: "Vẽ tranh đẹp" },
    { child: minh, cat: chores, levelIdx: 0, daysAgo: 5, note: "Quét nhà" },
    { child: linh, cat: exercise, levelIdx: 0, daysAgo: 5 },
    { child: minh, cat: exercise, levelIdx: 1, daysAgo: 6, note: "Đạp xe" },
    { child: linh, cat: fighting, levelIdx: 0, daysAgo: 6, note: "Tranh đồ chơi" },
    { child: minh, cat: homework, levelIdx: 1, daysAgo: 7, note: "Tập đọc" },
    { child: linh, cat: chores, levelIdx: 1, daysAgo: 7, note: "Dọn phòng" },
    { child: minh, cat: screenTime, levelIdx: 1, daysAgo: 8, note: "Chơi game" },
    { child: linh, cat: homework, levelIdx: 0, daysAgo: 8 },
    { child: minh, cat: chores, levelIdx: 1, daysAgo: 9, note: "Tưới cây" },
    { child: linh, cat: exercise, levelIdx: 1, daysAgo: 9, note: "Nhảy dây" },
    { child: minh, cat: homework, levelIdx: 2, daysAgo: 10, note: "Khoa học" },
    { child: linh, cat: screenTime, levelIdx: 0, daysAgo: 10, note: "Xem TV" },
    { child: minh, cat: exercise, levelIdx: 0, daysAgo: 11 },
    { child: linh, cat: homework, levelIdx: 1, daysAgo: 11, note: "Làm toán" },
    { child: minh, cat: fighting, levelIdx: 1, daysAgo: 12, note: "Đánh em" },
    { child: linh, cat: chores, levelIdx: 0, daysAgo: 12, note: "Rửa chén" },
  ];

  for (const a of activities) {
    const level = a.cat.levels[a.levelIdx];
    const date = new Date(now);
    date.setDate(date.getDate() - (a.daysAgo ?? 0));

    await prisma.activity.create({
      data: {
        childId: a.child.id,
        categoryId: a.cat.id,
        categoryLevelId: level.id,
        points: level.points,
        note: a.note ?? null,
        createdAt: date,
      },
    });
  }

  console.log("Seed completed!");
  await prisma.$disconnect();
}

main().catch(console.error);
