"use server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function createGame(prevState, formData) {
  try {
    const id = formData.get("gameId");
    const title = formData.get("title");
    const slug = formData.get("slug");
    const description = formData.get("description");
    const categoryId = formData.get("category");
    const published = formData.get("published") === "true";
    const thumbnailFile = formData.get("thumbnailFile");
    const gameFile = formData.get("gameFile");

    const gameData = {
      title,
      slug,
      description,
      categories: {
        connect: { id: parseInt(categoryId, 10) },
      },
      published,
    };

    // Check if thumbnailFile exists and upload it
    if (thumbnailFile && thumbnailFile instanceof File && thumbnailFile.name && thumbnailFile.size > 0) {
      const thumbnailPath = await uploadToSupabase(thumbnailFile, "thumbnails");
      gameData.image = thumbnailPath;
    }

    // Check if gameFile exists and upload it
    if (gameFile && gameFile instanceof File && gameFile.name && gameFile.size > 0) {
      const gamePath = await uploadToSupabase(gameFile, "games");
      gameData.game_url = gamePath;
    }

    if (id) {
      await prisma.game.update({
        where: { id: parseInt(id, 10) },
        data: gameData,
      });

      revalidatePath("/"); // Optionally, revalidate cache if needed
      redirect("/dashboard"); // Redirect to the dashboard
      return {
        status: "success",
        message: "Game has been updated.",
        color: "green",
      };
    } else {
      const existingGame = await prisma.game.findFirst({
        where: { slug: slug },
      });

      if (existingGame) {
        revalidatePath("/"); // Optionally, revalidate cache if needed
        return {
          status: "error",
          message: "Slug already exists. Please choose a different slug.",
          color: "red",
        };
      }

      await prisma.game.create({ data: gameData });

      revalidatePath("/"); // Optionally, revalidate cache if needed
      redirect("/dashboard"); // Redirect to the dashboard
      return {
        status: "success",
        message: "Game has been added.",
        color: "green",
      };
    }
  } catch (error) {
    revalidatePath("/"); // Optionally, revalidate cache if needed
    return {
      status: "error",
      message: error.message,
      color: "red",
    };
  }
}

async function uploadToSupabase(file, folder) {
  try {
    const { data, error } = await supabase.storage
      .from(folder)
      .upload(`${folder}/${file.name}`, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { publicURL } = supabase.storage.from(folder).getPublicUrl(data.path);
    return publicURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Failed to upload file.");
  }
}


