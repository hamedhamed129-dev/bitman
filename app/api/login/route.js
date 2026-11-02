import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const usersFile = path.join(process.cwd(), "users.json");

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

    // خواندن کاربران
    if (!fs.existsSync(usersFile)) {
      return NextResponse.json(
        { error: "کاربری با این مشخصات یافت نشد" },
        { status: 401 }
      );
    }

    const usersData = fs.readFileSync(usersFile, "utf-8");
    const users = JSON.parse(usersData);

    // پیدا کردن کاربر
    const user = users.find((u) => u.phone === phone);

    if (!user) {
      return NextResponse.json(
        { error: "شماره موبایل یا رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    // چک کردن رمز عبور
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "شماره موبایل یا رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    // ورود موفق
    return NextResponse.json(
      { 
        message: "ورود با موفقیت انجام شد",
        user: {
          id: user.id,
          phone: user.phone
        }
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "خطایی رخ داد" },
      { status: 500 }
    );
  }
}