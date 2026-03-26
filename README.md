# Gia dinh Bo Gau

Dashboard quan ly thuong/phat cho con. He thong diem theo thang, tu dong reset moi thang moi.

## Tech Stack

- Next.js 16 (App Router, Turbopack)
- Prisma 7 + SQLite (better-sqlite3 adapter)
- shadcn/ui v4 (base-ui) + Tailwind v4
- Inter font (Vietnamese subset)
- JWT auth (jose)

## Tinh nang

- Trang public (/) - Bang diem cho con xem, gamified, podium, progress ring
- Admin dashboard - Thong ke diem theo thang, bieu do xu huong
- CRUD tre em, danh muc thuong/phat (modal), hoat dong
- He thong diem theo thang, tu dong reset
- Doi diem lay phan thuong
- Tong ket nam (bieu do + bang 12 thang)
- Soft delete toan bo du lieu

## Cai dat

```bash
# Clone
git clone git@github.com:tuandev-nv/family-safe.git
cd family-safe

# Install
yarn install --ignore-engines

# Cau hinh
cp .env .env.local
# Sua JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD trong .env

# Tao DB + seed du lieu mau
npx prisma db push
yarn db:seed

# Dev
yarn dev
```

## Deploy Production

```bash
# Build
yarn build

# Start voi PM2
pm2 start ecosystem.config.js

# Xem logs
pm2 logs family-safe

# Restart
pm2 restart family-safe
```

App chay tai `http://localhost:3002`

## Cap nhat

```bash
git pull
yarn install --ignore-engines
npx prisma db push        # neu schema thay doi
yarn build
pm2 restart family-safe
```

## Reset du lieu

```bash
yarn db:reset              # Xoa sach + seed lai danh muc
```

## Cau hinh .env

```
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-password"
JWT_SECRET="random-string-at-least-32-chars"
```

## Seed data

8 danh muc thuong (3-15 diem) + 7 danh muc phat (1-15 diem):

**Thuong:** Hoc tap, Viec nha, The duc, Doc sach, Hanh vi tot, Sang tao, Tu lap, Ngu dung gio

**Phat:** Danh nhau, Qua gio may, Khong nghe loi, Noi doi, Me nheo, Bi co nhac nho, Khong lam bai tap
