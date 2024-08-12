import { ConnectDB } from "@/lib/config/db";
import { promises as fs } from 'fs';
const { NextResponse } = require("next/server");
import BlogModel from "@/lib/models/BlogModel";

const LoadDB = async () => {
  await ConnectDB();
};

export async function POST(request) {
  await LoadDB();

  try {
    const formData = await request.formData();
    const timestamp = Date.now();

    const image = formData.get('image');
    const imageByteData = await image.arrayBuffer();
    const buffer = Buffer.from(imageByteData);
    const path = `./public/${timestamp}_${image.name}`;

    await fs.mkdir('./public', { recursive: true });
    await fs.writeFile(path, buffer);

    const imgUrl = `/${timestamp}_${image.name}`;

    const blogData = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      author: formData.get('author'),
      image: imgUrl,
      authorImg: formData.get('authorImg')
    };

    await BlogModel.create(blogData);
    console.log("Blog Saved");
    console.log(blogData);


    return NextResponse.json({ success: true, msg: "Blog Added" });
  } catch (error) {
    console.error("Error uploading blog:", error);
    return NextResponse.json({ success: false, msg: "Failed to add blog", error: error.message });
  }
}

export async function GET(request) {
  await LoadDB();

  try {
    const blogs = await BlogModel.find({});
    return NextResponse.json({ success: true, blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ success: false, msg: "Failed to fetch blogs", error: error.message });
  }
}


export async function DELETE(request) {
  const id = await request.nextUrl.searchParams.get('id');
  const blog = await BlogModel.findById(id);
  fs.unlink(`./public${blog.image}`, () => { });
  await BlogModel.findByIdAndDelete(id);
  return NextResponse.json({ msg: "Blog Deleted" });
}
