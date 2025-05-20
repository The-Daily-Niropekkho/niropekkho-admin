import { baseApi } from "@/redux/api/baseApi";
import type {
    MediaItem,
    UpdateMediaRequest,
    UploadMediaRequest,
} from "@/types/media";

// Simulated delays for API operations
const FETCH_DELAY = 800;
const UPLOAD_DELAY = 1500;
const UPDATE_DELAY = 500;
const DELETE_DELAY = 600;

// Sample initial data
const initialItems: MediaItem[] = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: `File ${i + 1}${
        i % 5 === 0
            ? ".mp4"
            : i % 7 === 0
            ? ".pdf"
            : i % 3 === 0
            ? ".zip"
            : ".jpg"
    }`,
    type:
        i % 5 === 0
            ? "video"
            : i % 7 === 0
            ? "document"
            : i % 3 === 0
            ? "archive"
            : "image",
    url: `/placeholder.png?height=200&width=300&query=media item ${i + 1}`,
    size: Math.floor(Math.random() * 5000) + 100, // Size in KB
    dimensions:
        i % 5 !== 0 && i % 7 !== 0 && i % 3 !== 0 ? "1920x1080" : undefined,
    uploadedBy: ["Admin User", "John Doe", "Jane Smith"][
        Math.floor(Math.random() * 3)
    ],
    uploadedAt: new Date(
        Date.now() - Math.floor(Math.random() * 10000000000)
    ).toLocaleDateString(),
    tags: [
        ["news", "featured", "article"][Math.floor(Math.random() * 3)],
        ["banner", "gallery", "profile"][Math.floor(Math.random() * 3)],
    ],
    favorite: Math.random() > 0.8,
    folder: ["Images", "Videos", "Documents", "Archives", "Uncategorized"][
        Math.floor(Math.random() * 5)
    ],
    s3Key: `media/file-${i + 1}${
        i % 5 === 0
            ? ".mp4"
            : i % 7 === 0
            ? ".pdf"
            : i % 3 === 0
            ? ".zip"
            : ".jpg"
    }`,
}));

// In-memory store for simulating a backend
let mediaItems = [...initialItems];
let nextId = mediaItems.length + 1;

// Create API slice using RTK Query
export const mediaApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all media items
        getMedia: builder.query<MediaItem[], void>({
            queryFn: async () => {
                // Simulate API delay
                await new Promise((resolve) =>
                    setTimeout(resolve, FETCH_DELAY)
                );
                return { data: mediaItems };
            },
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ id }) => ({
                              type: "Media" as const,
                              id,
                          })),
                          { type: "Media", id: "LIST" },
                      ]
                    : [{ type: "Media", id: "LIST" }],
        }),

        // Get a single media item by ID
        getMediaById: builder.query<MediaItem, number>({
            queryFn: async (id) => {
                await new Promise((resolve) =>
                    setTimeout(resolve, FETCH_DELAY / 2)
                );
                const item = mediaItems.find((item) => item.id === id);
                return item
                    ? { data: item }
                    : { error: { status: 404, data: "Media not found" } };
            },
            providesTags: (result, error, id) => [{ type: "Media", id }],
        }),

        // Upload media to S3
        uploadMedia: builder.mutation<MediaItem[], UploadMediaRequest>({
            queryFn: async ({ files, folder = "Uncategorized" }) => {
                // Simulate upload delay
                await new Promise((resolve) =>
                    setTimeout(resolve, UPLOAD_DELAY)
                );

                // Create new media items
                const newItems: MediaItem[] = Array.from(files).map((file) => {
                    const id = nextId++;
                    return {
                        id,
                        name: file.name,
                        type: file.type.split("/")[0],
                        url: URL.createObjectURL(file),
                        size: Math.floor(file.size / 1024), // Convert to KB
                        dimensions: file.type.startsWith("image/")
                            ? "1920x1080"
                            : undefined,
                        uploadedBy: "Current User",
                        uploadedAt: new Date().toLocaleDateString(),
                        tags: [],
                        favorite: false,
                        folder,
                        s3Key: `media/${folder.toLowerCase()}/${Date.now()}-${
                            file.name
                        }`,
                    };
                });

                // Add to our simulated database
                mediaItems = [...newItems, ...mediaItems];
                return { data: newItems };
            },
            invalidatesTags: [{ type: "Media", id: "LIST" }],
        }),

        // Update media item
        updateMedia: builder.mutation<MediaItem, UpdateMediaRequest>({
            queryFn: async ({ id, updates }) => {
                await new Promise((resolve) =>
                    setTimeout(resolve, UPDATE_DELAY)
                );

                const index = mediaItems.findIndex((item) => item.id === id);
                if (index === -1) {
                    return { error: { status: 404, data: "Media not found" } };
                }

                const updatedItem = { ...mediaItems[index], ...updates };
                mediaItems[index] = updatedItem;
                return { data: updatedItem };
            },
            invalidatesTags: (result, error, { id }) => [{ type: "Media", id }],
        }),

        // Toggle favorite status
        toggleFavorite: builder.mutation<MediaItem, number>({
            queryFn: async (id) => {
                await new Promise((resolve) =>
                    setTimeout(resolve, UPDATE_DELAY / 2)
                );

                const index = mediaItems.findIndex((item) => item.id === id);
                if (index === -1) {
                    return { error: { status: 404, data: "Media not found" } };
                }

                const updatedItem = {
                    ...mediaItems[index],
                    favorite: !mediaItems[index].favorite,
                };
                mediaItems[index] = updatedItem;
                return { data: updatedItem };
            },
            invalidatesTags: (result, error, id) => [{ type: "Media", id }],
        }),

        // Delete media items
        deleteMedia: builder.mutation<number | string, number | string>({
            queryFn: async (ids) => {
                await new Promise((resolve) =>
                    setTimeout(resolve, DELETE_DELAY)
                );

                mediaItems = mediaItems.filter((item) => item.id !== ids);
                return { data: ids };
            },
            invalidatesTags: (result) =>
                result
                    ? [{ type: "Media", id: result }]
                    : [{ type: "Media", id: "LIST" }],
        }),
    }),
});

// Export hooks for usage in components
export const {
    useGetMediaQuery,
    useGetMediaByIdQuery,
    useUploadMediaMutation,
    useUpdateMediaMutation,
    useToggleFavoriteMutation,
    useDeleteMediaMutation,
} = mediaApi;
