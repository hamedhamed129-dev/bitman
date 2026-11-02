import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const usersFile = path.join(process.cwd(), "users.json");

// اگر فایل وجود نداشت، بساز
if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, "[]");
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone, password } = body;

    if (!phone || !password) {
      return NextResponse.json(
        { error: "شماره موبایل و رمز عبور الزامی است" },
        { status: 400 }
      );
    }

    // خواندن کاربران فعلی
    const usersData = fs.readFileSync(usersFile, "utf-8");
    const users = JSON.parse(usersData);

    // چک کردن تکراری بودن شماره
    const existingUser = users.find((u) => u.phone === phone);
    if (existingUser) {
      return NextResponse.json(
        { error: "این شماره موبایل قبلاً ثبت‌نام کرده است" },
        { status: 400 }
      );
    }

    // هش کردن رمز عبور
    const hashedPassword = await bcrypt.hash(password, 10);

    // اضافه کردن کاربر جدید
    const newUser = {
      id: Date.now(),
      phone,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

    return NextResponse.json(
      { message: "ثبت‌نام با موفقیت انجام شد" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "خطایی رخ داد" },
      { status: 500 }
    );
  }
}