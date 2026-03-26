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

  // Clean up all data
  await prisma.redemption.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.categoryLevel.deleteMany();
  await prisma.category.deleteMany();
  await prisma.child.deleteMany();

  // ═══════════════════════════════════════════════
  // CHỈ SEED DANH MỤC THƯỞNG/PHẠT
  // Trẻ em sẽ do phụ huynh tự thêm
  // ═══════════════════════════════════════════════

  // ─── THƯỞNG: 8 danh mục (đa dạng, dễ kiếm điểm) ───

  await prisma.category.create({
    data: {
      name: "Học tập",
      type: "REWARD",
      icon: "📚",
      levels: {
        create: [
          { label: "Hoàn thành bài", points: 5, sortOrder: 0 },
          { label: "Làm tốt", points: 10, sortOrder: 1 },
          { label: "Xuất sắc", points: 15, sortOrder: 2 },
        ],
      },
    },
  });

  await prisma.category.create({
    data: {
      name: "Việc nhà",
      type: "REWARD",
      icon: "🧹",
      levels: {
        create: [
          { label: "Giúp đỡ khi được nhờ", points: 3, sortOrder: 0 },
          { label: "Tự giác làm", points: 8, sortOrder: 1 },
          { label: "Làm xong gọn gàng", points: 12, sortOrder: 2 },
        ],
      },
    },
  });

  await prisma.category.create({
    data: {
      name: "Thể dục / Vận động",
      type: "REWARD",
      icon: "🏃",
      levels: {
        create: [
          { label: "Vận động 15 phút", points: 3, sortOrder: 0 },
          { label: "Vận động 30 phút", points: 5, sortOrder: 1 },
          { label: "Vận động 1 tiếng", points: 10, sortOrder: 2 },
        ],
      },
    },
  });

  await prisma.category.create({
    data: {
      name: "Đọc sách",
      type: "REWARD",
      icon: "📖",
      levels: {
        create: [
          { label: "Đọc 15 phút", points: 5, sortOrder: 0 },
          { label: "Đọc 30 phút", points: 8, sortOrder: 1 },
          { label: "Đọc xong 1 cuốn", points: 15, sortOrder: 2 },
        ],
      },
    },
  });

  await prisma.category.create({
    data: {
      name: "Hành vi tốt",
      type: "REWARD",
      icon: "🌟",
      levels: {
        create: [
          { label: "Lễ phép, chào hỏi", points: 3, sortOrder: 0 },
          { label: "Nhường nhịn em/bạn", points: 5, sortOrder: 1 },
          { label: "Giúp đỡ người khác", points: 8, sortOrder: 2 },
          { label: "Trung thực, nhận lỗi", points: 10, sortOrder: 3 },
        ],
      },
    },
  });

  await prisma.category.create({
    data: {
      name: "Sáng tạo",
      type: "REWARD",
      icon: "🎨",
      levels: {
        create: [
          { label: "Vẽ / Tô màu", points: 5, sortOrder: 0 },
          { label: "Làm đồ thủ công", points: 8, sortOrder: 1 },
          { label: "Hoàn thành tác phẩm", points: 12, sortOrder: 2 },
        ],
      },
    },
  });

  await prisma.category.create({
    data: {
      name: "Tự lập",
      type: "REWARD",
      icon: "💪",
      levels: {
        create: [
          { label: "Tự ăn / Tự mặc", points: 3, sortOrder: 0 },
          { label: "Tự chuẩn bị đồ", points: 5, sortOrder: 1 },
          { label: "Tự quản lý thời gian", points: 10, sortOrder: 2 },
        ],
      },
    },
  });

  await prisma.category.create({
    data: {
      name: "Ngủ đúng giờ",
      type: "REWARD",
      icon: "😴",
      levels: {
        create: [
          { label: "Lên giường đúng giờ", points: 5, sortOrder: 0 },
          { label: "Ngủ sớm không nhắc", points: 8, sortOrder: 1 },
        ],
      },
    },
  });

  // ─── PHẠT: 6 danh mục (nhẹ, mang tính nhắc nhở) ───

  await prisma.category.create({
    data: {
      name: "Đánh nhau / Bạo lực",
      type: "PENALTY",
      icon: "👊",
      levels: {
        create: [
          { label: "Cãi nhau", points: -2, sortOrder: 0 },
          { label: "Đánh nhẹ", points: -3, sortOrder: 1 },
          { label: "Đánh nặng", points: -5, sortOrder: 2 },
        ],
      },
    },
  });

  await prisma.category.create({
    data: {
      name: "Quá giờ dùng máy",
      type: "PENALTY",
      icon: "📱",
      levels: {
        create: [
          { label: "Quá 15 phút", points: -1, sortOrder: 0 },
          { label: "Quá 30 phút", points: -2, sortOrder: 1 },
          { label: "Quá 1 tiếng", points: -3, sortOrder: 2 },
        ],
      },
    },
  });

  await prisma.category.create({
    data: {
      name: "Không nghe lời",
      type: "PENALTY",
      icon: "🙉",
      levels: {
        create: [
          { label: "Nhắc lần 2 mới làm", points: -1, sortOrder: 0 },
          { label: "Nhắc 3 lần", points: -2, sortOrder: 1 },
          { label: "Không chịu làm", points: -3, sortOrder: 2 },
        ],
      },
    },
  });

  await prisma.category.create({
    data: {
      name: "Nói dối",
      type: "PENALTY",
      icon: "🤥",
      levels: {
        create: [
          { label: "Nói dối nhỏ", points: -2, sortOrder: 0 },
          { label: "Nói dối lặp lại", points: -4, sortOrder: 1 },
        ],
      },
    },
  });

  await prisma.category.create({
    data: {
      name: "Mè nheo / Ăn vạ",
      type: "PENALTY",
      icon: "😭",
      levels: {
        create: [
          { label: "Mè nheo", points: -1, sortOrder: 0 },
          { label: "Ăn vạ nơi công cộng", points: -3, sortOrder: 1 },
        ],
      },
    },
  });

  await prisma.category.create({
    data: {
      name: "Bị cô nhắc nhở",
      type: "PENALTY",
      icon: "👩‍🏫",
      levels: {
        create: [
          { label: "Nhắc nhở nhẹ", points: -5, sortOrder: 0 },
          { label: "Nhắc nhở nghiêm túc", points: -10, sortOrder: 1 },
          { label: "Mời phụ huynh", points: -15, sortOrder: 2 },
        ],
      },
    },
  });

  await prisma.category.create({
    data: {
      name: "Không làm đủ bài tập",
      type: "PENALTY",
      icon: "📝",
      levels: {
        create: [
          { label: "Thiếu 1 bài", points: -3, sortOrder: 0 },
          { label: "Thiếu nhiều bài", points: -5, sortOrder: 1 },
          { label: "Không làm bài", points: -10, sortOrder: 2 },
        ],
      },
    },
  });

  console.log("✅ Seed hoàn tất!");
  console.log("📋 8 danh mục thưởng + 7 danh mục phạt");
  console.log("👶 Trẻ em: tự thêm trong admin");
  console.log("");
  console.log("💡 Nguyên tắc cân bằng:");
  console.log("   - Thưởng: 3~15 điểm/lần (dễ kiếm)");
  console.log("   - Phạt: 1~5 điểm/lần (rất nhẹ, nhắc nhở)");
  console.log("   - Phạt nặng nhất (-5) = 1 lần học tập hoàn thành (+5)");
  console.log("   - Mục tiêu: ~50-80 điểm/tháng = bé ngoan");

  await prisma.$disconnect();
}

main().catch(console.error);
