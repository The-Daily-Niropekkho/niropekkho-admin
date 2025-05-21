import { baseApi } from "@/redux/api/baseApi";
import type {
    TFileDocument,
    UpdateMediaRequest,
    UploadMediaRequest,
} from "@/types";

// Simulated delays for API operations
const FETCH_DELAY = 800;
const UPLOAD_DELAY = 1500;
const UPDATE_DELAY = 500;
const DELETE_DELAY = 600;

// Helper function to determine mimetype
const getMimeType = (filename: string) => {
    const ext = filename.split(".").pop();
    switch (ext) {
        case "mp4":
            return "video/mp4";
        case "pdf":
            return "application/pdf";
        case "zip":
            return "application/zip";
        case "jpg":
            return "image/jpeg";
        default:
            return "application/octet-stream";
    }
};

const mockPlatform = "web"; // Replace with actual enum/type if needed

// Initial mock media data
const initialItems: TFileDocument[] = Array.from({ length: 30 }, (_, i) => {
    const filename = `File ${i + 1}${
        i % 5 === 0
            ? ".mp4"
            : i % 7 === 0
            ? ".pdf"
            : i % 3 === 0
            ? ".zip"
            : ".jpg"
    }`;
    const createdAt = new Date(
        Date.now() - Math.floor(Math.random() * 10000000000)
    ).toISOString();

    return {
        id: String(i + 1),
        filename,
        mimetype: getMimeType(filename),
        server_url: undefined,
        originalUrl: undefined,
        pre_url: undefined,
        modifyFileName: undefined,
        path: undefined,
        url: `/placeholder.png?height=200&width=300&query=media item ${i + 1}`,
        durl: undefined,
        fileUniqueId: undefined,
        platform: mockPlatform,
        fileType:
            i % 5 === 0
                ? "video"
                : i % 7 === 0
                ? "document"
                : i % 3 === 0
                ? "archive"
                : "image",
        cdn: undefined,
        size: Math.floor(Math.random() * 5000) + 100,
        createdAt,
        updatedAt: createdAt,
    };
});

// In-memory store
let mediaItems = [...initialItems];
let nextId = mediaItems.length + 1;

// RTK Query API
export const mediaApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all media items
        getMedia: builder.query<TFileDocument[], void>({
            queryFn: async () => {
                await new Promise((res) => setTimeout(res, FETCH_DELAY));
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
        getMediaById: builder.query<TFileDocument, number>({
            queryFn: async (id) => {
                await new Promise((res) =>
                    setTimeout(res, FETCH_DELAY / 2)
                );
                const item = mediaItems.find((m) => m.id === String(id));
                return item
                    ? { data: item }
                    : { error: { status: 404, data: "Media not found" } };
            },
            providesTags: (result, error, id) => [{ type: "Media", id }],
        }),

        // Upload media
        uploadMedia: builder.mutation<TFileDocument[], UploadMediaRequest>({
            queryFn: async ({ files }) => {
                await new Promise((res) => setTimeout(res, UPLOAD_DELAY));
                const now = new Date().toISOString();

                const newItems: TFileDocument[] = Array.from(files).map(
                    (file) => {
                        const id = String(nextId++);
                        return {
                            id,
                            filename: file.name,
                            mimetype: file.type,
                            server_url: undefined,
                            originalUrl: undefined,
                            pre_url: undefined,
                            modifyFileName: undefined,
                            path: undefined,
                            url: URL.createObjectURL(file),
                            durl: undefined,
                            fileUniqueId: undefined,
                            platform: mockPlatform,
                            fileType: file.type.split("/")[0],
                            cdn: undefined,
                            size: Math.floor(file.size / 1024), // in KB
                            createdAt: now,
                            updatedAt: now,
                        };
                    }
                );

                mediaItems = [...newItems, ...mediaItems];
                return { data: newItems };
            },
            invalidatesTags: [{ type: "Media", id: "LIST" }],
        }),

        // Update media
        updateMedia: builder.mutation<TFileDocument, UpdateMediaRequest>({
            queryFn: async ({ id, updates }) => {
                await new Promise((res) => setTimeout(res, UPDATE_DELAY));
                const index = mediaItems.findIndex((m) => m.id === String(id));
                if (index === -1) {
                    return { error: { status: 404, data: "Media not found" } };
                }

                const updated = {
                    ...mediaItems[index],
                    ...updates,
                    updatedAt: new Date().toISOString(),
                };
                mediaItems[index] = updated;
                return { data: updated };
            },
            invalidatesTags: (result, error, { id }) => [{ type: "Media", id }],
        }),

        // Delete media
        deleteMedia: builder.mutation<number | string, number | string>({
            queryFn: async (id) => {
                await new Promise((res) => setTimeout(res, DELETE_DELAY));
                mediaItems = mediaItems.filter((item) => item.id !== String(id));
                return { data: id };
            },
            invalidatesTags: (result) =>
                result
                    ? [{ type: "Media", id: result }]
                    : [{ type: "Media", id: "LIST" }],
        }),
    }),
});

// Export hooks
export const {
    useGetMediaQuery,
    useGetMediaByIdQuery,
    useUploadMediaMutation,
    useUpdateMediaMutation,
    useDeleteMediaMutation,
} = mediaApi;
