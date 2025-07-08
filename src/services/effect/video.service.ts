import * as Effect from 'effect/Effect';
import * as Context from 'effect/Context';
import * as Layer from 'effect/Layer';
import axios from 'axios';
import type { Video } from '@/types';

// Define error types
export class VideoError {
  readonly _tag = 'VideoError';
  constructor(
    public message: string,
    public field?: string,
    public status?: number
  ) { }
}

export class NetworkError {
  readonly _tag = 'NetworkError';
  constructor(public message: string) { }
}

// Define the service interface
export interface VideoService {
  addVideo: (videoData: { title: string; url: string }) => Effect.Effect<Video, VideoError | NetworkError, never>;
  getVideosByUserId: () => Effect.Effect<Video[], VideoError | NetworkError, never>;
  deleteVideo: (id: string) => Effect.Effect<void, VideoError | NetworkError, never>;
  updateVideo: (id: string, videoData: { title: string; url: string }) => Effect.Effect<Video, VideoError | NetworkError, never>;
}

// Create a tag for the service
export const VideoService = Context.GenericTag<VideoService>('VideoService');

// Type guard for VideoError
const isVideoError = (error: unknown): error is VideoError => {
  return error instanceof VideoError || (error as VideoError)?._tag === 'VideoError';
};

// Type guard for NetworkError
const isNetworkError = (error: unknown): error is NetworkError => {
  return error instanceof NetworkError || (error as NetworkError)?._tag === 'NetworkError';
};

// Implementation of the service
export const VideoServiceImpl = VideoService.of({
  addVideo: (videoData: { title: string; url: string }) =>
    Effect.tryPromise<Video, VideoError | NetworkError>({
      try: async () => {
        console.log('Attempting to add video');
        const response = await axios.post('/api/video', videoData);
        console.log('Add video response:', response.data);
        return response.data;
      },
      catch: (error: unknown) => {
        if (isVideoError(error) || isNetworkError(error)) {
          return error;
        }

        if (axios.isAxiosError(error)) {
          const response = error.response;
          const data = response?.data as {
            message?: string;
            error?: string;
            field?: string;
          } | undefined;

          // Handle error message from response
          const errorMessage = data?.error || data?.message || error.message;

          if (data?.field) {
            return new VideoError(
              errorMessage,
              data.field,
              response?.status
            );
          }

          return new VideoError(
            errorMessage,
            undefined,
            response?.status
          );
        }

        if (error instanceof Error) {
          return new NetworkError(error.message);
        }

        return new NetworkError('An unknown error occurred');
      }
    }),

  getVideosByUserId: () =>
    Effect.tryPromise<Video[], VideoError | NetworkError>({
      try: async () => {
        console.log('Fetching videos by user ID');
        const response = await axios.get('/api/user/video');
        return response.data;
      },
      catch: (error: unknown) => {
        if (isVideoError(error) || isNetworkError(error)) {
          return error;
        }

        if (axios.isAxiosError(error)) {
          const response = error.response;
          const data = response?.data as {
            message?: string;
            error?: string;
          } | undefined;

          // Handle error message from response
          const errorMessage = data?.error || data?.message || error.message;
          return new VideoError(
            errorMessage,
            undefined,
            response?.status
          );
        }

        if (error instanceof Error) {
          return new NetworkError(error.message);
        }

        return new NetworkError('An unknown error occurred');
      }
    }),

  deleteVideo: (id: string) =>
    Effect.tryPromise<void, VideoError | NetworkError>({
      try: async () => {
        console.log('Deleting video with ID:', id);
        await axios.delete(`/api/video/${id}`);
      },
      catch: (error: unknown) => {
        if (isVideoError(error) || isNetworkError(error)) {
          return error;
        }

        if (axios.isAxiosError(error)) {
          const response = error.response;
          const data = response?.data as {
            message?: string;
            error?: string;
          } | undefined;

          // Handle error message from response
          const errorMessage = data?.error || data?.message || error.message;
          return new VideoError(
            errorMessage,
            undefined,
            response?.status
          );
        }

        if (error instanceof Error) {
          return new NetworkError(error.message);
        }

        return new NetworkError('An unknown error occurred');
      }
    }),

  updateVideo: (id: string, videoData: { title: string; url: string }) =>
    Effect.tryPromise<Video, VideoError | NetworkError>({
      try: async () => {
        console.log('Updating video with ID:', id);
        const response = await axios.patch(`/api/video/${id}`, videoData);
        return response.data;
      },
      catch: (error: unknown) => {
        if (isVideoError(error) || isNetworkError(error)) {
          return error;
        }

        if (axios.isAxiosError(error)) {
          const response = error.response;
          const data = response?.data as {
            message?: string;
            error?: string;
            field?: string;
          } | undefined;

          // Handle error message from response
          const errorMessage = data?.error || data?.message || error.message;

          if (data?.field) {
            return new VideoError(
              errorMessage,
              data.field,
              response?.status
            );
          }

          return new VideoError(
            errorMessage,
            undefined,
            response?.status
          );
        }

        if (error instanceof Error) {
          return new NetworkError(error.message);
        }

        return new NetworkError('An unknown error occurred');
      }
    })
});

// Create a layer for the service
export const VideoServiceLayer = Layer.succeed(VideoService, VideoServiceImpl);

// Define the result type for video effects
export interface VideoEffectResult<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    field?: string;
    status?: number;
  };
}

// Helper function to run effects with proper error handling
export const runVideoEffect = <T>(
  effect: Effect.Effect<T, VideoError | NetworkError | Error, VideoService | never>
): Promise<VideoEffectResult<T>> => {
  // Provide the service implementation and run the effect
  const program = Effect.provideService(VideoService, VideoServiceImpl)(effect);

  // Run the effect and handle the result
  return Effect.runPromise(
    Effect.match(program, {
      onSuccess: (data) => ({
        success: true as const,
        data
      }),
      onFailure: (error) => ({
        success: false as const,
        error: isVideoError(error)
          ? {
            message: error.message,
            field: error.field,
            status: error.status
          }
          : {
            message: error instanceof Error ? error.message : 'An unknown error occurred'
          }
      })
    })
  );
};
