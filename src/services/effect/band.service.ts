import * as Effect from 'effect/Effect';
import * as Context from 'effect/Context';
import * as Layer from 'effect/Layer';
import axios from 'axios';
import { useBandsStore } from '@/stores/bandsStore';
import type { Band } from '@/types';

// Define error types
export class BandError {
  readonly _tag = 'BandError';
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
export interface BandService {
  addBand: (bandData: any) => Effect.Effect<Band, BandError | NetworkError, never>;
  updateBand: (id: string, bandData: any) => Effect.Effect<Band, BandError | NetworkError, never>;
  deleteBand: (id: string) => Effect.Effect<void, BandError | NetworkError, never>;
  getBandById: (id: string) => Effect.Effect<Band, BandError | NetworkError, never>;
  fetchBandsByUserId: () => Effect.Effect<Band[], BandError | NetworkError, never>;
  getAllBands: () => Effect.Effect<Band[], BandError | NetworkError, never>;
}

// Create a tag for the service
export const BandService = Context.GenericTag<BandService>('BandService');

// Type guard for BandError
const isBandError = (error: unknown): error is BandError => {
  return error instanceof BandError || (error as BandError)?._tag === 'BandError';
};

// Type guard for NetworkError
const isNetworkError = (error: unknown): error is NetworkError => {
  return error instanceof NetworkError || (error as NetworkError)?._tag === 'NetworkError';
};

// Implementation of the service
export const BandServiceImpl = BandService.of({
  addBand: (bandData: any) =>
    Effect.tryPromise<Band, BandError | NetworkError>({
      try: async () => {
        console.log('Attempting to add band');
        const response = await axios.post('/api/bands', bandData);
        console.log('Add band response:', response.data);
        return response.data;
      },
      catch: (error: unknown) => {
        if (isBandError(error) || isNetworkError(error)) {
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
            return new BandError(
              errorMessage,
              data.field,
              response?.status
            );
          }

          return new BandError(
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

  updateBand: (id: string, bandData: any) =>
    Effect.tryPromise<Band, BandError | NetworkError>({
      try: async () => {
        console.log('Attempting to update band with ID:', id);
        const response = await axios.patch(`/api/bands/${id}`, bandData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log('Update band response:', response.data);
        return response.data;
      },
      catch: (error: unknown) => {
        if (isBandError(error) || isNetworkError(error)) {
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
            return new BandError(
              errorMessage,
              data.field,
              response?.status
            );
          }

          return new BandError(
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

  deleteBand: (id: string) =>
    Effect.tryPromise<void, BandError | NetworkError>({
      try: async () => {
        console.log('Attempting to delete band with ID:', id);
        await axios.delete(`/api/bands/${id}`);
        // Update the store after deletion
        const bandsStore = useBandsStore();
        await bandsStore.fetchBandsByUserId();
      },
      catch: (error: unknown) => {
        if (isBandError(error) || isNetworkError(error)) {
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
          return new BandError(
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

  getBandById: (id: string) =>
    Effect.tryPromise<Band, BandError | NetworkError>({
      try: async () => {
        console.log('Fetching band with ID:', id);
        const response = await axios.get(`/api/bands/${id}`);
        return response.data;
      },
      catch: (error: unknown) => {
        if (isBandError(error) || isNetworkError(error)) {
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
          return new BandError(
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

  fetchBandsByUserId: () =>
    Effect.tryPromise<Band[], BandError | NetworkError>({
      try: async () => {
        console.log('Fetching bands by user ID');
        const response = await axios.get('/api/user/bands');
        return response.data;
      },
      catch: (error: unknown) => {
        if (isBandError(error) || isNetworkError(error)) {
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
          return new BandError(
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

  getAllBands: () =>
    Effect.tryPromise<Band[], BandError | NetworkError>({
      try: async () => {
        console.log('Fetching all bands');
        const response = await axios.get('/api/bands');
        return response.data;
      },
      catch: (error: unknown) => {
        if (isBandError(error) || isNetworkError(error)) {
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
          return new BandError(
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
export const BandServiceLayer = Layer.succeed(BandService, BandServiceImpl);

// Define the result type for band effects
export interface BandEffectResult<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    field?: string;
    status?: number;
  };
}

// Helper function to run effects with proper error handling
export const runBandEffect = <T>(
  effect: Effect.Effect<T, BandError | NetworkError | Error, BandService | never>
): Promise<BandEffectResult<T>> => {
  // Provide the service implementation and run the effect
  const program = Effect.provideService(BandService, BandServiceImpl)(effect);

  // Run the effect and handle the result
  return Effect.runPromise(
    Effect.match(program, {
      onSuccess: (data) => ({
        success: true as const,
        data
      }),
      onFailure: (error) => ({
        success: false as const,
        error: isBandError(error)
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
