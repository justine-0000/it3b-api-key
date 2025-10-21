// src/app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

// Define the file router for your app
export const ourFileRouter = {
  // Endpoint for artifact images
  artifactImage: f({ 
    image: { 
      maxFileSize: "4MB", 
      maxFileCount: 1 
    } 
  })
    // Middleware runs before upload
    .middleware(async () => {
      // Get the authenticated user
      const { userId } = await auth();
      
      // Throw error if not authenticated
      if (!userId) throw new Error("Unauthorized");
      
      // Return metadata to pass to onUploadComplete
      return { userId };
    })
    // Runs after upload completes
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
      
      // Return data that will be sent to client
      return { 
        uploadedBy: metadata.userId, 
        url: file.url 
      };
    }),
} satisfies FileRouter;

// Export type for use in other files
export type OurFileRouter = typeof ourFileRouter;